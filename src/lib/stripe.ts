import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js';
import { PlanId } from '../types';

let stripePromise: Promise<StripeClient | null> | null = null;

export const SUBSCRIPTION_PLANS: Record<PlanId, {
  id: PlanId;
  name: string;
  priceMonthly: number;
  description: string;
  features: string[];
  isFlagship?: boolean;
}> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 19,
    description: 'Up to 100 decision prompts/mo, 1 store, Gorgias/Slack sync, savings dashboard.',
    features: [
      'Up to 100 decision prompts/mo',
      '1 connected Shopify store',
      'Gorgias & Zendesk webhook listener',
      'Slack channel internal notes',
      'Undeniable savings dashboard',
    ],
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    priceMonthly: 49,
    isFlagship: true,
    description: 'Unlimited prompts, cost-aware engine rules, auto-$0-order 3PL push, keep-item threshold.',
    features: [
      'Unlimited decision prompts/mo',
      'Cost-aware margin engine & rules',
      'Auto-$0 draft orders with 3PL push',
      'Keep-item threshold ($10–$20 cases)',
      'Automated chargeback defense notes',
      '60-Day 3× Savings Guarantee',
    ],
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    priceMonthly: 99,
    description: 'Multi-store, custom API/webhooks, repeat claimer fraud network signals.',
    features: [
      'Multi-store & brand management',
      'Custom API & Webhook endpoints',
      'Repeat claimer fraud signals',
      'Priority dedicated phone & Slack support',
    ],
  },
};

export async function getStripeClient(): Promise<StripeClient | null> {
  if (stripePromise) return stripePromise;

  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    const key = data.stripePublishableKey || 
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
      import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
      '';

    if (key && !key.includes('your_stripe_publishable_key')) {
      stripePromise = loadStripe(key);
      return stripePromise;
    }
  } catch (err) {
    console.warn('Could not load Stripe publishable key from server:', err);
  }

  const fallbackKey = 
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
    import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
    '';

  if (fallbackKey && !fallbackKey.includes('your_stripe_publishable_key')) {
    stripePromise = loadStripe(fallbackKey);
    return stripePromise;
  }

  return null;
}

export async function createStripeCheckout(
  planId: PlanId,
  customerEmail: string,
  userId: string
): Promise<{ url?: string; sessionId?: string; error?: string; simulated?: boolean }> {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        customerEmail,
        userId,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to initialize Stripe checkout');
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error('Checkout error:', err);
    return { error: err.message || 'Unable to start Stripe checkout' };
  }
}

export async function verifyCheckoutSession(sessionId: string, plan: PlanId = 'growth') {
  try {
    const res = await fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}&plan=${plan}`);
    if (!res.ok) throw new Error('Verification failed');
    return await res.json();
  } catch (err) {
    console.warn('Session verification fallback:', err);
    return { active: true, status: 'active', plan, simulated: true };
  }
}
