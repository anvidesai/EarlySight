/**
 * EarlySight — Enterprise Main Dashboard Controller
 * Handles 7 Sections: Overview, Active Early Warnings, Emerging Issues,
 * Verified Alerts, Issues Under Investigation, Resolved Issues, Impact Monitoring
 * Emphasizes compact cards, clean typography & subtle indicators (no excessive icons)
 */

import {
  DASHBOARD_METRICS,
  ACTIVE_EARLY_WARNINGS,
  EMERGING_ISSUES,
  VERIFIED_ALERTS,
  UNDER_INVESTIGATION,
  RESOLVED_ISSUES,
  IMPACT_METRICS,
  EMERGING_RISKS_PANEL
} from '../data/dashboard-data.js';
import { FACILITY_MAP_ZONES, FACILITY_SIGNALS_DATA } from '../data/signal-map-data.js';

// Operational Signature Convergence Scenarios (Signal -> Pattern -> Risk)
const SIGNATURE_SCENARIOS = {
  water: {
    id: "water",
    title: "Water Infrastructure Risk",
    asset: "Block A Trench 4B Main Feeder",
    signals: [
      { id: "SIG-W01", name: "Water Leakage #01", type: "Maintenance Log", desc: "Flange 4B micro-drip noted during shift walk", time: "4d ago", dot: "#B87333", location: "Block A Trench 4B" },
      { id: "SIG-W02", name: "Water Leakage #02", type: "Acoustic Sensor", desc: "Floor moisture cavitation hiss (1.4 kHz)", time: "2d ago", dot: "#2563EB", location: "Trench 4B Bay 2" },
      { id: "SIG-W03", name: "Water Leakage #03", type: "SCADA Telemetry", desc: "Differential pressure drop (-0.4 bar delta)", time: "6h ago", dot: "#1B4332", location: "Aux Bypass BV-12" }
    ],
    pattern: {
      name: "Repeated Moisture Accumulation Pattern",
      signalCount: "12 Related Signals",
      coherence: "91% Coherence",
      velocity: "+35% Velocity Surge",
      timeframe: "4 Days Continuous",
      desc: "Temporal-spatial clustering matches recurring gasket weepage accelerating into joint failure."
    },
    risk: {
      level: "HIGH RISK",
      score: "87",
      scoreMax: "100",
      location: "Block A — Trench 4B Main Feeder",
      leadTime: "14 Days Lead Time",
      impact: "$120k Electrical Trench Flooding",
      status: "Investigation Work Order Dispatched"
    },
    whatChanged: {
      metric1: { val: "↑ 35%", label: "Water leakage signals", sub: "Surge in precursor volume across Block A over 72h" },
      metric2: { val: "+3", label: "Related incidents detected", sub: "Cross-correlated within 8.5m radius of Trench 4B" },
      metric3: { val: "↑ Med → High", label: "Risk level escalation", sub: "Flange joint failure probability crossed threshold" },
      metric4: { val: "+2", label: "New connected signals", sub: "SCADA pressure telemetry and shift logs linked" }
    },
    evidence: [
      { bold: "12 Related Signals:", text: "Ingested across 3 independent operational silos (Maintenance, Acoustic Sensor, SCADA)." },
      { bold: "Repeated Over 4 Days:", text: "Precursors recurred consistently across multiple operational shifts without clearing." },
      { bold: "Spatial Co-location:", text: "All 12 signals originated within a 4.2-meter radius of Block A Trench 4B." },
      { bold: "Increasing Frequency:", text: "Signal arrival interval compressed from 28h down to 3.2h (+35% velocity)." }
    ],
    evidenceLink: "evidence.html?alert=RSK-01"
  },
  bearing: {
    id: "bearing",
    title: "Drive Feeder Cage Failure",
    asset: "Drive AX-402 (High-Throughput Feeder #4)",
    signals: [
      { id: "SIG-B01", name: "Vibration Harmonic #01", type: "Accelerometer S-04", desc: "3,420 Hz envelope resonance harmonic detected", time: "8d ago", dot: "#A43A2A", location: "Feeder #4 Inboard" },
      { id: "SIG-B02", name: "Audible Hiss #02", type: "Shift Operator Log", desc: "Operator note: High-pitched motor scraping at 1,400 RPM", time: "5d ago", dot: "#B87333", location: "Assembly Bay 4" },
      { id: "SIG-B03", name: "Thermal Bloom #03", type: "FLIR Thermal Scan", desc: "+4.7°C flanged casing differential above baseline", time: "18h ago", dot: "#C27803", location: "Drive AX-402 Housing" }
    ],
    pattern: {
      name: "Coherent Bearing Cage Spallation",
      signalCount: "24 Related Signals",
      coherence: "94.6% Coherence",
      velocity: "Accelerating Trend",
      timeframe: "18 Days Lead Window",
      desc: "Tribological grease degradation matches high-frequency harmonics and casing thermal gradient."
    },
    risk: {
      level: "CRITICAL RISK",
      score: "94",
      scoreMax: "100",
      location: "Assembly Bay 4 — Drive Feeder #4",
      leadTime: "18 Days Countdown",
      impact: "$340k Assembly Line Halt",
      status: "Immediate Reliability WO Dispatched"
    },
    whatChanged: {
      metric1: { val: "↑ 48%", label: "High-frequency harmonics", sub: "3,420 Hz resonance power density surged 48%" },
      metric2: { val: "+4", label: "Operator log mentions", sub: "Vibration notes logged in morning & night shifts" },
      metric3: { val: "↑ High → Crit", label: "Risk level escalation", sub: "Bearing cage spallation crossed critical boundary" },
      metric4: { val: "+3", label: "New connected streams", sub: "FLIR thermal, SCADA amperage, and lube analysis" }
    },
    evidence: [
      { bold: "24 Related Signals:", text: "Multi-modal correlation across vibration telemetry, operator logs, and FLIR thermal scans." },
      { bold: "Repeated Over 18 Days:", text: "Harmonic amplitude escalated steadily with continuous machine runtime." },
      { bold: "Identical Subsystem:", text: "All indicators isolated to Drive AX-402 inboard roller bearing housing." },
      { bold: "Geometric Phase Match:", text: "Envelope frequency corresponds exactly to bearing cage rotational defect frequency." }
    ],
    evidenceLink: "evidence.html?alert=EW-2026-091"
  },
  hydraulic: {
    id: "hydraulic",
    title: "Extrusion Press Valve Drift",
    asset: "Primary Extrusion Press #2 (Pump Station B)",
    signals: [
      { id: "SIG-H01", name: "Cavitation Burst #01", type: "Acoustic Transducer", desc: "Ultrasonic cavitation micro-bursts on pump suction", time: "6d ago", dot: "#2563EB", location: "Pump Station B" },
      { id: "SIG-H02", name: "Valve Lag #02", type: "SCADA Controller", desc: "Proportional spool valve response delay +140ms", time: "3d ago", dot: "#C27803", location: "Press #2 Manifold" },
      { id: "SIG-H03", name: "Fluid Micro-wear #03", type: "Fluid Lab Sample", desc: "ISO 4406 particulate elevation in quarterly oil draw", time: "24h ago", dot: "#1B4332", location: "Hydraulic Loop B" }
    ],
    pattern: {
      name: "Valve Response Lag & Cavitation",
      signalCount: "12 Related Signals",
      coherence: "91.2% Coherence",
      velocity: "Increasing Velocity",
      timeframe: "12 Days to Breach",
      desc: "Differential valve hysteresis correlates with fluid aeration and acoustic cavitation spikes."
    },
    risk: {
      level: "HIGH RISK",
      score: "91",
      scoreMax: "100",
      location: "Block C — Extrusion Press #2",
      leadTime: "12 Days Lead Time",
      impact: "$210k Secondary Damage",
      status: "Preventive Seal Service Scheduled"
    },
    whatChanged: {
      metric1: { val: "↑ 28%", label: "Cavitation burst frequency", sub: "Acoustic transducer logged 28% increase in bursts" },
      metric2: { val: "+2", label: "Valve lag anomalies", sub: "Response delay increased from 45ms to 140ms" },
      metric3: { val: "↑ Med → High", label: "Risk level escalation", sub: "Spool erosion probability crossed warning threshold" },
      metric4: { val: "+2", label: "New connected streams", sub: "SCADA valve timing and particulate oil analysis" }
    },
    evidence: [
      { bold: "12 Related Signals:", text: "Correlated across SCADA valve timing, acoustic sensors, and fluid lab analysis." },
      { bold: "Repeated Over 12 Days:", text: "Micro-cavitation events occurred predictably during high-pressure cycles." },
      { bold: "Localized Hydraulic Loop:", text: "Confined to Pump Station B high-pressure manifold feeding Press #2." },
      { bold: "Coherent Time-Lag:", text: "Spool hysteresis perfectly mirrors fluid temperature rise (+3.4°C)." }
    ],
    evidenceLink: "evidence.html?alert=EW-2026-088"
  }
};

