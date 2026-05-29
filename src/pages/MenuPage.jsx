import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../components/ProductCard';
import { menuCategories } from '../data/siteData';
import { supabase } from '../lib/supabaseClient';
import './MenuPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function MenuPage({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const gridRef = useRef(null);
  const headerRef = useRef(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setDbProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category and search term
  const filtered = dbProducts.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  /* GSAP hero header */
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.querySelectorAll('[data-anim]'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, []);

  /* GSAP cards on filter / search change */
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.menu-card-wrap');
    if (!cards || cards.length === 0) return;
    gsap.fromTo(
      cards,
      { y: 30, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, [filtered.length, activeCategory, searchTerm]);

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
          {/* Search bar */}
          <div className="menu-search-wrap">
            <span className="menu-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for espresso, latte, cake, toast..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="menu-search-input"
            />
          </div>

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
            {loading ? (
              <span>Loading menu...</span>
            ) : (
              <span>
                Showing <strong>{filtered.length}</strong> item{filtered.length !== 1 ? 's' : ''}
                {activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            )}
          </p>

          {loading ? (
            <div className="grid-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-card skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid-4" ref={gridRef}>
              {filtered.map((product) => (
                <div key={product.id} className="menu-card-wrap">
                  <ProductCard product={product} onAddToCart={onAddToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

