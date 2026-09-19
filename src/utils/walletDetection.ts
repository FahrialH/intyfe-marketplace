import { WalletName } from '@solana/wallet-adapter-base';
import { Wallet } from '@solana/wallet-adapter-react';
import { PhantomWalletName } from '@solana/wallet-adapter-phantom';
import { SolflareWalletName } from '@solana/wallet-adapter-solflare';

export { PhantomWalletName, SolflareWalletName };

export interface SolanaWindowProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  isConnected?: boolean;
  publicKey?: { toString: () => string; toBytes: () => Uint8Array };
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey?: { toString: () => string } }>;
}

declare global {
  interface Window {
    phantom?: {
      solana?: SolanaWindowProvider;
    };
    solana?: SolanaWindowProvider;
    solflare?: SolanaWindowProvider;
  }
}

/**
 * Returns the active injected Phantom provider if running
 */
export const getRunningPhantomProvider = (): SolanaWindowProvider | null => {
  if (typeof window === 'undefined') return null;
  if (window.phantom?.solana?.isPhantom) return window.phantom.solana;
  if (window.solana?.isPhantom) return window.solana;
  return null;
};

/**
 * Returns the active injected Solflare provider if running
 */
export const getRunningSolflareProvider = (): SolanaWindowProvider | null => {
  if (typeof window === 'undefined') return null;
  if (window.solflare?.isSolflare) return window.solflare;
  return null;
};

/**
 * Detects whether Phantom or Solflare extension processes are currently active in the browser
 */
export const detectRunningWallets = (): { isPhantomRunning: boolean; isSolflareRunning: boolean } => {
  return {
    isPhantomRunning: Boolean(getRunningPhantomProvider()),
    isSolflareRunning: Boolean(getRunningSolflareProvider()),
  };
};

/**
 * Checks if a running wallet process is already authorized/logged in and connects without prompt
 */
export const trySilentAutoConnect = async (): Promise<WalletName | null> => {
  const phantom = getRunningPhantomProvider();
  if (phantom) {
    try {
      if (phantom.isConnected && phantom.publicKey) {
        return PhantomWalletName;
      }
      const res = await phantom.connect({ onlyIfTrusted: true });
      if (res?.publicKey) {
        return PhantomWalletName;
      }
    } catch {
      // Not trusted yet, requires user interaction
    }
  }

  const solflare = getRunningSolflareProvider();
  if (solflare) {
    try {
      if (solflare.isConnected && solflare.publicKey) {
        return SolflareWalletName;
      }
      const res = await solflare.connect({ onlyIfTrusted: true });
      if (res) {
        return SolflareWalletName;
      }
    } catch {
      // Not trusted yet
    }
  }

  return null;
};

/**
 * Direct wallet connection triggered inside a user gesture to guarantee popup opening
 */
export const connectWalletDirectly = async (
  walletName: WalletName,
  select: (name: WalletName) => void,
  wallets: Wallet[]
): Promise<boolean> => {
  try {
    select(walletName);

    const target = wallets.find((w) => w.adapter.name === walletName);
    if (!target) return false;

    // Check if wallet process is running
    const phantom = getRunningPhantomProvider();
    const solflare = getRunningSolflareProvider();

    if (walletName === 'Phantom' && phantom) {
      // If already connected/trusted, try silent connect first
      try {
        await phantom.connect({ onlyIfTrusted: true });
        await target.adapter.connect();
        return true;
      } catch {
        // Fallback to explicit interactive connection
        await target.adapter.connect();
        return true;
      }
    } else if (walletName === 'Solflare' && solflare) {
      try {
        await solflare.connect({ onlyIfTrusted: true });
        await target.adapter.connect();
        return true;
      } catch {
        await target.adapter.connect();
        return true;
      }
    } else {
      // Directly invoke adapter connect so browser popup blocker does not intercept
      await target.adapter.connect();
      return true;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // User rejected or closed window
    if (!msg.toLowerCase().includes('user rejected') && !msg.toLowerCase().includes('window closed')) {
      console.warn(`[walletDetection] Failed to connect to ${walletName}:`, err);
    }
    return false;
  }
};

/**
 * Formats a Solana explorer link with correct cluster parameter
 */
export const getSolanaExplorerUrl = (
  type: 'tx' | 'address',
  value: string,
  network = import.meta.env.VITE_SOLANA_NETWORK || 'mainnet-beta'
): string => {
  const isMainnet = network === 'mainnet-beta' || network === 'mainnet';
  const clusterParam = isMainnet ? '' : `?cluster=${network}`;
  return `https://explorer.solana.com/${type}/${value}${clusterParam}`;
};
