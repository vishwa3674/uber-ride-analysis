import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const WeekdayChart = () => {
  const [data, setData] = useState([]);

  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    api.get("/rides/weekday")
      .then((res) => {
        const formatted = res.data
          .sort((a, b) => a.weekday - b.weekday)
          .map((item) => ({
            ...item,
            weekday: weekdayNames[item.weekday]
          }));
        setData(formatted);
      })
      .catch((err) => console.error("Error fetching weekday data:", err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Weekday Ride Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="weekday" label={{ value: "Weekday", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Rides", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="ride_count" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeekdayChart;
