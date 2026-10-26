/**
 * AI FREEDOM WITH UDAY - Supabase Client & Data Layer (V1.2 Production Hardened)
 * Integrates directly with Supabase Auth, Row Level Security, and secure RPCs.
 * Zero hardcoded passwords. Zero mock authentication. Zero storage-based bypasses.
 */

import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export interface Learner {
  id: string;
  tracking_token?: string;
  full_name: string;
  whatsapp_number: string;
  profession: string;
  ai_knowledge_level: 'Beginner' | 'Intermediate' | 'Advanced';
  learning_goal: string;
  privacy_consent: boolean;
  marketing_consent: boolean;
  source: string;
  utm_source?: string;
  utm_campaign?: string;
  drive_accessed: boolean;
  whatsapp_channel_clicked: boolean;
  status: 'new' | 'contacted' | 'in_followup' | 'starter_kit_accessed' | 'converted' | 'archived';
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface RegistrationInput {
  fullName: string;
  whatsappNumber: string;
  profession: string;
  aiKnowledgeLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  learningGoal: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
  source?: string;
  utmSource?: string;
  utmCampaign?: string;
}

export interface RegistrationResult {
  success: boolean;
  isDuplicate?: boolean;
  learnerId?: string;
  trackingToken?: string;
  fullName?: string;
  message?: string;
  error?: string;
  errorCode?: string;
}

export interface AdminSession {
  email: string;
  name: string;
  role: 'admin';
  authenticatedAt: string;
  user: User;
}

// 1. Consistent Environment Variable Resolution with Support for Publishable Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Register Learner (Public Funnel)
 * Submits strictly to the serverless endpoint /api/register.
 * Never leaks existing tokens or data on duplicate.
 */
export const registerLearner = async (
  input: RegistrationInput
): Promise<RegistrationResult> => {
  // 1. Client-Side Pre-validation
  if (input.privacyConsent !== true) {
    return {
      success: false,
      error: 'You must explicitly consent to receive the free starter kit.',
      errorCode: 'CONSENT_REQUIRED',
    };
  }

  const cleanName = input.fullName.trim();
  if (cleanName.length < 2) {
    return {
      success: false,
      error: 'Please enter your full name (minimum 2 characters).',
      errorCode: 'INVALID_NAME',
    };
  }

  const cleanPhone = input.whatsappNumber.replace(/[^0-9+]/g, '').trim();
  if (cleanPhone.length < 8) {
    return {
      success: false,
      error: 'Please enter a valid WhatsApp phone number with country code.',
      errorCode: 'INVALID_PHONE',
    };
  }

  // 2. Submit to Server-Verified Serverless Endpoint (/api/register)
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: cleanName,
        whatsappNumber: cleanPhone,
        profession: input.profession,
        aiKnowledgeLevel: input.aiKnowledgeLevel,
        learningGoal: input.learningGoal,
        privacyConsent: true,
        marketingConsent: Boolean(input.marketingConsent),
        source: input.source || 'Direct Website',
        utmSource: input.utmSource,
        utmCampaign: input.utmCampaign,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      return {
        success: true,
        isDuplicate: Boolean(data.is_duplicate),
        learnerId: data.learner_id || undefined,
        trackingToken: data.tracking_token || undefined,
        fullName: data.full_name || cleanName,
        message: data.message,
      };
    }

    return {
      success: false,
      error: data.error || 'Registration failed. Please try again.',
      errorCode: data.error_code || 'REGISTRATION_FAILED',
    };
  } catch (err: any) {
    console.error('Registration fetch error:', err);
    return {
      success: false,
      error: 'Unable to reach registration server. Please check your internet connection.',
      errorCode: 'NETWORK_ERROR',
    };
  }
};

/**
 * Track Resource Click
 * Routes through secure /api/track endpoint with validated learnerId and secret tracking token.
 */
export const trackResourceClick = async (
  learnerId: string,
  trackingToken: string,
  resourceType: 'drive' | 'whatsapp'
): Promise<boolean> => {
  if (!learnerId || !trackingToken) return false;

  try {
    const res = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learnerId, trackingToken, resourceType }),
    });

    if (res.ok) {
      const json = await res.json().catch(() => ({}));
      return Boolean(json.success);
    }
    return false;
  } catch (err) {
    console.warn('Click tracking error:', err);
    return false;
  }
};

/**
 * Real Server-Verified Admin Session Verification
 * Never trusts localStorage or sessionStorage keys.
 * Validates the Supabase Auth session AND verifies role through the server-side is_admin() RPC.
 */
export const verifyAdminSession = async (): Promise<AdminSession | null> => {
  if (!supabase) return null;

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return null;
    }

    // Call PostgreSQL SECURITY DEFINER is_admin() function to verify allowlist
    const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin');

    if (rpcError || !isAdmin) {
      // User is authenticated but NOT an allowlisted admin
      await supabase.auth.signOut();
      return null;
    }

    return {
      email: session.user.email || '',
      name: session.user.user_metadata?.full_name || 'Uday Kiran',
      role: 'admin',
      authenticatedAt: session.user.last_sign_in_at || new Date().toISOString(),
      user: session.user,
    };
  } catch (err) {
    console.error('Error verifying admin session:', err);
    return null;
  }
};

/**
 * Admin Authentication — Genuine Supabase Auth with Database Allowlist Verification
 * No hardcoded default passwords or mock bypasses.
 */
