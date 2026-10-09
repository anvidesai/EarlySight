/**
 * EarlySight — Interactive Forensic Relationship Graph
 * 
 * Investigation Map Visual Structure:
 * - Central Emerging-Risk Node
 * - Supporting evidence and signal nodes positioned radially
 * - Visually distinct styles:
 *    • Solid teal lines for Observed Empirical Facts
 *    • Dashed lavender lines for AI-Generated Hypotheses
 * - Compact evidence-strength indicators (supported by real data metrics)
 * - Click-to-inspect opens existing source drawer
 * - Filter toggle: All Relationships, Observed Facts Only, AI Hypotheses Only
 * - Reset view control & comprehensive legend
 */

export class EvidenceRelationshipGraph {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!this.container) return;

    this.options = options;
    this.selectedNodeId = null;
    this.activeFilter = 'all'; // 'all', 'observed', 'hypothesis'

    // Central Risk and Radial Evidence Nodes
    this.centralRisk = {
      id: 'RSK-001',
      title: 'Water Infrastructure Degradation',
      severity: 'Critical (86/100)',
      leadTime: '14.2 Days Lead',
      location: 'Block A / Trench 4B',
      color: '#EF7B7B',
      cx: 460,
      cy: 180,
      r: 34
    };

    this.nodes = [
      // Observed Empirical Facts (Solid Teal / Green)
      {
        id: 'EVD-01',
        title: 'Floor Cavitation Acoustic Log',
        kind: 'observed',
        category: 'Acoustic Sensor',
        metric: '1.4 kHz Hiss',
        strength: '94% Empirical',
        color: '#78C7C7',
        x: 170,
        y: 80,
        r: 22,
        desc: 'Direct hydrophone physical recording at Trench 4B Bay 2'
      },
      {
        id: 'EVD-02',
        title: 'Flange 4B-12 Weep Inspection',
        kind: 'observed',
        category: 'Maintenance Ticket',
        metric: 'Fluid Weepage',
        strength: '88% Empirical',
        color: '#F2A65A',
        x: 160,
        y: 280,
        r: 22,
        desc: 'Manual work order inspection logged by tech R. Kowalski'
      },
      {
        id: 'EVD-03',
        title: 'SCADA Delta-P Micro-Drop',
        kind: 'observed',
        category: 'SCADA Telemetry',
        metric: '-0.4 bar delta',
        strength: '92% Empirical',
        color: '#72C6A5',
        x: 750,
        y: 80,
        r: 22,
        desc: 'Continuous edge differential pressure sensor telemetry'
      },
      // AI Generated Hypotheses (Dashed Lavender)
      {
        id: 'HYP-01',
        title: 'Joint Fatigue Micro-Crack Model',
        kind: 'hypothesis',
        category: 'Graph-Neural Inference',
        metric: '91.4% Match',
        strength: '86% Probabilistic',
        color: '#B7A7E8',
        x: 750,
        y: 280,
        r: 22,
        desc: 'Algorithmic structural synthesis matching 2022 flood sequence'
      },
      {
        id: 'HYP-02',
        title: 'Arrival Velocity Surge Projection',
        kind: 'hypothesis',
        category: 'Temporal Forecast',
        metric: '+340% Accel',
        strength: '91% Probabilistic',
        color: '#B7A7E8',
        x: 460,
        y: 330,
        r: 22,
        desc: 'Exponential arrival interval compression from 28h down to 3.2h'
      }
    ];

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="es-evidence-graph-card es-card" style="margin-bottom: 22px; overflow: hidden; position: relative;">
        <!-- Header Strip & Filters -->
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 18px; border-bottom:1px solid var(--border-subtle); background:#FCFBF8; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="margin:0; font-size:0.95rem; font-weight:700; color:var(--ink-primary); display:flex; align-items:center; gap:8px;">
              <span>Forensic Investigation Relationship Map</span>
              <span style="font-size:0.68rem; font-family:var(--font-mono); padding:2px 8px; border-radius:4px; background:rgba(27,67,50,0.1); color:var(--intel-primary); font-weight:700;">
                RADIAL CAUSAL GRAPH
              </span>
            </h3>
            <p style="margin:2px 0 0 0; font-size:0.75rem; color:var(--ink-secondary);">
              Distinguishes hard physical observations from probabilistic AI hypotheses supporting RSK-001.
            </p>
          </div>

          <!-- Filter Mode & Reset -->
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <div class="evidence-filter-tabs" style="display:inline-flex; background:#EDEBE6; border-radius:6px; padding:2px;">
              <button class="ev-filter-btn active" data-filter="all" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:none; border-radius:4px; background:#FFF; color:var(--ink-primary); cursor:pointer;">All Connections (5)</button>
              <button class="ev-filter-btn" data-filter="observed" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:none; border-radius:4px; background:transparent; color:var(--ink-secondary); cursor:pointer;">Observed Facts (3)</button>
              <button class="ev-filter-btn" data-filter="hypothesis" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:none; border-radius:4px; background:transparent; color:var(--ink-secondary); cursor:pointer;">AI Hypotheses (2)</button>
            </div>

            <button id="btnEvReset" style="padding:4px 10px; font-size:0.72rem; font-weight:600; border:1px solid var(--border-subtle); border-radius:6px; background:#FFF; color:var(--ink-secondary); cursor:pointer;" title="Reset view">
              ↺ Reset
            </button>
          </div>
        </div>

        <!-- SVG Investigation Stage -->
        <div style="position:relative; width:100%; height:380px; background:#F8FAFC; overflow:hidden;">
          <svg id="evidenceInvestSvg" viewBox="0 0 920 380" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%; display:block;">
            <defs>
              <filter id="evShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.12"/>
              </filter>
            </defs>

            <!-- Radial Background Range Rings -->
            <circle cx="${this.centralRisk.cx}" cy="${this.centralRisk.cy}" r="140" fill="none" stroke="#E2E8F0" stroke-width="1.2" stroke-dasharray="4 4"/>
            <circle cx="${this.centralRisk.cx}" cy="${this.centralRisk.cy}" r="220" fill="none" stroke="#E2E8F0" stroke-width="1.2" stroke-dasharray="4 4"/>

            <!-- Connector Lines (Solid for Observed, Dashed for Hypothesis) -->
            <g id="evidenceWiresGroup">
              ${this.renderWires()}
            </g>

            <!-- Radial Evidence Nodes -->
            <g id="evidenceNodesGroup">
              ${this.renderNodes()}
            </g>

            <!-- Central Emerging-Risk Node -->
            <g id="centralRiskNode" transform="translate(${this.centralRisk.cx}, ${this.centralRisk.cy})" style="cursor:pointer;">
              <!-- Outer pulse -->
              <circle cx="0" cy="0" r="${this.centralRisk.r + 12}" fill="none" stroke="${this.centralRisk.color}" stroke-width="1.5" opacity="0.45" class="const-pulse-ring"/>
              <circle cx="0" cy="0" r="${this.centralRisk.r + 5}" fill="${this.centralRisk.color}" opacity="0.15"/>
              <circle cx="0" cy="0" r="${this.centralRisk.r}" fill="${this.centralRisk.color}" stroke="#FFFFFF" stroke-width="2.5" filter="url(#evShadow)"/>
              
              <text x="0" y="-4" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="800" fill="#FFFFFF">
                RSK-001
              </text>
              <text x="0" y="10" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8" font-weight="600" fill="#FFFFFF">
                CENTRAL RISK
              </text>
            </g>
          </svg>

          <!-- Floating Inspection HUD Card -->
          <div id="evGraphHud" style="display:none; position:absolute; pointer-events:none; z-index:30; background:#FFFFFF; border:1px solid var(--border-subtle); border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,0.12); padding:10px 12px; width:240px; font-size:0.74rem;"></div>

          <!-- Bottom Legend Strip -->
          <div style="position:absolute; bottom:10px; left:16px; right:16px; display:flex; justify-content:space-between; align-items:center; pointer-events:none; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:14px; background:rgba(255,255,255,0.92); backdrop-filter:blur(4px); padding:4px 12px; border-radius:20px; border:1px solid var(--border-subtle); pointer-events:auto; font-size:0.7rem; color:var(--ink-secondary);">
              <span style="display:flex; align-items:center; gap:5px;">
                <svg width="24" height="6"><line x1="0" y1="3" x2="24" y2="3" stroke="#78C7C7" stroke-width="2.5"/></svg>
                <span>Observed Physical Fact (Empirical)</span>
              </span>
              <span style="display:flex; align-items:center; gap:5px;">
                <svg width="24" height="6"><line x1="0" y1="3" x2="24" y2="3" stroke="#B7A7E8" stroke-width="2" stroke-dasharray="4 3"/></svg>
                <span>AI Probabilistic Hypothesis</span>
              </span>
              <span style="display:flex; align-items:center; gap:5px;">
                <span style="width:8px; height:8px; border-radius:50%; background:#EF7B7B; display:inline-block;"></span>
                <span>Central Focal Hazard</span>
              </span>
            </div>

            <div id="evSelectionBadge" style="display:none; background:rgba(27,67,50,0.1); border:1px solid rgba(27,67,50,0.25); color:var(--intel-primary); font-family:var(--font-mono); font-size:0.7rem; padding:4px 10px; border-radius:6px; font-weight:600; pointer-events:auto;">
              Isolating Link
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderWires() {
    const rx = this.centralRisk.cx;
    const ry = this.centralRisk.cy;

    return this.nodes.map(n => {
      const isObserved = n.kind === 'observed';
      const strokeColor = isObserved ? n.color : '#B7A7E8';
      const dash = isObserved ? 'none' : 'stroke-dasharray="5 4"';
      const width = isObserved ? 2.2 : 1.8;

      // Curved Bézier path
      const midX = (n.x + rx) / 2;
      const midY = (n.y + ry) / 2 + (n.y < ry ? -15 : 15);
      const d = `M ${n.x},${n.y} Q ${midX},${midY} ${rx},${ry}`;

      return `
        <path class="ev-wire" id="evWire-${n.id}" data-node-id="${n.id}" data-kind="${n.kind}"
          d="${d}" fill="none" stroke="${strokeColor}" stroke-width="${width}" ${dash} opacity="0.65"
          style="transition: stroke-width 0.25s, opacity 0.25s;"/>
      `;
    }).join('');
  }

  renderNodes() {
    return this.nodes.map(n => {
      const isObserved = n.kind === 'observed';
      const strokeDash = isObserved ? 'none' : 'stroke-dasharray="3 2"';

      return `
        <g class="ev-node-group" id="evNode-${n.id}" data-node-id="${n.id}" data-kind="${n.kind}"
          transform="translate(${n.x}, ${n.y})" style="cursor:pointer;" role="button" tabindex="0">
          
          <!-- Outer Halo -->
          <circle cx="0" cy="0" r="${n.r + 5}" fill="${n.color}" opacity="0.15"/>

          <!-- Core Node Circle -->
          <circle cx="0" cy="0" r="${n.r}" fill="#FFFFFF" stroke="${n.color}" stroke-width="2.2" ${strokeDash} filter="url(#evShadow)"/>

          <!-- Kind Icon / Glyph -->
          <text x="0" y="4" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="800" fill="${n.color}">
            ${isObserved ? 'OBS' : 'HYP'}
          </text>

          <!-- Title Label -->
          <text x="0" y="${n.y > 200 ? 34 : -24}" text-anchor="middle" font-family="'Inter', sans-serif" font-size="9" font-weight="700" fill="#102A43">
            ${n.title}
          </text>

          <!-- Strength Badge Pill -->
          <g transform="translate(0, ${n.y > 200 ? 46 : -36})">
            <rect x="-42" y="-8" width="84" height="15" rx="3" fill="#EDEBE6" stroke="#CBD5E1" stroke-width="0.8"/>
            <text x="0" y="3" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#475569">
              ${n.strength}
            </text>
          </g>
        </g>
      `;
    }).join('');
  }

  bindEvents() {
    const hud = this.container.querySelector('#evGraphHud');

    // Node interactions
    const nodeEls = this.container.querySelectorAll('.ev-node-group');
    nodeEls.forEach(el => {
      const id = el.getAttribute('data-node-id');
      const nodeData = this.nodes.find(n => n.id === id);
      if (!nodeData) return;

      el.addEventListener('mouseenter', (e) => {
        if (!hud) return;
        const rect = this.container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        hud.style.left = `${Math.min(elRect.left - rect.left + 20, rect.width - 260)}px`;
        hud.style.top = `${Math.max(10, elRect.top - rect.top - 20)}px`;
        hud.innerHTML = `
          <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-family:var(--font-mono); font-size:0.68rem; font-weight:700;">
            <span style="color:${nodeData.color};">${nodeData.id} • ${nodeData.kind.toUpperCase()}</span>
            <span style="color:var(--ink-muted);">${nodeData.strength}</span>
          </div>
          <div style="font-weight:700; color:var(--ink-primary); font-size:0.8rem; margin-bottom:2px;">${nodeData.title}</div>
          <div style="color:var(--ink-secondary); font-size:0.7rem; line-height:1.3; margin-bottom:6px;">${nodeData.desc}</div>
          <div style="border-top:1px solid var(--border-subtle); padding-top:4px; font-size:0.68rem; color:var(--intel-primary); text-align:right;">Click to isolate link &rarr;</div>
        `;
        hud.style.display = 'block';
      });

      el.addEventListener('mouseleave', () => {
        if (hud) hud.style.display = 'none';
      });

      el.addEventListener('click', () => {
        this.selectNode(id);
      });
    });

    // Central node click
    const centralNode = this.container.querySelector('#centralRiskNode');
    if (centralNode) {
      centralNode.addEventListener('click', () => {
        this.clearSelection();
      });
    }

    // Filter buttons
    const filterBtns = this.container.querySelectorAll('.ev-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.style.background = 'transparent';
          b.style.color = 'var(--ink-secondary)';
        });
        btn.classList.add('active');
        btn.style.background = '#FFFFFF';
        btn.style.color = 'var(--ink-primary)';

        const f = btn.getAttribute('data-filter');
        this.filterKind(f);
      });
    });

    // Reset button
    const btnReset = this.container.querySelector('#btnEvReset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.clearSelection();
      });
    }
  }

  selectNode(id) {
    this.selectedNodeId = id;
    const badge = this.container.querySelector('#evSelectionBadge');
    if (badge) {
      badge.style.display = 'inline-block';
      badge.textContent = `Isolating Causal Path: ${id}`;
    }

    // Highlight node and wire, dim others
    const allNodes = this.container.querySelectorAll('.ev-node-group');
    allNodes.forEach(n => {
      const nid = n.getAttribute('data-node-id');
      n.style.opacity = nid === id ? '1' : '0.25';
    });

    const wires = this.container.querySelectorAll('.ev-wire');
    wires.forEach(w => {
      const wid = w.getAttribute('data-node-id');
      if (wid === id) {
        w.style.opacity = '1';
        w.style.strokeWidth = '3.5';
      } else {
        w.style.opacity = '0.08';
        w.style.strokeWidth = '1';
      }
    });

    // Trigger external callback if provided
    const nodeData = this.nodes.find(n => n.id === id);
    if (nodeData && typeof this.options.onSelectNode === 'function') {
      this.options.onSelectNode(nodeData);
    }
  }

  clearSelection() {
    this.selectedNodeId = null;
    const badge = this.container.querySelector('#evSelectionBadge');
    if (badge) badge.style.display = 'none';

    const allNodes = this.container.querySelectorAll('.ev-node-group');
    allNodes.forEach(n => {
      n.style.opacity = '1';
    });

    const wires = this.container.querySelectorAll('.ev-wire');
    wires.forEach(w => {
      w.style.opacity = '0.65';
      const kind = w.getAttribute('data-kind');
      w.style.strokeWidth = kind === 'observed' ? '2.2' : '1.8';
    });

    this.filterKind(this.activeFilter);
  }

  filterKind(kind) {
    this.activeFilter = kind;
    const allNodes = this.container.querySelectorAll('.ev-node-group');
    const wires = this.container.querySelectorAll('.ev-wire');

    allNodes.forEach(n => {
      const k = n.getAttribute('data-kind');
      n.style.opacity = (kind === 'all' || k === kind) ? '1' : '0.15';
    });

    wires.forEach(w => {
      const k = w.getAttribute('data-kind');
      w.style.opacity = (kind === 'all' || k === kind) ? '0.65' : '0.06';
    });
  }
}
