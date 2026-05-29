import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
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
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if item is in user favorites
  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }

    const checkFavorite = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .maybeSingle();

        if (error) throw error;
        setIsFavorite(!!data);
      } catch (err) {
        console.warn('Error checking favorite:', err);
      }
    };

    checkFavorite();
  }, [user, product.id]);

  // Toggle favorite status
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Please sign in to save products to your favorites.');
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id,
          });

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

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

        {/* Favorite Bookmark Heart Button */}
        <button
          className={`product-card__favorite${isFavorite ? ' is-favorite' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
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
            <span className="product-card__price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="product-card__original">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <Stars rating={product.rating || 5} />
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
