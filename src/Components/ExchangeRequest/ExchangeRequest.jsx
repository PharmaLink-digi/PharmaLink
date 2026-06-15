import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleFill, XCircleFill, ArrowRepeat, BoxArrowInDown, BoxArrowUp } from "react-bootstrap-icons";
import api from "../../utils/api";
import "./ExchangeRequest.css";

const STATUS_BADGE = {
  Approved: "bg-success",
  Pending:  "bg-warning text-dark",
  Rejected: "bg-danger",
  approved: "bg-success",
  pending:  "bg-warning text-dark",
  rejected: "bg-danger",
};

function normalizeStatus(s) {
  if (!s) return "Pending";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function formatDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d) ? v : d.toISOString().slice(0, 10);
}

const FILTERS = ["all", "Pending", "Approved", "Rejected"];

export default function ExchangeRequest() {
  const navigate = useNavigate();
  const pharmacyId = localStorage.getItem("userId");
  const role       = localStorage.getItem("userRole");

  const [tab, setTab]               = useState("incoming"); // "incoming" | "outgoing"
  const [incoming, setIncoming]     = useState([]);
  const [outgoing, setOutgoing]     = useState([]);
  const [medications, setMedications] = useState({});
  const [pharmacies, setPharmacies]   = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError]           = useState(null);

  useEffect(() => {
    if (!pharmacyId) { navigate("/signin", { replace: true }); return; }
    if (role !== "pharmacy") { navigate("/signin", { replace: true }); return; }
    loadAll();
  }, []);

  // Reset filter when switching tabs
  useEffect(() => { setFilterStatus("all"); }, [tab]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/exchange-pharm", {
        headers: { "Cache-Control": "no-cache" },
      });
      const all = Array.isArray(data) ? data : [];

      const inc = all.filter((r) => String(r.to_pharm_id)   === String(pharmacyId));
      const out = all.filter((r) => String(r.from_pharm_id) === String(pharmacyId));

      setIncoming(inc);
      setOutgoing(out);

      // Collect unique IDs for secondary lookups
      const medIds  = [...new Set(all.map((r) => r.medication_id).filter(Boolean))];
      const pharmIds = [...new Set(
        all.flatMap((r) => [r.from_pharm_id, r.to_pharm_id]).filter(Boolean)
      )];

      const [medRes, pharmRes] = await Promise.all([
        Promise.all(medIds.map((id) =>
          api.get(`/medications/${id}`)
            .then((r) => ({ id, d: Array.isArray(r.data) ? r.data[0] : r.data }))
            .catch(() => null)
        )),
        Promise.all(pharmIds.map((id) =>
          api.get(`/pharm-info/${id}`)
            .then((r) => ({ id, d: Array.isArray(r.data) ? r.data[0] : r.data }))
            .catch(() => null)
        )),
      ]);

      const medMap = {};
      medRes.forEach((r) => { if (r) medMap[r.id] = r.d; });
      const pharmMap = {};
      pharmRes.forEach((r) => { if (r) pharmMap[r.id] = r.d; });

      setMedications(medMap);
      setPharmacies(pharmMap);
    } catch (err) {
      setError("Failed to load exchange requests.");
    } finally {
      setLoading(false);
    }
  }, [pharmacyId]);

  const handleStatusChange = async (request, newStatus) => {
    const id = request.request_id;
    const prev = request.status;

    setIncoming((list) =>
      list.map((r) => r.request_id === id ? { ...r, status: newStatus } : r)
    );
    setError(null);
    setActionLoading(id);

    try {
      await api.patch(`/exchange-pharm/${id}`, { status: newStatus });
    } catch (err) {
      setIncoming((list) =>
        list.map((r) => r.request_id === id ? { ...r, status: prev } : r)
      );
      setError(err.response?.data?.message || "Failed to update. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredList = (list) =>
    list.filter((r) =>
      filterStatus === "all" ? true : normalizeStatus(r.status) === filterStatus
    );

  const countByStatus = (list, s) =>
    list.filter((r) => normalizeStatus(r.status) === s).length;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted">Loading exchange requests...</p>
      </div>
    );
  }

  const activeList = tab === "incoming" ? incoming : outgoing;
  const displayed  = filteredList(activeList);

  return (
    <div className="container py-5">

      {/* Page header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">P2P Medication Exchange</h2>
          <p className="text-muted mb-0">Manage incoming and outgoing exchange requests</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadAll} title="Refresh">
          <ArrowRepeat size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn d-flex align-items-center gap-2 ${tab === "incoming" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => setTab("incoming")}
        >
          <BoxArrowInDown size={16} />
          Incoming
          <span className={`badge ${tab === "incoming" ? "bg-white text-primary" : "bg-secondary"}`}>
            {incoming.length}
          </span>
          {countByStatus(incoming, "Pending") > 0 && (
            <span className="badge bg-warning text-dark">
              {countByStatus(incoming, "Pending")} pending
            </span>
          )}
        </button>
        <button
          className={`btn d-flex align-items-center gap-2 ${tab === "outgoing" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => setTab("outgoing")}
        >
          <BoxArrowUp size={16} />
          Outgoing
          <span className={`badge ${tab === "outgoing" ? "bg-white text-primary" : "bg-secondary"}`}>
            {outgoing.length}
          </span>
        </button>
      </div>

      {/* Status filter */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${
              filterStatus === f
                ? f === "all"       ? "btn-dark"
                : f === "Pending"   ? "btn-warning text-dark"
                : f === "Approved"  ? "btn-success"
                :                    "btn-danger"
                : "btn-outline-secondary"
            }`}
            onClick={() => setFilterStatus(f)}
          >
            {f === "all" ? "All" : f}
            {f !== "all" && (
              <span className="ms-1 opacity-75">({countByStatus(activeList, f)})</span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3">Medication</th>
                <th className="py-3">{tab === "incoming" ? "From Pharmacy" : "To Pharmacy"}</th>
                <th className="py-3">Quantity</th>
                <th className="py-3">Expiry</th>
                <th className="py-3">Status</th>
                {tab === "incoming" && <th className="py-3 text-end">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={tab === "incoming" ? 6 : 5} className="text-center py-5 text-muted">
                    No {filterStatus === "all" ? "" : filterStatus.toLowerCase() + " "}
                    {tab} requests found.
                  </td>
                </tr>
              ) : (
                displayed.map((request) => {
                  const statusNorm   = normalizeStatus(request.status);
                  const isPending    = statusNorm === "Pending";
                  const isActioning  = actionLoading === request.request_id;
                  const counterpartId = tab === "incoming"
                    ? request.from_pharm_id
                    : request.to_pharm_id;

                  return (
                    <tr key={request.request_id}>
                      <td className="fw-medium">
                        {medications[request.medication_id]?.medication_name ?? (
                          <span className="text-muted fst-italic">—</span>
                        )}
                      </td>
                      <td>
                        {pharmacies[counterpartId]?.pharm_name ?? (
                          <span className="text-muted fst-italic">—</span>
                        )}
                      </td>
                      <td>{request.quantity_requested ?? "—"} units</td>
                      <td>
                        {request.expiry_date
                          ? <span className="badge bg-warning text-dark">Exp: {formatDate(request.expiry_date)}</span>
                          : <span className="text-muted">—</span>}
                      </td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[request.status] ?? "bg-secondary"}`}>
                          {statusNorm}
                        </span>
                      </td>

                      {/* Actions — only for incoming + pending */}
                      {tab === "incoming" && (
                        <td className="text-end">
                          {isPending ? (
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                disabled={isActioning}
                                onClick={() => handleStatusChange(request, "Approved")}
                              >
                                {isActioning
                                  ? <span className="spinner-border spinner-border-sm" role="status" />
                                  : <><CheckCircleFill /> Approve</>}
                              </button>
                              <button
                                className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                                disabled={isActioning}
                                onClick={() => handleStatusChange(request, "Rejected")}
                              >
                                {isActioning
                                  ? <span className="spinner-border spinner-border-sm" role="status" />
                                  : <><XCircleFill /> Reject</>}
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted fst-italic small">Actioned</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outgoing help text */}
      {tab === "outgoing" && (
        <p className="text-muted mt-3" style={{ fontSize: "13px" }}>
          These are requests you sent to other pharmacies. Actions are taken by the receiving pharmacy.
        </p>
      )}
    </div>
  );
}
