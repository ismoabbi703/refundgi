import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClaimReason } from '../types';
import { 
  X, 
  ArrowRightLeft, 
  Sparkles, 
  AlertTriangle, 
  DollarSign, 
  ShieldAlert, 
  Package, 
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WebhookSimulatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { interceptNewClaim, setCustomerPromptClaim, rules } = useApp();

  const [scenario, setScenario] = useState<'high_value' | 'low_dollar' | 'low_stock' | 'repeat_claimer' | 'custom'>('high_value');

  // Custom inputs
  const [orderId, setOrderId] = useState('#10512');
  const [customerName, setCustomerName] = useState('Chloe Bennett');
  const [customerEmail, setCustomerEmail] = useState('chloe.b@lifestyle.co');
  const [itemTitle, setItemTitle] = useState('Merino Cashmere Blend Cardigan - Heather Gray');
  const [itemPrice, setItemPrice] = useState(128.00);
  const [cogs, setCogs] = useState(29.00);
  const [reshipCost, setReshipCost] = useState(6.20);
  const [reason, setReason] = useState<ClaimReason>('damaged_in_transit');
  const [inventoryAvailable, setInventoryAvailable] = useState(24);
  const [isRepeatClaimer, setIsRepeatClaimer] = useState(false);
  const [source, setSource] = useState<'shopify' | 'gorgias' | 'zendesk'>('gorgias');

  if (!isOpen) return null;

  const loadPreset = (type: 'high_value' | 'low_dollar' | 'low_stock' | 'repeat_claimer') => {
    setScenario(type);
    if (type === 'high_value') {
      setOrderId('#10519');
      setCustomerName('Sophia Martinez');
      setCustomerEmail('sophia.m@gmail.com');
      setItemTitle('Leather Crossbody Bag - Sienna Brown');
      setItemPrice(145.00);
      setCogs(32.00);
      setReshipCost(6.80);
      setReason('damaged_in_transit');
      setInventoryAvailable(30);
      setIsRepeatClaimer(false);
      setSource('gorgias');
    } else if (type === 'low_dollar') {
      setOrderId('#10522');
      setCustomerName('Liam O\'Connor');
      setCustomerEmail('liam.oc@outlook.com');
      setItemTitle('Matte Black Candle Snuffer & Wick Trimmer');
      setItemPrice(15.00);
      setCogs(2.80);
      setReshipCost(4.50);
      setReason('wrong_item_received');
      setInventoryAvailable(95);
      setIsRepeatClaimer(false);
      setSource('shopify');
    } else if (type === 'low_stock') {
      setOrderId('#10525');
      setCustomerName('Hannah Abbott');
      setCustomerEmail('hannah.a@example.com');
      setItemTitle('Limited Edition Chunky Knit Throw - Ivory');
      setItemPrice(180.00);
      setCogs(45.00);
      setReshipCost(12.00);
      setReason('damaged_in_transit');
      setInventoryAvailable(1); // Low stock alert!
      setIsRepeatClaimer(false);
      setSource('shopify');
    } else if (type === 'repeat_claimer') {
      setOrderId('#10530');
      setCustomerName('Jordan Blake');
      setCustomerEmail('jordan.blake@fastmail.com');
      setItemTitle('Organic Hemp Denim Jacket');
      setItemPrice(115.00);
      setCogs(26.00);
      setReshipCost(6.50);
      setReason('missing_parts_or_item');
      setInventoryAvailable(18);
      setIsRepeatClaimer(true); // Flagged!
      setSource('gorgias');
    }
  };

  const handleIntercept = () => {
    const claim = interceptNewClaim({
      originalOrderId: orderId,
      customerName,
      customerEmail,
      itemTitle,
      itemPrice,
      cogs,
      reshipCost,
      reason,
      inventoryAvailable,
      isRepeatClaimer,
      previousClaimsCount: isRepeatClaimer ? 3 : 0,
      source,
      customerNote: reason === 'damaged_in_transit' ? 'Arrived torn in shipment.' : 'Wrong item in parcel.',
    });

    onClose();
    // Open 2-Tap prompt preview immediately for the intercepted claim
    setCustomerPromptClaim(claim);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden max-h-[92vh] flex flex-col text-left">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Simulate Inbound Refund / Ticket Intercept
              </h2>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Test how RefundGo intercepts incoming requests and evaluates math
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Preset scenarios buttons */}
          <div className="space-y-2">
            <label className="font-semibold text-neutral-800 dark:text-neutral-200 block">
              Select a Test Scenario:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loadPreset('high_value')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  scenario === 'high_value'
                    ? 'border-emerald-600 bg-emerald-50/40 dark:border-emerald-500 dark:bg-emerald-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="font-bold text-neutral-900 dark:text-white">High-Value Save ($145)</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Reship saves +$106 vs cash refund
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadPreset('low_dollar')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  scenario === 'low_dollar'
                    ? 'border-indigo-600 bg-indigo-50/40 dark:border-indigo-500 dark:bg-indigo-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="font-bold text-neutral-900 dark:text-white">Keep-Item Threshold ($15)</div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                  Offers "Keep it + $5 credit"
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadPreset('low_stock')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  scenario === 'low_stock'
                    ? 'border-amber-600 bg-amber-50/40 dark:border-amber-500 dark:bg-amber-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="font-bold text-neutral-900 dark:text-white">Low Stock (1 unit left)</div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                  Guardrail holds to prevent backorder
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadPreset('repeat_claimer')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  scenario === 'repeat_claimer'
                    ? 'border-rose-600 bg-rose-50/40 dark:border-rose-500 dark:bg-rose-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="font-bold text-neutral-900 dark:text-white">Repeat Claimer Flag</div>
                <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
                  3rd claim in 90 days → Held for review
                </div>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Original Order #
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Incoming Channel
                </label>
                <select
                  value={source}
                  onChange={e => setSource(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 font-medium"
                >
                  <option value="gorgias">Gorgias (Tagged ticket)</option>
                  <option value="shopify">Shopify (Return request)</option>
                  <option value="zendesk">Zendesk (Ticket)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Customer Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                Reported Item
              </label>
              <input
                type="text"
                value={itemTitle}
                onChange={e => setItemTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Retail Price ($)
                </label>
                <input
                  type="number"
                  value={itemPrice}
                  onChange={e => setItemPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  COGS ($)
                </label>
                <input
                  type="number"
                  value={cogs}
                  onChange={e => setCogs(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Reship Label ($)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={reshipCost}
                  onChange={e => setReshipCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Reported Reason
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <option value="damaged_in_transit">Damaged in transit</option>
                  <option value="missing_parts_or_item">Missing parts or item</option>
                  <option value="defective_workmanship">Defective workmanship</option>
                  <option value="wrong_item_received">Wrong item received</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                  Available Warehouse Stock
                </label>
                <input
                  type="number"
                  value={inventoryAvailable}
                  onChange={e => setInventoryAvailable(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>

          <button
            onClick={handleIntercept}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>Intercept & Open 2-Tap Customer Prompt</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
