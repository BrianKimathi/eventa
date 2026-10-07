import React, { useState, useEffect } from 'react';
import * as api from '../../services/api';
import { Users, Search, UserCheck, AlertCircle } from 'lucide-react';

export const StaffPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    api.getAllUsers()
      .then(res => setUsers(res.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleSuspend = async (id, currentSuspended) => {
    try {
      await api.toggleUserSuspension(id, !currentSuspended);
      fetchUsers();
    } catch {
      alert('Error updating user status');
    }
  };

  const handleVerifyCreator = async (id) => {
    try {
      await api.updateCreatorVerification(id, 'VERIFIED');
      fetchUsers();
    } catch {
      alert('Error updating creator status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-indigo-400" size={24} /> User & Staff Permissions
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time user accounts from backend database.</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
        <input
          type="text"
          placeholder="Search user by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-solid pl-9 py-2 text-xs"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs">Loading Users from API...</span>
        </div>
      ) : users.length > 0 ? (
        <div className="card-solid p-0 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Assigned Roles</th>
                <th className="p-4">Creator Status</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users
                .filter(u => (u.email || '').toLowerCase().includes(search.toLowerCase()) || ((u.firstName || '') + ' ' + (u.lastName || '')).toLowerCase().includes(search.toLowerCase()))
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

                    <button onClick={() => handleToggleSuspend(usr.id, usr.isSuspended)} className={usr.isSuspended ? 'btn-success text-xs' : 'btn-danger text-xs'}>
                      {usr.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-solid p-8 text-center text-slate-400 space-y-3">
          <AlertCircle className="mx-auto text-slate-500" size={32} />
          <p className="text-sm">No registered users in database.</p>
        </div>
      )}
    </div>
  );
};
