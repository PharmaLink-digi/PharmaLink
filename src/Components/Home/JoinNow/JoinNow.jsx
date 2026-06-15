import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export default function JoinNow() {
  const { t } = useTranslation();
  return (
    <section className="hp-cta">
      <div className="container">
        <div className="hp-cta-box">
          <h2 className="hp-cta-title">{t('joinNow.title')}</h2>
          <p className="hp-cta-sub">{t('joinNow.subtitle')}</p>
          <Link to="/signup" className="hp-cta-btn">
            {t('joinNow.button')}
            <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
