import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { blogPosts } from '../data/siteData';
import './BlogPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const heroRef    = useRef(null);
  const gridRef    = useRef(null);
  const quoteRef   = useRef(null);
  const topicsRef  = useRef(null);

  const categories = ['All', 'Brewing Tips', 'Coffee Culture', 'Recipes', 'Cafe Stories', 'Reviews', 'Barista Guides'];
  const popularTopics = ['Espresso', 'Latte Art', 'Coffee Beans', 'Brewing', 'Specialty Coffee', 'Cafe Lifestyle'];

  // Stagger reveal on page mount
  useEffect(() => {
    gsap.fromTo(
      heroRef.current?.querySelectorAll('[data-hero-anim]'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out', delay: 0.15 }
    );
  }, []);

  // Filter blog posts based on category and search query
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Split into Featured and Grid posts
  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  // Stagger animations when filtered posts change
  useEffect(() => {
    // Fade up featured card
    if (featuredPost) {
      gsap.fromTo(
        '.blog-featured',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }
      );
    }
    // Stagger fade up normal cards
    const cards = gridRef.current?.querySelectorAll('.blog-card');
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  }, [filteredPosts.length, activeCategory, searchQuery]);

  // Quote scroll reveal
  useEffect(() => {
    if (!quoteRef.current) return;
    gsap.fromTo(
      quoteRef.current,
      { opacity: 0, scale: 0.96 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, [filteredPosts.length]);

  return (
    <main className="blog-page">
      {/* ── Magazine Hero ── */}
      <section className="blog-hero" ref={heroRef}>
        <div className="blog-hero__overlay" />
        <div className="container blog-hero__inner">
          <span className="badge badge-best blog-hero__badge" data-hero-anim>✦ Journal ✦</span>
          <h1 className="blog-hero__title" data-hero-anim>Coffee Stories & Inspirations</h1>
          <p className="blog-hero__sub" data-hero-anim>
            Explore brewing guides, coffee culture, barista secrets, and cafe stories.
          </p>
          
          {/* Search Bar */}
          <div className="blog-search-bar" data-hero-anim>
            <span className="blog-search-bar__icon">🔍</span>
            <input
              type="text"
              placeholder="Search articles, categories, tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search articles"
            />
            {searchQuery && (
              <button 
                className="blog-search-bar__clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <section className="blog-filters-section">
        <div className="container">
          <div className="blog-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`blog-filter-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Articles Feed ── */}
      <section className="blog-feed-section section-pad">
        <div className="container">
          {filteredPosts.length === 0 ? (
            <div className="blog-no-results">
              <span>☕</span>
              <h3>No articles found</h3>
              <p>Try adjusting your search terms or selecting a different category.</p>
              <button 
                className="btn btn-primary"
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredPost && (
                <div className="blog-featured">
                  <div className="blog-featured__img-wrap">
                    <img src={featuredPost.image} alt={featuredPost.title} className="blog-featured__img" />
                    <span className="badge badge-best blog-featured__cat">{featuredPost.category}</span>
                  </div>
                  <div className="blog-featured__content">
                    <p className="blog-featured__label">★ Featured Editorial</p>
                    <h2 className="blog-featured__title">{featuredPost.title}</h2>
                    <p className="blog-featured__excerpt">{featuredPost.excerpt}</p>
                    
                    <div className="blog-featured__meta">
                      <img src={featuredPost.authorAvatar} alt={featuredPost.author} className="blog-featured__avatar" />
                      <div>
                        <strong>{featuredPost.author}</strong>
                        <span>📅 {featuredPost.date} &nbsp;•&nbsp; ⏱ {featuredPost.readTime}</span>
                      </div>
                    </div>
                    
                    <Link to={`/blog/${featuredPost.id}`} className="btn btn-primary blog-featured__btn">
                      Read Full Article
                    </Link>
                  </div>
                </div>
              )}

              {/* Grid Articles */}
              {gridPosts.length > 0 && (
                <div className="grid-3 blog-grid" ref={gridRef}>
                  {gridPosts.map((post, idx) => (
                    <React.Fragment key={post.id}>
                      <article className="blog-card card">
                        <div className="blog-card__img-wrap">
                          <img src={post.image} alt={post.title} className="blog-card__img" loading="lazy" />
                          <span className="badge badge-best blog-card__cat">{post.category}</span>
                        </div>
                        <div className="blog-card__body">
                          <div className="blog-card__meta">
                            <span>📅 {post.date}</span>
                            <span>⏱ {post.readTime}</span>
                          </div>
                          <h3 className="blog-card__title">{post.title}</h3>
                          <p className="blog-card__excerpt">{post.excerpt}</p>
                          
                          <div className="blog-card__author-row">
                            <img src={post.authorAvatar} alt={post.author} className="blog-card__author-avatar" />
                            <span>By {post.author}</span>
                          </div>
                          
                          <Link to={`/blog/${post.id}`} className="blog-card__link">
                            Read More <span>→</span>
                          </Link>
                        </div>
                      </article>

                      {/* Coffee Quote Breakout - Injected dynamically after the 2nd grid card (index 1) */}
                      {idx === 1 && (
                        <div className="blog-quote" ref={quoteRef}>
                          <div className="blog-quote__inner">
                            <span className="blog-quote__mark">“</span>
                            <p className="blog-quote__text">Every cup tells a story.</p>
                            <span className="blog-quote__author">— Barista Journal</span>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Popular Topics Section ── */}
      <section className="blog-topics-section section-pad" ref={topicsRef}>
        <div className="container">
          <div className="blog-topics-card">
            <h3>Popular Topics</h3>
            <p>Select a tag to search specifically for these trending themes.</p>
            <div className="blog-topics-tags">
              {popularTopics.map((topic) => (
                <button
                  key={topic}
                  className="blog-topic-tag"
                  onClick={() => setSearchQuery(topic)}
                >
                  #{topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
