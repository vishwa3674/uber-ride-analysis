import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import HeatmapPage from "./pages/HeatmapPage";
import Summary from "./components/Summary/Summary";
import ClusterPage from "./pages/ClusterPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/clusters" element={<ClusterPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
