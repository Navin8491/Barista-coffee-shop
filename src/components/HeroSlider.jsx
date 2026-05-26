import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { slides, siteInfo } from '../data/siteData';
import './HeroSlider.css';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);
  const textRef   = useRef(null);
  const titleRef  = useRef(null);
  const subRef    = useRef(null);
  const btnRef    = useRef(null);
  const timerRef  = useRef(null);

  /* ── GSAP text reveal per slide ── */
  const animateText = useCallback(() => {
    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });
    tl.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.75, ease: 'power3.out' }
    )
    .fromTo(
      subRef.current,
      { y: 40, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.65, ease: 'power3.out' },
      '-=0.45'
    )
    .fromTo(
      btnRef.current,
      { y: 30, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.55, ease: 'power3.out' },
      '-=0.4'
    );
  }, []);

  /* ── Social links entrance ── */
  useEffect(() => {
    gsap.fromTo(
      '.hero-social__link',
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 1.2, ease: 'power2.out' }
    );
  }, []);

  /* Run text animation on slide change */
  useEffect(() => {
    animateText();
  }, [current, animateText]);

  /* Auto-advance */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (idx) => {
    if (isAnimating || idx === current) return;
    setIsAnimating(true);
    clearInterval(timerRef.current);
    setCurrent(idx);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="hero" ref={containerRef}>
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`hero__bg${i === current ? ' hero__bg--active' : ''}`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}

      {/* Dark overlay */}
      <div className="hero__overlay" />

      {/* Floating Smoke Effect */}
      <div className="hero__smoke-container">
        <div className="smoke smoke-1"></div>
        <div className="smoke smoke-2"></div>
        <div className="smoke smoke-3"></div>
      </div>

      {/* Content */}
      <div ref={textRef} className="hero__content">
        <p className="hero__eyebrow">☕ {siteInfo.name}</p>
        <h1 ref={titleRef} className="hero__title">{slide.title}</h1>
        <p  ref={subRef}   className="hero__subtitle">{slide.subtitle}</p>
        <div ref={btnRef} className="hero__cta">
          <Link to={slide.buttonLink} className="btn btn-primary">
            {slide.buttonText}
          </Link>
          <Link to="/contact" className="btn btn-white">
            Find Us
          </Link>
        </div>
      </div>

      {/* Slide dots */}
      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot${i === current ? ' hero__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button className="hero__arrow hero__arrow--prev" onClick={prev} aria-label="Previous">
        ‹
      </button>
      <button className="hero__arrow hero__arrow--next" onClick={next} aria-label="Next">
        ›
      </button>

      {/* Social links */}
      <div className="hero-social">
        {Object.entries(siteInfo.social).map(([key, url]) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social__link"
            aria-label={key}
          >
            {key === 'facebook'  ? 'f'
           : key === 'twitter'   ? '𝕏'
           : key === 'instagram' ? '📸'
           : key === 'linkedin'  ? 'in'
           : key === 'youtube'   ? '▶'
           : key.charAt(0).toUpperCase()}
          </a>
        ))}
      </div>

      {/* Slide counter */}
      <div className="hero__counter">
        <span>{String(current + 1).padStart(2, '0')}</span>
        <span className="hero__counter-sep" />
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
