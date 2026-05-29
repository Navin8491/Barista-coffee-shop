import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, profile, logout, updateProfile, updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  
  // Edit Profile States
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [updating, setUpdating] = useState(false);

  // Change Password States
  const [changingPass, setChangingPass] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Handle Hash/Tab navigation
  useEffect(() => {
    if (location.hash === '#favorites') {
      setActiveTab('favorites');
    } else {
      setActiveTab('orders');
    }
  }, [location.hash]);

  // Fetch orders and favorites
  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            payment_method,
            order_status,
            created_at,
            order_items (
              id,
              quantity,
              price,
              products (
                name
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };

    const fetchFavorites = async () => {
      setFavoritesLoading(true);
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            id,
            product_id,
            products (
              id,
              name,
              price,
              image_url,
              category
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        setFavorites(data || []);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setFavoritesLoading(false);
      }
    };

    fetchOrders();
    fetchFavorites();
  }, [user]);

  // Set default edit fields
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    setUpdating(true);

    try {
      await updateProfile({ full_name: fullName });
      setEditSuccess('Profile updated successfully!');
      setTimeout(() => {
        setEditing(false);
        setEditSuccess('');
      }, 1000);
    } catch (err) {
      console.error(err);
      setEditError(err.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword.length < 6) {
      return setPassError('Password must be at least 6 characters');
    }

    setUpdating(true);
    try {
      await updatePassword(newPassword);
      setPassSuccess('Password updated successfully!');
      setNewPassword('');
      setTimeout(() => {
        setChangingPass(false);
        setPassSuccess('');
      }, 1500);
    } catch (err) {
      console.error(err);
      setPassError(err.message || 'Failed to change password.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Avatar size must be less than 2MB');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}_avatar.${fileExt}`;

    setUpdating(true);
    try {
      // 1. Upload to bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update Profiles Table
      await updateProfile({ avatar_url: publicUrl });
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert(err.message || 'Failed to upload profile picture.');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveFavorite = async (favId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favId);

      if (error) throw error;
      setFavorites((prev) => prev.filter((fav) => fav.id !== favId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert('Failed to remove favorite.');
    }
  };

  const formatDate = (dateStr) => {
    const opt = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleDateString('en-US', opt);
  };

  if (!user || !profile) {
    return (
      <main className="profile-page">
        <div className="container profile-grid">
          <div className="profile-card">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton skeleton-text" style={{ width: '80%' }} />
            <div className="skeleton skeleton-text" style={{ width: '60%' }} />
          </div>
          <div>
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-card" />
            <div className="skeleton skeleton-card" />
          </div>
        </div>
      </main>
    );
  }

  const joinDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <main className="profile-page">
      <div className="container profile-grid">
        
        {/* Left Side: Profile details */}
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <img
              src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80'}
              alt={profile.full_name || 'User Profile'}
              className="profile-avatar"
            />
            <label className="profile-avatar-upload">
              {updating ? 'Uploading...' : 'Change Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={updating}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <h2 className="profile-name">{profile.full_name || 'Anonymous Barista'}</h2>
          <p className="profile-email">{profile.email}</p>

          <div className="profile-meta-info">
            <div className="profile-meta-row">
              <span>Member Since:</span>
              <strong>{joinDate}</strong>
            </div>
            <div className="profile-meta-row">
              <span>Role:</span>
              <strong>Customer</strong>
            </div>
          </div>

          <div className="profile-actions">
            {!editing && !changingPass && (
              <button
                className="btn btn-outline"
                onClick={() => setEditing(true)}
              >
                Edit Name
              </button>
            )}
            {!changingPass && !editing && (
              <button
                className="btn btn-outline"
                onClick={() => setChangingPass(true)}
              >
                Change Password
              </button>
            )}
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* Edit Profile Form */}
          {editing && (
            <div className="edit-form-card">
              <h3>Edit Profile</h3>
              {editError && <div className="auth-error">{editError}</div>}
              {editSuccess && <div className="auth-success">{editSuccess}</div>}
              <form onSubmit={handleUpdateProfile} className="auth-form">
                <div className="form-group">
                  <label htmlFor="editFullName">Full Name</label>
                  <input
                    type="text"
                    id="editFullName"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={updating}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.6rem' }}
                    disabled={updating}
                  >
                    {updating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.6rem' }}
                    onClick={() => setEditing(false)}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Change Password Form */}
          {changingPass && (
            <div className="edit-form-card">
              <h3>Change Password</h3>
              {passError && <div className="auth-error">{passError}</div>}
              {passSuccess && <div className="auth-success">{passSuccess}</div>}
              <form onSubmit={handleChangePassword} className="auth-form">
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    disabled={updating}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.6rem' }}
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.6rem' }}
                    onClick={() => setChangingPass(false)}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: Main Content with tabs */}
        <div className="profile-main-content">
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 Order History
            </button>
            <button
              className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              ❤️ My Favorites
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="orders-history">
              <div>
                <h2 className="orders-title">Your Order History</h2>
                <p className="orders-subtitle">Track and view details of your previous coffee orders</p>
              </div>

              {ordersLoading ? (
                <div>
                  <div className="skeleton skeleton-card" />
                  <div className="skeleton skeleton-card" />
                </div>
              ) : orders.length === 0 ? (
                <div className="no-orders">
                  <span className="no-orders-icon">☕</span>
                  <h3>No Orders Found</h3>
                  <p>You haven't placed any delicious orders yet.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/menu')}
                    style={{ marginTop: '1rem' }}
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                orders.map((order) => {
                  const statusBadge = (status) => {
                    const s = status.toLowerCase();
                    return `order-status-badge status-${s}`;
                  };
                  return (
                    <div key={order.id} className="order-card card">
                      <div className="order-header">
                        <div className="order-id-date">
                          <span className="order-id">Order ID: #{order.id.slice(0, 8)}</span>
                          <span className="order-date">{formatDate(order.created_at)}</span>
                        </div>
                        <span className={statusBadge(order.order_status)}>
                          {order.order_status}
                        </span>
                      </div>

                      <div className="order-items-list">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="order-item-row">
                            <div>
                              <span className="order-item-name">{item.products?.name || 'Item'}</span>
                              <span className="order-item-qty">x{item.quantity}</span>
                            </div>
                            <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-footer">
                        <span className="order-payment-method">
                          Payment Method: <strong>{order.payment_method}</strong>
                        </span>
                        <span className="order-total-amount">
                          Total: ${order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites-tab-content">
              <div>
                <h2 className="orders-title">My Favorites</h2>
                <p className="orders-subtitle">View and manage your favorited coffee products</p>
              </div>

              {favoritesLoading ? (
                <div className="favorites-grid">
                  <div className="skeleton skeleton-card" style={{ height: '240px' }} />
                  <div className="skeleton skeleton-card" style={{ height: '240px' }} />
                </div>
              ) : favorites.length === 0 ? (
                <div className="no-orders">
                  <span className="no-orders-icon">❤️</span>
                  <h3>No Favorites Added</h3>
                  <p>Your wishlist is empty. Start adding some favorite products!</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/menu')}
                    style={{ marginTop: '1rem' }}
                  >
                    Go to Menu
                  </button>
                </div>
              ) : (
                <div className="favorites-grid">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="favorite-card card">
                      <img
                        src={fav.products?.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80'}
                        alt={fav.products?.name}
                        className="favorite-card__img"
                      />
                      <div className="favorite-card__body">
                        <span className="favorite-card__category">{fav.products?.category}</span>
                        <h3 className="favorite-card__title">{fav.products?.name}</h3>
                        <p className="favorite-card__price">${Number(fav.products?.price || 0).toFixed(2)}</p>
                        <div className="favorite-card__actions">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate('/menu')}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          >
                            Order Now
                          </button>
                          <button
                            className="btn btn-outline btn-sm remove-fav-btn"
                            onClick={() => handleRemoveFavorite(fav.id)}
                            style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                            title="Remove"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
