
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import CrmApp from '@/crm/CrmApp';
import AuthPage from '@/screens/AuthPage';
import LandingPage from '@/screens/LandingPage';

type PublicView = 'landing' | 'auth';

const App: React.FC = () => {
  const { isSupabaseConfigured, loading, user, signOut } = useAuth();
  const [publicView, setPublicView] = useState<PublicView>('landing');

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] text-[#1A1A1A] flex items-center justify-center px-6 py-16">
        <div className="attio-card bg-white p-8 w-full max-w-xl">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Supabase is not configured</h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Create a <code className="font-mono text-[12px]">.env.local</code> file with:
            <br />
            <code className="font-mono text-[12px]">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-mono text-[12px]">VITE_SUPABASE_ANON_KEY</code>.
            <br />
            (See <code className="font-mono text-[12px]">env.example</code>.)
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium">
          <Loader2 size={16} className="animate-spin" />
          <span>Loading workspace…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    if (publicView === 'auth') {
      return <AuthPage onBack={() => setPublicView('landing')} />;
    }
    return <LandingPage onGetStarted={() => setPublicView('auth')} onSignIn={() => setPublicView('auth')} />;
  }

  return <CrmApp onSignOut={signOut} />;
};

export default App;
