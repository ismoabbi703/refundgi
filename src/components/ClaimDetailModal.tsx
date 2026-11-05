import React from 'react';
import { useApp } from '../context/AppContext';
import { Claim } from '../types';
import { 
  X, 
  ExternalLink, 
  Truck, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Check, 
  Copy,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface Props {
  claim: Claim | null;
  onClose: () => void;
}

export const ClaimDetailModal: React.FC<Props> = ({ claim, onClose }) => {
  const { 
    setCustomerPromptClaim, 
    setDossierClaim, 
    pushOrderTo3PL, 
    updateClaimStatus,
    approveAndSendOffer,
    rules 
  } = useApp();

  if (!claim) return null;

  const economics = claim.costBreakdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden max-h-[92vh] flex flex-col text-left">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              <span className="font-mono text-emerald-600 dark:text-emerald-400">{claim.originalOrderId}</span>
              <span aria-hidden="true">·</span>
              <span className="uppercase">{claim.source} ticket</span>
              <span aria-hidden="true">·</span>
              <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
              Claim Details & Cost Math
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setCustomerPromptClaim(claim);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Test 2-Tap Prompt</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Customer & Item Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Customer Info</span>
              <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{claim.customerName}</div>
              <div className="text-neutral-500 dark:text-neutral-400">{claim.customerEmail}</div>
              <div className="text-neutral-500 dark:text-neutral-400">{claim.customerPhone}</div>
              <div className="text-neutral-600 dark:text-neutral-300 pt-1 font-mono text-[11px] leading-relaxed">
                {claim.customerAddress}
              </div>
            </div>

            {/* Item & Issue Box */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Reported Issue</span>
              <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{claim.itemTitle}</div>
              <div className="flex items-center gap-2 text-neutral-500">
                <span className="font-mono">SKU: {claim.itemSku}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">${claim.itemPrice.toFixed(2)}</span>
              </div>
              <div className="p-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 italic">
                "{claim.customerNote || 'No specific note provided'}"
              </div>
            </div>
          </div>

          {/* Unit Economics Comparison Table */}
          {economics && (
            <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Cost-Aware Decision Math
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Live margin comparison calculated by RefundGo engine
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Net Merchant Savings</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +${economics.netSavingsIfReplacement.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Standard Refund Outflow */}
                <div className="p-3.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="font-semibold text-rose-600 dark:text-rose-400 flex items-center justify-between">
                    <span>If Straight Refunded</span>
                    <span className="font-mono font-bold">-${economics.totalRefundLoss.toFixed(2)}</span>
                  </div>
                  <div className="space-y-1 text-neutral-500 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span>Customer cash payout:</span>
                      <span>${economics.retailPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lost original shipping:</span>
                      <span>${economics.originalShipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment gateway fee:</span>
                      <span>${economics.paymentFee.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Replacement Cost */}
                <div className="p-3.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                    <span>If Replaced</span>
                    <span className="font-mono font-bold">-${economics.totalReplacementCost.toFixed(2)}</span>
                  </div>
                  <div className="space-y-1 text-neutral-500 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span>Product COGS:</span>
                      <span>${economics.cogs.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ground reship label:</span>
                      <span>${economics.reshipCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Kept original revenue:</span>
                      <span>+${economics.retailPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Replacement Order status if converted */}
          {claim.draftOrderNumber ? (
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  <span>$0 Replacement Order: {claim.draftOrderNumber}</span>
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  {claim.fulfillmentStatus || 'pushed_to_3pl'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-neutral-400">Tracking: </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {claim.trackingNumber || 'Generating label...'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400">Carrier: </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {claim.carrier || 'USPS Priority'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between text-neutral-600 dark:text-neutral-400">
              <span>Customer status: <strong className="text-neutral-900 dark:text-white">{claim.status}</strong></span>
              <button
                onClick={() => {
                  onClose();
                  setCustomerPromptClaim(claim);
                }}
                className="text-emerald-600 dark:text-emerald-400 font-semibold underline"
              >
                Simulate Customer Choice
              </button>
            </div>
          )}

          {/* Chargeback Dossier Link */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Chargeback & Dispute Defense Trail
                </div>
                <div className="text-[11px] text-neutral-500">
                  Audit log containing customer IP, choice timestamp, and resolution trail
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                setDossierClaim(claim);
              }}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 font-medium"
            >
              View Dossier
            </button>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
          <div className="text-[11px] text-neutral-400">
            Claim ID: <span className="font-mono">{claim.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {claim.status === 'pending_approval' && (
              <button
                onClick={() => {
                  approveAndSendOffer(claim.id);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                Approve & Send Replacement Offer
              </button>
            )}

            {claim.status !== 'converted_replacement' && claim.status !== 'pending_approval' && (
              <button
                onClick={() => {
                  updateClaimStatus(claim.id, 'converted_replacement');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Force Create $0 Replacement
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