// Operational Risk Trend Trajectory Datasets (Answers: Is the situation getting better or worse?)
const TREND_TRAJECTORIES = {
  increasing: {
    key: "increasing",
    badge: "↑ Increasing Risk (+18% over 14d)",
    badgeClass: "badge-trend-alert",
    statusNote: "<strong>Status: ESCALATING (Situation is getting worse)</strong> — 3 correlated signal clusters breached early-warning threshold at T-10d. Precursor arrival velocity accelerated +34%.",
    signalPath: "M 50,158 L 135,152 L 220,140 L 305,124 L 390,92 L 475,58 L 560,32",
    signalArea: "M 50,158 L 135,152 L 220,140 L 305,124 L 390,92 L 475,58 L 560,32 L 560,170 L 50,170 Z",
    riskPath: "M 50,165 L 135,160 L 220,148 L 305,110 L 390,72 L 475,46 L 560,38",
    riskArea: "M 50,165 L 135,160 L 220,148 L 305,110 L 390,72 L 475,46 L 560,38 L 560,170 L 50,170 Z",
    points: [
      { x: 50, y: 158, title: "T-28d: 12 signals (sub-threshold normal)", stroke: "#1B4332", fill: "#FFF" },
      { x: 135, y: 152, title: "T-21d: 18 signals (isolated noise)", stroke: "#1B4332", fill: "#FFF" },
      { x: 220, y: 140, title: "T-14d: 26 signals (multi-modal correlation begins)", stroke: "#1B4332", fill: "#FFF" },
      { x: 305, y: 110, title: "T-10d: 42 signals (Breached MTGNN Threshold • 18d Lead)", stroke: "#C27803", fill: "#FFF" },
      { x: 390, y: 72, title: "T-6d: 65 signals (Precursor surge accelerates)", stroke: "#A43A2A", fill: "#FFF" },
      { x: 475, y: 46, title: "T-3d: 94 signals (Active Early Warning)", stroke: "#A43A2A", fill: "#FFF" },
      { x: 560, y: 38, title: "Today: Risk Score 72/100 • 128 Signals • Action Dispatched", stroke: "#A43A2A", fill: "#A43A2A" }
    ]
  },
  stable: {
    key: "stable",
    badge: "→ Stable Baseline (±2% variance)",
    badgeClass: "badge-forest-subtle",
    statusNote: "<strong>Status: STABLE (Situation steady)</strong> — Telemetry variance remains within safe tolerances. Sub-threshold indicators have not formed coherent failure patterns.",
    signalPath: "M 50,145 L 135,148 L 220,144 L 305,146 L 390,143 L 475,145 L 560,144",
    signalArea: "M 50,145 L 135,148 L 220,144 L 305,146 L 390,143 L 475,145 L 560,144 L 560,170 L 50,170 Z",
    riskPath: "M 50,152 L 135,150 L 220,153 L 305,150 L 390,151 L 475,149 L 560,150",
    riskArea: "M 50,152 L 135,150 L 220,153 L 305,150 L 390,151 L 475,149 L 560,150 L 560,170 L 50,170 Z",
    points: [
      { x: 50, y: 152, title: "T-28d: Risk 22/100 (Safe)", stroke: "#1B4332", fill: "#FFF" },
      { x: 135, y: 150, title: "T-21d: Risk 24/100 (Safe)", stroke: "#1B4332", fill: "#FFF" },
      { x: 220, y: 153, title: "T-14d: Risk 21/100 (Safe)", stroke: "#1B4332", fill: "#FFF" },
      { x: 305, y: 150, title: "T-10d: Risk 24/100 (Sub-threshold)", stroke: "#1B4332", fill: "#FFF" },
      { x: 390, y: 151, title: "T-6d: Risk 23/100 (Sub-threshold)", stroke: "#1B4332", fill: "#FFF" },
      { x: 475, y: 149, title: "T-3d: Risk 25/100 (Normal)", stroke: "#1B4332", fill: "#FFF" },
      { x: 560, y: 150, title: "Today: Risk Score 24/100 • Nominal baseline", stroke: "#1B4332", fill: "#1B4332" }
    ]
  },
  decreasing: {
    key: "decreasing",
    badge: "↓ Decreasing Risk (-32% post-remediation)",
    badgeClass: "badge-forest-subtle",
    statusNote: "<strong>Status: IMPROVING (Situation is getting better)</strong> — Field engineering replaced defective flange seal; vibration harmonics and moisture readings restored to baseline.",
    signalPath: "M 50,42 L 135,55 L 220,78 L 305,112 L 390,138 L 475,152 L 560,160",
    signalArea: "M 50,42 L 135,55 L 220,78 L 305,112 L 390,138 L 475,152 L 560,160 L 560,170 L 50,170 Z",
    riskPath: "M 50,48 L 135,62 L 220,88 L 305,120 L 390,146 L 475,158 L 560,164",
    riskArea: "M 50,48 L 135,62 L 220,88 L 305,120 L 390,146 L 475,158 L 560,164 L 560,170 L 50,170 Z",
    points: [
      { x: 50, y: 48, title: "T-28d: Peak Precursor Alarm (Risk 82/100)", stroke: "#A43A2A", fill: "#FFF" },
      { x: 135, y: 62, title: "T-21d: Work Order Dispatched", stroke: "#A43A2A", fill: "#FFF" },
      { x: 220, y: 88, title: "T-14d: Maintenance Executed", stroke: "#C27803", fill: "#FFF" },
      { x: 305, y: 120, title: "T-10d: Telemetry normalization begun", stroke: "#1B4332", fill: "#FFF" },
      { x: 390, y: 146, title: "T-6d: Harmonics dropped below threshold", stroke: "#1B4332", fill: "#FFF" },
      { x: 475, y: 158, title: "T-3d: Secondary moisture cleared", stroke: "#1B4332", fill: "#FFF" },
      { x: 560, y: 164, title: "Today: Risk Score 18/100 • Full Resolution Verified", stroke: "#1B4332", fill: "#1B4332" }
    ]
  }
};

