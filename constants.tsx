
import React from 'react';
import { LayoutDashboard, Kanban, Users, Settings, CreditCard, CheckSquare } from 'lucide-react';
import { ViewType, LeadStage, Column } from './types';

export const COLORS = {
  primary: '#18181B',
  secondary: '#71717A',
  border: '#E5E5E5',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  accent: '#3B82F6',
};

export const NAV_ITEMS = [
  { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pipeline' as ViewType, label: 'Pipeline', icon: Kanban },
  { id: 'leads' as ViewType, label: 'Leads', icon: Users },
  { id: 'tasks' as ViewType, label: 'Tasks', icon: CheckSquare },
  { id: 'settings' as ViewType, label: 'Settings', icon: Settings },
  { id: 'billing' as ViewType, label: 'Billing', icon: CreditCard },
];

export const COLUMNS: Column[] = [
  { id: LeadStage.NEW, title: 'New' },
  { id: LeadStage.CONTACTED, title: 'Contacted' },
  { id: LeadStage.QUALIFIED, title: 'Qualified' },
  { id: LeadStage.PROPOSAL, title: 'Proposal' },
  { id: LeadStage.WON, title: 'Won' },
];

export const MOCK_LEADS = [
  {
    id: '1',
    name: 'Alex Rivera',
    company: 'Indie Dev Studio',
    email: 'alex@indiedev.com',
    value: 12500,
    stage: LeadStage.QUALIFIED,
    tags: ['SaaS'],
    lastActivity: '2h ago',
    avatar: 'https://i.pravatar.cc/150?u=alex'
  },
  {
    id: '2',
    name: 'Sara Chen',
    company: 'Nexus Agencies',
    email: 'sara@nexus.io',
    value: 45000,
    stage: LeadStage.PROPOSAL,
    tags: ['Enterprise'],
    lastActivity: 'Yesterday',
    avatar: 'https://i.pravatar.cc/150?u=sara'
  },
  {
    id: '3',
    name: 'Marcus Thorne',
    company: 'CloudScale',
    email: 'marcus@cloudscale.net',
    value: 8000,
    stage: LeadStage.NEW,
    tags: ['Consulting'],
    lastActivity: '3d ago',
    avatar: 'https://i.pravatar.cc/150?u=marcus'
  },
  {
    id: '4',
    name: 'Elena Gilbert',
    company: 'Vanguard Media',
    email: 'elena@vanguard.com',
    value: 19200,
    stage: LeadStage.CONTACTED,
    tags: ['Content'],
    lastActivity: 'Just now',
    avatar: 'https://i.pravatar.cc/150?u=elena'
  },
  {
    id: '5',
    name: 'Jordan Smith',
    company: 'Peak Flow',
    email: 'jordan@peakflow.com',
    value: 50000,
    stage: LeadStage.WON,
    tags: ['Priority'],
    lastActivity: '5d ago',
    avatar: 'https://i.pravatar.cc/150?u=jordan'
  }
];
