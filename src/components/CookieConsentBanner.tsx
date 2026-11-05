import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Cookie, X } from 'lucide-react';
import { CookieConsentState } from '../types';

const STORAGE_KEY_COOKIE = 'refundgo_cookie_consent_v1';

export const CookieConsentBanner: React.FC = () => {
  const { setActiveTab, setLegalTab } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COOKIE);
      if (!stored) {
        // Small delay so it smoothly appears
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const handleAcceptAll = () => {
    const consent: CookieConsentState = {
      accepted: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY_COOKIE, JSON.stringify(consent));
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    const consent: CookieConsentState = {
      accepted: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY_COOKIE, JSON.stringify(consent));
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  const handleLearnMore = () => {
    setLegalTab('privacy');
    setActiveTab('legal');
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl text-left space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400">
              <Cookie className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-neutral-900 dark:text-white">
              Cookie & Data Privacy Notice
            </span>
          </div>

          <button
            onClick={handleEssentialOnly}
            aria-label="Dismiss cookie notice with essential cookies only"
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          We use strictly necessary cookies to ensure secure merchant authentication and evaluate unit economics. Optional analytics cookies help us optimize refund conversion rates.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <button
            type="button"
            onClick={handleLearnMore}
            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
          >
            Privacy Policy
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEssentialOnly}
              className="px-2.5 py-1.5 text-[11px] font-medium rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
