/**
 * Uday Kiran Brand System - Glassmorphism & Premium Surface Playground
 * Interactive surface sandbox for testing translucency, frosted blur, and gradient borders.
 */

import React, { useState } from 'react';
import { Sparkles, Sliders, Layers, Eye } from 'lucide-react';

export const GlassmorphismPlayground: React.FC = () => {
  const [blurAmount, setBlurAmount] = useState<number>(16);
  const [opacity, setOpacity] = useState<number>(65);
  const [borderGlow, setBorderGlow] = useState<boolean>(true);
  const [surfaceTheme, setSurfaceTheme] = useState<'dark' | 'light' | 'plum'>('dark');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Glassmorphism & Surface System</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Engineered translucent panels, frosted optical blur, and 1px gradient hairline borders.
          </p>
        </div>

        {/* Surface Variant Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#111827] rounded-lg border border-white/10">
          {(['dark', 'plum', 'light'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSurfaceTheme(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap shrink-0 ${
                surfaceTheme === t
                  ? 'bg-gradient-to-r from-[#FFA726] to-[#FB6A21] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'dark' ? 'Midnight Navy' : t === 'plum' ? 'Deep Plum' : 'Soft White'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative min-h-[460px] rounded-3xl p-8 md:p-12 overflow-hidden border border-white/10 flex flex-col justify-center items-center bg-[#071426]">
        {/* Dynamic Abstract Lighting Background Elements behind glass */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-gradient-to-tr from-[#FFA726] to-[#FB6A21] blur-2xl opacity-60 animate-pulse pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-[#D946EF] to-[#7C3AED] blur-2xl opacity-50 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#22D3EE] blur-3xl opacity-25 pointer-events-none" />

        {/* Floating Glassmorphic Container Under Test */}
        <div
          className="relative z-10 w-full max-w-xl p-8 rounded-2xl transition-all duration-300 space-y-6"
          style={{
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
            backgroundColor:
              surfaceTheme === 'dark'
                ? `rgba(17, 24, 39, ${opacity / 100})`
                : surfaceTheme === 'plum'
                ? `rgba(27, 16, 53, ${opacity / 100})`
                : `rgba(246, 249, 252, ${opacity / 100})`,
            color: surfaceTheme === 'light' ? '#071426' : '#FFFFFF',
            border: borderGlow
              ? '1px solid rgba(255, 167, 38, 0.3)'
              : '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: borderGlow
              ? '0 20px 50px -15px rgba(251, 106, 33, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)'
              : '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-current/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFA726] to-[#D946EF] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base leading-tight">
                  KiranForge Cognition Card
                </h4>
                <span className="text-[11px] opacity-70 font-mono">
                  Glass Token: surface-{surfaceTheme}
                </span>
              </div>
            </div>

            <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-current/20 font-medium">
              Blur: {blurAmount}px
            </span>
          </div>

          {/* Card Body */}
          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-display font-extrabold tracking-tight">
              Optical Depth Without Visual Clutter.
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Glassmorphism in the Uday Kiran design system is applied strictly as an elevation differentiator. It permits ambient chromatic light to permeate through surfaces without sacrificing typographic legibility.
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <button className="px-5 py-2.5 rounded-xl font-display font-semibold text-white bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] shadow-lg transition-transform hover:scale-105 text-sm">
              Explore Architecture
            </button>
            <span className="text-xs font-mono opacity-60">
              WCAG AA Validated
            </span>
          </div>
        </div>
      </div>

      {/* Sliders & Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-[#111827] border border-white/10">
        {/* Blur Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Backdrop Blur:</span>
            <span className="text-[#FFA726]">{blurAmount}px</span>
          </div>
          <input
            type="range"
            min="4"
            max="32"
            value={blurAmount}
            onChange={(e) => setBlurAmount(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FB6A21]"
          />
          <span className="text-[11px] text-slate-500 block">
            Standard: 16px (Subtle) · 24px (Heavy frosted)
          </span>
        </div>

        {/* Opacity Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Surface Opacity:</span>
            <span className="text-[#FFA726]">{opacity}%</span>
          </div>
          <input
            type="range"
            min="15"
            max="95"
            value={opacity}
            onChange={(e) => setOpacity(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FB6A21]"
          />
          <span className="text-[11px] text-slate-500 block">
            Recommended: 60%–75% for optimal text contrast
          </span>
        </div>

        {/* Glow & Specular Toggle */}
        <div className="flex flex-col justify-between">
          <span className="text-xs text-slate-300 font-mono">Ambient Glow & Inset Edge</span>
          <button
            onClick={() => setBorderGlow(!borderGlow)}
            className={`w-full py-2 px-4 rounded-xl text-xs font-medium border transition-colors flex items-center justify-center gap-2 ${
              borderGlow
                ? 'bg-[#FFA726]/10 border-[#FFA726] text-[#FFA726]'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{borderGlow ? 'Glow Enabled (Signature)' : 'Glow Disabled (Flat)'}</span>
          </button>
          <span className="text-[11px] text-slate-500 block mt-1">
            Adds 0 20px 50px warm drop-shadow
          </span>
        </div>
      </div>
    </div>
  );
};
