import { useEffect, useState } from "react";
import "../../styles/admin/Products.css";

const API_URL = "http://127.0.0.1:8000";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category_id: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [productData, setProductData] = useState(emptyProduct);

  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  /* =========================
     FETCH PRODUCTS
  ========================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/products`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch products"
        );
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to fetch categories"
      );
    }

    setCategories(data);
  } catch (error) {
    console.error("Fetch categories error:", error);
  }
};

  const addCategory = async (e) => {
  e.preventDefault();

  const name = newCategory.trim();

  if (!name) {
    alert("Please enter a category name.");
    return;
  }

  if (!token) {
    alert("Your admin session has expired.");
    return;
  }

  try {
    setCategoryLoading(true);

    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to create category"
      );
    }

    setCategories((prev) => [...prev, data]);
    setNewCategory("");

    alert("Category added successfully 🔥");
  } catch (error) {
    console.error("Add category error:", error);
    alert(error.message);
  } finally {
    setCategoryLoading(false);
  }
};

  const deleteCategory = async (id) => {
  if (!token) {
    alert("Your admin session has expired.");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/categories/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to delete category"
      );
    }

    setCategories((prev) =>
      prev.filter((category) => category.id !== id)
    );
  } catch (error) {
    console.error("Delete category error:", error);
    alert(error.message);
  }
};

  /* =========================
     INITIAL LOAD
  ========================= */

