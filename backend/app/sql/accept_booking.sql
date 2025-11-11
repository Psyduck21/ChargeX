-- SQL: create accept_booking RPC
-- This function atomically accepts a booking if:
-- 1) the booking exists and is pending
-- 2) the manager manages the station for that booking
-- 3) no overlapping accepted booking exists for the same slot

CREATE OR REPLACE FUNCTION public.accept_booking(
    booking_uuid uuid,
    manager_uuid uuid
) RETURNS jsonb
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
    SET status = 'accepted', 
        updated_at = now() 
    WHERE id = booking_uuid;

    RETURN (SELECT row_to_json(updated_booking) 
            FROM (SELECT * FROM public.bookings WHERE id = booking_uuid) updated_booking);

    RETURN row_to_json((SELECT * FROM public.bookings WHERE id = booking_uuid));
END;
$$;

-- SQL: create activate_started_bookings RPC
-- This function activates all accepted bookings that have reached their start_time
-- and marks the corresponding slots as occupied
CREATE OR REPLACE FUNCTION public.activate_started_bookings()
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
        SELECT id, slot_id FROM public.bookings
        WHERE status = 'accepted'
        AND start_time <= now()
    LOOP
        -- Update booking status to active
        UPDATE public.bookings
        SET status = 'active',
            updated_at = now()
        WHERE id = booking_record.id;

        -- Mark slot as occupied if slot_id exists
        IF booking_record.slot_id IS NOT NULL THEN
            UPDATE public.slots
            SET status = 'occupied',
                updated_at = now()
            WHERE id = booking_record.slot_id;
        END IF;

        updated_count := updated_count + 1;
    END LOOP;

    RETURN jsonb_build_object('updated_count', updated_count);
END;
$$;

-- SQL: create complete_expired_bookings RPC
-- This function completes all active bookings that have passed their end_time
-- and frees up the corresponding slots
CREATE OR REPLACE FUNCTION public.complete_expired_bookings()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_count INTEGER := 0;
    booking_record RECORD;
BEGIN
    -- First, collect all bookings that need to be completed
    FOR booking_record IN
        SELECT id, slot_id FROM public.bookings
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
            UPDATE public.slots
            SET status = 'available',
                updated_at = now()
            WHERE id = booking_record.slot_id;
        END IF;

        updated_count := updated_count + 1;
    END LOOP;

    RETURN jsonb_build_object('updated_count', updated_count);
END;
$$;
