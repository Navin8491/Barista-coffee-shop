import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../components/ProductCard';
import { products, menuCategories } from '../data/siteData';
import './MenuPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function MenuPage({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const gridRef = useRef(null);
  const headerRef = useRef(null);

  const filtered = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  /* GSAP hero header */
  useEffect(() => {
    gsap.fromTo(
      headerRef.current?.querySelectorAll('[data-anim]'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  /* GSAP cards on filter change */
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.menu-card-wrap');
    if (!cards) return;
    gsap.fromTo(
      cards,
      { y: 30, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, [filtered.length, activeCategory]);

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container" ref={headerRef}>
          <p className="section-label" data-anim>Our Menu</p>
          <h1 data-anim>Crafted Drinks & Bites</h1>
          <p data-anim>
            Every item on our menu is prepared with premium ingredients and a whole lot of love.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="menu-filter section-pad">
        <div className="container">
          <div className="menu-filter__tabs">
            {menuCategories.map((cat) => (
              <button
                key={cat}
                className={`menu-filter__tab${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="menu-filter__count">
            Showing <strong>{filtered.length}</strong> items{activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
          </p>

          <div className="grid-4" ref={gridRef}>
            {filtered.map((product) => (
              <div key={product.id} className="menu-card-wrap">
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
