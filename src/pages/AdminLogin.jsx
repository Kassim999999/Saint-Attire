import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("token", data.access_token);
        navigate("/admin");
      } else {
        alert("Wrong password");
      }
    } catch (err) {
      console.error(err);
    }
  };

return (
  <div className="admin-login-container">
    <form onSubmit={handleLogin} className="admin-login-card">
      <h2>Admin Login</h2>

      <input
        type="password"
        placeholder="Enter Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>
    </form>
  </div>
);
}
