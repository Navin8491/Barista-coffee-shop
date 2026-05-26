import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { footerData, siteInfo, navLinks } from '../data/siteData';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const cols = footerRef.current?.querySelectorAll('.footer__col');
    if (!cols) return;
    gsap.fromTo(
      cols,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <footer ref={footerRef} className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* About */}
          <div className="footer__col">
            <div className="footer__brand">
              <span className="footer__brand-icon gradient-text">✦</span>
              <span className="footer__brand-name">{siteInfo.name}</span>
            </div>
            <p className="footer__about">{footerData.about}</p>
            <div className="footer__social">
              {Object.entries(siteInfo.social).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link"
                  aria-label={key}
                >
                  {key === 'facebook'  ? 'f'
                 : key === 'twitter'   ? '𝕏'
                 : key === 'instagram' ? '📸'
                 : key === 'linkedin'  ? 'in'
                 : key === 'youtube'   ? '▶'
                 : key.charAt(0).toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div className="footer__col">
            <h4 className="footer__heading">Useful Links</h4>
            <ul className="footer__list">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer__link">
                    <span className="footer__link-arrow">→</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="footer__col">
            <h4 className="footer__heading">Information</h4>
            <ul className="footer__list">
              {footerData.infoLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="footer__link">
                    <span className="footer__link-arrow">→</span> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__heading">Get In Touch</h4>
            <ul className="footer__contact-list">
              <li>
                <span className="footer__contact-icon">📍</span>
                <span>{footerData.contact.address}</span>
              </li>
              <li>
                <span className="footer__contact-icon">📞</span>
                <a href={`tel:${footerData.contact.phone}`} className="footer__link">
                  {footerData.contact.phone}
                </a>
              </li>
              <li>
                <span className="footer__contact-icon">✉️</span>
                <a href={`mailto:${footerData.contact.email}`} className="footer__link">
                  {footerData.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} {siteInfo.name}. All rights reserved.</p>
          <p>Crafted with ❤️ and ☕</p>
        </div>
      </div>
    </footer>
  );
}
