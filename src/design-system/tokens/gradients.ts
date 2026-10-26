/**
 * Uday Kiran Premium Brand Design System - Signature Gradient Engine
 * 8 canonical registered gradients with exact CSS, color stops, and usage guidelines.
 */

export interface GradientToken {
  id: string;
  name: string;
  css: string;
  stops: { color: string; position: number; name: string }[];
  angle: string;
  isHero?: boolean;
  bestFor: string;
  emotionalTone: string;
  tailwindClass: string;
}

export const SIGNATURE_GRADIENTS: GradientToken[] = [
  {
    id: 'grad-01',
    name: 'Gradient 01 — Sunrise Flow',
    css: 'linear-gradient(135deg, #FFD166 0%, #FFA726 30%, #FB6A21 65%, #FF4D6D 100%)',
    stops: [
      { color: '#FFD166', position: 0, name: 'Golden Glow' },
      { color: '#FFA726', position: 30, name: 'Radiant Amber' },
      { color: '#FB6A21', position: 65, name: 'Sunset Orange' },
      { color: '#FF4D6D', position: 100, name: 'Vibrant Coral' },
    ],
    angle: '135deg',
    bestFor: 'Opening slides, hero sections, attention-grabbing thumbnails',
    emotionalTone: 'Optimistic, warming, dawn of practical AI, magnetic attraction',
    tailwindClass: 'from-[#FFD166] via-[#FB6A21] to-[#FF4D6D]',
  },
  {
    id: 'grad-02',
    name: 'Gradient 02 — Magenta Flame',
    css: 'linear-gradient(135deg, #FF4D6D 0%, #FF006E 45%, #D946EF 100%)',
    stops: [
      { color: '#FF4D6D', position: 0, name: 'Vibrant Coral' },
      { color: '#FF006E', position: 45, name: 'Neon Coral' },
      { color: '#D946EF', position: 100, name: 'Electric Magenta' },
    ],
    angle: '135deg',
    bestFor: 'Hooks, bold headlines, featured content, high-retention callouts',
    emotionalTone: 'High energy, intense, creative audacity, undeniable focus',
    tailwindClass: 'from-[#FF4D6D] via-[#FF006E] to-[#D946EF]',
  },
  {
    id: 'grad-03',
    name: 'Gradient 03 — Violet Energy',
    css: 'linear-gradient(135deg, #D946EF 0%, #A855F7 45%, #7C3AED 100%)',
    stops: [
      { color: '#D946EF', position: 0, name: 'Electric Magenta' },
      { color: '#A855F7', position: 45, name: 'Bright Lilac' },
      { color: '#7C3AED', position: 100, name: 'Royal Violet' },
    ],
    angle: '135deg',
    bestFor: 'AI, automation, futuristic concepts, cognitive intelligence',
    emotionalTone: 'Futuristic, technological mastery, neural speed, deep luxury',
    tailwindClass: 'from-[#D946EF] via-[#A855F7] to-[#7C3AED]',
  },
  {
    id: 'grad-04',
    name: 'Gradient 04 — Amber to Purple (Hero Signature)',
    css: 'linear-gradient(120deg, #FFA726 0%, #FB6A21 30%, #D946EF 65%, #7C3AED 100%)',
    stops: [
      { color: '#FFA726', position: 0, name: 'Radiant Amber' },
      { color: '#FB6A21', position: 30, name: 'Sunset Orange' },
      { color: '#D946EF', position: 65, name: 'Electric Magenta' },
      { color: '#7C3AED', position: 100, name: 'Royal Violet' },
    ],
    angle: '120deg',
    isHero: true,
    bestFor: 'Selected brand-defining assets, main presentation title slides, and major campaign visuals',
    emotionalTone: 'The defining brand harmony: human warmth meets advanced machine intelligence',
    tailwindClass: 'from-[#FFA726] via-[#FB6A21] via-[#D946EF] to-[#7C3AED]',
  },
  {
    id: 'grad-05',
    name: 'Gradient 05 — Coral Dream',
    css: 'linear-gradient(135deg, #FF4D6D 0%, #FFB3A7 55%, #FFD166 100%)',
    stops: [
      { color: '#FF4D6D', position: 0, name: 'Vibrant Coral' },
      { color: '#FFB3A7', position: 55, name: 'Soft Peach' },
      { color: '#FFD166', position: 100, name: 'Golden Glow' },
    ],
    angle: '135deg',
    bestFor: 'Approachable, educational, human-centered content and tutorials',
    emotionalTone: 'Welcoming, clear, making AI simple and accessible to everyone',
    tailwindClass: 'from-[#FF4D6D] via-[#FFB3A7] to-[#FFD166]',
  },
  {
    id: 'grad-06',
    name: 'Gradient 06 — Royal Glow',
    css: 'linear-gradient(135deg, #6366F1 0%, #7C3AED 45%, #22D3EE 100%)',
    stops: [
      { color: '#6366F1', position: 0, name: 'Electric Indigo' },
      { color: '#7C3AED', position: 45, name: 'Royal Violet' },
      { color: '#22D3EE', position: 100, name: 'Aqua Cyan' },
    ],
    angle: '135deg',
    bestFor: 'Technology demonstrations, agent workflows, dashboards, live metrics',
    emotionalTone: 'Enterprise-grade, authoritative, precision architecture, computational clarity',
    tailwindClass: 'from-[#6366F1] via-[#7C3AED] to-[#22D3EE]',
  },
  {
    id: 'grad-07',
    name: 'Gradient 07 — Cinematic Midnight',
    css: 'linear-gradient(135deg, #071426 0%, #1B1035 55%, #4C1D95 100%)',
    stops: [
      { color: '#071426', position: 0, name: 'Midnight Navy' },
      { color: '#1B1035', position: 55, name: 'Deep Plum' },
      { color: '#4C1D95', position: 100, name: 'Imperial Violet' },
    ],
    angle: '135deg',
    bestFor: 'Premium dark-mode presentations, web canvas backgrounds, luxury cards',
    emotionalTone: 'Cinematic depth, prestige, focused contrast without light glare',
    tailwindClass: 'from-[#071426] via-[#1B1035] to-[#4C1D95]',
  },
  {
    id: 'grad-08',
    name: 'Gradient 08 — Golden Horizon',
    css: 'linear-gradient(120deg, #FFD166 0%, #FFA726 35%, #FB6A21 70%, #FF4D6D 100%)',
    stops: [
      { color: '#FFD166', position: 0, name: 'Golden Glow' },
      { color: '#FFA726', position: 35, name: 'Radiant Amber' },
      { color: '#FB6A21', position: 70, name: 'Sunset Orange' },
      { color: '#FF4D6D', position: 100, name: 'Vibrant Coral' },
    ],
    angle: '120deg',
    bestFor: 'Motivational, creative, and high-energy designs, YouTube banner headlines',
    emotionalTone: 'Inspirational, expansive, breakthrough velocity',
    tailwindClass: 'from-[#FFD166] via-[#FFA726] to-[#FF4D6D]',
  },
];
