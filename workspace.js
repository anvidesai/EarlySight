/**
 * EarlySight — Multi-Organization Workspace Controller (Stage 12)
 * 
 * Manages strict tenant isolation across ABC College, City Hospital,
 * Green Residency, and Apex Industrial.
 * Ensures zero cross-tenant data leakage across Dashboard, Signals,
 * Alerts, Teams, Reports, Analytics, and Scoped AI Assistant.
 */

(function () {
  'use strict';

  class MultiOrgWorkspaceController {
    constructor(data) {
      this.data = data;
      this.currentTenantId = localStorage.getItem('earlysight_active_tenant') || 'org-abc-college';
      
      // Ensure currentTenantId is valid
      if (!this.data.tenants[this.currentTenantId]) {
        this.currentTenantId = 'org-abc-college';
      }

      this.currentTab = 'dashboard';
      this.signalsSearchQuery = '';
      this.signalsModalityFilter = 'all';
      this.reportsSearchQuery = '';

      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.onReady());
      } else {
        this.onReady();
      }
    }

    onReady() {
      this.cacheElements();
      this.bindEvents();
      this.switchTenant(this.currentTenantId, false);
    }

    cacheElements() {
      // Body & Header
      this.appBody = document.getElementById('workspaceAppBody');
      this.headerOrgBadge = document.getElementById('headerOrgBadge');
      this.headerOrgIcon = document.getElementById('headerOrgIcon');
      this.headerOrgName = document.getElementById('headerOrgName');
      this.btnOpenOrgSelector = document.getElementById('btnOpenOrgSelector');
      this.btnHeaderSwitchWorkspace = document.getElementById('btnHeaderSwitchWorkspace');

      // Security Banner
      this.bannerSecurityTier = document.getElementById('bannerSecurityTier');
      this.bannerTenantCode = document.getElementById('bannerTenantCode');
      this.bannerOrgIcon = document.getElementById('bannerOrgIcon');
      this.bannerOrgTitle = document.getElementById('bannerOrgTitle');
      this.bannerOrgSubtitle = document.getElementById('bannerOrgSubtitle');
      this.bannerLocationMeta = document.getElementById('bannerLocationMeta');
      this.quickOrgPillsContainer = document.getElementById('quickOrgPillsContainer');

      // Module Tab Badges
      this.tabBadgeSignals = document.getElementById('tabBadgeSignals');
      this.tabBadgeAlerts = document.getElementById('tabBadgeAlerts');
      this.tabBadgeTeams = document.getElementById('tabBadgeTeams');
      this.tabBadgeReports = document.getElementById('tabBadgeReports');

      // Panels
      this.panelDashboard = document.getElementById('panel-dashboard');
      this.panelSignals = document.getElementById('panel-signals');
      this.panelAlerts = document.getElementById('panel-alerts');
      this.panelTeams = document.getElementById('panel-teams');
      this.panelReports = document.getElementById('panel-reports');
      this.panelAnalytics = document.getElementById('panel-analytics');
      this.panelAiAssistant = document.getElementById('panel-aiAssistant');

      // Dashboard Elements
      this.orgKpiGrid = document.getElementById('orgKpiGrid');
      this.dashTotalAssets = document.getElementById('dashTotalAssets');
      this.dashFacilityZonesList = document.getElementById('dashFacilityZonesList');
      this.dashActiveAlertCount = document.getElementById('dashActiveAlertCount');
      this.dashPriorityAlertsList = document.getElementById('dashPriorityAlertsList');
      this.dashMilestoneText = document.getElementById('dashMilestoneText');

      // Signals Elements
      this.signalsSearchInput = document.getElementById('signalsSearchInput');
      this.orgSignalsGrid = document.getElementById('orgSignalsGrid');

      // Alerts Elements
      this.orgAlertsStack = document.getElementById('orgAlertsStack');

      // Teams Elements
      this.orgTeamsGrid = document.getElementById('orgTeamsGrid');

      // Reports Elements
      this.reportsSearchInput = document.getElementById('reportsSearchInput');
      this.orgReportsTableBody = document.getElementById('orgReportsTableBody');
      this.btnExportAllReports = document.getElementById('btnExportAllReports');

      // Analytics Elements
      this.analyticsTotalSavings = document.getElementById('analyticsTotalSavings');
      this.analyticsMonthlyChart = document.getElementById('analyticsMonthlyChart');
      this.analyticsRiskDistList = document.getElementById('analyticsRiskDistList');
      this.analyticsMetricsStrip = document.getElementById('analyticsMetricsStrip');

      // AI Assistant Elements
      this.aiCopilotIdentity = document.getElementById('aiCopilotIdentity');
      this.aiSuggestedPromptsRow = document.getElementById('aiSuggestedPromptsRow');
      this.aiChatWindow = document.getElementById('aiChatWindow');
      this.aiChatInput = document.getElementById('aiChatInput');
      this.btnAiChatSend = document.getElementById('btnAiChatSend');

      // Modal Elements
      this.orgSelectorModal = document.getElementById('orgSelectorModal');
      this.orgDirectoryGrid = document.getElementById('orgDirectoryGrid');
      this.modalActiveTenantCode = document.getElementById('modalActiveTenantCode');
      this.btnOrgModalClose = document.getElementById('btnOrgModalClose');
      this.btnDismissOrgModal = document.getElementById('btnDismissOrgModal');

      // Toast Container
      this.toastContainer = document.getElementById('workspaceToastContainer');
    }

    /**
     * Switch Active Tenant Workspace (Strict Air-Gapped Transition)
     */
    switchTenant(tenantId, showNotification = true) {
      if (!this.data.tenants[tenantId]) return;

      this.currentTenantId = tenantId;
      localStorage.setItem('earlysight_active_tenant', tenantId);

      const t = this.data.tenants[tenantId];

      // Update Body Theme Class
      this.appBody.className = `map-page-body workspace-page-body theme-${tenantId.replace('org-', '')}`;

      // Update Header
      if (this.headerOrgBadge) this.headerOrgBadge.textContent = t.name;
      if (this.headerOrgName) this.headerOrgName.textContent = t.name;
      if (this.headerOrgIcon) this.headerOrgIcon.innerHTML = t.logoIconSvg;

      // Update Security Banner
      if (this.bannerSecurityTier) this.bannerSecurityTier.textContent = t.securityTier;
      if (this.bannerTenantCode) this.bannerTenantCode.textContent = t.tenantCode;
      if (this.bannerOrgIcon) this.bannerOrgIcon.innerHTML = t.logoIconSvg;
      if (this.bannerOrgTitle) this.bannerOrgTitle.textContent = t.name;
      if (this.bannerOrgSubtitle) this.bannerOrgSubtitle.textContent = t.shortDesc;
      if (this.bannerLocationMeta) this.bannerLocationMeta.textContent = t.location;

      // Render Quick Switcher Pills in Banner
      this.renderQuickOrgPills();

      // Update Tab Badges
      if (this.tabBadgeSignals) this.tabBadgeSignals.textContent = t.signals.length;
      if (this.tabBadgeAlerts) this.tabBadgeAlerts.textContent = t.alerts.length;
      if (this.tabBadgeTeams) this.tabBadgeTeams.textContent = t.teams.length;
      if (this.tabBadgeReports) this.tabBadgeReports.textContent = t.reports.length;

      // Render All 7 Dedicated Modules for this Organization
      this.renderDashboard(t);
      this.renderSignals(t);
      this.renderAlerts(t);
      this.renderTeams(t);
      this.renderReports(t);
      this.renderAnalytics(t);
      this.renderAiAssistant(t);

      // Update Modal Active Indicator
      if (this.modalActiveTenantCode) this.modalActiveTenantCode.textContent = `${t.name} (${t.tenantCode})`;

      if (showNotification) {
        this.showToast(`Switched workspace to ${t.name}. Loaded air-gapped data store.`);
      }
    }

    /**
     * Render Quick Switch Pills inside Security Banner
     */
    renderQuickOrgPills() {
      if (!this.quickOrgPillsContainer) return;
      this.quickOrgPillsContainer.innerHTML = '';

      Object.values(this.data.tenants).forEach((org) => {
        const btn = document.createElement('button');
        const isActive = org.id === this.currentTenantId;
        btn.className = `quick-org-pill ${isActive ? 'active' : ''}`;
        btn.innerHTML = `
          <span class="pill-org-dot" style="background: ${org.themeColor};"></span>
          <span class="pill-org-name">${org.name}</span>
          ${isActive ? '<span class="pill-active-mark font-mono">&bull; Active</span>' : ''}
        `;

        btn.addEventListener('click', () => {
          if (org.id !== this.currentTenantId) {
            this.switchTenant(org.id, true);
          }
        });

        this.quickOrgPillsContainer.appendChild(btn);
      });
    }

    /**
     * 1. RENDER DASHBOARD
     */
    renderDashboard(t) {
      if (!this.orgKpiGrid) return;

      // Render 5-6 Executive KPIs
      this.orgKpiGrid.innerHTML = `
        <div class="workspace-kpi-card">
          <span class="kpi-label font-mono">MONITORED ASSETS</span>
          <span class="kpi-value font-mono">${t.kpis.totalMonitoredAssets}</span>
          <span class="kpi-sub">${t.kpis.activeSensors} active IoT streams</span>
        </div>

        <div class="workspace-kpi-card">
          <span class="kpi-label font-mono">WEAK SIGNALS</span>
          <span class="kpi-value font-mono text-vermilion">${t.kpis.activeWeakSignals}</span>
          <span class="kpi-sub">Cross-silo emergent precursors</span>
        </div>

        <div class="workspace-kpi-card">
          <span class="kpi-label font-mono">CRITICAL ALERTS</span>
          <span class="kpi-value font-mono ${t.kpis.criticalAlertsCount > 0 ? 'text-vermilion' : 'text-emerald'}">${t.kpis.criticalAlertsCount}</span>
          <span class="kpi-sub">Engineering validated early warnings</span>
        </div>

        <div class="workspace-kpi-card">
          <span class="kpi-label font-mono">MEAN LEAD TIME</span>
          <span class="kpi-value font-mono text-amber">${t.kpis.meanLeadTimeDays}d</span>
          <span class="kpi-sub">Advance warning lead horizon</span>
        </div>

        <div class="workspace-kpi-card">
          <span class="kpi-label font-mono">AVERTED LOSS</span>
          <span class="kpi-value font-mono text-emerald">${t.kpis.avertedDisruptionCost}</span>
          <span class="kpi-sub">Validated operational savings</span>
        </div>

        <div class="workspace-kpi-card">
          <span class="kpi-label font-mono">OPERATIONAL INDEX</span>
          <span class="kpi-value font-mono text-emerald">${t.kpis.studentComfortIndex}</span>
          <span class="kpi-sub">${t.kpis.sustainabilityRating}</span>
        </div>
      `;

      // Facility Zones
      if (this.dashTotalAssets) this.dashTotalAssets.textContent = `${t.kpis.totalMonitoredAssets} Monitored Assets`;
      if (this.dashFacilityZonesList) {
        this.dashFacilityZonesList.innerHTML = '';
        t.dashboard.facilityZones.forEach(zone => {
          const row = document.createElement('div');
          row.className = 'facility-zone-row';
          const isWatch = zone.status === 'Active Watch' || zone.status === 'Investigation';
          row.innerHTML = `
            <div class="zone-info-col">
              <span class="zone-name font-bold">${zone.name}</span>
              <span class="zone-lead-risk text-xs text-muted font-mono">&rarr; ${zone.leadRisk}</span>
            </div>
            <div class="zone-meta-col font-mono text-xs">
              <span class="zone-signals font-bold ${zone.signals > 0 ? 'text-vermilion' : 'text-muted'}">${zone.signals} signals</span>
              <span class="status-chip ${isWatch ? 'chip-monitoring' : 'chip-verified'}">${zone.status}</span>
            </div>
          `;
          this.dashFacilityZonesList.appendChild(row);
        });
      }

      // Priority Alerts Summary
      if (this.dashActiveAlertCount) this.dashActiveAlertCount.textContent = `${t.alerts.length} Active`;
      if (this.dashPriorityAlertsList) {
        this.dashPriorityAlertsList.innerHTML = '';
        t.alerts.forEach(alr => {
          const card = document.createElement('div');
          card.className = 'priority-alert-mini-card';
          card.innerHTML = `
            <div class="mini-card-header">
              <span class="status-chip ${alr.severity === 'Critical P1' ? 'chip-danger' : 'chip-monitoring'} font-mono">${alr.severity}</span>
              <span class="font-mono text-xs font-bold text-amber">${alr.countdownLeadTime}</span>
            </div>
            <h4 class="mini-card-title">${alr.title}</h4>
            <p class="mini-card-location font-mono text-xs text-muted">${alr.location}</p>
            <p class="mini-card-action text-xs text-secondary mt-1"><strong>Action:</strong> ${alr.recommendedAction}</p>
          `;
          this.dashPriorityAlertsList.appendChild(card);
        });
      }

      // Milestone
      if (this.dashMilestoneText) {
        this.dashMilestoneText.textContent = t.dashboard.recentMilestone;
      }
    }

    /**
     * 2. RENDER SIGNALS
     */
    renderSignals(t) {
      if (!this.orgSignalsGrid) return;
      this.orgSignalsGrid.innerHTML = '';

      let list = t.signals.slice();

      // Search filter
      if (this.signalsSearchQuery) {
        const q = this.signalsSearchQuery.toLowerCase();
        list = list.filter(s => 
          s.id.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.source.toLowerCase().includes(q) ||
          s.crossSiloNote.toLowerCase().includes(q)
        );
      }

      // Modality filter
      if (this.signalsModalityFilter !== 'all') {
        list = list.filter(s => s.modality.toLowerCase().includes(this.signalsModalityFilter.toLowerCase()));
      }

      if (list.length === 0) {
        this.orgSignalsGrid.innerHTML = `
          <div class="empty-state-block">
            <span class="text-muted font-mono">No signals found matching criteria for ${t.name}.</span>
          </div>
        `;
        return;
      }

      list.forEach(s => {
        const card = document.createElement('div');
        card.className = 'signal-item-card';

        const isHigh = s.severity === 'Critical' || s.severity === 'High';

        card.innerHTML = `
          <div class="signal-card-top">
            <span class="signal-modality-pill font-mono">${s.modality}</span>
            <span class="signal-severity-tag font-mono ${isHigh ? 'text-vermilion' : 'text-amber'}">${s.severity}</span>
          </div>

          <h3 class="signal-card-title">${s.title}</h3>
          <div class="signal-location-row font-mono text-xs text-muted">
            <span>&#9678; ${s.location}</span>
          </div>

          <div class="signal-metrics-row">
            <div class="signal-metric-col">
              <span class="font-mono text-xs text-muted">Frequency:</span>
              <span class="font-mono font-bold ${isHigh ? 'text-vermilion' : ''}">${s.frequency}</span>
            </div>
            <div class="signal-metric-col">
              <span class="font-mono text-xs text-muted">Source:</span>
              <span class="font-mono font-bold">${s.source}</span>
            </div>
          </div>

          <div class="signal-cross-silo-box">
            <span class="cross-silo-label font-mono">CROSS-SILO CORRELATION:</span>
            <p class="cross-silo-text">${s.crossSiloNote}</p>
          </div>

          <div class="signal-card-footer font-mono text-xs text-muted">
            <span>Logged: ${s.timestamp}</span>
            <button class="btn-inspect-signal" data-id="${s.id}">Inspect &rarr;</button>
          </div>
        `;

        card.querySelector('.btn-inspect-signal').addEventListener('click', () => {
          this.showToast(`Inspecting ${s.id}: ${s.title}`);
        });

        this.orgSignalsGrid.appendChild(card);
      });
    }

    /**
     * 3. RENDER ALERTS
     */
    renderAlerts(t) {
      if (!this.orgAlertsStack) return;
      this.orgAlertsStack.innerHTML = '';

      if (t.alerts.length === 0) {
        this.orgAlertsStack.innerHTML = `
          <div class="empty-state-block">
            <span class="text-muted font-mono">Zero active critical alerts for ${t.name}.</span>
          </div>
        `;
        return;
      }

      t.alerts.forEach(alr => {
        const card = document.createElement('div');
        card.className = 'workspace-alert-card';

        card.innerHTML = `
          <div class="alert-card-left">
            <div class="alert-header-row">
              <span class="status-chip chip-danger font-mono font-bold">${alr.severity}</span>
              <span class="font-mono text-xs text-muted">${alr.id}</span>
              <span class="alert-lead-pill font-mono font-bold text-vermilion">&#9201; ${alr.countdownLeadTime}</span>
              <span class="alert-conf-pill font-mono text-emerald">Conf: ${alr.confidence}</span>
            </div>

            <h2 class="alert-title">${alr.title}</h2>
            <div class="alert-location font-mono text-xs text-muted">&#9678; ${alr.location}</div>

            <div class="alert-stakeholder-strip font-mono text-xs">
              <strong class="text-ink">Affected:</strong> <span>${alr.affectedStakeholders}</span>
            </div>

            <div class="alert-hypothesis-box">
              <strong class="font-mono text-xs text-muted uppercase">Root Cause Physical Hypothesis:</strong>
              <p class="hypothesis-text">${alr.rootCauseHypothesis}</p>
            </div>

            <div class="alert-action-box">
              <strong class="font-mono text-xs text-emerald uppercase">&#9881; Prescriptive Action Pathway:</strong>
              <p class="action-text">${alr.recommendedAction}</p>
            </div>
          </div>

          <div class="alert-card-right">
            <div class="alert-savings-box">
              <span class="savings-label font-mono">PROJECTED DOWNTIME LOSS AVERTED:</span>
              <span class="savings-val font-mono text-emerald">${alr.leadTimeSavings}</span>
            </div>

            <div class="alert-status-block font-mono text-xs">
              <span class="text-muted">Workflow Status:</span>
              <span class="status-chip chip-monitoring">${alr.status}</span>
            </div>

            <div class="alert-buttons-row">
              <button class="btn-dispatch-squad font-mono font-bold" data-alert-id="${alr.id}">
                Dispatch Squad &rarr;
              </button>
            </div>
          </div>
        `;

        card.querySelector('.btn-dispatch-squad').addEventListener('click', () => {
          this.showToast(`Prescriptive work order issued for ${alr.id}. Squad notified.`);
        });

        this.orgAlertsStack.appendChild(card);
      });
    }

    /**
     * 4. RENDER TEAMS
     */
    renderTeams(t) {
      if (!this.orgTeamsGrid) return;
      this.orgTeamsGrid.innerHTML = '';

      t.teams.forEach(team => {
        const card = document.createElement('div');
        card.className = 'team-squad-card';

        // Initials avatar
        const initials = team.lead.split(' ').map(n => n[0]).join('').substring(0, 2);

        card.innerHTML = `
          <div class="team-card-header">
            <div class="team-avatar font-mono">${initials}</div>
            <div class="team-title-group">
              <h3 class="team-name">${team.name}</h3>
              <span class="team-lead text-xs font-bold text-muted">${team.lead}</span>
            </div>
            <span class="team-count-badge font-mono text-xs">${team.membersCount} crew</span>
          </div>

          <div class="team-details-list font-mono text-xs">
            <div class="team-detail-row">
              <span class="text-muted">Shift Coverage:</span>
              <span class="font-bold text-ink">${team.shiftCoverage}</span>
            </div>
            <div class="team-detail-row">
              <span class="text-muted">Active Work Tickets:</span>
              <span class="font-bold text-vermilion">${team.activeTickets} assigned</span>
            </div>
            <div class="team-detail-row">
              <span class="text-muted">Direct Protocol:</span>
              <span class="font-bold text-emerald">${team.contact}</span>
            </div>
          </div>

          <div class="team-specialties-box">
            <span class="font-mono text-xs text-muted">Specialized Competencies:</span>
            <p class="specialties-text">${team.specialties}</p>
          </div>

          <div class="team-card-footer">
            <button class="btn-page-action" data-team="${team.id}">
              Page On-Call Crew
            </button>
          </div>
        `;

        card.querySelector('.btn-page-action').addEventListener('click', () => {
          this.showToast(`Paging on-call crew: ${team.name} (${team.contact})`);
        });

        this.orgTeamsGrid.appendChild(card);
      });
    }

    /**
     * 5. RENDER REPORTS
     */
    renderReports(t) {
      if (!this.orgReportsTableBody) return;
      this.orgReportsTableBody.innerHTML = '';

      let list = t.reports.slice();
      if (this.reportsSearchQuery) {
        const q = this.reportsSearchQuery.toLowerCase();
        list = list.filter(r => 
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q) ||
          r.complianceCode.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q)
        );
      }

      list.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="font-mono font-bold">${r.id}</td>
          <td>
            <div class="font-bold">${r.title}</div>
            <div class="text-xs text-muted" style="max-width:320px;">${r.summary}</div>
          </td>
          <td class="text-xs">${r.author}</td>
          <td class="font-mono text-xs">${r.date}</td>
          <td><span class="font-mono text-xs text-muted font-bold">${r.complianceCode}</span></td>
          <td><span class="status-chip chip-verified font-mono text-xs">${r.status}</span></td>
          <td class="text-center">
            <button class="btn-table-inspect" data-report-id="${r.id}">
              Download PDF
            </button>
          </td>
        `;

        tr.querySelector('.btn-table-inspect').addEventListener('click', () => {
          this.showToast(`Downloading verified audit report: ${r.id}`);
        });

        this.orgReportsTableBody.appendChild(tr);
      });
    }

    /**
     * 6. RENDER ANALYTICS
     */
    renderAnalytics(t) {
      if (!t.analytics) return;

      if (this.analyticsTotalSavings) {
        this.analyticsTotalSavings.textContent = `${t.analytics.avertedCost2026} Total`;
      }

      // Render Monthly Savings SVG Bar Chart
      if (this.analyticsMonthlyChart && t.analytics.monthlySavings) {
        const months = t.analytics.monthlySavings;
        const maxVal = 400000;
        let svgBars = `
          <svg width="100%" height="220" viewBox="0 0 500 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${t.themeColor}" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="${t.themeColor}" stop-opacity="0.3"/>
              </linearGradient>
            </defs>
        `;

        const barWidth = 45;
        const spacing = 500 / months.length;

        months.forEach((m, idx) => {
          const numVal = parseInt(m.amount.replace(/[^0-9]/g, ''), 10);
          const barHeight = Math.min(160, (numVal / maxVal) * 160);
          const x = idx * spacing + (spacing - barWidth) / 2;
          const y = 180 - barHeight;

          svgBars += `
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="url(#barGrad)"/>
            <text x="${x + barWidth / 2}" y="${y - 6}" fill="${t.themeColor}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" text-anchor="middle">${m.amount}</text>
            <text x="${x + barWidth / 2}" y="202" fill="#647082" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="middle">${m.month}</text>
          `;
        });

        svgBars += `
          <line x1="0" y1="180" x2="500" y2="180" stroke="#E2DCD5" stroke-width="1"/>
        </svg>`;

        this.analyticsMonthlyChart.innerHTML = svgBars;
      }

      // Risk Distribution Meters
      if (this.analyticsRiskDistList && t.analytics.riskBreakdown) {
        this.analyticsRiskDistList.innerHTML = '';
        t.analytics.riskBreakdown.forEach(item => {
          const row = document.createElement('div');
          row.className = 'risk-meter-row';
          row.innerHTML = `
            <div class="meter-label-row font-mono text-xs">
              <span class="font-bold">${item.category}</span>
              <span class="font-bold">${item.pct}%</span>
            </div>
            <div class="meter-bar-track">
              <div class="meter-bar-fill" style="width: ${item.pct}%; background: ${item.color};"></div>
            </div>
          `;
          this.analyticsRiskDistList.appendChild(row);
        });
      }

      // Metrics Strip
      if (this.analyticsMetricsStrip) {
        this.analyticsMetricsStrip.innerHTML = `
          <div class="metric-strip-item">
            <span class="font-mono text-xs text-muted">Average Advance Lead Time</span>
            <span class="font-mono text-xl font-bold text-amber">${t.analytics.avgLeadTimeDays} Days</span>
            <span class="text-xs text-muted">Weeks before threshold breach</span>
          </div>

          <div class="metric-strip-item">
            <span class="font-mono text-xs text-muted">Facility Operational Uptime</span>
            <span class="font-mono text-xl font-bold text-emerald">${t.analytics.campusUptimePct}</span>
            <span class="text-xs text-muted">Zero unplanned emergency shutdowns</span>
          </div>

          <div class="metric-strip-item">
            <span class="font-mono text-xs text-muted">Disruptions Averted</span>
            <span class="font-mono text-xl font-bold text-emerald">${t.analytics.emergencyDisruptionsAverted} Incidents</span>
            <span class="text-xs text-muted">Prevented in FY 2026</span>
          </div>

          <div class="metric-strip-item">
            <span class="font-mono text-xs text-muted">Regulatory Compliance Score</span>
            <span class="font-mono text-xl font-bold text-emerald">${t.analytics.complianceScore}</span>
            <span class="text-xs text-muted">Audited by domain regulatory boards</span>
          </div>
        `;
      }
    }

    /**
     * 7. RENDER AI ASSISTANT (Strictly Scoped per Organization)
     */
    renderAiAssistant(t) {
      if (!t.aiAssistant) return;

      if (this.aiCopilotIdentity) {
        this.aiCopilotIdentity.textContent = t.aiAssistant.workspaceIdentity;
      }

      // Suggested Prompt Buttons
      if (this.aiSuggestedPromptsRow) {
        this.aiSuggestedPromptsRow.innerHTML = '';
        t.aiAssistant.suggestedPrompts.forEach(prompt => {
          const btn = document.createElement('button');
          btn.className = 'prompt-chip-btn';
          btn.innerHTML = `<span>${prompt}</span> &rarr;`;
          btn.addEventListener('click', () => {
            this.handleAiQuery(prompt, t);
          });
          this.aiSuggestedPromptsRow.appendChild(btn);
        });
      }

      // Initial Chat Feed
      if (this.aiChatWindow) {
        this.aiChatWindow.innerHTML = `
          <div class="chat-message message-system">
            <div class="msg-avatar font-mono">SYS</div>
            <div class="msg-bubble">
              <div class="font-mono text-xs font-bold text-emerald mb-1">
                &#128274; TENANT ISOLATION ACTIVATED &bull; ${t.name.toUpperCase()} DATA STORE
              </div>
              <p class="text-sm">${t.aiAssistant.welcomeMessage}</p>
            </div>
          </div>
        `;
      }
    }

    /**
     * Process User or Suggested Prompt in Scoped AI Assistant
     */
    handleAiQuery(queryText, t) {
      if (!queryText || !this.aiChatWindow) return;

      // Append User Message
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-message message-user';
      userMsg.innerHTML = `
        <div class="msg-bubble">
          <p class="text-sm font-bold">${queryText}</p>
        </div>
      `;
      this.aiChatWindow.appendChild(userMsg);

      // Scroll to bottom
      this.aiChatWindow.scrollTop = this.aiChatWindow.scrollHeight;

      // Check Scoped Knowledge Base
      const kb = t.aiAssistant.knowledgeBaseAnswers || {};
      let answer = kb[queryText];

      // If not exact match, find closest or generate dynamically from tenant telemetry
      if (!answer) {
        const keys = Object.keys(kb);
        const matchKey = keys.find(k => queryText.toLowerCase().includes(k.substring(0, 15).toLowerCase()));
        if (matchKey) {
          answer = kb[matchKey];
        } else {
          // Dynamic tenant contextualized fallback (strictly within this tenant)
          answer = {
            headline: `Scoped Intelligence Query for ${t.name}`,
            text: `Analyzing active telemetry across ${t.kpis.totalMonitoredAssets} monitored assets and ${t.signals.length} weak signals in ${t.name}. Primary active priority remains '${t.alerts[0] ? t.alerts[0].title : 'All Systems Nominal'}' with lead time ${t.alerts[0] ? t.alerts[0].countdownLeadTime : 'N/A'}.`,
            kpiPills: [`Assets: ${t.kpis.totalMonitoredAssets}`, `Lead: ${t.kpis.meanLeadTimeDays}d`, `ROI: ${t.kpis.avertedDisruptionCost}`],
            referenceTag: `${t.name} Operational Database`
          };
        }
      }

      // Simulate Copilot Response with typing delay
      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message message-bot';

        let pillsHtml = '';
        if (answer.kpiPills) {
          pillsHtml = `<div class="msg-pills-row font-mono text-xs mt-2">` + 
            answer.kpiPills.map(p => `<span class="bot-kpi-pill">${p}</span>`).join('') + 
            `</div>`;
        }

        botMsg.innerHTML = `
          <div class="msg-avatar font-mono">${t.name.substring(0, 2).toUpperCase()}</div>
          <div class="msg-bubble">
            <h4 class="bot-headline font-bold text-sm">${answer.headline}</h4>
            <p class="text-sm mt-1">${answer.text}</p>
            ${pillsHtml}
            <div class="msg-ref-tag font-mono text-xs text-muted mt-2">
              <span>[Verified Citation: ${answer.referenceTag}]</span>
            </div>
          </div>
        `;

        this.aiChatWindow.appendChild(botMsg);
        this.aiChatWindow.scrollTop = this.aiChatWindow.scrollHeight;
      }, 350);
    }

    /**
     * Render the Organization Directory Modal
     */
    renderOrgDirectoryModal() {
      if (!this.orgDirectoryGrid) return;
      this.orgDirectoryGrid.innerHTML = '';

      Object.values(this.data.tenants).forEach(org => {
        const card = document.createElement('div');
        const isActive = org.id === this.currentTenantId;
        card.className = `org-directory-card ${isActive ? 'card-active-tenant' : ''}`;

        card.innerHTML = `
          <div class="org-dir-top">
            <div class="org-dir-icon" style="color: ${org.themeColor};">
              ${org.logoIconSvg}
            </div>
            <div class="org-dir-titles">
              <h3 class="org-dir-name">${org.name}</h3>
              <span class="org-dir-cat font-mono text-xs text-muted">${org.category}</span>
            </div>
            ${isActive ? '<span class="status-chip chip-verified font-mono text-xs">Current</span>' : ''}
          </div>

          <p class="org-dir-desc text-xs text-secondary mt-2">${org.shortDesc}</p>
          <div class="org-dir-loc font-mono text-xs text-muted mt-1">&#9678; ${org.location}</div>

          <div class="org-dir-metrics-grid font-mono text-xs mt-3">
            <div class="dir-metric-box">
              <span class="text-muted">Assets:</span>
              <span class="font-bold">${org.kpis.totalMonitoredAssets}</span>
            </div>
            <div class="dir-metric-box">
              <span class="text-muted">Signals:</span>
              <span class="font-bold text-vermilion">${org.signals.length}</span>
            </div>
            <div class="dir-metric-box">
              <span class="text-muted">Alerts:</span>
              <span class="font-bold text-amber">${org.alerts.length}</span>
            </div>
            <div class="dir-metric-box">
              <span class="text-muted">Teams:</span>
              <span class="font-bold">${org.teams.length}</span>
            </div>
          </div>

          <div class="org-dir-footer mt-3">
            <button class="btn-launch-workspace ${isActive ? 'btn-active-workspace' : ''}" data-org-id="${org.id}">
              ${isActive ? 'Active Workspace' : 'Launch Workspace &rarr;'}
            </button>
          </div>
        `;

        card.querySelector('.btn-launch-workspace').addEventListener('click', () => {
          this.switchTenant(org.id, true);
          this.closeOrgModal();
        });

        this.orgDirectoryGrid.appendChild(card);
      });
    }

    openOrgModal() {
      this.renderOrgDirectoryModal();
      if (this.orgSelectorModal) this.orgSelectorModal.style.display = 'flex';
    }

    closeOrgModal() {
      if (this.orgSelectorModal) this.orgSelectorModal.style.display = 'none';
    }

    showToast(message) {
      if (!this.toastContainer) return;
      const toast = document.createElement('div');
      toast.className = 'action-toast-item visible';
      toast.innerHTML = `
        <span class="toast-indicator"></span>
        <span>${message}</span>
      `;
      this.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
      }, 3400);
    }

    bindEvents() {
      // Open Modal Buttons
      if (this.btnOpenOrgSelector) {
        this.btnOpenOrgSelector.addEventListener('click', () => this.openOrgModal());
      }
      if (this.btnHeaderSwitchWorkspace) {
        this.btnHeaderSwitchWorkspace.addEventListener('click', () => this.openOrgModal());
      }

      // Close Modal Buttons
      if (this.btnOrgModalClose) {
        this.btnOrgModalClose.addEventListener('click', () => this.closeOrgModal());
      }
      if (this.btnDismissOrgModal) {
        this.btnDismissOrgModal.addEventListener('click', () => this.closeOrgModal());
      }
      if (this.orgSelectorModal) {
        this.orgSelectorModal.addEventListener('click', (e) => {
          if (e.target === this.orgSelectorModal) this.closeOrgModal();
        });
      }

      // 7 Module Tabs Navigation
      const tabs = document.querySelectorAll('.workspace-module-tabs .module-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          const tabName = tab.dataset.tab;
          this.currentTab = tabName;

          // Hide all panels, show target panel
          const panels = document.querySelectorAll('.workspace-tab-panel');
          panels.forEach(p => p.style.display = 'none');

          const targetPanel = document.getElementById(`panel-${tabName}`);
          if (targetPanel) targetPanel.style.display = 'block';
        });
      });

      // Signals Filter Pills
      const modalityFilters = document.querySelectorAll('#signalsModalityFilters .filter-pill');
      modalityFilters.forEach(pill => {
        pill.addEventListener('click', () => {
          modalityFilters.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.signalsModalityFilter = pill.dataset.modality;
          const t = this.data.tenants[this.currentTenantId];
          this.renderSignals(t);
        });
      });

      // Signals Search
      if (this.signalsSearchInput) {
        this.signalsSearchInput.addEventListener('input', (e) => {
          this.signalsSearchQuery = e.target.value.trim();
          const t = this.data.tenants[this.currentTenantId];
          this.renderSignals(t);
        });
      }

      // Reports Search
      if (this.reportsSearchInput) {
        this.reportsSearchInput.addEventListener('input', (e) => {
          this.reportsSearchQuery = e.target.value.trim();
          const t = this.data.tenants[this.currentTenantId];
          this.renderReports(t);
        });
      }

      // AI Chat Input & Send
      if (this.btnAiChatSend && this.aiChatInput) {
        const sendAction = () => {
          const text = this.aiChatInput.value.trim();
          if (text) {
            this.aiChatInput.value = '';
            const t = this.data.tenants[this.currentTenantId];
            this.handleAiQuery(text, t);
          }
        };

        this.btnAiChatSend.addEventListener('click', sendAction);
        this.aiChatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') sendAction();
        });
      }

      // Export Reports
      if (this.btnExportAllReports) {
        this.btnExportAllReports.addEventListener('click', () => {
          const t = this.data.tenants[this.currentTenantId];
          this.showToast(`Exported all compliance & incident reports for ${t.name} (ZIP).`);
        });
      }
    }
  }

  // Export to window
  window.workspaceController = new MultiOrgWorkspaceController(window.MULTI_ORG_DATA);

})();
