import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { navLinks, siteInfo } from '../data/siteData';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar({ cartCount, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, profile, signOut } = useAuth();
  const navRef = useRef(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  /* Sticky scroll */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* GSAP mount animation */
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  /* Close menu on route change */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  /* Mobile menu stagger animation */
  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        '.navbar__nav--open .navbar__link',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out', delay: 0.15 }
      );
    }
  }, [menuOpen]);

  // Click outside to close user dropdown menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80';

  return (
    <header
      ref={navRef}
      className={`navbar${scrolled ? ' navbar--scrolled glass' : ''}${isHome && !scrolled ? ' navbar--transparent' : ''}${menuOpen ? ' navbar--open' : ''}`}
    >
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon gradient-text">✦</span>
          <div>
            <span className="navbar__logo-name">{siteInfo.name}</span>
            <span className="navbar__logo-tag">{siteInfo.tagline}</span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className={`navbar__nav${menuOpen ? ' navbar__nav--open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link${location.pathname === link.path ? ' navbar__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cart + Profile Dropdown + Hamburger */}
        <div className="navbar__actions">
          {/* Cart */}
          <button
            className="navbar__cart"
            onClick={onCartOpen}
            aria-label="Open cart"
          >
            🛍️
            {cartCount > 0 && (
              <span className="navbar__cart-badge">{cartCount}</span>
            )}
          </button>

          {/* User Account Section */}
          {user ? (
            <div className="navbar__user-menu-wrapper" ref={dropdownRef}>
              <button
                className="navbar__user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="Toggle user menu"
              >
                <img
                  src={profile?.avatar_url || defaultAvatar}
                  alt="User Avatar"
                  className="navbar__avatar"
                />
              </button>
              {userMenuOpen && (
                <div className="navbar__dropdown glass">
                  <div className="navbar__dropdown-header">
                    <strong>{profile?.full_name || 'Coffee Lover'}</strong>
                    <span>{profile?.email || user.email}</span>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <Link 
                    to="/profile" 
                    className="navbar__dropdown-item" 
                    onClick={() => setUserMenuOpen(false)}
                  >
                    👤 Profile Settings
                  </Link>
                  <Link 
                    to="/orders" 
                    className="navbar__dropdown-item" 
                    onClick={() => setUserMenuOpen(false)}
                  >
                    📦 My Orders
                  </Link>
                  <div className="navbar__dropdown-divider" />
                  <button
                    className="navbar__dropdown-item logout"
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary navbar__login-btn">
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger menu */}
          <button
            className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="navbar__mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </header>
  );
}
