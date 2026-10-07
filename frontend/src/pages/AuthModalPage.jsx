import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ShieldCheck } from 'lucide-react';

export const AuthModalPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login({ email, password, firstName, lastName });
      navigate('/');
    } catch (err) {
      setErrorMsg('Login or registration failed. Using demo access mode.');
      setTimeout(() => navigate('/'), 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card-solid space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto text-white mb-2">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">{isRegister ? 'Create Account' : 'Sign In to EventPulse'}</h1>
          <p className="text-xs text-slate-400">Access your tickets, creator dashboard, and admin portal</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-950 border border-rose-800 text-rose-300 text-xs p-3 rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">First Name</label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-solid" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Last Name</label>
                <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-solid" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
              <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-solid pl-9 py-2 text-xs" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" size={16} />
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="input-solid pl-9 py-2 text-xs" />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-2.5 text-sm mt-2">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <button onClick={() => setIsRegister(!isRegister)} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
