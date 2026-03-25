-- ============================================================
-- PUBLIC SCHEMA EXTRACT
-- Tables, Functions, Data, Constraints, Indexes, RLS Policies
-- ============================================================

SET search_path TO public;
SET default_tablespace = '';
SET default_table_access_method = heap;


-- ============================================================
-- SECTION 1: FUNCTION
-- ============================================================

CREATE FUNCTION public.create_user_profile() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
    meta json;
begin
    meta := new.raw_user_meta_data;

    insert into public.profiles(
        id,
        email,
        name,
        phone,
        address,
        city,
        created_at,
        updated_at
    )
    values (
        new.id,
        new.email,
        coalesce(meta->>'name',''),
        coalesce(meta->>'phone',''),
        coalesce(meta->>'address',''),
        coalesce(meta->>'city',''),
        now(),
        now()
    )
    on conflict (id) do update
    set
        email = excluded.email,
        name = excluded.name,
        phone = excluded.phone,
        address = excluded.address,
        city = excluded.city,
        updated_at = now();

    return new;
end;
$$;

ALTER FUNCTION public.create_user_profile() OWNER TO postgres;


-- ============================================================
-- SECTION 2: TABLE SCHEMAS
-- ============================================================

-- admins
CREATE TABLE public.admins (
    id uuid,
    assigned_at timestamp with time zone DEFAULT now(),
    email text NOT NULL,
    name text NOT NULL,
    phone text,
    address text,
    city text,
    state text,
    country text DEFAULT 'India'::text,
    zip_code text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.admins OWNER TO postgres;

-- bookings
CREATE TABLE public.bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    vehicle_id uuid,
    station_id uuid,
    user_id uuid,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    slot uuid NOT NULL,
    CONSTRAINT bookings_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text, 'completed'::text])))
);

ALTER TABLE public.bookings OWNER TO postgres;

-- charging_sessions
CREATE TABLE public.charging_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    vehicle_id uuid,
    station_id uuid,
    user_id uuid,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    energy_consumed numeric(10,2),
    cost numeric(10,2),
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    slot uuid NOT NULL,
    CONSTRAINT charging_sessions_status_check CHECK ((status = ANY (ARRAY['active'::text, 'completed'::text, 'cancelled'::text])))
);

ALTER TABLE public.charging_sessions OWNER TO postgres;

-- charging_slots
CREATE TABLE public.charging_slots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    station_id uuid,
    slot_number integer NOT NULL,
    charger_type text DEFAULT 'slow'::text NOT NULL,
    status text DEFAULT 'available'::text NOT NULL,
    current_vehicle uuid,
    last_used timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT charging_slots_status_check CHECK ((status = ANY (ARRAY['available'::text, 'occupied'::text, 'under_maintenance'::text])))
);

ALTER TABLE public.charging_slots OWNER TO postgres;

-- feedback
CREATE TABLE public.feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    station_id uuid,
    vehicle_id uuid,
    rating integer,
    comments text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT feedback_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);

ALTER TABLE public.feedback OWNER TO postgres;

-- profiles
CREATE TABLE public.profiles (
    id uuid NOT NULL,
    name text,
    email text NOT NULL,
    phone text,
    address text,
    city text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles OWNER TO postgres;

-- station_managers
CREATE TABLE public.station_managers (
    id uuid NOT NULL,
    station_id uuid,
    assigned_at timestamp with time zone DEFAULT now(),
    email text NOT NULL,
    name text NOT NULL,
    phone text,
    address text,
    city text,
    state text,
    country text DEFAULT 'India'::text,
    zip_code text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.station_managers OWNER TO postgres;

-- station_vehicles
CREATE TABLE public.station_vehicles (
    id bigint NOT NULL,
    station_id uuid,
    vehicle_id uuid,
    parked_at timestamp with time zone DEFAULT now(),
    departed_at timestamp with time zone,
    status text DEFAULT 'parked'::text,
    CONSTRAINT station_vehicles_status_check CHECK ((status = ANY (ARRAY['parked'::text, 'departed'::text, 'reserved'::text, 'in_use'::text, 'charging'::text])))
);

ALTER TABLE public.station_vehicles OWNER TO postgres;

CREATE SEQUENCE public.station_vehicles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.station_vehicles_id_seq OWNER TO postgres;
ALTER SEQUENCE public.station_vehicles_id_seq OWNED BY public.station_vehicles.id;
ALTER TABLE ONLY public.station_vehicles ALTER COLUMN id SET DEFAULT nextval('public.station_vehicles_id_seq'::regclass);

-- stations
CREATE TABLE public.stations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL,
    address text,
    city text,
    state text,
    country text DEFAULT 'India'::text,
    zip_code text,
    capacity integer DEFAULT 10 NOT NULL,
    available_slots integer DEFAULT 10,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT stations_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'under_maintenance'::text])))
);

