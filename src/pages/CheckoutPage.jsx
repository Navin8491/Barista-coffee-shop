import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import './CheckoutPage.css';

export default function CheckoutPage({ cartItems, onRemove, onUpdateQty, onClearCart }) {
  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const formRef = useRef(null);
  const priceRef = useRef(null);

  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderSummary, setOrderSummary] = useState({ items: [], total: 0 });
  const [dbLoading, setDbLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cartItems.length > 0 ? 5.00 : 0;
  const total = subtotal + shipping;

  // Prepopulate form if profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.full_name || '',
        email: profile.email || user?.email || '',
      }));
    }
  }, [profile, user]);

  useEffect(() => {
    if (orderPlaced || cartItems.length === 0) {
      gsap.fromTo(pageRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      return;
    }

    const tl = gsap.timeline();

    tl.fromTo(pageRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );

    tl.fromTo(cardRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      "-=0.2"
    );

    const formGroups = formRef.current?.querySelectorAll('.form-group');
    if (formGroups) {
      tl.fromTo(formGroups,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
        "-=0.4"
      );
    }

    tl.fromTo(priceRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.2)' },
      "-=0.2"
    );
  }, [cartItems.length, orderPlaced]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setDbLoading(true);
    setErrorMsg('');

    try {
      if (!user) {
        throw new Error('Please sign in to place an order.');
      }

      // Record order in Supabase orders table
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'Completed' // Immediate completed pickup order state
        });

      if (error) throw error;

      setOrderSummary({
        items: [...cartItems],
        total: total
      });
      setOrderPlaced(true);
      
      // Clear cart context state & clean up table cart_items
      await onClearCart();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setDbLoading(false);
    }
  };

  const buttonHover = (e) => {
    gsap.to(e.currentTarget, { scale: 1.02, boxShadow: '0 8px 24px rgba(181, 106, 45, 0.2)', duration: 0.3 });
  };

  const buttonLeave = (e) => {
    gsap.to(e.currentTarget, { scale: 1, boxShadow: 'none', duration: 0.3 });
  };

  const buttonClick = (e) => {
    gsap.to(e.currentTarget, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
  };

  if (orderPlaced) {
    return (
      <main className="checkout-page" ref={pageRef}>
        <div className="container">
          <div className="checkout-success-card card">
            <span className="checkout-success-icon">🎉</span>
            <h2>Order Placed Successfully!</h2>
            <p className="checkout-success-msg">Thank you, <strong>{formData.fullName || 'Valued Customer'}</strong>. Your delicious coffee is being crafted right now.</p>
            
            <div className="checkout-success-details">
              <h3>Receipt Summary</h3>
              <div className="checkout-success-items">
                {orderSummary.items.map((item) => (
                  <div key={item.id} className="checkout-success-item">
                    <span>{item.qty}x {item.name}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="checkout-success-total">
                <span>Total Paid</span>
                <strong>${orderSummary.total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="checkout-success-meta">
              <div className="meta-box">
                <span className="meta-label">Est. Readiness</span>
                <strong className="meta-value">15–20 Mins</strong>
              </div>
              <div className="meta-box">
                <span className="meta-label">Pick Up Location</span>
                <strong className="meta-value">123 Coffee St, Milan</strong>
              </div>
            </div>

            <Link 
              to="/menu" 
              className="btn btn-primary"
              onMouseEnter={buttonHover}
              onMouseLeave={buttonLeave}
              onMouseDown={buttonClick}
            >
              Order More Delicacies
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page" ref={pageRef}>
        <div className="container">
          <div className="checkout-empty">
            <span>🛒</span>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page" ref={pageRef}>
      <div className="container">
        
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">
            Checkout 
            <span className="checkout-count-badge">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
          </h1>
          <Link to="/menu" className="checkout-back-btn">
            ← Back to Menu
          </Link>
        </div>

        <div className="checkout-grid">
          {/* Billing Form */}
          <div className="checkout-form-card" ref={formRef}>
            <h2 className="checkout-form-title">Billing Details</h2>
            <form onSubmit={handlePlaceOrder}>
              <div className="checkout-form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                </div>
              </div>
              
              <div className="checkout-form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div className="checkout-form-row">
                <div className="form-group">
                  <label htmlFor="address">Street Address</label>
                  <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="123 Coffee St" />
                </div>
              </div>

              <div className="checkout-form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="Milan" />
                </div>
                <div className="form-group">
                  <label htmlFor="zip">ZIP / Postal Code</label>
                  <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} required placeholder="20121" />
                </div>
              </div>

              <button 
                type="submit"
                style={{ display: 'none' }}
                id="hidden-submit-btn"
              />
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary-card" ref={cardRef}>
            <h2 className="checkout-summary-title">Order Summary</h2>
            
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.name} className="checkout-item__img" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80' }} />
                  <div className="checkout-item__info">
                    <h3 className="checkout-item__name">{item.name}</h3>
                    <p className="checkout-item__price">${(item.price * item.qty).toFixed(2)}</p>
                    <div className="checkout-item__qty">
                      <button onClick={() => onUpdateQty(item.id, item.qty - 1)} aria-label="Decrease">−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, item.qty + 1)} aria-label="Increase">+</button>
                    </div>
                  </div>
                  <button className="checkout-item__remove" onClick={() => onRemove(item.id)} aria-label="Remove item">✕</button>
                </div>
              ))}
            </div>

            <div className="checkout-price-section" ref={priceRef}>
              <div className="price-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="checkout-error" style={{ background: '#fdf2f2', color: '#c81e1e', border: '1px solid #fde8e8', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', margin: '1rem 0', fontSize: '0.85rem', fontWeight: 500 }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="checkout-actions">
              <button 
                className="btn btn-primary btn-place-order" 
                onClick={() => document.getElementById('hidden-submit-btn').click()}
                onMouseEnter={buttonHover}
                onMouseLeave={buttonLeave}
                onMouseDown={buttonClick}
                disabled={dbLoading}
              >
                {dbLoading ? 'Processing...' : 'Place Order'}
              </button>
              <Link 
                to="/menu" 
                className="btn btn-outline btn-continue"
                onMouseEnter={buttonHover}
                onMouseLeave={buttonLeave}
                onMouseDown={buttonClick}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
