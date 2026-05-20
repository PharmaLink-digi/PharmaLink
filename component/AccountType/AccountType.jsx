import { useState } from "react";
import {
  Person,
  Shop,
  Building,
  Buildings,
  ArrowRight,
  Check2,
} from "react-bootstrap-icons";

export default function AccountType() {
  const [selected, setSelected] = useState("");

  const cards = [
    {
      id: "patient",
      title: "Patient",
      desc: "Find medicines, track orders, manage prescriptions",
      icon: <Person size={22} />,
    },
    {
      id: "pharmacy",
      title: "Pharmacy",
      desc: "Manage inventory, receive orders, grow your business",
      icon: <Shop size={22} />,
    },
    {
      id: "warehouse",
      title: "Warehouse",
      desc: "Handle distribution, manage stock, track deliveries",
      icon: <Building size={22} />,
    },
    {
      id: "company",
      title: "Pharmaceutical Company",
      desc: "Monitor production, manage distribution networks",
      icon: <Buildings size={22} />,
    },
  ];

  const handleContinue = () => {
    if (!selected) return;

    const selectedCard = cards.find((c) => c.id === selected);
    alert(`Selected: ${selectedCard.title}`);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "20px",
      }}
    >
      <div style={{ width: "760px" }}>
        {/* Steps */}
        <div className="d-flex justify-content-center align-items-center mb-4">
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: "34px",
                height: "34px",
                background: "#0d99ff",
                fontSize: "14px",
              }}
            >
              1
            </div>

            <div
              style={{
                width: "60px",
                height: "2px",
                background: "#dbe2ea",
              }}
            />

            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "34px",
                height: "34px",
                background: "#eef2f7",
                color: "#7b8794",
                fontSize: "14px",
              }}
            >
              2
            </div>

            <div
              style={{
                width: "60px",
                height: "2px",
                background: "#dbe2ea",
              }}
            />

            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "34px",
                height: "34px",
                background: "#eef2f7",
                color: "#7b8794",
                fontSize: "14px",
              }}
            >
              3
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h1
            className="fw-bold mb-2"
            style={{ fontSize: "30px", color: "#0b1324" }}
          >
            Choose your account type
          </h1>

          <p style={{ color: "#7c8798", fontSize: "14px" }}>
            Select the role that best describes you
          </p>
        </div>

        {/* Cards */}
        <div className="row g-3 mb-4">
          {cards.map((card) => {
            const active = selected === card.id;

            return (
              <div className="col-md-6" key={card.id}>
                <div
                  onClick={() => setSelected(card.id)}
                  style={{
                    position: "relative",
                    background: "#fff",
                    borderRadius: "18px",
                    padding: "24px 20px",
                    height: "100%",
                    cursor: "pointer",

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textAlign: "left",

                    border: active ? "2px solid #0d99ff" : "1px solid #e4eaf2",

                    boxShadow: active
                      ? "0 10px 25px rgba(13,153,255,0.12)"
                      : "0 3px 10px rgba(0,0,0,0.03)",

                    transform: active ? "translateY(-3px)" : "translateY(0)",

                    transition: "0.25s ease",
                  }}
                >
                  {/* Check */}
                  {active && (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "#0d99ff",
                        color: "#fff",
                      }}
                    >
                      <Check2 size={16} />
                    </div>
                  )}

                  {/* ICON (TOP) */}
                  <div
                    className="d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "58px",
                      height: "58px",
                      borderRadius: "16px",

                      background: active
                        ? "linear-gradient(135deg, #0d99ff, #59d7c9)"
                        : "#f4f7fb",

                      color: active ? "#fff" : "#64748b",

                      transition: "0.3s ease",
                    }}
                  >
                    {card.icon}
                  </div>

                  {/* TEXT (BOTTOM LEFT) */}
                  <h5
                    className="fw-bold mb-2"
                    style={{ fontSize: "18px", color: "#0b1324" }}
                  >
                    {card.title}
                  </h5>

                  <p
                    className="mb-0"
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      lineHeight: "1.6",
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="btn w-100 d-flex align-items-center justify-content-center fw-bold"
          style={{
            height: "58px",
            borderRadius: "16px",
            border: "none",

            background: selected
              ? "linear-gradient(90deg, #0d99ff 0%, #38d6c4 100%)"
              : "#cfd8e3",

            color: "#fff",
            fontSize: "17px",

            transition: "0.3s ease",
          }}
        >
          Continue
          <ArrowRight className="ms-2" size={20} />
        </button>
      </div>
    </div>
  );
}
