import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  register: (username: string, email: string, password: string, password2: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.me()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (username: string, password: string) => {
    const u = await auth.login({ username, password }) as User;
    setUser(u);
  };

  const handleGoogleLogin = async (credential: string) => {
    const u = await auth.googleLogin(credential) as User;
    setUser(u);
  };

  const handleRegister = async (username: string, email: string, password: string, password2: string) => {
    await auth.register({ username, email, password, password2 });
  };

  const handleLogout = async () => {
    await auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, googleLogin: handleGoogleLogin, register: handleRegister, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
