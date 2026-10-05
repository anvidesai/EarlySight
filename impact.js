/**
 * EarlySight — Impact Monitoring Controller (Stage 11)
 * 
 * Verifies whether operational interventions actually reduced the problem.
 * Manages Before/Action/After transformation visualization, dual-phase trend chart,
 * telemetry decay breakdowns, and master verification ledger.
 */

(function () {
  'use strict';

  // Defensive fallback data if impact-data.js is absent
  const rawData = window.IMPACT_MONITORING_DATA || {
    executiveKPIs: {
      averageSignalReductionPct: "-95.2%",
      totalAvertedLoss2026: "$1,922,000",
      totalDowntimeHoursAverted: 180,
      activeAuditedInterventions: 5,
      truePositiveVerificationRate: "100%",
      meanTimeToStabilizationDays: 3.4
    },
    interventions: [
      {
        id: "IMP-2026-088",
        alertId: "EW-2026-088",
        actionTicketId: "ACT-2026-088",
        title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
        asset: "DI Water Main Trench Feed — Joint 4B-12",
        location: "Block A — Trench 4B / Assembly Bay 4",
        responsibleTeam: "Civil & Piping Infrastructure",
        assignedPerson: "Marcus Vance (Senior Piping Lead)",
        priority: "Critical P1",
        beforeSignalsCount: 17,
        beforeFrequency: "4.8 signals / day",
        beforeMTBS: "6.2 hours between signals",
        actionTaken: "Isolated auxiliary trench bypass loop, conducted ultrasonic bolt elongation check, replaced degraded EPDM elastomer with chemical-resistant Viton FKM gasket ring, retorqued studs to 340 Nm, and cleared concrete raceway drainage channel.",
        actionDate: "Sep 20, 2026 — 02:30 (Midnight Shift)",
        workOrder: "WO-2026-8841",
        afterActionInitialCount: 6,
        afterActionFinalCount: 1,
        afterFrequency: "0.14 signals / day",
        afterMTBS: "168.0 hours between signals",
        reductionPercentage: "-94.1%",
        resolutionStatus: "Verified Remediated",
        monitoringPeriod: "14-Day Post-Intervention Audit (Sep 20 – Oct 04, 2026)",
        currentTrend: "Decaying to Baseline (-94.1%)",
        trendStatus: "improving",
        financialSavings: "$512,000",
        avertedDowntimeHours: 36,
        secondaryFaultsAvoided: "Cleanroom Cell C subterranean water inundation & 3.3kV conduit short circuit",
        timelineDays: ["Day -5", "Day -4", "Day -3", "Day -2", "Day -1", "Day 0 (Action)", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5"],
        beforeTrendValues: [1.2, 1.8, 2.4, 3.6, 4.8, 4.8],
        afterTrendValues: [4.8, 1.8, 1.2, 0.6, 0.3, 0.14],
        dailySignals: [1, 2, 3, 4, 7, 6, 3, 2, 1, 1, 0],
        telemetryStreams: [
          { name: "Sub-slab Soil Moisture (Probe SM-4B)", preVal: "68.4% VWC", postVal: "24.1% VWC (Baseline)", delta: "-64.8%", status: "Nominal" },
          { name: "High-Frequency Ultrasonic Hiss (AE-04)", preVal: "48.2 kHz", postVal: "1.2 kHz (Background)", delta: "-97.5%", status: "Nominal" },
          { name: "Trench Sump Ingress Rate", preVal: "18.4 L / day", postVal: "0.1 L / day", delta: "-99.5%", status: "Nominal" },
          { name: "Operator Shift Dampness Complaints", preVal: "8 logs / 14d", postVal: "0 logs / 10d", delta: "-100%", status: "Resolved" }
        ],
        verificationNotes: "Ultrasonic acoustic imaging confirms zero micro-cavitation leakage along joint 4B-12 circumference. Soil probe SM-4B shows normal moisture decay gradient as concrete slab dries out. Pressure transducer PT-102 holds nominal 4.2 bar with zero cyclic pulsation. True positive early warning confirmed: averted complete conduit inundation."
      }
    ]
  };

  class ImpactMonitoringController {
    constructor(data) {
      this.data = data;
      this.currentCaseIndex = 0;
      this.currentChartMode = 'frequency'; // 'frequency' | 'daily' | 'cumulative'
      this.activeScrubIndex = 5; // Day 0 by default
      this.isPlayingTrajectory = false;
      this.playbackInterval = null;
      this.ledgerFilter = 'all';
      this.searchQuery = '';

      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.onReady());
      } else {
        this.onReady();
      }
    }

    onReady() {
      this.cacheElements();
      this.renderExecutiveKPIs();
      this.renderCasePills();
      this.loadCase(0);
      this.renderLedgerTable();
      this.bindEvents();
    }

    cacheElements() {
      // KPI Ribbon
      this.elKpiAvgReduction = document.getElementById('kpiAvgReduction');
      this.elKpiTotalSavings = document.getElementById('kpiTotalSavings');
      this.elKpiDowntimeHours = document.getElementById('kpiDowntimeHours');
      this.elKpiTruePositive = document.getElementById('kpiTruePositive');
      this.elKpiTimeToStabilize = document.getElementById('kpiTimeToStabilize');

      // Hero Elements
      this.elActiveCaseAssetTag = document.getElementById('activeCaseAssetTag');
      this.elActiveCaseTitle = document.getElementById('activeCaseTitle');
      this.elActiveCaseDesc = document.getElementById('activeCaseDesc');
      this.elActiveCaseTicketId = document.getElementById('activeCaseTicketId');
      this.elActiveCaseAlertLink = document.getElementById('activeCaseAlertLink');
      this.elActiveCaseTeam = document.getElementById('activeCaseTeam');
      this.elActiveCasePerson = document.getElementById('activeCasePerson');
      this.elCasePillsContainer = document.getElementById('casePillsContainer');

      // 3-Step Flow Elements
      this.elValBeforeCount = document.getElementById('valBeforeCount');
      this.elValBeforeFreq = document.getElementById('valBeforeFreq');
      this.elValBeforeMTBS = document.getElementById('valBeforeMTBS');
      this.elValBeforeRisk = document.getElementById('valBeforeRisk');

      this.elValActionWO = document.getElementById('valActionWO');
      this.elValActionDate = document.getElementById('valActionDate');
      this.elValActionSummary = document.getElementById('valActionSummary');
      this.elValActionTech = document.getElementById('valActionTech');
      this.elValActionLocation = document.getElementById('valActionLocation');

      this.elValAfterCount = document.getElementById('valAfterCount');
      this.elValResidualText = document.getElementById('valResidualText');
      this.elValReductionPill = document.getElementById('valReductionPill');
      this.elValAfterFreq = document.getElementById('valAfterFreq');
      this.elValAfterMTBS = document.getElementById('valAfterMTBS');
      this.elValFreqDelta = document.getElementById('valFreqDelta');
      this.elValAfterSavings = document.getElementById('valAfterSavings');

      // Mandatory Dimensions Bar Elements
      this.elDimFreqBefore = document.getElementById('dimFreqBefore');
      this.elDimMTBSBefore = document.getElementById('dimMTBSBefore');
      this.elDimFreqAfter = document.getElementById('dimFreqAfter');
      this.elDimMTBSAfter = document.getElementById('dimMTBSAfter');
      this.elDimStatusBadge = document.getElementById('dimStatusBadge');
      this.elDimStatusSignoff = document.getElementById('dimStatusSignoff');
      this.elDimMonitoringPeriod = document.getElementById('dimMonitoringPeriod');
      this.elDimPeriodDates = document.getElementById('dimPeriodDates');
      this.elDimCurrentTrend = document.getElementById('dimCurrentTrend');
      this.elDimTrendSub = document.getElementById('dimTrendSub');

      // Chart Elements
      this.elTrendSvgChart = document.getElementById('trendSvgChart');
      this.elChartTooltip = document.getElementById('chartTooltip');
      this.elTrendChartViewport = document.getElementById('trendChartViewport');
      this.elScrubPipsTrack = document.getElementById('scrubPipsTrack');
      this.elBtnPlayTrajectory = document.getElementById('btnPlayTrajectory');

      // Telemetry & Contrast Elements
      this.elTelemetryStreamsContainer = document.getElementById('telemetryStreamsContainer');
      this.elActiveVerificationNotes = document.getElementById('activeVerificationNotes');
      this.elSpecReductionPct = document.getElementById('specReductionPct');
      this.elSpecCascading = document.getElementById('specCascading');

      // Ledger Table
      this.elLedgerTableBody = document.getElementById('ledgerTableBody');
      this.elLedgerSearchInput = document.getElementById('ledgerSearchInput');

      // Modal Elements
      this.elAuditCertModal = document.getElementById('auditCertModal');
      this.elCertModalTitle = document.getElementById('certModalTitle');
      this.elCertModalBody = document.getElementById('certModalBody');
      this.elBtnCertModalClose = document.getElementById('btnCertModalClose');
      this.elBtnDismissCert = document.getElementById('btnDismissCert');
      this.elBtnPrintCert = document.getElementById('btnPrintCert');

      // Toast Container
      this.elToastContainer = document.getElementById('impactToastContainer');
    }

    renderExecutiveKPIs() {
      const kpis = this.data.executiveKPIs || {};
      if (this.elKpiAvgReduction) this.elKpiAvgReduction.textContent = kpis.averageSignalReductionPct || "-95.2%";
      if (this.elKpiTotalSavings) this.elKpiTotalSavings.textContent = kpis.totalAvertedLoss2026 || "$1,922,000";
      if (this.elKpiDowntimeHours) this.elKpiDowntimeHours.textContent = `${kpis.totalDowntimeHoursAverted || 180} hrs`;
      if (this.elKpiTruePositive) this.elKpiTruePositive.textContent = kpis.truePositiveVerificationRate || "100%";
      if (this.elKpiTimeToStabilize) this.elKpiTimeToStabilize.textContent = `${kpis.meanTimeToStabilizationDays || 3.4} days`;
    }

    renderCasePills() {
      if (!this.elCasePillsContainer) return;
      this.elCasePillsContainer.innerHTML = '';

      this.data.interventions.forEach((item, index) => {
        const pill = document.createElement('button');
        pill.className = `impact-case-pill ${index === this.currentCaseIndex ? 'active' : ''}`;
        pill.setAttribute('role', 'tab');
        pill.setAttribute('aria-selected', index === this.currentCaseIndex ? 'true' : 'false');
        pill.dataset.index = index;

        // Visual indicator dot based on status
        const dotClass = item.resolutionStatus === 'Verified Remediated' ? 'dot-emerald' : 'dot-amber';

        pill.innerHTML = `
          <span class="pill-dot ${dotClass}"></span>
          <span class="pill-id font-mono">${item.id}</span>
          <span class="pill-title">${item.title}</span>
          <span class="pill-counts font-mono">${item.beforeSignalsCount} &rarr; ${item.afterActionInitialCount} signals (${item.reductionPercentage})</span>
        `;

        pill.addEventListener('click', () => {
          this.loadCase(index);
        });

        this.elCasePillsContainer.appendChild(pill);
      });
    }

    loadCase(index) {
      if (index < 0 || index >= this.data.interventions.length) return;
      this.currentCaseIndex = index;
      const c = this.data.interventions[index];

      // Update case pill selection
      const allPills = this.elCasePillsContainer.querySelectorAll('.impact-case-pill');
      allPills.forEach((p, idx) => {
        if (idx === index) {
          p.classList.add('active');
          p.setAttribute('aria-selected', 'true');
        } else {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        }
      });

      // Update Hero Text
      if (this.elActiveCaseAssetTag) this.elActiveCaseAssetTag.textContent = c.asset;
      if (this.elActiveCaseTitle) this.elActiveCaseTitle.textContent = c.title;
      if (this.elActiveCaseDesc) {
        this.elActiveCaseDesc.textContent = `Proving physical remediation efficacy for ${c.asset} in ${c.location}. Monitors whether ${c.workOrder} successfully suppressed anomalous failure precursors and restored baseline physical equilibrium.`;
      }
      if (this.elActiveCaseTicketId) this.elActiveCaseTicketId.textContent = c.id;
      if (this.elActiveCaseAlertLink) {
        this.elActiveCaseAlertLink.textContent = `${c.alertId} \u2192`;
        this.elActiveCaseAlertLink.href = `evidence.html`;
      }
      if (this.elActiveCaseTeam) this.elActiveCaseTeam.textContent = c.responsibleTeam;
      if (this.elActiveCasePerson) this.elActiveCasePerson.textContent = c.assignedPerson;

      // 1. BEFORE ACTION CARD
      if (this.elValBeforeCount) this.elValBeforeCount.textContent = c.beforeSignalsCount;
      if (this.elValBeforeFreq) this.elValBeforeFreq.textContent = c.beforeFrequency;
      if (this.elValBeforeMTBS) this.elValBeforeMTBS.textContent = c.beforeMTBS;
      if (this.elValBeforeRisk) this.elValBeforeRisk.textContent = `${c.financialSavings} / ${c.avertedDowntimeHours}h Downtime`;

      // 2. ACTION TAKEN CARD
      if (this.elValActionWO) this.elValActionWO.textContent = c.workOrder;
      if (this.elValActionDate) this.elValActionDate.textContent = c.actionDate;
      if (this.elValActionSummary) this.elValActionSummary.textContent = c.actionTaken;
      if (this.elValActionTech) this.elValActionTech.textContent = c.assignedPerson;
      if (this.elValActionLocation) this.elValActionLocation.textContent = c.location;

      // 3. AFTER ACTION CARD
      if (this.elValAfterCount) this.elValAfterCount.textContent = c.afterActionInitialCount;
      if (this.elValResidualText) {
        this.elValResidualText.textContent = `(Decaying to ${c.afterActionFinalCount} residual)`;
      }
      if (this.elValReductionPill) this.elValReductionPill.textContent = `${c.reductionPercentage} DECAY`;
      if (this.elValAfterFreq) this.elValAfterFreq.textContent = c.afterFrequency;
      if (this.elValAfterMTBS) this.elValAfterMTBS.textContent = c.afterMTBS;
      if (this.elValFreqDelta) {
        this.elValFreqDelta.textContent = `\u2193 ${c.reductionPercentage} reduction`;
      }
      if (this.elValAfterSavings) this.elValAfterSavings.textContent = `${c.financialSavings} Confirmed`;

      // 4. MANDATORY STAGE 11 DIMENSIONS
      if (this.elDimFreqBefore) this.elDimFreqBefore.textContent = c.beforeFrequency;
      if (this.elDimMTBSBefore) this.elDimMTBSBefore.textContent = `MTBS: ${c.beforeMTBS}`;
      if (this.elDimFreqAfter) this.elDimFreqAfter.textContent = c.afterFrequency;
      if (this.elDimMTBSAfter) this.elDimMTBSAfter.textContent = `MTBS: ${c.afterMTBS}`;

      if (this.elDimStatusBadge) {
        this.elDimStatusBadge.textContent = c.resolutionStatus;
        if (c.resolutionStatus === 'Verified Remediated') {
          this.elDimStatusBadge.className = 'status-chip chip-verified';
          if (this.elDimStatusSignoff) this.elDimStatusSignoff.textContent = 'Engineering Sign-off Approved';
        } else {
          this.elDimStatusBadge.className = 'status-chip chip-monitoring';
          if (this.elDimStatusSignoff) this.elDimStatusSignoff.textContent = 'Active Telemetry Watch Window';
        }
      }

      if (this.elDimMonitoringPeriod) {
        // e.g., "14-Day Post-Intervention Audit"
        const cleanPeriod = c.monitoringPeriod.split('(')[0].trim();
        this.elDimMonitoringPeriod.textContent = cleanPeriod || c.monitoringPeriod;
      }
      if (this.elDimPeriodDates) {
        // e.g., "Sep 20 – Oct 04, 2026"
        const match = c.monitoringPeriod.match(/\((.*?)\)/);
        this.elDimPeriodDates.textContent = match ? match[1] : c.monitoringPeriod;
      }

      if (this.elDimCurrentTrend) {
        this.elDimCurrentTrend.textContent = c.currentTrend;
        if (c.trendStatus === 'improving') {
          this.elDimCurrentTrend.className = 'dim-value text-emerald font-mono';
          if (this.elDimTrendSub) this.elDimTrendSub.textContent = 'Stabilized Equilibrium';
        } else {
          this.elDimCurrentTrend.className = 'dim-value text-amber font-mono';
          if (this.elDimTrendSub) this.elDimTrendSub.textContent = 'Decaying Towards Spec';
        }
      }

      // Telemetry Streams & Contrast
      this.renderTelemetryStreams(c.telemetryStreams);
      if (this.elActiveVerificationNotes) this.elActiveVerificationNotes.textContent = c.verificationNotes;
      if (this.elSpecReductionPct) this.elSpecReductionPct.textContent = `${c.reductionPercentage} Sustained`;
      if (this.elSpecCascading) this.elSpecCascading.textContent = c.secondaryFaultsAvoided;

      // Render Clean SVG Trend Visualization
      this.renderScrubPips(c);
      this.renderTrendChart(c);

      // Trigger a subtle pulse on cards
      this.pulseTransformationCards();
    }

    pulseTransformationCards() {
      const cards = [
        document.getElementById('cardBeforeAction'),
        document.getElementById('cardActionTaken'),
        document.getElementById('cardAfterAction')
      ];
      cards.forEach(card => {
        if (!card) return;
        card.classList.remove('pulse-highlight');
        void card.offsetWidth; // trigger reflow
        card.classList.add('pulse-highlight');
      });
    }

    renderTelemetryStreams(streams) {
      if (!this.elTelemetryStreamsContainer) return;
      this.elTelemetryStreamsContainer.innerHTML = '';

      if (!streams || !streams.length) {
        this.elTelemetryStreamsContainer.innerHTML = '<div class="text-muted p-4">No sensor streams configured.</div>';
        return;
      }

      streams.forEach((s) => {
        const streamCard = document.createElement('div');
        streamCard.className = 'telemetry-stream-card';

        // Calculate a visual progress reduction percentage (default to 85% if parsing fails)
        let deltaPctNumber = 85;
        const deltaMatch = s.delta.match(/([0-9.]+)%/);
        if (deltaMatch) {
          deltaPctNumber = parseFloat(deltaMatch[1]);
        }

        streamCard.innerHTML = `
          <div class="stream-card-header">
            <span class="stream-name">${s.name}</span>
            <span class="status-chip chip-verified font-mono" style="font-size:0.7rem;">${s.status}</span>
          </div>

          <div class="stream-values-row">
            <div class="stream-val-col">
              <span class="stream-val-sub font-mono">PRE-ACTION:</span>
              <span class="stream-val-main font-mono text-vermilion">${s.preVal}</span>
            </div>
            <div class="stream-arrow font-mono text-muted">&rarr;</div>
            <div class="stream-val-col">
              <span class="stream-val-sub font-mono">POST-ACTION:</span>
              <span class="stream-val-main font-mono text-emerald">${s.postVal}</span>
            </div>
          </div>

          <div class="stream-progress-track" title="Decay rate: ${s.delta}">
            <div class="stream-progress-bar" style="width: ${Math.min(100, Math.max(10, deltaPctNumber))}%;"></div>
          </div>

          <div class="stream-delta-footer">
            <span class="stream-delta-pill font-mono text-emerald">&darr; ${s.delta} decay</span>
            <span class="stream-baseline-tag font-mono">Restored to Baseline</span>
          </div>
        `;

        this.elTelemetryStreamsContainer.appendChild(streamCard);
      });
    }

    renderScrubPips(c) {
      if (!this.elScrubPipsTrack) return;
      this.elScrubPipsTrack.innerHTML = '';

      c.timelineDays.forEach((dayLabel, index) => {
        const pip = document.createElement('button');
        pip.className = `scrub-pip ${index === this.activeScrubIndex ? 'active' : ''} ${index === 5 ? 'pip-action' : ''}`;
        pip.dataset.index = index;
        pip.title = `${dayLabel}: Click to view telemetry`;

        pip.innerHTML = `
          <span class="pip-circle"></span>
          <span class="pip-text font-mono">${dayLabel.replace('Day ', 'D')}</span>
        `;

        pip.addEventListener('click', () => {
          this.activeScrubIndex = index;
          this.updateScrubPips();
          this.highlightChartDay(index);
        });

        this.elScrubPipsTrack.appendChild(pip);
      });
    }

    updateScrubPips() {
      const pips = this.elScrubPipsTrack.querySelectorAll('.scrub-pip');
      pips.forEach((pip, idx) => {
        if (idx === this.activeScrubIndex) {
          pip.classList.add('active');
        } else {
          pip.classList.remove('active');
        }
      });
    }

    highlightChartDay(dayIndex) {
      const c = this.data.interventions[this.currentCaseIndex];
      const dayLabel = c.timelineDays[dayIndex];
      const isPre = dayIndex <= 5;
      const isAction = dayIndex === 5;

      let freqVal = isPre ? c.beforeTrendValues[dayIndex] : c.afterTrendValues[dayIndex - 5];
      let dailyCount = c.dailySignals[dayIndex] !== undefined ? c.dailySignals[dayIndex] : (isPre ? 4 : 1);

      // Show Tooltip over the day coordinate
      this.showTooltipForIndex(dayIndex, dayLabel, isAction, isPre, freqVal, dailyCount, c);
    }

    showTooltipForIndex(dayIndex, dayLabel, isAction, isPre, freqVal, dailyCount, c) {
      if (!this.elChartTooltip || !this.elTrendSvgChart) return;

      const ttDay = document.getElementById('ttDay');
      const ttPhase = document.getElementById('ttPhase');
      const ttFreq = document.getElementById('ttFreq');
      const ttCount = document.getElementById('ttCount');
      const ttNote = document.getElementById('ttNote');

      if (ttDay) ttDay.textContent = dayLabel;
      if (ttPhase) {
        if (isAction) {
          ttPhase.textContent = `\u26A1 Physical Intervention Boundary (${c.workOrder})`;
          ttPhase.style.color = 'var(--accent-amber)';
        } else if (isPre) {
          ttPhase.textContent = 'Pre-Intervention Precursor Surge Phase';
          ttPhase.style.color = 'var(--accent-risk)';
        } else {
          ttPhase.textContent = 'Post-Intervention Signal Decay Phase';
          ttPhase.style.color = '#059669';
        }
      }
      if (ttFreq) ttFreq.textContent = `${freqVal.toFixed(2)} signals / day`;
      if (ttCount) ttCount.textContent = `${dailyCount} raw events`;

      if (ttNote) {
        if (isAction) {
          ttNote.textContent = `Action executed: ${c.actionTaken.substring(0, 90)}...`;
        } else if (dayIndex < 3) {
          ttNote.textContent = `Early anomalous precursor drift detected in ${c.location}.`;
        } else if (dayIndex < 5) {
          ttNote.textContent = `Precursor frequency surged to ${freqVal.toFixed(1)}/day. Early warning triggered.`;
        } else if (dayIndex === 6) {
          ttNote.textContent = `Initial 24h drop following ${c.workOrder} execution. Residual transient damping.`;
        } else if (dayIndex > 8) {
          ttNote.textContent = `Subsystem settled at nominal zero-leakage baseline (<0.20/day).`;
        } else {
          ttNote.textContent = `Continuous decay gradient verified by field sensors.`;
        }
      }

      // Position tooltip relative to viewport
      const totalDays = c.timelineDays.length;
      const pctX = (dayIndex / (totalDays - 1));
      const chartWidth = this.elTrendChartViewport.clientWidth;
      const posX = 70 + pctX * (chartWidth - 140);

      this.elChartTooltip.style.display = 'block';
      this.elChartTooltip.style.left = `${posX}px`;
      this.elChartTooltip.style.top = `60px`;
    }

    /**
     * CLEAN DUAL-PHASE TREND VISUALIZATION (SVG Rendering)
     */
    renderTrendChart(c) {
      if (!this.elTrendSvgChart) return;

      const svg = this.elTrendSvgChart;
      const width = 1000;
      const height = 380;
      const padLeft = 70;
      const padRight = 50;
      const padTop = 45;
      const padBottom = 55;

      const plotWidth = width - padLeft - padRight;
      const plotHeight = height - padTop - padBottom;

      const days = c.timelineDays;
      const totalSteps = days.length; // 11 days: Day -5 (idx 0) to Day 0 (idx 5) to Day +5 (idx 10)
      const actionIndex = 5;

      // Determine values according to mode
      let yValues = [];
      let maxVal = 6.0;

      if (this.currentChartMode === 'frequency') {
        // 0 to 5: beforeTrendValues (0 to 5)
        // 5 to 10: afterTrendValues (0 to 5)
        yValues = [
          c.beforeTrendValues[0],
          c.beforeTrendValues[1],
          c.beforeTrendValues[2],
          c.beforeTrendValues[3],
          c.beforeTrendValues[4],
          c.beforeTrendValues[5], // Day 0
          c.afterTrendValues[1],
          c.afterTrendValues[2],
          c.afterTrendValues[3],
          c.afterTrendValues[4],
          c.afterTrendValues[5]
        ];
        maxVal = Math.max(5.5, ...yValues) * 1.15;
      } else if (this.currentChartMode === 'daily') {
        yValues = c.dailySignals || [1, 2, 3, 4, 7, 6, 3, 2, 1, 1, 0];
        maxVal = Math.max(8, ...yValues) + 1;
      } else if (this.currentChartMode === 'cumulative') {
        // Cumulative sum of signals
        let sum = 0;
        yValues = (c.dailySignals || [1, 2, 3, 4, 7, 6, 3, 2, 1, 1, 0]).map(v => {
          sum += v;
          return sum;
        });
        maxVal = sum * 1.15;
      }

      const getX = (index) => padLeft + (index / (totalSteps - 1)) * plotWidth;
      const getY = (val) => padTop + plotHeight - (val / maxVal) * plotHeight;
      const actionX = getX(actionIndex);

      // Build SVG elements
      let svgContent = '';

      // Defs (Gradients & Filters)
      svgContent += `
        <defs>
          <linearGradient id="gradPreArea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#D94E34" stop-opacity="0.30" />
            <stop offset="100%" stop-color="#D94E34" stop-opacity="0.01" />
          </linearGradient>

          <linearGradient id="gradPostArea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#059669" stop-opacity="0.32" />
            <stop offset="100%" stop-color="#059669" stop-opacity="0.01" />
          </linearGradient>

          <linearGradient id="gradActionLine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#D97706" stop-opacity="0.9" />
            <stop offset="50%" stop-color="#D97706" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#D97706" stop-opacity="0.1" />
          </linearGradient>

          <filter id="glowDrop" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      `;

      // Background Grid Lines & Y-Axis Labels (5 horizontal lines)
      const numGridLines = 5;
      for (let i = 0; i <= numGridLines; i++) {
        const gridVal = (maxVal / numGridLines) * i;
        const gridY = getY(gridVal);

        svgContent += `
          <line x1="${padLeft}" y1="${gridY}" x2="${width - padRight}" y2="${gridY}" stroke="rgba(45, 35, 25, 0.08)" stroke-width="1" stroke-dasharray="3 3"/>
          <text x="${padLeft - 12}" y="${gridY + 4}" fill="#647082" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="end">
            ${this.currentChartMode === 'daily' ? Math.round(gridVal) : gridVal.toFixed(1)}
          </text>
        `;
      }

      // Nominal Baseline Reference Band (around 0.2 - 0.4)
      const baselineY = getY(0.25);
      svgContent += `
        <line x1="${padLeft}" y1="${baselineY}" x2="${width - padRight}" y2="${baselineY}" stroke="#059669" stroke-width="1.2" stroke-dasharray="5 5" opacity="0.6"/>
        <text x="${width - padRight - 8}" y="${baselineY - 6}" fill="#059669" font-family="JetBrains Mono, monospace" font-size="10" font-weight="600" text-anchor="end">
          NOMINAL NOISE BASELINE (0.25/day)
        </text>
      `;

      // Vertical Day Demarcations & X-Axis Labels
      days.forEach((day, idx) => {
        const x = getX(idx);
        const isActionDay = idx === actionIndex;

        // X-axis day text
        svgContent += `
          <text x="${x}" y="${height - padBottom + 22}" fill="${isActionDay ? '#12161C' : '#647082'}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="${isActionDay ? '700' : '500'}" text-anchor="middle">
            ${day.split(' ')[0]}
          </text>
          <text x="${x}" y="${height - padBottom + 36}" fill="${isActionDay ? '#D97706' : '#94A0B2'}" font-family="JetBrains Mono, monospace" font-size="9" text-anchor="middle">
            ${isActionDay ? 'ACTION' : (day.includes('(') ? day.split('(')[1].replace(')', '') : '')}
          </text>
        `;
      });

      // Shaded Background Zones: Pre-Intervention vs Post-Intervention
      svgContent += `
        <!-- Pre-Intervention Zone Background Tint -->
        <rect x="${padLeft}" y="${padTop}" width="${actionX - padLeft}" height="${plotHeight}" fill="rgba(217, 78, 52, 0.02)" />
        <text x="${padLeft + 14}" y="${padTop + 20}" fill="#D94E34" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" letter-spacing="1">
          PHASE I &mdash; PRECURSOR SURGE
        </text>

        <!-- Post-Intervention Zone Background Tint -->
        <rect x="${actionX}" y="${padTop}" width="${width - padRight - actionX}" height="${plotHeight}" fill="rgba(5, 150, 105, 0.03)" />
        <text x="${actionX + 16}" y="${padTop + 20}" fill="#059669" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" letter-spacing="1">
          PHASE II &mdash; SIGNAL DECAY &amp; STABILIZATION
        </text>
      `;

      // MODE 1: FREQUENCY (Dual-Phase Area & Bezier Curves)
      if (this.currentChartMode === 'frequency' || this.currentChartMode === 'cumulative') {
        // Pre-action curve points (indices 0 to 5)
        let prePath = `M ${getX(0)} ${getY(yValues[0])}`;
        for (let i = 1; i <= actionIndex; i++) {
          const prevX = getX(i - 1);
          const prevY = getY(yValues[i - 1]);
          const currX = getX(i);
          const currY = getY(yValues[i]);
          const midX = (prevX + currX) / 2;
          prePath += ` C ${midX} ${prevY}, ${midX} ${currY}, ${currX} ${currY}`;
        }

        // Pre-action area
        const preAreaPath = `${prePath} L ${actionX} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

        // Post-action curve points (indices 5 to 10)
        let postPath = `M ${actionX} ${getY(yValues[actionIndex])}`;
        for (let i = actionIndex + 1; i < totalSteps; i++) {
          const prevX = getX(i - 1);
          const prevY = getY(yValues[i - 1]);
          const currX = getX(i);
          const currY = getY(yValues[i]);
          const midX = (prevX + currX) / 2;
          postPath += ` C ${midX} ${prevY}, ${midX} ${currY}, ${currX} ${currY}`;
        }

        // Post-action area
        const postAreaPath = `${postPath} L ${getX(totalSteps - 1)} ${getY(0)} L ${actionX} ${getY(0)} Z`;

        // Render Areas
        svgContent += `
          <path d="${preAreaPath}" fill="url(#gradPreArea)" />
          <path d="${postAreaPath}" fill="url(#gradPostArea)" />
          
          <!-- Pre-Action Line (Vermilion) -->
          <path d="${prePath}" fill="none" stroke="#D94E34" stroke-width="3" stroke-linecap="round" filter="url(#glowDrop)" />

          <!-- Post-Action Line (Emerald Green) -->
          <path d="${postPath}" fill="none" stroke="#059669" stroke-width="3.2" stroke-linecap="round" filter="url(#glowDrop)" />
        `;
      }

      // MODE 2: DAILY BARS
      if (this.currentChartMode === 'daily') {
        const barWidth = 24;
        yValues.forEach((val, idx) => {
          const x = getX(idx) - barWidth / 2;
          const y = getY(val);
          const barHeight = getY(0) - y;
          const isPre = idx <= actionIndex;
          const barFill = isPre ? '#D94E34' : '#059669';

          svgContent += `
            <rect x="${x}" y="${y}" width="${barWidth}" height="${Math.max(2, barHeight)}" rx="4" fill="${barFill}" opacity="0.85">
              <title>${days[idx]}: ${val} signals</title>
            </rect>
            <text x="${getX(idx)}" y="${y - 6}" fill="${barFill}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" text-anchor="middle">
              ${val}
            </text>
          `;
        });
      }

      // Day 0 Intervention Vertical Demarcation Line
      const actionYTop = padTop - 10;
      const actionYBottom = getY(0);

      svgContent += `
        <!-- Vertical Action Demarcation Line -->
        <line x1="${actionX}" y1="${actionYTop}" x2="${actionX}" y2="${actionYBottom}" stroke="url(#gradActionLine)" stroke-width="2.5" stroke-dasharray="4 4" />
        
        <!-- Action Taken Marker Badge at Apex -->
        <g transform="translate(${actionX}, ${actionYTop + 14})">
          <rect x="-85" y="-14" width="170" height="28" rx="14" fill="#12161C" stroke="#D97706" stroke-width="1.8" filter="url(#glowDrop)" />
          <circle cx="-68" cy="0" r="4.5" fill="#D97706" />
          <text x="-56" y="4" fill="#FFFFFF" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">
            ACTION: ${c.workOrder}
          </text>
        </g>
      `;

      // Interactive Data Nodes on Chart (Dots for each Day)
      yValues.forEach((val, idx) => {
        const x = getX(idx);
        const y = getY(val);
        const isPre = idx <= actionIndex;
        const isAction = idx === actionIndex;
        const nodeColor = isAction ? '#D97706' : (isPre ? '#D94E34' : '#059669');
        const radius = isAction ? 6.5 : (idx === this.activeScrubIndex ? 6.0 : 4.5);

        svgContent += `
          <g class="chart-point-group" data-index="${idx}" style="cursor: pointer;">
            <!-- Outer Ring if active -->
            ${idx === this.activeScrubIndex ? `<circle cx="${x}" cy="${y}" r="${radius + 4}" fill="none" stroke="${nodeColor}" stroke-width="2" opacity="0.6" />` : ''}
            <circle cx="${x}" cy="${y}" r="${radius}" fill="${nodeColor}" stroke="#FFFFFF" stroke-width="2" />
          </g>
        `;
      });

      svg.innerHTML = svgContent;

      // Attach hover and click listeners to nodes
      const pointGroups = svg.querySelectorAll('.chart-point-group');
      pointGroups.forEach(grp => {
        const idx = parseInt(grp.dataset.index, 10);
        grp.addEventListener('mouseenter', () => {
          this.activeScrubIndex = idx;
          this.updateScrubPips();
          this.highlightChartDay(idx);
        });

        grp.addEventListener('click', () => {
          this.activeScrubIndex = idx;
          this.updateScrubPips();
          this.highlightChartDay(idx);
        });
      });

      // Hover over entire viewport tracks closest day
      this.elTrendChartViewport.onmousemove = (e) => {
        const rect = this.elTrendChartViewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const relativeX = (mouseX - padLeft) / plotWidth;
        const clampedRel = Math.max(0, Math.min(1, relativeX));
        const closestDayIdx = Math.round(clampedRel * (totalSteps - 1));

        if (closestDayIdx !== this.activeScrubIndex && closestDayIdx >= 0 && closestDayIdx < totalSteps) {
          this.activeScrubIndex = closestDayIdx;
          this.updateScrubPips();
          this.highlightChartDay(closestDayIdx);
        }
      };

      this.elTrendChartViewport.onmouseleave = () => {
        // Keep active node or gently hide tooltip if needed
      };
    }

    /**
     * Master Interventions Ledger Table Rendering
     */
    renderLedgerTable() {
      if (!this.elLedgerTableBody) return;
      this.elLedgerTableBody.innerHTML = '';

      let list = this.data.interventions.slice();

      // Filter by resolution status
      if (this.ledgerFilter === 'verified') {
        list = list.filter(item => item.resolutionStatus === 'Verified Remediated');
      } else if (this.ledgerFilter === 'monitoring') {
        list = list.filter(item => item.resolutionStatus !== 'Verified Remediated');
      }

      // Filter by search text
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(item => {
          return item.id.toLowerCase().includes(q) ||
                 item.title.toLowerCase().includes(q) ||
                 item.asset.toLowerCase().includes(q) ||
                 item.responsibleTeam.toLowerCase().includes(q) ||
                 item.assignedPerson.toLowerCase().includes(q) ||
                 item.workOrder.toLowerCase().includes(q);
        });
      }

      if (list.length === 0) {
        this.elLedgerTableBody.innerHTML = `
          <tr>
            <td colspan="10" class="text-center p-6 text-muted font-mono">
              No matching audited interventions found for query "${this.searchQuery}".
            </td>
          </tr>
        `;
        return;
      }

      list.forEach((item) => {
        const originalIndex = this.data.interventions.findIndex(i => i.id === item.id);
        const tr = document.createElement('tr');
        if (originalIndex === this.currentCaseIndex) {
          tr.className = 'table-row-selected';
        }

        const statusClass = item.resolutionStatus === 'Verified Remediated' ? 'chip-verified' : 'chip-monitoring';

        tr.innerHTML = `
          <td>
            <div class="font-mono font-bold">${item.id}</div>
            <div class="table-sub-asset">${item.asset}</div>
            <div class="table-sub-team text-muted">${item.responsibleTeam}</div>
          </td>
          <td>
            <span class="font-mono text-vermilion font-bold">${item.beforeSignalsCount} signals</span>
            <div class="text-xs text-muted font-mono">${item.beforeFrequency}</div>
          </td>
          <td class="text-center">
            <span class="table-wo-chip font-mono">${item.workOrder}</span>
            <div class="text-xs text-muted" style="max-width: 170px; margin: 0 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.actionTaken}</div>
          </td>
          <td>
            <span class="font-mono text-emerald font-bold">${item.afterActionInitialCount} signals</span>
            <div class="text-xs text-emerald font-mono">Residual: ${item.afterActionFinalCount} (${item.reductionPercentage})</div>
          </td>
          <td>
            <div class="text-xs font-mono"><strong>Pre:</strong> ${item.beforeFrequency}</div>
            <div class="text-xs font-mono text-emerald"><strong>Post:</strong> ${item.afterFrequency}</div>
          </td>
          <td>
            <span class="status-chip ${statusClass} font-mono">${item.resolutionStatus}</span>
          </td>
          <td>
            <div class="text-xs font-mono" style="max-width: 160px;">${item.monitoringPeriod.split('(')[0]}</div>
          </td>
          <td>
            <span class="table-trend-pill font-mono ${item.trendStatus === 'improving' ? 'trend-pill-good' : 'trend-pill-watch'}">
              &darr; ${item.reductionPercentage}
            </span>
          </td>
          <td class="text-right font-mono font-bold text-emerald">
            ${item.financialSavings}
          </td>
          <td class="text-center">
            <button class="btn-table-inspect" data-index="${originalIndex}">
              Inspect &rarr;
            </button>
          </td>
        `;

        // Click row or button loads this case
        tr.querySelector('.btn-table-inspect').addEventListener('click', (e) => {
          e.stopPropagation();
          this.loadCase(originalIndex);
          window.scrollTo({ top: 320, behavior: 'smooth' });
          this.showToast(`Loaded case ${item.id}: ${item.title}`);
        });

        tr.addEventListener('click', () => {
          this.loadCase(originalIndex);
          this.renderLedgerTable();
          this.showToast(`Selected ${item.id}`);
        });

        this.elLedgerTableBody.appendChild(tr);
      });
    }

    /**
     * Audit Certificate Modal
     */
    openAuditCertificate() {
      const c = this.data.interventions[this.currentCaseIndex];
      if (!this.elAuditCertModal || !c) return;

      if (this.elCertModalTitle) {
        this.elCertModalTitle.textContent = `Intervention Audit Sign-off: ${c.id}`;
      }

      if (this.elCertModalBody) {
        this.elCertModalBody.innerHTML = `
          <div class="cert-stamp-box">
            <div class="cert-stamp-badge font-mono">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span>EARLYSIGHT VERIFIED</span>
            </div>
            <div class="cert-id-tag font-mono">CERT-2026-${c.id.replace('IMP-', '')}</div>
          </div>

          <div class="cert-grid-details">
            <div class="cert-field">
              <span class="cert-label font-mono">ASSET UNDER AUDIT:</span>
              <span class="cert-val">${c.asset} (${c.location})</span>
            </div>
            <div class="cert-field">
              <span class="cert-label font-mono">ORIGIN EARLY WARNING:</span>
              <span class="cert-val font-mono">${c.alertId} &bull; Action Ticket ${c.actionTicketId}</span>
            </div>
            <div class="cert-field">
              <span class="cert-label font-mono">CMMS WORK ORDER:</span>
              <span class="cert-val font-mono font-bold">${c.workOrder} (${c.actionDate})</span>
            </div>
            <div class="cert-field">
              <span class="cert-label font-mono">RESPONSIBLE ENGINEERING LEAD:</span>
              <span class="cert-val">${c.assignedPerson} (${c.responsibleTeam})</span>
            </div>
          </div>

          <div class="cert-metric-contrast">
            <div class="contrast-col pre-col">
              <span class="contrast-col-title font-mono text-vermilion">BEFORE INTERVENTION</span>
              <div class="contrast-col-giant font-mono">${c.beforeSignalsCount} Signals</div>
              <div class="font-mono text-sm">${c.beforeFrequency}</div>
              <div class="font-mono text-xs text-muted">MTBS: ${c.beforeMTBS}</div>
            </div>

            <div class="contrast-divider font-mono text-muted">&rarr;</div>

            <div class="contrast-col action-col">
              <span class="contrast-col-title font-mono text-amber">EXECUTED REMEDIATION</span>
              <div class="font-mono text-sm font-bold">${c.workOrder}</div>
              <div class="text-xs text-muted" style="margin-top:4px;">${c.actionTaken}</div>
            </div>

            <div class="contrast-divider font-mono text-muted">&rarr;</div>

            <div class="contrast-col post-col">
              <span class="contrast-col-title font-mono text-emerald">AFTER INTERVENTION</span>
              <div class="contrast-col-giant font-mono text-emerald">${c.afterActionInitialCount} &rarr; ${c.afterActionFinalCount}</div>
              <div class="font-mono text-sm text-emerald">${c.afterFrequency} (${c.reductionPercentage})</div>
              <div class="font-mono text-xs text-muted">MTBS: ${c.afterMTBS}</div>
            </div>
          </div>

          <div class="cert-resolution-panel">
            <div class="panel-row">
              <span class="font-mono text-muted">Resolution Status:</span>
              <span class="status-chip chip-verified font-mono">${c.resolutionStatus}</span>
            </div>
            <div class="panel-row">
              <span class="font-mono text-muted">Monitoring Period:</span>
              <span class="font-mono">${c.monitoringPeriod}</span>
            </div>
            <div class="panel-row">
              <span class="font-mono text-muted">Current Trajectory:</span>
              <span class="font-mono text-emerald font-bold">${c.currentTrend}</span>
            </div>
            <div class="panel-row">
              <span class="font-mono text-muted">Financial Proof of ROI:</span>
              <span class="font-mono text-emerald font-bold">${c.financialSavings} Loss Averted (${c.avertedDowntimeHours}h Outage Prevented)</span>
            </div>
          </div>

          <div class="cert-verification-signoff">
            <h4 class="signoff-heading font-mono">PHYSICAL TELEMETRY ATTESTATION</h4>
            <p class="signoff-text">${c.verificationNotes}</p>
            <div class="signoff-signature-line">
              <div class="sig-block">
                <span class="sig-name font-mono">${c.assignedPerson}</span>
                <span class="sig-title text-muted">Plant Reliability Lead &bull; Verified</span>
              </div>
              <div class="sig-block text-right">
                <span class="sig-date font-mono">AUDIT TIMESTAMP: 2026-09-29 17:22 UTC</span>
                <span class="sig-status text-emerald font-mono">TRUE POSITIVE: CONFIRMED REMEDIATED</span>
              </div>
            </div>
          </div>
        `;
      }

      this.elAuditCertModal.style.display = 'flex';
    }

    closeAuditCertificate() {
      if (this.elAuditCertModal) {
        this.elAuditCertModal.style.display = 'none';
      }
    }

    toggleTrajectoryPlayback() {
      if (this.isPlayingTrajectory) {
        clearInterval(this.playbackInterval);
        this.isPlayingTrajectory = false;
        if (this.elBtnPlayTrajectory) {
          this.elBtnPlayTrajectory.innerHTML = '&#9658; Animate Trajectory';
        }
      } else {
        this.isPlayingTrajectory = true;
        if (this.elBtnPlayTrajectory) {
          this.elBtnPlayTrajectory.innerHTML = '&#10074;&#10074; Pause Animation';
        }

        const c = this.data.interventions[this.currentCaseIndex];
        const maxSteps = c.timelineDays.length;

        this.playbackInterval = setInterval(() => {
          this.activeScrubIndex = (this.activeScrubIndex + 1) % maxSteps;
          this.updateScrubPips();
          this.highlightChartDay(this.activeScrubIndex);
        }, 1100);
      }
    }

    showToast(message) {
      if (!this.elToastContainer) return;
      const toast = document.createElement('div');
      toast.className = 'action-toast-item visible';
      toast.innerHTML = `
        <span class="toast-indicator"></span>
        <span>${message}</span>
      `;
      this.elToastContainer.appendChild(toast);

      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
      }, 3200);
    }

    bindEvents() {
      // Metric Toggles (Frequency, Daily, Cumulative)
      const btnToggleFreq = document.getElementById('btnToggleFreq');
      const btnToggleDaily = document.getElementById('btnToggleDaily');
      const btnToggleCumulative = document.getElementById('btnToggleCumulative');

      const toggles = [btnToggleFreq, btnToggleDaily, btnToggleCumulative];
      toggles.forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', () => {
          toggles.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentChartMode = btn.dataset.mode;
          const c = this.data.interventions[this.currentCaseIndex];
          this.renderTrendChart(c);
          this.showToast(`Chart mode: ${btn.textContent.trim()}`);
        });
      });

      // Play Trajectory Button
      if (this.elBtnPlayTrajectory) {
        this.elBtnPlayTrajectory.addEventListener('click', () => {
          this.toggleTrajectoryPlayback();
        });
      }

      // Ledger Filter Pills
      const filterPills = document.querySelectorAll('.ledger-filter-pills .filter-pill');
      filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
          filterPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.ledgerFilter = pill.dataset.filter;
          this.renderLedgerTable();
        });
      });

      // Ledger Search Input
      if (this.elLedgerSearchInput) {
        this.elLedgerSearchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.trim();
          this.renderLedgerTable();
        });
      }

      // Modal Close Buttons
      if (this.elBtnCertModalClose) {
        this.elBtnCertModalClose.addEventListener('click', () => this.closeAuditCertificate());
      }
      if (this.elBtnDismissCert) {
        this.elBtnDismissCert.addEventListener('click', () => this.closeAuditCertificate());
      }
      if (this.elAuditCertModal) {
        this.elAuditCertModal.addEventListener('click', (e) => {
          if (e.target === this.elAuditCertModal) {
            this.closeAuditCertificate();
          }
        });
      }

      // Print Certificate
      if (this.elBtnPrintCert) {
        this.elBtnPrintCert.addEventListener('click', () => {
          window.print();
        });
      }

      // Window resize re-renders chart
      window.addEventListener('resize', () => {
        const c = this.data.interventions[this.currentCaseIndex];
        this.renderTrendChart(c);
      });
    }
  }

  // Export to window for global invocation
  window.impactController = new ImpactMonitoringController(rawData);

})();
