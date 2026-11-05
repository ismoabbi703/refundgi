import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Claim, ClaimStatus, ClaimReason } from '../types';
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRightLeft,
  ChevronRight,
  Plus,
  Send,
  MailCheck
} from 'lucide-react';

export const ClaimsView: React.FC = () => {
  const {
    claims,
    setSelectedClaim,
    setCustomerPromptClaim,
    setDossierClaim,
    setIsSimulatorOpen,
    approveAndSendOffer
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');

  const filteredClaims = claims.filter(c => {
    const matchesSearch = 
      c.originalOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.itemTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesReason = reasonFilter === 'all' || c.reason === reasonFilter;

    return matchesSearch && matchesStatus && matchesReason;
  });

  const getReasonLabel = (reason: ClaimReason) => {
    switch (reason) {
      case 'damaged_in_transit': return 'Damaged in delivery';
      case 'missing_parts_or_item': return 'Missing item or piece';
      case 'wrong_item_received': return 'Wrong item delivered';
      case 'defective_workmanship': return 'Defective or flawed';
      default: return reason;
    }
  };

  const getStatusBadge = (claim: Claim) => {
    switch (claim.status) {
      case 'pending_approval':
        return (
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
              <Clock className="h-3.5 w-3.5" />
              <span>Needs Your Approval</span>
            </span>
            {claim.autoAcknowledgeSent && (
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                <MailCheck className="h-3 w-3" />
                <span>Reassurance email sent</span>
              </div>
            )}
          </div>
        );
      case 'converted_replacement':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Replacement Accepted</span>
          </span>
        );
      case 'pending_customer_choice':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 dark:text-sky-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Offer Sent to Customer</span>
          </span>
        );
      case 'intercepted':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Reviewing</span>
          </span>
        );
      case 'kept_partial_credit':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            <span>Kept Item + Bonus Credit</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Refunded</span>
          </span>
        );
      case 'excluded_rule':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-rose-700 dark:text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Flagged / Excluded</span>
          </span>
        );
      default:
        return <span>{claim.status}</span>;
    }
  };

  const exportCSV = () => {
    const headers = ['Order', 'Customer', 'Email', 'Item', 'Retail Price', 'Cost', 'Reship Cost', 'Net Saved', 'Status', 'Date'];
    const rows = filteredClaims.map(c => [
      c.originalOrderId,
      `"${c.customerName}"`,
      c.customerEmail,
      `"${c.itemTitle.replace(/"/g, '""')}"`,
      c.itemPrice.toFixed(2),
      c.cogs.toFixed(2),
      c.reshipCost.toFixed(2),
      c.costBreakdown?.netSavingsIfReplacement.toFixed(2) || '0.00',
      c.status,
      c.createdAt.split('T')[0]
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `refundgo-saved-returns-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Saved Returns
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Every return RefundGo caught, evaluated, and turned into money kept in your business
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Test a Return</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search order #, customer name, email, item title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter Tabs (Button Segmented Control as per frontend design constitution) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg text-xs overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All ({claims.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending_customer_choice')}
            className={`px-2.5 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'pending_customer_choice'
                ? 'bg-white dark:bg-neutral-900 text-amber-700 dark:text-amber-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Pending Choice
          </button>
          <button
            onClick={() => setStatusFilter('converted_replacement')}
            className={`px-2.5 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'converted_replacement'
                ? 'bg-white dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Converted
          </button>
          <button
            onClick={() => setStatusFilter('kept_partial_credit')}
            className={`px-2.5 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'kept_partial_credit'
                ? 'bg-white dark:bg-neutral-900 text-indigo-700 dark:text-indigo-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Kept Items
          </button>
          <button
            onClick={() => setStatusFilter('excluded_rule')}
            className={`px-2.5 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === 'excluded_rule'
                ? 'bg-white dark:bg-neutral-900 text-rose-700 dark:text-rose-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Flagged/Excluded
          </button>
        </div>

        {/* Reason Selector */}
        <select
          value={reasonFilter}
          onChange={e => setReasonFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 focus:outline-none"
        >
          <option value="all">All Reasons</option>
          <option value="damaged_in_transit">Damaged in transit</option>
          <option value="missing_parts_or_item">Missing parts/item</option>
          <option value="defective_workmanship">Defective workmanship</option>
          <option value="wrong_item_received">Wrong item received</option>
        </select>
      </div>

      {/* Claims Data Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
              <tr>
                <th className="py-3 px-4 font-semibold">Order</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Item & Reason</th>
                <th className="py-3 px-4 font-semibold text-right">Retail / Cost</th>
                <th className="py-3 px-4 font-semibold text-right">Saved For You</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 dark:text-neutral-400">
                    No returns match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredClaims.map(claim => (
                  <tr
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim)}
                    className="hover:bg-neutral-50/75 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
                  >
                    {/* Order */}
                    <td className="py-3.5 px-4 font-mono font-medium whitespace-nowrap">
                      <div className="text-neutral-900 dark:text-neutral-100 font-semibold">{claim.originalOrderId}</div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wide">
                        {claim.source} · {claim.createdAt.split('T')[0]}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{claim.customerName}</div>
                      <div className="text-[11px] text-neutral-400">{claim.customerEmail}</div>
                      {claim.isRepeatClaimer && (
                        <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                          Repeat claimer ({claim.previousClaimsCount} previous)
                        </div>
                      )}
                    </td>

                    {/* Item */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">{claim.itemTitle}</div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{claim.itemSku}</span>
                        <span aria-hidden="true">·</span>
                        <span className="italic">{getReasonLabel(claim.reason)}</span>
                      </div>
                    </td>

                    {/* Retail / Cost */}
                    <td className="py-3.5 px-4 text-right font-mono whitespace-nowrap tabular-nums">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        ${claim.itemPrice.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Cost: ${claim.cogs.toFixed(2)}
                      </div>
                    </td>

                    {/* Net Saved */}
                    <td className="py-3.5 px-4 text-right font-mono whitespace-nowrap tabular-nums">
                      {claim.costBreakdown ? (
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">
                          +${claim.costBreakdown.netSavingsIfReplacement.toFixed(2)}
                        </div>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                      <div className="text-[10px] text-neutral-400">
                        kept in bank
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(claim)}
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* 1-Click Approve & Send Offer if held in Safety Net */}
                        {claim.status === 'pending_approval' && (
                          <button
                            onClick={() => approveAndSendOffer(claim.id)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors inline-flex items-center gap-1 shadow-xs"
                            title="Approve sending the replacement offer to this customer"
                          >
                            <Send className="h-3 w-3" />
                            <span>Approve Offer</span>
                          </button>
                        )}

                        {/* Customer 2-Tap Prompt Preview */}
                        <button
                          onClick={() => setCustomerPromptClaim(claim)}
                          className="px-2 py-1 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 transition-colors inline-flex items-center gap-1"
                          title="Preview the 2-tap customer replacement prompt"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Customer View</span>
                        </button>

                        {/* Dispute defense evidence button */}
                        <button
                          onClick={() => setDossierClaim(claim)}
                          className="px-2 py-1 rounded text-[11px] font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors inline-flex items-center gap-1"
                          title="View dispute defense trail"
                        >
                          <ShieldCheck className="h-3 w-3" />
                          <span>Audit Trail</span>
                        </button>

                        <button
                          onClick={() => setSelectedClaim(claim)}
                          className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
