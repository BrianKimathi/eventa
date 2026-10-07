import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';

export const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase">
          Legal & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy & Terms of Service</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Last updated: August 2026. How we collect, handle, and protect your personal ticketing & payment information.
        </p>
      </div>

      <div className="space-y-6">
        <div className="card-solid space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="text-indigo-400" size={18} /> 1. Information Collection & Usage
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            When you register, create an account, or purchase tickets on EventPulse, we collect essential information including your name, email address, and phone number required for ticket issuance and verification.
          </p>
        </div>

        <div className="card-solid space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="text-indigo-400" size={18} /> 2. M-Pesa & Payment Security
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            All financial transactions conducted via M-Pesa Daraja, credit cards, or third-party payment gateways are processed through encrypted, PCI-DSS compliant API endpoints. We do not store raw mobile money PINs or full credit card numbers on our servers.
          </p>
        </div>

        <div className="card-solid space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="text-indigo-400" size={18} /> 3. Digital QR Ticket Verification
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            Each ticket pass includes a unique QR code generated specifically for gate scanners. Gate operators scan the QR code to validate your entry in real time. Your personal data is never publicly exposed via the QR code.
          </p>
        </div>

        <div className="card-solid space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="text-indigo-400" size={18} /> 4. Data Protection Rights
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            You have the right to request access to your personal data, update your account information, or request account deletion by contacting our support team at support@eventpulse.com.
          </p>
        </div>
      </div>
    </div>
  );
};
