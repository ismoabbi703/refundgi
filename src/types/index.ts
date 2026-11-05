export type ClaimStatus = 
  | 'intercepted' 
  | 'pending_approval' // Safety Net: waiting for merchant manual review
  | 'pending_customer_choice' 
  | 'converted_replacement' 
  | 'refunded' 
  | 'kept_partial_credit' 
  | 'excluded_rule';

export type ClaimReason = 
  | 'damaged_in_transit' 
  | 'missing_parts_or_item' 
  | 'wrong_item_received' 
  | 'defective_workmanship';

export interface CostBreakdown {
  retailPrice: number;
  originalShipping: number;
  paymentFee: number;
  totalRefundLoss: number; // retailPrice + originalShipping + paymentFee
  
  cogs: number;
  reshipCost: number;
  totalReplacementCost: number; // cogs + reshipCost
  
  netSavingsIfReplacement: number; // totalRefundLoss - totalReplacementCost
  savingsPercent: number;
  
  reverseLogisticsEstimate: number; // shipping back + warehouse handling
  isKeepItemRecommended: boolean;
}

export interface Claim {
  id: string;
  token: string;
  originalOrderId: string;
  source: 'shopify' | 'gorgias' | 'zendesk' | 'manual';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity: string;
  customerState: string;
  customerAddress: string;
  
  itemTitle: string;
  itemSku: string;
  itemImage?: string;
  itemPrice: number;
  cogs: number;
  reshipCost: number;
  inventoryAvailable: number;
  isFinalSale: boolean;
  isRepeatClaimer: boolean;
  previousClaimsCount: number;
  
  reason: ClaimReason;
  customerNote?: string;
  photoUrl?: string;
  
  status: ClaimStatus;
  customerChoice?: 'replacement' | 'refund' | 'keep_item' | null;
  customerChoiceTimestamp?: string;
  customerIp?: string;

  // Safety Net & Auto-Acknowledge
  requiresApproval?: boolean;
  autoAcknowledgeSent?: boolean;
  autoAcknowledgeSentAt?: string;
  autoAcknowledgeMessage?: string;
  
  costBreakdown: CostBreakdown;
  replacementOrderId?: string;
  draftOrderNumber?: string;
  fulfillmentStatus?: 'unfulfilled' | 'pushed_to_3pl' | 'shipped';
  trackingNumber?: string;
  carrier?: string;
  
  createdAt: string;
  resolvedAt?: string;
}

export interface EngineRules {
  defaultCogsPercent: number; // e.g. 25%
  avgReshipCost: number; // e.g. $6.00
  paymentFeePercent: number; // e.g. 2.9%
  paymentFeeFixed: number; // e.g. 0.30
  minSavingsThreshold: number; // e.g. $15.00
  keepItemThreshold: number; // items under e.g. $18 offer keep + store credit
  keepItemBonusCredit: number; // bonus store credit e.g. $5
  lowStockThreshold: number; // buffer, e.g. 3 units left
  blockRepeatClaimers: boolean;
  repeatClaimMaxAllowed: number; // 2 in 90 days
  autoPushToFulfillment: boolean;
  
  // Merchant Safety Net & Auto-Acknowledge
  requireManualApproval: boolean; // Safety Net: Require manual approval before emailing customers a replacement offer
  autoAcknowledgeEnabled: boolean; // Auto-Acknowledge: Send friendly email if review takes > 5 min or manual approval is active
  autoAcknowledgeDelayMinutes: number; // e.g. 5
  autoAcknowledgeCustomText?: string;

  slackNotificationChannel: string;
  gorgiasAutoInternalNote: boolean;
}

export interface StoreSettings {
  storeName: string;
  shopifyDomain: string;
  supportEmail: string;
  currency: string;
  brandPrimaryColor: string;
  logoUrl?: string;
  plan: 'starter' | 'growth' | 'plus' | 'pay_per_converted';
  isShopifyConnected: boolean;
  isGorgiasConnected: boolean;
  isSlackConnected: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  isSupabaseConnected: boolean;
}

export type SubscriptionStatus = 'active' | 'inactive' | 'trialing' | 'canceled';
export type PlanId = 'starter' | 'growth' | 'plus';

export interface UserProfile {
  id: string;
  email: string;
  storeName: string;
  role: 'owner' | 'manager';
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: PlanId | null;
  subscriptionPeriodEnd?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface SavingsSummary {
  totalSavedMonth: number;
  claimsConvertedCount: number;
  totalInterceptedCount: number;
  conversionRate: number;
  totalRefundsProcessedCount: number;
  totalKeptCount: number;
  totalPotentialLossPrevented: number;
  avgSavedPerReplacement: number;
  roiMultiple: number; // e.g. 86.0x based on $49 plan
}

export type NavTab = 
  | 'dashboard' 
  | 'claims' 
  | 'engine' 
  | 'orders' 
  | 'settings' 
  | 'thank_you' 
  | 'not_found' 
  | 'legal';

export type LegalTab = 'terms' | 'privacy' | 'refunds';

export interface CookieConsentState {
  accepted: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export interface InquiryData {
  name: string;
  email: string;
  storeUrl: string;
  monthlyVolume: string;
  message: string;
  consentGiven: boolean;
  createdAt: string;
}

export interface ThankYouData {
  title: string;
  subtitle: string;
  message: string;
  actionText?: string;
  actionTab?: NavTab;
  referenceId?: string;
}
