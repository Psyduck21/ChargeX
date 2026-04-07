
-- Function to confirm bookings (manager approval)
CREATE OR REPLACE FUNCTION confirm_booking(booking_uuid uuid, manager_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    b RECORD;
BEGIN
    -- Lock the booking row for update
    SELECT * INTO b FROM public.bookings
    WHERE id = booking_uuid
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'booking_not_found';
    END IF;

    -- Verify booking is pending
    IF b.status IS NULL OR b.status <> 'pending' THEN
        RAISE EXCEPTION 'booking_not_pending';
    END IF;

    -- Verify manager manages the station
    PERFORM 1 FROM public.stations
    WHERE id = b.station_id
    AND station_manager = manager_uuid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'manager_not_authorized';
    END IF;

    -- Update the booking status
    UPDATE public.bookings
    SET status = 'confirmed',
        updated_at = now()
    WHERE id = booking_uuid;

    RETURN jsonb_build_object('success', true, 'booking_id', booking_uuid);
END;
$$;

-- Function to activate started bookings and create charging sessions
CREATE OR REPLACE FUNCTION activate_started_bookings()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_count INTEGER := 0;
    booking_record RECORD;
BEGIN
    -- First, collect all bookings that need to be activated
    FOR booking_record IN
        SELECT id, slot_id, vehicle_id, station_id, user_id, start_time, end_time, current_battery_level
        FROM public.bookings
        WHERE status = 'confirmed'
        AND start_time <= now()
    LOOP
        -- Update booking status to active
        UPDATE public.bookings
        SET status = 'active',
            updated_at = now()
        WHERE id = booking_record.id;

        -- Mark slot as occupied if slot_id exists
        IF booking_record.slot_id IS NOT NULL THEN
            UPDATE public.charging_slots
            SET status = 'occupied',
                updated_at = now()
            WHERE id = booking_record.slot_id;
        END IF;

        -- Create charging session for this booking
        INSERT INTO public.charging_sessions (
            booking_id, vehicle_id, station_id, user_id, slot_id,
            start_time, end_time, initial_battery_level, final_battery_level,
            energy_used, cost, status, created_at, updated_at
        ) VALUES (
            booking_record.id,
            booking_record.vehicle_id,
            booking_record.station_id,
            booking_record.user_id,
            booking_record.slot_id,
            booking_record.start_time,
            booking_record.end_time,
            COALESCE(booking_record.current_battery_level, 0),
            NULL,
            0,
            0,
            'active',
            now(),
            now()
        );

        updated_count := updated_count + 1;
    END LOOP;

    RETURN jsonb_build_object('updated_count', updated_count);
END;
$$;

-- Function to complete expired bookings and update charging sessions
CREATE OR REPLACE FUNCTION complete_expired_bookings()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_count INTEGER := 0;
    booking_record RECORD;
    session_record RECORD;
    calculated_energy_used FLOAT := 0;
    cost_calculated FLOAT := 0;
BEGIN
    -- First, collect all bookings that need to be completed
    FOR booking_record IN
        SELECT id, slot_id, station_id, end_time, start_time
        FROM public.bookings
        WHERE status = 'active'
        AND end_time <= now()
    LOOP
        -- Update booking status to completed
        UPDATE public.bookings
        SET status = 'completed',
            updated_at = now()
        WHERE id = booking_record.id;

        -- Free up slot if slot_id exists
        IF booking_record.slot_id IS NOT NULL THEN
            UPDATE public.charging_slots
            SET status = 'available',
                updated_at = now()
            WHERE id = booking_record.slot_id;
        END IF;

        -- Calculate energy used and cost for the charging session
        -- Simple calculation: assume 50 kW charging rate for demo
        calculated_energy_used := EXTRACT(EPOCH FROM (booking_record.end_time - booking_record.start_time)) / 3600 * 50; -- kWh

        -- Get station pricing
        SELECT COALESCE(price_per_hour, 10) INTO cost_calculated
        FROM public.stations
        WHERE id = booking_record.station_id;

        -- Calculate cost based on time
        cost_calculated := cost_calculated * EXTRACT(EPOCH FROM (booking_record.end_time - booking_record.start_time)) / 3600;

        -- Update charging session with final data
        UPDATE public.charging_sessions
        SET
            final_battery_level = 100, -- Assume full charge for demo
            energy_used = calculated_energy_used,
            cost = cost_calculated,
            status = 'completed',
            updated_at = now()
        WHERE booking_id = booking_record.id;

        updated_count := updated_count + 1;
    END LOOP;

    RETURN jsonb_build_object('updated_count', updated_count);
END;
$$;
END;
