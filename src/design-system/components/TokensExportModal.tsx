/**
 * Uday Kiran Brand System - Tokens Export Modal
 * Export tokens to CSS Variables, Tailwind v4 Config, JSON Design Tokens, or Figma Tokens format.
 */

import React, { useState } from 'react';
import { BRAND_COLORS } from '../tokens/colors';
import { SIGNATURE_GRADIENTS } from '../tokens/gradients';
import { SIGNATURE_THEMES } from '../tokens/themes';
import { Check, Copy, Download, Code, X } from 'lucide-react';

interface TokensExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TokensExportModal: React.FC<TokensExportModalProps> = ({ isOpen, onClose }) => {
  const [activeFormat, setActiveFormat] = useState<'css' | 'tailwind' | 'json' | 'figma'>('css');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const getCssExport = () => {
    return `:root {
  /* Brand: Uday Kiran | Practical AI */
  /* Tagline: Make AI Simple. Practical. Useful. */

  /* Primary Brand DNA */
${BRAND_COLORS.filter((c) => c.category === 'primary')
  .map((c) => `  --color-${c.id}: ${c.hex}; /* ${c.purpose} */`)
  .join('\n')}

  /* Secondary Depth */
${BRAND_COLORS.filter((c) => c.category === 'secondary')
  .map((c) => `  --color-${c.id}: ${c.hex};`)
  .join('\n')}

  /* Accent Highlights */
${BRAND_COLORS.filter((c) => c.category === 'accent')
  .map((c) => `  --color-${c.id}: ${c.hex};`)
  .join('\n')}

  /* Neutral Luxury Canvas */
${BRAND_COLORS.filter((c) => c.category === 'neutral')
  .map((c) => `  --color-${c.id}: ${c.hex};`)
  .join('\n')}

  /* Signature Gradients */
${SIGNATURE_GRADIENTS.map((g) => `  --${g.id}: ${g.css};`).join('\n')}
}`;
  };

  const getTailwindExport = () => {
    return `// tailwind.config.ts or @theme configuration
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          amber: '#FFA726',
          orange: '#FB6A21',
          coral: '#FF4D6D',
          magenta: '#D946EF',
          violet: '#7C3AED',
          gold: '#FFD166',
          peach: '#FFB3A7',
          lavender: '#B794F6',
          indigo: '#6366F1',
          sky: '#38BDF8',
          midnight: '#071426',
          plum: '#1B1035',
          charcoal: '#111827',
          softWhite: '#F6F9FC',
          champagne: '#D5B46B',
        },
      },
      fontFamily: {
        display: ['Sora', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        telugu: ['Noto Sans Telugu', 'sans-serif'],
      },
    },
  },
};`;
  };

  const getJsonExport = () => {
    return JSON.stringify(
      {
        brand: 'Uday Kiran | Practical AI',
        enterpriseBrand: 'KiranForge',
        tagline: 'Make AI Simple. Practical. Useful.',
        watermark: 'Created by Uday Kiran',
        colors: BRAND_COLORS.reduce((acc, c) => {
          acc[c.id] = { value: c.hex, type: 'color', role: c.purpose, category: c.category };
          return acc;
        }, {} as Record<string, any>),
        gradients: SIGNATURE_GRADIENTS.reduce((acc, g) => {
          acc[g.id] = { value: g.css, type: 'gradient', name: g.name, bestFor: g.bestFor };
          return acc;
        }, {} as Record<string, any>),
      },
      null,
      2
    );
  };

  const getFigmaTokensExport = () => {
    return JSON.stringify(
      {
        'uday-kiran-brand': {
          primary: BRAND_COLORS.filter((c) => c.category === 'primary').reduce((acc, c) => {
            acc[c.name] = { value: c.hex, type: 'color' };
            return acc;
          }, {} as Record<string, any>),
          neutral: BRAND_COLORS.filter((c) => c.category === 'neutral').reduce((acc, c) => {
            acc[c.name] = { value: c.hex, type: 'color' };
            return acc;
          }, {} as Record<string, any>),
        },
      },
      null,
      2
    );
  };

  const contentMap = {
    css: getCssExport(),
    tailwind: getTailwindExport(),
    json: getJsonExport(),
    figma: getFigmaTokensExport(),
  };

  const currentContent = contentMap[activeFormat];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uday-kiran-tokens.${activeFormat === 'tailwind' ? 'ts' : activeFormat === 'css' ? 'css' : 'json'}`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl rounded-2xl bg-[#071426] border border-white/20 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-[#FFA726]" />
            <h3 className="text-lg font-display font-bold text-white">
              Export Design System Tokens
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="px-6 pt-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-1.5 p-1 bg-[#111827] rounded-lg border border-white/10">
            {(['css', 'tailwind', 'json', 'figma'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setActiveFormat(fmt)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md uppercase transition-colors ${
                  activeFormat === fmt
                    ? 'bg-gradient-to-r from-[#FFA726] to-[#FB6A21] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fmt === 'css' ? 'CSS Variables' : fmt === 'tailwind' ? 'Tailwind TS' : fmt === 'json' ? 'Tokens JSON' : 'Figma Tokens'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FFA726] to-[#FB6A21] text-white text-xs font-medium flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content Viewport */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-[#050D1A]">
          <pre className="text-slate-300 overflow-x-auto leading-relaxed">
            <code>{currentContent}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#071426] flex items-center justify-between text-xs text-slate-400">
          <span>Uday Kiran Brand System · Production Ready</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
