import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaCapsules,
  FaHeartbeat,
  FaWind,
  FaSun,
  FaStethoscope,
  FaFire,
  FaCircle,
  FaSearch,
  FaArrowLeft,
} from "react-icons/fa";

const categories = [
  {
    name: "Antibiotics",
    count: "1 دواء",
    icon: <FaCapsules />,
  },
  {
    name: "Pain Relief",
    count: "2 دواء",
    icon: <FaHeartbeat />,
  },
  {
    name: "Diabetes",
    count: "1 دواء",
    icon: <FaFire />,
  },
  {
    name: "Cardiovascular",
    count: "1 دواء",
    icon: <FaHeart />,
  },
  {
    name: "Respiratory",
    count: "2 دواء",
    icon: <FaWind />,
  },
  {
    name: "Vitamins",
    count: "1 دواء",
    icon: <FaSun />,
  },
  {
    name: "Digestive",
    count: "1 دواء",
    icon: <FaCircle />,
  },
  {
    name: "Dermatology",
    count: "1 دواء",
    icon: <FaStethoscope />,
  },
];

export default function Home() {
  const navigate = useNavigate();

  const handleCategory = (category) => {
    navigate(`/search?category=${category}`);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <span className="hero-badge">
              <span className="dot"></span>
              المنصة الصحية الرائدة
            </span>

            <h1 className="hero-title">
              صحتك، <span>مرتبطة</span>
            </h1>

            <p className="hero-text">
              منصة متكاملة تربط المرضى والصيدليات والمستودعات وشركات الأدوية
              في نظام بيئي صحي موحد.
            </p>

            <div className="hero-search">
              <button>بحث</button>

              <div className="search-input">
                <FaSearch />
                <input
                  type="text"
                  placeholder="ابحث عن دواء أو مادة فعالة..."
                />
              </div>
            </div>

            <div className="hero-buttons">
              <Link to="/signup" className="start-btn">
                ابدأ الآن
              </Link>

              <Link to="/search" className="browse-btn">
                تصفح الأدوية
                <FaArrowLeft />
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <h3>+50K</h3>
                <p>مريض</p>
              </div>

              <div>
                <h3>+1,200</h3>
                <p>صيدلية</p>
              </div>

              <div>
                <h3>+10K</h3>
                <p>دواء</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">تصفح حسب الفئة</h2>

          <div className="categories-grid">
            {categories.map((item, index) => (
              <div
                key={index}
                className="category-card"
                onClick={() => handleCategory(item.name)}
              >
                <div className="category-icon">{item.icon}</div>

                <div className="category-content">
                  <h4>{item.name}</h4>
                  <p>{item.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}