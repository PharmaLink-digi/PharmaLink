import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../utils/api";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase.js";
import { useAuth } from "../../context/AuthContext.jsx";

// Account type → internal role key
const TYPE_TO_ROLE = {
  client:    "client",
  pharmacy:  "pharmacy",
  warehouse: "warehouse",
};

const SignInForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [accountType, setAccountType] = useState("client");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [identifier, setIdentifier] = useState(""); // email / pharm_name / warehouse_code
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const accountOptions = [
    { key: "client",    label: t("auth.patient",   "Client / Patient") },
    { key: "pharmacy",  label: t("auth.pharmacy",  "Pharmacy") },
    { key: "warehouse", label: t("auth.warehouse", "Warehouse") },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => {
      if (!document.querySelector(".signin-dropdown")?.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // Reset identifier when account type changes
  useEffect(() => {
    setIdentifier("");
    setErrorMsg("");
  }, [accountType]);

  const identifierConfig = {
    client:    { label: t("auth.email", "Email"),          placeholder: t("auth.emailPlaceholder", "you@example.com"), type: "email" },
    pharmacy:  { label: t("auth.pharmName", "Pharmacy Name"), placeholder: "e.g. Al-Nour Pharmacy",                    type: "text"  },
    warehouse: { label: t("auth.warehouseCode", "Warehouse Code"), placeholder: "e.g. WH-011 or Cairo Central",         type: "text"  },
  };

  const cfg = identifierConfig[accountType];

  // ── Client login — POST /login ────────────────────────────────────────────
  const loginAsClient = async () => {
    const response = await api.post("/login", { email: identifier.trim(), password });
    const user = response.data?.user || {};
    let role = "client";
    let userId = user.client_id;
    if (user.pharm_id)      { role = "pharmacy";  userId = user.pharm_id; }
    else if (user.warehouse_id) { role = "warehouse"; userId = user.warehouse_id; }
    else if (!userId)       { userId = user.id || response.data.userId; }
    if (!userId) throw new Error("Login failed — no user ID in response");
    return { userId, role };
  };

  // ── Pharmacy login — GET /pharm-info?pharm_name=eq.{name} ────────────────
  const loginAsPharmacy = async () => {
    const { data } = await api.get(
      `/pharm-info?pharm_name=${encodeURIComponent(identifier.trim())}`
    );
    const record = Array.isArray(data) ? data[0] : data;
    if (!record) throw new Error("Pharmacy not found. Check the name and try again.");

    // Password check on frontend (plain text stored in DB)
    if (record.password !== password) throw new Error("Incorrect password.");

    const userId = record.pharm_id;
    if (!userId) throw new Error("Pharmacy login failed — no ID returned.");
    return { userId, role: "pharmacy" };
  };

  // ── Warehouse login — GET /warehouses?warehouse_code=eq.{code} ───────────
  const loginAsWarehouse = async () => {
    const { data } = await api.get(
      `/warehouses?warehouse_code=${encodeURIComponent(identifier.trim())}`
    );
    const record = Array.isArray(data) ? data[0] : data;
    if (!record) throw new Error("Warehouse not found. Check the code and try again.");

    if (record.password !== password) throw new Error("Incorrect password.");

    const userId = record.warehouse_id;
    if (!userId) throw new Error("Warehouse login failed — no ID returned.");
    return { userId, role: "warehouse" };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    try {
      let result;
      if (accountType === "pharmacy")  result = await loginAsPharmacy();
      else if (accountType === "warehouse") result = await loginAsWarehouse();
      else result = await loginAsClient();

      login(result.userId, null, result.role);

      if (result.role === "pharmacy")  navigate("/pharmacy/dashboard");
      else if (result.role === "warehouse") navigate("/warehouse/dashboard");
      else navigate("/client/dashboard");

    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await api.post("/send-email", { name: user.displayName, email: user.email });
      alert("Login Success & Welcome Email Sent");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="signin-container min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="signin-card card border-0 rounded-4 shadow-lg bg-white">
              <div className="card-body p-4 p-md-5">

                {/* Header */}
                <div className="text-center mb-4">
                  <div className="d-flex justify-content-center mb-3">
                    <div className="signin-icon-circle rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-link-45deg text-white fs-1"></i>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-1 signin-title">{t("auth.welcomeBack", "Welcome Back")}</h2>
                  <p className="text-muted fs-6 mt-1">{t("auth.loginToContinue", "Login to continue")}</p>
                </div>

                {/* Error */}
                {errorMsg && (
                  <div className="alert alert-danger rounded-3 py-2 px-3 mb-3" style={{ fontSize: "14px" }}>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  {/* Account Type */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold d-block text-end mb-2">
                      {t("auth.accountType", "Account Type")}
                    </label>
                    <div className="signin-dropdown">
                      <div
                        className="signin-dropdown-trigger d-flex justify-content-between align-items-center"
                        onClick={() => setIsDropdownOpen((o) => !o)}
                      >
                        <span className="fw-medium text-dark">
                          {accountOptions.find((o) => o.key === accountType)?.label}
                        </span>
                        <i className={`bi bi-chevron-down ${isDropdownOpen ? "rotate-180" : ""}`}></i>
                      </div>
                      {isDropdownOpen && (
                        <div className="signin-dropdown-menu w-100 mt-2 border-0 rounded-3 shadow-sm overflow-hidden">
                          {accountOptions.map((opt) => (
                            <div
                              key={opt.key}
                              className={`signin-dropdown-item px-4 py-2 ${accountType === opt.key ? "active-option bg-primary text-white" : "bg-light text-dark"}`}
                              onClick={() => { setAccountType(opt.key); setIsDropdownOpen(false); }}
                            >
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Identifier (email / pharmacy name / warehouse code) */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold d-block text-end mb-2">
                      {cfg.label}
                    </label>
                    <div className="signin-input-wrapper">
                      <input
                        type={cfg.type}
                        className="signin-input"
                        placeholder={cfg.placeholder}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        autoComplete={accountType === "client" ? "email" : "username"}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold d-block text-end mb-2">
                      {t("auth.password", "Password")}
                    </label>
                    <div className="signin-input-wrapper">
                      <div className="signin-password-wrapper position-relative w-100">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="signin-input signin-password-input"
                          placeholder={t("auth.passwordPlaceholder", "Enter your password")}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          className="signin-eye-icon position-absolute bg-transparent border-0"
                          onClick={() => setShowPassword((s) => !s)}
                        >
                          <i className={showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="signin-btn btn w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 border-0 fw-bold fs-6"
                  >
                    {isLoading
                      ? <><span className="spinner-border spinner-border-sm" role="status" /> Logging in...</>
                      : <>{t("auth.loginBtn", "Login")} <i className="bi bi-box-arrow-in-left fs-5"></i></>}
                  </button>
                </form>

                {accountType === "client" && (
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="btn btn-light w-100 mt-3 py-3 rounded-3 border fw-bold fs-6"
                  >
                    Continue with Google
                  </button>
                )}

                {/* Footer */}
                <div className="text-center mt-4">
                  <span
                    className="signin-signup-link text-decoration-none small fw-medium"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/account-type")}
                  >
                    {t("auth.noAccount", "Don't have an account?")}{" "}
                    <span className="fw-bold">{t("auth.registerNow", "Register now")}</span>
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .signin-container {
          direction: rtl;
          background-color: #f4f7fc;
          font-family: 'Tajawal', sans-serif;
        }
        .signin-card {
          border-radius: 2rem !important;
          overflow: hidden;
          box-shadow: 0 20px 35px -10px rgba(0,0,0,0.08) !important;
        }
        .signin-icon-circle {
          width: 70px; height: 70px;
          background: linear-gradient(135deg, #0f6bff, #2bc0bc);
        }
        .signin-dropdown { position: relative; width: 100%; }
        .signin-dropdown-trigger {
          background: white; border: 1px solid #e2e8f0;
          border-radius: 0.85rem; padding: 0.75rem 1rem;
          cursor: pointer; transition: 0.2s; flex-direction: row-reverse;
        }
        .signin-dropdown-trigger:hover { border-color: #b9c8f0; }
        .rotate-180 { transform: rotate(180deg); }
        .signin-dropdown-menu {
          position: absolute; z-index: 1000;
          background: white; box-shadow: 0 12px 28px rgba(0,0,0,0.1);
        }
        .signin-dropdown-item { cursor: pointer; transition: 0.2s; }
        .signin-dropdown-item:hover { background: #e9ecef; }
        .signin-input-wrapper { width: 100%; border-radius: 1rem; transition: 0.2s; }
        .signin-input {
          width: 100%; border: 1px solid #e2e8f0;
          background: white; border-radius: 0.85rem;
          padding: 0.8rem 1rem; outline: none; text-align: right;
        }
        .signin-input:focus { border-color: #0f6bff; box-shadow: 0 0 0 3px rgba(15,107,255,0.1); }
        .signin-password-input { padding-left: 2.8rem; }
        .signin-eye-icon {
          left: 15px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; cursor: pointer; font-size: 1.3rem;
        }
        .signin-btn {
          background: linear-gradient(105deg, #0f6bff, #2bc0bc);
          color: white;
        }
        .signin-btn:hover { opacity: 0.9; color: white; }
        .signin-btn:disabled { opacity: 0.7; }
        .signin-signup-link { color: #2b6ef0; }
        .signin-input::placeholder { text-align: right; }
        @media (max-width: 576px) {
          .signin-card .card-body { padding: 1.75rem !important; }
        }
      `}</style>
    </div>
  );
};

export default SignInForm;
