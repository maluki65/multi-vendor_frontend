import React, { createContext, useContext, useEffect, useState } from 'react';
import Api, { setCsrfToken as attachCsrfToken } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState(null);

  // On restoring seesion on app reload
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await Api.get('/auth/user/profile');
        setUserData(res.data.user);
        setIsAuthenticated(true);

        if (res.data.csrfToken) {
          setCsrfToken(res.data.csrfToken);
          attachCsrfToken(res.data.csrfToken);
        }
      } catch {
        setUserData(null);
        setIsAuthenticated(false);
        setCsrfToken(null);
        attachCsrfToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // On user login
  const login = async (email, password) => {
    const res = await Api.post('/auth/user/login', {email, password});
    setUserData(res.data.user);
    setIsAuthenticated(true);

    setCsrfToken(res.data.csrfToken);
    attachCsrfToken(res.data.csrfToken);
  };

  // On user signup
  const signup = async (userInfo) => {
    const res = await Api.post('/auth/user/signup', userInfo);
    setUserData(res.data.user);
    setIsAuthenticated(true);

    setCsrfToken(res.data.csrfToken);
    attachCsrfToken(res.data.csrfToken);
  };

  // On user logout
  const logout = async () => {
    try {
     await Api.post('/auth/user/logout');
    } catch (_) {
      //Ignore network errors on logout
    }
    setUserData(null);
    setIsAuthenticated(false);
    setCsrfToken(null);
    attachCsrfToken(null);
  };
 
  // On allowing axios to force logout
  Api.logoutHandler = logout; 

  return (
    <AuthContext.Provider
      value={{ userData, isAuthenticated, loading, login, signup, logout }}
      >
        {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);