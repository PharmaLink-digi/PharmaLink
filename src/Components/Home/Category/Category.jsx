import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaCapsules,
  FaHeartbeat,
  FaFire,
  FaHeart,
  FaWind,
  FaSun,
  FaCircle,
  FaStethoscope,
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function Category() {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    
    // icons map
    const icons = {
    Antibiotics: <FaCapsules />,
    "Pain Relief": <FaHeartbeat />,
    Diabetes: <FaFire />,
    Cardiovascular: <FaHeart />,
    Respiratory: <FaWind />,
    Vitamins: <FaSun />,
    Digestive: <FaCircle />,
    Dermatology: <FaStethoscope />,
  };

  async function getCategories() {
    try {
      const { data } = await axios.get(
        "https://pharmalink-back-end-2.onrender.com/medications"
      );

      // تجميع الأدوية حسب category
      const grouped = data.reduce((acc, item) => {
        const category = item.category || "Unknown";

        if (!acc[category]) {
          acc[category] = 0;
        }

        acc[category]++;
        return acc;
      }, {});

      // تحويلها لشكل مناسب للـ UI
      const formattedCategories = Object.keys(grouped).map((category) => ({
        name: category,
        count: grouped[category],
        icon: icons[category] || <FaCapsules />,
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);
    const handleCategory = (category) => {
    navigate(`/search?category=${category}`);
  };
  return (
    <>
<section className="categories-section">
        <div className="container">
          <h2 className="section-title">{t('category.title')}</h2>

          <div className="categories-grid">
            {categories.slice(0, 8).map((item, index) => (
              <div
                key={index}
                className="category-card"
                onClick={() => handleCategory(item.name)}
              >
                <div className="category-icon">{item.icon}</div>

                <div className="category-content">
                  <h4>{item.name}</h4>
                  <p>{t('category.medicineCount', { count: item.count })}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-primary px-4 py-2" style={{ backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: '5px' }} onClick={() => navigate('/search')}>
              {t('category.viewAll')}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
