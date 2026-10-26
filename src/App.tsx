/**
 * AI FREEDOM WITH UDAY - Application Root & Multi-Experience Router
 * Seamlessly routes between:
 * 1. Public Website & Free AI Starter Kit Funnel (/)
 * 2. Private Admin Dashboard (/admin)
 * 3. Private Admin Login (/admin/login)
 * 4. Brand Design System Showcase (/design-system - Preserved V1)
 * 
 * Strict Admin Authentication:
 * Real Supabase Auth + Server-Verified is_admin() RPC.
 * Zero browser-storage authorization fallbacks.
 */

import React, { useState, useEffect } from 'react';
import { PublicLandingPage } from './components/PublicLandingPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { verifyAdminSession, adminLogout, supabase, AdminSession } from './lib/supabase';

// Preserved V1 Brand Design System Showcase Imports
import { BrandWordmark } from './design-system/components/BrandWordmark';
import { ColorPaletteInspector } from './design-system/components/ColorPaletteInspector';
import { GradientStudio } from './design-system/components/GradientStudio';
import { ThemeSwitcherPreview } from './design-system/components/ThemeSwitcherPreview';
import { TypographyTester } from './design-system/components/TypographyTester';
import { GlassmorphismPlayground } from './design-system/components/GlassmorphismPlayground';
import { MotionShowcase } from './design-system/components/MotionShowcase';
import { PresentationStudio } from './design-system/components/PresentationStudio';
import { SocialMediaStudio } from './design-system/components/SocialMediaStudio';
import { DashboardShowcase } from './design-system/components/DashboardShowcase';
import { TokensExportModal } from './design-system/components/TokensExportModal';
import {
  Code,
  Tv,
  Palette,
  Sparkles,
  Layers,
  Type,
  Sliders,
  Play,
  Share2,
  Lock,
  Loader2,
} from 'lucide-react';

