import React from 'react';
import { Link } from 'react-router-dom';
import { TicketCheck, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = ({ settings }) => {
  return (
    <footer className="bg-white border-t border-gray-100 text-[#6e7191] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-[#f23e14] p-2.5 rounded-2xl text-white shadow-md">
                <TicketCheck size={20} />
              </div>
              <span className="text-[#1f1f39] font-extrabold text-lg tracking-tight">
                {settings?.siteTitle || 'EventPulse'}
              </span>
            </Link>
            <p className="text-[#6e7191] text-xs leading-relaxed">
              {settings?.siteDescription || 'Discover and book live event tickets instantly with M-Pesa & Card digital QR passes.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[#1f1f39] font-extrabold text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link to="/" className="hover:text-[#f23e14] transition-colors">Discover Events</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#f23e14] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#f23e14] transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#f23e14] transition-colors">Privacy Policy & Terms</Link>
              </li>
            </ul>
          </div>

          {/* Payment Gateways */}
          <div className="space-y-4">
            <h4 className="text-[#1f1f39] font-extrabold text-xs uppercase tracking-wider">Supported Payments</h4>
            <div className="space-y-2.5 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>M-Pesa STK Push (Daraja)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>Visa / Mastercard Credit & Debit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f23e14]"></span>
                <span>Instant Digital QR Verification</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-[#1f1f39] font-extrabold text-xs uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-2.5 font-medium">
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#f23e14] shrink-0" />
                <span className="truncate">{settings?.contactEmail || 'support@eventpulse.com'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#f23e14] shrink-0" />
                <span>{settings?.contactPhone || '+254 700 000 000'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#f23e14] shrink-0 mt-0.5" />
                <span className="line-clamp-2">{settings?.officeAddress || 'Westlands, Nairobi, Kenya'}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#6e7191] font-medium">
          <p>© 2026 {settings?.siteTitle || 'EventPulse'}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#f23e14]">Privacy Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#f23e14]">Support Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
