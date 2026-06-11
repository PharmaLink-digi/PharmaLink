import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Search.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE}/medications`;

const mapMedication = (item) => ({
  id: item.medication_id,
  name: item.medication_name,
  active: `${item.medication_type} • ${item.manufacturer}`,
  type: item.category || 'عام',
  price: item.lowest_price,
  rating: Number((3.5 + (item.medication_id % 3) * 0.5).toFixed(1)),
  status: item.medication_id % 7 === 0 ? 'إنتهى من المخزن' : 'في الأوراق المالية',
  inStock: item.medication_id % 7 !== 0,
});

export default function Search() {
  const { t } = useTranslation();
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedTypes([categoryParam]);
    } else {
      setSelectedTypes([]);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTypes]);

  const fetchMedicines = async (query = '') => {
    try {
      setLoading(true);
      setError(null);

      const url = query 
        ? `${API_BASE}/medications/search?query=${encodeURIComponent(query)}` 
        : `${API_BASE}/medications`;

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404 && query) {
          setMedicines([]);
          return;
        }
        throw new Error(`خطأ في جلب البيانات: ${response.status}`);
      }
      
      const data = await response.json();
      let medsArray = [];
      
      if (query && data.results) {
        medsArray = data.results;
      } else if (Array.isArray(data)) {
        medsArray = data;
      } else {
        throw new Error('تنسيق الاستجابة غير صحيح من الخادم');
      }
      
      const transformed = medsArray.map(mapMedication);
      setMedicines(transformed);
    } catch (fetchError) {
      setError(fetchError.message || 'حدث خطأ أثناء جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines('');
  }, []);

  const handleSearch = () => {
    fetchMedicines(searchTerm.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const allTypes = useMemo(
    () => Array.from(new Set(medicines.map((item) => item.type))),
    [medicines]
  );

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(medicine.type);
    return matchesType;
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedMedicines = filteredMedicines.slice(
    startIndex,
    endIndex
  );

  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
  };

  return (
    <div className="medicine-search-bg" dir="rtl">
      <div className="container py-5 px-4 px-md-5">
        <div className="mb-4 text-end">
          <h2 className="fw-bold text-dark header-title mb-1">{t('search.title')}</h2>
          <p className="text-muted subtitle-text">{t('search.subtitle')}</p>
        </div>

        <div className="row g-3 mb-4 align-items-center">
          <div className="col-12 col-md-8 col-lg-7">
            <div className="position-relative search-input-wrapper">
              <input
                type="text"
                className="form-control search-field py-3 pe-4 ps-5"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <i className="bi bi-search search-field-icon position-absolute"></i>
            </div>
          </div>
          <div className="col-6 col-md-2 col-lg-2">
            <button type="button" className="btn btn-search w-100 py-3 fw-medium" onClick={handleSearch}>
              {t('search.searchBtn')}
            </button>
          </div>
          <div className="col-6 col-md-2 col-lg-3">
            <button
              type="button"
              className="btn btn-filter w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-medium"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-sliders"></i>
              {t('search.filtersBtn')}
            </button>
          </div>
        </div>

        <div className="text-end mb-4 results-count-text text-secondary fw-semibold">
          {loading ? t('search.loading') : t('search.resultsCount', { count: filteredMedicines.length })}
        </div>

        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : loading ? (
          <div className="text-center py-5 no-results-box my-4 rounded-4">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <>
            <div className={`filter-drawer-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header mb-3 position-relative">
                  <button type="button" className="btn-close filter-close" onClick={() => setSidebarOpen(false)} aria-label="Close"></button>
                  <h5 className="drawer-title text-center mb-1">{t('search.filterTitle')}</h5>
                  <p className="mb-0 text-muted small text-center">{t('search.filterSubtitle')}</p>
                </div>

                <div className="mb-4">
                  {allTypes.map((type) => (
                    <label key={type} className="form-check custom-filter-option d-flex align-items-center mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={type}
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                      />
                      <span className="form-check-label ms-2">{type}</span>
                    </label>
                  ))}
                </div>

                <div className="d-flex justify-content-between gap-3">
                  <button type="button" className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                    {t('search.clearFilters')}
                  </button>
                  <button type="button" className="btn btn-search w-100" onClick={() => setSidebarOpen(false)}>
                    {t('search.applyFilters')}
                  </button>
                </div>
              </div>
            </div>

            {filteredMedicines.length === 0 ? (
              <div className="text-center py-5 no-results-box my-4 rounded-4">
                <i className="bi bi-exclamation-circle text-muted fs-1 mb-2 d-block"></i>
                <h4 className="text-muted fw-bold m-0">{t('search.noResults')}</h4>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {paginatedMedicines.map((med) => (
                    <div key={med.id} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100 medicine-item-card border-0 p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <span className={`badge status-pill px-3 py-2 fw-medium ${med.inStock ? 'status-green' : 'status-red'}`}>
                            {med.inStock ? t('medications.inStock') : t('medications.outOfStock')}
                          </span>
                          <div className="icon-pill-circle d-flex align-items-center justify-content-center">
                            <i className="bi bi-capsule text-primary fs-5"></i>
                          </div>
                        </div>

                        <div className="text-start mb-3">
                          <h5 className="fw-bold text-dark medicine-main-title mb-1">{med.name}</h5>
                          <p className="text-muted active-sub-title mb-2">{med.active}</p>
                          <span className="badge type-chip mb-3">{med.type}</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
                          <div></div>
                          <button onClick={() => navigate(`/medicine-details/${med.id}`)} className="btn btn-link text-decoration-none action-details-link d-flex align-items-center gap-2 fw-medium p-0 border-0">
                            {t('search.details')}
                            <i className="bi bi-chevron-left arrow-icon"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center gap-2 mt-5 mb-4 pagination-controls" dir="ltr">
                    <button
                      className="btn btn-outline-primary px-4"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      {t('search.prev')}
                    </button>
                    <span className="fw-medium mx-3">
                      {t('search.pageOf', { current: currentPage, total: totalPages })}
                    </span>
                    <button
                      className="btn btn-outline-primary px-4"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      {t('search.next')}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