ALTER TABLE public.stations OWNER TO postgres;

-- vehicles
CREATE TABLE public.vehicles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid,
    plate_number text NOT NULL,
    vehicle_type text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    color text,
    battery_capacity_kwh numeric(6,2),
    range_km integer,
    charging_connector text,
    registered_at timestamp with time zone DEFAULT now(),
    last_service_date date,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT vehicles_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'under_maintenance'::text]))),
    CONSTRAINT vehicles_vehicle_type_check CHECK ((vehicle_type = ANY (ARRAY['2_wheeler'::text, '4_wheeler'::text, 'bus'::text, 'truck'::text])))
);

ALTER TABLE public.vehicles OWNER TO postgres;


-- ============================================================
-- SECTION 3: TABLE DATA
-- ============================================================

-- admins
COPY public.admins (id, assigned_at, email, name, phone, address, city, state, country, zip_code, created_at, updated_at) FROM stdin;
f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-06 22:00:51.26738+00	akshat.prj@gmail.com	Akshat Kumar	\N	\N	\N	\N	India	\N	2025-10-06 22:00:51.26738+00	2025-10-06 22:00:51.26738+00
\.

-- bookings (empty)
COPY public.bookings (id, vehicle_id, station_id, user_id, start_time, end_time, status, created_at, updated_at, slot) FROM stdin;
\.

-- charging_sessions (empty)
COPY public.charging_sessions (id, vehicle_id, station_id, user_id, start_time, end_time, energy_consumed, cost, status, created_at, updated_at, slot) FROM stdin;
\.

-- charging_slots (empty)
COPY public.charging_slots (id, station_id, slot_number, charger_type, status, current_vehicle, last_used, created_at, updated_at) FROM stdin;
\.

-- feedback (empty)
COPY public.feedback (id, user_id, station_id, vehicle_id, rating, comments, created_at) FROM stdin;
\.

-- profiles
COPY public.profiles (id, name, email, phone, address, city, created_at, updated_at) FROM stdin;
f1fd2ccd-d83d-4196-81f2-76399c4e4869	Akshat	akshatprj21@gmail.com	9546546545	asdasdasd	sadsdasd	2025-10-14 17:27:08.37965+00	2025-10-14 17:27:08.37965+00
c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af	Test User	test@example.com	+1234567890	123 Test St	Test City	2025-10-14 17:58:09.144336+00	2025-10-14 17:58:09.144336+00
1bb3cf75-366a-4758-8aa7-46712e003a81	Admin User	admin@smartevev.com			2025-10-15 00:36:12.550441+00	2025-10-15 00:36:12.550441+00
1a9fa9d4-2357-4c3d-8cf3-f19abca88bbd	Admin User	admin2@smartevev.com			2025-10-15 00:36:36.134339+00	2025-10-15 00:36:36.134339+00
9cf20ae2-2c44-4421-9335-4d5517ef489c		squarepants.bob069@gmail.com			2025-10-15 03:14:46.589582+00	2025-10-15 03:14:46.589582+00
\.

-- station_managers
COPY public.station_managers (id, station_id, assigned_at, email, name, phone, address, city, state, country, zip_code, created_at, updated_at) FROM stdin;
9cf20ae2-2c44-4421-9335-4d5517ef489c	0d831107-1296-4877-ae92-527e557aa415	2025-10-15 03:16:41+00	squarepants.bob069@gmail.com	Station Manager	\N	\N	\N	\N	India	\N	2025-10-15 03:16:49.12723+00	2025-10-15 03:16:49.12723+00
\.

-- station_vehicles (empty)
COPY public.station_vehicles (id, station_id, vehicle_id, parked_at, departed_at, status) FROM stdin;
\.

-- stations
COPY public.stations (id, name, latitude, longitude, address, city, state, country, zip_code, capacity, available_slots, status, created_at, updated_at) FROM stdin;
5f90bc61-ac2a-48f5-afb3-5ed3057c0a43	Central Station	28.613900	77.209000	123 Main Street	New Delhi	Delhi	India	110001	50	20	active	2025-10-14 21:02:58.165092+00	2025-10-14 21:02:58.165092+00
bdc0befb-bf5f-4e1b-9899-cfa89c29f0cb	EV	30.316500	78.032200	\N	dehradun	\N	India	\N	10	10	active	2025-10-15 01:11:52.841976+00	2025-10-15 01:11:52.841976+00
7cfa62be-d1ed-4b0e-a13c-2e83a31aa2e0	ev	12.654650	65.456400	\N	dehradun	\N	India	\N	10	10	active	2025-10-15 01:14:03.596319+00	2025-10-15 01:14:03.596319+00
0d831107-1296-4877-ae92-527e557aa415	ev st	956.465400	40.654685	\N	dehra	\N	India	\N	0	10	active	2025-10-15 01:35:54.191634+00	2025-10-15 01:35:54.191634+00
bc239761-0aee-4aff-8e94-c48b0d491b8c	ev st	956.465400	440.654685	\N	dehra	\N	India	\N	0	10	active	2025-10-15 01:35:54.366886+00	2025-10-15 01:35:54.366886+00
78f34356-7839-4184-ac3b-4aba1b828531	ev sation	5.466400	70.250000	\N	ded	\N	India	\N	10	10	active	2025-10-15 01:38:36.518527+00	2025-10-15 01:38:36.518527+00
\.

