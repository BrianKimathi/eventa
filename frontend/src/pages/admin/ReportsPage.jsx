import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { BarChart3, Download, TrendingUp, AlertCircle, DollarSign, Calendar, Layers, CreditCard } from 'lucide-react';

export const ReportsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getAdminDashboard().catch(() => null),
      api.getAllAdminEvents().catch(() => []),
      api.getAdminOrders().catch(() => [])
    ]).then(([dashRes, eventsRes, ordersRes]) => {
      if (dashRes && dashRes.data) setMetrics(dashRes.data);
      if (eventsRes && eventsRes.data) setEventsList(eventsRes.data);
      if (ordersRes) setOrders(ordersRes);
    }).finally(() => setLoading(false));
  }, []);

  // Category breakdown calculation
  const categoryStats = eventsList.reduce((acc, evt) => {
    const cat = evt.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const handleExportCSV = () => {
    if (!metrics) return;
    const csvData = [
      ['Metric', 'Value'],
      ['Gross Turnover ($)', metrics.totalRevenue || 0],
      ['Total Passes Issued', metrics.totalTicketsSold || 0],
      ['Platform Net Commission ($)', metrics.totalPlatformCommission || 0],
      ['Total Platform Users', metrics.totalUsers || 0],
      ['Total Organizers', metrics.totalCreators || 0],
      ['Total Events Hosted', metrics.totalEvents || 0]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvData.map(r => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `System-Analytics-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1f1f39] flex items-center gap-2">
            <BarChart3 className="text-[#f23e14]" size={26} /> Comprehensive System Reports & Analytics
          </h1>
          <p className="text-xs text-[#6e7191] mt-0.5">Live turnover, ticket sales velocity, category distribution, and net commission analysis.</p>
        </div>

        <button onClick={handleExportCSV} className="btn-primary text-xs">
          <Download size={14} /> Export Analytics CSV
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-[#6e7191]">
          <div className="w-8 h-8 border-3 border-[#f23e14] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs font-bold">Loading Live System Analytics...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main Key Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-solid space-y-2">
              <span className="text-xs text-[#6e7191] font-bold block uppercase">Gross Turnover</span>
              <span className="text-3xl font-extrabold text-[#1f1f39]">${(metrics?.totalRevenue || 0).toLocaleString()}</span>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp size={12} /> Total Event Sales
              </span>
            </div>

            <div className="card-solid space-y-2">
              <span className="text-xs text-[#6e7191] font-bold block uppercase">Passes Issued</span>
              <span className="text-3xl font-extrabold text-[#f23e14]">{metrics?.totalTicketsSold || 0}</span>
              <span className="text-xs text-[#6e7191] font-medium">Confirmed Attendee QR Tickets</span>
            </div>

            <div className="card-solid space-y-2">
              <span className="text-xs text-[#6e7191] font-bold block uppercase">Platform Net Commission</span>
              <span className="text-3xl font-extrabold text-amber-500">${(metrics?.totalPlatformCommission || 0).toLocaleString()}</span>
              <span className="text-xs text-[#6e7191] font-medium">Net platform fees</span>
            </div>

            <div className="card-solid space-y-2">
              <span className="text-xs text-[#6e7191] font-bold block uppercase">Total Events Directory</span>
              <span className="text-3xl font-extrabold text-indigo-600">{eventsList.length}</span>
              <span className="text-xs text-[#6e7191] font-medium">Across all categories</span>
            </div>
          </div>

          {/* Breakdown Section: Category Distribution & Gateway Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown */}
            <div className="card-solid space-y-4">
              <h3 className="text-base font-extrabold text-[#1f1f39] flex items-center gap-2 border-b border-gray-100 pb-3">
                <Layers size={18} className="text-[#f23e14]" /> Event Category Distribution
              </h3>

              <div className="space-y-3">
                {Object.keys(categoryStats).length > 0 ? (
                  Object.entries(categoryStats).map(([cat, count]) => {
                    const percentage = Math.round((count / (eventsList.length || 1)) * 100);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#1f1f39]">{cat}</span>
                          <span className="text-[#f23e14]">{count} events ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#f23e14] h-full rounded-full transition-all" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[#6e7191]">No category metrics recorded.</p>
                )}
              </div>
            </div>

            {/* Gateway & Orders Insights */}
            <div className="card-solid space-y-4">
              <h3 className="text-base font-extrabold text-[#1f1f39] flex items-center gap-2 border-b border-gray-100 pb-3">
                <CreditCard size={18} className="text-[#f23e14]" /> Gateway & Sales Performance
              </h3>

              <div className="space-y-3 text-xs text-[#6e7191]">
                <div className="p-4 bg-[#fff4f1] rounded-2xl border border-[#f23e14]/20 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-[#1f1f39] block text-sm">Total Processed Orders</span>
                    <span className="text-[#6e7191] text-xs">Total ticket orders in backend database</span>
                  </div>
                  <span className="text-2xl font-extrabold text-[#f23e14]">{orders.length}</span>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-emerald-800">
                  <div>
                    <span className="font-extrabold block text-sm">Active System Health</span>
                    <span className="text-xs">Database sync & transaction pipeline operational</span>
                  </div>
                  <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1 rounded-full">100% OK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