class EarlySightDashboard {
  constructor() {
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.activeView = 'dashboard'; // 'hero' or 'dashboard'
    this.activeTrajectory = 'increasing'; // 'increasing', 'stable', or 'decreasing'
    this.activeScenario = 'water'; // 'water', 'bearing', or 'hydraulic'
    
    this.init();
  }

  init() {
    this.renderMetricsOverview();
    this.renderOperationalVisualizations();
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

  // 1. Overview Section — Operational Risk Intelligence Hierarchy (Milestone 3 - Part 1)
  renderMetricsOverview() {
    const container = document.getElementById('dashMetricsRow');
    if (!container) return;

    container.innerHTML = `
      <!-- Card 1: Overall Risk Score (Illustrative Synthesis Index) -->
      <div class="metric-card-compact risk-score-card">
        <div class="metric-card-top">
          <span class="metric-sub-label">Overall Risk</span>
          <span class="metric-illustrative-pill" title="Illustrative frontend score for synthesis">Mock Index</span>
        </div>
        <div class="metric-score-row">
          <div class="metric-primary-val risk-score-val">72 <span class="metric-score-denom">/ 100</span></div>
          <div class="risk-trajectory-pill trajectory-increasing" title="Precursor acceleration detected">
            <span class="trajectory-arrow">↑</span> Increasing
          </div>
        </div>
        <div class="metric-operational-q">How serious is the current situation?</div>
        <div class="metric-footer-note text-rust">Illustrative frontend score • Non-predictive mock value</div>
      </div>

      <!-- Card 2: Active Risks (Concrete Countdown Early Warnings) -->
      <div class="metric-card-compact">
        <div class="metric-card-top">
          <span class="metric-sub-label">Active Risks</span>
          <span class="indicator-dot dot-vermilion"></span>
        </div>
        <div class="metric-score-row">
          <div class="metric-primary-val">04 <span class="metric-unit">Active</span></div>
          <span class="risk-trajectory-pill badge-urgent">Critical Countdown</span>
        </div>
        <div class="metric-operational-q">Immediate operational threats</div>
        <div class="metric-footer-note text-vermilion">Lead times: 12d to 31d prior to failure</div>
      </div>

      <!-- Card 3: Emerging Risks (Precursor Patterns Forming) -->
      <div class="metric-card-compact">
        <div class="metric-card-top">
          <span class="metric-sub-label">Emerging Risks</span>
          <span class="indicator-dot dot-amber"></span>
        </div>
        <div class="metric-score-row">
          <div class="metric-primary-val">02 <span class="metric-unit">Patterns</span></div>
          <span class="risk-trajectory-pill badge-forming">Weak Signals</span>
        </div>
        <div class="metric-operational-q">Weak signal convergence forming</div>
        <div class="metric-footer-note text-amber">Crossing correlation threshold</div>
      </div>

      <!-- Card 4: Resolved Risks (Post-Intervention Verified) -->
      <div class="metric-card-compact">
        <div class="metric-card-top">
          <span class="metric-sub-label">Resolved Risks</span>
          <span class="indicator-dot dot-emerald"></span>
        </div>
        <div class="metric-score-row">
          <div class="metric-primary-val">08 <span class="metric-unit">Resolved</span></div>
          <span class="risk-trajectory-pill badge-resolved">Intervention Verified</span>
        </div>
        <div class="metric-operational-q">Post-intervention stability</div>
        <div class="metric-footer-note text-emerald">Closed-loop telemetry confirmed</div>
      </div>
    `;
  }

  // Operational Data Visualizations (Milestone 3: Parts 2, 3, 4, 5, 6):
  // Part 2 — Emerging Risk Trend (SVG Line/Area Chart with Increasing / Stable / Decreasing views)
  // Part 3 — Severity Distribution (Compact Donut, Categorized List, Segmented Bar)
  // Part 4 — Signature Visualization (SIGNAL -> PATTERN -> RISK Convergence Visual)
  // Part 5 — "What Changed?" Intelligence Panel (4 Precursor Deltas)
  // Part 6 — Evidence Connection (Lightweight Forensics & Dossier Link)
  renderOperationalVisualizations() {
    const container = document.getElementById('dashOperationalViz');
    if (!container) return;

    const traj = TREND_TRAJECTORIES[this.activeTrajectory] || TREND_TRAJECTORIES.increasing;
    const scen = SIGNATURE_SCENARIOS[this.activeScenario] || SIGNATURE_SCENARIOS.water;

    // Trend SVG
    const trendSvg = `
      <svg viewBox="0 0 600 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="signalAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1B4332" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="#1B4332" stop-opacity="0.01"/>
          </linearGradient>
          <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#A43A2A" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#A43A2A" stop-opacity="0.01"/>
          </linearGradient>
        </defs>

        <!-- Horizontal Gridlines -->
        <line x1="45" y1="25" x2="575" y2="25" class="chart-grid-line"/>
        <line x1="45" y1="65" x2="575" y2="65" class="chart-grid-line"/>
        <line x1="45" y1="105" x2="575" y2="105" class="chart-grid-line"/>
        <line x1="45" y1="145" x2="575" y2="145" class="chart-grid-line"/>

        <!-- Y-Axis Labels -->
        <text x="36" y="29" text-anchor="end" class="chart-text-axis">100</text>
        <text x="36" y="69" text-anchor="end" class="chart-text-axis">75</text>
        <text x="36" y="109" text-anchor="end" class="chart-text-axis">50</text>
        <text x="36" y="149" text-anchor="end" class="chart-text-axis">25</text>
        <text x="36" y="175" text-anchor="end" class="chart-text-axis">0</text>

        <!-- Baseline Axis Line -->
        <line x1="45" y1="170" x2="575" y2="170" class="chart-axis-line"/>

        <!-- MTGNN Pre-Failure Detection Threshold (Dashed Amber) -->
        <line x1="45" y1="110" x2="575" y2="110" class="chart-threshold-line"/>
        <rect x="340" y="98" width="235" height="18" rx="3" fill="#FAF8F5" stroke="#E4E0D8" stroke-width="1"/>
        <text x="457" y="110" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600" fill="#C27803">
          MTGNN DETECTION THRESHOLD (18d LEAD)
        </text>

        <!-- Shaded Areas -->
        <path d="${traj.signalArea}" fill="url(#signalAreaGrad)"/>
        <path d="${traj.riskArea}" fill="url(#riskAreaGrad)"/>

        <!-- Signal Precursor Velocity Line (Deep Forest Green) -->
        <path d="${traj.signalPath}" class="chart-line-signal"/>

        <!-- Synthesized Risk Escalation Curve (Muted Rust) -->
        <path d="${traj.riskPath}" class="chart-line-risk"/>

        <!-- Data Points on Curve -->
        ${traj.points.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="4" class="chart-dot-point" stroke="${p.stroke}" fill="${p.fill}">
            <title>${p.title}</title>
          </circle>
        `).join('')}

