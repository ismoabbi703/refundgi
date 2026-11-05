import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { signInUser, signUpUser, signOutUser, isSupabaseConnected } from '../lib/supabase';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Store, 
  Check, 
  ArrowRight, 
  LogOut, 
  Database,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, setUser, settings, setActiveTab, setLegalTab } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState(settings.storeName);
  const [consentChecked, setConsentChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signup' && !consentChecked) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signInUser(email, password);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setUser(res.user);
          onClose();
        }
      } else {
        const res = await signUpUser(email, password, storeName);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setUser(res.user);
          onClose();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('alex@auraliving.co');
    setPassword('secret123');
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col text-left">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {user ? 'Merchant Account' : mode === 'signin' ? 'Sign In to RefundGo' : 'Create Merchant Account'}
              </h2>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {isSupabaseConnected() ? 'Supabase Backend Connected' : 'Supabase Auth & Session'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {user ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <div className="text-neutral-500">Currently signed in as:</div>
                <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{user.email}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-300">Store: {user.storeName}</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  Role: Owner · Row-Level Security Enabled
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Sign in / Sign up form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                    Store Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={e => setStoreName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                      placeholder="Aura Home & Apparel"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
                    placeholder="merchant@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-neutral-600 dark:text-neutral-400">
                    <input
                      type="checkbox"
                      required
                      checked={consentChecked}
                      onChange={e => setConsentChecked(e.target.checked)}
                      className="mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 shrink-0"
                    />
                    <span className="leading-snug">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          setLegalTab('terms');
                          setActiveTab('legal');
                        }}
                        className="text-emerald-600 dark:text-emerald-400 underline font-medium hover:text-emerald-700"
                      >
                        Terms of Service
                      </button>{' '}
                      and consent to data processing under the{' '}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          setLegalTab('privacy');
                          setActiveTab('legal');
                        }}
                        className="text-emerald-600 dark:text-emerald-400 underline font-medium hover:text-emerald-700"
                      >
                        Privacy Policy
                      </button>
                      .
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span>{isLoading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-between pt-2 text-[11px]">
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  Quick-fill demo account
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                  }}
                  className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
