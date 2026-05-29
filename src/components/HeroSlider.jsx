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
      { y: 70, opacity: 0, scale: 0.95 },
      { y: 0,  opacity: 1, scale: 1, duration: 0.85, ease: 'power4.out' }
    )
    .fromTo(
      subRef.current,
      { y: 40, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.75, ease: 'power3.out' },
      '-=0.55'
    )
    .fromTo(
      btnRef.current,
      { y: 30, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.65, ease: 'power3.out' },
      '-=0.5'
    );
  }, []);

  /* ── Mount animation & Parallax ── */
  useEffect(() => {
    // Social links stagger
    gsap.fromTo(
      '.hero-social__link',
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 1, ease: 'power2.out' }
    );

    // Auto-float animation for background details
    gsap.to('.float-1', {
      y: '+=15',
      x: '-=10',
      rotation: 15,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    gsap.to('.float-2', {
      y: '-=20',
      x: '+=15',
      rotation: -25,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    gsap.to('.float-3', {
      y: '+=25',
      x: '+=10',
      rotation: 30,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    gsap.to('.float-4', {
      y: '-=15',
      x: '-=20',
      rotation: -15,
      duration: 5.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);

  /* Parallax hover movement */
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 40;
      const yPos = (clientY / window.innerHeight - 0.5) * 40;
      
      gsap.to('.float-1', { x: xPos * 0.5, y: yPos * 0.5, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
      gsap.to('.float-2', { x: xPos * -0.6, y: yPos * -0.6, duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
      gsap.to('.float-3', { x: xPos * 0.8, y: yPos * -0.8, duration: 1.8, ease: 'power2.out', overwrite: 'auto' });
      gsap.to('.float-4', { x: xPos * -0.4, y: yPos * 0.4, duration: 1.4, ease: 'power2.out', overwrite: 'auto' });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /* Run text animation on slide change */
  useEffect(() => {
    animateText();
  }, [current, animateText]);

  /* Auto-advance */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (idx) => {
    if (isAnimating || idx === current) return;
    setIsAnimating(true);
    clearInterval(timerRef.current);
    setCurrent(idx);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
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

      {/* Floating Decorative Icons for Parallax & Coffee Theme */}
      <div className="hero__decor float-1" style={{ top: '20%', left: '10%' }}>
        <svg width="50" height="50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 4C32 4 38 18 44 24C50 30 64 32 64 32C64 32 50 34 44 40C38 46 32 60 32 60C32 60 26 46 20 40C14 34 0 32 0 32C0 32 14 30 20 24C26 18 32 4 32 4Z" fill="var(--gold)" opacity="0.3"/>
        </svg>
      </div>
      <div className="hero__decor float-2" style={{ bottom: '25%', right: '15%' }}>
        <svg width="35" height="35" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 4C32 4 38 18 44 24C50 30 64 32 64 32C64 32 50 34 44 40C38 46 32 60 32 60C32 60 26 46 20 40C14 34 0 32 0 32C0 32 14 30 20 24C26 18 32 4 32 4Z" fill="var(--gold)" opacity="0.2"/>
        </svg>
      </div>
      <div className="hero__decor float-3" style={{ top: '25%', right: '12%', fontSize: '2.5rem', userSelect: 'none', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}>
        ☕
      </div>
      <div className="hero__decor float-4" style={{ bottom: '20%', left: '15%', fontSize: '2.2rem', userSelect: 'none', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}>
        🌿
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
