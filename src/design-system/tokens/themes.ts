/**
 * Uday Kiran Premium Brand Design System - Six Signature Theme Combinations
 * Predefined visual harmonies tailored for specific project intents.
 */

export interface ThemeDefinition {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  bestFor: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceBorder: string;
    textPrimary: string;
    textSecondary: string;
    highlight: string;
  };
  gradient: string;
  previewBg: string;
  tags: string[];
}

export const SIGNATURE_THEMES: Record<string, ThemeDefinition> = {
  'sunset-luxury': {
    id: 'sunset-luxury',
    name: 'Theme A — Sunset Luxury',
    subtitle: 'Amber + Orange + Coral + Midnight Navy',
    description: 'For confident, warm, and powerful storytelling that captivates executive and mainstream audiences.',
    bestFor: 'Keynote openers, public AI education, brand announcements, main website hero.',
    palette: {
      primary: '#FFA726',
      secondary: '#FB6A21',
      accent: '#FF4D6D',
      background: '#071426',
      surface: 'rgba(17, 24, 39, 0.75)',
      surfaceBorder: 'rgba(255, 167, 38, 0.25)',
      textPrimary: '#FFFFFF',
      textSecondary: '#FFB3A7',
      highlight: '#FFD166',
    },
    gradient: 'linear-gradient(135deg, #FFD166 0%, #FFA726 30%, #FB6A21 65%, #FF4D6D 100%)',
    previewBg: '#071426',
    tags: ['Confidence', 'Storytelling', 'Executive Impact'],
  },
  'royal-innovation': {
    id: 'royal-innovation',
    name: 'Theme B — Royal Innovation',
    subtitle: 'Magenta + Violet + Electric Indigo + Deep Plum',
    description: 'For cutting-edge AI breakthroughs, software development, cognitive agents, and technical excellence.',
    bestFor: 'KiranForge agent workflows, machine learning architectures, developer toolkits.',
    palette: {
      primary: '#D946EF',
      secondary: '#7C3AED',
      accent: '#6366F1',
      background: '#1B1035',
      surface: 'rgba(27, 16, 53, 0.75)',
      surfaceBorder: 'rgba(217, 70, 239, 0.25)',
      textPrimary: '#FFFFFF',
      textSecondary: '#B794F6',
      highlight: '#22D3EE',
    },
    gradient: 'linear-gradient(135deg, #D946EF 0%, #A855F7 45%, #7C3AED 100%)',
    previewBg: '#1B1035',
    tags: ['AI Software', 'Deep Tech', 'Agentic Systems'],
  },
  'golden-creativity': {
    id: 'golden-creativity',
    name: 'Theme C — Golden Creativity',
    subtitle: 'Gold + Amber + Magenta + Soft White',
    description: 'For social media infographics, tutorials, educational decks, and creator community content.',
    bestFor: 'Instagram carousels, YouTube educational slides, student workshops, newsletter headers.',
    palette: {
      primary: '#FFD166',
      secondary: '#FFA726',
      accent: '#D946EF',
      background: '#071426',
      surface: 'rgba(246, 249, 252, 0.08)',
      surfaceBorder: 'rgba(255, 209, 102, 0.25)',
      textPrimary: '#F6F9FC',
      textSecondary: '#FFB3A7',
      highlight: '#FF4D6D',
    },
    gradient: 'linear-gradient(120deg, #FFD166 0%, #FFA726 35%, #FB6A21 70%, #FF4D6D 100%)',
    previewBg: '#0C1B33',
    tags: ['Education', 'Community', 'High Engagement'],
  },
  'cinematic-fusion': {
    id: 'cinematic-fusion',
    name: 'Theme D — Cinematic Fusion',
    subtitle: 'Orange + Coral + Magenta + Violet + Charcoal',
    description: 'The master synthesis of both visual worlds. Deep theatrical contrast and cinematic motion graphics.',
    bestFor: 'Flagship brand reels, motion intros, YouTube thumbnails, festival keynotes.',
    palette: {
      primary: '#FB6A21',
      secondary: '#FF4D6D',
      accent: '#7C3AED',
      background: '#111827',
      surface: 'rgba(17, 24, 39, 0.85)',
      surfaceBorder: 'rgba(251, 106, 33, 0.3)',
      textPrimary: '#FFFFFF',
      textSecondary: '#B794F6',
      highlight: '#FFA726',
    },
    gradient: 'linear-gradient(120deg, #FFA726 0%, #FB6A21 30%, #D946EF 65%, #7C3AED 100%)',
    previewBg: '#111827',
    tags: ['Signature Hero', 'Cinematic', 'Theatrical'],
  },
  'elegant-minimal': {
    id: 'elegant-minimal',
    name: 'Theme E — Elegant Minimal',
    subtitle: 'Soft White + Midnight Navy + Violet + Champagne Gold',
    description: 'For corporate whitepapers, executive reports, enterprise investor decks, and clean dashboards.',
    bestFor: 'Enterprise client proposals, analytical reports, light-mode documentation.',
    palette: {
      primary: '#071426',
      secondary: '#7C3AED',
      accent: '#D5B46B',
      background: '#F6F9FC',
      surface: '#FFFFFF',
      surfaceBorder: 'rgba(7, 20, 38, 0.12)',
      textPrimary: '#071426',
      textSecondary: '#4B5563',
      highlight: '#D5B46B',
    },
    gradient: 'linear-gradient(135deg, #071426 0%, #1B1035 55%, #7C3AED 100%)',
    previewBg: '#F6F9FC',
    tags: ['Executive', 'Enterprise', 'Whitepaper'],
  },
  'future-technology': {
    id: 'future-technology',
    name: 'Theme F — Future Technology',
    subtitle: 'Indigo + Violet + Cyan + Midnight Navy',
    description: 'For AI agents, autonomous automation pipelines, telemetry streaming, and cyber-spatial applications.',
    bestFor: 'Real-time observability consoles, multi-agent orchestrators, API reference docs.',
    palette: {
      primary: '#6366F1',
      secondary: '#7C3AED',
      accent: '#22D3EE',
      background: '#071426',
      surface: 'rgba(17, 24, 39, 0.75)',
      surfaceBorder: 'rgba(34, 211, 238, 0.25)',
      textPrimary: '#FFFFFF',
      textSecondary: '#94A3B8',
      highlight: '#22D3EE',
    },
    gradient: 'linear-gradient(135deg, #6366F1 0%, #7C3AED 45%, #22D3EE 100%)',
    previewBg: '#050D1A',
    tags: ['Autonomous Agents', 'Telemetry', 'Modern Tech'],
  },
};
