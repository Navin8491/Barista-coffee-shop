import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './ReviewsModal.css';

export default function ReviewsModal({ isOpen, onClose, productId, productName, onReviewSubmitted }) {
  const { user, profile } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchReviews = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      console.log("Fetching reviews from Supabase for product:", productId);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          review_text,
          created_at,
          user_id,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      console.log("Reviews:", data);
      console.log("Reviews Error:", error);

      if (error) throw error;
      setReviews(data || []);

      // Pre-fill user's existing review if any
      if (user && data) {
        const myReview = data.find((r) => r.user_id === user.id);
        if (myReview) {
          setRating(myReview.rating);
          setText(myReview.review_text || '');
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
      setFormError('');
      setFormSuccess('');
    }
  }, [isOpen, productId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .upsert(
          {
            user_id: user.id,
            product_id: productId,
            rating,
            review_text: text,
          },
          { onConflict: 'user_id,product_id' }
        );

      if (error) throw error;
      
      setFormSuccess('Review saved successfully!');
      fetchReviews();
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      setTimeout(() => {
        setFormSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Error submitting review:', err);
      setFormError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  return (
    <div className="reviews-modal-overlay open" onClick={onClose}>
      <div className="reviews-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="reviews-modal__header">
          <div>
            <h3 className="reviews-modal__title">{productName}</h3>
            <span className="reviews-modal__subtitle">Customer Reviews & Ratings</span>
          </div>
          <button className="reviews-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="reviews-modal__body">
          {/* Summary Box */}
          <div className="reviews-summary">
            <span className="reviews-summary__avg">{avgRating}</span>
            <div className="reviews-summary__info">
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`star${i < Math.round(Number(avgRating)) ? '' : ' empty'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="reviews-summary__count">Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* List of Reviews */}
          <div className="reviews-list-wrap">
            {loading ? (
              <div className="reviews-empty">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="reviews-empty">No reviews yet. Be the first to share your thoughts!</div>
            ) : (
              <div className="reviews-list">
                {reviews.map((rev) => {
                  const revProfile = rev.profiles || {};
                  return (
                    <div key={rev.id} className="review-item">
                      <img
                        src={revProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
                        alt={revProfile.full_name || 'Anonymous'}
                        className="review-item__avatar"
                      />
                      <div className="review-item__content">
                        <div className="review-item__user-date">
                          <span className="review-item__username">{revProfile.full_name || 'Anonymous Barista'}</span>
                          <span className="review-item__date">{new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="stars" style={{ margin: '2px 0 6px' }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`star${i < rev.rating ? '' : ' empty'}`}
                              style={{ fontSize: '0.8rem' }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {rev.review_text && <p className="review-item__text">{rev.review_text}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Write a Review Section */}
          <div className="review-form-wrap">
            <h4 className="review-form-title">
              {reviews.some((r) => r.user_id === user?.id) ? 'Edit Your Review' : 'Write a Review'}
            </h4>
            
            {user ? (
              <form onSubmit={handleSubmit} className="review-form auth-form">
                {formError && <div className="auth-error">{formError}</div>}
                {formSuccess && <div className="auth-success">{formSuccess}</div>}

                <div className="form-group">
                  <label>Your Rating</label>
                  <div className="rating-input">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`rating-star-btn${i < rating ? ' active' : ''}`}
                        onClick={() => setRating(i + 1)}
                        disabled={submitting}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reviewText">Your Review (Optional)</label>
                  <textarea
                    id="reviewText"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tell us what you liked or how we can improve..."
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="review-form-login-prompt">
                Please <Link to="/login" onClick={onClose}>Sign In</Link> to submit a rating and review.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
