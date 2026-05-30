import React from 'react'
import { useTranslation } from "react-i18next";

export default function JoinNow() {
  const { t } = useTranslation();
  return (
    <>
        <section className="cta-section py-5" dir="rtl">
        <div className="container px-4 px-md-5">
          <div className="cta-box rounded-4 p-5 text-center text-white">
            <h2 className="fw-bold mb-3">{t('joinNow.title')}</h2>
            <p className="mb-4">
              {t('joinNow.subtitle')}
            </p>
            <button type="button" className="btn btn-cta btn-lg px-5">
              {t('joinNow.button')}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
