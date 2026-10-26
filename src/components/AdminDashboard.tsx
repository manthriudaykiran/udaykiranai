/**
 * AI FREEDOM WITH UDAY - Private Admin Dashboard
 * Exclusive management console for Uday Kiran with KPI analytics,
 * real-time learner registry, WhatsApp 1-click contact, note editing, and CSV export.
 */

import React, { useState, useEffect } from 'react';
import {
  fetchLearners,
  updateLearnerRecord,
  exportLearnersToCSV,
  adminLogout,
  AdminSession,
  isSupabaseConfigured,
  SUPABASE_SETUP_SQL,
  Learner,
} from '../lib/supabase';
import {
  Users,
  UserPlus,
  Download,
  Search,
  Filter,
  MessageCircle,
  FileSpreadsheet,
  Moon,
  Sun,
  LogOut,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Database,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Phone,
  RefreshCw,
  FolderOpen,
  Calendar,
  X,
  Code,
  Copy,
} from 'lucide-react';

interface AdminDashboardProps {
  adminSession?: AdminSession | null;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminSession,
  onLogout,
  onNavigateHome,
}) => {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light'); // Default to requested Premium Light Dashboard

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterProfession, setFilterProfession] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');

  // Modal States
  const [editingLearner, setEditingLearner] = useState<Learner | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');
  const [isSavingNote, setIsSavingNote] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [sqlCopied, setSqlCopied] = useState<boolean>(false);

  // Active Tab: Roster vs Future V2 modules
  const [activeTab, setActiveTab] = useState<'roster' | 'pipeline' | 'journey' | 'sql'>('roster');

  const isLight = themeMode === 'light';

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLearners();
      setLearners(data);
    } catch (err) {
      console.error('Failed to load learners:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Learners
  const filteredLearners = learners.filter((l) => {
    const matchesSearch =
      l.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.whatsapp_number.includes(searchQuery) ||
      l.learning_goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.admin_notes || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProfession = filterProfession === 'all' || l.profession === filterProfession;
    const matchesLevel = filterLevel === 'all' || l.ai_knowledge_level === filterLevel;
    const matchesStatus = filterStatus === 'all' || l.status === filterStatus;
    const matchesSource = filterSource === 'all' || l.source === filterSource;

    return matchesSearch && matchesProfession && matchesLevel && matchesStatus && matchesSource;
  });

  // KPI Calculations
  const totalLearners = learners.length;
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneWeekMs = 7 * oneDayMs;

  const newToday = learners.filter(
    (l) => now - new Date(l.created_at).getTime() <= oneDayMs
  ).length;

  const newThisWeek = learners.filter(
    (l) => now - new Date(l.created_at).getTime() <= oneWeekMs
  ).length;

  const driveAccessedCount = learners.filter((l) => l.drive_accessed).length;
  const driveRate = totalLearners > 0 ? Math.round((driveAccessedCount / totalLearners) * 100) : 0;

  const channelJoinedCount = learners.filter((l) => l.whatsapp_channel_clicked).length;
  const channelRate = totalLearners > 0 ? Math.round((channelJoinedCount / totalLearners) * 100) : 0;

  // Status Change Handler
  const handleStatusChange = async (id: string, newStatus: Learner['status']) => {
    setLearners((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    await updateLearnerRecord(id, { status: newStatus });
  };

  // Note Modal Save
  const handleSaveNote = async () => {
    if (!editingLearner) return;
    setIsSavingNote(true);
    await updateLearnerRecord(editingLearner.id, { admin_notes: noteContent });
    setLearners((prev) =>
      prev.map((l) => (l.id === editingLearner.id ? { ...l, admin_notes: noteContent } : l))
    );
    setIsSavingNote(false);
    setEditingLearner(null);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  };

  const handleLogoutClick = async () => {
    await adminLogout();
    onLogout();
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col font-manrope ${
        isLight ? 'bg-[#F6F9FC] text-[#071426]' : 'bg-[#071426] text-white'
      }`}
    >
      {/* 1. TOP ADMIN BAR */}
      <header
        className={`sticky top-0 z-40 px-6 lg:px-10 py-3.5 border-b flex items-center justify-between gap-4 transition-colors ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#111827] border-white/10'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFA726] to-[#FB6A21] flex items-center justify-center text-white shadow-md">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base tracking-tight leading-tight">
              AI Freedom <span className="text-[#FB6A21]">Admin Console</span>
            </h1>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>{adminSession?.email || 'mudaykiran.8801@gmail.com'}</span>
              <span>·</span>
              <span
                className={`inline-flex items-center gap-1 ${
                  isSupabaseConfigured ? 'text-emerald-500 font-semibold' : 'text-amber-500'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {isSupabaseConfigured ? 'Supabase Live' : 'Local Storage Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Icons & Toggles */}
        <div className="flex items-center gap-2.5">
          {/* SQL Setup Modal Button */}
          <button
            onClick={() => setShowSqlModal(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-colors flex items-center gap-1.5 ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-[#FFA726]" />
            <span className="hidden sm:inline">Supabase SQL</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setThemeMode(isLight ? 'dark' : 'light')}
            className={`p-2 rounded-xl border transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
            title="Toggle Dashboard Theme"
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-[#FFA726]" />}
          </button>

          {/* View Public Website */}
          <button
            onClick={onNavigateHome}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
          >
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogoutClick}
            className={`p-2 rounded-xl border transition-colors ${
              isLight
                ? 'hover:bg-red-50 border-slate-300 text-red-600'
                : 'hover:bg-red-500/10 border-white/10 text-red-400'
            }`}
            title="Sign Out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION (Roster vs Future Modules) */}
      <div
        className={`px-6 lg:px-10 border-b flex items-center gap-6 text-xs font-display font-medium overflow-x-auto ${
          isLight ? 'bg-white/80 border-slate-200' : 'bg-[#071426]/90 border-white/10'
        }`}
      >
        <button
          onClick={() => setActiveTab('roster')}
          className={`py-3 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'roster'
              ? isLight
                ? 'border-[#FB6A21] text-[#071426] font-bold'
                : 'border-[#FFA726] text-white font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Learners Roster ({totalLearners})
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`py-3 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'pipeline'
              ? isLight
                ? 'border-[#FB6A21] text-[#071426] font-bold'
                : 'border-[#FFA726] text-white font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Relationship Pipeline (V2 Preview)
        </button>
        <button
          onClick={() => setActiveTab('journey')}
          className={`py-3 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'journey'
              ? isLight
                ? 'border-[#FB6A21] text-[#071426] font-bold'
                : 'border-[#FFA726] text-white font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          7-Day Learner Journey (V2 Preview)
        </button>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 px-6 lg:px-10 py-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Registrations */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#111827] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Total Registrations</span>
              <Users className="w-4 h-4 text-[#FFA726]" />
            </div>
            <div
              className="text-3xl font-display font-extrabold tracking-tight mb-1"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {totalLearners}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">+{newToday} new today</span>
              <span>·</span>
              <span>{newThisWeek} this week</span>
            </div>
          </div>

          {/* Card 2: Google Drive Opened Rate */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#111827] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Drive Kit Opened</span>
              <FolderOpen className="w-4 h-4 text-[#FB6A21]" />
            </div>
            <div
              className="text-3xl font-display font-extrabold tracking-tight mb-1"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {driveRate}%
            </div>
            <div className="text-xs text-slate-500">
              {driveAccessedCount} of {totalLearners} accessed starter kit
            </div>
          </div>

          {/* Card 3: WhatsApp Channel Clicked Rate */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#111827] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>WhatsApp Channel Rate</span>
              <MessageCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div
              className="text-3xl font-display font-extrabold tracking-tight mb-1"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {channelRate}%
            </div>
            <div className="text-xs text-slate-500">
              {channelJoinedCount} learners clicked to join channel
            </div>
          </div>

          {/* Card 4: Top Segment */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#111827] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Dominant Goal</span>
              <TrendingUp className="w-4 h-4 text-[#D946EF]" />
            </div>
            <div className="text-lg font-display font-bold truncate mb-1">
              Work Automation
            </div>
            <div className="text-xs text-slate-500 truncate">
              Primary audience: Working Professionals
            </div>
          </div>
        </div>

        {/* ACTIVE TAB: ROSTER */}
        {activeTab === 'roster' && (
          <div
            className={`rounded-2xl border transition-colors ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#111827] border-white/10'
            }`}
          >
            {/* TOOLBAR */}
            <div className="p-5 border-b border-inherit flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, WhatsApp, goal, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border focus:outline-none transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-[#FB6A21]'
                      : 'bg-[#071426] border-white/10 text-white focus:border-[#FFA726]'
                  }`}
                />
              </div>

              {/* Action Buttons: Refresh & CSV Export */}
              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  disabled={isLoading}
                  className={`p-2 rounded-xl border transition-colors ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={() => exportLearnersToCSV(filteredLearners)}
                  className="px-3.5 py-2 rounded-xl text-xs font-display font-semibold text-white bg-gradient-to-r from-[#FFA726] to-[#FB6A21] shadow-xs hover:opacity-95 transition-transform hover:scale-[1.02] flex items-center gap-1.5 whitespace-nowrap"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV ({filteredLearners.length})</span>
                </button>
              </div>
            </div>

            {/* FILTER STRIP */}
            <div
              className={`p-4 border-b border-inherit flex flex-wrap items-center gap-3 text-xs ${
                isLight ? 'bg-slate-50/50' : 'bg-[#0A1222]'
              }`}
            >
              <div className="flex items-center gap-1 text-slate-400 font-medium">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              {/* Profession Filter */}
              <select
                value={filterProfession}
                onChange={(e) => setFilterProfession(e.target.value)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-700'
                    : 'bg-[#111827] border-white/10 text-white'
                }`}
              >
                <option value="all">All Professions</option>
                <option value="Working Professional">Working Professional</option>
                <option value="Business Owner / Founder">Business Owner / Founder</option>
                <option value="Student">Student</option>
                <option value="Freelancer / Consultant">Freelancer / Consultant</option>
                <option value="Creator / Agency">Creator / Agency</option>
              </select>

              {/* Level Filter */}
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-700'
                    : 'bg-[#111827] border-white/10 text-white'
                }`}
              >
                <option value="all">All AI Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-700'
                    : 'bg-[#111827] border-white/10 text-white'
                }`}
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in_followup">In Follow-up</option>
                <option value="starter_kit_accessed">Kit Accessed</option>
                <option value="converted">Converted</option>
                <option value="archived">Archived</option>
              </select>

              {/* Source Filter */}
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-700'
                    : 'bg-[#111827] border-white/10 text-white'
                }`}
              >
                <option value="all">All Sources</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="YouTube">YouTube</option>
                <option value="Direct Website">Direct Website</option>
                <option value="WhatsApp Referral">WhatsApp Referral</option>
              </select>

              {(filterProfession !== 'all' ||
                filterLevel !== 'all' ||
                filterStatus !== 'all' ||
                filterSource !== 'all' ||
                searchQuery !== '') && (
                <button
                  onClick={() => {
                    setFilterProfession('all');
                    setFilterLevel('all');
                    setFilterStatus('all');
                    setFilterSource('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-[#FB6A21] hover:underline font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* LEARNERS TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr
                    className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                      isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'
                    }`}
                  >
                    <th className="py-3.5 px-4 font-semibold">Learner Name</th>
                    <th className="py-3.5 px-4 font-semibold">WhatsApp Number</th>
                    <th className="py-3.5 px-4 font-semibold">Profession</th>
                    <th className="py-3.5 px-4 font-semibold">AI Level</th>
                    <th className="py-3.5 px-4 font-semibold">Learning Goal</th>
                    <th className="py-3.5 px-4 font-semibold">Engagement</th>
                    <th className="py-3.5 px-4 font-semibold">Registered</th>
                    <th className="py-3.5 px-4 font-semibold">Follow-up Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Notes</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
                  {filteredLearners.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                        No learners found matching the search and filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLearners.map((learner) => {
                      // Format clean WhatsApp Link
                      const cleanPhone = learner.whatsapp_number.replace(/\D/g, '');
                      const encodedGreeting = encodeURIComponent(
                        `Hi ${learner.full_name}, this is Uday Kiran from AI Freedom! Hope you're enjoying the free AI Starter Kit. Let me know if you have any questions on automating your workflows.`
                      );
                      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedGreeting}`;

                      return (
                        <tr
                          key={learner.id}
                          className={`transition-colors ${
                            isLight ? 'hover:bg-slate-50/80' : 'hover:bg-white/5'
                          }`}
                        >
                          {/* Name & Source */}
                          <td className="py-3.5 px-4">
                            <div className="font-display font-semibold text-sm">
                              {learner.full_name}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                              via {learner.source}
                            </span>
                          </td>

                          {/* WhatsApp + 1-Click Chat Action */}
                          <td className="py-3.5 px-4 font-mono">
                            <div className="flex items-center gap-2">
                              <span>{learner.whatsapp_number}</span>
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>

                          {/* Profession */}
                          <td className="py-3.5 px-4 text-slate-500">{learner.profession}</td>

                          {/* Knowledge Level */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                                learner.ai_knowledge_level === 'Beginner'
                                  ? 'bg-blue-500/15 text-blue-500'
                                  : learner.ai_knowledge_level === 'Intermediate'
                                  ? 'bg-amber-500/15 text-amber-500'
                                  : 'bg-purple-500/15 text-purple-500'
                              }`}
                            >
                              {learner.ai_knowledge_level}
                            </span>
                          </td>

                          {/* Learning Goal */}
                          <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={learner.learning_goal}>
                            {learner.learning_goal}
                          </td>

                          {/* Engagement Flags */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono">
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  learner.drive_accessed
                                    ? 'bg-emerald-500/15 text-emerald-600 font-bold'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                                title="Google Drive Starter Kit Opened"
                              >
                                Drive {learner.drive_accessed ? '✓' : '—'}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  learner.whatsapp_channel_clicked
                                    ? 'bg-emerald-500/15 text-emerald-600 font-bold'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                                title="WhatsApp Channel Clicked"
                              >
                                Channel {learner.whatsapp_channel_clicked ? '✓' : '—'}
                              </span>
                            </div>
                          </td>

                          {/* Registration Date */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {new Date(learner.created_at).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3.5 px-4">
                            <select
                              value={learner.status}
                              onChange={(e) =>
                                handleStatusChange(learner.id, e.target.value as Learner['status'])
                              }
                              className={`px-2 py-1 rounded text-xs font-mono border focus:outline-none capitalize ${
                                learner.status === 'new'
                                  ? 'bg-blue-500/10 text-blue-600 border-blue-200'
                                  : learner.status === 'contacted'
                                  ? 'bg-amber-500/10 text-amber-600 border-amber-200'
                                  : learner.status === 'in_followup'
                                  ? 'bg-purple-500/10 text-purple-600 border-purple-200'
                                  : learner.status === 'converted'
                                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 font-bold'
                                  : 'bg-slate-100 text-slate-600 border-slate-300'
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="in_followup">In Follow-up</option>
                              <option value="starter_kit_accessed">Kit Accessed</option>
                              <option value="converted">Converted</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>

                          {/* Notes Action */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setEditingLearner(learner);
                                setNoteContent(learner.admin_notes || '');
                              }}
                              className={`p-1.5 rounded-lg border transition-colors inline-flex items-center gap-1 text-[11px] font-mono ${
                                learner.admin_notes
                                  ? 'bg-[#FB6A21]/10 text-[#FB6A21] border-[#FB6A21]/30 font-semibold'
                                  : isLight
                                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-500'
                                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400'
                              }`}
                              title={learner.admin_notes || 'Add private note'}
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{learner.admin_notes ? 'Note' : '+Note'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FUTURE V2 MODULE: RELATIONSHIP PIPELINE */}
        {activeTab === 'pipeline' && (
          <div
            className={`p-8 rounded-2xl border space-y-6 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold">Relationship Pipeline (V2 Ready)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual Kanban progression of registered learners towards webinar and mentorship upgrades.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#FFA726]/10 text-[#FFA726] border border-[#FFA726]/20">
                Architectural Schema Prepared
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { stage: '1. New Lead', count: learners.filter((l) => l.status === 'new').length, color: '#38BDF8' },
                { stage: '2. Starter Kit Engaged', count: learners.filter((l) => l.status === 'starter_kit_accessed').length, color: '#FFA726' },
                { stage: '3. Follow-up In Progress', count: learners.filter((l) => l.status === 'in_followup' || l.status === 'contacted').length, color: '#FB6A21' },
                { stage: '4. Converted / Member', count: learners.filter((l) => l.status === 'converted').length, color: '#10B981' },
              ].map((col, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col justify-between min-h-[160px] ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#071426] border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-bold" style={{ color: col.color }}>
                      {col.stage}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/10">
                      {col.count}
                    </span>
                  </div>
                  <div className="pt-4 text-[11px] text-slate-400">
                    Automated WhatsApp drip sequence triggers upon status transition.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FUTURE V2 MODULE: 7-DAY JOURNEY */}
        {activeTab === 'journey' && (
          <div
            className={`p-8 rounded-2xl border space-y-6 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#111827] border-white/10'
            }`}
          >
            <div>
              <h3 className="text-xl font-display font-bold">7-Day Learner Journey (V2 Blueprint)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated educational WhatsApp prompts delivered across the first week to drive course completion.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { day: 'Day 1', title: 'Welcome + Google Drive Starter Kit Download Link', goal: 'Confirm download & unblock prompts' },
                { day: 'Day 2', title: '5-Minute Video: Automating Meeting Notes with Gemini', goal: 'Deliver fast first win' },
                { day: 'Day 3', title: 'Excel Spreadsheet Cleaning & Analysis Workflow', goal: 'Direct work task automation' },
                { day: 'Day 4', title: 'Invitation to Live WhatsApp Community Q&A', goal: 'Community engagement' },
                { day: 'Day 5', title: 'Deterministic AI Agent Architecture Case Study', goal: 'Advanced capability exposure' },
                { day: 'Day 6', title: 'Live Masterclass Announcement with Uday Kiran', goal: 'Webinar registration' },
                { day: 'Day 7', title: 'KiranForge Masterclass VIP Cohort Enrollment', goal: 'Paid conversion' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#071426] border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#FFA726]">{step.day}</span>
                    <span className="text-xs font-display font-medium">{step.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">{step.goal}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 4. EDIT NOTE MODAL */}
      {editingLearner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl ${
              isLight ? 'bg-white border-slate-300' : 'bg-[#111827] border-white/20'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div>
                <h4 className="font-display font-bold text-base">
                  Learner CRM Note · {editingLearner.full_name}
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  {editingLearner.whatsapp_number}
                </span>
              </div>
              <button
                onClick={() => setEditingLearner(null)}
                className="p-1 rounded-lg hover:bg-black/5"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-medium">Private Admin Notes:</label>
              <textarea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="e.g. Sent Excel automation template. Follow up on Thursday for Masterclass..."
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-[#FB6A21]'
                    : 'bg-[#071426] border-white/10 text-white focus:border-[#FFA726]'
                }`}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingLearner(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="px-4 py-2 rounded-xl text-xs font-display font-semibold text-white bg-gradient-to-r from-[#FFA726] to-[#FB6A21] shadow-xs hover:opacity-90"
              >
                {isSavingNote ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUPABASE & SQL SETUP MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-3xl rounded-2xl bg-[#071426] border border-white/20 text-white p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#FFA726]" />
                <h4 className="font-display font-bold text-base">
                  Supabase Database Schema & Row Level Security (RLS)
                </h4>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <p>
                To connect your live Supabase project, execute this migration in your Supabase project's <strong>SQL Editor</strong>. It creates the <code className="text-[#FFA726]">learners</code> table and configures Row Level Security so only public users can insert, while only authorized admins can read records.
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Then set <code className="text-[#FB6A21]">VITE_SUPABASE_URL</code> and <code className="text-[#FB6A21]">VITE_SUPABASE_ANON_KEY</code> in your environment variables.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-[#050D1A] border border-white/10 font-mono text-[11px]">
              <pre className="text-slate-300 overflow-x-auto leading-relaxed">
                <code>{SUPABASE_SETUP_SQL}</code>
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs font-mono text-emerald-400">
                {isSupabaseConfigured ? 'Supabase Credentials Detected' : 'Currently Running in Resilient Local Mode'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-mono text-white flex items-center gap-1.5"
                >
                  {sqlCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{sqlCopied ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
                </button>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#FFA726] text-black font-semibold text-xs hover:bg-[#FFA726]/90"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
