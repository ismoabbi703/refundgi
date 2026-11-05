import { Claim, CostBreakdown, EngineRules } from '../types';

export const DEFAULT_RULES: EngineRules = {
  defaultCogsPercent: 25, // Industry default: 25% of retail price
  avgReshipCost: 6.00, // Industry default: $6.00 standard reship
  paymentFeePercent: 2.9, // 2.9% Stripe/Shopify Payments
  paymentFeeFixed: 0.30, // $0.30 fixed fee per transaction
  minSavingsThreshold: 15.00, // Offer replacement if savings >= $15
  keepItemThreshold: 18.00, // Items under $18: offer keep-it + bonus credit instead of return
  keepItemBonusCredit: 5.00, // Bonus store credit
  lowStockThreshold: 3, // If inventory <= 3, pause replacement offer to avoid stockouts
  blockRepeatClaimers: true,
  repeatClaimMaxAllowed: 2, // Flags customers with > 2 claims in 90 days
  autoPushToFulfillment: true, // Automatically dispatch $0 draft order to 3PL
  requireManualApproval: false, // Safety Net: Require manual approval before emailing customers a replacement offer
  autoAcknowledgeEnabled: true, // Auto-Acknowledge: Send friendly email if review takes > 5 min or manual approval is active
  autoAcknowledgeDelayMinutes: 5,
  autoAcknowledgeCustomText: 'We received your report and our team is reviewing it to get you a quick resolution!',
  slackNotificationChannel: '#ecommerce-ops',
  gorgiasAutoInternalNote: true,
};

/**
 * Calculates the exact unit economics of a claim
 */
export function calculateClaimEconomics(
  retailPrice: number,
  customCogs?: number,
  customReshipCost?: number,
  rules: EngineRules = DEFAULT_RULES
): CostBreakdown {
  const cogs = customCogs !== undefined ? customCogs : (retailPrice * rules.defaultCogsPercent) / 100;
  const reshipCost = customReshipCost !== undefined ? customReshipCost : rules.avgReshipCost;
  
  // Payment processing fee that merchant already paid and often forfeits or loses merchant margin on
  const paymentFee = Number(((retailPrice * rules.paymentFeePercent) / 100 + rules.paymentFeeFixed).toFixed(2));
  
  // Estimated original outbound shipping amortized
  const originalShipping = 6.25;
  
  // Total merchant cash loss if full refund is issued:
  // Refund cash back to customer ($retailPrice) + lost original shipping ($6.25) + unrecoverable payment fees
  const totalRefundLoss = Number((retailPrice + originalShipping + paymentFee).toFixed(2));
  
  // Cost to merchant to fulfill a brand new replacement:
  // Product manufacturing/wholesale cost + reship label
  const totalReplacementCost = Number((cogs + reshipCost).toFixed(2));
  
  // Net cash saved by turning this refund into a replacement:
  // The customer keeps the original order paid ($retailPrice revenue stays in bank account),
  // minus only the replacement fulfillment expense.
  // Savings = totalRefundLoss - totalReplacementCost
  const netSavingsIfReplacement = Number((totalRefundLoss - totalReplacementCost).toFixed(2));
  const savingsPercent = totalRefundLoss > 0 ? Number(((netSavingsIfReplacement / totalRefundLoss) * 100).toFixed(1)) : 0;
  
  // Reverse logistics cost estimate (return label $6.50 + warehouse handling/inspection $4.20)
  const reverseLogisticsEstimate = 10.70;
  
  // Keep-item trigger: if retail price is low enough that reverse logistics + processing makes returns a net loss
  const isKeepItemRecommended = retailPrice <= rules.keepItemThreshold;

  return {
    retailPrice,
    originalShipping,
    paymentFee,
    totalRefundLoss,
    cogs: Number(cogs.toFixed(2)),
    reshipCost: Number(reshipCost.toFixed(2)),
    totalReplacementCost,
    netSavingsIfReplacement,
    savingsPercent,
    reverseLogisticsEstimate,
    isKeepItemRecommended,
  };
}

export interface EngineDecisionResult {
  offerReplacement: boolean;
  offerKeepItem: boolean;
  overrideReason?: string;
  recommendationText: string;
  projectedSavings: number;
}

/**
 * Evaluates whether an intercepted claim should offer a replacement prompt,
 * keep-item option, or fallback to standard refund according to rules & overrides.
 */
export function evaluateEngineDecision(
  claim: Partial<Claim>,
  rules: EngineRules = DEFAULT_RULES
): EngineDecisionResult {
  const retailPrice = claim.itemPrice || 0;
  const breakdown = calculateClaimEconomics(retailPrice, claim.cogs, claim.reshipCost, rules);

  // Check overrides:
  // 1. Final sale
  if (claim.isFinalSale) {
    return {
      offerReplacement: false,
      offerKeepItem: false,
      overrideReason: 'Final sale item policy (replacements restricted)',
      recommendationText: 'Process under final sale store discretion',
      projectedSavings: 0,
    };
  }

  // 2. Repeat claimer fraud check
  if (rules.blockRepeatClaimers && (claim.previousClaimsCount || 0) >= rules.repeatClaimMaxAllowed) {
    return {
      offerReplacement: false,
      offerKeepItem: false,
      overrideReason: `Repeat claimer flag (${claim.previousClaimsCount} previous claims in 90 days)`,
      recommendationText: 'Flagged for manual fraud inspection',
      projectedSavings: 0,
    };
  }

  // 3. Low stock guardrail
  if ((claim.inventoryAvailable !== undefined) && claim.inventoryAvailable <= rules.lowStockThreshold) {
    return {
      offerReplacement: false,
      offerKeepItem: breakdown.isKeepItemRecommended,
      overrideReason: `Low stock alert (${claim.inventoryAvailable} units in warehouse, threshold: ${rules.lowStockThreshold})`,
      recommendationText: 'Stock exhausted for replacement - route to refund or store credit',
      projectedSavings: 0,
    };
  }

  // 4. Keep item threshold (e.g. $10-$18 low dollar item where reverse logistics > item value)
  if (breakdown.isKeepItemRecommended) {
    return {
      offerReplacement: true,
      offerKeepItem: true,
      recommendationText: `Offer "Keep It + $${rules.keepItemBonusCredit} Store Credit" to eliminate return shipping overhead`,
      projectedSavings: breakdown.netSavingsIfReplacement,
    };
  }

  // 5. Check minimum savings threshold (e.g. >= $15)
  if (breakdown.netSavingsIfReplacement >= rules.minSavingsThreshold) {
    return {
      offerReplacement: true,
      offerKeepItem: false,
      recommendationText: `High-value save: Reshipping saves $${breakdown.netSavingsIfReplacement} vs issuing refund`,
      projectedSavings: breakdown.netSavingsIfReplacement,
    };
  }

  return {
    offerReplacement: false,
    offerKeepItem: false,
    overrideReason: `Projected savings ($${breakdown.netSavingsIfReplacement}) below merchant threshold ($${rules.minSavingsThreshold})`,
    recommendationText: 'Standard refund threshold',
    projectedSavings: 0,
  };
}
