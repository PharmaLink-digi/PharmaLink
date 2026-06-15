import React, { useState } from "react";
import { ArrowLeft, CheckCircleFill, CreditCard, Cash, ShieldCheck, FileEarmarkMedical } from "react-bootstrap-icons";

const ConfirmOrder = ({ cartItems, orderDetails, setOrderDetails, onNavigateBack, onOrderPlaced, onPlaceOrder }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [paymobIframeUrl, setPaymobIframeUrl] = useState(null);

  const formatPrice = (price) => {
    return `${price.toFixed(0)} EGP`;
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price_sell * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 50 : 0; // matching confirm order mockup screenshot (50 EGP)
  const total = subtotal + deliveryFee;

  const handleInputChange = (field, val) => {
    setOrderDetails((prev) => ({
      ...prev,
      [field]: val
    }));
    
    // Clear error
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleVisaChange = (field, val) => {
    setOrderDetails((prev) => ({
      ...prev,
      visaDetails: {
        ...prev.visaDetails,
        [field]: val
      }
    }));

    if (formErrors[`visa_${field}`]) {
      setFormErrors((prev) => ({ ...prev, [`visa_${field}`]: null }));
    }
  };

  // Helper formatting for visa card
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const validateForm = () => {
    const errors = {};
    if (!orderDetails.address.trim()) errors.address = "Delivery address is required";
    if (!orderDetails.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(orderDetails.phone.trim())) {
      errors.phone = "Please enter a valid phone number (10-15 digits)";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await onPlaceOrder({
        ...orderDetails,
        total,
        prescription: prescriptionFile,
      });

      if (result?.paymobIframeUrl) {
        setPaymobIframeUrl(result.paymobIframeUrl);
      } else {
        setShowSuccess(true);
      }
    } catch (err) {
      alert("فشل في تقديم الطلب: " + (err.message || "حاول مرة أخرى"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4 text-start" style={{ maxWidth: "700px" }}>
      {/* Back navigation */}
      <div className="mb-4">
        <span
          onClick={onNavigateBack}
          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", fontSize: "14px" }}
          className="text-secondary hover-link text-decoration-none transition-all fw-semibold"
        >
          <ArrowLeft size={16} className="me-2" /> Back to Cart
        </span>
      </div>

      <h1 className="fw-bold mb-4 text-dark" style={{ fontSize: "32px", color: "#08060d" }}>
        Confirm order
      </h1>

      <form onSubmit={handleSubmit}>
        <div
          className="card border rounded-4 p-4 mb-4 bg-white shadow-sm"
          style={{
            borderColor: "#e5e4e7"
          }}
        >
          {/* Delivery Address */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary" style={{ fontSize: "15px" }}>
              Delivery address
            </label>
            <textarea
              className={`form-control rounded-3 p-3 ${formErrors.address ? "is-invalid" : ""}`}
              rows="3"
              style={{
                backgroundColor: "#fafbfc",
                borderColor: "#e5e4e7",
                fontSize: "15px",
                resize: "none"
              }}
              placeholder="Enter your street address, apartment, floor, building..."
              value={orderDetails.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
          </div>

          {/* Phone Number */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary" style={{ fontSize: "15px" }}>
              Phone number
            </label>
            <input
              type="tel"
              className={`form-control rounded-3 p-3 ${formErrors.phone ? "is-invalid" : ""}`}
              style={{
                backgroundColor: "#fafbfc",
                borderColor: "#e5e4e7",
                fontSize: "15px"
              }}
              placeholder="e.g. 01012345678"
              value={orderDetails.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="form-label fw-semibold text-secondary" style={{ fontSize: "15px" }}>
              Notes
            </label>
            <textarea
              className="form-control rounded-3 p-3"
              rows="2"
              style={{
                backgroundColor: "#fafbfc",
                borderColor: "#e5e4e7",
                fontSize: "15px",
                resize: "none"
              }}
              placeholder="Any instructions for delivery or pharmacy..."
              value={orderDetails.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </div>

          {/* Payment Method Section (طريقة الدفع) */}
          <div className="mb-4 pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "17px" }}>
              طريقة الدفع (Payment Method)
            </h5>
            
            <div className="row g-3">
              {/* Cash On Delivery Card */}
              <div className="col-md-6">
                <div
                  className="card rounded-3 p-3 text-start transition-all cursor-pointer h-100 position-relative"
                  style={{
                    border: orderDetails.paymentMethod === "cash" ? "2px solid #2563eb" : "1.5px solid #e5e4e7",
                    backgroundColor: orderDetails.paymentMethod === "cash" ? "#f0fdf4" : "#ffffff",
                    cursor: "pointer"
                  }}
                  onClick={() => handleInputChange("paymentMethod", "cash")}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle p-2 bg-light text-secondary d-flex align-items-center justify-content-center me-3">
                        <Cash size={20} className={orderDetails.paymentMethod === "cash" ? "text-success" : ""} />
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: "15px" }}>الدفع عند الاستلام</div>
                        <small className="text-secondary" style={{ fontSize: "12px" }}>ادفع نقداً عند وصول طلبك</small>
                      </div>
                    </div>
                    {orderDetails.paymentMethod === "cash" && (
                      <span className="badge rounded-circle p-1 bg-success d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px" }}>
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Paymob Online Payment Card */}
              <div className="col-md-6">
                <div
                  className="card rounded-3 p-3 text-start h-100 position-relative"
                  style={{
                    border: orderDetails.paymentMethod === "paymob" ? "2px solid #00b289" : "1.5px solid #e5e4e7",
                    backgroundColor: orderDetails.paymentMethod === "paymob" ? "#f0fdf4" : "#ffffff",
                    cursor: "pointer"
                  }}
                  onClick={() => handleInputChange("paymentMethod", "paymob")}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle p-2 bg-light text-secondary d-flex align-items-center justify-content-center me-3">
                        <CreditCard size={20} className={orderDetails.paymentMethod === "paymob" ? "text-success" : ""} />
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: "15px" }}>الدفع أونلاين</div>
                        <small className="text-secondary" style={{ fontSize: "12px" }}>Visa / Mastercard عبر Paymob</small>
                      </div>
                    </div>
                    {orderDetails.paymentMethod === "paymob" && (
                      <span className="badge rounded-circle p-1 bg-success d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px" }}>✓</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {orderDetails.paymentMethod === "paymob" && (
              <div className="mt-3 d-flex align-items-center text-muted rounded-3 p-3 bg-light" style={{ fontSize: "13px" }}>
                <ShieldCheck size={16} className="text-success me-2 flex-shrink-0" />
                <span>ستنتقل إلى صفحة الدفع الآمنة (Paymob) بعد تأكيد الطلب.</span>
              </div>
            )}
          </div>

          {/* Prescription Upload */}
          <div className="pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <FileEarmarkMedical size={18} className="text-primary" />
              <h5 className="fw-bold text-dark mb-0" style={{ fontSize: "16px" }}>الروشيتة الطبية (اختياري)</h5>
            </div>
            <p className="text-secondary mb-3" style={{ fontSize: "13px" }}>
              إذا كان الدواء يستلزم روشيتة طبية، يرجى إرفاقها هنا قبل تقديم الطلب.
            </p>
            <label
              className="d-flex align-items-center justify-content-center gap-2 rounded-3 p-3 border text-center"
              style={{ borderStyle: "dashed", borderColor: prescriptionFile ? "#00b289" : "#d1d5db", backgroundColor: prescriptionFile ? "#f0fdf4" : "#fafbfc", cursor: "pointer", fontSize: "14px" }}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                className="d-none"
                onChange={(e) => setPrescriptionFile(e.target.files[0] || null)}
              />
              {prescriptionFile ? (
                <span className="text-success fw-semibold">✓ {prescriptionFile.name}</span>
              ) : (
                <span className="text-secondary">اضغط لرفع صورة الروشيتة (JPG / PNG / PDF)</span>
              )}
            </label>
            {prescriptionFile && (
              <button type="button" className="btn btn-link btn-sm text-danger p-0 mt-1" onClick={() => setPrescriptionFile(null)}>
                إزالة الروشيتة
              </button>
            )}
          </div>

          {/* Pricing breakdown inside form card */}
          <div className="pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
            <div className="d-flex justify-content-between mb-2 text-secondary" style={{ fontSize: "14px" }}>
              <span>Subtotal</span>
              <span className="fw-semibold text-dark">{formatPrice(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-secondary" style={{ fontSize: "14px" }}>
              <span>Delivery</span>
              <span className="fw-semibold text-dark">{formatPrice(deliveryFee)}</span>
            </div>
            
            <hr style={{ borderTop: "1px solid #f1f5f9", margin: "10px 0" }} />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold text-dark" style={{ fontSize: "16px" }}>Total</span>
              <span className="fw-extrabold" style={{ color: "#00b289", fontSize: "20px" }}>
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="submit"
              className="btn text-white w-100 rounded-pill py-3 fw-bold btn-order-hover"
              disabled={isSubmitting}
              style={{
                background: "#00b289",
                border: "none",
                fontSize: "16px",
                boxShadow: "0 4px 12px rgba(0, 178, 137, 0.15)",
                transition: "all 0.2s ease"
              }}
            >
              {isSubmitting ? (
                <div className="spinner-border spinner-border-sm text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Place order"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(8, 6, 13, 0.6)",
            zIndex: 1050,
            backdropFilter: "blur(4px)"
          }}
        >
          <div className="card border-0 rounded-4 p-5 text-center bg-white shadow-lg mx-3" style={{ maxWidth: "450px" }}>
            <div className="text-success mb-4 text-center">
              <CheckCircleFill size={65} className="success-pulse" />
            </div>
            
            <h3 className="fw-bold text-dark mb-2">Order Confirmed!</h3>
            <p className="text-secondary mb-4" style={{ fontSize: "15px" }}>
              Thank you for your order. Your medications are being prepared and will be delivered shortly.
            </p>
            
            <div className="rounded-3 p-3 bg-light text-start mb-4" style={{ fontSize: "14px" }}>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Delivery to:</span>
                <strong className="text-dark truncate-text" style={{ maxWidth: "200px" }}>{orderDetails.address}</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Phone number:</span>
                <strong className="text-dark">{orderDetails.phone}</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Payment Mode:</span>
                <strong className="text-dark">{orderDetails.paymentMethod === "visa" ? "Visa Card" : "Cash on Delivery"}</strong>
              </div>
              <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                <span className="text-secondary fw-semibold">Total Paid:</span>
                <strong className="text-success fw-bold">{formatPrice(total)}</strong>
              </div>
            </div>

            <button
              className="btn text-white rounded-pill w-100 py-2.5 fw-bold"
              style={{
                backgroundColor: "#00b289",
                border: "none"
              }}
              onClick={onOrderPlaced}
            >
              Back to Store
            </button>
          </div>
        </div>
      )}

      {/* Embedded CSS for animations and layout tweaks */}
      <style>{`
        .btn-order-hover:hover {
          background-color: #009e79 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 178, 137, 0.25) !important;
        }
        .card-fields-animation {
          animation: slideDown 0.3s ease-out forwards;
        }
        .success-pulse {
          animation: pulse 1s infinite alternate;
        }
        .truncate-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
      `}</style>

      {/* Paymob iframe overlay */}
      {paymobIframeUrl && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(8,6,13,0.7)", zIndex: 1060 }}
        >
          <div className="card border-0 rounded-4 shadow-lg bg-white mx-3 overflow-hidden" style={{ width: "100%", maxWidth: "520px", height: "600px" }}>
            <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
              <span className="fw-bold text-dark" style={{ fontSize: "16px" }}>إتمام الدفع</span>
              <button
                className="btn btn-link p-0 text-secondary"
                onClick={() => { setPaymobIframeUrl(null); onOrderPlaced(); }}
                style={{ fontSize: "20px", textDecoration: "none" }}
              >
                ✕
              </button>
            </div>
            <iframe
              src={paymobIframeUrl}
              title="Paymob Payment"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmOrder;
