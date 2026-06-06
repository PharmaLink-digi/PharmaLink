import React, { useState } from 'react'
import { FiGlobe, FiBell, FiLogOut } from 'react-icons/fi'
import './Settings.css'

const text = {
  ar: {
    title: 'الإعدادات',
    subtitle: 'إدارة حسابك وتفضيلاتك',
    profileLabel: 'الملف الشخصي',
    name: 'User',
    email: 'user@pharmalink.com',
    languageLabel: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    englishDesc: 'Left to right',
    arabicDesc: 'من اليمين لليسار',
    notificationsLabel: 'الإشعارات',
    orderUpdates: 'تحديثات الطلبات',
    deliveryAlerts: 'تنبيهات التوصيل',
    stockAlerts: 'تنبيهات المخزون',
    medicationReminders: 'تذكيرات الأدوية',
    logout: 'تسجيل الخروج',
  },
  en: {
    title: 'Settings',
    subtitle: 'Manage your account and preferences',
    profileLabel: 'Profile',
    name: 'User',
    email: 'user@pharmalink.com',
    languageLabel: 'Language',
    english: 'English',
    arabic: 'العربية',
    englishDesc: 'Left to right',
    arabicDesc: 'Right to left',
    notificationsLabel: 'Notifications',
    orderUpdates: 'Order Updates',
    deliveryAlerts: 'Delivery Alerts',
    stockAlerts: 'Stock Alerts',
    medicationReminders: 'Medication Reminders',
    logout: 'Log Out',
  },
}

function Settings() {
  const [lang, setLang] = useState('ar')
  const [toggles, setToggles] = useState({
    orderUpdates: true,
    deliveryAlerts: true,
    stockAlerts: false,
    medicationReminders: true,
  })
  const labels = text[lang]

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="settings-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="settings-container">
        <div className="settings-header">
          <div>
            <h1 className="settings-title">{labels.title}</h1>
            <p className="settings-subtitle">{labels.subtitle}</p>
          </div>
        </div>

        <div className="card profile-card">
          <div className="card-header">
            <span>{labels.profileLabel}</span>
          </div>
          <div className="card-body profile-body">
            <div className="profile-avatar">U</div>
            <div className="profile-details">
              <div className="profile-name">{labels.name}</div>
              <div className="profile-email">{labels.email}</div>
            </div>
          </div>
        </div>

        <div className="card language-card">
          <div className="card-header">
            <div className="header-icon">
              <FiGlobe size={18} />
            </div>
            <span>{labels.languageLabel}</span>
          </div>
          <div className="card-body language-body">
            <button
              type="button"
              className={`lang-option ${lang === 'ar' ? 'active' : ''}`}
              onClick={() => setLang('ar')}
            >
              <div className="lang-code">SA</div>
              <div className="lang-texts">
                <div className="lang-title">{labels.arabic}</div>
                <div className="lang-subtitle">{labels.arabicDesc}</div>
              </div>
              {lang === 'ar' && <span className="lang-check">✓</span>}
            </button>

            <button
              type="button"
              className={`lang-option ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              <div className="lang-code">US</div>
              <div className="lang-texts">
                <div className="lang-title">{labels.english}</div>
                <div className="lang-subtitle">{labels.englishDesc}</div>
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
            <span>{labels.notificationsLabel}</span>
          </div>
          <div className="card-body notification-body">
            <div className="notif-item">
              <span>{labels.orderUpdates}</span>
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
              <span>{labels.deliveryAlerts}</span>
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
              <span>{labels.stockAlerts}</span>
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
              <span>{labels.medicationReminders}</span>
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

        <button type="button" className="logout-button">
          <FiLogOut size={18} />
          {labels.logout}
        </button>
      </div>
    </div>
  )
}

export default Settings
