import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import "./DailyChart.css";

const DailyChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/rides/daily");
        console.log("API Data:", res.data);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching daily data:", err);
        setError("Failed to load daily data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percentage = data.length > 0 ? ((value / data.reduce((sum, item) => sum + item.ride_count, 0)) * 100).toFixed(1) : 0;
      
      return (
        <div className="custom-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-day">📅 Day {label}</span>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-stat">
              <span className="stat-label">Rides:</span>
              <span className="stat-value">{value.toLocaleString()}</span>
            </div>
            <div className="tooltip-stat">
              <span className="stat-label">Share:</span>
              <span className="stat-percentage">{percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (index, rideCount) => {
    if (hoveredBar === index) return "url(#dailyGradientHover)";
    
    // Weekend days (typically higher activity)
    const dayOfMonth = parseInt(data[index]?.day);
    const isWeekend = dayOfMonth % 7 === 0 || dayOfMonth % 7 === 1; // Simplified weekend detection
    
    // Color based on ride volume
    const maxRides = Math.max(...data.map(d => d.ride_count));
    const intensity = rideCount / maxRides;
    
    if (intensity > 0.8) return "url(#dailyGradientHigh)";
    if (intensity > 0.5) return "url(#dailyGradientMedium)";
    return "url(#dailyGradientLow)";
  };

  const handleBarHover = (data, index) => {
    setHoveredBar(index);
  };

  const handleBarLeave = () => {
    setHoveredBar(null);
  };

  const totalRides = data.reduce((sum, item) => sum + item.ride_count, 0);
  const avgRides = data.length > 0 ? Math.round(totalRides / data.length) : 0;
  const peakDay = data.reduce((max, current) => 
    current.ride_count > max.ride_count ? current : max, data[0] || {});
  const activeDays = data.filter(d => d.ride_count > 0).length;

  if (error) {
    return (
      <div className="chart-container error-state">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Data</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container daily-chart">
      <div className="chart-header">
        <div className="header-left">
          <div className="chart-icon">📊</div>
          <div className="header-text">
            <h2>Daily Ride Distribution</h2>
            <p>Monthly ride patterns and daily trends</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{totalRides.toLocaleString()}</span>
            <span className="stat-label">Total Rides</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{peakDay?.day || '--'}</span>
            <span className="stat-label">Peak Day</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{avgRides.toLocaleString()}</span>
            <span className="stat-label">Avg/Day</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{activeDays}</span>
            <span className="stat-label">Active Days</span>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p>Loading daily data...</p>
        </div>
      ) : (
        <div className="chart-content">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              onMouseMove={handleBarHover}
              onMouseLeave={handleBarLeave}
            >
              <defs>
                <linearGradient id="dailyGradientLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="dailyGradientMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="dailyGradientHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="dailyGradientHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(148, 163, 184, 0.3)"
                vertical={false}
              />
              <XAxis 
                dataKey="day" 
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
              />
              <Bar 
                dataKey="ride_count" 
                radius={[6, 6, 0, 0]}
                filter={hoveredBar !== null ? "url(#glow)" : "none"}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(index, entry.ride_count)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color low"></div>
              <span>Low Activity</span>
            </div>
            <div className="legend-item">
              <div className="legend-color medium"></div>
              <span>Medium Activity</span>
            </div>
            <div className="legend-item">
              <div className="legend-color high"></div>
              <span>High Activity</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyChart;