import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

export default function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        formData
      );

      localStorage.setItem("userId", res.data.user_id);
      localStorage.setItem("role", res.data.role);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="signin-wrapper">
      {/* Floating Background Icons */}
      <div className="signin-bg">
        <span className="icon i1">🔒</span>
        <span className="icon i2">📊</span>
        <span className="icon i3">💡</span>
        <span className="icon i4">📈</span>
      </div>

      <div className="signin-card">
        <div className="ring"></div>
        <div className="signin-logo">🚀</div>

        <h1>Welcome back</h1>
        <p className="subtitle">
          Sign in to continue to <b>SalesMind AI</b>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="signin-btn">
            Sign In
          </button>
        </form>

        <div className="divider">OR</div>

        <button className="google-btn">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          Sign in with Google
        </button>

        <p className="footer-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}
