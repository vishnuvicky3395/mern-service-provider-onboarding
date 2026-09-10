import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
  // REGISTER
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/register",
        formData
      );

      // =================================
      // CLEAR OLD LOGIN DATA
      // =================================
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("providerToken");
      localStorage.removeItem("providerUser");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      setMessage(
        response.data.message ||
          "Registration successful! Please login."
      );

      // =================================
      // GO TO LOGIN
      // =================================
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.error(
        "REGISTRATION ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>Service Provider Portal</h1>

        <h2>Create Account</h2>

        <p className="subtitle">
          Register as a service provider
        </p>

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

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
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        {/* MESSAGE */}
        {message && (
          <p className="message">
            {message}
          </p>
        )}

        {/* LOGIN */}
        <p className="bottom-text">
          Already have an account?{" "}

          <span
            onClick={() => navigate("/login")}
            style={{
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default RegisterPage;