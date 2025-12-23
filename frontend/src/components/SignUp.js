import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/signup", formData);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="w-96">
          <h1 className="text-3xl font-bold mb-2">Sign up for SalesMind AI</h1>
          <p className="text-gray-500 mb-6">
            Automate your sales outreach with AI.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="w-full border p-3 rounded"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Business email"
              className="w-full border p-3 rounded"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border p-3 rounded"
              onChange={handleChange}
              required
            />

            <button className="w-full bg-black text-white py-3 rounded">
              Sign up for free
            </button>
          </form>

          <div className="my-6 text-center text-gray-400">OR</div>

          <button className="w-full border py-3 rounded mb-3">
            Sign up with Google
          </button>

          <button className="w-full border py-3 rounded">
            Sign up with Microsoft
          </button>
        </div>
      </div>

      {/* Right section */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">
          AI-powered sales automation platform 🚀
        </p>
      </div>
    </div>
  );
}
