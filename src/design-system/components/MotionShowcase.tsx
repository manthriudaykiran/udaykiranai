/**
 * Uday Kiran Brand System - Reusable Motion Design Tokens
 * 15 interactive motion patterns with live simulation and replay triggers.
 */

import React, { useState } from 'react';
import { BRAND_MOTION_TOKENS, MotionSpec } from '../tokens/motion';
import { Play, RotateCcw, Sparkles, Activity } from 'lucide-react';

export const MotionShowcase: React.FC = () => {
  const [activeMotionId, setActiveMotionId] = useState<string>('motion-01');
  const [animationKey, setAnimationKey] = useState<number>(0);
  const [workflowStep, setWorkflowStep] = useState<number>(1);
  const [chartValue, setChartValue] = useState<number>(85);

  const activeSpec = BRAND_MOTION_TOKENS.find((m) => m.id === activeMotionId) || BRAND_MOTION_TOKENS[0];

  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Motion Graphics Language</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            15 reusable motion specifications built for purposeful communication, zero unnecessary bounce.
          </p>
        </div>

        <button
          onClick={handleReplay}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFA726] to-[#FB6A21] text-white font-display font-semibold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Active Animation</span>
        </button>
      </div>

      {/* Main Grid: Motion List & Live Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Motion Pattern Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[560px] overflow-y-auto pr-1">
          {BRAND_MOTION_TOKENS.map((motion) => {
            const isSelected = motion.id === activeMotionId;
            return (
              <button
                key={motion.id}
                onClick={() => {
                  setActiveMotionId(motion.id);
                  handleReplay();
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-[#FFA726] bg-[#111827] ring-1 ring-[#FFA726] shadow-md shadow-[#FFA726]/10'
                    : 'border-white/10 hover:border-white/20 bg-[#111827]/60'
                }`}
              >
                <span className="text-xs font-mono font-bold text-[#FFA726] px-1.5 py-0.5 rounded bg-[#FFA726]/10 shrink-0">
                  {motion.number}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-display font-semibold text-white truncate">
                      {motion.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">{motion.duration}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{motion.purpose}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Motion Sandbox (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            key={animationKey}
            className="p-8 rounded-2xl bg-[#071426] border border-white/10 relative overflow-hidden min-h-[380px] flex flex-col justify-center items-center"
          >
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            {/* Pattern 01: Title Reveal */}
            {activeSpec.id === 'motion-01' && (
              <div className="text-center space-y-3 animate-fade-title">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FFA726]">
                  01 · Cinematic Title Reveal
                </span>
                <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
                  Democratizing AI for Practical Impact.
                </h1>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  0.85s cubic-bezier(0.16, 1, 0.3, 1) with subtle vertical lift and optical deblur.
                </p>
              </div>
            )}

            {/* Pattern 02: Ambient Gradient Shift */}
            {activeSpec.id === 'motion-02' && (
              <div className="w-full h-64 rounded-2xl relative overflow-hidden flex items-center justify-center p-6 border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFA726] via-[#FB6A21] via-[#D946EF] to-[#7C3AED] bg-[length:200%_200%] animate-pulse" />
                <div className="relative text-center p-6 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 max-w-sm">
                  <span className="text-xs font-mono uppercase text-[#FFD166] block mb-1">
                    Continuous 12s Gradient Motion
                  </span>
                  <h4 className="text-lg font-display font-bold text-white">
                    Hypnotic Ambient Stage
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Ideal backdrop for keynote speaker titles and hero canvases.
                  </p>
                </div>
              </div>
            )}

            {/* Pattern 04: Staggered Words */}
            {activeSpec.id === 'motion-04' && (
              <div className="flex flex-wrap justify-center items-center gap-2 max-w-lg">
                {'Make AI Simple . Practical . Useful . For Everyone .'.split(' ').map((word, i) => (
                  <span
                    key={i}
                    style={{
                      animation: `fadeInWord 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.08}s both`,
                    }}
                    className={`text-2xl md:text-4xl font-display font-bold ${
                      word === '.' ? 'text-slate-500' : 'text-white'
                    }`}
                  >
                    {word === '.' ? '·' : word}
                  </span>
                ))}
              </div>
            )}

            {/* Pattern 07: Card Hover Lift */}
            {activeSpec.id === 'motion-07' && (
              <div className="w-full max-w-sm p-6 rounded-2xl bg-[#111827] border border-white/10 hover:-translate-y-2 hover:border-[#FFA726] hover:shadow-2xl hover:shadow-[#FFA726]/20 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#FFA726]">Hover Me</span>
                  <Sparkles className="w-4 h-4 text-[#FFD166]" />
                </div>
                <h4 className="text-lg font-display font-bold text-white">
                  300ms Tactile Elevation
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Card lifts 8px with warm ambient drop shadow and border brightness modulation.
                </p>
              </div>
            )}

            {/* Pattern 09: Workflow Reveals */}
            {activeSpec.id === 'motion-09' && (
              <div className="w-full max-w-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Step {workflowStep} of 3</span>
                  <button
                    onClick={() => setWorkflowStep((prev) => (prev % 3) + 1)}
                    className="text-xs px-2.5 py-1 rounded bg-[#FFA726]/10 text-[#FFA726] border border-[#FFA726]/20 hover:bg-[#FFA726]/20"
                  >
                    Next Step
                  </button>
                </div>
                <div className="space-y-2.5">
                  {[
                    { step: 1, title: 'Input Prompt & Semantic Intent', desc: 'Normalized and vectorized.' },
                    { step: 2, title: 'KiranForge Reasoning Engine', desc: 'Deterministic path resolution.' },
                    { step: 3, title: 'Verified Output Execution', desc: 'Zero hallucination delivery.' },
                  ].map((node) => (
                    <div
                      key={node.step}
                      className={`p-3.5 rounded-xl border transition-all duration-500 flex items-center gap-3 ${
                        workflowStep >= node.step
                          ? 'bg-[#111827] border-[#FFA726] shadow-md shadow-[#FFA726]/10 scale-100 opacity-100'
                          : 'bg-[#111827]/40 border-white/5 scale-95 opacity-40'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                          workflowStep >= node.step
                            ? 'bg-gradient-to-r from-[#FFA726] to-[#FB6A21] text-white'
                            : 'bg-white/10 text-slate-500'
                        }`}
                      >
                        {node.step}
                      </span>
                      <div>
                        <h5 className="text-xs font-display font-semibold text-white">{node.title}</h5>
                        <p className="text-[11px] text-slate-400">{node.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pattern 10: Progressive Chart Growth */}
            {activeSpec.id === 'motion-10' && (
              <div className="w-full max-w-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Operational Velocity Metric</span>
                  <span className="text-lg font-mono font-bold text-[#FFA726]">+{chartValue}%</span>
                </div>
                <div className="w-full h-4 rounded-full bg-[#111827] border border-white/10 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] transition-all duration-1000 ease-out"
                    style={{ width: `${chartValue}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Baseline: 0%</span>
                  <span>Target: 100%</span>
                </div>
              </div>
            )}

            {/* Generic Fallback for other motion patterns */}
            {['motion-03', 'motion-05', 'motion-06', 'motion-08', 'motion-11', 'motion-12', 'motion-13', 'motion-14', 'motion-15'].includes(activeSpec.id) && (
              <div className="text-center space-y-4 max-w-md">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#FFA726] via-[#FB6A21] to-[#7C3AED] p-0.5 shadow-xl animate-bounce">
                  <div className="w-full h-full bg-[#071426] rounded-2xl flex items-center justify-center text-white">
                    <Activity className="w-6 h-6 text-[#FFA726]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-display font-bold text-white">{activeSpec.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{activeSpec.purpose}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#111827] border border-white/5 text-xs font-mono text-[#FFA726]">
                  Duration: {activeSpec.duration} · Easing: {activeSpec.easing}
                </div>
              </div>
            )}
          </div>

          {/* Token Specification Card */}
          <div className="p-5 rounded-xl bg-[#111827] border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold text-white">Framer Motion / CSS Implementation:</span>
              <span className="font-mono text-[#FFA726]">{activeSpec.duration}</span>
            </div>
            <pre className="p-3 rounded-lg bg-[#071426] font-mono text-slate-300 text-[11px] overflow-x-auto border border-white/5">
              <code>{activeSpec.implementation}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
