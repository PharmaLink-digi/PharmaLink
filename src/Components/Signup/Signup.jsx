import React, { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

const API = import.meta.env.VITE_API_BASE_URL;

// ── Role configuration ─────────────────────────────────────────────────────
// endpoint, payload builder, and ID extractor per role.
// Field names match backend expectations exactly.
const ROLE_CONFIG = {
  client: {
    endpoint: `${API}/clients`,
    buildPayload: (v) => ({
      client_name: v.client_name.trim(),
      email:       v.email.trim().toLowerCase(),
      phone:       v.phone.trim(),
      password:    v.password,
    }),
    getId: (data) => data?.client_id ?? data?.id,
  },
  pharmacy: {
    endpoint: `${API}/pharm-info`,
    buildPayload: (v) => ({
      pharm_name: v.pharm_name.trim(),
      phone:      v.phone.trim(),
      address:    v.address.trim(),
      area:       v.area.trim(),   // DB column is "area", not "region"
      password:   v.password,
    }),
    getId: (data) => data?.pharm_id ?? data?.id,
  },
  warehouse: {
    endpoint: `${API}/warehouses`,
    buildPayload: (v) => ({
      warehouse_code: v.warehouse_code.trim(), // DB column is "warehouse_code", not "warehouse_name"
      phone:          v.phone.trim(),
      address:        v.address.trim(),
      area:           v.area.trim(),           // DB column is "area", not "region"
      password:       v.password,
    }),
    getId: (data) => data?.warehouse_id ?? data?.id,
  },
};

// ── Validation schemas ─────────────────────────────────────────────────────
const PHONE_REGEX = /^01[0125][0-9]{8}$/;
const PASS_BASE = Yup.string()
  .min(8, "Minimum 8 characters")
  .matches(/[a-z]/, "Must include a lowercase letter")
  .matches(/[A-Z]/, "Must include an uppercase letter")
  .matches(/[0-9]/, "Must include a number")
  .required("Password is required");

const SCHEMAS = {
  client: Yup.object({
    client_name: Yup.string().min(3).max(50).required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().matches(PHONE_REGEX, "Invalid Egyptian phone number").required("Phone is required"),
    password: PASS_BASE,
  }),
  pharmacy: Yup.object({
    pharm_name: Yup.string().min(2).max(100).required("Pharmacy name is required"),
    phone:      Yup.string().matches(PHONE_REGEX, "Invalid Egyptian phone number").required("Phone is required"),
    address:    Yup.string().min(5).required("Address is required"),
    area:       Yup.string().min(2).required("Area is required"),
    password:   PASS_BASE,
  }),
  warehouse: Yup.object({
    warehouse_code: Yup.string().min(2).max(100).required("Warehouse name / code is required"),
    phone:          Yup.string().matches(PHONE_REGEX, "Invalid Egyptian phone number").required("Phone is required"),
    address:        Yup.string().min(5).required("Address is required"),
    area:           Yup.string().min(2).required("Area is required"),
    password:       PASS_BASE,
  }),
};

const INITIAL_VALUES = {
  client:   { client_name: "", email: "", phone: "", password: "" },
  pharmacy: { pharm_name: "", phone: "", address: "", area: "", password: "" },
  warehouse:{ warehouse_code: "", phone: "", address: "", area: "", password: "" },
};

// ── Role metadata ──────────────────────────────────────────────────────────
const ROLE_META = {
  client: { label: "Client", dashboard: "/client/dashboard" },
  pharmacy: { label: "Pharmacy", dashboard: "/pharmacy/dashboard" },
  warehouse: { label: "Warehouse", dashboard: "/warehouse/dashboard" },
};

// ── Main component ─────────────────────────────────────────────────────────
export default function Signup() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { signupRole, setSignupRole, login } = useAuth();

  // Guard: must have arrived through AccountType and role must match URL
  if (!role || !ROLE_CONFIG[role]) return <Navigate to="/account-type" replace />;
  if (!signupRole || signupRole !== role) return <Navigate to="/account-type" replace />;

  const config = ROLE_CONFIG[role];
  const meta = ROLE_META[role];

  return (
    <SignupForm
      key={role}
      role={role}
      meta={meta}
      config={config}
      onBack={() => navigate("/account-type")}
      onSuccess={(userId) => {
        login(userId, null, role);
        // signupRole is cleared in AccountCreated's useEffect.
        // Clearing it HERE causes a re-render where signupRole=null,
        // which triggers the guard and redirects to /account-type
        // before navigate("/account-created") can take effect.
        navigate("/account-created");
      }}
    />
  );
}

// ── Field helper — defined at module level so its identity is stable ───────
function Field({ formik, name, label, placeholder, type = "text" }) {
  return (
    <div className="su-field">
      <label className="su-label">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete="off"
        className={`su-input${formik.touched[name] && formik.errors[name] ? " su-input--error" : ""}`}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched[name] && formik.errors[name] && (
        <span className="su-error-msg">{formik.errors[name]}</span>
      )}
    </div>
  );
}

