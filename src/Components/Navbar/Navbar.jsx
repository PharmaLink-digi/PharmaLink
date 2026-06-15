import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaCapsules } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { cartCount } = useCart();
  const { isLoggedIn, role, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navHover = (e) => {
    e.currentTarget.style.color = "#0d6efd";
    e.currentTarget.style.background = "#eef4ff";
  };
  const navLeave = (e, active = false) => {
    e.currentTarget.style.color = active ? "#0d6efd" : "#4b5563";
    e.currentTarget.style.background = active ? "#eef4ff" : "transparent";
  };
  const buttonHover = (e) => {
    e.currentTarget.style.transform = "translateY(-1px)";
    e.currentTarget.style.opacity = "0.92";
  };
  const buttonLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.opacity = "1";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Role-specific nav links
  const roleLinks = {
    client: [
      { to: "/client/search", label: t("navbar.search") },
      { to: "/client/dashboard", label: t("navbar.myOrders") },
    ],
    pharmacy: [
      { to: "/pharmacy/dashboard", label: t("navbar.dashboard") },
      { to: "/pharmacy/inventory", label: t("navbar.inventory") },
      { to: "/pharmacy/exchange", label: t("navbar.exchange") },
    ],
    warehouse: [
      { to: "/warehouse/dashboard", label: t("navbar.dashboard") },
      { to: "/warehouse/inventory", label: t("navbar.inventory") },
    ],
  };

  const profilePath = role === "pharmacy"
    ? "/pharmacy/profile"
    : role === "warehouse"
    ? "/warehouse/profile"
    : "/client/profile";

  const links = isLoggedIn ? (roleLinks[role] || roleLinks.client) : [];

  const btnBase = {
    background: "transparent",
    color: "#4b5563",
    borderRadius: "14px",
    padding: "9px 18px",
    fontSize: "15px",
    transition: "0.3s ease",
  };

  return (
    <nav
      className="d-flex align-items-center justify-content-between px-3 px-md-5 mx-auto"
      style={{
        height: "74px",
        background: "#ffffff",
        borderBottom: "1px solid #f1f1f1",
        width: "100%",
        maxWidth: "1600px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Link to="/" className="text-decoration-none flex-shrink-0">
        <div className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
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

      {/* Desktop Links */}
      <div className="d-none d-md-flex align-items-center gap-2">
        <Link to="/" className="text-decoration-none">
          <button
            onMouseEnter={navHover}
            onMouseLeave={(e) => navLeave(e)}
            className="border-0 fw-semibold"
            style={btnBase}
          >
            {t("navbar.home")}
          </button>
        </Link>

        {!isLoggedIn && (
          <Link to="/search" className="text-decoration-none">
            <button
              onMouseEnter={navHover}
              onMouseLeave={navLeave}
              className="border-0 fw-semibold"
              style={btnBase}
            >
              {t("navbar.search")}
            </button>
          </Link>
        )}

        {links.map((link) => (
          <Link key={link.to} to={link.to} className="text-decoration-none">
            <button
              onMouseEnter={navHover}
              onMouseLeave={navLeave}
              className="border-0 fw-semibold"
              style={btnBase}
            >
              {link.label}
            </button>
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="d-flex align-items-center gap-2">
        {/* Cart — client only */}
        {isLoggedIn && role === "client" && (
          <Link to="/client/cart" className="text-decoration-none position-relative">
            <button
              onMouseEnter={buttonHover}
              onMouseLeave={buttonLeave}
              className="border"
              style={{ width: "42px", height: "38px", borderRadius: "13px", background: "#fff", borderColor: "#dbe2ea", color: "#4b5563", fontSize: "16px", transition: "0.3s ease" }}
            >
              🛒
            </button>
            {cartCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "10px", zIndex: 1 }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {/* Language toggle */}
        <button
          onClick={() => i18n.changeLanguage(i18n.language?.startsWith("en") ? "ar" : "en")}
          onMouseEnter={buttonHover}
          onMouseLeave={buttonLeave}
          className="border"
          style={{ width: "42px", height: "38px", borderRadius: "13px", background: "#fff", borderColor: "#dbe2ea", color: "#4b5563", fontSize: "14px", transition: "0.3s ease" }}
        >
          {i18n.language?.startsWith("en") ? "ع" : "EN"}
        </button>

        {isLoggedIn ? (
          <div className="d-flex align-items-center gap-2">
            <Link to={profilePath}>
              <button
                onMouseEnter={buttonHover}
                onMouseLeave={buttonLeave}
                className="border fw-semibold d-none d-md-block"
                style={{ height: "38px", padding: "0 16px", borderRadius: "13px", background: "#fff", borderColor: "#dbe2ea", color: "#374151", fontSize: "15px", transition: "0.3s ease" }}
              >
                👤 {t("navbar.profile")}
              </button>
            </Link>
            <button
              onClick={handleLogout}
              onMouseEnter={buttonHover}
              onMouseLeave={buttonLeave}
              className="border-0 fw-semibold"
              style={{ height: "38px", padding: "0 18px", borderRadius: "13px", background: "#fee2e2", color: "#dc2626", fontSize: "15px", transition: "0.3s ease" }}
            >
              {t("navbar.logout")}
            </button>
          </div>
        ) : (
          <div className="d-flex align-items-center gap-2">
            <Link to="/signin">
              <button
                onMouseEnter={buttonHover}
                onMouseLeave={buttonLeave}
                className="border fw-semibold"
                style={{ height: "38px", padding: "0 20px", borderRadius: "13px", background: "#fff", borderColor: "#dbe2ea", color: "#374151", fontSize: "15px", transition: "0.3s ease" }}
              >
                {t("navbar.login")}
              </button>
            </Link>
            <Link to="/signup">
              <button
                onMouseEnter={buttonHover}
                onMouseLeave={buttonLeave}
                className="border-0 text-white fw-semibold"
                style={{ height: "38px", padding: "0 24px", borderRadius: "13px", background: "linear-gradient(90deg, #0d6efd 0%, #10c8a0 100%)", fontSize: "15px", transition: "0.3s ease" }}
              >
                {t("navbar.signup")}
              </button>
            </Link>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          className="border-0 bg-transparent d-md-none ms-1"
          style={{ fontSize: "22px", color: "#374151" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="position-absolute top-100 start-0 w-100 bg-white border-bottom shadow-sm py-3 px-4"
          style={{ zIndex: 999 }}
          onClick={() => setMenuOpen(false)}
        >
          <Link to="/" className="d-block text-decoration-none py-2 text-dark fw-semibold">{t("navbar.home")}</Link>
          {!isLoggedIn && (
            <Link to="/search" className="d-block text-decoration-none py-2 text-dark fw-semibold">{t("navbar.search")}</Link>
          )}
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="d-block text-decoration-none py-2 text-dark fw-semibold">{link.label}</Link>
          ))}
          {isLoggedIn && (
            <Link to={profilePath} className="d-block text-decoration-none py-2 text-dark fw-semibold">👤 {t("navbar.profile")}</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
