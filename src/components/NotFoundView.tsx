import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ArrowLeft, ArrowRightLeft, Search } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="py-12 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[65vh] text-center max-w-xl mx-auto">
      
      {/* 404 Branded Visual */}
      <div className="relative mb-6">
        <div className="h-44 w-44 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-md mx-auto flex items-center justify-center">
          <img
            src="/src/assets/images/not_found_lost_package_1793879312858.jpg"
            alt="Cardboard shipping box with floating compass symbolizing a lost return package"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Resilient fallback container if image asset fails to load
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-mono text-xs font-bold shadow-md">
          404 ERROR
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Return Route Not Found
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
          The claim ledger or page you are looking for has either been resolved, archived, or moved to a different workspace route.
        </p>
      </div>

      {/* Suggested Quick Destinations */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Home className="h-4 w-4" />
          <span>Back to Dashboard Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('claims')}
          className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <span>View Saved Returns</span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
        Need assistance with a specific customer order? <button onClick={() => setActiveTab('claims')} className="text-emerald-600 dark:text-emerald-400 underline font-medium">Search the claims ledger</button>
      </div>

    </div>
  );
};