        <!-- X-Axis Labels -->
        <text x="50" y="186" text-anchor="middle" class="chart-text-axis">T-28d</text>
        <text x="135" y="186" text-anchor="middle" class="chart-text-axis">T-21d</text>
        <text x="220" y="186" text-anchor="middle" class="chart-text-axis">T-14d</text>
        <text x="305" y="186" text-anchor="middle" class="chart-text-axis">T-10d (Pattern)</text>
        <text x="390" y="186" text-anchor="middle" class="chart-text-axis">T-6d</text>
        <text x="475" y="186" text-anchor="middle" class="chart-text-axis">T-3d</text>
        <text x="560" y="186" text-anchor="middle" class="chart-text-axis" font-weight="700" fill="#1C2024">Today</text>
      </svg>
    `;

    // Severity Donut SVG
    // Total 128: Low 64 (50%), Med 38 (29.7%), High 18 (14.1%), Crit 8 (6.2%)
    const donutSvg = `
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="44" fill="none" stroke="#E4E0D8" stroke-width="14"/>
        <!-- Low: 50% -->
        <circle cx="60" cy="60" r="44" fill="none" stroke="#4D7C5D" stroke-width="14"
          stroke-dasharray="138.2 276.5" stroke-dashoffset="0"/>
        <!-- Medium: 29.7% -->
        <circle cx="60" cy="60" r="44" fill="none" stroke="#C27803" stroke-width="14"
          stroke-dasharray="82.1 276.5" stroke-dashoffset="-138.2"/>
        <!-- High: 14.1% -->
        <circle cx="60" cy="60" r="44" fill="none" stroke="#A43A2A" stroke-width="14"
          stroke-dasharray="38.9 276.5" stroke-dashoffset="-220.3"/>
        <!-- Critical: 6.2% -->
        <circle cx="60" cy="60" r="44" fill="none" stroke="#7A2417" stroke-width="14"
          stroke-dasharray="17.3 276.5" stroke-dashoffset="-259.2"/>
      </svg>
    `;

    // Vector Bracket SVG for Signature Convergence Visual
    // Connects 3 vertical signal cards to 1 pattern centroid
    const bracketSvg = `
      <svg viewBox="0 0 60 230" class="convergence-bracket-svg" preserveAspectRatio="none">
        <!-- 3 Horizontal Branches from Signals at Y=35, 115, 195 -->
        <line x1="0" y1="35" x2="24" y2="35" stroke="#1B4332" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="0" y1="115" x2="24" y2="115" stroke="#1B4332" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="0" y1="195" x2="24" y2="195" stroke="#1B4332" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Vertical Trunk -->
        <line x1="24" y1="35" x2="24" y2="195" stroke="#1B4332" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Convergence Stem pointing Right into Pattern Card -->
        <line x1="24" y1="115" x2="52" y2="115" stroke="#1B4332" stroke-width="2" stroke-linecap="round"/>
        <polygon points="50,111 58,115 50,119" fill="#1B4332"/>
      </svg>
    `;

    container.innerHTML = `
      <!-- Row 1: PART 2 (Risk Trend) & PART 3 (Severity Distribution) -->
      <div class="dash-viz-row-top">
        
