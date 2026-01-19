import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Plus, Bell, ChevronDown, Command, LogOut, Loader2 } from 'lucide-react';
import { Lead, LeadStage, ViewType } from '../types';
import { NAV_ITEMS } from '../constants';
import DashboardView from '../components/DashboardView';
import PipelineView from '../components/PipelineView';
import LeadsListView from '../components/LeadsListView';
import SettingsView from '../components/SettingsView';
import BillingView from '../components/BillingView';
import TasksView from '../components/TasksView';
import { supabase } from '@/lib/supabaseClient';

type CrmAppProps = {
  onSignOut: () => void | Promise<void>;
};

type DbLeadRow = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  value: number;
  stage: LeadStage;
  tags: string[];
  notes: string | null;
  avatar_url: string | null;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
};

function formatRelativeTime(isoString: string): string {
  const t = new Date(isoString).getTime();
  if (!Number.isFinite(t)) return '';
  const diffMs = Date.now() - t;
  if (diffMs < 60_000) return 'Just now';
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`;
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)}h ago`;
  return `${Math.floor(diffMs / 86_400_000)}d ago`;
}

function rowToLead(row: DbLeadRow): Lead {
  const avatar =
    row.avatar_url ||
    `https://i.pravatar.cc/150?u=${encodeURIComponent(row.email || row.id)}`;

  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone ?? undefined,
    value: Number(row.value ?? 0),
    stage: row.stage,
    tags: row.tags ?? [],
    lastActivity: formatRelativeTime(row.last_activity_at || row.updated_at || row.created_at),
    avatar,
  };
}

