import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase.js";

const SignInForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState(t('auth.patient'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const accountOptions = [
    t('auth.patient'),
    t('auth.pharmacy'),
    t('auth.warehouse'),
    t('auth.company'),
  ];

  // قفل الـ dropdown لما تدوس برا
  useEffect(() => {
    const closeDropdown = (e) => {
      const dropdown =
        document.querySelector(".signin-dropdown");

      if (
        dropdown &&
        !dropdown.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener(
      "click",
      closeDropdown
    );

    return () => {
      document.removeEventListener(
        "click",
        closeDropdown
      );
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // fallback: https://pharmalink-back-end.onrender.com
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        email,
        password
      });
      const user = response.data.user || {};
      const userId = user.client_id || user.id || user.pharm_id || user.warehouse_id || response.data.userId;
      if (userId) localStorage.setItem("userId", userId);
      if (response.data.token) localStorage.setItem("token", response.data.token);

      alert(t('auth.loginAlert', { type: accountType }) + " - Success");
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      // send data to backend
      // fallback: https://pharmalink-back-end.onrender.com
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/send-email`, {
        name: user.displayName,
        email: user.email,
      });
      alert("Login Success & Welcome Email Sent");
    } catch (error) {
      console.log(error);
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

                  <h2 className="fw-bold mb-1 signin-title">
                    {t('auth.welcomeBack')}
                  </h2>

                  <p className="text-muted fs-6 mt-1">
                    {t('auth.loginToContinue')}
                  </p>
                </div>

                {/* نوع الحساب */}
                <div className="mb-4">
                  <label className="form-label fw-semibold d-block text-end mb-2">
                    {t('auth.accountType')}
                  </label>

                  <div className="signin-dropdown">
                    <div
                      className="signin-dropdown-trigger d-flex justify-content-between align-items-center"
                      onClick={() =>
                        setIsDropdownOpen(
                          !isDropdownOpen
                        )
                      }
                    >
                      <span className="fw-medium text-dark">
                        {accountType}
                      </span>

                      <i
                        className={`bi bi-chevron-down ${
                          isDropdownOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      ></i>
                    </div>

                    {isDropdownOpen && (
                      <div className="signin-dropdown-menu w-100 mt-2 border-0 rounded-3 shadow-sm overflow-hidden">
                        {accountOptions.map(
                          (item, index) => (
                            <div
                              key={index}
                              className={`signin-dropdown-item px-4 py-2 ${
                                accountType ===
                                item
                                  ? "active-option bg-primary text-white"
                                  : "bg-light text-dark"
                              }`}
                              onClick={() => {
                                setAccountType(
                                  item
                                );
                                setIsDropdownOpen(
                                  false
                                );
                              }}
                            >
                              {item}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="form-label fw-semibold d-block text-end mb-2">
                    {t('auth.email')}
                  </label>

                  <div
                    className={`signin-input-wrapper ${
                      emailFocused
                        ? "signin-focused"
                        : ""
                    }`}
                  >
                    <input
                      type="email"
                      className="signin-input"
                      placeholder={t('auth.emailPlaceholder')}
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      onFocus={() =>
                        setEmailFocused(
                          true
                        )
                      }
                      onBlur={() =>
                        setEmailFocused(
                          false
                        )
                      }
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-semibold m-0">
                      {t('auth.password')}
                    </label>

                    <Link
                      to="/forgot-password"
                      className="signin-forgot-link text-decoration-none small"
                    >
                      {t('auth.forgotPassword')}
                    </Link>
                  </div>

                  <div
                    className={`signin-input-wrapper ${
                      passwordFocused
                        ? "signin-focused"
                        : ""
                    }`}
                  >
                    <div className="signin-password-wrapper position-relative w-100">
                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        className="signin-input signin-password-input"
                        placeholder={t('auth.passwordPlaceholder')}
                        value={password}
                        onChange={(e) =>
                          setPassword(
                            e.target.value
                          )
                        }
                        onFocus={() =>
                          setPasswordFocused(
                            true
                          )
                        }
                        onBlur={() =>
                          setPasswordFocused(
                            false
                          )
                        }
                      />

                      <button
                        type="button"
                        className="signin-eye-icon position-absolute bg-transparent border-0"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                      >
                        <i
                          className={
                            showPassword
                              ? "bi bi-eye-slash-fill"
                              : "bi bi-eye-fill"
                          }
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Login */}
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="signin-btn btn w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 border-0 fw-bold fs-6"
                >
                  <span>
                    {isLoading ? "Logging in..." : t('auth.loginBtn')}
                  </span>

                  <i className="bi bi-box-arrow-in-left fs-5"></i>
                </button>

                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="btn btn-light w-100 mt-3 py-3 rounded-3 border fw-bold fs-6"
                >
                  Continue with Google
                </button>

                {/* Footer */}
                <div className="text-center mt-4">
                  <a
                    href="#"
                    className="signin-signup-link text-decoration-none small fw-medium"
                    onClick={(e) =>
                      e.preventDefault()
                    }
                  >
                    {t('auth.noAccount')}{" "}
                    <span className="fw-bold">
                      {t('auth.registerNow')}
                    </span>
                  </a>
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
          width: 70px;
          height: 70px;
          background: linear-gradient(
            135deg,
            #0f6bff,
            #2bc0bc
          );
        }

        .signin-dropdown {
          position: relative;
          width: 100%;
        }

        .signin-dropdown-trigger {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.85rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: 0.2s;
          flex-direction: row-reverse;
        }

        .signin-dropdown-trigger:hover {
          border-color: #b9c8f0;
        }

        .rotate-180 {
          transform: rotate(180deg);
        }

        .signin-dropdown-menu {
          position: absolute;
          z-index: 1000;
          background: white;
          box-shadow: 0 12px 28px rgba(0,0,0,0.1);
        }

        .signin-dropdown-item {
          cursor: pointer;
          transition: 0.2s;
        }

        .signin-dropdown-item:hover {
          background: #e9ecef;
        }

        .signin-input-wrapper {
          width: 100%;
          border-radius: 1rem;
          transition: 0.2s;
        }

        .signin-focused {
          background: linear-gradient(
            105deg,
            #0f6bff,
            #2bc0bc
          );
          padding: 2px;
        }

        .signin-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 0.85rem;
          padding: 0.8rem 1rem;
          outline: none;
          text-align: right;
        }

        .signin-focused .signin-input {
          border: 1px solid transparent;
        }

        .signin-password-input {
          padding-left: 2.8rem;
        }

        .signin-eye-icon {
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          cursor: pointer;
          font-size: 1.3rem;
        }

        .signin-forgot-link {
          color: #2b6ef0;
        }

        .signin-btn {
          background: linear-gradient(
            105deg,
            #0f6bff,
            #2bc0bc
          );
          color: white;
        }

        .signin-btn:hover {
          opacity: 0.9;
          color: white;
        }

        .signin-signup-link {
          color: #2b6ef0;
        }

        .signin-input::placeholder {
          text-align: right;
        }

        @media (max-width: 576px) {
          .signin-card .card-body {
            padding: 1.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SignInForm;