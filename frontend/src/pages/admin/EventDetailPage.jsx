import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  ShoppingBag,
  Users,
  CheckCircle2,
  BarChart3,
  Edit,
  Share2,
  MoreVertical,
  ExternalLink,
  Plus,
  AlertCircle
} from 'lucide-react';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [salesSummary, setSalesSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const fetchEventData = () => {
    setLoading(true);
    Promise.all([
      api.getEventById(id).catch(() => null),
      api.getEventSalesSummary(id).catch(() => null)
    ]).then(([eventRes, salesRes]) => {
      if (eventRes && eventRes.data) {
        setEvent(eventRes.data);
      }
      if (salesRes && salesRes.data) {
        setSalesSummary(salesRes.data);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const handleUnpublish = async () => {
    try {
      await api.updateEventApproval(id, { status: 'CANCELLED', comment: 'Unpublished by Admin' });
      fetchEventData();
    } catch {
      alert('Error updating status');
    }
    setShowMoreMenu(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <span className="text-xs">Loading Event Details...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="card-solid p-8 text-center space-y-4">
        <AlertCircle size={32} className="mx-auto text-slate-500" />
        <p className="text-slate-300 font-bold">Event not found in backend.</p>
        <Link to="/admin/events" className="btn-primary text-xs">Back to Events</Link>
      </div>
    );
  }

  const soldCount = salesSummary ? salesSummary.ticketsSold : (event.totalCapacity - (event.availableTickets || 0));
  const totalRevenue = salesSummary ? salesSummary.totalRevenue : 0;
  const attendancePct = Math.round((soldCount / event.totalCapacity) * 100) || 0;

  return (
    <div className="space-y-6">
      <Link to="/admin/events" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={14} /> Back to Events
      </Link>

      <div className="card-solid p-6 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'}
              alt={event.title}
              className="w-24 h-24 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  event.status === 'PUBLISHED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  ● {event.status}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{event.category}</span>
              </div>

              <h1 className="text-2xl font-extrabold text-white">{event.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-indigo-400" />
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-indigo-400" />
                  <span>{event.venue}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end relative">
            <Link to={`/admin/events/edit/${event.id}`} className="btn-secondary text-xs">
              <Edit size={14} /> Edit Event
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="btn-secondary text-xs px-2.5"
              >
                <MoreVertical size={16} />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-50 space-y-1 text-xs">
                  <button onClick={handleUnpublish} className="w-full text-left px-3 py-2 text-amber-400 hover:bg-slate-800 rounded font-medium">
                    Unpublish Event
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-800 pt-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'tickets', label: 'Tickets', icon: Ticket }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-solid space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Tickets Sold</span>
              <span className="text-2xl font-extrabold text-white">{soldCount.toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 block">out of {event.totalCapacity.toLocaleString()}</span>
            </div>

            <div className="card-solid space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Gross Revenue</span>
              <span className="text-2xl font-extrabold text-emerald-400">${totalRevenue.toLocaleString()}</span>
              <span className="text-[11px] text-emerald-500 block">Real sales from backend</span>
            </div>

            <div className="card-solid space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Available Tickets</span>
              <span className="text-2xl font-extrabold text-white">{event.availableTickets}</span>
              <span className="text-[11px] text-slate-500 block">Remaining in inventory</span>
            </div>

            <div className="card-solid space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Occupancy Rate</span>
              <span className="text-2xl font-extrabold text-indigo-400">{attendancePct}%</span>
              <span className="text-[11px] text-indigo-300 block">Turnout ratio</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="card-solid space-y-4">
          <h3 className="text-base font-bold text-white">Configured Ticket Tiers</h3>
          {event.ticketTypes && event.ticketTypes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.ticketTypes.map(tt => (
                <div key={tt.ticketTypeId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{tt.name}</span>
                    <span className="text-sm font-extrabold text-white">${(tt.price || 0).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-400">{tt.description || 'Standard pass'}</p>
                  <div className="text-xs text-slate-300 font-semibold">
                    Available Quantity: {tt.availableQuantity}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No custom ticket types configured.</p>
          )}
        </div>
      )}
    </div>
  );
};
