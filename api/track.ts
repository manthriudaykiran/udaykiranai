/**
 * AI FREEDOM WITH UDAY - Vercel Serverless Function: Resource Click Tracking
 * Route: POST /api/track
 * 
 * Production Security Hardened (V1.2):
 * - Strictly POST method only.
 * - Strictly requires SUPABASE_SERVICE_ROLE_KEY (NO fallback to anon key).
 * - Scoped tracking requiring valid learner_id and secret tracking_token.
 * - Verifies learner ID and tracking token together in PostgreSQL.
 * - Cannot modify arbitrary learner records or expose personal learner data.
 * - Returns explicit error if the record or tracking token does not match.
 */

import { createClient } from '@supabase/supabase-js';

interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: any;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => ApiResponse;
}

// RFC 4122 compliant UUID regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

  // 2. Validate Server-Side Supabase Credentials (Strictly service role, no anon fallback)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return res.status(503).json({
      success: false,
      error_code: 'SERVER_CONFIG_MISSING',
      error: 'Server-side database configuration is incomplete. SUPABASE_SERVICE_ROLE_KEY is required.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { learnerId, trackingToken, resourceType } = body;

    // 3. Validate tracking parameters
    if (
      typeof learnerId !== 'string' ||
      !UUID_REGEX.test(learnerId) ||
      typeof trackingToken !== 'string' ||
      !UUID_REGEX.test(trackingToken) ||
      !['drive', 'whatsapp'].includes(resourceType)
    ) {
      return res.status(400).json({
        success: false,
        error_code: 'INVALID_PARAMETERS',
        error: 'Invalid tracking parameters or malformed credentials.',
      });
    }

    // 4. Initialize Supabase client via Service Role
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 5. Execute secure Postgres tracking RPC (Verifies ID + Token together)
    const { data, error } = await supabase.rpc('track_learner_click', {
      p_learner_id: learnerId,
      p_tracking_token: trackingToken,
      p_resource_type: resourceType,
    });

    if (error) {
      console.warn('Track click RPC failure:', error.message);
      return res.status(500).json({
        success: false,
        error_code: 'DATABASE_ERROR',
        error: 'Failed to record resource engagement.',
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error_code: 'UNAUTHORIZED_OR_NOT_FOUND',
        error: 'Learner record not found or tracking token is invalid.',
      });
    }

    return res.status(200).json({
      success: true,
      resource: resourceType,
    });
  } catch (err: any) {
    console.error('Track endpoint exception:', err);
    return res.status(500).json({
      success: false,
      error_code: 'INTERNAL_ERROR',
      error: 'An internal error occurred while processing click tracking.',
    });
  }
}
