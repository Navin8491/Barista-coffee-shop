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

// Supabase & Auth & Context Stores
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ProfileProvider } from './context/ProfileContext';
import { FavoriteProvider } from './context/FavoriteContext';
import { CartProvider, useCart } from './context/CartContext';
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
  const { cartItems, cartCount, addToCart, removeFromCart, updateQty, clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', show: false });

  /* Show toast helper */
  const showToast = useCallback((msg) => {
    setToast({ message: msg, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 2500);
  }, []);

  /* Add to cart with toast */
  const handleAddToCart = useCallback(async (product) => {
    try {
      await addToCart(product, 1);
      showToast(`✅ "${product.name}" added to cart`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToast('❌ Failed to add item to cart');
    }
  }, [addToCart, showToast]);

  /* Clear cart with toast */
  const handleClearCart = useCallback(async (isCheckout = false) => {
    try {
      await clearCart();
      if (isCheckout) {
        showToast('✅ Order placed successfully!');
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  }, [clearCart, showToast]);

  return (
    <>
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
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
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
                onRemove={removeFromCart} 
                onUpdateQty={updateQty} 
                onClearCart={() => handleClearCart(true)} 
              />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/contact"          element={<ContactPage />} />
        <Route path="*"                 element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <ProductProvider>
            <FavoriteProvider>
              <CartProvider>
                <AppContent />
              </CartProvider>
            </FavoriteProvider>
          </ProductProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
