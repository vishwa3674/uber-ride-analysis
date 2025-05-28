import React, { useEffect, useState } from "react";
import api from "../../api";
import "./Summary.css";

const Summary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/rides/summary")
      .then((res) => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching summary data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="summary-container">
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading summary...</p>
      </div>
    </div>
  );

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h1 className="summary-title">Ride Analytics Summary</h1>
        <p className="summary-subtitle">
          Comprehensive overview of ride statistics and key performance metrics
        </p>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="card-header">
            <div className="card-icon total-rides-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
              </svg>
            </div>
            <span className="card-label">TOTAL RIDES</span>
          </div>
          <div className="card-value">{summary?.total_rides?.toLocaleString() || '0'}</div>
          <div className="card-trend positive">All Time</div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <div className="card-icon avg-rides-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
            </div>
            <span className="card-label">AVG RIDES/DAY</span>
          </div>
          <div className="card-value">{summary?.avg_rides_per_day?.toLocaleString() || '0'}</div>
          <div className="card-trend neutral">Daily Average</div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <div className="card-icon min-rides-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 14l5-5 5 5z" fill="currentColor"/>
              </svg>
            </div>
            <span className="card-label">MIN RIDES/DAY</span>
          </div>
          <div className="card-value">{summary?.min_rides_per_day?.toLocaleString() || '0'}</div>
          <div className="card-trend neutral">Lowest Day</div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <div className="card-icon max-rides-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 10l5 5 5-5z" fill="currentColor"/>
              </svg>
            </div>
            <span className="card-label">MAX RIDES/DAY</span>
          </div>
          <div className="card-value">{summary?.max_rides_per_day?.toLocaleString() || '0'}</div>
          <div className="card-trend positive">Peak Day</div>
        </div>
      </div>

      <div className="summary-insights">
        <div className="insights-card">
          <div className="insights-header">
            <div className="insights-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-5H19V4h-3V2H8v2H5v2h-.5C3.67 6 3 6.67 3 7.5S3.67 9 4.5 9H5v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9h.5c.83 0 1.5-.67 1.5-1.5S20.33 6 19.5 6z" fill="currentColor"/>
              </svg>
            </div>
            <h3>Key Insights</h3>
          </div>
          <div className="insights-content">
            <div className="insight-item">
              <span className="insight-label">Performance Range:</span>
              <span className="insight-value">
                {((summary?.max_rides_per_day - summary?.min_rides_per_day) || 0).toLocaleString()} rides variation
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Data Quality:</span>
              <span className="insight-value">Complete dataset available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;