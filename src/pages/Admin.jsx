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

const navigate = useNavigate();

const [orders, setOrders] = useState([]);
const [analytics, setAnalytics] = useState(null);
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

const [productData, setProductData] = useState({
  name:"",
  price:"",
  image:"",
  stock:"",
  description:""
});

const [searchTerm,setSearchTerm] = useState("");
const [statusFilter,setStatusFilter] = useState("All");
const [lastUpdated,setLastUpdated] = useState("");



/* ---------------- FETCH ORDERS ---------------- */

const fetchOrders = async(token)=>{

const res = await fetch("http://127.0.0.1:8000/orders",{
headers:{ Authorization:`Bearer ${token}` }
});

const data = await res.json();
setOrders(data);

};



/* ---------------- FETCH PRODUCTS ---------------- */

const fetchProducts = async()=>{

const res = await fetch("http://127.0.0.1:8000/products");
const data = await res.json();

setProducts(data);

};



/* ---------------- FETCH ANALYTICS ---------------- */

const fetchAnalytics = async(token)=>{

const res = await fetch("http://127.0.0.1:8000/admin/analytics",{
headers:{ Authorization:`Bearer ${token}` }
});

const data = await res.json();

setAnalytics(data);
setLastUpdated(new Date().toLocaleTimeString());

};



/* ---------------- INITIAL LOAD ---------------- */

useEffect(()=>{

const token = localStorage.getItem("token");

if(!token){
navigate("/admin-login");
return;
}

const init = async()=>{
await Promise.all([
fetchOrders(token),
fetchAnalytics(token),
fetchProducts()
]);

setLoading(false);
};

init();

},[]);



/* ---------------- PRODUCT FORM ---------------- */

const handleProductChange=(e)=>{

setProductData({
...productData,
[e.target.name]:e.target.value
});

};



/* ---------------- ADD PRODUCT ---------------- */

const uploadProduct=async(e)=>{

e.preventDefault();

const token = localStorage.getItem("token");

await fetch("http://127.0.0.1:8000/admin/products",{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify(productData)

});

setProductData({
name:"",
price:"",
image:"",
stock:"",
description:""
});

fetchProducts();

};



/* ---------------- DELETE PRODUCT ---------------- */

const deleteProduct=async(id)=>{

const token = localStorage.getItem("token");

await fetch(`http://127.0.0.1:8000/admin/products/${id}`,{

method:"DELETE",

headers:{ Authorization:`Bearer ${token}` }

});

fetchProducts();

};



/* ---------------- UPDATE STATUS ---------------- */

const updateStatus = async(id,status)=>{

const token = localStorage.getItem("token");

await fetch(
`http://127.0.0.1:8000/orders/${id}?status=${status}`,
{
method:"PATCH",
headers:{ Authorization:`Bearer ${token}` }
}
);

setOrders(prev =>
prev.map(order =>
order.id === id ? {...order,status} : order
)
);

fetchAnalytics(token);

};



/* ---------------- LOGOUT ---------------- */

const handleLogout=()=>{
localStorage.removeItem("token");
navigate("/admin-login");
};



if(loading){
return <div className="admin-loading">
<h1>Loading Dashboard...</h1>
</div>;
}



const monthNames = [
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
];

const monthlyRevenue = analytics?.monthly_revenue || {};

const chartData = {

labels:monthNames,

datasets:[{
label:"Monthly Revenue (KES)",
data:monthNames.map((_,index)=>{
const m = String(index+1).padStart(2,"0");
return monthlyRevenue[m] || 0;
})
}]

};



const filteredOrders = orders.filter(order=>{

const matchesSearch =
order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
order.email.toLowerCase().includes(searchTerm.toLowerCase());

const matchesStatus =
statusFilter==="All" || order.status===statusFilter;

return matchesSearch && matchesStatus;

});



return (

<div className="admin-layout">


{/* SIDEBAR */}

<div className="admin-sidebar">

<h2 className="logo">SAINT</h2>

<ul className="sidebar-menu">

<li>Dashboard</li>
<li>Orders</li>
<li>Products</li>
<li>Analytics</li>

</ul>

<button onClick={handleLogout} className="logout-btn">
Logout
</button>

</div>



{/* MAIN CONTENT */}

<div className="admin-main">

<div className="admin-topbar">

<h1>Admin Dashboard</h1>

<p className="last-updated">
Updated: {lastUpdated}
</p>

</div>



{/* ANALYTICS */}

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



{/* CHART */}

<div className="chart-container">

<h2>Revenue Overview</h2>

<Bar data={chartData}/>

</div>



{/* PRODUCT MANAGER */}

<h2 className="section-title">Product Manager</h2>


<form className="product-form" onSubmit={uploadProduct}>

<input
name="name"
placeholder="Product Name"
value={productData.name}
onChange={handleProductChange}
/>

<input
name="price"
placeholder="Price"
value={productData.price}
onChange={handleProductChange}
/>

<input
name="image"
placeholder="Image URL"
value={productData.image}
onChange={handleProductChange}
/>

<input
name="stock"
placeholder="Stock"
value={productData.stock}
onChange={handleProductChange}
/>

<textarea
name="description"
placeholder="Description"
value={productData.description}
onChange={handleProductChange}
/>

<button type="submit">
Add Product
</button>

</form>



{/* PRODUCTS */}

<div className="products-grid-ad">

{products.map(product=>(

<div className="product-card-ad" key={product.id}>

<img src={product.image}/>

<h3>{product.name}</h3>

<p>KES {product.price}</p>

<p>Stock: {product.stock}</p>

<button
onClick={()=>deleteProduct(product.id)}
className="delete-product"
>
Delete
</button>

</div>

))}

</div>



{/* ORDERS */}

<h2 className="section-title">Orders</h2>

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

{filteredOrders.map(order=>(

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
className="ship-btn"
onClick={()=>updateStatus(order.id,"shipped")}
>
Ship
</button>

<button
className="deliver-btn"
onClick={()=>updateStatus(order.id,"delivered")}
>
Deliver
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>


);

}

export default Admin;