import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { blogPosts } from '../data/siteData';
import './BlogDetailPage.css';

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.id === Number(id));

  const heroRef    = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!post) return;

    // Hero image + overlay text
    gsap.fromTo(
      heroRef.current?.querySelectorAll('[data-anim]'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
    );

    // Content sections cascade in
    gsap.fromTo(
      contentRef.current?.querySelectorAll('[data-section]'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.4 }
    );
  }, [post]);

  // 404-style fallback
  if (!post) {
    return (
      <div className="bd-notfound">
        <h2>Article not found</h2>
        <p>The post you are looking for does not exist.</p>
        <Link to="/blog" className="btn btn-primary">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="bd-hero"
        style={{ backgroundImage: `url(${post.image})` }}
        ref={heroRef}
      >
        <div className="bd-hero__overlay" />
        <div className="container bd-hero__inner">
          <Link to="/blog" className="bd-back" data-anim>
            ← Back to Blog
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
            <span>✍️ {post.author}</span>
            <span>📅 {post.date}</span>
            <span>⏱ {post.readTime}</span>
          </div>
        </div>
      </section>

      {/* ── Article body ── */}
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

          {/* Footer / nav */}
          <div className="bd-footer-row" data-section>
            <Link to="/blog" className="btn btn-outline">
              ← All Articles
            </Link>

            {/* Related posts (prev / next in array) */}
            <div className="bd-related">
              {blogPosts.find((p) => p.id === post.id - 1) && (
                <Link
                  to={`/blog/${post.id - 1}`}
                  className="bd-related__link"
                >
                  ‹ Previous
                </Link>
              )}
              {blogPosts.find((p) => p.id === post.id + 1) && (
                <Link
                  to={`/blog/${post.id + 1}`}
                  className="bd-related__link"
                >
                  Next ›
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* ── More Articles strip ── */}
      <section className="bd-more section-pad">
        <div className="container">
          <p className="section-label text-center">Keep Reading</p>
          <h2 className="section-title text-center" style={{ marginBottom: '2rem' }}>
            More from the Chronicles
          </h2>
          <div className="bd-more__grid">
            {blogPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 3)
              .map((p) => (
                <Link to={`/blog/${p.id}`} key={p.id} className="bd-more__card card">
                  <img src={p.image} alt={p.title} className="bd-more__img" loading="lazy" />
                  <div className="bd-more__body">
                    <span className="badge badge-best" style={{ fontSize: '0.65rem' }}>
                      {p.category}
                    </span>
                    <h3 className="bd-more__title">{p.title}</h3>
                    <p className="bd-more__meta">⏱ {p.readTime}</p>
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
