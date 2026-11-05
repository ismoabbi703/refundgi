import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, ArrowRightLeft, User, ShieldCheck, CreditCard, Server } from 'lucide-react';
import { DeploymentGuideModal } from './DeploymentGuideModal';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isDarkMode,
    toggleDarkMode,
    setIsSimulatorOpen,
    setIsAuthModalOpen,
    user,
    claims,
    isSubscriptionActive,
  } = useApp();

  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const pendingCount = claims.filter(c => c.status === 'intercepted' || c.status === 'pending_customer_choice').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Brand Wordmark (Single text element, no extra tags) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-base shadow-sm">
              <ArrowRightLeft className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="font-bold text-xl tracking-tight text-neutral-950 dark:text-white whitespace-nowrap">
              refundgo
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (4-5 single-line clean text items) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded ${
              activeTab === 'dashboard'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-neutral-100'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`relative whitespace-nowrap transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded ${
              activeTab === 'claims'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-neutral-100'
            }`}
          >
            Saved Returns
            {pendingCount > 0 && (
              <span className="ml-1.5 font-mono text-xs text-amber-700 dark:text-amber-400 font-bold">
                ({pendingCount})
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('engine')}
            className={`whitespace-nowrap transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded ${
              activeTab === 'engine'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-neutral-100'
            }`}
          >
            Auto-Save Settings
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded ${
              activeTab === 'orders'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-neutral-100'
            }`}
          >
            Automated Exchanges
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`whitespace-nowrap transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded ${
              activeTab === 'settings'
                ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
                : 'text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-neutral-100'
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Zone 3: Primary Action + Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Subscription Status Indicator */}
          {user && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold rounded-lg transition-colors ${
                isSubscriptionActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900 animate-pulse'
              }`}
              title={isSubscriptionActive ? 'Stripe Subscription Active' : 'Subscription Inactive (Workspace Locked)'}
            >
              <CreditCard className="h-3 w-3" />
              <span>{isSubscriptionActive ? `${(user.subscriptionPlan || 'growth').toUpperCase()}` : 'SUBSCRIBE'}</span>
            </button>
          )}

          {/* Deployment & Domains Guide CTA */}
          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
            title="Vercel, Namecheap/Cloudflare DNS, Supabase, and Stripe Guide"
          >
            <Server className="h-3.5 w-3.5 text-emerald-600" />
            <span>Deploy & DNS Guide</span>
          </button>

          {/* Quick Intercept Simulator CTA */}
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            title="Simulate an incoming damaged or missing item return"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>Test a Return</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle color theme"
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Account profile trigger */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Account & Supabase Auth"
          >
            <div className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 text-xs font-medium">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="hidden sm:inline font-medium max-w-[120px] truncate">
              {user ? user.email.split('@')[0] : 'Sign In'}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-200 dark:border-neutral-800 px-2 py-2 text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2 py-1 ${activeTab === 'dashboard' ? 'text-emerald-600 font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-2 py-1 ${activeTab === 'claims' ? 'text-emerald-600 font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
        >
          Returns ({claims.length})
        </button>
        <button
          onClick={() => setActiveTab('engine')}
          className={`px-2 py-1 ${activeTab === 'engine' ? 'text-emerald-600 font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
        >
          Auto-Save
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-2 py-1 ${activeTab === 'orders' ? 'text-emerald-600 font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
        >
          Exchanges
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-2 py-1 ${activeTab === 'settings' ? 'text-emerald-600 font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
        >
          Settings
        </button>
      </div>

      <DeploymentGuideModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </header>
  );
};
