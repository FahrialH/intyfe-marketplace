import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
  Wallet,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  LogOut,
  RefreshCw,
  Loader2,
  Radio,
} from 'lucide-react';
import {
  detectRunningWallets,
  connectWalletDirectly,
  getSolanaExplorerUrl,
  getRunningPhantomProvider,
  getRunningSolflareProvider,
  PhantomWalletName,
  SolflareWalletName,
} from '../../utils/walletDetection';

interface SolanaWalletButtonProps {
  className?: string;
  showBadge?: boolean;
  align?: 'left' | 'right';
  isMobile?: boolean;
}

export const SolanaWalletButton: React.FC<SolanaWalletButtonProps> = ({
  className = '',
  showBadge = true,
  align = 'right',
  isMobile = false,
}) => {
  const { connected, connecting, publicKey, disconnect, wallet: activeWallet, select, wallets } = useWallet();
  const { setVisible } = useWalletModal();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rawNetwork = import.meta.env.VITE_SOLANA_NETWORK || 'mainnet-beta';
  const networkLabel = rawNetwork === 'mainnet-beta' || rawNetwork === 'mainnet' ? 'Mainnet' : 'Devnet';

  const base58 = publicKey ? publicKey.toBase58() : '';
  const truncatedAddress = base58 ? `${base58.slice(0, 4)}...${base58.slice(-4)}` : '';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!base58) return;
    try {
      await navigator.clipboard.writeText(base58);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDisconnect = async () => {
    setDropdownOpen(false);
    try {
      await disconnect();
      try {
        localStorage.removeItem('walletName');
      } catch {
        // Ignore
      }
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
    }
  };

  const handleChangeWallet = () => {
    setDropdownOpen(false);
    setVisible(true);
  };

  /**
   * Smart connect handler:
   * Detects if Phantom or Solflare processes are already running in browser.
   * If running, connects directly (without log in if already trusted, or opens popup cleanly).
   */
  const handleConnectClick = async () => {
    const { isPhantomRunning, isSolflareRunning } = detectRunningWallets();
    const phantom = getRunningPhantomProvider();
    const solflare = getRunningSolflareProvider();

    // If only Phantom process is running
    if (isPhantomRunning && !isSolflareRunning) {
      const connectedDirectly = await connectWalletDirectly(PhantomWalletName, select, wallets);
      if (!connectedDirectly) {
        setVisible(true);
      }
      return;
    }

    // If only Solflare process is running
    if (isSolflareRunning && !isPhantomRunning) {
      const connectedDirectly = await connectWalletDirectly(SolflareWalletName, select, wallets);
      if (!connectedDirectly) {
        setVisible(true);
      }
      return;
    }

    // If both are running, prioritize whichever has active connection
    if (isPhantomRunning && isSolflareRunning) {
      if (phantom?.isConnected) {
        await connectWalletDirectly(PhantomWalletName, select, wallets);
        return;
      }
      if (solflare?.isConnected) {
        await connectWalletDirectly(SolflareWalletName, select, wallets);
        return;
      }
      // Neither is already connected, open modal for explicit choice
      setVisible(true);
      return;
    }

    // Neither extension detected, open wallet modal for download / web wallets
    setVisible(true);
  };

  // If not connected
  if (!connected || !publicKey) {
    if (isMobile) {
      return (
        <div className="space-y-2">
          {showBadge && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Solana {networkLabel}</span>
              </div>
              <span className="text-[10px] text-neutral-400">Production</span>
            </div>
          )}
          <button
            onClick={handleConnectClick}
            disabled={connecting}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold text-black bg-[#f4bb28] hover:bg-[#e3ae24] transition-all shadow-md active:scale-95 cursor-pointer ${className}`}
          >
            {connecting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showBadge && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-emerald-400 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{networkLabel}</span>
          </div>
        )}
        <button
          onClick={handleConnectClick}
          disabled={connecting}
          className="flex items-center gap-2 bg-[#f4bb28] hover:bg-[#e3ae24] text-black px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm active:scale-95 hover:shadow-[0_0_15px_rgba(244,187,40,0.3)] cursor-pointer"
          title={`Connect Phantom or Solflare wallet on Solana ${networkLabel}`}
        >
          {connecting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-3.5 h-3.5" />
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Connected state
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center gap-2">
        {/* Standalone Network badge in desktop navbar */}
        {showBadge && !isMobile && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-medium text-emerald-400 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{networkLabel}</span>
          </div>
        )}

        {/* Connected Wallet Trigger Button */}
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className={`flex items-center gap-2 bg-[#151515] border border-[#f4bb28]/40 hover:border-[#f4bb28] px-3 sm:px-3.5 py-1.5 rounded-full text-xs text-white hover:bg-white/5 transition-all shadow-sm cursor-pointer ${
            isMobile ? 'w-full justify-between' : ''
          }`}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2 min-w-0">
            {/* Active Wallet Icon or Default Ghost/Solana indicator */}
            {activeWallet?.adapter.icon ? (
              <img
                src={activeWallet.adapter.icon}
                alt={activeWallet.adapter.name}
                className="w-3.5 h-3.5 rounded-full shrink-0"
              />
            ) : (
              <Wallet className="w-3.5 h-3.5 text-[#f4bb28] shrink-0" />
            )}

            {/* Address */}
            <span className="font-mono text-xs text-[#f4bb28] font-medium tracking-tight">
              {truncatedAddress}
            </span>

            {/* Network status dot */}
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-[10px] font-mono text-emerald-400 font-semibold border border-emerald-500/30"
              title={`Connected to Solana ${networkLabel}`}
            >
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              {networkLabel}
            </span>
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 shrink-0 ${
              dropdownOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu Modal / Popover */}
      {dropdownOpen && (
        <div
          className={`absolute z-50 mt-2 w-72 rounded-2xl bg-[#151515] border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl p-4 text-xs space-y-3.5 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${isMobile ? 'left-0 right-0 w-full' : ''}`}
        >
          {/* Header Info */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              {activeWallet?.adapter.icon ? (
                <img
                  src={activeWallet.adapter.icon}
                  alt={activeWallet.adapter.name}
                  className="w-4 h-4 rounded-full"
                />
              ) : (
                <Radio className="w-4 h-4 text-[#f4bb28]" />
              )}
              <span className="font-bold text-white text-xs">
                {activeWallet?.adapter.name || 'Solana Wallet'}
              </span>
            </div>

            {/* Network Badge inside Dropdown */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{networkLabel}</span>
            </div>
          </div>

          {/* Full Public Key with 1-click Copy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>Solana Address</span>
              <button
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1 text-[#f4bb28] hover:underline cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-black/50 border border-white/10 p-2.5 rounded-xl font-mono text-[11px] text-neutral-300 break-all select-all">
              {base58}
            </div>
          </div>

          {/* Links & Quick Actions */}
          <div className="pt-1 space-y-1">
            <a
              href={getSolanaExplorerUrl('address', base58, rawNetwork)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-[#f4bb28]" />
                <span>View on Solana Explorer</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">{networkLabel}</span>
            </a>

            <button
              onClick={handleChangeWallet}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#d81395]" />
              <span>Change / Switch Wallet</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
