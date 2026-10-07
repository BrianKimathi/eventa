import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { ShoppingBag, Search, Download, Filter, RefreshCw, CheckCircle2, AlertCircle, QrCode } from 'lucide-react';

export const OrdersView = () => {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    Promise.all([
      api.getAdminOrders().catch(() => []),
      api.getAllAdminEvents().catch(() => [])
    ]).then(([ordersData, eventsData]) => {
      setOrders(ordersData || []);
      setEventsList(eventsData.data || eventsData || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefund = async (purchaseId) => {
    if (!window.confirm(`Are you sure you want to issue a full refund for Order #${purchaseId}? This will cancel the ticket pass.`)) return;
    setRefundingId(purchaseId);
    try {
      await api.processAdminRefund(purchaseId);
      alert('Order refunded successfully and ticket capacity restored!');
      fetchOrders();
    } catch {
      alert('Failed to process refund.');
    } finally {
      setRefundingId(null);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('No orders to export.');
      return;
    }
    const headers = ['Order Code', 'Date', 'Customer Name', 'Email', 'Event', 'Category', 'Pass Type', 'Qty', 'Amount ($)', 'Status'];
    const rows = orders.map(o => [
      o.purchaseCode,
      new Date(o.purchaseDate).toLocaleDateString(),
      `"${o.customerName}"`,
      o.customerEmail,
      `"${o.eventTitle}"`,
      o.category,
      o.ticketTypeName,
      o.quantity,
      o.totalAmount,
      o.purchaseStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Orders-Report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.purchaseCode || '').toLowerCase().includes(search.toLowerCase()) ||
                          (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
                          (o.customerEmail || '').toLowerCase().includes(search.toLowerCase());
    const matchesEvent = selectedEventId === 'ALL' || String(o.eventId) === String(selectedEventId);
    return matchesSearch && matchesEvent;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1f1f39] flex items-center gap-2">
            <ShoppingBag className="text-[#f23e14]" size={24} /> Sales Orders & Refund Management
          </h1>
          <p className="text-xs text-[#6e7191] mt-0.5">Real-time order audit log with automated gateway refunds & capacity restoration.</p>
        </div>

        <button onClick={handleExportCSV} className="btn-primary text-xs">
          <Download size={14} /> Export Orders CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80 flex items-center">
          <Search className="absolute left-3.5 text-gray-400 pointer-events-none" size={16} />
          <input
            type="text"
            placeholder="Search by order code, customer or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-solid !pl-10 py-2.5 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <Filter size={14} className="text-[#f23e14]" />
            <span className="text-xs text-[#6e7191] font-bold">Event Filter:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#1f1f39] outline-none cursor-pointer"
            >
              <option value="ALL">All Events</option>
              {eventsList.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#6e7191]">
          <div className="w-6 h-6 border-2 border-[#f23e14] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs font-bold">Loading Backend Sales Orders...</span>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="card-solid p-0 overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1f1f39]">
            <thead className="bg-[#f7f7fc] text-[#6e7191] text-xs uppercase border-b border-gray-100 font-extrabold">
              <tr>
                <th className="p-4">Order Code</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Event</th>
                <th className="p-4">Pass & Qty</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredOrders.map(ord => (
                <tr key={ord.purchaseId} className="hover:bg-[#fff4f1]/40">
                  <td className="p-4">
                    <span className="font-mono font-bold text-[#f23e14] text-xs bg-[#fff4f1] px-2.5 py-1 rounded-lg">
                      {ord.purchaseCode}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#1f1f39] text-xs">{ord.customerName}</div>
                    <div className="text-[11px] text-[#6e7191]">{ord.customerEmail}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#1f1f39] text-xs">{ord.eventTitle}</div>
                    <span className="text-[10px] text-[#6e7191]">{ord.category}</span>
                  </td>
                  <td className="p-4 text-xs font-bold">
                    {ord.ticketTypeName} × {ord.quantity}
                  </td>
                  <td className="p-4 text-xs font-extrabold text-[#f23e14]">
                    ${(ord.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      ord.purchaseStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                      ord.purchaseStatus === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                      'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      ● {ord.purchaseStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {ord.purchaseStatus !== 'CANCELLED' ? (
                      <button
                        onClick={() => handleRefund(ord.purchaseId)}
                        disabled={refundingId === ord.purchaseId}
                        className="btn-danger text-xs px-3 py-1 font-bold"
                      >
                        {refundingId === ord.purchaseId ? 'Refunding...' : 'Refund Order'}
                      </button>
                    ) : (
                      <span className="text-xs text-[#6e7191] italic font-semibold">Refunded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-solid p-12 text-center text-[#6e7191] space-y-2">
          <AlertCircle size={32} className="mx-auto text-gray-400" />
          <p className="text-sm font-bold text-[#1f1f39]">No sales orders recorded.</p>
        </div>
      )}
    </div>
  );
};

export const TicketsView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAdminOrders()
      .then(res => setOrders(res || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-extrabold text-[#1f1f39] flex items-center gap-2">
          <QrCode className="text-[#f23e14]" size={24} /> Issued QR Ticket Passes Audit
        </h1>
        <p className="text-xs text-[#6e7191] mt-0.5">Audit log of all issued gate verification QR codes across all events.</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#6e7191]">
          <div className="w-6 h-6 border-2 border-[#f23e14] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs font-bold">Loading Issued QR Passes...</span>
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {orders.map(t => (
            <div key={t.purchaseId} className="card-solid space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#f23e14] bg-[#fff4f1] px-2.5 py-1 rounded-lg">
                  {t.purchaseCode}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {t.purchaseStatus}
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-[#1f1f39] truncate">{t.eventTitle}</h3>
              <p className="text-xs text-[#6e7191]">Holder: {t.customerName} ({t.customerEmail})</p>
              <div className="pt-2 text-[11px] text-[#6e7191] font-medium border-t border-gray-100 flex justify-between">
                <span>Pass: {t.ticketTypeName}</span>
                <span>Qty: {t.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-solid p-12 text-center text-[#6e7191] space-y-2">
          <AlertCircle size={32} className="mx-auto text-gray-400" />
          <p className="text-sm font-bold text-[#1f1f39]">No issued ticket passes found.</p>
        </div>
      )}
    </div>
  );
};

export const CategoriesView = () => (
  <div className="card-solid p-8 text-center text-[#6e7191] space-y-2">
    <h2 className="text-lg font-extrabold text-[#1f1f39]">Event Categories Manager</h2>
    <p className="text-xs">Categories are dynamically computed from event metadata (Tech, Music, Business, Arts).</p>
  </div>
);

export const VenuesView = () => (
  <div className="card-solid p-8 text-center text-[#6e7191] space-y-2">
    <h2 className="text-lg font-extrabold text-[#1f1f39]">Venues Directory</h2>
    <p className="text-xs font-bold">Venues are dynamically aggregated from published event locations.</p>
  </div>
);

export const AuditLogsView = () => (
  <div className="card-solid p-8 text-center text-[#6e7191] space-y-2">
    <h2 className="text-lg font-extrabold text-[#1f1f39]">System Audit Logs</h2>
    <p className="text-xs">All administrative actions are logged in real-time to security monitoring.</p>
  </div>
);
