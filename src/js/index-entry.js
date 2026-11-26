/**
 * EarlySight — Official Homepage Entry (Premium Pastel Enterprise)
 * Interactive Sector Switcher, Live Telemetry Stream, and Guided Demo Experience
 */
import '../styles/styles.css';

// Pre-configured Industry Scenarios for Interactive Landing Page Preview
const INDUSTRY_SCENARIOS = {
  colleges: {
    tenantBadge: 'ABC',
    tenantName: 'ABC College • Science Campus',
    heading: 'Science Campus Chiller & Fume Surveillance',
    subheading: 'Continuous multi-modal precursor detection across lab scrubbers & dorm risers',
    confidence: '95.2% AI CONFIDENCE',
    kpi1: { label: 'Active Signals', val: '128', meta: '+14% in 24h • 6 Modalities' },
    kpi2: { label: 'Open Risks', val: '4', meta: '1 Critical • 14d Lead Time' },
    kpi3: { label: 'Actions Pending', val: '6', meta: '2 In Progress • 1 Verified' },
    riskTitle: 'Emerging Risk Trajectory: RSK-001 (Lab Scrubber Cavitation)',
    leadTime: '+12.4 Days Lead Time',
    signals: [
      { code: 'SIG-W01', desc: 'Sub-Slab Flange 4B Micro-Weep', badge: 'Acoustic • 1.4 kHz', dot: 'teal' },
      { code: 'SIG-V04', desc: 'Secondary Impeller Flutter', badge: 'Vibration • +2.8 mm/s', dot: 'amber' },
      { code: 'SIG-T02', desc: 'Heat Exchanger Delta-T Creep', badge: 'Thermal • +6.2°C', dot: 'lavender' }
    ],
    milestones: [
      { id: 1, tip: 'Precursor 1: Micro-weep detected via acoustic sensor (1.4 kHz)' },
      { id: 2, tip: 'Precursor 2: Delta-T thermal gradient surge (+6.2°C)' },
      { id: 3, tip: 'Precursor 3: 28 Hz resonance flutter crossing alert threshold' },
      { id: 4, tip: 'Projected Breach: Composite Risk Score 82 (High Hazard)' }
    ]
  },
  hospitals: {
    tenantBadge: 'HOSP',
    tenantName: 'City Hospital • Tertiary Healthcare',
    heading: 'Clean Core & Surgical Suite Environmental Telemetry',
    subheading: 'Air-handler positive pressure maintenance & sterile gas distribution monitoring',
    confidence: '98.4% AI CONFIDENCE',
    kpi1: { label: 'Air Quality Feeds', val: '94', meta: 'Differential pressure telemetry' },
    kpi2: { label: 'Sterility Hazards', val: '2', meta: 'OR Suite 04 • 7.8d Lead' },
    kpi3: { label: 'Clean-Core SOPs', val: '5', meta: 'HEPA Backflushing Active' },
    riskTitle: 'Emerging Risk Trajectory: RSK-003 (OR Suite 04 Differential Dip)',
    leadTime: '+7.8 Days Lead Time',
    signals: [
      { code: 'SIG-P08', desc: 'OR Suite 04 Pressure Delta Dip', badge: 'Pressure • -0.05 in.wg', dot: 'teal' },
      { code: 'SIG-H02', desc: 'Supply Fan Vane Hunting', badge: 'Vibration • 14 Hz', dot: 'amber' },
      { code: 'SIG-A04', desc: 'Secondary HEPA Resistance Drift', badge: 'Airflow • +18 Pa', dot: 'lavender' }
    ],
    milestones: [
      { id: 1, tip: 'Precursor 1: Supply fan motor vibration drift (14 Hz flutter)' },
      { id: 2, tip: 'Precursor 2: HEPA filter resistance deviation (+18 Pa delta)' },
      { id: 3, tip: 'Precursor 3: Clean-core differential pressure drop (-0.05 in.wg)' },
      { id: 4, tip: 'Projected Breach: Risk Score 89 (Critical Surgical Alert)' }
    ]
  },
  companies: {
    tenantBadge: 'APEX',
    tenantName: 'Apex Industrial • Corporate HQ & Data Infrastructure',
    heading: 'High-Density Compute & HVAC Telemetry Oversight',
    subheading: 'Chilled loop thermal envelope, UPS harmonic flutter, and pump cavitation surveillance',
    confidence: '96.1% AI CONFIDENCE',
    kpi1: { label: 'Compute Feeds', val: '186', meta: 'PDU, CRAC & Server chillers' },
    kpi2: { label: 'Emerging Threats', val: '3', meta: 'Chilled Loop #2 • 16d Lead' },
    kpi3: { label: 'Mitigated Outages', val: '14', meta: '$840k Downtime Averted' },
    riskTitle: 'Emerging Risk Trajectory: RSK-004 (CRAC Pump Chilled Water Cavitation)',
    leadTime: '+16.2 Days Lead Time',
    signals: [
      { code: 'SIG-C01', desc: 'CRAC Unit 3 Heat Dissipation Sag', badge: 'Thermal • +4.8°C', dot: 'teal' },
      { code: 'SIG-P12', desc: 'Chilled Loop #2 Pressure Wobble', badge: 'SCADA • -0.32 bar', dot: 'amber' },
      { code: 'SIG-A09', desc: 'Pump B Motor Stator Enveloping', badge: 'Acoustic • 2.8 kHz', dot: 'lavender' }
    ],
    milestones: [
      { id: 1, tip: 'Precursor 1: Heat dissipation efficiency loss (+4.8°C Delta-T)' },
      { id: 2, tip: 'Precursor 2: SCADA line pressure fluctuation (-0.32 bar)' },
      { id: 3, tip: 'Precursor 3: 2.8 kHz bearing cage micro-harmonic peak' },
      { id: 4, tip: 'Projected Breach: Risk Score 84 (High Downtime Hazard)' }
    ]
  },
  factories: {
    tenantBadge: 'FACT',
    tenantName: 'Apex Industrial • Semiconductor Fabrication Plant',
    heading: 'Manufacturing Line & Drive Feeder Predictive Monitoring',
    subheading: 'Drive AX-402 bearing cage spallation & high-throughput feeder tribology',
    confidence: '97.6% AI CONFIDENCE',
    kpi1: { label: 'Active Sensors', val: '242', meta: 'High-speed vibration & SCADA' },
    kpi2: { label: 'Critical Risks', val: '1', meta: 'Feeder #4 • 18d Lead Time' },
    kpi3: { label: 'Saved Production', val: '$1.84M', meta: '0 Unplanned Halts' },
    riskTitle: 'Emerging Risk Trajectory: RSK-002 (Drive Feeder AX-402 Bearing Spallation)',
    leadTime: '+18.0 Days Lead Time',
    signals: [
      { code: 'SIG-B01', desc: 'Vibration Harmonic 3,420 Hz', badge: 'Accelerometer • +48%', dot: 'teal' },
      { code: 'SIG-B02', desc: 'Shift Operator Hiss Note', badge: 'Shift Log • Morning', dot: 'amber' },
      { code: 'SIG-B03', desc: 'Thermal Bloom FLIR Scan', badge: 'Thermal • +4.7°C', dot: 'lavender' }
    ],
    milestones: [
      { id: 1, tip: 'Precursor 1: 3,420 Hz resonance envelope harmonic (+48% energy)' },
      { id: 2, tip: 'Precursor 2: Shift operator log note (scraping sound at 1,400 RPM)' },
      { id: 3, tip: 'Precursor 3: FLIR thermal bloom on bearing casing (+4.7°C)' },
      { id: 4, tip: 'Projected Breach: Risk Score 94 (Critical Feeder Cage Failure)' }
    ]
  },
  communities: {
    tenantBadge: 'RES',
    tenantName: 'Green Residency • Smart High-Rise Community',
    heading: 'Residential Tower Vertical Transit & Utilities',
    subheading: 'Elevator traction motor vibration, domestic water booster cavitation & fire risers',
    confidence: '94.0% AI CONFIDENCE',
    kpi1: { label: 'Facility Points', val: '112', meta: 'Elevators, pumps, fire risers' },
    kpi2: { label: 'Active Alerts', val: '3', meta: 'Tower Alpha Motor • 11.2d' },
    kpi3: { label: 'Resident Tickets', val: '0', meta: 'Preempted Prior to Notice' },
    riskTitle: 'Emerging Risk Trajectory: RSK-005 (Elevator #2 Traction Motor Vibration)',
    leadTime: '+11.2 Days Lead Time',
    signals: [
      { code: 'SIG-E12', desc: 'Elevator #2 Harmonic Flutter', badge: 'Vibration • 28 Hz', dot: 'teal' },
      { code: 'SIG-W09', desc: 'Booster Pump #1 Intake Cavitation', badge: 'Acoustic • 3.2 kHz', dot: 'amber' },
      { code: 'SIG-T15', desc: 'Penthouse Transformer Ambient Delta', badge: 'Thermal • +3.8°C', dot: 'lavender' }
    ],
    milestones: [
      { id: 1, tip: 'Precursor 1: 28 Hz motor flutter during acceleration phase' },
      { id: 2, tip: 'Precursor 2: Drive sheave micro-slippage telemetry recorded' },
      { id: 3, tip: 'Precursor 3: Motor casing temperature gradient elevation (+3.8°C)' },
      { id: 4, tip: 'Projected Breach: Risk Score 84 (High Rider Safety Hazard)' }
    ]
  }
};

