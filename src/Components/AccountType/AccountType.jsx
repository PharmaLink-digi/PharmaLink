import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Person, Shop, Building, ArrowRight, Check2 } from "react-bootstrap-icons";
import { useAuth } from "../../context/AuthContext.jsx";

const CARDS = [
  {
    id: "client",
    title: "Patient / Client",
    desc: "Find medicines, track orders, manage prescriptions",
    icon: <Person size={24} />,
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    desc: "Manage inventory, receive orders, grow your business",
    icon: <Shop size={24} />,
  },
  {
    id: "warehouse",
    title: "Warehouse",
    desc: "Handle distribution, manage stock, track deliveries",
    icon: <Building size={24} />,
  },
];

export default function AccountType() {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const { setSignupRole } = useAuth();

  const handleContinue = () => {
    if (!selected) return;
    setSignupRole(selected);
    navigate(`/signup/${selected}`);
  };

  return (
    <div className="at-page">
      <div className="at-wrap">

        {/* Stepper */}
        <Stepper active={1} />

        {/* Heading */}
        <div className="text-center mb-4">
          <h1 className="at-title">Choose your account type</h1>
          <p className="at-sub">Select the role that best describes you</p>
        </div>

        {/* Cards */}
        <div className="at-grid">
          {CARDS.map((card) => {
            const isActive = selected === card.id;
            return (
              <button
                key={card.id}
                type="button"
                className={`at-card${isActive ? " at-card--active" : ""}`}
                onClick={() => setSelected(card.id)}
              >
                {isActive && (
                  <span className="at-check">
                    <Check2 size={14} />
                  </span>
                )}
                <span className={`at-icon${isActive ? " at-icon--active" : ""}`}>
                  {card.icon}
                </span>
                <span className="at-card-title">{card.title}</span>
                <span className="at-card-desc">{card.desc}</span>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          type="button"
          className="at-btn"
          disabled={!selected}
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="ms-2" size={18} />
        </button>

        {/* Sign-in link */}
        <p className="at-footer-text">
          Already have an account?{" "}
          <span className="at-link" onClick={() => navigate("/signin")}>
            Sign in
          </span>
        </p>
      </div>

      <style>{`
        .at-page {
          min-height: 100vh;
          background: #f5f7fb;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px 16px;
        }
        .at-wrap {
          width: 100%;
          max-width: 680px;
        }
        .at-title {
          font-size: clamp(22px, 4vw, 30px);
          font-weight: 700;
          color: #0b1324;
          margin-bottom: 8px;
        }
        .at-sub {
          font-size: 14px;
          color: #7c8798;
          margin: 0;
        }
        .at-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }
        @media (max-width: 600px) {
          .at-grid { grid-template-columns: 1fr; }
        }
        .at-card {
          position: relative;
          background: #fff;
          border: 1.5px solid #e4eaf2;
          border-radius: 18px;
          padding: 22px 16px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          gap: 10px;
          transition: all 0.22s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .at-card:hover {
          border-color: #b3d4ff;
          box-shadow: 0 6px 18px rgba(13,110,253,0.08);
          transform: translateY(-2px);
        }
        .at-card--active {
          border-color: #0d6efd;
          box-shadow: 0 8px 24px rgba(13,110,253,0.14);
          transform: translateY(-3px);
        }
        .at-check {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #0d6efd;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .at-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #f0f4ff;
          color: #4b80e8;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.22s ease;
        }
        .at-icon--active {
          background: linear-gradient(135deg, #0d6efd, #10c8a0);
          color: #fff;
        }
        .at-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #0b1324;
          line-height: 1.3;
        }
        .at-card-desc {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.6;
        }
        .at-btn {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(90deg, #0d6efd 0%, #10c8a0 100%);
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          margin-bottom: 16px;
        }
        .at-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
          transform: none !important;
        }
        .at-btn:not(:disabled):hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .at-footer-text {
          text-align: center;
          font-size: 14px;
          color: #94a3b8;
          margin: 0;
        }
        .at-link {
          color: #0d6efd;
          font-weight: 600;
          cursor: pointer;
        }
        .at-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

function Stepper({ active }) {
  const steps = [1, 2, 3];
  return (
    <div className="d-flex justify-content-center align-items-center mb-4">
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
              flexShrink: 0,
            }}
          >
            {s <= active ? "✓" : s}
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                width: 56,
                height: 2,
                background: s < active ? "linear-gradient(90deg,#0d6efd,#10c8a0)" : "#dbe2ea",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
