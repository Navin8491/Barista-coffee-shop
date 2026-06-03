import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AutoLogoutWarningModal.css';

export default function AutoLogoutWarningModal() {
  const { showLogoutWarning, logoutCountdown, stayLoggedIn, logout } = useAuth();
  const [maxCountdown, setMaxCountdown] = useState(30);

  useEffect(() => {
    if (showLogoutWarning) {
      setMaxCountdown(logoutCountdown);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLogoutWarning]);

  if (!showLogoutWarning) return null;

  const percentage = maxCountdown > 0 ? (logoutCountdown / maxCountdown) * 100 : 0;

  return (
    <div className="auto-logout-overlay">
      <div className="auto-logout-modal">
        {/* Animated Security Icon */}
        <div className="auto-logout-icon-container">
          <div className="auto-logout-pulse-ring"></div>
          <svg
            className="auto-logout-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        {/* Modal Text Content */}
        <h2 className="auto-logout-title">Session Expiring Soon</h2>
        <p className="auto-logout-description">
          For your security, you will be automatically logged out due to inactivity in:
        </p>

        {/* Digital Countdown Timer */}
        <div className="auto-logout-countdown">
          <span className="auto-logout-time-number">{logoutCountdown}</span>
          <span className="auto-logout-time-unit">seconds</span>
        </div>

        {/* Custom Progress Bar */}
        <div className="auto-logout-progress-track">
          <div
            className={`auto-logout-progress-bar ${logoutCountdown <= 10 ? 'warning-pulse' : ''}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* Actions buttons */}
        <div className="auto-logout-actions">
          <button
            className="btn-stay-logged-in"
            onClick={stayLoggedIn}
          >
            Stay Logged In
          </button>
          <button
            className="btn-logout-now"
            onClick={logout}
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
}
