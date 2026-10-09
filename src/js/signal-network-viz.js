/**
 * EarlySight — Signature Visual Identity: Early Warning Signal Network
 * 
 * Concept: Scattered Signals -> Connected Patterns -> Emerging Risk -> Early Action
 * Features:
 * - Animated SVG particle streams entering from multiple operational modalities
 * - Node clusters with interactive hover HUD cards
 * - Causal path illumination linking signals -> PAT-006 -> RSK-001 -> ACT-001
 * - Live Activity Telemetry Feed with real-time simulated telemetry pings
 * - Play/Pause and Simulation Speed controls
 * - Fully accessible and responsive with reduced-motion support
 */

export class EarlyWarningSignalNetwork {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = options;
    this.isPlaying = true;
    this.speed = 1.0;
    this.activeScenario = 'escalation'; // 'escalation', 'mitigation', 'stabilized'
    this.selectedNodeId = null;
    this.particles = [];
    this.animationFrame = null;
    this.eventTimer = null;

    // Core Network Nodes Data
    this.nodes = [
      // 1. Scattered Inflow Signals
      { id: 'SIG-031', label: 'SIG-031', type: 'signal', category: 'Moisture Probe', x: 70, y: 80, severity: 'critical', score: 88, location: 'Block A / Trench 4B', title: 'Sub-Slab Trench 4B Moisture Surge', desc: '+340% frequency surge over 72h' },
      { id: 'SIG-044', label: 'SIG-044', type: 'signal', category: 'Operator Log', x: 60, y: 220, severity: 'high', score: 76, location: 'Block A Floor', title: 'Localized Acoustic Hiss & Dampness', desc: 'Shift report note filed by G. Ramirez' },
      { id: 'SIG-012', label: 'SIG-012', type: 'signal', category: 'Maintenance Note', x: 80, y: 350, severity: 'medium', score: 62, location: 'Flange 4B-12', title: 'Viton Gasket Condensation Weep', desc: 'Minor stud rust observed during inspection' },
      { id: 'SIG-008', label: 'SIG-008', type: 'signal', category: 'Pressure Sensor', x: 190, y: 40, severity: 'medium', score: 58, location: 'Trench Line A', title: 'Line Differential Micro-Drop', desc: '0.42 PSI subtle uncalibrated drift' },
      
      // 2. Precursor Clusters
      { id: 'CLUS-4B', label: 'Cluster 4B', type: 'cluster', category: 'Spatial Cluster', x: 260, y: 160, severity: 'high', count: 5, location: '8.5m Radius Corridor', title: 'Trench 4B Hydraulic Micro-Convergence', desc: '4 disparate signals co-located in same trench conduit' },
      { id: 'CLUS-3B', label: 'Cluster 3B', type: 'cluster', category: 'Thermal Cluster', x: 240, y: 320, severity: 'medium', count: 3, location: 'Power Island Busbar', title: 'Switchgear Phase 3B Harmonic Drift', desc: 'Coincident phase load and thermal elevation' },

      // 3. Pattern Hub
      { id: 'PAT-006', label: 'PAT-006', type: 'pattern', category: 'Emerging Pattern', x: 440, y: 190, severity: 'high', confidence: '94.2%', location: 'Block A Infrastructure', title: 'Recurring Sub-Slab Joint Anomaly', desc: 'Matches past unmitigated trench flood signature with 94.2% coherence' },

      // 4. Emerging Risk Node
      { id: 'RSK-001', label: 'RSK-001', type: 'risk', category: 'Emerging Risk', x: 620, y: 200, severity: 'critical', score: 86, leadTime: '14.2 Days Lead', location: 'Block A Cleanroom Sub-Floor', title: 'Water Infrastructure Degradation', desc: 'P1 Immediate Hazard: $512,000 potential downtime averted' },

      // 5. Prescriptive Early Action Node
      { id: 'ACT-001', label: 'ACT-001', type: 'action', category: 'Pre-Emptive Action', x: 800, y: 200, severity: 'action', owner: 'Facilities Engineering', due: '20 Sep', location: 'Trench 4B Flange', title: 'Viton Gasket Replacement Order', desc: 'Work Order #WO-2026-7812 queued for scheduled shift turnaround' }
    ];

