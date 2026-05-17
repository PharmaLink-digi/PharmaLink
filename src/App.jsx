function App() {
  return (
    <div className="app-root" dir="rtl">
      <header className="navbar">
        <div className="logo">
          PharmaLink <span className="logo-icon">🔗</span>
        </div>

        <ul className="nav-links">
          <li><a href="#" className="active">الرئيسية</a></li>
          <li><a href="#">بحث</a></li>
          <li><a href="#">لوحة التحكم</a></li>
          <li><a href="#">الطلبات</a></li>
          <li><a href="#">الإشعارات</a></li>
        </ul>

        <div className="nav-actions">
          <button type="button" className="btn-lang">EN</button>
          <button type="button" className="btn-login">تسجيل الدخول</button>
          <button type="button" className="btn-signup">إنشاء حساب</button>
        </div>
      </header>

      <main className="hero">
        <div className="badge">• المنصة الصحية الرائدة</div>

        <h1>صحتك، <span className="highlight">مترابطة</span></h1>

        <p>منصة متكاملة تربط المرضى والصيدليات والمستودعات وشركات الأدوية في نظام بيئي صحي موحد.</p>

        <div className="search-box">
          <input type="text" placeholder="ابحث عن دواء أو مادة فعالة..." />
          <button type="button" className="btn-search">بحث</button>
        </div>

        <div className="cta-buttons">
          <button type="button" className="btn-browse">&lt; تصفح الأدوية</button>
          <button type="button" className="btn-start">ابدأ الآن</button>
        </div>

        <div className="stats">
          <div className="stat-item">
            <h3>+50K</h3>
            <span>مريض</span>
          </div>
          <div className="stat-item">
            <h3>+1,200</h3>
            <span>صيدلية</span>
          </div>
          <div className="stat-item">
            <h3>+10K</h3>
            <span>دواء</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
