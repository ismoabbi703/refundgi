import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ShieldCheck, ArrowRight, Store, Sparkles, Layers } from 'lucide-react';

export const ThankYouView: React.FC = () => {
  const { thankYouData, setActiveTab, settings, rules, setThankYouData } = useApp();

  const handleReturn = () => {
    const target = thankYouData?.actionTab || 'dashboard';
    setThankYouData(null);
    setActiveTab(target);
  };

  const title = thankYouData?.title || 'Onboarding Complete! Your Store Is Protected';
  const subtitle = thankYouData?.subtitle || 'Shopify Refund Interception Is Now Live';
  const message = thankYouData?.message || `RefundGo is actively monitoring return requests on ${settings.shopifyDomain || 'your store'}. When a customer reports a damaged or missing item, our decision engine will evaluate unit economics and offer a free replacement to protect your profit margins.`;
  const actionText = thankYouData?.actionText || 'Go to Dashboard Overview';
  const referenceId = thankYouData?.referenceId || `RG-${Date.now().toString().slice(-6)}`;

  return (
    <div className="py-12 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[65vh] text-center max-w-xl mx-auto animate-in fade-in duration-200">
      
      {/* Success Badge */}
      <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-sm">
        <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {subtitle}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto leading-relaxed pt-1">
          {message}
        </p>
      </div>

      {/* Confirmation Details Card */}
      <div className="w-full mt-6 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs text-left text-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-neutral-500 font-medium">Confirmation Reference:</span>
          <span className="font-mono font-bold text-neutral-900 dark:text-white">{referenceId}</span>
        </div>

        <div className="space-y-2 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Connected Store:</span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200">{settings.shopifyDomain}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Decision Engine:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              Auto-Pilot Active (COGS {rules.defaultCogsPercent}%, Reship ${rules.avgReshipCost.toFixed(2)})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Safety Net Approval:</span>
            <span className="text-neutral-800 dark:text-neutral-200">
              {rules.requireManualApproval ? 'Enabled (Manual Review Before Send)' : 'Instant 2-Tap Prompts'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Protection Guarantee:</span>
            <span className="text-neutral-800 dark:text-neutral-200">
              🛡️ 60-Day 3× Savings Guarantee Active
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleReturn}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <span>{actionText}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
