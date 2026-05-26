import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

function Stars({ rating }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`star${i < rating ? '' : ' empty'}`}>★</span>
      ))}
    </div>
  );
}

function getBadgeClass(tag) {
  if (!tag) return '';
  if (tag === 'Sale')       return 'badge-sale';
  if (tag === 'New')        return 'badge-new';
  if (tag === 'Popular')    return 'badge-popular';
  if (tag === 'Bestseller') return 'badge-best';
  return 'badge-best';
}

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card card">
      <div className="product-card__img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
        />
        {product.tag && (
          <span className={`badge product-card__badge ${getBadgeClass(product.tag)}`}>
            {product.tag}
          </span>
        )}
        <button
          className="product-card__quick-add"
          onClick={() => onAddToCart(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          + Add to Cart
        </button>
      </div>

      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__footer">
          <div className="product-card__price-wrap">
            <span className="product-card__price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="product-card__original">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <Stars rating={product.rating} />
        </div>

        <button
          className="btn btn-outline product-card__btn"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
