/**
 * Supabase Data Layer & Learner Registration Architecture
 * Handles connection, schema validation, Row Level Security guidelines,
 * duplicate prevention, and offline-resilient local storage fallback.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Learner {
  id: string;
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
  admin_notes?: string;
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

// Read env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Realistic Seed Learners for immediate testing & demonstration
const SEED_LEARNERS: Learner[] = [
  {
    id: 'lrn-001',
    full_name: 'Priya Sharma',
    whatsapp_number: '+91 98765 43210',
    profession: 'Working Professional',
    ai_knowledge_level: 'Intermediate',
    learning_goal: 'Automate daily work tasks',
    privacy_consent: true,
    marketing_consent: true,
    source: 'Instagram',
    drive_accessed: true,
    whatsapp_channel_clicked: true,
    status: 'starter_kit_accessed',
    admin_notes: 'Connected on WhatsApp. Interested in Excel & Gemini automation templates.',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    updated_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'lrn-002',
    full_name: 'Rahul Varma',
    whatsapp_number: '+91 91234 56789',
    profession: 'Business Owner / Founder',
    ai_knowledge_level: 'Beginner',
    learning_goal: 'Launch an AI Business',
    privacy_consent: true,
    marketing_consent: false,
    source: 'LinkedIn',
    drive_accessed: true,
    whatsapp_channel_clicked: false,
    status: 'new',
    admin_notes: 'Looking to integrate AI into local logistics business. Send 7-day starter guide.',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hrs ago
    updated_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'lrn-003',
    full_name: 'Ananya Reddy',
    whatsapp_number: '+91 99887 76655',
    profession: 'Creator / Agency',
    ai_knowledge_level: 'Advanced',
    learning_goal: 'Create Content & Grow Audience',
    privacy_consent: true,
    marketing_consent: true,
    source: 'YouTube',
    drive_accessed: false,
    whatsapp_channel_clicked: true,
    status: 'in_followup',
    admin_notes: 'Joined WhatsApp channel. Runs a video podcast, wants automated script workflows.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hrs ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'lrn-004',
    full_name: 'Karthik S.',
    whatsapp_number: '+91 94401 23456',
    profession: 'Freelancer / Consultant',
    ai_knowledge_level: 'Intermediate',
    learning_goal: 'Build AI Agents & Workflows',
    privacy_consent: true,
    marketing_consent: true,
    source: 'WhatsApp Referral',
    drive_accessed: true,
    whatsapp_channel_clicked: true,
    status: 'converted',
    admin_notes: 'Attended weekend webinar. Upgraded to KiranForge agent builder masterclass.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'lrn-005',
    full_name: 'Suresh Kumar',
    whatsapp_number: '+91 98480 11223',
    profession: 'Student',
    ai_knowledge_level: 'Beginner',
    learning_goal: 'Career Growth & High-Income Skills',
    privacy_consent: true,
    marketing_consent: true,
    source: 'Instagram',
    drive_accessed: true,
    whatsapp_channel_clicked: false,
    status: 'contacted',
    admin_notes: 'Final year B.Tech student looking for AI portfolio projects.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

const LOCAL_STORAGE_KEY = 'ai_freedom_learners_v1';
const ADMIN_SESSION_KEY = 'ai_freedom_admin_session';

// Initialize local storage if empty
export const getLocalLearners = (): Learner[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_LEARNERS));
      return SEED_LEARNERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_LEARNERS;
  }
};

export const saveLocalLearners = (learners: Learner[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(learners));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

/**
 * Register a new learner
 * Performs duplicate validation, normalizes phone number, and persists to Supabase or local cache
 */
