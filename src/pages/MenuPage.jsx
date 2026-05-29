import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../components/ProductCard';
import { products, menuCategories } from '../data/siteData';
import { supabase } from '../supabaseClient';
import './MenuPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function MenuPage({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const gridRef = useRef(null);
  const headerRef = useRef(null);

  // Fetch products from Supabase with static mock fallback
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('category');

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((item) => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            image: item.image_url,
            category: item.category,
            description: item.description,
          }));
          setDbProducts(mapped);
        } else {
          setDbProducts(products);
        }
      } catch (err) {
        console.warn('Failed to load products from Supabase, using mock products:', err);
        setDbProducts(products);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = activeCategory === 'All'
    ? dbProducts
    : dbProducts.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

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
    if (!cards || cards.length === 0) return;
    gsap.fromTo(
      cards,
      { y: 30, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, [filtered.length, activeCategory, loading]);

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

          {loading ? (
            <div className="menu-loading" style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div className="spinner" style={{ width: '36px', height: '36px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
              <p style={{ color: 'var(--gray-500)' }}>Loading menu items...</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </>
  );
}
