import React, { useMemo, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type AuthMode = 'signin' | 'signup';

type AuthPageProps = {
  onBack: () => void;
};

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return email.trim().length > 3 && password.length >= 6;
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (signUpError) throw signUpError;

        if (!data.session) {
          setNotice('Account created. Check your email to confirm, then sign in.');
          setMode('signin');
        }
      }
    } catch (err: any) {
      setError(err?.message ?? 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#1A1A1A] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md attio-card bg-white p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-1 bg-[#F4F4F5] p-1 rounded-md text-xs font-semibold text-slate-600">
            <button
              onClick={() => setMode('signin')}
              className={`px-3 py-1 rounded ${
                mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`px-3 py-1 rounded ${
                mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Create account
            </button>
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-slate-500">
            {mode === 'signin'
              ? 'Sign in to access your private workspace.'
              : 'Your leads and pipeline will be private to your account.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-md border border-rose-100 bg-rose-50 text-rose-700 text-sm">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-4 px-3 py-2 rounded-md border border-emerald-100 bg-emerald-50 text-emerald-800 text-sm">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FBFBFB] border border-[#E5E5E5] rounded-md px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FBFBFB] border border-[#E5E5E5] rounded-md px-3 py-2 text-sm outline-none focus:border-slate-900"
              placeholder="Minimum 6 characters"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-md bg-[#1A1A1A] text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            <span>{mode === 'signin' ? 'Sign in' : 'Create account'}</span>
          </button>

          <div className="text-[11px] text-slate-500 leading-relaxed">
            By continuing, you agree your data is stored in your Supabase project and protected by Row Level Security.
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;

