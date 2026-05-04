import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { navLinks, siteInfo } from '../data/siteData';
import './Navbar.css';

export default function Navbar({ cartCount, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
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
  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header
      ref={navRef}
      className={`navbar${scrolled ? ' navbar--scrolled' : ''}${isHome && !scrolled ? ' navbar--transparent' : ''}`}
    >
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">☕</span>
          <div>
            <span className="navbar__logo-name">{siteInfo.name}</span>
            <span className="navbar__logo-tag">{siteInfo.tagline}</span>
          </div>
        </Link>

        {/* Phone (desktop) */}
        <div className="navbar__phone">
          <span className="navbar__phone-icon">📞</span>
          <div>
            <span className="navbar__phone-label">{siteInfo.phoneLabel}</span>
            <a href={`tel:${siteInfo.phone}`} className="navbar__phone-num">{siteInfo.phone}</a>
          </div>
        </div>

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
          {/* Mobile phone */}
          <div className="navbar__phone navbar__phone--mobile">
            <a href={`tel:${siteInfo.phone}`}>{siteInfo.phone}</a>
          </div>
        </nav>

        {/* Cart + Hamburger */}
        <div className="navbar__actions">
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
