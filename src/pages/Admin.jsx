import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Admin() {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [lastUpdated, setLastUpdated] = useState("");

  const navigate = useNavigate();

  // 📦 Fetch Orders
  const fetchOrders = async (token) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/admin-login");
        return;
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // 📊 Fetch Analytics
  const fetchAnalytics = async (token) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/admin-login");
        return;
      }

      const data = await response.json();
      setAnalytics(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  // 🔐 Auth check + initial load + auto refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    const init = async () => {
      await Promise.all([fetchOrders(token), fetchAnalytics(token)]);
      setLoading(false);
    };

    init();

    // 🔥 Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchOrders(token);
      fetchAnalytics(token);
    }, 30000);

    return () => clearInterval(interval);

  }, [navigate]);

  // 🚚 Update Order Status
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/orders/${id}?status=${status}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/admin-login");
        return;
      }

      // Update UI instantly
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );

      // Refresh analytics after status change
      fetchAnalytics(token);

    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 🔓 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };

  // 🔎 Filter Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ⏳ Loading State
  if (loading) {
    return (
      <div className="admin-container">
        <h1 className="admin-title">Loading Admin Dashboard...</h1>
      </div>
    );
  }

  // 📈 Revenue Chart Data
  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const monthlyRevenue = analytics?.monthly_revenue || {};

  const chartData = {
    labels: monthNames,
    datasets: [
      {
        label: "Monthly Revenue (KES)",
        data: monthNames.map((_, index) => {
          const monthNumber = String(index + 1).padStart(2, "0");
          return monthlyRevenue[monthNumber] || 0;
        }),
      },
    ],
  };

  const handleExport = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/admin/export-orders",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Error exporting orders:", error);
  }
};

  return (
    <div className="admin-container">

      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">Saint Attire Admin</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <button
  className="export-btn"
  onClick={handleExport}
>
  Export CSV
</button>
        <p className="last-updated">
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Analytics */}
      {analytics && (
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

          <div className="card">
            <h3>Pending</h3>
            <p>{analytics.pending_orders}</p>
          </div>

          <div className="card">
            <h3>Shipped</h3>
            <p>{analytics.shipped_orders}</p>
          </div>

          <div className="card">
            <h3>Delivered</h3>
            <p>{analytics.delivered_orders}</p>
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      {analytics && (
        <div className="chart-container">
          <h2>Revenue Overview</h2>
          <Bar data={chartData} />
        </div>
      )}

      {/* Search + Filter */}
      <div className="admin-controls">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.full_name}</td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>KES {order.amount}</td>
                <td>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button
  className="action-btn view-btn"
  onClick={() => setSelectedOrder(order)}
>
  View
</button>

                  {order.status !== "shipped" && (
                    <button
                      className="action-btn ship-btn"
                      onClick={() => updateStatus(order.id, "shipped")}
                    >
                      Ship
                    </button>
                  )}

                  {order.status !== "delivered" && (
                    <button
                      className="action-btn deliver-btn"
                      onClick={() => updateStatus(order.id, "delivered")}
                    >
                      Deliver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Order Details</h2>

      <p><strong>Name:</strong> {selectedOrder.full_name}</p>
      <p><strong>Email:</strong> {selectedOrder.email}</p>
      <p><strong>Phone:</strong> {selectedOrder.phone}</p>
      <p><strong>Address:</strong> {selectedOrder.address}</p>
      <p><strong>Amount:</strong> KES {selectedOrder.amount}</p>
      <p><strong>Status:</strong> {selectedOrder.status}</p>
      <p><strong>Payment Ref:</strong> {selectedOrder.payment_reference}</p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(selectedOrder.created_at).toLocaleString()}
      </p>

      <button
        className="close-btn"
        onClick={() => setSelectedOrder(null)}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default Admin;