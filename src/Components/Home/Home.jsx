import './Home.css'

export default function Home() {
  return (
    <>
      <section className="testimonials-section py-5" dir="rtl">
        <div className="container px-4 px-md-5">
          <div className="text-center mb-5">
            <p className="eyebrow-text mb-2">موثوق به من قبل الآلاف</p>
            <h2 className="section-title mb-3">تجارب المستخدمين مع PharmaLink</h2>
            <p className="section-subtitle mx-auto text-muted">
              أحدث التقارير من المرضى والصيدليات حول كيف ساعدتهم منصتنا على توفير الوقت وإدارة الأدوية بسهولة.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="testimonial-card p-4 h-100 rounded-4">
                <div className="stars mb-3">
                  {[...Array(5)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill"></i>
                  ))}
                </div>
                <p className="testimonial-text text-secondary mb-4"> 
                  "PharmaLink جعل من السهل العثور على أدويتي بالقرب مني. إنه يوفر وقتًا حقيقيًا ويجعل تجربة الشراء أكثر بساطة."
                </p>
                <div className="testimonial-author d-flex align-items-center gap-3">
                  <div className="avatar-circle">A</div>
                  <div>
                    <p className="mb-1 fw-bold">أحمد الراشدي</p>
                    <p className="text-muted small mb-0">مريض</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="testimonial-card p-4 h-100 rounded-4">
                <div className="stars mb-3">
                  {[...Array(5)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill"></i>
                  ))}
                </div>
                <p className="testimonial-text text-secondary mb-4">
                  "إدارة المخزون واستلام الطلبات لم تكن بهذا التنظيم من قبل. واجهة مستخدم بسيطة وقوية."
                </p>
                <div className="testimonial-author d-flex align-items-center gap-3">
                  <div className="avatar-circle">A</div>
                  <div>
                    <p className="mb-1 fw-bold">صيدلية الشفاء</p>
                    <p className="text-muted small mb-0">صيدلية</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="testimonial-card p-4 h-100 rounded-4">
                <div className="stars mb-3">
                  {[...Array(5)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill"></i>
                  ))}
                </div>
                <p className="testimonial-text text-secondary mb-4">
                  "حتى والدي المسنين استطاعوا استخدام الخدمة بسهولة. تصميم ممتاز وتجربة مريحة للجميع."
                </p>
                <div className="testimonial-author d-flex align-items-center gap-3">
                  <div className="avatar-circle">S</div>
                  <div>
                    <p className="mb-1 fw-bold">سارة العتيبي</p>
                    <p className="text-muted small mb-0">مريضة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section py-5" dir="rtl">
        <div className="container px-4 px-md-5">
          <div className="cta-box rounded-4 p-5 text-center text-white">
            <h2 className="fw-bold mb-3">انضم إلى آلاف المستخدمين اليوم</h2>
            <p className="mb-4">
              سجّل مجاناً واستفد من أفضل تجربة ذكية لإدارة الأدوية والرعاية الصحية.
            </p>
            <button type="button" className="btn btn-cta btn-lg px-5">
              إنشاء حساب مجاني
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
