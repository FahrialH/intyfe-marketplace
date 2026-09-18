import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export const RequireAuth: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#d81395] animate-spin" />
        <p className="text-xs text-neutral-400">Verifying authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export const RequireAdmin: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#d81395] animate-spin" />
        <p className="text-xs text-neutral-400">Checking administrator privileges...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="pt-12 pb-24 container mx-auto px-4 max-w-lg text-center">
        <div className="bg-[#151515] border border-rose-500/30 rounded-3xl p-8 space-y-4 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            This module requires an <strong>Administrator</strong> role. Your current account does not have sufficient permissions to access the Intyfe News CMS.
          </p>
          <div className="pt-2">
            <Navigate to="/account" replace />
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export const RequireSeller: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, isSeller, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#d81395] animate-spin" />
        <p className="text-xs text-neutral-400">Checking seller authorization...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isSeller) {
    return <Navigate to="/account" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
