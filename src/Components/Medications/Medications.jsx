import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Medications.css";
import { useTranslation } from "react-i18next";

export default function Medications() {
  const { t } = useTranslation();
  const [medications, setMedications] = useState([]);

  async function getMedications() {

    try {

      const response = await axios.get(
        "https://pharmalink-back-end-2.onrender.com/medications"
      );

      // أول 8 أدوية فقط
      setMedications(response.data.slice(0, 8));

    } catch (error) {

      console.log(error);

    }
  }

  useEffect(() => {
    getMedications();
  }, []);

  return (

    <div className="container py-5">

      {/* HEADING */}
      <div className="mb-5">

        <h1 className="fw-bold trending-title">
          {t('medications.trendingTitle')}
        </h1>

        <p className="text-secondary fs-5">
          {t('medications.trendingSubtitle')}
        </p>

      </div>

      <div className="row g-4">

        {medications.map((medicine) => (

          <div
            className="col-lg-3 col-md-6"
            key={medicine.medication_id}
          >

            <div className="medicine-card position-relative">

              {/* ICON */}
              <div className="icon-box">

                <i className="bi bi-capsule-pill"></i>

              </div>

              {/* NAME */}
              <h4 className="medicine-name">

                {medicine.medication_name}

              </h4>

              {/* TYPE */}
              <p className="medicine-type">

                {medicine.medication_type}

              </p>

              {/* AVAILABLE */}
              <span className="available-badge">

                {t('medications.inStock')}

              </span>

              {/* CATEGORY */}
              <p className="medicine-category">

                {medicine.category}

              </p>

              {/* STARS */}
              <div className="rating">

                <span>4.8</span>

                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* VIEW ALL LINK */}
      <div className="text-center mt-5">

        <Link
          to="/search"
        className="view-link"
        >

          {t('medications.viewAll')}
          <i className="bi bi-arrow-right ms-2"></i>

        </Link>

      </div>

    </div>
  );
}