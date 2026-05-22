import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";

export default function Accountcreatred() {
  return (
    <>
        <div
      className="d-flex flex-column justify-content-center align-items-center position-relative"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      {/* Stepper */}
      <div className="d-flex align-items-center mb-5">
        {/* Step 1 */}
        <div
          className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold"
          style={{
            width: "34px",
            height: "34px",
            background: "#0d99ff",
            fontSize: "14px",
          }}
        >
          ✓
        </div>

        <div
          style={{
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #0d99ff 0%, #10c8b0 100%)",
          }}
        />

        {/* Step 2 */}
        <div
          className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold"
          style={{
            width: "34px",
            height: "34px",
            background: "#0d99ff",
            fontSize: "14px",
          }}
        >
          ✓
        </div>

        <div
          style={{
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #0d99ff 0%, #10c8b0 100%)",
          }}
        />

        {/* Step 3 */}
        <div
          className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold"
          style={{
            width: "34px",
            height: "34px",
            background: "#0d99ff",
            fontSize: "14px",
          }}
        >
          3
        </div>
      </div>

      {/* Card */}
      <div
        className="bg-white shadow-sm text-center"
        style={{
          width: "660px",
          borderRadius: "26px",
          padding: "70px 40px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        {/* Success Icon */}
        <div
          className="mx-auto d-flex justify-content-center align-items-center mb-4 success-circle"
          style={{
            width: "78px",
            height: "78px",
            borderRadius: "50%",
            background: "#10c8a0",
          }}
        >
          <svg
            className="check-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            fill="white"
            viewBox="0 0 16 16"
          >
            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.733.733 0 0 1 1.06-1.06l2.096 2.063 6.159-6.143z" />
          </svg>

          <style>{`
    .success-circle {
      animation: popIn 0.5s ease;
    }

    .check-icon {
      animation: drawCheck 0.7s ease forwards;
      transform: scale(0);
    }

    @keyframes popIn {
      0% {
        transform: scale(0.5);
        opacity: 0;
      }

      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes drawCheck {
      0% {
        transform: scale(0) rotate(-20deg);
        opacity: 0;
      }

      60% {
        transform: scale(1.2) rotate(10deg);
        opacity: 1;
      }

      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
    }
  `}</style>
        </div>
        {/* Title */}
        <h1
          className="fw-bold mb-2"
          style={{
            fontSize: "24px",
            color: "#0b1324",
          }}
        >
          Account Created!
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "#6c7a89",
            fontSize: "16px",
            marginBottom: "35px",
          }}
        >
          Welcome to PharmaLink
        </p>

        {/* Button */}
        <button
          className="btn border-0 fw-bold text-white"
          onMouseEnter={(e) => {
            e.target.style.background =
              "linear-gradient(90deg, #0b5ed7 0%, #0fb394 100%)";

            e.target.style.transform = "translateY(-2px) scale(1.02)";

            e.target.style.boxShadow = "0 10px 20px rgba(13,110,253,0.25)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              "linear-gradient(90deg, #0d6efd 0%, #10c8a0 100%)";

            e.target.style.transform = "translateY(0) scale(1)";

            e.target.style.boxShadow = "none";
          }}
          onClick={() => {
            alert("Go to Dashboard");
          }}
          style={{
            width: "190px",
            height: "46px",
            borderRadius: "14px",
            background: "linear-gradient(90deg, #0d6efd 0%, #10c8a0 100%)",
            fontSize: "16px",
            transition: "all 0.3s ease",
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
    </>
  )
}
