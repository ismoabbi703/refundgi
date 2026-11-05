import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Database, 
  CreditCard, 
  GitBranch, 
  Check, 
  Copy, 
  ExternalLink,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'vercel' | 'domain' | 'supabase' | 'stripe'>('vercel');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden max-h-[92vh] flex flex-col text-left">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Production Deployment & Domain Guide
              </h2>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Vercel Free Tier · Namecheap/Cloudflare DNS · Supabase Free Cloud · Stripe Recurring Subscriptions
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

        {/* Tab Strip */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 px-6 gap-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'vercel'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <GitBranch className="h-4 w-4" />
            <span>1. Vercel Import (Free Tier)</span>
          </button>

          <button
            onClick={() => setActiveTab('domain')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'domain'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>2. Custom Domain & DNS</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'supabase'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>3. Supabase Cloud Database</span>
          </button>

          <button
            onClick={() => setActiveTab('stripe')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'stripe'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>4. Stripe Recurring Product</span>
          </button>
        </div>

        {/* Content Viewport */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: VERCEL */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Step 1: Import GitHub Repository into Vercel
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                RefundGo is fully optimized for Vercel's zero-config deployment. Follow these steps:
              </p>

              <ol className="space-y-3 list-decimal list-inside text-neutral-700 dark:text-neutral-300">
                <li>
                  Push your repository to GitHub (<code className="font-mono bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">git push origin main</code>).
                </li>
                <li>
                  Log in to your <strong>Vercel Dashboard</strong> (free hobby tier) and click <strong>"Add New... → Project"</strong>.
                </li>
                <li>
                  Select your GitHub repository from the import list.
                </li>
                <li>
                  Framework Preset: <strong>Vite</strong> or <strong>Other</strong> (Build Command: <code className="font-mono">npm run build</code>, Output Directory: <code className="font-mono">dist</code>).
                </li>
                <li>
                  In <strong>Environment Variables</strong>, configure:
                  <div className="p-3 my-2 rounded-lg bg-neutral-900 text-neutral-100 font-mono text-[11px] space-y-1">
                    <div>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...</div>
                    <div>VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...</div>
                    <div>STRIPE_SECRET_KEY=sk_live_...</div>
                    <div>VITE_SUPABASE_URL=https://xyz.supabase.co</div>
                    <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
                  </div>
                </li>
                <li>Click <strong>Deploy</strong>. Your applet goes live in seconds.</li>
              </ol>
            </div>
          )}

          {/* TAB 2: DOMAIN */}
          {activeTab === 'domain' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Step 2: Connect .com / .io Domain via Namecheap or Cloudflare
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Once you purchase your domain (e.g. <code className="font-mono font-semibold">refundgo.io</code> or <code className="font-mono font-semibold">refundgo.com</code>), configure the DNS records:
              </p>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-3">
                <div className="font-bold text-neutral-900 dark:text-white">
                  Vercel DNS Records Table
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] font-mono text-left">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700 text-neutral-500">
                        <th className="py-1.5 px-2">Type</th>
                        <th className="py-1.5 px-2">Name / Host</th>
                        <th className="py-1.5 px-2">Value / Target</th>
                        <th className="py-1.5 px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700 text-neutral-800 dark:text-neutral-200">
                      <tr>
                        <td className="py-2 px-2 font-bold text-emerald-600">A</td>
                        <td className="py-2 px-2">@</td>
                        <td className="py-2 px-2">76.76.21.21</td>
                        <td className="py-2 px-2">
                          <button
                            onClick={() => copyText('a_record', '76.76.21.21')}
                            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                          >
                            {copiedKey === 'a_record' ? 'Copied' : 'Copy'}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-bold text-sky-600">CNAME</td>
                        <td className="py-2 px-2">www</td>
                        <td className="py-2 px-2">cname.vercel-dns.com</td>
                        <td className="py-2 px-2">
                          <button
                            onClick={() => copyText('cname_record', 'cname.vercel-dns.com')}
                            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                          >
                            {copiedKey === 'cname_record' ? 'Copied' : 'Copy'}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-neutral-500">
                  In Namecheap: Go to <em>Advanced DNS</em> → Add New Record. In Cloudflare: Set Proxy status to <em>DNS only (gray cloud)</em> during SSL validation.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUPABASE */}
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Step 3: Supabase Free Cloud Tier Setup
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                RefundGo uses Supabase for email/password authentication, persistent claims storage, and PostgreSQL Row-Level Security:
              </p>

              <ol className="space-y-2.5 list-decimal list-inside text-neutral-700 dark:text-neutral-300">
                <li>Create a free account at <strong>supabase.com</strong> and create a new project.</li>
                <li>Go to <strong>Project Settings → API</strong> to copy your <strong>Project URL</strong> and <strong>anon public API key</strong>.</li>
                <li>Go to <strong>SQL Editor</strong>, open a new query, and paste the schema bundled in <code className="font-mono">/src/lib/supabase_schema.sql</code>.</li>
                <li>Run the query to create all tables and RLS security policies.</li>
              </ol>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-[11px]">
                ✓ Row-Level Security automatically isolates merchants so users can only ever access their own claims and store data.
              </div>
            </div>
          )}

          {/* TAB 4: STRIPE */}
          {activeTab === 'stripe' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Step 4: Create Recurring Subscription Products in Stripe
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Configure your Stripe recurring billing products matching the persona pricing model:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-white">Starter Product</div>
                  <div className="font-mono text-emerald-600 font-bold">$19.00 / month</div>
                  <div className="text-[11px] text-neutral-500">Recurring billing · Up to 100 prompts</div>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-white">Growth (Flagship)</div>
                  <div className="font-mono text-emerald-600 font-bold">$49.00 / month</div>
                  <div className="text-[11px] text-neutral-500">Recurring billing · Unlimited prompts</div>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-white">Plus Product</div>
                  <div className="font-mono text-emerald-600 font-bold">$99.00 / month</div>
                  <div className="text-[11px] text-neutral-500">Recurring billing · Multi-store</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="font-semibold text-neutral-900 dark:text-white">
                  Stripe Webhook Endpoint Setup:
                </div>
                <div className="p-2.5 rounded bg-neutral-900 text-neutral-100 font-mono text-[11px]">
                  https://yourdomain.com/api/stripe/webhook
                </div>
                <p className="text-[11px] text-neutral-500">
                  Select events: <code className="font-mono">checkout.session.completed</code>, <code className="font-mono">customer.subscription.updated</code>, <code className="font-mono">invoice.payment_succeeded</code>.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
          <div className="text-[11px] text-neutral-500 font-mono">
            Environment: <strong className="text-neutral-800 dark:text-neutral-200">React + Vite + Express + Supabase + Stripe</strong>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
