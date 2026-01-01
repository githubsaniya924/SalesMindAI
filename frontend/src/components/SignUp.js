import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      tempErrors.name = "Name should contain only alphabets";
    }

    if (!/^[^\s@]+@[^\s@]+\.com$/.test(formData.email)) {
      tempErrors.email = "Email must end with .com";
    }

    if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{10,}$/.test(formData.password)
    ) {
      tempErrors.password =
        "Minimum 10 characters with uppercase, number & special character";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/signup",
        formData
      );

      localStorage.setItem("signupEmail", formData.email);
      localStorage.setItem("userId", res.data.user_id);
      navigate("/verify-otp");
    } catch (err) {
      setErrors({ api: "Signup failed. Try again." });
    }
  };

  return (
    <div className="signup-wrapper">
      {/* Floating background elements */}
<div className="floating-bg">
  <span className="float-card c1">✉️</span>
  <span className="float-card c2">📨</span>
  <span className="float-card c3">📩</span>
  <span className="float-card c4">✉️</span>
  <span className="float-card c5">📨</span>
</div>
      <div className="signup-card">

        {/* Wizard Illustration */}
        <div className="wizard">
          <img src="/wizard.png" alt="wizard" />
        </div>

        <div className="logo-circle">🌸</div>

        <h1>Create account</h1>
        <p className="subtitle">Sign up to experience the magic!</p>

        <button className="google-btn">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
          />
          Sign up with Google
        </button>

        <div className="divider">or</div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span>{errors.name}</span>}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span>{errors.email}</span>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <span>{errors.password}</span>}

          {errors.api && <span>{errors.api}</span>}

          <button type="submit" className="primary-btn">
            Create Account
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{" "}
          <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
