/**
 * EarlySight — Global Navigation & Universal UI System (Stage 13)
 * 
 * Provides a unified, professional navigation sidebar and global controls:
 * - Sidebar:
 *   • EarlySight (Brand)
 *   • Overview (Dashboard)
 *   • Signals
 *   • Emerging Risks
 *   • Map (Interactive Signal Map)
 *   • Trends (Timeline & Lifecycle)
 *   • Evidence (Explainability Engine)
 *   • AI Assistant (Copilot)
 *   • Actions (Resolution Pipeline)
 *   • Resolution (Impact Monitoring)
 *   • Analytics (Lead-Time & ROI)
 *   • Settings (Configuration Modal)
 * - Organization Selector (Multi-Tenant Switcher: ABC College, City Hospital, Green Residency, Apex Industrial)
 * - User Profile (Marcus Vance • Lead Reliability Engineer)
 * - Notifications (Unread Count + Interactive Alert Flyout)
 * - Global Search (Cmd+K / Ctrl+K Command Palette)
 */

(function () {
  'use strict';

  // Available Organizations — Suitable for Colleges, Hospitals, Companies, Factories, Residential Communities & Public Utilities
  const ORGANIZATIONS = [
    { id: 'org-abc-college', code: 'TENANT-EDU-01', name: 'ABC College', category: 'Higher Education Campus (Colleges)', color: '#1B4332', icon: 'M22 10v6M2 10l10-5 10 5-10 5z' },
    { id: 'org-city-hospital', code: 'TENANT-MED-02', name: 'City Hospital', category: 'Tertiary Healthcare (Hospitals)', color: '#0D9488', icon: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' },
    { id: 'org-apex-industrial', code: 'TENANT-IND-04', name: 'Apex Industrial', category: 'Companies & Factories (Semiconductor Fab)', color: '#C85A32', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 'org-green-residency', code: 'TENANT-RES-03', name: 'Green Residency', category: 'Residential Communities (Smart High-Rise)', color: '#5E7E6C', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { id: 'org-metro-public', code: 'TENANT-PUB-05', name: 'Metro Municipal', category: 'Public Facilities & Water Infrastructure', color: '#B87333', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z' }
  ];

  // Searchable Items Registry
  const SEARCH_REGISTRY = [
    { title: 'Overview', category: 'Navigation', url: 'index.html#mainDashboardSection', desc: 'Main executive dashboard and telemetry ingress overview' },
    { title: 'Signals', category: 'Navigation', url: 'signals.html', desc: 'Multi-modal weak signals registry, multi-variable filters and precursor telemetry' },
    { title: 'Emerging Risks', category: 'Navigation', url: 'risks.html', desc: 'High-coherence synthesized hazards, risk levels (Low/Med/High/Critical) and alerts' },
    { title: 'Interactive Signal Map', category: 'Navigation', url: 'map.html', desc: 'Geospatial facility map with gradual cluster merging' },
    { title: 'Trends & Timeline', category: 'Navigation', url: 'timeline.html', desc: '7-step problem lifecycle and historical failure comparison' },
    { title: 'Evidence & Explainability', category: 'Navigation', url: 'evidence.html', desc: 'Causal explanation graph and 87% confidence breakdown' },
    { title: 'AI Operational Copilot', category: 'Navigation', url: 'copilot.html', desc: 'Industrial AI Assistant connected to cross-silo data' },
    { title: 'Action Center', category: 'Navigation', url: 'actions.html', desc: 'Closed-loop 6-stage operational resolution tracking' },
    { title: 'Resolution & Impact Monitoring', category: 'Navigation', url: 'impact.html', desc: 'Audited post-intervention signal decay and ROI proof' },
    { title: 'Multi-Org Workspaces', category: 'Navigation', url: 'workspace.html', desc: 'Air-gapped tenant workspaces across colleges, hospitals, factories & communities' },
    { title: 'Sub-Slab Pressurized Flange (Joint 4B-12)', category: 'Alert', url: 'evidence.html', desc: 'Alert EW-2026-088 • Block A Trench 4B • 14.2 Days Lead' },
    { title: 'OR Suite 04 Differential Pressure Dip', category: 'Alert', url: 'workspace.html', desc: 'City Hospital Clean Core • 7.8 Days Lead • High Hazard' },
    { title: 'Elevator #2 Traction Motor Vibration', category: 'Alert', url: 'workspace.html', desc: 'Green Residency Tower Alpha • 11.2 Days Lead • 28 Hz Flutter' },
    { title: 'Chemistry Lab Scrubber Guide Vane Hunting', category: 'Alert', url: 'workspace.html', desc: 'ABC College Science Wing B • 12.4 Days Lead' },
    { title: 'Aqueduct Intake Flange 12A Micro-Seepage', category: 'Alert', url: 'workspace.html', desc: 'Metro Municipal Trench 2 • 17.8 Days Lead • High Hazard' }
  ];

  class GlobalNavEngine {
    constructor() {
      this.activeTenantId = localStorage.getItem('earlysight_active_tenant') || 'org-abc-college';
      this.isCollapsed = localStorage.getItem('earlysight_sidebar_collapsed') === 'true';
      this.unreadNotificationsCount = 3;
      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.mount());
      } else {
        this.mount();
      }
    }

    getCurrentPageKey() {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('signals.html')) return 'signals';
      if (path.includes('risks.html')) return 'emergingRisks';
      if (path.includes('map.html')) return 'map';
      if (path.includes('timeline.html')) return 'trends';
      if (path.includes('evidence.html')) return 'evidence';
      if (path.includes('copilot.html')) return 'aiAssistant';
      if (path.includes('actions.html')) return 'actions';
      if (path.includes('impact.html')) return 'resolution';
      if (path.includes('workspace.html') || path.includes('organizations.html')) return 'workspace';
      
      // Hash-based check on index.html
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('signals')) return 'signals';
      if (hash.includes('emerging')) return 'emergingRisks';
      return 'overview';
    }

    getActiveOrg() {
      return ORGANIZATIONS.find(o => o.id === this.activeTenantId) || ORGANIZATIONS[0];
    }

    mount() {
      // Hide old static site-header if present to prevent visual duplication
      const legacyHeader = document.querySelector('.site-header');
      if (legacyHeader) {
        legacyHeader.style.display = 'none';
      }

      // Add wrapper class to body
      document.body.classList.add('has-global-nav');
      if (this.isCollapsed) {
        document.body.classList.add('sidebar-collapsed');
      }

      // Inject HTML DOM
      this.renderSidebar();
      this.renderTopbar();
      this.renderStoryRibbon();
      this.renderSearchModal();
      this.renderNotificationsPopover();
      this.renderSettingsModal();
      this.renderOrgDropdown();
      this.renderUserDropdown();

      // Bind all interactions
      this.bindEvents();

      // Ensure Stage 14 Micro-Interactions script is loaded
      if (!window.EarlySightMotion && !document.querySelector('script[src*="micro-interactions.js"]')) {
        const motionScript = document.createElement('script');
        motionScript.src = 'micro-interactions.js';
        document.body.appendChild(motionScript);
      }
    }

    renderSidebar() {
      const activeKey = this.getCurrentPageKey();
      const activeOrg = this.getActiveOrg();

      const sidebarHtml = `
        <aside class="global-sidebar" id="globalSidebar" aria-label="EarlySight Navigation">
          <!-- Sidebar Brand Header -->
          <div class="sidebar-brand-header">
            <a href="index.html" class="sidebar-brand-link">
              <div class="sidebar-brand-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" stroke="#1B4332" stroke-width="2" stroke-dasharray="3 3"/>
                  <circle cx="16" cy="16" r="8" stroke="#C85A32" stroke-width="1.8"/>
                  <circle cx="16" cy="16" r="3.5" fill="#C85A32"/>
                  <line x1="16" y1="16" x2="25" y2="9" stroke="#C85A32" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="sidebar-brand-text">
                <span class="brand-title-main">EarlySight</span>
                <span class="brand-tag-sub">EARLY WARNING AI</span>
              </div>
            </a>
            <button class="sidebar-toggle-btn" id="btnToggleSidebar" title="Toggle Sidebar (Collapse/Expand)" aria-label="Toggle Sidebar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </button>
            <button class="mobile-drawer-close-btn" id="btnMobileDrawerClose" title="Close Navigation Drawer" aria-label="Close Navigation Drawer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Embedded Organization Selector -->
          <div class="sidebar-org-box">
            <button class="sidebar-org-trigger" id="btnSidebarOrgTrigger" title="Switch Organization Workspace">
              <span class="sidebar-org-dot" style="background: ${activeOrg.color};"></span>
              <div class="sidebar-org-text">
                <span class="sidebar-org-label font-mono">ORGANIZATION</span>
                <span class="sidebar-org-name font-bold" id="sidebarOrgName">${activeOrg.name}</span>
              </div>
              <span class="sidebar-org-caret">&#9662;</span>
            </button>
          </div>

          <!-- Navigation Links List -->
          <nav class="sidebar-nav-container">
            <div class="nav-group-label font-mono">CORE INTELLIGENCE</div>
            <ul class="sidebar-nav-list">
              <li>
                <a href="index.html#mainDashboardSection" class="sidebar-nav-item ${activeKey === 'overview' ? 'active' : ''}" data-nav="overview">
                  <span class="nav-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  </span>
                  <span class="nav-item-text">Overview</span>
                </a>
              </li>
              <li>
                <a href="signals.html" class="sidebar-nav-item ${activeKey === 'signals' ? 'active' : ''}" data-nav="signals">
                  <span class="nav-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>
                  </span>
                  <span class="nav-item-text">Signals</span>
                  <span class="nav-badge-pill font-mono">128</span>
                </a>
              </li>
              <li>
                <a href="risks.html" class="sidebar-nav-item ${activeKey === 'emergingRisks' ? 'active' : ''}" data-nav="emergingRisks">
                  <span class="nav-item-icon text-vermilion">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </span>
                  <span class="nav-item-text">Emerging Risks</span>
                  <span class="nav-badge-pill badge-vermilion font-mono">07 Active</span>
                </a>
              </li>
              <li>
                <a href="map.html" class="sidebar-nav-item ${activeKey === 'map' ? 'active' : ''}" data-nav="map">
                  <span class="nav-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                  </span>
                  <span class="nav-item-text">Map</span>
                </a>
              </li>
              <li>
                <a href="timeline.html" class="sidebar-nav-item ${activeKey === 'trends' ? 'active' : ''}" data-nav="trends">
                  <span class="nav-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                  </span>
                  <span class="nav-item-text">Trends</span>
                </a>
              </li>
              <li>
                <a href="evidence.html" class="sidebar-nav-item ${activeKey === 'evidence' ? 'active' : ''}" data-nav="evidence">
                  <span class="nav-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </span>
                  <span class="nav-item-text">Evidence</span>
                  <span class="nav-badge-pill badge-conf font-mono">87%</span>
                </a>
              </li>
            </ul>

            <div class="nav-group-label font-mono">OPERATIONAL ACTION</div>
            <ul class="sidebar-nav-list">
              <li>
                <a href="copilot.html" class="sidebar-nav-item ${activeKey === 'aiAssistant' ? 'active' : ''}" data-nav="aiAssistant">
                  <span class="nav-item-icon text-teal">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
                  </span>
                  <span class="nav-item-text">AI Assistant</span>
                  <span class="nav-badge-pill badge-teal font-mono">Online</span>
                </a>
              </li>
              <li>
                <a href="actions.html" class="sidebar-nav-item ${activeKey === 'actions' ? 'active' : ''}" data-nav="actions">
                  <span class="nav-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="m9 14 2 2 4-4"></path></svg>
                  </span>
                  <span class="nav-item-text">Actions</span>
                </a>
              </li>
              <li>
                <a href="impact.html" class="sidebar-nav-item ${activeKey === 'resolution' ? 'active' : ''}" data-nav="resolution">
                  <span class="nav-item-icon text-emerald">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                  </span>
                  <span class="nav-item-text">Resolution</span>
                  <span class="nav-badge-pill badge-emerald font-mono">-95%</span>
                </a>
              </li>
              <li>
                <a href="workspace.html" class="sidebar-nav-item ${activeKey === 'workspace' ? 'active' : ''}" data-nav="analytics">
                  <span class="nav-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                  </span>
                  <span class="nav-item-text">Analytics</span>
                </a>
              </li>
            </ul>

            <div class="nav-group-label font-mono">SYSTEM</div>
            <ul class="sidebar-nav-list">
              <li>
                <button class="sidebar-nav-item btn-nav-settings" id="btnSidebarSettings">
                  <span class="nav-item-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  </span>
                  <span class="nav-item-text">Settings</span>
                </button>
              </li>
            </ul>
          </nav>

          <!-- Sidebar Footer: User Profile Card -->
          <div class="sidebar-user-footer">
            <button class="sidebar-user-card" id="btnSidebarUser" title="User Account & Preferences">
              <div class="user-avatar-wrap">
                <div class="user-avatar-initials">MV</div>
                <span class="user-status-dot"></span>
              </div>
              <div class="user-info-text">
                <span class="user-name-title">Marcus Vance</span>
                <span class="user-role-sub">Lead Reliability Engineer</span>
              </div>
              <span class="user-card-dots">&bull;&bull;&bull;</span>
            </button>
          </div>
        </aside>

        <!-- Mobile Navigation Drawer Backdrop -->
        <div class="mobile-sidebar-backdrop" id="mobileSidebarBackdrop" aria-hidden="true"></div>
      `;

      document.body.insertAdjacentHTML('afterbegin', sidebarHtml);
    }

    renderTopbar() {
      const activeOrg = this.getActiveOrg();

      const topbarHtml = `
        <header class="global-topbar" id="globalTopbar">
          <div class="topbar-left">
            <button class="topbar-mobile-hamburger" id="btnMobileHamburger" aria-label="Open Navigation">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>

            <!-- Global Search Trigger Bar -->
            <button class="topbar-search-trigger" id="btnGlobalSearchTrigger">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span class="search-placeholder">Search signals, alerts, assets, work orders...</span>
              <kbd class="search-kbd font-mono">&#8984;K</kbd>
            </button>
          </div>

          <div class="topbar-right">
            <!-- Organization Switcher Pill -->
            <button class="topbar-org-pill" id="btnTopbarOrgPill" title="Switch Organization">
              <span class="topbar-org-dot" style="background: ${activeOrg.color};"></span>
              <span class="topbar-org-name font-bold" id="topbarOrgName">${activeOrg.name}</span>
              <span class="topbar-org-caret">&#9662;</span>
            </button>

            <!-- Notifications Button with Pulse -->
            <div class="topbar-notif-wrap">
              <button class="topbar-icon-btn" id="btnNotifications" title="Operational Alerts & Notifications" aria-label="Notifications">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span class="notif-badge-count" id="notifBadgeCount">${this.unreadNotificationsCount}</span>
              </button>
            </div>

            <!-- Quick Settings Button -->
            <button class="topbar-icon-btn" id="btnTopbarSettings" title="Global System Settings" aria-label="Settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>

            <!-- User Avatar Chip -->
            <button class="topbar-user-chip" id="btnTopbarUserChip">
              <div class="user-chip-avatar">MV</div>
              <span class="user-chip-name font-bold">M. Vance</span>
            </button>
          </div>
        </header>
      `;

      document.body.insertAdjacentHTML('afterbegin', topbarHtml);
    }

    renderStoryRibbon() {
      const activeKey = this.getCurrentPageKey();
      const activeOrg = this.getActiveOrg();

      // Determine active story stage (1-7) matching FINAL DESIGN PRINCIPLE
      let activeStage = 1;
      let stageBadgeText = "STAGE 01 • SCATTERED SIGNALS";

      if (activeKey === 'overview' || activeKey === 'signals') {
        activeStage = 1;
        stageBadgeText = "STAGE 01 • SCATTERED SIGNALS";
      } else if (activeKey === 'map') {
        activeStage = 2;
        stageBadgeText = "STAGE 02 • SPATIAL CONNECTION";
      } else if (activeKey === 'trends') {
        activeStage = 3;
        stageBadgeText = "STAGE 03 • RECURRING PATTERN";
      } else if (activeKey === 'emergingRisks') {
        activeStage = 4;
        stageBadgeText = "STAGE 04 • EARLY WARNING";
      } else if (activeKey === 'evidence') {
        activeStage = 5;
        stageBadgeText = "STAGE 05 • EVIDENCE & EXPLAINABILITY";
      } else if (activeKey === 'actions') {
        activeStage = 6;
        stageBadgeText = "STAGE 06 • ACTION PIPELINE";
      } else if (activeKey === 'resolution') {
        activeStage = 7;
        stageBadgeText = "STAGE 07 • VERIFIED IMPACT";
      } else if (activeKey === 'aiAssistant') {
        activeStage = 5;
        stageBadgeText = "CROSS-LIFECYCLE COPILOT";
      } else if (activeKey === 'workspace') {
        activeStage = 4;
        stageBadgeText = "MULTI-FACILITY INTELLIGENCE";
      }

      const ribbonHtml = `
        <nav class="global-story-banner" id="globalStoryBanner" aria-label="EarlySight Operational Intelligence Lifecycle">
          <div class="story-banner-inner">
            <div class="story-banner-context">
              <span class="story-context-dot"></span>
              <span class="story-context-title">OPERATIONAL STORY</span>
              <span class="story-context-facility" id="storyFacilityTag">${activeOrg.name}</span>
            </div>
            
            <div class="story-steps-track" role="list">
              <a href="signals.html" class="story-step-item ${activeStage === 1 ? 'active' : ''}" data-step="1" title="01. Scattered Signals: Individual complaints, reports and data">
                <span class="story-step-num">01</span>
                <span class="story-step-name">Signals</span>
                <span class="story-step-sub">Complaints &amp; telemetry</span>
              </a>
              <span class="story-arrow" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </span>

              <a href="index.html#heroSynthesisProgression" class="story-step-item ${activeStage === 2 ? 'active' : ''}" data-step="2" title="02. Connection: Related information gets connected">
                <span class="story-step-num">02</span>
                <span class="story-step-name">Connection</span>
                <span class="story-step-sub">Correlated data</span>
              </a>
              <span class="story-arrow" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </span>

              <a href="timeline.html" class="story-step-item ${activeStage === 3 ? 'active' : ''}" data-step="3" title="03. Pattern: A recurring pattern becomes visible">
                <span class="story-step-num">03</span>
                <span class="story-step-name">Pattern</span>
                <span class="story-step-sub">Recurring pattern</span>
              </a>
              <span class="story-arrow" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </span>

              <a href="risks.html" class="story-step-item ${activeStage === 4 ? 'active' : ''}" data-step="4" title="04. Early Warning: An emerging problem is identified">
                <span class="story-step-num">04</span>
                <span class="story-step-name">Early Warning</span>
                <span class="story-step-sub">Emerging risk</span>
              </a>
              <span class="story-arrow" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </span>

              <a href="evidence.html" class="story-step-item ${activeStage === 5 ? 'active' : ''}" data-step="5" title="05. Evidence: The system explains why">
                <span class="story-step-num">05</span>
                <span class="story-step-name">Evidence</span>
                <span class="story-step-sub">Causal explainability</span>
              </a>
              <span class="story-arrow" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </span>

              <a href="actions.html" class="story-step-item ${activeStage === 6 ? 'active' : ''}" data-step="6" title="06. Action: A responsible team investigates and acts">
                <span class="story-step-num">06</span>
                <span class="story-step-name">Action</span>
                <span class="story-step-sub">Responsible team</span>
              </a>
              <span class="story-arrow" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </span>

              <a href="impact.html" class="story-step-item ${activeStage === 7 ? 'active' : ''}" data-step="7" title="07. Verification: The system checks whether the problem actually decreases">
                <span class="story-step-num">07</span>
                <span class="story-step-name">Verification</span>
                <span class="story-step-sub">Decay &amp; ROI</span>
              </a>
            </div>

            <!-- Active Stage Callout / Indicator Pill -->
            <div class="story-stage-indicator">
              <span class="indicator-badge ${activeStage === 4 ? 'badge-attention' : ''}">${stageBadgeText}</span>
            </div>
          </div>
        </nav>
      `;

      // Insert right below topbar
      const topbar = document.getElementById('globalTopbar');
      if (topbar) {
        topbar.insertAdjacentHTML('afterend', ribbonHtml);
      } else {
        document.body.insertAdjacentHTML('afterbegin', ribbonHtml);
      }
    }

    renderSearchModal() {
      const modalHtml = `
        <div class="global-modal-backdrop" id="searchModalBackdrop" style="display: none;">
          <div class="global-search-dialog">
            <div class="search-dialog-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="globalCommandInput" class="search-command-input" placeholder="Type a command, page name, or search keyword..." autocomplete="off">
              <kbd class="kbd-badge font-mono">ESC</kbd>
            </div>

            <div class="search-dialog-results" id="searchDialogResults">
              <!-- Dynamically populated -->
            </div>

            <div class="search-dialog-footer font-mono">
              <span>Navigate <kbd>&uarr;</kbd> <kbd>&darr;</kbd></span>
              <span>Open <kbd>&crarr;</kbd></span>
              <span>Close <kbd>ESC</kbd></span>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    renderNotificationsPopover() {
      const popoverHtml = `
        <div class="global-flyout-popover" id="notificationsFlyout" style="display: none;">
          <div class="flyout-header">
            <div class="flyout-title-row">
              <h4 class="flyout-title">Active Warning Notifications</h4>
              <span class="badge-count-pill font-mono" id="flyoutBadgeCount">3 Unread</span>
            </div>
            <button class="btn-text-action font-mono" id="btnMarkAllRead">Mark all read</button>
          </div>

          <div class="flyout-list">
            <a href="evidence.html" class="notif-item-link">
              <span class="notif-icon-circle icon-vermilion">&excl;</span>
              <div class="notif-content">
                <span class="notif-item-title font-bold">Sub-Slab Pressurized Water Seepage</span>
                <span class="notif-item-meta font-mono">Alert EW-2026-088 &bull; Block A &bull; 14.2d Lead</span>
                <span class="notif-item-time">12 mins ago</span>
              </div>
            </a>

            <a href="workspace.html" class="notif-item-link">
              <span class="notif-icon-circle icon-amber">&excl;</span>
              <div class="notif-content">
                <span class="notif-item-title font-bold">OR Suite 04 Pressure Envelope Dip</span>
                <span class="notif-item-meta font-mono">City Hospital &bull; Clean Core &bull; 7.8d Lead</span>
                <span class="notif-item-time">45 mins ago</span>
              </div>
            </a>

            <a href="workspace.html" class="notif-item-link">
              <span class="notif-icon-circle icon-teal">&starf;</span>
              <div class="notif-content">
                <span class="notif-item-title font-bold">Elevator #2 Traction Motor Scheduled</span>
                <span class="notif-item-meta font-mono">Green Residency &bull; Work Order WO-RES-7714</span>
                <span class="notif-item-time">2 hours ago</span>
              </div>
            </a>
          </div>

          <div class="flyout-footer">
            <a href="actions.html" class="btn-flyout-all">Go to Action Center &rarr;</a>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', popoverHtml);
    }

    renderSettingsModal() {
      const settingsHtml = `
        <div class="global-modal-backdrop" id="settingsModalBackdrop" style="display: none;">
          <div class="global-settings-dialog">
            <div class="settings-dialog-header">
              <div class="settings-title-group">
                <span class="settings-eyebrow font-mono">EARLYSIGHT SYSTEM SETTINGS</span>
                <h3 class="settings-title">Platform Preferences &amp; Alert Rules</h3>
              </div>
              <button class="modal-close-btn" id="btnCloseSettings">&times;</button>
            </div>

            <div class="settings-dialog-body">
              <div class="settings-section">
                <h4 class="settings-section-title font-mono">INTERFACE &amp; NAVIGATION</h4>
                <div class="settings-row">
                  <div class="setting-info">
                    <span class="setting-name">Warm-Ivory Architectural Theme</span>
                    <span class="setting-desc">Dignified light ivory palette (#FAF8F5) with editorial typography</span>
                  </div>
                  <input type="checkbox" checked disabled class="styled-checkbox">
                </div>
                <div class="settings-row">
                  <div class="setting-info">
                    <span class="setting-name">Compact Collapsed Sidebar Mode</span>
                    <span class="setting-desc">Show slim 68px icon rail to maximize screen space</span>
                  </div>
                  <input type="checkbox" id="chkCollapseSidebar" ${this.isCollapsed ? 'checked' : ''} class="styled-checkbox">
                </div>
                <div class="settings-row">
                  <div class="setting-info">
                    <span class="setting-name">Subtle Animations & Micro-Interactions</span>
                    <span class="setting-desc">Smooth page reveals, animated numeric counters, chart path drawing, and hover elevation</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <button type="button" class="btn-modal-secondary" id="btnReplayMotion" style="padding:4px 8px; font-size:0.7rem; font-family:var(--font-mono);">Replay</button>
                    <input type="checkbox" id="chkSubtleMotion" checked class="styled-checkbox">
                  </div>
                </div>
              </div>

              <div class="settings-section">
                <h4 class="settings-section-title font-mono">EARLY WARNING THRESHOLDS</h4>
                <div class="settings-row">
                  <div class="setting-info">
                    <span class="setting-name">Minimum Evidence Confidence Floor</span>
                    <span class="setting-desc">Suppress early warnings below 85% statistical multi-modal confidence</span>
                  </div>
                  <span class="font-mono font-bold text-emerald">85.0% Min</span>
                </div>
                <div class="settings-row">
                  <div class="setting-info">
                    <span class="setting-name">Mean Time Between Signals (MTBS) Surge Alert</span>
                    <span class="setting-desc">Trigger notification when signal velocity accelerates &gt; 300% in 72 hours</span>
                  </div>
                  <span class="font-mono font-bold text-vermilion">Active (300% Cap)</span>
                </div>
              </div>

              <div class="settings-section">
                <h4 class="settings-section-title font-mono">TENANT WORKSPACE PRIVACY</h4>
                <div class="settings-row">
                  <div class="setting-info">
                    <span class="setting-name">Air-Gapped Multi-Tenant Separation</span>
                    <span class="setting-desc">Strict zero cross-tenant data leakage between College, Hospital, and Residency</span>
                  </div>
                  <span class="status-chip chip-verified font-mono" style="font-size:0.72rem;">ENFORCED</span>
                </div>
              </div>
            </div>

            <div class="settings-dialog-footer">
              <button class="btn-modal-secondary" id="btnDismissSettings">Done</button>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', settingsHtml);
    }

    renderOrgDropdown() {
      let optionsHtml = '';
      ORGANIZATIONS.forEach(org => {
        const isCurrent = org.id === this.activeTenantId;
        optionsHtml += `
          <button class="org-dropdown-item ${isCurrent ? 'active' : ''}" data-org-id="${org.id}">
            <span class="item-dot" style="background: ${org.color};"></span>
            <div class="item-text">
              <span class="item-name font-bold">${org.name}</span>
              <span class="item-cat font-mono text-xs text-muted">${org.category}</span>
            </div>
            ${isCurrent ? '<span class="item-check font-mono text-emerald">&check;</span>' : ''}
          </button>
        `;
      });

      const orgMenuHtml = `
        <div class="global-flyout-popover org-flyout-menu" id="orgFlyoutMenu" style="display: none;">
          <div class="flyout-header">
            <span class="font-mono text-xs font-bold text-muted">SELECT WORKSPACE TENANT</span>
          </div>
          <div class="org-dropdown-list">
            ${optionsHtml}
          </div>
          <div class="flyout-footer">
            <a href="workspace.html" class="btn-flyout-all">Open Directory Modal &rarr;</a>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', orgMenuHtml);
    }

    renderUserDropdown() {
      const userMenuHtml = `
        <div class="global-flyout-popover user-flyout-menu" id="userFlyoutMenu" style="display: none;">
          <div class="user-flyout-header">
            <div class="user-avatar-initials">MV</div>
            <div class="user-header-text">
              <span class="user-fullname font-bold">Marcus Vance</span>
              <span class="user-email text-xs text-muted font-mono">m.vance@earlysight.facility04.net</span>
            </div>
          </div>
          <div class="user-flyout-items">
            <button class="user-menu-item" id="btnUserPreferences">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>User Preferences &amp; Credentials</span>
            </button>
            <a href="workspace.html" class="user-menu-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>Switch Workspace Tenant</span>
            </a>
          </div>
          <div class="user-flyout-footer">
            <button class="btn-user-signout font-mono" id="btnUserSignout">Sign Out Session</button>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', userMenuHtml);
    }

    bindEvents() {
      // Toggle Sidebar Collapse/Expand
      const btnToggleSidebar = document.getElementById('btnToggleSidebar');
      if (btnToggleSidebar) {
        btnToggleSidebar.addEventListener('click', () => {
          this.toggleSidebar();
        });
      }

      // Mobile Hamburger
      const btnMobileHamburger = document.getElementById('btnMobileHamburger');
      if (btnMobileHamburger) {
        btnMobileHamburger.addEventListener('click', (e) => {
          e.stopPropagation();
          document.body.classList.toggle('mobile-sidebar-open');
        });
      }

      // Mobile Drawer Close Button
      const btnMobileDrawerClose = document.getElementById('btnMobileDrawerClose');
      if (btnMobileDrawerClose) {
        btnMobileDrawerClose.addEventListener('click', (e) => {
          e.stopPropagation();
          document.body.classList.remove('mobile-sidebar-open');
        });
      }

      // Mobile Drawer Backdrop Click
      const mobileBackdrop = document.getElementById('mobileSidebarBackdrop');
      if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', () => {
          document.body.classList.remove('mobile-sidebar-open');
        });
      }

      // Auto-close Mobile Drawer when a navigation link is clicked
      const sidebarNavItems = document.querySelectorAll('.sidebar-nav-item, .sidebar-brand-link');
      sidebarNavItems.forEach(item => {
        item.addEventListener('click', () => {
          if (window.innerWidth <= 1024) {
            document.body.classList.remove('mobile-sidebar-open');
          }
        });
      });

      // Auto-dismiss Mobile Drawer on window resize beyond breakpoint
      window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && document.body.classList.contains('mobile-sidebar-open')) {
          document.body.classList.remove('mobile-sidebar-open');
        }
      });

      // Search Trigger
      const btnGlobalSearchTrigger = document.getElementById('btnGlobalSearchTrigger');
      if (btnGlobalSearchTrigger) {
        btnGlobalSearchTrigger.addEventListener('click', () => this.openSearchModal());
      }

      // Keyboard Shortcut Ctrl+K / Cmd+K
      window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          this.openSearchModal();
        } else if (e.key === 'Escape') {
          this.closeAllFlyouts();
          document.body.classList.remove('mobile-sidebar-open');
        }
      });

      // Search Modal Input Filtering
      const searchInput = document.getElementById('globalCommandInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.filterSearchRegistry(e.target.value.trim());
        });
      }

      // Backdrop close for Search Modal
      const searchBackdrop = document.getElementById('searchModalBackdrop');
      if (searchBackdrop) {
        searchBackdrop.addEventListener('click', (e) => {
          if (e.target === searchBackdrop) this.closeSearchModal();
        });
      }

      // Notifications Button & Flyout
      const btnNotifications = document.getElementById('btnNotifications');
      const notifFlyout = document.getElementById('notificationsFlyout');
      if (btnNotifications && notifFlyout) {
        btnNotifications.addEventListener('click', (e) => {
          e.stopPropagation();
          const isVisible = notifFlyout.style.display === 'block';
          this.closeAllFlyouts();
          if (!isVisible) notifFlyout.style.display = 'block';
        });
      }

      const btnMarkAllRead = document.getElementById('btnMarkAllRead');
      if (btnMarkAllRead) {
        btnMarkAllRead.addEventListener('click', () => {
          this.unreadNotificationsCount = 0;
          const badge = document.getElementById('notifBadgeCount');
          const flyoutBadge = document.getElementById('flyoutBadgeCount');
          if (badge) badge.style.display = 'none';
          if (flyoutBadge) flyoutBadge.textContent = '0 Unread';
          this.showToast('All operational alerts marked as reviewed.');
        });
      }

      // Settings Modal Triggers
      const btnSidebarSettings = document.getElementById('btnSidebarSettings');
      const btnTopbarSettings = document.getElementById('btnTopbarSettings');
      const btnUserPreferences = document.getElementById('btnUserPreferences');
      const settingsModal = document.getElementById('settingsModalBackdrop');
      const btnCloseSettings = document.getElementById('btnCloseSettings');
      const btnDismissSettings = document.getElementById('btnDismissSettings');

      const openSettings = () => {
        this.closeAllFlyouts();
        if (settingsModal) settingsModal.style.display = 'flex';
      };

      const closeSettings = () => {
        if (settingsModal) settingsModal.style.display = 'none';
      };

      if (btnSidebarSettings) btnSidebarSettings.addEventListener('click', openSettings);
      if (btnTopbarSettings) btnTopbarSettings.addEventListener('click', openSettings);
      if (btnUserPreferences) btnUserPreferences.addEventListener('click', openSettings);
      if (btnCloseSettings) btnCloseSettings.addEventListener('click', closeSettings);
      if (btnDismissSettings) btnDismissSettings.addEventListener('click', closeSettings);
      if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
          if (e.target === settingsModal) closeSettings();
        });
      }

      // Checkbox collapse toggle inside Settings
      const chkCollapseSidebar = document.getElementById('chkCollapseSidebar');
      if (chkCollapseSidebar) {
        chkCollapseSidebar.addEventListener('change', (e) => {
          this.isCollapsed = e.target.checked;
          localStorage.setItem('earlysight_sidebar_collapsed', this.isCollapsed);
          document.body.classList.toggle('sidebar-collapsed', this.isCollapsed);
        });
      }

      // Stage 14: Motion & Micro-Interactions Controls
      const chkSubtleMotion = document.getElementById('chkSubtleMotion');
      const btnReplayMotion = document.getElementById('btnReplayMotion');
      if (chkSubtleMotion) {
        chkSubtleMotion.addEventListener('change', (e) => {
          if (window.EarlySightMotion) {
            window.EarlySightMotion.toggleReducedMotion(!e.target.checked);
            this.showToast(e.target.checked ? 'Micro-interactions enabled.' : 'Subtle animations paused (Reduced Motion).');
          }
        });
      }
      if (btnReplayMotion) {
        btnReplayMotion.addEventListener('click', () => {
          if (window.EarlySightMotion) {
            window.EarlySightMotion.replayReveals();
            this.showToast('Replaying page reveals and animated counters.');
          }
        });
      }

      // Organization Selector Dropdown Triggers
      const btnSidebarOrg = document.getElementById('btnSidebarOrgTrigger');
      const btnTopbarOrg = document.getElementById('btnTopbarOrgPill');
      const orgFlyout = document.getElementById('orgFlyoutMenu');

      const toggleOrgMenu = (e) => {
        e.stopPropagation();
        const isVisible = orgFlyout.style.display === 'block';
        this.closeAllFlyouts();
        if (!isVisible) orgFlyout.style.display = 'block';
      };

      if (btnSidebarOrg) btnSidebarOrg.addEventListener('click', toggleOrgMenu);
      if (btnTopbarOrg) btnTopbarOrg.addEventListener('click', toggleOrgMenu);

      // Organization Switch Action in Dropdown
      const orgItems = document.querySelectorAll('.org-dropdown-item');
      orgItems.forEach(item => {
        item.addEventListener('click', () => {
          const orgId = item.dataset.orgId;
          this.switchOrganization(orgId);
        });
      });

      // User Profile Dropdown
      const btnSidebarUser = document.getElementById('btnSidebarUser');
      const btnTopbarUser = document.getElementById('btnTopbarUserChip');
      const userFlyout = document.getElementById('userFlyoutMenu');

      const toggleUserMenu = (e) => {
        e.stopPropagation();
        const isVisible = userFlyout.style.display === 'block';
        this.closeAllFlyouts();
        if (!isVisible) userFlyout.style.display = 'block';
      };

      if (btnSidebarUser) btnSidebarUser.addEventListener('click', toggleUserMenu);
      if (btnTopbarUser) btnTopbarUser.addEventListener('click', toggleUserMenu);

      // Sign out action
      const btnSignout = document.getElementById('btnUserSignout');
      if (btnSignout) {
        btnSignout.addEventListener('click', () => {
          this.showToast('Session logged out securely.');
          this.closeAllFlyouts();
        });
      }

      // Document click closes flyouts
      document.addEventListener('click', () => {
        this.closeAllFlyouts();
      });
    }

    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
      localStorage.setItem('earlysight_sidebar_collapsed', this.isCollapsed);
      document.body.classList.toggle('sidebar-collapsed', this.isCollapsed);
    }

    switchOrganization(orgId) {
      this.activeTenantId = orgId;
      localStorage.setItem('earlysight_active_tenant', orgId);

      const org = this.getActiveOrg();

      // Update Sidebar & Topbar UI text & colors
      const sidebarOrgName = document.getElementById('sidebarOrgName');
      const topbarOrgName = document.getElementById('topbarOrgName');
      const sidebarOrgDot = document.querySelector('.sidebar-org-dot');
      const topbarOrgDot = document.querySelector('.topbar-org-dot');

      if (sidebarOrgName) sidebarOrgName.textContent = org.name;
      if (topbarOrgName) topbarOrgName.textContent = org.name;
      if (sidebarOrgDot) sidebarOrgDot.style.background = org.color;
      if (topbarOrgDot) topbarOrgDot.style.background = org.color;

      const storyFacilityTag = document.getElementById('storyFacilityTag');
      if (storyFacilityTag) storyFacilityTag.textContent = org.name;

      this.closeAllFlyouts();
      this.showToast(`Switched workspace to ${org.name}. Loaded air-gapped data store.`);

      // If workspaceController exists on this page, notify it
      if (window.workspaceController && typeof window.workspaceController.switchTenant === 'function') {
        window.workspaceController.switchTenant(orgId, false);
      }
    }

    openSearchModal() {
      this.closeAllFlyouts();
      const backdrop = document.getElementById('searchModalBackdrop');
      const input = document.getElementById('globalCommandInput');
      if (backdrop) backdrop.style.display = 'flex';
      if (input) {
        input.value = '';
        input.focus();
        this.filterSearchRegistry('');
      }
    }

    closeSearchModal() {
      const backdrop = document.getElementById('searchModalBackdrop');
      if (backdrop) backdrop.style.display = 'none';
    }

    filterSearchRegistry(query) {
      const resultsContainer = document.getElementById('searchDialogResults');
      if (!resultsContainer) return;

      const q = query.toLowerCase();
      const matched = q
        ? SEARCH_REGISTRY.filter(item => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
        : SEARCH_REGISTRY;

      if (matched.length === 0) {
        resultsContainer.innerHTML = `
          <div class="empty-search-note font-mono text-center p-6 text-muted">
            No commands or assets found matching "${query}".
          </div>
        `;
        return;
      }

      let html = '';
      matched.forEach((item, idx) => {
        html += `
          <a href="${item.url}" class="search-result-row ${idx === 0 ? 'selected' : ''}">
            <div class="result-left">
              <span class="result-category-pill font-mono">${item.category}</span>
              <span class="result-title font-bold">${item.title}</span>
              <span class="result-desc text-xs text-muted">${item.desc}</span>
            </div>
            <span class="result-arrow font-mono text-muted">&rarr;</span>
          </a>
        `;
      });

      resultsContainer.innerHTML = html;
    }

    closeAllFlyouts() {
      const notifFlyout = document.getElementById('notificationsFlyout');
      const orgFlyout = document.getElementById('orgFlyoutMenu');
      const userFlyout = document.getElementById('userFlyoutMenu');

      if (notifFlyout) notifFlyout.style.display = 'none';
      if (orgFlyout) orgFlyout.style.display = 'none';
      if (userFlyout) userFlyout.style.display = 'none';
    }

    showToast(msg) {
      let toastContainer = document.querySelector('.action-toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'action-toast-container';
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement('div');
      toast.className = 'action-toast-item visible';
      toast.innerHTML = `<span class="toast-indicator"></span><span>${msg}</span>`;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
      }, 3200);
    }
  }

  // Instantiate Universal Engine
  window.globalNavEngine = new GlobalNavEngine();

})();
