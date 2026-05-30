import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { siteInfo } from '../data/siteData';
import { contactService } from '../services/contactService';
import './ContactPage.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const headerRef = useRef(null);
  const formRef   = useRef(null);
  const infoRef   = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.querySelectorAll('[data-anim]'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      );
    }
    if (formRef.current && infoRef.current) {
      gsap.fromTo(
        [formRef.current, infoRef.current],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.15, ease: 'power3.out', delay: 0.4 }
      );
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Fetch start: submit contact message");
    setLoading(true);
    setError('');
    
    try {
      const { error: dbError } = await contactService.submitMessage(form);

      if (dbError) throw dbError;

      console.log("Fetch complete: submit contact message");
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Fetch error: submit contact message failed', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container" ref={headerRef}>
          <p className="section-label" data-anim>Get In Touch</p>
          <h1 data-anim>We'd Love to Hear from You</h1>
          <p data-anim>Visit us, call us, or drop us a message — we're always happy to help.</p>
        </div>
      </section>

      {/* Main content */}
      <section className="contact-section section-pad">
        <div className="container">
          <div className="contact-grid">
            {/* Form */}
            <div ref={formRef} className="contact-form-wrap card">
              <h3 className="contact-form__title">Send a Message</h3>
              {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}
              {submitted ? (
                <div className="contact-success">
                  <span>✅</span>
                  <h4>Message Sent!</h4>
                  <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-name">Your Name</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-email">Email Address</label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-subject">Subject</label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      placeholder="Tell us more..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`btn btn-primary contact-form__submit${loading ? ' loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : '✉️  Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Info panel */}
            <div ref={infoRef} className="contact-info">
              {/* Info cards */}
              {[
                { icon: '📍', title: 'Our Location', content: siteInfo.address },
                { icon: '📞', title: 'Phone Number', content: siteInfo.phone, href: `tel:${siteInfo.phone}` },
                { icon: '✉️',  title: 'Email Address', content: siteInfo.email, href: `mailto:${siteInfo.email}` },
                { icon: '🕐', title: 'Opening Hours', content: 'Mon–Fri: 7am – 8pm\nSat–Sun: 8am – 7pm' },
              ].map((item) => (
                <div key={item.title} className="contact-info__card card">
                  <div className="contact-info__icon">{item.icon}</div>
                  <div>
                    <h4 className="contact-info__title">{item.title}</h4>
                    {item.href ? (
                      <a href={item.href} className="contact-info__val">{item.content}</a>
                    ) : (
                      <p className="contact-info__val" style={{ whiteSpace: 'pre-line' }}>{item.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Map embed placeholder */}
              <div className="contact-map">
                <iframe
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2790.864!2d9.261!3d45.984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDU5JzAyLjQiTiA5wrAxNSc0MC42IkU!5e0!3m2!1sen!2sit!4v1234567890"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
