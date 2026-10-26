/**
 * Uday Kiran Premium Brand Design System - Motion Graphics System
 * 15 reusable motion specifications with easing curves, timing, and Framer Motion tokens.
 */

export interface MotionSpec {
  id: string;
  number: string;
  name: string;
  duration: string;
  easing: string;
  purpose: string;
  implementation: string;
  previewType: 'fade-scale' | 'stagger-text' | 'gradient-shift' | 'glow-trace' | 'card-hover' | 'workflow-reveal' | 'chart-grow' | 'glass-sheen';
}

export const BRAND_MOTION_TOKENS: MotionSpec[] = [
  {
    id: 'motion-01',
    number: '01',
    name: 'Cinematic Title Reveal',
    duration: '0.85s',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    purpose: 'Hero headlines, opening presentation slide title, keynote intro sequence.',
    implementation: 'Initial: { opacity: 0, y: 32, filter: "blur(8px)" } -> Target: { opacity: 1, y: 0, filter: "blur(0px)" }',
    previewType: 'fade-scale',
  },
  {
    id: 'motion-02',
    number: '02',
    name: 'Gradient Background Animation',
    duration: '12.0s',
    easing: 'ease-in-out (infinite alternate)',
    purpose: 'Hero ambient background, stage backdrop, subtle luxury depth without distraction.',
    implementation: 'background-size: 200% 200%; animation: gradientShift 12s ease-in-out infinite alternate;',
    previewType: 'gradient-shift',
  },
  {
    id: 'motion-03',
    number: '03',
    name: 'Smooth Element Entrance',
    duration: '0.5s',
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    purpose: 'Navigation header arrival, secondary button load, floating controls.',
    implementation: 'Initial: { opacity: 0, y: -16 } -> Target: { opacity: 1, y: 0 }',
    previewType: 'fade-scale',
  },
  {
    id: 'motion-04',
    number: '04',
    name: 'Staggered Text Reveal',
    duration: '0.04s per word',
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    purpose: 'Tagline reveals ("Make AI Simple. Practical. Useful."), mission statements.',
    implementation: 'Parent container with staggerChildren: 0.08, child elements animate opacity & translateY.',
    previewType: 'stagger-text',
  },
  {
    id: 'motion-05',
    number: '05',
    name: 'Premium Fade and Scale',
    duration: '0.6s',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    purpose: 'Modals, spotlight dialogs, flagship brand mark appearances.',
    implementation: 'Initial: { opacity: 0, scale: 0.94 } -> Target: { opacity: 1, scale: 1 }',
    previewType: 'fade-scale',
  },
  {
    id: 'motion-06',
    number: '06',
    name: 'Morphing Abstract Gradient Shapes',
    duration: '8.0s',
    easing: 'ease-in-out infinite',
    purpose: 'Ambient visual anchor in hero backdrop and presentation corners.',
    implementation: 'border-radius: 60% 40% 30% 70% / 60% 30% 70% 40% with animated keyframes.',
    previewType: 'gradient-shift',
  },
  {
    id: 'motion-07',
    number: '07',
    name: 'Elegant Card Transitions',
    duration: '0.3s',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    purpose: 'Interactive feature cards, hover lift, active border illumination.',
    implementation: 'hover: { y: -4px, boxShadow: "0 20px 40px -15px rgba(251, 106, 33, 0.35)" }',
    previewType: 'card-hover',
  },
  {
    id: 'motion-08',
    number: '08',
    name: 'Animated Glowing Lines',
    duration: '2.5s',
    easing: 'linear infinite',
    purpose: 'Section dividers, data pipeline edges, active progress indicators.',
    implementation: 'stroke-dasharray / stroke-dashoffset transition or moving linear-gradient border.',
    previewType: 'glow-trace',
  },
  {
    id: 'motion-09',
    number: '09',
    name: 'Diagram & Workflow Node Reveals',
    duration: '0.45s per node',
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    purpose: 'KiranForge architecture flowcharts, agent steps, sequential thought loops.',
    implementation: 'Sequential node scale (0.8 -> 1) with pulse glow upon activation.',
    previewType: 'workflow-reveal',
  },
  {
    id: 'motion-10',
    number: '10',
    name: 'Progressive Chart Animations',
    duration: '1.2s',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    purpose: 'Presentation slide data points, case study metric bars, dashboard telemetry.',
    implementation: 'width: 0% -> target% with tabular numerical ticker increment.',
    previewType: 'chart-grow',
  },
  {
    id: 'motion-11',
    number: '11',
    name: 'Parallax-Style Depth',
    duration: 'Reactive (Pointer/Scroll)',
    easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
    purpose: 'Card layers, subtle 3D tilt on mousemove, depth segregation.',
    implementation: 'transform: perspective(1000px) rotateX(calc) rotateY(calc)',
    previewType: 'card-hover',
  },
  {
    id: 'motion-12',
    number: '12',
    name: 'Subtle Glass Reflections',
    duration: '3.0s (Interval loop)',
    easing: 'ease-in-out',
    purpose: 'Luxury badges, premium CTA buttons, flagship cards.',
    implementation: 'A linear shine overlay translating from -100% to 200% across the surface.',
    previewType: 'glass-sheen',
  },
  {
    id: 'motion-13',
    number: '13',
    name: 'Premium Section Transitions',
    duration: '0.6s',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    purpose: 'Tab switching, theme switching, slide deck transitions.',
    implementation: 'AnimatePresence with opacity 0 -> 1 and subtle scale 0.98 -> 1.',
    previewType: 'fade-scale',
  },
  {
    id: 'motion-14',
    number: '14',
    name: 'Interactive Hover States',
    duration: '0.18s',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    purpose: 'Buttons, nav links, icon actions, clickable tags.',
    implementation: 'transform: translateY(-1px); filter: brightness(1.08); response under 200ms.',
    previewType: 'card-hover',
  },
  {
    id: 'motion-15',
    number: '15',
    name: 'Presentation Click-by-Click Reveals',
    duration: '0.4s per step',
    easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
    purpose: 'Keynote slide bullet points, progressive diagrams, teaching pacing.',
    implementation: 'Index-gated reveal state driven by Spacebar or Right Arrow key.',
    previewType: 'workflow-reveal',
  },
];
