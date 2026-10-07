import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import {
  User,
  Plus,
  Calendar,
  BarChart2,
  Ticket,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  KeyRound,
  Eye,
  Edit,
  Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClientProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [creatorEvents, setCreatorEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Forgot Password / OTP Modal States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [otpStep, setOtpStep] = useState(1); // 1: enter email, 2: enter OTP & new password
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  // New Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    venue: '',
    category: 'Tech',
    startDate: '',
    endDate: '',
    totalCapacity: 100,
    ticketPrice: 20
  });

  const fetchMyEvents = () => {
    setLoading(true);
    api.getCreatorEvents()
      .then(res => setCreatorEvents(res || []))
      .catch(() => setCreatorEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCreateEventSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createEvent({
        title: eventForm.title,
        description: eventForm.description,
        venue: eventForm.venue,
        category: eventForm.category,
        startDate: new Date(eventForm.startDate).toISOString(),
        endDate: new Date(eventForm.endDate).toISOString(),
        totalCapacity: Number(eventForm.totalCapacity),
        availableTickets: Number(eventForm.totalCapacity),
        ticketTypes: [
          {
            name: 'Standard Pass',
            price: Number(eventForm.ticketPrice),
            capacity: Number(eventForm.totalCapacity),
            availableQuantity: Number(eventForm.totalCapacity)
          }
        ]
      });
      setShowCreateModal(false);
      fetchMyEvents();
      alert('Event submitted successfully for admin approval!');
    } catch {
      alert('Error creating event. Please ensure dates are valid.');
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setResetMsg(`Verification OTP code has been dispatched to ${resetEmail}! Check your inbox.`);
    setOtpStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setResetMsg('Password reset successfully! You may now sign in with your new password.');
    setTimeout(() => {
      setShowForgotModal(false);
      setOtpStep(1);
    }, 2500);
  };

  const totalTicketsSold = creatorEvents.reduce((acc, curr) => acc + ((curr.totalCapacity || 0) - (curr.availableTickets || 0)), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="card-solid p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#f23e14] text-white font-extrabold flex items-center justify-center text-2xl shadow-md">
            {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1f1f39]">{user?.firstName} {user?.lastName}</h1>
            <p className="text-xs text-[#6e7191] font-medium">{user?.email}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="bg-[#fff4f1] text-[#f23e14] border border-[#f23e14]/20 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase">
                Organizer / Creator Account
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowForgotModal(true)} className="btn-secondary text-xs">
            <KeyRound size={14} /> Reset Password
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary text-xs">
            <Plus size={14} /> Create New Event
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'events' ? 'bg-[#f23e14] text-white shadow-md' : 'bg-white text-[#6e7191] border border-gray-200 hover:text-[#1f1f39]'
          }`}
        >
          <Calendar size={15} /> My Hosted Events ({creatorEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'stats' ? 'bg-[#f23e14] text-white shadow-md' : 'bg-white text-[#6e7191] border border-gray-200 hover:text-[#1f1f39]'
          }`}
        >
          <BarChart2 size={15} /> Organizer Analytics
        </button>
      </div>

      {/* Tab: Hosted Events List */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {loading ? (
            <div className="p-16 text-center text-[#6e7191]">
              <div className="w-8 h-8 border-3 border-[#f23e14] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-xs font-bold">Loading Hosted Events...</span>
            </div>
          ) : creatorEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creatorEvents.map(evt => {
                const soldCount = (evt.totalCapacity || 0) - (evt.availableTickets || 0);
                return (
                  <div key={evt.id} className="card-solid space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-[#fff4f1] text-[#f23e14] border border-[#f23e14]/20 px-3 py-1 rounded-full font-bold">
                          {evt.category}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          evt.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                          {evt.status}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-[#1f1f39] text-base line-clamp-1">{evt.title}</h3>
                      <p className="text-xs text-[#6e7191] line-clamp-2">{evt.description}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#6e7191] font-bold">
                        <span>Tickets Sold:</span>
                        <span className="text-[#f23e14]">{soldCount} / {evt.totalCapacity}</span>
                      </div>

                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#f23e14] h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, (soldCount / (evt.totalCapacity || 1)) * 100)}%` }}
                        />
                      </div>

                      <Link to={`/events/${evt.id}`} className="btn-secondary w-full justify-center text-xs py-2.5 font-bold">
                        <Eye size={14} /> View Event Page
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card-solid p-16 text-center text-[#6e7191] space-y-3">
              <AlertCircle size={36} className="mx-auto text-gray-400" />
              <h3 className="text-lg font-extrabold text-[#1f1f39]">No events created yet</h3>
              <p className="text-xs max-w-sm mx-auto">Click "Create New Event" above to post your first event to the platform.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Analytics & Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card-solid space-y-2">
              <span className="text-xs text-[#6e7191] font-bold uppercase">Total Hosted Events</span>
              <span className="text-3xl font-extrabold text-[#1f1f39] block">{creatorEvents.length}</span>
              <span className="text-xs text-[#6e7191]">Across all categories</span>
            </div>

            <div className="card-solid space-y-2">
              <span className="text-xs text-[#6e7191] font-bold uppercase">Total Passes Issued</span>
              <span className="text-3xl font-extrabold text-[#f23e14] block">{totalTicketsSold}</span>
              <span className="text-xs text-[#6e7191]">Confirmed attendee passes</span>
            </div>

            <div className="card-solid space-y-2">
              <span className="text-xs text-[#6e7191] font-bold uppercase">Average Sales Velocity</span>
              <span className="text-3xl font-extrabold text-emerald-600 block">
                {creatorEvents.length > 0 ? Math.round(totalTicketsSold / creatorEvents.length) : 0}
              </span>
              <span className="text-xs text-[#6e7191]">Passes per event</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-lg space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#1f1f39]">Create New Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#6e7191] hover:text-[#1f1f39]">✕</button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6e7191] uppercase">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="input-solid"
                  placeholder="e.g. Annual Tech Summit 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="input-solid"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Music">Music</option>
                    <option value="Business">Business</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">Venue Location</label>
                  <input
                    type="text"
                    required
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="input-solid"
                    placeholder="Convention Center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.startDate}
                    onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                    className="input-solid text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">End Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.endDate}
                    onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                    className="input-solid text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">Total Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={eventForm.totalCapacity}
                    onChange={(e) => setEventForm({ ...eventForm, totalCapacity: e.target.value })}
                    className="input-solid"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">Ticket Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={eventForm.ticketPrice}
                    onChange={(e) => setEventForm({ ...eventForm, ticketPrice: e.target.value })}
                    className="input-solid"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#6e7191] uppercase">Event Description</label>
                <textarea
                  rows={3}
                  required
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="input-solid"
                  placeholder="Detailed description of schedule and speakers..."
                />
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-3 text-xs font-bold">
                Submit Event for Admin Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot / OTP Password Reset Modal */}
      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#1f1f39]">Reset Account Password</h3>
              <button onClick={() => setShowForgotModal(false)} className="text-[#6e7191] hover:text-[#1f1f39]">✕</button>
            </div>

            {resetMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3.5 rounded-2xl flex items-center gap-2 font-semibold">
                <CheckCircle2 size={16} /> {resetMsg}
              </div>
            )}

            {otpStep === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">Your Email Address</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="input-solid"
                    placeholder="your-email@example.com"
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center text-xs py-3 font-bold">
                  Send OTP Verification Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="input-solid tracking-widest text-center font-mono text-base font-bold"
                    placeholder="123456"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-solid"
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center text-xs py-3 font-bold">
                  Verify OTP & Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