-- vehicles (empty)
COPY public.vehicles (id, owner_id, plate_number, vehicle_type, brand, model, color, battery_capacity_kwh, range_km, charging_connector, registered_at, last_service_date, status, created_at, updated_at) FROM stdin;
\.

SELECT pg_catalog.setval('public.station_vehicles_id_seq', 1, false);


-- ============================================================
-- SECTION 4: PRIMARY KEYS & UNIQUE CONSTRAINTS
-- ============================================================

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.charging_sessions
    ADD CONSTRAINT charging_sessions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.charging_slots
    ADD CONSTRAINT charging_slots_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.charging_slots
    ADD CONSTRAINT charging_slots_station_id_slot_number_key UNIQUE (station_id, slot_number);

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_key UNIQUE (email);

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.station_managers
    ADD CONSTRAINT station_managers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.station_managers
    ADD CONSTRAINT station_managers_user_id_station_id_key UNIQUE (id, station_id);

ALTER TABLE ONLY public.station_vehicles
    ADD CONSTRAINT station_vehicles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.station_vehicles
    ADD CONSTRAINT station_vehicles_station_id_vehicle_id_status_key UNIQUE (station_id, vehicle_id, status);

ALTER TABLE ONLY public.stations
    ADD CONSTRAINT stations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key UNIQUE (plate_number);


-- ============================================================
-- SECTION 5: INDEXES
-- ============================================================

CREATE INDEX idx_station_vehicles_station ON public.station_vehicles USING btree (station_id);
CREATE INDEX idx_station_vehicles_vehicle ON public.station_vehicles USING btree (vehicle_id);
CREATE INDEX idx_stations_city ON public.stations USING btree (city);


-- ============================================================
-- SECTION 6: FOREIGN KEY CONSTRAINTS
-- ============================================================

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_slot_fkey FOREIGN KEY (slot) REFERENCES public.charging_slots(id) ON UPDATE CASCADE;

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.charging_sessions
    ADD CONSTRAINT charging_sessions_slot_fkey FOREIGN KEY (slot) REFERENCES public.charging_slots(id) ON UPDATE CASCADE;

ALTER TABLE ONLY public.charging_sessions
    ADD CONSTRAINT charging_sessions_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.charging_sessions
    ADD CONSTRAINT charging_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.charging_sessions
    ADD CONSTRAINT charging_sessions_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.charging_slots
    ADD CONSTRAINT charging_slots_current_vehicle_fkey FOREIGN KEY (current_vehicle) REFERENCES public.vehicles(id);

ALTER TABLE ONLY public.charging_slots
    ADD CONSTRAINT charging_slots_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.station_managers
    ADD CONSTRAINT station_managers_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.station_managers
    ADD CONSTRAINT station_managers_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.station_vehicles
    ADD CONSTRAINT station_vehicles_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.station_vehicles
    ADD CONSTRAINT station_vehicles_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


-- ============================================================
-- SECTION 7: ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charging_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charging_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- admins
CREATE POLICY "Admins can manage all admins" ON public.admins
    USING ((id = auth.uid())) WITH CHECK ((id = auth.uid()));

-- bookings
CREATE POLICY "Admins can manage all bookings" ON public.bookings
    USING ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))))
    WITH CHECK ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))));

CREATE POLICY "Managers can access bookings in their stations" ON public.bookings
    FOR SELECT USING ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = bookings.station_id)))));

CREATE POLICY "Managers can insert bookings for their stations" ON public.bookings
    FOR INSERT WITH CHECK ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = bookings.station_id)))));

CREATE POLICY "Managers can update bookings in their stations" ON public.bookings
    FOR UPDATE USING ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = bookings.station_id)))))
    WITH CHECK ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = bookings.station_id)))));

CREATE POLICY "Users can manage their own bookings" ON public.bookings
    USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));

-- charging_sessions
CREATE POLICY "Admins can manage all charging sessions" ON public.charging_sessions
    USING ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))))
    WITH CHECK ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))));

