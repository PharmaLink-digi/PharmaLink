import React, { useState } from "react";

const Footer = () => {
  const [activeLang, setActiveLang] = useState("EN");

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-header">
              <svg
                width="34"
                height="34"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="6"
                  y="4"
                  width="20"
                  height="24"
                  rx="10"
                  stroke="#4FD1C5"
                  strokeWidth="2.5"
                  fill="none"
                />
                <line
                  x1="6"
                  y1="16"
                  x2="26"
                  y2="16"
                  stroke="#4FD1C5"
                  strokeWidth="2"
                />
                <rect
                  x="8"
                  y="6"
                  width="16"
                  height="9"
                  rx="7"
                  fill="#4FD1C5"
                  opacity="0.25"
                />
              </svg>
              <span className="brand-title">PharmaLink</span>
            </div>
            <p className="brand-copy">
              The integrated healthcare platform connecting patients, pharmacies,
              and pharmaceutical companies.
            </p>
          </div>

          <div className="footer-column">
            <h6>Product</h6>
            <ul className="footer-links">
              <li>
                <a href="#search">Search Medicines</a>
              </li>
              <li>
                <a href="#register">Register</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h6>Company</h6>
            <ul className="footer-links">
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#privacy">Privacy</a>
              </li>
            </ul>
          </div>

          <div className="footer-column footer-language">
            <h6>Language</h6>
            <div className="language-buttons">
              <button
                type="button"
                className={`lang-button ${activeLang === "EN" ? "active" : ""}`}
                onClick={() => setActiveLang("EN")}
              >
                EN
              </button>
              <button
                type="button"
                className={`lang-button ${activeLang === "AR" ? "active" : ""}`}
                onClick={() => setActiveLang("AR")}
              >
                عربي
              </button>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>© 2026 PharmaLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
