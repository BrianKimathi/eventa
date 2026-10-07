import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Percent,
  PlusCircle,
  LogOut,
  Shield,
  Ticket,
  DollarSign,
  Bell,
  Search,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Event Moderation', path: '/admin/events', icon: CalendarCheck },
    { label: 'Create New Event', path: '/admin/events/create', icon: PlusCircle },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Commission Rules', path: '/admin/commissions', icon: Percent },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans">
      {/* Dedicated Admin Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0">
        <div className="space-y-6">
          {/* Admin Brand Logo */}
          <div className="flex items-center gap-3 px-2 pt-2 border-b border-slate-800 pb-4">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Shield size={22} />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block">ShopKing Admin</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Event Control Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase px-3 mb-2 tracking-wider">Main Navigation</div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-white" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin User Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
              {user?.firstName ? user.firstName[0] : 'A'}
            </div>
            <div className="truncate">
              <span className="text-sm font-bold text-white block truncate">{user?.firstName || 'Administrator'}</span>
              <span className="text-xs text-slate-400 block truncate">{user?.email || 'admin@eventbooking.com'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/" className="btn-secondary text-xs flex-1 justify-center py-1.5">
              Frontend Store
            </Link>
            <button onClick={logout} className="btn-secondary text-xs px-2.5 py-1.5" title="Sign Out">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">Event Booking Management Panel</h2>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              System Online
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-400">
              Role: <span className="font-bold text-indigo-400 uppercase">System Administrator</span>
            </div>
          </div>
        </header>

        {/* Render Child Admin Routes */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