CREATE POLICY "Managers can access charging sessions in their stations" ON public.charging_sessions
    FOR SELECT USING ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_sessions.station_id)))));

CREATE POLICY "Managers can insert charging sessions in their stations" ON public.charging_sessions
    FOR INSERT WITH CHECK ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_sessions.station_id)))));

CREATE POLICY "Managers can update charging sessions in their stations" ON public.charging_sessions
    FOR UPDATE USING ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_sessions.station_id)))))
    WITH CHECK ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_sessions.station_id)))));

CREATE POLICY "Users can manage their own charging sessions" ON public.charging_sessions
    USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));

-- charging_slots
CREATE POLICY "Admins full access" ON public.charging_slots
    USING ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))));

CREATE POLICY "Managers insert their station slots" ON public.charging_slots
    FOR INSERT WITH CHECK ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_slots.station_id)))));

CREATE POLICY "Managers read their station slots" ON public.charging_slots
    FOR SELECT USING ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_slots.station_id)))));

CREATE POLICY "Managers update their station slots" ON public.charging_slots
    FOR UPDATE WITH CHECK ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_slots.station_id)))));

CREATE POLICY "Users view slot availability" ON public.charging_slots
    FOR SELECT USING ((status = 'available'::text));

-- feedback
CREATE POLICY "Admins can manage all feedback" ON public.feedback
    USING ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))));

CREATE POLICY "Station managers can read feedback for their stations" ON public.feedback
    FOR SELECT USING ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = feedback.station_id)))));

CREATE POLICY "Users can insert their feedback" ON public.feedback
    FOR INSERT WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "Users can read their own feedback" ON public.feedback
    FOR SELECT USING ((user_id = auth.uid()));

-- profiles
CREATE POLICY "Admins can manage all profiles" ON public.profiles
    USING ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))))
    WITH CHECK ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))));

CREATE POLICY "Users can read their own profile" ON public.profiles
    FOR SELECT USING ((auth.uid() = id));

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));

CREATE POLICY profiles_insert_self ON public.profiles
    FOR INSERT WITH CHECK ((auth.uid() = id));

-- station_managers
CREATE POLICY "Admins can manage all station managers" ON public.station_managers
    USING ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))))
    WITH CHECK ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))));

CREATE POLICY "Managers can read station managers" ON public.station_managers
    FOR SELECT USING ((id = auth.uid()));

CREATE POLICY "Managers can update their own station manager records" ON public.station_managers
    FOR UPDATE USING ((id = auth.uid())) WITH CHECK ((id = auth.uid()));

-- station_vehicles
CREATE POLICY "Admins can manage all station vehicles" ON public.station_vehicles
    USING ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))))
    WITH CHECK ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))));

CREATE POLICY "Managers can insert vehicles in their stations" ON public.station_vehicles
    FOR INSERT WITH CHECK ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = station_vehicles.station_id)))));

CREATE POLICY "Managers can read vehicles in their stations" ON public.station_vehicles
    FOR SELECT USING ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = station_vehicles.station_id)))));

CREATE POLICY "Managers can update vehicles in their stations" ON public.station_vehicles
    FOR UPDATE USING ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = station_vehicles.station_id)))))
    WITH CHECK ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = station_vehicles.station_id)))));

-- stations
CREATE POLICY "Admins can manage all stations" ON public.stations
    USING ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))))
    WITH CHECK ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))));

CREATE POLICY "Managers can read their stations" ON public.stations
    FOR SELECT USING ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = stations.id)))));

CREATE POLICY "Managers can update their stations" ON public.stations
    FOR UPDATE USING ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = stations.id)))))
    WITH CHECK ((EXISTS (SELECT 1 FROM public.station_managers sm WHERE ((sm.id = auth.uid()) AND (sm.station_id = stations.id)))));

-- vehicles
CREATE POLICY "Admins can manage all vehicles" ON public.vehicles
    USING ((EXISTS (SELECT 1 FROM public.admins a WHERE (a.id = auth.uid()))));

CREATE POLICY "App users can manage their own vehicles" ON public.vehicles
    FOR UPDATE USING ((owner_id = auth.uid())) WITH CHECK ((owner_id = auth.uid()));

CREATE POLICY "Station managers can view their vehicles" ON public.vehicles
    FOR SELECT USING ((EXISTS (SELECT 1 FROM (public.station_vehicles sv JOIN public.station_managers sm ON ((sm.station_id = sv.station_id))) WHERE ((sv.vehicle_id = vehicles.id) AND (sm.id = auth.uid())))));


-- ============================================================
-- SECTION 8: TRIGGER (references public function)
-- ============================================================

-- Note: This trigger lives on auth.users but fires public.create_user_profile()
CREATE TRIGGER trg_create_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();
