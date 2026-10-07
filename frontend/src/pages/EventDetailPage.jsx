import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_EVENTS } from '../services/mockData';
import { Calendar, MapPin, Ticket, ShieldCheck, ArrowLeft, Check, QrCode } from 'lucide-react';

export const EventDetailPage = () => {
  const { id } = useParams();
  const event = MOCK_EVENTS.find(e => e.id === Number(id)) || MOCK_EVENTS[0];

  const [selectedTicket, setSelectedTicket] = useState(event.ticketTypes[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);

  const totalAmount = selectedTicket ? selectedTicket.price * quantity : 0;

  const handleBooking = (e) => {
    e.preventDefault();
    setBookingComplete(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <img src={event.imageUrl} alt={event.title} className="w-full h-72 object-cover" />
            
            <div className="p-6 space-y-4">
              <span className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {event.category}
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{event.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-400" />
                  <span>{new Date(event.startDate).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-400" />
                  <span>{event.venue}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-solid space-y-3">
            <h2 className="text-lg font-bold text-white">About this Event</h2>
            <p className="text-slate-300 text-sm leading-relaxed">{event.description}</p>
          </div>
        </div>

        {/* Right Ticket Checkout Card */}
        <div className="space-y-6">
          <div className="card-solid space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Ticket className="text-indigo-400" size={20} /> Select Tickets
            </h2>

            {!bookingComplete ? (
              <form onSubmit={handleBooking} className="space-y-5">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 block uppercase">Ticket Tier</label>
                  {event.ticketTypes.map(ticket => (
                    <div
                      key={ticket.ticketTypeId}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        selectedTicket?.ticketTypeId === ticket.ticketTypeId
                          ? 'bg-indigo-950 border-indigo-600'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{ticket.name}</span>
                        <span className="text-sm font-extrabold text-white">${ticket.price.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{ticket.description}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 block uppercase">Quantity</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="input-solid"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n} className="bg-slate-900">{n} Ticket{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total Price</span>
                  <span className="text-2xl font-extrabold text-white">${totalAmount.toFixed(2)}</span>
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3">
                  Confirm & Pay Now
                </button>
              </form>
            ) : (
              <div className="bg-slate-950 border border-emerald-800/60 rounded-xl p-5 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto text-white">
                  <Check size={24} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">Booking Confirmed!</h3>
                  <p className="text-xs text-slate-400 mt-1">Digital QR Pass generated & sent to your email.</p>
                </div>

                <div className="bg-white p-3 rounded-lg w-40 h-40 mx-auto flex items-center justify-center border border-slate-700">
                  <QrCode size={120} className="text-slate-900" />
                </div>

                <div className="text-xs text-slate-300 font-mono bg-slate-900 py-1.5 px-3 rounded border border-slate-800">
                  CODE: TKT-9A82B3C4
                </div>

                <Link to="/my-tickets" className="btn-primary w-full justify-center text-xs">
                  View in My Tickets
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
