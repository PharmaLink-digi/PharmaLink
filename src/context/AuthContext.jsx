import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const [role, setRole] = useState(() => localStorage.getItem('userRole') || null);
  const [signupRole, setSignupRoleState] = useState(() => localStorage.getItem('signupRole') || null);

  const login = (id, _token, userRole) => {
    // This app uses userId + role only. _token is accepted but ignored.
    const r = userRole || 'client';
    localStorage.setItem('userId', id);
    localStorage.setItem('userRole', r);
    setUserId(id);
    setRole(r);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('signupRole');
    setUserId(null);
    setRole(null);
    setSignupRoleState(null);
  };

  const setSignupRole = (r) => {
    if (r) {
      localStorage.setItem('signupRole', r);
    } else {
      localStorage.removeItem('signupRole');
    }
    setSignupRoleState(r);
  };

  const getDashboardPath = () => {
    if (role === 'pharmacy') return '/pharmacy/dashboard';
    if (role === 'warehouse') return '/warehouse/dashboard';
    return '/client/dashboard';
  };

  return (
    <AuthContext.Provider value={{
      userId,
      role,
      signupRole,
      setSignupRole,
      login,
      logout,
      isLoggedIn: !!userId,
      getDashboardPath,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
