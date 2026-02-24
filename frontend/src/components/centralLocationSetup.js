import React, { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #f0ede8;
    --bg2:         #e8e4de;
    --surface:     #ffffff;
    --surface2:    #f7f5f2;
    --border:      #d8d3cb;
    --border2:     #c8c2b8;
    --text:        #1a1714;
    --text2:       #5a544c;
    --text3:       #9a9088;
    --accent:      #c8440a;
    --accent2:     #e85820;
    --accent-bg:   #fff0eb;
    --red:         #d63b3b;
    --red-bg:      #fff0f0;
    --red-border:  #f5c0c0;
    --yellow:      #c47a10;
    --yellow-bg:   #fff8eb;
    --yellow-border:#f0d898;
    --green:       #2a8a52;
    --green-bg:    #ebfaf2;
    --green-border:#a8e0c0;
    --shadow-sm:   0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:   0 4px 16px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06);
    --shadow-lg:   0 8px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06);
    --radius:      10px;
    --radius-sm:   6px;
  }

  html, body { background: var(--bg); }

  .app-root {
    min-height: 100vh;
    background: var(--bg);
    background-image: radial-gradient(circle at 20% 20%, rgba(200,68,10,0.06) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(42,138,82,0.05) 0%, transparent 50%);
    padding: 0;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
  }

  /* ── TOP NAV ── */
  .topnav {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: var(--shadow-sm);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .topnav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .topnav-logo {
    width: 30px;
    height: 30px;
    background: var(--accent);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: -1px;
  }

  .topnav-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 16px;
    letter-spacing: -0.3px;
    color: var(--text);
  }

  .topnav-sep {
    width: 1px;
    height: 20px;
    background: var(--border);
    margin: 0 12px;
  }

  .topnav-section {
    font-size: 13px;
    color: var(--text3);
    font-weight: 400;
  }

  .topnav-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .role-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 20px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    border: 1px solid;
  }

  .role-chip.admin   { background: #fff8eb; color: #9a5c00; border-color: #f0d898; }
  .role-chip.supervisor { background: #ebf4ff; color: #1a5ea8; border-color: #a8ccf0; }
  .role-chip.worker  { background: var(--green-bg); color: var(--green); border-color: var(--green-border); }

  .role-chip-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
  }
  .role-chip.admin   .role-chip-dot { background: #c47a10; }
  .role-chip.supervisor .role-chip-dot { background: #2a6abf; box-shadow: 0 0 0 2px #a8ccf040; }
  .role-chip.worker  .role-chip-dot { background: var(--green); box-shadow: 0 0 0 2px #2a8a5220; animation: pulse 2s infinite; }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 2px #2a8a5220; }
    50% { box-shadow: 0 0 0 5px #2a8a5210; }
  }

  /* ── LAYOUT ── */
  .page-body {
    max-width: 780px;
    margin: 0 auto;
    padding: 36px 24px 80px;
  }

  .page-heading {
    margin-bottom: 28px;
  }

  .page-heading h1 {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.8px;
    color: var(--text);
    line-height: 1.15;
  }

  .page-heading p {
    font-size: 14px;
    color: var(--text3);
    margin-top: 6px;
    font-weight: 400;
  }

  /* ── CARDS ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    margin-bottom: 16px;
    transition: box-shadow 0.2s, border-color 0.2s;
  }

  .card:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--border2);
  }

  .card-head {
    padding: 18px 22px 14px;
    border-bottom: 1px solid var(--border);
    background: var(--surface2);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-head-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .card-icon {
    width: 32px; height: 32px;
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }

  .card-icon.orange { background: var(--accent-bg); }
  .card-icon.blue   { background: #ebf4ff; }
  .card-icon.green  { background: var(--green-bg); }

  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.2px;
  }

  .card-subtitle {
    font-size: 12px;
    color: var(--text3);
    margin-top: 1px;
  }

  .card-body {
    padding: 22px;
  }

  /* ── EQUIPMENT BLOCK ── */
  .eq-block {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 14px;
    transition: all 0.2s;
    box-shadow: var(--shadow-sm);
  }

  .eq-block:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--border2);
    transform: translateY(-1px);
  }

  .eq-block-head {
    padding: 14px 20px;
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .eq-block-id {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .eq-number-badge {
    width: 34px; height: 34px;
    background: var(--text);
    color: white;
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    flex-shrink: 0;
  }

  .eq-name {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
  }

  .eq-meta {
    font-size: 12px;
    color: var(--text3);
  }

  .eq-block-body {
    padding: 18px 20px;
  }

  /* ── STATE INDICATOR ── */
  .state-indicator {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid;
    transition: all 0.2s;
  }

  .state-indicator.Red    { background: var(--red-bg); color: var(--red); border-color: var(--red-border); }
  .state-indicator.Yellow { background: var(--yellow-bg); color: var(--yellow); border-color: var(--yellow-border); }
  .state-indicator.Green  { background: var(--green-bg); color: var(--green); border-color: var(--green-border); }

  .state-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .state-dot.Red    { background: var(--red);    box-shadow: 0 0 0 3px var(--red-border); }
  .state-dot.Yellow { background: var(--yellow); box-shadow: 0 0 0 3px var(--yellow-border); }
  .state-dot.Green  { background: var(--green);  box-shadow: 0 0 0 3px var(--green-border); animation: pulse-green 2s infinite; }

  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 0 3px var(--green-border); }
    50% { box-shadow: 0 0 0 6px rgba(42,138,82,0.15); }
  }

  /* ── HISTORY STRIP ── */
  .history-wrap {
    margin-top: 14px;
    padding: 12px 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
  }

  .history-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text3);
    margin-bottom: 8px;
  }

  .history-track {
    display: flex;
    align-items: center;
    gap: 3px;
    flex-wrap: wrap;
  }

  .history-step {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .history-pip {
    width: 22px; height: 22px;
    border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0;
    flex-shrink: 0;
    border: 1px solid;
    transition: transform 0.15s;
  }

  .history-pip:hover { transform: scale(1.15); }

  .history-pip.Red    { background: var(--red-bg);    color: var(--red);    border-color: var(--red-border); }
  .history-pip.Yellow { background: var(--yellow-bg); color: var(--yellow); border-color: var(--yellow-border); }
  .history-pip.Green  { background: var(--green-bg);  color: var(--green);  border-color: var(--green-border); }

  .history-arrow {
    color: var(--border2);
    font-size: 10px;
    flex-shrink: 0;
  }

  /* ── ORDER PILLS ── */
  .order-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  .order-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 4px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    border: 1px solid;
  }

  .order-tag.current {
    background: var(--accent-bg);
    color: var(--accent);
    border-color: rgba(200,68,10,0.2);
    font-weight: 500;
  }

  .order-tag.queued {
    background: var(--surface2);
    color: var(--text3);
    border-color: var(--border);
  }

  .order-tag-label {
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.7;
  }

  /* ── FORM ELEMENTS ── */
  .field {
    margin-bottom: 14px;
  }

  .field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text2);
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }

  .field-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .field-prefix {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--text3);
    white-space: nowrap;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-right: none;
    border-radius: var(--radius-sm) 0 0 var(--radius-sm);
    padding: 9px 10px;
    line-height: 1;
  }

  input[type="number"] {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    padding: 9px 12px;
    width: 100%;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    -moz-appearance: textfield;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }

  input[type="number"]:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(200,68,10,0.1);
  }

  input.prefix-attached {
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    flex: 1;
  }

  /* ── SELECT ── */
  .select-wrap {
    position: relative;
  }

  select {
    appearance: none;
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 38px 10px 12px;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(200,68,10,0.1);
  }

  .select-chevron {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--text3);
    font-size: 11px;
  }

  /* state-colored select */
  select.state-Red    { border-color: var(--red-border);    background: var(--red-bg); }
  select.state-Yellow { border-color: var(--yellow-border); background: var(--yellow-bg); }
  select.state-Green  { border-color: var(--green-border);  background: var(--green-bg); }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 13px;
    padding: 9px 18px;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    letter-spacing: 0.1px;
  }

  .btn-primary {
    background: var(--accent);
    color: white;
    box-shadow: 0 1px 3px rgba(200,68,10,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .btn-primary:hover {
    background: var(--accent2);
    box-shadow: 0 3px 8px rgba(200,68,10,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
    transform: translateY(-1px);
  }
  .btn-primary:active { transform: translateY(0); }

  .btn-ghost {
    background: var(--surface);
    color: var(--text2);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  .btn-ghost:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-bg);
  }

  .btn-success {
    background: var(--green);
    color: white;
    box-shadow: 0 1px 3px rgba(42,138,82,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .btn-success:hover {
    background: #238a4a;
    box-shadow: 0 3px 8px rgba(42,138,82,0.4);
    transform: translateY(-1px);
  }
  .btn-success:disabled {
    background: var(--border);
    color: var(--text3);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  .btn-block {
    width: 100%;
    padding: 12px;
    font-size: 14px;
  }

  .btn-row {
    display: flex;
    gap: 10px;
    margin-top: 18px;
    align-items: center;
  }

  /* ── REGISTERED IDS LIST ── */
  .ids-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
  }

  .id-chip {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 5px 10px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--text2);
    transition: all 0.15s;
  }

  .id-chip:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-bg);
  }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text3);
  }

  .empty-state-icon {
    font-size: 36px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .empty-state p {
    font-size: 14px;
  }

  /* ── MESSAGE BAR ── */
  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    font-weight: 500;
    margin-top: 20px;
    background: var(--green-bg);
    border: 1px solid var(--green-border);
    color: var(--green);
    animation: slideIn 0.3s ease;
  }

  .toast.error {
    background: var(--red-bg);
    border-color: var(--red-border);
    color: var(--red);
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── STATS BAR ── */
  .stats-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 18px;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s;
  }

  .stat-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -1px;
    line-height: 1;
  }

  .stat-label {
    font-size: 11px;
    color: var(--text3);
    margin-top: 4px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-accent { color: var(--accent); }
  .stat-green  { color: var(--green); }
  .stat-yellow { color: var(--yellow); }

  /* ── DIVIDER ── */
  .divider {
    height: 1px;
    background: var(--border);
    margin: 18px 0;
  }

  /* ── SECTION LABEL ── */
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text3);
    margin-bottom: 10px;
  }

  /* ── INLINE INPUT ROW ── */
  .inline-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
  }

  .inline-row input { flex: 1; }

  /* ── FADE IN ANIMATION ── */
  .fade-in {
    animation: fadeIn 0.4s ease both;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.10s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.20s; }
  .stagger-5 { animation-delay: 0.25s; }

  /* ── PROGRESS BAR ── */
  .progress-wrap {
    margin-top: 10px;
  }

  .progress-bar-bg {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 99px;
    height: 6px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, var(--green), #4ac87a);
    transition: width 0.5s ease;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--text3);
    margin-bottom: 5px;
    font-family: 'DM Mono', monospace;
  }

  .state-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .state-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.2px;
  }
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const STATE_ABBR  = { Red: 'R', Yellow: 'Y', Green: 'G' };
const STATE_LABEL = { Red: 'Standing Still', Yellow: 'Starting Up / Winding Down', Green: 'Producing Normally' };
const ROLE_ICONS  = { Admin: '⚙', Supervisor: '📋', Worker: '🔧' };
const TITLES      = { Admin: 'Equipment Setup', Supervisor: 'Order Scheduling', Worker: 'Production Monitor' };
const SUBTITLES   = {
  Admin:      'Register and manage equipment units',
  Supervisor: 'Schedule production orders for each unit',
  Worker:     'Monitor and update production states in real-time'
};

