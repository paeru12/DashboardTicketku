import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

// Mock credentials for different roles
const MOCK_USERS = {
  SUPERADMIN: { email: 'superadmin@tiketku.id', password: 'superadmin' },
  EVENT_ADMIN: { email: 'eventadmin@tiketku.id', password: 'eventadmin' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('tiketku_auth');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const login = async (email, password) => {
    // Basic validation
    if (!email || !password) {
      throw new Error('Email dan password wajib diisi');
    }

    // Check SUPERADMIN
    if (email.toLowerCase() === MOCK_USERS.SUPERADMIN.email && password === MOCK_USERS.SUPERADMIN.password) {
      const u = { 
        email: MOCK_USERS.SUPERADMIN.email, 
        role: 'SUPERADMIN',
        name: 'Super Admin'
      };
      setUser(u);
      try { localStorage.setItem('tiketku_auth', JSON.stringify(u)); } catch (e) {}
      return u;
    }

    // Check EVENT_ADMIN
    if (email.toLowerCase() === MOCK_USERS.EVENT_ADMIN.email && password === MOCK_USERS.EVENT_ADMIN.password) {
      const u = { 
        email: MOCK_USERS.EVENT_ADMIN.email, 
        role: 'EVENT_ADMIN',
        name: 'Event Admin'
      };
      setUser(u);
      try { localStorage.setItem('tiketku_auth', JSON.stringify(u)); } catch (e) {}
      return u;
    }

    throw new Error('Email atau password salah');
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem('tiketku_auth'); } catch (e) {}
    // ensure no session-specific keys remain (we no longer use sessionStorage)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
