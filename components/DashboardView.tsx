
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lead } from '../types';
import { ArrowUpRight, ArrowDownRight, Users, Briefcase, Activity, Target } from 'lucide-react';

const data = [
  { name: 'Jan', value: 4000, expenses: 2400 },
  { name: 'Feb', value: 3000, expenses: 1398 },
  { name: 'Mar', value: 2000, expenses: 9800 },
  { name: 'Apr', value: 2780, expenses: 3908 },
  { name: 'May', value: 1890, expenses: 4800 },
  { name: 'Jun', value: 2390, expenses: 3800 },
  { name: 'Jul', value: 3490, expenses: 4300 },
];

interface DashboardViewProps {
  leads: Lead[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ leads }) => {
  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
         <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[#71717A] text-sm">
               <span>Workspace</span>
               <span>/</span>
               <span>Overview</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">House Spectrum Ltd</h2>
         </div>
         <div className="flex space-x-3 text-sm text-slate-500 mb-1">
            <span className="flex items-center space-x-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
               <span>Sales 5.3/10</span>
            </span>
            <span className="flex items-center space-x-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
               <span>Profit 2.4/10</span>
            </span>
            <span className="flex items-center space-x-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
               <span>Customer 7.8/10</span>
            </span>
         </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: leads.length, change: '+12.5%', isPositive: true, icon: Users },
          { label: 'Active Deals', value: '24', change: '+2.1%', isPositive: true, icon: Briefcase },
          { label: 'Win Rate', value: '64%', change: '-0.4%', isPositive: false, icon: Target },
          { label: 'Lead Activity', value: '142', change: '+18.2%', isPositive: true, icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="attio-card p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded border border-[#E5E5E5]">
                 <stat.icon size={16} className="text-slate-600" />
              </div>
              <div className={`flex items-center space-x-0.5 text-xs font-semibold ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-0.5">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Chart Card */}
      <div className="attio-card p-8">
        <div className="flex justify-between items-center mb-10">
           <div>
              <h3 className="text-lg font-semibold text-slate-900">Consolidated budget</h3>
              <p className="text-sm text-slate-500">Revenue vs Expenditures trend analysis</p>
           </div>
           <div className="flex bg-[#F4F4F5] p-1 rounded-md text-[11px] font-semibold text-[#71717A]">
              {['D', 'M', 'Y', 'All'].map(t => (
                <button key={t} className={`px-3 py-1 rounded ${t === 'All' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}>{t}</button>
              ))}
           </div>
        </div>
        <div className="h-72 w-full">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F1" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A1A1AA', fontSize: 11}} dy={10} />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E5E5', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Preview */}
      <div className="attio-card overflow-hidden">
         <div className="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-semibold">Recent Deal Flow</h3>
            <button className="text-xs text-blue-600 font-medium hover:underline">View all deals</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-[#71717A] border-b border-[#E5E5E5]">
                     <th className="px-6 py-3 font-semibold">ID</th>
                     <th className="px-6 py-3 font-semibold">Deals</th>
                     <th className="px-6 py-3 font-semibold">Contact</th>
                     <th className="px-6 py-3 font-semibold">Value</th>
                     <th className="px-6 py-3 font-semibold">Source</th>
                  </tr>
               </thead>
               <tbody className="text-sm text-[#1A1A1A]">
                  {leads.slice(0, 4).map((lead, i) => (
                    <tr key={lead.id} className="border-b border-[#F1F1F1] hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 text-slate-400 font-mono text-xs">0{i+1}</td>
                       <td className="px-6 py-4 font-medium">{lead.company}</td>
                       <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                             <img src={lead.avatar} className="w-5 h-5 rounded-full" alt="" />
                             <span>{lead.name}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-slate-600 font-medium">€{lead.value.toLocaleString()}</td>
                       <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xxs font-bold text-slate-600">
                             {lead.tags[0] || 'Direct'}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default DashboardView;
