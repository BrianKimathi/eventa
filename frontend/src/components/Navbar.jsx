import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Ticket, PlusCircle, Shield, LogOut, TicketCheck } from 'lucide-react';

export const Navbar = () => {
  const { user, switchRole, logout } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-white text-xl font-bold tracking-tight">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <TicketCheck size={20} />
          </div>
          <span>EventPulse</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-slate-300 hover:text-white font-medium text-sm flex items-center gap-1.5 transition-colors">
            <Calendar size={16} /> Discover
          </Link>

          {user && (
            <Link to="/my-tickets" className="text-slate-300 hover:text-white font-medium text-sm flex items-center gap-1.5 transition-colors">
              <Ticket size={16} /> My Tickets
            </Link>
          )}

          {user?.roles?.includes('CREATOR') && (
            <Link to="/creator" className="text-slate-300 hover:text-white font-medium text-sm flex items-center gap-1.5 transition-colors">
              <PlusCircle size={16} /> Creator Studio
            </Link>
          )}

          {user?.roles?.includes('ADMIN') && (
            <Link to="/admin" className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm flex items-center gap-1.5 transition-colors">
              <Shield size={16} /> Admin Panel
            </Link>
          )}
        </nav>

        {/* Role Switcher & User Profile Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">ROLE:</span>
            <select
              value={user?.roles?.includes('ADMIN') ? 'ADMIN' : user?.roles?.includes('CREATOR') ? 'CREATOR' : 'USER'}
              onChange={(e) => switchRole(e.target.value)}
              className="bg-transparent text-sky-400 text-xs font-bold cursor-pointer outline-none"
            >
              <option value="USER" className="bg-slate-900 text-slate-100">Attendee</option>
              <option value="CREATOR" className="bg-slate-900 text-slate-100">Creator</option>
              <option value="ADMIN" className="bg-slate-900 text-slate-100">Admin</option>
            </select>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                {user.firstName[0]}
              </div>
              <button onClick={logout} className="btn-secondary text-xs px-2.5 py-1.5" title="Sign Out">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary text-xs">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
