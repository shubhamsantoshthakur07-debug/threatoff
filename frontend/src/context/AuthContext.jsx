import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = {
  ADMIN: {
    role: "Administrator",
    name: "Shubham Thakur",
    email: "shubham.thakur@threatoff.soc",
    title: "Chief Information Security Officer (CISO)",
    badge: "SEC-LVL-4",
    avatarBg: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
  },
  ANALYST: {
    role: "Security Analyst",
    name: "Marcus Kane",
    email: "analyst@threatoff.soc",
    title: "SOC Tier-2 Incident Responder",
    badge: "SEC-LVL-2",
    avatarBg: "bg-blue-500/20 text-blue-400 border border-blue-500/40"
  },
  VIEWER: {
    role: "Viewer",
    name: "Elena Rostova",
    email: "viewer@threatoff.soc",
    title: "Executive Audit Observer",
    badge: "AUDIT-LVL-1",
    avatarBg: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('threatoff_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'Administrator') return ROLES.ADMIN;
        if (parsed.role === 'Security Analyst') return ROLES.ANALYST;
        if (parsed.role === 'Viewer') return ROLES.VIEWER;
      } catch (e) { }
    }
    return ROLES.ADMIN;
  });

  useEffect(() => {
    localStorage.setItem('threatoff_user', JSON.stringify(user));
  }, [user]);

  const switchRole = (roleKey) => {
    if (ROLES[roleKey]) {
      setUser(ROLES[roleKey]);
    }
  };

  const loginAs = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(ROLES.VIEWER);
  };

  // Helper flags
  const isAdmin = user.role === 'Administrator';
  const isAnalyst = user.role === 'Security Analyst';
  const isViewer = user.role === 'Viewer';
  const canModifyAlerts = isAdmin || isAnalyst;
  const canUploadDatasets = isAdmin || isAnalyst;
  const canConfigureSettings = isAdmin;

  return (
    <AuthContext.Provider value={{
      user,
      switchRole,
      loginAs,
      logout,
      isAdmin,
      isAnalyst,
      isViewer,
      canModifyAlerts,
      canUploadDatasets,
      canConfigureSettings,
      ROLES
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
