/**
 * Uday Kiran Brand System - Presentation Studio
 * 16:9 widescreen interactive deck with progressive reveals, keyboard navigation,
 * subtle "Created by Uday Kiran" watermark, and editable PowerPoint (.pptx) export.
 */

import React, { useState, useEffect, useRef } from 'react';
import pptxgen from 'pptxgenjs';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  type: 'title' | 'pillars' | 'architecture' | 'metrics' | 'telugu' | 'closing';
  totalSteps: number;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: 'Make AI Simple. Practical. Useful.',
    subtitle: 'The Architectural Blueprint for High-Value Generative Systems',
    type: 'title',
    totalSteps: 1,
  },
  {
    id: 2,
    title: 'The Three Pillars of Practical AI',
    subtitle: 'Engineering AI that drives measurable enterprise outcomes',
    type: 'pillars',
    totalSteps: 3,
  },
  {
    id: 3,
    title: 'KiranForge Cognitive Architecture',
    subtitle: 'Deterministic guardrails over probabilistic intelligence',
    type: 'architecture',
    totalSteps: 3,
  },
  {
    id: 4,
    title: 'Quantified Enterprise Velocity',
    subtitle: 'Real-world benchmarks achieved across production deployments',
    type: 'metrics',
    totalSteps: 3,
  },
  {
    id: 5,
    title: 'Multilingual Cognitive Parity',
    subtitle: 'Empowering regional accessibility through high-fidelity Telugu models',
    type: 'telugu',
    totalSteps: 2,
  },
  {
    id: 6,
    title: 'Build What Truly Matters.',
    subtitle: 'The future of AI is not bigger models — it is practical execution.',
    type: 'closing',
    totalSteps: 1,
  },
];

