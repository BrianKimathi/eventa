import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Ticket,
  Mail,
  Info,
  Calendar,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Discover Events', icon: Calendar },
    { to: '/about', label: 'About Us', icon: Info },
    { to: '/contact', label: 'Contact Us', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo - Just Eventa without icons */}
          <Link to="/" className="flex items-center group shrink-0">
            <div>
              <span className="text-[#1f1f39] font-extrabold text-2xl tracking-tight block leading-tight group-hover:text-[#f23e14] transition-colors">Eventa</span>
              <span className="text-[#f23e14] text-[11px] font-bold uppercase tracking-wider block leading-tight">Ticketing Store</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  isActive(to)
                    ? 'bg-[#f23e14] text-white shadow-md'
                    : 'text-[#6e7191] hover:text-[#1f1f39] hover:bg-[#fff4f1]'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}

            {user && (
              <Link
                to="/my-tickets"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  isActive('/my-tickets')
                    ? 'bg-[#f23e14] text-white shadow-md'
                    : 'text-[#6e7191] hover:text-[#1f1f39] hover:bg-[#fff4f1]'
                }`}
              >
                <Ticket size={16} />
                My Tickets
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#fff4f1] border border-[#f23e14]/20 hover:border-[#f23e14] transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f23e14] flex items-center justify-center font-bold text-xs text-white shadow-sm">
                    {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:block text-[#1f1f39] text-xs font-bold">{user.firstName}</span>
                  <ChevronDown size={14} className="text-[#6e7191]" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-50 space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#1f1f39] hover:bg-[#fff4f1] hover:text-[#f23e14] rounded-xl transition-colors"
                    >
                      <User size={15} /> My Profile & Hosted Events
                    </Link>
                    <Link
                      to="/my-tickets"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#1f1f39] hover:bg-[#fff4f1] hover:text-[#f23e14] rounded-xl transition-colors"
                    >
                      <Ticket size={15} /> My Tickets
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth" className="text-xs font-bold text-[#6e7191] hover:text-[#1f1f39] px-4 py-2.5 rounded-full hover:bg-[#fff4f1] transition-colors">
                  Sign In
                </Link>
                <Link to="/auth?mode=register" className="btn-primary text-xs px-5 py-2.5">
                  Register Free
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-[#1f1f39] hover:text-[#f23e14] p-2"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                isActive(to)
                  ? 'bg-[#f23e14] text-white'
                  : 'text-[#6e7191] hover:bg-[#fff4f1] hover:text-[#f23e14]'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}

          {user && (
            <Link
              to="/my-tickets"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-[#6e7191] hover:bg-[#fff4f1] hover:text-[#f23e14]"
            >
              <Ticket size={18} /> My Tickets
            </Link>
          )}

          {!user && (
            <div className="pt-3 flex flex-col gap-2">
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="btn-secondary text-xs justify-center py-3">
                Sign In
              </Link>
              <Link to="/auth?mode=register" onClick={() => setMobileOpen(false)} className="btn-primary text-xs justify-center py-3">
                Register Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
