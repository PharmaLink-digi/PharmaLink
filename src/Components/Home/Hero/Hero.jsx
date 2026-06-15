import React, { useState } from 'react';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    else navigate('/search');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className="hp-hero">
      <div className="container">
        <div className="hp-hero-inner">

          {/* Badge */}
          <span className="hp-badge">
            <span className="hp-badge-dot" />
            {t('hero.badge')}
          </span>

          {/* Heading */}
          <h1
            className="hp-hero-title"
            dangerouslySetInnerHTML={{ __html: t('hero.title') }}
          />

          {/* Sub */}
          <p className="hp-hero-sub">{t('hero.description')}</p>

          {/* Search */}
          <div className="hp-search-bar">
            <FiSearch className="hp-search-icon" />
            <input
              type="text"
              placeholder={t('hero.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="hp-search-btn" onClick={handleSearch}>
              {t('hero.searchBtn')}
            </button>
          </div>

          {/* CTA */}
          <div className="hp-cta-group">
            <Link to="/signup" className="hp-btn-primary">
              {t('hero.startNow')}
            </Link>
            <Link to="/search" className="hp-btn-outline">
              {t('hero.browseMedicines')}
              <FiArrowRight size={15} />
            </Link>
          </div>

          {/* Stats */}
          <div className="hp-stats">
            <div className="hp-stat">
              <div className="hp-stat-num">50K+</div>
              <div className="hp-stat-label">{t('hero.stats.patients')}</div>
            </div>
            <div className="hp-stat">
              <div className="hp-stat-num">1,200+</div>
              <div className="hp-stat-label">{t('hero.stats.pharmacies')}</div>
            </div>
            <div className="hp-stat">
              <div className="hp-stat-num">10K+</div>
              <div className="hp-stat-label">{t('hero.stats.medicines')}</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
