import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ChevronRight, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { isSupabaseConfigured } from '../lib/supabase';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, demoSignIn } = useAuth();
  const { showToast } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default redirect path after successful sign-in
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message || 'Failed to sign in. Please verify your credentials.');
        setIsSubmitting(false);
        return;
      }

      showToast('Welcome back to Intyfe!');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole: 'admin' | 'seller' | 'buyer') => {
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const { error } = await demoSignIn(demoRole);
      if (error && isSupabaseConfigured()) {
        setErrorMsg(error.message);
        setIsSubmitting(false);
        return;
      }
      showToast(`Signed in as ${demoRole.toUpperCase()}`);
      navigate(demoRole === 'admin' ? '/admin/news' : from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error in demo login';
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[500px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">Sign In</span>
      </nav>

      <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-[#d81395]/10 text-[#d81395] border border-[#d81395]/30 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign in to <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Intyfe</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Access your filmmaker studio, collector passes, and admin dispatches
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@studio.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-neutral-300">
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Password reset requested. Check your email inbox.');
                }}
                className="text-[11px] text-[#f4bb28] hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-[#d81395] hover:bg-[#9a106a] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(216,19,149,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Demo Fast Logins for Testing */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1 font-semibold text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-[#f4bb28]" /> Quick Demo Roles:
            </span>
            <span>Instant Role Simulation</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-[#d81395]/20 border border-white/10 hover:border-[#d81395] text-[11px] text-neutral-300 hover:text-white transition-all text-center"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('seller')}
              className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-[#f4bb28]/20 border border-white/10 hover:border-[#f4bb28] text-[11px] text-neutral-300 hover:text-white transition-all text-center"
            >
              🎬 Seller
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('buyer')}
              className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500 text-[11px] text-neutral-300 hover:text-white transition-all text-center"
            >
              🎟️ Buyer
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-neutral-400">
            Don't have an Intyfe account?{' '}
            <Link to="/signup" className="text-[#f4bb28] font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-2 border-t border-white/5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured via Supabase Row-Level Security</span>
        </div>
      </div>
    </div>
  );
};
