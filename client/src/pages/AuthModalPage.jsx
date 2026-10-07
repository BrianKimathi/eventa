import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

export const AuthModalPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password, firstName, lastName });
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card-solid space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto text-white mb-2">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">{isRegister ? 'Create Customer Account' : 'Sign In to EventPulse'}</h1>
          <p className="text-xs text-slate-400">Access your purchased ticket passes and event bookings</p>
        </div>

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
            <label className="text-xs font-bold text-[#6e7191] uppercase">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-gray-400 pointer-events-none" size={18} />
              <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-solid !pl-11 py-2.5 text-xs" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#6e7191] uppercase">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-gray-400 pointer-events-none" size={18} />
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="input-solid !pl-11 py-2.5 text-xs" />
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
