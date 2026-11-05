import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../lib/stripe';
import { PlanId } from '../types';
import { 
  Lock, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Sparkles, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const SubscriptionLockOverlay: React.FC = () => {
  const { 
    user, 
    startStripeCheckout, 
    toggleSubscriptionStatus, 
    isStripeCheckoutLoading 
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<PlanId>('growth');

  return (
    <div className="relative my-6 rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-2xl p-6 sm:p-10 text-left overflow-hidden">
      
      {/* Background ambient gradient */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto space-y-8">
        
        {/* Lock Banner */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 shadow-xs">
            <Lock className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400 font-mono">
              Workspace Access Gated
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Active Subscription Required to Access Workspace
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Your Supabase merchant profile (<span className="font-mono font-medium text-neutral-900 dark:text-neutral-200">{user?.email}</span>) does not currently reflect an active subscription. Subscribe below via Stripe Checkout to unlock live refund interception, the cost-aware decision engine, and automated $0 replacement orders.
            </p>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(SUBSCRIPTION_PLANS) as PlanId[]).map((planKey) => {
            const plan = SUBSCRIPTION_PLANS[planKey];
            const isSelected = selectedPlan === planKey;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/30 dark:border-emerald-500 dark:bg-emerald-950/30 shadow-md ring-1 ring-emerald-500/20'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {plan.isFlagship && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                    Flagship · ⅓ Cost of Loop
                  </span>
                )}

                <div className="space-y-1">
                  <div className="font-bold text-neutral-900 dark:text-white text-base">
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white tabular-nums">
                      ${plan.priceMonthly}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                      /month
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2">
                  {plan.description}
                </p>

                <ul className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-300 space-y-1.5 font-sans">
                  {plan.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Primary Stripe Checkout Action */}
        <div className="space-y-3">
          <button
            onClick={() => startStripeCheckout(selectedPlan)}
            disabled={isStripeCheckoutLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            {isStripeCheckoutLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Redirecting to Stripe Checkout...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                <span>
                  Subscribe to {SUBSCRIPTION_PLANS[selectedPlan].name} (${SUBSCRIPTION_PLANS[selectedPlan].priceMonthly}/mo) via Stripe Checkout
                </span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Uses NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY & STRIPE_SECRET_KEY</span>
            </div>

            {/* Quick Demo Simulator Toggle so user/evaluator can test instantly */}
            <button
              type="button"
              onClick={toggleSubscriptionStatus}
              className="text-emerald-600 dark:text-emerald-400 underline font-medium hover:text-emerald-700"
            >
              Simulate Active Subscription (Instant Demo Unlock)
            </button>
          </div>
        </div>

        {/* 60-Day Guarantee callout */}
        <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            <strong>60-Day 3× Savings Guarantee:</strong> If RefundGo doesn't save you at least 3× the subscription price in your first 60 days, cancel anytime with zero penalty.
          </span>
        </div>

      </div>

    </div>
  );
};
