import React, { useEffect, useState } from "react";
import api from "../../api";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import "./Heatmap.css";

const HeatLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heatLayer = L.heatLayer(points, {
      radius: 20,
      blur: 25,
      maxZoom: 17,
      max: 1.0,
      minOpacity: 0.1,
      gradient: {
        0.0: '#313695',
        0.1: '#4575b4',
        0.2: '#74add1',
        0.3: '#abd9e9',
        0.4: '#e0f3f8',
        0.5: '#ffffcc',
        0.6: '#fee090',
        0.7: '#fdae61',
        0.8: '#f46d43',
        0.9: '#d73027',
        1.0: '#a50026'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points, map]);

  return null;
};

const Heatmap = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalPoints: 0, lastUpdated: null });

  const processHeatmapData = (data) => {
    // Create a map to count occurrences of each coordinate
    const coordinateCount = {};
    
    data.forEach(item => {
      const key = `${item.Lat},${item.Lon}`;
      coordinateCount[key] = (coordinateCount[key] || 0) + 1;
    });

    // Convert to array format with intensity values
    const processedPoints = Object.entries(coordinateCount).map(([coordKey, count]) => {
      const [lat, lon] = coordKey.split(',').map(Number);
      return [lat, lon, count]; // [latitude, longitude, intensity]
    });

    // Find max count for normalization
    const maxCount = Math.max(...Object.values(coordinateCount));
    
    // Normalize intensities to 0-1 range
    return processedPoints.map(([lat, lon, count]) => [
      lat, 
      lon, 
      count / maxCount // Normalized intensity
    ]);
  };

  useEffect(() => {
    setLoading(true);
    api.get("/rides/heatmap")
      .then((res) => {
        const processedPoints = processHeatmapData(res.data);
        setPoints(processedPoints);
        setStats({
          totalPoints: res.data.length,
          lastUpdated: new Date().toLocaleString()
        });
        setError(null);
      })
      .catch((err) => {
        console.error("Heatmap API error:", err);
        setError("Failed to load heatmap data. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const refreshData = () => {
    setLoading(true);
    api.get("/rides/heatmap")
      .then((res) => {
        const processedPoints = processHeatmapData(res.data);
        setPoints(processedPoints);
        setStats({
          totalPoints: res.data.length,
          lastUpdated: new Date().toLocaleString()
        });
        setError(null);
      })
      .catch((err) => {
        console.error("Heatmap API error:", err);
        setError("Failed to load heatmap data. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="heatmap-container">
      {/* Header Section */}
      <div className="heatmap-header">
        <div className="heatmap-title-section">
          <h2 className="heatmap-title">
            <span className="title-icon">🗺️</span>
            Ride Pickup Density Heatmap
          </h2>
          <p className="heatmap-description">
            Interactive visualization showing pickup density patterns across the city
          </p>
        </div>
        
        <div className="heatmap-controls">
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

      {/* Stats Bar */}
      <div className="heatmap-stats">
        <div className="stat-item">
          <span className="stat-label">Data Points:</span>
          <span className="stat-value">{stats.totalPoints.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Last Updated:</span>
          <span className="stat-value">{stats.lastUpdated || 'Loading...'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Status:</span>
          <span className={`stat-value ${error ? 'status-error' : 'status-active'}`}>
            {error ? 'Error' : 'Active'}
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="map-wrapper">
        {loading && (
          <div className="map-loading">
            <div className="loading-spinner"></div>
            <p>Loading heatmap data...</p>
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
          <>
            <MapContainer
              center={[40.75, -73.98]}
              zoom={12}
              className="heatmap-leaflet"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              />
              <HeatLayer points={points} />
            </MapContainer>
            
            {/* Legend */}
            <div className="heatmap-legend">
              <h4 className="legend-title">Density Scale</h4>
              <div className="legend-gradient"></div>
              <div className="legend-labels">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Heatmap;