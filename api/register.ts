/**
 * AI FREEDOM WITH UDAY - Vercel Serverless Function: Learner Registration
 * Route: POST /api/register
 * 
 * Production Security Hardened (V1.2):
 * - Strictly POST method only.
 * - Strictly requires SUPABASE_SERVICE_ROLE_KEY (NO anon key fallback).
 * - Strictly requires dedicated RATE_LIMIT_SALT (min 16 chars; never derived from service role key).
 * - Edge-verified client IP extraction (prioritizing Vercel edge headers).
 * - Subnet-safe IPv6 normalization (/64 prefix) to prevent rotation bypasses.
 * - Concurrency-safe sliding-window rate limit enforced in PostgreSQL.
 * - Strict server-side input validation and E.164 phone sanitization.
 * - Explicit privacy consent check (Mandatory TRUE).
 * - Nullified tracking tokens on duplicate registrations (Zero token leakage).
 * - Confirmed database insertion before returning success.
 */

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: any;
  socket?: { remoteAddress?: string };
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => ApiResponse;
}

const ALLOWED_PROFESSIONS = [
  'Working Professional',
  'Business Owner / Founder',
  'Student',
  'Freelancer / Consultant',
  'Creator / Agency',
  'Other',
];

const ALLOWED_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

// International E.164 phone regex (e.g. +919876543210 or +12025550123)
const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

// Accurate IPv4 validation
const IPV4_REGEX = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// Accurate IPv6 validation
const IPV6_REGEX = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

/**
 * Extracts and normalizes client IP from trusted edge proxy headers.
 * For IPv6, normalizes to the /64 routing prefix to mitigate privacy-extension rotation attacks.
 */
