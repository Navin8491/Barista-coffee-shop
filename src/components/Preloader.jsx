import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader${hidden ? ' hidden' : ''}`}>
      <div className="preloader-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}
