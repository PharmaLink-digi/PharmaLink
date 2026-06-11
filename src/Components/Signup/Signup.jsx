import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Check } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../firebase.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  async function signInWithGoogle() {

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
}

  // ================= Yup Validation =================
  const validationSchema = Yup.object({
    client_name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
      .required("Full name is required"),

    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number")
      .required("Phone number is required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
  });

  // ================= Formik =================
  const formik = useFormik({
    initialValues: {
      client_name: "",
      email: "",
      phone: "",
      password: "",
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {

      try {

        const payload = {
          client_name: values.client_name.trim(),
          email: values.email.trim().toLowerCase(),
          phone: values.phone.trim(),
          password: values.password,
        };

        // fallback: https://pharmalink-back-end.onrender.com
        let response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/clients`,
          payload
        );

        const userData = Array.isArray(response.data) ? response.data[0] : response.data;
        const userId = userData?.client_id || userData?.id || userData?.pharm_id || userData?.warehouse_id;
        if (userId) login(userId, userData?.token);

        console.log(response.data);

        alert("Account Created Successfully");

        resetForm();
        navigate('/');

      } catch (error) {

        console.log(error);
        const errorMessage = error.response?.data?.message || "Something went wrong";
        alert(errorMessage);

      }

    },
  });

  return (
    <>
    
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <div style={{ width: "650px", maxWidth: "95%" }}>

        {/* Progress Steps */}
        <div className="d-flex justify-content-center align-items-center mb-5">

          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "28px",
              height: "28px",
              background: "#0ea5e9",
              color: "white",
            }}
          >
            <Check size={16} />
          </div>

          <div
            style={{
              width: "70px",
              height: "3px",
              background: "#0ea5e9",
            }}
          ></div>

          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "28px",
              height: "28px",
              background: "#0ea5e9",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            2
          </div>

          <div
            style={{
              width: "70px",
              height: "3px",
              background: "#dbe3ee",
            }}
          ></div>

          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "28px",
              height: "28px",
              background: "#e5e7eb",
              color: "#6b7280",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            3
          </div>

        </div>

        {/* Form Card */}
        <div
          className="bg-white p-4"
          style={{
            borderRadius: "18px",
            boxShadow: "0px 5px 20px rgba(0,0,0,0.08)",
          }}
        >

          {/* Header */}
          <div className="d-flex flex-column align-items-start mb-4">

            <button
              className="btn btn-link p-0 text-decoration-none mb-2"
              style={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              ← Back
            </button>

            <h4
              className="fw-bold m-0"
              style={{
                textAlign: "left",
                width: "100%",
              }}
            >
              Complete your profile
            </h4>

          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>

            <div className="row">

              {/* Full Name */}
              <div className="col-md-6 mb-3 text-start">

                <label className="form-label fw-semibold small">
                  Full Name
                </label>

                <input
                  type="text"
                  name="client_name"
                  placeholder="Name"
                  className={`form-control ${
                    formik.touched.client_name &&
                    formik.errors.client_name
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values.client_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <div className="invalid-feedback">
                  {formik.errors.client_name}
                </div>

              </div>

              {/* Email */}
              <div className="col-md-6 mb-3 text-start">

                <label className="form-label fw-semibold small">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className={`form-control ${
                    formik.touched.email &&
                    formik.errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <div className="invalid-feedback">
                  {formik.errors.email}
                </div>

              </div>

              {/* Phone */}
              <div className="col-md-6 mb-3 text-start">

                <label className="form-label fw-semibold small">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="01012345678"
                  className={`form-control ${
                    formik.touched.phone &&
                    formik.errors.phone
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <div className="invalid-feedback">
                  {formik.errors.phone}
                </div>

              </div>



              {/* Password */}
              <div className="col-12 mb-4 text-start">

                <label className="form-label fw-semibold small">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Strong password"
                  className={`form-control ${
                    formik.touched.password &&
                    formik.errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <div className="invalid-feedback">
                  {formik.errors.password}
                </div>

              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100 text-white fw-bold"
              style={{
                background:
                  "linear-gradient(to right, #2563eb, #14b8a6)",
                border: "none",
                padding: "12px",
                borderRadius: "12px",
              }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            <button
  type="button"
  onClick={signInWithGoogle}
  className="btn btn-light w-100 mt-3 border"
>
  Continue with Google
</button>

            {/* Footer */}
            <p
              className="text-center mt-3 mb-0"
              style={{
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              Already have an account?{" "}
              <span
                style={{
                  color: "#2563eb",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Sign in
              </span>
            </p>

          </form>

        </div>
      </div>
    </div>
    



    
    
    </>
  );
};

export default Signup;