// ── Form component ─────────────────────────────────────────────────────────
function SignupForm({ role, meta, config, onBack, onSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: INITIAL_VALUES[role],
    validationSchema: SCHEMAS[role],
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const payload = config.buildPayload(values);
        const response = await axios.post(config.endpoint, payload);

        // Supabase inserts return an array of the inserted rows.
        // Custom Express backends may return a plain object.
        const record = Array.isArray(response.data) ? response.data[0] : response.data;

        // Extract the DB primary key for this role.
        // config.getId tries the role-specific field (pharm_id, client_id, warehouse_id).
        // Fallback to generic 'id' in case the backend wraps it differently.
        const userId = config.getId(record) ?? record?.id;

        if (!userId) {
          // The row was inserted but the response didn't include the primary key.
          // This is a backend response shape issue — show a clear message.
          setStatus({
            error: 'Account created! Please sign in to access your account.',
            isInfo: true,
          });
          setTimeout(() => navigate('/signin'), 2500);
          return;
        }

        // No token — this app uses userId + role only.
        onSuccess(userId);
      } catch (err) {
        const msg = err.response?.data?.message || "Something went wrong. Please try again.";
        setStatus({ error: msg });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="su-page">
      <div className="su-wrap">

        {/* Stepper */}
        <Stepper active={2} />

        {/* Card */}
        <div className="su-card">

          {/* Back + heading */}
          <button type="button" className="su-back" onClick={onBack}>
            ← Back
          </button>
          <h2 className="su-heading">Create your {meta.label} account</h2>
          <p className="su-sub-heading">Fill in the details below to get started</p>

          {/* Server feedback */}
          {formik.status?.error && (
            <div className={formik.status.isInfo ? 'su-alert su-alert--info' : 'su-alert'}>
              {formik.status.error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} noValidate>

            {/* ── Client fields ── */}
            {role === "client" && (
              <>
                <Field formik={formik} name="client_name" label="Full Name" placeholder="Ahmed Mohamed" />
                <Field formik={formik} name="email" label="Email Address" placeholder="you@example.com" type="email" />
                <Field formik={formik} name="phone" label="Phone Number" placeholder="01012345678" />
              </>
            )}

            {/* ── Pharmacy fields ── */}
            {role === "pharmacy" && (
              <>
                <Field formik={formik} name="pharm_name" label="Pharmacy Name" placeholder="Al-Shifa Pharmacy" />
                <Field formik={formik} name="phone" label="Phone Number" placeholder="01012345678" />
                <Field formik={formik} name="address" label="Address" placeholder="123 Tahrir St, Cairo" />
                <Field formik={formik} name="area" label="Area" placeholder="e.g. Cairo, Giza" />
              </>
            )}

            {/* ── Warehouse fields ── */}
            {role === "warehouse" && (
              <>
                <Field formik={formik} name="warehouse_code" label="Warehouse Name / Code" placeholder="e.g. WH-011 or Cairo Central" />
                <Field formik={formik} name="phone" label="Phone Number" placeholder="01012345678" />
                <Field formik={formik} name="address" label="Address" placeholder="Industrial Zone, 6th of October" />
                <Field formik={formik} name="area" label="Area" placeholder="e.g. 6th of October, Cairo" />
              </>
            )}

            {/* Password — shared, shown last */}
            <div className="su-field">
              <label className="su-label">Password</label>
              <div className="su-password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 chars, upper + lower + number"
                  autoComplete="new-password"
                  className={`su-input su-input--pw${formik.touched.password && formik.errors.password ? " su-input--error" : ""}`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="su-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <span className="su-error-msg">{formik.errors.password}</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="su-btn"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          {/* Footer */}
          <p className="su-footer-text">
            Already have an account?{" "}
            <span className="su-link" onClick={() => navigate("/signin")}>
              Sign in
            </span>
          </p>

        </div>
      </div>

      <style>{`
        .su-page {
          min-height: 100vh;
          background: #f5f7fb;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 40px 16px;
        }
        .su-wrap {
          width: 100%;
          max-width: 520px;
        }
        .su-card {
          background: #fff;
          border-radius: 22px;
          padding: 36px 32px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
        }
        @media (max-width: 480px) {
          .su-card { padding: 28px 20px; }
        }
        .su-back {
          background: none;
          border: none;
          padding: 0;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
          margin-bottom: 18px;
          display: block;
        }
        .su-back:hover { color: #0d6efd; }
        .su-heading {
          font-size: 22px;
          font-weight: 700;
          color: #0b1324;
          margin: 0 0 6px 0;
        }
        .su-sub-heading {
          font-size: 13px;
          color: #94a3b8;
          margin: 0 0 24px 0;
        }
        .su-alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          margin-bottom: 18px;
        }
        .su-alert--info {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #1d4ed8;
        }
        .su-field {
          margin-bottom: 16px;
        }
        .su-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .su-input {
          width: 100%;
          height: 48px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 0 14px;
          font-size: 14px;
          color: #0b1324;
          background: #fff;
          outline: none;
          transition: border-color 0.18s;
          box-sizing: border-box;
        }
        .su-input:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 3px rgba(13,110,253,0.08);
        }
        .su-input--error {
          border-color: #f87171 !important;
        }
        .su-error-msg {
          display: block;
          font-size: 12px;
          color: #dc2626;
          margin-top: 4px;
        }
        .su-password-wrap {
          position: relative;
        }
        .su-input--pw {
          padding-right: 44px;
        }
        .su-eye {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 16px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .su-eye:hover { color: #0d6efd; }
        .su-btn {
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(90deg, #0d6efd 0%, #10c8a0 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s, transform 0.15s;
        }
        .su-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none !important;
        }
        .su-btn:not(:disabled):hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .su-footer-text {
          text-align: center;
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
        }
        .su-link {
          color: #0d6efd;
          font-weight: 600;
          cursor: pointer;
        }
        .su-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

// ── Shared Stepper ─────────────────────────────────────────────────────────
function Stepper({ active }) {
  const steps = [1, 2, 3];
  return (
    <div className="d-flex justify-content: center align-items-center mb-4" style={{ justifyContent: "center" }}>
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
            {s < active ? "✓" : s}
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 56,
              height: 2,
              background: s < active ? "linear-gradient(90deg,#0d6efd,#10c8a0)" : "#dbe2ea",
              flexShrink: 0,
            }} />
          )}
        </div>
      ))}
    </div>
  );
}
