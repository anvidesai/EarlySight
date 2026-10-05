/**
 * EarlySight — AI Copilot Intelligence Controller (Milestone 9)
 * 
 * Manages operational queries, contextual filters, deterministic responses,
 * evidence traces, inspector drawer, and activity history.
 */

import {
  COPILOT_METRICS,
  REASONING_STAGES,
  INSIGHT_CARDS,
  SUGGESTED_QUERIES,
  INITIAL_RECENT_ACTIVITY,
  MOCK_RESPONSES,
  matchCopilotQuery
} from '../data/copilot-data.js';

class CopilotController {
  constructor() {
    this.selectedContext = "All Intelligence";
    this.activeResponse = MOCK_RESPONSES.water_block_a; // Default loaded response
    this.recentActivity = [...INITIAL_RECENT_ACTIVITY];
    this.isAnalyzing = false;
    this.isInspectorOpen = false;
  }

  init() {
    this.renderContextSelector();
    this.renderSuggestedQueries();
    this.renderInsightCards();
    this.renderReasoningStages();
    this.renderActivityList();
    this.bindEvents();

    // Check if query or context came via URL parameters
    this.parseUrlParameters();

    // Render initial loaded response (Block A)
    this.renderResponse(this.activeResponse);
  }

  parseUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q') || params.get('query');
    const ctxParam = params.get('context');
    const riskParam = params.get('riskId');

    if (ctxParam) {
      this.selectedContext = ctxParam;
      const ctxSelect = document.getElementById('copilotContextSelect');
      if (ctxSelect) ctxSelect.value = ctxParam;
    }

