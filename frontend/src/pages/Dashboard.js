import React from "react";
import HourlyChart from "../components/Charts/HourlyChart";
import DailyChart from "../components/Charts/DailyChart";
import WeekdayChart from "../components/Charts/WeekdayChart";

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Uber Ride Dashboard</h1>
      <HourlyChart />

      <DailyChart />

      <WeekdayChart />
    </div>
  );
};

export default Dashboard;
