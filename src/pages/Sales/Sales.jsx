import { useContext, useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import TopStats from '../../Components/Sales/TopStats'
import SalesTable from '../../Components/Sales/SalesTable'
import SearchBar from '../../Components/Sales/SearchBar'
import { AuthContext } from '../../contexts/AuthContext'
import { fetchSales } from '../../api'

const mockSalesData = [
  {
    order_id: 'SALES-8839',
    medicine_name: 'Panadol Advance',
    quantity: 3,
    total_price: 45.0,
    cost_price: 30.0,
    net_profit: 15.0,
    profit_percent: 33,
    stock_status: 'كافٍ',
    date: '2026-06-06T10:15:00Z',
  },
  {
    order_id: 'SALES-8830',
    medicine_name: 'City Care Pharmacy',
    quantity: 2,
    total_price: 15.0,
    cost_price: 11.5,
    net_profit: 3.5,
    profit_percent: 23,
    stock_status: 'منخفض',
    date: '2026-06-06T12:20:00Z',
  },
  {
    order_id: 'SALES-8831',
    medicine_name: 'Amoxicillin',
    quantity: 1,
    total_price: 15.0,
    cost_price: 8.5,
    net_profit: 6.5,
    profit_percent: 43,
    stock_status: 'ناقص',
    date: '2026-06-06T09:40:00Z',
  },
  {
    order_id: 'SALES-8832',
    medicine_name: 'Panadol Inhaler',
    quantity: 12,
    total_price: 45.0,
    cost_price: 29.0,
    net_profit: 16.0,
    profit_percent: 36,
    stock_status: 'كافٍ',
    date: '2026-06-06T14:05:00Z',
  },
]

const normalizeSale = (sale, index) => {
  const orderId = sale.order_id || sale.id || sale.orderNumber || `SALES-${index + 1}`
  const medicineName = sale.medicine_name || sale.product_name || sale.drug_name || 'غير معروف'
  const quantity = Number(sale.quantity ?? sale.qty ?? sale.sold_qty ?? sale.packs ?? 0)
  const totalPrice = Number(sale.total_price ?? sale.total_revenue ?? sale.revenue ?? 0)
  const costPrice = Number(sale.cost_price ?? sale.cost ?? sale.purchase_cost ?? Math.max(totalPrice * 0.65, 0))
  const netProfit = Number(sale.net_profit ?? totalPrice - costPrice)
  const profitPercent = Number(sale.profit_percent ?? (totalPrice > 0 ? Math.round((netProfit / totalPrice) * 100) : 0))
  const stockStatusValue = (sale.stock_status || sale.status || '').toString().trim()
  const stockStatus = stockStatusValue
    ? stockStatusValue === 'كافٍ' || stockStatusValue === 'good' || stockStatusValue === 'in_stock' || stockStatusValue === 'available'
      ? 'كافٍ'
      : stockStatusValue === 'منخفض' || stockStatusValue === 'low' || stockStatusValue === 'limited'
      ? 'منخفض'
      : stockStatusValue === 'ناقص' || stockStatusValue === 'out_of_stock' || stockStatusValue === 'unavailable'
      ? 'ناقص'
      : stockStatusValue
    : quantity <= 0
    ? 'ناقص'
    : quantity <= 3
    ? 'منخفض'
    : 'كافٍ'

  return {
    ...sale,
    order_id: orderId,
    medicine_name: medicineName,
    quantity,
    total_price: totalPrice,
    cost_price: costPrice,
    net_profit: netProfit,
    profit_percent: Math.min(Math.max(profitPercent, 0), 100),
    stock_status: stockStatus,
  }
}

function Sales() {
  const auth = useContext(AuthContext) || {}
  const user = auth.user || auth
  const [pharmacyId] = useState(() => {
    if (typeof window === 'undefined') return '5'
    return sessionStorage.getItem('pharmacyId') || '5'
  })
  const [sales, setSales] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('pharmacyId')) {
      sessionStorage.setItem('pharmacyId', '5')
    }
  }, [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let mounted = true
    async function fetchSalesData() {
      if (!pharmacyId) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchSales(pharmacyId)
        if (mounted) {
          const loaded = Array.isArray(data) ? data : []
          setSales(loaded.map(normalizeSale))
        }
      } catch (fetchError) {
        if (mounted) {
          setError('تعذر تحميل البيانات من الخادم؛ عرض بيانات محلية مؤقتة.')
          setSales(mockSalesData.map(normalizeSale))
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchSalesData()
    return () => { mounted = false }
  }, [pharmacyId])

  if (!user || user.role !== 'pharmacy') {
    return (
      <div className="min-vh-100 bg-light p-4" dir="rtl">
        <div className="container py-5">
          <div className="card shadow-sm rounded-4">
            <div className="card-body text-center">
              <h2 className="h4 mb-3">غير مصرح</h2>
              <p className="text-secondary mb-0">هذه الصفحة متاحة لأصحاب دور الصيدلية فقط.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const todayIso = new Date().toISOString().slice(0, 10)
  const totalSalesToday = sales
    .filter((s) => s.date && s.date.slice(0, 10) === todayIso)
    .reduce((sum, s) => sum + (s.total_price || 0), 0)

  const now = new Date()
  const monthlyRevenue = sales
    .filter((s) => {
      if (!s.date) return false
      const d = new Date(s.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, s) => sum + (s.total_price || 0), 0)

  const pendingOrders = sales.filter((s) => {
    const st = (s.status || '').toString().toLowerCase()
    return st === 'pending' || st === 'processing' || st === 'قيد المعالجة' || st === 'waiting' || st === 'في الانتظار' || st === 'قيد الانتظار'
  }).length

  const normalizedSearch = searchTerm.toLowerCase().trim()
  const filtered = sales.filter((s) => {
    if (!normalizedSearch) return true
    const query = normalizedSearch.replace(/^#/, '')
    const order = (s.order_id || '').toString().toLowerCase()
    const name = (s.medicine_name || '').toString().toLowerCase()
    return order.includes(query) || name.includes(query)
  })

  const lowStockAlerts = sales.filter((s) => s.stock_status === 'منخفض' || s.stock_status === 'ناقص')

  return (
    <main className="bg-light py-5" dir="rtl">
      <div className="container-fluid px-4">
        <div className="row align-items-center justify-content-between mb-4 gy-3">
          <div className="col-auto">
            <h1 className="h3 mb-1">لوحة تحكم الصيدلية - المبيعات</h1>
            <p className="text-muted mb-0">PHARM-ID: {pharmacyId || '-----'}</p>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary rounded-pill px-4 py-2 shadow-sm">
              <LuPlus size={16} className="me-2" /> طلب توريد جديد
            </button>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
          <div className="col">
            <TopStats
              title="إجمالي مبيعات اليوم"
              value={totalSalesToday}
              trend="+12%"
              trendColor="green"
            />
          </div>
          <div className="col">
            <TopStats
              title="مبيعات الشهر الحالي"
              value={monthlyRevenue}
              trend="+8%"
              trendColor="green"
            />
          </div>
          <div className="col">
            <TopStats
              title="الطلبات الجديدة (قيد الانتظار)"
              value={pendingOrders}
              trend=""
              trendColor="blue"
            />
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom py-4">
            <div className="row gy-3 align-items-center">
              <div className="col-md-6">
                <h2 className="h5 mb-1">جدول المبيعات التفصيلي</h2>
                <p className="text-muted mb-0">اعرض سجلات المبيعات وابحث عن الطلبات بسرعة.</p>
              </div>
              <div className="col-md-6 text-md-end">
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="البحث عن مبيعات..." />
              </div>
            </div>
          </div>

          <div className="card-body">
            {loading && <div className="text-secondary">جارٍ التحميل...</div>}
            {error && <div className="alert alert-warning py-2">{error}</div>}

            <div className="row gy-4">
              <div className="col-12 col-xl-8">
                {!loading && <SalesTable sales={filtered} />}
              </div>
              <div className="col-12 col-xl-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h3 className="h6 mb-3">الأدوية الناقصة وتنبيهات التوريد</h3>
                    <p className="text-muted small mb-3">عرض الأدوية ذات المخزون المنخفض أو الناقص تلقائياً.</p>
                    {lowStockAlerts.length === 0 ? (
                      <div className="text-center py-4 text-secondary">لا توجد تنبيهات حالياً.</div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {lowStockAlerts.map((item) => (
                          <div key={item.order_id} className="list-group-item px-0 py-3 border-0">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <div className="fw-semibold">{item.medicine_name}</div>
                                <div className="text-secondary small">رقم الطلب #{item.order_id}</div>
                              </div>
                              <span className={`badge rounded-pill ${item.stock_status === 'كافٍ' ? 'bg-success' : item.stock_status === 'منخفض' ? 'bg-warning text-dark' : 'bg-danger'}`}>{item.stock_status}</span>
                            </div>
                            <div className="mt-2 small text-secondary">الكمية المباعة: {item.quantity}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Sales
