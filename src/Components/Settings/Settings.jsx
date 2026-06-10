import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiGlobe, FiBell, FiLogOut } from 'react-icons/fi'
import { useTranslation } from "react-i18next"
import './Settings.css'

function Settings() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const [toggles, setToggles] = useState({
    orderUpdates: true,
    deliveryAlerts: true,
    stockAlerts: false,
    medicationReminders: true,
  })
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const savedLang = localStorage.getItem('lang')
    if (savedLang) {
      if (i18n.language !== savedLang) {
        i18n.changeLanguage(savedLang)
      }
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = savedLang
    }
  }, [i18n])

  useEffect(() => {
    const fetchUser = async () => {
      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://pharmalink-back-end.onrender.com'}/clients`)
        const data = await response.json()
        const user = data.find((u) => String(u.client_id) === String(currentUserId))
        if (user) {
          setUserData({
            id: user.client_id,
            name: user.client_name,
            email: user.email,
            phone: user.phone
          })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleLanguageChange = (newLang) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  }

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate('/login')
  }

  return (
    <div className="settings-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="settings-container">
        <div className="settings-header">
          <div>
            <h1 className="settings-title">{t('settings.title', 'Settings')}</h1>
            <p className="settings-subtitle">{t('settings.subtitle', 'Manage your account and preferences')}</p>
          </div>
        </div>

        <div className="card profile-card">
          <div className="card-header">
            <span>{t('settings.profileLabel')}</span>
          </div>
          <div className="card-body profile-body">
            {loading ? (
              <div>{t('settings.loading', 'Loading...')}</div>
            ) : (
              <>
                <div className="profile-avatar">{userData?.name?.[0]?.toUpperCase() || 'U'}</div>
                <div className="profile-details">
                  <div className="profile-name">{userData?.name || t('settings.name')}</div>
                  <div className="profile-email">{userData?.email || t('settings.email')}</div>
                  {userData?.phone && <div className="profile-email">{userData.phone}</div>}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card language-card">
          <div className="card-header">
            <div className="header-icon">
              <FiGlobe size={18} />
            </div>
            <span>{t('settings.languageLabel')}</span>
          </div>
          <div className="card-body language-body">
            <button
              type="button"
              className={`lang-option ${lang === 'ar' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('ar')}
            >
              <div className="lang-code">{t('settings.langCodeAR', 'SA')}</div>
              <div className="lang-texts">
                <div className="lang-title">{t('settings.arabic', 'Arabic')}</div>
                <div className="lang-subtitle">{t('settings.arabicDesc', 'Saudi Arabia')}</div>
              </div>
              {lang === 'ar' && <span className="lang-check">✓</span>}
            </button>

            <button
              type="button"
              className={`lang-option ${lang === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('en')}
            >
              <div className="lang-code">{t('settings.langCodeEN', 'US')}</div>
              <div className="lang-texts">
                <div className="lang-title">{t('settings.english', 'English')}</div>
                <div className="lang-subtitle">{t('settings.englishDesc', 'United States')}</div>
              </div>
              {lang === 'en' && <span className="lang-check">✓</span>}
            </button>
          </div>
        </div>

        <div className="card notify-card">
          <div className="card-header">
            <div className="header-icon">
              <FiBell size={18} />
            </div>
            <span>{t('settings.notificationsLabel')}</span>
          </div>
          <div className="card-body notification-body">
            <div className="notif-item">
              <span>{t('settings.orderUpdates')}</span>
              <button
                type="button"
                className={`switch ${toggles.orderUpdates ? 'on' : ''}`}
                onClick={() => handleToggle('orderUpdates')}
                aria-pressed={toggles.orderUpdates}
              >
                <span className="switch-thumb" />
              </button>
            </div>
            <div className="notif-item">
              <span>{t('settings.deliveryAlerts')}</span>
              <button
                type="button"
                className={`switch ${toggles.deliveryAlerts ? 'on' : ''}`}
                onClick={() => handleToggle('deliveryAlerts')}
                aria-pressed={toggles.deliveryAlerts}
              >
                <span className="switch-thumb" />
              </button>
            </div>
            <div className="notif-item">
              <span>{t('settings.stockAlerts')}</span>
              <button
                type="button"
                className={`switch ${toggles.stockAlerts ? 'on' : ''}`}
                onClick={() => handleToggle('stockAlerts')}
                aria-pressed={toggles.stockAlerts}
              >
                <span className="switch-thumb" />
              </button>
            </div>
            <div className="notif-item">
              <span>{t('settings.medicationReminders')}</span>
              <button
                type="button"
                className={`switch ${toggles.medicationReminders ? 'on' : ''}`}
                onClick={() => handleToggle('medicationReminders')}
                aria-pressed={toggles.medicationReminders}
              >
                <span className="switch-thumb" />
              </button>
            </div>
          </div>
        </div>

        <button type="button" className="logout-button" onClick={handleLogout}>
          <FiLogOut size={18} />
          {t('settings.logout')}
        </button>
      </div>
    </div>
  )
}

export default Settings
