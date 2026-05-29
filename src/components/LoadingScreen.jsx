import React from 'react';
import './LoadingScreen.css';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-screen__container">
        <div className="loading-screen__spinner">
          <div className="loading-screen__cup">
            <span className="steam"></span>
            <span className="steam"></span>
            <span className="steam"></span>
            <div className="cup-body"></div>
            <div className="handle"></div>
          </div>
        </div>
        <p className="loading-screen__text">Loading Barista Chronicles...</p>
      </div>
    </div>
  );
}
