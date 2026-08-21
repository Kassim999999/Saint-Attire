import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

import "../../styles/admin/Analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics({ token }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/admin/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();

        setAnalytics(data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="analytics-loading">
        <h2>Loading Analytics...</h2>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-error">
        <h2>Unable to load analytics</h2>
        <p>Please try again later.</p>
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

  const revenueData = {
    labels: monthNames,

    datasets: [
      {
        label: "Revenue (KES)",

        data: monthNames.map((_, index) => {
          const month = String(index + 1).padStart(2, "0");

          return monthlyRevenue[month] || 0;
        }),

        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const ordersData = {
    labels: monthNames,

    datasets: [
      {
        label: "Orders",

        data: monthNames.map((_, index) => {
          const month = String(index + 1).padStart(2, "0");

          return (
            analytics.monthly_orders?.[month] || 0
          );
        }),

        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>

          <p>
            Detailed performance of your SAINT store
          </p>
        </div>

        <span>
          Updated: {lastUpdated}
        </span>
      </div>


      {/* SUMMARY */}

      <div className="analytics-summary">

        <div className="analytics-card">
          <span>Total Revenue</span>

          <strong>
            KES {analytics.total_revenue || 0}
          </strong>
        </div>


        <div className="analytics-card">
          <span>Total Orders</span>

          <strong>
            {analytics.total_orders || 0}
          </strong>
        </div>


        <div className="analytics-card">
          <span>Orders Today</span>

          <strong>
            {analytics.orders_today || 0}
          </strong>
        </div>


        <div className="analytics-card">
          <span>Total Products</span>

          <strong>
            {analytics.total_products || 0}
          </strong>
        </div>


        <div className="analytics-card">
          <span>Low Stock</span>

          <strong>
            {analytics.low_stock || 0}
          </strong>
        </div>

      </div>


      {/* REVENUE */}

      <div className="analytics-chart">

        <div className="chart-header">
          <h2>Revenue Performance</h2>

          <p>
            Monthly revenue generated
          </p>
        </div>

        <Bar
          data={revenueData}
          options={{
            responsive: true,

            plugins: {
              legend: {
                display: true,
              },
            },

            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />

      </div>


      {/* ORDERS */}

      <div className="analytics-chart">

        <div className="chart-header">
          <h2>Order Performance</h2>

          <p>
            Orders received throughout the year
          </p>
        </div>

        <Line
          data={ordersData}
          options={{
            responsive: true,

            plugins: {
              legend: {
                display: true,
              },
            },

            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />

      </div>


      {/* ORDER STATUS */}

      <div className="analytics-section">

        <h2>Order Status</h2>

        <div className="status-grid">

          <div className="status-card">
            <span>Pending</span>

            <strong>
              {analytics.pending_orders || 0}
            </strong>
          </div>


          <div className="status-card">
            <span>Shipped</span>

            <strong>
              {analytics.shipped_orders || 0}
            </strong>
          </div>


          <div className="status-card">
            <span>Delivered</span>

            <strong>
              {analytics.delivered_orders || 0}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}