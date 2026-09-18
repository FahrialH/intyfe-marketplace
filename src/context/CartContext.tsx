import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, tier?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  subtotalEth: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  wallet: {
    connected: boolean;
    address: string | null;
    connect: () => void;
    disconnect: () => void;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('intyfe_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState<boolean>(() => {
    return localStorage.getItem('intyfe_wallet') === 'true';
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(() => {
    return localStorage.getItem('intyfe_wallet_addr') || null;
  });

  useEffect(() => {
    localStorage.setItem('intyfe_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product: Product, quantity = 1, tier?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, selectedTier: tier || item.selectedTier }
            : item
        );
      }
      return [...prev, { product, quantity, selectedTier: tier || product.tier }];
    });
    showToast(`"${product.title}" added to your cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart.');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const connectWallet = () => {
    const mockAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    setWalletConnected(true);
    setWalletAddress(mockAddress);
    localStorage.setItem('intyfe_wallet', 'true');
    localStorage.setItem('intyfe_wallet_addr', mockAddress);
    showToast('Web3 Wallet connected: 0x742d...f44e');
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    localStorage.removeItem('intyfe_wallet');
    localStorage.removeItem('intyfe_wallet_addr');
    showToast('Wallet disconnected.');
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const subtotalEth = cartItems.reduce((sum, item) => sum + item.product.priceEth * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        subtotalEth,
        toastMessage,
        showToast,
        wallet: {
          connected: walletConnected,
          address: walletAddress,
          connect: connectWallet,
          disconnect: disconnectWallet,
        },
      }}
    >
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[110] flex items-center gap-3 bg-[#151515] border border-[hsl(321,79%,46%)] text-white px-5 py-3 rounded-full shadow-[0_0_20px_rgba(216,19,149,0.3)] animate-bounce"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[hsl(321,79%,46%)] animate-ping" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