export const adminLogin = async (
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> => {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase credentials are not configured in environment (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY required).',
    };
  }

  try {
    // 1. Real Supabase Auth sign-in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message || 'Invalid email or password.',
      };
    }

    // 2. Server-side allowlist verification via RPC public.is_admin()
    const { data: isAdmin, error: roleError } = await supabase.rpc('is_admin');

    if (roleError || !isAdmin) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Access denied: Your account is not on the authorized administrator allowlist.',
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Authentication error occurred.',
    };
  }
};

/**
 * Admin Sign Out
 */
export const adminLogout = async (): Promise<void> => {
  if (supabase) {
    await supabase.auth.signOut();
  }
};

/**
 * Fetch all registered learners (Requires authenticated admin session)
 * Row Level Security will reject queries from non-admins at database level.
 */
export const fetchLearners = async (): Promise<Learner[]> => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('learners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to fetch learner records.');
  }

  return (data || []) as Learner[];
};

/**
 * Update learner record status or CRM notes (Admin only)
 */
export const updateLearnerRecord = async (
  id: string,
  updates: Partial<Pick<Learner, 'status' | 'admin_notes'>>
): Promise<boolean> => {
  if (!supabase) return false;

  const { error } = await supabase
    .from('learners')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to update learner:', error);
    return false;
  }

  return true;
};

/**
 * Export learners list to standard CSV
 */
export const exportLearnersToCSV = (learners: Learner[]) => {
  const headers = [
    'ID',
    'Full Name',
    'WhatsApp Number',
    'Profession',
    'AI Knowledge Level',
    'Learning Goal',
    'Status',
    'Source',
    'Drive Accessed',
    'WhatsApp Channel Clicked',
    'Registration Date',
    'Admin Notes',
  ];

  const rows = learners.map((l) => [
    l.id,
    `"${l.full_name.replace(/"/g, '""')}"`,
    `"${l.whatsapp_number}"`,
    `"${l.profession}"`,
    `"${l.ai_knowledge_level}"`,
    `"${l.learning_goal.replace(/"/g, '""')}"`,
    `"${l.status}"`,
    `"${l.source}"`,
    l.drive_accessed ? 'Yes' : 'No',
    l.whatsapp_channel_clicked ? 'Yes' : 'No',
    `"${new Date(l.created_at).toLocaleString()}"`,
    `"${(l.admin_notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `AI_Freedom_Learners_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
};

/**
 * Complete V1.2 SQL Schema Reference for Admin Modal View
 */
export const SUPABASE_SETUP_SQL = `-- ============================================================================
-- AI FREEDOM WITH UDAY — FINAL PRODUCTION SECURITY MIGRATION (V1.2)
-- Canonical Database Migration Script (supabase/migration_v1_2.sql)
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLE: public.learners
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

CREATE INDEX IF NOT EXISTS idx_learners_created_at ON public.learners (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learners_status ON public.learners (status);
CREATE INDEX IF NOT EXISTS idx_learners_whatsapp ON public.learners (whatsapp_number);

-- 2. TABLE: public.rate_limit_events (Sliding-Window Log)
CREATE TABLE IF NOT EXISTS public.rate_limit_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    identifier TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT pg_catalog.now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_lookup 
ON public.rate_limit_events (identifier, created_at DESC);


-- 3. TABLE: public.admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'admin' NOT NULL CHECK (role IN ('super_admin', 'admin')),
    created_at TIMESTAMPTZ DEFAULT pg_catalog.now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (email);

-- 4. FUNCTION: public.is_admin()
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

-- 5. FUNCTION: public.check_rate_limit()
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

    PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(p_identifier));

    DELETE FROM public.rate_limit_events
    WHERE identifier = p_identifier AND created_at < v_window_start;

    SELECT pg_catalog.count(*) INTO v_count
    FROM public.rate_limit_events
    WHERE identifier = p_identifier AND created_at >= v_window_start;

    IF v_count >= p_max_attempts THEN
        RETURN FALSE;
    END IF;

    INSERT INTO public.rate_limit_events (identifier, created_at)
    VALUES (p_identifier, v_now);

    RETURN TRUE;
END;
$$;

ALTER FUNCTION public.check_rate_limit(TEXT, INT, INT) OWNER TO postgres;

-- 6. FUNCTION: public.submit_learner_registration()
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

-- 7. FUNCTION: public.track_learner_click()
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

-- 8. ROW LEVEL SECURITY (RLS) & REPEATABLE POLICIES
ALTER TABLE public.learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authorized admins can view learners" ON public.learners;
DROP POLICY IF EXISTS "Authorized admins can update learners" ON public.learners;
DROP POLICY IF EXISTS "Authorized admins can delete learners" ON public.learners;
DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;

CREATE POLICY "Authorized admins can view learners" 
ON public.learners 
FOR SELECT 
TO authenticated 
USING (public.is_admin());

CREATE POLICY "Authorized admins can update learners" 
ON public.learners 
FOR UPDATE 
TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view admin list" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (public.is_admin());

-- ZERO DELETE POLICY: Deliberately omitted.

-- 9. ACCESS PRIVILEGES & SECURITY HARDENING
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

GRANT ALL ON TABLE public.learners TO service_role;
GRANT ALL ON TABLE public.admin_users TO service_role;
GRANT ALL ON TABLE public.rate_limit_events TO service_role;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, INT, INT) TO service_role;

REVOKE ALL ON FUNCTION public.submit_learner_registration FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_learner_registration TO service_role;

REVOKE ALL ON FUNCTION public.track_learner_click FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_learner_click TO service_role;

COMMIT;
`;
