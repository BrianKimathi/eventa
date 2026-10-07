import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle2, Globe, Clock } from 'lucide-react';

export const ContactPage = () => {
  const [settings, setSettings] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    api.getPlatformSettings()
      .then(res => setSettings(res))
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Contact Our Support Team</h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Have questions about ticket purchases, event hosting, or payments? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dynamic Admin Settings Info */}
        <div className="space-y-6">
          <div className="card-solid space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Contact Information</h2>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <Mail className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-xs text-slate-400 font-bold block uppercase">Email Address</span>
                  <a href={`mailto:${settings?.contactEmail || 'support@eventpulse.com'}`} className="hover:text-white font-semibold">
                    {settings?.contactEmail || 'support@eventpulse.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-xs text-slate-400 font-bold block uppercase">Phone Support</span>
                  <a href={`tel:${settings?.contactPhone || '+254 700 000 000'}`} className="hover:text-white font-semibold">
                    {settings?.contactPhone || '+254 700 000 000'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-xs text-slate-400 font-bold block uppercase">Head Office</span>
                  <span className="font-semibold">{settings?.officeAddress || 'Westlands Commercial Center, Nairobi, Kenya'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-xs text-slate-400 font-bold block uppercase">Support Hours</span>
                  <span className="font-semibold">Monday – Saturday: 8:00 AM – 6:00 PM EAT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="card-solid space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Send Us a Direct Message</h2>

            {submitted ? (
              <div className="bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-xl p-8 text-center space-y-3">
                <CheckCircle2 size={36} className="mx-auto text-emerald-400" />
                <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-300">
                  Thank you for reaching out. Our support team will review your inquiry and get back to you shortly at {formData.email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-solid"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-solid"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-solid"
                    placeholder="Ticket Inquiry / Payment Assistance"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-solid"
                    placeholder="Type your detailed message here..."
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3 text-xs font-bold">
                  <Send size={15} /> Send Message Now
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AboutPage = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getPlatformSettings()
      .then(res => setSettings(res))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <span className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
          About EventPulse
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          {settings?.siteTitle || 'EventPulse Ticketing Platform'}
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
          {settings?.siteDescription || 'EventPulse is a modern ticketing and event management ecosystem empowering organizers and attendees with instant digital tickets.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-solid space-y-2">
          <h3 className="font-bold text-white text-base">Instant M-Pesa & Card Passes</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Direct STK Push M-Pesa and secure card payment integrations ensure tickets are generated instantly with verification QR codes.
          </p>
        </div>

        <div className="card-solid space-y-2">
          <h3 className="font-bold text-white text-base">Real-Time Validation</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Organizers use scanner tools to validate ticket QR codes at venue gates, preventing duplicates and ensuring seamless entry.
          </p>
        </div>

        <div className="card-solid space-y-2">
          <h3 className="font-bold text-white text-base">Automated Notifications</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Every booking dispatches digital confirmation receipts and downloadable passes directly to the attendee email address.
          </p>
        </div>
      </div>
    </div>
  );
};
