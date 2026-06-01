import React from 'react'
import {FaSearch, FaArrowLeft} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <>
        <section className="hero-section">
                <div className="container">
                  <div className="hero-content text-center">
                    <span className="hero-badge">
                      <span className="dot"></span>
                      {t('hero.badge')}
                    </span>
        
                    <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t('hero.title') }}></h1>
        
                    <p className="hero-text">
                      {t('hero.description')}
                    </p>
        
                    <div className="hero-search">
                      <button>{t('hero.searchBtn')}</button>
        
                      <div className="search-input">
                        <FaSearch />
                        <input
                          type="text"
                          placeholder={t('hero.searchPlaceholder')}
                        />
                      </div>
                    </div>
        
                    <div className="hero-buttons">
                      <Link to="/signup" className="start-btn">
                        {t('hero.startNow')}
                      </Link>
        
                      <Link to="/search" className="browse-btn">
                        {t('hero.browseMedicines')}
                        <FaArrowLeft />
                      </Link>
                    </div>
        
                    <div className="hero-stats">
                      <div>
                        <h3>+50K</h3>
                        <p>{t('hero.stats.patients')}</p>
                      </div>
        
                      <div>
                        <h3>+1,200</h3>
                        <p>{t('hero.stats.pharmacies')}</p>
                      </div>
        
                      <div>
                        <h3>+10K</h3>
                        <p>{t('hero.stats.medicines')}</p>
                      </div>
                      </div>
                  </div>
                </div>
              </section>
    </>
  )
}
