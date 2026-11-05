import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Stripe if secret key is present
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const hasValidStripeKey = Boolean(
  stripeSecretKey &&
  !stripeSecretKey.includes('your_stripe_secret_key') &&
  stripeSecretKey.startsWith('sk_')
);

const stripe = hasValidStripeKey ? new Stripe(stripeSecretKey) : null;

// Public Configuration endpoint (client retrieves publishable key safely)
app.get('/api/config', (req, res) => {
  const publishableKey = 
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
    process.env.VITE_STRIPE_PUBLISHABLE_KEY || 
    '';

  res.json({
    stripePublishableKey: publishableKey,
    hasStripeSecret: hasValidStripeKey,
    appUrl: process.env.APP_URL || '',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Create Stripe Recurring Subscription Checkout Session
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { planId = 'starter', customerEmail = 'merchant@example.com', userId = 'usr_default', returnUrl } = req.body;

    const planPrices: Record<string, { amount: number; name: string; description: string }> = {
      starter: {
        amount: 1900, // $19.00 / mo
        name: 'RefundGo Starter Subscription',
        description: 'Up to 100 decision prompts/mo, 1 store, Gorgias/Slack sync, savings dashboard',
      },
      growth: {
        amount: 4900, // $49.00 / mo
        name: 'RefundGo Growth (Flagship) Subscription',
        description: 'Unlimited prompts, cost-aware engine, auto-$0-order 3PL push, keep-item threshold, chargeback notes',
      },
      plus: {
        amount: 9900, // $99.00 / mo
        name: 'RefundGo Plus Subscription',
        description: 'Multi-store, API/webhooks, fraud signals, priority support',
      },
    };

    const selected = planPrices[planId] || planPrices.starter;
    const origin = req.headers.origin || process.env.APP_URL || `http://localhost:${port}`;

    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: customerEmail,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: selected.name,
                description: selected.description,
              },
              unit_amount: selected.amount,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId,
          planId,
        },
        success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}&checkout_success=true&plan=${planId}`,
        cancel_url: `${origin}/?checkout_cancel=true`,
      });

      return res.json({ url: session.url, sessionId: session.id, simulated: false });
    }

    // Interactive Demo / Test Simulation Mode when live Stripe key hasn't been set in .env
    const simulatedSessionId = `sim_cs_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const redirectUrl = `${origin}/?session_id=${simulatedSessionId}&checkout_success=true&plan=${planId}&simulated=true`;

    return res.json({
      url: redirectUrl,
      sessionId: simulatedSessionId,
      simulated: true,
      message: 'Stripe simulated mode: Click to activate subscription and unlock workspace',
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// Verify Subscription Session Status
app.get('/api/stripe/verify-session', async (req, res) => {
  try {
    const { session_id, plan = 'starter' } = req.query;
    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Session ID required' });
    }

    if (session_id.startsWith('sim_cs_')) {
      return res.json({
        active: true,
        status: 'active',
        plan,
        simulated: true,
        customerId: `cus_sim_${Date.now()}`,
        subscriptionId: `sub_sim_${Date.now()}`,
      });
    }

    if (stripe) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      return res.json({
        active: session.payment_status === 'paid' || session.status === 'complete',
        status: session.status,
        plan: session.metadata?.planId || plan,
        customerId: session.customer,
        subscriptionId: session.subscription,
      });
    }

    return res.json({ active: true, status: 'active', plan, simulated: true });
  } catch (error: any) {
    console.error('Verify session error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vite Middleware for SPA Development & Production Serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`RefundGo server active on port ${port} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
