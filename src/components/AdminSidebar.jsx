import { Link, useNavigate } from "react-router-dom";

export default function AdminSidebar() {

const navigate = useNavigate();

const logout = () => {
  localStorage.removeItem("token");
  navigate("/admin-login");
};

return (

<div className="admin-sidebar">

<h2 className="logo">SAINT</h2>

<ul className="sidebar-menu">

<li>
<Link to="/admin">Dashboard</Link>
</li>

<li>
<Link to="/admin/orders">Orders</Link>
</li>

<li>
<Link to="/admin/products">Products</Link>
</li>

<li>
<Link to="/admin/analytics">Analytics</Link>
</li>

</ul>

<button onClick={logout} className="logout-btn">
Logout
</button>

</div>

);

}