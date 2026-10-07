import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { Tag, Plus, CheckCircle2, Trash2, Percent, DollarSign, AlertCircle } from 'lucide-react';

export const PromotionsPage = () => {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState('');
  const [commissionType, setCommissionType] = useState('PERCENTAGE');
  const [commissionValue, setCommissionValue] = useState(10);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchEvents = () => {
    setLoading(true);
    api.getAllAdminEvents()
      .then(res => setEventsList(res.data || []))
      .catch(() => setEventsList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCommissionSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.configureCommission({
        eventId: Number(selectedEventId),
        commissionType,
        commissionRate: commissionType === 'PERCENTAGE' ? Number(commissionValue) : null,
        fixedAmount: commissionType === 'FIXED' ? Number(commissionValue) : null
      });
      setSuccessMsg('Commission rule saved to backend!');
      setShowDrawer(false);
      fetchEvents();
    } catch {
      alert('Failed to save rule to backend.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="text-indigo-400" size={24} /> Promotions & Commission Rules
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Live platform commission rules and promotional discount configurations from backend database.</p>
        </div>

        <button onClick={() => setShowDrawer(true)} className="btn-primary text-xs">
          <Plus size={14} /> Configure Promotion Rule
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-semibold p-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs">Loading Backend Rules...</span>
        </div>
      ) : eventsList.length > 0 ? (
        <div className="card-solid p-0 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Event ID & Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Total Capacity</th>
                <th className="p-4">Event Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {eventsList.map(evt => (
                <tr key={evt.id} className="hover:bg-slate-950/50">
                  <td className="p-4">
                    <span className="text-xs text-slate-500 font-mono block">#EVT-{evt.id}</span>
                    <span className="font-bold text-white">{evt.title}</span>
                  </td>
                  <td className="p-4"><span className="text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800 font-semibold">{evt.category}</span></td>
                  <td className="p-4 text-xs font-bold text-slate-200">{evt.totalCapacity}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      evt.status === 'PUBLISHED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {evt.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setSelectedEventId(evt.id); setShowDrawer(true); }} className="btn-secondary text-xs px-2.5 py-1">
                      Configure Rule
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-solid p-8 text-center text-slate-400 space-y-2">
          <AlertCircle size={28} className="mx-auto text-slate-500" />
          <p className="text-xs">No active events found in database to configure.</p>
        </div>
      )}

      {showDrawer && (
        <div className="modal-overlay">
          <div className="modal-content space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Configure Event Commission Rule</h3>
              <button onClick={() => setShowDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCommissionSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Target Event</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="input-solid"
                  required
                >
                  <option value="">-- Choose Event --</option>
                  {eventsList.map(e => (
                    <option key={e.id} value={e.id} className="bg-slate-900">{e.title} (ID: #{e.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Rule Type</label>
                  <select value={commissionType} onChange={(e) => setCommissionType(e.target.value)} className="input-solid">
                    <option value="PERCENTAGE" className="bg-slate-900">Percentage (%)</option>
                    <option value="FIXED" className="bg-slate-900">Fixed Fee ($)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Rate / Fee</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={commissionValue}
                    onChange={(e) => setCommissionValue(e.target.value)}
                    className="input-solid"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowDrawer(false)} className="btn-secondary flex-1 justify-center">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  Save Rule to API
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
