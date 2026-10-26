/**
 * AI FREEDOM WITH UDAY - Public Website & Registration Funnel
 * Canonical public experience for Instagram, LinkedIn, and YouTube traffic.
 * No login required. Features clean registration form and instant resource access.
 */

import React, { useState, useEffect } from 'react';
import {
  registerLearner,
  trackResourceClick,
  Learner,
  RegistrationInput,
} from '../lib/supabase';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FolderLock,
  Globe,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface PublicLandingPageProps {
  onNavigateToAdmin?: () => void;
}

const GOOGLE_DRIVE_LINK = 'https://drive.google.com/drive/folders/1rZWl9xEgizq2Hel3cfJ1xF6rgS6OvCFP';
const WHATSAPP_CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbDB3aBHwXb9V7ALGd0F';

interface ConfirmedLearner {
  learnerId?: string;
  trackingToken?: string;
  fullName: string;
  isDuplicate: boolean;
  message?: string;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({ onNavigateToAdmin }) => {
  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [profession, setProfession] = useState<string>('Working Professional');
  const [aiKnowledgeLevel, setAiKnowledgeLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [learningGoal, setLearningGoal] = useState<string>('Automate daily work tasks');
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(true);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredLearner, setRegisteredLearner] = useState<ConfirmedLearner | null>(null);
  const [hasDriveClicked, setHasDriveClicked] = useState<boolean>(false);
  const [hasChannelClicked, setHasChannelClicked] = useState<boolean>(false);

  // Capture UTM parameters from URL if present
  const [trafficSource, setTrafficSource] = useState<string>('Direct Website');
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const utm = params.get('utm_source');
      const ref = params.get('ref');
      if (utm) setTrafficSource(utm);
      else if (ref) setTrafficSource(ref);
      else if (document.referrer.includes('instagram')) setTrafficSource('Instagram');
      else if (document.referrer.includes('linkedin')) setTrafficSource('LinkedIn');
      else if (document.referrer.includes('youtube')) setTrafficSource('YouTube');
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!whatsappNumber.trim() || whatsappNumber.length < 8) {
      setErrorMessage('Please enter your active WhatsApp number with country code (e.g. +91 98765 43210).');
      return;
    }
    if (!privacyConsent) {
      setErrorMessage('Please confirm your privacy consent to receive the free resources.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: RegistrationInput = {
        fullName,
        whatsappNumber,
        profession,
        aiKnowledgeLevel,
        learningGoal,
        privacyConsent,
        marketingConsent,
        source: trafficSource,
      };

      const result = await registerLearner(payload);
      if (result.success) {
        setRegisteredLearner({
          learnerId: result.learnerId,
          trackingToken: result.trackingToken,
          fullName: result.fullName || fullName.trim(),
          isDuplicate: Boolean(result.isDuplicate),
          message: result.message,
        });
        // Scroll smoothly to success resources card
        window.scrollTo({ top: 350, behavior: 'smooth' });
      } else {
        setErrorMessage(result.error || 'Registration could not be completed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDriveClick = () => {
    if (registeredLearner?.learnerId && registeredLearner?.trackingToken) {
      trackResourceClick(registeredLearner.learnerId, registeredLearner.trackingToken, 'drive');
    }
    setHasDriveClicked(true);
    window.open(GOOGLE_DRIVE_LINK, '_blank', 'noopener,noreferrer');
  };

  const handleChannelClick = () => {
    if (registeredLearner?.learnerId && registeredLearner?.trackingToken) {
      trackResourceClick(registeredLearner.learnerId, registeredLearner.trackingToken, 'whatsapp');
    }
    setHasChannelClicked(true);
    window.open(WHATSAPP_CHANNEL_LINK, '_blank', 'noopener,noreferrer');
  };

  const scrollToRegistration = () => {
    const el = document.getElementById('starter-kit-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#071426] text-white selection:bg-[#FB6A21]/30 selection:text-[#FFA726] flex flex-col font-manrope">
      {/* 1. PUBLIC HEADER (Strictly no admin nav links on public site) */}
      <header className="sticky top-0 z-40 bg-[#071426]/90 backdrop-blur-xl border-b border-white/10 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFA726] via-[#FB6A21] to-[#D946EF] flex items-center justify-center text-white shadow-lg">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg tracking-tight text-white block leading-tight">
              AI Freedom <span className="bg-gradient-to-r from-[#FFA726] to-[#FB6A21] bg-clip-text text-transparent">With Uday</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              Make AI Simple. Practical. Useful.
            </span>
          </div>
        </div>

        <button
          onClick={scrollToRegistration}
          className="px-4 py-2 rounded-xl text-xs font-display font-bold text-white bg-gradient-to-r from-[#FFA726] to-[#FB6A21] shadow-lg shadow-[#FB6A21]/20 hover:scale-105 active:scale-95 transition-transform"
        >
          Get Free Starter Kit
        </button>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative px-6 lg:px-12 pt-16 pb-20 overflow-hidden border-b border-white/10">
        {/* Cinematic Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-gradient-to-b from-[#FFA726]/15 via-[#FB6A21]/10 to-[#7C3AED]/15 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#FFA726]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free · No Fluff · Immediate Access</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1] text-balance">
            Automate Your Work, Save 15+ Hours Every Week, and{' '}
            <span className="bg-gradient-to-r from-[#FFA726] via-[#FB6A21] via-[#D946EF] to-[#7C3AED] bg-clip-text text-transparent">
              Achieve True AI Freedom.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop wasting hours on repetitive tasks. Download Uday Kiran’s curated <strong>AI Starter Kit</strong> featuring production-tested prompt templates, automated workflow blueprints, and step-by-step guides.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToRegistration}
              className="px-7 py-3.5 rounded-2xl font-display font-bold text-sm text-white bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] shadow-xl shadow-[#FB6A21]/25 hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
            >
              <span>Get My FREE AI Starter Kit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-mono block sm:inline">
              Instant Google Drive + WhatsApp Channel Access
            </span>
          </div>

          {/* Social Proof Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>5 Ready-to-Use Workflows</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tested on Real Business Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Prior Coding Needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUCCESS CARD (Shown immediately if already registered) */}
      {registeredLearner && (
        <section className="px-6 lg:px-12 py-12 bg-[#0C172E] border-b border-[#FFA726]/30 animate-fade-in">
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-[#111827] border border-[#FFA726]/40 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                {registeredLearner.isDuplicate
                  ? `Welcome Back, ${registeredLearner.fullName}!`
                  : `Registration Successful, ${registeredLearner.fullName}!`}
              </h3>
              <p className="text-sm text-slate-300">
                {registeredLearner.message ||
                  'Your AI Starter Kit is ready below. Access the resources immediately and join the WhatsApp channel for live updates.'}
              </p>
            </div>

            {/* Two Resource Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Resource 1: Google Drive */}
              <div className="p-6 rounded-2xl bg-[#071426] border border-white/10 flex flex-col justify-between space-y-4 hover:border-[#FFA726]/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#FFA726] uppercase">
                      Resource 01
                    </span>
                    <Download className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-white mb-1">
                    Free AI Starter Kit (Google Drive)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Includes prompt templates, automation workflows, slides, and cheat sheets.
                  </p>
                </div>

                <button
                  onClick={handleDriveClick}
                  className="w-full py-3 rounded-xl font-display font-semibold text-xs text-white bg-gradient-to-r from-[#FFA726] to-[#FB6A21] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Open Google Drive Folder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Resource 2: WhatsApp Channel */}
              <div className="p-6 rounded-2xl bg-[#071426] border border-white/10 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                      Resource 02
                    </span>
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-white mb-1">
                    Official WhatsApp Channel
                  </h4>
                  <p className="text-xs text-slate-400">
                    Receive daily high-value prompts, upcoming free webinar links, and direct community tips.
                  </p>
                </div>

                <button
                  onClick={handleChannelClick}
                  className="w-full py-3 rounded-xl font-display font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Join WhatsApp Channel</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400 font-mono">
                {hasDriveClicked || hasChannelClicked
                  ? 'Access recorded! You can return to these links anytime.'
                  : 'Click the buttons above to open your resources.'}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 4. WHAT'S INSIDE THE STARTER KIT */}
      <section className="px-6 lg:px-12 py-16 max-w-5xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
            Curated By Uday Kiran
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            What You Get in the Free AI Starter Kit
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Practical materials built from real-world implementations, not theoretical overviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              num: '01',
              title: 'The AI Work Automation Playbook',
              desc: 'Step-by-step frameworks to automate report writing, data extraction, customer responses, and competitive research using modern LLMs.',
              badge: 'PDF Guide + Prompts',
              color: '#FFA726',
            },
            {
              num: '02',
              title: '5 Production Ready Workflow Templates',
              desc: 'Copy-paste workflows for Excel spreadsheet analysis, meeting summaries, market intelligence, and executive email drafting.',
              badge: 'Ready-to-Use Workflows',
              color: '#FB6A21',
            },
            {
              num: '03',
              title: 'Autonomous Agents & Architecture Guide',
              desc: 'Learn how to build deterministic, hallucination-free AI agents with structured schema guardrails and tool calling.',
              badge: 'Architecture Blueprint',
              color: '#D946EF',
            },
            {
              num: '04',
              title: 'The 7-Day AI Freedom Implementation Roadmap',
              desc: 'A structured 15-minutes-per-day plan to integrate AI into your daily career or business workflow without overwhelming your schedule.',
              badge: 'Action Roadmap',
              color: '#7C3AED',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#111827] border border-white/10 hover:border-white/20 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold" style={{ color: item.color }}>
                  MODULE {item.num}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-white">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REGISTRATION FORM SECTION */}
      <section id="starter-kit-form" className="px-6 lg:px-12 py-16 bg-[#0B1528] border-t border-b border-white/10">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
              Simple & Fast
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Claim Your Free AI Starter Kit
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Fill in your details below to unlock instant Google Drive and WhatsApp access.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-[#111827] border border-white/15 shadow-2xl space-y-6"
          >
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Full Name *</span>
                <span className="text-[11px] text-slate-500 font-normal">Your legal or display name</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Varma"
                className="w-full px-4 py-3 rounded-xl bg-[#071426] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FFA726] transition-colors"
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>WhatsApp Number *</span>
                <span className="text-[11px] text-slate-500 font-normal">Include country code</span>
              </label>
              <input
                type="tel"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-[#071426] border border-white/10 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-[#FFA726] transition-colors"
              />
            </div>

            {/* Profession (Chips / Dropdown) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Current Profession / Role *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Working Professional',
                  'Business Owner / Founder',
                  'Student',
                  'Freelancer / Consultant',
                  'Creator / Agency',
                  'Other',
                ].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setProfession(p)}
                    className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                      profession === p
                        ? 'border-[#FFA726] bg-[#FFA726]/10 text-white font-semibold'
                        : 'border-white/10 bg-[#071426] text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Knowledge Level */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Your AI Knowledge Level *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Beginner', desc: 'Starting from scratch' },
                  { id: 'Intermediate', desc: 'Use ChatGPT/Claude' },
                  { id: 'Advanced', desc: 'Building workflows/APIs' },
                ].map((lvl) => (
                  <button
                    type="button"
                    key={lvl.id}
                    onClick={() => setAiKnowledgeLevel(lvl.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      aiKnowledgeLevel === lvl.id
                        ? 'border-[#FB6A21] bg-[#FB6A21]/10 text-white font-semibold'
                        : 'border-white/10 bg-[#071426] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="block text-xs font-bold">{lvl.id}</span>
                    <span className="block text-[11px] opacity-70">{lvl.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Learning Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Your Primary Learning Goal *
              </label>
              <select
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#071426] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FFA726] transition-colors"
              >
                <option value="Automate daily work tasks">Automate daily work tasks & save 15+ hours/week</option>
                <option value="Build AI Agents & Workflows">Build Autonomous AI Agents & Pipelines</option>
                <option value="Career Growth & High-Income Skills">Career Growth & High-Income Technical Skills</option>
                <option value="Create Content & Grow Audience">Create Content & Grow Online Audience</option>
                <option value="Launch an AI Business">Launch or Scale an AI-Powered Business</option>
              </select>
            </div>

            {/* Consents */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#FB6A21] focus:ring-0"
                />
                <span className="text-xs text-slate-300 leading-normal">
                  I agree to receive the free starter kit and educational AI updates via WhatsApp & Email. Privacy respected, zero spam. *
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#FB6A21] focus:ring-0"
                />
                <span className="text-xs text-slate-400 leading-normal">
                  Keep me notified about upcoming live masterclasses, webinars, and practical workshops. (Optional)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-display font-bold text-sm text-white bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] shadow-xl shadow-[#FB6A21]/20 hover:scale-[1.01] active:scale-98 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Registering & Preparing Your Kit...</span>
              ) : (
                <>
                  <span>Get Instant Free Access Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* 6. ABOUT UDAY KIRAN */}
      <section className="px-6 lg:px-12 py-16 max-w-4xl mx-auto w-full space-y-6 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
          About The Creator
        </span>
        <h2 className="text-3xl font-display font-bold text-white">
          Uday Kiran · Practical AI Architect
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Uday Kiran leads the <strong>AI Freedom</strong> initiative and founded <strong>KiranForge</strong>. His mission is to dismantle AI hype and empower working professionals, founders, and creators with practical, deterministic AI systems that deliver tangible ROI.
        </p>

        <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <span>Make AI Simple.</span>
          <span>·</span>
          <span>Practical.</span>
          <span>·</span>
          <span>Useful.</span>
        </div>
      </section>

      {/* 7. QUIET PUBLIC FOOTER */}
      <footer className="mt-auto px-6 lg:px-12 py-8 bg-[#050D1A] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span>© {new Date().getFullYear()} AI Freedom With Uday. All rights reserved.</span>
        </div>

        <div>
          <span className="text-[11px] font-mono text-[#D5B46B]/80">
            Created by Uday Kiran
          </span>
        </div>
      </footer>
    </div>
  );
};
