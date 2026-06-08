import { useState } from 'react'
import { FiUser, FiGlobe, FiBell, FiLogOut } from 'react-icons/fi'
import './Settings.css'

const translations = {
  ar: {
    settingsTitle: 'الإعدادات',
    settingsSubtitle: 'إدارة حسابك وتفضيلاتك',
    profileTitle: 'الملف الشخصي',
    name: 'User',
    email: 'user@pharmalink.com',
    languageTitle: 'اللغة',
    languageArabic: 'العربية',
    languageArabicDesc: 'من اليمين لليسار',
    languageEnglish: 'English',
    languageEnglishDesc: 'من اليمين لليسار',
    notificationsTitle: 'الإشعارات',
    orderUpdates: 'تحديثات الطلبات',
    deliveryAlerts: 'تنبيهات التوصيل',
    stockAlerts: 'تنبيهات المخزون',
    medicationReminders: 'تذكيرات الأدوية',
    logout: 'تسجيل الخروج',
  },
  en: {
    settingsTitle: 'Settings',
    settingsSubtitle: 'Manage your account and preferences',
    profileTitle: 'Profile',
    name: 'User',
    email: 'user@pharmalink.com',
    languageTitle: 'Language',
    languageArabic: 'العربية',
    languageArabicDesc: 'Right to left',
    languageEnglish: 'English',
    languageEnglishDesc: 'Left to right',
    notificationsTitle: 'Notifications',
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

  const labels = translations[lang]

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="settings-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="settings-wrapper">
        <header className="settings-head">
          <h1>{labels.settingsTitle}</h1>
          <p>{labels.settingsSubtitle}</p>
        </header>

        <section className="settings-card profile-card">
          <div className="card-top">
            <div className="card-title">
              <span>{labels.profileTitle}</span>
              <FiUser className="card-icon" />
            </div>
          </div>
          <div className="card-body profile-body">
            <div className="profile-info">
              <div className="profile-name">{labels.name}</div>
              <div className="profile-email">{labels.email}</div>
            </div>
            <div className="profile-avatar">U</div>
          </div>
        </section>

        <section className="settings-card language-card">
          <div className="card-top">
            <div className="card-title">
              <span>{labels.languageTitle}</span>
              <FiGlobe className="card-icon" />
            </div>
          </div>
          <div className="card-body language-body">
            <button
              type="button"
              className={`lang-item ${lang === 'ar' ? 'active' : ''}`}
              onClick={() => setLang('ar')}
            >
              <div className="lang-info">
                <span className="lang-main">{labels.languageArabic}</span>
                <span className="lang-sub">{labels.languageArabicDesc}</span>
              </div>
              <span className="lang-code">SA</span>
              {lang === 'ar' && <span className="lang-check">✓</span>}
            </button>

            <button
              type="button"
              className={`lang-item ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              <div className="lang-info">
                <span className="lang-main">{labels.languageEnglish}</span>
                <span className="lang-sub">{labels.languageEnglishDesc}</span>
              </div>
              <span className="lang-code">US</span>
              {lang === 'en' && <span className="lang-check">✓</span>}
            </button>
          </div>
        </section>

        <section className="settings-card notify-card">
          <div className="card-top">
            <div className="card-title">
              <span>{labels.notificationsTitle}</span>
              <FiBell className="card-icon" />
            </div>
          </div>
          <div className="card-body notifications-body">
            <div className="notification-row">
              <button
                type="button"
                className={`switch ${toggles.orderUpdates ? 'on' : ''}`}
                onClick={() => handleToggle('orderUpdates')}
                aria-pressed={toggles.orderUpdates}
              >
                <span className="switch-thumb" />
              </button>
              <div className="notif-text">
                <span className="notif-title">{labels.orderUpdates}</span>
              </div>
            </div>
            <div className="notification-row">
              <button
                type="button"
                className={`switch ${toggles.deliveryAlerts ? 'on' : ''}`}
                onClick={() => handleToggle('deliveryAlerts')}
                aria-pressed={toggles.deliveryAlerts}
              >
                <span className="switch-thumb" />
              </button>
              <div className="notif-text">
                <span className="notif-title">{labels.deliveryAlerts}</span>
              </div>
            </div>
            <div className="notification-row">
              <button
                type="button"
                className={`switch ${toggles.stockAlerts ? 'on' : ''}`}
                onClick={() => handleToggle('stockAlerts')}
                aria-pressed={toggles.stockAlerts}
              >
                <span className="switch-thumb" />
              </button>
              <div className="notif-text">
                <span className="notif-title">{labels.stockAlerts}</span>
              </div>
            </div>
            <div className="notification-row">
              <button
                type="button"
                className={`switch ${toggles.medicationReminders ? 'on' : ''}`}
                onClick={() => handleToggle('medicationReminders')}
                aria-pressed={toggles.medicationReminders}
              >
                <span className="switch-thumb" />
              </button>
              <div className="notif-text">
                <span className="notif-title">{labels.medicationReminders}</span>
              </div>
            </div>
          </div>
        </section>

        <button type="button" className="logout-button">
          <FiLogOut size={18} />
          {labels.logout}
        </button>
      </div>
    </div>
  )
}

export default Settings
