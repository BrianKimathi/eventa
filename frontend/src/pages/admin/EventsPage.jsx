import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { Calendar, Search, CheckCircle2, XCircle, Eye, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventsPage = () => {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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

  const handleApprove = async (id) => {
    try {
      await api.updateEventApproval(id, { status: 'PUBLISHED', comment: 'Approved by Admin' });
      fetchEvents();
    } catch (e) {
      alert('Error updating approval status');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await api.updateEventApproval(id, { status: 'CANCELLED', comment: 'Unpublished by Admin' });
      fetchEvents();
    } catch (e) {
      alert('Error updating approval status');
    }
  };

  const filteredEvents = eventsList.filter(e => {
    const matchesSearch = (e.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (e.venue || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-indigo-400" size={24} /> Events Directory & Moderation
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage, publish, unpublish, and review all events in the system.</p>
        </div>

        <Link to="/admin/events/create" className="btn-primary text-xs">
          <Plus size={14} /> Create Event
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80 flex items-center">
          <Search className="absolute left-3.5 text-gray-400 pointer-events-none" size={16} />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-solid !pl-10 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PUBLISHED', 'PENDING_APPROVAL', 'CANCELLED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs">Loading Events from API...</span>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="card-solid p-0 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Event Details</th>
                <th className="p-4">Organizer</th>
                <th className="p-4">Category</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredEvents.map(evt => (
                <tr key={evt.id} className="hover:bg-slate-950/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={evt.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'} alt={evt.title} className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800" />
                      <div>
                        <Link to={`/admin/events/details/${evt.id}`} className="font-bold text-white hover:text-indigo-400 transition-colors block">
                          {evt.title}
                        </Link>
                        <span className="text-xs text-slate-400 block">{evt.venue}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs">{evt.creatorName || evt.creatorEmail}</td>
                  <td className="p-4"><span className="text-xs bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-semibold">{evt.category}</span></td>
                  <td className="p-4 text-xs font-bold text-slate-200">{evt.availableTickets} / {evt.totalCapacity}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      evt.status === 'PUBLISHED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      evt.status === 'PENDING_APPROVAL' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      ● {evt.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1.5">
                    <Link to={`/admin/events/details/${evt.id}`} className="btn-secondary text-xs px-2.5 py-1" title="View Details">
                      <Eye size={14} /> Details
                    </Link>

                    {evt.status === 'PENDING_APPROVAL' && (
                      <button onClick={() => handleApprove(evt.id)} className="btn-success text-xs px-2.5 py-1">
                        <CheckCircle2 size={14} /> Approve
                      </button>
                    )}

                    {evt.status === 'PUBLISHED' && (
                      <button onClick={() => handleUnpublish(evt.id)} className="btn-danger text-xs px-2.5 py-1">
                        <XCircle size={14} /> Unpublish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-solid p-8 text-center text-slate-400 space-y-3">
          <AlertCircle className="mx-auto text-slate-500" size={32} />
          <p className="text-sm">No events found in backend database.</p>
        </div>
      )}
    </div>
  );
};