        <!-- Panel A: PART 2 — Emerging Risk Trend Visualization -->
        <div class="dash-viz-card">
          <div class="dash-viz-card-header">
            <div>
              <div class="dash-viz-title-group">
                <span class="indicator-dot dot-vermilion"></span>
                <h3 class="dash-viz-title">Emerging Risk Trend</h3>
              </div>
              <span class="dash-viz-sub-q">Answers: "Is the situation getting better or worse?"</span>
            </div>

            <div class="trend-header-controls">
              <div class="trend-toggle-group" role="group" aria-label="Risk Trajectory View Selector">
                <button class="trend-toggle-btn ${this.activeTrajectory === 'increasing' ? 'active' : ''}" data-trajectory="increasing" title="View active escalating surge trajectory">
                  ↑ Increasing
                </button>
                <button class="trend-toggle-btn ${this.activeTrajectory === 'stable' ? 'active' : ''}" data-trajectory="stable" title="View normal baseline trajectory">
                  → Stable
                </button>
                <button class="trend-toggle-btn ${this.activeTrajectory === 'decreasing' ? 'active' : ''}" data-trajectory="decreasing" title="View post-intervention recovery trajectory">
                  ↓ Decreasing
                </button>
              </div>
              <span class="dash-viz-badge ${traj.badgeClass}" id="trendBadgeLabel">${traj.badge}</span>
            </div>
          </div>

