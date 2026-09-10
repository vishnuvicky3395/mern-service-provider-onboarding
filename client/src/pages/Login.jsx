import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // HANDLE INPUT
  // ===============================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // LOGIN
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      const { token, user } = response.data;

      // =================================
      // CLEAR OLD AUTH DATA
      // =================================
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("providerToken");
      localStorage.removeItem("providerUser");

      // =================================
      // SAVE TOKEN BASED ON ROLE
      // =================================

      if (user.role === "admin") {
        localStorage.setItem("adminToken", token);
        localStorage.setItem(
          "adminUser",
          JSON.stringify(user)
        );
      }

      if (user.role === "provider") {
        localStorage.setItem("providerToken", token);
        localStorage.setItem(
          "providerUser",
          JSON.stringify(user)
        );
      }

      // General user information
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      setMessage("Login successful!");

      // =================================
      // REDIRECT BASED ON ROLE
      // =================================

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "provider") {
        navigate("/provider");
      } else {
        setMessage("Invalid user role");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Service Provider Portal</h1>

        <h2>Login</h2>

        <p className="subtitle">
          Login to your account
        </p>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}
          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* MESSAGE */}
        {message && (
          <p className="message">
            {message}
          </p>
        )}

        {/* REGISTER */}
        <p className="bottom-text">
          Don't have an account?{" "}

          <span
            onClick={() => navigate("/register")}
            style={{
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;