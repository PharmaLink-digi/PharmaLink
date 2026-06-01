import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaCapsules } from "react-icons/fa";

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const navHover = (e) => {
    e.target.style.color = "#0d6efd";
    e.target.style.background = "#eef4ff";
  };

  const navLeave = (e, active = false) => {
    e.target.style.color = active ? "#0d6efd" : "#4b5563";
    e.target.style.background = active ? "#eef4ff" : "transparent";
  };

  const buttonHover = (e) => {
    e.target.style.transform = "translateY(-1px)";
    e.target.style.opacity = "0.92";
  };

  const buttonLeave = (e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.opacity = "1";
  };

  return (
    <nav
      className="d-flex align-items-center justify-content-between px-5 mx-auto"
      style={{
        height: "74px",
        background: "#ffffff",
        borderBottom: "1px solid #f1f1f1",
        width: "100%",
        maxWidth: "1600px",
      }}
    >
      {/* Logo */}
      <Link to="/" className="text-decoration-none">
        <div
          className="d-flex align-items-center gap-2"
          style={{ cursor: "pointer" }}
        >
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0d6efd 0%, #10c8a0 100%)",
              color: "#fff",
              fontSize: "18px",
            }}
          >
            <FaCapsules />
          </div>

          <span
            className="fw-bold"
            style={{
              fontSize: "18px",
              background: "linear-gradient(to right, #0066FF, #00C6A9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PharmaLink
          </span>
        </div>
      </Link>

      {/* Links */}
      <div className="d-flex align-items-center gap-2">
        <Link to="/" className="text-decoration-none">
          <button
            onMouseEnter={navHover}
            onMouseLeave={(e) => navLeave(e, true)}
            className="border-0 fw-semibold"
            style={{
              background: "#eef4ff",
              color: "#0d6efd",
              borderRadius: "14px",
              padding: "9px 18px",
              fontSize: "15px",
              transition: "0.3s ease",
            }}
          >
            {t("navbar.home")}
          </button>
        </Link>

        <Link to="/search" className="text-decoration-none">
          {["search", "dashboard", "orders", "notifications"].map((key) => (
            <button
              key={key}
              onMouseEnter={navHover}
              onMouseLeave={navLeave}
              className="border-0 fw-semibold"
              style={{
                background: "transparent",
                color: "#4b5563",
                borderRadius: "14px",
                padding: "9px 18px",
                fontSize: "15px",
                transition: "0.3s ease",
              }}
            >
              {t(`navbar.${key}`)}
            </button>
          ))}
        </Link>
      </div>

      {/* Actions */}
      <div className="d-flex align-items-center gap-2">
        {/* Language toggle (logic from second) */}
        <button
          onClick={() =>
            i18n.changeLanguage(
              i18n.language?.startsWith("en") ? "ar" : "en"
            )
          }
          onMouseEnter={buttonHover}
          onMouseLeave={buttonLeave}
          className="border"
          style={{
            width: "42px",
            height: "38px",
            borderRadius: "13px",
            background: "#fff",
            borderColor: "#dbe2ea",
            color: "#4b5563",
            fontSize: "14px",
            transition: "0.3s ease",
          }}
        >
          {i18n.language?.startsWith("en") ? "ع" : "EN"}
        </button>

        <Link to="/signin">
          <button
            onMouseEnter={buttonHover}
            onMouseLeave={buttonLeave}
            className="border fw-semibold"
            style={{
              height: "38px",
              padding: "0 20px",
              borderRadius: "13px",
              background: "#fff",
              borderColor: "#dbe2ea",
              color: "#374151",
              fontSize: "15px",
              transition: "0.3s ease",
            }}
          >
            {t("navbar.login")}
          </button>
        </Link>

        <Link to="/signup">
          <button
            onMouseEnter={buttonHover}
            onMouseLeave={buttonLeave}
            className="border-0 text-white fw-semibold"
            style={{
              height: "38px",
              padding: "0 24px",
              borderRadius: "13px",
              background:
                "linear-gradient(90deg, #0d6efd 0%, #10c8a0 100%)",
              fontSize: "15px",
              transition: "0.3s ease",
            }}
          >
            {t("navbar.signup")}
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;