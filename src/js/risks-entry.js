/**
 * EarlySight — Operational Risk Intelligence & Prioritization (Milestone 5)
 * 
 * Implements:
 * 1. Risk Overview KPI Summary Strip
 * 2. Attention Needed / Priority Triage View ("What should I look at first?")
 * 3. Operational Risk Severity Matrix (Interactive likelihood vs. severity)
 * 4. Risk Progression Lifecycle
 * 5. Multi-variable Filter Bar (Search, Severity, Status, Priority, Location, Trend, Score, Reset)
 * 6. Risk Cards with Custom Score Dial, Distinct Severity vs. Confidence, Trend Sparklines, and Previews
 * 7. Forensic Risk Detail Drawer with the Complete 6-Stage EarlySight Intelligence Pipeline:
 *    SIGNALS -> PATTERN -> RISK -> SCORE -> PRIORITY -> RECOMMENDED ACTION
 */

import '../styles/styles.css';
import './global-nav.js';
import './micro-interactions.js';
import { OPERATIONAL_RISKS, RISKS_KPI_OVERVIEW } from '../data/risks-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const container = document.getElementById('risksGridContainer');
  const searchInput = document.getElementById('riskSearchInput');
  const severityFilter = document.getElementById('riskSeverityFilter');
  const statusFilter = document.getElementById('riskStatusFilter');
  const priorityFilter = document.getElementById('riskPriorityFilter');
  const locationFilter = document.getElementById('riskLocationFilter');
  const trendFilter = document.getElementById('riskTrendFilter');
  const scoreFilter = document.getElementById('riskScoreFilter');
  const resetBtn = document.getElementById('riskResetFiltersBtn');
  const resultCountBadge = document.getElementById('riskResultCount');

  // Attention Needed Container
  const attentionContainer = document.getElementById('riskAttentionList');

  // Detail Drawer Elements
  const drawerOverlay = document.getElementById('riskDrawerOverlay');
  const drawer = document.getElementById('riskDetailDrawer');
  const drawerCloseBtn = document.getElementById('riskDrawerCloseBtn');
  const drawerContent = document.getElementById('riskDrawerBodyContent');

  let activeRisks = [...OPERATIONAL_RISKS];
  let selectedRisk = null;

  // Helper: Severity Pill
  function getSeverityBadge(sev, compact = false) {
    const s = (sev || '').toLowerCase();
    let badgeClass = 'badge-sev-low';
    if (s === 'critical') badgeClass = 'badge-sev-critical';
    else if (s === 'high') badgeClass = 'badge-sev-high';
    else if (s === 'medium') badgeClass = 'badge-sev-medium';

    return `<span class="badge-sev ${badgeClass}">${sev}</span>`;
  }

  // Helper: Status Pill
  function getStatusBadge(status) {
    const st = (status || '').toLowerCase();
    let cls = 'status-active';
    let dotColor = '#C85A32';
    if (st === 'emerging') {
      cls = 'status-emerging';
      dotColor = '#C27803';
    } else if (st === 'resolved') {
      cls = 'status-resolved';
      dotColor = '#1B4332';
    }
    return `
      <span class="risk-status-pill ${cls}">
        <span class="status-indicator-dot" style="background:${dotColor};"></span>
        <span>${status.toUpperCase()}</span>
      </span>
    `;
  }

  // Helper: Priority Badge
  function getPriorityBadge(p, label) {
    const pCode = (p || 'P3').toUpperCase();
    let cls = 'priority-p3';
    if (pCode === 'P1') cls = 'priority-p1';
    else if (pCode === 'P2') cls = 'priority-p2';
    else if (pCode === 'P4') cls = 'priority-p4';

    return `<span class="risk-priority-badge ${cls}">${pCode}${label ? ' — ' + label : ''}</span>`;
  }

  // Helper: Color based on Risk Score
  function getScoreColor(score) {
    if (score >= 75) return { stroke: '#A43A2A', bg: 'rgba(164, 58, 42, 0.12)', label: 'Critical' };
    if (score >= 50) return { stroke: '#C85A32', bg: 'rgba(200, 90, 50, 0.12)', label: 'High' };
    if (score >= 25) return { stroke: '#C27803', bg: 'rgba(194, 120, 3, 0.12)', label: 'Moderate' };
    return { stroke: '#1B4332', bg: 'rgba(27, 67, 50, 0.12)', label: 'Low' };
  }

  // Helper: SVG Radial Gauge for Score (0-100)
  function renderScoreGauge(score, size = 68) {
    const strokeWidth = 5;
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const normalizedScore = Math.min(Math.max(score, 0), 100);
    const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;
    const color = getScoreColor(score);

    return `
      <div class="score-gauge-wrap" style="width:${size}px; height:${size}px;" title="Risk Score: ${score}/100 (${color.label})">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="score-gauge-svg">
          <circle 
            cx="${size / 2}" 
            cy="${size / 2}" 
            r="${radius}" 
            fill="transparent" 
            stroke="#E4E0D8" 
            stroke-width="${strokeWidth}"
          />
          <circle 
            cx="${size / 2}" 
            cy="${size / 2}" 
            r="${radius}" 
            fill="transparent" 
            stroke="${color.stroke}" 
            stroke-width="${strokeWidth}" 
            stroke-dasharray="${circumference}" 
            stroke-dashoffset="${strokeDashoffset}" 
            stroke-linecap="round"
            transform="rotate(-90 ${size / 2} ${size / 2})"
          />
        </svg>
        <div class="score-gauge-center">
          <span class="score-gauge-num" style="color:${color.stroke};">${score}</span>
          <span class="score-gauge-scale">/100</span>
        </div>
      </div>
    `;
  }

  // Helper: SVG Sparkline Curve
  function renderSparkline(points, trend) {
    if (!points || points.length < 2) return '';
    const width = 84;
    const height = 28;
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * (width / 90)},${p.y * (height / 36)}`).join(' ');
    const endPoint = points[points.length - 1];
    const endX = endPoint.x * (width / 90);
    const endY = endPoint.y * (height / 36);

    let strokeColor = '#C85A32';
    if (trend === 'Decreasing') strokeColor = '#1B4332';
    else if (trend === 'Stable') strokeColor = '#C27803';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="risk-sparkline-svg">
        <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="${endX}" cy="${endY}" r="3" fill="${strokeColor}" />
      </svg>
    `;
  }

  // 1. Render Attention Needed Triage Section
  function renderAttentionSection() {
    if (!attentionContainer) return;

    // Filter top 4 actionable risks (P1 and P2, sorted by score desc)
    const urgentRisks = [...OPERATIONAL_RISKS]
      .filter(r => (r.priority === 'P1' || r.priority === 'P2') && r.status !== 'Resolved')
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    attentionContainer.innerHTML = urgentRisks.map((r, idx) => {
      const color = getScoreColor(r.score);
      return `
        <div class="attention-card" data-risk-id="${r.id}" tabindex="0" role="button" aria-label="Review ${r.title}">
          <div class="attention-card-rank">0${idx + 1}</div>
          <div class="attention-card-body">
            <div class="attention-card-top">
              <span class="attention-card-title">${r.title}</span>
              ${getPriorityBadge(r.priority, r.priorityLabel)}
            </div>
            <div class="attention-card-meta">
              <span class="font-mono text-muted">${r.location}</span>
              <span class="attention-sep">•</span>
              <span class="attention-score-chip" style="color:${color.stroke}; font-weight:700;">Score ${r.score}/100</span>
              <span class="attention-sep">•</span>
              <span class="attention-trend-chip ${r.trend === 'Increasing' ? 'trend-up' : 'trend-stable'}">${r.trendSymbol} ${r.trend}</span>
            </div>
          </div>
          <div class="attention-card-cta">
            <span class="attention-arrow">&rarr;</span>
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers
    attentionContainer.querySelectorAll('.attention-card').forEach(card => {
      card.addEventListener('click', () => {
        const rId = card.getAttribute('data-risk-id');
        openRiskDetail(rId);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const rId = card.getAttribute('data-risk-id');
          openRiskDetail(rId);
        }
      });
    });
  }

  // 2. Render Risk Cards
  function renderRiskCards(items) {
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="risks-empty-state">
          <div class="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3>No Operational Risks Match Filters</h3>
          <p>No risks meet the active filter combination. Click "Reset Filters" to restore all monitored operational hazards.</p>
          <button type="button" class="btn-reset-empty" id="emptyResetBtn">Reset All Filters</button>
        </div>
      `;
      const emptyReset = document.getElementById('emptyResetBtn');
      if (emptyReset) emptyReset.addEventListener('click', resetFilters);
      return;
    }

    container.innerHTML = items.map(r => {
      const scoreColor = getScoreColor(r.score);
      const isUrgent = r.priority === 'P1';

      return `
        <article class="risk-card ${isUrgent ? 'risk-card-urgent' : ''}" data-risk-id="${r.id}" tabindex="0" role="button" aria-label="Inspect ${r.title}">
          
          <!-- Card Header Strip -->
          <div class="risk-card-top-row">
            <div class="risk-id-group">
              <span class="risk-id-badge">${r.id}</span>
              ${getStatusBadge(r.status)}
            </div>
            <div class="risk-priority-group">
              ${getPriorityBadge(r.priority, r.priorityLabel)}
            </div>
          </div>

          <!-- Title & Subsystem -->
          <div class="risk-title-section">
            <h3 class="risk-card-title">${r.title}</h3>
            <div class="risk-location-subsystem">
              <span class="location-dot"></span>
              <span class="risk-loc-text"><strong>${r.location}</strong></span>
              <span class="risk-loc-sep">•</span>
              <span class="risk-subsystem-text">${r.subsystem}</span>
            </div>
            <p class="risk-short-desc">${r.description}</p>
          </div>

          <!-- Dual Intelligence Core: Score Dial + Distinct Severity & Confidence -->
          <div class="risk-intel-core-panel">
            
            <!-- Visual Score Dial -->
            <div class="score-column">
              ${renderScoreGauge(r.score, 64)}
              <div class="score-column-caption">
                <span class="score-tier-tag" style="color:${scoreColor.stroke};">${r.scoreTier} Risk</span>
              </div>
            </div>

            <!-- Distinct Severity + Confidence Blocks -->
            <div class="metrics-distinction-col">
              
              <!-- Severity Block -->
              <div class="metric-distinction-item severity-item">
                <div class="metric-distinction-head">
                  <span class="metric-distinction-label">Severity (Impact)</span>
                  ${getSeverityBadge(r.severity)}
                </div>
                <div class="metric-distinction-desc">${r.severityReason}</div>
              </div>

              <!-- Confidence Block -->
              <div class="metric-distinction-item confidence-item">
                <div class="metric-distinction-head">
                  <span class="metric-distinction-label">Confidence (Certainty)</span>
                  <span class="confidence-val-badge">${r.confidence}</span>
                </div>
                <div class="metric-distinction-desc">${r.confidenceReason}</div>
              </div>

            </div>

          </div>

          <!-- Trend Trajectory & Supporting Evidence Strip -->
          <div class="risk-trajectory-evidence-strip">
            <div class="trajectory-col">
              <span class="traj-label">Trajectory:</span>
              <span class="traj-badge ${r.trend === 'Increasing' ? 'traj-up' : (r.trend === 'Stable' ? 'traj-stable' : 'traj-down')}">
                ${r.trendSymbol} ${r.trend}
              </span>
              <span class="traj-history font-mono text-muted">${r.trendTrajectory ? r.trendTrajectory.join(' → ') : ''}</span>
            </div>
            <div class="sparkline-col">
              ${renderSparkline(r.sparklinePoints, r.trend)}
            </div>
          </div>

          <!-- Recommended Action Preview Box -->
          <div class="risk-card-action-box">
            <div class="action-box-header">
              <span class="action-box-tag">Recommended Action:</span>
              <span class="action-urgency-pill">${r.recommendedAction.urgency}</span>
            </div>
            <p class="action-box-text">${r.recommendedAction.action}</p>
            <div class="action-box-team">
              <span class="team-label">Assigned Team:</span>
              <span class="team-name">${r.recommendedAction.team}</span>
            </div>
          </div>

          <!-- Card Footer Strip -->
          <div class="risk-card-footer">
            <div class="footer-meta-item">
              <span class="footer-meta-label">Evidence:</span>
              <span class="footer-meta-val font-mono">${r.evidenceCount} Signals</span>
            </div>
            <div class="footer-meta-item">
              <span class="footer-meta-label">Lead Window:</span>
              <span class="footer-meta-val font-mono ${r.leadTime.includes('Remaining') ? 'text-vermilion' : 'text-forest'}">${r.leadTime}</span>
            </div>
            <button type="button" class="btn-inspect-risk" aria-label="Open detail view for ${r.title}">
              <span>Inspect Flow</span>
              <span class="btn-arrow">&rarr;</span>
            </button>
          </div>

        </article>
      `;
    }).join('');

    // Attach click handlers
    container.querySelectorAll('.risk-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const rId = card.getAttribute('data-risk-id');
        openRiskDetail(rId);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const rId = card.getAttribute('data-risk-id');
          openRiskDetail(rId);
        }
      });
    });
  }

  // 3. Render Detail Drawer
  function openRiskDetail(riskId) {
    const risk = OPERATIONAL_RISKS.find(r => r.id === riskId);
    if (!risk || !drawerContent) return;

    selectedRisk = risk;
    const scoreColor = getScoreColor(risk.score);

    drawerContent.innerHTML = `
      <!-- Part 8 & 9: Complete EarlySight Intelligence Flow -->
      <section class="drawer-flow-banner" aria-label="EarlySight Causal Pipeline">
        <div class="drawer-flow-title-row">
          <span class="flow-indicator-dot"></span>
          <span class="flow-title">EarlySight Operational Synthesis Pipeline</span>
          <span class="flow-badge">End-to-End Traceability</span>
        </div>
        <div class="causal-stepper-flow">
          
          <div class="stepper-node">
            <span class="node-step">01. Signals</span>
            <strong class="node-title">${risk.evidenceCount} Precursors</strong>
            <span class="node-sub">${risk.signalBreakdown.maintenance} Maint • ${risk.signalBreakdown.complaint} Comp • ${risk.signalBreakdown.sensor} Sens</span>
          </div>

          <span class="stepper-arrow">&rarr;</span>

          <div class="stepper-node">
            <span class="node-step">02. Pattern</span>
            <strong class="node-title">${risk.pattern ? risk.pattern.name : 'Correlated Drift'}</strong>
            <span class="node-sub">${risk.pattern ? risk.pattern.coherence : 'Coherent'}</span>
          </div>

          <span class="stepper-arrow">&rarr;</span>

          <div class="stepper-node active-node">
            <span class="node-step">03. Emerging Risk</span>
            <strong class="node-title">${risk.title}</strong>
            <span class="node-sub">${risk.location}</span>
          </div>

          <span class="stepper-arrow">&rarr;</span>

          <div class="stepper-node">
            <span class="node-step">04. Score</span>
            <strong class="node-title" style="color:${scoreColor.stroke};">${risk.score}/100</strong>
            <span class="node-sub">${risk.scoreTier} Tier</span>
          </div>

          <span class="stepper-arrow">&rarr;</span>

          <div class="stepper-node">
            <span class="node-step">05. Priority</span>
            <strong class="node-title">${risk.priority}</strong>
            <span class="node-sub">${risk.priorityLabel}</span>
          </div>

          <span class="stepper-arrow">&rarr;</span>

          <div class="stepper-node action-node">
            <span class="node-step">06. Action</span>
            <strong class="node-title">Prescribed</strong>
            <span class="node-sub">${risk.recommendedAction.urgency}</span>
          </div>

        </div>
      </section>

      <!-- Risk Intelligence Deep-Dive Grid -->
      <section class="drawer-section">
        <h4 class="drawer-section-heading">Operational Risk Intelligence</h4>
        
        <div class="drawer-intel-grid">
          
          <!-- Risk Score Metric Box -->
          <div class="drawer-metric-card score-metric-card">
            <div class="d-metric-head">
              <span class="d-metric-label">Risk Score</span>
              <span class="d-metric-tier-badge" style="color:${scoreColor.stroke}; background:${scoreColor.bg};">${risk.scoreTier}</span>
            </div>
            <div class="d-score-row">
              ${renderScoreGauge(risk.score, 54)}
              <div class="d-score-desc">
                <span class="scale-info">Scale: 0–100</span>
                <span class="scale-interp">${risk.score >= 75 ? 'Immediate Operational Action Required' : (risk.score >= 50 ? 'High Monitoring & Planned Intervention' : 'Routine Baseline Surveillance')}</span>
              </div>
            </div>
          </div>

          <!-- Severity Metric Box -->
          <div class="drawer-metric-card">
            <div class="d-metric-head">
              <span class="d-metric-label">Severity (Consequence)</span>
              ${getSeverityBadge(risk.severity)}
            </div>
            <div class="d-metric-val">${risk.severity} Severity</div>
            <p class="d-metric-expl">${risk.severityReason}</p>
          </div>

          <!-- Confidence Metric Box -->
          <div class="drawer-metric-card">
            <div class="d-metric-head">
              <span class="d-metric-label">Confidence (Certainty)</span>
              <span class="confidence-val-badge">${risk.confidence}</span>
            </div>
            <div class="d-metric-val">${risk.confidence} Model Certainty</div>
            <p class="d-metric-expl">${risk.confidenceReason}</p>
          </div>

          <!-- Trend Trajectory Box -->
          <div class="drawer-metric-card">
            <div class="d-metric-head">
              <span class="d-metric-label">Trend Trajectory</span>
              <span class="traj-badge ${risk.trend === 'Increasing' ? 'traj-up' : (risk.trend === 'Stable' ? 'traj-stable' : 'traj-down')}">${risk.trendSymbol} ${risk.trend}</span>
            </div>
            <div class="d-metric-val font-mono">${risk.trendTrajectory ? risk.trendTrajectory.join(' → ') : ''}</div>
            <div style="margin-top:6px;">
              ${renderSparkline(risk.sparklinePoints, risk.trend)}
            </div>
          </div>

        </div>
      </section>

      <!-- Why This Risk Matters (Explainability) -->
      <section class="drawer-section">
        <h4 class="drawer-section-heading">Why This Risk Matters // Explainability</h4>
        <div class="explainability-box">
          <div class="explainability-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <strong>Causal Explainability Summary (EarlySight Engine)</strong>
          </div>
          <p class="explainability-text">${risk.whyItMatters}</p>
          <div class="explainability-footer">
            <span>Asset: <strong>${risk.asset || risk.location}</strong></span>
            <span>•</span>
            <span>Subsystem: <strong>${risk.subsystem}</strong></span>
            <span>•</span>
            <span>Projected Exposure: <strong class="text-vermilion">${risk.financialRisk}</strong></span>
          </div>
        </div>
      </section>

      <!-- Detected Pattern Synthesis -->
      <section class="drawer-section">
        <h4 class="drawer-section-heading">Detected Pattern Synthesis</h4>
        <div class="pattern-synthesis-card">
          <div class="pattern-top">
            <span class="pattern-title">${risk.pattern ? risk.pattern.name : 'Multi-Modal Convergence'}</span>
            <span class="pattern-coherence-chip">${risk.pattern ? risk.pattern.coherence : 'High Coherence'}</span>
          </div>
          <div class="pattern-equation-list">
            ${(risk.pattern && risk.pattern.synthesisEquation ? risk.pattern.synthesisEquation : [
              'Repeated shift incident logs',
              'Maintenance recurrence',
              'Spatial concentration',
              'Increasing frequency'
            ]).map((eq, i, arr) => `
              <div class="equation-item">
                <span class="equation-bullet">${i + 1}</span>
                <span class="equation-text">${eq}</span>
              </div>
              ${i < arr.length - 1 ? '<div class="equation-plus">+</div>' : ''}
            `).join('')}
            <div class="equation-result-row">
              <span class="equation-down-arrow">&darr;</span>
              <span class="equation-result-label">Synthesized Hazard: <strong>${risk.title}</strong></span>
            </div>
          </div>
        </div>
      </section>

      <!-- Contributing Signals Breakdown -->
      <section class="drawer-section">
        <div class="drawer-section-header-flex">
          <h4 class="drawer-section-heading" style="margin-bottom:0;">Contributing Precursor Signals (${risk.evidenceCount})</h4>
          <a href="signals.html?cluster=${risk.clusterId || 'CLU-01'}" class="drawer-link-to-signals" target="_blank" rel="noopener">
            View in Signal Registry &rarr;
          </a>
        </div>
        
        <!-- Signal Modality Distribution Chips -->
        <div class="modality-chips-strip">
          <span class="modality-chip">Maintenance: <strong>${risk.signalBreakdown.maintenance}</strong></span>
          <span class="modality-chip">Complaints: <strong>${risk.signalBreakdown.complaint}</strong></span>
          <span class="modality-chip">Sensors: <strong>${risk.signalBreakdown.sensor}</strong></span>
          <span class="modality-chip">Images/Docs: <strong>${risk.signalBreakdown.imageDoc}</strong></span>
        </div>

        <!-- Sample Contributing Signal Items -->
        <div class="contributing-signals-list">
          ${risk.contributingSignals ? risk.contributingSignals.map(sig => `
            <div class="contributing-sig-item">
              <div class="sig-item-top">
                <div class="sig-item-left">
                  <span class="sig-item-id">${sig.id}</span>
                  <span class="sig-item-type badge-type-${sig.type.toLowerCase()}">${sig.type}</span>
                </div>
                ${getSeverityBadge(sig.severity, true)}
              </div>
              <div class="sig-item-title">${sig.title}</div>
              <div class="sig-item-date font-mono text-muted">${sig.date}</div>
            </div>
          `).join('') : '<div class="text-muted" style="font-size:0.8rem;">Contributing precursors archived in telemetry vault.</div>'}
        </div>
      </section>

      <!-- Recommended Operational Action -->
      <section class="drawer-section">
        <h4 class="drawer-section-heading">Recommended Operational Action</h4>
        <div class="action-prescription-card">
          <div class="prescription-header">
            <span class="prescription-urgency-badge ${risk.recommendedAction.urgency.toLowerCase().includes('immediate') ? 'urgency-immediate' : 'urgency-high'}">
              Urgency: ${risk.recommendedAction.urgency}
            </span>
            <span class="prescription-team">Team: <strong>${risk.recommendedAction.team}</strong></span>
          </div>
          <div class="prescription-action-text">
            <strong>Prescribed Directive:</strong>
            <p>${risk.recommendedAction.action}</p>
          </div>
          <div class="prescription-objective">
            <span class="objective-label">Expected Operational Objective:</span>
            <span class="objective-text">${risk.recommendedAction.expectedObjective}</span>
          </div>
          <div class="prescription-footer-bar">
            <button type="button" class="btn-prescription-cta" id="btnDraftWorkOrder">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <span>Draft Work Order in Action Center</span>
            </button>
            <a href="map.html" class="btn-prescription-secondary">View in Signal Map &rarr;</a>
          </div>
        </div>
      </section>
    `;

    // Attach Draft Work Order handler
    const draftBtn = document.getElementById('btnDraftWorkOrder');
    if (draftBtn) {
      draftBtn.addEventListener('click', () => {
        draftBtn.disabled = true;
        draftBtn.innerHTML = `<span>✓ Work Order Draft Queued (WO-2026-${Math.floor(1000 + Math.random() * 9000)})</span>`;
        setTimeout(() => {
          window.location.href = 'actions.html';
        }, 1200);
      });
    }

    // Open Drawer & Overlay
    if (drawerOverlay && drawer) {
      drawerOverlay.classList.add('active');
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Set accessibility focus
      drawerCloseBtn?.focus();
    }
  }

  // Close Drawer
  function closeRiskDetail() {
    if (drawerOverlay && drawer) {
      drawerOverlay.classList.remove('active');
      drawer.classList.remove('active');
      document.body.style.overflow = '';
      selectedRisk = null;
    }
  }

  // 4. Filtering Logic
  function applyFilters() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const sev = severityFilter?.value || 'all';
    const st = statusFilter?.value || 'all';
    const pri = priorityFilter?.value || 'all';
    const loc = locationFilter?.value || 'all';
    const tr = trendFilter?.value || 'all';
    const sc = scoreFilter?.value || 'all';

    activeRisks = OPERATIONAL_RISKS.filter(r => {
      // Keyword search across title, id, location, subsystem, description
      const matchQ = !q || 
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.subsystem.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.pattern && r.pattern.name.toLowerCase().includes(q));

      // Severity filter
      const matchSev = sev === 'all' || r.severity.toLowerCase() === sev.toLowerCase();

      // Status filter
      const matchSt = st === 'all' || r.status.toLowerCase() === st.toLowerCase();

      // Priority filter
      const matchPri = pri === 'all' || r.priority.toLowerCase() === pri.toLowerCase();

      // Location filter
      const matchLoc = loc === 'all' || r.location.toLowerCase().includes(loc.toLowerCase());

      // Trend filter
      const matchTr = tr === 'all' || r.trend.toLowerCase() === tr.toLowerCase();

      // Score filter
      let matchSc = true;
      if (sc === 'critical') matchSc = r.score >= 75;
      else if (sc === 'high') matchSc = r.score >= 50 && r.score < 75;
      else if (sc === 'moderate') matchSc = r.score >= 25 && r.score < 50;
      else if (sc === 'low') matchSc = r.score < 25;

      return matchQ && matchSev && matchSt && matchPri && matchLoc && matchTr && matchSc;
    });

    // Update result count
    if (resultCountBadge) {
      resultCountBadge.textContent = `Showing ${activeRisks.length} of ${OPERATIONAL_RISKS.length} risks`;
    }

    renderRiskCards(activeRisks);
  }

  // Reset Filters
  function resetFilters() {
    if (searchInput) searchInput.value = '';
    if (severityFilter) severityFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (priorityFilter) priorityFilter.value = 'all';
    if (locationFilter) locationFilter.value = 'all';
    if (trendFilter) trendFilter.value = 'all';
    if (scoreFilter) scoreFilter.value = 'all';
    applyFilters();
  }

  // 5. Render Operational Risk Severity Matrix (Likelihood vs Severity)
  function renderRiskMatrix() {
    const matrixContainer = document.getElementById('riskSeverityMatrix');
    if (!matrixContainer) return;

    matrixContainer.innerHTML = `
      <div class="matrix-card-header">
        <div class="matrix-title-group">
          <span class="indicator-dot dot-vermilion"></span>
          <h3 class="matrix-title">Operational Risk Severity Matrix</h3>
          <span class="matrix-sub">Likelihood vs. Consequence Mapping</span>
        </div>
        <span class="dash-viz-badge badge-forest-subtle">Early Warning Projections</span>
      </div>

      <div class="risk-matrix-grid">
        <div class="matrix-header-cell">Severity</div>
        <div class="matrix-header-cell">Low Likelihood</div>
        <div class="matrix-header-cell">Moderate</div>
        <div class="matrix-header-cell">High Likelihood</div>
        <div class="matrix-header-cell" style="color:var(--color-rust); font-weight:700;">Impending</div>

        <!-- Row 1: Critical -->
        <div class="matrix-header-cell sev-crit-label">Critical</div>
        <div class="risk-matrix-cell cell-medium"></div>
        <div class="risk-matrix-cell cell-high"></div>
        <div class="risk-matrix-cell cell-critical">
          <button type="button" class="matrix-risk-chip" data-risk-id="RSK-02" style="border-left:3px solid var(--color-rust);">
            <strong>RSK-02 Switchgear</strong>
            <span>Bus 3B • Score 88</span>
          </button>
        </div>
        <div class="risk-matrix-cell cell-critical">
          <button type="button" class="matrix-risk-chip" data-risk-id="RSK-04" style="border-left:3px solid var(--color-rust);">
            <strong>RSK-04 Feeder AX-402</strong>
            <span>Bay 4 • Score 78</span>
          </button>
        </div>

        <!-- Row 2: High -->
        <div class="matrix-header-cell sev-high-label">High</div>
        <div class="risk-matrix-cell cell-low"></div>
        <div class="risk-matrix-cell cell-high">
          <button type="button" class="matrix-risk-chip" data-risk-id="RSK-06" style="border-left:3px solid var(--color-rust);">
            <strong>RSK-06 Scrubber</strong>
            <span>Lab 3 • Score 76</span>
          </button>
        </div>
        <div class="risk-matrix-cell cell-critical">
          <button type="button" class="matrix-risk-chip" data-risk-id="RSK-01" style="border-left:3px solid var(--color-rust);">
            <strong>RSK-01 Water Conduit</strong>
            <span>Block A • Score 86</span>
          </button>
        </div>
        <div class="risk-matrix-cell cell-critical"></div>

        <!-- Row 3: Medium -->
        <div class="matrix-header-cell sev-med-label">Medium</div>
        <div class="risk-matrix-cell cell-low"></div>
        <div class="risk-matrix-cell cell-medium">
          <button type="button" class="matrix-risk-chip" data-risk-id="RSK-07" style="border-left:3px solid var(--color-amber);">
            <strong>RSK-07 Chiller Loop</strong>
            <span>Utility • Score 42</span>
          </button>
        </div>
        <div class="risk-matrix-cell cell-high">
          <button type="button" class="matrix-risk-chip" data-risk-id="RSK-05" style="border-left:3px solid var(--color-amber);">
            <strong>RSK-05 Extrusion Press</strong>
            <span>Block C • Score 64</span>
          </button>
        </div>
        <div class="risk-matrix-cell cell-high">
          <button type="button" class="matrix-risk-chip" data-risk-id="RSK-03" style="border-left:3px solid var(--color-amber);">
            <strong>RSK-03 Cleanroom</strong>
            <span>Suite 1 • Score 52</span>
          </button>
        </div>

        <!-- Row 4: Low -->
        <div class="matrix-header-cell sev-low-label">Low</div>
        <div class="risk-matrix-cell cell-low">
          <button type="button" class="matrix-risk-chip" data-risk-id="RSK-10" style="border-left:3px solid var(--color-forest);">
            <strong>RSK-10 Tower Fan</strong>
            <span>Resolved • Score 12</span>
          </button>
        </div>
        <div class="risk-matrix-cell cell-low">
          <button type="button" class="matrix-risk-chip" data-risk-id="RSK-08" style="border-left:3px solid var(--color-sage);">
            <strong>RSK-08 Reducer Pinion</strong>
            <span>Stockyard • Score 22</span>
          </button>
        </div>
        <div class="risk-matrix-cell cell-medium">
          <button type="button" class="matrix-risk-chip" data-risk-id="RSK-09" style="border-left:3px solid var(--color-forest);">
            <strong>RSK-09 Transformer</strong>
            <span>Resolved • Score 16</span>
          </button>
        </div>
        <div class="risk-matrix-cell cell-medium"></div>
      </div>
    `;

    // Attach matrix click handlers
    matrixContainer.querySelectorAll('.matrix-risk-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const rId = chip.getAttribute('data-risk-id');
        openRiskDetail(rId);
      });
    });
  }

  // 6. Render Progression Timeline
  function renderProgressionTimeline() {
    const progContainer = document.getElementById('riskProgressionTimeline');
    if (!progContainer) return;

    progContainer.innerHTML = `
      <div class="causal-pipeline-header">
        <div class="causal-pipeline-title-group">
          <span class="indicator-dot dot-vermilion"></span>
          <h3 class="dash-viz-title">Risk Progression & Synthesis Lifecycle</h3>
          <span class="dash-viz-sub" style="font-size:0.78rem; color:var(--ink-secondary); margin-left:8px;">Multi-Modal Convergence Window</span>
        </div>
        <span class="dash-viz-badge badge-trend-alert">Mean 16.8d Lead Time Window</span>
      </div>

      <div class="causal-pipeline-flow">
        
        <div class="causal-node-card">
          <div class="causal-node-top">
            <span class="causal-node-step">Stage 1</span>
            <span class="causal-node-badge" style="background:#EDF3F0; color:#1B4332;">Detected</span>
          </div>
          <div class="causal-node-title">Scattered Signals</div>
          <div class="causal-node-desc">Weak multi-modal signals captured by sub-slab acoustic transducers, shift complaint logs & thermography.</div>
          <div class="causal-node-meta font-mono">T-28 Days • Noise floor</div>
        </div>

        <div class="causal-connector-arrow">&rarr;</div>

        <div class="causal-node-card">
          <div class="causal-node-top">
            <span class="causal-node-step">Stage 2</span>
            <span class="causal-node-badge" style="background:#FAF8F5; color:#C27803;">Correlated</span>
          </div>
          <div class="causal-node-title">Pattern Identified</div>
          <div class="causal-node-desc">Cross-silo graph matches acoustic frequency, maintenance recurrence, and spatial concentration.</div>
          <div class="causal-node-meta font-mono">T-18 Days • 91.4% Coherence</div>
        </div>

        <div class="causal-connector-arrow">&rarr;</div>

        <div class="causal-node-card" style="border-left:3px solid var(--color-rust);">
          <div class="causal-node-top">
            <span class="causal-node-step" style="color:var(--color-rust);">Stage 3</span>
            <span class="causal-node-badge" style="background:#FDF1EE; color:#A43A2A;">Synthesized</span>
          </div>
          <div class="causal-node-title">Emerging Risk Generated</div>
          <div class="causal-node-desc">Synthesized hazard ranked by 0–100 Risk Score, severity consequence, and model confidence certainty.</div>
          <div class="causal-node-meta font-mono">T-14 Days • P1 Priority</div>
        </div>

        <div class="causal-connector-arrow">&rarr;</div>

        <div class="causal-node-card" style="border-left:3px solid var(--color-forest);">
          <div class="causal-node-top">
            <span class="causal-node-step" style="color:var(--color-forest);">Stage 4</span>
            <span class="causal-node-badge" style="background:#EDF3F0; color:#1B4332;">Remediation</span>
          </div>
          <div class="causal-node-title">Prescribed Action Initiated</div>
          <div class="causal-node-desc">Targeted work order dispatched to specialized engineering team before secondary damage occurs.</div>
          <div class="causal-node-meta font-mono">Closed-Loop Resolution</div>
        </div>

      </div>
    `;
  }

  // Event Listeners for Filters
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (severityFilter) severityFilter.addEventListener('change', applyFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);
  if (priorityFilter) priorityFilter.addEventListener('change', applyFilters);
  if (locationFilter) locationFilter.addEventListener('change', applyFilters);
  if (trendFilter) trendFilter.addEventListener('change', applyFilters);
  if (scoreFilter) scoreFilter.addEventListener('change', applyFilters);
  if (resetBtn) resetBtn.addEventListener('click', resetFilters);

  // Drawer Close Listeners
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeRiskDetail);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeRiskDetail);

  // Keyboard Accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRiskDetail();
    }
  });

  // URL query parameter deep linking (e.g. ?risk=RSK-01)
  const urlParams = new URLSearchParams(window.location.search);
  const targetRiskId = urlParams.get('risk');
  const targetFilter = urlParams.get('filter');

  if (targetFilter && searchInput) {
    searchInput.value = targetFilter;
  }

  // Initial renders
  renderAttentionSection();
  renderRiskMatrix();
  renderProgressionTimeline();
  applyFilters();

  if (targetRiskId) {
    setTimeout(() => {
      openRiskDetail(targetRiskId);
    }, 200);
  }
});
