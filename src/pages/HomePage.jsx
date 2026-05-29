import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSlider from '../components/HeroSlider';
import ProductGrid from '../components/ProductGrid';
import { testimonials } from '../data/siteData';
import { supabase } from '../lib/supabaseClient';
import './HomePage.css';

gsap.registerPlugin(ScrollTrigger);

function TestimonialsSection() {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      ref.current?.querySelectorAll('.testimonial-card'),
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      }
    );
  }, []);
  return (
    <section ref={ref} className="testimonials section-pad">
      <div className="container">
        <div className="text-center">
          <p className="section-label">What People Say</p>
          <h2 className="section-title">Customer Love</h2>
          <p className="section-subtitle">Real stories from our wonderful community of coffee lovers.</p>
        </div>
        <div className="grid-3">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card card">
              <div className="testimonial-card__stars">
                {'★'.repeat(t.rating)}
              </div>
              <p className="testimonial-card__text">"{t.text}"</p>
              <div className="testimonial-card__author">
                <img src={t.avatar} alt={t.name} className="testimonial-card__avatar" />
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutBanner() {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      ref.current?.querySelectorAll('[data-anim]'),
      { x: -50, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true },
      }
    );
  }, []);
  return (
    <section ref={ref} className="about-banner section-pad">
      <div className="container about-banner__inner">
        <div className="about-banner__img-wrap">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&q=80"
            alt="Coffee bar"
            className="about-banner__img"
          />
          <div className="about-banner__badge" data-anim>
            <span className="about-banner__badge-num">15+</span>
            <span>Years of Craft</span>
          </div>
        </div>
        <div className="about-banner__content">
          <p className="section-label" data-anim>Our Story</p>
          <h2 className="section-title" data-anim>Passion Poured into Every Cup</h2>
          <p data-anim>
            We started Barista Coffee with a simple mission: to bring the art of specialty coffee
            to everyone. From sourcing single-origin beans to perfecting our espresso ratios,
            every detail matters to us.
          </p>
          <p data-anim>
            Our baristas are champions of their craft—trained, passionate, and dedicated to making
            your morning unforgettable.
          </p>
          <div className="about-banner__stats" data-anim>
            <div className="about-banner__stat">
              <strong>12K+</strong><span>Happy Customers</span>
            </div>
            <div className="about-banner__stat">
              <strong>48</strong><span>Menu Items</span>
            </div>
            <div className="about-banner__stat">
              <strong>15+</strong><span>Awards Won</span>
            </div>
          </div>
          <Link to="/contact" className="btn btn-primary" data-anim>
            Visit Us Today
          </Link>
        </div>
      </div>
    </section>
  );
}

function CoffeeProcess() {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      ref.current?.querySelectorAll('.process-step'),
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
      }
    );
  }, []);
  const steps = [
    { icon: '🌱', title: 'Sourced Ethically', desc: 'We partner with farms committed to sustainable farming practices.' },
    { icon: '🔥', title: 'Precision Roasted', desc: "In-house roasting to unlock each bean's unique flavor profile." },
    { icon: '⚗️', title: 'Expertly Brewed', desc: 'Baristas trained to extract the perfect shot, every time.' },
    { icon: '☕', title: 'Served with Love', desc: 'Your cup, crafted with care, warmth, and a smile.' },
  ];
  return (
    <section ref={ref} className="process section-pad">
      <div className="container">
        <div className="text-center">
          <p className="section-label">Our Process</p>
          <h2 className="section-title">From Bean to Cup</h2>
          <p className="section-subtitle">A meticulous journey that ensures every sip is exceptional.</p>
        </div>
        <div className="grid-4">
          {steps.map((step, i) => (
            <div key={i} className="process-step">
              <div className="process-step__num">{String(i + 1).padStart(2, '0')}</div>
              <div className="process-step__icon">{step.icon}</div>
              <h4 className="process-step__title">{step.title}</h4>
              <p className="process-step__desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      ref.current?.querySelector('.cta-inner'),
      { scale: 0.96, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      }
    );
  }, []);
  return (
    <section ref={ref} className="cta-section">
      <div className="container">
        <div className="cta-inner">
          <h2>Ready for the Perfect Cup?</h2>
          <p>Join thousands of coffee lovers who start their day with Barista Coffee.</p>
          <div className="cta-btns">
            <Link to="/menu" className="btn btn-white">Explore Our Menu</Link>
            <Link to="/contact" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
              Reserve a Table
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ onAddToCart }) {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log("Fetching products from Supabase for Home Page...");
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
        
        console.log("Home Page Products data fetched:", data);
        console.log("Home Page Products error (if any):", error);
        
        if (error) throw error;
        setDbProducts(data || []);
      } catch (err) {
        console.error('Error fetching products on Home Page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main>
      <HeroSlider />
      <ProductGrid
        products={dbProducts.slice(0, 4)}
        onAddToCart={onAddToCart}
        label="Featured Products"
        title="Our Bestsellers"
        subtitle="Handpicked favorites loved by our community — from rich espressos to indulgent pastries."
        loading={loading}
      />
      <AboutBanner />
      <CoffeeProcess />
      <ProductGrid
        products={dbProducts.slice(4)}
        onAddToCart={onAddToCart}
        label="More to Discover"
        title="Specialty Selection"
        subtitle="Seasonal offerings and chef's specials, freshly prepared each day."
        loading={loading}
      />
      <TestimonialsSection />
      <CtaBanner />
    </main>
  );
}
