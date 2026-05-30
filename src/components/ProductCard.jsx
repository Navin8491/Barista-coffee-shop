import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoriteContext';
import { reviewService } from '../services/reviewService';
import ReviewsModal from './ReviewsModal';
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
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [avgRating, setAvgRating] = useState(product.rating || 5);
  const [reviewCount, setReviewCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProductStats = useCallback(async () => {
    console.log(`Fetch start: product stats for product ${product.id}`);
    try {
      const { data: revData, error: revError } = await reviewService.getReviewsForProduct(product.id);

      if (revError) throw revError;

      if (revData && revData.length > 0) {
        const avg = revData.reduce((sum, r) => sum + r.rating, 0) / revData.length;
        setAvgRating(Math.round(avg));
        setReviewCount(revData.length);
      } else {
        // Fallback to static product rating or 5
        setAvgRating(product.rating || 5);
        setReviewCount(0);
      }
      console.log("Fetch complete: product stats");
    } catch (err) {
      console.error('Fetch error: product stats', err);
      setAvgRating(product.rating || 5);
      setReviewCount(0);
    }
  }, [product.id, product.rating]);

  useEffect(() => {
    fetchProductStats();
  }, [fetchProductStats]);

  const handleToggleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to add favorites!');
      return;
    }

    try {
      await toggleFavorite(product.id);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert(err.message || 'Failed to toggle favorite.');
    }
  };

  const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const originalPrice = product.originalPrice ? (typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice) : null;
  const productImg = product.image_url || product.image;
  const favorited = isFavorite(product.id);

  return (
    <>
      <div className="product-card card">
        <div className="product-card__img-wrap">
          <img
            src={productImg}
            alt={product.name}
            className="product-card__img"
            loading="lazy"
          />
          {product.tag && (
            <span className={`badge product-card__badge ${getBadgeClass(product.tag)}`}>
              {product.tag}
            </span>
          )}

          {/* Favorite button */}
          <button
            className={`product-card__favorite${favorited ? ' active' : ''}`}
            onClick={handleToggleFavoriteClick}
            aria-label={favorited ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          >
            ❤️
          </button>

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
              <span className="product-card__price">${productPrice.toFixed(2)}</span>
              {originalPrice && (
                <span className="product-card__original">${originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            {/* Reviews Trigger */}
            <button 
              className="product-card__reviews-trigger" 
              onClick={() => setModalOpen(true)}
              aria-label="View reviews"
            >
              <Stars rating={avgRating} />
              <span className="product-card__reviews-count">({reviewCount})</span>
            </button>
          </div>

          <button
            className="btn btn-outline product-card__btn"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <ReviewsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productId={product.id}
        productName={product.name}
        onReviewSubmitted={fetchProductStats}
      />
    </>
  );
}
