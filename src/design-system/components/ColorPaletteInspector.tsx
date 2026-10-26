/**
 * Uday Kiran Brand System - Color Palette Inspector
 * Interactive viewer with copy functionality, WCAG accessibility metrics, and category filtering.
 */

import React, { useState } from 'react';
import { BRAND_COLORS, ColorToken } from '../tokens/colors';
import { Check, Copy, Info } from 'lucide-react';

export const ColorPaletteInspector: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'primary' | 'secondary' | 'accent' | 'neutral'>('all');
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorToken>(BRAND_COLORS[0]);

  const filteredColors = activeCategory === 'all'
    ? BRAND_COLORS
    : BRAND_COLORS.filter((c) => c.category === activeCategory);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(label);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Canonical Color Palette</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Exact HEX values, WCAG contrast metrics, and architectural roles.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#111827] rounded-lg border border-white/10">
          {(['all', 'primary', 'secondary', 'accent', 'neutral'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#FFA726] to-[#FB6A21] text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Colors (21)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Swatches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredColors.map((color) => {
          const isSelected = selectedColor.id === color.id;
          const isDarkText = ['#FFD166', '#FFA726', '#FFB3A7', '#F6F9FC', '#FFFFFF', '#A3E635', '#22D3EE', '#38BDF8', '#D5B46B'].includes(color.hex);

          return (
            <div
              key={color.id}
              onClick={() => setSelectedColor(color)}
              className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#FFA726] shadow-lg shadow-[#FFA726]/10 ring-1 ring-[#FFA726]'
                  : 'border-white/10 hover:border-white/20 bg-[#111827]/70'
              }`}
            >
              {/* Swatch Head */}
              <div
                className="h-28 w-full p-3 flex flex-col justify-between relative transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: color.hex }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                      isDarkText ? 'bg-black/15 text-black' : 'bg-white/20 text-white'
                    }`}
                  >
                    {color.category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(color.hex, `${color.name}-hex`);
                    }}
                    title="Copy HEX"
                    className={`p-1.5 rounded transition-colors ${
                      isDarkText ? 'hover:bg-black/15 text-black' : 'hover:bg-white/20 text-white'
                    }`}
                  >
                    {copiedValue === `${color.name}-hex` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-80" />
                    )}
                  </button>
                </div>

                <div className="flex items-end justify-between">
                  <span
                    className={`font-mono font-bold text-sm tracking-wider ${
                      isDarkText ? 'text-black' : 'text-white'
                    }`}
                  >
                    {color.hex}
                  </span>
                </div>
              </div>

              {/* Swatch Details */}
              <div className="p-3.5 bg-[#111827] space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-semibold text-white text-sm">
                    {color.name}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    {color.rgb.replace('rgb(', '').replace(')', '')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{color.purpose}</p>
                <div className="pt-2 flex items-center justify-between text-[11px] border-t border-white/5 text-slate-500">
                  <span>vs #071426:</span>
                  <span className="font-mono text-slate-300">{color.wcagOnDark.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Color Deep Dive Inspector */}
      {selectedColor && (
        <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl border border-white/20 shadow-inner shrink-0"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-display font-bold text-white">
                    {selectedColor.name}
                  </h4>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-[#FFA726]">
                    {selectedColor.hex}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5">{selectedColor.description}</p>
              </div>
            </div>

            {/* Copy Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopy(selectedColor.hex, 'hex')}
                className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5"
              >
                {copiedValue === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>HEX: {selectedColor.hex}</span>
              </button>
              <button
                onClick={() => handleCopy(selectedColor.rgb, 'rgb')}
                className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5"
              >
                {copiedValue === 'rgb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>RGB</span>
              </button>
              <button
                onClick={() => handleCopy(selectedColor.hsl, 'hsl')}
                className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5"
              >
                {copiedValue === 'hsl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>HSL</span>
              </button>
              <button
                onClick={() => handleCopy(`var(--color-${selectedColor.id})`, 'var')}
                className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-white/5 hover:bg-white/10 text-[#FFA726] border border-[#FFA726]/30 transition-colors flex items-center gap-1.5"
              >
                {copiedValue === 'var' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>CSS Var</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="p-3 rounded-lg bg-[#071426] border border-white/5">
              <span className="text-slate-500 block mb-1">Architectural Role:</span>
              <span className="text-slate-200 font-medium">{selectedColor.purpose}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#071426] border border-white/5">
              <span className="text-slate-500 block mb-1">Contrast on Midnight Navy (#071426):</span>
              <span className="text-slate-200 font-mono font-medium">{selectedColor.wcagOnDark}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#071426] border border-white/5">
              <span className="text-slate-500 block mb-1">Contrast on Pure White (#FFFFFF):</span>
              <span className="text-slate-200 font-mono font-medium">{selectedColor.wcagOnLight}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
