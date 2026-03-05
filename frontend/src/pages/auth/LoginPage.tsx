import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Sprout, Eye, EyeOff } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export default function LoginPage() {
  const { user, login, googleLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement | null>(null);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleBtnRef.current) return;

    const renderGoogleButton = () => {
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: { credential?: string }) => {
          if (!response.credential) return;
          setError('');
          setLoading(true);
          try {
            await googleLogin(response.credential);
          } catch (err: any) {
            setError(err?.detail || 'Google sign-in failed. Please try again.');
          } finally {
            setLoading(false);
          }
        },
      });

      googleBtnRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: 380,
        text: 'signin_with',
      });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);
  }, [googleLogin]);

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/20 to-transparent" />
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl bg-brand-teal flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-teal/30">
            <Sprout size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">FarmFlow</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Streamline your farm operations with powerful tools for crops, livestock, machinery, and production tracking.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-brand-teal/5" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-teal/5" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-brand-light">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-brand-teal flex items-center justify-center">
              <Sprout size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-brand-dark">FarmFlow</h1>
          </div>

          <h2 className="text-2xl font-bold text-brand-dark mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your farm management account</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {GOOGLE_CLIENT_ID && (
            <>
              <div ref={googleBtnRef} className="w-full flex justify-center mb-6" />
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-xs uppercase tracking-wide text-gray-400">or</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-center">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-teal font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
