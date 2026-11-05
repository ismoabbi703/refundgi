import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const RouteMetadataManager: React.FC = () => {
  const { activeTab, legalTab } = useApp();

  useEffect(() => {
    let title = 'RefundGo – Automated Return Intercept & Replacement Savings';
    let description = 'Turn costly Shopify refunds into high-margin replacements before cash leaves your store. Cost-aware decision engine, 2-tap magic links, and dispute evidence trail.';

    switch (activeTab) {
      case 'dashboard':
        title = 'RefundGo – Overview & Savings Dashboard';
        description = 'Monitor intercepted Shopify refunds and see exactly how many thousands of dollars were converted into cheap replacements.';
        break;
      case 'claims':
        title = 'Saved Returns Ledger | RefundGo';
        description = 'Real-time feed of intercepted Shopify return requests and customer resolution statuses.';
        break;
      case 'engine':
        title = 'Auto-Save Settings & Margin Rules | RefundGo';
        description = 'Calibrate product cost percentages, reship estimates, keep-item thresholds, and automated replacement rules.';
        break;
      case 'orders':
        title = 'Automated Exchanges ($0 Draft Orders) | RefundGo';
        description = 'Review automated $0 replacement draft orders and direct fulfillment dispatch to 3PL warehouses.';
        break;
      case 'settings':
        title = 'Store Settings, Privacy & Billing | RefundGo';
        description = 'Manage your Shopify store credentials, Stripe subscription billing, and GDPR/CCPA data privacy controls.';
        break;
      case 'legal':
        if (legalTab === 'privacy') {
          title = 'Privacy Policy & GDPR/CCPA Compliance | RefundGo';
          description = 'Read our data privacy policy, tenant isolation security rules, and customer data handling standards.';
        } else if (legalTab === 'refunds') {
          title = 'Refund Policy & 60-Day Guarantee | RefundGo';
          description = 'Learn about our 60-Day 3x Savings Guarantee and month-to-month subscription cancellation policies.';
        } else {
          title = 'Terms of Service | RefundGo';
          description = 'Terms and conditions for utilizing the RefundGo automated return interception platform.';
        }
        break;
      case 'thank_you':
        title = 'Thank You & Confirmation | RefundGo';
        description = 'Your request, inquiry, or data update has been processed successfully by the RefundGo system.';
        break;
      case 'not_found':
        title = '404 - Return Route Not Found | RefundGo';
        description = 'The requested return claim or merchant page could not be located.';
        break;
    }

    // Set document title
    document.title = title;

    // Set meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Set og:title & og:description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + window.location.pathname);

    // Update JSON-LD structured data
    let jsonLd = document.getElementById('refundgo-schema-jsonld') as HTMLScriptElement | null;
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.id = 'refundgo-schema-jsonld';
      jsonLd.type = 'application/ld+json';
      document.head.appendChild(jsonLd);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'RefundGo',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'All',
      'description': description,
      'offers': {
        '@type': 'AggregateOffer',
        'lowPrice': '19.00',
        'highPrice': '99.00',
        'priceCurrency': 'USD',
        'offerCount': '3',
      },
      'featureList': [
        'Shopify Damaged/Missing Return Intercept',
        '2-Tap Customer Replacement Flow',
        'Cost-Aware Decision Math',
        'Automated $0 Replacement Orders',
        'Chargeback Defense Dossiers',
      ],
    };

    jsonLd.textContent = JSON.stringify(structuredData);
  }, [activeTab, legalTab]);

  return null;
};
