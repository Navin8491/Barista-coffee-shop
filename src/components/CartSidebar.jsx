import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './CartSidebar.css';

export default function CartSidebar({ isOpen, onClose, cartItems, onRemove, onUpdateQty }) {
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    onClose();
    navigate('/checkout');
  };

  useEffect(() => {
    if (isOpen) {
      gsap.to(sidebarRef.current, { x: 0, duration: 0.4, ease: 'power3.out' });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, pointerEvents: 'all' });
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(sidebarRef.current, { x: '100%', duration: 0.35, ease: 'power3.in' });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="cart-overlay"
        style={{ opacity: 0, pointerEvents: 'none' }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="cart-sidebar"
        style={{ transform: 'translateX(100%)' }}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="cart-sidebar__header">
          <h3>Your Cart</h3>
          <span className="cart-sidebar__count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
          <button className="cart-sidebar__close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {/* Items */}
        <div className="cart-sidebar__body">
          {cartItems.length === 0 ? (
            <div className="cart-sidebar__empty">
              <span>🛍️</span>
              <p>Your cart is empty</p>
              <button className="btn btn-primary" onClick={onClose}>Browse Menu</button>
            </div>
          ) : (
            <ul className="cart-sidebar__list">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item__img" />
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__price">${(item.price * item.qty).toFixed(2)}</p>
                    <div className="cart-item__qty">
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        aria-label="Decrease"
                      >−</button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        aria-label="Increase"
                      >+</button>
                    </div>
                  </div>
                  <button
                    className="cart-item__remove"
                    onClick={() => onRemove(item.id)}
                    aria-label="Remove item"
                  >✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-sidebar__footer">
            <div className="cart-sidebar__subtotal">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <p className="cart-sidebar__note">Shipping calculated at checkout</p>
            <button className="btn btn-primary cart-sidebar__checkout" onClick={handleCheckoutClick}>
              Proceed to Checkout
            </button>
            <button className="btn btn-outline cart-sidebar__continue" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
