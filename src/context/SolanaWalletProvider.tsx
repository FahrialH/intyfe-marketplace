import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork, WalletError, WalletReadyState } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { trySilentAutoConnect } from '../utils/walletDetection';

// Default styles for the Solana wallet modal
import '@solana/wallet-adapter-react-ui/styles.css';

/**
 * Automatically detects running Phantom or Solflare processes and connects without log in
 * if already authorized or trusted.
 */
const WalletAutoDetector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connected, connecting, select, wallets, connect, wallet } = useWallet();
  const autoConnectAttempted = useRef(false);

  useEffect(() => {
    // If already connected or connecting, or if we already ran detection
    if (connected || connecting || autoConnectAttempted.current) return;

    const detectAndConnect = async () => {
      autoConnectAttempted.current = true;
      try {
        const trustedWallet = await trySilentAutoConnect();
        if (trustedWallet) {
          select(trustedWallet);
          const target = wallets.find((w) => w.adapter.name === trustedWallet);
          if (target && target.readyState === WalletReadyState.Installed) {
            await target.adapter.connect();
          }
        }
      } catch (err) {
        console.debug('[WalletAutoDetector] Silent auto-connect completed with no trusted session:', err);
      }
    };

    // Run detection immediately or after extension injection tick
    detectAndConnect();

    // Check once more in case extension injects right after window load
    const timeout = setTimeout(detectAndConnect, 500);
    return () => clearTimeout(timeout);
  }, [connected, connecting, select, wallets, connect]);

  // Clean stale localStorage walletName on disconnect so subsequent re-clicks never get swallowed
  useEffect(() => {
    if (!connected && !connecting && !wallet) {
      // Allow re-selection of the same wallet adapter cleanly
      try {
        if (localStorage.getItem('walletName') === 'null') {
          localStorage.removeItem('walletName');
        }
      } catch {
        // Ignore localStorage restrictions
      }
    }
  }, [connected, connecting, wallet]);

  return <>{children}</>;
};

export const SolanaWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Defaults to Solana Mainnet
  const rawNetwork = import.meta.env.VITE_SOLANA_NETWORK || 'mainnet-beta';
  const network = rawNetwork === 'mainnet-beta' || rawNetwork === 'mainnet'
    ? WalletAdapterNetwork.Mainnet
    : (rawNetwork as WalletAdapterNetwork);

  // Custom RPC endpoint or official Solana Mainnet cluster URL
  const endpoint = useMemo(() => {
    return import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  const onError = useCallback((error: WalletError) => {
    // Gracefully log user rejection or cancellation without breaking UI state
    if (
      error.name === 'WalletConnectionError' ||
      error.name === 'WalletWindowBlockedError' ||
      error.name === 'WalletNotReadyError'
    ) {
      console.warn('[SolanaWalletProvider] Connection cancelled, closed, or wallet not ready.');
      return;
    }
    console.error('[SolanaWalletProvider] Wallet adapter error:', error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>
          <WalletAutoDetector>
            {children}
          </WalletAutoDetector>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
