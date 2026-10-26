/**
 * Uday Kiran Brand System - Signature Gradient Studio
 * Interactive gradient workbench with angle adjustments, live code export, and multi-surface previews.
 */

import React, { useState } from 'react';
import { SIGNATURE_GRADIENTS, GradientToken } from '../tokens/gradients';
import { Check, Copy, Sliders, Sparkles, Code } from 'lucide-react';

export const GradientStudio: React.FC = () => {
  const [selectedGrad, setSelectedGrad] = useState<GradientToken>(SIGNATURE_GRADIENTS[3]); // Default to Hero Gradient 04
  const [customAngle, setCustomAngle] = useState<number>(120);
  const [previewMode, setPreviewMode] = useState<'card' | 'text' | 'button' | 'mesh'>('card');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Compute dynamic gradient with user-selected angle
  const activeCss = selectedGrad.css.replace(/\d+deg/, `${customAngle}deg`);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getSvgDefinition = () => {
    const rad = (customAngle * Math.PI) / 180;
    const x1 = Math.round(50 - Math.cos(rad) * 50);
    const y1 = Math.round(50 - Math.sin(rad) * 50);
    const x2 = Math.round(50 + Math.cos(rad) * 50);
    const y2 = Math.round(50 + Math.sin(rad) * 50);

    return `<defs>
  <linearGradient id="${selectedGrad.id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
${selectedGrad.stops
  .map((s) => `    <stop offset="${s.position}%" stop-color="${s.color}" />`)
  .join('\n')}
  </linearGradient>
</defs>`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-display font-bold text-white">Signature Gradient Engine</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFA726]/10 text-[#FFA726] border border-[#FFA726]/20 font-medium">
              8 Registered Tokens
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Select a canonical gradient to inspect color stops, modulate angle, and export code.
          </p>
        </div>

        {/* Preview Target Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#111827] rounded-lg border border-white/10">
          {(['card', 'text', 'button', 'mesh'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap shrink-0 ${
                previewMode === mode
                  ? 'bg-gradient-to-r from-[#FFA726] to-[#FB6A21] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode} Preview
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Gradient Selector Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          {SIGNATURE_GRADIENTS.map((grad) => {
            const isSelected = selectedGrad.id === grad.id;
            return (
              <div
                key={grad.id}
                onClick={() => {
                  setSelectedGrad(grad);
                  const angleMatch = grad.angle.match(/\d+/);
                  if (angleMatch) setCustomAngle(parseInt(angleMatch[0]));
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? 'border-[#FFA726] bg-[#111827] shadow-md shadow-[#FFA726]/10 ring-1 ring-[#FFA726]'
                    : 'border-white/10 hover:border-white/20 bg-[#111827]/60'
                }`}
              >
                {/* Mini Swatch Thumbnail */}
                <div
                  className="w-12 h-12 rounded-lg shrink-0 shadow-inner border border-white/20"
                  style={{ background: grad.css }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-display font-semibold text-white truncate">
                      {grad.name}
                    </h4>
                    {grad.isHero && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-[#FFA726] font-mono border border-amber-500/30">
                        HERO
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{grad.bestFor}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Interactive Workbench & Code Generator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Preview Display Box */}
          <div className="p-8 rounded-2xl bg-[#071426] border border-white/10 relative overflow-hidden flex flex-col justify-center items-center min-h-[300px]">
            {/* Ambient Backlight */}
            <div
              className="absolute inset-0 opacity-20 blur-3xl pointer-events-none transition-all duration-700"
              style={{ background: activeCss }}
            />

            {/* Preview Modes */}
            {previewMode === 'card' && (
              <div
                className="w-full max-w-md p-6 rounded-2xl relative shadow-2xl transition-all"
                style={{ background: activeCss }}
              >
                <div className="bg-[#071426]/90 backdrop-blur-md p-6 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#FFA726]">
                      {selectedGrad.name.split('—')[1]?.trim() || selectedGrad.name}
                    </span>
                    <Sparkles className="w-4 h-4 text-[#FFD166]" />
                  </div>
                  <h4 className="text-xl font-display font-bold text-white">
                    High-End Cinematic Gradient
                  </h4>
                  <p className="text-xs text-slate-300">
                    {selectedGrad.emotionalTone}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 font-mono">
                    <span>Angle: {customAngle}°</span>
                    <span>{selectedGrad.stops.length} Color Stops</span>
                  </div>
                </div>
              </div>
            )}

            {previewMode === 'text' && (
              <div className="text-center space-y-3 px-4">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  Typography Mask Preview
                </span>
                <h2
                  className="text-4xl md:text-5xl font-display font-extrabold tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage: activeCss,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Make AI Simple. Practical. Useful.
                </h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Applied to hero headline text using standard background clip properties.
                </p>
              </div>
            )}

            {previewMode === 'button' && (
              <div className="space-y-6 text-center">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    className="px-6 py-3 rounded-xl font-display font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                    style={{ background: activeCss }}
                  >
                    Primary Action Button
                  </button>
                  <button
                    className="px-6 py-3 rounded-xl font-display font-semibold text-white border-2 transition-transform hover:scale-105"
                    style={{
                      borderImage: `${activeCss} 1`,
                      background: 'rgba(7, 20, 38, 0.8)',
                    }}
                  >
                    Gradient Border Button
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Hover and focus states retain sharp contrast and tactile feedback.
                </p>
              </div>
            )}

            {previewMode === 'mesh' && (
              <div
                className="w-full h-56 rounded-xl relative overflow-hidden flex items-center justify-center"
                style={{ background: activeCss }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/40" />
                <div className="relative text-center px-6 py-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
                  <span className="font-display font-bold text-white text-lg block">
                    Full Canvas Mesh
                  </span>
                  <span className="text-xs text-slate-200">
                    Suitable for presentation slide 1 & major event banners
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Controls & Stops Inspector */}
          <div className="p-5 rounded-xl bg-[#111827] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FFA726]" />
                <span className="text-sm font-display font-semibold text-white">Angle Modulator</span>
              </div>
              <span className="text-xs font-mono text-[#FFA726] bg-[#FFA726]/10 px-2 py-0.5 rounded border border-[#FFA726]/20">
                {customAngle}°
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="360"
              value={customAngle}
              onChange={(e) => setCustomAngle(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FB6A21]"
            />

            {/* Stops Bar */}
            <div className="pt-2">
              <span className="text-xs text-slate-400 block mb-2 font-medium">Stops Breakdown:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedGrad.stops.map((stop, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#071426] border border-white/5 flex items-center gap-2">
                    <div className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: stop.color }} />
                    <div className="min-w-0">
                      <span className="text-[11px] font-mono font-medium text-white block truncate">
                        {stop.color}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {stop.position}% · {stop.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Export Tabs */}
          <div className="p-5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#7C3AED]" />
                <span className="text-sm font-display font-semibold text-white">Export Code Snippets</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(activeCss, 'css')}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center gap-1"
                >
                  {copiedType === 'css' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy CSS</span>
                </button>
                <button
                  onClick={() => handleCopy(getSvgDefinition(), 'svg')}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center gap-1"
                >
                  {copiedType === 'svg' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy SVG</span>
                </button>
              </div>
            </div>

            <pre className="p-3 rounded-lg bg-[#071426] text-xs font-mono text-[#FFA726] overflow-x-auto border border-white/5">
              <code>background: {activeCss};</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
