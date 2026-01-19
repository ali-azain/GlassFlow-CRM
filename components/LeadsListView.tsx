
import React, { useState } from 'react';
import { Lead } from '../types';
import { Search, Filter, Download, MoreHorizontal, Mail, Trash2, Edit2, ChevronDown, Upload } from 'lucide-react';
import ImportModal from './csv/ImportModal';

import SelectionToolbar from './lists/SelectionToolbar';

interface LeadsListViewProps {
  leads: Lead[];
  onDelete: (id: string) => void;
}

const LeadsListView: React.FC<LeadsListViewProps> = ({ leads, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImportSuccess = () => {
    window.location.reload();
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLeads.size} leads?`)) {
      selectedLeads.forEach(id => onDelete(id));
      setSelectedLeads(new Set());
    }
  };

  const handleSaveList = () => {
    console.log('Save to list', Array.from(selectedLeads));
    alert('Save to list functionality coming soon!');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leads Database</h2>
          <p className="text-slate-500 text-sm mt-1">Filtering through {leads.length} contacts.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-2 bg-blue-600 border border-blue-500 px-3 py-1.5 rounded-md text-xs text-white font-semibold cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Upload size={14} />
            <span>Import CSV</span>
          </button>
          <div className="flex items-center space-x-2 bg-white border border-[#E5E5E5] px-3 py-1.5 rounded-md text-xs text-slate-500 font-semibold cursor-pointer hover:bg-slate-50">
            <Filter size={14} />
            <span>Filters</span>
          </div>
          <div className="flex items-center space-x-2 bg-white border border-[#E5E5E5] px-3 py-1.5 rounded-md text-xs text-slate-500 font-semibold cursor-pointer hover:bg-slate-50">
            <Download size={14} />
            <span>Export</span>
          </div>
        </div>
      </div>

      <div className="attio-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-400">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search database..."
              className="bg-transparent border-none outline-none text-sm text-slate-900 w-64 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <button className="flex items-center space-x-1 hover:text-slate-900">
              <span>Sort: Name</span>
              <ChevronDown size={10} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-[#71717A] border-b border-[#E5E5E5] bg-slate-50/50">
                <th className="px-4 py-3 font-semibold w-10">
                  <input
                    type="checkbox"
                    checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-6 py-3 font-semibold">Company</th>
                <th className="px-6 py-3 font-semibold">Stage</th>
                <th className="px-6 py-3 font-semibold">Value</th>
                <th className="px-6 py-3 font-semibold">Last Activity</th>
                <th className="px-8 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F1F1]">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className={`group transition-colors ${selectedLeads.has(lead.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.has(lead.id)}
                      onChange={() => toggleSelectRow(lead.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={lead.avatar} className="w-8 h-8 rounded-full border border-[#E5E5E5]" alt="" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{lead.name}</span>
                        <span className="text-xs text-slate-500">{lead.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{lead.company}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xxs font-bold border border-[#E5E5E5] bg-white text-slate-600 uppercase tracking-wider">
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">€{lead.value.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-medium">{lead.lastActivity}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-1.5 hover:bg-white rounded border border-transparent hover:border-[#E5E5E5] text-slate-400 hover:text-slate-900">
                        <Mail size={14} />
                      </button>
                      <button className="p-1.5 hover:bg-white rounded border border-transparent hover:border-[#E5E5E5] text-slate-400 hover:text-slate-900">
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-1.5 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SelectionToolbar
        selectedCount={selectedLeads.size}
        onClearSelection={() => setSelectedLeads(new Set())}
        onDelete={handleBulkDelete}
        onSaveList={handleSaveList}
      />

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onSuccess={handleImportSuccess}
        />
      )}
    </div>
  );
};

export default LeadsListView;
