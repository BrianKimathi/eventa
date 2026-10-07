import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials or network error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7fc] flex items-center justify-center p-4 font-sans">
      <div className="card-solid w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-[#1f1f39] tracking-tight">Eventa</h1>
          <p className="text-xs text-[#6e7191] font-semibold">Sign in with administrator account to manage platform</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3.5 rounded-xl flex items-center gap-2 font-semibold">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#6e7191] uppercase">Admin Email</label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-solid py-3 text-sm"
                placeholder="admin@eventpulse.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#6e7191] uppercase">Password</label>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-solid py-3 text-sm"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3.5 text-xs font-extrabold">
            {submitting ? 'Authenticating...' : 'Sign In to Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};