    // Causal Connections linking nodes
    this.connections = [
      { from: 'SIG-031', to: 'CLUS-4B', stream: 'signal-flow' },
      { from: 'SIG-044', to: 'CLUS-4B', stream: 'signal-flow' },
      { from: 'SIG-012', to: 'CLUS-4B', stream: 'signal-flow' },
      { from: 'SIG-008', to: 'CLUS-4B', stream: 'signal-flow' },
      { from: 'CLUS-4B', to: 'PAT-006', stream: 'cluster-flow' },
      { from: 'CLUS-3B', to: 'PAT-006', stream: 'secondary-flow' },
      { from: 'PAT-006', to: 'RSK-001', stream: 'risk-flow' },
      { from: 'RSK-001', to: 'ACT-001', stream: 'action-flow' }
    ];

    // Real-Time Activity Feed Log Items
    this.liveEvents = [
      { id: 'EV-101', time: '10:44:12', type: 'signal', target: 'SIG-031', text: 'Moisture probe Trench 4B logged micro-surge (+12.4% vs SLA)', level: 'critical' },
      { id: 'EV-102', time: '10:43:55', type: 'cluster', target: 'CLUS-4B', text: 'Cluster 4B spatial coherence updated: 4 streams converging within 8.5m', level: 'high' },
      { id: 'EV-103', time: '10:43:28', type: 'pattern', target: 'PAT-006', text: 'Pattern match confidence increased to 94.2% across 72h window', level: 'high' },
      { id: 'EV-104', time: '10:42:50', type: 'risk', target: 'RSK-001', text: 'RSK-001 score updated to 86 / 100 • Priority P1 Immediate assigned', level: 'critical' },
      { id: 'EV-105', time: '10:41:15', type: 'action', target: 'ACT-001', text: 'Action ACT-001 dispatched to Facilities Engineering (G. Ramirez)', level: 'action' }
    ];

