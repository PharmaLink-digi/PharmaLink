const fs = require('fs');

const arContent = fs.readFileSync('./src/locales/ar.js', 'utf8');
const enContent = fs.readFileSync('./src/locales/en.js', 'utf8');

const oldEn = {
  navbar: {
    home: 'Home',
    search: 'Search',
    dashboard: 'Dashboard',
    orders: 'Orders',
    notifications: 'Notifications',
    login: 'Login',
    signup: 'Sign Up'
  },
  hero: {
    badge: 'The Leading Health Platform',
    title: 'Your Health, <span>Connected</span>',
    description: 'An integrated platform connecting patients, pharmacies, warehouses, and pharmaceutical companies in a unified health ecosystem.',
    searchBtn: 'Search',
    searchPlaceholder: 'Search for a medicine or active ingredient...',
    startNow: 'Start Now',
    browseMedicines: 'Browse Medicines',
    stats: { patients: 'Patient', pharmacies: 'Pharmacy', medicines: 'Medicine' }
  },
  medications: {
    trendingTitle: 'Trending Medicines',
    trendingSubtitle: 'Most searched medicines this week',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    viewAll: 'View all medicines'
  },
  testimonials: {
    eyebrow: 'Trusted by thousands',
    title: 'User Experiences with PharmaLink',
    subtitle: 'Latest reports from patients and pharmacies on how our platform helped them save time and easily manage medications.',
    review1: '\"PharmaLink made it easy to find my medications near me. It saves real time and makes the purchasing experience much simpler.\"',
    review1Author: 'Ahmed Al-Rashidi',
    review1Role: 'Patient',
    review2: '\"Inventory management and order receiving have never been this organized. Simple and powerful user interface.\"',
    review2Author: 'Al-Shifa Pharmacy',
    review2Role: 'Pharmacy',
    review3: '\"Even my elderly parents could use the service easily. Excellent design and a comfortable experience for everyone.\"',
    review3Author: 'Sarah Al-Otaibi',
    review3Role: 'Patient'
  },
  joinNow: {
    title: 'Join thousands of users today',
    subtitle: 'Sign up for free and benefit from the best smart experience for medication and healthcare management.',
    button: 'Create Free Account'
  },
  footer: {
    brandCopy: 'The integrated healthcare platform connecting patients, pharmacies, and pharmaceutical companies.',
    product: 'Product',
    searchMedicines: 'Search Medicines',
    register: 'Register',
    company: 'Company',
    about: 'About',
    privacy: 'Privacy',
    language: 'Language',
    rights: '© 2026 PharmaLink. All rights reserved.'
  },
  category: {
    title: 'Browse by Category',
    viewAll: 'View All Medicines',
    medicineCount: '{{count}} Medicine'
  },
  search: {
    title: 'Search Medicines',
    subtitle: 'Search using medicine name or active ingredient',
    placeholder: 'Search for medicines...',
    searchBtn: 'Search',
    filtersBtn: 'Filters',
    loading: 'Loading data...',
    resultsCount: '{{count}} results',
    filterTitle: 'Filter by Type',
    filterSubtitle: 'Choose the type to show appropriate medicines',
    clearFilters: 'Clear Filters',
    applyFilters: 'Apply Filters',
    noResults: 'No results found',
    currency: 'EGP',
    details: 'Details',
    prev: 'Previous',
    next: 'Next',
    pageOf: 'Page {{current}} of {{total}}'
  },
  auth: {
    welcomeBack: 'Welcome Back',
    loginToContinue: 'Log in to continue',
    accountType: 'Account Type',
    patient: 'Patient',
    pharmacy: 'Pharmacy',
    warehouse: 'Warehouse',
    company: 'Pharma Company',
    email: 'Email Address',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    passwordPlaceholder: 'Enter your password',
    loginBtn: 'Log In',
    noAccount: 'Don\'t have an account?',
    registerNow: 'Register Now',
    loginAlert: 'Welcome {{type}}! Logging in...',
    signupTitle: 'Signup Page',
    signupDesc: 'This is a placeholder signup page. Implement registration form here.',
    goToHome: 'Go to Home'
  }
};

