/**
 * EarlySight — Evidence & Explainability Interactive Controller (Stage 8)
 * 
 * Features:
 * 1. Alert Switching (EW-2026-088 vs EW-2026-094)
 * 2. Visual Connected Cards Engine with dynamic SVG bezier flow paths & particle pulses
 * 3. Deep-Dive Supporting Evidence Drawer / Panel
 * 4. Transparent Evidence Decomposition Calculation (87% Evidence Strength)
 * 5. Explaining "Why was this warning generated?" with clear causal narrative
 * 6. Prominent Evidence Strength Disclaimer (Communicating evidence strength, not certainty)
 */

import '../data/evidence-data.js';

(function () {
  'use strict';

  class EvidenceController {
    constructor() {
      this.alerts = window.EVIDENCE_ALERTS_DATA || [];
      this.activeAlertId = "EW-2026-088";
      this.activeCardId = "ev-complaints"; // Default selected card
      
      this.dom = {
        alertSelector: document.getElementById('evidenceAlertSelector'),
        alertTitle: document.getElementById('evAlertTitle'),
        alertLocation: document.getElementById('evAlertLocation'),
        alertSeverity: document.getElementById('evAlertSeverity'),
        alertLeadTime: document.getElementById('evAlertLeadTime'),
        alertLoss: document.getElementById('evAlertLoss'),
        alertConfidenceVal: document.getElementById('evConfidenceVal'),
        confidencePillText: document.getElementById('confidencePillText'),
        
        // Causal Explainability Section
        whyHeadline: document.getElementById('whyHeadline'),
        whySummary: document.getElementById('whySummary'),
        whyCausalNarrative: document.getElementById('whyCausalNarrative'),
        whyRootCause: document.getElementById('whyRootCause'),
        whyAction: document.getElementById('whyAction'),
        
        // Connected Cards Grid & Flow
        cardsGrid: document.getElementById('evidenceCardsGrid'),
        flowSvg: document.getElementById('evidenceFlowSvg'),
        problemCardContainer: document.getElementById('problemCardContainer'),
        
        // Drilldown Deep-Dive Panel
        drilldownTitle: document.getElementById('drilldownTitle'),
        drilldownBadge: document.getElementById('drilldownBadge'),
        drilldownSummary: document.getElementById('drilldownSummary'),
        drilldownContent: document.getElementById('drilldownContent'),
        
        // Decomposition Table
        decompositionTbody: document.getElementById('decompositionTbody'),
        decompositionTotal: document.getElementById('decompositionTotal')
      };

      this.init();
    }

    init() {
      if (!this.alerts || this.alerts.length === 0) {
        console.error("Evidence alerts data not loaded.");
        return;
      }

      this.bindEvents();
      this.renderAlert(this.activeAlertId);
      
      // Auto-draw connector lines after initial layout
      window.addEventListener('resize', () => {
        this.renderConnectors();
      });

      // Recalculate connectors after fonts/images load
      setTimeout(() => {
        this.renderConnectors();
      }, 250);
    }

    bindEvents() {
      // Alert switch buttons
      const alertBtns = document.querySelectorAll('.alert-select-pill');
      alertBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const alertId = e.currentTarget.getAttribute('data-alert-id');
          if (alertId && alertId !== this.activeAlertId) {
            alertBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            this.switchAlert(alertId);
          }
        });
      });

      // Dispatch action demo button
      const dispatchBtn = document.getElementById('btnDispatchAction');
      if (dispatchBtn) {
        dispatchBtn.addEventListener('click', () => {
          this.triggerDispatchModal();
        });
      }
    }

    getCurrentAlert() {
      return this.alerts.find(a => a.id === this.activeAlertId) || this.alerts[0];
    }

    switchAlert(alertId) {
      this.activeAlertId = alertId;
      const current = this.getCurrentAlert();
      this.activeCardId = current.evidenceCards[0].id;
      this.renderAlert(alertId);
      
      // Smooth scroll back to top of evidence if desired
      setTimeout(() => {
        this.renderConnectors();
      }, 150);
    }

    renderAlert(alertId) {
      const alert = this.getCurrentAlert();
      if (!alert) return;

      // 1. Header & Overview
      if (this.dom.alertTitle) this.dom.alertTitle.textContent = alert.title;
      if (this.dom.alertLocation) this.dom.alertLocation.textContent = alert.location;
      if (this.dom.alertSeverity) {
        this.dom.alertSeverity.textContent = alert.severity.toUpperCase() + " HAZARD";
        this.dom.alertSeverity.className = `stat-badge ${alert.severity.toLowerCase() === 'high' ? 'badge-vermilion' : 'badge-amber'}`;
      }
      if (this.dom.alertLeadTime) this.dom.alertLeadTime.textContent = alert.leadTimeCountdown;
      if (this.dom.alertLoss) this.dom.alertLoss.textContent = alert.projectedLossUSD + " Averted";
      
      // Prominent Confidence Value
      if (this.dom.alertConfidenceVal) {
        this.dom.alertConfidenceVal.textContent = alert.confidence;
      }
      if (this.dom.confidencePillText) {
        this.dom.confidencePillText.textContent = `Confidence: ${alert.confidence} — Reflects cross-silo evidence strength, not certainty.`;
      }

      // 2. "Why was this warning generated?" Section
      if (this.dom.whyHeadline) this.dom.whyHeadline.textContent = alert.whyGeneratedAnswer.headline;
      if (this.dom.whySummary) this.dom.whySummary.textContent = alert.whyGeneratedAnswer.summary;
      if (this.dom.whyCausalNarrative) this.dom.whyCausalNarrative.textContent = alert.whyGeneratedAnswer.causalNarrative;
      if (this.dom.whyRootCause) this.dom.whyRootCause.textContent = alert.whyGeneratedAnswer.rootCauseHypothesis;
      if (this.dom.whyAction) this.dom.whyAction.textContent = alert.whyGeneratedAnswer.prescriptiveAction;

      // 3. Render Upstream Connected Evidence Cards
      this.renderUpstreamCards(alert);

      // 4. Render Downstream Synthesized Problem Card
      this.renderProblemCard(alert);

      // 5. Render Drilldown Deep-Dive Panel
      this.renderDrilldownContent();

      // 6. Render Evidence Weighting Decomposition Table
      this.renderDecompositionTable(alert);

      // 7. Render dynamic SVG Connectors
      setTimeout(() => {
        this.renderConnectors();
      }, 100);
    }

    renderUpstreamCards(alert) {
      if (!this.dom.cardsGrid) return;
      this.dom.cardsGrid.innerHTML = '';

      alert.evidenceCards.forEach(card => {
        const isSelected = card.id === this.activeCardId;
        const cardEl = document.createElement('div');
        cardEl.className = `evidence-visual-card ${isSelected ? 'active-card' : ''}`;
        cardEl.id = `card-${card.id}`;
        cardEl.setAttribute('data-card-id', card.id);

        cardEl.innerHTML = `
          <div class="card-top-row">
            <span class="card-icon-pill" style="background: ${card.themeColor}15; color: ${card.themeColor};">
              <span class="card-icon-char">${card.icon}</span>
              <span class="card-type-name">${card.type}</span>
            </span>
            <span class="card-weight-tag" title="Mathematical weight toward overall confidence">
              ${card.weightContribution} Weight
            </span>
          </div>

          <div class="card-metric-block">
            <span class="card-main-stat">${card.label}</span>
            <span class="card-badge-pill font-mono">${card.badge}</span>
          </div>

          <p class="card-summary-text">${card.summary}</p>

          <div class="card-footer-action">
            <span class="inspect-cue">
              ${isSelected ? '● Currently Inspecting' : 'Inspect Supporting Records ↗'}
            </span>
            <span class="card-flow-anchor" id="anchor-${card.id}"></span>
          </div>
        `;

        cardEl.addEventListener('click', () => {
          this.activeCardId = card.id;
          document.querySelectorAll('.evidence-visual-card').forEach(c => c.classList.remove('active-card'));
          cardEl.classList.add('active-card');
          this.renderDrilldownContent();
          this.renderConnectors();
          
          // Smooth scroll to drilldown section if user is focused
          const drilldown = document.getElementById('supportingEvidenceDrilldown');
          if (drilldown && window.innerWidth < 1024) {
            drilldown.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });

        this.dom.cardsGrid.appendChild(cardEl);
      });
    }

    renderProblemCard(alert) {
      if (!this.dom.problemCardContainer) return;
      const prob = alert.synthesizedProblem;

      this.dom.problemCardContainer.innerHTML = `
        <div class="synthesized-problem-card" id="synthesizedProblemCard">
          <div class="problem-card-anchor" id="problemCardAnchor">
            <div class="convergence-pulse-ring"></div>
            <div class="convergence-indicator-node">
              <span class="convergence-arrow">↓</span>
            </div>
          </div>

          <div class="problem-card-inner">
            <div class="problem-header-row">
              <div class="problem-badge-cluster">
                <span class="hazard-level-pill font-mono">${prob.riskLevel}</span>
                <span class="convergence-tag font-mono">CONVERGED SYNTHESIS</span>
              </div>
              <div class="problem-lead-time">
                <span class="lead-time-icon">⏱</span>
                <span class="lead-time-txt font-mono">${prob.forecastWindow}</span>
              </div>
            </div>

            <h3 class="problem-headline">${prob.headline}</h3>

            <div class="problem-details-grid">
              <div class="problem-detail-col">
                <span class="detail-label font-mono">CRITICAL FAILURE MECHANISM</span>
                <p class="detail-val">${prob.failureMechanism}</p>
              </div>
              <div class="problem-detail-col">
                <span class="detail-label font-mono">ESTIMATED AVERTED DAMAGE</span>
                <p class="detail-val text-vermilion font-mono" style="font-size: 1.15rem; font-weight:800;">${prob.avertedCost}</p>
              </div>
            </div>

            <div class="problem-action-banner">
              <div class="action-banner-text">
                <span class="action-lead-icon">⚡</span>
                <div>
                  <strong>Prescriptive Recommendation:</strong>
                  <span>${prob.recommendedAction}</span>
                </div>
              </div>
              <button class="btn-dispatch-inline" id="btnDispatchAction">
                Authorize Work Order
              </button>
            </div>
          </div>
        </div>
      `;

      // Re-bind action button
      const btn = document.getElementById('btnDispatchAction');
      if (btn) {
        btn.addEventListener('click', () => this.triggerDispatchModal());
      }
    }

    renderConnectors() {
      const svg = this.dom.flowSvg;
      if (!svg) return;

      const alert = this.getCurrentAlert();
      const problemAnchor = document.getElementById('problemCardAnchor');
      if (!problemAnchor) return;

      const svgRect = svg.getBoundingClientRect();
      const probRect = problemAnchor.getBoundingClientRect();

      // Destination point relative to SVG
      const targetX = (probRect.left + probRect.width / 2) - svgRect.left;
      const targetY = (probRect.top + probRect.height / 2) - svgRect.top;

      let pathsHtml = '';
      let particlesHtml = '';

      alert.evidenceCards.forEach((card, index) => {
        const anchorEl = document.getElementById(`anchor-${card.id}`);
        if (!anchorEl) return;

        const anchorRect = anchorEl.getBoundingClientRect();
        const startX = (anchorRect.left + anchorRect.width / 2) - svgRect.left;
        const startY = (anchorRect.top + anchorRect.height / 2) - svgRect.top;

        // Calculate smooth cubic bezier path converging downwards
        const deltaY = targetY - startY;
        const c1X = startX;
        const c1Y = startY + deltaY * 0.45;
        const c2X = targetX;
        const c2Y = startY + deltaY * 0.85;

        const pathData = `M ${startX} ${startY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${targetX} ${targetY}`;
        const isSelected = card.id === this.activeCardId;
        const strokeColor = card.themeColor;
        const strokeWidth = isSelected ? 3.5 : 2.0;
        const strokeOpacity = isSelected ? 1.0 : 0.65;
        const animDelay = (index * 0.40).toFixed(2);

        // Path
        pathsHtml += `
          <path d="${pathData}" 
                id="flow-path-${card.id}" 
                fill="none" 
                stroke="${strokeColor}" 
                stroke-width="${strokeWidth}" 
                stroke-opacity="${strokeOpacity}" 
                stroke-dasharray="${isSelected ? 'none' : '6 4'}"
                class="connector-path ${isSelected ? 'active-path' : ''}" />
        `;

        // Pulsing particle flowing down the path towards the problem
        pathsHtml += `
          <circle r="${isSelected ? 5.5 : 4}" fill="${card.themeColor}" class="pulse-particle">
            <animateMotion dur="2.2s" repeatCount="indefinite" path="${pathData}" begin="${animDelay}s" />
          </circle>
        `;
      });

      svg.innerHTML = `
        <defs>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        ${pathsHtml}
      `;
    }

    renderDrilldownContent() {
      const alert = this.getCurrentAlert();
      const card = alert.evidenceCards.find(c => c.id === this.activeCardId) || alert.evidenceCards[0];
      if (!card) return;

      if (this.dom.drilldownTitle) {
        this.dom.drilldownTitle.innerHTML = `
          <span style="color: ${card.themeColor}; margin-right: 8px;">${card.icon}</span>
          <span>${card.label}</span>
        `;
      }
      if (this.dom.drilldownBadge) {
        this.dom.drilldownBadge.textContent = card.badge;
      }
      if (this.dom.drilldownSummary) {
        this.dom.drilldownSummary.textContent = card.summary;
      }

      if (!this.dom.drilldownContent) return;

      // Render specialized content based on card type
      if (card.evidenceItems && card.type === "Similar Complaints") {
        this.renderComplaintsDrilldown(card);
      } else if (card.evidenceItems && card.type === "Repeated Maintenance Reports") {
        this.renderMaintenanceDrilldown(card);
      } else if (card.spatialMetrics) {
        this.renderLocationDrilldown(card);
      } else if (card.velocityMetrics) {
        this.renderFrequencyDrilldown(card);
      } else if (card.historicalMetrics) {
        this.renderHistoricalDrilldown(card);
      }
    }

    renderComplaintsDrilldown(card) {
      let itemsHtml = `
        <div class="drilldown-table-wrapper">
          <div class="drilldown-table-header">
            <span>SHOWING ${card.evidenceItems.length} OPERATOR LOGS & VERBATIM TRANSCRIPTS</span>
            <span class="font-mono text-muted">CROSS-SHIFT NLP CORRELATION</span>
          </div>
          <div class="complaints-list">
      `;

      card.evidenceItems.forEach((item, idx) => {
        itemsHtml += `
          <div class="complaint-item-card">
            <div class="complaint-item-top">
              <span class="complaint-seq font-mono">#0${idx + 1}</span>
              <span class="complaint-date font-mono">${item.date}</span>
              <span class="complaint-author font-mono">${item.author}</span>
              <span class="complaint-bay-badge font-mono">${item.bay}</span>
            </div>
            <p class="complaint-text">"${item.text}"</p>
          </div>
        `;
      });

      itemsHtml += `</div></div>`;
      this.dom.drilldownContent.innerHTML = itemsHtml;
    }

    renderMaintenanceDrilldown(card) {
      let itemsHtml = `
        <div class="drilldown-table-wrapper">
          <div class="drilldown-table-header">
            <span>SHOWING ${card.evidenceItems.length} CMMS WORK ORDERS & MAINTENANCE TICKETS</span>
            <span class="font-mono text-muted">PREVENTIVE VS UNCORRELATED LOGS</span>
          </div>
          <div class="maintenance-tickets-list">
      `;

      card.evidenceItems.forEach(item => {
        itemsHtml += `
          <div class="maintenance-ticket-card">
            <div class="maint-ticket-top">
              <span class="maint-id font-mono">${item.woId}</span>
              <span class="maint-date font-mono">${item.date}</span>
              <span class="maint-tech font-mono">${item.tech}</span>
              <span class="maint-status font-mono ${item.status.includes('Closed') ? 'status-amber' : 'status-teal'}">${item.status}</span>
            </div>
            <p class="maint-desc">${item.text}</p>
          </div>
        `;
      });

      itemsHtml += `</div></div>`;
      this.dom.drilldownContent.innerHTML = itemsHtml;
    }

    renderLocationDrilldown(card) {
      const sp = card.spatialMetrics;
      this.dom.drilldownContent.innerHTML = `
        <div class="spatial-drilldown-grid">
          <div class="spatial-metric-box">
            <span class="spatial-label font-mono">CO-LOCATION RADIUS</span>
            <span class="spatial-val font-mono text-blue">${sp.maxDispersionRadius}</span>
            <span class="spatial-sub">All 17 precursors clustered within this tight sub-slab radius</span>
          </div>

          <div class="spatial-metric-box">
            <span class="spatial-label font-mono">FACILITY QUADRANT</span>
            <span class="spatial-val" style="font-size: 1.15rem; font-weight:700;">${sp.quadrant}</span>
            <span class="spatial-sub">${sp.trenchSegment}</span>
          </div>

          <div class="spatial-metric-box">
            <span class="spatial-label font-mono">SUBSURFACE PROBE TELEMETRY</span>
            <span class="spatial-val font-mono text-vermilion" style="font-size: 1.15rem; font-weight:700;">${sp.soilMoistureProbe}</span>
            <span class="spatial-sub">High volumetric moisture confirmed beneath concrete slab</span>
          </div>
        </div>

        <div class="spatial-assets-box">
          <div class="spatial-assets-title font-mono">CRITICAL CO-LOCATED ASSETS IN RISK CONE:</div>
          <div class="asset-chips-row">
            ${sp.affectedAssets.map(asset => `<span class="asset-chip">📍 ${asset}</span>`).join('')}
          </div>
        </div>
      `;
    }

    renderFrequencyDrilldown(card) {
      const vm = card.velocityMetrics;
      this.dom.drilldownContent.innerHTML = `
        <div class="velocity-drilldown-grid">
          <div class="velocity-stat-card">
            <span class="velocity-label font-mono">VELOCITY SURGE ACCELERATION</span>
            <span class="velocity-val font-mono text-vermilion">${vm.accelerationRate}</span>
            <span class="velocity-sub">Exponential arrival rate increase over rolling 72-hour baseline</span>
          </div>

          <div class="velocity-stat-card">
            <span class="velocity-label font-mono">MEAN TIME BETWEEN SIGNALS</span>
            <span class="velocity-val font-mono text-amber">${vm.meanTimeBetweenSignals}</span>
            <span class="velocity-sub">Precursor interval collapsed from 168 hours down to 6.2 hours</span>
          </div>

          <div class="velocity-stat-card">
            <span class="velocity-label font-mono">DAILY ARRIVAL VELOCITY</span>
            <span class="velocity-val font-mono">${vm.arrivalVelocityDaily}</span>
            <span class="velocity-sub">${vm.coherencePhase}</span>
          </div>
        </div>

        <div class="velocity-alert-banner">
          <span class="velocity-alert-icon">⚠️</span>
          <div>
            <strong>Velocity Trajectory Insight:</strong>
            <span>${vm.trajectoryAlert}</span>
          </div>
        </div>
      `;
    }

    renderHistoricalDrilldown(card) {
      const hm = card.historicalMetrics;
      this.dom.drilldownContent.innerHTML = `
        <div class="historical-drilldown-container">
          <div class="historical-match-top">
            <div class="match-score-badge">
              <span class="match-score-num font-mono">${hm.matchScore}</span>
              <span class="match-score-sub font-mono">COSINE EMBEDDING SIMILARITY</span>
            </div>
            <div class="match-incident-info">
              <span class="match-incident-title">${hm.pastIncident}</span>
              <span class="match-incident-impact font-mono text-vermilion">Past Damage: ${hm.unmitigatedCost} • ${hm.unmitigatedDowntime}</span>
            </div>
          </div>

          <div class="precursor-chain-box">
            <span class="precursor-chain-label font-mono">IDENTICAL 4-STAGE PRECURSOR CASCADE:</span>
            <div class="chain-flow-display font-mono">
              ${hm.identicalPrecursorChain}
            </div>
          </div>
        </div>
      `;
    }

    renderDecompositionTable(alert) {
      if (!this.dom.decompositionTbody) return;
      this.dom.decompositionTbody.innerHTML = '';

      let totalWeightNum = 0;
      let totalContribNum = 0;

      alert.evidenceWeightsDecomposition.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="decomp-factor-cell">
            <strong>${item.factor}</strong>
          </td>
          <td class="decomp-weight-cell font-mono">${item.weight}</td>
          <td class="decomp-contrib-cell font-mono text-vermilion"><strong>${item.contribution}</strong></td>
          <td class="decomp-rationale-cell">${item.rationale}</td>
        `;
        this.dom.decompositionTbody.appendChild(tr);

        totalWeightNum += parseInt(item.weight, 10) || 0;
        totalContribNum += parseFloat(item.contribution) || 0;
      });

      if (this.dom.decompositionTotal) {
        this.dom.decompositionTotal.innerHTML = `
          <div class="decomp-summary-bar">
            <div class="decomp-sum-item">
              <span class="decomp-sum-label font-mono">AGGREGATE EVIDENCE STRENGTH:</span>
              <span class="decomp-sum-val font-mono text-vermilion">${alert.confidence}</span>
            </div>
            <div class="decomp-sum-item">
              <span class="decomp-sum-label font-mono">TOTAL CONTRIBUTING WEIGHT:</span>
              <span class="decomp-sum-val font-mono">${totalWeightNum}% (Normalized)</span>
            </div>
            <div class="decomp-sum-note">
              Confidence communicates the strength and coherence of available evidence, NOT certainty.
            </div>
          </div>
        `;
      }
    }

    triggerDispatchModal() {
      const alert = this.getCurrentAlert();
      alert(`[EarlySight Prescriptive Dispatch]\n\nDispatching Work Order for Alert ${alert.id}:\n${alert.synthesizedProblem.headline}\n\nAssigned: Maintenance Quick-Response Unit\nAverted Loss: ${alert.projectedLossUSD}\nLead Time Window: ${alert.leadTimeDays} Days\n\nWork order packet generated with 5 verified evidence attachments.`);
    }
  }

  // Auto-instantiate when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    window.evidenceController = new EvidenceController();
  });

})();
