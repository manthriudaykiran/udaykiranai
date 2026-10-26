-- ============================================================================
-- AI FREEDOM WITH UDAY — FINAL PRODUCTION SECURITY MIGRATION (V1.2)
-- Canonical Database Migration Script
-- ============================================================================
-- Architecture & Guarantees:
-- 1. Idempotent & repeatable (safe to run on fresh or existing databases).
-- 2. Concurrency-safe sliding-window rate limiting via public.rate_limit_events
--    and pg_advisory_xact_lock serialization.
-- 3. Anonymous table access and public RPC invocation completely revoked.
-- 4. Registration and click tracking RPC execution granted strictly to service_role.
-- 5. Zero admin DELETE privileges (admins can only SELECT and UPDATE status/notes).
-- 6. Hardened SECURITY DEFINER functions with search_path = '' and fully qualified
--    schema references to eliminate search_path hijacking.
-- 7. Zero destructive operations on existing learner records.
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TABLE: public.learners
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.learners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_token UUID DEFAULT gen_random_uuid() NOT NULL,
    full_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    profession TEXT NOT NULL,
    ai_knowledge_level TEXT NOT NULL,
    learning_goal TEXT NOT NULL,
    privacy_consent BOOLEAN NOT NULL,
    marketing_consent BOOLEAN DEFAULT FALSE NOT NULL,
    source TEXT DEFAULT 'Direct Website' NOT NULL,
    utm_source TEXT,
    utm_campaign TEXT,
    drive_accessed BOOLEAN DEFAULT FALSE NOT NULL,
    whatsapp_channel_clicked BOOLEAN DEFAULT FALSE NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL,
    admin_notes TEXT DEFAULT '' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT pg_catalog.now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT pg_catalog.now() NOT NULL
);

-- Idempotent constraint verification
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'uq_learners_whatsapp' 
        AND conrelid = 'public.learners'::regclass
    ) THEN
        ALTER TABLE public.learners ADD CONSTRAINT uq_learners_whatsapp UNIQUE (whatsapp_number);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_learners_privacy_consent' 
        AND conrelid = 'public.learners'::regclass
    ) THEN
        ALTER TABLE public.learners ADD CONSTRAINT chk_learners_privacy_consent CHECK (privacy_consent = TRUE);
    END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_learners_created_at ON public.learners (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learners_status ON public.learners (status);
CREATE INDEX IF NOT EXISTS idx_learners_whatsapp ON public.learners (whatsapp_number);

-- ============================================================================
-- 2. TABLE: public.rate_limit_events (Sliding-Window Log)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.rate_limit_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    identifier TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT pg_catalog.now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_lookup 
ON public.rate_limit_events (identifier, created_at DESC);


-- ============================================================================
-- 3. TABLE: public.admin_users (Allowlist of Verified Auth User UIDs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'admin' NOT NULL CHECK (role IN ('super_admin', 'admin')),
    created_at TIMESTAMPTZ DEFAULT pg_catalog.now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (email);

-- ============================================================================
-- 4. FUNCTION: public.is_admin()
-- STABLE SECURITY DEFINER verifying authenticated caller against admin_users
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE user_id = auth.uid()
  );
$$;

ALTER FUNCTION public.is_admin() OWNER TO postgres;

-- ============================================================================
-- 5. FUNCTION: public.check_rate_limit()
-- Concurrency-Safe Sliding-Window Rate Limiter
-- Serializes concurrent requests per identifier using pg_advisory_xact_lock
-- ============================================================================
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_identifier TEXT,
    p_max_attempts INT,
    p_window_seconds INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_now TIMESTAMPTZ := pg_catalog.now();
    v_window_start TIMESTAMPTZ;
    v_count INT;
BEGIN
    -- Validate input thresholds (reject NULL, zero, and negative values)
    IF p_max_attempts IS NULL OR p_max_attempts <= 0 OR
       p_window_seconds IS NULL OR p_window_seconds <= 0 THEN
        RETURN FALSE;
    END IF;

    -- Validate input format: exactly 64 lowercase hexadecimal characters (HMAC SHA-256)
    IF p_identifier IS NULL OR NOT (p_identifier ~ '^[0-9a-f]{64}$') THEN
        RETURN FALSE;
    END IF;

    v_window_start := v_now - (p_window_seconds || ' seconds')::INTERVAL;

    -- Concurrency-Safe Advisory Transaction Lock scoped to hashed identifier
    -- Automatically released at the end of the transaction
    PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(p_identifier));

    -- Prune expired events for this identifier to maintain bounded table size
    DELETE FROM public.rate_limit_events
    WHERE identifier = p_identifier AND created_at < v_window_start;

    -- Count active attempts within the exact sliding window [now - window, now]
    SELECT pg_catalog.count(*) INTO v_count
    FROM public.rate_limit_events
    WHERE identifier = p_identifier AND created_at >= v_window_start;

    -- Strict threshold enforcement
    IF v_count >= p_max_attempts THEN
        RETURN FALSE;
    END IF;

    -- Record attempt in sliding window
    INSERT INTO public.rate_limit_events (identifier, created_at)
    VALUES (p_identifier, v_now);

    RETURN TRUE;
