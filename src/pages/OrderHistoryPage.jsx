import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import './OrderHistoryPage.css';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to fetch order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'order-badge status-completed';
      case 'pending': return 'order-badge status-pending';
      case 'cancelled': return 'order-badge status-cancelled';
      default: return 'order-badge status-default';
    }
  };

  return (
    <main className="orders-page section-pad">
      <div className="container orders-container">
        <div className="orders-header-row">
          <div>
            <Link to="/profile" className="orders-back-link">← Back to Profile</Link>
            <h2>My Order History</h2>
          </div>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>

        {loading ? (
          <div className="orders-loading">
            <div className="orders-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : errorMsg ? (
          <div className="orders-alert error">{errorMsg}</div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <span>📦</span>
            <h3>No orders placed yet</h3>
            <p>Your order records will show up here once you checkout items from your cart.</p>
            <Link to="/menu" className="btn btn-secondary">Order Coffee Now</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-row-card">
                <div className="order-row-header">
                  <div>
                    <span className="order-id-label">ORDER ID</span>
                    <span className="order-id-val">{order.id.substring(0, 8).toUpperCase()}...</span>
                  </div>
                  <div>
                    <span className="order-date-val">{formatDate(order.created_at)}</span>
                  </div>
                </div>

                <div className="order-row-body">
                  <div className="order-row-stats">
                    <div className="order-stat-col">
                      <span className="stat-lbl">Status</span>
                      <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                    </div>
                    <div className="order-stat-col">
                      <span className="stat-lbl">Total Amount</span>
                      <span className="stat-val font-heading">${parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
