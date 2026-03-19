import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Drop from "./pages/Drop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin"

import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Products from "./pages/admin/Products";
import Analytics from "./pages/admin/Analytics";


import "./index.css";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>

        <Routes>

          {/* STORE PAGES */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />

          <Route
            path="/drop"
            element={
              <MainLayout>
                <Drop />
              </MainLayout>
            }
          />

          <Route
            path="/product/:id"
            element={
              <MainLayout>
                <Product />
              </MainLayout>
            }
          />

          <Route
            path="/cart"
            element={
              <MainLayout>
                <Cart />
              </MainLayout>
            }
          />

          <Route
            path="/checkout"
            element={
              <MainLayout>
                <Checkout />
              </MainLayout>
            }
          />

          {/* ADMIN PAGES (NO LAYOUT) */}
<Route path="/admin-login" element={<AdminLogin />} />
<Route path="/admin" element={<AdminLayout />}>

  <Route index element={<Dashboard />} />

  <Route path="orders" element={<Orders />} />

  <Route path="products" element={<Products />} />

  <Route path="analytics" element={<Analytics />} />

</Route>

        </Routes>

      </BrowserRouter>
    </CartProvider>
  );
}

export default App;