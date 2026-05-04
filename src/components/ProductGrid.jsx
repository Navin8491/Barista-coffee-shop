import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from './ProductCard';
import './ProductGrid.css';

gsap.registerPlugin(ScrollTrigger);

export default function ProductGrid({ products, onAddToCart, title, subtitle, label }) {
  const sectionRef  = useRef(null);
  const headerRef   = useRef(null);
  const cardsRef    = useRef([]);

  useEffect(() => {
    /* Header reveal */
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

    /* Card stagger */
    gsap.fromTo(
      cardsRef.current.filter(Boolean),
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

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [products]);

  return (
    <section ref={sectionRef} className="product-grid__section section-pad">
      <div className="container">
        <div ref={headerRef} className="text-center">
          {label && <p className="section-label">{label}</p>}
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>

        <div className="grid-4 product-grid">
          {products.map((product, i) => (
            <div
              key={product.id}
              ref={(el) => (cardsRef.current[i] = el)}
            >
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
