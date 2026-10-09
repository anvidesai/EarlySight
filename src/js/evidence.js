/**
 * EarlySight — Evidence & Explainability Interactive Controller (Milestone 7)
 * 
 * Answers: "WHY WAS THIS RISK FLAGGED?"
 * 
 * Features:
 * 1. Evidence Overview & Illustrative KPI Metrics
 * 2. "Why was this risk flagged?" Investigation Section:
 *    - 5 Evidence Pillars (Frequency, Spatial, Convergence, Persistence, Severity)
 *    - Strict separation of OBSERVED EVIDENCE vs AI INTERPRETATION
 * 3. Directional Evidence Chain (Signals -> Correlated Group -> Pattern -> Risk -> Action)
 * 4. Interactive Visual Evidence Graph (SVG node-link flow)
 * 5. Confidence & Coherence decomposition + Causal Pillars (Why this matters)
 * 6. Evidence Progression Timeline (Day 1 -> Day 10)
 * 7. Source Evidence Cards with multi-attribute filtering & live search
 * 8. Responsive Evidence Inspector Drawer with deep links to Signals, Risks, Map & Timeline
 * 9. Cross-Page URL parameter handling (?riskId=..., ?evidenceId=..., ?signalId=..., ?zone=...)
 */

import {
  EVIDENCE_OVERVIEW_KPIS,
  EVIDENCE_ALERTS_DATA,
  SOURCE_EVIDENCE_REGISTRY,
  getAlertById,
  getEvidenceItemById,
  filterEvidenceRegistry
} from '../data/evidence-data.js';
import { EvidenceRelationshipGraph } from './evidence-graph-viz.js';

class EvidenceController {
  constructor() {
    this.alerts = EVIDENCE_ALERTS_DATA;
    this.allEvidence = SOURCE_EVIDENCE_REGISTRY;
    this.activeAlert = this.alerts[0];
    this.activeEvidenceItem = this.allEvidence[0];
    this.selectedGraphNodeId = null;

    this.filters = {
      search: '',
      type: 'all',
      location: 'all',
      severity: 'all',
      relevance: 'all',
      riskId: 'all',
      timeRange: 'all'
    };

    this.isDrawerOpen = false;
  }

  init() {
    this.parseUrlParameters();
    this.bindGlobalEvents();
    this.renderAlertCase(this.activeAlert);
    if (document.getElementById('forensicInvestigationGraphContainer')) {
      try {
        this.radialGraph = new EvidenceRelationshipGraph('forensicInvestigationGraphContainer', {
          onSelectNode: (node) => {
            const evItem = this.allEvidence.find(e => e.id === node.id || e.id.toLowerCase().includes(node.id.toLowerCase()));
            if (evItem) {
              this.openEvidenceInspector(evItem);
            }
          }
        });
      } catch (err) {
        console.warn('Evidence radial graph warning:', err);
      }
    }
    this.renderSourceEvidenceCards();
    this.renderEvidenceGraph();

    // Auto re-render graph on window resize
    window.addEventListener('resize', () => {
      this.renderEvidenceGraph();
    });

    // Check if initial drawer open requested via URL
    if (this.urlRequestedEvidenceId) {
      const item = getEvidenceItemById(this.urlRequestedEvidenceId);
      if (item) {
        this.openEvidenceInspector(item);
      }
    }
  }

  parseUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const riskParam = params.get('riskId');
    const signalParam = params.get('signalId');
    const zoneParam = params.get('zone');
    const evidenceParam = params.get('evidenceId');

    if (riskParam) {
      const match = getAlertById(riskParam);
      if (match) {
        this.activeAlert = match;
        this.filters.riskId = match.riskId;
      }
    } else if (zoneParam) {
      const match = getAlertById(zoneParam);
      if (match) {
        this.activeAlert = match;
        this.filters.location = match.zoneSlug;
      }
    }

