import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShieldCheck, User, Film, Layers, LogOut, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { mockStories, mockProducts } from '../data/mockData';

export const MyAccount: React.FC = () => {
  const { wallet, showToast } = useCart();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    wallet.connect();
    showToast(`Signed in successfully as ${email || 'Creator'}!`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    wallet.connect();
    showToast(`Account created for ${username}! Web3 profile initialized.`);
  };

  return (
    <div className="pt-32 pb-24 container mx-auto px-4 max-w-[1000px]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium">My Account</span>
      </nav>

      {wallet.connected ? (
        /* Connected User Dashboard View */
        <div className="space-y-8">
          <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d81395] to-[#f4bb28] p-0.5">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <User className="w-7 h-7 text-[#f4bb28]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">Creator Studio Dashboard</h2>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#f4bb28] mt-1">{wallet.address}</p>
                </div>
              </div>

              <button
                onClick={wallet.disconnect}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-white/10 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-xs text-neutral-400 block mb-1">Minted Script Passes</span>
                <span className="text-2xl font-extrabold text-white">3</span>
                <span className="text-[11px] text-emerald-400 block mt-1">+1 this month</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-xs text-neutral-400 block mb-1">Producer Voting Weight</span>
                <span className="text-2xl font-extrabold text-[#f4bb28]">125 VP</span>
                <span className="text-[11px] text-neutral-400 block mt-1">Snapshot Protocol v2</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-xs text-neutral-400 block mb-1">Portfolio Value</span>
                <span className="text-2xl font-extrabold text-[#d81395]">0.084 ETH</span>
                <span className="text-[11px] text-neutral-400 block mt-1">≈ $294 USD</span>
              </div>
            </div>
          </div>

          {/* Owned Passes & Activity */}
          <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d81395]" />
              <span>Your Registered Screenplay Passes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <img
                  src={mockStories[0].coverImage}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] text-[#f4bb28] font-bold uppercase block">Executive Pass</span>
                  <h4 className="text-white font-bold text-sm">{mockStories[0].title}</h4>
                  <p className="text-xs text-neutral-400 mt-1">Token ID: #0074 • 1 Producer Vote</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <img
                  src={mockProducts[0].image}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] text-[#d81395] font-bold uppercase block">Director Edition</span>
                  <h4 className="text-white font-bold text-sm">{mockProducts[0].title}</h4>
                  <p className="text-xs text-neutral-400 mt-1">Token ID: #0112 • Commercial Spec Rights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Sign In / Register View */
        <div className="max-w-md mx-auto">
          {/* Wallet One-Click Connect Banner */}
          <div className="bg-[#151515] border border-[#f4bb28]/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 mb-8 shadow-[0_0_30px_rgba(244,187,40,0.15)]">
            <div className="w-12 h-12 rounded-full bg-[#f4bb28]/10 text-[#f4bb28] flex items-center justify-center mx-auto">
              <Wallet className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Instant Web3 Authentication</h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Connect your Ethereum wallet (MetaMask, Coinbase, Rainbow) to manage script rights, collector passes, and studio payouts without passwords.
            </p>
            <button
              onClick={wallet.connect}
              className="w-full py-3 px-6 rounded-full bg-[#f4bb28] hover:bg-[#e3ae24] text-black font-bold text-xs shadow-md transition-all active:scale-98"
            >
              Connect Web3 Wallet
            </button>
          </div>

          {/* Traditional Auth Form */}
          <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 bg-white/5 rounded-full mb-6 text-center">
              <button
                onClick={() => setActiveTab('login')}
                className={`py-2 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'login' ? 'bg-[#d81395] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`py-2 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'register' ? 'bg-[#d81395] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Username or Email *</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@intyfe.io"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-neutral-400 cursor-pointer">
                    <input type="checkbox" className="rounded accent-[#d81395]" />
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password reset instructions sent.'); }} className="text-[#f4bb28] hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white font-semibold text-xs shadow-md transition-all mt-4"
                >
                  Sign in
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Creator Username *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="writer_neo"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="writer@studio.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full bg-[#d81395] hover:bg-[#9a106a] text-white font-semibold text-xs shadow-md transition-all mt-4"
                >
                  Create Creator Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
