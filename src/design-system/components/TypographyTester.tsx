/**
 * Uday Kiran Brand System - Typography & Spacing Tester
 * Interactive type scale explorer with font pairing inspection and authentic Telugu rendering.
 */

import React, { useState } from 'react';
import { TYPOGRAPHY_SYSTEM, TypeScaleStep } from '../tokens/typography';
import { Type, Sparkles, Globe, Sliders } from 'lucide-react';

export const TypographyTester: React.FC = () => {
  const [customText, setCustomText] = useState<string>('Make AI Simple. Practical. Useful.');
  const [selectedFont, setSelectedFont] = useState<'sora' | 'jakarta' | 'manrope' | 'mono' | 'telugu'>('sora');

  const fontClasses = {
    sora: 'font-display',
    jakarta: 'font-jakarta',
    manrope: 'font-manrope',
    mono: 'font-mono-tech',
    telugu: 'font-telugu',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Premium Typography System</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Engineered type scale, pairing rules, tabular numerics, and high-quality Telugu script support.
          </p>
        </div>

        {/* Font Family Selector */}
        <div className="flex items-center gap-1 p-1 bg-[#111827] rounded-lg border border-white/10">
          {(['sora', 'jakarta', 'manrope', 'mono', 'telugu'] as const).map((font) => (
            <button
              key={font}
              onClick={() => setSelectedFont(font)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap shrink-0 ${
                selectedFont === font
                  ? 'bg-gradient-to-r from-[#FFA726] to-[#FB6A21] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {font === 'sora' ? 'Sora (Display)' : font === 'jakarta' ? 'Plus Jakarta' : font === 'mono' ? 'JetBrains Mono' : font === 'telugu' ? 'తెలుగు (Telugu)' : 'Manrope (Body)'}
            </button>
          ))}
        </div>
      </div>

      {/* Live Interactive Text Sandbox */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#111827] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFA726]">
            <Sliders className="w-4 h-4" />
            <span>Live Typography Sandbox</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Active: {selectedFont.toUpperCase()}
          </span>
        </div>

        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Type any sample headline..."
          className="w-full px-4 py-2.5 rounded-xl bg-[#071426] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#FFA726] text-sm"
        />

        <div className="pt-4 border-t border-white/5 space-y-2">
          <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">
            Rendered Display (ExtraBold / 800):
          </span>
          <div className={`text-3xl md:text-5xl font-extrabold text-white tracking-tight ${fontClasses[selectedFont]}`}>
            {customText || 'Make AI Simple. Practical. Useful.'}
          </div>
        </div>
      </div>

      {/* Complete Type Scale Matrix */}
      <div className="space-y-4">
        <h4 className="text-sm font-display font-semibold uppercase tracking-wider text-slate-400">
          Canonical Type Scale Hierarchy
        </h4>

        <div className="space-y-3">
          {TYPOGRAPHY_SYSTEM.scale.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#111827]/70 border border-white/10 hover:border-white/20 transition-all space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-white text-sm">{step.name}</span>
                  <span className="text-slate-500">·</span>
                  <span className="font-mono text-[#FFA726]">{step.size}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300">Weight: {step.weight}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{step.usage}</span>
              </div>

              <div
                className={`text-white ${step.name.includes('Display') || step.name.includes('Headline') ? 'font-display' : step.name.includes('Technical') ? 'font-mono-tech' : 'font-manrope'}`}
                style={{
                  fontSize: step.size.includes('clamp') ? '2.25rem' : step.size.split(' ')[0],
                  lineHeight: step.lineHeight,
                  letterSpacing: step.tracking,
                }}
              >
                {step.sampleText}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multilingual Telugu Showcase */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#1B1035] to-[#071426] border border-[#7C3AED]/30 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D946EF]">
            <Globe className="w-4 h-4" />
            <span>Multilingual Specification · తెలుగు (Telugu Typography)</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-[#7C3AED]/20 text-[#B794F6] border border-[#7C3AED]/30 font-mono">
            Noto Sans Telugu
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold font-telugu text-white tracking-normal">
            {TYPOGRAPHY_SYSTEM.teluguSample.heading}
          </h2>
          <p className="text-lg font-telugu text-[#FFA726] font-medium">
            {TYPOGRAPHY_SYSTEM.teluguSample.tagline}
          </p>
          <p className="text-sm font-telugu text-slate-300 leading-relaxed max-w-2xl">
            {TYPOGRAPHY_SYSTEM.teluguSample.body}
          </p>
        </div>

        <div className="pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between font-mono">
          <span>Translation: "Make AI Simple. Practical. Useful."</span>
          <span className="text-slate-300">Telugu glyphs rendered with proportional Latin baseline alignment</span>
        </div>
      </div>
    </div>
  );
};
