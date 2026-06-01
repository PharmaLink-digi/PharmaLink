import React from 'react'
import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const { t } = useTranslation();
  return (
    <>
    <section className="testimonials-section py-5" dir="rtl">
        <div className="container px-4 px-md-5">
          <div className="text-center mb-5">
            <p className="eyebrow-text mb-2">{t('testimonials.eyebrow')}</p>
            <h2 className="section-title mb-3">{t('testimonials.title')}</h2>
            <p className="section-subtitle mx-auto text-muted">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="testimonial-card p-4 h-100 rounded-4">
                <div className="stars mb-3">
                  {[...Array(5)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill"></i>
                  ))}
                </div>
                <p className="testimonial-text text-secondary mb-4">
                  {t('testimonials.review1')}
                </p>
                <div className="testimonial-author d-flex align-items-center gap-3">
                  <div className="avatar-circle">A</div>
                  <div>
                    <p className="mb-1 fw-bold">{t('testimonials.review1Author')}</p>
                    <p className="text-muted small mb-0">{t('testimonials.review1Role')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="testimonial-card p-4 h-100 rounded-4">
                <div className="stars mb-3">
                  {[...Array(5)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill"></i>
                  ))}
                </div>
                <p className="testimonial-text text-secondary mb-4">
                  {t('testimonials.review2')}
                </p>
                <div className="testimonial-author d-flex align-items-center gap-3">
                  <div className="avatar-circle">A</div>
                  <div>
                    <p className="mb-1 fw-bold">{t('testimonials.review2Author')}</p>
                    <p className="text-muted small mb-0">{t('testimonials.review2Role')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="testimonial-card p-4 h-100 rounded-4">
                <div className="stars mb-3">
                  {[...Array(5)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill"></i>
                  ))}
                </div>
                <p className="testimonial-text text-secondary mb-4">
                  {t('testimonials.review3')}
                </p>
                <div className="testimonial-author d-flex align-items-center gap-3">
                  <div className="avatar-circle">S</div>
                  <div>
                    <p className="mb-1 fw-bold">{t('testimonials.review3Author')}</p>
                    <p className="text-muted small mb-0">{t('testimonials.review3Role')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
    </>
  )
}
