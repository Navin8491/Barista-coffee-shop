import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../lib/supabaseClient';
import './BlogPage.css';

gsap.registerPlugin(ScrollTrigger);

const getAuthorInfo = (id) => {
  const authors = [
    { name: 'Marco Bianchi', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' },
    { name: 'Sofia Romano', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80' },
    { name: 'Luca Ferrari', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' }
  ];
  return authors[Number(id) % 3];
};

const getReadTime = (content) => {
  try {
    const text = Array.isArray(content) 
      ? content.map(c => (c.body || '')).join(' ') 
      : (typeof content === 'string' ? content : '');
    const words = text.split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `${mins} min read`;
  } catch (e) {
    return '5 min read';
  }
};

const formatBlogDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return 'N/A';
  }
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroRef    = useRef(null);
  const gridRef    = useRef(null);
  const quoteRef   = useRef(null);
  const topicsRef  = useRef(null);

  const categories = ['All', 'Brewing Tips', 'Coffee Culture', 'Recipes', 'Cafe Stories', 'Reviews', 'Barista Guides'];
  const popularTopics = ['Espresso', 'Latte Art', 'Coffee Beans', 'Brewing', 'Specialty Coffee', 'Cafe Lifestyle'];

  // Fetch blogs from Supabase
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        console.log("Before Blogs Fetch");
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        console.log("After Blogs Fetch");
        console.log("Blogs Data:", data);
        console.log("Blogs Error:", error);

        if (error) {
          throw error;
        }
        setBlogsList(data || []);
      } catch (error) {
        console.error("Blogs Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Stagger reveal on page mount
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('[data-hero-anim]'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out', delay: 0.15 }
      );
    }
  }, []);

  // Map and filter blog posts based on category and search query
  const filteredPosts = useMemo(() => {
    return blogsList
      .map((post) => {
        const authorInfo = getAuthorInfo(post.id);
        return {
          id: post.id,
          slug: post.slug,
          title: post.title,
          category: post.category,
          date: formatBlogDate(post.created_at),
          author: authorInfo.name,
          authorAvatar: authorInfo.avatar,
          excerpt: post.short_description || '',
          image: post.image_url,
          readTime: getReadTime(post.content),
        };
      })
      .filter((post) => {
        const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
        const matchesSearch =
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
  }, [blogsList, activeCategory, searchQuery]);


  // Split into Featured and Grid posts
  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  // Stagger animations when filtered posts change
  useEffect(() => {
    if (featuredPost) {
      gsap.fromTo(
        '.blog-featured',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }
      );
    }
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

  // Parallax elements animations (scroll scrub & mouse move)
  useEffect(() => {
    // 1. Scroll Parallax
    const decors = document.querySelectorAll('.blog-decor');
    decors.forEach((decor) => {
      const speed = parseFloat(decor.getAttribute('data-parallax-speed') || '0.2');
      gsap.to(decor, {
        yPercent: -180 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: '.blog-page',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        }
      });
    });

    // 2. Mouse Move Drift
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 35;
      const yPos = (clientY / window.innerHeight - 0.5) * 35;

      gsap.to('.blog-decor.float-1', { x: xPos * 0.6, y: yPos * 0.6, duration: 1.2, ease: 'power2.out' });
      gsap.to('.blog-decor.float-2', { x: -xPos * 0.9, y: -yPos * 0.9, duration: 1.4, ease: 'power2.out' });
      gsap.to('.blog-decor.float-3', { x: xPos * 1.3, y: yPos * 0.7, duration: 1.6, ease: 'power2.out' });
      gsap.to('.blog-decor.float-4', { x: -xPos * 0.5, y: yPos * 1.2, duration: 1.1, ease: 'power2.out' });
      gsap.to('.blog-decor.float-5', { x: xPos * 0.8, y: -yPos * 0.6, duration: 1.3, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="blog-page">
      {/* ── Ambient Background Layering ── */}
      <div className="blog-decorations-container">
        <div className="blog-decor float-1" data-parallax-speed="0.25">☕</div>
        <div className="blog-decor float-2" data-parallax-speed="0.45">🌱</div>
        <div className="blog-decor float-3" data-parallax-speed="0.30">✨</div>
        <div className="blog-decor float-4" data-parallax-speed="0.15">🍂</div>
        <div className="blog-decor float-5" data-parallax-speed="0.35">🟤</div>
        <div className="blog-bg-glow glow-1" />
        <div className="blog-bg-glow glow-2" />
        <div className="blog-bg-glow glow-3" />
      </div>

      {/* ── Section 1: Hero & Filters (#FCF8F4 with Gradient) ── */}
      <section className="blog-section-1">
        {/* Magazine Hero */}
        <div className="blog-hero" ref={heroRef}>
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
        </div>

        {/* Filter Tabs */}
        <div className="blog-filters-section">
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
        </div>
      </section>

      {/* ── Section 2: Featured Article (#FFFDFB) ── */}
      {filteredPosts.length > 0 && featuredPost && (
        <section className="blog-featured-section section-pad">
          <div className="container">
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
          </div>
        </section>
      )}

      {/* ── Section 3: Articles Grid Feed (#F8F1EA) ── */}
      <section className="blog-feed-section section-pad">
        <div className="container">
          {loading ? (
            <div className="grid-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-card skeleton" style={{ height: '350px' }} />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
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

                      {/* Coffee Quote Breakout - Injected dynamically after the 2nd grid card */}
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

      {/* ── Section 4: Popular Topics Section (#FFFFFF) ── */}
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
