/**
 * EarlySight — Signals Page Entry
 */
import '../styles/styles.css';
import { OPERATIONAL_SIGNALS_REGISTRY } from '../data/signals-data.js';
import './global-nav.js';
import './micro-interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('signalsTableBody');
  const searchInput = document.getElementById('signalSearchInput');
  const categoryFilter = document.getElementById('signalCategoryFilter');
  const locationFilter = document.getElementById('signalLocationFilter');
  const severityFilter = document.getElementById('signalSeverityFilter');
  const statusFilter = document.getElementById('signalStatusFilter');
  const dateFilter = document.getElementById('signalDateFilter');

  // Modal elements
  const modal = document.getElementById('signalDetailModal');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerCloseFooterBtn = document.getElementById('drawerCloseFooterBtn');

  const signals = (typeof OPERATIONAL_SIGNALS_REGISTRY !== 'undefined' ? OPERATIONAL_SIGNALS_REGISTRY : window.OPERATIONAL_SIGNALS_REGISTRY) || [];

  function getSeverityBadge(sev) {
    const s = sev.toLowerCase();
    if (s === 'critical') return '<span class="risk-severity-pill badge-severity-critical">Critical</span>';
    if (s === 'high') return '<span class="risk-severity-pill badge-severity-high">High</span>';
    if (s === 'medium') return '<span class="risk-severity-pill badge-severity-medium">Medium</span>';
    return '<span class="risk-severity-pill badge-severity-low">Low</span>';
  }

  function getStatusBadge(st) {
    return `<span class="risk-status-pill badge-status-investigation">${st}</span>`;
  }

  function renderTable(data) {
    if (!tableBody) return;
    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px; color:var(--ink-muted);">No operational signals match your filter criteria.</td></tr>`;
      return;
    }

    tableBody.innerHTML = data.map(item => `
      <tr data-id="${item.id}" onclick="inspectSignal('${item.id}')">
        <td>
          <div class="signal-title-cell">
            <span class="signal-id-tag">${item.id}</span>
            <span class="signal-title-text">${item.title}</span>
          </div>
        </td>
        <td><span class="signal-category-badge">${item.category}</span></td>
        <td><strong style="color:var(--ink-primary);">${item.location}</strong></td>
        <td>${getSeverityBadge(item.severity)}</td>
        <td>${getStatusBadge(item.status)}</td>
        <td><span style="font-family:var(--font-mono); font-size:0.78rem; color:var(--ink-secondary);">${item.detected}</span></td>
        <td>
          <span style="background:var(--color-ivory-subtle); padding:3px 8px; border-radius:4px; font-weight:600; font-size:0.78rem; border:1px solid var(--border-subtle); color:var(--intel-primary);">
            ${item.relatedCount} signals
          </span>
        </td>
        <td>
          <button class="signal-action-btn" onclick="event.stopPropagation(); inspectSignal('${item.id}')">
            Inspect &rarr;
          </button>
        </td>
      </tr>
    `).join('');
  }

  function applyFilters() {
    const q = (searchInput && searchInput.value || '').toLowerCase();
    const cat = categoryFilter ? categoryFilter.value : 'all';
    const loc = locationFilter ? locationFilter.value : 'all';
    const sev = severityFilter ? severityFilter.value : 'all';
    const stat = statusFilter ? statusFilter.value : 'all';

    const filtered = signals.filter(s => {
      const matchQ = !q || s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.location.toLowerCase().includes(q);
      const matchCat = cat === 'all' || s.category.toLowerCase() === cat.toLowerCase();
      const matchLoc = loc === 'all' || s.location.toLowerCase().includes(loc.toLowerCase());
      const matchSev = sev === 'all' || s.severity.toLowerCase() === sev.toLowerCase();
      const matchStat = stat === 'all' || s.status.toLowerCase() === stat.toLowerCase();

      return matchQ && matchCat && matchLoc && matchSev && matchStat;
    });

    renderTable(filtered);
  }

  window.inspectSignal = function(id) {
    const item = signals.find(s => s.id === id) || signals[0];
    if (!item) return;

    const elTitle = document.getElementById('drawerSignalTitle');
    if (elTitle) elTitle.textContent = item.title;
    const elDesc = document.getElementById('drawerDescription');
    if (elDesc) elDesc.textContent = item.description;
    const elMeta = document.getElementById('drawerSourceMeta');
    if (elMeta) elMeta.textContent = `Source: ${item.source} • Ingested: ${item.createdDate}`;
    const elLoc = document.getElementById('drawerLocationVal');
    if (elLoc) elLoc.textContent = `${item.location} (${item.locationsCount || 4} points)`;
    const elSev = document.getElementById('drawerSeverityVal');
    if (elSev) elSev.textContent = `${item.severity} Severity • ${item.status}`;
    const elRel = document.getElementById('drawerRelatedVal');
    if (elRel) elRel.textContent = `${item.relatedCount} Related Signals`;
    const elFreq = document.getElementById('drawerFrequencyVal');
    if (elFreq) elFreq.textContent = item.frequencyTrend || 'Increasing frequency';
    const elAi = document.getElementById('drawerAiAnalysis');
    if (elAi) elAi.textContent = item.aiAnalysis;
    const elRec = document.getElementById('drawerRecommendedAction');
    if (elRec) elRec.textContent = item.recommendedAction;

    // Evidence
    const evContainer = document.getElementById('drawerEvidenceList');
    if (evContainer) {
      evContainer.innerHTML = (item.evidence || []).map(e => `
        <div class="evidence-card-item">
          <span class="ev-type">${e.type}</span>
          <span class="ev-title">${e.title}</span>
          <span class="ev-detail">${e.detail}</span>
        </div>
      `).join('');
    }

    // Timeline
    const tlContainer = document.getElementById('drawerTimelineList');
    if (tlContainer) {
      tlContainer.innerHTML = (item.timeline || []).map(t => `
        <div class="timeline-step-item">
          <div class="step-period">${t.period} &bull; ${t.count} signals</div>
          <div class="step-desc">${t.note}</div>
        </div>
      `).join('');
    }

    if (modal) modal.classList.add('open');
  };

  function closeModal() {
    if (modal) modal.classList.remove('open');
  }

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeModal);
  if (drawerCloseFooterBtn) drawerCloseFooterBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function renderAnalyticsStrip() {
    const container = document.getElementById('signalsAnalyticsStrip');
    if (!container) return;

    container.innerHTML = `
      <div class="signals-analytics-row-top">
        
        <!-- 1. Frequency Velocity -->
        <div class="sig-analytics-panel">
          <div class="sig-panel-header">
            <span class="sig-panel-title">Frequency Velocity</span>
            <span class="sig-panel-badge" style="background:#FDF1EE; color:#A43A2A;">+320% Surge</span>
          </div>

          <div class="sig-frequency-sparkline">
            <svg viewBox="0 0 280 48" preserveAspectRatio="none" style="width:100%; height:100%;">
              <defs>
                <linearGradient id="sigSparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#A43A2A" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#A43A2A" stop-opacity="0.02"/>
                </linearGradient>
              </defs>
              <path d="M 10,40 L 90,34 L 180,22 L 270,6 L 270,48 L 10,48 Z" fill="url(#sigSparkGrad)"/>
              <path d="M 10,40 L 90,34 L 180,22 L 270,6" fill="none" stroke="#A43A2A" stroke-width="2.2" stroke-linecap="round"/>
              <circle cx="10" cy="40" r="3" fill="#FFFFFF" stroke="#A43A2A" stroke-width="1.8"/>
              <circle cx="90" cy="34" r="3" fill="#FFFFFF" stroke="#A43A2A" stroke-width="1.8"/>
              <circle cx="180" cy="22" r="3" fill="#FFFFFF" stroke="#A43A2A" stroke-width="1.8"/>
              <circle cx="270" cy="6" r="4" fill="#A43A2A" stroke="#FFFFFF" stroke-width="1.8"/>
            </svg>
          </div>

          <div class="sig-frequency-meta">
            <span class="font-mono">W1: 18 &rarr; W4: 128</span>
            <span style="font-weight:600; color:var(--color-rust);">Accelerating Rate</span>
          </div>
        </div>

        <!-- 2. Category Distribution -->
        <div class="sig-analytics-panel">
          <div class="sig-panel-header">
            <span class="sig-panel-title">Category Distribution</span>
            <span class="sig-panel-badge" style="background:#EDF3F0; color:#1B4332;">6 Modalities</span>
          </div>

          <div class="sig-category-bar">
            <div style="width:33%; background:#A43A2A;" title="Equipment: 42"></div>
            <div style="width:19%; background:#C27803;" title="Electrical: 24"></div>
            <div style="width:16%; background:#57606A;" title="Overcrowding: 20"></div>
            <div style="width:14%; background:#1B4332;" title="Water: 18"></div>
            <div style="width:11%; background:#4D7C5D;" title="Safety: 14"></div>
            <div style="width:7%; background:#8C959F;" title="Maintenance: 10"></div>
          </div>

          <div class="sig-cat-pills-grid font-mono">
            <div class="sig-cat-pill">
              <span style="color:#A43A2A;">● Equipment</span>
              <strong>42 (33%)</strong>
            </div>
            <div class="sig-cat-pill">
              <span style="color:#C27803;">● Electrical</span>
              <strong>24 (19%)</strong>
            </div>
            <div class="sig-cat-pill">
              <span style="color:#57606A;">● Overcrowding</span>
              <strong>20 (16%)</strong>
            </div>
            <div class="sig-cat-pill">
              <span style="color:#1B4332;">● Water Leak</span>
              <strong>18 (14%)</strong>
            </div>
          </div>
        </div>

        <!-- 3. Severity & Connections -->
        <div class="sig-analytics-panel">
          <div class="sig-panel-header">
            <span class="sig-panel-title">Severity & Graph Links</span>
            <span class="sig-panel-badge" style="background:#EDF3F0; color:#1B4332;">48 Graph Links</span>
          </div>

          <div style="display:flex; justify-content:space-between; gap:6px; margin-bottom:10px;">
            <span class="risk-severity-pill badge-severity-critical" style="font-size:0.68rem; padding:3px 6px;">8 Crit</span>
            <span class="risk-severity-pill badge-severity-high" style="font-size:0.68rem; padding:3px 6px;">18 High</span>
            <span class="risk-severity-pill badge-severity-medium" style="font-size:0.68rem; padding:3px 6px;">38 Med</span>
            <span class="risk-severity-pill badge-severity-low" style="font-size:0.68rem; padding:3px 6px;">64 Low</span>
          </div>

          <div style="background:var(--color-ivory-subtle); padding:6px 10px; border-radius:4px; font-size:0.75rem; color:var(--ink-secondary); border:1px solid var(--border-subtle);">
            <strong>Coherence:</strong> 91.4% Spatial-Temporal Match across 6 facility zones
          </div>
        </div>

      </div>

      <!-- Recurring Pattern Alerts Strip -->
      <div class="sig-recurring-banner">
        <div class="sig-recurring-item">
          <span class="indicator-dot dot-vermilion"></span>
          <span><strong>SIG-EQP-02 (Drive AX-402):</strong> Impending spallation precursor (+2.84&sigma; envelope acceleration)</span>
        </div>
        <div class="sig-recurring-item">
          <span class="indicator-dot dot-amber"></span>
          <span><strong>SIG-WTR-01 (Block A Trench 4B):</strong> Recurring sub-slab moisture pattern (12 linked signals)</span>
        </div>
        <div class="sig-recurring-item">
          <span class="indicator-dot dot-slate"></span>
          <span><strong>SIG-ELE-03 (Bus 3B):</strong> Cyclical THD harmonic drift</span>
        </div>
      </div>
    `;
  }

  [searchInput, categoryFilter, locationFilter, severityFilter, statusFilter, dateFilter].forEach(el => {
    if (el) el.addEventListener('input', applyFilters);
  });

  renderAnalyticsStrip();
  renderTable(signals);
});
