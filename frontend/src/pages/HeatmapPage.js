import React from "react";
import Heatmap from "../components/Heatmap/Heatmap";
import "./HeatmapPage.css";

const HeatmapPage = () => {
  return (
    <div className="heatmap-page">
      <div className="heatmap-page-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-section">
              <h1 className="page-title">
                <span className="page-icon">🌍</span>
                Geographic Heatmap Analysis
              </h1>
              <p className="page-subtitle">
                Explore ride pickup patterns and density distributions across different locations with our interactive heatmap visualization
              </p>
            </div>
            
            <div className="page-badges">
              <span className="badge badge-primary">Real-time Data</span>
              <span className="badge badge-secondary">Interactive</span>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="header-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3 className="info-title">Pickup Locations</h3>
            <p className="info-description">
              Visualize where rides are most frequently requested
            </p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">🔥</div>
            <h3 className="info-title">Density Mapping</h3>
            <p className="info-description">
              Color-coded intensity showing high-demand areas
            </p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📊</div>
            <h3 className="info-title">Data Insights</h3>
            <p className="info-description">
              Make informed decisions based on geographic patterns
            </p>
          </div>
        </div>

        {/* Main Heatmap Component */}
        <div className="heatmap-section">
          <Heatmap />
        </div>

        {/* Additional Info Section */}
        <div className="additional-info">
          <div className="info-panel">
            <h3 className="panel-title">How to Use the Heatmap</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Navigate the Map</h4>
                  <p>Use mouse to pan and zoom around different areas</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Interpret Colors</h4>
                  <p>Warmer colors indicate higher pickup density</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Analyze Patterns</h4>
                  <p>Identify hotspots and optimize resource allocation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;