function extractTrustedClientIdentifier(req: ApiRequest): string {
  // 1. Vercel Edge Header (injected by Vercel edge proxy, cannot be spoofed by client)
  const vercelForwarded = req.headers['x-vercel-forwarded-for'];
  // 2. Standard Forwarded header (take first IP if behind verified proxy)
  const forwarded = req.headers['x-forwarded-for'];
  // 3. Real IP header
  const realIp = req.headers['x-real-ip'];

  let candidate = '';

  if (typeof vercelForwarded === 'string' && vercelForwarded.trim()) {
    candidate = vercelForwarded.split(',')[0].trim();
  } else if (typeof forwarded === 'string' && forwarded.trim()) {
    candidate = forwarded.split(',')[0].trim();
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    candidate = forwarded[0].trim();
  } else if (typeof realIp === 'string' && realIp.trim()) {
    candidate = realIp.trim();
  } else if (req.socket?.remoteAddress) {
    candidate = req.socket.remoteAddress.trim();
  }

  // Strip IPv6-mapped IPv4 prefix (::ffff:192.0.2.128 -> 192.0.2.128)
  if (candidate.startsWith('::ffff:')) {
    candidate = candidate.slice(7);
  }

  // Validate IPv4
  if (IPV4_REGEX.test(candidate)) {
    return `ipv4:${candidate}`;
  }

  // Validate IPv6
  if (IPV6_REGEX.test(candidate)) {
    // Extract first 4 segments (/64 subnet prefix)
    const segments = candidate.split(':');
    const prefix = segments.slice(0, 4).join(':');
    return `ipv6_sub64:${prefix}`;
  }

  // Fallback to local default if loopback/unrecognized
  return `fallback:${candidate || '127.0.0.1'}`;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  // 1. Enforce POST HTTP method
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      error_code: 'METHOD_NOT_ALLOWED',
      error: 'Only POST requests are accepted.',
    });
  }

  // 2. Validate Server-Side Database Credentials (Strictly service role, no anon fallback)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return res.status(503).json({
      success: false,
      error_code: 'SERVER_CONFIG_MISSING',
      error: 'Server-side database configuration is incomplete. SUPABASE_SERVICE_ROLE_KEY is required.',
    });
  }

  // 3. Validate Dedicated Server-Only RATE_LIMIT_SALT Secret (Never derived from service-role key)
  const rateLimitSalt = process.env.RATE_LIMIT_SALT;
  if (!rateLimitSalt || rateLimitSalt.length < 16) {
    return res.status(503).json({
      success: false,
      error_code: 'RATE_LIMIT_SALT_MISSING',
      error: 'Server-side security configuration is incomplete. RATE_LIMIT_SALT (minimum 16 characters) is required.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      fullName,
      whatsappNumber,
      profession,
      aiKnowledgeLevel,
      learningGoal,
      privacyConsent,
      marketingConsent,
      source,
      utmSource,
      utmCampaign,
    } = body;

    // 4. Explicit Privacy Consent Check (Mandatory TRUE)
    if (privacyConsent !== true) {
      return res.status(400).json({
        success: false,
        error_code: 'CONSENT_REQUIRED',
        error: 'Explicit consent is required to receive the free starter kit.',
      });
    }

    // 5. Input Sanitization & Validation
    const trimmedName = typeof fullName === 'string' ? fullName.trim() : '';
    if (trimmedName.length < 2 || trimmedName.length > 120) {
      return res.status(400).json({
        success: false,
        error_code: 'INVALID_NAME',
        error: 'Please enter a valid full name (2–120 characters).',
      });
    }

    const rawPhone = typeof whatsappNumber === 'string' ? whatsappNumber : '';
    const cleanPhone = rawPhone.replace(/[^0-9+]/g, '').trim();
    if (!PHONE_REGEX.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        error_code: 'INVALID_PHONE',
        error: 'Please enter a valid WhatsApp phone number with country code (e.g. +91 98765 43210).',
      });
    }

    const sanitizedProfession = ALLOWED_PROFESSIONS.includes(profession)
      ? profession
      : 'Other';

    const sanitizedLevel = ALLOWED_LEVELS.includes(aiKnowledgeLevel)
      ? aiKnowledgeLevel
      : 'Beginner';

    const sanitizedGoal =
      typeof learningGoal === 'string' && learningGoal.trim().length >= 3
        ? learningGoal.trim().slice(0, 300)
        : 'Automate daily work tasks';

    // 6. Generate Trusted Concurrency-Safe Rate-Limit Identifier
    const trustedIpIdentifier = extractTrustedClientIdentifier(req);
    const ipHash = crypto
      .createHmac('sha256', rateLimitSalt)
      .update(trustedIpIdentifier)
      .digest('hex');

    // 7. Connect to Supabase via Service Role
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 8. Execute PostgreSQL submit_learner_registration RPC
    const { data, error } = await supabase.rpc('submit_learner_registration', {
      p_full_name: trimmedName,
      p_whatsapp_number: cleanPhone,
      p_profession: sanitizedProfession,
      p_ai_knowledge_level: sanitizedLevel,
      p_learning_goal: sanitizedGoal,
      p_privacy_consent: true,
      p_marketing_consent: Boolean(marketingConsent),
      p_source: typeof source === 'string' ? source.slice(0, 100) : 'Direct Website',
      p_utm_source: typeof utmSource === 'string' ? utmSource.slice(0, 100) : null,
      p_utm_campaign: typeof utmCampaign === 'string' ? utmCampaign.slice(0, 100) : null,
      p_client_ip_hash: ipHash,
    });

    if (error) {
      console.error('Registration RPC database error:', error.message);
      return res.status(500).json({
        success: false,
        error_code: 'DATABASE_ERROR',
        error: error.message || 'Database registration failed. Please try again.',
      });
    }

    if (!data || data.success === false) {
      const status = data?.error_code === 'RATE_LIMITED' ? 429 : 400;
      return res.status(status).json({
        success: false,
        error_code: data?.error_code || 'REGISTRATION_FAILED',
        error: data?.error || 'Registration could not be completed.',
      });
    }

    // 9. Confirmed Success Response
    // For duplicate registrations: learner_id and tracking_token are strictly null to protect prior user data
    return res.status(200).json({
      success: true,
      is_duplicate: Boolean(data.is_duplicate),
      learner_id: data.learner_id || null,
      tracking_token: data.tracking_token || null,
      full_name: data.full_name || trimmedName,
      message: data.message || undefined,
    });
  } catch (err: any) {
    console.error('Serverless registration exception:', err);
    return res.status(500).json({
      success: false,
      error_code: 'INTERNAL_ERROR',
      error: 'An unexpected internal error occurred while processing your registration.',
    });
  }
}
