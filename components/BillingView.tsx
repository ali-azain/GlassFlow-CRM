
import React from 'react';
import { Check, Zap, Shield, Sparkles } from 'lucide-react';

const BillingView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">Plans & Billing</h2>
        <p className="text-slate-500 text-lg">Choose a plan that scales with your team's throughput.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: 'Starter',
            price: '0',
            icon: Zap,
            features: ['500 leads', '1 pipeline', 'Basic reports'],
            cta: 'Current Plan',
            popular: false
          },
          {
            name: 'Professional',
            price: '24',
            icon: Sparkles,
            features: ['10k leads', 'Unlimited pipelines', 'Advanced analytics', 'Bulk API access'],
            cta: 'Upgrade to Pro',
            popular: true
          },
          {
            name: 'Enterprise',
            price: '99',
            icon: Shield,
            features: ['Unlimited everything', 'Team collab', 'Custom branding', 'Support manager'],
            cta: 'Contact Sales',
            popular: false
          }
        ].map((tier, i) => (
          <div
            key={i}
            className={`attio-card p-8 flex flex-col relative ${
              tier.popular ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A]' : ''
            }`}
          >
            {tier.popular && (
              <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                Recommended
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
            <div className="flex items-baseline space-x-1 mb-10 border-b border-[#F1F1F1] pb-6">
              <span className="text-3xl font-bold">€{tier.price}</span>
              <span className="text-slate-400 font-medium text-xs">/month</span>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {tier.features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <Check size={14} className="text-emerald-500" strokeWidth={3} />
                  <span className="text-sm font-medium text-slate-600">{feat}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-2.5 rounded-md text-sm font-bold transition-all ${
              tier.popular 
                ? 'bg-[#1A1A1A] text-white hover:bg-slate-800' 
                : 'border border-[#E5E5E5] text-slate-900 hover:bg-slate-50'
            }`}>
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-[#1A1A1A] p-10 rounded-lg flex items-center justify-between text-white shadow-xl">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Need a custom plan?</h3>
          <p className="text-slate-400 text-sm">We provide enterprise-grade SLAs for global agencies.</p>
        </div>
        <button className="px-6 py-2.5 bg-white text-slate-900 rounded-md text-sm font-bold hover:bg-slate-100 transition-colors">
          Talk to Sales
        </button>
      </div>
    </div>
  );
};

export default BillingView;
