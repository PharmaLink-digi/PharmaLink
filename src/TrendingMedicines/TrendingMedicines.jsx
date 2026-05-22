import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Pill,
  Star,
  ArrowRight
} from "lucide-react";

export default function TrendingMedicines() {
  const medicines = [
    {
      name: "Amoxicillin",
      sub: "Amoxicillin trihydrate",
      price: "$12.50",
      rate: 4.5,
      status: "In Stock",
    },
    {
      name: "Paracetamol",
      sub: "Paracetamol",
      price: "$3.99",
      rate: 4.8,
      status: "In Stock",
    },
    {
      name: "Metformin",
      sub: "Metformin hydrochloride",
      price: "$18.75",
      rate: 4.3,
      status: "In Stock",
    },
    {
      name: "Atorvastatin",
      sub: "Atorvastatin calcium",
      price: "$24.99",
      rate: 4.6,
      status: "In Stock",
    },
    {
      name: "Salbutamol Inhaler",
      sub: "Salbutamol sulfate",
      price: "$15.00",
      rate: 4.7,
      status: "In Stock",
    },
    {
      name: "Vitamin D3",
      sub: "Cholecalciferol",
      price: "$8.50",
      rate: 4.9,
      status: "In Stock",
    },
    {
      name: "Omeprazole",
      sub: "Omeprazole",
      price: "$11.25",
      rate: 4.4,
      status: "Out",
    },
    {
      name: "Hydrocortisone Cream",
      sub: "Hydrocortisone",
      price: "$6.99",
      rate: 4.2,
      status: "In Stock",
    },
  ];

  return (
    <>
     <div className="medicine-section py-5">
      <div className="container">

        {/* Heading */}
        <div className="mb-5">
          <h1 className="fw-bold title-text">
            Trending Medicines
          </h1>

          <p className="sub-title">
            Most searched medicines this week
          </p>
        </div>

        {/* Cards */}
        <div className="row g-4">

          {medicines.map((medicine, index) => (
            <div className="col-lg-3 col-md-6" key={index}>

              <div className="medicine-card">

                {/* Icon */}
                <div className="icon-box">
                  <Pill size={22} color="#2563ff" />
                </div>

                {/* Name */}
                <h5 className="medicine-name">
                  {medicine.name}
                </h5>

                <p className="medicine-sub">
                  {medicine.sub}
                </p>

                {/* Price + Status */}
                <div className="d-flex justify-content-between align-items-center mt-3">

                  <h5 className="price-text">
                    {medicine.price}
                  </h5>

                  <span
                    className={
                      medicine.status === "Out"
                        ? "status-out"
                        : "status-stock"
                    }
                  >
                    {medicine.status}
                  </span>
                </div>

                {/* Rating */}
                <div className="d-flex align-items-center gap-1 mt-3">

                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill="#fbbc04"
                      color="#fbbc04"
                    />
                  ))}

                  <span className="rating-text ms-1">
                    {medicine.rate}
                  </span>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-5">

          <button className="view-btn">
            View all medicines
            <ArrowRight size={18} />
          </button>

        </div>
      </div>

      {/* CSS */}
      <style>{`

        .medicine-section{
          background:#f8fafc;
          min-height:100vh;
        }

        .title-text{
          color:#0f172a;
          font-size:42px;
        }

        .sub-title{
          color:#64748b;
          font-size:18px;
          margin-top:10px;
        }

        .medicine-card{
          background:white;
          border:1px solid #dbe4ee;
          border-radius:20px;
          padding:24px;
          transition:0.3s;
          height:100%;
        }

        .medicine-card:hover{
          transform:translateY(-4px);
          box-shadow:0 10px 25px rgba(0,0,0,0.06);
        }

        .icon-box{
          width:56px;
          height:56px;
          border-radius:18px;
          background:#dff7f6;
          display:flex;
          align-items:center;
          justify-content:center;
          margin-bottom:20px;
        }

        .medicine-name{
          font-size:22px;
          font-weight:700;
          color:#0f172a;
        }

        .medicine-sub{
          color:#64748b;
          margin-top:6px;
          font-size:15px;
        }

        .price-text{
          color:#2563ff;
          font-weight:700;
          margin:0;
        }

        .status-stock{
          background:#dcfce7;
          color:#15803d;
          padding:6px 14px;
          border-radius:30px;
          font-size:13px;
          font-weight:600;
        }

        .status-out{
          background:#fee2e2;
          color:#dc2626;
          padding:6px 14px;
          border-radius:30px;
          font-size:13px;
          font-weight:600;
        }

        .rating-text{
          color:#64748b;
          font-weight:500;
        }

        .view-btn{
          border:none;
          background:transparent;
          color:#2563ff;
          font-weight:700;
          font-size:20px;
          display:inline-flex;
          align-items:center;
          gap:8px;
        }

      `}</style>
    </div>
    
    </>
   
  );
}