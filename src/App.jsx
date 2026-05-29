import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

import Preloader from './components/Preloader';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

/* Scroll to top on route change */
function RouteScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* Toast notification */
function Toast({ message, show }) {
  return <div className={`toast${show ? ' show' : ''}`}>{message}</div>;
}

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', show: false });

  /* Show toast helper */
  const showToast = useCallback((msg) => {
    setToast({ message: msg, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 2500);
  }, []);

  /* Add to cart */
  const handleAddToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`✅ "${product.name}" added to cart`);
  }, [showToast]);

  /* Remove item */
  const handleRemove = useCallback((id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  /* Clear cart */
  const handleClearCart = useCallback(() => {
    setCartItems([]);
    showToast('✅ Order placed successfully!');
  }, [showToast]);

  /* Update quantity */
  const handleUpdateQty = useCallback((id, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCartItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
    }
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <BrowserRouter>
      <Preloader />
      <RouteScrollReset />
      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
      />
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={handleRemove}
        onUpdateQty={handleUpdateQty}
      />
      <Toast message={toast.message} show={toast.show} />
      <Routes>
        <Route path="/"        element={<HomePage    onAddToCart={handleAddToCart} />} />
        <Route path="/menu"    element={<MenuPage    onAddToCart={handleAddToCart} />} />
        <Route path="/blog"    element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route 
          path="/checkout" 
          element={
            <CheckoutPage 
              cartItems={cartItems} 
              onRemove={handleRemove} 
              onUpdateQty={handleUpdateQty} 
              onClearCart={handleClearCart} 
            />
          } 
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*"        element={<NotFoundPage />} />
      </Routes>
      <Footer />

    </BrowserRouter>
  );
}

export default App;
