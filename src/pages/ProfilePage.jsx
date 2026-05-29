import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import './ProfilePage.css';

const presetAvatars = [
  { name: 'Espresso', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&q=80' },
  { name: 'Latte Art', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=150&q=80' },
  { name: 'Warm Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=150&q=80' },
  { name: 'Fresh Beans', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&q=80' },
];

export default function ProfilePage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Favorites state
  const [activeTab, setActiveTab] = useState('settings'); // settings or favorites
  const [favoritesList, setFavoritesList] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  // Fetch favorites on tab select or user change
  useEffect(() => {
    if (!user || activeTab !== 'favorites') return;

    const fetchFavorites = async () => {
      setFavLoading(true);
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('product_id, products (*)')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          const mapped = data
            .filter(item => item.products)
            .map(item => ({
              id: item.products.id,
              name: item.products.name,
              price: parseFloat(item.products.price),
              image: item.products.image_url,
              category: item.products.category,
              description: item.products.description,
            }));
          setFavoritesList(mapped);
        }
      } catch (err) {
        console.warn('Error loading favorites:', err);
      } finally {
        setFavLoading(false);
      }
    };

    fetchFavorites();
  }, [user, activeTab]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await updateProfile(fullName, avatarUrl);
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (url) => {
    setAvatarUrl(url);
  };

  const joinDate = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A';

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80';

  return (
    <main className="profile-page section-pad">
      <div className="container profile-container">
        <div className="profile-card">
          {/* Left panel / Overview */}
          <div className="profile-sidebar">
            <div className="profile-avatar-wrap">
              <img 
                src={profile?.avatar_url || defaultAvatar} 
                alt={profile?.full_name || 'User Avatar'} 
                className="profile-avatar"
              />
            </div>
            <h3>{profile?.full_name || 'Coffee Lover'}</h3>
            <p className="profile-email">{profile?.email || user?.email}</p>
            <div className="profile-join-badge">Joined {joinDate}</div>

            {/* Tab switch buttons */}
            <div className="profile-tab-switches">
              <button 
                className={`profile-tab-btn${activeTab === 'settings' ? ' active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                👤 Profile Settings
              </button>
              <button 
                className={`profile-tab-btn${activeTab === 'favorites' ? ' active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                ❤️ My Favorites
              </button>
            </div>

            <div className="profile-sidebar-actions">
              <Link to="/orders" className="btn btn-secondary profile-orders-btn">
                📦 Order History
              </Link>
              <button onClick={signOut} className="btn profile-logout-btn">
                🚪 Sign Out
              </button>
            </div>
          </div>

          {/* Right panel / Form fields */}
          <div className="profile-main">
            {activeTab === 'settings' ? (
              <>
                <h2>User Account Profile</h2>
                <p className="profile-description">
                  Manage your personal settings, coffee preferences, and profile presets.
                </p>

                {errorMsg && <div className="profile-alert error">{errorMsg}</div>}
                {successMsg && <div className="profile-alert success">{successMsg}</div>}

                {!isEditing ? (
                  <div className="profile-details-view">
                    <div className="profile-detail-item">
                      <span className="profile-detail-label">Full Name</span>
                      <span className="profile-detail-val">{profile?.full_name || 'Not set'}</span>
                    </div>
                    <div className="profile-detail-item">
                      <span className="profile-detail-label">Email Account</span>
                      <span className="profile-detail-val">{profile?.email || user?.email}</span>
                    </div>
                    <div className="profile-detail-item">
                      <span className="profile-detail-label">Avatar URL</span>
                      <span className="profile-detail-val truncate">{profile?.avatar_url || 'Default avatar active'}</span>
                    </div>

                    <button 
                      onClick={() => {
                        setFullName(profile?.full_name || '');
                        setAvatarUrl(profile?.avatar_url || '');
                        setIsEditing(true);
                      }}
                      className="btn btn-primary edit-profile-btn"
                    >
                      Edit Profile Details
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdate} className="profile-edit-form">
                    <div className="profile-group">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div className="profile-group">
                      <label htmlFor="avatarUrl">Custom Avatar Image URL</label>
                      <input
                        id="avatarUrl"
                        type="text"
                        placeholder="https://example.com/avatar.jpg"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                      />
                    </div>

                    {/* Preset Avatars Pick list */}
                    <div className="preset-avatars-section">
                      <label>Or select a coffee theme preset</label>
                      <div className="preset-avatars-grid">
                        {presetAvatars.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            className={`preset-avatar-btn${avatarUrl === preset.url ? ' active' : ''}`}
                            onClick={() => handlePresetSelect(preset.url)}
                          >
                            <img src={preset.url} alt={preset.name} />
                            <span>{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="profile-form-buttons">
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Settings'}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <>
                <h2>My Favorite Products</h2>
                <p className="profile-description">
                  A collection of your selected beverages and baked delicacies.
                </p>

                {favLoading ? (
                  <div className="profile-loading" style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--gray-500)' }}>Loading favorites...</p>
                  </div>
                ) : favoritesList.length === 0 ? (
                  <div className="profile-favorites-empty" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>🤍</span>
                    <h3 style={{ margin: '1rem 0 0.5rem', fontFamily: 'var(--font-heading)' }}>No favorites saved yet</h3>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>Save your favorite items from our Menu page to see them here.</p>
                    <Link to="/menu" className="btn btn-primary">Go to Menu</Link>
                  </div>
                ) : (
                  <div className="profile-favorites-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginTop: '1rem' }}>
                    {favoritesList.map((item) => (
                      <ProductCard 
                        key={item.id} 
                        product={item} 
                        // Dummy cart click handler or propagate properly
                        onAddToCart={() => alert(`Added "${item.name}" to cart`)} 
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
