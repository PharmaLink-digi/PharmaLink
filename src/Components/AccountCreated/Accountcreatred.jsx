import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AccountCreated() {
  const navigate = useNavigate();
  const { getDashboardPath, setSignupRole } = useAuth();

  useEffect(() => {
    // Safe to clear signupRole here — Signup is already unmounted,
    // so the guard that was causing the redirect won't fire.
    setSignupRole(null);
  }, []);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#f5f7fb", padding: "24px 16px" }}
    >
      {/* Stepper */}
      <Stepper active={3} />

      {/* Card */}
      <div
        className="text-center"
        style={{
          background: "#fff",
          borderRadius: "26px",
          padding: "60px 40px",
          maxWidth: "520px",
          width: "100%",
          boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
        }}
      >
        {/* Animated check icon */}
        <div
          className="mx-auto mb-4"
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10c8a0, #0d6efd)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "acPopIn 0.5s ease",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="white" viewBox="0 0 16 16"
            style={{ animation: "acDraw 0.7s ease forwards" }}>
            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.733.733 0 0 1 1.06-1.06l2.096 2.063 6.159-6.143z" />
          </svg>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0b1324", marginBottom: 8 }}>
          Account Created!
        </h1>
        <p style={{ color: "#6c7a89", fontSize: 15, marginBottom: 36 }}>
          Welcome to PharmaLink. Your account is ready.
        </p>

        <button
          className="btn fw-bold text-white border-0"
          onClick={() => navigate(getDashboardPath())}
          style={{
            width: 200,
            height: 50,
            borderRadius: 14,
            background: "linear-gradient(90deg, #0d6efd 0%, #10c8a0 100%)",
            fontSize: 15,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.opacity = "0.92"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}
        >
          Go to Dashboard
        </button>
      </div>

      <style>{`
        @keyframes acPopIn {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes acDraw {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(8deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Stepper({ active }) {
  const steps = [1, 2, 3];
  return (
    <div className="d-flex align-items-center mb-5">
      {steps.map((s, i) => (
        <div key={s} className="d-flex align-items-center">
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: s <= active ? "linear-gradient(135deg,#0d6efd,#10c8a0)" : "#eef2f7",
              color: s <= active ? "#fff" : "#7b8794",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {s <= active ? "✓" : s}
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 60,
              height: 2,
              background: s < active ? "linear-gradient(90deg,#0d6efd,#10c8a0)" : "#dbe2ea",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}
