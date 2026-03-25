--
-- PostgreSQL database cluster dump
--
SET search_path TO public;
\restrict fIm7ChazpBbI0GGYMbo84npWbC5eiyYwUhgwHCOd0kI2APRpFcBcheYxXxk6Jna

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

--
-- User Configurations
--

--
-- User Config "anon"
--


--
-- User Config "supabase_admin"
--



--
-- Role memberships
--


--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict 9XbslaVQvtEvZ5UwOqui2RtDwavWwP3EhLAYD4azg2JayurirVF0R4BwmXG1VQj

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6 (Debian 17.6-2.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict 9XbslaVQvtEvZ5UwOqui2RtDwavWwP3EhLAYD4azg2JayurirVF0R4BwmXG1VQj

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict QGI5QoGH9ACNbHNvI2EwcegwbPLfm4aQ2VHMMB6Eyvg0D1PliPgLRj8kcWhriy7

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6 (Debian 17.6-2.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: create_user_profile(); Type: FUNCTION; Schema: public; Owner: postgres
--

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

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


ALTER FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_update_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_level_trigger() OWNER TO supabase_storage_admin;

--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.prefixes_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: charging_sessions; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: charging_slots; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: station_managers; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: station_vehicles; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: station_vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.station_vehicles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.station_vehicles_id_seq OWNER TO postgres;

--
-- Name: station_vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.station_vehicles_id_seq OWNED BY public.station_vehicles.id;


--
-- Name: stations; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

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

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: station_vehicles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_vehicles ALTER COLUMN id SET DEFAULT nextval('public.station_vehicles_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	b328f907-0830-46c6-a49e-99e29f7564bb	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"g@gmail.com","user_id":"51fa62f2-83e8-477c-a1b0-c87bdc6fb4de","user_phone":""}}	2025-10-04 13:48:43.72772+00	
00000000-0000-0000-0000-000000000000	a3976165-08dd-4570-b6cb-94dbbf3877c4	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"g@gmail.com","user_id":"51fa62f2-83e8-477c-a1b0-c87bdc6fb4de","user_phone":""}}	2025-10-04 13:53:06.447932+00	
00000000-0000-0000-0000-000000000000	28481616-b379-4fcb-86ca-cd724fec1966	{"action":"user_confirmation_requested","actor_id":"20941bcb-066d-46ed-987f-4209b0f4af9f","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-04 14:09:32.015047+00	
00000000-0000-0000-0000-000000000000	90fc24d1-14c6-463a-a4ec-ef959e1080b7	{"action":"user_confirmation_requested","actor_id":"c1458d85-53ba-4b8e-8b6f-562f59a6a3b5","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-04 14:09:34.923365+00	
00000000-0000-0000-0000-000000000000	5e68ca28-9db0-4c37-a8eb-0185adc6dc44	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"c1458d85-53ba-4b8e-8b6f-562f59a6a3b5","user_phone":""}}	2025-10-06 16:32:57.513842+00	
00000000-0000-0000-0000-000000000000	71da2442-ff64-4630-97bf-3795c55807c8	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshat.prj@gmail.com","user_id":"20941bcb-066d-46ed-987f-4209b0f4af9f","user_phone":""}}	2025-10-06 16:32:57.514893+00	
00000000-0000-0000-0000-000000000000	5a472bc1-dba5-4c32-8c82-a9d39217b269	{"action":"user_confirmation_requested","actor_id":"d118e9ed-b85b-4b2c-a315-4ba43c40d893","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-06 21:46:08.179278+00	
00000000-0000-0000-0000-000000000000	6bd946ee-8a18-434a-bcf1-c4fc2cd6fea4	{"action":"user_signedup","actor_id":"d118e9ed-b85b-4b2c-a315-4ba43c40d893","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-06 21:48:50.515306+00	
00000000-0000-0000-0000-000000000000	2b101e23-dcc2-4684-acc9-23c1945d4e45	{"action":"login","actor_id":"d118e9ed-b85b-4b2c-a315-4ba43c40d893","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 21:49:06.107912+00	
00000000-0000-0000-0000-000000000000	8895c450-7d8c-4e9d-b186-6b4b3f2de7ef	{"action":"login","actor_id":"d118e9ed-b85b-4b2c-a315-4ba43c40d893","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 21:49:10.877335+00	
00000000-0000-0000-0000-000000000000	c20f5cfb-b6a5-410e-98ea-2c79e1dc3b23	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshat.prj@gmail.com","user_id":"d118e9ed-b85b-4b2c-a315-4ba43c40d893","user_phone":""}}	2025-10-06 21:56:17.507737+00	
00000000-0000-0000-0000-000000000000	93592f08-b844-4a82-92e7-07c32e3ef6ec	{"action":"user_signedup","actor_id":"c48066cf-d312-4b7c-bd14-1f5fe5f34445","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-06 21:56:26.731936+00	
00000000-0000-0000-0000-000000000000	f70969da-3a05-4d6c-998e-a0fb721dfe50	{"action":"login","actor_id":"c48066cf-d312-4b7c-bd14-1f5fe5f34445","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 21:56:26.736343+00	
00000000-0000-0000-0000-000000000000	33ad1771-77a5-4652-bd72-571de9484d6f	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshat.prj@gmail.com","user_id":"c48066cf-d312-4b7c-bd14-1f5fe5f34445","user_phone":""}}	2025-10-06 21:59:12.629534+00	
00000000-0000-0000-0000-000000000000	cd85b99f-bc0f-4c58-8ae2-c70ed5a97730	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"akshat.prj@gmail.com","user_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","user_phone":""}}	2025-10-06 21:59:28.849434+00	
00000000-0000-0000-0000-000000000000	f684980a-2b1e-4bfc-aef1-bd0735bebc62	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 22:01:16.320228+00	
00000000-0000-0000-0000-000000000000	a12a5b8e-8875-48f8-a871-ebf9c613a173	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 22:05:35.270819+00	
00000000-0000-0000-0000-000000000000	79498e6a-3eda-49d7-bdb4-81bcccce622f	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 22:09:01.484899+00	
00000000-0000-0000-0000-000000000000	b6dcb94c-eb1e-462a-a47b-2bbf648145c5	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 22:18:33.093507+00	
00000000-0000-0000-0000-000000000000	acdca114-fccb-4176-aa4a-52071dcd86b1	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-06 22:24:09.301172+00	
00000000-0000-0000-0000-000000000000	93b7e588-33f7-4f06-a559-1bca91926c30	{"action":"user_signedup","actor_id":"7cd2db7e-c220-4b7a-bd53-684305d76d11","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-07 15:40:56.200394+00	
00000000-0000-0000-0000-000000000000	222a5ed0-dbce-4b13-8202-1e3a929818cc	{"action":"login","actor_id":"7cd2db7e-c220-4b7a-bd53-684305d76d11","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 15:40:56.224333+00	
00000000-0000-0000-0000-000000000000	1ed65a0a-0454-4f59-a9da-884f421c6c6e	{"action":"login","actor_id":"7cd2db7e-c220-4b7a-bd53-684305d76d11","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 15:42:52.492804+00	
00000000-0000-0000-0000-000000000000	84484446-6c1c-404a-bc9e-1715bf41bd92	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"7cd2db7e-c220-4b7a-bd53-684305d76d11","user_phone":""}}	2025-10-07 15:53:32.009242+00	
00000000-0000-0000-0000-000000000000	ba3a9214-f8d3-4cf6-be10-6a3571059424	{"action":"user_signedup","actor_id":"885d110d-328b-40fe-a0b2-eda876e81bc8","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-07 15:54:04.655804+00	
00000000-0000-0000-0000-000000000000	66384f3a-9c8c-4b6e-b4af-09df93b49ae2	{"action":"login","actor_id":"885d110d-328b-40fe-a0b2-eda876e81bc8","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 15:54:04.661751+00	
00000000-0000-0000-0000-000000000000	385ae86f-adf7-4c55-a3b5-5ac458133dec	{"action":"user_repeated_signup","actor_id":"885d110d-328b-40fe-a0b2-eda876e81bc8","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-07 15:55:16.763531+00	
00000000-0000-0000-0000-000000000000	abb50688-ab98-45ac-b771-8b0ef79ecded	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"885d110d-328b-40fe-a0b2-eda876e81bc8","user_phone":""}}	2025-10-07 15:55:49.903597+00	
00000000-0000-0000-0000-000000000000	4c792c37-0ff9-450b-b5e1-87fb663f6ab0	{"action":"user_signedup","actor_id":"264ee521-2744-419d-bdfd-ed3150711ad7","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-07 15:56:24.548714+00	
00000000-0000-0000-0000-000000000000	9b1716eb-7a41-4c31-862d-b2ae4c01bd04	{"action":"login","actor_id":"264ee521-2744-419d-bdfd-ed3150711ad7","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 15:56:24.554169+00	
00000000-0000-0000-0000-000000000000	2791d7bd-8355-42c3-92e5-3b5b3c5908e9	{"action":"user_repeated_signup","actor_id":"264ee521-2744-419d-bdfd-ed3150711ad7","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-07 15:58:50.242446+00	
00000000-0000-0000-0000-000000000000	1c43b261-c55c-42e7-8e7d-c45ca8291ed6	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"264ee521-2744-419d-bdfd-ed3150711ad7","user_phone":""}}	2025-10-07 15:59:14.720768+00	
00000000-0000-0000-0000-000000000000	cb72eb70-6dce-4d10-8773-afb04aa680e8	{"action":"user_signedup","actor_id":"597ac290-473d-4fd3-92f9-1e67ebd41c13","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-07 15:59:19.74772+00	
00000000-0000-0000-0000-000000000000	c007af4a-6de4-41d5-b550-c204f8441235	{"action":"login","actor_id":"597ac290-473d-4fd3-92f9-1e67ebd41c13","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 15:59:19.751363+00	
00000000-0000-0000-0000-000000000000	0f40ecfd-e4dc-4e1b-aa77-4f09a2c1c6ac	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"597ac290-473d-4fd3-92f9-1e67ebd41c13","user_phone":""}}	2025-10-07 16:01:37.364106+00	
00000000-0000-0000-0000-000000000000	eb3c7e73-caec-4d72-a5a7-9188a250dbe4	{"action":"user_signedup","actor_id":"c81a2688-40db-4019-9c1c-b513a073b93f","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-07 16:01:45.450398+00	
00000000-0000-0000-0000-000000000000	d06d586b-8db3-4cb2-90c9-7713338f51c0	{"action":"login","actor_id":"c81a2688-40db-4019-9c1c-b513a073b93f","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 16:01:45.454109+00	
00000000-0000-0000-0000-000000000000	3f35d4a2-af97-4f81-a78b-42f4fa724b66	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"c81a2688-40db-4019-9c1c-b513a073b93f","user_phone":""}}	2025-10-07 16:02:53.312188+00	
00000000-0000-0000-0000-000000000000	221570b5-f921-4622-90fd-e3af9c0c7b6e	{"action":"user_signedup","actor_id":"48075556-adfd-412e-9452-319a6455b140","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-07 16:03:08.129637+00	
00000000-0000-0000-0000-000000000000	c0c7cc90-6db5-472c-9742-cb429be77e05	{"action":"login","actor_id":"48075556-adfd-412e-9452-319a6455b140","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 16:03:08.134192+00	
00000000-0000-0000-0000-000000000000	06c490fe-2697-4dd0-a0a3-fd78b626f4d3	{"action":"user_repeated_signup","actor_id":"48075556-adfd-412e-9452-319a6455b140","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-07 16:06:04.956647+00	
00000000-0000-0000-0000-000000000000	43927149-3a3d-4dd7-83c9-7ce1c803d9c9	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"48075556-adfd-412e-9452-319a6455b140","user_phone":""}}	2025-10-07 16:06:21.510213+00	
00000000-0000-0000-0000-000000000000	9b2c06dd-1152-4240-a6df-011e22eb843d	{"action":"user_signedup","actor_id":"8490064d-c8b4-431d-91e8-cb3df87c7d9e","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-07 16:06:25.801905+00	
00000000-0000-0000-0000-000000000000	ab804e15-55ef-4ede-a5c0-cf1425b1cc0b	{"action":"login","actor_id":"8490064d-c8b4-431d-91e8-cb3df87c7d9e","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-07 16:06:25.805928+00	
00000000-0000-0000-0000-000000000000	9510b906-2420-4604-8222-698d67639b55	{"action":"user_repeated_signup","actor_id":"8490064d-c8b4-431d-91e8-cb3df87c7d9e","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-07 16:06:52.697165+00	
00000000-0000-0000-0000-000000000000	2213764b-b981-4653-89f8-7be6303c9440	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"8490064d-c8b4-431d-91e8-cb3df87c7d9e","user_phone":""}}	2025-10-08 12:39:00.712365+00	
00000000-0000-0000-0000-000000000000	efb73f4f-077c-4ed1-9cd3-ec1c10ef8996	{"action":"user_signedup","actor_id":"7abbbd08-fb8d-4e09-8ad1-a579bd821dff","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-08 13:20:39.353222+00	
00000000-0000-0000-0000-000000000000	71e34859-49f9-40ea-af57-e80a1d31f8b8	{"action":"login","actor_id":"7abbbd08-fb8d-4e09-8ad1-a579bd821dff","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 13:20:39.371669+00	
00000000-0000-0000-0000-000000000000	35a23530-eca1-4e28-a70e-5d3888b48ceb	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"7abbbd08-fb8d-4e09-8ad1-a579bd821dff","user_phone":""}}	2025-10-08 13:27:51.301955+00	
00000000-0000-0000-0000-000000000000	25092060-971e-44b2-89e2-08e0824acdb3	{"action":"user_signedup","actor_id":"1a0a7a86-a15d-4e48-bd2b-78effc58b586","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-08 13:27:59.844799+00	
00000000-0000-0000-0000-000000000000	a6307d57-da6c-42bc-95e7-e346c28dadcd	{"action":"login","actor_id":"1a0a7a86-a15d-4e48-bd2b-78effc58b586","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 13:27:59.849245+00	
00000000-0000-0000-0000-000000000000	4c3668fe-b5bd-4c50-a7fe-1a692edd8b50	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"1a0a7a86-a15d-4e48-bd2b-78effc58b586","user_phone":""}}	2025-10-08 13:30:44.66066+00	
00000000-0000-0000-0000-000000000000	513d19b5-ffc1-4fc4-aa2a-c79293e2ab8f	{"action":"user_signedup","actor_id":"3c8980f9-6446-4238-b0e0-0b9186a672e4","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-08 13:30:58.338007+00	
00000000-0000-0000-0000-000000000000	3ccde88a-0efa-4f1a-8674-55b304923612	{"action":"login","actor_id":"3c8980f9-6446-4238-b0e0-0b9186a672e4","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 13:30:58.34426+00	
00000000-0000-0000-0000-000000000000	87c87be6-23ba-42e5-a0c5-8fbe74773df7	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"3c8980f9-6446-4238-b0e0-0b9186a672e4","user_phone":""}}	2025-10-08 13:33:41.941198+00	
00000000-0000-0000-0000-000000000000	da9a8180-3cba-4252-a4b6-857622092a7e	{"action":"user_signedup","actor_id":"0eaa9ff8-eb9b-45f7-b291-fd24e5fd6a42","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-08 13:33:49.351778+00	
00000000-0000-0000-0000-000000000000	336a206b-73c7-41f1-b141-d70395bddce7	{"action":"login","actor_id":"0eaa9ff8-eb9b-45f7-b291-fd24e5fd6a42","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 13:33:49.355467+00	
00000000-0000-0000-0000-000000000000	0d38e046-f016-476c-a747-58d6b090d32e	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"0eaa9ff8-eb9b-45f7-b291-fd24e5fd6a42","user_phone":""}}	2025-10-08 13:34:47.106447+00	
00000000-0000-0000-0000-000000000000	68a03184-f607-4d08-8045-2519f5886d76	{"action":"user_signedup","actor_id":"23c3605f-71f1-4c54-a0f2-b1281ff7adb5","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-08 13:34:51.469162+00	
00000000-0000-0000-0000-000000000000	cb8b7ea6-7906-4697-aa0d-4b16a62ba430	{"action":"login","actor_id":"23c3605f-71f1-4c54-a0f2-b1281ff7adb5","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 13:34:51.479807+00	
00000000-0000-0000-0000-000000000000	1bb0ba66-da00-484c-abd6-e56ae38eb145	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"23c3605f-71f1-4c54-a0f2-b1281ff7adb5","user_phone":""}}	2025-10-08 13:40:26.383639+00	
00000000-0000-0000-0000-000000000000	e403f272-f4ee-4dd9-bbbb-eb30f456caad	{"action":"user_signedup","actor_id":"6b726f56-5ac9-457d-b5f2-323cc5a25170","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-08 13:40:55.224259+00	
00000000-0000-0000-0000-000000000000	65af903f-cab7-40d3-ad0d-5d2e6bcab7ae	{"action":"login","actor_id":"6b726f56-5ac9-457d-b5f2-323cc5a25170","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 13:40:55.228384+00	
00000000-0000-0000-0000-000000000000	b2b50949-9335-4fb1-9494-e7690b7c9250	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"6b726f56-5ac9-457d-b5f2-323cc5a25170","user_phone":""}}	2025-10-08 20:42:07.367281+00	
00000000-0000-0000-0000-000000000000	843f39c2-630e-4aec-9af6-e4535fd1c8f0	{"action":"user_signedup","actor_id":"ec394e7b-41b1-46d9-ba75-3a47b1c788e8","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-08 20:46:15.59817+00	
00000000-0000-0000-0000-000000000000	118eadd3-f28e-4efd-bbf7-6e84a1835d30	{"action":"login","actor_id":"ec394e7b-41b1-46d9-ba75-3a47b1c788e8","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 20:46:15.607257+00	
00000000-0000-0000-0000-000000000000	98ee00c7-662f-45c4-a26e-f5b97955d6c5	{"action":"login","actor_id":"ec394e7b-41b1-46d9-ba75-3a47b1c788e8","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 20:47:00.879447+00	
00000000-0000-0000-0000-000000000000	f26de694-c16a-422b-a29b-23a6af768f67	{"action":"login","actor_id":"ec394e7b-41b1-46d9-ba75-3a47b1c788e8","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-08 20:47:21.805797+00	
00000000-0000-0000-0000-000000000000	baa43612-6fe7-409d-a690-d9a9a3e8089c	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"ec394e7b-41b1-46d9-ba75-3a47b1c788e8","user_phone":""}}	2025-10-09 09:31:01.764563+00	
00000000-0000-0000-0000-000000000000	dd878a6c-d01e-415d-b851-b84fae14a8a6	{"action":"user_signedup","actor_id":"26720cc3-d896-4dee-a2e1-2ecb65e8b060","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-10 14:00:41.921808+00	
00000000-0000-0000-0000-000000000000	cae86dc1-727d-49cc-bd1b-78d5e92cc7c4	{"action":"login","actor_id":"26720cc3-d896-4dee-a2e1-2ecb65e8b060","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-10 14:00:41.943513+00	
00000000-0000-0000-0000-000000000000	adf324ae-8abd-419b-af24-2851ad8e72ed	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"26720cc3-d896-4dee-a2e1-2ecb65e8b060","user_phone":""}}	2025-10-10 14:09:38.758645+00	
00000000-0000-0000-0000-000000000000	a9805f4b-3f00-4c39-9e83-8aa89490cb84	{"action":"user_signedup","actor_id":"97551289-1ef3-4e53-bf0b-b0f6d58b5d0f","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-14 10:31:54.227719+00	
00000000-0000-0000-0000-000000000000	69c0c912-883e-4da6-833d-2b23a5ae92f9	{"action":"login","actor_id":"97551289-1ef3-4e53-bf0b-b0f6d58b5d0f","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 10:31:54.248966+00	
00000000-0000-0000-0000-000000000000	e78a556a-5e79-4d61-b73f-fc4afd9adb54	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 17:14:59.099233+00	
00000000-0000-0000-0000-000000000000	adf2572d-2525-48dd-af2e-1d1023e44448	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"akshatprj21@gmail.com","user_id":"97551289-1ef3-4e53-bf0b-b0f6d58b5d0f","user_phone":""}}	2025-10-14 17:25:56.09567+00	
00000000-0000-0000-0000-000000000000	e2e8f50c-4e90-4ef5-adab-d947b043f506	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 17:26:22.619832+00	
00000000-0000-0000-0000-000000000000	430a5c60-f34a-4b45-8518-3876f0951d09	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 17:26:26.898322+00	
00000000-0000-0000-0000-000000000000	ee69c6c2-2af3-424b-afff-01b207e0592a	{"action":"user_signedup","actor_id":"f1fd2ccd-d83d-4196-81f2-76399c4e4869","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-14 17:27:08.402669+00	
00000000-0000-0000-0000-000000000000	eee09071-0210-486f-865b-271f521ae7f5	{"action":"login","actor_id":"f1fd2ccd-d83d-4196-81f2-76399c4e4869","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 17:27:08.406318+00	
00000000-0000-0000-0000-000000000000	1e5a3518-8ffd-45c1-a4ae-c1df53c26b31	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 17:27:56.182216+00	
00000000-0000-0000-0000-000000000000	f02b255b-ba71-403f-8231-8dc0676dc696	{"action":"login","actor_id":"f1fd2ccd-d83d-4196-81f2-76399c4e4869","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 17:29:27.136301+00	
00000000-0000-0000-0000-000000000000	0e593346-b95f-414b-8944-d574811048f0	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 17:37:17.240514+00	
00000000-0000-0000-0000-000000000000	5169e321-1a7f-48ba-ba41-dfcc5a42f658	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 17:39:11.419796+00	
00000000-0000-0000-0000-000000000000	13b94ab9-b5d3-40a2-a42d-59373c4ad0e0	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 17:56:43.503863+00	
00000000-0000-0000-0000-000000000000	9f03c84e-bd1b-423c-b6de-1bba394aae58	{"action":"user_signedup","actor_id":"c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af","actor_username":"test@example.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-14 17:58:09.187458+00	
00000000-0000-0000-0000-000000000000	8d993e0c-b9c4-4e65-b11f-5f23fc7bf243	{"action":"login","actor_id":"c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 17:58:09.19557+00	
00000000-0000-0000-0000-000000000000	4a29128a-9382-445b-b5ba-75ac06ca70e0	{"action":"login","actor_id":"c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af","actor_username":"test@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 17:58:25.772789+00	
00000000-0000-0000-0000-000000000000	28d4e925-b9cd-4a98-beff-eca45a1734ea	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 18:08:01.44819+00	
00000000-0000-0000-0000-000000000000	53767728-766c-42b5-bb7d-e63ef10d07fa	{"action":"token_refreshed","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 19:07:51.619496+00	
00000000-0000-0000-0000-000000000000	e4225003-8673-438c-833a-32d153489a8e	{"action":"token_revoked","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 19:07:51.632744+00	
00000000-0000-0000-0000-000000000000	1a3c7914-07a7-44fd-81a8-050ac9b845ee	{"action":"token_refreshed","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 19:07:52.667919+00	
00000000-0000-0000-0000-000000000000	b4e6446f-bf9b-48a7-b1d2-fde8870c024b	{"action":"token_revoked","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 19:07:52.669146+00	
00000000-0000-0000-0000-000000000000	7ddc573f-27ea-4ae0-ae29-d2bc545de4be	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 19:08:13.658667+00	
00000000-0000-0000-0000-000000000000	697db9fb-2386-4e0a-a9e6-23ecbf497d54	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 19:11:11.891394+00	
00000000-0000-0000-0000-000000000000	3ab2d696-7cb0-4531-bc71-3639b8810d05	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 19:11:54.819556+00	
00000000-0000-0000-0000-000000000000	c58ff1ec-7e8c-4ad8-81b0-bc5b38e2035e	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 19:13:46.733356+00	
00000000-0000-0000-0000-000000000000	7ba50778-2be3-4b78-906f-7368c28c9695	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 19:16:43.070249+00	
00000000-0000-0000-0000-000000000000	22c24b84-fad9-4153-820f-a8d8591ac840	{"action":"token_refreshed","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 20:16:34.057784+00	
00000000-0000-0000-0000-000000000000	8a8a52d7-3d4b-4a87-9b19-6929a1deec50	{"action":"token_revoked","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 20:16:34.077974+00	
00000000-0000-0000-0000-000000000000	ec6d87fb-44e2-4c1d-9bee-5919c33cf1be	{"action":"token_refreshed","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 20:16:34.180162+00	
00000000-0000-0000-0000-000000000000	13563731-7a11-43e0-8039-3cf44847bdfb	{"action":"token_revoked","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-10-14 20:16:34.180869+00	
00000000-0000-0000-0000-000000000000	2855be46-46e7-486d-8c26-f257bab4cab6	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-14 20:52:05.209628+00	
00000000-0000-0000-0000-000000000000	5249f950-64ff-4b9a-9761-05cd3aebd705	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 00:33:38.02823+00	
00000000-0000-0000-0000-000000000000	59fcdaf8-1132-4e82-8ad7-e359ba391d46	{"action":"user_signedup","actor_id":"1bb3cf75-366a-4758-8aa7-46712e003a81","actor_username":"admin@smartevev.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-15 00:36:12.596808+00	
00000000-0000-0000-0000-000000000000	918466f8-6007-4221-b335-02ead5b502af	{"action":"login","actor_id":"1bb3cf75-366a-4758-8aa7-46712e003a81","actor_username":"admin@smartevev.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 00:36:12.608319+00	
00000000-0000-0000-0000-000000000000	d773694f-ce1e-4665-927c-f7166109fdfd	{"action":"user_repeated_signup","actor_id":"1bb3cf75-366a-4758-8aa7-46712e003a81","actor_username":"admin@smartevev.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-10-15 00:36:28.404674+00	
00000000-0000-0000-0000-000000000000	97ce0a3c-de10-4f41-a182-17c4f42a7169	{"action":"user_signedup","actor_id":"1a9fa9d4-2357-4c3d-8cf3-f19abca88bbd","actor_username":"admin2@smartevev.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-10-15 00:36:36.141867+00	
00000000-0000-0000-0000-000000000000	193575b7-56ff-4600-9733-657febf93431	{"action":"login","actor_id":"1a9fa9d4-2357-4c3d-8cf3-f19abca88bbd","actor_username":"admin2@smartevev.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 00:36:36.147144+00	
00000000-0000-0000-0000-000000000000	093ee5aa-d9f6-4b1f-994c-e5a62a41f5f0	{"action":"login","actor_id":"1bb3cf75-366a-4758-8aa7-46712e003a81","actor_username":"admin@smartevev.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 00:36:46.262822+00	
00000000-0000-0000-0000-000000000000	c94749cb-6343-4d5e-86f3-a2d771fc287d	{"action":"login","actor_id":"1bb3cf75-366a-4758-8aa7-46712e003a81","actor_username":"admin@smartevev.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 00:37:58.208694+00	
00000000-0000-0000-0000-000000000000	a4e84932-de4c-41b0-bbb6-823f8d14ca41	{"action":"login","actor_id":"1bb3cf75-366a-4758-8aa7-46712e003a81","actor_username":"admin@smartevev.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 00:40:24.490089+00	
00000000-0000-0000-0000-000000000000	3249f4be-8c7b-4b9c-bca2-0f6f0bdd55c2	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 01:03:24.645441+00	
00000000-0000-0000-0000-000000000000	29315529-dc14-4b9a-bfb7-a268acf0ddcd	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 01:05:33.7574+00	
00000000-0000-0000-0000-000000000000	fcb23053-5281-4635-8fbd-a8be2e952399	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 01:41:01.71904+00	
00000000-0000-0000-0000-000000000000	e4cc3a77-47f1-4296-b676-7ecfa006d982	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 01:41:37.532271+00	
00000000-0000-0000-0000-000000000000	1da67cf0-63df-42e8-aaf7-667e5af60708	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 01:44:15.378253+00	
00000000-0000-0000-0000-000000000000	ca03d4d2-c137-4cf0-84ce-5bd1db988158	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 01:46:03.21693+00	
00000000-0000-0000-0000-000000000000	58fcc0c1-0324-45f2-9f7f-dc2c67fa336f	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 01:57:28.483113+00	
00000000-0000-0000-0000-000000000000	614d6fd5-7a67-402b-aa97-925d4ea51e51	{"action":"login","actor_id":"f1fd2ccd-d83d-4196-81f2-76399c4e4869","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 02:09:59.391853+00	
00000000-0000-0000-0000-000000000000	a7d0af1a-deda-4fcb-9f23-78a17ce6037e	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 02:13:08.330162+00	
00000000-0000-0000-0000-000000000000	f8757fee-e2e9-4d15-92c0-2491b082c792	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 02:58:02.469327+00	
00000000-0000-0000-0000-000000000000	5e4c90cc-6280-48b5-bbea-6174acfaed43	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"squarepants.bob069@gmail.com","user_id":"9cf20ae2-2c44-4421-9335-4d5517ef489c","user_phone":""}}	2025-10-15 03:14:46.641432+00	
00000000-0000-0000-0000-000000000000	53714f79-a193-4905-ad31-3a08a001ada7	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 03:39:59.539173+00	
00000000-0000-0000-0000-000000000000	604010ab-9ff5-4d8c-8478-7d47ee394254	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 03:59:00.709502+00	
00000000-0000-0000-0000-000000000000	308edcb1-d745-4c6e-b960-bff504204573	{"action":"login","actor_id":"f1fd2ccd-d83d-4196-81f2-76399c4e4869","actor_username":"akshatprj21@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 04:00:41.161991+00	
00000000-0000-0000-0000-000000000000	01c5d4fa-e896-44f8-ba9f-bb5bcb101ac8	{"action":"login","actor_id":"f12781c5-9b29-4411-96e6-6fe20b7406a7","actor_username":"akshat.prj@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-10-15 05:08:24.039287+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
f12781c5-9b29-4411-96e6-6fe20b7406a7	f12781c5-9b29-4411-96e6-6fe20b7406a7	{"sub": "f12781c5-9b29-4411-96e6-6fe20b7406a7", "email": "akshat.prj@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-10-06 21:59:28.84843+00	2025-10-06 21:59:28.848484+00	2025-10-06 21:59:28.848484+00	49dff242-d895-48e2-9338-3e43bdef08b3
f1fd2ccd-d83d-4196-81f2-76399c4e4869	f1fd2ccd-d83d-4196-81f2-76399c4e4869	{"sub": "f1fd2ccd-d83d-4196-81f2-76399c4e4869", "city": "sadsdasd", "name": "Akshat", "email": "akshatprj21@gmail.com", "phone": "9546546545", "address": "asdasdasd", "email_verified": false, "phone_verified": false}	email	2025-10-14 17:27:08.399358+00	2025-10-14 17:27:08.399408+00	2025-10-14 17:27:08.399408+00	2f6d7219-7712-4c6f-84f0-92b5afa11329
c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af	c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af	{"sub": "c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af", "city": "Test City", "name": "Test User", "email": "test@example.com", "phone": "+1234567890", "address": "123 Test St", "email_verified": false, "phone_verified": false}	email	2025-10-14 17:58:09.182474+00	2025-10-14 17:58:09.182528+00	2025-10-14 17:58:09.182528+00	0611b8e7-dd21-46f8-a675-a59572ba7a46
1bb3cf75-366a-4758-8aa7-46712e003a81	1bb3cf75-366a-4758-8aa7-46712e003a81	{"sub": "1bb3cf75-366a-4758-8aa7-46712e003a81", "name": "Admin User", "role": "admin", "email": "admin@smartevev.com", "email_verified": false, "phone_verified": false}	email	2025-10-15 00:36:12.59193+00	2025-10-15 00:36:12.591987+00	2025-10-15 00:36:12.591987+00	da60ff38-5370-43c3-b64f-a74455d260c3
1a9fa9d4-2357-4c3d-8cf3-f19abca88bbd	1a9fa9d4-2357-4c3d-8cf3-f19abca88bbd	{"sub": "1a9fa9d4-2357-4c3d-8cf3-f19abca88bbd", "name": "Admin User", "role": "admin", "email": "admin2@smartevev.com", "email_verified": false, "phone_verified": false}	email	2025-10-15 00:36:36.138348+00	2025-10-15 00:36:36.138413+00	2025-10-15 00:36:36.138413+00	a22b144a-0496-4899-8050-6273f8de9fa5
9cf20ae2-2c44-4421-9335-4d5517ef489c	9cf20ae2-2c44-4421-9335-4d5517ef489c	{"sub": "9cf20ae2-2c44-4421-9335-4d5517ef489c", "email": "squarepants.bob069@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-10-15 03:14:46.632413+00	2025-10-15 03:14:46.633479+00	2025-10-15 03:14:46.633479+00	adc7443e-b22c-4490-b367-5423a430496e
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
18eb5a01-ad58-4391-8b61-0c86e1b50620	2025-10-06 22:01:16.324649+00	2025-10-06 22:01:16.324649+00	password	6cf0c16e-7a92-4b74-806d-b52e1340a8b3
472e3a15-ade5-4fcf-a82d-71dd399ab478	2025-10-06 22:05:35.293908+00	2025-10-06 22:05:35.293908+00	password	76c966de-6cea-4cff-a8e5-fff6923ef30c
1bb08c73-5333-4831-b76e-60220b491720	2025-10-06 22:09:01.489361+00	2025-10-06 22:09:01.489361+00	password	581f5331-9dc1-4792-8fa3-9e34b886aa2f
daa60c57-ee77-463e-8cdc-5a7e62fb66c6	2025-10-06 22:18:33.113989+00	2025-10-06 22:18:33.113989+00	password	722b5c93-66e0-4ef8-9775-0d6eeec66d5b
fbce58c4-aa01-4cf0-8429-4f30f0f5c9e2	2025-10-06 22:24:09.323268+00	2025-10-06 22:24:09.323268+00	password	249adb2c-1f35-41c6-8795-831295a85c53
623b4da2-de59-4b9c-a057-e5b50812d02f	2025-10-14 17:14:59.156186+00	2025-10-14 17:14:59.156186+00	password	a7c9f3da-39ce-43a3-8806-651e0f4cd3a8
a4ecfec7-0005-4f1f-bcfb-924033fdbc9e	2025-10-14 17:26:22.633462+00	2025-10-14 17:26:22.633462+00	password	40a616a5-c845-49a7-adca-e51e21f67e33
3bb4fe65-848c-45f8-af55-5455346a742b	2025-10-14 17:26:26.902973+00	2025-10-14 17:26:26.902973+00	password	783d7e71-7b49-45ba-a96c-af701a3c0054
239c7e60-842b-4972-839b-fee8ff8e71b0	2025-10-14 17:27:08.40875+00	2025-10-14 17:27:08.40875+00	password	baec4ccc-5709-40f5-a48e-6d61ffb0ccb8
25169967-0f80-4788-b479-eb3416572756	2025-10-14 17:27:56.187653+00	2025-10-14 17:27:56.187653+00	password	a3169d7e-24a0-47e7-a502-d265e60b3b63
dce5a187-54ab-4ede-adf7-17e7184a2ee8	2025-10-14 17:29:27.14153+00	2025-10-14 17:29:27.14153+00	password	4d1b676d-b794-4399-9f17-1effade67153
5d2820ad-8967-46ac-a60a-8e80b16ca0fc	2025-10-14 17:37:17.257499+00	2025-10-14 17:37:17.257499+00	password	43d493a9-e1ba-488e-993b-f5a2c6add708
925c9435-26ef-4300-bc5d-56d635569469	2025-10-14 17:39:11.42543+00	2025-10-14 17:39:11.42543+00	password	5ff1918e-af53-41bd-a6ea-b7c30a921d66
2f9e2c91-e03e-4eb0-851b-46357744784f	2025-10-14 17:56:43.579345+00	2025-10-14 17:56:43.579345+00	password	edd1d98d-87d0-4f43-bc3e-3fa62bd31dd4
5160e064-82aa-4081-92c2-8be1ddd46c73	2025-10-14 17:58:09.200881+00	2025-10-14 17:58:09.200881+00	password	56f3501f-c9ac-468f-a365-92ddf90a78f9
45024469-7c16-41c4-8f58-d6fbcbf4e1b2	2025-10-14 17:58:25.775623+00	2025-10-14 17:58:25.775623+00	password	50353501-98fa-4ce7-af86-4c5449fb336f
6d8c5b46-955c-4fb6-9fb0-e8bd83b67b7f	2025-10-14 18:08:01.463821+00	2025-10-14 18:08:01.463821+00	password	a2b999f9-5442-49a9-9bd7-1abd6d90e02c
59af8e50-5084-47ef-8600-4747c7f38019	2025-10-14 19:08:13.668214+00	2025-10-14 19:08:13.668214+00	password	2fea7e10-b689-4209-8cf9-63293077ca86
643eabe6-fb2f-43cc-a8cf-64fdbbdcd1d5	2025-10-14 19:11:11.895774+00	2025-10-14 19:11:11.895774+00	password	fec0f6ef-4f85-4d03-923b-4a0c8f364f75
d369d0fd-1cbc-4206-ae23-b00c282d329a	2025-10-14 19:11:54.822884+00	2025-10-14 19:11:54.822884+00	password	2e985ff7-e440-476a-8115-c9066fba9909
0ba478f9-813c-497f-afac-b87d3c4dabe0	2025-10-14 19:13:46.740836+00	2025-10-14 19:13:46.740836+00	password	8633a172-5725-45a6-8861-6642ec8dcccc
7c6b5aee-b1f0-48ad-82f5-da8b76e227ae	2025-10-14 19:16:43.080037+00	2025-10-14 19:16:43.080037+00	password	e0576dd3-94b2-4ef4-9769-4e7205cbe045
216cdf03-6ea5-4950-8d93-972486bec66a	2025-10-14 20:52:05.261684+00	2025-10-14 20:52:05.261684+00	password	43af0b4e-5135-45f4-8c98-3a52680599d1
66241a70-33cf-452e-9b20-1795c5abd10c	2025-10-15 00:33:38.116199+00	2025-10-15 00:33:38.116199+00	password	b95901d0-8601-4ba9-8411-1036901a4a26
5015cbc3-09a0-4936-b3e5-8ba1efbddb54	2025-10-15 00:36:12.613215+00	2025-10-15 00:36:12.613215+00	password	48446bbe-7144-438f-830b-33b10c4c5a03
1ec83460-ec53-4bf0-a9be-0fdaa0d3d394	2025-10-15 00:36:36.149957+00	2025-10-15 00:36:36.149957+00	password	e8289283-3080-4e86-abe4-d7877de2e214
b6630d5c-e877-42c0-8f09-0111a933f178	2025-10-15 00:36:46.268453+00	2025-10-15 00:36:46.268453+00	password	5781d653-12f2-4f4a-8c82-3f0630d4a52e
9eb6ac83-067d-4803-9d12-822d0eb6eb97	2025-10-15 00:37:58.215319+00	2025-10-15 00:37:58.215319+00	password	647b24ff-58a3-4602-9ae9-ff236c2e9e05
867ee169-a48a-49a4-ae39-1aa54ea4ce5d	2025-10-15 00:40:24.494669+00	2025-10-15 00:40:24.494669+00	password	2af6aecc-d3d3-4122-9c0b-34eb554ac38c
aecbd60f-2c5b-40ad-8f6b-e677308b6304	2025-10-15 01:03:24.731186+00	2025-10-15 01:03:24.731186+00	password	d61b7214-983a-4e1e-bb21-75af1ae6dd2c
b6e86331-8767-44c5-9074-7859b79506f9	2025-10-15 01:05:33.763518+00	2025-10-15 01:05:33.763518+00	password	2d519c3c-8fe0-495c-9f47-ff6d296bbcdc
b49c9ee7-baf4-4d18-8ad2-7ecd93181f8e	2025-10-15 01:41:01.77583+00	2025-10-15 01:41:01.77583+00	password	f43d0768-312a-404f-a344-c76d3c9eff27
b01f711c-fdcb-4e16-b18a-31de4985b165	2025-10-15 01:41:37.536893+00	2025-10-15 01:41:37.536893+00	password	34711f0f-9101-4531-8ee0-86013ae18b94
e5947936-e95b-463b-9aad-d7235fe078fd	2025-10-15 01:44:15.386372+00	2025-10-15 01:44:15.386372+00	password	f2fbba09-9bc0-4c33-83ed-9b390083fb90
657c454d-c763-46af-aebb-1d18fef56845	2025-10-15 01:46:03.250673+00	2025-10-15 01:46:03.250673+00	password	9458b6c2-e59e-4f40-9925-7a62fdb5493e
e471e62a-7d18-49de-b5bd-a3fb0fae9f11	2025-10-15 01:57:28.513861+00	2025-10-15 01:57:28.513861+00	password	e58f8705-76fc-49fb-ba0c-9b8a832a4df1
8b487869-324e-4689-a439-dce404865ac5	2025-10-15 02:09:59.446988+00	2025-10-15 02:09:59.446988+00	password	0e4f50a9-9e8a-451d-9589-beea7ed9adf2
1460a0a2-b47c-4cd4-bf96-821bd5494b99	2025-10-15 02:13:08.338974+00	2025-10-15 02:13:08.338974+00	password	ef1cefad-35e4-423d-a195-b2ae57f1afa4
3103c6ab-618b-443e-9ab0-d04494cd05e6	2025-10-15 02:58:02.560654+00	2025-10-15 02:58:02.560654+00	password	8884f31b-ad4a-49ae-b8e3-ac5860c1675b
d4cb97f2-1c41-4de0-b995-a1ee780fe079	2025-10-15 03:39:59.63009+00	2025-10-15 03:39:59.63009+00	password	f0175b39-2937-4432-ad03-af796295abaf
ef4fe628-4af3-470f-98b9-72ea498d71e6	2025-10-15 03:59:00.777512+00	2025-10-15 03:59:00.777512+00	password	2595b2de-eb45-4a24-a66b-40af45fc759e
fd6a5937-6771-4efb-b826-ae14868d91c1	2025-10-15 04:00:41.247254+00	2025-10-15 04:00:41.247254+00	password	44397543-2ca6-46e3-9064-5743c31dfb40
f6bd0f46-024c-4a08-ac88-d65e99a72546	2025-10-15 05:08:24.084519+00	2025-10-15 05:08:24.084519+00	password	1159de97-b522-4838-af7e-c70b7a214280
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	5	ex7ptxp3u5yk	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-06 22:01:16.322657+00	2025-10-06 22:01:16.322657+00	\N	18eb5a01-ad58-4391-8b61-0c86e1b50620
00000000-0000-0000-0000-000000000000	6	qvu7uqi4ng5t	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-06 22:05:35.286961+00	2025-10-06 22:05:35.286961+00	\N	472e3a15-ade5-4fcf-a82d-71dd399ab478
00000000-0000-0000-0000-000000000000	7	5abqxbmphewl	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-06 22:09:01.487318+00	2025-10-06 22:09:01.487318+00	\N	1bb08c73-5333-4831-b76e-60220b491720
00000000-0000-0000-0000-000000000000	8	rfchrpsd6zxr	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-06 22:18:33.107486+00	2025-10-06 22:18:33.107486+00	\N	daa60c57-ee77-463e-8cdc-5a7e62fb66c6
00000000-0000-0000-0000-000000000000	9	ilowh3z5u5w5	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-06 22:24:09.313841+00	2025-10-06 22:24:09.313841+00	\N	fbce58c4-aa01-4cf0-8429-4f30f0f5c9e2
00000000-0000-0000-0000-000000000000	29	pivwho4qlvs6	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 17:14:59.133796+00	2025-10-14 17:14:59.133796+00	\N	623b4da2-de59-4b9c-a057-e5b50812d02f
00000000-0000-0000-0000-000000000000	30	ykj5ervql7lo	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 17:26:22.628771+00	2025-10-14 17:26:22.628771+00	\N	a4ecfec7-0005-4f1f-bcfb-924033fdbc9e
00000000-0000-0000-0000-000000000000	31	ufbafpzm22p7	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 17:26:26.900079+00	2025-10-14 17:26:26.900079+00	\N	3bb4fe65-848c-45f8-af55-5455346a742b
00000000-0000-0000-0000-000000000000	32	bewz2biwfpp5	f1fd2ccd-d83d-4196-81f2-76399c4e4869	f	2025-10-14 17:27:08.407625+00	2025-10-14 17:27:08.407625+00	\N	239c7e60-842b-4972-839b-fee8ff8e71b0
00000000-0000-0000-0000-000000000000	33	x4yneetgqivl	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 17:27:56.185796+00	2025-10-14 17:27:56.185796+00	\N	25169967-0f80-4788-b479-eb3416572756
00000000-0000-0000-0000-000000000000	34	dwjec7dbzf55	f1fd2ccd-d83d-4196-81f2-76399c4e4869	f	2025-10-14 17:29:27.138829+00	2025-10-14 17:29:27.138829+00	\N	dce5a187-54ab-4ede-adf7-17e7184a2ee8
00000000-0000-0000-0000-000000000000	35	ydf4iryymnn3	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 17:37:17.249554+00	2025-10-14 17:37:17.249554+00	\N	5d2820ad-8967-46ac-a60a-8e80b16ca0fc
00000000-0000-0000-0000-000000000000	36	e23wfdyqqvwb	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 17:39:11.422343+00	2025-10-14 17:39:11.422343+00	\N	925c9435-26ef-4300-bc5d-56d635569469
00000000-0000-0000-0000-000000000000	37	rk4umoiotut7	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 17:56:43.543218+00	2025-10-14 17:56:43.543218+00	\N	2f9e2c91-e03e-4eb0-851b-46357744784f
00000000-0000-0000-0000-000000000000	38	vtqzs6x6dwsc	c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af	f	2025-10-14 17:58:09.197832+00	2025-10-14 17:58:09.197832+00	\N	5160e064-82aa-4081-92c2-8be1ddd46c73
00000000-0000-0000-0000-000000000000	39	wudyvlshz72m	c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af	f	2025-10-14 17:58:25.774401+00	2025-10-14 17:58:25.774401+00	\N	45024469-7c16-41c4-8f58-d6fbcbf4e1b2
00000000-0000-0000-0000-000000000000	40	rjmhlm5i6ivj	f12781c5-9b29-4411-96e6-6fe20b7406a7	t	2025-10-14 18:08:01.459782+00	2025-10-14 19:07:51.635862+00	\N	6d8c5b46-955c-4fb6-9fb0-e8bd83b67b7f
00000000-0000-0000-0000-000000000000	41	dyve5yp7t4pn	f12781c5-9b29-4411-96e6-6fe20b7406a7	t	2025-10-14 19:07:51.643764+00	2025-10-14 19:07:52.669703+00	rjmhlm5i6ivj	6d8c5b46-955c-4fb6-9fb0-e8bd83b67b7f
00000000-0000-0000-0000-000000000000	42	hqt77e5jhxfp	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 19:07:52.670051+00	2025-10-14 19:07:52.670051+00	dyve5yp7t4pn	6d8c5b46-955c-4fb6-9fb0-e8bd83b67b7f
00000000-0000-0000-0000-000000000000	43	dnq3bwmiovjv	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 19:08:13.666884+00	2025-10-14 19:08:13.666884+00	\N	59af8e50-5084-47ef-8600-4747c7f38019
00000000-0000-0000-0000-000000000000	44	36hgyvg4pzws	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 19:11:11.893688+00	2025-10-14 19:11:11.893688+00	\N	643eabe6-fb2f-43cc-a8cf-64fdbbdcd1d5
00000000-0000-0000-0000-000000000000	45	cnmubwfl5jmd	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 19:11:54.82158+00	2025-10-14 19:11:54.82158+00	\N	d369d0fd-1cbc-4206-ae23-b00c282d329a
00000000-0000-0000-0000-000000000000	46	eo3cvgw5x2yr	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 19:13:46.737413+00	2025-10-14 19:13:46.737413+00	\N	0ba478f9-813c-497f-afac-b87d3c4dabe0
00000000-0000-0000-0000-000000000000	47	a4oxbudmvm3w	f12781c5-9b29-4411-96e6-6fe20b7406a7	t	2025-10-14 19:16:43.074602+00	2025-10-14 20:16:34.078765+00	\N	7c6b5aee-b1f0-48ad-82f5-da8b76e227ae
00000000-0000-0000-0000-000000000000	48	xw5uxrd7nd24	f12781c5-9b29-4411-96e6-6fe20b7406a7	t	2025-10-14 20:16:34.097154+00	2025-10-14 20:16:34.185682+00	a4oxbudmvm3w	7c6b5aee-b1f0-48ad-82f5-da8b76e227ae
00000000-0000-0000-0000-000000000000	49	ixos7m6na4wv	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 20:16:34.186063+00	2025-10-14 20:16:34.186063+00	xw5uxrd7nd24	7c6b5aee-b1f0-48ad-82f5-da8b76e227ae
00000000-0000-0000-0000-000000000000	50	bq6zuvwvytej	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-14 20:52:05.241069+00	2025-10-14 20:52:05.241069+00	\N	216cdf03-6ea5-4950-8d93-972486bec66a
00000000-0000-0000-0000-000000000000	51	afpvcrvrujd3	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 00:33:38.084259+00	2025-10-15 00:33:38.084259+00	\N	66241a70-33cf-452e-9b20-1795c5abd10c
00000000-0000-0000-0000-000000000000	52	mrforeqam3s2	1bb3cf75-366a-4758-8aa7-46712e003a81	f	2025-10-15 00:36:12.610221+00	2025-10-15 00:36:12.610221+00	\N	5015cbc3-09a0-4936-b3e5-8ba1efbddb54
00000000-0000-0000-0000-000000000000	53	icufirltduf4	1a9fa9d4-2357-4c3d-8cf3-f19abca88bbd	f	2025-10-15 00:36:36.148726+00	2025-10-15 00:36:36.148726+00	\N	1ec83460-ec53-4bf0-a9be-0fdaa0d3d394
00000000-0000-0000-0000-000000000000	54	47zrl6sslbzz	1bb3cf75-366a-4758-8aa7-46712e003a81	f	2025-10-15 00:36:46.266681+00	2025-10-15 00:36:46.266681+00	\N	b6630d5c-e877-42c0-8f09-0111a933f178
00000000-0000-0000-0000-000000000000	55	yh66tt6jhtyf	1bb3cf75-366a-4758-8aa7-46712e003a81	f	2025-10-15 00:37:58.212924+00	2025-10-15 00:37:58.212924+00	\N	9eb6ac83-067d-4803-9d12-822d0eb6eb97
00000000-0000-0000-0000-000000000000	56	ejqpellifnty	1bb3cf75-366a-4758-8aa7-46712e003a81	f	2025-10-15 00:40:24.492611+00	2025-10-15 00:40:24.492611+00	\N	867ee169-a48a-49a4-ae39-1aa54ea4ce5d
00000000-0000-0000-0000-000000000000	57	35gyduyd63vx	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 01:03:24.692236+00	2025-10-15 01:03:24.692236+00	\N	aecbd60f-2c5b-40ad-8f6b-e677308b6304
00000000-0000-0000-0000-000000000000	58	43qbam57z67b	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 01:05:33.76073+00	2025-10-15 01:05:33.76073+00	\N	b6e86331-8767-44c5-9074-7859b79506f9
00000000-0000-0000-0000-000000000000	59	jhncmh5zh63o	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 01:41:01.75249+00	2025-10-15 01:41:01.75249+00	\N	b49c9ee7-baf4-4d18-8ad2-7ecd93181f8e
00000000-0000-0000-0000-000000000000	60	rxkyjzqg7qxq	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 01:41:37.533887+00	2025-10-15 01:41:37.533887+00	\N	b01f711c-fdcb-4e16-b18a-31de4985b165
00000000-0000-0000-0000-000000000000	61	ehetce3z75mj	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 01:44:15.383052+00	2025-10-15 01:44:15.383052+00	\N	e5947936-e95b-463b-9aad-d7235fe078fd
00000000-0000-0000-0000-000000000000	62	w6aurrlgjdfa	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 01:46:03.237592+00	2025-10-15 01:46:03.237592+00	\N	657c454d-c763-46af-aebb-1d18fef56845
00000000-0000-0000-0000-000000000000	63	ruqsv2w6nr6y	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 01:57:28.50134+00	2025-10-15 01:57:28.50134+00	\N	e471e62a-7d18-49de-b5bd-a3fb0fae9f11
00000000-0000-0000-0000-000000000000	64	d6mizvsxo2gc	f1fd2ccd-d83d-4196-81f2-76399c4e4869	f	2025-10-15 02:09:59.423119+00	2025-10-15 02:09:59.423119+00	\N	8b487869-324e-4689-a439-dce404865ac5
00000000-0000-0000-0000-000000000000	65	l4hqgztnxai6	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 02:13:08.335571+00	2025-10-15 02:13:08.335571+00	\N	1460a0a2-b47c-4cd4-bf96-821bd5494b99
00000000-0000-0000-0000-000000000000	66	stiqfmpgjyhd	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 02:58:02.517438+00	2025-10-15 02:58:02.517438+00	\N	3103c6ab-618b-443e-9ab0-d04494cd05e6
00000000-0000-0000-0000-000000000000	67	cvbdabjtfiu2	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 03:39:59.592386+00	2025-10-15 03:39:59.592386+00	\N	d4cb97f2-1c41-4de0-b995-a1ee780fe079
00000000-0000-0000-0000-000000000000	68	xuur556sktil	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 03:59:00.751095+00	2025-10-15 03:59:00.751095+00	\N	ef4fe628-4af3-470f-98b9-72ea498d71e6
00000000-0000-0000-0000-000000000000	69	m75naarc34kv	f1fd2ccd-d83d-4196-81f2-76399c4e4869	f	2025-10-15 04:00:41.205727+00	2025-10-15 04:00:41.205727+00	\N	fd6a5937-6771-4efb-b826-ae14868d91c1
00000000-0000-0000-0000-000000000000	70	hp7mxztfeoz2	f12781c5-9b29-4411-96e6-6fe20b7406a7	f	2025-10-15 05:08:24.070495+00	2025-10-15 05:08:24.070495+00	\N	f6bd0f46-024c-4a08-ac88-d65e99a72546
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id) FROM stdin;
18eb5a01-ad58-4391-8b61-0c86e1b50620	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-06 22:01:16.321488+00	2025-10-06 22:01:16.321488+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.73.104	\N	\N
472e3a15-ade5-4fcf-a82d-71dd399ab478	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-06 22:05:35.279831+00	2025-10-06 22:05:35.279831+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.73.104	\N	\N
1bb08c73-5333-4831-b76e-60220b491720	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-06 22:09:01.486036+00	2025-10-06 22:09:01.486036+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.73.104	\N	\N
daa60c57-ee77-463e-8cdc-5a7e62fb66c6	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-06 22:18:33.102224+00	2025-10-06 22:18:33.102224+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.73.104	\N	\N
fbce58c4-aa01-4cf0-8429-4f30f0f5c9e2	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-06 22:24:09.308495+00	2025-10-06 22:24:09.308495+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.73.104	\N	\N
623b4da2-de59-4b9c-a057-e5b50812d02f	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 17:14:59.117431+00	2025-10-14 17:14:59.117431+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
a4ecfec7-0005-4f1f-bcfb-924033fdbc9e	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 17:26:22.622212+00	2025-10-14 17:26:22.622212+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
3bb4fe65-848c-45f8-af55-5455346a742b	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 17:26:26.899238+00	2025-10-14 17:26:26.899238+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
239c7e60-842b-4972-839b-fee8ff8e71b0	f1fd2ccd-d83d-4196-81f2-76399c4e4869	2025-10-14 17:27:08.406928+00	2025-10-14 17:27:08.406928+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
25169967-0f80-4788-b479-eb3416572756	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 17:27:56.183961+00	2025-10-14 17:27:56.183961+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
dce5a187-54ab-4ede-adf7-17e7184a2ee8	f1fd2ccd-d83d-4196-81f2-76399c4e4869	2025-10-14 17:29:27.137446+00	2025-10-14 17:29:27.137446+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
5d2820ad-8967-46ac-a60a-8e80b16ca0fc	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 17:37:17.247655+00	2025-10-14 17:37:17.247655+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
925c9435-26ef-4300-bc5d-56d635569469	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 17:39:11.421001+00	2025-10-14 17:39:11.421001+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
2f9e2c91-e03e-4eb0-851b-46357744784f	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 17:56:43.525385+00	2025-10-14 17:56:43.525385+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
5160e064-82aa-4081-92c2-8be1ddd46c73	c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af	2025-10-14 17:58:09.196214+00	2025-10-14 17:58:09.196214+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
45024469-7c16-41c4-8f58-d6fbcbf4e1b2	c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af	2025-10-14 17:58:25.773617+00	2025-10-14 17:58:25.773617+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
8b487869-324e-4689-a439-dce404865ac5	f1fd2ccd-d83d-4196-81f2-76399c4e4869	2025-10-15 02:09:59.410566+00	2025-10-15 02:09:59.410566+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
6d8c5b46-955c-4fb6-9fb0-e8bd83b67b7f	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 18:08:01.456962+00	2025-10-14 19:07:52.674833+00	\N	aal1	\N	2025-10-14 19:07:52.674755	python-httpx/0.28.1	223.233.75.45	\N	\N
59af8e50-5084-47ef-8600-4747c7f38019	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 19:08:13.661764+00	2025-10-14 19:08:13.661764+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
643eabe6-fb2f-43cc-a8cf-64fdbbdcd1d5	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 19:11:11.892511+00	2025-10-14 19:11:11.892511+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
d369d0fd-1cbc-4206-ae23-b00c282d329a	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 19:11:54.820768+00	2025-10-14 19:11:54.820768+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
0ba478f9-813c-497f-afac-b87d3c4dabe0	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 19:13:46.735492+00	2025-10-14 19:13:46.735492+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
1460a0a2-b47c-4cd4-bf96-821bd5494b99	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 02:13:08.332643+00	2025-10-15 02:13:08.332643+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
7c6b5aee-b1f0-48ad-82f5-da8b76e227ae	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 19:16:43.073462+00	2025-10-14 20:16:34.189597+00	\N	aal1	\N	2025-10-14 20:16:34.189517	python-httpx/0.28.1	223.233.75.45	\N	\N
216cdf03-6ea5-4950-8d93-972486bec66a	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-14 20:52:05.227404+00	2025-10-14 20:52:05.227404+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
66241a70-33cf-452e-9b20-1795c5abd10c	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 00:33:38.057145+00	2025-10-15 00:33:38.057145+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
5015cbc3-09a0-4936-b3e5-8ba1efbddb54	1bb3cf75-366a-4758-8aa7-46712e003a81	2025-10-15 00:36:12.608998+00	2025-10-15 00:36:12.608998+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
1ec83460-ec53-4bf0-a9be-0fdaa0d3d394	1a9fa9d4-2357-4c3d-8cf3-f19abca88bbd	2025-10-15 00:36:36.147843+00	2025-10-15 00:36:36.147843+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
b6630d5c-e877-42c0-8f09-0111a933f178	1bb3cf75-366a-4758-8aa7-46712e003a81	2025-10-15 00:36:46.264262+00	2025-10-15 00:36:46.264262+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
9eb6ac83-067d-4803-9d12-822d0eb6eb97	1bb3cf75-366a-4758-8aa7-46712e003a81	2025-10-15 00:37:58.210527+00	2025-10-15 00:37:58.210527+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
867ee169-a48a-49a4-ae39-1aa54ea4ce5d	1bb3cf75-366a-4758-8aa7-46712e003a81	2025-10-15 00:40:24.491221+00	2025-10-15 00:40:24.491221+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
aecbd60f-2c5b-40ad-8f6b-e677308b6304	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 01:03:24.674865+00	2025-10-15 01:03:24.674865+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
b6e86331-8767-44c5-9074-7859b79506f9	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 01:05:33.759428+00	2025-10-15 01:05:33.759428+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
b49c9ee7-baf4-4d18-8ad2-7ecd93181f8e	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 01:41:01.736574+00	2025-10-15 01:41:01.736574+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
b01f711c-fdcb-4e16-b18a-31de4985b165	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 01:41:37.533135+00	2025-10-15 01:41:37.533135+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
e5947936-e95b-463b-9aad-d7235fe078fd	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 01:44:15.380545+00	2025-10-15 01:44:15.380545+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
657c454d-c763-46af-aebb-1d18fef56845	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 01:46:03.228235+00	2025-10-15 01:46:03.228235+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
e471e62a-7d18-49de-b5bd-a3fb0fae9f11	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 01:57:28.494291+00	2025-10-15 01:57:28.494291+00	\N	aal1	\N	\N	python-httpx/0.28.1	223.233.75.45	\N	\N
3103c6ab-618b-443e-9ab0-d04494cd05e6	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 02:58:02.496055+00	2025-10-15 02:58:02.496055+00	\N	aal1	\N	\N	python-httpx/0.28.1	45.116.207.212	\N	\N
d4cb97f2-1c41-4de0-b995-a1ee780fe079	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 03:39:59.572291+00	2025-10-15 03:39:59.572291+00	\N	aal1	\N	\N	python-httpx/0.28.1	45.116.207.212	\N	\N
ef4fe628-4af3-470f-98b9-72ea498d71e6	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 03:59:00.737826+00	2025-10-15 03:59:00.737826+00	\N	aal1	\N	\N	python-httpx/0.28.1	47.15.114.124	\N	\N
fd6a5937-6771-4efb-b826-ae14868d91c1	f1fd2ccd-d83d-4196-81f2-76399c4e4869	2025-10-15 04:00:41.190743+00	2025-10-15 04:00:41.190743+00	\N	aal1	\N	\N	python-httpx/0.28.1	47.15.114.124	\N	\N
f6bd0f46-024c-4a08-ac88-d65e99a72546	f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-15 05:08:24.057797+00	2025-10-15 05:08:24.057797+00	\N	aal1	\N	\N	python-httpx/0.28.1	47.15.115.130	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	1a9fa9d4-2357-4c3d-8cf3-f19abca88bbd	authenticated	authenticated	admin2@smartevev.com	$2a$10$CyX3I/OynOrJ7EX/xj./JORO39isMam.pAK6Wxr.oF/p55qmsrYBu	2025-10-15 00:36:36.142444+00	\N		\N		\N			\N	2025-10-15 00:36:36.147758+00	{"provider": "email", "providers": ["email"]}	{"sub": "1a9fa9d4-2357-4c3d-8cf3-f19abca88bbd", "name": "Admin User", "role": "admin", "email": "admin2@smartevev.com", "email_verified": true, "phone_verified": false}	\N	2025-10-15 00:36:36.13467+00	2025-10-15 00:36:36.149658+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af	authenticated	authenticated	test@example.com	$2a$10$ukN2qLc7J6qUDFXUMxwzzebPg5aoGZOHr.7lq8BwcfyqREr6plW1i	2025-10-14 17:58:09.188161+00	\N		\N		\N			\N	2025-10-14 17:58:25.773534+00	{"provider": "email", "providers": ["email"]}	{"sub": "c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af", "city": "Test City", "name": "Test User", "email": "test@example.com", "phone": "+1234567890", "address": "123 Test St", "email_verified": true, "phone_verified": false}	\N	2025-10-14 17:58:09.145256+00	2025-10-14 17:58:25.775328+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	1bb3cf75-366a-4758-8aa7-46712e003a81	authenticated	authenticated	admin@smartevev.com	$2a$10$tTYuDkQsxfKxX9i2/Iq7Y.Z1OZx5KD3DuGfDtCoN94wXTNbdVUmvi	2025-10-15 00:36:12.597524+00	\N		\N		\N			\N	2025-10-15 00:40:24.49113+00	{"provider": "email", "providers": ["email"]}	{"sub": "1bb3cf75-366a-4758-8aa7-46712e003a81", "name": "Admin User", "role": "admin", "email": "admin@smartevev.com", "email_verified": true, "phone_verified": false}	\N	2025-10-15 00:36:12.551559+00	2025-10-15 00:40:24.494044+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	9cf20ae2-2c44-4421-9335-4d5517ef489c	authenticated	authenticated	squarepants.bob069@gmail.com	$2a$10$X3vtvW/rUQQm164w/2Jv4eKA9Czgs7D9Wqhw2ufWRY.H5KiEEHmt6	2025-10-15 03:14:46.655407+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-10-15 03:14:46.593662+00	2025-10-15 03:14:46.657025+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	f1fd2ccd-d83d-4196-81f2-76399c4e4869	authenticated	authenticated	akshatprj21@gmail.com	$2a$10$LL9Wkt.w0ThbQCEAKnvkT.CqRzDZbZLgQ8HXjIx.dbDm6f0lKH2z6	2025-10-14 17:27:08.403178+00	\N		\N		\N			\N	2025-10-15 04:00:41.189828+00	{"provider": "email", "providers": ["email"]}	{"sub": "f1fd2ccd-d83d-4196-81f2-76399c4e4869", "city": "sadsdasd", "name": "Akshat", "email": "akshatprj21@gmail.com", "phone": "9546546545", "address": "asdasdasd", "email_verified": true, "phone_verified": false}	\N	2025-10-14 17:27:08.380026+00	2025-10-15 04:00:41.234272+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	f12781c5-9b29-4411-96e6-6fe20b7406a7	authenticated	authenticated	akshat.prj@gmail.com	$2a$10$aYKJzEqL1VAf924S2FaQqelGB4DhHOnZo/8KvalV7KgWvirwdb5tC	2025-10-06 21:59:28.850585+00	\N		\N		\N			\N	2025-10-15 05:08:24.055889+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-10-06 21:59:28.845994+00	2025-10-15 05:08:24.082126+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, assigned_at, email, name, phone, address, city, state, country, zip_code, created_at, updated_at) FROM stdin;
f12781c5-9b29-4411-96e6-6fe20b7406a7	2025-10-06 22:00:51.26738+00	akshat.prj@gmail.com	Akshat Kumar	\N	\N	\N	\N	India	\N	2025-10-06 22:00:51.26738+00	2025-10-06 22:00:51.26738+00
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, vehicle_id, station_id, user_id, start_time, end_time, status, created_at, updated_at, slot) FROM stdin;
\.


--
-- Data for Name: charging_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.charging_sessions (id, vehicle_id, station_id, user_id, start_time, end_time, energy_consumed, cost, status, created_at, updated_at, slot) FROM stdin;
\.


--
-- Data for Name: charging_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.charging_slots (id, station_id, slot_number, charger_type, status, current_vehicle, last_used, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedback (id, user_id, station_id, vehicle_id, rating, comments, created_at) FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, name, email, phone, address, city, created_at, updated_at) FROM stdin;
f1fd2ccd-d83d-4196-81f2-76399c4e4869	Akshat	akshatprj21@gmail.com	9546546545	asdasdasd	sadsdasd	2025-10-14 17:27:08.37965+00	2025-10-14 17:27:08.37965+00
c4bc52e9-d9d6-4705-a66b-b1db3cd0d3af	Test User	test@example.com	+1234567890	123 Test St	Test City	2025-10-14 17:58:09.144336+00	2025-10-14 17:58:09.144336+00
1bb3cf75-366a-4758-8aa7-46712e003a81	Admin User	admin@smartevev.com				2025-10-15 00:36:12.550441+00	2025-10-15 00:36:12.550441+00
1a9fa9d4-2357-4c3d-8cf3-f19abca88bbd	Admin User	admin2@smartevev.com				2025-10-15 00:36:36.134339+00	2025-10-15 00:36:36.134339+00
9cf20ae2-2c44-4421-9335-4d5517ef489c		squarepants.bob069@gmail.com				2025-10-15 03:14:46.589582+00	2025-10-15 03:14:46.589582+00
\.


--
-- Data for Name: station_managers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.station_managers (id, station_id, assigned_at, email, name, phone, address, city, state, country, zip_code, created_at, updated_at) FROM stdin;
9cf20ae2-2c44-4421-9335-4d5517ef489c	0d831107-1296-4877-ae92-527e557aa415	2025-10-15 03:16:41+00	squarepants.bob069@gmail.com	Station Manager	\N	\N	\N	\N	India	\N	2025-10-15 03:16:49.12723+00	2025-10-15 03:16:49.12723+00
\.


--
-- Data for Name: station_vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.station_vehicles (id, station_id, vehicle_id, parked_at, departed_at, status) FROM stdin;
\.


--
-- Data for Name: stations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stations (id, name, latitude, longitude, address, city, state, country, zip_code, capacity, available_slots, status, created_at, updated_at) FROM stdin;
5f90bc61-ac2a-48f5-afb3-5ed3057c0a43	Central Station	28.613900	77.209000	123 Main Street	New Delhi	Delhi	India	110001	50	20	active	2025-10-14 21:02:58.165092+00	2025-10-14 21:02:58.165092+00
bdc0befb-bf5f-4e1b-9899-cfa89c29f0cb	EV	30.316500	78.032200	\N	dehradun	\N	India	\N	10	10	active	2025-10-15 01:11:52.841976+00	2025-10-15 01:11:52.841976+00
7cfa62be-d1ed-4b0e-a13c-2e83a31aa2e0	ev	12.654650	65.456400	\N	dehradun	\N	India	\N	10	10	active	2025-10-15 01:14:03.596319+00	2025-10-15 01:14:03.596319+00
0d831107-1296-4877-ae92-527e557aa415	ev st	956.465400	40.654685	\N	dehra	\N	India	\N	0	10	active	2025-10-15 01:35:54.191634+00	2025-10-15 01:35:54.191634+00
bc239761-0aee-4aff-8e94-c48b0d491b8c	ev st	956.465400	440.654685	\N	dehra	\N	India	\N	0	10	active	2025-10-15 01:35:54.366886+00	2025-10-15 01:35:54.366886+00
78f34356-7839-4184-ac3b-4aba1b828531	ev sation	5.466400	70.250000	\N	ded	\N	India	\N	10	10	active	2025-10-15 01:38:36.518527+00	2025-10-15 01:38:36.518527+00
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicles (id, owner_id, plate_number, vehicle_type, brand, model, color, battery_capacity_kwh, range_km, charging_connector, registered_at, last_service_date, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-10-04 12:33:57
20211116045059	2025-10-04 12:33:58
20211116050929	2025-10-04 12:33:58
20211116051442	2025-10-04 12:33:59
20211116212300	2025-10-04 12:34:00
20211116213355	2025-10-04 12:34:00
20211116213934	2025-10-04 12:34:01
20211116214523	2025-10-04 12:34:02
20211122062447	2025-10-04 12:34:03
20211124070109	2025-10-04 12:34:03
20211202204204	2025-10-04 12:34:04
20211202204605	2025-10-04 12:34:05
20211210212804	2025-10-04 12:34:07
20211228014915	2025-10-04 12:34:07
20220107221237	2025-10-04 12:34:08
20220228202821	2025-10-04 12:34:09
20220312004840	2025-10-04 12:34:09
20220603231003	2025-10-04 12:34:11
20220603232444	2025-10-04 12:34:11
20220615214548	2025-10-04 12:34:12
20220712093339	2025-10-04 12:34:13
20220908172859	2025-10-04 12:34:13
20220916233421	2025-10-04 12:34:14
20230119133233	2025-10-04 12:34:15
20230128025114	2025-10-04 12:34:16
20230128025212	2025-10-04 12:34:16
20230227211149	2025-10-04 12:34:17
20230228184745	2025-10-04 12:34:18
20230308225145	2025-10-04 12:34:19
20230328144023	2025-10-04 12:34:19
20231018144023	2025-10-04 12:34:20
20231204144023	2025-10-04 12:34:21
20231204144024	2025-10-04 12:34:22
20231204144025	2025-10-04 12:34:23
20240108234812	2025-10-04 12:34:23
20240109165339	2025-10-04 12:34:24
20240227174441	2025-10-04 12:34:25
20240311171622	2025-10-04 12:34:26
20240321100241	2025-10-04 12:34:27
20240401105812	2025-10-04 12:34:29
20240418121054	2025-10-04 12:34:30
20240523004032	2025-10-04 12:34:33
20240618124746	2025-10-04 12:34:33
20240801235015	2025-10-04 12:34:34
20240805133720	2025-10-04 12:34:35
20240827160934	2025-10-04 12:34:35
20240919163303	2025-10-04 12:34:36
20240919163305	2025-10-04 12:34:37
20241019105805	2025-10-04 12:34:38
20241030150047	2025-10-04 12:34:40
20241108114728	2025-10-04 12:34:41
20241121104152	2025-10-04 12:34:42
20241130184212	2025-10-04 12:34:43
20241220035512	2025-10-04 12:34:43
20241220123912	2025-10-04 12:34:44
20241224161212	2025-10-04 12:34:45
20250107150512	2025-10-04 12:34:45
20250110162412	2025-10-04 12:34:46
20250123174212	2025-10-04 12:34:47
20250128220012	2025-10-04 12:34:48
20250506224012	2025-10-04 12:34:48
20250523164012	2025-10-04 12:34:49
20250714121412	2025-10-04 12:34:49
20250905041441	2025-10-04 12:34:50
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-10-04 12:33:56.761962
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-10-04 12:33:56.773758
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-10-04 12:33:56.781685
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-10-04 12:33:56.814719
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-10-04 12:33:56.87787
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-10-04 12:33:56.886292
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-10-04 12:33:56.894743
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-10-04 12:33:56.90063
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-10-04 12:33:56.906298
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-10-04 12:33:56.913835
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-10-04 12:33:56.922425
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-10-04 12:33:56.932474
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-10-04 12:33:56.944492
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-10-04 12:33:56.954338
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-10-04 12:33:56.966786
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-10-04 12:33:56.995127
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-10-04 12:33:57.005907
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-10-04 12:33:57.012612
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-10-04 12:33:57.020223
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-10-04 12:33:57.028363
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-10-04 12:33:57.034062
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-10-04 12:33:57.042596
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-10-04 12:33:57.062723
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-10-04 12:33:57.077011
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-10-04 12:33:57.084646
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-10-04 12:33:57.091639
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-10-04 12:33:57.097641
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-10-04 12:33:57.113156
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-10-04 12:33:57.270282
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-10-04 12:33:57.280494
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-10-04 12:33:57.288118
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-10-04 12:33:57.296627
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-10-04 12:33:57.304551
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-10-04 12:33:57.326892
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-10-04 12:33:57.329233
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-10-04 12:33:57.336933
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-10-04 12:33:57.342966
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-10-04 12:33:57.351093
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-10-04 12:33:57.359213
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-10-04 12:33:57.372309
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-10-04 12:33:57.380005
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-10-04 12:33:57.389432
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-10-04 12:33:57.397161
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-10-04 12:33:57.407746
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 70, true);


--
-- Name: station_vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.station_vehicles_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: charging_sessions charging_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charging_sessions
    ADD CONSTRAINT charging_sessions_pkey PRIMARY KEY (id);


--
-- Name: charging_slots charging_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charging_slots
    ADD CONSTRAINT charging_slots_pkey PRIMARY KEY (id);


--
-- Name: charging_slots charging_slots_station_id_slot_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charging_slots
    ADD CONSTRAINT charging_slots_station_id_slot_number_key UNIQUE (station_id, slot_number);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_key UNIQUE (email);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: station_managers station_managers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_managers
    ADD CONSTRAINT station_managers_pkey PRIMARY KEY (id);


--
-- Name: station_managers station_managers_user_id_station_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_managers
    ADD CONSTRAINT station_managers_user_id_station_id_key UNIQUE (id, station_id);


--
-- Name: station_vehicles station_vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_vehicles
    ADD CONSTRAINT station_vehicles_pkey PRIMARY KEY (id);


--
-- Name: station_vehicles station_vehicles_station_id_vehicle_id_status_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_vehicles
    ADD CONSTRAINT station_vehicles_station_id_vehicle_id_status_key UNIQUE (station_id, vehicle_id, status);


--
-- Name: stations stations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stations
    ADD CONSTRAINT stations_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_plate_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key UNIQUE (plate_number);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_station_vehicles_station; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_station_vehicles_station ON public.station_vehicles USING btree (station_id);


--
-- Name: idx_station_vehicles_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_station_vehicles_vehicle ON public.station_vehicles USING btree (vehicle_id);


--
-- Name: idx_stations_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stations_city ON public.stations USING btree (city);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: users trg_create_profile; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER trg_create_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: admins admins_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_slot_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_slot_fkey FOREIGN KEY (slot) REFERENCES public.charging_slots(id) ON UPDATE CASCADE;


--
-- Name: bookings bookings_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: charging_sessions charging_sessions_slot_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charging_sessions
    ADD CONSTRAINT charging_sessions_slot_fkey FOREIGN KEY (slot) REFERENCES public.charging_slots(id) ON UPDATE CASCADE;


--
-- Name: charging_sessions charging_sessions_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charging_sessions
    ADD CONSTRAINT charging_sessions_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;


--
-- Name: charging_sessions charging_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charging_sessions
    ADD CONSTRAINT charging_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: charging_sessions charging_sessions_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charging_sessions
    ADD CONSTRAINT charging_sessions_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: charging_slots charging_slots_current_vehicle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charging_slots
    ADD CONSTRAINT charging_slots_current_vehicle_fkey FOREIGN KEY (current_vehicle) REFERENCES public.vehicles(id);


--
-- Name: charging_slots charging_slots_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charging_slots
    ADD CONSTRAINT charging_slots_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;


--
-- Name: feedback feedback_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;


--
-- Name: feedback feedback_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: feedback feedback_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: station_managers station_managers_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_managers
    ADD CONSTRAINT station_managers_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: station_managers station_managers_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_managers
    ADD CONSTRAINT station_managers_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;


--
-- Name: station_vehicles station_vehicles_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_vehicles
    ADD CONSTRAINT station_vehicles_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.stations(id) ON DELETE CASCADE;


--
-- Name: station_vehicles station_vehicles_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station_vehicles
    ADD CONSTRAINT station_vehicles_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;


--
-- Name: vehicles vehicles_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: admins Admins can manage all admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all admins" ON public.admins USING ((id = auth.uid())) WITH CHECK ((id = auth.uid()));


--
-- Name: bookings Admins can manage all bookings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all bookings" ON public.bookings USING ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid()))));


--
-- Name: charging_sessions Admins can manage all charging sessions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all charging sessions" ON public.charging_sessions USING ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid()))));


--
-- Name: feedback Admins can manage all feedback; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all feedback" ON public.feedback USING ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid()))));


--
-- Name: profiles Admins can manage all profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all profiles" ON public.profiles USING ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid()))));


--
-- Name: station_managers Admins can manage all station managers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all station managers" ON public.station_managers USING ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid()))));


--
-- Name: station_vehicles Admins can manage all station vehicles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all station vehicles" ON public.station_vehicles USING ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid()))));


--
-- Name: stations Admins can manage all stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all stations" ON public.stations USING ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid())))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid()))));


--
-- Name: vehicles Admins can manage all vehicles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage all vehicles" ON public.vehicles USING ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid()))));


--
-- Name: charging_slots Admins full access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins full access" ON public.charging_slots USING ((EXISTS ( SELECT 1
   FROM public.admins a
  WHERE (a.id = auth.uid()))));


--
-- Name: vehicles App users can manage their own vehicles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "App users can manage their own vehicles" ON public.vehicles FOR UPDATE USING ((owner_id = auth.uid())) WITH CHECK ((owner_id = auth.uid()));


--
-- Name: bookings Managers can access bookings in their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can access bookings in their stations" ON public.bookings FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = bookings.station_id)))));


--
-- Name: charging_sessions Managers can access charging sessions in their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can access charging sessions in their stations" ON public.charging_sessions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_sessions.station_id)))));


--
-- Name: bookings Managers can insert bookings for their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can insert bookings for their stations" ON public.bookings FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = bookings.station_id)))));


--
-- Name: charging_sessions Managers can insert charging sessions in their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can insert charging sessions in their stations" ON public.charging_sessions FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_sessions.station_id)))));


--
-- Name: station_vehicles Managers can insert vehicles in their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can insert vehicles in their stations" ON public.station_vehicles FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = station_vehicles.station_id)))));


--
-- Name: station_managers Managers can read station managers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can read station managers" ON public.station_managers FOR SELECT USING ((id = auth.uid()));


--
-- Name: stations Managers can read their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can read their stations" ON public.stations FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = stations.id)))));


--
-- Name: station_vehicles Managers can read vehicles in their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can read vehicles in their stations" ON public.station_vehicles FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = station_vehicles.station_id)))));


--
-- Name: bookings Managers can update bookings in their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can update bookings in their stations" ON public.bookings FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = bookings.station_id))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = bookings.station_id)))));


--
-- Name: charging_sessions Managers can update charging sessions in their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can update charging sessions in their stations" ON public.charging_sessions FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_sessions.station_id))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_sessions.station_id)))));


--
-- Name: station_managers Managers can update their own station manager records; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can update their own station manager records" ON public.station_managers FOR UPDATE USING ((id = auth.uid())) WITH CHECK ((id = auth.uid()));


--
-- Name: stations Managers can update their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can update their stations" ON public.stations FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = stations.id))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = stations.id)))));


--
-- Name: station_vehicles Managers can update vehicles in their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can update vehicles in their stations" ON public.station_vehicles FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = station_vehicles.station_id))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = station_vehicles.station_id)))));


--
-- Name: charging_slots Managers insert their station slots; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers insert their station slots" ON public.charging_slots FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_slots.station_id)))));


--
-- Name: charging_slots Managers read their station slots; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers read their station slots" ON public.charging_slots FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_slots.station_id)))));


--
-- Name: charging_slots Managers update their station slots; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers update their station slots" ON public.charging_slots FOR UPDATE WITH CHECK ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = charging_slots.station_id)))));


--
-- Name: feedback Station managers can read feedback for their stations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Station managers can read feedback for their stations" ON public.feedback FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.station_managers sm
  WHERE ((sm.id = auth.uid()) AND (sm.station_id = feedback.station_id)))));


--
-- Name: vehicles Station managers can view their vehicles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Station managers can view their vehicles" ON public.vehicles FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.station_vehicles sv
     JOIN public.station_managers sm ON ((sm.station_id = sv.station_id)))
  WHERE ((sv.vehicle_id = vehicles.id) AND (sm.id = auth.uid())))));


--
-- Name: feedback Users can insert their feedback; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their feedback" ON public.feedback FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: bookings Users can manage their own bookings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage their own bookings" ON public.bookings USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: charging_sessions Users can manage their own charging sessions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage their own charging sessions" ON public.charging_sessions USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: feedback Users can read their own feedback; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can read their own feedback" ON public.feedback FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: profiles Users can read their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: charging_slots Users view slot availability; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users view slot availability" ON public.charging_slots FOR SELECT USING ((status = 'available'::text));


--
-- Name: admins; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_insert_self; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY profiles_insert_self ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION create_user_profile(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_user_profile() TO anon;
GRANT ALL ON FUNCTION public.create_user_profile() TO authenticated;
GRANT ALL ON FUNCTION public.create_user_profile() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE admins; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admins TO anon;
GRANT ALL ON TABLE public.admins TO authenticated;
GRANT ALL ON TABLE public.admins TO service_role;


--
-- Name: TABLE bookings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bookings TO anon;
GRANT ALL ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.bookings TO service_role;


--
-- Name: TABLE charging_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.charging_sessions TO anon;
GRANT ALL ON TABLE public.charging_sessions TO authenticated;
GRANT ALL ON TABLE public.charging_sessions TO service_role;


--
-- Name: TABLE charging_slots; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.charging_slots TO anon;
GRANT ALL ON TABLE public.charging_slots TO authenticated;
GRANT ALL ON TABLE public.charging_slots TO service_role;


--
-- Name: TABLE feedback; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.feedback TO anon;
GRANT ALL ON TABLE public.feedback TO authenticated;
GRANT ALL ON TABLE public.feedback TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE station_managers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.station_managers TO anon;
GRANT ALL ON TABLE public.station_managers TO authenticated;
GRANT ALL ON TABLE public.station_managers TO service_role;


--
-- Name: TABLE station_vehicles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.station_vehicles TO anon;
GRANT ALL ON TABLE public.station_vehicles TO authenticated;
GRANT ALL ON TABLE public.station_vehicles TO service_role;


--
-- Name: SEQUENCE station_vehicles_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.station_vehicles_id_seq TO anon;
GRANT ALL ON SEQUENCE public.station_vehicles_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.station_vehicles_id_seq TO service_role;


--
-- Name: TABLE stations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.stations TO anon;
GRANT ALL ON TABLE public.stations TO authenticated;
GRANT ALL ON TABLE public.stations TO service_role;


--
-- Name: TABLE vehicles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vehicles TO anon;
GRANT ALL ON TABLE public.vehicles TO authenticated;
GRANT ALL ON TABLE public.vehicles TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict QGI5QoGH9ACNbHNvI2EwcegwbPLfm4aQ2VHMMB6Eyvg0D1PliPgLRj8kcWhriy7

--
-- PostgreSQL database cluster dump complete
--

