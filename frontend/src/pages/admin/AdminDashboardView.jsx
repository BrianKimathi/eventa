import React, { useState, useEffect } from 'react';
import { MOCK_METRICS, MOCK_EVENTS } from '../../services/mockData';
import * as api from '../../services/api';
import { DollarSign, TrendingUp, Users, Ticket, CalendarCheck, CheckCircle2, XCircle } from 'lucide-react';

export const AdminDashboardView = () => {
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [eventsList, setEventsList] = useState(MOCK_EVENTS);

  useEffect(() => {
    api.getAdminDashboard()
      .then(res => res.data && setMetrics(res.data))
      .catch(() => setMetrics(MOCK_METRICS));

    api.getAllAdminEvents()
      .then(res => res.data && res.data.length > 0 && setEventsList(res.data))
      .catch(() => setEventsList(MOCK_EVENTS));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">System Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">Platform turnover, commission earnings, and pending event approvals.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-solid space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Gross Revenue</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold text-white block">${(metrics.totalRevenue || 0).toLocaleString()}</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Turnover across all sales</span>
        </div>

        <div className="card-solid space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Platform Net Revenue</span>
            <TrendingUp size={16} className="text-indigo-400" />
          </div>
          <span className="text-2xl font-extrabold text-indigo-400 block">${(metrics.totalPlatformCommission || 0).toLocaleString()}</span>
          <span className="text-[11px] text-indigo-300 font-semibold block">Collected commissions</span>
        </div>

        <div className="card-solid space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Registered Users</span>
            <Users size={16} className="text-sky-400" />
          </div>
          <span className="text-2xl font-extrabold text-white block">{metrics.totalUsers || 0}</span>
          <span className="text-[11px] text-slate-400 font-semibold block">{metrics.totalCreators || 0} Verified Creators</span>
        </div>

        <div className="card-solid space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Tickets Sold</span>
            <Ticket size={16} className="text-amber-400" />
          </div>
          <span className="text-2xl font-extrabold text-white block">{metrics.totalTicketsSold || 0}</span>
          <span className="text-[11px] text-slate-400 font-semibold block">Across {metrics.totalEvents || 0} total events</span>
        </div>
      </div>

      {/* Moderation Alert Box */}
      <div className="card-solid space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CalendarCheck className="text-amber-400" size={20} /> Pending Event Approvals
        </h3>
        {eventsList.filter(e => e.status === 'PENDING_APPROVAL').length > 0 ? (
          <div className="space-y-3">
            {eventsList.filter(e => e.status === 'PENDING_APPROVAL').map(evt => (
              <div key={evt.id} className="bg-slate-950 p-4 rounded-lg border border-amber-900/40 flex items-center justify-between">
                <div>
                  <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 font-bold px-2 py-0.5 rounded">PENDING APPROVAL</span>
                  <h4 className="text-sm font-bold text-white mt-1">{evt.title}</h4>
                  <p className="text-xs text-slate-400">Creator: {evt.creatorName} • Venue: {evt.venue} • Capacity: {evt.totalCapacity}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">All submitted events have been moderated. No pending approvals.</p>
        )}
      </div>
    </div>
  );
};
