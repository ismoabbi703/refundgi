import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Mail, Store, MessageSquare, ShieldCheck, Check } from 'lucide-react';

export const InquiryModal: React.FC = () => {
  const { isInquiryModalOpen, setIsInquiryModalOpen, submitInquiry, settings, setActiveTab, setLegalTab } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [storeUrl, setStoreUrl] = useState(settings.shopifyDomain || '');
  const [monthlyVolume, setMonthlyVolume] = useState('100-500 claims/mo');
  const [message, setMessage] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isInquiryModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!consentGiven) {
      setError('Please review and check the data processing consent checkbox to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        name,
        email,
        storeUrl,
        monthlyVolume,
        message,
        consentGiven,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLegalDocument = (tab: 'terms' | 'privacy') => {
    setIsInquiryModalOpen(false);
    setLegalTab(tab);
    setActiveTab('legal');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col text-left">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 id="inquiry-modal-title" className="text-lg font-bold text-neutral-900 dark:text-white">
                Contact Margin Specialist
              </h2>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Get custom onboarding assistance, Gorgias webhook setup, or high-volume enterprise pricing
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsInquiryModalOpen(false)}
            aria-label="Close inquiry modal"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="inq-name" className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Your Name
              </label>
              <input
                id="inq-name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="inq-email" className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Work Email
              </label>
              <input
                id="inq-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="merchant@brand.com"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="inq-store" className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Shopify Store Domain
              </label>
              <input
                id="inq-store"
                type="text"
                required
                value={storeUrl}
                onChange={e => setStoreUrl(e.target.value)}
                placeholder="yourstore.myshopify.com"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="inq-vol" className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Monthly Return Claims
              </label>
              <select
                id="inq-vol"
                value={monthlyVolume}
                onChange={e => setMonthlyVolume(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value="under-100">Under 100 returns/mo ($19 Starter)</option>
                <option value="100-500">100–500 returns/mo ($49 Growth)</option>
                <option value="500-2000">500–2,000 returns/mo ($99 Plus)</option>
                <option value="enterprise">2,000+ returns/mo (Custom / High-Volume)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="inq-msg" className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
              How Can We Help Your Brand?
            </label>
            <textarea
              id="inq-msg"
              rows={3}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell us about your current return volume, whether you use Gorgias/Zendesk, or if you need custom ERP COGS integration..."
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
          </div>

          {/* Mandatory Data Processing Consent Checkbox */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-neutral-600 dark:text-neutral-400">
              <input
                type="checkbox"
                required
                checked={consentGiven}
                onChange={e => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4 shrink-0"
              />
              <span className="leading-snug">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => openLegalDocument('terms')}
                  className="text-emerald-600 dark:text-emerald-400 underline font-medium hover:text-emerald-700"
                >
                  Terms of Service
                </button>{' '}
                and consent to the processing of my store details in accordance with the{' '}
                <button
                  type="button"
                  onClick={() => openLegalDocument('privacy')}
                  className="text-emerald-600 dark:text-emerald-400 underline font-medium hover:text-emerald-700"
                >
                  Privacy Policy
                </button>
                .
              </span>
            </label>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <span>{isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
