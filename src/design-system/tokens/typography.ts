/**
 * Uday Kiran Premium Brand Design System - Typography & Spacing System
 */

export interface TypeScaleStep {
  name: string;
  size: string;
  lineHeight: string;
  weight: string;
  tracking: string;
  usage: string;
  sampleText: string;
}

export const TYPOGRAPHY_SYSTEM = {
  fonts: {
    display: {
      name: 'Sora',
      fallback: 'Plus Jakarta Sans, sans-serif',
      role: 'Headlines, Hero titles, slide title openers',
      characteristics: 'Geometric clarity, modern technological weight, distinctive rounded curves without softness',
    },
    displayAlt: {
      name: 'Plus Jakarta Sans',
      fallback: 'sans-serif',
      role: 'Section titles, card headers, high-impact subtitles',
      characteristics: 'Contemporary geometric neo-grotesque, ultra-readable at large and medium scales',
    },
    body: {
      name: 'Manrope',
      fallback: 'Inter, sans-serif',
      role: 'Body paragraphs, card descriptions, readable narrative copy',
      characteristics: 'Semi-condensed geometric sans with wide apertures, optimized for screen reading',
    },
    monospace: {
      name: 'JetBrains Mono',
      fallback: 'monospace',
      role: 'Technical labels, metrics, tabular numbers, code blocks, execution timestamps',
      characteristics: 'Engineered for high readability, 8x12 grid proportion, crisp symbol distinction',
    },
    telugu: {
      name: 'Noto Sans Telugu',
      fallback: 'sans-serif',
      role: 'Telugu language regional content, bilingual presentations, regional community posts',
      characteristics: 'Clean, modern, highly legible Telugu glyph rendering matching Latin geometry',
    },
  },

  scale: [
    {
      name: 'Display Hero',
      size: 'clamp(2.5rem, 5vw, 4.25rem)',
      lineHeight: '1.08',
      weight: '800 (ExtraBold)',
      tracking: '-0.03em',
      usage: 'Slide 1 Title, Web Hero Headline, Major Campaign Launches',
      sampleText: 'Make AI Simple. Practical. Useful.',
    },
    {
      name: 'Headline 1 (H1)',
      size: '2.5rem (40px)',
      lineHeight: '1.15',
      weight: '700 (Bold)',
      tracking: '-0.025em',
      usage: 'Section Title, YouTube Thumbnail Hook, Deck Chapter Opener',
      sampleText: 'Practical AI Architecture & Autonomous Workflows',
    },
    {
      name: 'Headline 2 (H2)',
      size: '1.875rem (30px)',
      lineHeight: '1.25',
      weight: '700 (Bold)',
      tracking: '-0.02em',
      usage: 'Card Marquee Header, Modal Header, Slide Secondary Header',
      sampleText: 'Bridging Human Intuition & Machine Precision',
    },
    {
      name: 'Headline 3 (H3)',
      size: '1.375rem (22px)',
      lineHeight: '1.35',
      weight: '600 (SemiBold)',
      tracking: '-0.015em',
      usage: 'Feature Title, Dashboard Card Heading, Service Tier',
      sampleText: 'Self-Correcting Reasoning Engine',
    },
    {
      name: 'Body Large',
      size: '1.125rem (18px)',
      lineHeight: '1.6',
      weight: '400 (Regular) / 500 (Medium)',
      tracking: '-0.01em',
      usage: 'Hero lead paragraph, slide core premise, keynote speaker notes',
      sampleText: 'Democratizing cutting-edge generative workflows through intuitive primitives and robust production engineering.',
    },
    {
      name: 'Body Default',
      size: '1rem (16px)',
      lineHeight: '1.65',
      weight: '400 (Regular)',
      tracking: '0',
      usage: 'Standard prose, documentation, article body text',
      sampleText: 'Every AI agent deployed in the KiranForge cluster adheres to deterministic verification constraints, reducing latency while guaranteeing zero hallucinations.',
    },
    {
      name: 'Technical / Tabular',
      size: '0.875rem (14px)',
      lineHeight: '1.4',
      weight: '500 (Medium)',
      tracking: '0.02em',
      usage: 'Execution time, model latency, API cost, telemetry readout',
      sampleText: 'LATENCY: 84ms · SUCCESS_RATE: 99.98% · COST: $0.0012/req',
    },
    {
      name: 'Quiet Metadata',
      size: '0.75rem (12px)',
      lineHeight: '1.4',
      weight: '500 (Medium)',
      tracking: '0.04em',
      usage: 'Date stamp, author watermark, category tags with typographic separators',
      sampleText: 'Uday Kiran · Practical AI · Updated October 2026',
    },
  ] as TypeScaleStep[],

  teluguSample: {
    heading: 'కృత్రిమ మేధస్సును సులభతరం చేయడం.',
    tagline: 'ఆచరణాత్మకం · ఉపయోగకరం · విశ్వసనీయం',
    body: 'ఉదయ్ కిరణ్ ఆధ్వర్యంలో నిర్మించబడిన ఈ బ్రాండ్ డిజైన్ వ్యవస్థ సాంకేతికతను మరియు మానవ సృజనాత్మకతను అద్భుతమైన రంగుల సమ్మేళనంతో ఏకం చేస్తుంది.',
  },

  proportions: {
    neutralBackground: '60%',
    dominantBrandOrGradient: '25%',
    supportingColor: '10%',
    focalAccents: '5%',
    rule: 'Maximum 3 dominant chromatic colors per composition. Preserve legibility and clear contrast hierarchy.',
  },
};
