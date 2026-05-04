import React, { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      id="scroll-top-btn"
      className={visible ? 'visible' : ''}
      onClick={scrollUp}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}
