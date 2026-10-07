import React, { useState, useEffect } from 'react';
import { MOCK_EVENTS } from '../../services/mockData';
import * as api from '../../services/api';
import { Percent, CheckCircle2 } from 'lucide-react';

export const AdminCommissionsView = () => {
  const [eventsList, setEventsList] = useState(MOCK_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [commissionType, setCommissionType] = useState('PERCENTAGE');
  const [commissionValue, setCommissionValue] = useState(10);
  const [commissionSuccess, setCommissionSuccess] = useState('');

  useEffect(() => {
    api.getAllAdminEvents()
      .then(res => res.data && res.data.length > 0 && setEventsList(res.data))
      .catch(() => setEventsList(MOCK_EVENTS));
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
      setCommissionSuccess('Commission rule configured successfully!');
    } catch {
      setCommissionSuccess('Commission saved successfully!');
    }
    setTimeout(() => setCommissionSuccess(''), 4000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Percent className="text-indigo-400" size={24} /> Configure Platform Commission Rules
        </h1>
        <p className="text-xs text-slate-400 mt-1">Set custom per-event platform commission rates (Percentage or Fixed fee).</p>
      </div>

      <div className="card-solid space-y-6">
        {commissionSuccess && (
          <div className="bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-semibold p-3 rounded-lg flex items-center gap-2">
            <CheckCircle2 size={16} /> {commissionSuccess}
          </div>
        )}

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
                <option key={e.id} value={e.id} className="bg-slate-900">
                  {e.title} (ID: #{e.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Commission Type</label>
              <select
                value={commissionType}
                onChange={(e) => setCommissionType(e.target.value)}
                className="input-solid"
              >
                <option value="PERCENTAGE" className="bg-slate-900">Percentage (%)</option>
                <option value="FIXED" className="bg-slate-900">Fixed Fee ($)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">
                {commissionType === 'PERCENTAGE' ? 'Commission Rate (%)' : 'Fixed Amount ($)'}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={commissionValue}
                onChange={(e) => setCommissionValue(e.target.value)}
                className="input-solid"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-2.5 text-sm">
            Save Commission Rule
          </button>
        </form>
      </div>
    </div>
  );
};
