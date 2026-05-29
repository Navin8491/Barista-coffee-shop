import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from './ProductCard';
import './ProductGrid.css';

gsap.registerPlugin(ScrollTrigger);

export default function ProductGrid({ products = [], onAddToCart, title, subtitle, label, loading, error }) {
  const sectionRef  = useRef(null);
  const headerRef   = useRef(null);
  const cardsRef    = useRef([]);

  useEffect(() => {
    /* Header reveal */
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }

    /* Card stagger */
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [products, loading, error]);

  return (
    <section ref={sectionRef} className="product-grid__section section-pad">
      <div className="container">
        <div ref={headerRef} className="text-center">
          {label && <p className="section-label">{label}</p>}
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>

        <div className="grid-4 product-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-card skeleton" style={{ height: '380px' }} />
            ))
          ) : error ? (
            <div className="no-products-found" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem 1rem' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>❌</span>
              <h3>Unable to load products.</h3>
              <p style={{ color: 'var(--coffee)', marginTop: '0.5rem' }}>An error occurred while fetching the menu items. Please try again later.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products-found" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem 1rem' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>☕</span>
              <h3>No products found</h3>
              <p style={{ color: 'var(--coffee)', marginTop: '0.5rem' }}>We couldn't load any products right now.</p>
            </div>
          ) : (
            products.map((product, i) => (
              <div
                key={product.id}
                ref={(el) => (cardsRef.current[i] = el)}
              >
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
