import React, { useState } from 'react';
import { MOCK_TICKETS } from '../services/mockData';
import { Ticket, QrCode, Calendar, MapPin, Download, CheckCircle } from 'lucide-react';

export const MyTicketsPage = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Ticket className="text-indigo-400" size={24} /> My Ticket Passes
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your active event tickets and gate entry QR codes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_TICKETS.map(tkt => (
          <div key={tkt.id} className="card-solid space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle size={12} /> {tkt.status}
              </span>
              <span className="text-xs font-mono text-slate-400">{tkt.purchaseCode}</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{tkt.eventTitle}</h3>
              <p className="text-xs text-indigo-400 font-semibold mt-0.5">{tkt.ticketTypeName} ({tkt.quantity} Pass)</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-indigo-400" />
                <span>Purchased on {new Date(tkt.purchaseDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-indigo-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total Paid</span>
                <span className="text-base font-extrabold text-white">${tkt.totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setSelectedTicket(tkt)}
                className="btn-primary text-xs"
              >
                <QrCode size={14} /> Show Entry QR
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Pass Modal */}
      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content text-center space-y-5">
            <h3 className="text-xl font-bold text-white">{selectedTicket.eventTitle}</h3>
            <p className="text-xs text-indigo-400 font-semibold">{selectedTicket.ticketTypeName} — Gate Entry Pass</p>

            <div className="bg-white p-4 rounded-xl w-48 h-48 mx-auto flex items-center justify-center border border-slate-700">
              <QrCode size={160} className="text-slate-950" />
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 block uppercase">Purchase Reference Code</span>
              <span className="text-sm font-mono font-bold text-sky-400">{selectedTicket.purchaseCode}</span>
            </div>

            <div className="flex gap-3">
              <button className="btn-secondary flex-1 justify-center text-xs">
                <Download size={14} /> Save Pass
              </button>
              <button onClick={() => setSelectedTicket(null)} className="btn-primary flex-1 justify-center text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