function StateDot({ state, animated }) {
  return <span className={`state-dot ${state}${animated ? '' : ''}`} />;
}

function StateIndicator({ state }) {
  return (
    <span className={`state-indicator ${state}`}>
      <StateDot state={state} />
      {STATE_LABEL[state] ?? state}
    </span>
  );
}

function HistoryStrip({ states }) {
  if (!states?.length) return null;
  return (
    <div className="history-wrap">
      <div className="history-label">Production History</div>
      <div className="history-track">
        {states.map((s, i) => (
          <span className="history-step" key={i}>
            <span className={`history-pip ${s}`} title={STATE_LABEL[s] ?? s}>
              {STATE_ABBR[s] ?? s[0]}
            </span>
            {i < states.length - 1 && <span className="history-arrow">›</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function OrderRow({ currentOrderId, scheduledOrders }) {
  return (
    <div className="order-row">
      <span className="order-tag-label" style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono,monospace' }}>Orders:</span>
      <span className={`order-tag ${currentOrderId != null ? 'current' : 'queued'}`}>
        <span className="order-tag-label">Active</span>
        {currentOrderId != null ? `#${currentOrderId}` : '—'}
      </span>
      {scheduledOrders?.length > 0 && scheduledOrders.map(id => (
        <span key={id} className="order-tag queued">
          <span className="order-tag-label">Q</span>#{id}
        </span>
      ))}
    </div>
  );
}

function StatsBar({ equipments, role }) {
  const total   = equipments.length;
  const green   = equipments.filter(e => e.currentProductionState === 'Green').length;
  const yellow  = equipments.filter(e => e.currentProductionState === 'Yellow').length;
  const red     = equipments.filter(e => e.currentProductionState === 'Red').length;
  const withOrders = equipments.filter(e => e.currentOrderId != null).length;

  if (total === 0) return null;

  if (role === 'Worker') return (
    <div className="stats-bar">
      <div className="stat-card fade-in stagger-1">
        <div className="stat-value">{total}</div>
        <div className="stat-label">Total Units</div>
      </div>
      <div className="stat-card fade-in stagger-2">
        <div className={`stat-value ${green > 0 ? 'stat-green' : ''}`}>{green}</div>
        <div className="stat-label">Producing</div>
      </div>
      <div className="stat-card fade-in stagger-3">
        <div className={`stat-value ${red > 0 ? 'stat-accent' : ''}`}>{red}</div>
        <div className="stat-label">Idle</div>
      </div>
    </div>
  );

  if (role === 'Supervisor') return (
    <div className="stats-bar">
      <div className="stat-card fade-in stagger-1">
        <div className="stat-value">{total}</div>
        <div className="stat-label">Total Units</div>
      </div>
      <div className="stat-card fade-in stagger-2">
        <div className={`stat-value ${withOrders > 0 ? 'stat-green' : ''}`}>{withOrders}</div>
        <div className="stat-label">With Orders</div>
      </div>
      <div className="stat-card fade-in stagger-3">
        <div className={`stat-value ${yellow > 0 ? 'stat-yellow' : ''}`}>{total - withOrders}</div>
        <div className="stat-label">Unscheduled</div>
      </div>
    </div>
  );

  return null;
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function CentralLocationSetup({ role }) {
  const [newEquipments, setNewEquipments]   = useState([{ id: 1 }]);
  const [allEquipments, setAllEquipments]   = useState([]);
  const [editedStates,  setEditedStates]    = useState({});
  const [ordersInput,   setOrdersInput]     = useState({});
  const [message,       setMessage]         = useState('');
  const [isError,       setIsError]         = useState(false);
  const msgTimer = useRef(null);

  const showMsg = (text, error = false) => {
    setMessage(text);
    setIsError(error);
    clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMessage(''), 4000);
  };

  const fetchEquipments = async () => {
    try {
      const res  = await fetch('http://localhost:5000/api/centrallocation', {
        method: 'GET', headers: { 'Role': role }
      });
      const data = await res.json();
      setAllEquipments(data);
    } catch (err) { showMsg(`Error: ${err.message}`, true); }
  };

  useEffect(() => { fetchEquipments(); }, [role]);

  /* Admin */
  const handleNewEquipmentChange = (index, value) => {
    const updated = [...newEquipments];
    updated[index].id = value;
    setNewEquipments(updated);
  };

  const addNewEquipment = () => {
    const lastId = newEquipments.length > 0 ? newEquipments[newEquipments.length - 1].id : 0;
    setNewEquipments([...newEquipments, { id: lastId + 1 }]);
  };

  const removeEquipment = (idx) => {
    if (newEquipments.length === 1) return;
    setNewEquipments(newEquipments.filter((_, i) => i !== idx));
  };

  const handleCreate = async e => {
    e.preventDefault();
    try {
      const res  = await fetch('http://localhost:5000/api/centrallocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Role': role },
        body: JSON.stringify({ equipments: newEquipments })
      });
      const data = await res.json();
      showMsg(data.message);
      setAllEquipments(data.equipments);
      setNewEquipments([{ id: newEquipments.length + 1 }]);
    } catch (err) { showMsg(err.message, true); }
  };

  /* Worker */
  const handleStateChange = (equipmentId, newState) => {
    setEditedStates(prev => ({ ...prev, [equipmentId]: newState }));
  };

  const handleSaveStates = async () => {
    try {
      await Promise.all(
        Object.entries(editedStates).map(([id, state]) =>
          fetch(`http://localhost:5000/api/centrallocation/record/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Role': role },
            body: JSON.stringify({ state })
          })
        )
      );
      setEditedStates({});
      showMsg('States updated successfully');
      await fetchEquipments();
    } catch (err) { showMsg(err.message, true); }
  };

  /* Supervisor */
  const handleSchedule = async (eqId) => {
    try {
      const number = ordersInput[eqId];
      if (!number || number < 1) return alert('Enter a positive number of orders.');
      const res  = await fetch(`http://localhost:5000/api/centrallocation/schedule/${eqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Role': role },
        body: JSON.stringify({ numberOfOrders: number })
      });
      const data = await res.json();
      showMsg(data.message ?? 'Orders scheduled');
      await fetchEquipments();
    } catch (err) { showMsg(err.message, true); }
  };

  const roleLower = role?.toLowerCase();

  return (
    <>
      <style>{css}</style>
      <div className="app-root">

        {/* ── TOP NAV ── */}
        <nav className="topnav">
          <div className="topnav-brand">
            <div className="topnav-logo">CL</div>
            <span className="topnav-name">CentralLine</span>
            <div className="topnav-sep" />
            <span className="topnav-section">{TITLES[role]}</span>
          </div>
          <div className="topnav-right">
            <span className={`role-chip ${roleLower}`}>
              <span className="role-chip-dot" />
              {role}
            </span>
          </div>
        </nav>

        {/* ── PAGE BODY ── */}
        <div className="page-body">

          <div className="page-heading fade-in">
            <h1>{ROLE_ICONS[role]} {TITLES[role]}</h1>
            <p>{SUBTITLES[role]}</p>
          </div>

          {/* ── STATS ── */}
          <StatsBar equipments={allEquipments} role={role} />

          {/* ════════════════════════════════
              ADMIN VIEW
          ════════════════════════════════ */}
          {role === 'Admin' && (
            <div className="fade-in stagger-1">
              <div className="card">
                <div className="card-head">
                  <div className="card-head-left">
                    <div className="card-icon orange">⚙</div>
                    <div>
                      <div className="card-title">Register Equipments</div>
                      <div className="card-subtitle">Add equipment units to the production floor</div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <form onSubmit={handleCreate}>
                    <div className="section-label">Equipment IDs</div>
                    {newEquipments.map((eq, idx) => (
                      <div className="field" key={idx}>
                        <div className="field-row">
                          <span className="field-prefix">EQ {String(idx + 1).padStart(2, '0')}</span>
                          <input
                            className="prefix-attached"
                            type="number"
                            value={eq.id}
                            min="1"
                            onChange={e => handleNewEquipmentChange(idx, Number(e.target.value))}
                            placeholder="ID"
                          />
                          {newEquipments.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ padding: '9px 12px', color: 'var(--red)', borderColor: 'var(--red-border)' }}
                              onClick={() => removeEquipment(idx)}
                            >✕</button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="btn-row">
                      <button type="button" className="btn btn-ghost" onClick={addNewEquipment}>+ Add Row</button>
                      <button type="submit" className="btn btn-primary">Register All</button>
                    </div>
                  </form>
                </div>
              </div>

              {allEquipments.length > 0 && (
                <div className="card fade-in">
                  <div className="card-head">
                    <div className="card-head-left">
                      <div className="card-icon orange">📦</div>
                      <div>
                        <div className="card-title">Registered Units</div>
                        <div className="card-subtitle">{allEquipments.length} equipment{allEquipments.length !== 1 ? 's' : ''} on record</div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="ids-grid">
                      {allEquipments.map(eq => (
                        <span key={eq.id} className="id-chip">#{eq.id}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════
              SUPERVISOR VIEW
          ════════════════════════════════ */}
          {role === 'Supervisor' && (
            <div>
              {allEquipments.length === 0 && (
                <div className="empty-state fade-in">
                  <div className="empty-state-icon">📋</div>
                  <p>No equipment units found. Ask an Admin to register units first.</p>
                </div>
              )}

              {allEquipments.map((eq, i) => (
                <div className={`eq-block fade-in stagger-${Math.min(i + 1, 5)}`} key={eq.id}>
                  <div className="eq-block-head">
                    <div className="eq-block-id">
                      <div className="eq-number-badge">#{eq.id}</div>
                      <div>
                        <div className="eq-name">Unit {eq.id}</div>
                        <div className="eq-meta">
                          {eq.histProductionStates?.length ?? 0} state{(eq.histProductionStates?.length ?? 0) !== 1 ? 's' : ''} recorded
                        </div>
                      </div>
                    </div>
                    {eq.currentOrderId != null && (
                      <span className="order-tag current">
                        <span className="order-tag-label">Active</span>
                        #{eq.currentOrderId}
                      </span>
                    )}
                  </div>

                  <div className="eq-block-body">
                    <div className="section-label">Schedule Production Orders</div>
                    <div className="inline-row">
                      <input
                        type="number"
                        min="1"
                        placeholder="Number of orders to schedule"
                        value={ordersInput[eq.id] ?? ''}
                        onChange={e => setOrdersInput(prev => ({ ...prev, [eq.id]: Number(e.target.value) }))}
                      />
                      <button className="btn btn-primary" onClick={() => handleSchedule(eq.id)}>
                        Schedule
                      </button>
                    </div>

                    <HistoryStrip states={eq.histProductionStates} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ════════════════════════════════
              WORKER VIEW
          ════════════════════════════════ */}
          {role === 'Worker' && (
            <div>
              {allEquipments.length === 0 && (
                <div className="empty-state fade-in">
                  <div className="empty-state-icon">🔧</div>
                  <p>No equipment units found. Ask an Admin to register units first.</p>
                </div>
              )}

              {allEquipments.map((eq, i) => {
                const currentState    = editedStates[eq.id] ?? eq.currentProductionState;
                const isDirty        = !!editedStates[eq.id];
                const totalOrders    = eq.scheduledOrders?.length ?? 0;
                const currentIdx     = eq.currentOrderId != null
                  ? (eq.scheduledOrders?.indexOf(eq.currentOrderId) ?? 0)
                  : totalOrders;
                const completedOrders = currentIdx;
                const pct            = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

                return (
                  <div
                    className={`eq-block fade-in stagger-${Math.min(i + 1, 5)}`}
                    key={eq.id}
                    style={isDirty ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 3px rgba(200,68,10,0.08)' } : {}}
                  >
                    <div className="eq-block-head">
                      <div className="eq-block-id">
                        <div className="eq-number-badge" style={isDirty ? { background: 'var(--accent)' } : {}}>
                          #{eq.id}
                        </div>
                        <div>
                          <div className="eq-name">Unit {eq.id}</div>
                          <div className="eq-meta">
                            {isDirty ? '● Unsaved changes' : `${completedOrders}/${totalOrders} orders completed`}
                          </div>
                        </div>
                      </div>
                      <StateIndicator state={currentState} />
                    </div>

                    <div className="eq-block-body">
                      <OrderRow
                        currentOrderId={eq.currentOrderId}
                        scheduledOrders={eq.scheduledOrders}
                      />

                      {totalOrders > 0 && (
                        <div className="progress-wrap">
                          <div className="progress-label">
                            <span>Order Progress</span>
                            <span>{completedOrders}/{totalOrders} orders</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )}

                      <div className="divider" />

                      <div className="state-section-header"><span className={`state-dot ${currentState}`} /><span className="state-section-title">Production State</span></div>
                      <div className="select-wrap">
                        <select
                          className={`state-${currentState}`}
                          value={currentState}
                          onChange={e => handleStateChange(eq.id, e.target.value)}
                        >
                          <option value="Red">🔴 Standing Still</option>
                          <option value="Yellow">🟡 Starting Up / Winding Down</option>
                          <option value="Green">🟢 Producing Normally</option>
                        </select>
                        <span className="select-chevron">▾</span>
                      </div>

                      <HistoryStrip states={eq.histProductionStates} />
                    </div>
                  </div>
                );
              })}

              {allEquipments.length > 0 && (
                <button
                  className="btn btn-success btn-block fade-in"
                  onClick={handleSaveStates}
                  disabled={Object.keys(editedStates).length === 0}
                  style={{ marginTop: 8 }}
                >
                  {Object.keys(editedStates).length === 0
                    ? 'No Changes to Save'
                    : `Save ${Object.keys(editedStates).length} Change${Object.keys(editedStates).length > 1 ? 's' : ''}`}
                </button>
              )}
            </div>
          )}

          {/* ── TOAST MESSAGE ── */}
          {message && (
            <div className={`toast ${isError ? 'error' : ''}`}>
              {isError ? '✕' : '✓'} {message}
            </div>
          )}

        </div>
      </div>
    </>
  );
}