    this.init();
  }

  init() {
    this.renderLayout();
    this.initParticles();
    this.bindEvents();
    this.startAnimationLoop();
    this.startLiveTelemetryFeed();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="es-signal-network-wrapper">
        <!-- Visual Header & Stage Status Bar -->
        <div class="es-network-header-bar font-mono">
          <div class="network-header-left">
            <span class="network-badge-live">
              <span class="network-live-dot"></span>
              <span>LIVE SIGNAL NETWORK</span>
            </span>
            <span class="network-concept-tag">
              Scattered Signals ➔ Connected Clusters ➔ Emerging Risk ➔ Early Action
            </span>
          </div>

          <div class="network-header-controls">
            <!-- Scenario Selector -->
            <div class="scenario-toggle-group" role="group" aria-label="Operational Scenario Mode">
              <button class="btn-scenario active" data-scenario="escalation" title="Active Precursor Escalation">Active Risk</button>
              <button class="btn-scenario" data-scenario="mitigation" title="Pre-Emptive Field Mitigation">Mitigation</button>
              <button class="btn-scenario" data-scenario="stabilized" title="Post-Action Baseline Restored">Stabilized</button>
            </div>

            <!-- Play / Pause & Speed -->
            <button class="btn-net-ctrl" id="btnNetPlayPause" title="Pause / Resume Particle Stream">
              <span class="icon-pause">⏸</span>
            </button>
            <button class="btn-net-ctrl" id="btnNetSpeed" title="Cycle Animation Speed">1x</button>
            <button class="btn-net-ctrl" id="btnNetReset" title="Reset Selection and Highlight">↺ Reset</button>
          </div>
        </div>

        <!-- Split Grid: SVG Network Stage (Left) + Live Telemetry Stream (Right) -->
        <div class="es-network-body-grid">
          
          <!-- Left: Interactive Animated SVG Canvas Stage -->
          <div class="es-network-stage-container" id="netStageContainer">
            <svg id="esNetworkSvg" viewBox="0 0 920 420" preserveAspectRatio="xMidYMid meet" class="es-network-svg">
              <defs>
                <!-- Radial Gradients for Node Glows -->
                <radialGradient id="gradSignalGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#EF7B7B" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#EF7B7B" stop-opacity="0"/>
                </radialGradient>
                <radialGradient id="gradClusterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#78C7C7" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#78C7C7" stop-opacity="0"/>
                </radialGradient>
                <radialGradient id="gradPatternGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#F2A65A" stop-opacity="0.4"/>
                  <stop offset="100%" stop-color="#F2A65A" stop-opacity="0"/>
                </radialGradient>
                <radialGradient id="gradRiskGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#EF7B7B" stop-opacity="0.5"/>
                  <stop offset="100%" stop-color="#EF7B7B" stop-opacity="0"/>
                </radialGradient>
                <radialGradient id="gradActionGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#72C6A5" stop-opacity="0.45"/>
                  <stop offset="100%" stop-color="#72C6A5" stop-opacity="0"/>
                </radialGradient>

                <!-- Arrowhead Marker for Action Flow -->
                <marker id="arrowHead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#72C6A5"/>
                </marker>
              </defs>

              <!-- Subtle Background Grid & Conduit Rails -->
              <g class="net-bg-grid" opacity="0.4">
                <line x1="30" y1="200" x2="890" y2="200" stroke="#E2E8F0" stroke-dasharray="4 4" stroke-width="1"/>
                <line x1="260" y1="40" x2="260" y2="380" stroke="#E2E8F0" stroke-dasharray="4 4" stroke-width="1"/>
                <line x1="440" y1="40" x2="440" y2="380" stroke="#E2E8F0" stroke-dasharray="4 4" stroke-width="1"/>
                <line x1="620" y1="40" x2="620" y2="380" stroke="#E2E8F0" stroke-dasharray="4 4" stroke-width="1"/>
                
                <!-- Stage Phase Labels Along Top -->
                <text x="75" y="22" font-family="'JetBrains Mono', monospace" font-size="9" fill="#94A3B8" font-weight="700">01. SCATTERED SIGNALS</text>
                <text x="250" y="22" font-family="'JetBrains Mono', monospace" font-size="9" fill="#94A3B8" font-weight="700">02. CLUSTER CONVERGENCE</text>
                <text x="430" y="22" font-family="'JetBrains Mono', monospace" font-size="9" fill="#94A3B8" font-weight="700">03. PATTERN DETECTION</text>
                <text x="605" y="22" font-family="'JetBrains Mono', monospace" font-size="9" fill="#94A3B8" font-weight="700">04. EMERGING RISK</text>
                <text x="785" y="22" font-family="'JetBrains Mono', monospace" font-size="9" fill="#94A3B8" font-weight="700">05. PREVENTIVE ACTION</text>
              </g>

              <!-- Connecting Causal Pathways Layer -->
              <g id="netConnectionsLayer" class="net-connections-layer"></g>

              <!-- Moving Particle Streams Layer -->
              <g id="netParticlesLayer" class="net-particles-layer"></g>

              <!-- Interactive Nodes Layer -->
              <g id="netNodesLayer" class="net-nodes-layer"></g>
            </svg>

            <!-- Floating Interactive HUD Popover (Appears on Hover / Selection) -->
            <div id="netNodeHud" class="net-node-hud" style="display:none;"></div>
          </div>

          <!-- Right: Compact Live Activity Telemetry Feed -->
          <div class="es-network-feed-panel">
            <div class="feed-panel-header font-mono">
              <div class="feed-header-title">
                <span class="live-dot-pulse"></span>
                <span>TELEMETRY STREAM</span>
              </div>
              <span class="feed-counter-badge" id="netFeedCount">5 Events</span>
            </div>

            <!-- Mini Risk Trajectory Indicator -->
            <div class="feed-risk-meter font-mono">
              <div class="risk-meter-top">
                <span class="text-muted text-xs">DYNAMIC RISK INDEX</span>
                <span class="risk-meter-score text-vermilion font-bold" id="netDynamicScore">86 / 100</span>
              </div>
              <div class="risk-meter-track">
                <div class="risk-meter-bar" id="netRiskMeterBar" style="width: 86%;"></div>
              </div>
              <div class="risk-meter-meta text-xs">
                <span class="text-teal">● 14.2d Lead Horizon</span>
                <span class="text-muted" id="netAvertedText">$512k Protected</span>
              </div>
            </div>

            <!-- Scrollable Real-Time Event Log -->
            <div class="feed-events-stream" id="netEventsStream" role="log" aria-live="polite">
              <!-- Rendered via JS -->
            </div>

            <!-- Feed Actions Footer -->
            <div class="feed-panel-footer font-mono">
              <span class="text-xs text-muted">Click any event to isolate path</span>
              <a href="signals.html" class="feed-deep-link">All Signals ↗</a>
            </div>
          </div>

        </div>
      </div>
    `;

    this.renderConnections();
    this.renderNodes();
    this.renderLiveFeed();
  }

  renderConnections() {
    const layer = document.getElementById('netConnectionsLayer');
    if (!layer) return;

    layer.innerHTML = this.connections.map(conn => {
      const fromNode = this.nodes.find(n => n.id === conn.from);
      const toNode = this.nodes.find(n => n.id === conn.to);
      if (!fromNode || !toNode) return '';

      // Curved Bézier path for aesthetic organic flow
      const dx = toNode.x - fromNode.x;
      const cp1x = fromNode.x + dx * 0.45;
      const cp1y = fromNode.y;
      const cp2x = fromNode.x + dx * 0.55;
      const cp2y = toNode.y;

      const pathData = `M ${fromNode.x} ${fromNode.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toNode.x} ${toNode.y}`;
      const isActionFlow = conn.stream === 'action-flow';

      return `
        <path id="path-${conn.from}-${conn.to}" 
              d="${pathData}" 
              class="net-wire ${conn.stream}" 
              data-from="${conn.from}" 
              data-to="${conn.to}"
              marker-end="${isActionFlow ? 'url(#arrowHead)' : ''}" />
      `;
    }).join('');
  }

  renderNodes() {
    const layer = document.getElementById('netNodesLayer');
    if (!layer) return;

    layer.innerHTML = this.nodes.map(node => {
      let r = 14;
      let haloRadius = 24;
      let glowFilter = 'gradSignalGlow';
      let strokeColor = '#EF7B7B';
      let fillColor = '#FFFFFF';

      if (node.type === 'cluster') {
        r = 18;
        haloRadius = 32;
        glowFilter = 'gradClusterGlow';
        strokeColor = '#78C7C7';
      } else if (node.type === 'pattern') {
        r = 20;
        haloRadius = 36;
        glowFilter = 'gradPatternGlow';
        strokeColor = '#F2A65A';
      } else if (node.type === 'risk') {
        r = 24;
        haloRadius = 44;
        glowFilter = 'gradRiskGlow';
        strokeColor = '#EF7B7B';
      } else if (node.type === 'action') {
        r = 22;
        haloRadius = 38;
        glowFilter = 'gradActionGlow';
        strokeColor = '#72C6A5';
      }

      return `
        <g class="net-node-group node-type-${node.type}" 
           id="nodeGroup-${node.id}" 
           data-node-id="${node.id}" 
           transform="translate(${node.x}, ${node.y})" 
           tabindex="0" 
           role="button" 
           aria-label="${node.label}: ${node.title}">
          
          <!-- Outer Radiant Halo -->
          <circle cx="0" cy="0" r="${haloRadius}" fill="url(#${glowFilter})" class="net-node-halo"/>
          
          <!-- Pulsing Ring -->
          <circle cx="0" cy="0" r="${r + 4}" class="net-node-pulse-ring" stroke="${strokeColor}" fill="none"/>
          
          <!-- Core Disc -->
          <circle cx="0" cy="0" r="${r}" class="net-node-core" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2.5"/>

          <!-- Center Icon / Number -->
          <text x="0" y="3.5" text-anchor="middle" class="net-node-inner-text font-mono" fill="${strokeColor}">
            ${node.type === 'cluster' ? 'C' : node.type === 'pattern' ? 'P' : node.type === 'risk' ? '!' : node.type === 'action' ? '✓' : '●'}
          </text>

          <!-- Label Below -->
          <text x="0" y="${r + 14}" text-anchor="middle" class="net-node-label font-mono">
            ${node.label}
          </text>
        </g>
      `;
    }).join('');
  }

  renderLiveFeed() {
    const stream = document.getElementById('netEventsStream');
    if (!stream) return;

    stream.innerHTML = this.liveEvents.map(evt => `
      <div class="feed-event-item" data-target-node="${evt.target}" data-event-id="${evt.id}">
        <div class="event-item-top font-mono">
          <span class="event-time">${evt.time}</span>
          <span class="event-tag tag-${evt.level}">${evt.target}</span>
        </div>
        <p class="event-desc font-sans">${evt.text}</p>
      </div>
    `).join('');
  }

  initParticles() {
    this.particles = [];
    const count = 16;

    for (let i = 0; i < count; i++) {
      // Pick a random connection to travel along
      const conn = this.connections[Math.floor(Math.random() * this.connections.length)];
      this.particles.push({
        from: conn.from,
        to: conn.to,
        progress: Math.random(),
        speed: (Math.random() * 0.003 + 0.002) * this.speed,
        color: conn.stream === 'action-flow' ? '#72C6A5' : conn.stream === 'risk-flow' ? '#EF7B7B' : conn.stream === 'pattern-flow' ? '#F2A65A' : '#78C7C7',
        size: Math.random() * 2 + 2.5
      });
    }
  }

  startAnimationLoop() {
    const svg = document.getElementById('esNetworkSvg');
    const particlesLayer = document.getElementById('netParticlesLayer');
    if (!svg || !particlesLayer) return;

    const animate = () => {
      if (this.isPlaying) {
        let particlesHtml = '';

        this.particles.forEach(p => {
          p.progress += p.speed * this.speed;
          if (p.progress >= 1.0) {
            p.progress = 0;
            // Re-assign random path occasionally
            const conn = this.connections[Math.floor(Math.random() * this.connections.length)];
            p.from = conn.from;
            p.to = conn.to;
          }

          const fromNode = this.nodes.find(n => n.id === p.from);
          const toNode = this.nodes.find(n => n.id === p.to);
          if (fromNode && toNode) {
            // Cubic Bézier calculation
            const dx = toNode.x - fromNode.x;
            const p0 = { x: fromNode.x, y: fromNode.y };
            const p1 = { x: fromNode.x + dx * 0.45, y: fromNode.y };
            const p2 = { x: fromNode.x + dx * 0.55, y: toNode.y };
            const p3 = { x: toNode.x, y: toNode.y };

            const t = p.progress;
            const u = 1 - t;
            const x = u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x;
            const y = u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y;

            particlesHtml += `
              <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${p.size}" fill="${p.color}" opacity="0.85" class="net-particle-dot" />
            `;
          }
        });

        particlesLayer.innerHTML = particlesHtml;
      }

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  startLiveTelemetryFeed() {
    let eventIdx = 0;
    const streamPool = [
      { target: 'SIG-031', text: 'Floor vibration dampening reading updated on Trench 4B flange', level: 'critical' },
      { target: 'CLUS-4B', text: 'Multi-modal cross-correlation cluster verified (+340% velocity)', level: 'high' },
      { target: 'RSK-001', text: 'Hazard escalation likelihood verified at 86% statistical certainty', level: 'critical' },
      { target: 'ACT-001', text: 'Field intervention status confirmed in Progress by Facilities lead', level: 'action' },
      { target: 'SIG-008', text: 'Auxiliary pressure transducer calibrated across line A', level: 'medium' }
    ];

    this.eventTimer = setInterval(() => {
      if (!this.isPlaying) return;

      const template = streamPool[eventIdx % streamPool.length];
      eventIdx++;

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const newEvt = {
        id: `EV-${Date.now().toString().slice(-4)}`,
        time: timeStr,
        type: 'telemetry',
        target: template.target,
        text: template.text,
        level: template.level
      };

      this.liveEvents.unshift(newEvt);
      if (this.liveEvents.length > 6) {
        this.liveEvents.pop();
      }

      this.renderLiveFeed();
      this.flashNode(template.target);
    }, 8500);
  }

  flashNode(nodeId) {
    const el = document.getElementById(`nodeGroup-${nodeId}`);
    if (el) {
      el.classList.add('node-flashing');
      setTimeout(() => el.classList.remove('node-flashing'), 1400);
    }
  }

  bindEvents() {
    // 1. Play / Pause
    const btnPlayPause = document.getElementById('btnNetPlayPause');
    if (btnPlayPause) {
      btnPlayPause.addEventListener('click', () => {
        this.isPlaying = !this.isPlaying;
        btnPlayPause.innerHTML = this.isPlaying ? '<span class="icon-pause">⏸</span>' : '<span class="icon-play">▶</span>';
        btnPlayPause.title = this.isPlaying ? 'Pause Particle Stream' : 'Resume Particle Stream';
      });
    }

    // 2. Speed Switcher
    const btnSpeed = document.getElementById('btnNetSpeed');
    if (btnSpeed) {
      btnSpeed.addEventListener('click', () => {
        this.speed = this.speed === 1.0 ? 2.0 : this.speed === 2.0 ? 0.5 : 1.0;
        btnSpeed.textContent = `${this.speed}x`;
      });
    }

    // 3. Reset Button
    const btnReset = document.getElementById('btnNetReset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.clearSelection();
      });
    }

    // 4. Scenario Mode Toggles
    const scenarioBtns = this.container.querySelectorAll('.btn-scenario');
    scenarioBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        scenarioBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const scenario = e.currentTarget.getAttribute('data-scenario');
        this.setScenario(scenario);
      });
    });

    // 5. Node Hover & Click Handlers
    const nodeGroups = this.container.querySelectorAll('.net-node-group');
    nodeGroups.forEach(grp => {
      const nodeId = grp.getAttribute('data-node-id');
      const node = this.nodes.find(n => n.id === nodeId);

      grp.addEventListener('mouseenter', (e) => {
        this.showNodeHud(node, e);
      });

      grp.addEventListener('mouseleave', () => {
        if (!this.selectedNodeId) {
          this.hideNodeHud();
        }
      });

      grp.addEventListener('click', () => {
        this.selectNode(nodeId);
      });
    });

    // 6. Live Feed Item Clicks
    const feedContainer = document.getElementById('netEventsStream');
    if (feedContainer) {
      feedContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.feed-event-item');
        if (item) {
          const targetNode = item.getAttribute('data-target-node');
          this.selectNode(targetNode);
        }
      });
    }
  }

  showNodeHud(node, evt) {
    const hud = document.getElementById('netNodeHud');
    if (!hud) return;

    hud.innerHTML = `
      <div class="hud-header font-mono">
        <span class="hud-id">${node.id}</span>
        <span class="hud-category">${node.category}</span>
        <span class="hud-severity-badge sev-${node.severity}">${node.severity ? node.severity.toUpperCase() : ''}</span>
      </div>
      <h4 class="hud-title">${node.title}</h4>
      <div class="hud-meta font-mono">📍 ${node.location}</div>
      <p class="hud-desc font-sans">${node.desc}</p>
      <div class="hud-action-row font-mono">
        ${node.type === 'signal' ? `<a href="signals.html?signalId=${node.id}" class="btn-hud-link">Inspect Signal Dossier ↗</a>` : ''}
        ${node.type === 'risk' ? `<a href="risks.html?riskId=${node.id}" class="btn-hud-link">Open Risk Manager ↗</a>` : ''}
        ${node.type === 'action' ? `<a href="actions.html" class="btn-hud-link">View Action Work Order ↗</a>` : ''}
        ${node.type === 'pattern' || node.type === 'cluster' ? `<a href="evidence.html" class="btn-hud-link">Examine Causal Evidence ↗</a>` : ''}
      </div>
    `;

    hud.style.display = 'block';
  }

  hideNodeHud() {
    const hud = document.getElementById('netNodeHud');
    if (hud) hud.style.display = 'none';
  }

  selectNode(nodeId) {
    this.selectedNodeId = nodeId;
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Highlight node and dim others
    this.container.querySelectorAll('.net-node-group').forEach(grp => {
      const id = grp.getAttribute('data-node-id');
      grp.classList.toggle('selected-node', id === nodeId);
      grp.classList.toggle('dimmed-node', id !== nodeId);
    });

    // Highlight connecting paths
    this.container.querySelectorAll('.net-wire').forEach(wire => {
      const from = wire.getAttribute('data-from');
      const to = wire.getAttribute('data-to');
      const isConnected = (from === nodeId || to === nodeId || (nodeId === 'RSK-001' && (from === 'PAT-006' || to === 'ACT-001')));
      wire.classList.toggle('wire-highlight', isConnected);
      wire.classList.toggle('wire-dimmed', !isConnected);
    });

    this.showNodeHud(node);
  }

  clearSelection() {
    this.selectedNodeId = null;
    this.container.querySelectorAll('.net-node-group').forEach(grp => {
      grp.classList.remove('selected-node', 'dimmed-node');
    });
    this.container.querySelectorAll('.net-wire').forEach(wire => {
      wire.classList.remove('wire-highlight', 'wire-dimmed');
    });
    this.hideNodeHud();
  }

  setScenario(scenario) {
    this.activeScenario = scenario;
    const scoreEl = document.getElementById('netDynamicScore');
    const barEl = document.getElementById('netRiskMeterBar');
    const avertedEl = document.getElementById('netAvertedText');

    if (scenario === 'escalation') {
      if (scoreEl) scoreEl.textContent = '86 / 100';
      if (barEl) barEl.style.width = '86%';
      if (avertedEl) avertedEl.textContent = '$512k Protected';
      this.speed = 1.0;
    } else if (scenario === 'mitigation') {
      if (scoreEl) scoreEl.textContent = '48 / 100 (Mitigating)';
      if (barEl) barEl.style.width = '48%';
      if (avertedEl) avertedEl.textContent = 'Gasket Swap In-Flight';
      this.speed = 1.3;
    } else if (scenario === 'stabilized') {
      if (scoreEl) scoreEl.textContent = '18 / 100 (Nominal)';
      if (barEl) barEl.style.width = '18%';
      if (avertedEl) avertedEl.textContent = 'Equilibrium Restored';
      this.speed = 0.6;
    }
  }

  destroy() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.eventTimer) clearInterval(this.eventTimer);
  }
}
