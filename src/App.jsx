import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Preloader from './components/Preloader';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Supabase & Auth
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabaseClient';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import LoadingScreen from './components/LoadingScreen';

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

/* Protected Route Wrapper */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppContent() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', show: false });
  const { user, loading } = useAuth();

  /* Show toast helper */
  const showToast = useCallback((msg) => {
    setToast({ message: msg, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 2500);
  }, []);

  /* Sync Cart from Database on Login */
  useEffect(() => {
    if (loading) return;
    if (!user) {
      setCartItems([]);
      return;
    }

    const loadDBCart = async () => {
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select('product_id, quantity, products(*)')
          .eq('user_id', user.id);

        if (error) throw error;
        
        if (data) {
          const dbItems = data.map((item) => ({
            id: item.product_id,
            name: item.products.name,
            price: item.products.price,
            image: item.products.image_url,
            category: item.products.category,
            qty: item.quantity,
          }));
          setCartItems(dbItems);
        }
      } catch (err) {
        console.error('Error loading cart from database:', err);
      }
    };

    loadDBCart();
  }, [user]);

  /* Add to cart */
  const handleAddToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const newQty = existing ? existing.qty + 1 : 1;

      if (user) {
        supabase
          .from('cart_items')
          .upsert(
            {
              user_id: user.id,
              product_id: product.id,
              quantity: newQty,
            },
            { onConflict: 'user_id,product_id' }
          )
          .then(({ error }) => {
            if (error) console.error('Error saving cart item:', error);
          });
      }

      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: newQty } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`✅ "${product.name}" added to cart`);
  }, [user, showToast]);

  /* Remove item */
  const handleRemove = useCallback((id) => {
    setCartItems((prev) => {
      if (user) {
        supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', id)
          .then(({ error }) => {
            if (error) console.error('Error deleting cart item:', error);
          });
      }
      return prev.filter((i) => i.id !== id);
    });
  }, [user]);

  /* Clear cart */
  const handleClearCart = useCallback((isCheckout = false) => {
    setCartItems((prev) => {
      if (user) {
        supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .then(({ error }) => {
            if (error) console.error('Error clearing cart:', error);
          });
      }
      return [];
    });
    if (isCheckout) {
      showToast('✅ Order placed successfully!');
    }
  }, [user, showToast]);

  /* Update quantity */
  const handleUpdateQty = useCallback((id, qty) => {
    setCartItems((prev) => {
      if (qty <= 0) {
        if (user) {
          supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', id)
            .then(({ error }) => {
              if (error) console.error('Error deleting cart item:', error);
            });
        }
        return prev.filter((i) => i.id !== id);
      } else {
        if (user) {
          supabase
            .from('cart_items')
            .update({ quantity: qty })
            .eq('user_id', user.id)
            .eq('product_id', id)
            .then(({ error }) => {
              if (error) console.error('Error updating cart qty:', error);
            });
        }
        return prev.map((i) => i.id === id ? { ...i, qty } : i);
      }
    });
  }, [user]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  if (loading) {
    return <LoadingScreen />;
  }

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
        <Route path="/"                 element={<HomePage    onAddToCart={handleAddToCart} />} />
        <Route path="/menu"             element={<MenuPage    onAddToCart={handleAddToCart} />} />
        <Route path="/blog"             element={<BlogPage />} />
        <Route path="/blog/:id"         element={<BlogDetailPage />} />
        
        {/* Auth routes */}
        <Route path="/login"            element={<LoginPage />} />
        <Route path="/register"         element={<RegisterPage />} />
        <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
        <Route path="/reset-password"   element={<ResetPasswordPage />} />
        
        {/* Protected routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
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
                onClearCart={() => handleClearCart(true)} 
              />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/contact"          element={<ContactPage />} />
        <Route path="*"                 element={<NotFoundPage />} />
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

