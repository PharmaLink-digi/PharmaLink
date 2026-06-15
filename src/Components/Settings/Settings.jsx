import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiGlobe, FiBell, FiLogOut, FiAlertCircle } from 'react-icons/fi'
import { useTranslation } from "react-i18next"
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import './Settings.css'

// Attempt a direct /:id GET and return the first usable record.
// Returns the raw data object/array on success, null on 404, re-throws on other errors.
async function tryDirect(path, userId) {
  try {
    const { data } = await api.get(`${path}/${userId}`);
    if (!data || (Array.isArray(data) && data.length === 0)) return null;
    return Array.isArray(data) ? data[0] : data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err; // 401, 500, network — let caller decide
  }
}

// Normalize to { name, email, phone, area }
// email/area are both optional depending on role
function normalizePharm(r) {
  if (!r?.pharm_name) return null;
  return { name: r.pharm_name, email: null, phone: r.phone || null, area: r.area || null };
}
function normalizeWarehouse(r) {
  if (!r?.warehouse_code) return null;
  return { name: r.warehouse_code, email: null, phone: r.phone || null, area: r.area || null };
}
function normalizeClient(r) {
  if (!r?.client_name) return null;
  return { name: r.client_name, email: r.email || null, phone: r.phone || null, area: null };
}

// Fetch only this user's record, scoped by role.
// Strategy: try the most-specific endpoint first, fall back to filtered list.
// Returns a normalized { name, email, phone } object, or null if not found.
async function fetchOwnProfile(role, userId) {
  if (role === 'pharmacy') {
    try {
      const direct = await tryDirect('/pharm-info', userId);
      if (direct) {
        const normalized = normalizePharm(direct);
        if (normalized) return normalized;
      }
    } catch (_) { /* direct endpoint failed — fall through to list */ }
    const { data } = await api.get('/pharm-info');
    const list = Array.isArray(data) ? data : (data?.data ?? []);
    const match = list.find((p) => String(p.pharm_id) === String(userId));
    return normalizePharm(match);
  }

  if (role === 'warehouse') {
    // GET /warehouses/:id doesn't work on this backend — go straight to list
    const { data } = await api.get('/warehouses');
    const list = Array.isArray(data) ? data : (data?.data ?? []);
    const match = list.find((w) => String(w.warehouse_id) === String(userId));
    return normalizeWarehouse(match);
  }

  // client — GET /clients/:id exists and returns the record directly
  const direct = await tryDirect('/clients', userId);
  if (direct) return normalizeClient(direct);
  return null;
}

function Settings() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  const { userId, role, logout: contextLogout } = useAuth();
  const navigate = useNavigate();

  const [toggles, setToggles] = useState({
    orderUpdates: true,
    deliveryAlerts: true,
    stockAlerts: false,
    medicationReminders: true,
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Sync language direction on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
    const activeLang = savedLang || i18n.language || 'en';
    document.documentElement.dir = activeLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = activeLang;
  }, [i18n]);

  useEffect(() => {
    // Guard: must be authenticated
    if (!userId) {
      navigate('/signin', { replace: true });
      return;
    }
    // Guard: must have a known role
    if (!role) {
      navigate('/account-type', { replace: true });
      return;
    }

    setLoading(true);
    setProfileError(null);

    fetchOwnProfile(role, userId)
      .then((profile) => {
        if (profile) {
          setUserData(profile);
        } else {
          setProfileError(t('settings.profileNotFound', 'Profile not found.'));
        }
      })
      .catch((err) => {
        // 401 is handled globally by api.js interceptor (redirects to /signin)
        if (err.response?.status !== 401) {
          setProfileError(t('settings.profileError', 'Could not load profile. Please try again.'));
        }
      })
      .finally(() => setLoading(false));
  }, [userId, role]);

  const handleLanguageChange = (newLang) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    contextLogout();
    navigate('/signin');
  };

  const avatarLetter = userData?.name?.[0]?.toUpperCase() ?? role?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="settings-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="settings-container">
        <div className="settings-header">
          <div>
            <h1 className="settings-title">{t('settings.title', 'Settings')}</h1>
            <p className="settings-subtitle">{t('settings.subtitle', 'Manage your account and preferences')}</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card profile-card">
          <div className="card-header">
            <span>{t('settings.profileLabel')}</span>
          </div>
          <div className="card-body profile-body">
            {loading ? (
              <div className="d-flex align-items-center gap-2">
                <div className="spinner-border spinner-border-sm text-primary" role="status" />
                <span>{t('settings.loading', 'Loading profile...')}</span>
              </div>
            ) : profileError ? (
              <div className="d-flex align-items-center gap-2 text-danger">
                <FiAlertCircle size={18} />
                <span>{profileError}</span>
              </div>
            ) : (
              <>
                <div className="profile-avatar">{avatarLetter}</div>
                <div className="profile-details">
                  <div className="profile-name">
                    {userData?.name || t('settings.name', 'Name not available')}
                  </div>
                  {userData?.email && (
                    <div className="profile-email">{userData.email}</div>
                  )}
                  {userData?.phone && (
                    <div className="profile-email">{userData.phone}</div>
                  )}
                  {userData?.area && (
                    <div className="profile-email">
                      <span style={{ opacity: 0.6, fontSize: '12px' }}>📍 </span>
                      {userData.area}
                    </div>
                  )}
                  <div className="profile-email" style={{ opacity: 0.5, fontSize: '12px', textTransform: 'capitalize' }}>
                    {role}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Language Card */}
        <div className="card language-card">
          <div className="card-header">
            <div className="header-icon"><FiGlobe size={18} /></div>
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

        {/* Notifications Card */}
        <div className="card notify-card">
          <div className="card-header">
            <div className="header-icon"><FiBell size={18} /></div>
            <span>{t('settings.notificationsLabel')}</span>
          </div>
          <div className="card-body notification-body">
            {[
              { key: 'orderUpdates',        label: t('settings.orderUpdates') },
              { key: 'deliveryAlerts',      label: t('settings.deliveryAlerts') },
              { key: 'stockAlerts',         label: t('settings.stockAlerts') },
              { key: 'medicationReminders', label: t('settings.medicationReminders') },
            ].map(({ key, label }) => (
              <div key={key} className="notif-item">
                <span>{label}</span>
                <button
                  type="button"
                  className={`switch ${toggles[key] ? 'on' : ''}`}
                  onClick={() => handleToggle(key)}
                  aria-pressed={toggles[key]}
                >
                  <span className="switch-thumb" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="button" className="logout-button" onClick={handleLogout}>
          <FiLogOut size={18} />
          {t('settings.logout')}
        </button>
      </div>
    </div>
  );
}

export default Settings;
