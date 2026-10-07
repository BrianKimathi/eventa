import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedAdminRoute = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Lock admin: must be logged in AND have ADMIN role
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  const isAdmin = user.roles && (user.roles.includes('ADMIN') || user.roles.includes('ROLE_ADMIN'));
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="card-solid text-center max-w-md space-y-4">
          <h2 className="text-xl font-bold text-rose-400">Access Denied</h2>
          <p className="text-xs text-slate-400">
            You are logged in as {user.email}, but your account does not have Administrator privileges.
          </p>
          <a href="/admin/login" className="btn-primary text-xs inline-block">
            Sign In with Admin Account
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