    if (evidenceParam) {
      this.urlRequestedEvidenceId = evidenceParam;
    } else if (signalParam) {
      // Find evidence referencing this signal
      const matchingEvidence = this.allEvidence.find(e => 
        e.linkedSignals.some(s => s.toLowerCase() === signalParam.toLowerCase())
      );
      if (matchingEvidence) {
        this.urlRequestedEvidenceId = matchingEvidence.id;
      }
    }
  }

  bindGlobalEvents() {
    // Alert Selector Pills
    const alertPills = document.querySelectorAll('.evidence-alert-pill');
    alertPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const alertId = e.currentTarget.getAttribute('data-alert-id');
        alertPills.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const alert = getAlertById(alertId);
        if (alert) {
          this.switchAlertCase(alert);
        }
      });
    });

    // Filter Controls
    const searchInput = document.getElementById('evidenceSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.trim();
        this.renderSourceEvidenceCards();
      });
    }

    const typeFilter = document.getElementById('evidenceTypeFilter');
    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.filters.type = e.target.value;
        this.renderSourceEvidenceCards();
      });
    }

    const locationFilter = document.getElementById('evidenceLocationFilter');
    if (locationFilter) {
      locationFilter.addEventListener('change', (e) => {
        this.filters.location = e.target.value;
        this.renderSourceEvidenceCards();
      });
    }

    const severityFilter = document.getElementById('evidenceSeverityFilter');
    if (severityFilter) {
      severityFilter.addEventListener('change', (e) => {
        this.filters.severity = e.target.value;
        this.renderSourceEvidenceCards();
      });
    }

    const relevanceFilter = document.getElementById('evidenceRelevanceFilter');
    if (relevanceFilter) {
      relevanceFilter.addEventListener('change', (e) => {
        this.filters.relevance = e.target.value;
        this.renderSourceEvidenceCards();
      });
    }

    const riskFilter = document.getElementById('evidenceRiskFilter');
    if (riskFilter) {
      riskFilter.addEventListener('change', (e) => {
        this.filters.riskId = e.target.value;
        this.renderSourceEvidenceCards();
      });
    }

    const resetBtn = document.getElementById('btnResetEvidenceFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    // Toggle Deep Forensic Graph & Timeline Details
    const btnToggleDetails = document.getElementById('btnToggleEvidenceDetails');
    const secondaryDetails = document.getElementById('evidenceSecondaryDetails');
    if (btnToggleDetails && secondaryDetails) {
      btnToggleDetails.addEventListener('click', () => {
        const isHidden = secondaryDetails.style.display === 'none';
        secondaryDetails.style.display = isHidden ? 'block' : 'none';
        btnToggleDetails.textContent = isHidden ? 'Hide Deep Forensic Graph & Timeline' : 'Deep Forensic Graph & Timeline';
        if (isHidden) {
          setTimeout(() => {
            this.renderEvidenceGraph();
          }, 80);
        }
      });
    }

    // Drawer Close Buttons & Backdrop
    const drawerCloseBtn = document.getElementById('closeEvidenceDrawerBtn');
    const drawerBackdrop = document.getElementById('evidenceDrawerBackdrop');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => this.closeEvidenceInspector());
    }
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', () => this.closeEvidenceInspector());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isDrawerOpen) {
        this.closeEvidenceInspector();
      }
    });
  }

  switchAlertCase(alert) {
    this.activeAlert = alert;
    this.renderAlertCase(alert);
    this.renderEvidenceGraph();
    
    // Auto-update risk filter to match selected case
    const riskFilter = document.getElementById('evidenceRiskFilter');
    if (riskFilter) {
      riskFilter.value = alert.riskId;
      this.filters.riskId = alert.riskId;
      this.renderSourceEvidenceCards();
    }
  }

  resetFilters() {
    this.filters = {
      search: '',
      type: 'all',
      location: 'all',
      severity: 'all',
      relevance: 'all',
      riskId: 'all',
      timeRange: 'all'
    };

    const searchInput = document.getElementById('evidenceSearchInput');
    const typeFilter = document.getElementById('evidenceTypeFilter');
    const locationFilter = document.getElementById('evidenceLocationFilter');
    const severityFilter = document.getElementById('evidenceSeverityFilter');
    const relevanceFilter = document.getElementById('evidenceRelevanceFilter');
    const riskFilter = document.getElementById('evidenceRiskFilter');

    if (searchInput) searchInput.value = '';
    if (typeFilter) typeFilter.value = 'all';
    if (locationFilter) locationFilter.value = 'all';
    if (severityFilter) severityFilter.value = 'all';
    if (relevanceFilter) relevanceFilter.value = 'all';
    if (riskFilter) riskFilter.value = 'all';

    this.renderSourceEvidenceCards();
  }

  renderAlertCase(alert) {
    // 1. Featured Risk Header
    const titleEl = document.getElementById('featuredRiskTitle');
    const locationEl = document.getElementById('featuredRiskLocation');
    const scoreValEl = document.getElementById('featuredRiskScore');
    const priorityEl = document.getElementById('featuredRiskPriority');
    const trendEl = document.getElementById('featuredRiskTrend');
    const leadTimeEl = document.getElementById('featuredRiskLeadTime');
    const avertedEl = document.getElementById('featuredRiskAverted');
    const whySummaryEl = document.getElementById('whyFlaggedSummary');
    const whyNarrativeEl = document.getElementById('whyFlaggedNarrative');

    if (titleEl) titleEl.textContent = alert.riskTitle;
    if (locationEl) locationEl.textContent = alert.location;
    if (scoreValEl) scoreValEl.textContent = alert.riskScore;
    if (priorityEl) {
      priorityEl.textContent = `${alert.priority} • ${alert.priorityLabel}`;
      priorityEl.className = `stat-badge ${alert.priority === 'P1' ? 'badge-vermilion' : 'badge-amber'}`;
    }
    if (trendEl) trendEl.textContent = `${alert.trendSymbol} ${alert.trend}`;
    if (leadTimeEl) leadTimeEl.textContent = alert.leadTimeCountdown;
    if (avertedEl) avertedEl.textContent = alert.projectedLossUSD;
    if (whySummaryEl) whySummaryEl.textContent = alert.whyFlagged.summary;
    if (whyNarrativeEl) whyNarrativeEl.textContent = alert.whyFlagged.causalNarrative;

    // 2. Render 5 Evidence Pillars
    const pillarsContainer = document.getElementById('evidencePillarsContainer');
    if (pillarsContainer && alert.whyFlagged.pillars) {
      pillarsContainer.innerHTML = alert.whyFlagged.pillars.map(p => `
        <div class="evidence-pillar-card">
          <div class="pillar-card-top font-mono">
            <span class="pillar-num font-mono">${p.num}</span>
            <span class="pillar-badge-pill">${p.badge}</span>
          </div>
          <h4 class="pillar-title">${p.title}</h4>
          <p class="pillar-desc">${p.desc}</p>
        </div>
      `).join('');
    }

    // 3. Render Observed Facts vs AI Interpretation
    const observedListEl = document.getElementById('observedEvidenceList');
    const aiListEl = document.getElementById('aiInterpretationList');
    if (observedListEl && alert.whyFlagged.observedEvidenceFacts) {
      observedListEl.innerHTML = alert.whyFlagged.observedEvidenceFacts.map(fact => `
        <li class="fact-item">
          <span class="fact-check-icon">✓</span>
          <span class="fact-text">${fact}</span>
        </li>
      `).join('');
    }
    if (aiListEl && alert.whyFlagged.aiInterpretationHypothesis) {
      aiListEl.innerHTML = alert.whyFlagged.aiInterpretationHypothesis.map(hyp => `
        <li class="hypothesis-item">
          <span class="hypothesis-spark-icon">⚡</span>
          <span class="hypothesis-text">${hyp}</span>
        </li>
      `).join('');
    }

    // 4. Render Directional Evidence Chain (Section 3)
    const chainContainer = document.getElementById('evidenceChainContainer');
    if (chainContainer && alert.evidenceChain) {
      chainContainer.innerHTML = alert.evidenceChain.map((step, idx) => `
        <div class="evidence-chain-step ${idx === 3 ? 'step-risk-highlight' : ''}">
          <div class="chain-step-header font-mono">
            <span class="chain-step-num">${step.step}</span>
            <span class="chain-stage-tag">${step.stage}</span>
          </div>
          <div class="chain-icon-wrap" style="color: ${step.color};">
            <span class="chain-step-icon">${step.icon}</span>
          </div>
          <h5 class="chain-step-label">${step.label}</h5>
          <p class="chain-step-detail">${step.detail}</p>
          <div class="chain-step-footer">
            <span class="chain-badge-pill">${step.badge}</span>
          </div>
        </div>
        ${idx < alert.evidenceChain.length - 1 ? `
          <div class="chain-connector-node" aria-hidden="true">
            <span class="chain-arrow-symbol">➔</span>
          </div>
        ` : ''}
      `).join('');
    }

    // 5. Render Explainability Panel (Section 6)
    const confValEl = document.getElementById('confidenceMetricVal');
    const patternCohEl = document.getElementById('patternCoherenceVal');
    const signalAgrEl = document.getElementById('signalAgreementVal');
    const tempConsEl = document.getElementById('temporalConsistencyVal');
    const confExplEl = document.getElementById('confidenceExplanationText');

    if (confValEl) confValEl.textContent = alert.confidence;
    if (patternCohEl) patternCohEl.textContent = alert.patternCoherence;
    if (signalAgrEl) signalAgrEl.textContent = alert.signalAgreement;
    if (tempConsEl) tempConsEl.textContent = alert.temporalConsistency;
    if (confExplEl) confExplEl.textContent = alert.confidenceExplanation;

    // 6. Render Causal Pillars (Why this matters - Section 7)
    const causalPillarsGrid = document.getElementById('causalPillarsGrid');
    if (causalPillarsGrid && alert.causalPillars) {
      causalPillarsGrid.innerHTML = alert.causalPillars.pillars.map(p => `
        <div class="causal-dimension-card">
          <div class="dimension-header font-mono">
            <span class="dimension-key">${p.key}</span>
            <span class="dimension-impact font-mono" style="color: ${p.color};">${p.impact}</span>
          </div>
          <div class="dimension-summary">${p.summary}</div>
          <p class="dimension-detail">${p.detail}</p>
        </div>
      `).join('');
    }

    // 7. Render Evidence Progression Timeline (Section 9)
    const timelineContainer = document.getElementById('evidenceTimelineTrack');
    if (timelineContainer && alert.evidenceTimeline) {
      timelineContainer.innerHTML = alert.evidenceTimeline.map((item, i) => `
        <div class="evidence-timeline-node">
          <div class="timeline-day-pill font-mono">${item.day}</div>
          <div class="timeline-node-dot" style="background: ${item.color};"></div>
          <div class="timeline-node-card">
            <div class="timeline-card-top font-mono">
              <span class="timeline-time">${item.time}</span>
              <span class="timeline-status-badge" style="background: ${item.color}15; color: ${item.color};">${item.badge}</span>
            </div>
            <div class="timeline-label font-sans">${item.label}</div>
            <p class="timeline-desc">${item.desc}</p>
          </div>
        </div>
      `).join('');
    }
  }

  renderEvidenceGraph() {
    const container = document.getElementById('evidenceGraphContainer');
    const svgCanvas = document.getElementById('evidenceGraphSvg');
    if (!container || !svgCanvas) return;

    const alert = this.activeAlert;
    const graphData = alert.evidenceGraph;
    if (!graphData) return;

    // Render node elements in 4 horizontal columns: Evidence -> Signal -> Pattern -> Risk
    const colEvidence = graphData.nodes.filter(n => n.type === 'evidence');
    const colSignals = graphData.nodes.filter(n => n.type === 'signal');
    const colPatterns = graphData.nodes.filter(n => n.type === 'pattern');
    const colRisks = graphData.nodes.filter(n => n.type === 'risk');

    const columnsHtml = `
      <div class="graph-col col-evidence">
        <div class="graph-col-header font-mono">1. SOURCE EVIDENCE</div>
        <div class="graph-nodes-stack">
          ${colEvidence.map(n => this.renderGraphNode(n)).join('')}
        </div>
      </div>

      <div class="graph-col col-signals">
        <div class="graph-col-header font-mono">2. LINKED SIGNALS</div>
        <div class="graph-nodes-stack">
          ${colSignals.map(n => this.renderGraphNode(n)).join('')}
        </div>
      </div>

      <div class="graph-col col-pattern">
        <div class="graph-col-header font-mono">3. RECURRING PATTERN</div>
        <div class="graph-nodes-stack">
          ${colPatterns.map(n => this.renderGraphNode(n)).join('')}
        </div>
      </div>

      <div class="graph-col col-risk">
        <div class="graph-col-header font-mono">4. EMERGING RISK</div>
        <div class="graph-nodes-stack">
          ${colRisks.map(n => this.renderGraphNode(n)).join('')}
        </div>
      </div>
    `;

    container.innerHTML = columnsHtml;

    // Bind node clicks
    const nodeEls = container.querySelectorAll('.graph-node-box');
    nodeEls.forEach(nodeEl => {
      nodeEl.addEventListener('click', () => {
        const nodeId = nodeEl.getAttribute('data-node-id');
        this.selectGraphNode(nodeId);
      });
    });

    // Draw SVG connecting lines after layout render
    setTimeout(() => {
      this.drawGraphConnectors(graphData, container, svgCanvas);
    }, 120);
  }

  renderGraphNode(node) {
    const isSelected = this.selectedGraphNodeId === node.id;
    return `
      <div class="graph-node-box ${isSelected ? 'selected' : ''}" 
           id="graphNode-${node.id}" 
           data-node-id="${node.id}"
           style="border-left: 3px solid ${node.color};">
        <div class="node-id-row font-mono">
          <span class="node-id-tag">${node.label}</span>
          <span class="node-type-pill">${node.type}</span>
        </div>
        <div class="node-title">${node.title}</div>
        <div class="node-meta font-mono">${node.source}</div>
      </div>
    `;
  }

  selectGraphNode(nodeId) {
    this.selectedGraphNodeId = nodeId;
    document.querySelectorAll('.graph-node-box').forEach(el => {
      el.classList.toggle('selected', el.getAttribute('data-node-id') === nodeId);
    });

    // If node is evidence, open in drawer
    const evidenceItem = this.allEvidence.find(e => e.id === nodeId);
    if (evidenceItem) {
      this.openEvidenceInspector(evidenceItem);
    }
  }

  drawGraphConnectors(graphData, container, svg) {
    const containerRect = container.getBoundingClientRect();
    if (containerRect.width === 0) return;

    svg.setAttribute('width', containerRect.width);
    svg.setAttribute('height', containerRect.height);

    let pathsHtml = '';

    graphData.links.forEach((link, idx) => {
      const fromEl = document.getElementById(`graphNode-${link.from}`);
      const toEl = document.getElementById(`graphNode-${link.to}`);

      if (!fromEl || !toEl) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const startX = fromRect.right - containerRect.left;
      const startY = fromRect.top + (fromRect.height / 2) - containerRect.top;
      const endX = toRect.left - containerRect.left;
      const endY = toRect.top + (toRect.height / 2) - containerRect.top;

      const deltaX = endX - startX;
      const c1X = startX + deltaX * 0.5;
      const c1Y = startY;
      const c2X = startX + deltaX * 0.5;
      const c2Y = endY;

      const isHighlighted = this.selectedGraphNodeId === link.from || this.selectedGraphNodeId === link.to;
      const strokeColor = isHighlighted ? '#EF7B7B' : 'rgba(98, 125, 152, 0.35)';
      const strokeWidth = isHighlighted ? 2.5 : 1.5;
      const strokeDash = isHighlighted ? 'none' : '4 3';

      pathsHtml += `
        <path d="M ${startX} ${startY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${endX} ${endY}"
              fill="none"
              stroke="${strokeColor}"
              stroke-width="${strokeWidth}"
              stroke-dasharray="${strokeDash}"
              class="graph-link-line" />
      `;
    });

    svg.innerHTML = pathsHtml;
  }

  renderSourceEvidenceCards() {
    const grid = document.getElementById('sourceEvidenceCardsGrid');
    const countEl = document.getElementById('evidenceResultsCount');
    if (!grid) return;

    const filtered = filterEvidenceRegistry(this.filters);

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${this.allEvidence.length} Evidence Records`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-evidence-state">
          <div class="empty-icon font-mono">∅</div>
          <h3>No Evidence Records Found</h3>
          <p>No operational evidence records match the current filter criteria.</p>
          <button class="btn-secondary font-mono" id="btnEmptyReset">Reset All Filters</button>
        </div>
      `;
      const btn = document.getElementById('btnEmptyReset');
      if (btn) btn.addEventListener('click', () => this.resetFilters());
      return;
    }

    grid.innerHTML = filtered.map(item => {
      const primarySignal = item.linkedSignals && item.linkedSignals[0] ? item.linkedSignals[0] : 'SIG-01';
      const supportingCount = (item.linkedSignalsCount || (item.linkedSignals ? item.linkedSignals.length : 1)) - 1;
      const supportingText = supportingCount > 0 ? `+${supportingCount} supporting` : 'Primary only';
      const riskText = item.linkedRiskId ? `${item.linkedRiskId} (${item.linkedRiskName || 'Hazard'})` : 'Operational Risk';

      return `
        <div class="source-evidence-card" data-evidence-id="${item.id}">
          <div class="evidence-card-header font-mono">
            <div class="evidence-id-group">
              <span class="evidence-id-pill font-mono">${item.id}</span>
              <span class="evidence-type-badge type-${item.sourceCategory}">${item.sourceType}</span>
            </div>
            <span class="evidence-relevance-tag font-mono relevance-${item.relevance.toLowerCase()}">
              ${item.relevance} Relevance
            </span>
          </div>

          <h4 class="evidence-card-title">${item.title}</h4>
          
          <div class="evidence-card-meta font-mono">
            <span class="meta-loc">📍 ${item.location}</span>
            <span class="meta-time">⏱ ${item.timestamp}</span>
          </div>

          <!-- Structured Intelligence Matrix -->
          <div class="evidence-structured-matrix font-mono">
            <div class="evidence-matrix-item">
              <span class="evidence-matrix-lbl">Primary Signal:</span>
              <span class="evidence-matrix-val font-bold">${primarySignal}</span>
            </div>
            <div class="evidence-matrix-item">
              <span class="evidence-matrix-lbl">Precursors:</span>
              <span class="evidence-matrix-val font-bold">${supportingText}</span>
            </div>
            <div class="evidence-matrix-item" style="grid-column: span 2;">
              <span class="evidence-matrix-lbl">Risk Factor:</span>
              <span class="evidence-matrix-val font-bold" style="color:var(--color-rust);">${riskText}</span>
            </div>
          </div>

          <p class="evidence-card-desc font-sans">${item.description}</p>

          <div class="evidence-card-footer font-mono">
            <div class="evidence-conf-pill font-mono">
              <span class="conf-dot" style="color:var(--intel-primary);">●</span>
              <span>Strength: <strong>${item.confidence}</strong></span>
            </div>
            <button class="btn-view-evidence font-mono" data-inspect-id="${item.id}">
              Inspect Dossier &rarr;
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind "View Evidence" buttons
    grid.querySelectorAll('.btn-view-evidence').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-inspect-id');
        const item = getEvidenceItemById(id);
        if (item) {
          this.openEvidenceInspector(item);
        }
      });
    });
  }

  openEvidenceInspector(item) {
    this.activeEvidenceItem = item;
    this.isDrawerOpen = true;

    const drawer = document.getElementById('evidenceInspectorDrawer');
    const backdrop = document.getElementById('evidenceDrawerBackdrop');
    if (!drawer) return;

    // Populate drawer elements
    const idEl = document.getElementById('drawerEvidenceId');
    const typeEl = document.getElementById('drawerEvidenceType');
    const titleEl = document.getElementById('drawerEvidenceTitle');
    const timeEl = document.getElementById('drawerEvidenceTimestamp');
    const locEl = document.getElementById('drawerEvidenceLocation');
    const sysEl = document.getElementById('drawerEvidenceSystem');
    const authorEl = document.getElementById('drawerEvidenceAuthor');
    const descEl = document.getElementById('drawerEvidenceDesc');
    const sevEl = document.getElementById('drawerEvidenceSeverity');
    const relEl = document.getElementById('drawerEvidenceRelevance');
    const confEl = document.getElementById('drawerEvidenceConfidence');
    const signalsListEl = document.getElementById('drawerLinkedSignalsList');
    const patternEl = document.getElementById('drawerLinkedPattern');
    const riskEl = document.getElementById('drawerLinkedRisk');
    const whyMattersEl = document.getElementById('drawerWhyMatters');
    const timelineEl = document.getElementById('drawerEvidenceTimeline');

    // Deep link action buttons
    const btnSignal = document.getElementById('drawerActionViewSignal');
    const btnRisk = document.getElementById('drawerActionViewRisk');
    const btnTimeline = document.getElementById('drawerActionViewTimeline');
    const btnMap = document.getElementById('drawerActionViewMap');

    if (idEl) idEl.textContent = item.id;
    if (typeEl) {
      typeEl.textContent = item.sourceType;
      typeEl.className = `evidence-type-badge type-${item.sourceCategory}`;
    }
    if (titleEl) titleEl.textContent = item.title;
    if (timeEl) timeEl.textContent = item.timestamp;
    if (locEl) locEl.textContent = item.location;
    if (sysEl) sysEl.textContent = item.sourceSystem;
    if (authorEl) authorEl.textContent = item.authorOrTech;
    if (descEl) descEl.textContent = `"${item.description}"`;
    if (sevEl) {
      sevEl.textContent = `${item.severity} Severity`;
      sevEl.className = `stat-badge ${item.severity === 'Critical' ? 'badge-vermilion' : (item.severity === 'High' ? 'badge-amber' : 'badge-neutral')}`;
    }
    if (relEl) {
      relEl.textContent = `${item.relevance} Relevance`;
      relEl.className = `evidence-relevance-tag relevance-${item.relevance.toLowerCase()}`;
    }
    if (confEl) confEl.textContent = item.confidence;
    if (patternEl) patternEl.textContent = item.linkedPattern;
    if (riskEl) riskEl.textContent = `${item.linkedRiskId} — ${item.linkedRiskName}`;
    if (whyMattersEl) whyMattersEl.textContent = item.whyItMatters;
    if (timelineEl) timelineEl.textContent = item.evidenceTimelineSummary;

    // Render linked signals
    if (signalsListEl && item.linkedSignals) {
      signalsListEl.innerHTML = item.linkedSignals.map(sig => `
        <a href="signals.html?zone=${item.zoneSlug}&signalId=${sig}" class="linked-signal-chip font-mono">
          <span>📡 ${sig}</span>
          <span style="font-size:0.68rem; color:var(--ink-muted);">↗</span>
        </a>
      `).join('');
    }

    // Configure deep-link hrefs
    if (btnSignal) {
      const firstSignal = item.linkedSignals && item.linkedSignals.length > 0 ? item.linkedSignals[0] : 'SIG-031';
      btnSignal.setAttribute('href', `signals.html?zone=${item.zoneSlug}&signalId=${firstSignal}`);
    }
    if (btnRisk) {
      btnRisk.setAttribute('href', `risks.html?riskId=${item.linkedRiskId}`);
    }
    if (btnTimeline) {
      btnTimeline.setAttribute('href', `timeline.html?zone=${item.zoneSlug}&case=0`);
    }
    if (btnMap) {
      btnMap.setAttribute('href', `map.html?zone=${item.zoneSlug}`);
    }

    drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeEvidenceInspector() {
    this.isDrawerOpen = false;
    const drawer = document.getElementById('evidenceInspectorDrawer');
    const backdrop = document.getElementById('evidenceDrawerBackdrop');
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Auto-instantiate when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.evidenceController = new EvidenceController();
  window.evidenceController.init();
});