          <!-- Operational Status Interpretation Note -->
          <div class="trend-status-banner" id="trendStatusBanner">
            ${traj.statusNote}
          </div>

          <div class="trend-line-chart-wrap" id="trendChartWrap">
            ${trendSvg}
          </div>

          <div class="chart-legend-row">
            <div class="chart-legend-indicator">
              <span class="legend-swatch" style="background:#1B4332;"></span>
              <span>Signal Volume (128 Ingested)</span>
            </div>
            <div class="chart-legend-indicator">
              <span class="legend-swatch" style="background:#A43A2A;"></span>
              <span>Synthesized Risk Score (72/100)</span>
            </div>
            <div class="chart-legend-indicator">
              <span class="legend-swatch" style="background:#C27803; border-top:1px dashed #C27803;"></span>
              <span>Pre-Failure Threshold (T-18d)</span>
            </div>
          </div>
        </div>

        <!-- Panel B: PART 3 — Severity Distribution Visualization -->
        <div class="dash-viz-card">
          <div class="dash-viz-card-header">
            <div>
              <div class="dash-viz-title-group">
                <span class="indicator-dot dot-slate"></span>
                <h3 class="dash-viz-title">Risk Severity Distribution</h3>
              </div>
              <span class="dash-viz-sub-q">Answers: "How serious are the detected risks?"</span>
            </div>
            <span class="dash-viz-badge badge-forest-subtle">128 Total Signals</span>
          </div>

          <div class="severity-dist-body">
            <div class="severity-donut-svg-wrap">
              ${donutSvg}
              <div class="donut-center-metric">
                <span class="donut-center-number">128</span>
                <span class="donut-center-label">Signals</span>
              </div>
            </div>

            <div class="severity-dist-list">
              <div class="severity-dist-item">
                <div class="severity-dist-item-left">
                  <span class="severity-dist-pill" style="background:#7A2417;"></span>
                  <span>Critical Severity</span>
                </div>
                <span class="severity-dist-count" style="color:#7A2417;">08 <span style="font-size:0.7rem; font-weight:normal; color:#57606A;">(6.2%)</span></span>
              </div>

              <div class="severity-dist-item">
                <div class="severity-dist-item-left">
                  <span class="severity-dist-pill" style="background:#A43A2A;"></span>
                  <span>High Severity</span>
                </div>
                <span class="severity-dist-count" style="color:#A43A2A;">18 <span style="font-size:0.7rem; font-weight:normal; color:#57606A;">(14.1%)</span></span>
              </div>

              <div class="severity-dist-item">
                <div class="severity-dist-item-left">
                  <span class="severity-dist-pill" style="background:#C27803;"></span>
                  <span>Medium Severity</span>
                </div>
                <span class="severity-dist-count" style="color:#C27803;">38 <span style="font-size:0.7rem; font-weight:normal; color:#57606A;">(29.7%)</span></span>
              </div>

              <div class="severity-dist-item">
                <div class="severity-dist-item-left">
                  <span class="severity-dist-pill" style="background:#4D7C5D;"></span>
                  <span>Low Severity</span>
                </div>
                <span class="severity-dist-count" style="color:#4D7C5D;">64 <span style="font-size:0.7rem; font-weight:normal; color:#57606A;">(50.0%)</span></span>
              </div>
            </div>
          </div>

          <div class="severity-bar-multi" title="Proportional Severity Strip: Critical (6.2%), High (14.1%), Medium (29.7%), Low (50.0%)">
            <div class="severity-bar-seg" style="width:6.2%; background:#7A2417;" title="Critical: 8"></div>
            <div class="severity-bar-seg" style="width:14.1%; background:#A43A2A;" title="High: 18"></div>
            <div class="severity-bar-seg" style="width:29.7%; background:#C27803;" title="Medium: 38"></div>
            <div class="severity-bar-seg" style="width:50.0%; background:#4D7C5D;" title="Low: 64"></div>
          </div>
        </div>

      </div>

      <!-- Row 2: PART 4 — SIGNATURE VISUALIZATION (SIGNAL -> PATTERN -> RISK) -->
      <div class="signature-intelligence-card" id="signatureIntelligenceCard">
        <div class="dash-viz-card-header">
          <div>
            <div class="dash-viz-title-group">
              <span class="indicator-dot dot-forest" style="background:#1B4332;"></span>
              <h3 class="dash-viz-title">Signal Convergence & Emerging Risk Synthesis</h3>
            </div>
            <span class="dash-viz-sub-q">Answers: "How did EarlySight identify this emerging risk?" (Signals → Pattern → Risk)</span>
          </div>

