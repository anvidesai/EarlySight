/**
 * EarlySight — Signals Page Entry (Milestone 4: Signal Intelligence)
 *
 * Implements:
 * Part 1: Signal Overview Metrics
 * Part 2: Main Operational Signals Table / List
 * Part 3: Search, Multi-Variable Filter & Reset
 * Part 4: Related Precursor Clusters & Pattern Convergence
 * Part 5: Signal Detail Explainability Drawer
 * Part 6: Signal -> Pattern -> Risk Connection
 * Part 7: Signal Frequency & Repetition Analytics
 */
import '../styles/styles.css';
import {
  OPERATIONAL_SIGNALS_REGISTRY,
  RELATED_SIGNAL_CLUSTERS,
  SIGNAL_FREQUENCY_METRICS
} from '../data/signals-data.js';
import './global-nav.js';
import './micro-interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const tableBody = document.getElementById('signalsTableBody');
  const searchInput = document.getElementById('signalSearchInput');
  const sourceTypeFilter = document.getElementById('signalSourceTypeFilter');
  const categoryFilter = document.getElementById('signalCategoryFilter');
  const locationFilter = document.getElementById('signalLocationFilter');
  const severityFilter = document.getElementById('signalSeverityFilter');
  const statusFilter = document.getElementById('signalStatusFilter');
  const dateFilter = document.getElementById('signalDateFilter');
  const btnResetFilters = document.getElementById('btnResetFilters');
  const resultsCountEl = document.getElementById('signalResultsCount');

  // Modal Elements
  const modal = document.getElementById('signalDetailModal');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerCloseFooterBtn = document.getElementById('drawerCloseFooterBtn');

  // Datasets
  const signals = (typeof OPERATIONAL_SIGNALS_REGISTRY !== 'undefined'
    ? OPERATIONAL_SIGNALS_REGISTRY
    : window.OPERATIONAL_SIGNALS_REGISTRY) || [];

  const clusters = (typeof RELATED_SIGNAL_CLUSTERS !== 'undefined'
    ? RELATED_SIGNAL_CLUSTERS
    : window.RELATED_SIGNAL_CLUSTERS) || [];

  const frequencyMetrics = (typeof SIGNAL_FREQUENCY_METRICS !== 'undefined'
    ? SIGNAL_FREQUENCY_METRICS
    : window.SIGNAL_FREQUENCY_METRICS) || null;

  let activeClusterId = 'all';

  // --- BADGE HELPERS ---
  function getSeverityBadge(sev) {
    const s = (sev || '').toLowerCase();
    if (s === 'critical') return '<span class="badge-sev badge-sev-critical">Critical</span>';
    if (s === 'high') return '<span class="badge-sev badge-sev-high">High</span>';
    if (s === 'medium') return '<span class="badge-sev badge-sev-medium">Medium</span>';
    return '<span class="badge-sev badge-sev-low">Low</span>';
  }

  function getStatusBadge(st) {
    const s = (st || '').toLowerCase();
    let badgeClass = 'badge-status-investigation';
    if (s === 'active') badgeClass = 'badge-status-active';
    if (s === 'action queued') badgeClass = 'badge-status-queued';
    if (s === 'resolved') badgeClass = 'badge-status-resolved';
    return `<span class="risk-status-pill ${badgeClass}">${st}</span>`;
  }

  function getSourceBadge(sourceType) {
    const type = sourceType || 'Sensor';
    let iconSvg = '';
    let badgeClass = 'badge-source-sensor';

    switch (type) {
      case 'Complaint':
        badgeClass = 'badge-source-complaint';
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
        break;
      case 'Maintenance Report':
        badgeClass = 'badge-source-maintenance';
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
        break;
      case 'Image':
        badgeClass = 'badge-source-image';
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
        break;
      case 'Document':
        badgeClass = 'badge-source-document';
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
        break;
      case 'Incident Report':
        badgeClass = 'badge-source-incident';
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
        break;
      case 'Sensor':
      default:
        badgeClass = 'badge-source-sensor';
        iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
        break;
    }

    return `<span class="badge-source ${badgeClass}">${iconSvg}<span>${type}</span></span>`;
  }

  // --- PART 7: OPERATIONAL FREQUENCY ANALYTICS STRIP ---
  function renderAnalyticsStrip() {
    const container = document.getElementById('signalsAnalyticsStrip');
    if (!container) return;

    const issues = frequencyMetrics ? frequencyMetrics.topRepeatingIssues : [];

    container.innerHTML = `
      <div class="signals-analytics-row-top">
        
        <!-- 1. Frequency Velocity -->
        <div class="sig-analytics-panel">
          <div class="sig-panel-header">
            <span class="sig-panel-title">Signal Ingress Velocity</span>
            <span class="sig-panel-badge" style="background:#FDF1EE; color:#A43A2A;">+320% Surge</span>
          </div>

          <div class="sig-frequency-sparkline">
            <svg viewBox="0 0 280 48" preserveAspectRatio="none" style="width:100%; height:100%;">
              <defs>
                <linearGradient id="sigSparkGradM4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#A43A2A" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="#A43A2A" stop-opacity="0.02"/>
                </linearGradient>
              </defs>
              <path d="M 10,40 L 90,34 L 180,22 L 270,6 L 270,48 L 10,48 Z" fill="url(#sigSparkGradM4)"/>
              <path d="M 10,40 L 90,34 L 180,22 L 270,6" fill="none" stroke="#A43A2A" stroke-width="2.4" stroke-linecap="round"/>
              <circle cx="10" cy="40" r="3.2" fill="#FFFFFF" stroke="#A43A2A" stroke-width="1.8"/>
              <circle cx="90" cy="34" r="3.2" fill="#FFFFFF" stroke="#A43A2A" stroke-width="1.8"/>
              <circle cx="180" cy="22" r="3.2" fill="#FFFFFF" stroke="#A43A2A" stroke-width="1.8"/>
              <circle cx="270" cy="6" r="4.2" fill="#A43A2A" stroke="#FFFFFF" stroke-width="1.8"/>
            </svg>
          </div>

          <div class="sig-frequency-meta font-mono">
            <span>W1: 18 &rarr; W4: 128 Signals</span>
            <span style="font-weight:700; color:#A43A2A;">Accelerating Surge</span>
          </div>
        </div>

        <!-- 2. Category Distribution -->
        <div class="sig-analytics-panel">
          <div class="sig-panel-header">
            <span class="sig-panel-title">Top Repeated Categories</span>
            <span class="sig-panel-badge" style="background:#EDF3F0; color:#1B4332;">6 Modalities</span>
          </div>

          <div class="sig-category-bar">
            <div style="width:33%; background:#A43A2A;" title="Equipment failure: 42"></div>
            <div style="width:19%; background:#C27803;" title="Electrical issue: 24"></div>
            <div style="width:16%; background:#57606A;" title="Overcrowding: 20"></div>
            <div style="width:14%; background:#1B4332;" title="Water leakage: 18"></div>
            <div style="width:11%; background:#4D7C5D;" title="Safety concern: 14"></div>
            <div style="width:7%; background:#8C959F;" title="Maintenance complaint: 10"></div>
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

        <!-- 3. Severity & Precursor Correlation -->
        <div class="sig-analytics-panel">
          <div class="sig-panel-header">
            <span class="sig-panel-title">Precursor Linkage</span>
            <span class="sig-panel-badge" style="background:#EDF3F0; color:#1B4332;">48 Graph Links</span>
          </div>

          <div style="display:flex; justify-content:space-between; gap:6px; margin-bottom:10px;">
            <span class="badge-sev badge-sev-critical">08 Critical</span>
            <span class="badge-sev badge-sev-high">18 High</span>
            <span class="badge-sev badge-sev-medium">38 Medium</span>
            <span class="badge-sev badge-sev-low">64 Low</span>
          </div>

          <div style="background:var(--color-ivory-subtle); padding:6px 10px; border-radius:4px; font-size:0.75rem; color:var(--ink-secondary); border:1px solid var(--border-subtle);">
            <strong>Pattern Coherence:</strong> 91.4% Spatial-Temporal match converging into 7 active risks.
          </div>
        </div>

      </div>

      <!-- Recurring Pattern Alert Hotspots Strip ("Which signals are repeating?") -->
      <div class="sig-recurring-banner">
        <span style="font-family:var(--font-mono); font-weight:700; color:var(--intel-primary); text-transform:uppercase; font-size:0.72rem;">
          Repeating Precursor Hotspots:
        </span>
        ${issues.map(iss => `
          <div class="sig-recurring-item" title="${iss.cluster} • ${iss.riskLink}">
            <span class="indicator-dot dot-vermilion"></span>
            <span><strong>${iss.issue}:</strong> ${iss.count} signals (${iss.frequency})</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- PART 4: RELATED PRECURSOR CLUSTERS & PATTERN CONVERGENCE ---
  function renderClusterSection() {
    const tabsContainer = document.getElementById('clusterFilterTabs');
    const cardsContainer = document.getElementById('clusterCardsContainer');
    if (!tabsContainer || !cardsContainer) return;

    // Render filter tabs
    tabsContainer.innerHTML = `
      <button class="cluster-pill-btn ${activeClusterId === 'all' ? 'active' : ''}" onclick="window.filterClusterTab('all')">
        All Precursor Clusters (${clusters.length})
      </button>
      ${clusters.map(c => `
        <button class="cluster-pill-btn ${activeClusterId === c.id ? 'active' : ''}" onclick="window.filterClusterTab('${c.id}')">
          ${c.title} (${c.signalCount})
        </button>
      `).join('')}
    `;

    // Filter clusters to display
    const visibleClusters = activeClusterId === 'all'
      ? clusters
      : clusters.filter(c => c.id === activeClusterId);

    cardsContainer.innerHTML = visibleClusters.map(c => {
      const leadSignal = signals.find(s => s.clusterId === c.id) || signals[0];
      const previewSignals = c.signals || [];

      return `
        <div class="sig-cluster-card" data-cluster-id="${c.id}">
          
          <!-- Top Row -->
          <div class="sig-cluster-card-top">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="sig-cluster-id-tag">${c.id}</span>
              <h3 class="sig-cluster-title">${c.title}</h3>
            </div>
            <div class="sig-cluster-meta-chips">
              <span class="sig-meta-chip">📍 ${c.location}</span>
              <span class="sig-meta-chip">🏷️ ${c.category}</span>
              <span class="sig-meta-chip" style="font-weight:700; color:var(--intel-primary);">🔗 ${c.signalCount} Related Signals</span>
              <span class="sig-meta-chip" style="color:#A43A2A; font-weight:600;">📈 ${c.repetitionRate}</span>
            </div>
          </div>

          <!-- Why It Matters Quote Box -->
          <div class="sig-cluster-why">
            <strong>Why This Cluster Matters:</strong> "${c.whyItMatters}"
          </div>

          <!-- Horizontal Convergence Flow: RAW SIGNALS -> REPEATED PATTERN -> EMERGING RISK -->
          <div class="sig-convergence-pipeline">
            
            <!-- Step 1: Raw Signals -->
            <div class="sig-flow-node">
              <span class="sig-flow-node-label">1. Raw Precursors (${c.signalCount} Ingress)</span>
              <div class="sig-flow-signal-items">
                ${previewSignals.slice(0, 3).map(ps => `
                  <div class="sig-flow-signal-pill" title="${ps.title} • ${ps.date}">
                    ${getSourceBadge(ps.sourceType)}
                    <span style="font-weight:600; font-size:0.75rem;">${ps.title}</span>
                  </div>
                `).join('')}
                ${c.signalCount > 3 ? `
                  <span style="font-size:0.72rem; color:var(--ink-muted); font-family:var(--font-mono); margin-left:4px;">
                    +${c.signalCount - 3} additional correlated precursors
                  </span>
                ` : ''}
              </div>
            </div>

            <!-- Arrow 1 -->
            <div class="sig-flow-arrow">&rarr;</div>

            <!-- Step 2: Detected Pattern -->
            <div class="sig-flow-node">
              <span class="sig-flow-node-label">2. Detected Pattern</span>
              <div class="sig-pattern-node-box">
                <div class="sig-pattern-name">${c.detectedPattern}</div>
                <div class="sig-pattern-coherence">✓ ${c.patternCoherence}</div>
              </div>
            </div>

            <!-- Arrow 2 -->
            <div class="sig-flow-arrow">&rarr;</div>

            <!-- Step 3: Emerging Risk Target -->
            <div class="sig-flow-node">
              <span class="sig-flow-node-label">3. Emerging Risk Target</span>
              <div class="sig-risk-node-box">
                <div class="sig-risk-node-name">${c.associatedRisk}</div>
                <div class="sig-risk-node-meta">
                  <span>${c.riskId}</span> • <span>${c.leadTime}</span> • <strong>${c.potentialImpact || '$340,000 Outage'}</strong>
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom Action Buttons -->
          <div class="sig-cluster-footer-actions">
            <button class="sig-cluster-btn-filter" onclick="window.isolateClusterInTable('${c.id}')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Filter Table to this Cluster (${c.signalCount})
            </button>

            <button class="sig-cluster-btn-inspect" onclick="inspectSignal('${leadSignal.id}')">
              Inspect Cluster Dossier &rarr;
            </button>
          </div>

        </div>
      `;
    }).join('');
  }

  window.filterClusterTab = function(clusterId) {
    activeClusterId = clusterId;
    renderClusterSection();
  };

  window.isolateClusterInTable = function(clusterId) {
    activeClusterId = clusterId;
    renderClusterSection();
    applyFilters();

    const tableEl = document.getElementById('signalsTableContainer');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- PART 2: SIGNALS TABLE / LIST ---
  function renderTable(data) {
    if (!tableBody) return;

    if (resultsCountEl) {
      resultsCountEl.innerHTML = `Showing <strong>${data.length}</strong> of <strong>${signals.length}</strong> operational signals`;
    }

    if (data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:48px 16px; color:var(--ink-muted);">
            <div style="font-size:1.1rem; font-weight:600; color:var(--ink-primary); margin-bottom:6px;">No operational signals match your filter criteria</div>
            <p style="font-size:0.84rem; margin:0 0 16px 0;">Try adjusting your keyword query, source type, or date horizon.</p>
            <button class="filter-reset-btn" onclick="window.resetSignalFilters()" style="margin:0 auto;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Reset All Filters
            </button>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = data.map(item => `
      <tr data-id="${item.id}" onclick="inspectSignal('${item.id}')" title="Click to view full intelligence dossier">
        <td>
          <span class="signal-id-tag">${item.id}</span>
        </td>
        <td>
          ${getSourceBadge(item.sourceType)}
        </td>
        <td>
          <div class="signal-title-cell">
            <span class="signal-title-text">${item.title}</span>
            <span style="font-size:0.75rem; color:var(--ink-secondary); line-height:1.3; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
              ${item.description}
            </span>
          </div>
        </td>
        <td>
          <div class="signal-location-cell">
            <span class="signal-location-bold">${item.location}</span>
            <span class="signal-asset-sub">${item.bayAsset || ''}</span>
          </div>
        </td>
        <td>
          <div style="font-family:var(--font-mono); font-size:0.74rem;">
            <div style="color:var(--ink-primary); font-weight:600;">${item.detected}</div>
            <div style="color:var(--ink-muted); font-size:0.68rem;">${item.createdDate.split('•')[0] || ''}</div>
          </div>
        </td>
        <td>
          ${getSeverityBadge(item.severity)}
        </td>
        <td>
          ${getStatusBadge(item.status)}
        </td>
        <td>
          <div class="sig-table-risk-link">
            <span class="sig-table-risk-pattern">${item.relatedPattern || 'Correlated Precursor'}</span>
            <span class="sig-table-risk-target">
              &rarr; ${item.associatedRisk || 'Active Emerging Risk'}
            </span>
          </div>
        </td>
        <td style="text-align:right;">
          <button class="signal-action-btn" onclick="event.stopPropagation(); inspectSignal('${item.id}')">
            Inspect &rarr;
          </button>
        </td>
      </tr>
    `).join('');
  }

  // --- PART 3: SEARCH, FILTER & RESET ---
  function applyFilters() {
    const q = (searchInput && searchInput.value || '').toLowerCase().trim();
    const srcType = sourceTypeFilter ? sourceTypeFilter.value : 'all';
    const cat = categoryFilter ? categoryFilter.value : 'all';
    const loc = locationFilter ? locationFilter.value : 'all';
    const sev = severityFilter ? severityFilter.value : 'all';
    const stat = statusFilter ? statusFilter.value : 'all';
    const date = dateFilter ? dateFilter.value : 'all';

    const filtered = signals.filter(s => {
      // Keyword search matches ID, Title, Description, Location, BayAsset, Source
      const matchQ = !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        (s.bayAsset && s.bayAsset.toLowerCase().includes(q)) ||
        (s.source && s.source.toLowerCase().includes(q));

      // Source type filter
      const matchSource = srcType === 'all' || (s.sourceType && s.sourceType.toLowerCase() === srcType.toLowerCase());

      // Category filter
      const matchCat = cat === 'all' || (s.category && s.category.toLowerCase() === cat.toLowerCase());

      // Location filter
      const matchLoc = loc === 'all' || (s.location && s.location.toLowerCase().includes(loc.toLowerCase()));

      // Severity filter
      const matchSev = sev === 'all' || (s.severity && s.severity.toLowerCase() === sev.toLowerCase());

      // Status filter
      const matchStat = stat === 'all' || (s.status && s.status.toLowerCase() === stat.toLowerCase());

      // Date horizon filter
      const matchDate = date === 'all' || (s.dateHorizon && s.dateHorizon === date);

      // Cluster filter
      const matchCluster = activeClusterId === 'all' || s.clusterId === activeClusterId;

      return matchQ && matchSource && matchCat && matchLoc && matchSev && matchStat && matchDate && matchCluster;
    });

    renderTable(filtered);
  }

  window.resetSignalFilters = function() {
    if (searchInput) searchInput.value = '';
    if (sourceTypeFilter) sourceTypeFilter.value = 'all';
    if (categoryFilter) categoryFilter.value = 'all';
    if (locationFilter) locationFilter.value = 'all';
    if (severityFilter) severityFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (dateFilter) dateFilter.value = 'all';

    activeClusterId = 'all';
    renderClusterSection();
    renderTable(signals);
  };

  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', window.resetSignalFilters);
  }

  // --- PART 5 & 6: SIGNAL DETAIL DRAWER ---
  window.inspectSignal = function(id) {
    const item = signals.find(s => s.id === id) || signals[0];
    if (!item) return;

    // Header Title & Severity Dot
    const elTitle = document.getElementById('drawerSignalTitle');
    if (elTitle) elTitle.textContent = `${item.id}: ${item.title}`;

    const dot = document.getElementById('drawerDot');
    if (dot) {
      dot.className = `indicator-dot ${item.severity === 'Critical' ? 'dot-vermilion' : (item.severity === 'High' ? 'dot-amber' : 'dot-slate')}`;
    }

    // Part 6 Stepper
    const stepId = document.getElementById('stepperSignalId');
    if (stepId) stepId.textContent = item.id;

    const stepClu = document.getElementById('stepperClusterName');
    if (stepClu) stepClu.textContent = `${item.relatedCount || 12} Linked Signals`;

    const stepPat = document.getElementById('stepperPatternName');
    if (stepPat) stepPat.textContent = item.relatedPattern || 'Repeated Pattern';

    const stepRsk = document.getElementById('stepperRiskName');
    if (stepRsk) stepRsk.textContent = item.associatedRisk || 'Emerging Risk';

    // Summary & Meta
    const elDesc = document.getElementById('drawerDescription');
    if (elDesc) elDesc.textContent = item.description;

    const elMeta = document.getElementById('drawerSourceMeta');
    if (elMeta) {
      elMeta.textContent = `Origin: ${item.source} • Ingested: ${item.createdDate} • Modality: ${item.sourceType}`;
    }

    // 4-Stat Grid
    const elLoc = document.getElementById('drawerLocationVal');
    if (elLoc) elLoc.textContent = `${item.location} • ${item.bayAsset || ''}`;

    const elSev = document.getElementById('drawerSeverityVal');
    if (elSev) elSev.textContent = `${item.severity} Severity • ${item.status}`;

    const elRel = document.getElementById('drawerRelatedVal');
    if (elRel) elRel.textContent = `${item.relatedCount} Signals (${item.relatedClusterName || 'Active Cluster'})`;

    const elFreq = document.getElementById('drawerFrequencyVal');
    if (elFreq) elFreq.textContent = item.frequencyTrend || 'Accelerating frequency';

    // AI Explainability: "Why does this signal matter?"
    const elAi = document.getElementById('drawerAiAnalysis');
    if (elAi) elAi.textContent = item.aiAnalysis;

    // Connected Risk Target Card
    const elRiskTitle = document.getElementById('drawerRiskTitle');
    if (elRiskTitle) elRiskTitle.textContent = item.associatedRisk || 'Block A Flooding & Feeder Line Halt';

    const elRiskMeta = document.getElementById('drawerRiskMeta');
    if (elRiskMeta) {
      elRiskMeta.textContent = `Risk ID: ${item.riskId || 'RSK-01'} • Lead Time: ${item.leadTime || '14 Days'} • Target: ${item.location}`;
    }

    // Related Precursors in Cluster
    const relContainer = document.getElementById('drawerRelatedList');
    if (relContainer) {
      const clusterObj = clusters.find(c => c.id === item.clusterId);
      const clusterSignals = clusterObj ? clusterObj.signals : [];

      if (clusterSignals.length > 0) {
        relContainer.innerHTML = clusterSignals.map(cs => `
          <div class="evidence-card-item" style="cursor:pointer;" onclick="inspectSignal('${cs.id}')" title="Inspect ${cs.id}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="ev-type">${cs.id} • ${cs.sourceType}</span>
              <span class="badge-sev badge-sev-${(cs.severity || 'high').toLowerCase()}">${cs.severity || 'High'}</span>
            </div>
            <span class="ev-title">${cs.title}</span>
            <span class="ev-detail">${cs.date}</span>
          </div>
        `).join('');
      } else {
        relContainer.innerHTML = `
          <div style="font-size:0.78rem; color:var(--ink-secondary); padding:8px 0;">
            ${item.relatedCount} correlated signals actively contributing to ${item.relatedPattern}.
          </div>
        `;
      }
    }

    // Supporting Evidence
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

    // Timeline Progression
    const tlContainer = document.getElementById('drawerTimelineList');
    if (tlContainer) {
      tlContainer.innerHTML = (item.timeline || []).map(t => `
        <div class="timeline-step-item">
          <div class="step-period">${t.period} &bull; ${t.count} signals</div>
          <div class="step-desc">${t.note}</div>
        </div>
      `).join('');
    }

    // Recommended Action
    const elRec = document.getElementById('drawerRecommendedAction');
    if (elRec) elRec.textContent = item.recommendedAction;

    // Open Modal
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

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Attach live event listeners to all filter inputs
  [searchInput, sourceTypeFilter, categoryFilter, locationFilter, severityFilter, statusFilter, dateFilter].forEach(el => {
    if (el) {
      el.addEventListener('input', applyFilters);
      el.addEventListener('change', applyFilters);
    }
  });

  // Initial renders
  renderAnalyticsStrip();
  renderClusterSection();
  renderTable(signals);
});
