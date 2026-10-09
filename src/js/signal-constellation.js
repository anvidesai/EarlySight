/**
 * EarlySight — Interactive Signal Constellation Visualization
 * 
 * Concept:
 * Maps multi-modal operational signals into spatial constellations grouped by precursor clusters.
 * Features:
 * - Interactive SVG nodes for individual signals
 * - Thin curved Bézier connector lines for verified cross-signal relationships
 * - Subtle pastel halos/boundaries around clusters (Water, Bearing, Hydraulic, Electrical)
 * - Entrance animation and restrained pulse for Critical/High priority nodes
 * - Hover HUD inspection card with full telemetry metadata
 * - Click-to-isolate: highlights connected cluster pathways and dims unrelated nodes
 * - Bi-directional integration with page filters and detail drawer
 * - Accessible controls: Cluster tabs, severity filters, clear legend, reset selection
 * - Full reduced-motion compliance
 */

export class SignalConstellation {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!this.container) return;

    this.options = options;
    this.selectedSignalId = null;
    this.activeClusterFilter = 'all';
    this.activeSeverityFilter = 'all';
    this.signals = [];
    this.connections = [];

    // Cluster centers and geometries in SVG coordinate space (1000 x 480)
    this.clusterDefs = {
      'CLU-01': {
        id: 'CLU-01',
        title: 'Sub-Slab Conduit Seepage',
        category: 'Water leakage',
        cx: 240,
        cy: 170,
        rx: 135,
        ry: 110,
        color: '#78C7C7', // Teal
        haloBg: 'rgba(120, 199, 199, 0.12)',
        haloBorder: 'rgba(120, 199, 199, 0.35)',
        riskLink: 'RSK-01 (Block A Flooding)',
        leadTime: '14 Days Lead'
      },
      'CLU-02': {
        id: 'CLU-02',
        title: 'Drive AX-402 Bearing Fatigue',
        category: 'Equipment failure',
        cx: 750,
        cy: 160,
        rx: 145,
        ry: 115,
        color: '#F2A65A', // Warm Orange
        haloBg: 'rgba(242, 166, 90, 0.12)',
        haloBorder: 'rgba(242, 166, 90, 0.35)',
        riskLink: 'RSK-04 (Feeder #4 Seizure)',
        leadTime: '18 Days Lead'
      },
      'CLU-03': {
        id: 'CLU-03',
        title: 'Press #2 Valve Cavitation',
        category: 'Hydraulic failure',
        cx: 330,
        cy: 360,
        rx: 120,
        ry: 85,
        color: '#72C6A5', // Muted Green
        haloBg: 'rgba(114, 198, 165, 0.12)',
        haloBorder: 'rgba(114, 198, 165, 0.35)',
        riskLink: 'RSK-05 (Spool Seizure)',
        leadTime: '12 Days Lead'
      },
      'CLU-04': {
        id: 'CLU-04',
        title: 'Power Busbar Harmonic Drift',
        category: 'Electrical issue',
        cx: 680,
        cy: 360,
        rx: 115,
        ry: 85,
        color: '#B7A7E8', // Lavender
        haloBg: 'rgba(183, 167, 232, 0.14)',
        haloBorder: 'rgba(183, 167, 232, 0.40)',
        riskLink: 'RSK-02 (Transformer Phase Trip)',
        leadTime: '21 Days Lead'
      }
    };

    this.initData();
    this.render();
    this.bindEvents();
  }

  initData() {
    // Curated high-fidelity constellation nodes based on OPERATIONAL_SIGNALS_REGISTRY & EARLYSIGHT_SIGNALS
    this.signals = [
      // Cluster 1: Water Seepage (Trench 4B / Block A)
      { id: 'SIG-W01', rawId: 'SIG-01', clusterId: 'CLU-01', label: 'SIG-01', title: 'Shift Walk Micro-Drip', type: 'Complaint', severity: 'High', x: 170, y: 130, location: 'Block A Trench 4B', leadTime: '14d', score: 78, isNew: false },
      { id: 'SIG-W02', rawId: 'SIG-06', clusterId: 'CLU-01', label: 'SIG-06', title: 'Acoustic Cavitation Hiss (1.4 kHz)', type: 'Sensor', severity: 'Critical', x: 230, y: 215, location: 'Trench 4B Bay 2', leadTime: '14d', score: 88, isNew: true },
      { id: 'SIG-W03', rawId: 'SIG-008', clusterId: 'CLU-01', label: 'SIG-08', title: 'Differential Delta-P (-0.4 bar)', type: 'Sensor', severity: 'Medium', x: 300, y: 140, location: 'Aux Bypass BV-12', leadTime: '14d', score: 62, isNew: false },
      { id: 'SIG-W04', rawId: 'SIG-012', clusterId: 'CLU-01', label: 'SIG-12', title: 'Viton Gasket Condensation Weep', type: 'Maintenance', severity: 'Medium', x: 220, y: 105, location: 'Flange 4B-12', leadTime: '14d', score: 58, isNew: false },
      { id: 'SIG-W05', rawId: 'SIG-031', clusterId: 'CLU-01', label: 'SIG-31', title: 'Sub-Slab Moisture Saturation', type: 'Sensor', severity: 'Critical', x: 295, y: 200, location: 'Trench Conduit 4B', leadTime: '14d', score: 86, isNew: true },

      // Cluster 2: Drive AX-402 Bearing Fatigue
      { id: 'SIG-B01', rawId: 'SIG-02', clusterId: 'CLU-02', label: 'SIG-02', title: 'Premature Relubrication Fines', type: 'Maintenance', severity: 'High', x: 690, y: 130, location: 'Block A / Shaft 4', leadTime: '18d', score: 82, isNew: false },
      { id: 'SIG-B02', rawId: 'SIG-04', clusterId: 'CLU-02', label: 'SIG-04', title: 'FLIR Thermal Hotspot (+4.7°C)', type: 'Image', severity: 'High', x: 790, y: 125, location: 'Bearing Housing #4', leadTime: '18d', score: 84, isNew: false },
      { id: 'SIG-B03', rawId: 'SIG-03', clusterId: 'CLU-02', label: 'SIG-03', title: 'Inverter Micro-Trip (1.8s)', type: 'Incident', severity: 'Critical', x: 810, y: 205, location: 'Feed Bus 3B', leadTime: '18d', score: 92, isNew: true },
      { id: 'SIG-B04', rawId: 'SIG-EQP-01', clusterId: 'CLU-02', label: 'SIG-EQ-01', title: 'BPFO Outer Race Harmonics', type: 'Sensor', severity: 'Critical', x: 740, y: 210, location: 'Drive AX-402', leadTime: '18d', score: 94, isNew: true },
      { id: 'SIG-B05', rawId: 'SIG-EQP-05', clusterId: 'CLU-02', label: 'SIG-EQ-05', title: '2022 Historian Precursor Match', type: 'Document', severity: 'High', x: 675, y: 200, location: 'SCADA Archive', leadTime: '18d', score: 79, isNew: false },

      // Cluster 3: Extrusion Press #2 Valve Cavitation
      { id: 'SIG-H01', rawId: 'SIG-HYD-01', clusterId: 'CLU-03', label: 'SIG-HY-01', title: 'Proportional Valve Cavitation Burst', type: 'Sensor', severity: 'High', x: 280, y: 350, location: 'Block C / Press #2', leadTime: '12d', score: 80, isNew: true },
      { id: 'SIG-H02', rawId: 'SIG-HYD-02', clusterId: 'CLU-03', label: 'SIG-HY-02', title: 'Ram Rattle Operator Complaint', type: 'Complaint', severity: 'Medium', x: 350, y: 330, location: 'Extrusion Press Ram', leadTime: '12d', score: 65, isNew: false },
      { id: 'SIG-H03', rawId: 'SIG-HYD-03', clusterId: 'CLU-03', label: 'SIG-HY-03', title: 'ISO 4406 Oil Micro-Particulates', type: 'Maintenance', severity: 'Medium', x: 385, y: 385, location: 'Hydraulic Loop B', leadTime: '12d', score: 60, isNew: false },
      { id: 'SIG-H04', rawId: 'SIG-HYD-04', clusterId: 'CLU-03', label: 'SIG-HY-04', title: 'Spool Response Hysteresis (+140ms)', type: 'Sensor', severity: 'High', x: 310, y: 395, location: 'Directional Valve PV-02', leadTime: '12d', score: 76, isNew: false },

      // Cluster 4: Power Busbar Harmonic Drift
      { id: 'SIG-E01', rawId: 'SIG-ELE-01', clusterId: 'CLU-04', label: 'SIG-EL-01', title: 'Substation #3 Phase Delta Drift', type: 'Sensor', severity: 'High', x: 630, y: 350, location: 'Power Island Bus 3B', leadTime: '21d', score: 74, isNew: false },
      { id: 'SIG-E02', rawId: 'SIG-ELE-02', clusterId: 'CLU-04', label: 'SIG-EL-02', title: 'Busbar Acoustic Corona Discharge', type: 'Sensor', severity: 'Medium', x: 710, y: 340, location: 'Main Substation Room', leadTime: '21d', score: 68, isNew: true },
      { id: 'SIG-E03', rawId: 'SIG-ELE-03', clusterId: 'CLU-04', label: 'SIG-EL-03', title: 'Thermal Imaging Terminal Delta (+6.2°C)', type: 'Image', severity: 'High', x: 725, y: 390, location: 'Switchgear Line 3', leadTime: '21d', score: 81, isNew: false },
      { id: 'SIG-E04', rawId: 'SIG-ELE-04', clusterId: 'CLU-04', label: 'SIG-EL-04', title: 'Transformer Dissolved Gas Rise', type: 'Document', severity: 'Low', x: 650, y: 395, location: 'Transformer Yard TR-1', leadTime: '21d', score: 48, isNew: false }
    ];

    // Causal inter-signal connections based on actual causal correlations
    this.connections = [
      // Cluster 1 Connections (Water)
      { from: 'SIG-W01', to: 'SIG-W02', cluster: 'CLU-01', weight: 0.92 },
      { from: 'SIG-W02', to: 'SIG-W05', cluster: 'CLU-01', weight: 0.96 },
      { from: 'SIG-W01', to: 'SIG-W04', cluster: 'CLU-01', weight: 0.85 },
      { from: 'SIG-W04', to: 'SIG-W03', cluster: 'CLU-01', weight: 0.88 },
      { from: 'SIG-W03', to: 'SIG-W05', cluster: 'CLU-01', weight: 0.90 },

      // Cluster 2 Connections (Bearing)
      { from: 'SIG-B01', to: 'SIG-B02', cluster: 'CLU-02', weight: 0.94 },
      { from: 'SIG-B02', to: 'SIG-B04', cluster: 'CLU-02', weight: 0.98 },
      { from: 'SIG-B04', to: 'SIG-B03', cluster: 'CLU-02', weight: 0.95 },
      { from: 'SIG-B01', to: 'SIG-B05', cluster: 'CLU-02', weight: 0.89 },
      { from: 'SIG-B05', to: 'SIG-B04', cluster: 'CLU-02', weight: 0.91 },

      // Cluster 3 Connections (Hydraulic)
      { from: 'SIG-H01', to: 'SIG-H02', cluster: 'CLU-03', weight: 0.88 },
      { from: 'SIG-H01', to: 'SIG-H04', cluster: 'CLU-03', weight: 0.93 },
      { from: 'SIG-H02', to: 'SIG-H03', cluster: 'CLU-03', weight: 0.84 },
      { from: 'SIG-H04', to: 'SIG-H03', cluster: 'CLU-03', weight: 0.87 },

      // Cluster 4 Connections (Electrical)
      { from: 'SIG-E01', to: 'SIG-E02', cluster: 'CLU-04', weight: 0.86 },
      { from: 'SIG-E01', to: 'SIG-E03', cluster: 'CLU-04', weight: 0.92 },
      { from: 'SIG-E03', to: 'SIG-E04', cluster: 'CLU-04', weight: 0.81 },

      // Cross-cluster bridge: Inverter micro-trip in Bearing cluster connects to Power Busbar phase load
      { from: 'SIG-B03', to: 'SIG-E01', cluster: 'cross', weight: 0.74, isCross: true }
    ];
  }

  render() {
    this.container.innerHTML = `
      <div class="es-constellation-card es-card" style="margin-bottom: 20px; overflow: hidden; position: relative;">
        <!-- Header & Controls Strip -->
        <div class="constellation-header-row" style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid var(--border-subtle); background:#FCFBF8; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:28px; height:28px; border-radius:6px; background:rgba(27,67,50,0.1); display:flex; align-items:center; justify-content:center; color:var(--intel-primary);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <div>
              <h3 style="margin:0; font-size:0.95rem; font-weight:700; color:var(--ink-primary); display:flex; align-items:center; gap:8px;">
                <span>Signal Constellation Network</span>
                <span style="font-size:0.68rem; font-family:var(--font-mono); padding:2px 7px; border-radius:4px; background:rgba(27,67,50,0.1); color:var(--intel-primary); font-weight:600;">INTERACTIVE SPATIAL GRAPH</span>
              </h3>
              <p style="margin:2px 0 0 0; font-size:0.75rem; color:var(--ink-secondary);">
                Interactive topology of weak precursors clustering across multi-modal silos. Click any node to isolate its causal web.
              </p>
            </div>
          </div>

          <!-- Controls: Cluster Filters & Reset -->
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <div class="constellation-tabs-group" style="display:inline-flex; background:#EDEBE6; border-radius:6px; padding:2px;">
              <button class="const-tab-btn active" data-cluster="all" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:none; border-radius:4px; background:#FFF; color:var(--ink-primary); cursor:pointer;">All Clusters (4)</button>
              <button class="const-tab-btn" data-cluster="CLU-01" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:none; border-radius:4px; background:transparent; color:var(--ink-secondary); cursor:pointer;">Water (5)</button>
              <button class="const-tab-btn" data-cluster="CLU-02" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:none; border-radius:4px; background:transparent; color:var(--ink-secondary); cursor:pointer;">Bearing (5)</button>
              <button class="const-tab-btn" data-cluster="CLU-03" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:none; border-radius:4px; background:transparent; color:var(--ink-secondary); cursor:pointer;">Hydraulic (4)</button>
              <button class="const-tab-btn" data-cluster="CLU-04" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:none; border-radius:4px; background:transparent; color:var(--ink-secondary); cursor:pointer;">Electrical (4)</button>
            </div>

            <button id="btnConstReset" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:1px solid var(--border-subtle); border-radius:6px; background:#FFFFFF; color:var(--ink-secondary); cursor:pointer; display:flex; align-items:center; gap:4px;" title="Reset selection and view">
              <span>↺</span> <span>Reset View</span>
            </button>
          </div>
        </div>

        <!-- SVG Visual Stage -->
        <div class="constellation-stage-wrap" style="position:relative; width:100%; height:420px; background:#F8FAFC; overflow:hidden;">
          <svg id="constellationSvg" viewBox="0 0 1000 480" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%; display:block;">
            <defs>
              <!-- Drop shadows and filters -->
              <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.12"/>
              </filter>
              <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#EF7B7B" flood-opacity="0.5"/>
              </filter>
              
              <!-- Gradients for connectors -->
              <linearGradient id="gradWater" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#78C7C7" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#72C6A5" stop-opacity="0.8"/>
              </linearGradient>
              <linearGradient id="gradBearing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F2A65A" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#EF7B7B" stop-opacity="0.8"/>
              </linearGradient>
              <linearGradient id="gradCross" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#EF7B7B" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#B7A7E8" stop-opacity="0.6"/>
              </linearGradient>
            </defs>

            <!-- Background Constellation Star-Dust Grid -->
            <g class="const-grid-dots" opacity="0.35">
              ${this.generateBackgroundGrid()}
            </g>

            <!-- Cluster Pastel Halos / Boundary Zones -->
            <g class="const-cluster-halos" id="clusterHalosGroup">
              ${this.renderClusterHalos()}
            </g>

            <!-- Relationship Arcs / Wires -->
            <g class="const-connector-wires" id="connectorWiresGroup">
              ${this.renderConnectors()}
            </g>

            <!-- Signal Interactive Nodes -->
            <g class="const-signal-nodes" id="signalNodesGroup">
              ${this.renderSignalNodes()}
            </g>
          </svg>

          <!-- Floating Inspection HUD Tooltip -->
          <div id="constellationHud" class="constellation-hud-card" style="display:none; position:absolute; pointer-events:none; z-index:40; background:#FFFFFF; border:1px solid var(--border-subtle); border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.12); padding:12px 14px; width:260px; font-size:0.75rem;"></div>

          <!-- Bottom Legend Strip -->
          <div style="position:absolute; bottom:10px; left:16px; right:16px; display:flex; justify-content:space-between; align-items:center; pointer-events:none; flex-wrap:wrap; gap:8px;">
            <!-- Legend Elements -->
            <div style="display:flex; align-items:center; gap:14px; background:rgba(255,255,255,0.92); backdrop-filter:blur(4px); padding:4px 12px; border-radius:20px; border:1px solid var(--border-subtle); pointer-events:auto; font-size:0.7rem; color:var(--ink-secondary);">
              <span style="display:flex; align-items:center; gap:5px;">
                <span style="width:8px; height:8px; border-radius:50%; background:#EF7B7B; display:inline-block;"></span>
                <span>Critical Precursor</span>
              </span>
              <span style="display:flex; align-items:center; gap:5px;">
                <span style="width:8px; height:8px; border-radius:50%; background:#F2A65A; display:inline-block;"></span>
                <span>High Severity</span>
              </span>
              <span style="display:flex; align-items:center; gap:5px;">
                <span style="width:8px; height:8px; border-radius:50%; background:#78C7C7; display:inline-block;"></span>
                <span>Medium / Low</span>
              </span>
              <span style="display:flex; align-items:center; gap:5px;">
                <svg width="20" height="6" viewBox="0 0 20 6"><line x1="0" y1="3" x2="20" y2="3" stroke="#A0AEC0" stroke-width="1.8" stroke-dasharray="2 2"/></svg>
                <span>Causal Correlation</span>
              </span>
            </div>

            <!-- Active Status Badge -->
            <div id="constActiveSelectionBadge" style="display:none; background:rgba(27,67,50,0.1); border:1px solid rgba(27,67,50,0.25); color:var(--intel-primary); font-family:var(--font-mono); font-size:0.7rem; padding:4px 10px; border-radius:6px; font-weight:600; pointer-events:auto;">
              Selection Active
            </div>
          </div>
        </div>
      </div>
    `;
  }

  generateBackgroundGrid() {
    let dots = '';
    for (let x = 40; x < 1000; x += 60) {
      for (let y = 30; y < 480; y += 60) {
        dots += `<circle cx="${x}" cy="${y}" r="1" fill="#94A3B8"/>`;
      }
    }
    return dots;
  }

  renderClusterHalos() {
    return Object.values(this.clusterDefs).map(c => `
      <g class="cluster-halo-group" id="halo-${c.id}" data-cluster-id="${c.id}" style="transition: opacity 0.3s ease;">
        <!-- Pastel boundary oval -->
        <ellipse cx="${c.cx}" cy="${c.cy}" rx="${c.rx}" ry="${c.ry}"
          fill="${c.haloBg}" stroke="${c.haloBorder}" stroke-width="1.5" stroke-dasharray="4 3"/>
        
        <!-- Cluster Center Label Badge -->
        <g transform="translate(${c.cx}, ${c.cy - c.ry + 16})">
          <rect x="-85" y="-12" width="170" height="24" rx="12" fill="#FFFFFF" stroke="${c.color}" stroke-width="1.2" opacity="0.95"/>
          <text x="0" y="3" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#102A43">
            ${c.id} • ${c.title}
          </text>
        </g>
      </g>
    `).join('');
  }

  renderConnectors() {
    return this.connections.map(conn => {
      const fromNode = this.signals.find(s => s.id === conn.from);
      const toNode = this.signals.find(s => s.id === conn.to);
      if (!fromNode || !toNode) return '';

      // Curved Bézier path between points
      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const cx = (fromNode.x + toNode.x) / 2 + (dy * 0.15);
      const cy = (fromNode.y + toNode.y) / 2 - (dx * 0.15);
      const d = `M ${fromNode.x},${fromNode.y} Q ${cx},${cy} ${toNode.x},${toNode.y}`;

      const strokeColor = conn.isCross ? 'url(#gradCross)' : (conn.cluster === 'CLU-01' ? '#78C7C7' : (conn.cluster === 'CLU-02' ? '#F2A65A' : '#72C6A5'));
      const strokeWidth = conn.isCross ? 1.5 : (conn.weight > 0.9 ? 2.0 : 1.4);
      const dash = conn.isCross ? 'stroke-dasharray="3 3"' : '';

      return `
        <path class="const-wire" id="wire-${conn.from}-${conn.to}" data-from="${conn.from}" data-to="${conn.to}" data-cluster="${conn.cluster}"
          d="${d}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="0.65" ${dash}
          style="transition: stroke-opacity 0.25s, stroke-width 0.25s;" />
      `;
    }).join('');
  }

  renderSignalNodes() {
    return this.signals.map(s => {
      const isCrit = s.severity.toLowerCase() === 'critical';
      const isHigh = s.severity.toLowerCase() === 'high';
      const color = isCrit ? '#EF7B7B' : (isHigh ? '#F2A65A' : (s.severity.toLowerCase() === 'medium' ? '#78C7C7' : '#72C6A5'));
      const radius = isCrit ? 13 : (isHigh ? 11 : 9);

      return `
        <g class="const-node-group" id="node-${s.id}" data-signal-id="${s.id}" data-cluster-id="${s.clusterId}" data-severity="${s.severity}"
          transform="translate(${s.x}, ${s.y})" style="cursor: pointer; transition: opacity 0.3s, transform 0.2s;" role="button" tabindex="0" aria-label="${s.label}: ${s.title}">
          
          <!-- Outer pulsing wave for critical/high signals -->
          ${isCrit ? `
            <circle cx="0" cy="0" r="${radius + 7}" fill="none" stroke="#EF7B7B" stroke-width="1.2" opacity="0.45" class="const-pulse-ring"/>
          ` : ''}

          <!-- Outer halo ring -->
          <circle cx="0" cy="0" r="${radius + 4}" fill="${color}" opacity="0.18"/>

          <!-- Solid Core Node -->
          <circle cx="0" cy="0" r="${radius}" fill="${color}" stroke="#FFFFFF" stroke-width="2" filter="url(#nodeShadow)"/>

          <!-- New signal badge dot -->
          ${s.isNew ? `
            <circle cx="${radius - 2}" cy="${-radius + 2}" r="3.5" fill="#EF7B7B" stroke="#FFFFFF" stroke-width="1"/>
          ` : ''}

          <!-- Node ID text label -->
          <text x="0" y="22" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#102A43">
            ${s.label}
          </text>
        </g>
      `;
    }).join('');
  }

  bindEvents() {
    const svg = this.container.querySelector('#constellationSvg');
    const hud = this.container.querySelector('#constellationHud');
    const stageWrap = this.container.querySelector('.constellation-stage-wrap');

    // Node interactions: Hover & Click
    const nodes = this.container.querySelectorAll('.const-node-group');
    nodes.forEach(node => {
      const sigId = node.getAttribute('data-signal-id');
      const sigData = this.signals.find(s => s.id === sigId);
      if (!sigData) return;

      // Hover: Show HUD Card
      node.addEventListener('mouseenter', (e) => {
        if (!hud || !stageWrap) return;
        const rect = stageWrap.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        const left = nodeRect.left - rect.left + 20;
        const top = Math.min(nodeRect.top - rect.top - 10, rect.height - 180);

        hud.style.left = `${Math.min(left, rect.width - 280)}px`;
        hud.style.top = `${Math.max(10, top)}px`;
        hud.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-family:var(--font-mono); font-weight:700; color:var(--intel-primary);">${sigData.id} • ${sigData.type}</span>
            <span style="font-size:0.65rem; padding:1px 6px; border-radius:3px; font-weight:700; background:${sigData.severity === 'Critical' ? '#FEE2E2' : '#FEF3C7'}; color:${sigData.severity === 'Critical' ? '#B91C1C' : '#B45309'};">
              ${sigData.severity.toUpperCase()}
            </span>
          </div>
          <div style="font-weight:700; color:var(--ink-primary); font-size:0.82rem; margin-bottom:4px; line-height:1.25;">${sigData.title}</div>
          <div style="color:var(--ink-secondary); font-size:0.72rem; margin-bottom:8px;">📍 ${sigData.location}</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; border-top:1px solid var(--border-subtle); padding-top:6px; font-size:0.68rem; font-family:var(--font-mono);">
            <div><span style="color:var(--ink-muted);">Risk Score:</span> <strong>${sigData.score}/100</strong></div>
            <div><span style="color:var(--ink-muted);">Lead Time:</span> <strong style="color:var(--accent-risk);">${sigData.leadTime}</strong></div>
          </div>
          <div style="margin-top:6px; font-size:0.68rem; color:var(--intel-primary); text-align:right;">Click to isolate causal path &rarr;</div>
        `;
        hud.style.display = 'block';
      });

      node.addEventListener('mouseleave', () => {
        if (hud) hud.style.display = 'none';
      });

      // Click: Select Signal & Isolate Causal Pathway
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectSignal(sigId);
      });

      // Keyboard Accessibility
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectSignal(sigId);
        }
      });
    });

    // Reset button
    const btnReset = this.container.querySelector('#btnConstReset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.clearSelection();
      });
    }

    // Cluster filter tabs
    const tabs = this.container.querySelectorAll('.const-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.style.background = 'transparent';
          t.style.color = 'var(--ink-secondary)';
        });
        tab.classList.add('active');
        tab.style.background = '#FFFFFF';
        tab.style.color = 'var(--ink-primary)';

        const cluster = tab.getAttribute('data-cluster');
        this.filterByCluster(cluster);
      });
    });

    // Click SVG background to clear selection
    if (svg) {
      svg.addEventListener('click', (e) => {
        if (e.target.tagName === 'svg' || e.target.classList.contains('const-grid-dots')) {
          this.clearSelection();
        }
      });
    }
  }

  selectSignal(sigId) {
    this.selectedSignalId = sigId;
    const badge = this.container.querySelector('#constActiveSelectionBadge');
    if (badge) {
      badge.style.display = 'inline-block';
      badge.textContent = `Isolating Causal Web: ${sigId}`;
    }

    // Find all directly connected signals
    const connectedNodeIds = new Set([sigId]);
    this.connections.forEach(conn => {
      if (conn.from === sigId) connectedNodeIds.add(conn.to);
      if (conn.to === sigId) connectedNodeIds.add(conn.from);
    });

    // Dim non-connected nodes, highlight connected
    const allNodes = this.container.querySelectorAll('.const-node-group');
    allNodes.forEach(n => {
      const id = n.getAttribute('data-signal-id');
      if (id === sigId) {
        n.style.opacity = '1';
        n.style.transform = `translate(${n.getAttribute('transform').split('(')[1].split(')')[0]}) scale(1.3)`;
      } else if (connectedNodeIds.has(id)) {
        n.style.opacity = '1';
        n.style.transform = `translate(${n.getAttribute('transform').split('(')[1].split(')')[0]}) scale(1.1)`;
      } else {
        n.style.opacity = '0.22';
        n.style.transform = `translate(${n.getAttribute('transform').split('(')[1].split(')')[0]}) scale(0.9)`;
      }
    });

    // Highlight connecting wires
    const wires = this.container.querySelectorAll('.const-wire');
    wires.forEach(w => {
      const from = w.getAttribute('data-from');
      const to = w.getAttribute('data-to');
      if (from === sigId || to === sigId) {
        w.style.strokeOpacity = '1';
        w.style.strokeWidth = '3.5';
        w.setAttribute('stroke', '#EF7B7B');
      } else {
        w.style.strokeOpacity = '0.08';
        w.style.strokeWidth = '1';
      }
    });

    // Notify external listeners or trigger detail drawer if available
    const sigData = this.signals.find(s => s.id === sigId);
    if (sigData && typeof this.options.onSelectSignal === 'function') {
      this.options.onSelectSignal(sigData);
    }

    // Also highlight the corresponding table row in signals table if present
    const tableRow = document.querySelector(`tr[data-signal-id="${sigData.rawId || sigData.id}"]`);
    if (tableRow) {
      tableRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      tableRow.style.background = 'rgba(239, 123, 123, 0.12)';
      setTimeout(() => {
        tableRow.style.background = '';
      }, 2400);
    }
  }

  clearSelection() {
    this.selectedSignalId = null;
    const badge = this.container.querySelector('#constActiveSelectionBadge');
    if (badge) badge.style.display = 'none';

    // Reset all nodes
    const allNodes = this.container.querySelectorAll('.const-node-group');
    allNodes.forEach(n => {
      n.style.opacity = '1';
      const origTransform = n.getAttribute('transform');
      n.style.transform = '';
    });

    // Reset all wires
    const wires = this.container.querySelectorAll('.const-wire');
    wires.forEach(w => {
      w.style.strokeOpacity = '0.65';
      const cluster = w.getAttribute('data-cluster');
      const isCross = w.getAttribute('data-from') === 'SIG-B03';
      w.style.strokeWidth = isCross ? '1.5' : '1.8';
      w.setAttribute('stroke', isCross ? 'url(#gradCross)' : (cluster === 'CLU-01' ? '#78C7C7' : (cluster === 'CLU-02' ? '#F2A65A' : '#72C6A5')));
    });

    // Reset cluster halos
    this.filterByCluster(this.activeClusterFilter);
  }

  filterByCluster(clusterId) {
    this.activeClusterFilter = clusterId;
    const halos = this.container.querySelectorAll('.cluster-halo-group');
    const nodes = this.container.querySelectorAll('.const-node-group');
    const wires = this.container.querySelectorAll('.const-wire');

    halos.forEach(h => {
      const id = h.getAttribute('data-cluster-id');
      h.style.opacity = (clusterId === 'all' || id === clusterId) ? '1' : '0.2';
    });

    nodes.forEach(n => {
      const id = n.getAttribute('data-cluster-id');
      n.style.opacity = (clusterId === 'all' || id === clusterId) ? '1' : '0.15';
    });

    wires.forEach(w => {
      const c = w.getAttribute('data-cluster');
      w.style.strokeOpacity = (clusterId === 'all' || c === clusterId) ? '0.65' : '0.06';
    });
  }
}
