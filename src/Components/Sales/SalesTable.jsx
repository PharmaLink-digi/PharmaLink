const getStatusBadgeClasses = (status) => {
  const s = (status || '').toString().toLowerCase()
  if (s === 'كافٍ' || s === 'good' || s === 'in_stock' || s === 'available') return 'badge bg-success'
  if (s === 'منخفض' || s === 'low' || s === 'limited') return 'badge bg-warning text-dark'
  if (s === 'ناقص' || s === 'out_of_stock' || s === 'unavailable') return 'badge bg-danger'
  return 'badge bg-secondary'
}

const getProgressClasses = (percent) => {
  if (percent >= 60) return 'bg-success'
  if (percent >= 35) return 'bg-warning'
  return 'bg-danger'
}

export default function SalesTable({ sales = [] }) {
  const totalRevenue = sales.reduce((sum, s) => sum + (s.total_price || 0), 0)
  const totalProfit = sales.reduce((sum, s) => sum + (s.net_profit || 0), 0)

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle table-bordered mb-4">
        <thead className="table-light text-end">
          <tr>
            <th scope="col">رقم الطلب</th>
            <th scope="col">اسم الدواء</th>
            <th scope="col">الكمية المباعة</th>
            <th scope="col">إجمالي المبيعات</th>
            <th scope="col">صافي الربح</th>
            <th scope="col">نسبة الربح</th>
            <th scope="col">حالة المخزون</th>
          </tr>
        </thead>
        <tbody className="text-end">
          {sales.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-secondary py-5">لا توجد مبيعات لعرضها</td>
            </tr>
          ) : (
            sales.map((s, index) => (
              <tr key={s.order_id || s.id || index}>
                <td className="fw-semibold">#{s.order_id}</td>
                <td>{s.medicine_name}</td>
                <td>{s.quantity ?? '-'}</td>
                <td>${(s.total_price || 0).toFixed(2)}</td>
                <td>${(s.net_profit || 0).toFixed(2)}</td>
                <td className="align-middle" style={{ minWidth: '180px' }}>
                  <div className="mb-2 small text-muted">{s.profit_percent}%</div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar ${getProgressClasses(s.profit_percent)}`}
                      role="progressbar"
                      style={{ width: `${s.profit_percent}%` }}
                      aria-valuenow={s.profit_percent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </td>
                <td>
                  <span className={getStatusBadgeClasses(s.stock_status)}>{s.stock_status}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
        <div className="text-secondary">عدد الصفوف: {sales.length}</div>
        <div className="text-end">
          <div className="small text-secondary">إجمالي المبيعات</div>
          <div className="fw-semibold">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="text-end">
          <div className="small text-secondary">إجمالي صافي الربح</div>
          <div className="fw-semibold">${totalProfit.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
