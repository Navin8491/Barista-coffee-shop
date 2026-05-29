import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { blogPosts } from '../data/siteData';
import './BlogDetailPage.css';

export default function BlogDetailPage() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === Number(id));

  const heroRef    = useRef(null);
  const contentRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!post) return;

    // Hero fade and slide
    gsap.fromTo(
      heroRef.current?.querySelectorAll('[data-anim]'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
    );

    // Cascading sections reveal
    gsap.fromTo(
      contentRef.current?.querySelectorAll('[data-section]'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.4 }
    );
  }, [post]);

  // Related posts prioritization (same category first)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    const sameCat = blogPosts.filter((p) => p.id !== post.id && p.category === post.category);
    if (sameCat.length >= 3) return sameCat.slice(0, 3);
    const diffCat = blogPosts.filter((p) => p.id !== post.id && p.category !== post.category);
    return [...sameCat, ...diffCat].slice(0, 3);
  }, [post]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!post) {
    return (
      <div className="bd-notfound">
        <h2>Article not found</h2>
        <p>The post you are looking for does not exist.</p>
        <Link to="/blog" className="btn btn-primary">← Back to Journal</Link>
      </div>
    );
  }

  return (
    <>
      {/* ── Magazine Article Hero ── */}
      <section
        className="bd-hero"
        style={{ backgroundImage: `url(${post.image})` }}
        ref={heroRef}
      >
        <div className="bd-hero__overlay" />
        <div className="container bd-hero__inner">
          <Link to="/blog" className="bd-back" data-anim>
            ← Back to Journal
          </Link>
          <span className="badge badge-best bd-hero__cat" data-anim>
            {post.category}
          </span>
          <h1 className="bd-hero__title" data-anim>{post.title}</h1>
          
          <div className="bd-hero__meta" data-anim>
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="bd-hero__avatar"
            />
            <span>✍️ By {post.author}</span>
            <span>📅 {post.date}</span>
            <span>⏱ {post.readTime}</span>
          </div>
        </div>
      </section>

      {/* ── Article content ── */}
      <article className="bd-article section-pad">
        <div className="container bd-article__inner" ref={contentRef}>

          {/* Lead excerpt */}
          <p className="bd-lead" data-section>{post.excerpt}</p>

          <div className="bd-divider" data-section />

          {/* Full content sections */}
          {post.fullContent.map((section, i) => (
            <section key={i} className="bd-section" data-section>
              <h2 className="bd-section__heading">{section.heading}</h2>
              <p className="bd-section__body">{section.body}</p>
            </section>
          ))}

          <div className="bd-divider" data-section />

          {/* Share Buttons Strip */}
          <div className="bd-share-container" data-section>
            <span className="bd-share-title">Share this story:</span>
            <div className="bd-share-buttons">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bd-share-btn fb"
                aria-label="Share on Facebook"
              >
                f
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bd-share-btn tw"
                aria-label="Share on Twitter"
              >
                𝕏
              </a>
              <button 
                onClick={handleCopyLink} 
                className="bd-share-btn copy"
                aria-label="Copy article link"
              >
                {copied ? '✓' : '🔗'}
                {copied && <span className="bd-copied-tooltip">Link Copied!</span>}
              </button>
            </div>
          </div>

          {/* Footer Navigation Row */}
          <div className="bd-footer-row" data-section>
            <Link to="/blog" className="btn btn-outline">
              ← All Articles
            </Link>

            {/* Related posts (prev / next in array) */}
            <div className="bd-related">
              {blogPosts.find((p) => p.id === post.id - 1) && (
                <Link to={`/blog/${post.id - 1}`} className="bd-related__link">
                  ‹ Previous Article
                </Link>
              )}
              {blogPosts.find((p) => p.id === post.id + 1) && (
                <Link to={`/blog/${post.id + 1}`} className="bd-related__link">
                  Next Article ›
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* ── More Articles Recommendation strip ── */}
      <section className="bd-more section-pad">
        <div className="container">
          <p className="section-label text-center">Keep Reading</p>
          <h2 className="section-title text-center" style={{ marginBottom: '3rem' }}>
            More from the Chronicles
          </h2>
          
          <div className="bd-more__grid">
            {relatedPosts.map((p) => (
              <Link to={`/blog/${p.id}`} key={p.id} className="bd-more__card card">
                <div className="bd-more__img-wrap">
                  <img src={p.image} alt={p.title} className="bd-more__img" loading="lazy" />
                  <span className="badge badge-best bd-more__cat">{p.category}</span>
                </div>
                <div className="bd-more__body">
                  <h3 className="bd-more__title">{p.title}</h3>
                  <p className="bd-more__meta">⏱ {p.readTime} &nbsp;•&nbsp; By {p.author}</p>
                  <span className="blog-card__link">
                    Read More <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
