import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const turquoiseStyle = {
    backgroundColor: "#9b0044", // Professional Turquoise
    color: "white",
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg border-0 overflow-hidden"
        style={{ maxWidth: "900px", borderRadius: "20px" }}
      >
        <div className="row g-0">
          {/* Left Side: Branding */}
          <div
            className="col-md-5 d-flex flex-column justify-content-between p-5"
            style={turquoiseStyle}
          >
            <div>
              <h2 className="fw-bold mb-0">PharmaLink</h2>
              <p className="small opacity-75">Institutional Portal</p>
            </div>

            <div className="border-start border-4 ps-3">
              <p className="fst-italic fs-5">
                "Connecting the supply chain with precision and trust."
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="col-md-7 p-5 bg-white">
            <h3 className="fw-bold mb-3">Create Account</h3>
            <p className="text-muted mb-4 small">
              Please fill in your details to join the portal.
            </p>

            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control rounded-pill"
                    placeholder="John"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control rounded-pill"
                    placeholder="Doe"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control rounded-pill"
                  placeholder="name@company.com"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control rounded-pill"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">
                    Account Type
                  </label>
                  <select
                    name="accountType"
                    className="form-select rounded-pill"
                    onChange={handleChange}
                  >
                    <option value="">Select type</option>
                    <option value="patient">Patient</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="pharma_co">Pharma Co.</option>
                  </select>
                </div>
                <div className="col-md-6 mb-4">
                  <label className="form-label small fw-bold">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control rounded-pill"
                    placeholder="City, Country"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn w-100 rounded-pill fw-bold py-2 shadow-sm text-white"
                style={{ backgroundColor: "#9b0044" }}
              >
                Register
              </button>

              <div className="text-center mt-4">
                <span className="small text-muted">
                  Already have an account?{" "}
                </span>
                <a
                  href="#"
                  className="small fw-bold text-decoration-none"
                  style={{ color: "#9b0044" }}
                >
                  Sign In here
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
