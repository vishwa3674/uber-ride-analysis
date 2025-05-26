import React, { useEffect, useState } from "react";
import api from "../../api";

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

  if (loading) return <p className="text-center mt-10">Loading summary...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Ride Summary</h2>
      <ul className="space-y-4 text-lg">
        <li><strong>Total Rides:</strong> {summary.total_rides.toLocaleString()}</li>
        <li><strong>Average Rides per Day:</strong> {summary.avg_rides_per_day.toLocaleString()}</li>
        <li><strong>Minimum Rides in a Day:</strong> {summary.min_rides_per_day}</li>
        <li><strong>Maximum Rides in a Day:</strong> {summary.max_rides_per_day}</li>
      </ul>
    </div>
  );
};

export default Summary;
