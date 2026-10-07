import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import {
  DollarSign,
  Ticket,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Plus,
  BarChart2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [chartMetric, setChartMetric] = useState('revenue');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getAdminDashboard().catch(() => null),
      api.getAllAdminEvents().catch(() => [])
    ]).then(([dashRes, eventsRes]) => {
      if (dashRes && dashRes.data) {
        setMetrics(dashRes.data);
      }
      if (eventsRes && eventsRes.data) {
        setEventsList(eventsRes.data);
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold">Connecting to Spring Boot Backend API...</p>
      </div>
    );
  }

  const publishedCount = eventsList.filter(e => e.status === 'PUBLISHED').length;
  const pendingCount = eventsList.filter(e => e.status === 'PENDING_APPROVAL').length;

  return (
    <div className="space-y-8">
      {/* Header Section per design.txt #7 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Good afternoon, Administrator</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time system data from Spring Boot API.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-solid w-36 text-xs"
          >
            <option value="today" className="bg-slate-900">Today</option>
            <option value="7d" className="bg-slate-900">Last 7 days</option>
            <option value="30d" className="bg-slate-900">Last 30 days</option>
            <option value="year" className="bg-slate-900">This year</option>
          </select>

          <Link to="/admin/events/create" className="btn-primary text-xs">
            <Plus size={14} /> Create Event
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-solid space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Gross Revenue</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold text-white block">
            ${(metrics?.totalRevenue || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Total ticket turnover</span>
        </div>

        <div className="card-solid space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Tickets Sold</span>
            <Ticket size={16} className="text-indigo-400" />
          </div>
          <span className="text-2xl font-extrabold text-white block">
            {(metrics?.totalTicketsSold || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-indigo-300 font-semibold block">Issued passes</span>
        </div>

        <div className="card-solid space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Published Events</span>
            <Calendar size={16} className="text-sky-400" />
          </div>
          <span className="text-2xl font-extrabold text-white block">{publishedCount}</span>
          <span className="text-[11px] text-amber-400 font-semibold block">{pendingCount} Pending approval</span>
        </div>

        <div className="card-solid space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Net Commission</span>
            <TrendingUp size={16} className="text-amber-400" />
          </div>
          <span className="text-2xl font-extrabold text-amber-400 block">
            ${(metrics?.totalPlatformCommission || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 font-semibold block">Platform earnings</span>
        </div>
      </div>

      {/* Events Performance Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">All Platform Events ({eventsList.length})</h3>
        {eventsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsList.map(evt => {
              const cap = evt.totalCapacity || 100;
              const avail = evt.availableTickets !== undefined ? evt.availableTickets : cap;
              const sold = cap - avail;
              const pct = Math.round((sold / cap) * 100);
              return (
                <div key={evt.id} className="card-solid space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-36 -mx-5 -mt-5 mb-3 overflow-hidden bg-slate-950 rounded-t-xl relative">
                      <img src={evt.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'} alt={evt.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 bg-slate-900/90 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {evt.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base line-clamp-1">{evt.title}</h4>
                    <p className="text-xs text-slate-400">{evt.startDate ? new Date(evt.startDate).toLocaleDateString() : 'Date TBD'} • {evt.venue}</p>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs text-slate-300 font-semibold">
                        <span>{sold.toLocaleString()} / {cap.toLocaleString()} tickets sold</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div style={{ width: `${pct}%` }} className="bg-indigo-600 h-full rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <Link to={`/admin/events/details/${evt.id}`} className="btn-secondary text-xs px-3 py-1">
                      Manage Event
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-solid p-8 text-center space-y-3">
            <AlertCircle className="mx-auto text-slate-500" size={32} />
            <p className="text-slate-400 text-sm">No events found in backend database.</p>
            <Link to="/admin/events/create" className="btn-primary text-xs">
              Create Your First Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
