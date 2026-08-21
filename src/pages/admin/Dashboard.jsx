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

import "../../styles/admin/Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://127.0.0.1:8000";

export default function Dashboard() {
    const token = localStorage.getItem("token");

  const [analytics, setAnalytics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setError("");

        const res = await fetch(`${API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.detail || "Failed to fetch dashboard"
          );
        }

        setAnalytics(data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Dashboard error:", error);
        setError(error.message);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="dashboard-page">
        <p>Please login to access the dashboard.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <p>Unable to load dashboard.</p>
        <small>{error}</small>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="dashboard-page">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyRevenue = analytics.monthly_revenue || {};

  const chartData = {
    labels: monthNames,

    datasets: [
      {
        label: "Monthly Revenue (KES)",

        data: monthNames.map((_, index) => {
          const month = String(index + 1).padStart(2, "0");

          return monthlyRevenue[month] || 0;
        }),

        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#999",
        },

        grid: {
          color: "#292929",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: "#999",
        },

        grid: {
          color: "#292929",
        },
      },
    },
  };

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p className="dashboard-last-updated">
            Updated: {lastUpdated}
          </p>
        </div>
      </div>


      {/* ANALYTICS CARDS */}

      <div className="dashboard-analytics-grid">

        <div className="dashboard-card">
          <h3>Total Revenue</h3>

          <p>
            KES{" "}
            {Number(
              analytics.revenue || 0
            ).toLocaleString()}
          </p>
        </div>


        <div className="dashboard-card">
          <h3>Total Orders</h3>

          <p>
            {analytics.total_orders || 0}
          </p>
        </div>


        <div className="dashboard-card">
          <h3>Orders Today</h3>

          <p>
            {analytics.orders_today || 0}
          </p>
        </div>


        <div className="dashboard-card">
          <h3>Pending Orders</h3>

          <p>
            {analytics.pending_orders || 0}
          </p>
        </div>


        <div className="dashboard-card">
          <h3>Total Products</h3>

          <p>
            {analytics.total_products || 0}
          </p>
        </div>


        <div className="dashboard-card">
          <h3>Low Stock</h3>

          <p>
            {analytics.low_stock || 0}
          </p>
        </div>

      </div>


      {/* REVENUE CHART */}

      <div className="dashboard-chart">

        <h2>Revenue Overview</h2>

        <div className="dashboard-chart-wrapper">
          <Bar
            data={chartData}
            options={chartOptions}
          />
        </div>

      </div>

    </div>
  );
}