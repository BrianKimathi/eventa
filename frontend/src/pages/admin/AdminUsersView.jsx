import React, { useState, useEffect } from 'react';
import { MOCK_USERS } from '../../services/mockData';
import * as api from '../../services/api';
import { Users, Search, UserCheck } from 'lucide-react';

export const AdminUsersView = () => {
  const [usersList, setUsersList] = useState(MOCK_USERS);
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    api.getAllUsers()
      .then(res => res.data && res.data.length > 0 && setUsersList(res.data))
      .catch(() => setUsersList(MOCK_USERS));
  }, []);

  const handleToggleUser = async (id, currentSuspended) => {
    try {
      await api.toggleUserSuspension(id, !currentSuspended);
    } catch (e) {}
    setUsersList(usersList.map(u => u.id === id ? { ...u, isSuspended: !currentSuspended } : u));
  };

  const handleVerifyCreator = async (id) => {
    try {
      await api.updateCreatorVerification(id, 'VERIFIED');
    } catch (e) {}
    setUsersList(usersList.map(u => u.id === id ? {
      ...u,
      creatorVerificationStatus: 'VERIFIED',
      roles: u.roles.includes('CREATOR') ? u.roles : [...u.roles, 'CREATOR']
    } : u));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="text-indigo-400" size={24} /> User & Creator Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">Search platform users, toggle suspension states, and grant Creator verifications.</p>
      </div>

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
              <th className="p-4">User Details</th>
              <th className="p-4">Assigned Roles</th>
              <th className="p-4">Creator Verification</th>
              <th className="p-4">Status</th>
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
  );
};
