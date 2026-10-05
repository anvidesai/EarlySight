/**
 * EarlySight — Enterprise Main Dashboard Controller
 * Handles 7 Sections: Overview, Active Early Warnings, Emerging Issues,
 * Verified Alerts, Issues Under Investigation, Resolved Issues, Impact Monitoring
 * Emphasizes compact cards, clean typography & subtle indicators (no excessive icons)
 */

class EarlySightDashboard {
  constructor() {
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.activeView = 'dashboard'; // 'hero' or 'dashboard'
    
    this.init();
  }

  init() {
    this.renderMetricsOverview();
    this.renderEmergingRisksPanel();
    if (typeof this.initSignalMap === 'function') {
      this.initSignalMap();
    }
    this.renderActiveWarnings();
    this.renderEmergingIssues();
    this.renderVerifiedAlerts();
    this.renderUnderInvestigation();
    this.renderResolvedIssues();
    this.renderImpactMonitoring();
    this.bindEvents();

    // Check if URL hash targets dashboard or AI assistant
    if (window.location.hash) {
      const h = window.location.hash;
      if (h.includes('Dashboard') || h.includes('aiAssistant')) {
        this.switchView('dashboard');
        setTimeout(() => {
          const el = document.querySelector(h);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }

  bindEvents() {
    // Section tabs filtering
    const tabs = document.querySelectorAll('.dash-nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-section');
        this.filterSection(filter);
      });
    });

    // Search filter
    const searchInput = document.getElementById('dashSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.applySearchFilter();
      });
    }

    // View Switcher (Landing vs Dashboard)
    const viewSwitchHero = document.getElementById('viewSwitchHero');
    const viewSwitchDash = document.getElementById('viewSwitchDash');
    const heroStage = document.getElementById('heroStage');
    const mainDashboard = document.getElementById('mainDashboardSection');

    if (viewSwitchHero && viewSwitchDash) {
      viewSwitchHero.addEventListener('click', () => {
        this.switchView('hero');
      });
      viewSwitchDash.addEventListener('click', () => {
        this.switchView('dashboard');
      });
    }

    // Primary Explore EarlySight button in hero triggers dashboard entry
    const btnExplore = document.getElementById('btnExplore');
    if (btnExplore) {
      btnExplore.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchView('dashboard');
        const dashEl = document.getElementById('mainDashboardSection');
        if (dashEl) {
          dashEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  switchView(viewName) {
    this.activeView = viewName;
    const heroStage = document.getElementById('heroStage');
    const mainDashboard = document.getElementById('mainDashboardSection');
    const viewSwitchHero = document.getElementById('viewSwitchHero');
    const viewSwitchDash = document.getElementById('viewSwitchDash');

    if (viewName === 'dashboard') {
      if (mainDashboard) mainDashboard.classList.remove('hidden-view');
      if (viewSwitchDash) viewSwitchDash.classList.add('active');
      if (viewSwitchHero) viewSwitchHero.classList.remove('active');
      mainDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      if (viewSwitchHero) viewSwitchHero.classList.add('active');
      if (viewSwitchDash) viewSwitchDash.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  filterSection(filterId) {
    this.currentFilter = filterId;
    const sections = document.querySelectorAll('.dashboard-content-block');
    sections.forEach(sec => {
      const secType = sec.getAttribute('data-block-type');
      if (filterId === 'all' || filterId === secType) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });
  }

  applySearchFilter() {
    const q = this.searchQuery;
    const allCards = document.querySelectorAll('.compact-dashboard-card');
    allCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // 1. Overview Section
  renderMetricsOverview() {
    const container = document.getElementById('dashMetricsRow');
    if (!container) return;

    container.innerHTML = `
      <div class="metric-card-compact">
        <div class="metric-card-top">
          <span class="metric-sub-label">Active Signals</span>
          <span class="indicator-dot dot-slate"></span>
        </div>
        <div class="metric-primary-val">${DASHBOARD_METRICS.activeSignalsCount || 128} <span class="metric-unit">Signals</span></div>
        <div class="metric-footer-note text-muted">Across 6 enterprise operational zones</div>
      </div>

      <div class="metric-card-compact">
        <div class="metric-card-top">
          <span class="metric-sub-label">Emerging Risks</span>
          <span class="indicator-dot dot-vermilion"></span>
        </div>
        <div class="metric-primary-val">0${DASHBOARD_METRICS.emergingRisksCount || 7} <span class="metric-unit">Identified</span></div>
        <div class="metric-footer-note text-vermilion">Correlated pre-failure patterns</div>
      </div>

      <div class="metric-card-compact">
        <div class="metric-card-top">
          <span class="metric-sub-label">High Priority Issues</span>
          <span class="indicator-dot dot-amber"></span>
        </div>
        <div class="metric-primary-val">${DASHBOARD_METRICS.highPriorityCount || 12} <span class="metric-unit">Issues</span></div>
        <div class="metric-footer-note text-amber">Requires active engineering review</div>
      </div>

      <div class="metric-card-compact">
        <div class="metric-card-top">
          <span class="metric-sub-label">Open Actions</span>
          <span class="indicator-dot dot-emerald"></span>
        </div>
        <div class="metric-primary-val">${DASHBOARD_METRICS.openActionsCount || 19} <span class="metric-unit">Actions</span></div>
        <div class="metric-footer-note text-emerald">8 in progress • 5 assigned • 6 waiting</div>
      </div>
    `;
  }

  // Prominent Emerging Risks Panel (Card Fields: Problem title, Location, Related signals, Trend, Severity, Confidence, First detected, Last updated, Status, Recommended action)
  renderEmergingRisksPanel() {
    const container = document.getElementById('emergingRisksGridContainer');
    if (!container) return;

    container.innerHTML = EMERGING_RISKS_PANEL.map(r => `
      <div class="emerging-risk-card card-severity-${r.severity.toLowerCase()}" onclick="dashboardController.inspectRisk('${r.id}')">
        <div class="risk-card-top-row">
          <div class="risk-severity-pill ${r.severityBadgeClass}">
            <span class="indicator-dot ${r.severity === 'Critical' ? 'dot-vermilion' : (r.severity === 'High' ? 'dot-vermilion' : (r.severity === 'Medium' ? 'dot-amber' : 'dot-slate'))}"></span>
            <span>${r.severity} Severity</span>
          </div>
          <span class="risk-status-pill ${r.statusBadgeClass}">${r.status}</span>
        </div>

        <div class="risk-card-main-info">
          <h3 class="risk-card-title">${r.title}</h3>
          <div class="risk-card-location">
            <span class="location-marker-dot"></span>
            <span>Location: <strong>${r.location}</strong></span>
            <span class="text-muted">•</span>
            <span class="text-muted font-mono">${r.subsystem}</span>
          </div>
        </div>

        <div class="risk-signals-bar">
          <span class="risk-signals-count-label">${r.signalsLabel || (r.signalsCount + ' signals')}</span>
          <span class="text-muted font-mono" style="font-size:0.75rem;">Freq: <strong>${r.frequency || 'Increasing'}</strong></span>
          <div class="risk-signals-dots-preview">
            <span class="mini-signal-dot" style="background:#C85A32;"></span>
            <span class="mini-signal-dot" style="background:#B87333;"></span>
            <span class="mini-signal-dot" style="background:#5E7E6C;"></span>
            <span class="mini-signal-dot" style="background:#1B4332;"></span>
          </div>
        </div>

        <!-- Subtle Animated Trend Line -->
        <div class="sparkline-trend-container">
          <div class="trend-text-block">
            <div class="trend-arrow-label">
              <span>↗</span>
              <span>${r.trend}</span>
            </div>
            <span class="trend-sub-caption">Multi-Modal Signal Velocity</span>
          </div>
          <div class="trend-svg-box">
            <svg class="sparkline-svg" viewBox="0 0 160 48" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-${r.id}" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="${r.severity==='Critical'?'#C85A32':(r.severity==='High'?'#C85A32':'#B87333')}" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="${r.severity==='Critical'?'#C85A32':(r.severity==='High'?'#C85A32':'#B87333')}" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="${r.sparklineFill}" fill="url(#grad-${r.id})"/>
              <path class="sparkline-path" d="${r.sparklineD}" fill="none" stroke="${r.severity==='Critical'?'#C85A32':(r.severity==='High'?'#C85A32':'#B87333')}" stroke-width="2.2" stroke-linecap="round"/>
              <circle class="sparkline-pulse-dot" cx="150" cy="${r.endPointY}" r="3.5" fill="${r.severity==='Critical'?'#C85A32':(r.severity==='High'?'#C85A32':'#B87333')}"/>
            </svg>
          </div>
        </div>

        <!-- Recommended Action Box -->
        ${r.recommendedAction ? `
          <div style="background:var(--color-ivory-subtle, #F4F0E8); border-left:3px solid var(--intel-primary, #1B4332); padding:8px 12px; border-radius:4px; margin:10px 0; font-size:0.78rem; line-height:1.35; color:var(--ink-secondary);">
            <strong style="color:var(--ink-primary); display:block; margin-bottom:2px; font-family:var(--font-mono); font-size:0.7rem; text-transform:uppercase; letter-spacing:0.5px;">Recommended Action:</strong>
            ${r.recommendedAction}
          </div>
        ` : ''}

        <!-- Timings & Confidence Footer Grid -->
        <div class="risk-card-timings-grid">
          <div class="timing-cell">
            <span class="timing-cell-label">Confidence</span>
            <span class="timing-cell-val confidence-val" style="color:var(--accent-teal, #0D9488); font-weight:700;">${r.confidence}</span>
          </div>
          <div class="timing-cell">
            <span class="timing-cell-label">Last Detected</span>
            <span class="timing-cell-val">${r.lastDetected || r.lastUpdated}</span>
          </div>
          <div class="timing-cell">
            <span class="timing-cell-label">First Detected</span>
            <span class="timing-cell-val">${r.firstDetected}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 2. Active Early Warnings
  renderActiveWarnings() {
    const container = document.getElementById('activeWarningsContainer');
    if (!container) return;

    container.innerHTML = ACTIVE_EARLY_WARNINGS.map(w => `
      <div class="compact-dashboard-card card-risk-highlight" onclick="dashboardController.inspectWarning('${w.id}')">
        <div class="card-header-compact">
          <div class="card-title-group">
            <span class="indicator-dot ${w.statusIndicator === 'critical' ? 'dot-vermilion' : 'dot-amber'}"></span>
            <div>
              <h4 class="card-headline-text">${w.title}</h4>
              <span class="card-asset-sub">${w.asset} • <span class="font-mono text-muted">${w.location}</span></span>
            </div>
          </div>
          <div class="card-leadtime-badge">
            <span class="leadtime-clock-dot"></span>
            <span>${w.leadTime} Lead</span>
          </div>
        </div>

        <p class="card-body-summary">${w.summary}</p>

        <div class="card-metadata-row">
          <div class="meta-item">
            <span class="meta-label">Confidence:</span>
            <span class="meta-val font-semibold text-vermilion">${w.confidence}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Est. Impact:</span>
            <span class="meta-val font-semibold">${w.impactRisk}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Precursors:</span>
            <span class="meta-val text-muted">${w.signalsLinked} unified modalities</span>
          </div>
          <div class="card-team-tag">${w.assignedTeam}</div>
        </div>
      </div>
    `).join('');
  }

  // 3. Emerging Issues
  renderEmergingIssues() {
    const container = document.getElementById('emergingIssuesContainer');
    if (!container) return;

    container.innerHTML = EMERGING_ISSUES.map(e => `
      <div class="compact-dashboard-card" onclick="dashboardController.inspectEmerging('${e.id}')">
        <div class="card-header-compact">
          <div class="card-title-group">
            <span class="indicator-dot dot-amber"></span>
            <div>
              <h4 class="card-headline-text">${e.title}</h4>
              <span class="card-asset-sub">${e.asset} • <span class="font-mono text-muted">${e.location}</span></span>
            </div>
          </div>
          <span class="status-chip chip-amber">${e.velocity}</span>
        </div>

        <p class="card-body-summary">${e.note}</p>

        <div class="card-metadata-row">
          <div class="meta-item">
            <span class="meta-label">Coherence:</span>
            <span class="meta-val">${e.confidence}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Pattern Trend:</span>
            <span class="meta-val text-amber font-mono">${e.trend}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Detected:</span>
            <span class="meta-val font-mono text-muted">${e.detectedTime}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 4. Verified Alerts
  renderVerifiedAlerts() {
    const container = document.getElementById('verifiedAlertsContainer');
    if (!container) return;

    container.innerHTML = VERIFIED_ALERTS.map(v => `
      <div class="compact-dashboard-card" onclick="dashboardController.inspectVerified('${v.id}')">
        <div class="card-header-compact">
          <div class="card-title-group">
            <span class="indicator-dot dot-blue"></span>
            <div>
              <h4 class="card-headline-text">${v.title}</h4>
              <span class="card-asset-sub">${v.asset} • <span class="font-mono text-muted">${v.location}</span></span>
            </div>
          </div>
          <span class="status-chip chip-blue">${v.targetWindow}</span>
        </div>

        <p class="card-body-summary">${v.actionPlan}</p>

        <div class="card-metadata-row">
          <div class="meta-item">
            <span class="meta-label">Verified By:</span>
            <span class="meta-val">${v.verifiedBy}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Work Order:</span>
            <span class="meta-val font-mono text-blue">${v.workOrder}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 5. Issues Under Investigation
  renderUnderInvestigation() {
    const container = document.getElementById('investigationContainer');
    if (!container) return;

    container.innerHTML = UNDER_INVESTIGATION.map(inv => `
      <div class="compact-dashboard-card">
        <div class="card-header-compact">
          <div class="card-title-group">
            <span class="indicator-dot dot-slate"></span>
            <div>
              <h4 class="card-headline-text">${inv.title}</h4>
              <span class="card-asset-sub">${inv.asset} • <span class="font-mono text-muted">${inv.location}</span></span>
            </div>
          </div>
          <span class="status-chip chip-slate">${inv.investigationStatus}</span>
        </div>

        <p class="card-body-summary"><strong>Hypothesis:</strong> ${inv.hypothesis}</p>

        <div class="card-metadata-row">
          <div class="meta-item">
            <span class="meta-label">Lead:</span>
            <span class="meta-val">${inv.leadInvestigator}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Team:</span>
            <span class="meta-val text-muted">${inv.team}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Initiated:</span>
            <span class="meta-val font-mono text-muted">${inv.startedDate}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 6. Resolved Issues
  renderResolvedIssues() {
    const container = document.getElementById('resolvedIssuesContainer');
    if (!container) return;

    container.innerHTML = RESOLVED_ISSUES.map(res => `
      <div class="compact-dashboard-card card-resolved">
        <div class="card-header-compact">
          <div class="card-title-group">
            <span class="indicator-dot dot-emerald"></span>
            <div>
              <h4 class="card-headline-text">${res.title}</h4>
              <span class="card-asset-sub">${res.asset} • <span class="font-mono text-muted">${res.location}</span></span>
            </div>
          </div>
          <span class="status-chip chip-emerald">Averted • Saved ${res.costSaved}</span>
        </div>

        <p class="card-body-summary">${res.resolutionSummary}</p>

        <div class="card-metadata-row">
          <div class="meta-item">
            <span class="meta-label">Early Lead Time Provided:</span>
            <span class="meta-val font-semibold text-emerald">${res.leadTimeProvided}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Downtime Prevented:</span>
            <span class="meta-val font-mono">${res.downtimeAvoided}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Resolved On:</span>
            <span class="meta-val font-mono text-muted">${res.resolutionDate}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 7. Impact Monitoring
  renderImpactMonitoring() {
    const container = document.getElementById('impactMonitoringContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="impact-grid-container">
        <!-- Metric Card 1: Lead Time Benchmark Comparison -->
        <div class="impact-panel-card">
          <div class="impact-header-row">
            <span class="impact-title">Detection Lead Time Comparison</span>
            <span class="impact-pill">19.4d vs 2.1d Industry Mean</span>
          </div>
          <p class="impact-desc">Average operational advance warning time achieved before threshold alarm breach.</p>

          <div class="comparison-bar-group">
            <div class="comp-row">
              <span class="comp-label">EarlySight Multi-Modal AI</span>
              <div class="comp-bar-track">
                <div class="comp-bar-fill fill-vermilion" style="width: 88%;"></div>
              </div>
              <span class="comp-val font-bold text-vermilion">19.4 Days</span>
            </div>
            <div class="comp-row">
              <span class="comp-label">Single-Metric Thresholds (SCADA)</span>
              <div class="comp-bar-track">
                <div class="comp-bar-fill fill-muted" style="width: 12%;"></div>
              </div>
              <span class="comp-val font-mono text-muted">2.1 Days</span>
            </div>
            <div class="comp-row">
              <span class="comp-label">Manual Shift Inspection</span>
              <div class="comp-bar-track">
                <div class="comp-bar-fill fill-muted" style="width: 5%;"></div>
              </div>
              <span class="comp-val font-mono text-muted">0.5 Days</span>
            </div>
          </div>
        </div>

        <!-- Metric Card 2: Cost Avoidance by Modality -->
        <div class="impact-panel-card">
          <div class="impact-header-row">
            <span class="impact-title">Cost Avoidance by Subsystem</span>
            <span class="impact-pill">$1.84M Total</span>
          </div>
          <p class="impact-desc">Cumulative savings from averted catastrophic equipment breakdown this quarter.</p>

          <div class="breakdown-list">
            ${IMPACT_METRICS.breakdownByCategory.map(b => `
              <div class="breakdown-item">
                <div class="breakdown-info">
                  <span class="breakdown-name">${b.category}</span>
                  <span class="breakdown-cost font-mono">${b.avertedCost}</span>
                </div>
                <div class="comp-bar-track">
                  <div class="comp-bar-fill fill-slate" style="width: ${b.percentage};"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // Inspection Drawer
  inspectWarning(warningId) {
    const w = ACTIVE_EARLY_WARNINGS.find(x => x.id === warningId);
    if (!w) return;
    const modal = document.getElementById('signalModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span class="indicator-dot dot-vermilion"></span>
        <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; font-family:var(--font-mono); color:var(--accent-risk);">${w.urgency}</span>
        <span style="font-size:0.8rem; font-family:var(--font-mono); color:var(--ink-muted); margin-left:auto;">${w.leadTime} Lead</span>
      </div>
      <h3 style="font-size:1.25rem; font-weight:700; color:var(--ink-primary); margin-bottom:6px;">${w.title}</h3>
      <p style="font-size:0.85rem; color:var(--ink-secondary); margin-bottom:16px;">${w.asset} • ${w.location}</p>
      
      <div style="background:var(--bg-canvas-subtle); padding:14px; border-radius:8px; margin-bottom:16px; font-size:0.85rem; line-height:1.5;">
        ${w.summary}
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.8rem; margin-bottom:20px;">
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.7rem; color:var(--ink-muted); display:block;">Model Confidence</span>
          <strong style="color:var(--accent-risk); font-family:var(--font-mono); font-size:1rem;">${w.confidence}</strong>
        </div>
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.7rem; color:var(--ink-muted); display:block;">Potential Outage Impact</span>
          <strong style="font-family:var(--font-mono); font-size:1rem;">${w.impactRisk}</strong>
        </div>
      </div>

      <div style="border-top:1px solid var(--border-subtle); padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.78rem; color:var(--ink-muted);">Owner: <strong>${w.assignedTeam}</strong></span>
        <button style="padding:8px 16px; background:var(--ink-primary); color:#FFF; border:none; border-radius:6px; font-size:0.8rem; font-weight:600; cursor:pointer;" onclick="document.getElementById('signalModal').classList.remove('active')">Close Inspector</button>
      </div>
    `;

    modal.classList.add('active');
  }

  inspectEmerging(id) {
    const e = EMERGING_ISSUES.find(x => x.id === id);
    if (!e) return;
    const modal = document.getElementById('signalModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span class="indicator-dot dot-amber"></span>
        <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; font-family:var(--font-mono); color:var(--accent-amber);">Emerging Issue</span>
        <span style="font-size:0.8rem; font-family:var(--font-mono); color:var(--ink-muted); margin-left:auto;">${e.detectedTime}</span>
      </div>
      <h3 style="font-size:1.2rem; font-weight:700; color:var(--ink-primary); margin-bottom:6px;">${e.title}</h3>
      <p style="font-size:0.85rem; color:var(--ink-secondary); margin-bottom:16px;">${e.asset} • ${e.location}</p>
      
      <p style="background:var(--bg-canvas-subtle); padding:14px; border-radius:8px; margin-bottom:16px; font-size:0.85rem; line-height:1.5;">${e.note}</p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.8rem; margin-bottom:20px;">
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.7rem; color:var(--ink-muted); display:block;">Emergence Velocity</span>
          <strong style="color:var(--accent-amber); font-family:var(--font-mono);">${e.velocity}</strong>
        </div>
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.7rem; color:var(--ink-muted); display:block;">Pattern Trajectory</span>
          <strong style="font-family:var(--font-mono);">${e.trend}</strong>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  inspectVerified(id) {
    const v = VERIFIED_ALERTS.find(x => x.id === id);
    if (!v) return;
    const modal = document.getElementById('signalModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span class="indicator-dot dot-teal"></span>
        <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; font-family:var(--font-mono); color:var(--color-forest);">Verified Pre-Failure Alert</span>
        <span style="font-size:0.8rem; font-family:var(--font-mono); color:var(--ink-muted); margin-left:auto;">${v.targetWindow}</span>
      </div>
      <h3 style="font-size:1.2rem; font-weight:700; color:var(--ink-primary); margin-bottom:6px;">${v.title}</h3>
      <p style="font-size:0.85rem; color:var(--ink-secondary); margin-bottom:16px;">${v.asset} • ${v.location}</p>
      
      <div style="background:var(--bg-canvas-subtle); padding:14px; border-radius:8px; margin-bottom:16px; font-size:0.85rem; line-height:1.5;">
        <strong>Prescriptive Action:</strong> ${v.actionPlan}
      </div>

      <div style="font-size:0.8rem; color:var(--ink-secondary); margin-bottom:16px;">
        <div>Verified By: <strong>${v.verifiedBy}</strong> on ${v.verificationDate}</div>
        <div>Work Order Number: <strong class="font-mono">${v.workOrder}</strong></div>
      </div>
    `;

    modal.classList.add('active');
  }

  initSignalMap() {
    if (typeof EarlySightSignalMap === 'function') {
      const canvasEl = document.getElementById('facilityMapCanvas');
      const wrapperEl = document.getElementById('signalMapWrapper');
      if (canvasEl && wrapperEl) {
        this.signalMap = new EarlySightSignalMap('facilityMapCanvas', 'signalMapWrapper');
      }
    }
  }

  inspectRisk(id) {
    const r = EMERGING_RISKS_PANEL.find(x => x.id === id);
    if (!r) return;
    const modal = document.getElementById('signalModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span class="indicator-dot ${r.severity === 'Critical' ? 'dot-vermilion' : (r.severity === 'High' ? 'dot-amber' : 'dot-slate')}"></span>
        <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; font-family:var(--font-mono); color:var(--accent-risk);">${r.severity} Severity Emerging Risk</span>
        <span class="risk-status-pill ${r.statusBadgeClass}" style="margin-left:auto;">${r.status}</span>
      </div>
      <h3 style="font-size:1.25rem; font-weight:800; color:var(--ink-primary); margin-bottom:6px; letter-spacing:-0.02em;">${r.title}</h3>
      <div style="font-size:0.85rem; color:var(--ink-secondary); margin-bottom:16px;">
        <span>📍 ${r.location}</span> • <span class="font-mono text-muted">${r.subsystem}</span>
      </div>

      <div style="background:var(--bg-canvas-subtle); border-left:3px solid var(--accent-risk); padding:14px; border-radius:6px; margin-bottom:16px; font-size:0.88rem; line-height:1.5;">
        ${r.summary}
      </div>

      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; font-size:0.8rem; margin-bottom:18px;">
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.68rem; color:var(--ink-muted); text-transform:uppercase; font-family:var(--font-mono); display:block;">Related Signals</span>
          <strong style="color:var(--accent-risk); font-family:var(--font-mono); font-size:1.1rem;">${r.signalsCount} Signals</strong>
        </div>
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.68rem; color:var(--ink-muted); text-transform:uppercase; font-family:var(--font-mono); display:block;">Model Confidence</span>
          <strong style="color:var(--ink-primary); font-family:var(--font-mono); font-size:1.1rem;">${r.confidence}</strong>
        </div>
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.68rem; color:var(--ink-muted); text-transform:uppercase; font-family:var(--font-mono); display:block;">Signal Velocity</span>
          <strong style="color:var(--accent-amber); font-family:var(--font-mono); font-size:1rem;">${r.trend}</strong>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.75rem; margin-bottom:20px; color:var(--ink-secondary);">
        <div>First Detected: <strong class="font-mono">${r.firstDetected}</strong></div>
        <div>Last Sensor Update: <strong class="font-mono">${r.lastUpdated}</strong></div>
      </div>

      <div style="border-top:1px solid var(--border-subtle); padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
        <button style="padding:8px 14px; background:transparent; border:1px solid var(--border-subtle); border-radius:6px; font-size:0.8rem; font-weight:600; cursor:pointer;" onclick="if(window.dashboardController.signalMap){window.dashboardController.signalMap.setLocationFilter('${r.location.toLowerCase().includes('block a') ? 'block-a' : (r.location.toLowerCase().includes('block c') ? 'block-c' : (r.location.toLowerCase().includes('power') ? 'power-island' : 'all'))}'); document.getElementById('signalModal').classList.remove('active'); const mapEl = document.getElementById('signalMapWrapper'); if(mapEl) mapEl.scrollIntoView({behavior:'smooth'});}">Focus on Signal Map →</button>
        <button style="padding:8px 16px; background:var(--ink-primary); color:#FFF; border:none; border-radius:6px; font-size:0.8rem; font-weight:600; cursor:pointer;" onclick="document.getElementById('signalModal').classList.remove('active')">Close Inspector</button>
      </div>
    `;

    modal.classList.add('active');
  }

  inspectMapSignal(sigId) {
    if (typeof FACILITY_SIGNALS_DATA === 'undefined') return;
    const sig = FACILITY_SIGNALS_DATA.find(s => s.id === sigId);
    if (!sig) return;

    const modal = document.getElementById('signalModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span class="tooltip-type-tag" style="background:${sig.color}22; color:${sig.color}; border:1px solid ${sig.color}44;">
          ${sig.type}
        </span>
        <span style="font-family:var(--font-mono); font-weight:700; font-size:0.8rem; color:var(--ink-muted);">${sig.id}</span>
        <span class="risk-severity-pill ${sig.severity === 'critical' ? 'badge-severity-critical' : (sig.severity === 'high' ? 'badge-severity-high' : 'badge-severity-moderate')}" style="margin-left:auto;">
          ${sig.severity.toUpperCase()}
        </span>
      </div>

      <h3 style="font-size:1.2rem; font-weight:800; color:var(--ink-primary); margin-bottom:6px;">${sig.title}</h3>
      <p style="font-size:0.82rem; color:var(--ink-secondary); margin-bottom:12px;">📍 ${sig.zoneName} • <strong>${sig.asset}</strong></p>

      <div style="background:var(--bg-canvas-subtle); padding:14px; border-radius:8px; margin-bottom:16px; font-size:0.85rem; line-height:1.5;">
        ${sig.note}
      </div>

      <div style="padding:10px 14px; background:rgba(217, 78, 52, 0.05); border-left:3px solid var(--accent-risk); border-radius:4px; margin-bottom:16px;">
        <span style="font-size:0.7rem; color:var(--ink-muted); text-transform:uppercase; font-family:var(--font-mono); display:block;">Synthesized Emerging Risk</span>
        <strong style="color:var(--ink-primary); font-size:0.95rem;">${sig.riskLink}</strong>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.78rem; margin-bottom:20px;">
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.68rem; color:var(--ink-muted); display:block;">Signal Velocity</span>
          <strong style="color:var(--accent-risk); font-family:var(--font-mono);">${sig.trend}</strong>
        </div>
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.68rem; color:var(--ink-muted); display:block;">Telemetry Confidence</span>
          <strong style="font-family:var(--font-mono);">${sig.confidence}</strong>
        </div>
      </div>

      <div style="border-top:1px solid var(--border-subtle); padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.75rem; color:var(--ink-muted);">Logged: <strong>${sig.timeAgo}</strong></span>
        <button style="padding:8px 16px; background:var(--ink-primary); color:#FFF; border:none; border-radius:6px; font-size:0.8rem; font-weight:600; cursor:pointer;" onclick="document.getElementById('signalModal').classList.remove('active')">Close Inspector</button>
      </div>
    `;

    modal.classList.add('active');
  }

  inspectMapZone(zoneId) {
    if (typeof FACILITY_MAP_ZONES === 'undefined') return;
    const zone = FACILITY_MAP_ZONES.find(z => z.id === zoneId);
    if (!zone) return;

    const modal = document.getElementById('signalModal');
    const content = document.getElementById('modalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span class="tooltip-cluster-badge" style="background:${zone.themeColor}18; color:${zone.themeColor}; border:1px solid ${zone.themeColor}55;">
          ${zone.shortCode} GEOSPATIAL CLUSTER
        </span>
        <span class="risk-severity-pill badge-severity-high" style="margin-left:auto;">
          ${zone.riskBadge}
        </span>
      </div>

      <h3 style="font-size:1.25rem; font-weight:800; color:var(--ink-primary); margin-bottom:6px;">${zone.primaryRiskTitle}</h3>
      <p style="font-size:0.82rem; color:var(--ink-secondary); margin-bottom:14px;">🏢 ${zone.name} • <span class="font-mono text-muted">${zone.area}</span></p>

      <div style="background:var(--bg-canvas-subtle); padding:14px; border-radius:8px; margin-bottom:16px; font-size:0.85rem; line-height:1.5;">
        ${zone.primaryRiskSummary}
      </div>

      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; font-size:0.8rem; margin-bottom:18px;">
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.68rem; color:var(--ink-muted); text-transform:uppercase; font-family:var(--font-mono); display:block;">Cluster Size</span>
          <strong style="color:var(--accent-risk); font-family:var(--font-mono); font-size:1.1rem;">${zone.signalsCount} Signals</strong>
        </div>
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.68rem; color:var(--ink-muted); text-transform:uppercase; font-family:var(--font-mono); display:block;">Synthesis Confidence</span>
          <strong style="color:var(--ink-primary); font-family:var(--font-mono); font-size:1.1rem;">${zone.confidence}</strong>
        </div>
        <div style="padding:10px; background:var(--bg-canvas); border:1px solid var(--border-subtle); border-radius:6px;">
          <span style="font-size:0.68rem; color:var(--ink-muted); text-transform:uppercase; font-family:var(--font-mono); display:block;">Current Status</span>
          <strong style="color:var(--accent-amber); font-family:var(--font-mono); font-size:0.95rem;">${zone.status}</strong>
        </div>
      </div>

      <div style="border-top:1px solid var(--border-subtle); padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.75rem; color:var(--ink-muted);">Monitored Machine Bays: <strong>${zone.bays.length} Sub-Zones</strong></span>
        <button style="padding:8px 16px; background:var(--ink-primary); color:#FFF; border:none; border-radius:6px; font-size:0.8rem; font-weight:600; cursor:pointer;" onclick="document.getElementById('signalModal').classList.remove('active')">Close Inspector</button>
      </div>
    `;

    modal.classList.add('active');
  }
}

// Global instance
window.dashboardController = new EarlySightDashboard();
