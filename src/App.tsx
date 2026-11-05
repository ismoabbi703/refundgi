import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ClaimsView } from './components/ClaimsView';
import { DecisionEngineView } from './components/DecisionEngineView';
import { OrdersView } from './components/OrdersView';
import { SettingsView } from './components/SettingsView';
import { LegalView } from './components/LegalView';
import { ThankYouView } from './components/ThankYouView';
import { NotFoundView } from './components/NotFoundView';
import { RouteMetadataManager } from './components/RouteMetadataManager';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { MobileStickyCTA } from './components/MobileStickyCTA';
import { CustomerChoicePromptModal } from './components/CustomerChoicePromptModal';
import { ClaimDetailModal } from './components/ClaimDetailModal';
import { ChargebackDossierModal } from './components/ChargebackDossierModal';
import { WebhookSimulatorModal } from './components/WebhookSimulatorModal';
import { OnboardingWizard } from './components/OnboardingWizard';
import { AuthModal } from './components/AuthModal';
import { InquiryModal } from './components/InquiryModal';
import { DataDeletionModal } from './components/DataDeletionModal';
import { SubscriptionLockOverlay } from './components/SubscriptionLockOverlay';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setLegalTab,
    selectedClaim,
    setSelectedClaim,
    customerPromptClaim,
    setCustomerPromptClaim,
    dossierClaim,
    setDossierClaim,
    isSimulatorOpen,
    setIsSimulatorOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isInquiryModalOpen,
    setIsInquiryModalOpen,
    isDataDeletionModalOpen,
    setIsDataDeletionModalOpen,
    isSubscriptionActive,
    claims,
  } = useApp();

  // Check for ?token=tk_... in URL for magic link direct resolution flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      const match = claims.find(c => c.token === token);
      if (match) {
        setCustomerPromptClaim(match);
      }
    }
  }, [claims, setCustomerPromptClaim]);

  // Public views (Legal, 404, Thank You) bypass subscription gating
  const isPublicView = activeTab === 'legal' || activeTab === 'thank_you' || activeTab === 'not_found';

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col transition-colors selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:text-emerald-300 pb-16 md:pb-0">
      
      {/* Route Metadata Manager (Dynamically syncs title, description, og tags, and schema.org) */}
      <RouteMetadataManager />

      {/* 3-Zone Top Bar */}
      <Header />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'legal' ? (
          <LegalView />
        ) : activeTab === 'thank_you' ? (
          <ThankYouView />
        ) : activeTab === 'not_found' ? (
          <NotFoundView />
        ) : activeTab === 'settings' ? (
          <SettingsView />
        ) : !isSubscriptionActive ? (
          <SubscriptionLockOverlay />
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'claims' && <ClaimsView />}
            {activeTab === 'engine' && <DecisionEngineView />}
            {activeTab === 'orders' && <OrdersView />}
          </>
        )}
      </main>

      {/* Trust, Safety & Global Compliance Footer */}
      <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 py-8 text-xs text-neutral-500 dark:text-neutral-400 mt-12 bg-white/50 dark:bg-neutral-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-medium text-neutral-700 dark:text-neutral-300 text-center md:text-left">
              <span className="font-bold text-neutral-900 dark:text-white">refundgo</span>
              <span className="text-neutral-400 font-normal"> · "Loop asks customers to exchange. Route decides for them. We ask before you refund — and do the math for you."</span>
            </div>

            {/* Legal & Compliance Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setLegalTab('terms');
                  setActiveTab('legal');
                }}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                Terms of Service
              </button>

              <button
                type="button"
                onClick={() => {
                  setLegalTab('privacy');
                  setActiveTab('legal');
                }}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                Privacy Policy (GDPR / CCPA)
              </button>

              <button
                type="button"
                onClick={() => {
                  setLegalTab('refunds');
                  setActiveTab('legal');
                }}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded font-medium text-emerald-700 dark:text-emerald-400"
              >
                Refund Policy (60-Day 3× Guarantee)
              </button>

              <button
                type="button"
                onClick={() => setIsInquiryModalOpen(true)}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                Contact Specialist
              </button>

              <button
                type="button"
                onClick={() => setIsDataDeletionModalOpen(true)}
                className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
              >
                Request Data Deletion
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('not_found')}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                title="Preview custom 404 page"
              >
                404 Route
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400">
            <div>
              © {new Date().getFullYear()} RefundGo Technologies Inc. Built for Shopify & Gorgias ecommerce merchants.
            </div>
            <div>
              Protected by PostgreSQL Row-Level Security · Zero data brokering
            </div>
          </div>

        </div>
      </footer>

      {/* Mobile Sticky CTA Bar (Strictly respects 15% mobile viewport cap) */}
      <MobileStickyCTA />

      {/* Non-intrusive Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Modals & Dialogs */}
      <CustomerChoicePromptModal
        claim={customerPromptClaim}
        onClose={() => setCustomerPromptClaim(null)}
      />

      <ClaimDetailModal
        claim={selectedClaim}
        onClose={() => setSelectedClaim(null)}
      />

      <ChargebackDossierModal
        claim={dossierClaim}
        onClose={() => setDossierClaim(null)}
      />

      <WebhookSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <InquiryModal />

      <DataDeletionModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
