/**
 * Uday Kiran Brand System - Website & Application Theme Components
 * Production-ready SaaS dashboard and enterprise console demonstrating
 * the 60-30-10 color rule, tabular numerals, top bar contract, and light/dark modes.
 */

import React, { useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Filter,
  Layers,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';

interface AgentRun {
  id: string;
  name: string;
  cluster: string;
  latencyMs: number;
  tokensUsed: number;
  accuracy: number;
  status: 'verified' | 'optimizing' | 'completed';
  timestamp: string;
}

const INITIAL_RUNS: AgentRun[] = [
  {
    id: 'RUN-4819',
    name: 'Multi-Document Synthesis Pipeline',
    cluster: 'AP-South-1 (Hyderabad)',
    latencyMs: 74,
    tokensUsed: 4210,
    accuracy: 99.98,
    status: 'verified',
    timestamp: 'Just now',
  },
  {
    id: 'RUN-4818',
    name: 'Telugu Semantic Parser & Normalizer',
    cluster: 'AP-South-1 (Hyderabad)',
    latencyMs: 48,
    tokensUsed: 1840,
    accuracy: 99.95,
    status: 'verified',
    timestamp: '2m ago',
  },
  {
    id: 'RUN-4817',
    name: 'Deterministic Invariant Verifier',
    cluster: 'US-East-4',
    latencyMs: 62,
    tokensUsed: 3100,
    accuracy: 100.0,
    status: 'completed',
    timestamp: '5m ago',
  },
  {
    id: 'RUN-4816',
    name: 'Agentic Workflow Graph Execution',
    cluster: 'EU-West-1',
    latencyMs: 112,
    tokensUsed: 8940,
    accuracy: 99.91,
    status: 'optimizing',
    timestamp: '12m ago',
  },
];

export const DashboardShowcase: React.FC = () => {
  const [runs, setRuns] = useState<AgentRun[]>(INITIAL_RUNS);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'overview' | 'pipelines' | 'logs'>('overview');

  const filteredRuns = runs.filter(
    (r) =>
      r.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const isLight = themeMode === 'light';

  return (
    <div
      className={`rounded-3xl border transition-colors duration-300 overflow-hidden ${
        isLight
          ? 'bg-[#F6F9FC] text-[#071426] border-slate-300'
          : 'bg-[#071426] text-white border-white/10'
      }`}
    >
      {/* 1. TOP BAR CONTRACT: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (1 Action) */}
      <header
        className={`flex items-center justify-between gap-8 px-6 py-4 border-b transition-colors ${
          isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#111827]/80'
        }`}
      >
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FFA726] to-[#D946EF] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            KiranForge <span className="text-[#FFA726] font-normal">Console</span>
          </span>
        </div>

        {/* Zone 2: 4-5 single-line nav links */}
        <nav
          className={`hidden md:flex items-center gap-6 text-sm font-medium ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? isLight
                  ? 'text-[#071426] font-bold border-b-2 border-[#FB6A21]'
                  : 'text-white font-bold border-b-2 border-[#FFA726]'
                : 'hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('pipelines')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'pipelines'
                ? isLight
                  ? 'text-[#071426] font-bold border-b-2 border-[#FB6A21]'
                  : 'text-white font-bold border-b-2 border-[#FFA726]'
                : 'hover:text-white'
            }`}
          >
            Pipelines
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'logs'
                ? isLight
                  ? 'text-[#071426] font-bold border-b-2 border-[#FB6A21]'
                  : 'text-white font-bold border-b-2 border-[#FFA726]'
                : 'hover:text-white'
            }`}
          >
            Audit Logs
          </button>
          <span
            className={`hover:opacity-100 cursor-pointer transition-opacity whitespace-nowrap shrink-0 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Documentation
          </span>
        </nav>

        {/* Zone 3: 1 primary action + Light/Dark mode toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setThemeMode(isLight ? 'dark' : 'light')}
            className={`p-2 rounded-xl border transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
            title="Toggle Dashboard Theme"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#FFA726]" />}
          </button>

          <button className="px-4 py-2 text-xs font-display font-semibold text-white bg-gradient-to-r from-[#FFA726] to-[#FB6A21] rounded-xl hover:opacity-95 shadow-md transition-transform hover:scale-105 whitespace-nowrap shrink-0">
            Deploy New Pipeline
          </button>
        </div>
      </header>

      {/* 2. DASHBOARD BODY */}
      <div className="p-6 md:p-8 space-y-8">
        {/* KPI Statistics Blocks (Tabular Figures) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Active Pipelines',
              value: '142',
              delta: '+18% this month',
              accent: '#FFA726',
            },
            {
              label: 'Median Latency',
              value: '68ms',
              delta: '-34ms vs legacy',
              accent: '#FB6A21',
            },
            {
              label: 'Invariant Accuracy',
              value: '99.98%',
              delta: 'Zero regressions',
              accent: '#D946EF',
            },
            {
              label: 'Monthly Compute Efficiency',
              value: '84.6%',
              delta: '$3,420 saved',
              accent: '#22D3EE',
            },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'
              }`}
            >
              <span className="text-xs font-manrope text-slate-400 block mb-1">
                {kpi.label}
              </span>
              <div
                className="text-3xl font-mono font-bold tracking-tight mb-1"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {kpi.value}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-manrope">
                <span className="font-medium text-emerald-500">{kpi.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Bento Grid: Workflow Monitor + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Pipeline Runs Table (8 cols) */}
          <div
            className={`lg:col-span-8 p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-bold text-base">
                  Active Execution Cluster
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time telemetry streams from verified KiranForge runtime nodes.
                </p>
              </div>

              {/* Filter Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter runs..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className={`pl-9 pr-3 py-1.5 rounded-lg text-xs font-mono border focus:outline-none focus:border-[#FFA726] ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-800'
                      : 'bg-[#071426] border-white/10 text-white'
                  }`}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr
                    className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                      isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'
                    }`}
                  >
                    <th className="pb-3 font-semibold">Execution ID</th>
                    <th className="pb-3 font-semibold">Pipeline Name</th>
                    <th className="pb-3 font-semibold">Latency</th>
                    <th className="pb-3 font-semibold">Accuracy</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRuns.map((run) => (
                    <tr
                      key={run.id}
                      className={`transition-colors ${
                        isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'
                      }`}
                    >
                      <td className="py-3 font-mono font-medium text-[#FFA726]">{run.id}</td>
                      <td className="py-3 font-display font-medium">
                        <div>{run.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {run.cluster} · {run.tokensUsed.toLocaleString()} tokens
                        </div>
                      </td>
                      <td
                        className="py-3 font-mono text-slate-300"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {run.latencyMs}ms
                      </td>
                      <td
                        className="py-3 font-mono font-medium text-emerald-400"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {run.accuracy}%
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono capitalize ${
                            run.status === 'verified'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : run.status === 'optimizing'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{run.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Action & Architecture Panel (4 cols) */}
          <div
            className={`lg:col-span-4 p-6 rounded-2xl border space-y-5 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'
            }`}
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#FFA726] block mb-1">
                Cognitive Invariant Health
              </span>
              <h4 className="font-display font-bold text-base">
                Operational Guarantee
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                All production requests route through strict deterministic constraint checks.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#071426] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Semantic Drift Protection</span>
                  <span className="text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Vector thresholds bound token outputs within verified bounds.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#071426] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Indic Language Normalizer</span>
                  <span className="text-[#FFA726] font-bold">READY</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Native Telugu tokenization with sub-word preservation.
                </p>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl font-display font-semibold text-xs text-white bg-gradient-to-r from-[#FFA726] via-[#FB6A21] to-[#D946EF] shadow-md transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5">
              <span>View Security Audit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
