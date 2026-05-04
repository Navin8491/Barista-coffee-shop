import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="notfound">
      <div className="notfound__inner">
        <div className="notfound__icon">☕</div>
        <h1 className="notfound__code">404</h1>
        <h2 className="notfound__title">Oops! Page not found</h2>
        <p className="notfound__text">
          Looks like this page got lost in the coffee grounds. Let's get you back on track.
        </p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
