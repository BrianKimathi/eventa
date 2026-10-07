import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Key } from 'lucide-react';

export const PaymentSettingsView = () => {
  const [stripeKey, setStripeKey] = useState('sk_test_51Mz...X99a');
  const [stripeSecret, setStripeSecret] = useState('whsec_89a...22b');
  const [mpesaShortcode, setMpesaShortcode] = useState('174379');
  const [mpesaConsumerKey, setMpesaConsumerKey] = useState('MpesaKey_9918A');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CreditCard className="text-indigo-400" size={24} /> Payment Gateway Provider Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Configure Stripe API keys, M-Pesa credentials, and payout settings.</p>
      </div>

      {saved && (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-semibold p-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} /> Payment Gateway Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Stripe Config */}
        <div className="card-solid space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Key size={16} className="text-indigo-400" /> Stripe Payment Integration
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Stripe Secret Key</label>
            <input type="password" value={stripeKey} onChange={(e) => setStripeKey(e.target.value)} className="input-solid font-mono text-xs" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Stripe Webhook Secret</label>
            <input type="password" value={stripeSecret} onChange={(e) => setStripeSecret(e.target.value)} className="input-solid font-mono text-xs" />
          </div>
        </div>

        {/* M-Pesa Config */}
        <div className="card-solid space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck size={16} className="text-emerald-400" /> M-Pesa Express Integration
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Business Shortcode / Till</label>
              <input type="text" value={mpesaShortcode} onChange={(e) => setMpesaShortcode(e.target.value)} className="input-solid font-mono text-xs" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Consumer Key</label>
              <input type="password" value={mpesaConsumerKey} onChange={(e) => setMpesaConsumerKey(e.target.value)} className="input-solid font-mono text-xs" />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full justify-center py-2.5">
          Save Payment Provider Configurations
        </button>
      </form>
    </div>
  );
};
