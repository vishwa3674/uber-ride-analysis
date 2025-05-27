import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Uber Ride Analysis</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Charts</Link>
          <Link to="/heatmap" className="hover:underline">Heatmap</Link>
          <Link to="/summary" className="hover:underline">Summary</Link>
          <Link to="/clusters" className="px-4 py-2">Clusters</Link>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
