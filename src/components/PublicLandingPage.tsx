/**
 * AI FREEDOM WITH UDAY - Public Website & Registration Funnel
 * Practical AI education by Uday Kiran.
 * Make AI Simple. Practical. Useful.
 */

import React, { useState, useEffect } from 'react';
import {
  registerLearner,
  trackResourceClick,
  RegistrationInput,
} from '../lib/supabase';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Zap,
  BookOpen,
  Workflow,
  Compass,
  Rocket,
  Layers,
  ChevronDown,
  Briefcase,
  Users,
  Lightbulb,
  Cpu,
  FileText,
  Brain,
  Target,
  Clock,
  Check,
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

export const PublicLandingPage: React.FC<PublicLandingPageProps> = () => {
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

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
        window.scrollTo({ top: 320, behavior: 'smooth' });
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

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#071426] text-white selection:bg-[#FB6A21]/30 selection:text-[#FFA726] flex flex-col font-manrope">
      {/* 1. PUBLIC HEADER */}
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

      {/* 2. HERO SECTION — PRIORITY ONE */}
      <section className="relative px-6 lg:px-12 pt-16 pb-20 overflow-hidden border-b border-white/10">
        {/* Cinematic Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-gradient-to-b from-[#FFA726]/15 via-[#FB6A21]/10 to-[#7C3AED]/15 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#FFA726]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRACTICAL AI • REAL-WORLD SKILLS • SIMPLE IMPLEMENTATION</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1] text-balance">
            Stop Just Learning AI. Start Using It to Get{' '}
            <span className="bg-gradient-to-r from-[#FFA726] via-[#FB6A21] via-[#D946EF] to-[#7C3AED] bg-clip-text text-transparent">
              Real Results.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Learn practical AI, build useful workflows, and automate everyday work—one simple step at a time. Start with your free AI Starter Kit.
          </p>

          {/* Existing CTA Button — Text & Location Preserved Exactly */}
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

          {/* Short Trust & Value Indicators */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Beginner-Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Practical Workflows</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Learn by Doing</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUCCESS CARD (Shown immediately if already registered) */}
      {registeredLearner && (
        <section className="px-6 lg:px-12 py-12 bg-[#0C172E] border-b border-[#FFA726]/30">
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

      {/* SECTION A — THE PROBLEM */}
      <section className="px-6 lg:px-12 py-16 max-w-5xl mx-auto w-full space-y-10 border-b border-white/10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FB6A21]">
            The Common Trap
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Too Many AI Tools. Not Enough Clarity.
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            You don't need to learn every AI tool. You need to know which ones solve your problems—and how to use them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 hover:border-[#FFA726]/40 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#FFA726] flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-lg font-display font-bold text-white">Information Overload</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Too many tools, tutorials, and opinions. No clear starting point.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 hover:border-[#FB6A21]/40 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FB6A21] flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-lg font-display font-bold text-white">Learning Without Doing</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Watching AI videos is easy. Applying AI to real work is what builds confidence.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 hover:border-[#D946EF]/40 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-[#D946EF] flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-lg font-display font-bold text-white">No Practical Roadmap</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Without a simple learning path, progress becomes inconsistent.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION B — THE SOLUTION */}
      <section className="px-6 lg:px-12 py-16 max-w-5xl mx-auto w-full space-y-10 border-b border-white/10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
            The Implementation Approach
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Learn AI by Doing Real Work.
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Start small. Solve useful problems. Build skills you can apply immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0B1528] border border-white/10 space-y-4 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#FFA726]">STAGE 01</span>
              <BookOpen className="w-5 h-5 text-[#FFA726]" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">01 — Learn</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Understand the AI concepts and tools that matter.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B1528] border border-white/10 space-y-4 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#FB6A21]">STAGE 02</span>
              <Workflow className="w-5 h-5 text-[#FB6A21]" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">02 — Apply</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Use AI for research, writing, planning, and everyday tasks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B1528] border border-white/10 space-y-4 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#D946EF]">STAGE 03</span>
              <Rocket className="w-5 h-5 text-[#D946EF]" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">03 — Build</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Create useful workflows, automations, and practical AI projects.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION C — FREE AI STARTER KIT */}
      <section className="px-6 lg:px-12 py-16 max-w-5xl mx-auto w-full space-y-10 border-b border-white/10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
            Free Lead Magnet
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Your Practical AI Journey Starts Here.
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A curated collection of resources to help you move from AI curiosity to practical action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              title: 'Ready-to-Use AI Prompts',
              desc: 'Tested prompt templates for writing, research, synthesis, and everyday reasoning with modern AI assistants.',
              icon: FileText,
              color: '#FFA726',
            },
            {
              num: '02',
              title: 'Practical Workflow Blueprints',
              desc: 'Step-by-step blueprints for spreadsheet data extraction, meeting action items, and professional email drafting.',
              icon: Workflow,
              color: '#FB6A21',
            },
            {
              num: '03',
              title: 'Step-by-Step Implementation Guides',
              desc: 'Clear, straightforward guides to set up practical tools without technical friction or unnecessary complexity.',
              icon: Compass,
              color: '#FF4D6D',
            },
            {
              num: '04',
              title: 'Beginner-Friendly Learning Resources',
              desc: 'Foundational breakdowns explaining how AI works, context windows, and how to communicate with models effectively.',
              icon: BookOpen,
              color: '#D946EF',
            },
            {
              num: '05',
              title: 'AI Productivity Ideas',
              desc: 'Actionable ideas to simplify repetitive tasks and reclaim hours for high-priority career or business work.',
              icon: Lightbulb,
              color: '#7C3AED',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#111827] border border-white/10 hover:border-white/20 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold" style={{ color: item.color }}>
                    PART {item.num}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-lg font-display font-bold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION D — LEARNING ROADMAP */}
      <section className="px-6 lg:px-12 py-16 max-w-5xl mx-auto w-full space-y-10 border-b border-white/10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
            Learning Roadmap
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            A Clear Path From AI Beginner to AI Builder.
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Build confidence through practical skills—not endless tutorials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: 'Step 1',
              title: 'Explore',
              desc: 'Understand AI fundamentals and discover useful tools.',
              color: '#FFA726',
            },
            {
              step: 'Step 2',
              title: 'Apply',
              desc: 'Use AI to improve everyday work and productivity.',
              color: '#FB6A21',
            },
            {
              step: 'Step 3',
              title: 'Build',
              desc: 'Create prompts, workflows, and useful AI solutions.',
              color: '#D946EF',
            },
            {
              step: 'Step 4',
              title: 'Implement',
              desc: 'Solve real problems and develop a portfolio of practical work.',
              color: '#7C3AED',
            },
          ].map((stage, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0B1528] border border-white/10 space-y-3 hover:border-white/20 transition-all relative"
            >
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: stage.color }}>
                {stage.step}
              </span>
              <h3 className="text-xl font-display font-bold text-white">{stage.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 — SIGNATURE PROGRAM: 90 DAYS, 9 MISSIONS */}
      <section className="px-6 lg:px-12 py-16 max-w-5xl mx-auto w-full space-y-12 border-b border-white/10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#FFA726]">
            <Layers className="w-3.5 h-3.5" />
            <span>The 90-Day AI Implementation Hackathon Method</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            90 Days. 9 Practical Missions. Real AI Skills.
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A structured, implementation-first learning journey designed to help you move beyond AI tutorials and build practical capability.
          </p>
        </div>

        {/* Three Phases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#111827] border border-[#FFA726]/30 space-y-2">
            <span className="text-xs font-mono font-bold text-[#FFA726] uppercase">Phase 1</span>
            <h3 className="text-lg font-display font-bold text-white">CLARITY</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand AI, identify opportunities, and learn the foundations.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#111827] border border-[#FB6A21]/30 space-y-2">
            <span className="text-xs font-mono font-bold text-[#FB6A21] uppercase">Phase 2</span>
            <h3 className="text-lg font-display font-bold text-white">IMPLEMENTATION</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Apply AI to real work, build workflows, and experiment with useful tools.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#111827] border border-[#D946EF]/30 space-y-2">
            <span className="text-xs font-mono font-bold text-[#D946EF] uppercase">Phase 3</span>
            <h3 className="text-lg font-display font-bold text-white">TRANSFORMATION</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete practical projects, improve your systems, and create a roadmap for continued growth.
            </p>
          </div>
        </div>

        {/* 9 Missions Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold text-white text-center">
            Curriculum Roadmap Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { num: '01', title: 'AI Foundations', desc: 'Understand essential AI concepts and practical applications.' },
              { num: '02', title: 'AI Productivity', desc: 'Use AI to simplify everyday tasks and improve your workflow.' },
              { num: '03', title: 'Prompt & Context Mastery', desc: 'Learn to communicate clearly with AI and provide useful context.' },
              { num: '04', title: 'AI Tools & Research', desc: 'Explore useful AI tools and research workflows, including tools such as NotebookLM where relevant.' },
              { num: '05', title: 'Real-World AI Use Cases', desc: 'Identify opportunities to use AI in your work, business, or personal projects.' },
              { num: '06', title: 'AI Workflow Building', desc: 'Connect repeatable steps into useful AI-assisted workflows.' },
              { num: '07', title: 'AI Agents & Automation', desc: 'Explore practical AI agents, no-code automation, and integrations.' },
              { num: '08', title: 'Build Your AI Project', desc: 'Develop a useful AI solution or personal AI ecosystem.' },
              { num: '09', title: 'Your AI-Powered Future', desc: 'Review your work, showcase practical progress, and plan your next steps.' },
            ].map((m) => (
              <div key={m.num} className="p-4 rounded-xl bg-[#0B1528] border border-white/10 space-y-1.5">
                <span className="text-xs font-mono text-[#FFA726] font-semibold">
                  Mission {m.num}
                </span>
                <h4 className="text-sm font-display font-bold text-white">{m.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-center text-slate-500 font-mono pt-2">
            * Illustrative educational curriculum outline. The free Starter Kit below is your primary starting point.
          </p>
        </div>
      </section>

      {/* SECTION 7 — PRACTICAL SKILLS SECTION */}
      <section className="px-6 lg:px-12 py-16 max-w-5xl mx-auto w-full space-y-10 border-b border-white/10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
            Direct Value
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Learn Skills You Can Actually Use.
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Practical AI skills for your work, projects, and everyday life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'AI Prompting',
              desc: 'Get clearer, more useful AI responses.',
              icon: MessageCircle,
              color: '#FFA726',
            },
            {
              title: 'AI Research',
              desc: 'Find, organize, and understand information faster.',
              icon: BookOpen,
              color: '#FB6A21',
            },
            {
              title: 'AI Productivity',
              desc: 'Simplify writing, planning, and repetitive tasks.',
              icon: Clock,
              color: '#FF4D6D',
            },
            {
              title: 'AI Content Creation',
              desc: 'Create better drafts, presentations, and creative assets.',
              icon: Sparkles,
              color: '#D946EF',
            },
            {
              title: 'AI Workflows',
              desc: 'Turn repeated tasks into consistent processes.',
              icon: Workflow,
              color: '#7C3AED',
            },
            {
              title: 'AI Agents & Automation',
              desc: 'Explore ways to connect tools and automate useful work.',
              icon: Cpu,
              color: '#FFA726',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#111827] border border-white/10 hover:border-white/20 transition-all space-y-3"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 9 — WHO THIS IS FOR */}
      <section className="px-6 lg:px-12 py-16 max-w-5xl mx-auto w-full space-y-10 border-b border-white/10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
            Audience
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            AI Skills for People Who Want to Move Forward.
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Designed for curious learners who prefer clear implementation over theoretical hype.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Working Professionals',
              desc: 'Use AI to work smarter and strengthen practical skills.',
              icon: Briefcase,
            },
            {
              title: 'Beginners',
              desc: 'Start learning AI without feeling overwhelmed.',
              icon: Users,
            },
            {
              title: 'Freelancers & Creators',
              desc: 'Use AI to support research, content, and project delivery.',
              icon: Sparkles,
            },
            {
              title: 'Business Owners',
              desc: 'Explore practical ways to simplify operations and workflows.',
              icon: Target,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0B1528] border border-white/10 space-y-3 hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 text-[#FFA726] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 10 — HOW TO GET STARTED */}
      <section className="px-6 lg:px-12 py-16 max-w-5xl mx-auto w-full space-y-10 border-b border-white/10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
            Get Started
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Three Simple Steps to Begin.
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Moving from curiosity to capability doesn't require complex setups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
            <span className="text-2xl font-display font-extrabold text-[#FFA726]">01</span>
            <h3 className="text-lg font-display font-bold text-white">Register</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Complete the existing free Starter Kit registration form below.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
            <span className="text-2xl font-display font-extrabold text-[#FB6A21]">02</span>
            <h3 className="text-lg font-display font-bold text-white">Access</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Open the resources through the existing Google Drive delivery flow.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
            <span className="text-2xl font-display font-extrabold text-[#D946EF]">03</span>
            <h3 className="text-lg font-display font-bold text-white">Apply</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Choose one useful AI idea and put it into practice.
            </p>
          </div>
        </div>
      </section>

      {/* 5. REGISTRATION FORM SECTION (Preserved Inputs & Validation Exactly) */}
      <section id="starter-kit-form" className="px-6 lg:px-12 py-16 bg-[#0B1528] border-b border-white/10">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
              Simple & Fast
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Claim Your Free AI Starter Kit
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              A simple start. Practical resources. No unnecessary complexity.
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

            {/* Profession (Chips) */}
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
                <option value="Automate daily work tasks">Automate daily work tasks</option>
                <option value="Build AI Agents & Workflows">Build practical AI agents & workflows</option>
                <option value="Career Growth & High-Income Skills">Strengthen career and professional AI skills</option>
                <option value="Create Content & Grow Audience">Support research, writing, and content creation</option>
                <option value="Launch an AI Business">Explore practical AI business use cases</option>
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

            {/* Submit Button — Exact Text Preserved */}
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

      {/* SECTION 8 — ABOUT THE FOUNDER */}
      <section className="px-6 lg:px-12 py-16 max-w-4xl mx-auto w-full space-y-6 text-center border-b border-white/10">
        <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
          About The Educator
        </span>
        <h2 className="text-3xl font-display font-bold text-white">
          Meet Uday Kiran.
        </h2>
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An IT professional and practical AI educator helping people turn AI knowledge into useful skills.
        </p>

        <blockquote className="max-w-xl mx-auto p-6 rounded-2xl bg-[#0B1528] border border-white/10 text-sm sm:text-base text-slate-200 font-display italic">
          "My goal is simple: make AI easier to understand, easier to apply, and more useful in everyday work."
        </blockquote>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Uday Kiran brings more than a decade of experience in IT and software testing and focuses on practical AI learning, implementation, and real-world workflows.
        </p>

        <div className="pt-2 flex items-center justify-center gap-6 text-xs text-[#FFA726] font-mono">
          <span>Make AI Simple.</span>
          <span>·</span>
          <span>Practical.</span>
          <span>·</span>
          <span>Useful.</span>
        </div>
      </section>

      {/* SECTION 11 — FAQ */}
      <section className="px-6 lg:px-12 py-16 max-w-3xl mx-auto w-full space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
            Questions & Answers
          </span>
          <h2 className="text-3xl font-display font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400">
            Clear answers to common questions before getting started.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Is this suitable for AI beginners?',
              a: 'Yes. The learning resources are designed to help beginners understand practical AI concepts and start applying them.',
            },
            {
              q: 'Do I need coding experience?',
              a: 'No coding experience is required to get started with the beginner-friendly resources. Some advanced projects may involve technical concepts.',
            },
            {
              q: 'What will I receive after registration?',
              a: 'Access to the free AI Starter Kit through the existing resource delivery flow.',
            },
            {
              q: 'Is the Starter Kit free?',
              a: 'Yes. The Starter Kit is free.',
            },
            {
              q: 'What is the 90-Day AI Implementation Hackathon?',
              a: "It is Uday Kiran's structured learning framework built around nine practical missions, from AI foundations to real-world implementation.",
            },
            {
              q: 'Do I have to join the 90-day program to access the free kit?',
              a: 'No. The free Starter Kit is a separate starting resource.',
            },
          ].map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#111827] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-white hover:text-[#FFA726] transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#FFA726]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
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
