import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { blogPosts } from '../data/siteData';
import './BlogPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function BlogPage() {
  const headerRef = useRef(null);
  const gridRef   = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current?.querySelectorAll('[data-anim]'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );
    const cards = gridRef.current?.querySelectorAll('.blog-card');
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true },
      }
    );
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container" ref={headerRef}>
          <p className="section-label" data-anim>Blog & Stories</p>
          <h1 data-anim>Coffee Chronicles</h1>
          <p data-anim>Dive into brewing tips, origin stories, and the world of specialty coffee.</p>
        </div>
      </section>

      {/* Posts */}
      <section className="blog-section section-pad">
        <div className="container">
          <div className="grid-3" ref={gridRef}>
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-card card">
                <div className="blog-card__img-wrap">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="blog-card__img"
                    loading="lazy"
                  />
                  <span className="badge badge-best blog-card__cat">{post.category}</span>
                </div>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span>✍️ {post.author}</span>
                    <span>📅 {post.date}</span>
                    <span>⏱ {post.readTime}</span>
                  </div>
                  <h3 className="blog-card__title">{post.title}</h3>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="blog-card__link">
                    Read More <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