END;
$$;

ALTER FUNCTION public.check_rate_limit(TEXT, INT, INT) OWNER TO postgres;

-- ============================================================================
-- 6. FUNCTION: public.submit_learner_registration()
-- Privileged serverless RPC executed exclusively by service_role
-- ============================================================================
CREATE OR REPLACE FUNCTION public.submit_learner_registration(
    p_full_name TEXT,
    p_whatsapp_number TEXT,
    p_profession TEXT,
    p_ai_knowledge_level TEXT,
    p_learning_goal TEXT,
    p_privacy_consent BOOLEAN,
    p_marketing_consent BOOLEAN DEFAULT FALSE,
    p_source TEXT DEFAULT 'Direct Website',
    p_utm_source TEXT DEFAULT NULL,
    p_utm_campaign TEXT DEFAULT NULL,
    p_client_ip_hash TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_clean_phone TEXT;
    v_new_id UUID;
    v_new_token UUID;
    v_rate_allowed BOOLEAN;
BEGIN
    -- Mandatory sliding-window rate limit verification (6 attempts per 600s)
    -- Validates exactly 64 lowercase hexadecimal characters (HMAC SHA-256)
    IF p_client_ip_hash IS NULL OR NOT (p_client_ip_hash ~ '^[0-9a-f]{64}$') THEN
        RETURN pg_catalog.jsonb_build_object(
            'success', false,
            'error_code', 'INVALID_IDENTIFIER',
            'error', 'Registration request verification failed.'
        );
    END IF;

    v_rate_allowed := public.check_rate_limit(p_client_ip_hash, 6, 600);
    IF NOT v_rate_allowed THEN
        RETURN pg_catalog.jsonb_build_object(
            'success', false, 
            'error_code', 'RATE_LIMITED',
            'error', 'Too many registration requests. Please wait a few minutes before trying again.'
        );
    END IF;

    -- Explicit privacy consent requirement (No silent default)
    IF p_privacy_consent IS NOT TRUE THEN
        RETURN pg_catalog.jsonb_build_object(
            'success', false, 
            'error_code', 'CONSENT_REQUIRED',
            'error', 'Explicit privacy consent is required to receive the free starter kit.'
        );
    END IF;

    -- Explicit NULL and empty-string validation for full name
    IF p_full_name IS NULL OR pg_catalog.btrim(p_full_name) = '' OR pg_catalog.length(pg_catalog.btrim(p_full_name)) < 2 THEN
        RETURN pg_catalog.jsonb_build_object(
            'success', false, 
            'error_code', 'INVALID_NAME',
            'error', 'Full name is required (minimum 2 characters).'
        );
    END IF;

    -- Explicit NULL and empty-string validation for WhatsApp number
    IF p_whatsapp_number IS NULL OR pg_catalog.btrim(p_whatsapp_number) = '' THEN
        RETURN pg_catalog.jsonb_build_object(
            'success', false, 
            'error_code', 'INVALID_PHONE',
            'error', 'WhatsApp phone number is required.'
        );
    END IF;

    v_clean_phone := pg_catalog.regexp_replace(p_whatsapp_number, '[^0-9+]', '', 'g');
    IF pg_catalog.length(v_clean_phone) < 8 OR pg_catalog.length(v_clean_phone) > 16 THEN
        RETURN pg_catalog.jsonb_build_object(
            'success', false, 
            'error_code', 'INVALID_PHONE',
            'error', 'Invalid WhatsApp phone number.'
        );
    END IF;

    -- Atomic insert with conflict protection on whatsapp_number
    INSERT INTO public.learners (
        full_name, whatsapp_number, profession, ai_knowledge_level,
        learning_goal, privacy_consent, marketing_consent, source,
        utm_source, utm_campaign, status
    ) VALUES (
        pg_catalog.btrim(p_full_name), v_clean_phone, p_profession, p_ai_knowledge_level,
        pg_catalog.btrim(p_learning_goal), TRUE, COALESCE(p_marketing_consent, FALSE),
        COALESCE(p_source, 'Direct Website'), p_utm_source, p_utm_campaign, 'new'
    )
    ON CONFLICT (whatsapp_number) DO NOTHING
    RETURNING id, tracking_token INTO v_new_id, v_new_token;

    -- Duplicate handling: strictly return NULL for learner_id and tracking_token
    -- Never leak prior user UUIDs or tracking tokens
    IF v_new_id IS NULL THEN
        RETURN pg_catalog.jsonb_build_object(
            'success', true,
            'is_duplicate', true,
            'learner_id', NULL,
            'tracking_token', NULL,
            'full_name', pg_catalog.btrim(p_full_name),
            'message', 'You are already registered! Access your free AI starter kit and channel below.'
        );
    END IF;

    -- Confirmed new registration
    RETURN pg_catalog.jsonb_build_object(
        'success', true,
        'is_duplicate', false,
        'learner_id', v_new_id,
        'tracking_token', v_new_token,
        'full_name', pg_catalog.btrim(p_full_name)
    );
END;
$$;

ALTER FUNCTION public.submit_learner_registration(TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, BOOLEAN, TEXT, TEXT, TEXT, TEXT) OWNER TO postgres;

-- ============================================================================
-- 7. FUNCTION: public.track_learner_click()
-- Privileged serverless RPC executed exclusively by service_role
-- ============================================================================
CREATE OR REPLACE FUNCTION public.track_learner_click(
    p_learner_id UUID,
    p_tracking_token UUID,
    p_resource_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF p_resource_type NOT IN ('drive', 'whatsapp') THEN
        RETURN FALSE;
    END IF;

    IF p_resource_type = 'drive' THEN
        UPDATE public.learners
        SET drive_accessed = TRUE,
            status = CASE WHEN status = 'new' THEN 'starter_kit_accessed' ELSE status END,
            updated_at = pg_catalog.now()
        WHERE id = p_learner_id AND tracking_token = p_tracking_token;
    ELSIF p_resource_type = 'whatsapp' THEN
        UPDATE public.learners
        SET whatsapp_channel_clicked = TRUE,
            updated_at = pg_catalog.now()
        WHERE id = p_learner_id AND tracking_token = p_tracking_token;
    END IF;

    RETURN FOUND;
END;
$$;

ALTER FUNCTION public.track_learner_click(UUID, UUID, TEXT) OWNER TO postgres;

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) & REPEATABLE POLICIES
-- ============================================================================
ALTER TABLE public.learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_events ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist before recreating (Safe Repeatable Migration)
DROP POLICY IF EXISTS "Authorized admins can view learners" ON public.learners;
DROP POLICY IF EXISTS "Authorized admins can update learners" ON public.learners;
DROP POLICY IF EXISTS "Authorized admins can delete learners" ON public.learners;
DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;

-- Admin SELECT Policy (Verified administrators can view records)
CREATE POLICY "Authorized admins can view learners" 
ON public.learners 
FOR SELECT 
TO authenticated 
USING (public.is_admin());

-- Admin UPDATE Policy (Verified administrators can update status and notes only)
CREATE POLICY "Authorized admins can update learners" 
ON public.learners 
FOR UPDATE 
TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- Admin List SELECT Policy (Verified administrators can view admin list)
CREATE POLICY "Admins can view admin list" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (public.is_admin());

-- ZERO DELETE POLICY: Deliberately omitted. Learner deletion is completely prohibited.

-- ============================================================================
-- 9. ACCESS PRIVILEGES & SECURITY HARDENING
-- ============================================================================

-- Table Access Revocations
REVOKE ALL ON TABLE public.learners FROM PUBLIC, anon;
REVOKE ALL ON TABLE public.admin_users FROM PUBLIC, anon;
REVOKE ALL ON TABLE public.rate_limit_events FROM PUBLIC, anon, authenticated;

-- Authenticated Role Privilege Hardening:
-- Explicitly revoke ALL privileges on public.learners and public.admin_users from authenticated
REVOKE ALL ON TABLE public.learners FROM authenticated;
REVOKE ALL ON TABLE public.admin_users FROM authenticated;

-- Grant selective authenticated permissions:
-- 1. learners: SELECT on table, UPDATE strictly restricted to approved columns (status, admin_notes, updated_at)
GRANT SELECT ON TABLE public.learners TO authenticated;
GRANT UPDATE (status, admin_notes, updated_at) ON TABLE public.learners TO authenticated;

-- 2. admin_users: SELECT only
GRANT SELECT ON TABLE public.admin_users TO authenticated;

-- Service Role Full Permissions
GRANT ALL ON TABLE public.learners TO service_role;
GRANT ALL ON TABLE public.admin_users TO service_role;
GRANT ALL ON TABLE public.rate_limit_events TO service_role;

-- Function Execution Privileges
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, INT, INT) TO service_role;

REVOKE ALL ON FUNCTION public.submit_learner_registration FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_learner_registration TO service_role;

REVOKE ALL ON FUNCTION public.track_learner_click FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_learner_click TO service_role;

COMMIT;
