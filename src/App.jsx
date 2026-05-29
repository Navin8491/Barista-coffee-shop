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

// Supabase integrations
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './supabaseClient';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProtectedRoute from './components/ProtectedRoute';

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

function AppContent() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', show: false });

  /* Show toast helper */
  const showToast = useCallback((msg) => {
    setToast({ message: msg, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 2500);
  }, []);

  // Sync user's cart from Supabase on Login / Session Load
  useEffect(() => {
    if (!user) {
      return;
    }

    const loadUserCart = async () => {
      try {
        const { data: dbItems, error } = await supabase
          .from('cart_items')
          .select('quantity, product_id, products (*)')
          .eq('user_id', user.id);

        if (error) throw error;

        if (dbItems && dbItems.length > 0) {
          const loaded = dbItems
            .filter(item => item.products)
            .map(item => ({
              id: item.products.id,
              name: item.products.name,
              price: parseFloat(item.products.price),
              image: item.products.image_url,
              qty: item.quantity,
              description: item.products.description,
            }));
          setCartItems(loaded);
        } else if (cartItems.length > 0) {
          // Sync guest items to database
          for (const item of cartItems) {
            await supabase.from('cart_items').insert({
              user_id: user.id,
              product_id: item.id,
              quantity: item.qty
            });
          }
        }
      } catch (err) {
        console.error('Error syncing Supabase cart:', err);
      }
    };

    loadUserCart();
  }, [user]);

  // Clear react state when guest user logs out
  useEffect(() => {
    if (!user) {
      setCartItems([]);
    }
  }, [user]);

  /* Add to cart */
  const handleAddToCart = useCallback(async (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    
    showToast(`✅ "${product.name}" added to cart`);

    // Sync to Supabase if logged in
    if (user) {
      try {
        const { data: existing, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + 1 })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: product.id,
              quantity: 1
            });
        }
      } catch (err) {
        console.error('Cart add DB error:', err);
      }
    }
  }, [user, showToast]);

  /* Remove item */
  const handleRemove = useCallback(async (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));

    // Sync to Supabase if logged in
    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', id);
      } catch (err) {
        console.error('Cart remove DB error:', err);
      }
    }
  }, [user]);

  /* Clear cart */
  const handleClearCart = useCallback(async () => {
    setCartItems([]);
    showToast('✅ Order placed successfully!');

    // Clear cart in Supabase if logged in
    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Cart clear DB error:', err);
      }
    }
  }, [user, showToast]);

  /* Update quantity */
  const handleUpdateQty = useCallback(async (id, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      
      if (user) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', id);
      }
    } else {
      setCartItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
      
      if (user) {
        await supabase
          .from('cart_items')
          .update({ quantity: qty })
          .eq('user_id', user.id)
          .eq('product_id', id);
      }
    }
  }, [user]);

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
        
        {/* Auth routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected user routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <CheckoutPage 
                cartItems={cartItems} 
                onRemove={handleRemove} 
                onUpdateQty={handleUpdateQty} 
                onClearCart={handleClearCart} 
              />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*"        element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