// Streaming Telemetry Feed Items for Dynamic Ticker
const LIVE_TICKER_STREAM = [
  { code: 'SIG-W01', text: 'Flange 4B Acoustic Cavitation 1.4kHz • Block A Trench 4B', dot: 'teal' },
  { code: 'SIG-V04', text: 'Drive Impeller Flutter +2.8mm/s • High-Throughput Feeder #4', dot: 'amber' },
  { code: 'SIG-T02', text: 'Chilled Water Delta-T Creep +6.2°C • Utility Complex Quad-B', dot: 'lavender' },
  { code: 'SIG-P08', text: 'Clean-Core OR Suite 04 Differential (-0.05 in.wg) • City Hospital', dot: 'teal' },
  { code: 'SIG-E12', text: 'Traction Motor 28Hz Harmonic Enveloping • Tower Alpha High-Rise', dot: 'amber' },
  { code: 'SIG-B01', text: '3,420 Hz Accelerometer Resonance Envelope Surge • Assembly Bay 4', dot: 'lavender' }
];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hash redirection to main operational dashboard if requested
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('dashboard') || hash.includes('maindashboardsection')) {
    window.location.href = 'dashboard.html' + window.location.hash;
    return;
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('homeMobileToggle');
  const mobileMenu = document.getElementById('homeMobileMenu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isExpanded = mobileMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // 3. Interactive Industry Sector Switcher (Dynamic Hero Dashboard Preview)
  const audiencePills = document.querySelectorAll('.home-audience-pill');
  const previewTenantBadge = document.getElementById('previewTenantBadge');
  const previewHeading = document.getElementById('previewHeading');
  const previewSubheading = document.getElementById('previewSubheading');
  const previewConfidenceBadge = document.getElementById('previewConfidenceBadge');
  const previewKpiLabel1 = document.getElementById('previewKpiLabel1');
  const previewKpiVal1 = document.getElementById('previewKpiVal1');
  const previewKpiMeta1 = document.getElementById('previewKpiMeta1');
  const previewKpiLabel2 = document.getElementById('previewKpiLabel2');
  const previewKpiVal2 = document.getElementById('previewKpiVal2');
  const previewKpiMeta2 = document.getElementById('previewKpiMeta2');
  const previewKpiLabel3 = document.getElementById('previewKpiLabel3');
  const previewKpiVal3 = document.getElementById('previewKpiVal3');
  const previewKpiMeta3 = document.getElementById('previewKpiMeta3');
  const previewChartTitle = document.getElementById('previewChartTitle');
  const previewChartLeadtime = document.getElementById('previewChartLeadtime');
  const previewSignalsList = document.getElementById('previewSignalsList');

  function updateIndustryPreview(industryKey) {
    const data = INDUSTRY_SCENARIOS[industryKey] || INDUSTRY_SCENARIOS.colleges;

    if (previewTenantBadge) previewTenantBadge.textContent = data.tenantBadge;
    if (previewHeading) previewHeading.textContent = data.heading;
    if (previewSubheading) previewSubheading.textContent = data.subheading;
    if (previewConfidenceBadge) previewConfidenceBadge.textContent = data.confidence;

    if (previewKpiLabel1) previewKpiLabel1.textContent = data.kpi1.label;
    if (previewKpiVal1) previewKpiVal1.textContent = data.kpi1.val;
    if (previewKpiMeta1) previewKpiMeta1.textContent = data.kpi1.meta;

    if (previewKpiLabel2) previewKpiLabel2.textContent = data.kpi2.label;
    if (previewKpiVal2) previewKpiVal2.textContent = data.kpi2.val;
    if (previewKpiMeta2) previewKpiMeta2.textContent = data.kpi2.meta;

    if (previewKpiLabel3) previewKpiLabel3.textContent = data.kpi3.label;
    if (previewKpiVal3) previewKpiVal3.textContent = data.kpi3.val;
    if (previewKpiMeta3) previewKpiMeta3.textContent = data.kpi3.meta;

    if (previewChartTitle) previewChartTitle.textContent = data.riskTitle;
    if (previewChartLeadtime) previewChartLeadtime.textContent = data.leadTime;

    if (previewSignalsList) {
      previewSignalsList.innerHTML = data.signals.map(s => `
        <div class="home-signal-row" style="animation: fadeIn 0.3s ease;">
          <div class="home-signal-left">
            <span class="home-signal-code font-mono">${s.code}</span>
            <span class="home-signal-desc">${s.desc}</span>
          </div>
          <span class="home-signal-badge home-badge-${s.dot}">${s.badge}</span>
        </div>
      `).join('');
    }

    // Update milestone tooltip data attributes on SVG points
    const points = document.querySelectorAll('.milestone-point');
    points.forEach((pt, idx) => {
      if (data.milestones[idx]) {
        pt.setAttribute('data-tip', data.milestones[idx].tip);
      }
    });
  }

  if (audiencePills.length > 0) {
    audiencePills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        audiencePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const industry = pill.getAttribute('data-industry');
        updateIndustryPreview(industry);
      });
    });
  }

  // 4. Interactive Live Telemetry Ticker Streaming
  const tickerContent = document.getElementById('homeTickerContent');
  let currentTickerIndex = 0;
  if (tickerContent) {
    setInterval(() => {
      currentTickerIndex = (currentTickerIndex + 1) % LIVE_TICKER_STREAM.length;
      const item = LIVE_TICKER_STREAM[currentTickerIndex];
      tickerContent.style.opacity = '0';
      tickerContent.style.transform = 'translateY(4px)';
      setTimeout(() => {
        tickerContent.innerHTML = `<span class="home-ticker-chip chip-${item.dot}"><b>${item.code}</b>: ${item.text}</span>`;
        tickerContent.style.opacity = '1';
        tickerContent.style.transform = 'translateY(0)';
      }, 200);
    }, 3800);
  }

  // 5. SVG Milestone Hover Tooltips
  const milestonePoints = document.querySelectorAll('.milestone-point');
  const trajectoryTooltip = document.getElementById('trajectoryTooltip');
  if (milestonePoints.length > 0 && trajectoryTooltip) {
    milestonePoints.forEach(pt => {
      pt.addEventListener('mouseenter', (e) => {
        const tipText = pt.getAttribute('data-tip');
        if (!tipText) return;
        trajectoryTooltip.textContent = tipText;
        trajectoryTooltip.style.display = 'block';
        trajectoryTooltip.style.opacity = '1';
      });

      pt.addEventListener('mouseleave', () => {
        trajectoryTooltip.style.opacity = '0';
        setTimeout(() => {
          if (trajectoryTooltip.style.opacity === '0') {
            trajectoryTooltip.style.display = 'none';
          }
        }, 150);
      });
    });
  }

  // 6. Interactive Guided Demo Tour Modal with Next/Prev Stage Controls
  const btnWatchDemo = document.getElementById('btnWatchDemo');
  const demoModal = document.getElementById('homeDemoModal');
  const demoClose = document.getElementById('homeDemoClose');
  const demoTabs = document.querySelectorAll('.demo-stage-tab');
  const demoPanels = document.querySelectorAll('.demo-stage-panel');
  const demoPrevBtn = document.getElementById('demoPrevBtn');
  const demoNextBtn = document.getElementById('demoNextBtn');

  let currentDemoStage = 1;
  const stageTitles = {
    1: '01. Ingestion',
    2: '02. Pattern Detection',
    3: '03. Risk Forecasting',
    4: '04. Prescriptive Action'
  };

  function setDemoStage(stageNum) {
    currentDemoStage = stageNum;

    // Update Tabs
    demoTabs.forEach(t => {
      const s = parseInt(t.getAttribute('data-stage'), 10);
      if (s === stageNum) {
        t.classList.add('active');
        t.style.background = 'var(--home-pale-aqua, #E8F6F6)';
        t.style.color = 'var(--home-primary-teal, #087E8B)';
        t.style.borderColor = 'rgba(8,126,139,0.3)';
      } else {
        t.classList.remove('active');
        t.style.background = '#FFFFFF';
        t.style.color = 'var(--home-text-body, #627D98)';
        t.style.borderColor = 'var(--home-border, #E2E8F0)';
      }
    });

    // Update Panels
    demoPanels.forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    const activePanel = document.getElementById('demoPanel_' + stageNum);
    if (activePanel) {
      activePanel.classList.add('active');
      activePanel.style.display = 'block';
    }

    // Update Next / Prev Buttons
    if (demoPrevBtn) {
      demoPrevBtn.style.display = (stageNum > 1) ? 'inline-flex' : 'none';
    }

    if (demoNextBtn) {
      if (stageNum < 4) {
        const nextTitle = stageTitles[stageNum + 1].split('. ')[1];
        demoNextBtn.textContent = `Next Stage: ${nextTitle} →`;
        demoNextBtn.style.display = 'inline-flex';
      } else {
        demoNextBtn.textContent = 'Explore Full Dashboard →';
        demoNextBtn.onclick = () => { window.location.href = 'dashboard.html'; };
      }
    }
  }

  if (demoPrevBtn) {
    demoPrevBtn.addEventListener('click', () => {
      if (currentDemoStage > 1) setDemoStage(currentDemoStage - 1);
    });
  }

  if (demoNextBtn) {
    demoNextBtn.addEventListener('click', () => {
      if (currentDemoStage < 4) {
        setDemoStage(currentDemoStage + 1);
      }
    });
  }

  if (demoTabs.length > 0) {
    demoTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const stage = parseInt(tab.getAttribute('data-stage'), 10);
        setDemoStage(stage);
      });
    });
  }

  if (btnWatchDemo && demoModal) {
    btnWatchDemo.addEventListener('click', (e) => {
      e.preventDefault();
      demoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setDemoStage(1);
    });
  }

  if (demoClose && demoModal) {
    demoClose.addEventListener('click', () => {
      demoModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        demoModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.classList.contains('active')) {
        demoModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 7. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, targetId);
      }
    });
  });
});
