
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus, Tag, DollarSign, Calendar } from 'lucide-react';
import { Lead, LeadStage } from '../types';
import { COLUMNS } from '../constants';

interface PipelineViewProps {
  leads: Lead[];
  onUpdateStage: (leadId: string, newStage: LeadStage) => void;
}

const PipelineView: React.FC<PipelineViewProps> = ({ leads, onUpdateStage }) => {
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId);
  };

  const handleDragEnd = (leadId: string, newStage: LeadStage) => {
    onUpdateStage(leadId, newStage);
    setDraggedLead(null);
  };

  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pipeline</h2>
          <p className="text-slate-500 text-sm">Visualizing {leads.length} active opportunities.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 border border-[#E5E5E5] rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Share</button>
          <button className="px-3 py-1.5 border border-[#E5E5E5] rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Automations</button>
        </div>
      </div>

      <div className="flex-1 flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
        {COLUMNS.map((column) => {
          const columnLeads = leads.filter(l => l.stage === column.id);
          const totalValue = columnLeads.reduce((acc, l) => acc + l.value, 0);

          return (
            <div 
              key={column.id} 
              className="flex-shrink-0 w-[280px] flex flex-col space-y-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => draggedLead && handleDragEnd(draggedLead, column.id)}
            >
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">{column.title}</h3>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {columnLeads.length}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">€{(totalValue/1000).toFixed(1)}k</span>
              </div>

              <div className={`flex-1 min-h-[500px] bg-[#F4F4F5]/30 rounded-lg p-2 border border-transparent transition-all ${
                draggedLead ? 'border-dashed border-[#D4D4D4] bg-[#F4F4F5]/50' : ''
              }`}>
                <div className="space-y-3">
                  <AnimatePresence>
                    {columnLeads.map((lead) => (
                      <motion.div
                        layout
                        key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead.id)}
                        className="attio-card p-4 cursor-grab active:cursor-grabbing group shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-3">
                           <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{lead.company}</span>
                              <span className="text-[11px] text-slate-500 font-medium">{lead.name}</span>
                           </div>
                           <button className="text-slate-300 hover:text-slate-600 transition-colors">
                              <MoreHorizontal size={14} />
                           </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6 pt-3 border-t border-[#F1F1F1]">
                           <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-[11px]">
                             <DollarSign size={10} strokeWidth={3} />
                             <span>{(lead.value/1000).toFixed(1)}k</span>
                           </div>
                           <div className="flex items-center space-x-1 text-slate-400">
                             <Calendar size={10} />
                             <span className="text-[10px] font-medium">{lead.lastActivity}</span>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {columnLeads.length === 0 && (
                    <div className="h-20 flex flex-col items-center justify-center border border-dashed border-[#E5E5E5] rounded-md opacity-50">
                      <Plus size={14} className="text-slate-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineView;
