import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard({ token }) {
  const [analytics, setAnalytics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  // Fetch analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await fetch("http://127.0.0.1:8000/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAnalytics(data);
      setLastUpdated(new Date().toLocaleTimeString());
    };
    fetchAnalytics();
  }, [token]);

  if (!analytics) return <p>Loading Dashboard...</p>;

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyRevenue = analytics.monthly_revenue || {};

  const chartData = {
    labels: monthNames,
    datasets: [
      {
        label: "Monthly Revenue (KES)",
        data: monthNames.map((_, index) => {
          const m = String(index + 1).padStart(2, "0");
          return monthlyRevenue[m] || 0;
        }),
      },
    ],
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="last-updated">Updated: {lastUpdated}</p>

      {/* Analytics cards */}
      <div className="analytics-grid">
        <div className="card">
          <h3>Total Revenue</h3>
          <p>KES {analytics.total_revenue}</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p>{analytics.total_orders}</p>
        </div>
        <div className="card">
          <h3>Orders Today</h3>
          <p>{analytics.orders_today}</p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="chart-container">
        <h2>Revenue Overview</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
}