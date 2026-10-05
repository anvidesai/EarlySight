/**
 * EarlySight — Emerging Risks Page Entry
 */
import '../styles/styles.css';
import { EMERGING_RISKS_PANEL } from '../data/dashboard-data.js';
import './global-nav.js';
import './micro-interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('risksGridContainer');
  const searchInput = document.getElementById('riskSearchInput');
  const severityFilter = document.getElementById('riskSeverityFilter');
  const locationFilter = document.getElementById('riskLocationFilter');

  const risks = (typeof EMERGING_RISKS_PANEL !== 'undefined' ? EMERGING_RISKS_PANEL : window.EMERGING_RISKS_PANEL) || [];

  function getBadge(sev) {
    const s = sev.toLowerCase();
    if (s === 'critical') return '<span class="risk-severity-pill badge-severity-critical">Critical</span>';
    if (s === 'high') return '<span class="risk-severity-pill badge-severity-high">High</span>';
    if (s === 'medium') return '<span class="risk-severity-pill badge-severity-medium">Medium</span>';
    return '<span class="risk-severity-pill badge-severity-low">Low</span>';
  }

  function renderRiskMatrix() {
    const matrixContainer = document.getElementById('riskSeverityMatrix');
    if (!matrixContainer) return;

    matrixContainer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid var(--border-subtle); padding-bottom:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="indicator-dot dot-vermilion"></span>
          <h3 style="font-size:0.92rem; font-weight:700; color:var(--ink-primary); margin:0;">Operational Risk Severity Matrix</h3>
        </div>
        <span class="dash-viz-badge badge-forest-subtle">Likelihood vs. Severity Mapping</span>
      </div>

      <div class="risk-matrix-grid">
        <div class="matrix-header-cell">Severity</div>
        <div class="matrix-header-cell">Low Likelihood</div>
        <div class="matrix-header-cell">Moderate</div>
        <div class="matrix-header-cell">High Likelihood</div>
        <div class="matrix-header-cell" style="color:var(--color-rust);">Impending</div>

        <!-- Row 1: Critical -->
        <div class="matrix-header-cell" style="color:var(--color-rust); font-weight:700;">Critical</div>
        <div class="risk-matrix-cell cell-medium"></div>
        <div class="risk-matrix-cell cell-high"></div>
        <div class="risk-matrix-cell cell-critical"></div>
        <div class="risk-matrix-cell cell-critical">
          <div class="matrix-risk-chip" style="border-left:3px solid var(--color-rust);">
            <strong>RSK-04 Bearing Fatigue</strong>
            <span style="display:block; font-size:0.68rem; color:#57606A;">Drive AX-402 • 94.6% Conf</span>
          </div>
        </div>

        <!-- Row 2: High -->
        <div class="matrix-header-cell" style="color:var(--color-rust);">High</div>
        <div class="risk-matrix-cell cell-low"></div>
        <div class="risk-matrix-cell cell-high">
          <div class="matrix-risk-chip" style="border-left:3px solid var(--color-rust);">
            <strong>RSK-05 Valve Cavitation</strong>
            <span style="display:block; font-size:0.68rem; color:#57606A;">Block C • 91.2% Conf</span>
          </div>
        </div>
        <div class="risk-matrix-cell cell-critical">
          <div class="matrix-risk-chip" style="border-left:3px solid var(--color-rust);">
            <strong>RSK-01 Water Leakage</strong>
            <span style="display:block; font-size:0.68rem; color:#57606A;">Block A • 91.0% Conf</span>
          </div>
        </div>
        <div class="risk-matrix-cell cell-critical"></div>

        <!-- Row 3: Medium -->
        <div class="matrix-header-cell" style="color:var(--color-amber);">Medium</div>
        <div class="risk-matrix-cell cell-low"></div>
        <div class="risk-matrix-cell cell-medium">
          <div class="matrix-risk-chip" style="border-left:3px solid var(--color-amber);">
            <strong>RSK-02 HVAC Failure</strong>
            <span style="display:block; font-size:0.68rem; color:#57606A;">Eng Bldg • 84% Conf</span>
          </div>
        </div>
        <div class="risk-matrix-cell cell-high">
          <div class="matrix-risk-chip" style="border-left:3px solid var(--color-amber);">
            <strong>RSK-03 Overcrowding</strong>
            <span style="display:block; font-size:0.68rem; color:#57606A;">Cafeteria • 88% Conf</span>
          </div>
        </div>
        <div class="risk-matrix-cell cell-high"></div>

        <!-- Row 4: Low -->
        <div class="matrix-header-cell" style="color:var(--color-sage);">Low</div>
        <div class="risk-matrix-cell cell-low"></div>
        <div class="risk-matrix-cell cell-low">
          <div class="matrix-risk-chip" style="border-left:3px solid var(--color-sage);">
            <strong>RSK-06 Gear Pitting</strong>
            <span style="display:block; font-size:0.68rem; color:#57606A;">Conveyor 7 • 87.4% Conf</span>
          </div>
        </div>
        <div class="risk-matrix-cell cell-medium"></div>
        <div class="risk-matrix-cell cell-medium"></div>
      </div>
    `;
  }

  function renderProgressionTimeline() {
    const progContainer = document.getElementById('riskProgressionTimeline');
    if (!progContainer) return;

    progContainer.innerHTML = `
      <div class="causal-pipeline-header">
        <div class="causal-pipeline-title-group">
          <span class="indicator-dot dot-vermilion"></span>
          <h3 class="dash-viz-title">Risk Progression Lifecycle</h3>
        </div>
        <span class="dash-viz-badge badge-trend-alert">18d Lead Time Window</span>
      </div>

      <div class="causal-pipeline-flow">
        
        <div class="causal-node-card">
          <div class="causal-node-top">
            <span class="causal-node-step">Stage 1</span>
            <span class="causal-node-badge" style="background:#EDF3F0; color:#1B4332;">Detected</span>
          </div>
          <div class="causal-node-title">Signal Detected</div>
          <div class="causal-node-desc">Weak multi-modal signals captured by sub-slab acoustic transducers & shift logs.</div>
          <div class="causal-node-meta">T-28 Days • Noise floor</div>
        </div>

        <div class="causal-connector-arrow">&rarr;</div>

        <div class="causal-node-card">
          <div class="causal-node-top">
            <span class="causal-node-step">Stage 2</span>
            <span class="causal-node-badge" style="background:#FAF8F5; color:#C27803;">Correlated</span>
          </div>
          <div class="causal-node-title">Pattern Identified</div>
          <div class="causal-node-desc">Cross-silo MTGNN graph matches 3,420 Hz envelope harmonic & grease sample discoloration.</div>
          <div class="causal-node-meta">T-18 Days • 91.4% Coherence</div>
        </div>

        <div class="causal-connector-arrow">&rarr;</div>

        <div class="causal-node-card" style="border-left:3px solid var(--color-rust);">
          <div class="causal-node-top">
            <span class="causal-node-step" style="color:var(--color-rust);">Stage 3</span>
            <span class="causal-node-badge" style="background:#FDF1EE; color:#A43A2A;">Active Alert</span>
          </div>
          <div class="causal-node-title">Risk Generated</div>
          <div class="causal-node-desc">Pre-failure early warning issued with 18-day countdown before line shutdown.</div>
          <div class="causal-node-meta">T-14 Days • High Severity</div>
        </div>

        <div class="causal-connector-arrow">&rarr;</div>

        <div class="causal-node-card" style="border-left:3px solid var(--color-forest);">
          <div class="causal-node-top">
            <span class="causal-node-step">Stage 4</span>
            <span class="causal-node-badge" style="background:#EDF3F0; color:#1B4332;">Remediation</span>
          </div>
          <div class="causal-node-title">Action Initiated</div>
          <div class="causal-node-desc">Prescriptive work order WO-2026-9810 assigned to Mechanical Reliability team.</div>
          <div class="causal-node-meta">Closed-Loop Resolution</div>
        </div>

      </div>
    `;
  }

  function render(items) {
    if (!container) return;
    if (items.length === 0) {
      container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:48px; color:var(--ink-muted);">No emerging risks match your criteria.</div>';
      return;
    }

    container.innerHTML = items.map(r => `
      <div class="risk-card" onclick="location.href='evidence.html'">
        <div class="risk-card-top">
          ${getBadge(r.severity)}
          <span class="risk-status-pill ${r.statusBadgeClass}">${r.status}</span>
        </div>

        <div>
          <h3 class="risk-card-title">${r.title}</h3>
          <div class="risk-location-row" style="margin-top:4px;">
            <span class="location-marker-dot"></span>
            <span>Location: <strong>${r.location}</strong></span>
            <span>•</span>
            <span class="font-mono text-muted">${r.subsystem || 'Subsystem'}</span>
          </div>
        </div>

        <div class="risk-signals-strip">
          <span style="background:var(--color-ivory-subtle); border:1px solid var(--border-subtle); padding:2px 8px; border-radius:4px; font-weight:600; color:var(--intel-primary);">
            ${r.signalsCount} Supporting Precursors
          </span>
          <span class="text-vermilion" style="font-weight:600;">Trend: ${r.trend}</span>
        </div>

        <div class="risk-rec-action-box">
          <strong>Recommended Action:</strong>
          ${r.recommendedAction || 'Schedule preventive inspection and review telemetry baseline.'}
        </div>

        <!-- Enhanced Confidence Gauge & Supporting Signal Strip -->
        <div style="background:var(--color-ivory-subtle); border:1px solid var(--border-subtle); border-radius:6px; padding:10px 12px; margin: 10px 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:0.75rem;">
            <span class="font-mono text-muted" style="text-transform:uppercase; font-size:0.68rem;">Model Confidence</span>
            <span class="font-mono" style="font-weight:700; color:var(--color-forest);">${r.confidence}</span>
          </div>
          <div style="height:6px; background:#E4E0D8; border-radius:3px; overflow:hidden;">
            <div style="width:${r.confidence}; height:100%; background:var(--color-forest); border-radius:3px;"></div>
          </div>
        </div>

        <div class="risk-metrics-row">
          <div class="risk-metric-col">
            <span class="m-label">First Seen</span>
            <span class="m-val">${r.firstDetected}</span>
          </div>
          <div class="risk-metric-col">
            <span class="m-label">Last Detected</span>
            <span class="m-val">${r.lastDetected || r.lastUpdated}</span>
          </div>
          <div class="risk-metric-col">
            <span class="m-label">Evidence Citations</span>
            <span class="m-val text-forest">4 Modalities</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  function filter() {
    const q = (searchInput && searchInput.value || '').toLowerCase();
    const sev = severityFilter ? severityFilter.value : 'all';
    const loc = locationFilter ? locationFilter.value : 'all';

    const filtered = risks.filter(r => {
      const matchQ = !q || r.title.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || (r.subsystem && r.subsystem.toLowerCase().includes(q));
      const matchSev = sev === 'all' || r.severity.toLowerCase() === sev.toLowerCase();
      const matchLoc = loc === 'all' || r.location.toLowerCase().includes(loc.toLowerCase());
      return matchQ && matchSev && matchLoc;
    });

    render(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filter);
  if (severityFilter) severityFilter.addEventListener('change', filter);
  if (locationFilter) locationFilter.addEventListener('change', filter);

  renderRiskMatrix();
  renderProgressionTimeline();
  render(risks);
});
