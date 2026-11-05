import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Check, 
  ArrowRight, 
  Store, 
  Sparkles,
  CreditCard,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  ChevronDown,
  Layers
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingWizard: React.FC<Props> = ({ isOpen, onClose }) => {
  const { 
    settings, 
    updateSettings, 
    rules, 
    updateRules, 
    setIsSimulatorOpen, 
    startStripeCheckout, 
    applyAutoPilotDefaults,
    setActiveTab,
    setLegalTab,
    setThankYouData
  } = useApp();

  const [step, setStep] = useState(1);
  const [storeDomain, setStoreDomain] = useState(settings.shopifyDomain || 'aura-living.myshopify.com');
  const [storeName, setStoreName] = useState(settings.storeName || 'Aura Living');
  const [autoPilotApplied, setAutoPilotApplied] = useState(false);
  const [showAdvancedIntegrationsHint, setShowAdvancedIntegrationsHint] = useState(false);
  const [consentChecked, setConsentChecked] = useState(true);
  const [consentError, setConsentError] = useState('');

  if (!isOpen) return null;

  const handleApplyAutoPilot = () => {
    applyAutoPilotDefaults();
    setAutoPilotApplied(true);
  };

  const handleFinish = () => {
    if (!consentChecked) {
      setConsentError('Please confirm consent for automated refund evaluation to activate.');
      return;
    }
    updateSettings({ 
      shopifyDomain: storeDomain, 
      storeName 
    });
    onClose();
    setThankYouData({
      title: 'Store Connected & Ready to Intercept!',
      subtitle: 'Onboarding Quickstart Completed',
      message: `RefundGo is actively protecting ${storeName} (${storeDomain}). Standard ecommerce auto-pilot rules ($80 retail, 25% COGS, $6.00 reship) are active.`,
      actionText: 'Enter Merchant Dashboard',
      actionTab: 'dashboard',
      referenceId: `STORE-${Date.now().toString().slice(-6)}`
    });
    setActiveTab('thank_you');
    startStripeCheckout(settings.plan === 'starter' ? 'starter' : 'growth');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col text-left">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Quick Setup · Step {step} of 2
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
              {step === 1 ? 'Connect Your Shopify Store' : 'Choose Your Plan'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800">
          <div 
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-xs">
          
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Connect your Shopify store to let RefundGo turn costly return requests into profitable replacements instantly.
              </p>

              {/* 1-Click Auto-Pilot Banner */}
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                      <Zap className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      1-Click Auto-Pilot Setup
                    </span>
                  </div>
                  {autoPilotApplied ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                      <Check className="h-3 w-3" /> Ready
                    </span>
                  ) : null}
                </div>
                
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Pre-loads standard ecommerce numbers (Retail $80, Product Cost 25%, Reship $6.00). You're immediately active without doing any math.
                </p>

                <button
                  type="button"
                  onClick={handleApplyAutoPilot}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    autoPilotApplied 
                      ? 'bg-emerald-700 text-white cursor-default' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{autoPilotApplied ? 'Auto-Pilot Activated (Defaults Applied)' : 'Turn On 1-Click Auto-Pilot'}</span>
                </button>
              </div>

              {/* Shopify Store Connection Fields Only */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-medium text-neutral-900 dark:text-white"
                    placeholder="e.g. Aura Living"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                    Shopify Domain
                  </label>
                  <input
                    type="text"
                    value={storeDomain}
                    onChange={e => setStoreDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono text-neutral-900 dark:text-white"
                    placeholder="yourstore.myshopify.com"
                  />
                </div>
              </div>

              {/* Hidden / Accordion note for Advanced Integrations */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAdvancedIntegrationsHint(!showAdvancedIntegrationsHint)}
                  className="w-full flex items-center justify-between text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 py-1"
                >
                  <span className="text-[11px] font-medium flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    Advanced Integrations (Gorgias, Zendesk, ShipBob, Slack)
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAdvancedIntegrationsHint ? 'rotate-180' : ''}`} />
                </button>

                {showAdvancedIntegrationsHint && (
                  <div className="mt-2 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1">
                    <p>
                      To keep setup simple, helpdesk (Gorgias / Zendesk) and 3PL fulfillment (ShipBob / Slack) connections are kept in <strong>Settings &gt; Advanced Integrations</strong>.
                    </p>
                    <p className="text-neutral-500">
                      You can connect them at any time after activating your store.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Select Your Plan
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto text-xs">
                  Cancel anytime. Zero annual lock-in.
                </p>
              </div>

              {/* Plan Choice Cards */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div 
                  onClick={() => updateSettings({ plan: 'starter' })}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    settings.plan === 'starter'
                      ? 'border-emerald-600 bg-emerald-50/40 dark:border-emerald-500 dark:bg-emerald-950/20'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="font-bold text-neutral-900 dark:text-white">Starter</div>
                  <div className="text-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    $19<span className="text-xs font-normal text-neutral-500">/mo</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Up to 100 decision prompts/mo</div>
                </div>

                <div 
                  onClick={() => updateSettings({ plan: 'growth' })}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all relative ${
                    settings.plan === 'growth'
                      ? 'border-emerald-600 bg-emerald-50/40 dark:border-emerald-500 dark:bg-emerald-950/20'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 dark:text-white">Growth</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300 px-1 py-0.2 rounded">Flagship</span>
                  </div>
                  <div className="text-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    $49<span className="text-xs font-normal text-neutral-500">/mo</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">Unlimited prompts + automated 3PL</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-[11px] text-neutral-600 dark:text-neutral-400">
                🛡️ <strong>60-Day Savings Guarantee:</strong> If RefundGo doesn't save you 3× your subscription in 60 days, it's 100% free.
              </div>

              {/* Data Processing Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-neutral-600 dark:text-neutral-400">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={e => {
                      setConsentChecked(e.target.checked);
                      if (e.target.checked) setConsentError('');
                    }}
                    className="mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 shrink-0"
                  />
                  <span className="leading-snug">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setLegalTab('terms');
                        setActiveTab('legal');
                      }}
                      className="text-emerald-600 dark:text-emerald-400 underline font-medium hover:text-emerald-700"
                    >
                      Terms of Service
                    </button>{' '}
                    and consent to processing of return claims under the{' '}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setLegalTab('privacy');
                        setActiveTab('legal');
                      }}
                      className="text-emerald-600 dark:text-emerald-400 underline font-medium hover:text-emerald-700"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>
                {consentError && (
                  <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                    {consentError}
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => {
              if (step === 1) {
                updateSettings({ shopifyDomain: storeDomain, storeName });
                setStep(2);
              } else {
                handleFinish();
              }
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <span>{step === 2 ? `Subscribe (${settings.plan === 'starter' ? '$19' : '$49'}/mo) via Stripe` : 'Continue to Plan Selection'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

