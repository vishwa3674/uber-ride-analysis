import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import "./WeekdayChart.css";

const WeekdayChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdayEmojis = ["🌅", "💼", "🗂️", "⚡", "🎯", "🎉", "🌟"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/rides/weekday");
        const formatted = res.data
          .sort((a, b) => a.weekday - b.weekday)
          .map((item) => ({
            ...item,
            weekday: weekdayNames[item.weekday],
            weekdayShort: weekdayNames[item.weekday].substring(0, 3),
            emoji: weekdayEmojis[item.weekday],
            originalIndex: item.weekday
          }));
        setData(formatted);
      } catch (err) {
        console.error("Error fetching weekday data:", err);
        setError("Failed to load weekday data. Please try again.");
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
      const dayData = data.find(d => d.weekday === label);
      
      return (
        <div className="custom-tooltip weekday-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-emoji">{dayData?.emoji}</span>
            <span className="tooltip-day">{label}</span>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-stat">
              <span className="stat-label">Total Rides:</span>
              <span className="stat-value">{value.toLocaleString()}</span>
            </div>
            <div className="tooltip-stat">
              <span className="stat-label">Weekly Share:</span>
              <span className="stat-percentage">{percentage}%</span>
            </div>
            <div className="tooltip-trend">
              {value > (data.reduce((sum, item) => sum + item.ride_count, 0) / 7) ? 
                <span className="trend-up">📈 Above Average</span> : 
                <span className="trend-down">📉 Below Average</span>
              }
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (index, rideCount, originalIndex) => {
    if (hoveredBar === index) return "url(#weekdayGradientHover)";
    
    // Weekend vs Weekday coloring
    if (originalIndex === 0 || originalIndex === 6) {
      return "url(#weekendGradient)"; // Weekend
    }
    
    // Weekday intensity coloring
    const maxWeekdayRides = Math.max(...data.filter(d => d.originalIndex !== 0 && d.originalIndex !== 6).map(d => d.ride_count));
    const intensity = rideCount / maxWeekdayRides;
    
    if (intensity > 0.8) return "url(#weekdayGradientHigh)";
    if (intensity > 0.5) return "url(#weekdayGradientMedium)";
    return "url(#weekdayGradientLow)";
  };

  const handleBarHover = (data, index) => {
    setHoveredBar(index);
  };

  const handleBarLeave = () => {
    setHoveredBar(null);
  };

  const totalRides = data.reduce((sum, item) => sum + item.ride_count, 0);
  const avgRides = data.length > 0 ? Math.round(totalRides / data.length) : 0;
  const busiestDay = data.reduce((max, current) => 
    current.ride_count > max.ride_count ? current : max, data[0] || {});
  const weekendRides = data.filter(d => d.originalIndex === 0 || d.originalIndex === 6)
    .reduce((sum, item) => sum + item.ride_count, 0);
  const weekdayRides = totalRides - weekendRides;

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
    <div className="chart-container weekday-chart">
      <div className="chart-header">
        <div className="header-left">
          <div className="chart-icon weekday-icon">📅</div>
          <div className="header-text">
            <h2>Weekly Ride Patterns</h2>
            <p>7-day ride distribution and trends</p>
          </div>
        </div>
        <div className="header-stats weekday-stats">
          <div className="stat-item">
            <span className="stat-number">{totalRides.toLocaleString()}</span>
            <span className="stat-label">Total Rides</span>
          </div>
          <div className="stat-item highlight">
            <span className="stat-number">{busiestDay?.weekdayShort || '--'}</span>
            <span className="stat-label">Busiest Day</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{Math.round((weekdayRides / totalRides * 100)) || 0}%</span>
            <span className="stat-label">Weekdays</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{Math.round((weekendRides / totalRides * 100)) || 0}%</span>
            <span className="stat-label">Weekends</span>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner weekday-spinner">
            <div className="spinner-day">📅</div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p>Loading weekly patterns...</p>
        </div>
      ) : (
        <div className="chart-content">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              onMouseMove={handleBarHover}
              onMouseLeave={handleBarLeave}
            >
              <defs>
                <linearGradient id="weekdayGradientLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="weekdayGradientMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="weekdayGradientHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="weekendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="weekdayGradientHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
                <filter id="weekdayGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
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
                dataKey="weekdayShort" 
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
                interval={0}
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
                cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
              />
              <Bar 
                dataKey="ride_count" 
                radius={[8, 8, 0, 0]}
                filter={hoveredBar !== null ? "url(#weekdayGlow)" : "none"}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(index, entry.ride_count, entry.originalIndex)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="chart-insights">
            <div className="insight-card">
              <div className="insight-icon">📊</div>
              <div className="insight-content">
                <h4>Weekly Pattern</h4>
                <p>{weekdayRides > weekendRides ? 'Business days dominate' : 'Weekends are popular'}</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">🏆</div>
              <div className="insight-content">
                <h4>Peak Day</h4>
                <p>{busiestDay?.weekday} leads with {busiestDay?.ride_count?.toLocaleString()} rides</p>
              </div>
            </div>
          </div>
          
          <div className="chart-legend weekday-legend">
            <div className="legend-item">
              <div className="legend-color weekday-low"></div>
              <span>Low Activity</span>
            </div>
            <div className="legend-item">
              <div className="legend-color weekday-medium"></div>
              <span>Medium Activity</span>
            </div>
            <div className="legend-item">
              <div className="legend-color weekday-high"></div>
              <span>High Activity</span>
            </div>
            <div className="legend-item">
              <div className="legend-color weekend"></div>
              <span>Weekend</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekdayChart;