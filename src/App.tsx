/**
 * AI FREEDOM WITH UDAY - Application Root & Router
 * Routes between:
 * 1. Public Website & Free AI Starter Kit Funnel (/)
 * 2. Private Admin Dashboard (/admin)
 * 3. Private Admin Login (/admin/login)
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
import { Lock, Loader2 } from 'lucide-react';

type Route = 'public' | 'admin-login' | 'admin';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('public');
  const [adminSession, setAdminSessionState] = useState<AdminSession | null>(null);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState<boolean>(false);

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
      } else {
        // Any other path defaults directly to the public landing page
        if (path !== '/') {
          try {
            window.history.replaceState({}, '', '/');
          } catch {
            // ignore
          }
        }
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
    </div>
  );
}
