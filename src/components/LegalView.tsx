import React from 'react';
import { useApp } from '../context/AppContext';
import { LegalTab } from '../types';
import { ShieldCheck, FileText, ArrowLeft, Lock, RefreshCw, Printer } from 'lucide-react';

export const LegalView: React.FC = () => {
  const { legalTab, setLegalTab, setActiveTab } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8 pb-16 max-w-4xl mx-auto text-left space-y-6">
      
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Trust, Legal & Compliance
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Clear, transparent policies for merchants and shoppers
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 self-start sm:self-auto transition-colors"
          title="Print or save as PDF"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print Document</span>
        </button>
      </div>

      {/* Segmented Control for the 3 Legal Documents */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setLegalTab('terms')}
          className={`flex-1 min-w-[130px] py-2 px-3 font-semibold rounded-lg text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            legalTab === 'terms'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Terms of Service
        </button>

        <button
          type="button"
          onClick={() => setLegalTab('privacy')}
          className={`flex-1 min-w-[130px] py-2 px-3 font-semibold rounded-lg text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            legalTab === 'privacy'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Privacy Policy (GDPR / CCPA)
        </button>

        <button
          type="button"
          onClick={() => setLegalTab('refunds')}
          className={`flex-1 min-w-[130px] py-2 px-3 font-semibold rounded-lg text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            legalTab === 'refunds'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Refund Policy & 60-Day Guarantee
        </button>
      </div>

      {/* Content Container */}
      <article className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-6 leading-relaxed">
        
        {/* Document 1: TERMS OF SERVICE */}
        {legalTab === 'terms' && (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                Effective Date: November 5, 2026 · Version 2.4
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                RefundGo Terms of Service
              </h2>
            </div>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                1. Acceptance of Terms
              </h3>
              <p>
                By connecting your Shopify, Gorgias, or Zendesk accounts to the RefundGo platform ("Service"), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company, you represent that you have the authority to bind such entity.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                2. Automated Interception & Decision Engine
              </h3>
              <p>
                RefundGo provides automated software tools to intercept refund webhooks and present replacement options to buyers via tokenized magic links. The merchant maintains full discretion over math thresholds (COGS %, reship allowances, and keep-item cutoffs) and may activate the Safety Net feature at any time to require manual approval before prompts are transmitted.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                3. Subscriptions, Fees & Billing
              </h3>
              <p>
                RefundGo is billed on a month-to-month recurring basis ($19/mo Starter, $49/mo Growth, or $99/mo Plus) processed via Stripe. There are no annual lock-in contracts. You may cancel your subscription at any time within your Account Settings with immediate effect at the end of the billing period.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                4. Chargeback Defense & Audit Trails
              </h3>
              <p>
                RefundGo records customer resolution timestamps, IP addresses, and digital acceptance signatures for dispute evidence dossiers. While RefundGo supplies auditable evidence for credit card dispute representations, RefundGo does not guarantee bank dispute outcomes.
              </p>
            </section>
          </div>
        )}

        {/* Document 2: PRIVACY POLICY */}
        {legalTab === 'privacy' && (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                GDPR Article 13 & CCPA Compliant · Last Updated: November 2026
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                RefundGo Privacy & Data Protection Policy
              </h2>
            </div>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                1. Data Controller vs. Data Processor
              </h3>
              <p>
                For merchant account credentials and billing records, RefundGo acts as a Data Controller. When processing customer order information (names, shipping addresses, emails) transmitted via Shopify webhooks, RefundGo acts strictly as a Data Processor under your instructions.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                2. Database Architecture & Row-Level Security (RLS)
              </h3>
              <p>
                Every merchant's data in RefundGo is strictly isolated at the PostgreSQL database level using Supabase Authentication UUIDs (<code className="font-mono text-emerald-600 font-semibold">auth.uid() = user_id</code>). Cross-tenant access is physically impossible under our database security rules.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                3. Zero Sale of Personal Data
              </h3>
              <p>
                RefundGo does not sell, broker, or monetize merchant data or consumer claims. Data is exclusively utilized to execute replacement decisions, generate $0 fulfillment orders, and compile chargeback defense logs.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                4. Data Subject Rights & Deletion Requests (Right to Erasure)
              </h3>
              <p>
                Under GDPR Article 17 and CCPA, merchants and consumers retain full rights to request access to or permanent erasure of their records. You may trigger a complete cryptographic deletion at any time via the "Request Data Deletion" control in your Store Settings panel.
              </p>
            </section>
          </div>
        )}

        {/* Document 3: REFUND POLICY & 60-DAY GUARANTEE */}
        {legalTab === 'refunds' && (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                Unconditional Merchant Protection Guarantee
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                RefundGo Subscription Refund Policy & 60-Day 3× Guarantee
              </h2>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>The 60-Day 3× Savings Guarantee</span>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300">
                If RefundGo does not save your store at least <strong>3 times</strong> your subscription fee within the first 60 days of active connection, you are entitled to a 100% full refund of all subscription payments made—no questions asked.
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                1. How the Guarantee Works
              </h3>
              <p>
                Because converting even a single $80 refund into a $25 replacement saves ~$55 (more than an entire month of our flagship $49 Growth plan), RefundGo delivers positive ROI for virtually every merchant within days. If our dashboard does not show verified net savings exceeding 3× your subscription cost in your first 60 days, simply contact support or trigger a cancellation request for an immediate refund.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                2. Subscription Cancellations
              </h3>
              <p>
                All plans operate on flat, month-to-month terms. You may cancel with one click in your Billing settings at any time without cancellation fees, lock-ins, or phone calls.
              </p>
            </section>
          </div>
        )}

      </article>

    </div>
  );
};
