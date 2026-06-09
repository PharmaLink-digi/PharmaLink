import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Pill,
  LayoutGrid,
  Package,
  Heart,
  Clock,
  Bell,
  Settings,
  LogOut,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronLeft,
  Plus,
  Search,
  User,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "فارما لينك — طلباتي" },
      { name: "description", content: "تتبع وإدارة طلبات الصيدلية." },
    ],
  }),
  component: OrdersPage,
});

const API = "https://pharmalink-back-end.onrender.com";

type Order = {
  order_id: number;
  client_id: number;
  pharm_id: number;
  order_date: string;
  status: string;
};
type Pharm = { pharm_id: number; pharm_name: string };
type Client = { client_id: number; client_name: string; email: string };
type OrderDetail = {
  order_detail_id: number;
  order_id: number;
  pharm_id: number;
  client_id: number;
  medication_id: number;
  medication_name: string;
  medication_type: string;
  category: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type UIStatus = "pending" | "processing" | "delivered" | "cancelled";

function mapStatus(s: string, order_id: number): UIStatus {
  const v = (s || "").toLowerCase();
  if (v === "cancelled") return "cancelled";
  if (v === "pending") return order_id % 2 === 0 ? "processing" : "pending";
  if (v === "completed" || v === "delivered") return "delivered";
  return "pending";
}

const statusMeta: Record<
  UIStatus,
  { label: string; badge: string; iconBg: string; iconColor: string; Icon: typeof CheckCircle2 }
> = {
  delivered: {
    label: "تم التوصيل",
    badge: "bg-emerald-100 text-emerald-700",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    Icon: CheckCircle2,
  },
  processing: {
    label: "قيد التجهيز",
    badge: "bg-blue-100 text-blue-700",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    Icon: Truck,
  },
  pending: {
    label: "قيد الانتظار",
    badge: "bg-amber-100 text-amber-700",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    Icon: Clock,
  },
  cancelled: {
    label: "ملغي",
    badge: "bg-rose-100 text-rose-700",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    Icon: XCircle,
  },
};

const TABS: { key: "all" | UIStatus; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "قيد الانتظار" },
  { key: "processing", label: "قيد التجهيز" },
  { key: "delivered", label: "تم التوصيل" },
  { key: "cancelled", label: "ملغي" },
];

const NAV = [
  { icon: LayoutGrid, label: "الرئيسية", key: "dashboard" },
  { icon: Package, label: "طلباتي", key: "orders" },
  { icon: Heart, label: "الأدوية المحفوظة", key: "saved" },
  { icon: Clock, label: "التذكيرات", key: "reminders" },
  { icon: Bell, label: "الإشعارات", key: "notifications" },
];

async function fetchJson<T>(path: string): Promise<T> {
  const r = await fetch(API + path);
  if (!r.ok) throw new Error("Failed: " + path);
  return r.json();
}

