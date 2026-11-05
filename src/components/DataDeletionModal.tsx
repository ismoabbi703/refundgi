import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, AlertTriangle, Trash2, Download, ShieldAlert, Check } from 'lucide-react';

export const DataDeletionModal: React.FC = () => {
  const { isDataDeletionModalOpen, setIsDataDeletionModalOpen, requestDataDeletion, claims } = useApp();
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadedExport, setDownloadedExport] = useState(false);

  if (!isDataDeletionModalOpen) return null;

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(claims, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `refundgo-data-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadedExport(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmationInput.trim().toUpperCase() !== 'DELETE') return;
    setIsDeleting(true);
    try {
      await requestDataDeletion();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deletion-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col text-left">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 id="deletion-modal-title" className="text-lg font-bold text-neutral-900 dark:text-white">
                Request Data Deletion
              </h2>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                GDPR Article 17 (Right to Erasure) & CCPA Compliance
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDataDeletionModalOpen(false)}
            aria-label="Close data deletion modal"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
            This action will permanently delete all cached Shopify return claims, chargeback dispute trails, store credentials, and customer resolution logs associated with this session.
          </p>

          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
            <div className="font-semibold text-neutral-900 dark:text-white flex items-center justify-between">
              <span>Export Records First (Recommended)</span>
              {downloadedExport && (
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-mono">
                  <Check className="h-3 w-3" /> Exported JSON
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Download an archival copy of all your claims and dispute evidence logs for accounting records before deletion.
            </p>
            <button
              type="button"
              onClick={handleExportData}
              className="w-full py-1.5 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Full Claim Ledger Export</span>
            </button>
          </div>

          <div className="space-y-1.5 pt-2">
            <label htmlFor="confirm-delete-input" className="font-semibold text-neutral-800 dark:text-neutral-200 block">
              Type <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">DELETE</span> to confirm permanent erasure:
            </label>
            <input
              id="confirm-delete-input"
              type="text"
              value={confirmationInput}
              onChange={e => setConfirmationInput(e.target.value)}
              placeholder="DELETE"
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={confirmationInput.trim().toUpperCase() !== 'DELETE' || isDeleting}
              onClick={handleConfirmDelete}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isDeleting ? 'Purging Records...' : 'Permanently Delete All Data'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
