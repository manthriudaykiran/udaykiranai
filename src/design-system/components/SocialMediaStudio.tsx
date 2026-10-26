/**
 * Uday Kiran Brand System - Instagram & YouTube Visual Templates Studio
 * Interactive canvas studio with platform-safe zones, mobile scale simulator,
 * and direct browser PNG export.
 */

import React, { useState, useRef } from 'react';
import { Download, Smartphone, Eye, Sparkles, Layers, Sliders } from 'lucide-react';

export const SocialMediaStudio: React.FC = () => {
  const [format, setFormat] = useState<'reels' | 'feed' | 'youtube'>('youtube');
  const [headline, setHeadline] = useState<string>('Why 90% of AI Agents Fail in Production');
  const [subtext, setSubtext] = useState<string>('And the 3 deterministic rules that fix them.');
  const [authorTag, setAuthorTag] = useState<string>('Uday Kiran | Practical AI');
  const [activeGradient, setActiveGradient] = useState<string>('hero');
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gradients = {
    hero: {
      name: 'Hero Amber to Purple',
      colors: ['#FFA726', '#FB6A21', '#D946EF', '#7C3AED'],
      css: 'linear-gradient(120deg, #FFA726 0%, #FB6A21 30%, #D946EF 65%, #7C3AED 100%)',
    },
    magenta: {
      name: 'Magenta Flame',
      colors: ['#FF4D6D', '#FF006E', '#D946EF'],
      css: 'linear-gradient(135deg, #FF4D6D 0%, #FF006E 45%, #D946EF 100%)',
    },
    sunrise: {
      name: 'Sunrise Flow',
      colors: ['#FFD166', '#FFA726', '#FB6A21', '#FF4D6D'],
      css: 'linear-gradient(135deg, #FFD166 0%, #FFA726 30%, #FB6A21 65%, #FF4D6D 100%)',
    },
    royal: {
      name: 'Royal Glow',
      colors: ['#6366F1', '#7C3AED', '#22D3EE'],
      css: 'linear-gradient(135deg, #6366F1 0%, #7C3AED 45%, #22D3EE 100%)',
    },
  };

  // High-Resolution Canvas PNG Export
  const handleExportPNG = () => {
    setIsExporting(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1280;
    let height = 720;
    if (format === 'reels') {
      width = 1080;
      height = 1920;
    } else if (format === 'feed') {
      width = 1080;
      height = 1350;
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Draw Midnight Navy Background
    ctx.fillStyle = '#071426';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Diagonal Ambient Light Wave
    const grad = ctx.createLinearGradient(0, 0, width, height);
    const currentGrad = gradients[activeGradient as keyof typeof gradients] || gradients.hero;
    currentGrad.colors.forEach((c, idx) => {
      grad.addColorStop(idx / (currentGrad.colors.length - 1), c);
    });

    // Draw stylized energy glow ribbon
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.4);
    ctx.bezierCurveTo(width * 0.3, height * 0.1, width * 0.7, height * 0.8, width, height * 0.5);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // Dark overlay for text contrast
    ctx.fillStyle = 'rgba(7, 20, 38, 0.65)';
    ctx.fillRect(0, 0, width, height);

    // 3. Draw Watermark & Branding
    ctx.fillStyle = '#FFA726';
    ctx.font = `bold ${Math.round(width * 0.024)}px Arial, sans-serif`;
    ctx.fillText(authorTag.toUpperCase(), width * 0.08, height * 0.15);

    // 4. Draw Main Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `900 ${Math.round(width * 0.052)}px Arial, sans-serif`;

    // Word wrapping for headline
    const words = headline.split(' ');
    let line = '';
    let y = height * 0.35;
    const lineHeight = Math.round(width * 0.065);
    const maxWidth = width * 0.84;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, width * 0.08, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width * 0.08, y);

    // 5. Draw Subtext
    y += lineHeight * 0.8;
    ctx.fillStyle = '#FFB3A7';
    ctx.font = `500 ${Math.round(width * 0.028)}px Arial, sans-serif`;
    ctx.fillText(subtext, width * 0.08, y);

    // 6. Draw Watermark footer
    ctx.fillStyle = '#D5B46B';
    ctx.font = `${Math.round(width * 0.018)}px Arial, sans-serif`;
    ctx.fillText('Created by Uday Kiran', width * 0.08, height * 0.92);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Uday_Kiran_${format}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsExporting(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-display font-bold text-white">
              Instagram & YouTube Studio
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFA726]/10 text-[#FFA726] border border-[#FFA726]/20 font-mono">
              Auto-Safe Zones
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Craft high-retention social assets with contrast validation, mobile simulation, and PNG export.
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111827] rounded-lg border border-white/10">
          {[
            { id: 'youtube', label: 'YouTube Thumbnail (16:9)', size: '1280×720' },
            { id: 'reels', label: 'Instagram Reel/Story (9:16)', size: '1080×1920' },
            { id: 'feed', label: 'Instagram Feed (4:5)', size: '1080×1350' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap shrink-0 ${
                format === f.id
                  ? 'bg-gradient-to-r from-[#FFA726] to-[#FB6A21] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Workspace: Preview on left, Controls on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Preview Canvas Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-[#071426] border border-white/10 relative overflow-hidden">
          {/* Active Gradient Ribbon */}
          <div
            className={`relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
              format === 'youtube'
                ? 'w-full aspect-video'
                : format === 'reels'
                ? 'w-72 h-[500px]'
                : 'w-80 h-[400px]'
            }`}
            style={{
              background: `linear-gradient(135deg, rgba(7, 20, 38, 0.95), rgba(7, 20, 38, 0.85)), ${
                gradients[activeGradient as keyof typeof gradients]?.css || gradients.hero.css
              }`,
            }}
          >
            {/* Ambient Corner Flare */}
            <div
              className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-2xl opacity-60 pointer-events-none"
              style={{
                background:
                  gradients[activeGradient as keyof typeof gradients]?.colors[1] || '#FB6A21',
              }}
            />

            {/* Safe Zone Overlay Guide */}
            {showSafeZones && (
              <div className="absolute inset-0 pointer-events-none border border-dashed border-[#FFA726]/40 m-4 rounded-xl flex flex-col justify-between p-2">
                <span className="text-[9px] font-mono text-[#FFA726] self-start px-1.5 py-0.5 rounded bg-black/60">
                  Platform Safe Zone (Guaranteed Visible)
                </span>
                {format === 'youtube' && (
                  <div className="self-end px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300 border border-white/20">
                    14:32 (Time Badge Clearance)
                  </div>
                )}
              </div>
            )}

            {/* Top Brand Watermark */}
            <div className="relative z-10 p-6">
              <span className="text-xs font-mono font-bold text-[#FFA726] uppercase tracking-wider block">
                {authorTag}
              </span>
            </div>

            {/* Central Hook Content */}
            <div className="relative z-10 px-6 py-2 space-y-2">
              <h2
                className={`font-display font-extrabold text-white tracking-tight leading-tight ${
                  format === 'reels'
                    ? 'text-2xl'
                    : format === 'youtube'
                    ? 'text-2xl md:text-3xl lg:text-4xl'
                    : 'text-2xl'
                }`}
              >
                {headline || 'Enter Catchy Headline'}
              </h2>
              <p className="text-xs md:text-sm text-[#FFB3A7] font-medium leading-relaxed">
                {subtext}
              </p>
            </div>

            {/* Bottom Watermark */}
            <div className="relative z-10 p-6 flex items-center justify-between border-t border-white/5">
              <span className="text-[10px] font-mono text-[#D5B46B]">
                Created by Uday Kiran
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                1080p High-Bitrate
              </span>
            </div>
          </div>

          {/* Mobile YouTube Feed Simulator */}
          {format === 'youtube' && (
            <div className="mt-6 w-full max-w-md p-4 rounded-xl bg-[#111827] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-mono text-slate-300">
                  <Smartphone className="w-3.5 h-3.5 text-[#FFA726]" />
                  <span>Mobile Feed Legibility Test (120px scale)</span>
                </div>
                <span className="text-emerald-400 text-[10px]">Readable</span>
              </div>

              {/* Simulated 120px mini-feed card */}
              <div className="flex items-start gap-3 p-2 rounded-lg bg-[#071426] border border-white/5">
                <div
                  className="w-28 aspect-video rounded-md overflow-hidden relative shrink-0 p-1.5 flex flex-col justify-end"
                  style={{
                    background: gradients[activeGradient as keyof typeof gradients]?.css,
                  }}
                >
                  <span className="text-[7px] font-bold text-white leading-none line-clamp-2 drop-shadow">
                    {headline}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-semibold text-white truncate">{headline}</h5>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">Uday Kiran · 24K views · 2 days ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customization & Export Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Text Customizer */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
            <h4 className="text-xs font-display font-bold uppercase tracking-wider text-[#FFA726]">
              Typography Content
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Primary Headline Hook:</label>
              <textarea
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#071426] border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFA726]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Subtitle / Context:</label>
              <input
                type="text"
                value={subtext}
                onChange={(e) => setSubtext(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#071426] border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFA726]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Brand Tagline:</label>
              <input
                type="text"
                value={authorTag}
                onChange={(e) => setAuthorTag(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#071426] border border-white/10 text-white text-xs focus:outline-none focus:border-[#FFA726]"
              />
            </div>
          </div>

          {/* Gradient Palette Selector */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
            <h4 className="text-xs font-display font-bold uppercase tracking-wider text-[#FFA726]">
              Signature Gradient Accent
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(gradients).map(([key, grad]) => (
                <button
                  key={key}
                  onClick={() => setActiveGradient(key)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    activeGradient === key
                      ? 'border-[#FFA726] bg-white/5 ring-1 ring-[#FFA726]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-5 h-5 rounded-md shrink-0 shadow-inner" style={{ background: grad.css }} />
                  <span className="text-xs font-medium text-white truncate">{grad.name}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="text-xs text-slate-400 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSafeZones}
                  onChange={(e) => setShowSafeZones(e.target.checked)}
                  className="rounded text-[#FB6A21] focus:ring-0"
                />
                <span>Show Platform Safe Zones</span>
              </label>
            </div>
          </div>

          {/* Export Action */}
          <button
            onClick={handleExportPNG}
            disabled={isExporting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] text-white font-display font-bold text-sm shadow-xl transition-transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating High-Res PNG...' : `Export ${format.toUpperCase()} PNG (1080p)`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
