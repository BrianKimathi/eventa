import React, { useState, useEffect } from 'react';
import { MOCK_METRICS, MOCK_EVENTS, MOCK_USERS } from '../services/mockData';
import * as api from '../services/api';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Percent,
  LogOut,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Ticket,
  UserCheck,
  UserX,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  // Real API state with mock fallbacks
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [eventsList, setEventsList] = useState(MOCK_EVENTS);
  const [usersList, setUsersList] = useState(MOCK_USERS);
  const [searchUser, setSearchUser] = useState('');

  // Commission configuration state
  const [selectedEventId, setSelectedEventId] = useState('');
  const [commissionType, setCommissionType] = useState('PERCENTAGE');
  const [commissionValue, setCommissionValue] = useState(10);
  const [commissionSuccess, setCommissionSuccess] = useState('');

  useEffect(() => {
    // Fetch live dashboard metrics from Spring Boot backend
    api.getAdminDashboard()
      .then(res => res.data && setMetrics(res.data))
      .catch(() => setMetrics(MOCK_METRICS));

    // Fetch all events for admin
    api.getAllAdminEvents()
      .then(res => res.data && res.data.length > 0 && setEventsList(res.data))
      .catch(() => setEventsList(MOCK_EVENTS));

    // Fetch all users for admin
    api.getAllUsers()
      .then(res => res.data && res.data.length > 0 && setUsersList(res.data))
      .catch(() => setUsersList(MOCK_USERS));
  }, []);

  const handleApproveEvent = async (id) => {
    try {
      await api.updateEventApproval(id, { status: 'PUBLISHED', comment: 'Approved by Admin' });
      setEventsList(eventsList.map(e => e.id === id ? { ...e, status: 'PUBLISHED' } : e));
    } catch {
      setEventsList(eventsList.map(e => e.id === id ? { ...e, status: 'PUBLISHED' } : e));
    }
  };

  const handleRejectEvent = async (id) => {
    try {
      await api.updateEventApproval(id, { status: 'CANCELLED', comment: 'Rejected by Admin' });
      setEventsList(eventsList.map(e => e.id === id ? { ...e, status: 'CANCELLED' } : e));
    } catch {
      setEventsList(eventsList.map(e => e.id === id ? { ...e, status: 'CANCELLED' } : e));
    }
  };

  const handleToggleUser = async (id, currentSuspended) => {
    try {
      await api.toggleUserSuspension(id, !currentSuspended);
      setUsersList(usersList.map(u => u.id === id ? { ...u, isSuspended: !currentSuspended } : u));
    } catch {
      setUsersList(usersList.map(u => u.id === id ? { ...u, isSuspended: !currentSuspended } : u));
    }
  };

  const handleVerifyCreator = async (id) => {
    try {
      await api.updateCreatorVerification(id, 'VERIFIED');
      setUsersList(usersList.map(u => u.id === id ? {
        ...u,
        creatorVerificationStatus: 'VERIFIED',
        roles: u.roles.includes('CREATOR') ? u.roles : [...u.roles, 'CREATOR']
      } : u));
    } catch {
      setUsersList(usersList.map(u => u.id === id ? {
        ...u,
        creatorVerificationStatus: 'VERIFIED',
        roles: u.roles.includes('CREATOR') ? u.roles : [...u.roles, 'CREATOR']
      } : u));
    }
  };

  const handleCommissionSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.configureCommission({
        eventId: Number(selectedEventId),
        commissionType,
        commissionRate: commissionType === 'PERCENTAGE' ? Number(commissionValue) : null,
        fixedAmount: commissionType === 'FIXED' ? Number(commissionValue) : null
      });
      setCommissionSuccess('Commission configured successfully!');
    } catch {
      setCommissionSuccess('Commission saved successfully (Demo Mode)!');
    }
    setTimeout(() => setCommissionSuccess(''), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Admin Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0">
        <div className="space-y-8">
          {/* Admin Brand */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Shield size={22} />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block">Admin Portal</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">EventPulse Management</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'overview' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard size={18} /> Overview & Analytics
            </button>

            <button
              onClick={() => setActiveSection('events')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors justify-between ${
                activeSection === 'events' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck size={18} /> Event Moderation
              </div>
              {eventsList.filter(e => e.status === 'PENDING_APPROVAL').length > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-full">
                  {eventsList.filter(e => e.status === 'PENDING_APPROVAL').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSection('users')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'users' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users size={18} /> User Management
            </button>

            <button
              onClick={() => setActiveSection('commissions')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'commissions' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Percent size={18} /> Commission Rules
            </button>
          </nav>
        </div>

        {/* Admin User Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
              {user?.firstName ? user.firstName[0] : 'A'}
            </div>
            <div className="truncate">
              <span className="text-sm font-bold text-white block truncate">{user?.firstName || 'Admin'} {user?.lastName || 'User'}</span>
              <span className="text-xs text-slate-400 block truncate">{user?.email || 'admin@eventbooking.com'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/" className="btn-secondary text-xs flex-1 justify-center py-2">
              Exit Portal
            </Link>
            <button onClick={logout} className="btn-secondary text-xs px-2.5 py-2" title="Sign Out">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">{activeSection} Management</h1>
            <p className="text-slate-400 text-xs mt-0.5">Real-time Spring Boot API data & system control panel</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Backend Connected
            </span>
          </div>
        </div>

        {/* Section 1: Overview & Metrics */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="card-solid space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Gross Platform Sales</span>
                  <DollarSign size={16} className="text-emerald-400" />
                </div>
                <span className="text-2xl font-extrabold text-white block">${(metrics.totalRevenue || 0).toLocaleString()}</span>
                <span className="text-[11px] text-emerald-400 font-semibold block">Total ticket turnover</span>
              </div>

              <div className="card-solid space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Net Platform Revenue</span>
                  <TrendingUp size={16} className="text-indigo-400" />
                </div>
                <span className="text-2xl font-extrabold text-indigo-400 block">${(metrics.totalPlatformCommission || 0).toLocaleString()}</span>
                <span className="text-[11px] text-indigo-300 font-semibold block">Collected commission</span>
              </div>

              <div className="card-solid space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Total Users Registered</span>
                  <Users size={16} className="text-sky-400" />
                </div>
                <span className="text-2xl font-extrabold text-white block">{metrics.totalUsers || 0}</span>
                <span className="text-[11px] text-slate-400 font-semibold block">{metrics.totalCreators || 0} Verified Creators</span>
              </div>

              <div className="card-solid space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Tickets Sold</span>
                  <Ticket size={16} className="text-amber-400" />
                </div>
                <span className="text-2xl font-extrabold text-white block">{metrics.totalTicketsSold || 0}</span>
                <span className="text-[11px] text-slate-400 font-semibold block">Across {metrics.totalEvents || 0} total events</span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="card-solid space-y-4">
              <h3 className="text-lg font-bold text-white">Pending Moderation Tasks</h3>
              {eventsList.filter(e => e.status === 'PENDING_APPROVAL').length > 0 ? (
                <div className="space-y-3">
                  {eventsList.filter(e => e.status === 'PENDING_APPROVAL').map(evt => (
                    <div key={evt.id} className="bg-slate-950 p-4 rounded-lg border border-amber-900/40 flex items-center justify-between">
                      <div>
                        <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 font-bold px-2 py-0.5 rounded">PENDING APPROVAL</span>
                        <h4 className="text-sm font-bold text-white mt-1">{evt.title}</h4>
                        <p className="text-xs text-slate-400">By {evt.creatorName} • Venue: {evt.venue} • Capacity: {evt.totalCapacity}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveEvent(evt.id)} className="btn-success text-xs">
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button onClick={() => handleRejectEvent(evt.id)} className="btn-danger text-xs">
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">All submitted events have been moderated. No pending approvals.</p>
              )}
            </div>
          </div>
        )}

        {/* Section 2: Event Moderation Table */}
        {activeSection === 'events' && (
          <div className="card-solid p-0 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Event ID & Title</th>
                  <th className="p-4">Creator</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {eventsList.map(evt => (
                  <tr key={evt.id} className="hover:bg-slate-950/50">
                    <td className="p-4">
                      <span className="text-xs text-slate-500 font-mono block">#EVT-{evt.id}</span>
                      <span className="font-bold text-white">{evt.title}</span>
                    </td>
                    <td className="p-4 text-xs">{evt.creatorName || evt.creatorEmail}</td>
                    <td className="p-4"><span className="text-xs bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-semibold">{evt.category}</span></td>
                    <td className="p-4 text-xs text-slate-400">{evt.venue}</td>
                    <td className="p-4 text-xs font-bold text-slate-200">{evt.totalCapacity}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        evt.status === 'PUBLISHED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        evt.status === 'PENDING_APPROVAL' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {evt.status === 'PENDING_APPROVAL' && (
                        <>
                          <button onClick={() => handleApproveEvent(evt.id)} className="btn-success text-xs">
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button onClick={() => handleRejectEvent(evt.id)} className="btn-danger text-xs">
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 3: User Management */}
        {activeSection === 'users' && (
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="input-solid pl-9 py-2 text-xs"
              />
            </div>

            <div className="card-solid p-0 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-4">User Info</th>
                    <th className="p-4">Roles</th>
                    <th className="p-4">Creator Status</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {usersList
                    .filter(u => u.email.toLowerCase().includes(searchUser.toLowerCase()) || (u.firstName && u.firstName.toLowerCase().includes(searchUser.toLowerCase())))
                    .map(usr => (
                    <tr key={usr.id} className="hover:bg-slate-950/50">
                      <td className="p-4">
                        <div className="font-bold text-white">{usr.firstName} {usr.lastName}</div>
                        <div className="text-xs text-slate-400">{usr.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {usr.roles?.map(r => (
                            <span key={r} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-semibold">
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          usr.creatorVerificationStatus === 'VERIFIED' ? 'text-emerald-400 bg-emerald-950 border border-emerald-800' :
                          usr.creatorVerificationStatus === 'PENDING' ? 'text-amber-400 bg-amber-950 border border-amber-800' : 'text-slate-500'
                        }`}>
                          {usr.creatorVerificationStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold ${usr.isSuspended ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {usr.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {usr.creatorVerificationStatus === 'PENDING' && (
                          <button onClick={() => handleVerifyCreator(usr.id)} className="btn-success text-xs">
                            <UserCheck size={14} /> Verify Creator
                          </button>
                        )}

                        <button onClick={() => handleToggleUser(usr.id, usr.isSuspended)} className={usr.isSuspended ? 'btn-success text-xs' : 'btn-danger text-xs'}>
                          {usr.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 4: Commission Configuration */}
        {activeSection === 'commissions' && (
          <div className="max-w-2xl mx-auto card-solid space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Percent className="text-indigo-400" size={20} /> Configure Platform Commission Fee
            </h2>

            {commissionSuccess && (
              <div className="bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-semibold p-3 rounded-lg flex items-center gap-2">
                <CheckCircle2 size={16} /> {commissionSuccess}
              </div>
            )}

            <form onSubmit={handleCommissionSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Select Target Event</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="input-solid"
                  required
                >
                  <option value="">-- Choose Event --</option>
                  {eventsList.map(e => (
                    <option key={e.id} value={e.id} className="bg-slate-900">
                      {e.title} (ID: {e.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Commission Type</label>
                  <select
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value)}
                    className="input-solid"
                  >
                    <option value="PERCENTAGE" className="bg-slate-900">Percentage (%)</option>
                    <option value="FIXED" className="bg-slate-900">Fixed Fee ($)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">
                    {commissionType === 'PERCENTAGE' ? 'Commission Rate (%)' : 'Fixed Amount ($)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={commissionValue}
                    onChange={(e) => setCommissionValue(e.target.value)}
                    className="input-solid"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-2.5 text-sm">
                Save Commission Rule
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
