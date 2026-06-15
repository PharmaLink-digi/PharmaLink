import { LuDollarSign, LuCalendar, LuClipboardList } from 'react-icons/lu'

function formatCurrency(n) {
  if (n == null) return '$0.00'
  return `$${Number(n).toFixed(2)}`
}

const trendStyles = {
  green: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-sky-100 text-sky-700',
  orange: 'bg-amber-100 text-amber-700',
}

export default function TopStats({ title, value = 0, trend = '', trendColor = 'blue' }) {
  return (
    <div className="bg-white rounded-[1.75rem] border border-slate-200/80 p-5 shadow-sm shadow-slate-200/80">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-50 text-brand-500">
          {title.includes('اليوم') ? <LuDollarSign size={20} /> : title.includes('شهر') ? <LuCalendar size={20} /> : <LuClipboardList size={20} />}
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{title.includes('الطلبات') ? value : formatCurrency(value)}</p>
        </div>
        {trend ? (
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${trendStyles[trendColor] || trendStyles.blue}`}>
            {trend}
          </span>
        ) : null}
      </div>
    </div>
  )
}
