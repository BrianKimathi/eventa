import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Ticket,
  Tag,
  BarChart3,
  UserCheck,
  Bell,
  Settings,
  ShieldAlert,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  CreditCard,
  Building2,
  FolderPlus,
  Sparkles,
  PlusCircle
} from 'lucide-react';

export const AdminShell = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'EVENT MANAGEMENT',
      items: [
        { label: 'Events Directory', path: '/admin/events', icon: Calendar },
        { label: 'Event Categories', path: '/admin/categories', icon: FolderPlus },
        { label: 'Venues Directory', path: '/admin/venues', icon: Building2 }
      ]
    },
    {
      title: 'SALES & PROMOTIONS',
      items: [
        { label: 'Orders & Tickets', path: '/admin/orders', icon: ShoppingBag },
        { label: 'Promotions', path: '/admin/promotions', icon: Tag }
      ]
    },
    {
      title: 'INSIGHTS & REPORTS',
      items: [
        { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 }
      ]
    },
    {
      title: 'SYSTEM CONTROL',
      items: [
        { label: 'User & Staff Permissions', path: '/admin/staff', icon: UserCheck },
        { label: 'Platform & App Settings', path: '/admin/settings', icon: Settings },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7f7fc] flex text-[#1f1f39] font-sans">
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col justify-between p-3 transition-all duration-200 sticky top-0 h-screen shrink-0 z-30 shadow-sm`}>
        <div className="space-y-6 overflow-y-auto no-scrollbar pr-1">
          <div className="flex items-center justify-between px-2 pt-2 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              {!collapsed && (
                <div>
                  <span className="font-extrabold text-[#1f1f39] text-xl tracking-tight block">Eventa</span>
                  <span className="text-[10px] text-[#f23e14] font-bold uppercase tracking-wider block">Admin SaaS</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-[#6e7191] hover:text-[#1f1f39] p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="space-y-6">
            {navigationSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                {!collapsed && (
                  <div className="text-[10px] font-extrabold text-[#6e7191] uppercase px-3 mb-1.5 tracking-wider">
                    {sec.title}
                  </div>
                )}
                {sec.items.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#f23e14] text-white shadow-sm'
                          : 'text-[#6e7191] hover:bg-[#fff4f1] hover:text-[#f23e14]'
                      } ${collapsed ? 'justify-center' : ''}`}
                    >
                      <Icon size={18} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="pt-3 border-t border-gray-100">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-full bg-[#f23e14] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {user?.firstName ? user.firstName[0] : 'A'}
                </div>
                <div className="truncate text-xs">
                  <span className="font-bold text-[#1f1f39] block truncate">{user?.firstName || 'Admin'}</span>
                  <span className="text-[11px] text-[#6e7191] block truncate">{user?.email || 'admin@eventpulse.com'}</span>
                </div>
              </div>
              <button onClick={logout} className="text-[#6e7191] hover:text-rose-600 p-1.5" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={logout} className="w-full flex justify-center text-[#6e7191] hover:text-rose-600 py-2" title="Sign Out">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header with Non-overlapping Search Bar */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3.5 top-3.5 text-[#6e7191] pointer-events-none" size={16} />
            <input
              type="text"
              placeholder="Search events, orders, attendees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-solid pl-10 pr-4 py-2.5 text-xs rounded-xl"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link to="/admin/events/create" className="btn-primary text-xs px-4 py-2.5">
              <PlusCircle size={15} /> Create Event
            </Link>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
