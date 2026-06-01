import React from 'react';
import './Navbar.css';
import { FaCapsules } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">
        {/* Logo Section */}
        <Link to="/">
        <div className="navbar-logo">
          <div className="logo-icon">
            <FaCapsules />
          </div>
          <span className="logo-text">PharmaLink</span>
        </div>
        </Link>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <Link to="/"><li className="nav-item active">{t('navbar.home')}</li></Link>
          <Link to="/search"><li className="nav-item">{t('navbar.search')}</li></Link>
          <Link to="/#"><li className="nav-item">{t('navbar.dashboard')}</li></Link>
          <Link to="/#"><li className="nav-item">{t('navbar.orders')}</li></Link>
          <Link to="/#"><li className="nav-item">{t('navbar.notifications')}</li></Link>
        </ul>

        {/* Actions Section */}
        <div className="navbar-actions">
          <button 
            className="btn-lang"
            onClick={() => i18n.changeLanguage(i18n.language?.startsWith('en') ? 'ar' : 'en')}
          >
            {i18n.language?.startsWith('en') ? 'عربي' : 'EN'}
          </button>
          <Link to="/signin"><button className="btn-login">{t('navbar.login')}</button></Link>
          <Link to="/signup"><button className="btn-signup">{t('navbar.signup')}</button></Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;