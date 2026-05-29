import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
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
  
  const [avgRating, setAvgRating] = useState(product.rating || 5);
  const [reviewCount, setReviewCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProductStats = async () => {
    try {
      const { data: revData, error: revError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', product.id);

      console.log("DATA:", revData);
      console.log("ERROR:", revError);

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

      // 2. Fetch favorite status
      if (user) {
        const { data: favData, error: favError } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .maybeSingle();

        if (favError) throw favError;
        setIsFavorite(!!favData);
      } else {
        setIsFavorite(false);
      }
    } catch (err) {
      console.error('Error fetching product stats:', err);
    }
  };

  useEffect(() => {
    fetchProductStats();
  }, [product.id, user]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to add favorites!');
      return;
    }

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id,
          });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const originalPrice = product.originalPrice ? (typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice) : null;
  const productImg = product.image_url || product.image;

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
            className={`product-card__favorite${isFavorite ? ' active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
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