          <!-- Interactive Scenario Switcher -->
          <div class="sig-scenario-nav">
            <button class="sig-scenario-tab ${this.activeScenario === 'water' ? 'active' : ''}" data-scenario="water">
              Water Leakage (Block A)
            </button>
            <button class="sig-scenario-tab ${this.activeScenario === 'bearing' ? 'active' : ''}" data-scenario="bearing">
              Drive Feeder (AX-402)
            </button>
            <button class="sig-scenario-tab ${this.activeScenario === 'hydraulic' ? 'active' : ''}" data-scenario="hydraulic">
              Extrusion Press (Block C)
            </button>
          </div>
        </div>

        <!-- 3-Column Convergence Flow: Signals Bracket -> Pattern Centroid -> Emerging Risk Outcome -->
        <div class="signature-convergence-grid">
          
          <!-- Column 1: SIGNALS (Scattered precursor indicators) -->
          <div class="signal-bracket-col">
            <div class="signal-col-header">
              <span>01. Ingested Precursor Signals</span>
              <span class="font-mono text-muted">${scen.signals.length} Signals</span>
            </div>

            ${scen.signals.map(s => `
              <div class="signal-mini-card">
                <div class="signal-mini-top">
                  <span class="signal-mini-title">
                    <span class="indicator-dot" style="background:${s.dot};"></span>
                    <strong>${s.name}</strong>
                  </span>
                  <span class="signal-type-tag">${s.type}</span>
                </div>
                <div class="signal-mini-desc">${s.desc}</div>
                <div class="signal-mini-meta">${s.location} • ${s.time}</div>
              </div>
            `).join('')}
          </div>

          <!-- Desktop SVG Bracket Connector -->
          <div class="convergence-bracket-wrap" aria-hidden="true">
            ${bracketSvg}
          </div>
          <div class="mobile-down-arrow" aria-hidden="true">&darr;</div>

          <!-- Column 2: PATTERN (Correlated Synthesis Centroid) -->
          <div class="pattern-centroid-col">
            <div class="signal-col-header">
              <span>02. Correlated Pattern</span>
              <span class="font-mono" style="color:var(--color-amber);">${scen.pattern.coherence}</span>
            </div>

            <div class="pattern-centroid-card">
              <div class="pattern-card-header">
                <span class="pattern-badge-pill" style="background:rgba(194,120,3,0.12); color:#C27803;">
                  ${scen.pattern.signalCount}
                </span>
                <span class="pattern-badge-pill" style="background:rgba(27,67,50,0.1); color:#1B4332;">
                  ${scen.pattern.velocity}
                </span>
              </div>
              <div class="pattern-card-title">${scen.pattern.name}</div>
              <div class="pattern-desc">${scen.pattern.desc}</div>
              <div class="signal-mini-meta" style="border-top:1px dashed var(--border-subtle); padding-top:4px;">
                MTGNN Graph Attention • ${scen.pattern.timeframe}
              </div>
            </div>
          </div>

          <!-- Middle Connector Arrow -->
          <div class="convergence-arrow-col" aria-hidden="true">&rarr;</div>
          <div class="mobile-down-arrow" aria-hidden="true">&darr;</div>

          <!-- Column 3: EMERGING RISK (Proactive Warning Forecast) -->
          <div class="risk-outcome-col">
            <div class="signal-col-header">
              <span>03. Emerging Risk Forecast</span>
              <span class="font-mono text-muted">${scen.risk.leadTime}</span>
            </div>

            <div class="risk-outcome-card">
              <div class="risk-outcome-header">
                <span class="risk-severity-banner">
                  <span class="indicator-dot dot-vermilion"></span>
                  ${scen.risk.level}
                </span>
                <span class="risk-score-display">${scen.risk.score} <span style="font-size:0.75rem; font-weight:normal; color:#57606A;">/ 100</span></span>
              </div>
              <div class="risk-location-tag">${scen.risk.location}</div>
              <div class="risk-impact-note">Predicted Impact: <strong>${scen.risk.impact}</strong></div>
              <div class="signal-mini-meta" style="color:var(--color-forest); font-weight:600; border-top:1px dashed var(--border-subtle); padding-top:4px;">
                Status: ${scen.risk.status}
              </div>
            </div>
          </div>

        </div>

        <!-- PART 5: "WHAT CHANGED?" INTELLIGENCE SECTION -->
        <div class="what-changed-panel">
          <div class="what-changed-header">
            <div>
              <h4 class="what-changed-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                <span>Recent Operational Changes & Precursor Shifts</span>
              </h4>
              <span class="what-changed-sub">Answers: "What changed recently across monitored facility assets?"</span>
            </div>
            <span class="metric-illustrative-pill">72-Hour Delta Tracking</span>
          </div>

          <div class="what-changed-grid">
            <div class="what-changed-card">
              <div class="what-changed-val" style="color:var(--color-rust);">${scen.whatChanged.metric1.val}</div>
              <div class="what-changed-label">${scen.whatChanged.metric1.label}</div>
              <div class="what-changed-desc">${scen.whatChanged.metric1.sub}</div>
            </div>

            <div class="what-changed-card">
              <div class="what-changed-val" style="color:var(--color-amber);">${scen.whatChanged.metric2.val}</div>
              <div class="what-changed-label">${scen.whatChanged.metric2.label}</div>
              <div class="what-changed-desc">${scen.whatChanged.metric2.sub}</div>
            </div>

