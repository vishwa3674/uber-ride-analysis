import React from "react";
import HourlyChart from "../components/Charts/HourlyChart";
import DailyChart from "../components/Charts/DailyChart";
import WeekdayChart from "../components/Charts/WeekdayChart";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Ride Analytics Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Comprehensive insights into ride patterns, trends, and distributions across different time periods
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Rides</p>
                <p className="stat-value">12,847</p>
                <p className="stat-change stat-change-positive">+12.5%</p>
              </div>
              <div className="stat-icon stat-icon-purple">
                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Peak Hour</p>
                <p className="stat-value">6:00 PM</p>
                <p className="stat-change stat-change-blue">Today</p>
              </div>
              <div className="stat-icon stat-icon-blue">
                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Busiest Day</p>
                <p className="stat-value">Friday</p>
                <p className="stat-change stat-change-indigo">This Week</p>
              </div>
              <div className="stat-icon stat-icon-indigo">
                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-container">
          <div className="chart-wrapper">
            <HourlyChart />
          </div>
          <div className="chart-wrapper">
            <DailyChart />
          </div>
          <div className="chart-wrapper">
            <WeekdayChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;