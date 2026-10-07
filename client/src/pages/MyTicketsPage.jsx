import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Ticket, Calendar, QrCode, Download, MailCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getMyTickets()
      .then(res => setTickets(res || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadQrPass = (ticket) => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');

    // Light ShopKing styled pass canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 450);

    // Coral Banner Header
    ctx.fillStyle = '#f23e14';
    ctx.fillRect(0, 0, 400, 70);

    // Title & Info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(ticket.eventTitle || 'Event Pass', 20, 40);

    // Pass Name
    ctx.fillStyle = '#1f1f39';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${ticket.ticketTypeName || 'Standard Pass'} (${ticket.quantity || 1} Ticket)`, 20, 105);

    // Code Box
    ctx.fillStyle = '#fff4f1';
    ctx.fillRect(20, 120, 360, 40);
    ctx.fillStyle = '#f23e14';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`CODE: ${ticket.purchaseCode}`, 30, 145);

    // QR Container Box
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(100, 180, 200, 200);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(ticket.purchaseCode, 140, 280);

    ctx.fillStyle = '#6e7191';
    ctx.font = '12px sans-serif';
    ctx.fillText('Present this pass at event entrance gate', 80, 410);

    const link = document.createElement('a');
    link.download = `Pass-${ticket.purchaseCode}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-extrabold text-[#1f1f39] flex items-center gap-3">
          <Ticket className="text-[#f23e14]" size={28} /> My Digital Ticket Passes
        </h1>
        <p className="text-xs text-[#6e7191] mt-1 font-medium">View and download your digital QR entry passes for upcoming booked events.</p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-[#6e7191]">
          <div className="w-8 h-8 border-3 border-[#f23e14] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs font-bold">Loading Your Ticket Passes...</span>
        </div>
      ) : tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(t => (
            <div key={t.id || t.purchaseCode} className="card-solid space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="bg-[#fff4f1] text-[#f23e14] border border-[#f23e14]/20 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">
                  {t.status || 'CONFIRMED'}
                </span>

                <h3 className="font-extrabold text-[#1f1f39] text-lg line-clamp-1">{t.eventTitle}</h3>
                <p className="text-xs text-[#6e7191] font-semibold">{t.ticketTypeName || 'Standard Pass'} • {t.quantity} Ticket(s)</p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-gray-200 text-center space-y-2">
                <QrCode size={110} className="mx-auto text-[#1f1f39]" />
                <div className="text-xs font-mono font-bold text-[#f23e14] bg-[#fff4f1] py-1 px-2 rounded-lg">
                  {t.purchaseCode}
                </div>
              </div>

              <button onClick={() => handleDownloadQrPass(t)} className="btn-primary w-full justify-center text-xs py-2.5 font-bold">
                <Download size={14} /> Download Event QR Card
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-solid p-16 text-center text-[#6e7191] space-y-4 max-w-lg mx-auto">
          <AlertCircle size={36} className="mx-auto text-gray-400" />
          <h3 className="text-xl font-extrabold text-[#1f1f39]">No Ticket Passes Found</h3>
          <p className="text-xs text-[#6e7191]">You haven't booked any event passes yet. Browse upcoming events to secure your spot.</p>
          <Link to="/" className="btn-primary text-xs">Discover Events</Link>
        </div>
      )}
    </div>
  );
};
