import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OtpVerify.css";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 min
  const [expired, setExpired] = useState(false);

  const email = localStorage.getItem("signupEmail");
  const userId = localStorage.getItem("userId");

  /* ⏳ Countdown Timer */
  useEffect(() => {
    if (secondsLeft <= 0) {
      setExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = () => {
    const min = Math.floor(secondsLeft / 60);
    const sec = secondsLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const verifyOtp = async () => {
    if (expired) return;

    try {
      await axios.post("http://localhost:5000/api/verify-otp", {
        user_id: userId,
        otp,
      });

      setMessage("✅ Email verified successfully");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Verification failed");
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/resend-otp", {
        user_id: userId,
      });

      setSecondsLeft(300);
      setExpired(false);
      setMessage("📩 OTP resent to your email");
    } catch {
      setMessage("Failed to resend OTP");
    }
  };

  return (
    <div className="otp-wrapper">
      {/* Floating background */}
      <div className="floating-bg">
        <span className="float-card c1">🔐</span>
        <span className="float-card c2">📧</span>
        <span className="float-card c3">🔑</span>
        <span className="float-card c4">🛡️</span>
      </div>

      <div className="otp-card">
        <div className="otp-logo">✨</div>

        <h2>Verify your Email</h2>
        <p className="subtitle">
          Enter the 6-digit OTP sent to <b>{email}</b>
        </p>

        <input
          type="text"
          maxLength="6"
          placeholder="••••••"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className={`otp-input ${expired ? "disabled" : ""}`}
          disabled={expired}
        />

        <div className="timer">
          {expired ? (
            <span className="expired">OTP expired</span>
          ) : (
            <>Expires in <b>{formatTime()}</b></>
          )}
        </div>

        <button
          className="verify-btn"
          onClick={verifyOtp}
          disabled={expired}
        >
          Verify OTP
        </button>

        <button
          className={`resend-btn ${expired ? "active" : ""}`}
          onClick={resendOtp}
          disabled={!expired}
        >
          Resend OTP
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
