import { useEffect, useState } from "react";
import "../../styles/Admin.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    image2: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [image2File, setImage2File] = useState(null);

  const ADMIN_PASSWORD = "saint2026";

  // ----------------------
  // Login admin to get token
  // ----------------------
  const loginAdmin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: ADMIN_PASSWORD }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      setToken(data.access_token);
    } catch (err) {
      console.error("Admin login error:", err);
      alert("Failed to login as admin. Check backend.");
    }
  };

  // ----------------------
  // Fetch products
  // ----------------------
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  useEffect(() => {
    loginAdmin();
    fetchProducts();
  }, []);

  // ----------------------
  // Handle input change
  // ----------------------
  const handleProductChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  // ----------------------
  // Upload image
  // ----------------------
  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.image_url;
  };

  // ----------------------
  // Add product
  // ----------------------
  const addProduct = async (e) => {
    e.preventDefault();
    if (!token) return alert("Admin token not ready yet");

    try {
      const imageUrl = await uploadImage(imageFile);
      const image2Url = await uploadImage(image2File);

      const body = {
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        image: imageUrl,
        image2: image2Url || imageUrl,
      };

      const res = await fetch("http://127.0.0.1:8000/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Add product failed");

      // Reset form
      setProductData({
        name: "",
        price: "",
        stock: "",
        description: "",
        image: "",
        image2: "",
      });
      setImageFile(null);
      setImage2File(null);

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to add product. Check backend and token.");
    }
  };

  // ----------------------
  // Delete product
  // ----------------------
  const deleteProduct = async (id) => {
    if (!token) return alert("Admin token not ready yet");

    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product. Check backend and token.");
    }
  };

  return (
    <div className="admin-container">
      <h1>Products Manager</h1>

      <form className="product-form" onSubmit={addProduct}>
        <input
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleProductChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={productData.price}
          onChange={handleProductChange}
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={productData.stock}
          onChange={handleProductChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={productData.description}
          onChange={handleProductChange}
          required
        />
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />
        <input
          type="file"
          onChange={(e) => setImage2File(e.target.files[0])}
        />
        <button type="submit">Add Product</button>
      </form>

      <div className="products-grid-ad">
        {products.map((p) => (
          <div key={p.id} className="product-card-ad">
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>KES {p.price}</p>
            <p>Stock: {p.stock}</p>
            <button
              className="delete-product"
              onClick={() => deleteProduct(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}