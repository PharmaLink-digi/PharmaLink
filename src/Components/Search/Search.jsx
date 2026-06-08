import { useEffect, useMemo, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Search.css';
import { fetchMedications } from '../../api';

const mapMedication = (item) => ({
  id: item.medication_id,
  name: item.medication_name,
  active: `${item.medication_type} • ${item.manufacturer}`,
  type: item.category || 'عام',
  price: Number((5 + (item.medication_id % 10) * 2.35).toFixed(2)),
  rating: Number((3.5 + (item.medication_id % 3) * 0.5).toFixed(1)),
  status: item.medication_id % 7 === 0 ? 'إنتهى من المخزن' : 'في الأوراق المالية',
  inStock: item.medication_id % 7 !== 0,
});

export default function Search() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchMedications();
        if (!Array.isArray(data)) {
          throw new Error('تنسيق الاستجابة غير صحيح من الخادم');
        }
        const transformed = data.map(mapMedication);
        const useItems = transformed.length > 12 ? transformed.slice(0, Math.ceil(transformed.length / 2)) : transformed;
        setMedicines(useItems);
      } catch (fetchError) {
        setError(fetchError.message || 'حدث خطأ أثناء جلب البيانات');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const allTypes = useMemo(
    () => Array.from(new Set(medicines.map((item) => item.type))),
    [medicines]
  );

  const filteredMedicines = medicines.filter((medicine) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      medicine.name.toLowerCase().includes(term) ||
      medicine.active.toLowerCase().includes(term) ||
      medicine.type.toLowerCase().includes(term);
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(medicine.type);
    return matchesSearch && matchesType;
  });

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
          <h2 className="fw-bold text-dark header-title mb-1">البحث عن الأدوية</h2>
          <p className="text-muted subtitle-text">ابحث باستخدام اسم الدواء أو المكون الفعال</p>
        </div>

        <div className="row g-3 mb-4 align-items-center">
          <div className="col-12 col-md-8 col-lg-7">
            <div className="position-relative search-input-wrapper">
              <input
                type="text"
                className="form-control search-field py-3 pe-4 ps-5"
                placeholder="ابحث عن الأدوية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="bi bi-search search-field-icon position-absolute"></i>
            </div>
          </div>
          <div className="col-6 col-md-2 col-lg-2">
            <button type="button" className="btn btn-search w-100 py-3 fw-medium">
              بحث
            </button>
          </div>
          <div className="col-6 col-md-2 col-lg-3">
            <button
              type="button"
              className="btn btn-filter w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-medium"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-sliders"></i>
              الفلاتر
            </button>
          </div>
        </div>

        <div className="text-end mb-4 results-count-text text-secondary fw-semibold">
          {loading ? 'جارٍ تحميل البيانات...' : `نتائج ${filteredMedicines.length}`}
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
                  <h5 className="drawer-title text-center mb-1">التصفية حسب النوع</h5>
                  <p className="mb-0 text-muted small text-center">اختر النوع لعرض الأدوية المناسبة</p>
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
                    مسح الفلاتر
                  </button>
                  <button type="button" className="btn btn-search w-100" onClick={() => setSidebarOpen(false)}>
                    تطبيق الفلاتر
                  </button>
                </div>
              </div>
            </div>

            {filteredMedicines.length === 0 ? (
              <div className="text-center py-5 no-results-box my-4 rounded-4">
                <i className="bi bi-exclamation-circle text-muted fs-1 mb-2 d-block"></i>
                <h4 className="text-muted fw-bold m-0">لا توجد نتائج</h4>
              </div>
            ) : (
              <div className="row g-4">
                {filteredMedicines.map((med) => (
                  <div key={med.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card h-100 medicine-item-card border-0 p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className={`badge status-pill px-3 py-2 fw-medium ${med.inStock ? 'status-green' : 'status-red'}`}>
                          {med.status}
                        </span>
                        <div className="icon-pill-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-capsule text-primary fs-5"></i>
                        </div>
                      </div>

                      <div className="text-start mb-3">
                        <h5 className="fw-bold text-dark medicine-main-title mb-1">{med.name}</h5>
                        <p className="text-muted active-sub-title mb-2">{med.active}</p>
                        <span className="badge type-chip mb-3">{med.type}</span>
                        <div className="d-flex align-items-center gap-1 rating-stars">
                          {Array.from({ length: 5 }).map((_, idx) => {
                            const isFilled = idx < Math.round(med.rating);
                            return (
                              <i
                                key={idx}
                                className={`bi ${isFilled ? 'bi-star-fill star-filled' : 'bi-star star-empty'}`}
                              ></i>
                            );
                          })}
                          <span className="rating-score text-muted ms-2">{med.rating}</span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
                        <div className="price-tag fw-bold text-dark fs-5">
                          <span className="price-currency fs-6 fw-normal text-secondary me-1">دولارًا</span>
                          {med.price.toFixed(2)}
                        </div>
                        <a href={`#details-${med.id}`} className="text-decoration-none action-details-link d-flex align-items-center gap-2 fw-medium">
                          تفاصيل
                          <i className="bi bi-chevron-left arrow-icon"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
