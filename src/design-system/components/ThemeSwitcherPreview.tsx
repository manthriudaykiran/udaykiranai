/**
 * Uday Kiran Brand System - Six Signature Theme Combinations
 * Interactive theme switcher with live UI preview and color proportion validation.
 */

import React, { useState } from 'react';
import { SIGNATURE_THEMES, ThemeDefinition } from '../tokens/themes';
import { Check, ShieldCheck, Cpu, ArrowRight, Layers, Sparkles } from 'lucide-react';

export const ThemeSwitcherPreview: React.FC = () => {
  const [currentThemeKey, setCurrentThemeKey] = useState<string>('sunset-luxury');
  const activeTheme: ThemeDefinition = SIGNATURE_THEMES[currentThemeKey] || SIGNATURE_THEMES['sunset-luxury'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Six Signature Theme Combinations</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Pre-configured visual harmonies tailored for specific project intents and media formats.
          </p>
        </div>

        {/* 60-25-10-5 Rule Reminder */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-white/10 text-xs text-slate-300">
          <Layers className="w-4 h-4 text-[#FFA726]" />
          <span>Proportion: 60% Canvas · 25% Brand/Grad · 10% Support · 5% Accent</span>
        </div>
      </div>

      {/* Theme Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.values(SIGNATURE_THEMES).map((theme) => {
          const isSelected = theme.id === currentThemeKey;
          return (
            <button
              key={theme.id}
              onClick={() => setCurrentThemeKey(theme.id)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#FFA726] bg-[#111827] shadow-lg shadow-[#FFA726]/10 ring-1 ring-[#FFA726]'
                  : 'border-white/10 hover:border-white/20 bg-[#111827]/60'
              }`}
            >
              <div>
                {/* Visual Swatch Pill */}
                <div
                  className="w-full h-8 rounded-lg mb-2.5 shadow-inner border border-white/10"
                  style={{ background: theme.gradient }}
                />
                <h4 className="text-xs font-display font-bold text-white truncate">
                  {theme.name.split('—')[1]?.trim() || theme.name}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{theme.subtitle}</p>
              </div>

              {isSelected && (
                <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-[#FFA726]">
                  <Check className="w-3 h-3" />
                  <span>Active</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Application Preview in Active Theme */}
      <div
        className="p-8 md:p-10 rounded-2xl border transition-all duration-500 relative overflow-hidden"
        style={{
          backgroundColor: activeTheme.palette.background,
          borderColor: activeTheme.palette.surfaceBorder,
          color: activeTheme.palette.textPrimary,
        }}
      >
        {/* Subtle Ambient Backlight */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-30"
          style={{ background: activeTheme.palette.primary }}
        />

        {/* Theme Descriptor Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-white/10">
                {activeTheme.name}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400">{activeTheme.subtitle}</span>
            </div>
            <h4 className="text-2xl font-display font-bold mt-1.5" style={{ color: activeTheme.palette.textPrimary }}>
              {activeTheme.description}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            {activeTheme.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: activeTheme.palette.surfaceBorder,
                  color: activeTheme.palette.textSecondary,
                  background: activeTheme.palette.surface,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Realistic Mock UI Built With Current Theme */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Hero Card (8 cols) */}
          <div
            className="lg:col-span-8 p-7 rounded-2xl border flex flex-col justify-between relative backdrop-blur-md"
            style={{
              backgroundColor: activeTheme.palette.surface,
              borderColor: activeTheme.palette.surfaceBorder,
            }}
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" style={{ color: activeTheme.palette.highlight }} />
                <span style={{ color: activeTheme.palette.highlight }}>Practical AI Deployment</span>
              </div>

              <h2
                className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-4"
                style={{ color: activeTheme.palette.textPrimary }}
              >
                Autonomous Agent Workflows Designed for Production Scale.
              </h2>

              <p className="text-base max-w-xl leading-relaxed mb-6" style={{ color: activeTheme.palette.textSecondary }}>
                Uday Kiran crafts deterministic cognitive systems that solve operational bottlenecks without brittle heuristics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
              <button
                className="px-6 py-3 rounded-xl font-display font-semibold text-white shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                style={{ background: activeTheme.gradient }}
              >
                <span>Launch Workflow</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                className="px-5 py-3 rounded-xl font-display font-medium border transition-colors"
                style={{
                  borderColor: activeTheme.palette.surfaceBorder,
                  color: activeTheme.palette.textPrimary,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                }}
              >
                Read Technical Spec
              </button>
            </div>
          </div>

          {/* Side Telemetry & Metric Card (4 cols) */}
          <div
            className="lg:col-span-4 p-7 rounded-2xl border flex flex-col justify-between backdrop-blur-md"
            style={{
              backgroundColor: activeTheme.palette.surface,
              borderColor: activeTheme.palette.surfaceBorder,
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-slate-400">Cluster Status</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: activeTheme.palette.accent }}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Workflow Velocity</span>
                  <div className="text-3xl font-display font-bold font-mono tracking-tight" style={{ color: activeTheme.palette.textPrimary }}>
                    +340<span className="text-lg font-normal">%</span>
                  </div>
                  <span className="text-xs" style={{ color: activeTheme.palette.highlight }}>
                    Zero Hallucination Guaranteed
                  </span>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                    <span className="text-slate-400">Deterministic Accuracy</span>
                    <span style={{ color: activeTheme.palette.textPrimary }}>99.98%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: '99.98%', backgroundColor: activeTheme.palette.primary }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                    <span className="text-slate-400">Latency Budget</span>
                    <span style={{ color: activeTheme.palette.textPrimary }}>68ms</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: '35%', backgroundColor: activeTheme.palette.secondary }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4" style={{ color: activeTheme.palette.accent }} />
              <span>WCAG AA Contrast Validated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