function OrdersPage() {
  const [tab, setTab] = useState<"all" | UIStatus>("all");
  const [active, setActive] = useState("orders");
  const [patientId, setPatientId] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const toggleExpanded = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const clientsQ = useQuery({ queryKey: ["clients"], queryFn: () => fetchJson<Client[]>("/clients") });
  const ordersQ = useQuery({ queryKey: ["orders"], queryFn: () => fetchJson<Order[]>("/orders") });
  const pharmsQ = useQuery({ queryKey: ["pharms"], queryFn: () => fetchJson<Pharm[]>("/pharm-info") });
  const detailsQ = useQuery({
    queryKey: ["order-details"],
    queryFn: () => fetchJson<OrderDetail[]>("/order-details"),
  });

  // Auto-pick first patient that has orders
  const effectivePatientId = useMemo(() => {
    if (patientId !== null) return patientId;
    if (!ordersQ.data || !clientsQ.data) return null;
    const withOrders = clientsQ.data.find((c) =>
      ordersQ.data!.some((o) => o.client_id === c.client_id),
    );
    return withOrders?.client_id ?? clientsQ.data[0]?.client_id ?? null;
  }, [patientId, ordersQ.data, clientsQ.data]);

  const currentClient = useMemo(
    () => clientsQ.data?.find((c) => c.client_id === effectivePatientId) ?? null,
    [clientsQ.data, effectivePatientId],
  );

  const pharmMap = useMemo(() => {
    const m = new Map<number, string>();
    pharmsQ.data?.forEach((p) => m.set(p.pharm_id, p.pharm_name));
    return m;
  }, [pharmsQ.data]);

  const detailsByOrder = useMemo(() => {
    const m = new Map<number, OrderDetail[]>();
    detailsQ.data?.forEach((d) => {
      const arr = m.get(d.order_id) ?? [];
      arr.push(d);
      m.set(d.order_id, arr);
    });
    return m;
  }, [detailsQ.data]);

  const totalsMap = useMemo(() => {
    const m = new Map<number, number>();
    detailsQ.data?.forEach((d) => {
      m.set(d.order_id, (m.get(d.order_id) ?? 0) + Number(d.line_total || 0));
    });
    return m;
  }, [detailsQ.data]);

  const enriched = useMemo(() => {
    const list = (ordersQ.data ?? []).filter(
      (o) => effectivePatientId === null || o.client_id === effectivePatientId,
    );
    return list.map((o) => {
      const ui = mapStatus(o.status, o.order_id);
      const total = totalsMap.get(o.order_id) ?? 0;
      const progress =
        ui === "delivered" ? 100 : ui === "cancelled" ? 0 : ui === "processing" ? 35 + (o.order_id % 60) : 10 + (o.order_id % 25);
      return {
        ...o,
        ui,
        total,
        pharmacy: pharmMap.get(o.pharm_id) ?? `صيدلية #${o.pharm_id}`,
        progress: Math.min(95, progress),
      };
    });
  }, [ordersQ.data, pharmMap, totalsMap, effectivePatientId]);

  const filtered = useMemo(
    () => (tab === "all" ? enriched : enriched.filter((o) => o.ui === tab)),
    [enriched, tab],
  );

  const loading = ordersQ.isLoading || pharmsQ.isLoading || detailsQ.isLoading || clientsQ.isLoading;

  // Patients that actually have orders for the picker
  const patientsWithOrders = useMemo(() => {
    if (!clientsQ.data || !ordersQ.data) return [];
    const ids = new Set(ordersQ.data.map((o) => o.client_id));
    return clientsQ.data.filter((c) => ids.has(c.client_id)).slice(0, 200);
  }, [clientsQ.data, ordersQ.data]);

  return (
    <div dir="rtl" className="flex min-h-screen bg-slate-50 text-slate-900 font-[system-ui]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-l border-slate-200 bg-white md:flex">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-sm">
            <Pill className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-l from-sky-600 to-emerald-500 bg-clip-text text-xl font-bold text-transparent">
            فارما لينك
          </span>
        </div>

        <div className="mx-4 mt-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
            <User className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">نوع الحساب</p>
            <p className="text-sm font-semibold">مريض</p>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-3">
          {NAV.map(({ icon: Icon, label, key }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active === key
                  ? "bg-gradient-to-l from-sky-50 to-emerald-50 text-sky-700 shadow-sm ring-1 ring-sky-100"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-200 px-3 py-3">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Settings className="h-4 w-4" /> الإعدادات
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50">
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs text-slate-500">أهلاً بعودتك</p>
            <p className="text-base font-semibold">
              {currentClient ? currentClient.client_name : "مريض"}
              {currentClient && (
                <span className="mr-2 text-xs font-normal text-slate-500">
                  (رقم المريض: {currentClient.client_id})
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={effectivePatientId ?? ""}
              onChange={(e) => setPatientId(Number(e.target.value))}
              className="rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              {patientsWithOrders.map((c) => (
                <option key={c.client_id} value={c.client_id}>
                  {c.client_name} — #{c.client_id}
                </option>
              ))}
            </select>
            <button className="relative rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
              <Search className="h-4 w-4" />
            </button>
            <button className="relative rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
              <Bell className="h-4 w-4" />
              <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">طلباتي</h1>
              <p className="mt-1 text-sm text-slate-500">
                تتبع وإدارة الطلبات الخاصة بك
                {currentClient && ` — إجمالي ${enriched.length} طلب`}
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-sky-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:opacity-95">
              <Plus className="h-4 w-4" /> طلب جديد
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex flex-wrap gap-1 rounded-xl bg-white p-1 ring-1 ring-slate-200">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  tab === t.key
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="mt-6 space-y-3">
            {loading && (
              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200" />
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">
                لا توجد طلبات في هذا القسم.
              </div>
            )}

            {!loading &&
              filtered.slice(0, 50).map((o) => {
                const meta = statusMeta[o.ui];
                const Icon = meta.Icon;
                const date = new Date(o.order_date).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const showProgress = o.ui === "processing";
                const isOpen = expanded.has(o.order_id);
                const items = detailsByOrder.get(o.order_id) ?? [];
                return (
                  <article
                    key={o.order_id}
                    className="group rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:shadow-md hover:ring-slate-300"
                  >
                    <button
                      type="button"
                      onClick={() => toggleExpanded(o.order_id)}
                      className="flex w-full items-center gap-4 text-right"
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.iconBg} ${meta.iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          طلب رقم #{o.order_id}{" "}
                          <span className="font-normal text-slate-500">— {o.pharmacy}</span>
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {date} · {items.length} صنف · مريض #{o.client_id}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="text-base font-bold text-slate-900">
                            {o.total.toFixed(2)} ج.م
                          </p>
                          <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta.badge}`}>
                            {meta.label}
                          </span>
                        </div>
                        <ChevronLeft className={`h-5 w-5 text-slate-300 transition ${isOpen ? "-rotate-90 text-slate-500" : "group-hover:-translate-x-0.5 group-hover:text-slate-500"}`} />
                      </div>
                    </button>
                    {showProgress && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>تقدّم التوصيل</span>
                          <span>{o.progress}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-l from-sky-500 to-emerald-400"
                            style={{ width: `${o.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {isOpen && (
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="mb-2 text-xs font-semibold text-slate-700">تفاصيل الطلب</p>
                        {items.length === 0 ? (
                          <p className="text-xs text-slate-500">لا توجد أصناف لهذا الطلب.</p>
                        ) : (
                          <ul className="divide-y divide-slate-100">
                            {items.map((it) => (
                              <li key={it.order_detail_id} className="flex items-center justify-between gap-3 py-2 text-sm">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-medium text-slate-800">{it.medication_name}</p>
                                  <p className="text-[11px] text-slate-500">
                                    {it.medication_type} · {it.category} · الكمية {it.quantity}
                                  </p>
                                </div>
                                <div className="text-left">
                                  <p className="text-sm font-semibold text-slate-900">{Number(it.line_total).toFixed(2)} ج.م</p>
                                  <p className="text-[11px] text-slate-500">{Number(it.unit_price).toFixed(2)} للوحدة</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
          </div>
        </section>
      </main>
    </div>
  );
}