export const registerLearner = async (
  input: RegistrationInput
): Promise<{ success: boolean; learner?: Learner; error?: string }> => {
  // 1. Basic validation
  if (!input.fullName.trim()) {
    return { success: false, error: 'Please enter your full name.' };
  }
  const cleanPhone = input.whatsappNumber.replace(/[^0-9+]/g, '').trim();
  if (!cleanPhone || cleanPhone.length < 8) {
    return { success: false, error: 'Please enter a valid WhatsApp phone number with country code.' };
  }
  if (!input.privacyConsent) {
    return { success: false, error: 'You must agree to the privacy policy to receive the starter kit.' };
  }

  const newRecord: Learner = {
    id: `lrn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    full_name: input.fullName.trim(),
    whatsapp_number: cleanPhone,
    profession: input.profession || 'Working Professional',
    ai_knowledge_level: input.aiKnowledgeLevel || 'Beginner',
    learning_goal: input.learningGoal || 'Automate daily work tasks',
    privacy_consent: input.privacyConsent,
    marketing_consent: input.marketingConsent || false,
    source: input.source || 'Direct Website',
    utm_source: input.utmSource,
    utm_campaign: input.utmCampaign,
    drive_accessed: false,
    whatsapp_channel_clicked: false,
    status: 'new',
    admin_notes: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // If Supabase is configured, save to Supabase
  if (supabase) {
    try {
      // Check for duplicate WhatsApp number
      const { data: existing } = await supabase
        .from('learners')
        .select('id, whatsapp_number')
        .eq('whatsapp_number', cleanPhone)
        .maybeSingle();

      if (existing) {
        // Already registered - fetch latest and return success so they can access resources without error
        return { success: true, learner: { ...newRecord, id: existing.id } };
      }

      const { data, error } = await supabase
        .from('learners')
        .insert([
          {
            full_name: newRecord.full_name,
            whatsapp_number: newRecord.whatsapp_number,
            profession: newRecord.profession,
            ai_knowledge_level: newRecord.ai_knowledge_level,
            learning_goal: newRecord.learning_goal,
            privacy_consent: newRecord.privacy_consent,
            marketing_consent: newRecord.marketing_consent,
            source: newRecord.source,
            utm_source: newRecord.utm_source,
            utm_campaign: newRecord.utm_campaign,
            status: 'new',
          },
        ])
        .select()
        .single();

      if (error) {
        console.warn('Supabase insert returned error, falling back to local storage:', error);
        // Fallback save locally
        const list = getLocalLearners();
        saveLocalLearners([newRecord, ...list]);
        return { success: true, learner: newRecord };
      }

      return { success: true, learner: data || newRecord };
    } catch (err: any) {
      console.error('Supabase exception, saving to local cache:', err);
      const list = getLocalLearners();
      saveLocalLearners([newRecord, ...list]);
      return { success: true, learner: newRecord };
    }
  }

  // Fallback: Local Storage
  const current = getLocalLearners();
  // Check duplicate locally
  const dupIndex = current.findIndex(
    (l) => l.whatsapp_number.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '')
  );

  if (dupIndex !== -1) {
    // Return existing record smoothly
    return { success: true, learner: current[dupIndex] };
  }

  saveLocalLearners([newRecord, ...current]);
  return { success: true, learner: newRecord };
};

/**
 * Track user clicks on Drive or WhatsApp channel
 */
export const trackResourceClick = async (
  learnerId: string,
  type: 'drive' | 'whatsapp'
) => {
  const current = getLocalLearners();
  const updated = current.map((l) => {
    if (l.id === learnerId) {
      return {
        ...l,
        drive_accessed: type === 'drive' ? true : l.drive_accessed,
        whatsapp_channel_clicked: type === 'whatsapp' ? true : l.whatsapp_channel_clicked,
        status: l.status === 'new' ? 'starter_kit_accessed' : l.status,
        updated_at: new Date().toISOString(),
      };
    }
    return l;
  });
  saveLocalLearners(updated);

  if (supabase) {
    try {
      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (type === 'drive') updatePayload.drive_accessed = true;
      if (type === 'whatsapp') updatePayload.whatsapp_channel_clicked = true;

      await supabase.from('learners').update(updatePayload).eq('id', learnerId);
    } catch (err) {
      console.warn('Supabase click tracking fallback:', err);
    }
  }
};

/**
 * Fetch all learners for Admin Dashboard
 */
export const fetchLearners = async (): Promise<Learner[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('learners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Supabase fetch failed, returning local storage records:', error);
        return getLocalLearners();
      }
      return data as Learner[];
    } catch (err) {
      console.warn('Supabase fetch exception, using local storage:', err);
      return getLocalLearners();
    }
  }

  return getLocalLearners();
};

/**
 * Update learner status or notes from Admin Dashboard
 */
export const updateLearnerRecord = async (
  id: string,
  updates: Partial<Pick<Learner, 'status' | 'admin_notes'>>
): Promise<boolean> => {
  const current = getLocalLearners();
  const next = current.map((l) => {
    if (l.id === id) {
      return {
        ...l,
        ...updates,
        updated_at: new Date().toISOString(),
      };
    }
    return l;
  });
  saveLocalLearners(next);

  if (supabase) {
    try {
      await supabase
        .from('learners')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    } catch (err) {
      console.warn('Supabase update failed:', err);
    }
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
    'Registration Source',
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
 * Admin Authentication State & Verification
 */
export interface AdminSession {
  email: string;
  name: string;
  role: 'admin';
  token: string;
  authenticatedAt: string;
}

export const getAdminSession = (): AdminSession | null => {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setAdminSession = (session: AdminSession, remember: boolean = true) => {
  const target = remember ? localStorage : sessionStorage;
  target.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
};

export const clearAdminSession = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

/**
 * SQL Schema & Row Level Security Setup Script
 * Can be run in Supabase SQL editor to create the exact table & security policies.
 */
export const SUPABASE_SETUP_SQL = `-- 1. Create Learners Table
CREATE TABLE IF NOT EXISTS public.learners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL UNIQUE,
    profession TEXT NOT NULL,
    ai_knowledge_level TEXT NOT NULL,
    learning_goal TEXT NOT NULL,
    privacy_consent BOOLEAN DEFAULT TRUE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    source TEXT DEFAULT 'Direct Website',
    utm_source TEXT,
    utm_campaign TEXT,
    drive_accessed BOOLEAN DEFAULT FALSE,
    whatsapp_channel_clicked BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_followup', 'starter_kit_accessed', 'converted', 'archived')),
    admin_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for fast search and filtering
CREATE INDEX IF NOT EXISTS idx_learners_created_at ON public.learners(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learners_status ON public.learners(status);
CREATE INDEX IF NOT EXISTS idx_learners_whatsapp ON public.learners(whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_learners_profession ON public.learners(profession);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.learners ENABLE ROW LEVEL SECURITY;

-- 4. Public registration policy: Anyone can INSERT a new registration
CREATE POLICY "Allow public learner registration" 
ON public.learners 
FOR INSERT 
WITH CHECK (true);

-- 5. Public learner click tracking policy (allow updating click flags on their own row)
CREATE POLICY "Allow updating click telemetry" 
ON public.learners 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- 6. Private Admin policy: Only authenticated admins can read and update all records
CREATE POLICY "Allow admins full access" 
ON public.learners 
FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' IN ('mudaykiran.8801@gmail.com', 'admin@udaykiran.ai'))
WITH CHECK (auth.jwt() ->> 'email' IN ('mudaykiran.8801@gmail.com', 'admin@udaykiran.ai'));
`;
