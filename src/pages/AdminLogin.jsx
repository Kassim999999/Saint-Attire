import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password");
      }

      if (!data.access_token) {
        throw new Error("Login succeeded but no access token was returned.");
      }

      localStorage.setItem("token", data.access_token);

      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);

      alert(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <form
        onSubmit={handleLogin}
        className="admin-login-card"
      >
        <div className="admin-login-header">
          <h1>SAINT</h1>
          <p>Admin Panel</p>
        </div>

        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Sign in to manage your store
        </p>

        <div className="login-field">
          <label htmlFor="admin-email">
            Email
          </label>

          <input
            id="admin-email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="login-field">
          <label htmlFor="admin-password">
            Password
          </label>

          <input
            id="admin-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}