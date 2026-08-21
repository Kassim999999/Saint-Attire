// src/pages/admin/Orders.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/Orders.css";

const API_URL = "http://127.0.0.1:8000";

export default function Orders() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [updatingId, setUpdatingId] = useState(null);

  /* =========================
     FETCH ORDERS
  ========================= */

const fetchOrders = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/admin-login");
    return;
  }

try {
  setLoading(true);
  setError("");

  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  console.log("ORDERS API RESPONSE:", data);

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch orders"
    );
  }

  setOrders(Array.isArray(data) ? data : []);

} catch (error) {
  console.error("Fetch orders error:", error);

  setOrders([]);
  setError(error.message);

} finally {
  setLoading(false);
}
};

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================
     UPDATE ORDER STATUS
  ========================= */

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      setUpdatingId(id);

      const response = await fetch(
        `${API_URL}/orders/${id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update order"
        );
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? {
                ...order,
                order_status: status,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Update order error:", error);

      alert(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================
     SEARCH + FILTER
  ========================= */

  const filteredOrders = orders.filter((order) => {
    const name =
      order.customer_name ||
      order.full_name ||
      "";

    const email =
      order.customer_email ||
      order.email ||
      "";

    const phone =
      order.customer_phone ||
      order.phone ||
      "";

    const status =
      order.order_status ||
      order.status ||
      "";

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search) ||
      phone.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* =========================
     STATUS CLASS
  ========================= */

const getStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "pending";

    case "Processing":
      return "processing";

    case "Shipped":
      return "shipped";

    case "Delivered":
      return "delivered";

    case "Cancelled":
      return "cancelled";

    default:
      return "";
  }
};

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="admin-loading">
        <h1>Loading Orders...</h1>
      </div>
    );
  }

  return (
    <div className="admin-container orders-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="orders-header">

        <div>
          <h1>Orders</h1>

          <p>
            Manage customer orders and delivery status.
          </p>
        </div>

        <div className="orders-count">
          {filteredOrders.length} order
          {filteredOrders.length !== 1 ? "s" : ""}
        </div>

      </div>


      {/* =========================
          CONTROLS
      ========================= */}

      <div className="admin-controls">

        <input
          className="search-input"
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <select
  className="filter-select"
  value={statusFilter}
  onChange={(e) =>
    setStatusFilter(e.target.value)
  }
>
  <option value="All">
    All Orders
  </option>

  <option value="Pending">
    Pending
  </option>

  <option value="Processing">
    Processing
  </option>

  <option value="Shipped">
    Shipped
  </option>

  <option value="Delivered">
    Delivered
  </option>

  <option value="Cancelled">
    Cancelled
  </option>
</select>

        <button
          className="refresh-products"
          onClick={fetchOrders}
        >
          Refresh
        </button>

      </div>


      {/* =========================
          ORDERS TABLE
      ========================= */}

      {filteredOrders.length === 0 ? (

        <div className="orders-empty">

          <h2>No orders found</h2>

          <p>
            Try changing your search or status filter.
          </p>

        </div>

      ) : (

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {filteredOrders.map((order) => {

                const name =
                  order.customer_name ||
                  order.full_name ||
                  "Unknown";

                const email =
                  order.customer_email ||
                  order.email ||
                  "—";

                const phone =
                  order.customer_phone ||
                  order.phone ||
                  "—";

                const amount =
                  order.total ??
                  order.amount ??
                  0;

                const status =
  order.order_status ||
  order.status ||
  "Pending";

                return (

                  <tr key={order.id}>

                    {/* ORDER ID */}

                    <td>
                      <strong>
                        #{order.id}
                      </strong>
                    </td>


                    {/* CUSTOMER */}

                    <td>
                      {name}
                    </td>


                    {/* EMAIL */}

                    <td>
                      {email}
                    </td>


                    {/* PHONE */}

                    <td>
                      {phone}
                    </td>


                    {/* AMOUNT */}

                    <td>
                      KES{" "}
                      {Number(amount).toLocaleString()}
                    </td>


                    {/* STATUS */}

                   <td>
  <span
    className={`payment-status ${
      order.payment_status?.toLowerCase()
    }`}
  >
    {order.payment_status || "Pending"}
  </span>
</td>

<td>
  <span
    className={`status ${getStatusClass(
      status
    )}`}
  >
    {status}
  </span>
</td>


                    {/* ACTIONS */}

                    <td>

                      <button
                        className="view-btn"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                      >
                        View
                      </button>


           <select
  value={status}
  disabled={updatingId === order.id}
  onChange={(e) =>
    updateStatus(
      order.id,
      e.target.value
    )
  }
>
  <option value="Pending">
    Pending
  </option>

  <option value="Processing">
    Processing
  </option>

  <option value="Shipped">
    Shipped
  </option>

  <option value="Delivered">
    Delivered
  </option>

  <option value="Cancelled">
    Cancelled
  </option>
</select>

                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>

        </div>

      )}


      {/* =========================
          ORDER DETAILS MODAL
      ========================= */}

      {selectedOrder && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="modal order-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <h2>
                Order #{selectedOrder.id}
              </h2>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                ×
              </button>

            </div>


            <div className="order-details">

              <div className="detail-row">

                <span>
                  Customer
                </span>

                <strong>
                  {selectedOrder.customer_name ||
                    selectedOrder.full_name}
                </strong>

              </div>


              <div className="detail-row">

                <span>
                  Email
                </span>

                <strong>
                  {selectedOrder.customer_email ||
                    selectedOrder.email}
                </strong>

              </div>


              <div className="detail-row">

                <span>
                  Phone
                </span>

                <strong>
                  {selectedOrder.customer_phone ||
                    selectedOrder.phone}
                </strong>

              </div>


              <div className="detail-row">

                <span>
                  Amount
                </span>

                <strong>
                  KES{" "}
                  {Number(
                    selectedOrder.total ??
                      selectedOrder.amount ??
                      0
                  ).toLocaleString()}
                </strong>

              </div>


              <div className="detail-row">

  <span>
    Payment
  </span>

  <span
    className={`payment-status ${
      selectedOrder.payment_status?.toLowerCase()
    }`}
  >
    {selectedOrder.payment_status || "Pending"}
  </span>

</div>


<div className="detail-row">

  <span>
    Order Status
  </span>

  <span
    className={`status ${getStatusClass(
      selectedOrder.order_status
    )}`}
  >
    {selectedOrder.order_status || "Pending"}
  </span>

</div>

            </div>


            {/* ORDER ITEMS */}

            {selectedOrder.items && (

              <div className="order-items">

                <h3>
                  Order Items
                </h3>

                {selectedOrder.items.map(
                  (item, index) => (

                    <div
                      className="order-item"
                      key={
                        item.id || index
                      }
                    >

                      <span>
                        {item.product_name ||
                          item.name}
                      </span>

                      <span>
                        ×{" "}
                        {item.quantity}
                      </span>

                    </div>

                  )
                )}

              </div>

            )}


            <button
              className="close-btn"
              onClick={() =>
                setSelectedOrder(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}