import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ChevronRight, AlertCircle, Loader2, Film, Ticket, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { UserRole } from '../lib/supabase';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { showToast } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signUp(email, password, fullName, role);

      if (error) {
        setErrorMsg(error.message || 'Registration failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      showToast(`Account registered as ${role.toUpperCase()}!`);
      setTimeout(() => {
        navigate('/account');
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[560px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">Create Account</span>
      </nav>

      <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Join the <span className="bg-gradient-to-r from-[#d81395] to-[#fff2c6] bg-clip-text text-transparent">Intyfe</span> Movement
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Select your ecosystem role and register your web3 film identity
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {isSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center text-emerald-300 text-xs space-y-1">
            <p className="font-bold">Account created successfully!</p>
            <p className="text-neutral-300">Redirecting to your dashboard...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selector Toggle */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Select Your Role in Intyfe *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  role === 'buyer'
                    ? 'border-[#d81395] bg-[#d81395]/10 shadow-[0_0_15px_rgba(216,19,149,0.2)]'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Ticket className="w-4 h-4 text-[#f4bb28]" />
                  <span className="text-xs font-bold text-white">Collector / Buyer</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-snug">
                  Collect passes, buy film memorabilia & participate in governance.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  role === 'seller'
                    ? 'border-[#d81395] bg-[#d81395]/10 shadow-[0_0_15px_rgba(216,19,149,0.2)]'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Film className="w-4 h-4 text-[#d81395]" />
                  <span className="text-xs font-bold text-white">Creator / Seller</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-snug">
                  Publish screenplays, manage studio merchandise & receive payouts.
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Full Name or Creator Alias *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maya Lin / CineNova Studio"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d81395] transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-[#d81395] hover:bg-[#9a106a] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(216,19,149,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Account...</span>
              </>
            ) : (
              <span>Create {role === 'seller' ? 'Seller' : 'Buyer'} Account</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[#f4bb28] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-2 border-t border-white/5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Role metadata saved directly to Supabase profiles</span>
        </div>
      </div>
    </div>
  );
};
