import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Medications() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/medications`)
      .then((r) => setMedications(r.data.slice(0, 8)))
      .catch(console.error);
  }, []);

  return (
    <section className="hp-section">
      <div className="container">

        {/* Header */}
        <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 hp-section-head">
          <div>
            <h2 className="hp-section-title">{t('medications.trendingTitle')}</h2>
            <p className="hp-section-sub">{t('medications.trendingSubtitle')}</p>
          </div>
          <Link to="/search" className="hp-view-all">
            {t('medications.viewAll')} <FiArrowRight />
          </Link>
        </div>

        {/* Grid */}
        <div className="hp-med-grid">
          {medications.map((med) => {
            const inStock = med.medication_id % 7 !== 0;
            const price = med.lowest_price
              ? `${Number(med.lowest_price).toFixed(2)} EGP`
              : `${(4 + (med.medication_id % 20) * 1.35).toFixed(2)} EGP`;

            return (
              <div
                key={med.medication_id}
                className="hp-med-card"
                onClick={() => navigate(`/client/medicine/${med.medication_id}`)}
              >
                <div className="hp-med-card-top">
                  <div className="hp-med-icon">
                    <i className="bi bi-capsule-pill" />
                  </div>
                  <span className={inStock ? 'hp-med-badge-available' : 'hp-med-badge-out'}>
                    {inStock ? t('medications.inStock') : t('medications.outOfStock')}
                  </span>
                </div>

                <div>
                  <p className="hp-med-name">{med.medication_name}</p>
                  <p className="hp-med-type">{med.medication_type || med.category || '—'}</p>
                </div>

                <div className="hp-med-footer">
                  <span className="hp-med-price">{price}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
