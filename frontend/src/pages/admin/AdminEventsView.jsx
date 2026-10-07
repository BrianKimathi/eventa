import React, { useState, useEffect } from 'react';
import { MOCK_EVENTS } from '../../services/mockData';
import * as api from '../../services/api';
import { CheckCircle2, XCircle, Calendar } from 'lucide-react';

export const AdminEventsView = () => {
  const [eventsList, setEventsList] = useState(MOCK_EVENTS);

  useEffect(() => {
    api.getAllAdminEvents()
      .then(res => res.data && res.data.length > 0 && setEventsList(res.data))
      .catch(() => setEventsList(MOCK_EVENTS));
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.updateEventApproval(id, { status: 'PUBLISHED', comment: 'Approved' });
    } catch (e) {
      // Demo fallback
    }
    setEventsList(eventsList.map(e => e.id === id ? { ...e, status: 'PUBLISHED' } : e));
  };

  const handleReject = async (id) => {
    try {
      await api.updateEventApproval(id, { status: 'CANCELLED', comment: 'Rejected' });
    } catch (e) {
      // Demo fallback
    }
    setEventsList(eventsList.map(e => e.id === id ? { ...e, status: 'CANCELLED' } : e));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="text-indigo-400" size={24} /> Event Moderation & Approvals
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review pending creator submissions and publish or reject events.</p>
      </div>

      <div className="card-solid p-0 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
            <tr>
              <th className="p-4">Event Details</th>
              <th className="p-4">Creator</th>
              <th className="p-4">Category</th>
              <th className="p-4">Capacity</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {eventsList.map(evt => (
              <tr key={evt.id} className="hover:bg-slate-950/50">
                <td className="p-4">
                  <div className="font-bold text-white">{evt.title}</div>
                  <div className="text-xs text-slate-400">{evt.venue}</div>
                </td>
                <td className="p-4 text-xs">{evt.creatorName || evt.creatorEmail}</td>
                <td className="p-4"><span className="text-xs bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-semibold">{evt.category}</span></td>
                <td className="p-4 text-xs font-bold text-slate-200">{evt.totalCapacity}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    evt.status === 'PUBLISHED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    evt.status === 'PENDING_APPROVAL' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {evt.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {evt.status === 'PENDING_APPROVAL' && (
                    <>
                      <button onClick={() => handleApprove(evt.id)} className="btn-success text-xs">
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button onClick={() => handleReject(evt.id)} className="btn-danger text-xs">
                        <XCircle size={14} /> Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
