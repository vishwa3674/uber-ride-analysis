import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../api";
import "./PickupClusters.css";

const clusterColors = [
  { color: "#FF6B6B", name: "Cluster 0", bg: "rgba(255, 107, 107, 0.2)" },
  { color: "#4ECDC4", name: "Cluster 1", bg: "rgba(78, 205, 196, 0.2)" },
  { color: "#45B7D1", name: "Cluster 2", bg: "rgba(69, 183, 209, 0.2)" },
  { color: "#96CEB4", name: "Cluster 3", bg: "rgba(150, 206, 180, 0.2)" },
  { color: "#FFEAA7", name: "Cluster 4", bg: "rgba(255, 234, 167, 0.2)" },
  { color: "#DDA0DD", name: "Cluster 5", bg: "rgba(221, 160, 221, 0.2)" },
  { color: "#98D8C8", name: "Cluster 6", bg: "rgba(152, 216, 200, 0.2)" },
  { color: "#F7DC6F", name: "Cluster 7", bg: "rgba(247, 220, 111, 0.2)" },
  { color: "#BB8FCE", name: "Cluster 8", bg: "rgba(187, 143, 206, 0.2)" },
  { color: "#85C1E9", name: "Cluster 9", bg: "rgba(133, 193, 233, 0.2)" }
];

const PickupClusters = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPoints: 0,
    uniqueClusters: 0,
    lastUpdated: null
  });

  const processClusterData = (rawData) => {
    const uniqueClusters = [...new Set(rawData.map(point => point.cluster))];
    const clusterCounts = {};
    
    rawData.forEach(point => {
      clusterCounts[point.cluster] = (clusterCounts[point.cluster] || 0) + 1;
    });

    return {
      processedData: rawData,
      stats: {
        totalPoints: rawData.length,
        uniqueClusters: uniqueClusters.length,
        clusterCounts,
        lastUpdated: new Date().toLocaleString()
      }
    };
  };

  const refreshData = () => {
    setLoading(true);
    api.get("/rides/clusters")
      .then((res) => {
        const { processedData, stats: newStats } = processClusterData(res.data);
        setData(processedData);
        setStats(newStats);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching cluster data:", err);
        setError("Failed to load cluster data. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="clusters-container">
      {/* Header Section */}
      <div className="clusters-header">
        <div className="clusters-title-section">
          <h2 className="clusters-title">
            <span className="title-icon">🎯</span>
            Pickup Clusters Analysis
          </h2>
          <p className="clusters-description">
            K-Means clustering visualization showing pickup location patterns and density groups
          </p>
        </div>
        
        <div className="clusters-controls">
          <button 
            className="refresh-btn"
            onClick={refreshData}
            disabled={loading}
          >
            <span className="refresh-icon">🔄</span>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="clusters-stats">
        <div className="stat-card">
          <div className="stat-icon total-points-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <circle cx="12" cy="5" r="2" fill="currentColor"/>
              <circle cx="12" cy="19" r="2" fill="currentColor"/>
              <circle cx="5" cy="12" r="2" fill="currentColor"/>
              <circle cx="19" cy="12" r="2" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Data Points</span>
            <span className="stat-value">{stats.totalPoints.toLocaleString()}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon clusters-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Unique Clusters</span>
            <span className="stat-value">{stats.uniqueClusters}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon update-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v6l4-4-4-4zm0 10v6l4-4-4-4zm-6-6v6l4-4-4-4z" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Last Updated</span>
            <span className="stat-value">{stats.lastUpdated || 'Loading...'}</span>
          </div>
        </div>
      </div>

      {/* Map and Legend Container */}
      <div className="map-legend-container">
        {/* Map Section */}
        <div className="map-wrapper">
          {loading && (
            <div className="map-loading">
              <div className="loading-spinner"></div>
              <p>Loading cluster data...</p>
            </div>
          )}
          
          {error && (
            <div className="map-error">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button className="retry-btn" onClick={refreshData}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <MapContainer 
              center={[40.73, -73.93]} 
              zoom={11} 
              className="clusters-leaflet"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              />
              {data.map((point, index) => (
                <CircleMarker
                  key={index}
                  center={[point.Lat, point.Lon]}
                  radius={6}
                  fillOpacity={0.8}
                  color={clusterColors[point.cluster % clusterColors.length]?.color || "#666"}
                  fillColor={clusterColors[point.cluster % clusterColors.length]?.color || "#666"}
                  weight={2}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    <div className="cluster-tooltip">
                      <strong>{clusterColors[point.cluster % clusterColors.length]?.name || `Cluster ${point.cluster}`}</strong>
                      <br />
                      <span>Lat: {point.Lat.toFixed(4)}</span>
                      <br />
                      <span>Lon: {point.Lon.toFixed(4)}</span>
                    </div>
                  </Tooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Legend Section */}
        {!loading && !error && (
          <div className="clusters-legend">
            <h4 className="legend-title">Cluster Legend</h4>
            <div className="legend-items">
              {clusterColors.slice(0, stats.uniqueClusters).map((cluster, index) => (
                <div key={index} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: cluster.color }}
                  ></div>
                  <div className="legend-info">
                    <span className="legend-name">{cluster.name}</span>
                    <span className="legend-count">
                      {stats.clusterCounts?.[index]?.toLocaleString() || 0} points
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="legend-summary">
              <div className="summary-item">
                <span className="summary-label">Algorithm:</span>
                <span className="summary-value">K-Means</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Status:</span>
                <span className="summary-value status-active">Active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupClusters;