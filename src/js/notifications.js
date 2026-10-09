/**
 * EarlySight — Notifications & System Health Controller (Milestone 10)
 *
 * Implements the operational monitoring console:
 * - Alert filtering, searching, and read/unread state management
 * - Interactive slide-out notification inspector drawer with cross-page deep links
 * - System health component monitoring & latency metrics
 * - Data source connectivity & records today
 * - Intelligence pipeline stages & processing timestamps
 * - Data freshness SLA tracking
 * - Priority segmentation bar & interactive filter dispatch
 * - Interactive frontend-only Demo State switcher (Operational, Attention, Degraded)
 */

import {
  HEALTH_METRICS,
  DEMO_SYSTEM_STATES,
  SYSTEM_COMPONENTS,
  DATA_SOURCES,
  ALERT_PRIORITIES,
  DATA_FRESHNESS,
  PIPELINE_STAGES,
  SYSTEM_EVENTS,
  NOTIFICATIONS_DATA
} from '../data/notifications-data.js';

class NotificationsController {
  constructor() {
    this.notifications = JSON.parse(JSON.stringify(NOTIFICATIONS_DATA));
    this.components = JSON.parse(JSON.stringify(SYSTEM_COMPONENTS));
    this.dataSources = JSON.parse(JSON.stringify(DATA_SOURCES));
    this.freshness = JSON.parse(JSON.stringify(DATA_FRESHNESS));
    this.pipeline = JSON.parse(JSON.stringify(PIPELINE_STAGES));
    this.events = JSON.parse(JSON.stringify(SYSTEM_EVENTS));

    this.currentDemoState = 'operational';
    this.activeCategory = 'All';
    this.unreadOnly = false;
    this.searchQuery = '';
    this.filterSeverity = 'All';
    this.filterLocation = 'All';
    this.filterTime = 'All';

    this.selectedNotificationId = null;

    this.init();
  }

  init() {
    this.parseUrlParameters();
    
    // Sync category filter tabs if preset by URL
    if (this.activeCategory) {
      document.querySelectorAll('.notif-filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === this.activeCategory);
      });
    }

    this.renderHealthSummary();
    this.renderSystemComponents();
    this.renderDataSources();
    this.renderPipelineStages();
    this.renderDataFreshness();
    this.renderSystemEvents();
    this.renderPriorityBar();
    this.renderNotificationsList();
    this.bindEvents();

