import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRightLeft, Sparkles, ShieldCheck } from 'lucide-react';

export const MobileStickyCTA: React.FC = () => {
  const { setIsSimulatorOpen, setIsOnboardingOpen, activeTab } = useApp();

  // Hide on legal and thank you tabs to prevent clutter
  if (activeTab === 'legal' || activeTab === 'thank_you') {
    return null;
  }

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 px-4 py-2.5 shadow-lg transition-colors"
      style={{ height: '54px' }}
      role="region"
      aria-label="Mobile quick actions"
    >
      <div className="flex items-center justify-between gap-3 h-full max-w-lg mx-auto">
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold text-neutral-900 dark:text-white flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            RefundGo Active
          </span>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
            Save up to 86% per return
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSimulatorOpen(true)}
            className="h-9 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 whitespace-nowrap"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Test a Return</span>
          </button>
        </div>
      </div>
    </div>
  );
};
