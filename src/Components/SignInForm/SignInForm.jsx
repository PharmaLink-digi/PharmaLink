import React, { useState, useEffect } from "react";

const SignInForm = () => {
  const [accountType, setAccountType] = useState("مريض");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const accountOptions = [
    "مريض",
    "صيدلية",
    "مستودع",
    "شركة أدوية",
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

  const handleLogin = (e) => {
    e.preventDefault();

    alert(
      `مرحباً ${accountType}! يتم تسجيل الدخول...`
    );

    console.log({
      accountType,
      email,
      password,
    });
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
                    مرحباً بعودتك
                  </h2>

                  <p className="text-muted fs-6 mt-1">
                    سجل دخولك للمتابعة
                  </p>
                </div>

                {/* نوع الحساب */}
                <div className="mb-4">
                  <label className="form-label fw-semibold d-block text-end mb-2">
                    نوع الحساب
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
                    البريد الإلكتروني
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
                      placeholder="أدخل بريدك الإلكتروني"
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
                      كلمة المرور
                    </label>

                    <a
                      href="#"
                      className="signin-forgot-link text-decoration-none small"
                      onClick={(e) =>
                        e.preventDefault()
                      }
                    >
                      نسيت كلمة المرور؟
                    </a>
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
                        placeholder="أدخل كلمة المرور"
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
                  className="signin-btn btn w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 border-0 fw-bold fs-6"
                >
                  <span>
                    تسجيل الدخول
                  </span>

                  <i className="bi bi-box-arrow-in-left fs-5"></i>
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
                    ليس لديك حساب؟{" "}
                    <span className="fw-bold">
                      سجل الآن
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