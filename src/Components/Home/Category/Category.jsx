import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaCapsules, FaHeartbeat, FaFire, FaHeart,
  FaWind, FaSun, FaCircle, FaStethoscope,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ICONS = {
  Antibiotics:   <FaCapsules />,
  'Pain Relief': <FaHeartbeat />,
  Diabetes:      <FaFire />,
  Cardiovascular:<FaHeart />,
  Respiratory:   <FaWind />,
  Vitamins:      <FaSun />,
  Digestive:     <FaCircle />,
  Dermatology:   <FaStethoscope />,
};

export default function Category() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/medications`)
      .then(({ data }) => {
        const grouped = data.reduce((acc, item) => {
          const cat = item.category || 'Unknown';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});
        setCategories(
          Object.keys(grouped).map((name) => ({
            name,
            count: grouped[name],
            icon: ICONS[name] || <FaCapsules />,
          }))
        );
      })
      .catch(console.error);
  }, []);

  return (
    <section className="hp-section hp-section-alt">
      <div className="container">

        {/* Header */}
        <div className="hp-section-head">
          <h2 className="hp-section-title">{t('category.title')}</h2>
        </div>

        {/* Grid */}
        <div className="hp-cat-grid">
          {categories.slice(0, 8).map((item, i) => (
            <div
              key={i}
              className="hp-cat-card"
              onClick={() => navigate(`/search?category=${item.name}`)}
            >
              <div className="hp-cat-icon">{item.icon}</div>
              <div>
                <p className="hp-cat-name">{item.name}</p>
                <p className="hp-cat-count">
                  {t('category.medicineCount', { count: item.count })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-5">
          <button
            className="hp-btn-outline"
            style={{ border: '1px solid #d1d5db', cursor: 'pointer' }}
            onClick={() => navigate('/search')}
          >
            {t('category.viewAll')}
            <span style={{ marginLeft: 6 }}>→</span>
          </button>
        </div>

      </div>
    </section>
  );
}
