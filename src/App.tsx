import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/common/ScrollToTop';

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
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
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
            <Route path="checkout" element={<Checkout />} />
            <Route path="account" element={<MyAccount />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