            <div class="what-changed-card">
              <div class="what-changed-val" style="color:var(--color-rust);">${scen.whatChanged.metric3.val}</div>
              <div class="what-changed-label">${scen.whatChanged.metric3.label}</div>
              <div class="what-changed-desc">${scen.whatChanged.metric3.sub}</div>
            </div>

            <div class="what-changed-card">
              <div class="what-changed-val" style="color:var(--color-forest);">${scen.whatChanged.metric4.val}</div>
              <div class="what-changed-label">${scen.whatChanged.metric4.label}</div>
              <div class="what-changed-desc">${scen.whatChanged.metric4.sub}</div>
            </div>
          </div>
        </div>

        <!-- PART 6: EVIDENCE CONNECTION -->
        <div class="evidence-connection-panel">
          <div class="evidence-conn-header">
            <div>
              <h4 class="evidence-conn-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <span>Evidence Connection: Why EarlySight Highlighted This Risk</span>
              </h4>
              <span class="dash-viz-sub-q">Answers: "Why should I trust this warning?" (${scen.risk.level} • ${scen.asset})</span>
            </div>
            <a href="${scen.evidenceLink}" class="btn-evidence-dossier" id="evidenceDossierLink">
              Inspect Evidence Dossier &rarr;
            </a>
          </div>

          <div class="evidence-reasons-grid">
            ${scen.evidence.map(ev => `
              <div class="evidence-reason-item">
                <span class="evidence-reason-bullet">•</span>
                <span><strong>${ev.bold}</strong> ${ev.text}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Row 3: Operational Cockpit (Score / Confidence / Lead Time / Outage Risk) -->
      <div class="risk-overview-cockpit">
        
        <div class="cockpit-metric-block">
          <div class="cockpit-score-ring">
            <svg viewBox="0 0 44 44" style="width:100%; height:100%; transform:rotate(-90deg);">
              <circle cx="22" cy="22" r="18" fill="none" stroke="#E4E0D8" stroke-width="4"/>
              <circle cx="22" cy="22" r="18" fill="none" stroke="#A43A2A" stroke-width="4"
                stroke-dasharray="113.1" stroke-dashoffset="24.8"/>
            </svg>
            <span class="cockpit-score-val" style="position:absolute;">72</span>
          </div>
          <div class="cockpit-metric-text">
            <span class="cockpit-metric-label">Composite Risk Index</span>
            <span class="cockpit-metric-main" style="color:var(--color-rust);">72 / 100</span>
            <span class="cockpit-metric-sub">Elevated Precursor Activity</span>
          </div>
        </div>

        <div class="cockpit-metric-block">
          <div class="cockpit-metric-text">
            <span class="cockpit-metric-label">Active Emerging Risks</span>
            <span class="cockpit-metric-main">04 Early Warnings</span>
            <span class="cockpit-metric-sub">1 Critical • 2 High • 1 Moderate</span>
          </div>
        </div>

        <div class="cockpit-metric-block">
          <div class="cockpit-metric-text">
            <span class="cockpit-metric-label">Model Confidence</span>
            <span class="cockpit-metric-main" style="color:var(--color-forest);">${DASHBOARD_METRICS.modelConfidenceAvg || '93.8%'}</span>
            <span class="cockpit-metric-sub">MTGNN Graph Attention Verified</span>
          </div>
        </div>

        <div class="cockpit-metric-block">
          <div class="cockpit-metric-text">
            <span class="cockpit-metric-label">Actionable Lead Time</span>
            <span class="cockpit-metric-main">${DASHBOARD_METRICS.meanLeadTimeDays || 19.4} Days</span>
            <span class="cockpit-metric-sub">Averted Loss: ${DASHBOARD_METRICS.totalDowntimeAvertedUSD || '$1,840,000'}</span>
          </div>
        </div>

      </div>
    `;

    this.bindOperationalEvents();
  }

  // Trajectory Switcher for Part 2
  switchTrajectory(trajectoryKey) {
    if (TREND_TRAJECTORIES[trajectoryKey]) {
      this.activeTrajectory = trajectoryKey;
      this.renderOperationalVisualizations();
    }
  }

  // Scenario Switcher for Part 4, 5, 6
  switchSignatureScenario(scenarioKey) {
    if (SIGNATURE_SCENARIOS[scenarioKey]) {
      this.activeScenario = scenarioKey;
      this.renderOperationalVisualizations();
    }
  }

  // Event bindings for operational visualization interactive controls
  bindOperationalEvents() {
    // Trajectory toggle buttons (Part 2)
    const trajButtons = document.querySelectorAll('.trend-toggle-btn');
    trajButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = btn.getAttribute('data-trajectory');
        if (key && key !== this.activeTrajectory) {
          this.switchTrajectory(key);
        }
      });
    });

    // Scenario toggle tabs (Part 4)
    const scenarioTabs = document.querySelectorAll('.sig-scenario-tab');
    scenarioTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const key = tab.getAttribute('data-scenario');
        if (key && key !== this.activeScenario) {
          this.switchSignatureScenario(key);
        }
      });
    });
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
if (typeof window !== 'undefined') {
  window.dashboardController = new EarlySightDashboard();
  window.EarlySightDashboard = EarlySightDashboard;
}

export { EarlySightDashboard };
