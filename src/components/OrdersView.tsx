import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  PackageCheck, 
  Truck, 
  MessageSquare, 
  Slack, 
  Check, 
  Copy, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { claims, pushOrderTo3PL, rules, setSelectedClaim } = useApp();

  const replacementClaims = claims.filter(c => c.draftOrderNumber || c.status === 'converted_replacement');

  return (
    <div className="space-y-6 pb-12 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Automated Exchanges
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Turned return requests into $0 replacement orders shipped directly to delighted customers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900">
            {replacementClaims.length} Exchanges Created
          </span>
        </div>
      </div>

      {/* Feature Highlight Banner */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
            <PackageCheck className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-neutral-900 dark:text-white">
              Instant $0 Replacements Sent Straight to Fulfillment
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
              When a customer taps "Ship Free Replacement", RefundGo automatically builds a $0 draft order in Shopify, alerts your team on Slack, and routes it to your fulfillment team.
            </div>
          </div>
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 shrink-0 font-mono">
          Fulfillment dispatch: <strong className="text-emerald-600">{rules.autoPushToFulfillment ? 'Automatic' : 'Manual'}</strong>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {replacementClaims.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500">
            No replacement orders generated yet. Simulate a claim to watch $0 draft orders create in real-time.
          </div>
        ) : (
          replacementClaims.map(claim => (
            <div 
              key={claim.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                
                {/* Order Identification */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white">
                        {claim.draftOrderNumber || `#RPL-${claim.originalOrderId.replace('#', '')}-1`}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        (Ref: {claim.originalOrderId})
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                        $0.00 Draft Order
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Created for <strong className="text-neutral-800 dark:text-neutral-200">{claim.customerName}</strong> ({claim.customerEmail})
                    </div>
                  </div>
                </div>

                {/* Status & 3PL Button */}
                <div className="flex items-center gap-3 self-end lg:self-auto">
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {claim.fulfillmentStatus === 'shipped' ? 'Shipped' : claim.fulfillmentStatus === 'pushed_to_3pl' ? 'Pushed to 3PL' : 'Draft Ready'}
                  </span>

                  {claim.fulfillmentStatus === 'unfulfilled' && (
                    <button
                      onClick={() => pushOrderTo3PL(claim.id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    >
                      Push to 3PL Now
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedClaim(claim)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    title="View details"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                {/* Item Details */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Line Item Dispatched</span>
                  <div className="font-semibold text-neutral-900 dark:text-white truncate">{claim.itemTitle}</div>
                  <div className="text-neutral-500 font-mono text-[11px]">
                    SKU: {claim.itemSku} · Qty: 1 · Price: $0.00
                  </div>
                </div>

                {/* Tracking & Carrier */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Carrier & Tracking</span>
                  <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span className="font-mono">{claim.trackingNumber || 'Pending label generation'}</span>
                  </div>
                  <div className="text-neutral-500 text-[11px]">
                    Carrier: {claim.carrier || 'USPS Priority 2-Day'}
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Delivery Address</span>
                  <div className="text-neutral-700 dark:text-neutral-300 font-mono text-[11px] truncate">
                    {claim.customerAddress}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Confirmed via 2-Tap Customer Prompt
                  </div>
                </div>
              </div>

              {/* Team Notification Note (Slack & Gorgias internal notes) */}
              <div className="mt-4 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
                  <Slack className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
                  <span>Internal Ops Note Sent to {rules.slackNotificationChannel} & Gorgias Ticket:</span>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                  "⚡️ RefundGo: Customer {claim.customerName} selected Free Replacement for {claim.originalOrderId}. Created $0 draft order {claim.draftOrderNumber || 'RPL'}. Net store savings protected: +${claim.costBreakdown?.netSavingsIfReplacement.toFixed(2) || '0.00'}."
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