useEffect(() => {
  fetchProducts();
  fetchCategories();
}, []);

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleProductChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     IMAGE CHANGE
  ========================= */

  const handleImageChange = (e) => {
    setImage(e.target.files[0] || null);
  };

  const handleImage2Change = (e) => {
    setImage2(e.target.files[0] || null);
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {
    setProductData(emptyProduct);

    setImage(null);
    setImage2(null);

    setEditingProduct(null);

    const imageInput = document.getElementById(
      "product-image"
    );

    const image2Input = document.getElementById(
      "product-image2"
    );

    if (imageInput) {
      imageInput.value = "";
    }

    if (image2Input) {
      image2Input.value = "";
    }
  };

  /* =========================
     ADD PRODUCT
  ========================= */

  const addProduct = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Your admin session has expired. Please login again.");
      return;
    }

    if (!image) {
      alert("Please select a product image.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append(
        "description",
        productData.description
      );
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append(
        "category_id",
        productData.category_id
      );

      formData.append("image", image);

      if (image2) {
        formData.append("image2", image2);
      }

      const response = await fetch(
        `${API_URL}/products/with-images`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to add product"
        );
      }

      alert("Product added successfully 🔥");

      resetForm();

      await fetchProducts();
    } catch (error) {
      console.error("Add product error:", error);

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     START EDITING
  ========================= */

  const startEdit = (product) => {
    setEditingProduct(product);

    setProductData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category_id: product.category_id || "",
    });

    setImage(null);
    setImage2(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     UPDATE PRODUCT
  ========================= */

const updateProduct = async (e) => {
  e.preventDefault();

  if (!token) {
    alert("Your admin session has expired.");
    return;
  }

  try {
    setSaving(true);

    // =========================
    // UPDATE PRODUCT DETAILS
    // =========================

    const response = await fetch(
      `${API_URL}/products/${editingProduct.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          price: Number(productData.price),
          stock: Number(productData.stock),
          category_id: Number(productData.category_id),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to update product"
      );
    }

    // =========================
    // UPDATE IMAGES
    // =========================

    if (image || image2) {
      const imageFormData = new FormData();

      if (image) {
        imageFormData.append("image", image);
      }

      if (image2) {
        imageFormData.append("image2", image2);
      }

      const imageResponse = await fetch(
        `${API_URL}/products/${editingProduct.id}/images`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: imageFormData,
        }
      );

      const imageData = await imageResponse.json();

      if (!imageResponse.ok) {
        throw new Error(
          imageData.detail || "Product details updated, but image update failed."
        );
      }
    }

    alert("Product updated successfully 🔥");

    resetForm();

    await fetchProducts();

  } catch (error) {
    console.error("Update product error:", error);

    alert(error.message);

  } finally {
    setSaving(false);
  }
};

  /* =========================
     DELETE PRODUCT
  ========================= */

  const deleteProduct = async (id) => {
    if (!token) {
      alert("Your admin session has expired.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/products/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete product"
        );
      }

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Delete product error:", error);

      alert(error.message);
    }
  };

  return (
    <div className="admin-container">

      {/* HEADER */}

      <div className="products-header">
        <div>
          <h1>Products Manager</h1>

          <p>
            Manage your SAINT products, prices and stock.
          </p>
        </div>

        <span>
          {products.length} product
          {products.length !== 1 ? "s" : ""}
        </span>
      </div>


      {/* PRODUCT FORM */}

      <div className="product-manager-card">

        <div className="product-form-header">
          <h2>
            {editingProduct
              ? "Edit Product"
              : "Add New Product"}
          </h2>

          {editingProduct && (
            <button
              type="button"
              className="cancel-edit"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>


        <form
          className="product-form"
          onSubmit={
            editingProduct
              ? updateProduct
              : addProduct
          }
        >

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
            min="0"
            placeholder="Price (KES)"
            value={productData.price}
            onChange={handleProductChange}
            required
          />


          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock"
            value={productData.stock}
            onChange={handleProductChange}
            required
          />

<select
  name="category_id"
  value={productData.category_id}
  onChange={handleProductChange}
  required
>
  <option value="">
    Select Category
  </option>

  {categories.map((category) => (
    <option
      key={category.id}
      value={category.id}
    >
      {category.name}
    </option>
  ))}
</select>


          <textarea
            name="description"
            placeholder="Product Description"
            value={productData.description}
            onChange={handleProductChange}
            required
          />


          <div className="product-images-section">

  <div className="file-input-group">
    <label>
      {editingProduct
        ? "Replace Main Product Image (optional)"
        : "Main Product Image"}
    </label>

    <input
      id="product-image"
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      required={!editingProduct}
    />
  </div>


  <div className="file-input-group">
    <label>
      {editingProduct
        ? "Replace Second Product Image (optional)"
        : "Second Product Image (optional)"}
    </label>

    <input
      id="product-image2"
      type="file"
      accept="image/*"
      onChange={handleImage2Change}
    />
  </div>

</div>


          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingProduct
              ? "Update Product"
              : "Add Product"}
          </button>

        </form>

      </div>

      <div className="category-manager">

  <div className="category-manager-header">
    <div>
      <h2>Categories</h2>

      <p>
        Organize your SAINT products into categories.
      </p>
    </div>

    <span>
      {categories.length} categor
      {categories.length !== 1 ? "ies" : "y"}
    </span>
  </div>


  <form
    className="category-form"
    onSubmit={addCategory}
  >
    <input
      type="text"
      placeholder="Category name..."
      value={newCategory}
      onChange={(e) =>
        setNewCategory(e.target.value)
      }
    />

    <button
      type="submit"
      disabled={categoryLoading}
    >
      {categoryLoading
        ? "Adding..."
        : "Add Category"}
    </button>
  </form>


  {categories.length === 0 ? (
    <div className="categories-empty">
      <p>No categories yet.</p>
    </div>
  ) : (
    <div className="categories-list">

      {categories.map((category) => (
        <div
          key={category.id}
          className="category-item"
        >

          <div>
            <strong>
              {category.name}
            </strong>

            <span>
              /{category.slug}
            </span>
          </div>

          <button
            className="delete-category"
            onClick={() =>
              deleteCategory(category.id)
            }
          >
            Delete
          </button>

        </div>
      ))}

    </div>
  )}

</div>


      {/* PRODUCTS */}

      <div className="products-section">

        <div className="products-section-header">
          <h2>All Products</h2>

          <button
            className="refresh-products"
            onClick={fetchProducts}
          >
            Refresh
          </button>
        </div>


        {loading ? (
          <div className="products-loading">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="products-empty">
            <h3>No products yet</h3>

            <p>
              Add your first SAINT product above.
            </p>
          </div>
        ) : (
          <div className="products-grid-ad">

            {products.map((product) => (

              <div
                key={product.id}
                className="product-card-ad"
              >

                <div className="product-image-wrapper">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                </div>


                <div className="product-card-info">

                  <h3>
                    {product.name}
                  </h3>

                  <p className="product-price">
                    KES {product.price}
                  </p>

                  <p className="product-stock">
                    Stock:{" "}
                    <strong>
                      {product.stock}
                    </strong>
                  </p>

                </div>


                <div className="product-actions">

                  <button
                    className="edit-product"
                    onClick={() =>
                      startEdit(product)
                    }
                  >
                    Edit
                  </button>


                  <button
                    className="delete-product"
                    onClick={() =>
                      deleteProduct(product.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}