    if (qParam) {
      const input = document.getElementById('copilotQueryInput');
      if (input) input.value = qParam;
      this.executeUserQuery(qParam);
    } else if (riskParam) {
      const q = `Show evidence behind ${riskParam}`;
      const input = document.getElementById('copilotQueryInput');
      if (input) input.value = q;
      this.executeUserQuery(q);
    }
  }

  bindEvents() {
    // Query form submission
    const form = document.getElementById('copilotQueryForm');
    const input = document.getElementById('copilotQueryInput');
    const btnSubmit = document.getElementById('copilotQuerySubmitBtn');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input ? input.value.trim() : "";
        if (text) this.executeUserQuery(text);
      });
    }

    if (btnSubmit) {
      btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        const text = input ? input.value.trim() : "";
        if (text) this.executeUserQuery(text);
      });
    }

    // Context selector change
    const ctxSelect = document.getElementById('copilotContextSelect');
    if (ctxSelect) {
      ctxSelect.addEventListener('change', (e) => {
        this.selectedContext = e.target.value;
        const currentQuery = input ? input.value.trim() : "";
        if (currentQuery) {
          this.executeUserQuery(currentQuery);
        }
      });
    }

    // Inspector Drawer Close
    const closeBtn = document.getElementById('copilotInspectorCloseBtn');
    const backdrop = document.getElementById('copilotDrawerBackdrop');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeInspector());
    }
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeInspector());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isInspectorOpen) {
        this.closeInspector();
      }
    });

    // Inspector Trigger on Active Response
    const inspectTrigger = document.getElementById('btnInspectActiveResponse');
    if (inspectTrigger) {
      inspectTrigger.addEventListener('click', () => {
        if (this.activeResponse) {
          this.openInspector(this.activeResponse.inspectorData || this.activeResponse);
        }
      });
    }
  }

  renderContextSelector() {
    const ctxSelect = document.getElementById('copilotContextSelect');
    if (!ctxSelect) return;

    const contexts = [
      "All Intelligence",
      "Signals",
      "Risks",
      "Evidence",
      "Actions",
      "Timeline",
      "Map"
    ];

    ctxSelect.innerHTML = contexts.map(c => `
      <option value="${c}" ${c === this.selectedContext ? 'selected' : ''}>Scope: ${c}</option>
    `).join('');
  }

  renderSuggestedQueries() {
    const container = document.getElementById('copilotSuggestedQueriesContainer');
    if (!container) return;

    container.innerHTML = SUGGESTED_QUERIES.map(q => `
      <button type="button" class="copilot-suggest-chip font-sans" data-suggest-query="${q}">
        <span class="chip-icon">✦</span>
        <span>${q}</span>
      </button>
    `).join('');

    container.querySelectorAll('.copilot-suggest-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const query = e.currentTarget.getAttribute('data-suggest-query');
        const input = document.getElementById('copilotQueryInput');
        if (input) input.value = query;
        this.executeUserQuery(query);
      });
    });
  }

  renderInsightCards() {
    const grid = document.getElementById('copilotInsightCardsGrid');
    if (!grid) return;

    grid.innerHTML = INSIGHT_CARDS.map(card => `
      <div class="copilot-insight-card" data-card-id="${card.id}">
        <div class="insight-card-top font-mono">
          <span class="insight-cat">${card.category}</span>
          <span class="stat-badge ${card.statusBadgeClass} font-mono">${card.statusBadge}</span>
        </div>
        <h4 class="insight-card-title font-sans">${card.title}</h4>
        <div class="insight-card-meta font-mono">
          ${card.score ? `<span>Score: ${card.score}</span> • <span>${card.trend}</span>` : ''}
          ${card.signals ? `<span>${card.signals}</span> • <span>${card.recurrence}</span>` : ''}
          ${card.confidence ? `<span>${card.confidence}</span> • <span>${card.support}</span>` : ''}
          ${card.priority ? `<span>${card.priority}</span> • <span>${card.owner}</span>` : ''}
        </div>
        <a href="${card.url}" class="insight-card-link font-mono">
          ${card.linkText}
        </a>
      </div>
    `).join('');
  }

  renderReasoningStages() {
    const container = document.getElementById('copilotReasoningStagesContainer');
    if (!container) return;

    container.innerHTML = REASONING_STAGES.map((st, idx) => `
      <div class="reasoning-stage-item">
        <div class="reasoning-stage-badge font-mono">${st.stage}</div>
        <div class="reasoning-stage-body">
          <div class="reasoning-stage-name font-mono">${st.name}</div>
          <div class="reasoning-stage-sub font-sans">${st.sub}</div>
          <p class="reasoning-stage-desc font-sans">${st.desc}</p>
        </div>
      </div>
      ${idx < REASONING_STAGES.length - 1 ? `
        <div class="reasoning-stage-arrow font-mono" aria-hidden="true">↓</div>
      ` : ''}
    `).join('');
  }

  renderActivityList() {
    const container = document.getElementById('copilotActivityList');
    if (!container) return;

    container.innerHTML = this.recentActivity.map(act => `
      <div class="copilot-activity-item" data-activity-query="${act.query}" data-activity-context="${act.context}">
        <div class="activity-top-row font-mono">
          <span class="activity-time">${act.timestamp}</span>
          <span class="activity-context font-bold">${act.context}</span>
        </div>
        <div class="activity-query-text font-sans">
          "${act.query}"
        </div>
        <div class="activity-status-row font-mono">
          <span class="status-indicator-dot"></span>
          <span>${act.status}</span>
          <span class="activity-rerun-cue">Click to view ➔</span>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.copilot-activity-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const query = e.currentTarget.getAttribute('data-activity-query');
        const context = e.currentTarget.getAttribute('data-activity-context');
        if (context) {
          this.selectedContext = context;
          const select = document.getElementById('copilotContextSelect');
          if (select) select.value = context;
        }
        const input = document.getElementById('copilotQueryInput');
        if (input) input.value = query;
        this.executeUserQuery(query, false);
      });
    });
  }

  executeUserQuery(queryText, recordActivity = true) {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    // Show analyzing state
    this.renderAnalyzingState(queryText);

    // Record in recent activity
    if (recordActivity) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      this.recentActivity.unshift({
        id: `act-${Date.now()}`,
        timestamp: timeStr,
        query: queryText,
        context: this.selectedContext,
        status: "Analyzed"
      });
      if (this.recentActivity.length > 8) this.recentActivity.pop();
      this.renderActivityList();
    }

    // Short simulated analysis progression (400ms)
    setTimeout(() => {
      this.isAnalyzing = false;
      const matched = matchCopilotQuery(queryText, this.selectedContext);
      this.activeResponse = matched;
      this.renderResponse(matched, queryText);
    }, 420);
  }

  renderAnalyzingState(queryText) {
    const responseBox = document.getElementById('copilotResponseContainer');
    if (!responseBox) return;

    responseBox.innerHTML = `
      <div class="copilot-analyzing-card font-mono">
        <div class="analyzing-header-row">
          <span class="status-dot-pulse"></span>
          <span class="analyzing-title">EARLYSIGHT OPERATIONAL REASONING IN PROGRESS...</span>
        </div>
        <div class="analyzing-query-echo font-sans">
          Query: <strong>"${queryText}"</strong> &bull; Scope: <strong>${this.selectedContext}</strong>
        </div>
        <div class="analyzing-steps-track">
          <div class="analyzing-step step-done">✓ 1. Query parsed & contextualized</div>
          <div class="analyzing-step step-active">▶ 2. Analyzing multi-modal signal relationships & precursor clusters...</div>
          <div class="analyzing-step">○ 3. Checking pattern recurrence & coherence...</div>
          <div class="analyzing-step">○ 4. Synthesizing evidence chain & prescriptive recommendations...</div>
        </div>
      </div>
    `;
  }

  renderResponse(resp, customQuery = null) {
    const responseBox = document.getElementById('copilotResponseContainer');
    if (!responseBox) return;

    const queryDisplay = customQuery || resp.queryMatched;

    responseBox.innerHTML = `
      <div class="copilot-response-card" id="copilotActiveResponseCard">
        
        <!-- Response Header -->
        <div class="response-card-header font-mono">
          <div class="response-header-left">
            <span class="response-scope-badge">${this.selectedContext}</span>
            <span class="response-status-badge">AI INTERPRETATION SYNTHESIZED</span>
          </div>
          <button type="button" class="btn-open-inspector font-mono" id="btnInspectResponse">
            <span>Inspect Evidence Dossier ➔</span>
          </button>
        </div>

        <div class="response-query-banner font-sans">
          <span class="query-label font-mono">ANALYZED INQUIRY:</span>
          <span class="query-content font-bold">"${queryDisplay}"</span>
        </div>

        <!-- Section 1: AI Interpretation -->
        <div class="response-section">
          <div class="response-section-label font-mono">AI INTERPRETATION:</div>
          <div class="response-interpretation-text font-sans">
            ${resp.aiInterpretation}
          </div>
        </div>

        <!-- Section 2: Evidence -->
        <div class="response-section">
          <div class="response-section-label font-mono">SUPPORTING OPERATIONAL EVIDENCE:</div>
          <ul class="response-evidence-list font-sans">
            ${resp.evidence.map(ev => `
              <li class="evidence-list-item">
                <span class="evidence-bullet" aria-hidden="true">•</span>
                <span>${ev}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Section 3: Why It Matters -->
        <div class="response-section">
          <div class="response-section-label font-mono">WHY IT MATTERS:</div>
          <div class="response-matters-box font-sans">
            ${resp.whyItMatters}
          </div>
        </div>

        <!-- Section 4: Recommended Next Step -->
        <div class="response-section">
          <div class="response-section-label font-mono">RECOMMENDED NEXT STEP:</div>
          <div class="response-next-step-box font-sans">
            <span class="next-step-icon font-mono">➔</span>
            <span>${resp.recommendedNextStep}</span>
          </div>
        </div>

        <!-- Section 5: Confidence & Lead Time Strip -->
        <div class="response-confidence-strip font-mono">
          <div class="confidence-stat-item">
            <span class="stat-name">EVIDENCE CONFIDENCE:</span>
            <span class="stat-value text-teal font-bold">${resp.confidence.evidenceConfidence}</span>
          </div>
          <div class="confidence-stat-item">
            <span class="stat-name">PATTERN COHERENCE:</span>
            <span class="stat-value text-forest font-bold">${resp.confidence.patternCoherence}</span>
          </div>
          <div class="confidence-stat-item">
            <span class="stat-name">ESTIMATED LEAD TIME:</span>
            <span class="stat-value text-amber font-bold">${resp.confidence.leadTime}</span>
          </div>
        </div>

        <!-- Section 6: Evidence Trace Chain -->
        <div class="response-section response-trace-section">
          <div class="response-section-label font-mono">EVIDENCE TRACE (CLICK ANY NODE TO NAVIGATE):</div>
          <div class="evidence-trace-track" aria-label="Evidence Trace Chain">
            ${resp.evidenceTrace.map((node, idx) => `
              <a href="${node.link}" class="trace-node-card" data-node-type="${node.type}">
                <span class="trace-step-tag font-mono">${node.step}</span>
                <span class="trace-node-label font-sans">${node.label}</span>
              </a>
              ${idx < resp.evidenceTrace.length - 1 ? `
                <span class="trace-connector-arrow font-mono" aria-hidden="true">→</span>
              ` : ''}
            `).join('')}
          </div>
        </div>

        <!-- Disclaimer Footer -->
        <div class="response-card-disclaimer font-mono">
          * MOCK / ILLUSTRATIVE OPERATIONAL REASONING — GENERATED DETERMINISTICALLY FOR WORKSPACE EVALUATION
        </div>

      </div>
    `;

    // Bind Inspect button
    const btnInspect = document.getElementById('btnInspectResponse');
    if (btnInspect) {
      btnInspect.addEventListener('click', () => {
        this.openInspector(resp.inspectorData || resp);
      });
    }
  }

  openInspector(data) {
    this.isInspectorOpen = true;
    const drawer = document.getElementById('copilotInspectorDrawer');
    const backdrop = document.getElementById('copilotDrawerBackdrop');

    const qEl = document.getElementById('inspDrawerQuery');
    const ctxEl = document.getElementById('inspDrawerContext');
    const interpEl = document.getElementById('inspDrawerInterpretation');
    const sigEl = document.getElementById('inspDrawerSignals');
    const patEl = document.getElementById('inspDrawerPattern');
    const riskEl = document.getElementById('inspDrawerRisk');
    const evEl = document.getElementById('inspDrawerEvidence');
    const actEl = document.getElementById('inspDrawerAction');
    const confEl = document.getElementById('inspDrawerConfidence');
    const timeEl = document.getElementById('inspDrawerTimeline');

    if (qEl) qEl.textContent = `"${data.query || this.activeResponse.queryMatched}"`;
    if (ctxEl) ctxEl.textContent = data.context || this.selectedContext;
    if (interpEl) interpEl.textContent = data.interpretation || this.activeResponse.aiInterpretation;
    if (sigEl) sigEl.textContent = data.supportingSignals || "128 signals monitored across 6 zones";
    if (patEl) patEl.textContent = data.pattern || "Recurring degradation anomaly";
    if (riskEl) riskEl.textContent = data.risk || "Synthesized emerging operational hazard";
    if (evEl) evEl.textContent = data.evidence || "Cross-silo SCADA and log correlation";
    if (actEl) actEl.textContent = data.action || "Prescriptive engineering intervention";
    if (confEl) confEl.textContent = data.confidence || "84% Statistical Confidence";
    if (timeEl) timeEl.textContent = data.timeline || "14.2 Days Lead Time";

    // Set deep link Hrefs
    const links = data.deepLinks || {
      signals: "signals.html",
      risk: "risks.html",
      evidence: "evidence.html",
      timeline: "timeline.html",
      action: "actions.html",
      map: "map.html"
    };

    const linkSig = document.getElementById('inspLinkSignals');
    const linkRisk = document.getElementById('inspLinkRisk');
    const linkEv = document.getElementById('inspLinkEvidence');
    const linkTime = document.getElementById('inspLinkTimeline');
    const linkAct = document.getElementById('inspLinkAction');
    const linkMap = document.getElementById('inspLinkMap');

    if (linkSig) linkSig.href = links.signals;
    if (linkRisk) linkRisk.href = links.risk;
    if (linkEv) linkEv.href = links.evidence;
    if (linkTime) linkTime.href = links.timeline;
    if (linkAct) linkAct.href = links.action;
    if (linkMap) linkMap.href = links.map;

    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeInspector() {
    this.isInspectorOpen = false;
    const drawer = document.getElementById('copilotInspectorDrawer');
    const backdrop = document.getElementById('copilotDrawerBackdrop');
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.copilotController = new CopilotController();
  window.copilotController.init();
});
