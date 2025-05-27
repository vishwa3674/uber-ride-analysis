import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/heatmap", label: "Heatmap", icon: "🗺️" },
    { path: "/summary", label: "Summary", icon: "📈" },
    { path: "/clusters", label: "Clusters", icon: "🎯" }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.09-.87 2.12-1.88 3.06-3.01C12.5 23.1 10.9 21.4 9.5 19.5c-1.4-1.9-2.3-4.1-2.5-6.5h10c-.2 2.4-1.1 4.6-2.5 6.5-1.4 1.9-3 3.6-4.56 4.99C15.16 17 19 12.55 19 7L12 2z"/>
            </svg>
          </div>
          <div className="brand-text">
            <h1>Uber Analytics</h1>
            <span className="brand-subtitle">Ride Intelligence</span>
          </div>
        </div>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
              {isActiveRoute(item.path) && <div className="nav-indicator"></div>}
            </Link>
          ))}
        </div>

        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;