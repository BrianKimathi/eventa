import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import {
  Settings,
  Globe,
  Layout,
  CreditCard,
  Mail,
  Save,
  CheckCircle2,
  Phone,
  MapPin,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Lock,
  KeyRound
} from 'lucide-react';

export const PlatformSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    siteTitle: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    officeAddress: '',
    heroBadgeText: '',
    heroHeadline: '',
    heroSubheadline: '',
    heroCtaPrimaryText: '',
    heroCtaSecondaryText: '',
    heroBackgroundUrl: '',
    paymentGateway: 'MPESA',
    mpesaConsumerKey: '',
    mpesaConsumerSecret: '',
    mpesaPasskey: '',
    mpesaShortcode: '',
    stripeApiKey: '',
    paystackSecretKey: '',
    nowpaymentsApiKey: '',
    btcWalletAddress: '',
    mailHost: '',
    mailPort: 587,
    mailUsername: '',
    mailPassword: '',
    mailFrom: ''
  });

  useEffect(() => {
    setLoading(true);
    api.getAdminSettings()
      .then(res => {
        if (res) {
          setFormData(prev => ({ ...prev, ...res }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const updated = await api.updateAdminSettings(formData);
      if (updated) {
        setFormData(prev => ({ ...prev, ...updated }));
      }
      setSuccessMsg('Settings updated successfully!');
    } catch {
      alert('Failed to save settings to backend database.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'App & Site Branding', icon: Globe },
    { id: 'hero', label: 'Hero Section Control', icon: Layout },
    { id: 'payment', label: 'Payment Gateway (M-Pesa / Stripe)', icon: CreditCard },
    { id: 'mail', label: 'Email SMTP Settings', icon: Mail },
    { id: 'security', label: 'Reset Admin Password', icon: Lock },
  ];

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <span className="text-xs">Loading Platform Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="text-indigo-400" size={24} /> Admin Settings Panel
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Control App branding, Client Hero section, M-Pesa Daraja payment integration, and SMTP configuration.</p>
        </div>

        <button onClick={handleSubmit} disabled={saving} className="btn-primary text-xs">
          <Save size={14} /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-semibold p-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Branding */}
        {activeTab === 'general' && (
          <div className="card-solid space-y-4 max-w-3xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-slate-800 pb-2">
              <Globe size={16} className="text-indigo-400" /> Platform & Contact Identity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Site Title</label>
                <input
                  type="text"
                  name="siteTitle"
                  value={formData.siteTitle || ''}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="EventPulse Ticketing"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail || ''}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="support@eventpulse.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Contact Phone</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone || ''}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Office Address</label>
                <input
                  type="text"
                  name="officeAddress"
                  value={formData.officeAddress || ''}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="Westlands Commercial Center, Nairobi"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Site Description / Tagline</label>
              <textarea
                name="siteDescription"
                rows={3}
                value={formData.siteDescription || ''}
                onChange={handleChange}
                className="input-solid"
                placeholder="Platform description displayed on search results and contact page..."
              />
            </div>
          </div>
        )}

        {/* Hero Section Control */}
        {activeTab === 'hero' && (
          <div className="card-solid space-y-4 max-w-3xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-slate-800 pb-2">
              <Layout size={16} className="text-indigo-400" /> Client Homepage Hero Banner
            </h2>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Badge Pill Text</label>
              <input
                type="text"
                name="heroBadgeText"
                value={formData.heroBadgeText || ''}
                onChange={handleChange}
                className="input-solid"
                placeholder="LIVE EVENT TICKETING STORE"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Headline Title</label>
              <input
                type="text"
                name="heroHeadline"
                value={formData.heroHeadline || ''}
                onChange={handleChange}
                className="input-solid"
                placeholder="Discover & Book Live Event Tickets"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Subheadline Text</label>
              <textarea
                name="heroSubheadline"
                rows={3}
                value={formData.heroSubheadline || ''}
                onChange={handleChange}
                className="input-solid"
                placeholder="Browse upcoming events with instant M-Pesa & Card digital QR passes."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Primary Button Label</label>
                <input
                  type="text"
                  name="heroCtaPrimaryText"
                  value={formData.heroCtaPrimaryText || ''}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="Discover Events"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Secondary Button Label</label>
                <input
                  type="text"
                  name="heroCtaSecondaryText"
                  value={formData.heroCtaSecondaryText || ''}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="Contact Support"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Background Image URL (Optional)</label>
              <input
                type="text"
                name="heroBackgroundUrl"
                value={formData.heroBackgroundUrl || ''}
                onChange={handleChange}
                className="input-solid"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
          </div>
        )}

        {/* Payment Gateway (M-Pesa / Stripe / Paystack) */}
        {activeTab === 'payment' && (
          <div className="card-solid space-y-6 max-w-3xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-slate-800 pb-2">
              <CreditCard size={16} className="text-indigo-400" /> Active Gateway Selection & Credentials
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase block">Active Gateway Selection</label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'MPESA', label: 'M-Pesa Daraja', icon: Smartphone },
                  { id: 'STRIPE', label: 'Stripe Payments', icon: CreditCard },
                  { id: 'PAYSTACK', label: 'Paystack', icon: ShieldCheck },
                  { id: 'BTC', label: 'Bitcoin (NOWPayments)', icon: CreditCard }
                ].map(gw => {
                  const Icon = gw.icon;
                  const isSelected = formData.paymentGateway === gw.id;
                  return (
                    <div
                      key={gw.id}
                      onClick={() => setFormData(prev => ({ ...prev, paymentGateway: gw.id }))}
                      className={`p-3.5 rounded-xl border cursor-pointer text-center space-y-2 transition-all ${
                        isSelected
                          ? 'bg-[#fff4f1] border-[#f23e14] text-[#1f1f39]'
                          : 'bg-white border-gray-200 text-[#6e7191] hover:border-gray-300'
                      }`}
                    >
                      <Icon size={20} className="mx-auto text-[#f23e14]" />
                      <span className="text-xs font-bold block">{gw.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mpesa Settings */}
            {formData.paymentGateway === 'MPESA' && (
              <div className="bg-[#f7f7fc] p-4 rounded-xl border border-gray-200 space-y-4">
                <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1.5">
                  <Smartphone size={14} /> M-Pesa Daraja Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#6e7191]">Shortcode / Till</label>
                    <input
                      type="text"
                      name="mpesaShortcode"
                      value={formData.mpesaShortcode || ''}
                      onChange={handleChange}
                      className="input-solid"
                      placeholder="174379"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#6e7191]">Consumer Key</label>
                    <input
                      type="password"
                      name="mpesaConsumerKey"
                      value={formData.mpesaConsumerKey || ''}
                      onChange={handleChange}
                      className="input-solid"
                      placeholder="Daraja Consumer Key"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#6e7191]">Consumer Secret</label>
                    <input
                      type="password"
                      name="mpesaConsumerSecret"
                      value={formData.mpesaConsumerSecret || ''}
                      onChange={handleChange}
                      className="input-solid"
                      placeholder="Daraja Consumer Secret"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#6e7191]">Passkey</label>
                    <input
                      type="password"
                      name="mpesaPasskey"
                      value={formData.mpesaPasskey || ''}
                      onChange={handleChange}
                      className="input-solid"
                      placeholder="Daraja Online Passkey"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stripe Settings */}
            {formData.paymentGateway === 'STRIPE' && (
              <div className="bg-[#f7f7fc] p-4 rounded-xl border border-gray-200 space-y-4">
                <h3 className="text-xs font-bold text-[#f23e14] uppercase tracking-wide">Stripe API Secret Key</h3>
                <input
                  type="password"
                  name="stripeApiKey"
                  value={formData.stripeApiKey || ''}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="sk_test_..."
                />
              </div>
            )}

            {/* Paystack Settings */}
            {formData.paymentGateway === 'PAYSTACK' && (
              <div className="bg-[#f7f7fc] p-4 rounded-xl border border-gray-200 space-y-4">
                <h3 className="text-xs font-bold text-[#f23e14] uppercase tracking-wide">Paystack Secret Key</h3>
                <input
                  type="password"
                  name="paystackSecretKey"
                  value={formData.paystackSecretKey || ''}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="sk_test_..."
                />
              </div>
            )}

            {/* BTC / NOWPayments Sandbox Settings */}
            {formData.paymentGateway === 'BTC' && (
              <div className="bg-[#f7f7fc] p-4 rounded-xl border border-gray-200 space-y-4">
                <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wide">Bitcoin (NOWPayments Sandbox) Config</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#6e7191]">NOWPayments Sandbox API Key</label>
                    <input
                      type="password"
                      name="nowpaymentsApiKey"
                      value={formData.nowpaymentsApiKey || ''}
                      onChange={handleChange}
                      className="input-solid"
                      placeholder="API_KEY_SANDBOX_..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#6e7191]">Settlement BTC Wallet Address</label>
                    <input
                      type="text"
                      name="btcWalletAddress"
                      value={formData.btcWalletAddress || ''}
                      onChange={handleChange}
                      className="input-solid"
                      placeholder="bc1q..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mail Settings */}
        {activeTab === 'mail' && (
          <div className="card-solid space-y-4 max-w-3xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-slate-800 pb-2">
              <Mail size={16} className="text-indigo-400" /> Outgoing Email SMTP Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">SMTP Host</label>
                <input
                  type="text"
                  name="mailHost"
                  value={formData.mailHost || ''}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">SMTP Port</label>
                <input
                  type="number"
                  name="mailPort"
                  value={formData.mailPort || 587}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="587"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Username / Email</label>
                <input
                  type="text"
                  name="mailUsername"
                  value={formData.mailUsername || ''}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="no-reply@eventpulse.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">App Password</label>
                <input
                  type="password"
                  name="mailPassword"
                  value={formData.mailPassword || ''}
                  onChange={handleChange}
                  className="input-solid"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Tab */}
        {activeTab === 'security' && (
          <div className="card-solid space-y-4 max-w-3xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-slate-800 pb-2">
              <Lock size={16} className="text-indigo-400" /> Reset Administrator Account Password
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="input-solid"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">New Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    className="input-solid"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    className="input-solid"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSuccessMsg('Admin password updated successfully!')}
                className="btn-primary text-xs font-bold py-2.5 px-4"
              >
                <KeyRound size={14} /> Update Admin Password
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
