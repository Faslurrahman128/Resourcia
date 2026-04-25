import { useState, useEffect, useCallback } from "react";

const BASE = "http://localhost:8080";
const api = {
  get: (path) => fetch(`${BASE}${path}`).then((r) => r.json()),
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f2f5; color: #1a1d23; }
  .app-shell { display: flex; min-height: 100vh; }

  .sidebar {
    width: 240px; min-height: 100vh; background: #0f1117;
    display: flex; flex-direction: column; padding: 0;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
  }
  .sidebar-brand {
    display: flex; align-items: center; gap: 12px;
    padding: 24px 20px 20px; border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .brand-avatar {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, #6c63ff, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 800; font-size: 15px; flex-shrink: 0;
  }
  .brand-name { color: #fff; font-size: 17px; font-weight: 700; line-height: 1.1; }
  .brand-sub  { color: #6b7280; font-size: 11px; font-weight: 500; letter-spacing: .05em; }
  .nav-section-label {
    color: #4b5563; font-size: 10px; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase; padding: 20px 20px 6px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 20px;
    color: #9ca3af; font-size: 14px; font-weight: 500; cursor: pointer;
    transition: all .15s; border-left: 3px solid transparent;
  }
  .nav-item:hover { color: #e5e7eb; background: rgba(255,255,255,.04); }
  .nav-item.active { color: #fff; background: rgba(255,255,255,.07); border-left-color: #6c63ff; }
  .sidebar-footer { margin-top: auto; padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.07); }
  .user-card {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    background: rgba(255,255,255,.05); border-radius: 12px; cursor: pointer;
  }
  .user-avatar {
    width: 34px; height: 34px; border-radius: 9px;
    background: linear-gradient(135deg, #6c63ff, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-size: 13px; flex-shrink: 0;
  }
  .user-name  { color: #e5e7eb; font-size: 13px; font-weight: 600; }
  .user-role  { color: #6b7280; font-size: 11px; }
  .online-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }

  .main { margin-left: 240px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .topbar {
    background: #fff; border-bottom: 1px solid #e5e7eb; padding: 0 28px;
    height: 64px; display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .topbar-left { display: flex; align-items: center; gap: 14px; }
  .topbar-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, #6c63ff22, #a78bfa22);
    display: flex; align-items: center; justify-content: center;
  }
  .topbar-title { font-size: 18px; font-weight: 700; color: #111827; }
  .topbar-sub   { font-size: 12px; color: #9ca3af; font-weight: 500; margin-top: 1px; }
  .topbar-right { display: flex; align-items: center; gap: 16px; }
  .topbar-time  { font-size: 16px; font-weight: 700; color: #111827; }
  .topbar-dstr  { font-size: 11px; color: #9ca3af; text-align: right; }
  .notif-btn {
    width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #e5e7eb;
    background: #fff; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .15s;
  }
  .notif-btn:hover { background: #f9fafb; }

  .page-body { padding: 28px; display: flex; flex-direction: column; gap: 24px; }
  .card { background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; }
  .card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid #f3f4f6;
  }
  .card-title { font-size: 16px; font-weight: 700; color: #111827; }

  .btn-secondary { background: #f9fafb; color: #374151; border: 1.5px solid #e5e7eb; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: all .15s; }
  .btn-secondary:hover { background: #f3f4f6; }

  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th {
    text-align: left; padding: 12px 20px; font-size: 12px; font-weight: 600;
    color: #6b7280; background: #f9fafb; border-bottom: 1px solid #e5e7eb; white-space: nowrap;
  }
  td { padding: 14px 20px; font-size: 13px; color: #374151; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafbfc; }

  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-green  { background: #f0fdf4; color: #16a34a; }

  .filters-row {
    display: flex; align-items: center; gap: 10px;
    padding: 16px 20px; border-bottom: 1px solid #f3f4f6; flex-wrap: wrap;
  }
  .search-wrap { position: relative; flex: 1; min-width: 180px; max-width: 300px; }
  .search-wrap svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #9ca3af; }
  .search-input {
    width: 100%; padding: 8px 12px 8px 34px; border: 1.5px solid #e5e7eb;
    border-radius: 9px; font-size: 13px; outline: none; font-family: inherit; transition: border-color .15s;
  }
  .search-input:focus { border-color: #6c63ff; }
  select.filter-select {
    padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    font-size: 13px; font-family: inherit; outline: none; background: #fff;
    cursor: pointer; transition: border-color .15s;
  }
  select.filter-select:focus { border-color: #6c63ff; }

  .stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .stat-card {
    background: #fff; border: 1px solid #e5e7eb; border-radius: 16px;
    padding: 22px 24px; display: flex; align-items: flex-start; gap: 16px;
  }
  .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .stat-icon.green  { background: #f0fdf4; color: #16a34a; }
  .stat-icon.purple { background: #f5f3ff; color: #7c3aed; }
  .stat-label { font-size: 13px; color: #6b7280; font-weight: 500; }
  .stat-value { font-size: 30px; font-weight: 800; color: #111827; line-height: 1.1; }

  .empty-state { text-align: center; padding: 48px 20px; color: #9ca3af; font-size: 14px; }

  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: #111827; color: #fff; padding: 12px 20px; border-radius: 12px;
    font-size: 13px; font-weight: 500; animation: slideUp .2s ease;
    display: flex; align-items: center; gap: 8px;
  }
  .toast.success { background: #15803d; }
  .toast.error   { background: #dc2626; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    booking: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    resource: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    bolt: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    box: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  };
  return icons[name] || null;
};

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return <div className={`toast ${type}`}><span>{msg}</span></div>;
}

// Props: userName, userInitial, onLogout, activeNav, setActiveNav
function UserSidebar({ userName, userInitial, onLogout, activeNav, setActiveNav }) {
  const nav = [
    { id: "overview",      label: "Overview",          icon: "dashboard" },
    { id: "notifications", label: "Notifications",     icon: "bell" },
    { id: "my-bookings",   label: "My Bookings",       icon: "booking" },
    { id: "resources",     label: "Browse Resources",  icon: "resource" },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-avatar">R</div>
        <div>
          <div className="brand-name">Resourcia</div>
          <div className="brand-sub">Student Portal</div>
        </div>
      </div>
      <div className="nav-section-label">Navigation</div>
      {nav.map((item) => (
        <div key={item.id} className={`nav-item ${activeNav === item.id ? "active" : ""}`} onClick={() => setActiveNav(item.id)}>
          <Icon name={item.icon} size={16} />{item.label}
        </div>
      ))}
      <div className="sidebar-footer">
        <div style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>
          Your Account
        </div>
        <div className="user-card" onClick={onLogout}>
          <div className="user-avatar">{userInitial || "U"}</div>
          <div style={{ flex: 1 }}>
            <div className="user-name">{userName || "Student"}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div className="online-dot" />
              <span className="user-role">STUDENT/USER</span>
            </div>
          </div>
          <Icon name="logout" size={15} color="#6b7280" />
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const timeStr = time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-icon"><Icon name="bolt" size={20} color="#6c63ff" /></div>
        <div>
          <div className="topbar-title">Resources Management</div>
          <div className="topbar-sub">Manage your campus efficiently</div>
        </div>
      </div>
      <div className="topbar-right">
        <button className="notif-btn"><Icon name="bell" size={16} color="#6b7280" /></button>
        <div>
          <div className="topbar-time">{timeStr}</div>
          <div className="topbar-dstr">{dateStr}</div>
        </div>
      </div>
    </div>
  );
}

function UserResourcesPage({ toast }) {
  const [resourceTypes, setResourceTypes] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    Promise.all([api.get("/resource-types"), api.get("/resources")])
      .then(([types, res]) => {
        const allRes = Array.isArray(res) ? res : [];
        setResourceTypes(Array.isArray(types) ? types : []);
        setResources(allRes.filter((r) => r.status === "ACTIVE"));
      })
      .catch(() => toast("Failed to load resources", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const typeMap = Object.fromEntries(resourceTypes.map((t) => [t.typeId, t.typeName]));
  const filtered = resources.filter((r) => {
    const matchSearch = !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || String(r.typeId) === filterType;
    return matchSearch && matchType;
  });

  if (loading) return <div style={{ padding: 40, color: "#9ca3af", fontSize: 14 }}>Loading…</div>;

  return (
    <>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon green"><Icon name="box" size={22} /></div>
          <div>
            <div className="stat-label">Available Resources</div>
            <div className="stat-value">{resources.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Icon name="filter" size={22} /></div>
          <div>
            <div className="stat-label">Resource Types</div>
            <div className="stat-value">{resourceTypes.length}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Browse Resources</span>
        </div>
        <div className="filters-row">
          <div className="search-wrap">
            <Icon name="search" size={15} color="#9ca3af" />
            <input className="search-input" placeholder="Search by name or location…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {resourceTypes.map((t) => <option key={t.typeId} value={t.typeId}>{t.typeName}</option>)}
          </select>
          {(search || filterType) && (
            <button className="btn-secondary" onClick={() => { setSearch(""); setFilterType(""); }}>Clear Filters</button>
          )}
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Location</th><th>Capacity</th><th>Hours</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state">No available resources found.</div></td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id}>
                  <td style={{ color: "#9ca3af" }}>{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>{typeMap[r.typeId] || "—"}</td>
                  <td>{r.location}</td>
                  <td>{r.capacity ? <span className="badge badge-green" style={{ borderRadius: 8 }}>{r.capacity}</span> : "—"}</td>
                  <td style={{ color: "#6b7280", whiteSpace: "nowrap" }}>
                    {r.availabilityStart && r.availabilityEnd ? `${r.availabilityStart} - ${r.availabilityEnd}` : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/**
 * UserResourcesApp
 *
 * Props:
 *   userName    (string)  – display name shown in sidebar footer, e.g. "Mathushan Karunairajah"
 *   userInitial (string)  – one or two letters for the avatar, e.g. "MK"
 *   onLogout    (fn)      – called when user clicks the account card / logout icon
 */
export default function UserResourcesApp({ userName, userInitial, onLogout }) {
  const [activeNav, setActiveNav] = useState("resources");
  const [toastState, setToastState] = useState(null);
  const toast = useCallback((msg, type = "success") => setToastState({ msg, type, key: Date.now() }), []);

  return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        <UserSidebar
          userName={userName}
          userInitial={userInitial}
          onLogout={onLogout}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />
        <div className="main">
          <Topbar />
          <div className="page-body">
            {activeNav === "resources" && <UserResourcesPage toast={toast} />}
            {activeNav !== "resources" && (
              <div className="card" style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                This section ({activeNav}) belongs to another module.
              </div>
            )}
          </div>
        </div>
      </div>
      {toastState && <Toast key={toastState.key} msg={toastState.msg} type={toastState.type} onDone={() => setToastState(null)} />}
    </>
  );
}