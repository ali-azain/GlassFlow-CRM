
import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Moon, ChevronRight, Camera } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const SETTINGS_SECTIONS = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'language', label: 'Localization', icon: Globe },
  ];

  return (
    <div className="flex gap-16 h-full">
      <div className="w-56 space-y-1">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Preferences</h2>
        {SETTINGS_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md transition-all duration-200 ${
              activeTab === section.id 
                ? 'bg-[#F4F4F5] text-[#1A1A1A] font-bold shadow-sm' 
                : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#1A1A1A]'
            }`}
          >
            <section.icon size={16} strokeWidth={activeTab === section.id ? 2.5 : 1.5} />
            <span className="text-sm">{section.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 max-w-3xl">
        <div className="attio-card p-10 space-y-12">
          <section className="space-y-8">
            <h3 className="text-lg font-bold">Profile Details</h3>
            
            <div className="flex items-center space-x-8">
              <div className="relative group cursor-pointer">
                <div className="w-20 h-20 rounded-lg bg-slate-100 border border-[#E5E5E5] flex items-center justify-center overflow-hidden">
                   <img src="https://i.pravatar.cc/200?u=alex" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                   <Camera size={20} className="text-white" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">Alex Rivera</p>
                <p className="text-xs text-slate-500 font-medium">Head of Sales • Independent</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-2 cursor-pointer hover:underline">Change avatar</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Public Name</label>
                <input type="text" defaultValue="Alex Rivera" className="w-full bg-[#FBFBFB] border border-[#E5E5E5] rounded-md px-3 py-2 text-sm font-medium outline-none focus:border-slate-900" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</label>
                <input type="email" defaultValue="alex@glassflow.dev" className="w-full bg-[#FBFBFB] border border-[#E5E5E5] rounded-md px-3 py-2 text-sm font-medium outline-none focus:border-slate-900" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Summary</label>
                <textarea rows={3} className="w-full bg-[#FBFBFB] border border-[#E5E5E5] rounded-md px-3 py-2 text-sm font-medium outline-none focus:border-slate-900 resize-none" placeholder="Add a short bio..."></textarea>
              </div>
            </div>
          </section>

          <section className="pt-10 border-t border-[#F1F1F1] space-y-6">
             <h3 className="text-lg font-bold">Preferences</h3>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-[#E5E5E5] rounded-md">
                   <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-white border border-[#E5E5E5] rounded shadow-sm">
                        <Moon size={14} className="text-slate-600" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-900">Dark Interface</p>
                         <p className="text-[10px] text-slate-500 font-medium">Toggle between light and dark themes.</p>
                      </div>
                   </div>
                   <div className="w-10 h-5 bg-[#E5E5E5] rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
                   </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-[#E5E5E5] rounded-md">
                   <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-white border border-[#E5E5E5] rounded shadow-sm">
                        <Globe size={14} className="text-slate-600" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-900">Primary Language</p>
                         <p className="text-[10px] text-slate-500 font-medium">Choose your default system language.</p>
                      </div>
                   </div>
                   <div className="flex items-center space-x-1 text-xxs font-bold text-slate-400 uppercase tracking-widest">
                      <span>English</span>
                      <ChevronRight size={12} />
                   </div>
                </div>
             </div>
          </section>

          <div className="flex justify-end pt-4">
             <button className="px-6 py-2 bg-[#1A1A1A] text-white rounded-md text-sm font-bold hover:bg-slate-800 transition-all shadow-md">
                Save Changes
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
