/**
 * AI FREEDOM WITH UDAY - Private Admin Authentication
 * Authentic Supabase Auth login with server-side allowlist verification.
 * Zero hardcoded passwords or mock bypasses.
 */

import React, { useState } from 'react';
import { adminLogin, isSupabaseConfigured } from '../lib/supabase';
import { Lock, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [email, setEmail] = useState<string>('mudaykiran.8801@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured) {
        setErrorMessage(
          'Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
        );
        setIsLoading(false);
        return;
      }

      const result = await adminLogin(email, password);

      if (result.success) {
        onLoginSuccess();
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071426] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden font-manrope">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#FFA726]/10 via-[#FB6A21]/15 to-[#7C3AED]/15 blur-[120px] pointer-events-none" />

      {/* Back to Public Link */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onNavigateHome}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Website</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#FFA726] to-[#FB6A21] flex items-center justify-center text-white shadow-xl shadow-[#FB6A21]/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Private Admin Dashboard
          </h2>
          <p className="text-xs text-slate-400">
            AI Freedom With Uday · Verified Administrator Login
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="p-8 rounded-3xl bg-[#111827] border border-white/10 shadow-2xl space-y-5 backdrop-blur-md"
        >
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mudaykiran.8801@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071426] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#FFA726] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Supabase Auth Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071426] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#FFA726] transition-colors"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Database Allowlist Enforced</span>
            </span>
            <span className={isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}>
              {isSupabaseConfigured ? 'Supabase Auth Ready' : 'Credentials Missing'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-display font-semibold text-xs text-white bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] shadow-lg shadow-[#FB6A21]/20 hover:scale-[1.02] active:scale-98 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <span>Verifying via Supabase Auth...</span> : <span>Sign In as Admin</span>}
          </button>
        </form>

        <div className="text-center">
          <span className="text-[11px] font-mono text-[#D5B46B]">
            Created by Uday Kiran · Row Level Security Protected
          </span>
        </div>
      </div>
    </div>
  );
};
