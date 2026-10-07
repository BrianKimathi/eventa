import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Ticket, ArrowLeft, Check, QrCode, Download, MailCheck, AlertCircle } from 'lucide-react';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('MPESA');
  const [bookingComplete, setBookingComplete] = useState(false);
  const [purchaseCode, setPurchaseCode] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getEventById(id)
      .then(res => {
        if (res && res.data) {
          setEvent(res.data);
          if (res.data.ticketTypes && res.data.ticketTypes.length > 0) {
            setSelectedTicket(res.data.ticketTypes[0]);
          }
        }
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to complete your ticket purchase.');
      navigate('/auth');
      return;
    }

    setErrorMsg('');
    try {
      const res = await api.purchaseTicket({
        eventId: Number(id),
        ticketTypeId: selectedTicket ? selectedTicket.ticketTypeId : null,
        quantity,
        paymentMethod
      });

      const purchasedData = res.data || res;
      if (purchasedData && purchasedData.purchaseCode) {
        setPurchaseCode(purchasedData.purchaseCode);
        setQrCodeData(purchasedData.qrCodeData || purchasedData.purchaseCode);
        setBookingComplete(true);
      }
    } catch (err) {
      setErrorMsg('Ticket purchase failed. Please check ticket availability or try again.');
    }
  };

  const handleDownloadQrPass = () => {
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
    ctx.fillText(event?.title || 'Event Ticket Pass', 20, 40);

    // Pass Name
    ctx.fillStyle = '#1f1f39';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${selectedTicket?.name || 'Pass'} (${quantity} Ticket)`, 20, 105);

    // Code Box
    ctx.fillStyle = '#fff4f1';
    ctx.fillRect(20, 120, 360, 40);
    ctx.fillStyle = '#f23e14';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`CODE: ${purchaseCode}`, 30, 145);

    // QR Container Box
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(100, 180, 200, 200);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(purchaseCode, 140, 280);

    ctx.fillStyle = '#6e7191';
    ctx.font = '12px sans-serif';
    ctx.fillText('Present this pass at event entrance gate', 80, 410);

    const link = document.createElement('a');
    link.download = `Pass-${purchaseCode}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-[#6e7191]">
        <div className="w-8 h-8 border-3 border-[#f23e14] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <span className="text-xs font-bold">Loading Event Details...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="card-solid p-12 text-center space-y-4 max-w-lg mx-auto my-10">
        <AlertCircle size={36} className="mx-auto text-gray-400" />
        <p className="text-[#1f1f39] font-extrabold text-lg">Event not found.</p>
        <Link to="/" className="btn-primary text-xs">Back to Discovery</Link>
      </div>
    );
  }

  const totalAmount = selectedTicket ? (selectedTicket.price || 0) * quantity : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-[#6e7191] hover:text-[#f23e14] text-sm font-bold transition-colors">
        <ArrowLeft size={16} /> Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <img
              src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'}
              alt={event.title}
              className="w-full h-80 object-cover"
            />
            
            <div className="p-8 space-y-4">
              <span className="bg-[#fff4f1] text-[#f23e14] border border-[#f23e14]/20 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase">
                {event.category}
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1f1f39]">{event.title}</h1>

              <div className="flex flex-wrap gap-6 text-sm text-[#6e7191] font-semibold pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#f23e14]" />
                  <span>{new Date(event.startDate).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#f23e14]" />
                  <span>{event.venue}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-solid space-y-3">
            <h2 className="text-lg font-extrabold text-[#1f1f39]">About this Event</h2>
            <p className="text-[#6e7191] text-sm leading-relaxed">{event.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-solid space-y-6">
            <h2 className="text-xl font-extrabold text-[#1f1f39] flex items-center gap-2">
              <Ticket className="text-[#f23e14]" size={22} /> Select Tickets
            </h2>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-4 rounded-2xl font-semibold">
                {errorMsg}
              </div>
            )}

            {!bookingComplete ? (
              <form onSubmit={handleBooking} className="space-y-5">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#6e7191] block uppercase">Ticket Tier</label>
                  {event.ticketTypes && event.ticketTypes.length > 0 ? (
                    event.ticketTypes.map(ticket => (
                      <div
                        key={ticket.ticketTypeId}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedTicket?.ticketTypeId === ticket.ticketTypeId
                            ? 'bg-[#fff4f1] border-[#f23e14]'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-[#1f1f39]">{ticket.name}</span>
                          <span className="text-sm font-extrabold text-[#f23e14]">${(ticket.price || 0).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-[#6e7191] mt-1">{ticket.description || 'Standard admission pass'}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-white rounded-2xl border border-gray-200 text-xs text-[#6e7191] font-bold">
                      Standard Admission Pass — ${(100).toFixed(2)}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#6e7191] block uppercase">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="input-solid"
                  >
                    <option value="MPESA">M-Pesa STK Push (Mobile Money)</option>
                    <option value="CARD">Visa / Mastercard Credit Card</option>
                    <option value="BTC">Bitcoin BTC (NOWPayments Sandbox)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#6e7191]">Total Price</span>
                  <span className="text-3xl font-extrabold text-[#f23e14]">${totalAmount.toFixed(2)}</span>
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3.5 text-sm">
                  Confirm & Pay via {paymentMethod === 'BTC' ? 'Bitcoin (NOWPayments)' : paymentMethod === 'MPESA' ? 'M-Pesa' : 'Card'}
                </button>
              </form>
            ) : (
              <div className="bg-[#fff4f1] border border-[#f23e14]/30 rounded-2xl p-6 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-md">
                  <Check size={28} />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#1f1f39]">Booking Confirmed!</h3>
                  <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1 mt-1">
                    <MailCheck size={14} /> Pass Dispatched to Email!
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto flex items-center justify-center border border-gray-200 shadow-sm">
                  <QrCode size={130} className="text-[#1f1f39]" />
                </div>

                <div className="text-xs font-bold text-[#f23e14] font-mono bg-white py-2 px-4 rounded-xl border border-gray-200">
                  CODE: {purchaseCode}
                </div>

                <div className="space-y-2 pt-2">
                  <button onClick={handleDownloadQrPass} className="btn-primary w-full justify-center text-xs">
                    <Download size={14} /> Download Event QR Card
                  </button>

                  <Link to="/my-tickets" className="btn-secondary w-full justify-center text-xs">
                    View in My Tickets
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
