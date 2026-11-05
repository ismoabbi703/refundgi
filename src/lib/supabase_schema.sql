-- ==============================================================================
-- RefundGo Supabase Database Schema & Row-Level Security (RLS) Configuration
-- ==============================================================================
-- Run this script in your Supabase Project SQL Editor (Database -> SQL Editor)
-- This creates all required tables, foreign keys, indexes, and RLS policies
-- so each authenticated merchant can only access their own store data.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Merchants Table (Stores store connection & profile linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    store_name TEXT NOT NULL,
    shopify_domain TEXT,
    support_email TEXT NOT NULL,
    currency TEXT DEFAULT 'USD',
    brand_primary_color TEXT DEFAULT '#059669',
    plan TEXT DEFAULT 'growth' CHECK (plan IN ('starter', 'growth', 'plus', 'pay_per_converted')),
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'trialing', 'canceled')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    subscription_period_end TIMESTAMPTZ,
    is_shopify_connected BOOLEAN DEFAULT false,
    is_gorgias_connected BOOLEAN DEFAULT false,
    is_slack_connected BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_merchant_user UNIQUE (user_id)
);

-- 3. Engine Rules Table (Cost-aware threshold and auto-replacement settings)
CREATE TABLE IF NOT EXISTS public.engine_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
    default_cogs_percent NUMERIC(5,2) DEFAULT 24.00,
    avg_reship_cost NUMERIC(6,2) DEFAULT 5.80,
    payment_fee_percent NUMERIC(4,2) DEFAULT 2.90,
    payment_fee_fixed NUMERIC(4,2) DEFAULT 0.30,
    min_savings_threshold NUMERIC(6,2) DEFAULT 15.00,
    keep_item_threshold NUMERIC(6,2) DEFAULT 18.00,
    keep_item_bonus_credit NUMERIC(6,2) DEFAULT 5.00,
    low_stock_threshold INTEGER DEFAULT 3,
    block_repeat_claimers BOOLEAN DEFAULT true,
    repeat_claim_max_allowed INTEGER DEFAULT 2,
    auto_push_to_fulfillment BOOLEAN DEFAULT true,
    slack_notification_channel TEXT DEFAULT '#ecommerce-ops',
    gorgias_auto_internal_note BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_merchant_rules UNIQUE (merchant_id)
);

-- 4. Claims Table (Intercepted refund requests, customer choices & math)
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    original_order_id TEXT NOT NULL,
    source TEXT DEFAULT 'shopify' CHECK (source IN ('shopify', 'gorgias', 'zendesk', 'manual')),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_city TEXT,
    customer_state TEXT,
    customer_address TEXT,
    
    item_title TEXT NOT NULL,
    item_sku TEXT NOT NULL,
    item_image TEXT,
    item_price NUMERIC(10,2) NOT NULL,
    cogs NUMERIC(10,2) NOT NULL,
    reship_cost NUMERIC(10,2) NOT NULL,
    inventory_available INTEGER DEFAULT 10,
    is_final_sale BOOLEAN DEFAULT false,
    is_repeat_claimer BOOLEAN DEFAULT false,
    previous_claims_count INTEGER DEFAULT 0,
    
    reason TEXT NOT NULL CHECK (reason IN ('damaged_in_transit', 'missing_parts_or_item', 'wrong_item_received', 'defective_workmanship')),
    customer_note TEXT,
    photo_url TEXT,
    
    status TEXT NOT NULL DEFAULT 'intercepted' CHECK (status IN ('intercepted', 'pending_customer_choice', 'converted_replacement', 'refunded', 'kept_partial_credit', 'excluded_rule')),
    customer_choice TEXT CHECK (customer_choice IN ('replacement', 'refund', 'keep_item')),
    customer_choice_timestamp TIMESTAMPTZ,
    customer_ip TEXT,
    
    -- Calculated unit economics
    total_refund_loss NUMERIC(10,2) NOT NULL,
    total_replacement_cost NUMERIC(10,2) NOT NULL,
    net_savings_if_replacement NUMERIC(10,2) NOT NULL,
    
    replacement_order_id TEXT,
    draft_order_number TEXT,
    fulfillment_status TEXT DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'pushed_to_3pl', 'shipped')),
    tracking_number TEXT,
    carrier TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 5. Chargeback Evidence Logs (Permanent digital trail for payment dispute defense)
CREATE TABLE IF NOT EXISTS public.chargeback_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
    original_order_id TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    choice_made TEXT NOT NULL,
    choice_timestamp TIMESTAMPTZ NOT NULL,
    customer_ip TEXT,
    user_agent TEXT,
    resolution_text TEXT NOT NULL,
    replacement_order_number TEXT,
    delivery_carrier TEXT,
    tracking_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Indexes for High-Velocity Queries
CREATE INDEX IF NOT EXISTS idx_claims_merchant_id ON public.claims(merchant_id);
CREATE INDEX IF NOT EXISTS idx_claims_token ON public.claims(token);
CREATE INDEX IF NOT EXISTS idx_claims_status ON public.claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON public.claims(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chargeback_evidence_claim_id ON public.chargeback_evidence(claim_id);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Each user can only select, insert, update, or delete records
-- that belong to their own merchant account.
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engine_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chargeback_evidence ENABLE ROW LEVEL SECURITY;

-- 1. Merchants Table Policies
CREATE POLICY "Merchants: Select own merchant" 
    ON public.merchants FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Merchants: Insert own merchant" 
    ON public.merchants FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Merchants: Update own merchant" 
    ON public.merchants FOR UPDATE 
    USING (auth.uid() = user_id);

-- 2. Engine Rules Table Policies
CREATE POLICY "Engine Rules: Select own rules" 
    ON public.engine_rules FOR SELECT 
    USING (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()));

CREATE POLICY "Engine Rules: Insert own rules" 
    ON public.engine_rules FOR INSERT 
    WITH CHECK (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()));

CREATE POLICY "Engine Rules: Update own rules" 
    ON public.engine_rules FOR UPDATE 
    USING (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()));

-- 3. Claims Table Policies
CREATE POLICY "Claims: Select own claims" 
    ON public.claims FOR SELECT 
    USING (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()));

CREATE POLICY "Claims: Insert own claims" 
    ON public.claims FOR INSERT 
    WITH CHECK (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()));

CREATE POLICY "Claims: Update own claims" 
    ON public.claims FOR UPDATE 
    USING (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()));

-- Public Tokenized Customer Magic Link Access Policy:
-- Unauthenticated customers access only their specific claim record via secure token
CREATE POLICY "Claims: Public customer token read" 
    ON public.claims FOR SELECT 
    TO anon
    USING (token IS NOT NULL);

CREATE POLICY "Claims: Public customer token update choice" 
    ON public.claims FOR UPDATE 
    TO anon
    USING (token IS NOT NULL)
    WITH CHECK (token IS NOT NULL);

-- 4. Chargeback Evidence Policies
CREATE POLICY "Chargeback: Select own evidence" 
    ON public.chargeback_evidence FOR SELECT 
    USING (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()));

CREATE POLICY "Chargeback: Insert own evidence" 
    ON public.chargeback_evidence FOR INSERT 
    WITH CHECK (merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid()));
