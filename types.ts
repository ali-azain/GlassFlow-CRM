
export enum LeadStage {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  WON = 'Won',
  LOST = 'Lost'
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  value: number;
  stage: LeadStage;
  tags: string[];
  lastActivity: string;
  avatar?: string;
}

export interface Column {
  id: LeadStage;
  title: string;
}

export type ViewType = 'dashboard' | 'pipeline' | 'leads' | 'settings' | 'billing';
