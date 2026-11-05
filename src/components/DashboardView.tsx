import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  ArrowRightLeft, 
  PackageCheck, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  DollarSign
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    savingsSummary,
    claims,
    rules,
    updateRules,
    approveAndSendOffer,
    applyAutoPilotDefaults,
    setActiveTab,
    setSelectedClaim,
    setCustomerPromptClaim,
    setIsSimulatorOpen,
    setIsOnboardingOpen,
    settings,
  } = useApp();

  const recentIntercepts = claims.slice(0, 5);
  const pendingApprovalClaims = claims.filter(c => c.status === 'pending_approval');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'converted_replacement':
        return <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Replacement Chosen</span>;
      case 'pending_approval':
        return <span className="text-amber-700 dark:text-amber-400 font-semibold">Needs Your Approval</span>;
      case 'pending_customer_choice':
        return <span className="text-sky-700 dark:text-sky-400 font-medium">Customer Reviewing Offer</span>;
      case 'intercepted':
        return <span className="text-sky-700 dark:text-sky-400 font-medium">Reviewing Savings</span>;
      case 'kept_partial_credit':
        return <span className="text-indigo-700 dark:text-indigo-400 font-medium">Kept + Store Credit</span>;
      case 'refunded':
        return <span className="text-neutral-600 dark:text-neutral-400">Refund Processed</span>;
      default:
        return <span className="text-neutral-500">Excluded (Policy)</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1-Click Auto-Pilot & Quick Integration Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span>Connected Store: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{settings.shopifyDomain}</strong></span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                Auto-Save Active
              </span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              RefundGo automatically monitors returns and asks customers if they'd like a free replacement
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={applyAutoPilotDefaults}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 shadow-xs"
            title="Pre-fill industry defaults ($80 Retail, 25% COGS, $6.00 Reship) in one click"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>1-Click Auto-Pilot</span>
          </button>
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            Test a Return
          </button>
        </div>
      </div>

      {/* Merchant Controls: Safety Net & Auto-Acknowledge */}
      <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Merchant Peace-of-Mind Controls</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Stay in full control of how and when customers receive replacement offers
            </p>
          </div>

          <div className="text-xs text-neutral-400">
            {rules.requireManualApproval ? 'Safety Net Active (Manual Review)' : 'Auto-Pilot Active (Instant Prompts)'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs">
          {/* Safety Net Toggle */}
          <label className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={rules.requireManualApproval}
              onChange={(e) => updateRules({ requireManualApproval: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 shrink-0"
            />
            <div className="space-y-0.5">
              <div className="font-semibold text-neutral-900 dark:text-white">
                Safety Net: Require manual approval before emailing customers a replacement offer
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Refunds are paused and held on your dashboard so you can approve them with 1 click before anything is sent.
              </p>
            </div>
          </label>

          {/* Auto-Acknowledge Toggle */}
          <label className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={rules.autoAcknowledgeEnabled}
              onChange={(e) => updateRules({ autoAcknowledgeEnabled: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 shrink-0"
            />
            <div className="space-y-0.5">
              <div className="font-semibold text-neutral-900 dark:text-white">
                Auto-Acknowledge: Reassure customers immediately
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Sends a friendly email: <em>"We received your report and our team is reviewing it to get you a quick resolution!"</em> so shoppers never feel ignored.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Safety Net: Pending Approval Claims Banner (if any) */}
      {pendingApprovalClaims.length > 0 && (
        <div className="p-5 rounded-xl border-2 border-amber-500/50 dark:border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="font-bold text-sm text-neutral-900 dark:text-white">
                Safety Net Hold: {pendingApprovalClaims.length} Return Waiting For Your Approval
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900 px-2 py-0.5 rounded-full">
              Auto-Acknowledge Sent
            </span>
          </div>

          <div className="space-y-2">
            {pendingApprovalClaims.map((claim) => (
              <div 
                key={claim.id} 
                className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">
                    {claim.originalOrderId} · {claim.customerName}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Reported item: <span className="font-medium text-neutral-800 dark:text-neutral-200">{claim.itemTitle}</span> (${claim.itemPrice.toFixed(2)})
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    Potential Savings: +${claim.costBreakdown?.netSavingsIfReplacement.toFixed(2)} vs full refund loss
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => approveAndSendOffer(claim.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    Approve & Send Replacement Offer
                  </button>
                  <button
                    onClick={() => setSelectedClaim(claim)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The Hero Undeniable Savings Card with Clear Above-the-Fold CTAs */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/90 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-50/60 via-white to-neutral-50 dark:from-emerald-950/30 dark:via-neutral-900 dark:to-neutral-950 p-6 sm:p-8 shadow-xs text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-emerald-800 dark:text-emerald-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 font-semibold">
                <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                Live Shopify Return Intercept
              </span>
              <span aria-hidden="true" className="text-neutral-400">·</span>
              <span className="text-neutral-600 dark:text-neutral-400 font-normal">This Month</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white tabular-nums leading-tight">
              You saved ${savingsSummary.totalSavedMonth.toLocaleString()} this month
            </h1>
            
            <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 max-w-xl font-normal leading-relaxed">
              <span className="font-semibold text-neutral-950 dark:text-white font-mono tabular-nums">
                {savingsSummary.claimsConvertedCount}
              </span> costly refunds converted into high-margin replacements at the moment of customer choice.
            </p>

            {/* Above-the-Fold High-Contrast Conversion CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSimulatorOpen(true)}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 cursor-pointer"
              >
                <ArrowRightLeft className="h-4 w-4 stroke-[2.5]" />
                <span>Test Live Return Intercept</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 dark:bg-white dark:hover:bg-neutral-100 dark:active:bg-neutral-200 text-white dark:text-neutral-950 text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <span>1-Click Auto-Pilot Setup</span>
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                {savingsSummary.roiMultiple}x Return on Investment
              </span>
              <span aria-hidden="true">·</span>
              <span>🛡️ 60-Day 3× Savings Guarantee</span>
              <span aria-hidden="true">·</span>
              <span className="italic">"We ask before you refund — and do the math for you."</span>
            </div>
          </div>

          {/* High-Fidelity UI Interface Preview Image */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-lg bg-white dark:bg-neutral-900 group">
              <img
                src="/src/assets/images/hero_refund_conversion_preview_1793879314012.jpg"
                alt="RefundGo automated return interception interface preview showing net savings"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">Avg Net Saved / Claim:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  +${savingsSummary.avgSavedPerReplacement.toFixed(2)} kept in bank
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Quantitative Rigor Metric Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">Conversion Rate</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-mono tabular-nums">
            {savingsSummary.conversionRate}%
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {savingsSummary.claimsConvertedCount} replacements / {savingsSummary.totalInterceptedCount} intercepted
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">$0 Draft Orders</span>
            <PackageCheck className="h-4 w-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-mono tabular-nums">
            {claims.filter(c => c.draftOrderNumber).length}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Auto-pushed to 3PL fulfillment
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">Keep-Item Savings</span>
            <DollarSign className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-mono tabular-nums">
            ${(savingsSummary.totalKeptCount * 10.70).toFixed(0)}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Zero reverse shipping paid on cheap items
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">Chargeback Defense</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-mono tabular-nums">
            100%
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Full digital resolution trails logged
          </div>
        </div>

      </div>

      {/* Mechanism-to-Outcome Visual Flow */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              The RefundGo Mechanism: Where the Money Goes
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Compare an un-intercepted standard refund vs. RefundGo cost-aware replacement
            </p>
          </div>
          <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Based on average $88.00 retail apparel item
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Default Path */}
          <div className="p-5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Default Store Flow (Loss)
              </span>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">-$97.10</span>
            </div>
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Customer submits "Item Damaged" → Store automatically refunds
            </div>
            <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 font-mono">
              <li className="flex justify-between">
                <span>Customer cash refunded:</span>
                <span className="text-rose-600">-$88.00</span>
              </li>
              <li className="flex justify-between">
                <span>Outbound shipping lost:</span>
                <span className="text-rose-600">-$6.25</span>
              </li>
              <li className="flex justify-between">
                <span>Payment processing fee lost:</span>
                <span className="text-rose-600">-$2.85</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300 font-medium">
              Result: You lose $97.10 cash, zero customer retention, lost lifetime value.
            </div>
          </div>

          {/* RefundGo Path */}
          <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                RefundGo Intercept Flow (Kept Revenue)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">+$72.80 Net Saved</span>
            </div>
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Refund paused → 2-Tap Prompt sent → Free Replacement chosen
            </div>
            <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 font-mono">
              <li className="flex justify-between">
                <span>Original $88.00 sale:</span>
                <span className="text-emerald-600">+$88.00 kept in bank</span>
              </li>
              <li className="flex justify-between">
                <span>Product replacement COGS:</span>
                <span className="text-neutral-700 dark:text-neutral-300">-$18.50</span>
              </li>
              <li className="flex justify-between">
                <span>Ground reship label:</span>
                <span className="text-neutral-700 dark:text-neutral-300">-$5.80</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              Result: You keep the $88 sale at cost of $24.30. Customer gets a pristine new item expedited!
            </div>
          </div>
        </div>
      </div>

      {/* Active Intercept Queue Preview */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Live Intercept Queue
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Damaged/missing item claims currently intercepted or resolved
            </p>
          </div>
          <button
            onClick={() => setActiveTab('claims')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Ledger ({claims.length} claims)</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
              <tr>
                <th className="py-3 px-4 font-semibold">Order / Source</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Reported Item</th>
                <th className="py-3 px-4 font-semibold text-right">Potential Savings</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {recentIntercepts.map(claim => (
                <tr 
                  key={claim.id} 
                  className="hover:bg-neutral-50/75 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedClaim(claim)}
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{claim.originalOrderId}</span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans">
                        · {claim.source}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">{claim.customerName}</div>
                    <div className="text-[11px] text-neutral-400">{claim.customerEmail}</div>
                  </td>

                  <td className="py-3.5 px-4 max-w-[260px] truncate">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">{claim.itemTitle}</div>
                    <div className="text-[11px] text-neutral-400 font-mono">${claim.itemPrice.toFixed(2)}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap tabular-nums">
                    {claim.costBreakdown ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        +${claim.costBreakdown.netSavingsIfReplacement.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-neutral-400">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(claim.status)}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setCustomerPromptClaim(claim)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 transition-colors inline-flex items-center gap-1"
                        title="Open customer 2-tap magic prompt preview"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>2-Tap Prompt</span>
                      </button>

                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        title="View details"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
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