type Route = 'public' | 'admin-login' | 'admin' | 'design-system';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('public');
  const [adminSession, setAdminSessionState] = useState<AdminSession | null>(null);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState<boolean>(false);
  const [designSystemTab, setDesignSystemTab] = useState<
    'palette' | 'gradients' | 'themes' | 'typography' | 'surfaces' | 'motion' | 'presentation' | 'social' | 'console' | 'guidelines'
  >('presentation');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Synchronize route and verify authentication
  useEffect(() => {
    let isMounted = true;

    const handleLocationChange = async () => {
      const path = window.location.pathname;

      if (path === '/admin/login') {
        setCurrentRoute('admin-login');
        setIsVerifyingAdmin(false);
      } else if (path.startsWith('/admin')) {
        setIsVerifyingAdmin(true);
        setCurrentRoute('admin');
        const session = await verifyAdminSession();
        if (!isMounted) return;

        if (session) {
          setAdminSessionState(session);
          setCurrentRoute('admin');
        } else {
          setAdminSessionState(null);
          setCurrentRoute('admin-login');
          try {
            window.history.replaceState({}, '', '/admin/login');
          } catch {
            // ignore
          }
        }
        setIsVerifyingAdmin(false);
      } else if (path.startsWith('/design-system')) {
        setCurrentRoute('design-system');
        setIsVerifyingAdmin(false);
      } else {
        setCurrentRoute('public');
        setIsVerifyingAdmin(false);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);

    // Subscribe to Supabase Auth State Changes
    const authSubscription = supabase?.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        if (!isMounted) return;
        setAdminSessionState(null);
        if (window.location.pathname.startsWith('/admin')) {
          navigateTo('admin-login', '/admin/login');
        }
      }
    });

    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handleLocationChange);
      authSubscription?.data?.subscription?.unsubscribe();
    };
  }, []);

  const navigateTo = (route: Route, pathUrl: string) => {
    try {
      window.history.pushState({}, '', pathUrl);
    } catch {
      // ignore
    }
    setCurrentRoute(route);
  };

  const handleAdminLoginSuccess = async () => {
    setIsVerifyingAdmin(true);
    const session = await verifyAdminSession();
    setIsVerifyingAdmin(false);
    if (session) {
      setAdminSessionState(session);
      navigateTo('admin', '/admin');
    } else {
      navigateTo('admin-login', '/admin/login');
    }
  };

  const handleAdminLogout = async () => {
    await adminLogout();
    setAdminSessionState(null);
    navigateTo('admin-login', '/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#071426] text-white flex flex-col font-manrope">
      {/* ROUTE 1: PUBLIC LANDING PAGE (Default /) */}
      {currentRoute === 'public' && (
        <PublicLandingPage />
      )}

      {/* ROUTE 2: ADMIN LOGIN (/admin/login) */}
      {currentRoute === 'admin-login' && (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onNavigateHome={() => navigateTo('public', '/')}
        />
      )}

      {/* ROUTE 3: PRIVATE ADMIN DASHBOARD (/admin) */}
      {currentRoute === 'admin' && (
        isVerifyingAdmin ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFA726] to-[#FB6A21] flex items-center justify-center text-white shadow-xl shadow-[#FB6A21]/20 animate-pulse">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Loader2 className="w-4 h-4 animate-spin text-[#FFA726]" />
              <span>Verifying administrator authorization via Supabase Auth...</span>
            </div>
          </div>
        ) : adminSession ? (
          <AdminDashboard
            adminSession={adminSession}
            onLogout={handleAdminLogout}
            onNavigateHome={() => navigateTo('public', '/')}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onNavigateHome={() => navigateTo('public', '/')}
          />
        )
      )}

      {/* ROUTE 4: PRESERVED V1 BRAND DESIGN SYSTEM SHOWCASE (/design-system) */}
      {currentRoute === 'design-system' && (
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 bg-[#071426]/90 backdrop-blur-xl border-b border-white/10 px-6 lg:px-12 py-4 flex items-center justify-between gap-8">
            <button
              onClick={() => navigateTo('public', '/')}
              className="text-left hover:opacity-85 transition-opacity"
              title="Return to Public Website"
            >
              <BrandWordmark brand="personal" size="md" />
            </button>

            <nav className="hidden lg:flex items-center gap-6 text-xs font-manrope font-medium text-slate-300">
              <button
                onClick={() => setDesignSystemTab('presentation')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  designSystemTab === 'presentation' ? 'text-[#FFA726] font-semibold' : 'hover:text-white'
                }`}
              >
                Presentation Deck
              </button>
              <button
                onClick={() => setDesignSystemTab('palette')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  designSystemTab === 'palette' ? 'text-[#FFA726] font-semibold' : 'hover:text-white'
                }`}
              >
                Colors & Tokens
              </button>
              <button
                onClick={() => setDesignSystemTab('gradients')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  designSystemTab === 'gradients' ? 'text-[#FFA726] font-semibold' : 'hover:text-white'
                }`}
              >
                Gradients
              </button>
              <button
                onClick={() => setDesignSystemTab('themes')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  designSystemTab === 'themes' ? 'text-[#FFA726] font-semibold' : 'hover:text-white'
                }`}
              >
                6 Themes
              </button>
              <button
                onClick={() => setDesignSystemTab('console')}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  designSystemTab === 'console' ? 'text-[#FFA726] font-semibold' : 'hover:text-white'
                }`}
              >
                KiranForge Console
              </button>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-4 py-2 text-xs font-display font-semibold text-white bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Export Tokens</span>
              </button>
            </div>
          </header>

          {/* V1 Hero */}
          <section className="relative px-6 lg:px-12 pt-12 pb-8 overflow-hidden border-b border-white/10">
            <div className="max-w-5xl mx-auto space-y-4">
              <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                Uday Kiran Brand System · <span className="text-[#FFA726]">Design Tokens</span>
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Canonical color tokens, 8 signature gradients, 6 themes, motion tokens, and presentation/social engines.
              </p>
            </div>
          </section>

          {/* V1 Nav Tabs */}
          <section className="px-6 lg:px-12 py-3 bg-[#050D1A] border-b border-white/10 sticky top-[65px] z-30 overflow-x-auto">
            <div className="max-w-6xl mx-auto flex items-center gap-1.5 min-w-max">
              {[
                { id: 'presentation', label: '16:9 Presentation Deck', icon: Tv },
                { id: 'palette', label: 'Canonical Colors', icon: Palette },
                { id: 'gradients', label: 'Signature Gradients', icon: Sparkles },
                { id: 'themes', label: '6 Signature Themes', icon: Layers },
                { id: 'typography', label: 'Typography & Telugu', icon: Type },
                { id: 'surfaces', label: 'Glassmorphism', icon: Sliders },
                { id: 'motion', label: '15 Motion Tokens', icon: Play },
                { id: 'social', label: 'Social Media Studio', icon: Share2 },
                { id: 'console', label: 'KiranForge Console', icon: Code },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = designSystemTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDesignSystemTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-display font-medium flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FFA726] to-[#FB6A21] text-white shadow-md font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <main className="flex-1 px-6 lg:px-12 py-8 max-w-6xl mx-auto w-full">
            {designSystemTab === 'presentation' && <PresentationStudio />}
            {designSystemTab === 'palette' && <ColorPaletteInspector />}
            {designSystemTab === 'gradients' && <GradientStudio />}
            {designSystemTab === 'themes' && <ThemeSwitcherPreview />}
            {designSystemTab === 'typography' && <TypographyTester />}
            {designSystemTab === 'surfaces' && <GlassmorphismPlayground />}
            {designSystemTab === 'motion' && <MotionShowcase />}
            {designSystemTab === 'social' && <SocialMediaStudio />}
            {designSystemTab === 'console' && <DashboardShowcase />}
          </main>

          <TokensExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
