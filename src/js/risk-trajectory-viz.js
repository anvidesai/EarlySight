/**
 * EarlySight — Living Risk Trajectory Visualization
 * 
 * Concept:
 * Dynamic multi-horizon SVG risk trajectory across Low, Moderate, High, and Critical severity bands.
 * Features:
 * - Clear animated risk trajectory over time (T-28d to T-0 Today, plus 14-day projection)
 * - 4 Pastel severity bands (Low, Moderate, High, Critical)
 * - Milestones for precursor signal events pinned along the curve
 * - Pulsing current-risk marker (Score 86/100)
 * - Factor contribution decomposition panel (Velocity, Coherence, Modalities, Historical Template)
 * - Interactive scenario morphing: Escalating, Mitigating, Stabilized (with smooth transitions)
 * - Explicit Demo Simulation indicator & pause/play controls
 * - Reduced-motion compliance
 */

export class LivingRiskTrajectory {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!this.container) return;

    this.options = options;
    this.activeScenario = 'escalating'; // 'escalating', 'mitigating', 'stabilized'
    this.selectedEventId = null;

    // Scenarios data
    this.scenarios = {
      escalating: {
        id: 'escalating',
        label: 'Active Escalation (Unmitigated)',
        badge: 'ESCALATING HAZARD • +34% VELOCITY',
        badgeColor: '#EF7B7B',
        currentScore: 86,
        projectedScore: 94,
        leadTimeDays: '14 Days Lead Time Remaining',
        curvePath: 'M 60,250 C 180,245 280,230 400,185 C 520,140 640,95 760,70 C 840,55 900,42 940,35',
        areaPath: 'M 60,250 C 180,245 280,230 400,185 C 520,140 640,95 760,70 C 840,55 900,42 940,35 L 940,290 L 60,290 Z',
        currentX: 760,
        currentY: 70,
        strokeColor: '#EF7B7B',
        fillGrad: 'url(#gradEscalating)',
        narrative: '3 disparate precursor streams (Moisture, Acoustic, SCADA) converged within 8.5m radius. Precursor arrival interval compressed from 28h to 3.2h.'
      },
      mitigating: {
        id: 'mitigating',
        label: 'Mitigation Dispatched (Field WO Queued)',
        badge: 'INTERVENTION ACTIVE • FLATTENING',
        badgeColor: '#F2A65A',
        currentScore: 68,
        projectedScore: 42,
        leadTimeDays: 'Work Order #WO-89104 in Progress',
        curvePath: 'M 60,250 C 180,245 280,230 400,185 C 520,155 640,150 760,145 C 840,170 900,210 940,235',
        areaPath: 'M 60,250 C 180,245 280,230 400,185 C 520,155 640,150 760,145 C 840,170 900,210 940,235 L 940,290 L 60,290 Z',
        currentX: 760,
        currentY: 145,
        strokeColor: '#F2A65A',
        fillGrad: 'url(#gradMitigating)',
        narrative: 'Engineering staged replacement gasket and throttled line throughput by 15%. Precursor acoustic surge decelerating.'
      },
      stabilized: {
        id: 'stabilized',
        label: 'Post-Remediation Baseline Restored',
        badge: 'NORMAL BASELINE • HAZARD NEUTRALIZED',
        badgeColor: '#72C6A5',
        currentScore: 22,
        projectedScore: 18,
        leadTimeDays: 'Full Resolution Verified (Zero Precursors)',
        curvePath: 'M 60,250 C 180,252 280,250 400,248 C 520,252 640,255 760,258 C 840,260 900,262 940,264',
        areaPath: 'M 60,250 C 180,252 280,250 400,248 C 520,252 640,255 760,258 C 840,260 900,262 940,264 L 940,290 L 60,290 Z',
        currentX: 760,
        currentY: 258,
        strokeColor: '#72C6A5',
        fillGrad: 'url(#gradStabilized)',
        narrative: 'Post-fix hydrophone and differential pressure readings returned to factory nominal specifications across 48 continuous operational hours.'
      }
    };

    // Precursor events pinned along time axis
    this.events = [
      { id: 'EV-1', time: 'T-28d', x: 120, y: 248, title: 'SIG-008: Differential Drift', desc: '0.42 PSI subtle uncalibrated drift logged in SCADA', tag: 'SCADA Telemetry', sev: 'Low' },
      { id: 'EV-2', time: 'T-18d', x: 260, y: 236, title: 'SIG-012: Flange Weep', desc: 'Condensation seep noted during maintenance shift walk', tag: 'Shift Observation', sev: 'Medium' },
      { id: 'EV-3', time: 'T-14d', x: 400, y: 185, title: 'SIG-044: Acoustic Hiss', desc: '48 kHz acoustic burst and localized dampness reported', tag: 'Hydrophone Sensor', sev: 'High' },
      { id: 'EV-4', time: 'T-7d', x: 550, y: 135, title: 'PAT-006: Pattern Locked', desc: 'Coherence crossed 91.4% similarity with 2022 flood sequence', tag: 'Pattern Engine', sev: 'High' },
      { id: 'EV-5', time: 'T-2d', x: 670, y: 92, title: 'SIG-031: Moisture Surge', desc: '+340% moisture probe surge in sub-slab conduit 4B', tag: 'Edge Sensor Surge', sev: 'Critical' },
      { id: 'EV-6', time: 'Today', x: 760, y: 70, title: 'RSK-001: Active Alert', desc: 'Score 86/100 • Work Order #WO-89104 Dispatched', tag: 'Action Mandate', sev: 'Critical', isCurrent: true }
    ];

    // Factor weights contributing to score
    this.factors = [
      { name: 'Precursor Velocity', val: '+34%', weight: '35%', desc: 'Arrival interval compressed from 28h to 3.2h' },
      { name: 'Spatial Coherence', val: '91.4%', weight: '28%', desc: 'All 5 signals localized within 8.5m conduit corridor' },
      { name: 'Cross-Silo Modality', val: '4 Silos', weight: '22%', desc: 'Correlated across SCADA, Shift Logs, Hydrophones & Work Orders' },
      { name: 'Historical Similarity', val: '94.2%', weight: '15%', desc: 'Matches lead curve of Q3-2022 catastrophic outage' }
    ];

    this.render();
    this.bindEvents();
  }

  render() {
    const sc = this.scenarios[this.activeScenario];

    this.container.innerHTML = `
      <div class="es-risk-trajectory-card es-card" style="margin-bottom: 22px; overflow: hidden; position: relative;">
        <!-- Header Strip -->
        <div class="trajectory-header-row" style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid var(--border-subtle); background:#FCFBF8; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="status-dot-pulse" style="background:${sc.strokeColor};"></span>
              <h3 style="margin:0; font-size:0.95rem; font-weight:700; color:var(--ink-primary); display:flex; align-items:center; gap:8px;">
                <span>Living Risk Trajectory</span>
                <span id="trajBadgePill" style="font-size:0.68rem; font-family:var(--font-mono); padding:2px 8px; border-radius:4px; background:${sc.strokeColor}22; color:${sc.strokeColor}; font-weight:700;">
                  ${sc.badge}
                </span>
              </h3>
            </div>
            <p style="margin:2px 0 0 0; font-size:0.75rem; color:var(--ink-secondary);">
              Multi-horizon risk progression over 28-day surveillance window. Demonstrates predictive lead time prior to failure threshold.
            </p>
          </div>

          <!-- Scenario Switchers (Clearly Labeled Demo Simulation) -->
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:0.68rem; font-family:var(--font-mono); color:var(--ink-muted); text-transform:uppercase;">
              Trajectory Scenario:
            </span>
            <div class="traj-scenarios-group" style="display:inline-flex; background:#EDEBE6; border-radius:6px; padding:2px;">
              <button class="btn-traj-sc ${this.activeScenario === 'escalating' ? 'active' : ''}" data-scenario="escalating" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:none; border-radius:4px; cursor:pointer; background:${this.activeScenario === 'escalating' ? '#FFF' : 'transparent'}; color:var(--ink-primary);">Escalating</button>
              <button class="btn-traj-sc ${this.activeScenario === 'mitigating' ? 'active' : ''}" data-scenario="mitigating" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:none; border-radius:4px; cursor:pointer; background:${this.activeScenario === 'mitigating' ? '#FFF' : 'transparent'}; color:var(--ink-primary);">Mitigating</button>
              <button class="btn-traj-sc ${this.activeScenario === 'stabilized' ? 'active' : ''}" data-scenario="stabilized" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:none; border-radius:4px; cursor:pointer; background:${this.activeScenario === 'stabilized' ? '#FFF' : 'transparent'}; color:var(--ink-primary);">Stabilized</button>
            </div>
          </div>
        </div>

        <!-- Visual Body: SVG Chart (Left 70%) + Contributor Breakdown (Right 30%) -->
        <div style="display:grid; grid-template-columns: 2.3fr 1fr; gap:0; background:#FFFFFF;">
          
          <!-- Left: SVG Multi-Horizon Stage -->
          <div style="position:relative; padding:12px 14px 4px 14px; background:#F8FAFC; border-right:1px solid var(--border-subtle); overflow:hidden;">
            
            <svg id="riskTrajectorySvg" viewBox="0 0 960 320" preserveAspectRatio="xMidYMid meet" style="width:100%; height:270px; display:block;">
              <defs>
                <linearGradient id="gradEscalating" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#EF7B7B" stop-opacity="0.30"/>
                  <stop offset="100%" stop-color="#EF7B7B" stop-opacity="0.02"/>
                </linearGradient>
                <linearGradient id="gradMitigating" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#F2A65A" stop-opacity="0.30"/>
                  <stop offset="100%" stop-color="#F2A65A" stop-opacity="0.02"/>
                </linearGradient>
                <linearGradient id="gradStabilized" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#72C6A5" stop-opacity="0.30"/>
                  <stop offset="100%" stop-color="#72C6A5" stop-opacity="0.02"/>
                </linearGradient>
              </defs>

              <!-- Severity Bands Background Shading (Low, Moderate, High, Critical) -->
              <!-- Critical: Y 20 to 80 (Score 85 - 100) -->
              <rect x="60" y="20" width="880" height="60" fill="rgba(239, 123, 123, 0.08)" />
              <text x="68" y="36" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#B91C1C" opacity="0.8">CRITICAL BAND (85-100)</text>

              <!-- High: Y 80 to 150 (Score 70 - 84) -->
              <rect x="60" y="80" width="880" height="70" fill="rgba(242, 166, 90, 0.08)" />
              <text x="68" y="96" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#B45309" opacity="0.8">HIGH RISK BAND (70-84)</text>

              <!-- Moderate: Y 150 to 220 (Score 40 - 69) -->
              <rect x="60" y="150" width="880" height="70" fill="rgba(120, 199, 199, 0.08)" />
              <text x="68" y="166" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#0D9488" opacity="0.8">MODERATE BAND (40-69)</text>

              <!-- Low / Safe Baseline: Y 220 to 290 (Score 0 - 39) -->
              <rect x="60" y="220" width="880" height="70" fill="rgba(114, 198, 165, 0.08)" />
              <text x="68" y="236" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#15803D" opacity="0.8">LOW / NOMINAL BAND (0-39)</text>

              <!-- Grid Horizontal Reference Lines -->
              <line x1="60" y1="20" x2="940" y2="20" stroke="#E2E8F0" stroke-width="1"/>
              <line x1="60" y1="80" x2="940" y2="80" stroke="#EF7B7B" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
              <line x1="60" y1="150" x2="940" y2="150" stroke="#F2A65A" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
              <line x1="60" y1="220" x2="940" y2="220" stroke="#78C7C7" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
              <line x1="60" y1="290" x2="940" y2="290" stroke="#E2E8F0" stroke-width="1"/>

              <!-- Vertical Time Grid Lines -->
              <line x1="60" y1="20" x2="60" y2="290" stroke="#CBD5E1" stroke-width="1.2"/>
              <line x1="260" y1="20" x2="260" y2="290" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2 2"/>
              <line x1="460" y1="20" x2="460" y2="290" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2 2"/>
              <line x1="660" y1="20" x2="660" y2="290" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2 2"/>
              
              <!-- Today Divider Line (T-0) -->
              <line x1="760" y1="20" x2="760" y2="290" stroke="#102A43" stroke-width="1.8" stroke-dasharray="4 2"/>
              <text x="760" y="14" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#102A43">TODAY (T-0)</text>

              <!-- Forecast Shading Boundary (T-0 to T+14d) -->
              <rect x="760" y="20" width="180" height="270" fill="rgba(241, 245, 249, 0.45)"/>
              <text x="850" y="14" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="600" fill="#64748B">FORECAST HORIZON (+14d)</text>

              <!-- Area Fill Under Curve -->
              <path id="trajAreaPath" d="${sc.areaPath}" fill="${sc.fillGrad}" style="transition: d 0.5s ease;"/>

              <!-- Trajectory Curve -->
              <path id="trajCurvePath" d="${sc.curvePath}" fill="none" stroke="${sc.strokeColor}" stroke-width="3" stroke-linecap="round" style="transition: d 0.5s ease, stroke 0.4s ease;"/>

              <!-- Pinned Precursor Signal Events -->
              <g class="traj-event-markers">
                ${this.renderEventMarkers()}
              </g>

              <!-- Current Risk Marker Point with Pulsing Ring -->
              <g id="currentRiskMarker" transform="translate(${sc.currentX}, ${sc.currentY})" style="transition: transform 0.5s ease;">
                <circle cx="0" cy="0" r="16" fill="none" stroke="${sc.strokeColor}" stroke-width="1.5" opacity="0.45" class="const-pulse-ring"/>
                <circle cx="0" cy="0" r="8" fill="${sc.strokeColor}" stroke="#FFFFFF" stroke-width="2.5" filter="url(#nodeShadow)"/>
                <text x="0" y="-14" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="800" fill="${sc.strokeColor}">
                  Score ${sc.currentScore}
                </text>
              </g>

              <!-- X-Axis Labels -->
              <text x="60" y="306" font-family="'JetBrains Mono', monospace" font-size="9" fill="#64748B">T-28d</text>
              <text x="260" y="306" font-family="'JetBrains Mono', monospace" font-size="9" fill="#64748B">T-21d</text>
              <text x="460" y="306" font-family="'JetBrains Mono', monospace" font-size="9" fill="#64748B">T-14d</text>
              <text x="660" y="306" font-family="'JetBrains Mono', monospace" font-size="9" fill="#64748B">T-7d</text>
              <text x="760" y="306" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#102A43">Today</text>
              <text x="850" y="306" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" fill="#64748B">+7d</text>
              <text x="940" y="306" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="9" fill="#64748B">+14d</text>
            </svg>

            <!-- Event Tooltip Floating Card -->
            <div id="trajEventTooltip" style="display:none; position:absolute; pointer-events:none; z-index:30; background:#FFFFFF; border:1px solid var(--border-subtle); border-radius:6px; box-shadow:0 6px 18px rgba(0,0,0,0.1); padding:8px 12px; width:220px; font-size:0.72rem;"></div>

          </div>

          <!-- Right: Contributing Factor Decomposition Panel -->
          <div style="padding:16px 18px; display:flex; flex-direction:column; justify-content:space-between; background:#FCFBF8;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
                <span style="font-size:0.68rem; font-family:var(--font-mono); text-transform:uppercase; color:var(--ink-muted); font-weight:700;">Active Threat Score</span>
                <span id="trajScoreVal" style="font-size:1.45rem; font-family:var(--font-mono); font-weight:800; color:${sc.strokeColor};">${sc.currentScore}<span style="font-size:0.8rem; color:var(--ink-muted); font-weight:500;">/100</span></span>
              </div>
              <div id="trajLeadTime" style="font-size:0.72rem; font-family:var(--font-mono); color:var(--ink-secondary); margin-bottom:12px; padding:3px 8px; background:#EDEBE6; border-radius:4px; display:inline-block;">
                ⏱️ ${sc.leadTimeDays}
              </div>

              <!-- Factor Weights Grid -->
              <div style="font-size:0.72rem; font-weight:700; color:var(--ink-primary); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.4px;">
                Score Contributors:
              </div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${this.factors.map(f => `
                  <div style="background:#FFFFFF; border:1px solid var(--border-subtle); border-radius:6px; padding:8px 10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                      <span style="font-size:0.74rem; font-weight:600; color:var(--ink-primary);">${f.name}</span>
                      <span style="font-family:var(--font-mono); font-size:0.72rem; font-weight:700; color:var(--intel-primary);">${f.val}</span>
                    </div>
                    <div style="font-size:0.68rem; color:var(--ink-muted); line-height:1.25;">${f.desc}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Narrative Note -->
            <div style="margin-top:14px; padding-top:10px; border-top:1px solid var(--border-subtle); font-size:0.72rem; color:var(--ink-secondary); line-height:1.4;">
              <strong style="color:var(--ink-primary); display:block; margin-bottom:2px;">Operational Assessment:</strong>
              <span id="trajNarrativeText">${sc.narrative}</span>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  renderEventMarkers() {
    return this.events.map(ev => {
      if (ev.isCurrent) return ''; // Rendered separately
      const isCrit = ev.sev === 'Critical';
      const isHigh = ev.sev === 'High';
      const color = isCrit ? '#EF7B7B' : (isHigh ? '#F2A65A' : '#78C7C7');

      return `
        <g class="traj-event-marker" data-event-id="${ev.id}" transform="translate(${ev.x}, ${ev.y})" style="cursor:pointer;" role="button" tabindex="0">
          <!-- Stem down to event point -->
          <circle cx="0" cy="0" r="5" fill="${color}" stroke="#FFFFFF" stroke-width="1.8"/>
          <!-- Event label flag -->
          <line x1="0" y1="-5" x2="0" y2="-18" stroke="${color}" stroke-width="1.2"/>
          <circle cx="0" cy="-18" r="3" fill="#FFFFFF" stroke="${color}" stroke-width="1.2"/>
        </g>
      `;
    }).join('');
  }

  bindEvents() {
    const scBtns = this.container.querySelectorAll('.btn-traj-sc');
    scBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const scenario = btn.getAttribute('data-scenario');
        this.switchScenario(scenario);
      });
    });

    // Event tooltips
    const tooltip = this.container.querySelector('#trajEventTooltip');
    const markers = this.container.querySelectorAll('.traj-event-marker');
    markers.forEach(m => {
      const evId = m.getAttribute('data-event-id');
      const ev = this.events.find(e => e.id === evId);
      if (!ev || !tooltip) return;

      m.addEventListener('mouseenter', (e) => {
        const rect = this.container.getBoundingClientRect();
        const mRect = m.getBoundingClientRect();
        tooltip.style.left = `${mRect.left - rect.left - 30}px`;
        tooltip.style.top = `${mRect.top - rect.top - 80}px`;
        tooltip.innerHTML = `
          <div style="display:flex; justify-content:space-between; margin-bottom:3px; font-family:var(--font-mono); font-size:0.68rem; font-weight:700; color:var(--intel-primary);">
            <span>${ev.time}</span>
            <span style="color:${ev.sev === 'Critical' ? '#B91C1C' : '#B45309'};">${ev.sev}</span>
          </div>
          <div style="font-weight:700; color:var(--ink-primary); font-size:0.78rem; margin-bottom:2px;">${ev.title}</div>
          <div style="color:var(--ink-secondary); font-size:0.7rem; line-height:1.3;">${ev.desc}</div>
        `;
        tooltip.style.display = 'block';
      });

      m.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  }

  switchScenario(scKey) {
    if (!this.scenarios[scKey]) return;
    this.activeScenario = scKey;
    const sc = this.scenarios[scKey];

    // Update buttons
    const btns = this.container.querySelectorAll('.btn-traj-sc');
    btns.forEach(b => {
      const match = b.getAttribute('data-scenario') === scKey;
      b.style.background = match ? '#FFFFFF' : 'transparent';
      b.classList.toggle('active', match);
    });

    // Update paths smoothly
    const curve = this.container.querySelector('#trajCurvePath');
    const area = this.container.querySelector('#trajAreaPath');
    const marker = this.container.querySelector('#currentRiskMarker');
    const badge = this.container.querySelector('#trajBadgePill');
    const scoreVal = this.container.querySelector('#trajScoreVal');
    const leadTime = this.container.querySelector('#trajLeadTime');
    const narrative = this.container.querySelector('#trajNarrativeText');

    if (curve) {
      curve.setAttribute('d', sc.curvePath);
      curve.setAttribute('stroke', sc.strokeColor);
    }
    if (area) {
      area.setAttribute('d', sc.areaPath);
      area.setAttribute('fill', sc.fillGrad);
    }
    if (marker) {
      marker.setAttribute('transform', `translate(${sc.currentX}, ${sc.currentY})`);
      const scoreTxt = marker.querySelector('text');
      if (scoreTxt) {
        scoreTxt.textContent = `Score ${sc.currentScore}`;
        scoreTxt.setAttribute('fill', sc.strokeColor);
      }
      const circles = marker.querySelectorAll('circle');
      if (circles[0]) circles[0].setAttribute('stroke', sc.strokeColor);
      if (circles[1]) circles[1].setAttribute('fill', sc.strokeColor);
    }
    if (badge) {
      badge.textContent = sc.badge;
      badge.style.background = `${sc.strokeColor}22`;
      badge.style.color = sc.strokeColor;
    }
    if (scoreVal) {
      scoreVal.innerHTML = `${sc.currentScore}<span style="font-size:0.8rem; color:var(--ink-muted); font-weight:500;">/100</span>`;
      scoreVal.style.color = sc.strokeColor;
    }
    if (leadTime) {
      leadTime.textContent = `⏱️ ${sc.leadTimeDays}`;
    }
    if (narrative) {
      narrative.textContent = sc.narrative;
    }
  }
}
