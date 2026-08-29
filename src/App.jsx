import { useState, useEffect, useRef } from "react";

const BASE_URL = "http://localhost:8000";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "⌂", desc: "Health Check" },
  { id: "mandi", label: "Mandi Prices", icon: "⚖", desc: "Market Data" },
  { id: "predict", label: "Predictions", icon: "◈", desc: "Forecasts" },
  { id: "weather", label: "Weather", icon: "◎", desc: "Current Conditions" },
  { id: "sensors", label: "Field Sensors", icon: "❖", desc: "NPK · Soil · Climate" },
  { id: "ai", label: "AI Assistant", icon: "✦", desc: "Chat" },
];
//new codeeee
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f5f0e8;
    --surface: #fdfaf4;
    --surface2: #f0ebe0;
    --border: #d6cdb8;
    --text: #2c2416;
    --text2: #6b5e45;
    --text3: #9c8c72;
    --green: #3d6b44;
    --green-light: #e8f2e9;
    --green-mid: #5a9463;
    --amber: #c47c1e;
    --amber-light: #fef3e2;
    --red: #b84040;
    --red-light: #fdeaea;
    --blue: #3d5a80;
    --blue-light: #e8eef5;
    --shadow: 0 2px 12px rgba(44,36,22,0.08);
    --shadow-lg: 0 8px 32px rgba(44,36,22,0.12);
    --radius: 12px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }

  .app { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sidebar {
    width: 220px; background: var(--text); color: #e8dfc8;
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; height: 100vh;
    z-index: 10; padding: 0;
  }
  .sidebar-brand {
    padding: 28px 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .brand-icon { font-size: 22px; margin-bottom: 4px; display: block; }
  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 700;
    color: #f0e8d0; letter-spacing: 0.3px;
    line-height: 1.2;
  }
  .brand-sub { font-size: 11px; color: #9c8c72; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }

  .nav { padding: 16px 0; flex: 1; }
  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 24px; cursor: pointer;
    transition: all 0.18s; border-left: 3px solid transparent;
    font-size: 14px; font-weight: 400; color: #9c8c72;
  }
  .nav-item:hover { background: rgba(255,255,255,0.05); color: #e8dfc8; }
  .nav-item.active { background: rgba(93,148,99,0.15); color: #a8d4ac; border-left-color: #5a9463; }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .nav-label { font-weight: 500; }

  .sidebar-footer { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06); }
  .api-indicator { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #6b5e45; }
  .user-info { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9c8c72; margin-bottom: 8px; }
  .user-avatar {
    width: 24px; height: 24px; border-radius: 50%;
    background: var(--green-mid); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; flex-shrink: 0;
  }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: #5a9463; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .logout-btn {
    background: none; border: none; color: #6b5e45; font-size: 11px;
    cursor: pointer; padding: 0; text-decoration: underline; font-family: 'DM Sans', sans-serif;
  }
  .logout-btn:hover { color: #e8dfc8; }

  /* Main */
  .main { margin-left: 220px; flex: 1; padding: 40px; min-height: 100vh; }

  .page-header { margin-bottom: 32px; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700; color: var(--text);
    line-height: 1.2;
  }
  .page-subtitle { color: var(--text3); font-size: 14px; margin-top: 4px; }

  /* Card */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 24px;
    box-shadow: var(--shadow);
  }
  .card-sm { padding: 16px; }

  /* Fetch button */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 8px; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.18s;
  }
  .btn-primary { background: var(--green); color: #fff; }
  .btn-primary:hover { background: #2d5233; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text2); }
  .btn-outline:hover { border-color: var(--green); color: var(--green); }

  /* Status badge */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 12px; font-weight: 500;
  }
  .badge-green { background: var(--green-light); color: var(--green); }
  .badge-amber { background: var(--amber-light); color: var(--amber); }
  .badge-red { background: var(--red-light); color: var(--red); }
  .badge-blue { background: var(--blue-light); color: var(--blue); }

  /* Data display */
  .data-block {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 16px; margin-top: 16px;
    font-family: monospace; font-size: 13px;
    color: var(--text2); white-space: pre-wrap; word-break: break-word;
    max-height: 380px; overflow-y: auto; line-height: 1.6;
  }

  .loading {
    display: flex; align-items: center; gap: 10px;
    color: var(--text3); font-size: 14px; padding: 16px 0;
  }
  .spinner {
    width: 18px; height: 18px; border: 2px solid var(--border);
    border-top-color: var(--green); border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .error-msg {
    background: var(--red-light); border: 1px solid #f0c0c0;
    border-radius: 8px; padding: 12px 16px; margin-top: 12px;
    color: var(--red); font-size: 13px;
  }

  /* Grid layouts */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }

  /* Stat cards */
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 18px 20px;
  }
  .stat-label { font-size: 12px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px; }
  .stat-value { font-size: 26px; font-weight: 600; color: var(--text); margin-top: 4px; line-height: 1; }
  .stat-sub { font-size: 12px; color: var(--text3); margin-top: 4px; }

  /* Sensor cards */
  .sensor-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px; position: relative; overflow: hidden;
    transition: border-color 0.3s;
  }
  .sensor-icon { font-size: 22px; margin-bottom: 10px; display: block; }
  .sensor-label { font-size: 12px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px; }
  .sensor-value { font-size: 30px; font-weight: 600; color: var(--text); margin-top: 6px; line-height: 1; }
  .sensor-unit { font-size: 14px; color: var(--text3); font-weight: 400; margin-left: 3px; }
  .sensor-range { font-size: 11px; color: var(--text3); margin-top: 8px; }
  .sensor-bar-track {
    width: 100%; height: 5px; background: var(--surface2); border-radius: 3px;
    margin-top: 10px; overflow: hidden;
  }
  .sensor-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }

  .live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--green-mid);
    display: inline-block; animation: pulse 1.6s infinite;
  }

  /* Home screen */
  .home-hero {
    background: linear-gradient(135deg, var(--green) 0%, #2d5233 100%);
    border-radius: 16px; padding: 40px; color: #fff; margin-bottom: 28px;
    position: relative; overflow: hidden;
  }
  .home-hero::before {
    content: ''; position: absolute; right: -20px; top: -20px;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }
  .home-hero::after {
    content: ''; position: absolute; right: 60px; bottom: -40px;
    width: 140px; height: 140px; border-radius: 50%;
    background: rgba(255,255,255,0.03);
  }
  .hero-tag { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; line-height: 1.2; margin-bottom: 10px; }
  .hero-sub { opacity: 0.75; font-size: 14px; line-height: 1.6; max-width: 420px; }

  .endpoint-list { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
  .endpoint-row {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 16px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 8px;
    cursor: pointer; transition: all 0.15s;
  }
  .endpoint-row:hover { border-color: var(--green-mid); background: var(--green-light); }
  .method-tag {
    font-size: 11px; font-weight: 700; color: var(--green);
    background: var(--green-light); padding: 2px 8px; border-radius: 4px;
    letter-spacing: 0.5px; min-width: 40px; text-align: center;
  }
  .endpoint-path { font-family: monospace; font-size: 13px; color: var(--text); flex: 1; }
  .endpoint-desc { font-size: 12px; color: var(--text3); }

  /* Chat */
  .chat-wrap { display: flex; flex-direction: column; height: calc(100vh - 180px); }
  .chat-messages {
    flex: 1; overflow-y: auto; padding: 16px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px 10px 0 0; display: flex; flex-direction: column; gap: 12px;
  }
  .chat-bubble {
    max-width: 75%; padding: 10px 14px; border-radius: 10px;
    font-size: 14px; line-height: 1.6;
  }
  .bubble-user {
    align-self: flex-end;
    background: var(--green); color: #fff; border-bottom-right-radius: 3px;
  }
  .bubble-ai {
    align-self: flex-start;
    background: var(--surface); border: 1px solid var(--border); color: var(--text);
    border-bottom-left-radius: 3px;
  }
  .bubble-label { font-size: 11px; opacity: 0.6; margin-bottom: 3px; }
  .chat-input-row {
    display: flex; gap: 0;
    border: 1px solid var(--border); border-top: none;
    border-radius: 0 0 10px 10px; overflow: hidden;
    background: var(--surface);
  }
  .chat-input {
    flex: 1; padding: 14px 16px; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    background: transparent; color: var(--text);
  }
  .chat-send {
    padding: 14px 20px; background: var(--green); color: #fff;
    border: none; cursor: pointer; font-size: 16px;
    transition: background 0.15s;
  }
  .chat-send:hover { background: #2d5233; }
  .chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
  .empty-chat {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    color: var(--text3); gap: 8px;
  }
  .empty-icon { font-size: 36px; opacity: 0.4; }

  /* Weather */
  .weather-main {
    display: flex; align-items: flex-end; gap: 16px; margin: 16px 0 24px;
  }
  .weather-temp { font-size: 64px; font-weight: 300; color: var(--text); line-height: 1; }
  .weather-icon { font-size: 48px; }
  .weather-desc { color: var(--text2); font-size: 18px; font-weight: 500; }

  /* Login screen */
  .login-wrap {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
  }
  .login-card {
    width: 380px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 16px;
    padding: 40px; box-shadow: var(--shadow-lg); text-align: center;
  }
  .login-icon { font-size: 48px; margin-bottom: 16px; }
  .login-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700; color: var(--text);
    margin-bottom: 6px;
  }
  .login-sub { font-size: 13px; color: var(--text3); margin-bottom: 28px; }
  .login-input {
    width: 100%; padding: 12px 16px;
    border: 1px solid var(--border); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: var(--text); background: var(--surface2);
    outline: none; margin-bottom: 12px;
    transition: border-color 0.15s;
  }
  .login-input:focus { border-color: var(--green); }

  @media (max-width: 768px) {
    .sidebar { width: 60px; }
    .nav-label, .brand-name, .brand-sub, .sidebar-footer { display: none; }
    .main { margin-left: 60px; padding: 24px 16px; }
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  }
`;

// ─── API helpers ───────────────────────────────────────────────────────────────
async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

// ─── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");

  const handleLogin = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("user_id", trimmed);
    onLogin(trimmed);
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-icon">🌾</div>
        <div className="login-title">Welcome to AgriDash</div>
        <div className="login-sub">Enter your name or user ID to get started</div>
        <input
          className="login-input"
          placeholder="Your name or ID..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          autoFocus
        />
        <button
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={handleLogin}
          disabled={!name.trim()}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Screens ───────────────────────────────────────────────────────────────────

function HomeScreen({ navigate, userId }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true); setError(null);
    try { setStatus(await apiFetch("/")); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const endpoints = [
    { method: "GET", path: "/api/mandi", desc: "List of mandi market data", screen: "mandi" },
    { method: "GET", path: "/api/mandi/predict", desc: "Forecast predictions", screen: "predict" },
    { method: "GET", path: "/api/weather/current", desc: "Current weather info", screen: "weather" },
    { method: "SIM", path: "/sensors/field", desc: "NPK · soil · climate (simulated)", screen: "sensors" },
    { method: "POST", path: "/api/ai/chat", desc: "AI chatbot interface", screen: "ai" },
  ];

  return (
    <div>
      <div className="home-hero">
        <div className="hero-tag">AgriDash · Backend Explorer</div>
        <div className="hero-title">Kisan Intelligence<br />Dashboard</div>
        <div className="hero-sub">Welcome back, <strong>{userId}</strong>. Explore mandi prices, weather, forecasts, field sensors, and AI assistance.</div>
      </div>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontFamily: "Playfair Display, serif", fontSize: 16 }}>Health Check</div>
            <span className="badge badge-green">GET /</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 14 }}>Verify that your backend server is running and reachable.</p>
          <button className="btn btn-primary" onClick={checkHealth} disabled={loading}>
            {loading ? <><span className="spinner" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> Checking…</> : "◎ Ping Server"}
          </button>
          {status && <div className="data-block">{JSON.stringify(status, null, 2)}</div>}
          {error && <div className="error-msg">⚠ {error}</div>}
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, fontFamily: "Playfair Display, serif", fontSize: 16, marginBottom: 12 }}>Available Endpoints</div>
          <div className="endpoint-list">
            {endpoints.map(e => (
              <div key={e.path} className="endpoint-row" onClick={() => navigate(e.screen)}>
                <span className="method-tag">{e.method}</span>
                <span className="endpoint-path">{e.path}</span>
                <span className="endpoint-desc">{e.desc}</span>
                <span style={{ color: "var(--text3)", fontSize: 12 }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MandiScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    state: "Telangana",
    district: "",
    commodity: "Mango",
    limit: 100,
  });

  const fetchMandi = async () => {
    setLoading(true); setError(null);
    try {
      const query = new URLSearchParams();
      query.append("state", params.state);
      if (params.district.trim()) query.append("district", params.district.trim());
      query.append("commodity", params.commodity);
      query.append("limit", params.limit);
      setData(await apiFetch(`/api/mandi?${query.toString()}`));
    }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    border: "1px solid var(--border)", borderRadius: 7,
    fontFamily: "DM Sans, sans-serif", fontSize: 13,
    color: "var(--text)", background: "var(--surface2)",
    outline: "none",
  };
  const labelStyle = { fontSize: 12, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 5, display: "block" };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Mandi Prices</div>
          <div className="page-subtitle">Live agricultural market data · GET /api/mandi</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Search Filters</div>
        <div className="grid-2" style={{ gap: 14 }}>
          <div>
            <label style={labelStyle}>State</label>
            <input style={inputStyle} value={params.state}
              onChange={e => setParams(p => ({ ...p, state: e.target.value }))}
              placeholder="e.g. Telangana" />
          </div>
          <div>
            <label style={labelStyle}>District <span style={{ color: "var(--text3)", fontWeight: 400 }}>(optional)</span></label>
            <input style={inputStyle} value={params.district}
              onChange={e => setParams(p => ({ ...p, district: e.target.value }))}
              placeholder="e.g. Hyderabad" />
          </div>
          <div>
            <label style={labelStyle}>Commodity</label>
            <input style={inputStyle} value={params.commodity}
              onChange={e => setParams(p => ({ ...p, commodity: e.target.value }))}
              placeholder="e.g. Mango, Rice, Wheat" />
          </div>
          <div>
            <label style={labelStyle}>Limit (1–1000)</label>
            <input style={inputStyle} type="number" min={1} max={1000} value={params.limit}
              onChange={e => setParams(p => ({ ...p, limit: Math.min(1000, Math.max(1, Number(e.target.value))) }))} />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={fetchMandi} disabled={loading}>
            {loading ? <><span className="spinner" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> Fetching…</> : "⚖ Fetch Prices"}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="card">
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Results</div>
        <div style={{ fontSize: 13, color: "var(--text3)" }}>
          {data ? `Showing ${Array.isArray(data) ? data.length : 1} records for "${params.commodity}" in ${params.state}` : "Fill in filters and click Fetch Prices"}
        </div>

        {loading && <div className="loading"><div className="spinner" /> Loading mandi data…</div>}
        {error && <div className="error-msg">⚠ {error}</div>}

        {data && !loading && (
          <>
            {Array.isArray(data) && data.length > 0 ? (
              <div style={{ marginTop: 20, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "var(--surface2)" }}>
                      {Object.keys(data[0]).map(k => (
                        <th key={k} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text3)", borderBottom: "1px solid var(--border)" }}>{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                        {Object.values(row).map((v, j) => (
                          <td key={j} style={{ padding: "10px 14px", color: "var(--text)" }}>{String(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="data-block">{JSON.stringify(data, null, 2)}</div>
            )}
          </>
        )}

        {!data && !loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)" }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>⚖</div>
            <div style={{ fontSize: 14 }}>Enter a commodity name and click "Fetch Prices"</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PredictScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    commodity: "Potato",
    state: "Tamil Nadu",
    district: "",
  });

  const fetchPredictions = async () => {
    setLoading(true); setError(null);
    try {
      const query = new URLSearchParams();
      query.append("commodity", params.commodity);
      query.append("state", params.state);
      if (params.district.trim()) query.append("district", params.district.trim());
      setData(await apiFetch(`/api/mandi/predict?${query.toString()}`));
    }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    border: "1px solid var(--border)", borderRadius: 7,
    fontFamily: "DM Sans, sans-serif", fontSize: 13,
    color: "var(--text)", background: "var(--surface2)", outline: "none",
  };
  const labelStyle = { fontSize: 12, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 5, display: "block" };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Market Predictions</div>
          <div className="page-subtitle">AI-powered price forecasts · GET /api/mandi/predict</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Search Filters</div>
        <div className="grid-2" style={{ gap: 14 }}>
          <div>
            <label style={labelStyle}>Commodity</label>
            <input style={inputStyle} value={params.commodity}
              onChange={e => setParams(p => ({ ...p, commodity: e.target.value }))}
              placeholder="e.g. Potato, Rice, Wheat" />
          </div>
          <div>
            <label style={labelStyle}>State</label>
            <input style={inputStyle} value={params.state}
              onChange={e => setParams(p => ({ ...p, state: e.target.value }))}
              placeholder="e.g. Tamil Nadu" />
          </div>
          <div>
            <label style={labelStyle}>District <span style={{ color: "var(--text3)", fontWeight: 400 }}>(optional)</span></label>
            <input style={inputStyle} value={params.district}
              onChange={e => setParams(p => ({ ...p, district: e.target.value }))}
              placeholder="e.g. Chennai" />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={fetchPredictions} disabled={loading}>
            {loading ? <><span className="spinner" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> Predicting…</> : "◈ Get Predictions"}
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Forecast Results</div>
        <div style={{ fontSize: 13, color: "var(--text3)" }}>
          {data ? `Showing prediction for "${params.commodity}" in ${params.state}` : "Fill in filters and click Get Predictions"}
        </div>

        {loading && <div className="loading"><div className="spinner" /> Running forecast model…</div>}
        {error && <div className="error-msg">⚠ {error}</div>}
        {data && !loading && <div className="data-block">{JSON.stringify(data, null, 2)}</div>}

        {!data && !loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)" }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>◈</div>
            <div style={{ fontSize: 14 }}>Enter a commodity and click "Get Predictions"</div>
          </div>
        )}
      </div>
    </div>
  );
}

function WeatherScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true); setError(null);
    try { setData(await apiFetch("/api/weather/current")); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const getWeatherIcon = (desc = "") => {
    const d = desc.toLowerCase();
    if (d.includes("rain")) return "🌧";
    if (d.includes("cloud")) return "⛅";
    if (d.includes("sun") || d.includes("clear")) return "☀";
    if (d.includes("storm") || d.includes("thunder")) return "⛈";
    if (d.includes("snow")) return "❄";
    if (d.includes("fog") || d.includes("mist")) return "🌫";
    return "◎";
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Current Weather</div>
          <div className="page-subtitle">Live weather conditions · GET /api/weather/current</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Weather Report</div>
            <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 3 }}>Real-time conditions for agricultural planning</div>
          </div>
          <button className="btn btn-primary" onClick={fetchWeather} disabled={loading}>
            {loading ? <><span className="spinner" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> Fetching…</> : "◎ Fetch Weather"}
          </button>
        </div>

        {loading && <div className="loading"><div className="spinner" /> Fetching conditions…</div>}
        {error && <div className="error-msg">⚠ {error}</div>}

        {data && !loading && (
          <>
            <div className="weather-main">
              <span className="weather-icon">{getWeatherIcon(data.description || data.condition)}</span>
              {(data.temperature || data.temp) && (
                <span className="weather-temp">{data.temperature ?? data.temp}°</span>
              )}
              <div>
                <div className="weather-desc">{data.description || data.condition || "Conditions available"}</div>
                {data.location && <div style={{ color: "var(--text3)", fontSize: 13, marginTop: 2 }}>{data.location}</div>}
              </div>
            </div>

            {(data.humidity || data.wind_speed || data.feels_like) && (
              <div className="grid-3" style={{ marginTop: 16 }}>
                {data.humidity && (
                  <div className="stat-card card-sm">
                    <div className="stat-label">Humidity</div>
                    <div className="stat-value" style={{ fontSize: 20 }}>{data.humidity}%</div>
                  </div>
                )}
                {data.wind_speed && (
                  <div className="stat-card card-sm">
                    <div className="stat-label">Wind</div>
                    <div className="stat-value" style={{ fontSize: 20 }}>{data.wind_speed} km/h</div>
                  </div>
                )}
                {data.feels_like && (
                  <div className="stat-card card-sm">
                    <div className="stat-label">Feels Like</div>
                    <div className="stat-value" style={{ fontSize: 20 }}>{data.feels_like}°</div>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.6px" }}>Full Response</div>
              <div className="data-block">{JSON.stringify(data, null, 2)}</div>
            </div>
          </>
        )}

        {!data && !loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)" }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>◎</div>
            <div style={{ fontSize: 14 }}>Click to load current weather data</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Field Sensors Screen (simulated — no hardware connected) ─────────────────

// Ranges tuned to look like plausible field-sensor readings.
const SENSOR_DEFS = [
  { key: "nitrogen", label: "Nitrogen (N)", icon: "🟢", unit: "kg/ha", min: 20, max: 120, decimals: 0, color: "var(--green)" },
  { key: "phosphorus", label: "Phosphorus (P)", icon: "🟠", unit: "kg/ha", min: 10, max: 60, decimals: 0, color: "var(--amber)" },
  { key: "potassium", label: "Potassium (K)", icon: "🟣", unit: "kg/ha", min: 20, max: 150, decimals: 0, color: "var(--blue)" },
  { key: "soilMoisture", label: "Soil Moisture", icon: "💧", unit: "%", min: 15, max: 65, decimals: 1, color: "var(--blue)" },
  { key: "humidity", label: "Humidity", icon: "🌫", unit: "%", min: 30, max: 90, decimals: 1, color: "var(--green-mid)" },
  { key: "temperature", label: "Temperature", icon: "🌡", unit: "°C", min: 18, max: 38, decimals: 1, color: "var(--red)" },
];

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

// Generates an initial reading set
function generateInitialReadings() {
  const readings = {};
  SENSOR_DEFS.forEach(s => {
    readings[s.key] = randomInRange(s.min, s.max);
  });
  return readings;
}

// Nudges each value a small random step, so it drifts instead of jumping
function driftReadings(prev) {
  const next = {};
  SENSOR_DEFS.forEach(s => {
    const range = s.max - s.min;
    const step = (Math.random() - 0.5) * range * 0.08; // ~8% of range max step
    next[s.key] = clamp(prev[s.key] + step, s.min, s.max);
  });
  return next;
}

function SensorsScreen() {
  const [readings, setReadings] = useState(generateInitialReadings);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!autoRefresh) return;
    intervalRef.current = setInterval(() => {
      setReadings(prev => driftReadings(prev));
      setLastUpdated(new Date());
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh]);

  const regenerate = () => {
    setReadings(generateInitialReadings());
    setLastUpdated(new Date());
  };

  const getStatus = (key, value) => {
    // Simple heuristic bands purely for the simulated demo
    if (key === "soilMoisture") {
      if (value < 25) return { label: "Low", cls: "badge-red" };
      if (value > 55) return { label: "High", cls: "badge-amber" };
      return { label: "Optimal", cls: "badge-green" };
    }
    if (key === "temperature") {
      if (value > 34) return { label: "Hot", cls: "badge-red" };
      if (value < 20) return { label: "Cool", cls: "badge-blue" };
      return { label: "Normal", cls: "badge-green" };
    }
    if (key === "humidity") {
      if (value > 80) return { label: "High", cls: "badge-amber" };
      if (value < 35) return { label: "Low", cls: "badge-amber" };
      return { label: "Normal", cls: "badge-green" };
    }
    return { label: "Normal", cls: "badge-green" };
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Field Sensors</div>
          <div className="page-subtitle">NPK · Soil Moisture · Humidity · Temperature</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="badge badge-amber">⚠ No sensor connected · showing simulated data</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text3)" }}>
            {autoRefresh && <span className="live-dot" />}
            <span>
              {autoRefresh ? "Auto-updating every 4s" : "Auto-update paused"} · last updated{" "}
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-outline" onClick={() => setAutoRefresh(a => !a)}>
              {autoRefresh ? "⏸ Pause" : "▶ Resume"}
            </button>
            <button className="btn btn-primary" onClick={regenerate}>
              ↻ New Reading
            </button>
          </div>
        </div>
      </div>

      <div className="grid-3">
        {SENSOR_DEFS.map(s => {
          const value = readings[s.key];
          const pct = ((value - s.min) / (s.max - s.min)) * 100;
          const status = getStatus(s.key, value);
          return (
            <div key={s.key} className="sensor-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span className="sensor-icon">{s.icon}</span>
                <span className={`badge ${status.cls}`}>{status.label}</span>
              </div>
              <div className="sensor-label">{s.label}</div>
              <div className="sensor-value">
                {value.toFixed(s.decimals)}<span className="sensor-unit">{s.unit}</span>
              </div>
              <div className="sensor-bar-track">
                <div className="sensor-bar-fill" style={{ width: `${pct}%`, background: s.color }} />
              </div>
              <div className="sensor-range">Range {s.min}–{s.max} {s.unit}</div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Raw Reading</div>
        <div style={{ fontSize: 13, color: "var(--text3)" }}>Simulated payload — swap this screen's data source for a real endpoint (e.g. GET /api/sensors/field) once hardware is wired up.</div>
        <div className="data-block">
          {JSON.stringify(
            Object.fromEntries(SENSOR_DEFS.map(s => [s.key, Number(readings[s.key].toFixed(s.decimals))])),
            null,
            2
          )}
        </div>
      </div>
    </div>
  );
}

function AiScreen({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ query: userMsg, thread_id: userId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const reply = data.reply || data.response || data.message || data.answer || data.output || JSON.stringify(data);
      setMessages(m => [...m, { role: "ai", text: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: "ai", text: `Error: ${e.message}`, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">AI Assistant</div>
          <div className="page-subtitle">Chatting as <strong>{userId}</strong> · POST /api/ai/chat</div>
        </div>
      </div>

      <div className="chat-wrap">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-icon">✦</div>
              <div style={{ fontWeight: 500, color: "var(--text2)" }}>Ask the AI Assistant</div>
              <div style={{ fontSize: 13 }}>Get insights on crops, prices, weather, and more</div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i}
                className={`chat-bubble ${m.role === "user" ? "bubble-user" : "bubble-ai"}`}
                style={m.isError ? { background: "var(--red-light)", border: "1px solid #f0c0c0", color: "var(--red)" } : {}}
              >
                <div className="bubble-label">{m.role === "user" ? userId : "AI Assistant"}</div>
                {m.text}
              </div>
            ))
          )}
          {loading && (
            <div className="chat-bubble bubble-ai">
              <div className="bubble-label">AI Assistant</div>
              <div className="loading" style={{ padding: 0 }}>
                <div className="spinner" /> Thinking…
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Ask about crops, prices, weather, or market trends…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            disabled={loading}
          />
          <button className="chat-send" onClick={sendMessage} disabled={loading || !input.trim()}>
            ✦
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem("user_id") || "");
  const [screen, setScreen] = useState("home");

  const handleLogin = (id) => setUserId(id);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setUserId("");
    setScreen("home");
  };

  if (!userId) {
    return (
      <>
        <style>{styles}</style>
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  const screens = {
    home: <HomeScreen navigate={setScreen} userId={userId} />,
    mandi: <MandiScreen />,
    predict: <PredictScreen />,
    weather: <WeatherScreen />,
    sensors: <SensorsScreen />,
    ai: <AiScreen userId={userId} />,
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <span className="brand-icon">🌾</span>
            <div className="brand-name">AgriDash</div>
            <div className="brand-sub">Backend Explorer</div>
          </div>
          <nav className="nav">
            {NAV_ITEMS.map(item => (
              <div
                key={item.id}
                className={`nav-item ${screen === item.id ? "active" : ""}`}
                onClick={() => setScreen(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">{userId[0].toUpperCase()}</div>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userId}</span>
            </div>
            <div className="api-indicator" style={{ marginBottom: 6 }}>
              <div className="dot" />
              <span>localhost:8000</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Switch user</button>
          </div>
        </aside>
        <main className="main">
          {screens[screen]}
        </main>
      </div>
    </>
  );
}