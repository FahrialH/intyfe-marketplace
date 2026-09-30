import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SolanaWalletProvider } from './context/SolanaWalletProvider';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { RequireAdmin, RequireSeller, RequireAuth } from './components/ProtectedRoutes';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Stories } from './pages/Stories';
import { StoryDetail } from './pages/StoryDetail';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { StoreListing } from './pages/StoreListing';
import { StoreDetail } from './pages/StoreDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { MyAccount } from './pages/MyAccount';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { AdminNews } from './pages/AdminNews';
import { AdminNewsEditor } from './pages/AdminNewsEditor';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { SellerProfileEditor } from './pages/seller/SellerProfileEditor';
import { SellerProductList } from './pages/seller/SellerProductList';
import { SellerProductEditor } from './pages/seller/SellerProductEditor';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SolanaWalletProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="product/:slug" element={<ProductDetail />} />
                  <Route path="stories" element={<Stories />} />
                  <Route path="story/:slug" element={<StoryDetail />} />
                  <Route path="news" element={<News />} />
                  <Route path="news/:slug" element={<NewsDetail />} />
                  <Route path="sellers" element={<StoreListing />} />
                  <Route path="store/:slug" element={<StoreDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route
                    path="checkout"
                    element={
                      <RequireAuth>
                        <Checkout />
                      </RequireAuth>
                    }
                  />
                  <Route path="account" element={<MyAccount />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<SignUp />} />

                  {/* Admin Protected Routes */}
                  <Route
                    path="admin/news"
                    element={
                      <RequireAdmin>
                        <AdminNews />
                      </RequireAdmin>
                    }
                  />
                  <Route
                    path="admin/news/new"
                    element={
                      <RequireAdmin>
                        <AdminNewsEditor />
                      </RequireAdmin>
                    }
                  />
                  <Route
                    path="admin/news/edit/:id"
                    element={
                      <RequireAdmin>
                        <AdminNewsEditor />
                      </RequireAdmin>
                    }
                  />

                  {/* Creator / Seller Protected Routes */}
                  <Route
                    path="seller"
                    element={
                      <RequireSeller>
                        <SellerDashboard />
                      </RequireSeller>
                    }
                  />
                  <Route
                    path="seller/dashboard"
                    element={
                      <RequireSeller>
                        <SellerDashboard />
                      </RequireSeller>
                    }
                  />
                  <Route
                    path="seller/profile"
                    element={
                      <RequireSeller>
                        <SellerProfileEditor />
                      </RequireSeller>
                    }
                  />
                  <Route
                    path="seller/products"
                    element={
                      <RequireSeller>
                        <SellerProductList />
                      </RequireSeller>
                    }
                  />
                  <Route
                    path="seller/products/new"
                    element={
                      <RequireSeller>
                        <SellerProductEditor />
                      </RequireSeller>
                    }
                  />
                  <Route
                    path="seller/products/edit/:id"
                    element={
                      <RequireSeller>
                        <SellerProductEditor />
                      </RequireSeller>
                    }
                  />

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </SolanaWalletProvider>
    </ErrorBoundary>
  );
};

export default App;
