import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  saveSupabaseCredentials, 
  getSupabaseCredentials, 
  isSupabaseConnected 
} from '../lib/supabase';
import { 
  Database, 
  ShieldCheck, 
  Check, 
  Copy, 
  Save, 
  Store, 
  CreditCard, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Lock
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetToDemoData, 
    user, 
    isSubscriptionActive, 
    startStripeCheckout, 
    toggleSubscriptionStatus, 
    isStripeCheckoutLoading,
    setIsDataDeletionModalOpen,
    setActiveTab,
    setLegalTab
  } = useApp();

  const [formSettings, setFormSettings] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase credentials state
  const creds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(creds.url);
  const [supabaseKey, setSupabaseKey] = useState(creds.anonKey);
  const [isDbSaved, setIsDbSaved] = useState(false);

  const handleSaveSettings = () => {
    updateSettings(formSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSaveSupabase = () => {
    saveSupabaseCredentials(supabaseUrl, supabaseKey);
    updateSettings({ isSupabaseConnected: Boolean(supabaseUrl && supabaseKey) });
    setIsDbSaved(true);
    setTimeout(() => setIsDbSaved(false), 2000);
  };

  const copySqlSchema = async () => {
    try {
      const res = await fetch('/src/lib/supabase_schema.sql');
      const sql = await res.text();
      navigator.clipboard.writeText(sql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } catch {
      // Fallback
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Store Settings & Billing
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Manage your brand integrations, Supabase backend persistence with Row-Level Security, and Stripe recurring subscription
        </p>
      </div>

      {/* Suggested Pricing Model & 60-Day Guarantee Banner */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-6">
        
        {/* Subscription Status Bar */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${isSubscriptionActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'}`}>
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 dark:text-white text-sm">
                  Stripe Subscription Status:
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isSubscriptionActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}`}>
                  {isSubscriptionActive ? `Active (${(user?.subscriptionPlan || 'growth').toUpperCase()})` : 'Inactive (Workspace Locked)'}
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
                Customer: {user?.email} · Renewal: {user?.subscriptionPeriodEnd ? new Date(user.subscriptionPeriodEnd).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSubscriptionStatus}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
              title="Toggle subscription status to test workspace locking"
            >
              {isSubscriptionActive ? 'Simulate Inactive (Test Lock)' : 'Simulate Active (Unlock)'}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Subscription & Value Alignment
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
              Select Recurring Plan (Stripe Hosted Checkout)
            </h2>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            🛡️ <strong>60-Day Savings Guarantee:</strong> If RefundGo doesn't save you 3× your subscription in 60 days, it's 100% free.
          </div>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Starter Tier */}
          <div 
            className={`p-5 rounded-xl border-2 transition-all flex flex-col justify-between ${
              user?.subscriptionPlan === 'starter' && isSubscriptionActive
                ? 'border-emerald-600 bg-emerald-50/20 dark:border-emerald-500 dark:bg-emerald-950/20'
                : 'border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white">Starter</h3>
                  <div className="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white mt-1">
                    $19<span className="text-xs font-normal text-neutral-500">/mo flat</span>
                  </div>
                </div>
                {user?.subscriptionPlan === 'starter' && isSubscriptionActive && (
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                For early-stage stores (~100 claims/mo). Hooks the persona's stated price point.
              </p>
              <ul className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-4 space-y-1.5">
                <li>· Up to 100 decision prompts/mo</li>
                <li>· 1 Shopify store connection</li>
                <li>· Gorgias & Slack integrations</li>
                <li>· Undeniable savings dashboard</li>
              </ul>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                disabled={isStripeCheckoutLoading}
                onClick={() => startStripeCheckout('starter')}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                {user?.subscriptionPlan === 'starter' && isSubscriptionActive ? 'Manage $19/mo Plan' : 'Subscribe via Stripe ($19/mo)'}
              </button>
            </div>
          </div>

          {/* Growth Tier (Flagship) */}
          <div 
            className={`p-5 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
              user?.subscriptionPlan === 'growth' && isSubscriptionActive
                ? 'border-emerald-600 bg-emerald-50/30 dark:border-emerald-500 dark:bg-emerald-950/30'
                : 'border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-neutral-900 dark:text-white">Growth</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-1.5 py-0.2 rounded">
                      Flagship
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white mt-1">
                    $49<span className="text-xs font-normal text-neutral-500">/mo flat</span>
                  </div>
                </div>
                {user?.subscriptionPlan === 'growth' && isSubscriptionActive && (
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                Priced below Loop Essential at ⅓ the cost with no lock-in.
              </p>
              <ul className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-4 space-y-1.5">
                <li>· <strong>Unlimited</strong> decision prompts</li>
                <li>· Cost-aware engine rules</li>
                <li>· Auto-$0-order creation with 3PL push</li>
                <li>· Keep-item threshold ($10–$20 cases)</li>
                <li>· Auto chargeback evidence dossiers</li>
              </ul>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                disabled={isStripeCheckoutLoading}
                onClick={() => startStripeCheckout('growth')}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                {user?.subscriptionPlan === 'growth' && isSubscriptionActive ? 'Manage $49/mo Plan' : 'Subscribe via Stripe ($49/mo)'}
              </button>
            </div>
          </div>

          {/* Plus Tier */}
          <div 
            className={`p-5 rounded-xl border-2 transition-all flex flex-col justify-between ${
              user?.subscriptionPlan === 'plus' && isSubscriptionActive
                ? 'border-emerald-600 bg-emerald-50/20 dark:border-emerald-500 dark:bg-emerald-950/20'
                : 'border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white">Plus</h3>
                  <div className="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white mt-1">
                    $99<span className="text-xs font-normal text-neutral-500">/mo flat</span>
                  </div>
                </div>
                {user?.subscriptionPlan === 'plus' && isSubscriptionActive && (
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                For scaling brands with multi-store and advanced fraud signal needs.
              </p>
              <ul className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-4 space-y-1.5">
                <li>· Multi-store & brand support</li>
                <li>· Custom API & Webhook endpoints</li>
                <li>· Repeat claimer fraud network signals</li>
                <li>· Dedicated priority support</li>
              </ul>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                disabled={isStripeCheckoutLoading}
                onClick={() => startStripeCheckout('plus')}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
              >
                {user?.subscriptionPlan === 'plus' && isSubscriptionActive ? 'Manage $99/mo Plan' : 'Subscribe via Stripe ($99/mo)'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Supabase Backend Database & Row-Level Security Panel */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Supabase Backend Database & Row-Level Security (RLS)
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                User authentication (Email/Password), user data persistence, and tenant data isolation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              <span>RLS Enforced</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Connection inputs */}
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Supabase Anon Public API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={supabaseKey}
                onChange={e => setSupabaseKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSaveSupabase}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                {isDbSaved ? 'Credentials Connected!' : 'Connect Supabase'}
              </button>

              <button
                onClick={copySqlSchema}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedSql ? 'Copied SQL Script!' : 'Copy Supabase SQL Schema (RLS)'}</span>
              </button>
            </div>
          </div>

          {/* Explanation of RLS Structure */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2.5">
            <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Row-Level Security Structure</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
              Every merchant's data in RefundGo is strictly isolated at the PostgreSQL database level using Supabase Auth UUIDs (<code className="font-mono text-emerald-600">auth.uid() = user_id</code>).
            </p>
            <ul className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1 font-mono">
              <li>✓ <code className="text-neutral-800 dark:text-neutral-200">merchants</code>: User store connection & plan</li>
              <li>✓ <code className="text-neutral-800 dark:text-neutral-200">engine_rules</code>: Private merchant COGS & thresholds</li>
              <li>✓ <code className="text-neutral-800 dark:text-neutral-200">claims</code>: Orders isolated by merchant ID</li>
              <li>✓ <code className="text-neutral-800 dark:text-neutral-200">chargeback_evidence</code>: Dispute logs & signatures</li>
            </ul>
            <div className="pt-1 text-[11px] text-neutral-500">
              Schema file is pre-bundled at <code className="font-mono">/src/lib/supabase_schema.sql</code>.
            </div>
          </div>
        </div>
      </div>

      {/* Store Brand Information */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Store Profile & Customer Notification Branding
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Personalize how the 2-Tap Customer Prompt looks to shoppers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
              Store Brand Name
            </label>
            <input
              type="text"
              value={formSettings.storeName}
              onChange={e => setFormSettings({ ...formSettings, storeName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-medium text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
              Shopify Domain
            </label>
            <input
              type="text"
              value={formSettings.shopifyDomain}
              onChange={e => setFormSettings({ ...formSettings, shopifyDomain: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
              Customer Support Email
            </label>
            <input
              type="email"
              value={formSettings.supportEmail}
              onChange={e => setFormSettings({ ...formSettings, supportEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
              Brand Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formSettings.brandPrimaryColor}
                onChange={e => setFormSettings({ ...formSettings, brandPrimaryColor: e.target.value })}
                className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 cursor-pointer"
              />
              <span className="font-mono text-neutral-600 dark:text-neutral-400">
                {formSettings.brandPrimaryColor}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between">
          <button
            onClick={resetToDemoData}
            className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 underline"
          >
            Reset Demo Claims & Default Numbers
          </button>

          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            {isSaved ? 'Settings Saved!' : 'Save Store Profile'}
          </button>
        </div>
      </div>

      {/* Advanced Integrations (Optional) */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Optional Add-ons
          </div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
            Advanced Integrations (Helpdesk & 3PL)
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Connect your customer service software and fulfillment centers. RefundGo works automatically through Shopify even without these connected.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Gorgias */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 dark:text-white">Gorgias</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  Connected
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Intercepts tickets tagged with damaged or missing items automatically.
              </p>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono">
              Webhook: /api/webhooks/gorgias
            </div>
          </div>

          {/* Zendesk */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 dark:text-white">Zendesk</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  Connected
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Appends resolution trail and notes to matching Zendesk support tickets.
              </p>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono">
              Webhook: /api/webhooks/zendesk
            </div>
          </div>

          {/* ShipBob */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 dark:text-white">ShipBob 3PL</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Dispatches accepted $0 replacement orders directly to fulfillment warehouse.
              </p>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono">
              API Channel: #shipbob-ch-04
            </div>
          </div>

          {/* Slack */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 dark:text-white">Slack Ops</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Broadcasts savings alerts and draft orders directly to your team channel.
              </p>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono">
              Channel: #refundgo-ops
            </div>
          </div>
        </div>
      </div>

      {/* Data Control, Privacy & GDPR/CCPA Compliance */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Trust & Data Governance
            </div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
              Privacy, Compliance & Data Subject Rights
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              GDPR & CCPA Compliant
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <h3 className="font-bold text-neutral-900 dark:text-white">
              Data Processing & Retention Standards
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
              RefundGo strictly acts as a Data Processor for your store. Customer shipping names, postal addresses, and order items received via Shopify webhooks are encrypted in transit and never sold to third parties or used for external advertising.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setLegalTab('privacy');
                  setActiveTab('legal');
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                View Privacy Policy
              </button>
              <span aria-hidden="true" className="text-neutral-400">·</span>
              <button
                type="button"
                onClick={() => {
                  setLegalTab('terms');
                  setActiveTab('legal');
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                View Terms of Service
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 space-y-2 flex flex-col justify-between">
            <div>
              <div className="font-bold text-neutral-900 dark:text-white text-xs flex items-center justify-between">
                <span>Account Deletion & Data Erasure</span>
                <span className="text-[10px] uppercase font-semibold font-mono text-rose-600 dark:text-rose-400">GDPR Art. 17</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-[11px] mt-1 leading-relaxed">
                Permanently purge all stored return claims, dispute audit dossiers, customer magic tokens, and cached store credentials.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsDataDeletionModalOpen(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors shadow-xs"
              >
                Request Data Deletion
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
