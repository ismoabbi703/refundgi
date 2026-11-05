import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Claim } from '../types';
import { 
  X, 
  Check, 
  Truck, 
  DollarSign, 
  Gift, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  ExternalLink,
  Copy
} from 'lucide-react';

interface Props {
  claim: Claim | null;
  onClose: () => void;
}

export const CustomerChoicePromptModal: React.FC<Props> = ({ claim, onClose }) => {
  const { submitCustomerChoice, settings, rules } = useApp();
  
  const [selectedOption, setSelectedOption] = useState<'replacement' | 'refund' | 'keep_item'>('replacement');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [address, setAddress] = useState(claim?.customerAddress || '412 Congress Ave, Apt 5B, Austin, TX 78701');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!claim) return null;

  const magicUrl = `${window.location.origin}?token=${claim.token}`;

  const copyMagicLink = () => {
    navigator.clipboard.writeText(magicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleChoice = async (choice: 'replacement' | 'refund' | 'keep_item') => {
    setSelectedOption(choice);
    setIsSubmitting(true);
    try {
      await submitCustomerChoice(claim.id, choice);
      setHasSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isKeepItemEligible = claim.itemPrice <= rules.keepItemThreshold || claim.costBreakdown?.isKeepItemRecommended;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Merchant Simulator Banner at the very top */}
        <div className="bg-neutral-900 dark:bg-black px-4 py-2 text-white text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>CUSTOMER VIEW SIMULATOR</span>
            <span className="text-neutral-400">· Magic Link: token={claim.token.slice(0, 8)}...</span>
          </div>
          <button
            onClick={copyMagicLink}
            className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
          >
            <Copy className="h-3 w-3" />
            <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {settings.storeName}
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
              Order Resolution Request
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          
          {hasSubmitted ? (
            /* Post-Choice Confirmation Screen */
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <Check className="h-7 w-7 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {selectedOption === 'replacement' && 'Your Replacement Is On The Way!'}
                  {selectedOption === 'keep_item' && 'Credit Added To Your Account!'}
                  {selectedOption === 'refund' && 'Refund Initiated'}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
                  {selectedOption === 'replacement' && (
                    <>
                      We've created replacement draft order{' '}
                      <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                        #RPL-{claim.originalOrderId.replace('#', '')}-1
                      </span>{' '}
                      for $0.00 and dispatched it to warehouse fulfillment.
                    </>
                  )}
                  {selectedOption === 'keep_item' && (
                    <>
                      You may keep the item. A store credit of ${(claim.itemPrice + rules.keepItemBonusCredit).toFixed(2)} has been credited to {claim.customerEmail}.
                    </>
                  )}
                  {selectedOption === 'refund' && (
                    <>
                      A full refund of ${claim.itemPrice.toFixed(2)} has been sent to your original payment method.
                    </>
                  )}
                </p>
              </div>

              {selectedOption === 'replacement' && (
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Shipping to:</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 text-right">{address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Carrier:</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">USPS Priority (2-Day)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Total Charged:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">$0.00</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* The 2-Tap Customer Prompt Screen */
            <>
              {/* Apology & Context */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Hi {claim.customerName},
                </p>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                  We're so sorry your item arrived with an issue. We want to make this right immediately!
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Select your preferred resolution below. No forms, no waiting for support reps.
                </p>
              </div>

              {/* Item Card */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40">
                <div className="h-12 w-12 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 text-sm shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {claim.itemTitle}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
                    <span>Order {claim.originalOrderId}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">${claim.itemPrice.toFixed(2)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-rose-600 dark:text-rose-400">
                      {claim.reason === 'damaged_in_transit' ? 'Damaged in transit' : 'Missing/Wrong item'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Option 1: FREE REPLACEMENT (The High-Value Choice) */}
              <div 
                onClick={() => setSelectedOption('replacement')}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedOption === 'replacement'
                    ? 'border-emerald-600 bg-emerald-50/30 dark:border-emerald-500 dark:bg-emerald-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 shrink-0 mt-0.5">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          Ship Free Replacement Today
                        </span>
                        <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                          Fastest (Recommended)
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        We'll fast-track a brand new item from our warehouse with free priority shipping. No need to ship the damaged one back.
                      </p>
                    </div>
                  </div>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 shrink-0">
                    {selectedOption === 'replacement' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                    )}
                  </div>
                </div>

                {/* Inline address verification */}
                {selectedOption === 'replacement' && (
                  <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40 text-xs">
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 mb-1">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                        Delivering to:
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditingAddress(!isEditingAddress);
                        }}
                        className="text-emerald-600 dark:text-emerald-400 underline font-medium"
                      >
                        {isEditingAddress ? 'Done' : 'Change address'}
                      </button>
                    </div>
                    {isEditingAddress ? (
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="text-neutral-800 dark:text-neutral-200 font-mono text-[11px] truncate">
                        {address}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Option 2: Keep It + Store Credit (if Keep-Item threshold met) */}
              {isKeepItemEligible && (
                <div 
                  onClick={() => setSelectedOption('keep_item')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedOption === 'keep_item'
                      ? 'border-indigo-600 bg-indigo-50/30 dark:border-indigo-500 dark:bg-indigo-950/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 shrink-0 mt-0.5">
                        <Gift className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            Keep Item + ${(claim.itemPrice + rules.keepItemBonusCredit).toFixed(2)} Store Credit
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                          Keep the item for free plus get an extra ${rules.keepItemBonusCredit.toFixed(2)} bonus store credit instantly.
                        </p>
                      </div>
                    </div>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 shrink-0">
                      {selectedOption === 'keep_item' && (
                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Option 3: Full Refund */}
              <div 
                onClick={() => setSelectedOption('refund')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedOption === 'refund'
                    ? 'border-neutral-600 bg-neutral-50 dark:border-neutral-400 dark:bg-neutral-800/40'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 shrink-0 mt-0.5">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        Process Full Refund (${claim.itemPrice.toFixed(2)})
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Return funds to your original payment method. Arrives in 3–5 business days.
                      </p>
                    </div>
                  </div>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 shrink-0">
                    {selectedOption === 'refund' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-neutral-900 dark:bg-white" />
                    )}
                  </div>
                </div>
              </div>

              {/* Confirm 2-Tap Action Button */}
              <div className="pt-2">
                <button
                  disabled={isSubmitting}
                  onClick={() => handleChoice(selectedOption)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing choice...</span>
                  ) : (
                    <>
                      <span>
                        {selectedOption === 'replacement' && 'Confirm Free Replacement'}
                        {selectedOption === 'keep_item' && 'Confirm Keep & Store Credit'}
                        {selectedOption === 'refund' && 'Confirm Full Refund'}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 mt-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Secure 2-Tap Resolution · Direct to Fulfillment</span>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
