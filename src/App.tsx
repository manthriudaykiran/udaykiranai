/**
 * Uday Kiran Premium Brand Design System - Master Showcase Application
 * Flagship interactive experience consolidating all 15 required brand assets, tokens,
 * presentation engine, social templates, and enterprise UI.
 */

import React, { useState } from 'react';
import { BrandWordmark } from './design-system/components/BrandWordmark';
import { ColorPaletteInspector } from './design-system/components/ColorPaletteInspector';
import { GradientStudio } from './design-system/components/GradientStudio';
import { ThemeSwitcherPreview } from './design-system/components/ThemeSwitcherPreview';
import { TypographyTester } from './design-system/components/TypographyTester';
import { GlassmorphismPlayground } from './design-system/components/GlassmorphismPlayground';
import { MotionShowcase } from './design-system/components/MotionShowcase';
import { PresentationStudio } from './design-system/components/PresentationStudio';
import { SocialMediaStudio } from './design-system/components/SocialMediaStudio';
import { DashboardShowcase } from './design-system/components/DashboardShowcase';
import { TokensExportModal } from './design-system/components/TokensExportModal';
import {
  ArrowRight,
  Code,
  Download,
  Eye,
  FileText,
  Layers,
  Palette,
  Play,
  Share2,
  Sparkles,
  Tv,
  Type,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'palette' | 'gradients' | 'themes' | 'typography' | 'surfaces' | 'motion' | 'presentation' | 'social' | 'console' | 'guidelines'
  >('presentation');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#071426] text-white flex flex-col selection:bg-[#FB6A21]/30 selection:text-[#FFA726]">
      {/* 1. TOP BAR CONTRACT: Exactly 3 Zones */}
      <header className="sticky top-0 z-40 bg-[#071426]/90 backdrop-blur-xl border-b border-white/10 px-6 lg:px-12 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <BrandWordmark brand="personal" size="md" />

        {/* Zone 2: 4-5 single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-manrope font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('presentation')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'presentation' ? 'text-[#FFA726] font-semibold' : 'hover:text-white'
            }`}
          >
            Presentation Deck
          </button>
          <button
            onClick={() => setActiveTab('palette')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'palette' ? 'text-[#FFA726] font-semibold' : 'hover:text-white'
            }`}
          >
            Colors & Tokens
          </button>
          <button
            onClick={() => setActiveTab('gradients')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'gradients' ? 'text-[#FFA726] font-semibold' : 'hover:text-white'
            }`}
          >
            Gradients
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'themes' ? 'text-[#FFA726] font-semibold' : 'hover:text-white'
            }`}
          >
            6 Themes
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'social' ? 'text-[#FFA726] font-semibold' : 'hover:text-white'
            }`}
          >
            YouTube & Instagram
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'console' ? 'text-[#FFA726] font-semibold' : 'hover:text-white'
            }`}
          >
            KiranForge Console
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 text-xs font-display font-semibold text-white bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Export Tokens</span>
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION — MASTER STATEMENT */}
      <section className="relative px-6 lg:px-12 pt-16 pb-12 overflow-hidden border-b border-white/10">
        {/* Cinematic Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full bg-gradient-to-br from-[#FFA726]/20 via-[#FB6A21]/15 to-[#7C3AED]/20 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#1B1035] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#FFA726]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Permanent Brand Identity & Visual Design System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08] text-balance">
            Make AI Simple.{' '}
            <span className="bg-gradient-to-r from-[#FFA726] via-[#FB6A21] via-[#D946EF] to-[#7C3AED] bg-clip-text text-transparent">
              Practical. Useful.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-manrope leading-relaxed">
            The canonical visual identity for Uday Kiran, Practical AI, and KiranForge. Combining Apple-level restraint, Adobe-level creative color expression, and production SaaS precision.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10">
            <div>
              <span className="text-2xl font-mono font-bold text-white block">21</span>
              <span className="text-xs text-slate-400">Canonical Color Tokens</span>
            </div>
            <div>
              <span className="text-2xl font-mono font-bold text-[#FFA726] block">08</span>
              <span className="text-xs text-slate-400">Signature Gradients</span>
            </div>
            <div>
              <span className="text-2xl font-mono font-bold text-[#FB6A21] block">06</span>
              <span className="text-xs text-slate-400">Predefined Themes</span>
            </div>
            <div>
              <span className="text-2xl font-mono font-bold text-[#D946EF] block">15</span>
              <span className="text-xs text-slate-400">Motion Tokens</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NAVIGATION TAB STRIP */}
      <section className="px-6 lg:px-12 py-4 bg-[#050D1A] border-b border-white/10 sticky top-[65px] z-30 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 min-w-max">
          {[
            { id: 'presentation', label: '16:9 Presentation Deck', icon: Tv },
            { id: 'palette', label: 'Canonical Colors', icon: Palette },
            { id: 'gradients', label: 'Signature Gradients', icon: Sparkles },
            { id: 'themes', label: '6 Signature Themes', icon: Layers },
            { id: 'typography', label: 'Typography & Telugu', icon: Type },
            { id: 'surfaces', label: 'Glassmorphism', icon: Sliders },
            { id: 'motion', label: '15 Motion Tokens', icon: Play },
            { id: 'social', label: 'Social Media Studio', icon: Share2 },
            { id: 'console', label: 'KiranForge Console', icon: Code },
            { id: 'guidelines', label: 'Brand Guidelines Doc', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-display font-medium flex items-center gap-2 transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FFA726] to-[#FB6A21] text-white shadow-md font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN CONTENT WORKSPACE */}
      <main className="flex-1 px-6 lg:px-12 py-10 max-w-6xl mx-auto w-full">
        {activeTab === 'presentation' && <PresentationStudio />}
        {activeTab === 'palette' && <ColorPaletteInspector />}
        {activeTab === 'gradients' && <GradientStudio />}
        {activeTab === 'themes' && <ThemeSwitcherPreview />}
        {activeTab === 'typography' && <TypographyTester />}
        {activeTab === 'surfaces' && <GlassmorphismPlayground />}
        {activeTab === 'motion' && <MotionShowcase />}
        {activeTab === 'social' && <SocialMediaStudio />}
        {activeTab === 'console' && <DashboardShowcase />}

        {/* Brand Guidelines Markdown Viewer */}
        {activeTab === 'guidelines' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h3 className="text-xl font-display font-bold text-white">Brand Design Guidelines</h3>
                <p className="text-sm text-slate-400">
                  Permanent visual design rules saved to <code className="text-[#FFA726]">BRAND_GUIDELINES.md</code>, <code className="text-[#FFA726]">CLAUDE.md</code>, and <code className="text-[#FFA726]">AGENTS.md</code>.
                </p>
              </div>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Token Files</span>
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-[#111827] border border-white/10 space-y-6 text-sm text-slate-300 leading-relaxed font-manrope">
              <div className="p-4 rounded-xl bg-[#071426] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#FFA726] block">Persistent Rule</span>
                  <span className="font-display font-bold text-white text-base">
                    All future tasks must strictly import canonical brand tokens
                  </span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-display font-bold text-white">1. Brand Identity</h4>
                <p>
                  <strong>Creator:</strong> Uday Kiran<br />
                  <strong>Public Brand:</strong> Uday Kiran | Practical AI<br />
                  <strong>Business Brand:</strong> KiranForge<br />
                  <strong>Tagline:</strong> Make AI Simple. Practical. Useful.<br />
                  <strong>Presentation Watermark:</strong> "Created by Uday Kiran"
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-base font-display font-bold text-white">2. Color Proportion Rule</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>60%</strong> Primary background & neutral canvas (Midnight Navy <code>#071426</code> or Soft White <code>#F6F9FC</code>).</li>
                  <li><strong>25%</strong> Dominant brand color or signature gradient.</li>
                  <li><strong>10%</strong> Supporting brand color (labels, lines, borders).</li>
                  <li><strong>5%</strong> Focal accents (CTAs, key verified points).</li>
                  <li>Maximum 3 dominant chromatic colors per single composition.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-base font-display font-bold text-white">3. Zero-Pill & Anti-Slop Discipline</h4>
                <p>
                  Informational metadata (dates, authors, tags) must never be wrapped in rounded pill boxes or colored candy capsules. Use clean unboxed text with typographic separators (<code>·</code>).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 5. FOOTER */}
      <footer className="mt-auto px-6 lg:px-12 py-8 bg-[#050D1A] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <BrandWordmark brand="business" size="sm" />
          <span className="text-slate-600">·</span>
          <span>Practical AI Design System</span>
        </div>

        {/* Subtle Watermark */}
        <div className="text-[11px] font-mono text-[#D5B46B]/80">
          Created by Uday Kiran
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>WCAG AA Validated</span>
          <span className="text-slate-600">·</span>
          <span>v1.0.0 Permanent</span>
        </div>
      </footer>

      {/* Tokens Export Modal */}
      <TokensExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