const CrmApp: React.FC<CrmAppProps> = ({ onSignOut }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(true);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadValue, setNewLeadValue] = useState<string>('0');
  const [creatingLead, setCreatingLead] = useState(false);

  const canCreateLead = useMemo(() => {
    return newLeadName.trim().length > 0 && newLeadCompany.trim().length > 0 && newLeadEmail.trim().length > 3;
  }, [newLeadCompany, newLeadEmail, newLeadName]);

  const loadLeads = async () => {
    if (!supabase) return;
    setLoadingLeads(true);
    setLeadsError(null);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('last_activity_at', { ascending: false });
    if (error) {
      setLeadsError(error.message);
      setLoadingLeads(false);
      return;
    }
    setLeads((data as DbLeadRow[]).map(rowToLead));
    setLoadingLeads(false);
  };

  useEffect(() => {
    if (!supabase) return;
    void loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLeadStage = async (leadId: string, newStage: LeadStage) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage: newStage, lastActivity: 'Just now' } : l)));
    if (!supabase) return;
    const { error } = await supabase
      .from('leads')
      .update({ stage: newStage, last_activity_at: new Date().toISOString() })
      .eq('id', leadId);
    if (error) {
      setLeadsError(error.message);
      void loadLeads();
    }
  };

  const deleteLead = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (!supabase) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) {
      setLeadsError(error.message);
      void loadLeads();
    }
  };

  const createLead = async () => {
    if (!supabase) return;
    setCreatingLead(true);
    setLeadsError(null);
    try {
      const valueNumber = Number(newLeadValue || 0);
      const payload = {
        name: newLeadName.trim(),
        company: newLeadCompany.trim(),
        email: newLeadEmail.trim(),
        value: Number.isFinite(valueNumber) ? valueNumber : 0,
        stage: LeadStage.NEW,
        tags: [],
        last_activity_at: new Date().toISOString(),
        avatar_url: `https://i.pravatar.cc/150?u=${encodeURIComponent(newLeadEmail.trim())}`,
      };

      const { data, error } = await supabase.from('leads').insert(payload).select('*').single();
      if (error) throw error;

      setLeads((prev) => [rowToLead(data as DbLeadRow), ...prev]);
      setIsNewLeadModalOpen(false);
      setNewLeadName('');
      setNewLeadCompany('');
      setNewLeadEmail('');
      setNewLeadValue('0');
    } catch (err: any) {
      setLeadsError(err?.message ?? 'Failed to create lead.');
    } finally {
      setCreatingLead(false);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView leads={leads} />;
      case 'pipeline':
        return <PipelineView leads={leads} onUpdateStage={updateLeadStage} />;
      case 'leads':
        return <LeadsListView leads={leads} onDelete={deleteLead} />;
      case 'tasks':
        return <TasksView />;
      case 'settings':
        return <SettingsView />;
      case 'billing':
        return <BillingView />;
      default:
        return <DashboardView leads={leads} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden text-[#1A1A1A] bg-[#FBFBFB]">
      {/* Minimal Sidebar */}
      <nav className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col p-4 z-50">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#1A1A1A] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">G</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">GlassFlow CRM</span>
          </div>
          <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="flex-1 space-y-0.5">
          <div className="mb-6">
            <button className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 font-medium uppercase tracking-wider">
              Main
            </button>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 group ${activeView === item.id
                  ? 'bg-[#F4F4F5] text-[#1A1A1A]'
                  : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#1A1A1A]'
                  }`}
              >
                <item.icon size={16} strokeWidth={activeView === item.id ? 2 : 1.5} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <button className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 font-medium uppercase tracking-wider">
              Collections
            </button>
            <button className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#1A1A1A]">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-sm font-medium">Engineering</span>
            </button>
            <button className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#1A1A1A]">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium">Design Ops</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E5E5]">
          <div className="flex items-center justify-between space-x-3 px-2 py-2 hover:bg-[#F4F4F5] rounded-md transition-colors">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://i.pravatar.cc/100?u=me" alt="" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">Alex Rivera</span>
                <span className="text-[11px] text-slate-500 truncate">Free Plan</span>
              </div>
            </div>
            <button
              onClick={onSignOut}
              title="Sign out"
              className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded border border-transparent hover:border-[#E5E5E5]"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-14 flex items-center justify-between px-8 border-b border-[#E5E5E5] bg-white z-40">
          <div className="flex items-center space-x-2 text-slate-400 group">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-slate-400 text-slate-900"
            />
            <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded border border-[#E5E5E5] bg-[#F9F9F9] text-[10px] font-bold">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-[#F4F4F5] rounded transition-all">
              <Bell size={18} />
            </button>
            <button
              onClick={() => setIsNewLeadModalOpen(true)}
              className="flex items-center space-x-2 bg-[#1A1A1A] hover:bg-slate-800 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all"
            >
              <Plus size={16} />
              <span>Add New</span>
            </button>
          </div>
        </header>

        {/* View Section */}
        <div className="flex-1 overflow-y-auto relative p-8 md:p-12">
          {leadsError && (
            <div className="mb-6 max-w-7xl mx-auto">
              <div className="px-4 py-3 rounded-md border border-rose-100 bg-rose-50 text-rose-700 text-sm flex items-center justify-between">
                <span>{leadsError}</span>
                <button
                  onClick={() => void loadLeads()}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {loadingLeads ? (
            <div className="h-[50vh] flex items-center justify-center">
              <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
                <Loader2 size={16} className="animate-spin" />
                <span>Loading your leads…</span>
              </div>
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full max-w-7xl mx-auto"
            >
              {!loadingLeads ? renderView() : <div />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Minimal New Lead Modal */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-black/5 backdrop-blur-[2px]">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-lg bg-white p-8 rounded-lg shadow-2xl border border-[#E5E5E5]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">New Entry</h2>
              <button
                onClick={() => setIsNewLeadModalOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Contact Name</label>
                <input
                  type="text"
                  className="w-full bg-[#FBFBFB] border border-[#E5E5E5] rounded-md px-3 py-2 text-sm outline-none focus:border-slate-900"
                  placeholder="e.g. John Doe"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Company</label>
                <input
                  type="text"
                  className="w-full bg-[#FBFBFB] border border-[#E5E5E5] rounded-md px-3 py-2 text-sm outline-none focus:border-slate-900"
                  placeholder="e.g. Acme Corp"
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Email</label>
                <input
                  type="email"
                  className="w-full bg-[#FBFBFB] border border-[#E5E5E5] rounded-md px-3 py-2 text-sm outline-none focus:border-slate-900"
                  placeholder="e.g. john@acme.com"
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Value (€)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full bg-[#FBFBFB] border border-[#E5E5E5] rounded-md px-3 py-2 text-sm outline-none focus:border-slate-900"
                  placeholder="e.g. 12000"
                  value={newLeadValue}
                  onChange={(e) => setNewLeadValue(e.target.value)}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="flex-1 py-2 border border-[#E5E5E5] rounded-md text-sm font-medium hover:bg-[#FBFBFB]"
                >
                  Discard
                </button>
                <button
                  onClick={createLead}
                  disabled={!canCreateLead || creatingLead}
                  className="flex-1 inline-flex items-center justify-center space-x-2 py-2 bg-[#1A1A1A] text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {creatingLead ? <Loader2 size={16} className="animate-spin" /> : null}
                  <span>Save Entry</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CrmApp;

