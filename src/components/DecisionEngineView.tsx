import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateClaimEconomics } from '../lib/math';
import { 
  Sliders, 
  DollarSign, 
  Truck, 
  Package, 
  Save, 
  Check, 
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Mail,
  Clock,
  HelpCircle,
  Layers
} from 'lucide-react';

export const DecisionEngineView: React.FC = () => {
  const { rules, updateRules, applyAutoPilotDefaults } = useApp();

  // Local state for rule editing
  const [formRules, setFormRules] = useState(rules);
  const [isSaved, setIsSaved] = useState(false);
  const [autoPilotApplied, setAutoPilotApplied] = useState(false);

  // Interactive Live Simulator Sliders
  const [simPrice, setSimPrice] = useState(80);
  const [simCogsPercent, setSimCogsPercent] = useState(formRules.defaultCogsPercent);
  const [simReshipCost, setSimReshipCost] = useState(formRules.avgReshipCost);

  const simEconomics = calculateClaimEconomics(simPrice, (simPrice * simCogsPercent) / 100, simReshipCost, formRules);

  const handleApplyAutoPilot = () => {
    applyAutoPilotDefaults();
    setFormRules(prev => ({
      ...prev,
      defaultCogsPercent: 25,
      avgReshipCost: 6.00,
      minSavingsThreshold: 15.00
    }));
    setSimPrice(80);
    setSimCogsPercent(25);
    setSimReshipCost(6.00);
    setAutoPilotApplied(true);
    setTimeout(() => setAutoPilotApplied(false), 3000);
  };

  const handleSave = () => {
    updateRules(formRules);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Auto-Save Settings
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Set simple rules for when to offer customers a free replacement instead of a costly cash refund
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 1-Click Auto-Pilot Setup Button */}
          <button
            type="button"
            onClick={handleApplyAutoPilot}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-colors shadow-xs"
          >
            <Zap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{autoPilotApplied ? 'Industry Defaults Applied!' : '1-Click Auto-Pilot Setup'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Safety Net & Auto-Acknowledge Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Safety Net Card */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-neutral-900 dark:text-white">
                Safety Net (Manual Approval)
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formRules.requireManualApproval}
                  onChange={e => setFormRules({ ...formRules, requireManualApproval: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-neutral-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Require manual approval before emailing customers a replacement offer. Held claims await your 1-click green light.
            </p>
          </div>
        </div>

        {/* Auto-Acknowledge Card */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <Mail className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-neutral-900 dark:text-white">
                Auto-Acknowledge Customer
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formRules.autoAcknowledgeEnabled}
                  onChange={e => setFormRules({ ...formRules, autoAcknowledgeEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-neutral-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Immediately reassures shoppers if review takes &gt; 5 mins or requires approval so they never feel ignored.
            </p>
          </div>
        </div>

      </div>

      {/* Interactive Savings Preview (Simple Sliders) */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sliders className="h-4 w-4" />
              <span>Interactive Savings Calculator</span>
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
              See How Much You Save on an Average Order
            </h2>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Test any price point to see the protected bank balance
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          
          {/* Sliders Column */}
          <div className="lg:col-span-6 space-y-5">
            {/* Slider 1: Retail Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Customer's Order Total
                </label>
                <span className="font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                  ${simPrice.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="2"
                value={simPrice}
                onChange={e => setSimPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>$10 (Accessories)</span>
                <span>$80 (Industry default)</span>
                <span>$250 (Outerwear/Home)</span>
              </div>
            </div>

            {/* Slider 2: Product COGS % */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Your Product Cost (% of retail)
                </label>
                <span className="font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                  {simCogsPercent}% (${((simPrice * simCogsPercent) / 100).toFixed(2)})
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={simCogsPercent}
                onChange={e => setSimCogsPercent(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>10% (High markup)</span>
                <span>25% (Standard retail)</span>
                <span>50% (Lower markup)</span>
              </div>
            </div>

            {/* Slider 3: Ground Reship Cost */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Cost to Ship a Replacement
                </label>
                <span className="font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                  ${simReshipCost.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="0.5"
                value={simReshipCost}
                onChange={e => setSimReshipCost(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>$3.50 (Mailer)</span>
                <span>$6.00 (Standard package)</span>
                <span>$15.00 (Bulky box)</span>
              </div>
            </div>
          </div>

          {/* Outcome Summary Card Column */}
          <div className="lg:col-span-6 flex flex-col justify-between p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Your Savings Summary
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  {simEconomics.isKeepItemRecommended ? 'Keep-Item Route' : 'Free Replacement'}
                </span>
              </div>

              <div className="mt-3">
                <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                  +${simEconomics.netSavingsIfReplacement.toFixed(2)} Kept In Your Bank
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                  Protects <strong className="font-mono">{simEconomics.savingsPercent}%</strong> of the order value compared to issuing a standard cash refund.
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-emerald-200/80 dark:border-emerald-900/50 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Cash lost if you do a full refund:</span>
                  <span className="text-rose-600 font-semibold">-${simEconomics.totalRefundLoss.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Actual cost to ship replacement:</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-semibold">-${simEconomics.totalReplacementCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-300 font-bold">
                  <span>Net dollars protected:</span>
                  <span>+${simEconomics.netSavingsIfReplacement.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
              <span className="font-semibold text-neutral-900 dark:text-white">Auto-Pilot Decision: </span>
              {simEconomics.isKeepItemRecommended ? (
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  Item is under ${formRules.keepItemThreshold}. Offer "Keep it + ${formRules.keepItemBonusCredit} bonus store credit" so you don't pay return shipping.
                </span>
              ) : simEconomics.netSavingsIfReplacement >= formRules.minSavingsThreshold ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Saving ${simEconomics.netSavingsIfReplacement.toFixed(2)} beats your ${formRules.minSavingsThreshold} threshold. Automatically sends customer a friendly 2-tap replacement offer!
                </span>
              ) : (
                <span className="text-neutral-500 font-medium">
                  Savings below ${formRules.minSavingsThreshold} minimum. Will process as standard refund.
                </span>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Auto-Acknowledge Message Template Box */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Auto-Acknowledge Reassurance Message
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Automatically sent to customer if an evaluation takes &gt; 5 mins or requires manual review
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            Fires at {formRules.autoAcknowledgeDelayMinutes} mins or on Manual Hold
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
            Email Message Content
          </label>
          <textarea
            rows={2}
            value={formRules.autoAcknowledgeCustomText}
            onChange={e => setFormRules({ ...formRules, autoAcknowledgeCustomText: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-medium"
            placeholder="We received your report and our team is reviewing it to get you a quick resolution!"
          />
          <p className="text-[11px] text-neutral-400 mt-1">
            Shoppers appreciate knowing their claim was received instantly. This prevents frantic follow-ups and chargebacks.
          </p>
        </div>
      </div>

      {/* Threshold Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Default Store Numbers */}
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Your Product & Shipping Numbers
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Standard estimates used across your catalog
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Average Product Cost (% of Retail)
              </label>
              <input
                type="number"
                value={formRules.defaultCogsPercent}
                onChange={e => setFormRules({ ...formRules, defaultCogsPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
              />
              <span className="text-[11px] text-neutral-400 mt-0.5 block">Apparel is typically 20-25%, beauty is 15-20%</span>
            </div>

            <div>
              <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Average Reshipping Cost ($)
              </label>
              <input
                type="number"
                step="0.1"
                value={formRules.avgReshipCost}
                onChange={e => setFormRules({ ...formRules, avgReshipCost: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
              />
              <span className="text-[11px] text-neutral-400 mt-0.5 block">Average ground postal rate to reship a replacement</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Payment Fee (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formRules.paymentFeePercent}
                  onChange={e => setFormRules({ ...formRules, paymentFeePercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Fixed Fee ($)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={formRules.paymentFeeFixed}
                  onChange={e => setFormRules({ ...formRules, paymentFeeFixed: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Thresholds & Safeguards */}
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Rules & Safeguards
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Control when offers are made to protect your business
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Minimum Savings to Trigger Offer ($)
              </label>
              <input
                type="number"
                value={formRules.minSavingsThreshold}
                onChange={e => setFormRules({ ...formRules, minSavingsThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
              />
              <span className="text-[11px] text-neutral-400 mt-0.5 block">
                Only suggest replacement if you save at least this amount ($15 recommended)
              </span>
            </div>

            <div>
              <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Keep-Item Threshold ($)
              </label>
              <input
                type="number"
                value={formRules.keepItemThreshold}
                onChange={e => setFormRules({ ...formRules, keepItemThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
              />
              <span className="text-[11px] text-neutral-400 mt-0.5 block">
                Items below this price offer "Keep it + $5 store credit" to avoid reverse shipping cost
              </span>
            </div>

            <div>
              <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Low Inventory Safety Buffer (Units)
              </label>
              <input
                type="number"
                value={formRules.lowStockThreshold}
                onChange={e => setFormRules({ ...formRules, lowStockThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
              />
              <span className="text-[11px] text-neutral-400 mt-0.5 block">
                Don't offer replacement if stock is low to prevent overselling
              </span>
            </div>

            {/* Checkbox toggles */}
            <div className="pt-2 space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formRules.blockRepeatClaimers}
                  onChange={e => setFormRules({ ...formRules, blockRepeatClaimers: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  Flag repeat claimers (&gt; {formRules.repeatClaimMaxAllowed} claims in 90 days)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formRules.autoPushToFulfillment}
                  onChange={e => setFormRules({ ...formRules, autoPushToFulfillment: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  Automatically dispatch $0 replacement orders to fulfillment
                </span>
              </label>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

