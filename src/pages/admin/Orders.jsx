// src/pages/admin/Orders.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]); // always an array
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch orders safely
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // Unauthorized or other error
          throw new Error(`Fetch failed: ${res.status}`);
        }

        const data = await res.json();

        // Make sure we have an array
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Filtered orders safely
  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        const matchesSearch =
          order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  if (loading) {
    return (
      <div className="admin-loading">
        <h1>Loading Orders...</h1>
      </div>
    );
  }

  const updateStatus = async (id, status) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://127.0.0.1:8000/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed to update status");

    // Update UI without reloading
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: status } : o
      )
    );
  } catch (err) {
    console.error("Status update failed", err);
  }
};

  return (
    <div className="orders-page">
      <h2>Orders</h2>

      {/* Filters */}
      <div className="orders-controls">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Orders table */}
      <div className="table-container">
        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Status</th>
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
<td>
  <select
    value={order.status}
    onChange={(e) => updateStatus(order.id, e.target.value)}
  >
    <option value="paid">Paid</option>
    <option value="shipped">Shipped</option>
    <option value="delivered">Delivered</option>
    <option value="cancelled">Cancelled</option>
  </select>
</td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}