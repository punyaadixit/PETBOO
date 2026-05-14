import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setTokenGetter } from '../lib/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'petsphere_auth';

function loadStoredAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(() => localStorage.getItem('petsphere_demo') === 'true');

  /* Persist auth to localStorage */
  const persistAuth = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (userData && authToken) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, token: authToken }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  /* Restore session on mount */
  useEffect(() => {
    if (isDemo) {
      setUser({
        id: 'demo-user-001',
        email: 'demo@petsphere.app',
        name: 'Demo User',
      });
      setToken('demo-token');
      setLoading(false);
      return;
    }

    const stored = loadStoredAuth();
    if (stored?.token && stored?.user) {
      setUser(stored.user);
      setToken(stored.token);

      /* Verify the token is still valid */
      api.get('/auth/me')
        .then((res) => {
          setUser(res.user);
        })
        .catch(() => {
          /* Token expired — clear auth */
          persistAuth(null, null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isDemo, persistAuth]);

  /* Wire up the API token getter */
  useEffect(() => {
    setTokenGetter(async () => {
      if (isDemo) return 'demo-token';
      const stored = loadStoredAuth();
      return stored?.token ?? token ?? null;
    });
  }, [isDemo, token]);

  /* Sign Up — creates account via backend */
  const signUp = async (email, password, name) => {
    const res = await api.post('/auth/signup', { email, password, name });
    persistAuth(res.user, res.token);
    return res;
  };

  /* Sign In — authenticates via backend */
  const signIn = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    persistAuth(res.user, res.token);
    return res;
  };

  /* Enter Demo Mode */
  const enterDemo = () => {
    localStorage.setItem('petsphere_demo', 'true');
    setIsDemo(true);
    setUser({
      id: 'demo-user-001',
      email: 'demo@petsphere.app',
      name: 'Demo User',
    });
    setToken('demo-token');
  };

  /* Sign Out */
  const signOut = async () => {
    if (isDemo) {
      localStorage.removeItem('petsphere_demo');
      setIsDemo(false);
    }
    persistAuth(null, null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session: token ? { access_token: token } : null,
      loading,
      signUp,
      signIn,
      signOut,
      enterDemo,
      isDemo,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