export const PresentationStudio: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeSlide = SLIDES[currentSlideIndex];

  // Progressive Step Advancement or Next Slide
  const handleNext = () => {
    if (currentStep < activeSlide.totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setCurrentStep(1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setCurrentStep(SLIDES[currentSlideIndex - 1].totalSteps);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, currentStep, isFullscreen]);

  // PowerPoint (.pptx) Native Generator using pptxgenjs
  const exportToPPTX = async () => {
    try {
      setIsExporting(true);
      const pres = new pptxgen();
      pres.layout = 'LAYOUT_16x9';
      pres.author = 'Uday Kiran';
      pres.company = 'KiranForge | Practical AI';
      pres.title = 'Uday Kiran - Practical AI Master Presentation';

      // Slide 1: Title
      const s1 = pres.addSlide();
      s1.background = { color: '071426' };
      // Background accent rect
      s1.addShape(pres.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.33,
        h: 0.15,
        fill: { color: 'FFA726' },
      });
      s1.addText('UDAY KIRAN | PRACTICAL AI', {
        x: 1.0,
        y: 1.8,
        w: 11.33,
        h: 0.5,
        fontSize: 16,
        color: 'FFA726',
        bold: true,
        fontFace: 'Arial',
      });
      s1.addText('Make AI Simple.\nPractical. Useful.', {
        x: 1.0,
        y: 2.4,
        w: 11.33,
        h: 2.2,
        fontSize: 44,
        color: 'FFFFFF',
        bold: true,
        fontFace: 'Arial',
        lineSpacing: 50,
      });
      s1.addText('The Architectural Blueprint for High-Value Generative Systems', {
        x: 1.0,
        y: 4.8,
        w: 11.33,
        h: 0.8,
        fontSize: 20,
        color: 'FFB3A7',
        fontFace: 'Arial',
      });
      s1.addText('Created by Uday Kiran', {
        x: 1.0,
        y: 6.8,
        w: 11.33,
        h: 0.4,
        fontSize: 11,
        color: 'D5B46B',
        fontFace: 'Arial',
      });

      // Slide 2: Three Pillars
      const s2 = pres.addSlide();
      s2.background = { color: '071426' };
      s2.addText('CORE METHODOLOGY', { x: 1.0, y: 0.8, w: 10, h: 0.4, fontSize: 13, color: 'FFA726', bold: true });
      s2.addText('The Three Pillars of Practical AI', { x: 1.0, y: 1.2, w: 11.33, h: 0.8, fontSize: 32, color: 'FFFFFF', bold: true });
      
      const pillars = [
        { num: '01', title: 'Simple', desc: 'Demystifying complex ML into transparent, human-comprehensible primitives.', color: 'FFA726' },
        { num: '02', title: 'Practical', desc: 'Deploying robust production engineering over fragile toy demos.', color: 'FB6A21' },
        { num: '03', title: 'Useful', desc: 'Generating direct P&L acceleration and measurable operational velocity.', color: 'D946EF' },
      ];
      pillars.forEach((p, i) => {
        const xPos = 1.0 + i * 3.8;
        s2.addShape(pres.ShapeType.roundRect, { x: xPos, y: 2.4, w: 3.5, h: 3.8, fill: { color: '111827' }, line: { color: p.color, width: 1.5 }, rectRadius: 0.15 });
        s2.addText(p.num, { x: xPos + 0.3, y: 2.7, w: 1, h: 0.5, fontSize: 18, color: p.color, bold: true });
        s2.addText(p.title, { x: xPos + 0.3, y: 3.3, w: 3, h: 0.6, fontSize: 22, color: 'FFFFFF', bold: true });
        s2.addText(p.desc, { x: xPos + 0.3, y: 4.1, w: 2.9, h: 1.8, fontSize: 14, color: '94A3B8' });
      });
      s2.addText('Created by Uday Kiran', { x: 1.0, y: 6.8, w: 11.33, h: 0.4, fontSize: 11, color: 'D5B46B' });

      // Slide 3: Architecture
      const s3 = pres.addSlide();
      s3.background = { color: '1B1035' };
      s3.addText('KIRANFORGE SYSTEMS', { x: 1.0, y: 0.8, w: 10, h: 0.4, fontSize: 13, color: 'D946EF', bold: true });
      s3.addText('Deterministic AI Cognitive Engine', { x: 1.0, y: 1.2, w: 11.33, h: 0.8, fontSize: 32, color: 'FFFFFF', bold: true });
      s3.addShape(pres.ShapeType.roundRect, { x: 1.0, y: 2.4, w: 3.4, h: 3.6, fill: { color: '071426' }, line: { color: 'FFA726', width: 1.5 }, rectRadius: 0.15 });
      s3.addText('Phase 1: Input Ingestion', { x: 1.2, y: 2.7, w: 3.0, h: 0.5, fontSize: 18, color: 'FFA726', bold: true });
      s3.addText('Strict schema validation & vector context normalization.', { x: 1.2, y: 3.4, w: 3.0, h: 2, fontSize: 13, color: '94A3B8' });

      s3.addShape(pres.ShapeType.roundRect, { x: 4.9, y: 2.4, w: 3.4, h: 3.6, fill: { color: '071426' }, line: { color: 'FB6A21', width: 1.5 }, rectRadius: 0.15 });
      s3.addText('Phase 2: Logic Verification', { x: 5.1, y: 2.7, w: 3.0, h: 0.5, fontSize: 18, color: 'FB6A21', bold: true });
      s3.addText('Deterministic invariants block hallucinations prior to model emission.', { x: 5.1, y: 3.4, w: 3.0, h: 2, fontSize: 13, color: '94A3B8' });

      s3.addShape(pres.ShapeType.roundRect, { x: 8.8, y: 2.4, w: 3.4, h: 3.6, fill: { color: '071426' }, line: { color: '7C3AED', width: 1.5 }, rectRadius: 0.15 });
      s3.addText('Phase 3: Production Action', { x: 9.0, y: 2.7, w: 3.0, h: 0.5, fontSize: 18, color: 'D946EF', bold: true });
      s3.addText('Autonomous task execution with audit logging & telemetry sync.', { x: 9.0, y: 3.4, w: 3.0, h: 2, fontSize: 13, color: '94A3B8' });
      s3.addText('Created by Uday Kiran', { x: 1.0, y: 6.8, w: 11.33, h: 0.4, fontSize: 11, color: 'D5B46B' });

      // Slide 4: Metrics
      const s4 = pres.addSlide();
      s4.background = { color: '071426' };
      s4.addText('QUANTIFIED PERFORMANCE', { x: 1.0, y: 0.8, w: 10, h: 0.4, fontSize: 13, color: 'FFA726', bold: true });
      s4.addText('Measurable Production Impact', { x: 1.0, y: 1.2, w: 11.33, h: 0.8, fontSize: 32, color: 'FFFFFF', bold: true });
      
      const metrics = [
        { val: '+320%', label: 'Workflow Execution Velocity', sub: 'From 4.5 hours down to 48 seconds' },
        { val: '99.98%', label: 'Deterministic Model Invariant Rate', sub: 'Zero ungrounded hallucinations' },
        { val: '$1.4M', label: 'Annual Operational Cost Saved', sub: 'Via agentic pipeline automation' },
      ];
      metrics.forEach((m, idx) => {
        const xPos = 1.0 + idx * 3.8;
        s4.addShape(pres.ShapeType.roundRect, { x: xPos, y: 2.5, w: 3.5, h: 3.4, fill: { color: '111827' }, line: { color: '38BDF8', width: 1.2 }, rectRadius: 0.15 });
        s4.addText(m.val, { x: xPos + 0.3, y: 2.9, w: 3, h: 0.8, fontSize: 36, color: 'FFA726', bold: true });
        s4.addText(m.label, { x: xPos + 0.3, y: 3.8, w: 3, h: 0.6, fontSize: 16, color: 'FFFFFF', bold: true });
        s4.addText(m.sub, { x: xPos + 0.3, y: 4.6, w: 3, h: 0.8, fontSize: 12, color: '94A3B8' });
      });
      s4.addText('Created by Uday Kiran', { x: 1.0, y: 6.8, w: 11.33, h: 0.4, fontSize: 11, color: 'D5B46B' });

      // Slide 5: Multilingual Telugu
      const s5 = pres.addSlide();
      s5.background = { color: '1B1035' };
      s5.addText('MULTILINGUAL INCLUSION', { x: 1.0, y: 0.8, w: 10, h: 0.4, fontSize: 13, color: 'D946EF', bold: true });
      s5.addText('తెలుగు (Telugu) & Regional AI Excellence', { x: 1.0, y: 1.2, w: 11.33, h: 0.8, fontSize: 32, color: 'FFFFFF', bold: true });
      s5.addText('కృత్రిమ మేధస్సును సులభతరం చేయడం. ఆచరణాత్మకం. ఉపయోగకరం.', {
        x: 1.0,
        y: 2.8,
        w: 11.33,
        h: 1.2,
        fontSize: 26,
        color: 'FFA726',
        bold: true,
      });
      s5.addText('Delivering native semantic reasoning in Indic languages ensures technology empowers every community.', {
        x: 1.0,
        y: 4.2,
        w: 10,
        h: 1.2,
        fontSize: 18,
        color: 'FFFFFF',
      });
      s5.addText('Created by Uday Kiran', { x: 1.0, y: 6.8, w: 11.33, h: 0.4, fontSize: 11, color: 'D5B46B' });

      // Slide 6: Closing
      const s6 = pres.addSlide();
      s6.background = { color: '071426' };
      s6.addText('UDAY KIRAN | PRACTICAL AI', { x: 1.0, y: 2.0, w: 11.33, h: 0.5, fontSize: 18, color: 'FFA726', bold: true });
      s6.addText('Build What Truly Matters.', { x: 1.0, y: 2.6, w: 11.33, h: 1.5, fontSize: 50, color: 'FFFFFF', bold: true });
      s6.addText('The future of AI is not bigger models — it is practical execution.', { x: 1.0, y: 4.2, w: 11.33, h: 0.8, fontSize: 22, color: 'FFB3A7' });
      s6.addText('Created by Uday Kiran', { x: 1.0, y: 6.8, w: 11.33, h: 0.4, fontSize: 11, color: 'D5B46B' });

      await pres.writeFile({ fileName: 'Uday_Kiran_Practical_AI_Presentation.pptx' });
      setExportSuccess('Native PowerPoint (.pptx) successfully downloaded!');
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      alert('PPTX export error. Try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-display font-bold text-white">
              Presentation Design System
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFA726]/10 text-[#FFA726] border border-[#FFA726]/20 font-mono">
              16:9 Widescreen
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Keyboard enabled (←/→ or Space). Interactive reveals with native PPTX download.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {exportSuccess && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{exportSuccess}</span>
            </span>
          )}

          <button
            onClick={exportToPPTX}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] text-white font-display font-semibold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating PPTX...' : 'Export Native PPTX'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 16:9 Slide Stage */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-video rounded-3xl overflow-hidden border border-white/15 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
          isFullscreen ? 'fixed inset-4 z-50 rounded-2xl max-w-none' : 'bg-[#071426]'
        }`}
        style={{
          background:
            activeSlide.type === 'architecture' || activeSlide.type === 'telugu'
              ? 'linear-gradient(135deg, #1B1035 0%, #071426 100%)'
              : '#071426',
        }}
      >
        {/* Subtle Ambient Glow Behind Slide */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-bl from-[#FFA726]/15 via-[#D946EF]/10 to-transparent blur-3xl pointer-events-none" />

        {/* Slide Header Zone */}
        <div className="relative z-10 px-8 md:px-12 pt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#FFA726] uppercase tracking-widest">
              Uday Kiran | Practical AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              Slide {currentSlideIndex + 1} of {SLIDES.length}
            </span>
            <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FFA726] to-[#D946EF] transition-all duration-300"
                style={{ width: `${((currentSlideIndex + 1) / SLIDES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Slide Content Zone */}
        <div className="relative z-10 px-8 md:px-12 py-4 flex-1 flex flex-col justify-center">
          {/* SLIDE 1: TITLE */}
          {activeSlide.type === 'title' && (
            <div className="max-w-3xl space-y-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#FFA726]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Master Keynote</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-none">
                Make AI Simple.{' '}
                <span className="bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] bg-clip-text text-transparent">
                  Practical. Useful.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-manrope leading-relaxed">
                {activeSlide.subtitle}
              </p>
            </div>
          )}

          {/* SLIDE 2: PILLARS */}
          {activeSlide.type === 'pillars' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
                  Foundational Framework
                </span>
                <h2 className="text-2xl md:text-4xl font-display font-bold text-white mt-1">
                  The Three Pillars of Practical AI
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    step: 1,
                    num: '01',
                    title: 'Simple',
                    color: '#FFA726',
                    desc: 'Demystifying neural complexity into clean, intuitive operational primitives anyone can leverage.',
                  },
                  {
                    step: 2,
                    num: '02',
                    title: 'Practical',
                    color: '#FB6A21',
                    desc: 'Prioritizing deterministic reliability, schema contracts, and verifiable unit tests over flashy demos.',
                  },
                  {
                    step: 3,
                    num: '03',
                    title: 'Useful',
                    color: '#D946EF',
                    desc: 'Measuring success purely by enterprise acceleration, cost reduction, and real human productivity gains.',
                  },
                ].map((p) => (
                  <div
                    key={p.step}
                    className={`p-6 rounded-2xl border transition-all duration-500 backdrop-blur-md ${
                      currentStep >= p.step
                        ? 'bg-[#111827]/90 border-[#FFA726] shadow-xl shadow-[#FFA726]/10 scale-100 opacity-100'
                        : 'bg-[#111827]/30 border-white/5 scale-95 opacity-25'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold" style={{ color: p.color }}>
                        PILLAR {p.num}
                      </span>
                      {currentStep >= p.step && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2">{p.title}</h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 3: ARCHITECTURE */}
          {activeSlide.type === 'architecture' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#D946EF]">
                  KiranForge Engineering
                </span>
                <h2 className="text-2xl md:text-4xl font-display font-bold text-white mt-1">
                  Deterministic Cognitive Workflow Loop
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                {[
                  {
                    step: 1,
                    title: '1. Ingestion & Normalize',
                    sub: 'Schema Enforcement',
                    desc: 'Input vectors validated against strict JSON schema invariants.',
                    color: '#FFA726',
                  },
                  {
                    step: 2,
                    title: '2. Reasoning Sandbox',
                    sub: 'Deterministic Logic',
                    desc: 'Multi-agent arbitration eliminates probabilistic hallucinations.',
                    color: '#FB6A21',
                  },
                  {
                    step: 3,
                    title: '3. Verified Execution',
                    sub: 'Production Action',
                    desc: 'State updates committed to Cloud SQL and logged with full audit trails.',
                    color: '#7C3AED',
                  },
                ].map((node) => (
                  <div
                    key={node.step}
                    className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col justify-between ${
                      currentStep >= node.step
                        ? 'bg-[#071426]/90 border-[#D946EF] shadow-lg shadow-[#D946EF]/15 scale-100 opacity-100'
                        : 'bg-[#071426]/30 border-white/5 scale-95 opacity-25'
                    }`}
                  >
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                        {node.sub}
                      </span>
                      <h4 className="text-lg font-display font-bold text-white mb-2">{node.title}</h4>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{node.desc}</p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Status</span>
                      <span className="text-emerald-400 font-medium">Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 4: METRICS */}
          {activeSlide.type === 'metrics' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
                  Quantified Proof
                </span>
                <h2 className="text-2xl md:text-4xl font-display font-bold text-white mt-1">
                  Measurable Production Outcomes
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    step: 1,
                    stat: '+320%',
                    title: 'Execution Velocity',
                    desc: 'From 4.5 hours down to 48 seconds per autonomous workflow run.',
                    tag: 'Speed',
                  },
                  {
                    step: 2,
                    stat: '99.98%',
                    title: 'Model Invariant Rate',
                    desc: 'Deterministic bounds virtually eliminate hallucinations across 10M tokens.',
                    tag: 'Reliability',
                  },
                  {
                    step: 3,
                    stat: '$1.4M',
                    title: 'Annualized Compute Saved',
                    desc: 'Optimized routing reduces unnecessary deep model calls by 74%.',
                    tag: 'Efficiency',
                  },
                ].map((m) => (
                  <div
                    key={m.step}
                    className={`p-6 rounded-2xl border transition-all duration-500 backdrop-blur-md ${
                      currentStep >= m.step
                        ? 'bg-[#111827]/90 border-[#38BDF8] shadow-lg shadow-[#38BDF8]/10 scale-100 opacity-100'
                        : 'bg-[#111827]/30 border-white/5 scale-95 opacity-25'
                    }`}
                  >
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                      {m.tag}
                    </span>
                    <div className="text-4xl md:text-5xl font-mono font-extrabold text-[#FFA726] tracking-tight mb-2">
                      {m.stat}
                    </div>
                    <h4 className="text-base font-display font-bold text-white mb-1">{m.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 5: TELUGU */}
          {activeSlide.type === 'telugu' && (
            <div className="max-w-3xl space-y-4 animate-fade-in">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D946EF]">
                Multilingual AI Leadership · తెలుగు
              </span>
              <h2 className="text-3xl md:text-5xl font-telugu font-bold text-white leading-tight">
                కృత్రిమ మేధస్సును సులభతరం చేయడం. ఆచరణాత్మకం. ఉపయోగకరం.
              </h2>
              <p className="text-base md:text-lg text-[#FFB3A7] font-telugu leading-relaxed">
                సాంకేతికత ప్రతి ఒక్కరికీ అందుబాటులో ఉన్నప్పుడే దాని అసలైన విలువ సాధ్యమవుతుంది.
              </p>
              <div className="pt-4 text-xs font-mono text-slate-400">
                English Parity: "Make AI Simple. Practical. Useful."
              </div>
            </div>
          )}

          {/* SLIDE 6: CLOSING */}
          {activeSlide.type === 'closing' && (
            <div className="max-w-3xl space-y-4 animate-fade-in text-center mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
                Uday Kiran | Practical AI
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
                Build What Truly Matters.
              </h2>
              <p className="text-lg md:text-xl text-[#FFB3A7] max-w-xl mx-auto leading-relaxed">
                The future of AI is not bigger models — it is practical execution.
              </p>
              <div className="pt-4 flex items-center justify-center gap-4">
                <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                  contact@udaykiran.ai · KiranForge
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Slide Footer: Navigation Controls & Subtle Watermark */}
        <div className="relative z-10 px-8 md:px-12 pb-6 flex items-center justify-between border-t border-white/5 pt-4">
          {/* Canonical Watermark (MANDATORY RULE) */}
          <div className="text-[11px] font-mono tracking-wide text-[#D5B46B]/80 select-none">
            Created by Uday Kiran
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Step {currentStep}/{activeSlide.totalSteps}
            </span>
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0 && currentStep === 1}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === SLIDES.length - 1 && currentStep === activeSlide.totalSteps}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Thumbnails Tray */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => {
              setCurrentSlideIndex(idx);
              setCurrentStep(1);
            }}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              idx === currentSlideIndex
                ? 'border-[#FFA726] bg-[#111827] ring-1 ring-[#FFA726] shadow-md shadow-[#FFA726]/10'
                : 'border-white/10 hover:border-white/20 bg-[#111827]/40'
            }`}
          >
            <span className="text-[10px] font-mono text-[#FFA726] block mb-1">
              Slide 0{slide.id}
            </span>
            <span className="text-xs font-display font-medium text-white truncate block">
              {slide.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
