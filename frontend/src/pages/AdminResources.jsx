import { useState, useEffect, useCallback } from "react";

const BASE = "http://localhost:8080";
const api = {
  get: (path) => fetch(`${BASE}${path}`).then((r) => r.json()),
  post: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => (r.status === 204 || r.status === 201 ? (r.text().then(t => t ? JSON.parse(t) : null)) : r.json())),
  put: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => (r.status === 204 ? null : r.json())),
  delete: (path) => fetch(`${BASE}${path}`, { method: "DELETE" }),
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

  .btn {
    display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px;
    border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all .15s; border: none;
  }
  .btn-primary { background: #111827; color: #fff; }
  .btn-primary:hover { background: #374151; }
  .btn-secondary { background: #f9fafb; color: #374151; border: 1.5px solid #e5e7eb; }
  .btn-secondary:hover { background: #f3f4f6; }
  .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 8px; }
  .btn-icon {
    padding: 7px; border-radius: 8px; background: transparent;
    border: 1.5px solid #e5e7eb; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center; transition: all .15s;
  }
  .btn-icon:hover { background: #f3f4f6; }
  .btn-icon.danger:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

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
  .badge-blue   { background: #eff6ff; color: #2563eb; }
  .badge-green  { background: #f0fdf4; color: #16a34a; }
  .badge-red    { background: #fef2f2; color: #dc2626; }

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

  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.55);
    display: flex; align-items: center; justify-content: center; z-index: 1000;
    animation: fadeIn .15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: #fff; border-radius: 20px; padding: 28px;
    width: 100%; max-width: 520px; animation: slideUp .2s ease; max-height: 90vh; overflow-y: auto;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-title { font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 20px; }
  .modal-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .modal-grid.single { grid-template-columns: 1fr; }
  .field-group { display: flex; flex-direction: column; gap: 5px; }
  .field-group.full { grid-column: 1 / -1; }
  label { font-size: 12px; font-weight: 600; color: #374151; }
  label span.req { color: #dc2626; margin-left: 2px; }
  input[type=text], input[type=number], input[type=time], select.form-select {
    padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    font-size: 13px; font-family: inherit; outline: none; background: #fff;
    transition: border-color .15s; width: 100%;
  }
  input[type=text]:focus, input[type=number]:focus, input[type=time]:focus, select.form-select:focus {
    border-color: #6c63ff; box-shadow: 0 0 0 3px rgba(108,99,255,.08);
  }
  .modal-actions { display: flex; gap: 10px; margin-top: 22px; justify-content: flex-end; }
  .empty-state { text-align: center; padding: 48px 20px; color: #9ca3af; font-size: 14px; }

  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: #111827; color: #fff; padding: 12px 20px; border-radius: 12px;
    font-size: 13px; font-weight: 500; animation: slideUp .2s ease;
    display: flex; align-items: center; gap: 8px;
  }
  .toast.success { background: #15803d; }
  .toast.error   { background: #dc2626; }

  .error-msg { font-size: 12px; color: #dc2626; margin-top: 2px; }
`;

const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    booking: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    resource: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    bolt: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  };
  return icons[name] || null;
};

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return <div className={`toast ${type}`}><span>{msg}</span></div>;
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-title" style={{ fontSize: 17 }}>Confirm Delete</div>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn" style={{ background: "#dc2626", color: "#fff" }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function ResourceTypeModal({ initial, onSave, onClose }) {
  const [typeName, setTypeName] = useState(initial?.typeName || "");
  const [error, setError] = useState("");
  const isEdit = !!initial?.typeId;

  const handleSubmit = () => {
    if (!typeName.trim()) {
      setError("Type name is required.");
      return;
    }
    setError("");
    onSave({ typeId: initial?.typeId, typeName: typeName.trim() });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{isEdit ? "Edit Resource Type" : "Add Resource Type"}</div>
        <div className="modal-grid single">
          <div className="field-group">
            <label>Type Name <span className="req">*</span></label>
            <input
              type="text"
              placeholder="e.g., Classroom, Lab, Conference Room"
              value={typeName}
              onChange={(e) => { setTypeName(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
            {error && <span className="error-msg">{error}</span>}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourceModal({ initial, resourceTypes, onSave, onClose }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    typeId: initial?.typeId ?? "",
    name: initial?.name ?? "",
    location: initial?.location ?? "",
    capacity: initial?.capacity ?? "",
    availabilityStart: initial?.availabilityStart
      ? initial.availabilityStart.substring(0, 5)   // normalise "08:00:00" → "08:00"
      : "08:00",
    availabilityEnd: initial?.availabilityEnd
      ? initial.availabilityEnd.substring(0, 5)
      : "18:00",
    status: initial?.status ?? "ACTIVE",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.typeId) errs.typeId = "Please select a resource type.";
    if (!form.name.trim()) errs.name = "Resource name is required.";
    if (!form.location.trim()) errs.location = "Location is required.";
    if (form.capacity !== "" && (isNaN(Number(form.capacity)) || Number(form.capacity) < 0))
      errs.capacity = "Capacity must be a positive number.";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);

    // Build a clean payload with correct types
    const payload = {
      ...(isEdit ? { id: initial.id } : {}),
      typeId: Number(form.typeId),                          // FIX: cast to number
      name: form.name.trim(),
      location: form.location.trim(),
      capacity: form.capacity !== "" ? Number(form.capacity) : null,
      availabilityStart: form.availabilityStart + ":00",    // FIX: add seconds for backend
      availabilityEnd:   form.availabilityEnd   + ":00",
      status: form.status,
    };

    console.log("[ResourceModal] Submitting payload:", payload);
    onSave(payload);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{isEdit ? "Edit Resource" : "Add Resource"}</div>
        <div className="modal-grid">

          <div className="field-group">
            <label>Resource Type <span className="req">*</span></label>
            <select className="form-select" value={form.typeId} onChange={(e) => set("typeId", e.target.value)}>
              <option value="">Select a type</option>
              {resourceTypes.map((t) => (
                <option key={t.typeId} value={t.typeId}>{t.typeName}</option>
              ))}
            </select>
            {errors.typeId && <span className="error-msg">{errors.typeId}</span>}
          </div>

          <div className="field-group">
            <label>Resource Name <span className="req">*</span></label>
            <input type="text" placeholder="e.g., Classroom 101" value={form.name} onChange={(e) => set("name", e.target.value)} />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="field-group">
            <label>Location <span className="req">*</span></label>
            <input type="text" placeholder="e.g., Building A, 3rd Floor" value={form.location} onChange={(e) => set("location", e.target.value)} />
            {errors.location && <span className="error-msg">{errors.location}</span>}
          </div>

          <div className="field-group">
            <label>Capacity</label>
            <input type="number" placeholder="e.g., 50" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} min="0" />
            {errors.capacity && <span className="error-msg">{errors.capacity}</span>}
          </div>

          <div className="field-group">
            <label>Availability Start</label>
            <input type="time" value={form.availabilityStart} onChange={(e) => set("availabilityStart", e.target.value)} />
          </div>

          <div className="field-group">
            <label>Availability End</label>
            <input type="time" value={form.availabilityEnd} onChange={(e) => set("availabilityEnd", e.target.value)} />
          </div>

          <div className="field-group full">
            <label>Status</label>
            <select className="form-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>

        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button
            className="btn btn-primary"
            style={{ background: "#6c63ff" }}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Resource"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminSidebar({ adminName, adminInitial, onLogout, activeNav, setActiveNav }) {
  const nav = [
    { id: "overview",      label: "Overview",      icon: "dashboard" },
    { id: "notifications", label: "Notifications", icon: "bell" },
    { id: "bookings",      label: "Bookings",      icon: "booking" },
    { id: "resources",     label: "Resources",     icon: "resource" },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-avatar">R</div>
        <div>
          <div className="brand-name">Resourcia</div>
          <div className="brand-sub">Admin Portal</div>
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
          <div className="user-avatar">{adminInitial || "A"}</div>
          <div style={{ flex: 1 }}>
            <div className="user-name">{adminName || "Administrator"}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div className="online-dot" />
              <span className="user-role">ADMINISTRATOR</span>
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

function AdminResourcesPage({ toast }) {
  const [resourceTypes, setResourceTypes] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [typeModal, setTypeModal] = useState(null);
  const [resourceModal, setResourceModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      const [types, res] = await Promise.all([
        api.get("/resource-types"),
        api.get("/resources"),
      ]);
      setResourceTypes(Array.isArray(types) ? types : []);
      setResources(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("[loadAll] Failed:", err);
      toast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Resource Type CRUD ────────────────────────────────────────────────────
  const saveType = async (dto) => {
    try {
      if (dto.typeId) {
        await api.put(`/resource-types/${dto.typeId}`, dto);
        toast("Resource type updated", "success");
      } else {
        await api.post("/resource-types", dto);
        toast("Resource type created", "success");
      }
      setTypeModal(null);
      loadAll();
    } catch (err) {
      console.error("[saveType] Failed:", err);
      toast("Operation failed", "error");
    }
  };

  const deleteType = async (id) => {
    try {
      await api.delete(`/resource-types/${id}`);
      toast("Resource type deleted", "success");
      setConfirmDelete(null);
      loadAll();
    } catch (err) {
      console.error("[deleteType] Failed:", err);
      toast("Delete failed — type may still have resources", "error");
    }
  };

  // ── Resource CRUD ─────────────────────────────────────────────────────────
  const saveResource = async (dto) => {
    try {
      console.log("[saveResource] Payload being sent:", JSON.stringify(dto, null, 2));

      if (dto.id) {
        const result = await api.put(`/resources/${dto.id}`, dto);
        console.log("[saveResource] PUT response:", result);
        toast("Resource updated", "success");
      } else {
        const result = await api.post("/resources", dto);
        console.log("[saveResource] POST response:", result);
        toast("Resource created", "success");
      }
      setResourceModal(null);
      loadAll();
    } catch (err) {
      console.error("[saveResource] Failed:", err);
      toast("Operation failed — check console for details", "error");
    }
  };

  const deleteResource = async (id) => {
    try {
      await api.delete(`/resources/${id}`);
      toast("Resource deleted", "success");
      setConfirmDelete(null);
      loadAll();
    } catch (err) {
      console.error("[deleteResource] Failed:", err);
      toast("Delete failed", "error");
    }
  };

  const typeMap = Object.fromEntries(resourceTypes.map((t) => [t.typeId, t.typeName]));
  const filtered = resources.filter((r) => {
    const matchSearch =
      !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase());
    const matchType   = !filterType   || String(r.typeId) === String(filterType);
    const matchStatus = !filterStatus || r.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  if (loading) return <div style={{ padding: 40, color: "#9ca3af", fontSize: 14 }}>Loading resources…</div>;

  return (
    <>
      {/* ── Resource Types Table ─────────────────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Resource Types</span>
          <button className="btn btn-primary" onClick={() => setTypeModal("add")}>
            <Icon name="plus" size={14} color="#fff" /> Add Type
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type ID</th>
                <th>Type Name</th>
                <th>Resources</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resourceTypes.length === 0 ? (
                <tr><td colSpan={4}><div className="empty-state">No resource types yet.</div></td></tr>
              ) : resourceTypes.map((t) => {
                const count = resources.filter((r) => r.typeId === t.typeId).length;
                return (
                  <tr key={t.typeId}>
                    <td style={{ color: "#9ca3af" }}>{t.typeId}</td>
                    <td style={{ fontWeight: 600 }}>{t.typeName}</td>
                    <td><span className="badge badge-blue">{count} resource{count !== 1 ? "s" : ""}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn-icon" onClick={() => setTypeModal(t)}>
                          <Icon name="edit" size={14} color="#6b7280" />
                        </button>
                        <button className="btn-icon danger" onClick={() => setConfirmDelete({ kind: "type", id: t.typeId, name: t.typeName })}>
                          <Icon name="trash" size={14} color="#dc2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Resources Table ──────────────────────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Resources</span>
          <button className="btn btn-primary" onClick={() => setResourceModal("add")}>
            <Icon name="plus" size={14} color="#fff" /> Add Resource
          </button>
        </div>
        <div className="filters-row">
          <div className="search-wrap">
            <Icon name="search" size={15} color="#9ca3af" />
            <input className="search-input" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {resourceTypes.map((t) => <option key={t.typeId} value={t.typeId}>{t.typeName}</option>)}
          </select>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
          {(search || filterType || filterStatus) && (
            <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(""); setFilterType(""); setFilterStatus(""); }}>
              Clear
            </button>
          )}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Type</th><th>Location</th>
                <th>Capacity</th><th>Hours</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state">No resources found.</div></td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id}>
                  <td style={{ color: "#9ca3af" }}>{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>{typeMap[r.typeId] || "—"}</td>
                  <td>{r.location}</td>
                  <td>
                    {r.capacity
                      ? <span className="badge badge-blue" style={{ borderRadius: 8 }}>{r.capacity}</span>
                      : "—"}
                  </td>
                  <td style={{ color: "#6b7280", whiteSpace: "nowrap" }}>
                    {r.availabilityStart && r.availabilityEnd
                      ? `${r.availabilityStart.substring(0, 5)} - ${r.availabilityEnd.substring(0, 5)}`
                      : "N/A"}
                  </td>
                  <td>
                    <span className={`badge ${r.status === "ACTIVE" ? "badge-green" : "badge-red"}`}>
                      {r.status === "ACTIVE" ? "Active" : "Off"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn-icon" onClick={() => setResourceModal(r)}>
                        <Icon name="edit" size={14} color="#6b7280" />
                      </button>
                      <button className="btn-icon danger" onClick={() => setConfirmDelete({ kind: "resource", id: r.id, name: r.name })}>
                        <Icon name="trash" size={14} color="#dc2626" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {typeModal && (
        <ResourceTypeModal
          initial={typeModal === "add" ? null : typeModal}
          onSave={saveType}
          onClose={() => setTypeModal(null)}
        />
      )}
      {resourceModal && (
        <ResourceModal
          initial={resourceModal === "add" ? null : resourceModal}
          resourceTypes={resourceTypes}
          onSave={saveResource}
          onClose={() => setResourceModal(null)}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirmDelete.name}"? This cannot be undone.`}
          onConfirm={() =>
            confirmDelete.kind === "type"
              ? deleteType(confirmDelete.id)
              : deleteResource(confirmDelete.id)
          }
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  );
}

/**
 * AdminResourcesApp
 *
 * Props:
 *   adminName    (string)  – display name shown in sidebar footer, e.g. "Mathushan"
 *   adminInitial (string)  – one or two letters for the avatar, e.g. "M"
 *   onLogout     (fn)      – called when user clicks the account card / logout icon
 */
export default function AdminResourcesApp({ adminName, adminInitial, onLogout }) {
  const [activeNav, setActiveNav] = useState("resources");
  const [toastState, setToastState] = useState(null);
  const toast = useCallback((msg, type = "success") => setToastState({ msg, type, key: Date.now() }), []);

  return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        <AdminSidebar
          adminName={adminName}
          adminInitial={adminInitial}
          onLogout={onLogout}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />
        <div className="main">
          <Topbar />
          <div className="page-body">
            {activeNav === "resources" && <AdminResourcesPage toast={toast} />}
            {activeNav !== "resources" && (
              <div className="card" style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                This section ({activeNav}) belongs to another module.
              </div>
            )}
          </div>
        </div>
      </div>
      {toastState && (
        <Toast key={toastState.key} msg={toastState.msg} type={toastState.type} onDone={() => setToastState(null)} />
      )}
    </>
  );
}