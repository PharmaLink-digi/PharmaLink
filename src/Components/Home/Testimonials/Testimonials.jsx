import React from 'react';
import { useTranslation } from 'react-i18next';

const REVIEWS = [
  { tKey: 'review1', authorKey: 'review1Author', roleKey: 'review1Role', initial: 'A' },
  { tKey: 'review2', authorKey: 'review2Author', roleKey: 'review2Role', initial: 'S' },
  { tKey: 'review3', authorKey: 'review3Author', roleKey: 'review3Role', initial: 'S' },
];

export default function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="hp-section hp-testimonials">
      <div className="container">

        {/* Header */}
        <div className="text-center hp-section-head">
          <span className="hp-eyebrow">{t('testimonials.eyebrow')}</span>
          <h2 className="hp-section-title">{t('testimonials.title')}</h2>
          <p className="hp-section-sub mx-auto" style={{ maxWidth: 500 }}>
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Cards */}
        <div className="row g-4">
          {REVIEWS.map((r) => (
            <div key={r.tKey} className="col-12 col-md-6 col-lg-4">
              <div className="hp-testi-card">
                <div className="hp-testi-stars d-flex">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill hp-star" />
                  ))}
                </div>
                <p className="hp-testi-text">{t(`testimonials.${r.tKey}`)}</p>
                <div className="d-flex align-items-center gap-3">
                  <div className="hp-avatar">{r.initial}</div>
                  <div>
                    <p className="hp-testi-name">{t(`testimonials.${r.authorKey}`)}</p>
                    <p className="hp-testi-role">{t(`testimonials.${r.roleKey}`)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
