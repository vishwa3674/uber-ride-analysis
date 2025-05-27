import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const DailyChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/rides/daily")
      .then((res) => {
        console.log("API Data:", res.data);
        setData(res.data)
      })
      .catch((err) => console.error("Error fetching hourly data:", err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Daily Ride Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" label={{ value: "Day", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Rides", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="ride_count" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyChart;