    if (this.selectedNotificationId) {
      this.openInspector(this.selectedNotificationId);
    }
  }

  parseUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('notifId')) {
      this.selectedNotificationId = params.get('notifId');
    }
    if (params.has('category')) {
      const cat = params.get('category').toLowerCase();
      const match = ['critical', 'risk', 'action', 'evidence', 'system', 'resolved'].find(c => c === cat);
      if (match) {
        this.activeCategory = match.charAt(0).toUpperCase() + match.slice(1);
      }
    }
    if (params.has('severity')) {
      const sev = params.get('severity').toLowerCase();
      const match = ['critical', 'high', 'medium', 'low', 'resolved'].find(s => s === sev);
      if (match) {
        this.filterSeverity = match.charAt(0).toUpperCase() + match.slice(1);
      }
    }
    if (params.has('unread') && params.get('unread') === 'true') {
      this.unreadOnly = true;
    }
  }

  /* ----------------------------------------------------
   * SECTION 2: HEALTH SUMMARY & METRICS
   * ---------------------------------------------------- */
  renderHealthSummary() {
    const stateData = DEMO_SYSTEM_STATES[this.currentDemoState] || DEMO_SYSTEM_STATES.operational;

    const badgeEl = document.getElementById('headerStatusBadge');
    if (badgeEl) {
      badgeEl.textContent = stateData.statusBadge;
      badgeEl.className = `badge-status-pill ${stateData.badgeClass}`;
    }

    const overallVal = document.getElementById('metricOverallHealthVal');
    const overallSub = document.getElementById('metricOverallHealthSub');
    if (overallVal) overallVal.textContent = stateData.overallHealth;
    if (overallSub) overallSub.textContent = stateData.overallStatus;

    const sourcesVal = document.getElementById('metricDataSourcesVal');
    const sourcesSub = document.getElementById('metricDataSourcesSub');
    if (sourcesVal) sourcesVal.textContent = stateData.dataSources;
    if (sourcesSub) sourcesSub.textContent = stateData.sourcesStatus;

    const pipelineVal = document.getElementById('metricPipelineVal');
    const pipelineSub = document.getElementById('metricPipelineSub');
    if (pipelineVal) pipelineVal.textContent = stateData.pipelineHealth;
    if (pipelineSub) pipelineSub.textContent = stateData.pipelineStatus;

    const freshnessVal = document.getElementById('metricFreshnessVal');
    const freshnessSub = document.getElementById('metricFreshnessSub');
    if (freshnessVal) freshnessVal.textContent = stateData.dataFreshness;
    if (freshnessSub) freshnessSub.textContent = stateData.freshnessStatus;

    const unreadCount = this.notifications.filter(n => n.unread).length;
    const alertsVal = document.getElementById('metricAlertsVal');
    const alertsSub = document.getElementById('metricAlertsSub');
    if (alertsVal) alertsVal.textContent = String(unreadCount).padStart(2, '0');
    if (alertsSub) alertsSub.textContent = unreadCount > 0 ? `${unreadCount} Unread` : 'All Reviewed';

    const syncVal = document.getElementById('metricSyncVal');
    const syncSub = document.getElementById('metricSyncSub');
    if (syncVal) syncVal.textContent = stateData.lastSync;
    if (syncSub) syncSub.textContent = stateData.name === 'Degraded' ? 'Delayed' : 'Healthy';
  }

  /* ----------------------------------------------------
   * SECTION 3: SYSTEM COMPONENTS
   * ---------------------------------------------------- */
  renderSystemComponents() {
    const container = document.getElementById('systemComponentsGrid');
    if (!container) return;

    let html = '';
    this.components.forEach(comp => {
      let status = comp.status;
      let statusClass = comp.statusClass;
      let latency = comp.latency;

      if (this.currentDemoState === 'attention' && (comp.id === 'comp-evidence' || comp.id === 'comp-ingestion')) {
        status = 'Attention';
        statusClass = 'status-attention';
        latency = parseInt(latency) + 140 + ' ms';
      } else if (this.currentDemoState === 'degraded' && (comp.id === 'comp-evidence' || comp.id === 'comp-risk' || comp.id === 'comp-ingestion')) {
        status = 'Degraded';
        statusClass = 'status-degraded';
        latency = parseInt(latency) + 380 + ' ms';
      }

      html += `
        <div class="system-component-card ${statusClass}" data-comp-id="${comp.id}">
          <div class="comp-card-header">
            <div class="comp-title-group">
              <span class="comp-name font-bold">${comp.name}</span>
              <span class="comp-category font-mono text-muted text-xs">${comp.category}</span>
            </div>
            <span class="comp-status-pill font-mono ${statusClass}">
              <span class="status-indicator-dot"></span>
              <span>${status}</span>
            </span>
          </div>
          <div class="comp-metrics-row font-mono text-xs">
            <span class="comp-metric-item">
              <span class="metric-label text-muted">Update:</span>
              <span class="metric-val font-bold">${comp.lastUpdate}</span>
            </span>
            <span class="comp-metric-item">
              <span class="metric-label text-muted">Latency:</span>
              <span class="metric-val font-bold">${latency}</span>
            </span>
            <span class="comp-metric-item">
              <span class="metric-label text-muted">Load:</span>
              <span class="metric-val font-bold">${comp.throughput}</span>
            </span>
          </div>
          <div class="comp-card-desc text-xs text-muted">
            ${comp.stateDesc}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ----------------------------------------------------
   * SECTION 4: DATA SOURCE HEALTH
   * ---------------------------------------------------- */
  renderDataSources() {
    const container = document.getElementById('dataSourcesList');
    if (!container) return;

    let html = '';
    this.dataSources.forEach(src => {
      let status = src.status;
      let statusClass = src.statusClass;
      let freshness = src.freshness;

      if (this.currentDemoState === 'attention' && src.id === 'src-image') {
        status = 'Delayed';
        statusClass = 'status-attention';
        freshness = '84%';
      } else if (this.currentDemoState === 'degraded' && (src.id === 'src-image' || src.id === 'src-document')) {
        status = 'Stale';
        statusClass = 'status-degraded';
        freshness = '71%';
      }

      html += `
        <div class="data-source-row ${statusClass}" data-src-id="${src.id}">
          <div class="source-info-col">
            <div class="source-name-wrap">
              <span class="source-name font-bold">${src.source}</span>
              <span class="source-badge font-mono text-xs text-muted">${src.category}</span>
            </div>
            <span class="source-details text-xs text-muted">${src.details}</span>
          </div>

          <div class="source-status-col">
            <span class="source-status-badge font-mono text-xs ${statusClass}">
              <span class="status-indicator-dot"></span>
              <span>${status}</span>
            </span>
            <span class="source-protocol font-mono text-xs text-muted">${src.protocol}</span>
          </div>

          <div class="source-telemetry-col font-mono text-xs">
            <div class="telemetry-item">
              <span class="text-muted">Last Sync:</span>
              <span class="font-bold">${src.lastSync}</span>
            </div>
            <div class="telemetry-item">
              <span class="text-muted">Records:</span>
              <span class="font-bold">${src.recordsToday}</span>
            </div>
            <div class="telemetry-item">
              <span class="text-muted">Freshness:</span>
              <span class="font-bold ${freshness === '100%' ? 'text-healthy' : ''}">${freshness}</span>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ----------------------------------------------------
   * SECTION 7: ALERT PRIORITY BAR
   * ---------------------------------------------------- */
  renderPriorityBar() {
    const counts = {
      Critical: this.notifications.filter(n => n.severity === 'Critical').length,
      High: this.notifications.filter(n => n.severity === 'High').length,
      Medium: this.notifications.filter(n => n.severity === 'Medium').length,
      Low: this.notifications.filter(n => n.severity === 'Low').length,
      Resolved: this.notifications.filter(n => n.severity === 'Resolved').length
    };

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

    const barEl = document.getElementById('alertPriorityBar');
    if (barEl) {
      barEl.innerHTML = `
        <button type="button" class="priority-segment segment-critical ${this.filterSeverity === 'Critical' ? 'active-segment' : ''}" style="width: ${(counts.Critical / total) * 100}%;" title="Critical: ${counts.Critical}" data-sev="Critical"></button>
        <button type="button" class="priority-segment segment-high ${this.filterSeverity === 'High' ? 'active-segment' : ''}" style="width: ${(counts.High / total) * 100}%;" title="High: ${counts.High}" data-sev="High"></button>
        <button type="button" class="priority-segment segment-medium ${this.filterSeverity === 'Medium' ? 'active-segment' : ''}" style="width: ${(counts.Medium / total) * 100}%;" title="Medium: ${counts.Medium}" data-sev="Medium"></button>
        <button type="button" class="priority-segment segment-low ${this.filterSeverity === 'Low' ? 'active-segment' : ''}" style="width: ${(counts.Low / total) * 100}%;" title="Low: ${counts.Low}" data-sev="Low"></button>
        <button type="button" class="priority-segment segment-resolved ${this.filterSeverity === 'Resolved' ? 'active-segment' : ''}" style="width: ${(counts.Resolved / total) * 100}%;" title="Resolved: ${counts.Resolved}" data-sev="Resolved"></button>
      `;

      barEl.querySelectorAll('.priority-segment').forEach(seg => {
        seg.addEventListener('click', () => {
          const sev = seg.dataset.sev;
          if (this.filterSeverity === sev) {
            this.filterSeverity = 'All';
          } else {
            this.filterSeverity = sev;
          }
          const sevSelect = document.getElementById('filterSeveritySelect');
          if (sevSelect) sevSelect.value = this.filterSeverity;
          this.renderPriorityBar();
          this.renderNotificationsList();
        });
      });
    }

    const countsRow = document.getElementById('priorityCountsRow');
    if (countsRow) {
      countsRow.innerHTML = `
        <button type="button" class="priority-count-btn ${this.filterSeverity === 'Critical' ? 'active' : ''}" data-sev="Critical">
          <span class="priority-dot dot-critical"></span>
          <span class="priority-name font-mono">Critical</span>
          <span class="priority-val font-mono font-bold">${String(counts.Critical).padStart(2, '0')}</span>
        </button>
        <button type="button" class="priority-count-btn ${this.filterSeverity === 'High' ? 'active' : ''}" data-sev="High">
          <span class="priority-dot dot-high"></span>
          <span class="priority-name font-mono">High</span>
          <span class="priority-val font-mono font-bold">${String(counts.High).padStart(2, '0')}</span>
        </button>
        <button type="button" class="priority-count-btn ${this.filterSeverity === 'Medium' ? 'active' : ''}" data-sev="Medium">
          <span class="priority-dot dot-medium"></span>
          <span class="priority-name font-mono">Medium</span>
          <span class="priority-val font-mono font-bold">${String(counts.Medium).padStart(2, '0')}</span>
        </button>
        <button type="button" class="priority-count-btn ${this.filterSeverity === 'Low' ? 'active' : ''}" data-sev="Low">
          <span class="priority-dot dot-low"></span>
          <span class="priority-name font-mono">Low</span>
          <span class="priority-val font-mono font-bold">${String(counts.Low).padStart(2, '0')}</span>
        </button>
        <button type="button" class="priority-count-btn ${this.filterSeverity === 'Resolved' ? 'active' : ''}" data-sev="Resolved">
          <span class="priority-dot dot-resolved"></span>
          <span class="priority-name font-mono">Resolved</span>
          <span class="priority-val font-mono font-bold">${String(counts.Resolved).padStart(2, '0')}</span>
        </button>
      `;

      countsRow.querySelectorAll('.priority-count-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const sev = btn.dataset.sev;
          if (this.filterSeverity === sev) {
            this.filterSeverity = 'All';
          } else {
            this.filterSeverity = sev;
          }
          const sevSelect = document.getElementById('filterSeveritySelect');
          if (sevSelect) sevSelect.value = this.filterSeverity;
          this.renderPriorityBar();
          this.renderNotificationsList();
        });
      });
    }
  }

  /* ----------------------------------------------------
   * SECTION 8: DATA FRESHNESS
   * ---------------------------------------------------- */
  renderDataFreshness() {
    const container = document.getElementById('dataFreshnessGrid');
    if (!container) return;

    let html = '';
    this.freshness.forEach(item => {
      let status = item.status;
      let statusClass = item.statusClass;
      let val = item.freshness;

      if (this.currentDemoState === 'attention' && (item.domain === 'Evidence' || item.domain === 'Actions')) {
        status = 'Delayed';
        statusClass = 'status-attention';
        val = '88%';
      } else if (this.currentDemoState === 'degraded' && (item.domain === 'Evidence' || item.domain === 'Copilot Context' || item.domain === 'Actions')) {
        status = 'Stale';
        statusClass = 'status-degraded';
        val = '74%';
      }

      html += `
        <div class="freshness-item-card ${statusClass}">
          <div class="freshness-card-top">
            <span class="freshness-domain font-bold">${item.domain}</span>
            <span class="freshness-percent font-mono font-bold">${val}</span>
          </div>
          <div class="freshness-card-bottom font-mono text-xs">
            <span class="freshness-sync text-muted">${item.lastSync}</span>
            <span class="freshness-sla-tag ${statusClass}">${status}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ----------------------------------------------------
   * SECTION 9: PIPELINE HEALTH
   * ---------------------------------------------------- */
  renderPipelineStages() {
    const container = document.getElementById('pipelineStagesTrack');
    if (!container) return;

    let html = '';
    this.pipeline.forEach((stage, idx) => {
      let status = stage.status;
      let statusClass = stage.statusClass;

      if (this.currentDemoState === 'attention' && stage.name === 'EVIDENCE') {
        status = 'Attention';
        statusClass = 'status-attention';
      } else if (this.currentDemoState === 'degraded' && (stage.name === 'EVIDENCE' || stage.name === 'RISK')) {
        status = 'Degraded';
        statusClass = 'status-degraded';
      }

      html += `
        <div class="pipeline-node ${statusClass}" data-step="${stage.step}">
          <div class="pipeline-node-inner">
            <span class="pipeline-node-step font-mono text-xs text-muted">${stage.step}</span>
            <span class="pipeline-node-name font-bold font-mono">${stage.name}</span>
            <div class="pipeline-node-status font-mono text-xs">
              <span class="status-indicator-dot"></span>
              <span>${status}</span>
            </div>
            <span class="pipeline-node-time font-mono text-xs text-muted">${stage.lastProcessed}</span>
          </div>
        </div>
      `;

      if (idx < this.pipeline.length - 1) {
        html += `<div class="pipeline-connector-arrow" aria-hidden="true">&rarr;</div>`;
      }
    });

    container.innerHTML = html;
  }

  /* ----------------------------------------------------
   * SECTION 10: SYSTEM EVENTS
   * ---------------------------------------------------- */
  renderSystemEvents() {
    const container = document.getElementById('systemEventsList');
    if (!container) return;

    let html = '';
    this.events.forEach(evt => {
      html += `
        <div class="system-event-row">
          <div class="event-time-col font-mono text-muted text-xs">
            <span>${evt.time}</span>
          </div>
          <div class="event-indicator-col">
            <span class="event-timeline-dot"></span>
          </div>
          <div class="event-content-col">
            <div class="event-title-wrap">
              <span class="event-title font-bold">${evt.title}</span>
              <span class="event-badge font-mono text-xs">${evt.badge}</span>
            </div>
            <span class="event-details text-xs text-muted">${evt.details}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ----------------------------------------------------
   * SECTION 5 & 11: NOTIFICATION LIST & FILTERS
   * ---------------------------------------------------- */
  getFilteredNotifications() {
    const q = this.searchQuery.toLowerCase().trim();

    return this.notifications.filter(n => {
      // Category Tab filter
      if (this.activeCategory !== 'All' && n.category !== this.activeCategory) {
        return false;
      }

      // Unread only toggle
      if (this.unreadOnly && !n.unread) {
        return false;
      }

      // Severity dropdown/bar filter
      if (this.filterSeverity !== 'All' && n.severity !== this.filterSeverity) {
        return false;
      }

      // Location filter
      if (this.filterLocation !== 'All') {
        if (!n.location.toLowerCase().includes(this.filterLocation.toLowerCase())) {
          return false;
        }
      }

      // Time filter
      if (this.filterTime !== 'All') {
        if (n.timeFilter !== this.filterTime) {
          return false;
        }
      }

      // Keyword search
      if (q) {
        const text = `${n.id} ${n.title} ${n.explanation} ${n.location} ${n.relatedEntity} ${n.category} ${n.severity}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }

  renderNotificationsList() {
    const container = document.getElementById('notificationsList');
    const countEl = document.getElementById('notifFilteredCount');
    const unreadPill = document.getElementById('notifUnreadBadge');
    if (!container) return;

    const filtered = this.getFilteredNotifications();
    const totalCount = this.notifications.length;
    const unreadCount = this.notifications.filter(n => n.unread).length;

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${totalCount} notifications`;
    }
    if (unreadPill) {
      unreadPill.textContent = `${unreadCount} Unread`;
      unreadPill.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
    }

    // Sync with topbar badge if present
    const topbarBadge = document.getElementById('notifBadgeCount');
    if (topbarBadge) {
      topbarBadge.textContent = unreadCount;
      topbarBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-notifications-card font-mono text-center p-8">
          <div class="empty-icon text-muted text-2xl mb-2">&empty;</div>
          <div class="empty-title font-bold text-foreground">No matching operational notifications found</div>
          <p class="empty-desc text-xs text-muted mt-1">Adjust search keywords or reset active filters to view all telemetry alerts.</p>
          <button type="button" class="btn-reset-filters mt-4" id="btnEmptyReset">Reset Filters</button>
        </div>
      `;
      const btnEmptyReset = document.getElementById('btnEmptyReset');
      if (btnEmptyReset) {
        btnEmptyReset.addEventListener('click', () => this.resetFilters());
      }
      return;
    }

    let html = '';
    filtered.forEach(n => {
      const isSelected = this.selectedNotificationId === n.id;
      const sevClass = `sev-${n.severity.toLowerCase()}`;
      const unreadClass = n.unread ? 'is-unread' : 'is-read';

      html += `
        <article class="notification-item-row ${sevClass} ${unreadClass} ${isSelected ? 'is-selected' : ''}" 
                 data-notif-id="${n.id}"
                 tabindex="0"
                 role="button"
                 aria-label="${n.severity} alert: ${n.title}">
          <div class="notif-row-left">
            <span class="notif-unread-dot" title="${n.unread ? 'Unread alert' : 'Read'}"></span>
            <span class="notif-severity-pill font-mono ${sevClass}">${n.severity}</span>
            <span class="notif-category-pill font-mono">${n.category}</span>
          </div>

          <div class="notif-row-main">
            <div class="notif-title-wrap">
              <h3 class="notif-title font-bold">${n.title}</h3>
              <span class="notif-entity-badge font-mono">${n.relatedEntity}</span>
            </div>
            <p class="notif-explanation text-xs text-muted">${n.explanation}</p>
            <div class="notif-meta-row font-mono text-xs text-muted">
              <span class="notif-location">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${n.location}</span>
              </span>
              <span class="notif-time">&bull; ${n.timestamp}</span>
              <span class="notif-exact font-mono text-muted text-xs">(${n.exactTime})</span>
            </div>
          </div>

          <div class="notif-row-right">
            <button type="button" 
                    class="btn-toggle-read font-mono text-xs" 
                    data-action="toggle-read" 
                    data-notif-id="${n.id}"
                    title="${n.unread ? 'Mark as read' : 'Mark as unread'}">
              ${n.unread ? 'Mark Read' : 'Unread'}
            </button>
            <span class="notif-row-arrow font-mono text-muted">&rarr;</span>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;

    // Attach click listeners to rows & toggle buttons
    container.querySelectorAll('.notification-item-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="toggle-read"]')) return;
        const notifId = row.dataset.notifId;
        this.openInspector(notifId);
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const notifId = row.dataset.notifId;
          this.openInspector(notifId);
        }
      });
    });

    container.querySelectorAll('[data-action="toggle-read"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const notifId = btn.dataset.notifId;
        this.toggleReadState(notifId);
      });
    });
  }

  /* ----------------------------------------------------
   * SECTION 6: NOTIFICATION DETAIL INSPECTOR DRAWER
   * ---------------------------------------------------- */
  openInspector(notifId) {
    const notif = this.notifications.find(n => n.id === notifId);
    if (!notif) return;

    this.selectedNotificationId = notifId;
    this.renderNotificationsList();

    const drawer = document.getElementById('notifDetailDrawer');
    const backdrop = document.getElementById('notifDrawerBackdrop');
    if (!drawer) return;

    // Auto mark as read on open
    if (notif.unread) {
      notif.unread = false;
      this.renderNotificationsList();
      this.renderHealthSummary();
    }

    // Populate drawer elements
    document.getElementById('inspCategory').textContent = notif.category;
    document.getElementById('inspSeverity').textContent = notif.severity;
    document.getElementById('inspSeverity').className = `insp-badge font-mono sev-${notif.severity.toLowerCase()}`;
    document.getElementById('inspTimestamp').textContent = `${notif.timestamp} (${notif.exactTime})`;
    document.getElementById('inspLocation').textContent = notif.location;
    document.getElementById('inspEntity').textContent = notif.relatedEntity;
    document.getElementById('inspTitle').textContent = notif.title;

    document.getElementById('inspWhatHappened').textContent = notif.event.whatHappened;
    document.getElementById('inspWhyItMatters').textContent = notif.event.whyItMatters;
    document.getElementById('inspRecommendation').textContent = notif.event.recommendedNextStep;

    const intel = notif.event.relatedIntelligence;
    document.getElementById('inspSignalId').textContent = intel.signalId;
    document.getElementById('inspPatternId').textContent = intel.patternId;
    document.getElementById('inspRiskId').textContent = intel.riskId;
    document.getElementById('inspEvidenceId').textContent = intel.evidenceId;
    document.getElementById('inspActionId').textContent = intel.actionId;

    // Deep links
    const linkSig = document.getElementById('inspLinkSignal');
    if (linkSig) linkSig.href = `signals.html?signalId=${intel.signalId}&zone=${intel.zone}`;

    const linkRisk = document.getElementById('inspLinkRisk');
    if (linkRisk) linkRisk.href = `risks.html?riskId=${intel.riskId}`;

    const linkEvd = document.getElementById('inspLinkEvidence');
    if (linkEvd) linkEvd.href = `evidence.html?riskId=${intel.riskId}&evidenceId=${intel.evidenceId}`;

    const linkAct = document.getElementById('inspLinkAction');
    if (linkAct) linkAct.href = `actions.html?actionId=${intel.actionId}`;

    const linkTime = document.getElementById('inspLinkTimeline');
    if (linkTime) linkTime.href = `timeline.html?zone=${intel.zone}&case=0`;

    const linkMap = document.getElementById('inspLinkMap');
    if (linkMap) linkMap.href = `map.html?zone=${intel.zone}`;

    // Read toggle inside drawer
    const btnToggle = document.getElementById('inspBtnToggleRead');
    if (btnToggle) {
      btnToggle.textContent = notif.unread ? 'Mark as Read' : 'Mark as Unread';
      btnToggle.onclick = () => {
        this.toggleReadState(notif.id);
        btnToggle.textContent = notif.unread ? 'Mark as Read' : 'Mark as Unread';
      };
    }

    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.classList.add('notif-drawer-open');
  }

  closeInspector() {
    const drawer = document.getElementById('notifDetailDrawer');
    const backdrop = document.getElementById('notifDrawerBackdrop');
    if (drawer) {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.classList.remove('notif-drawer-open');
    this.selectedNotificationId = null;
    this.renderNotificationsList();
  }

  toggleReadState(notifId) {
    const notif = this.notifications.find(n => n.id === notifId);
    if (!notif) return;
    notif.unread = !notif.unread;
    this.renderNotificationsList();
    this.renderHealthSummary();
    this.showToast(`Alert ${notif.id} marked as ${notif.unread ? 'unread' : 'read'}.`);
  }

  markAllAsRead() {
    this.notifications.forEach(n => { n.unread = false; });
    this.renderNotificationsList();
    this.renderHealthSummary();
    this.showToast('All operational alerts marked as read.');
  }

  resetFilters() {
    this.activeCategory = 'All';
    this.unreadOnly = false;
    this.searchQuery = '';
    this.filterSeverity = 'All';
    this.filterLocation = 'All';
    this.filterTime = 'All';

    const searchInput = document.getElementById('notifSearchInput');
    if (searchInput) searchInput.value = '';

    const unreadChk = document.getElementById('chkUnreadOnly');
    if (unreadChk) unreadChk.checked = false;

    const sevSelect = document.getElementById('filterSeveritySelect');
    if (sevSelect) sevSelect.value = 'All';

    const locSelect = document.getElementById('filterLocationSelect');
    if (locSelect) locSelect.value = 'All';

    const timeSelect = document.getElementById('filterTimeSelect');
    if (timeSelect) timeSelect.value = 'All';

    document.querySelectorAll('.notif-filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === 'All');
    });

    this.renderPriorityBar();
    this.renderNotificationsList();
    this.showToast('Notification filters reset to default.');
  }

  /* ----------------------------------------------------
   * SECTION 13: DEMO STATE SWITCHER
   * ---------------------------------------------------- */
  switchDemoState(stateKey) {
    if (!DEMO_SYSTEM_STATES[stateKey]) return;
    this.currentDemoState = stateKey;

    document.querySelectorAll('.demo-state-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.state === stateKey);
    });

    this.renderHealthSummary();
    this.renderSystemComponents();
    this.renderDataSources();
    this.renderPipelineStages();
    this.renderDataFreshness();

    const stateObj = DEMO_SYSTEM_STATES[stateKey];
    this.showToast(`Simulated demo state set to: ${stateObj.name}.`);
  }

  /* ----------------------------------------------------
   * EVENT BINDINGS
   * ---------------------------------------------------- */
  bindEvents() {
    // Category Tabs
    document.querySelectorAll('.notif-filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.notif-filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeCategory = tab.dataset.category;
        this.renderNotificationsList();
      });
    });

    // Unread Only Checkbox
    const chkUnread = document.getElementById('chkUnreadOnly');
    if (chkUnread) {
      chkUnread.checked = this.unreadOnly;
      chkUnread.addEventListener('change', (e) => {
        this.unreadOnly = e.target.checked;
        this.renderNotificationsList();
      });
    }

    // Mark All As Read Button
    const btnMarkAll = document.getElementById('btnMarkAllAsRead');
    if (btnMarkAll) {
      btnMarkAll.addEventListener('click', () => this.markAllAsRead());
    }

    // Search Input
    const searchInput = document.getElementById('notifSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderNotificationsList();
      });
    }

    // Secondary Filters
    const sevSelect = document.getElementById('filterSeveritySelect');
    if (sevSelect) {
      sevSelect.value = this.filterSeverity;
      sevSelect.addEventListener('change', (e) => {
        this.filterSeverity = e.target.value;
        this.renderPriorityBar();
        this.renderNotificationsList();
      });
    }

    const locSelect = document.getElementById('filterLocationSelect');
    if (locSelect) {
      locSelect.value = this.filterLocation;
      locSelect.addEventListener('change', (e) => {
        this.filterLocation = e.target.value;
        this.renderNotificationsList();
      });
    }

    const timeSelect = document.getElementById('filterTimeSelect');
    if (timeSelect) {
      timeSelect.value = this.filterTime;
      timeSelect.addEventListener('change', (e) => {
        this.filterTime = e.target.value;
        this.renderNotificationsList();
      });
    }

    // Reset Filters Button
    const btnReset = document.getElementById('btnResetFilters');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.resetFilters());
    }

    // Drawer Controls
    const btnCloseDrawer = document.getElementById('btnCloseDrawer');
    if (btnCloseDrawer) {
      btnCloseDrawer.addEventListener('click', () => this.closeInspector());
    }

    const backdrop = document.getElementById('notifDrawerBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeInspector());
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeInspector();
      }
    });

    // Demo State Buttons
    document.querySelectorAll('.demo-state-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const state = btn.dataset.state;
        this.switchDemoState(state);
      });
    });
  }

  showToast(msg) {
    if (window.globalNavEngine && typeof window.globalNavEngine.showToast === 'function') {
      window.globalNavEngine.showToast(msg);
      return;
    }

    let container = document.querySelector('.action-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'action-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'action-toast-item visible';
    toast.innerHTML = `<span class="toast-indicator"></span><span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.notificationsController = new NotificationsController();
});