const oldAr = {
  navbar: {
    home: 'الرئيسية',
    search: 'بحث',
    dashboard: 'لوحة التحكم',
    orders: 'الطلبات',
    notifications: 'الإشعارات',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب'
  },
  hero: {
    badge: 'المنصة الصحية الرائدة',
    title: 'صحتك، <span>متصلة</span>',
    description: 'منصة متكاملة تربط المرضى، الصيدليات، المستودعات، وشركات الأدوية في نظام صحي موحد.',
    searchBtn: 'بحث',
    searchPlaceholder: 'ابحث عن دواء أو مادة فعالة...',
    startNow: 'ابدأ الآن',
    browseMedicines: 'تصفح الأدوية',
    stats: { patients: 'مريض', pharmacies: 'صيدلية', medicines: 'دواء' }
  },
  medications: {
    trendingTitle: 'الأدوية الشائعة',
    trendingSubtitle: 'الأدوية الأكثر بحثاً هذا الأسبوع',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    viewAll: 'عرض كل الأدوية'
  },
  testimonials: {
    eyebrow: 'موثوق به من قبل الآلاف',
    title: 'تجارب المستخدمين مع PharmaLink',
    subtitle: 'أحدث التقارير من المرضى والصيدليات حول كيف ساعدتهم منصتنا على توفير الوقت وإدارة الأدوية بسهولة.',
    review1: '\"PharmaLink جعل من السهل العثور على أدويتي بالقرب مني. إنه يوفر وقتاً حقيقياً ويجعل تجربة الشراء أكثر بساطة.\"',
    review1Author: 'أحمد الراشدي',
    review1Role: 'مريض',
    review2: '\"إدارة المخزون واستلام الطلبات لم تكن بهذا التنظيم من قبل. واجهة مستخدم بسيطة وقوية.\"',
    review2Author: 'صيدلية الشفاء',
    review2Role: 'صيدلية',
    review3: '\"حتى والدي المسنين استطاعوا استخدام الخدمة بسهولة. تصميم ممتاز وتجربة مريحة للجميع.\"',
    review3Author: 'سارة العتيبي',
    review3Role: 'مريض'
  },
  joinNow: {
    title: 'انضم إلى آلاف المستخدمين اليوم',
    subtitle: 'سجّل مجاناً واستفد من أفضل تجربة ذكية لإدارة الأدوية والرعاية الصحية.',
    button: 'إنشاء حساب مجاني'
  },
  footer: {
    brandCopy: 'المنصة الصحية المتكاملة التي تربط المرضى، الصيدليات، وشركات الأدوية.',
    product: 'المنتج',
    searchMedicines: 'البحث عن الأدوية',
    register: 'تسجيل',
    company: 'الشركة',
    about: 'عنا',
    privacy: 'الخصوصية',
    language: 'اللغة',
    rights: '© 2026 PharmaLink. جميع الحقوق محفوظة.'
  },
  category: {
    title: 'تصفح حسب الفئة',
    viewAll: 'عرض كل الأدوية',
    medicineCount: '{{count}} دواء'
  },
  search: {
    title: 'البحث عن الأدوية',
    subtitle: 'ابحث باستخدام اسم الدواء أو المكون الفعال',
    placeholder: 'ابحث عن الأدوية...',
    searchBtn: 'بحث',
    filtersBtn: 'الفلاتر',
    loading: 'جارٍ تحميل البيانات...',
    resultsCount: 'نتائج {{count}}',
    filterTitle: 'التصفية حسب النوع',
    filterSubtitle: 'اختر النوع لعرض الأدوية المناسبة',
    clearFilters: 'مسح الفلاتر',
    applyFilters: 'تطبيق الفلاتر',
    noResults: 'لا توجد نتائج',
    currency: 'جنيهاً',
    details: 'تفاصيل',
    prev: 'السابق',
    next: 'التالي',
    pageOf: 'صفحة {{current}} من {{total}}'
  },
  auth: {
    welcomeBack: 'مرحباً بعودتك',
    loginToContinue: 'سجل دخولك للمتابعة',
    accountType: 'نوع الحساب',
    patient: 'مريض',
    pharmacy: 'صيدلية',
    warehouse: 'مستودع',
    company: 'شركة أدوية',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    password: 'كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    passwordPlaceholder: 'أدخل كلمة المرور',
    loginBtn: 'تسجيل الدخول',
    noAccount: 'ليس لديك حساب؟',
    registerNow: 'سجل الآن',
    loginAlert: 'مرحباً {{type}}! يتم تسجيل الدخول...',
    signupTitle: 'صفحة التسجيل',
    signupDesc: 'هذه صفحة تسجيل مؤقتة. قم بتنفيذ نموذج التسجيل هنا.',
    goToHome: 'الذهاب للرئيسية'
  }
};

const getObj = (str) => {
  let jsonStr = str.replace(/export default /g, "").replace(/;[\s]*$/g, "");
  return eval("(" + jsonStr + ")");
};

let enData = getObj(enContent);
let arData = getObj(arContent);

if (enData.translation) enData = enData.translation;
if (arData.translation) arData = arData.translation;

enData = { ...oldEn, ...enData };
arData = { ...oldAr, ...arData };

// Deep merge for search and auth
enData.search = { ...oldEn.search, ...enData.search };
arData.search = { ...oldAr.search, ...arData.search };
enData.auth = { ...oldEn.auth, ...enData.auth };
arData.auth = { ...oldAr.auth, ...arData.auth };

fs.writeFileSync('./src/locales/en.js', "export default " + JSON.stringify(enData, null, 2) + ";");
fs.writeFileSync('./src/locales/ar.js', "export default " + JSON.stringify(arData, null, 2) + ";");
console.log('Merge complete!');
