/**
 * EarlySight — Trends & Timeline Engine (Stage 7)
 * Interactive Chronological Problem Development, Scroll Animation,
 * Daily/Weekly/Monthly Filtering, Trend Charts, Frequency Surge & Historical Comparison.
 */

import '../data/timeline-data.js';

class EarlySightTimelineController {
  constructor() {
    this.caseStudies = window.TIMELINE_CASE_STUDIES || [];
    this.activeCaseIndex = 0;
    this.activeTimeframe = 'daily'; // 'daily', 'weekly', 'monthly'
    this.activeStageIndex = 1; // 1 to 7
    this.isPlaying = false;
    this.playbackTimer = null;
    this.playbackSpeed = 2200; // ms per stage
    this.showHistoricalOverlay = true;

    this.init();
  }

  get currentCase() {
    return this.caseStudies[this.activeCaseIndex] || this.caseStudies[0];
  }

  init() {
    this.renderCaseStudyHeader();
    this.renderLifecycleStepper();
    this.renderTimelineCards();
    this.renderTrendCharts();
    this.renderFrequencyAnalytics();
    this.renderHistoricalComparison();
    this.bindEvents();
    this.setupScrollObserver();
    
    // Select initial stage
    this.selectStage(1, false);
  }

  renderCaseStudyHeader() {
    const c = this.currentCase;
    const titleEl = document.getElementById('caseStudyTitle');
    const badgeEl = document.getElementById('caseStudySeverityBadge');
    const leadTimeEl = document.getElementById('caseStudyLeadTime');
    const confidenceEl = document.getElementById('caseStudyConfidence');
    const costAvertedEl = document.getElementById('caseStudyCostAverted');
    const descEl = document.getElementById('caseStudySummary');

    if (titleEl) titleEl.textContent = c.name;
    if (badgeEl) badgeEl.textContent = `${c.severity} SEVERITY`;
    if (leadTimeEl) leadTimeEl.textContent = `${c.totalLeadTimeDays} Days Lead`;
    if (confidenceEl) confidenceEl.textContent = c.confidence;
    if (costAvertedEl) costAvertedEl.textContent = c.avertedLossUSD;
    if (descEl) descEl.textContent = c.summary;
  }

  renderLifecycleStepper() {
    const stepperContainer = document.getElementById('lifecycleStepperTrack');
    if (!stepperContainer) return;

    const stages = this.currentCase.lifecycleStages;
    stepperContainer.innerHTML = stages.map((st, idx) => `
      <div class="stepper-step-node ${st.stageIndex === this.activeStageIndex ? 'active' : ''}" 
           data-stage="${st.stageIndex}" 
           onclick="window.timelineController.selectStage(${st.stageIndex}, true)">
        <div class="stepper-node-dot">
          <span class="stepper-node-num">${st.stageIndex}</span>
        </div>
        <div class="stepper-node-label">
          <span class="stepper-node-title">${st.stageName}</span>
          <span class="stepper-node-time font-mono">${st.timelineLabel}</span>
        </div>
        ${idx < stages.length - 1 ? '<div class="stepper-connector-bar"></div>' : ''}
      </div>
    `).join('');
  }

  renderTimelineCards() {
    const container = document.getElementById('chronologicalCardsContainer');
    if (!container) return;

    const stages = this.currentCase.lifecycleStages;
    container.innerHTML = stages.map(st => `
      <article class="timeline-stage-card ${st.stageIndex === this.activeStageIndex ? 'stage-card-active' : ''}" 
               id="stageCard-${st.stageIndex}" 
               data-stage="${st.stageIndex}">
        
        <!-- Left Spine Marker -->
        <div class="stage-spine-column">
          <div class="stage-spine-badge">
            <span class="spine-num font-mono">0${st.stageIndex}</span>
          </div>
          <div class="stage-spine-line"></div>
        </div>

        <!-- Main Card Content -->
        <div class="stage-card-body">
          <div class="stage-card-top-row">
            <div class="stage-title-group">
              <span class="stage-step-tag font-mono">STAGE 0${st.stageIndex} // LIFECYCLE PROGRESSION</span>
              <h3 class="stage-headline">${st.stageName}: ${st.headline}</h3>
            </div>
            <div class="stage-timing-group">
              <span class="stage-countdown-pill">${st.timelineLabel}</span>
              <span class="stage-date-text font-mono">${st.dateFormatted}</span>
            </div>
          </div>

          <p class="stage-description">${st.description}</p>

          <!-- Telemetry & Sensor Proof Box -->
          <div class="stage-telemetry-box">
            <div class="stage-telemetry-header">
              <span class="modality-chip" style="background:${st.modalityColor}15; color:${st.modalityColor}; border-color:${st.modalityColor}40;">
                ${st.modalityIcon} ${st.modality}
              </span>
              <span class="asset-tag font-mono">📍 ${st.asset}</span>
              <span class="status-chip ${st.stageIndex >= 6 ? 'chip-emerald' : (st.stageIndex >= 4 ? 'chip-amber' : 'chip-slate')}" style="margin-left:auto;">
                ${st.status}
              </span>
            </div>

            <div class="stage-telemetry-grid">
              <div class="telemetry-cell">
                <span class="telemetry-label font-mono">Telemetry Signature</span>
                <span class="telemetry-val font-mono">${st.telemetryReading}</span>
              </div>
              <div class="telemetry-cell">
                <span class="telemetry-label font-mono">Precursor Frequency</span>
                <span class="telemetry-val font-mono" style="color:var(--accent-risk); font-weight:700;">${st.frequencyRate}</span>
              </div>
              <div class="telemetry-cell">
                <span class="telemetry-label font-mono">Synthesis Confidence</span>
                <span class="telemetry-val font-mono" style="color:var(--ink-primary); font-weight:700;">${st.confidence}</span>
              </div>
              <div class="telemetry-cell">
                <span class="telemetry-label font-mono">Anomaly Severity Score</span>
                <div class="anomaly-meter-bar">
                  <div class="anomaly-meter-fill" style="width:${Math.round(st.anomalyScore * 100)}%;"></div>
                  <span class="anomaly-meter-text font-mono">${(st.anomalyScore * 10).toFixed(1)} / 10</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Cross-Silo Early Warning Insight Box -->
          <div class="stage-insight-ribbon">
            <div class="insight-label-col">
              <span class="insight-flag-icon">💡</span>
              <span class="insight-flag-text font-mono">EARLYSIGHT INSIGHT</span>
            </div>
            <div class="insight-body-text">
              <strong>Operational Reality:</strong> ${st.operationalRisk}
              <div style="margin-top:4px; color:var(--ink-secondary);">
                <strong>Why Legacy SCADA Misses It:</strong> ${st.keyInsight}
              </div>
            </div>
          </div>

        </div>
      </article>
    `).join('');
  }

  renderTrendCharts() {
    const svgContainer = document.getElementById('trendSvgChartContainer');
    if (!svgContainer) return;

    let points = [];
    if (this.activeTimeframe === 'daily') {
      points = this.currentCase.dailyData;
    } else if (this.activeTimeframe === 'weekly') {
      points = this.currentCase.weeklyData;
    } else {
      points = this.currentCase.monthlyData;
    }

    const width = 1060;
    const height = 300;
    const padLeft = 60;
    const padRight = 30;
    const padTop = 35;
    const padBottom = 45;

    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Scales
    const maxSignals = Math.max(...points.map(p => p.signals || 0), 4);
    const maxFreq = Math.max(...points.map(p => p.frequencyRate || 0), 4.0);

    const getX = (idx) => padLeft + (idx / (points.length - 1)) * chartW;
    const getYFreq = (val) => padTop + chartH - (val / maxFreq) * chartH;
    const getYConf = (val) => padTop + chartH - (val / 100) * chartH;

    // Generate Path Data for Frequency Curve
    const freqPath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)},${getYFreq(p.frequencyRate || 0)}`).join(' ');
    const freqArea = `${freqPath} L ${getX(points.length - 1)},${padTop + chartH} L ${getX(0)},${padTop + chartH} Z`;

    // Generate Path Data for Confidence Curve
    const confPath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)},${getYConf(p.confidence || 0)}`).join(' ');

    // Threshold Marker Y Coordinate (Legacy SCADA Alarm at Anomaly 1.0)
    const legacyAlarmY = padTop + chartH * 0.18;

    svgContainer.innerHTML = `
      <svg class="trend-interactive-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="freqGradFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#C85A32" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#C85A32" stop-opacity="0.02"/>
          </linearGradient>
          <linearGradient id="confGradStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#1B4332"/>
            <stop offset="100%" stop-color="#5E7E6C"/>
          </linearGradient>
        </defs>

        <!-- Background Grid Lines -->
        ${[0, 0.25, 0.5, 0.75, 1.0].map(pct => {
          const y = padTop + chartH * (1 - pct);
          const val = (pct * maxFreq).toFixed(1);
          return `
            <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="rgba(45,35,25,0.06)" stroke-dasharray="3 3"/>
            <text x="${padLeft - 10}" y="${y + 3}" fill="#94A3B8" font-size="10" font-family="var(--font-mono)" text-anchor="end">${val} s/d</text>
          `;
        }).join('')}

        <!-- Legacy SCADA Alarm Level Zone (Red dashed line) -->
        <line x1="${padLeft}" y1="${legacyAlarmY}" x2="${width - padRight}" y2="${legacyAlarmY}" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.65"/>
        <text x="${width - padRight - 6}" y="${legacyAlarmY - 6}" fill="#DC2626" font-size="10" font-weight="700" font-family="var(--font-mono)" text-anchor="end">
          LEGACY SCADA ALARM THRESHOLD (Catastrophic Breach Level)
        </text>

        <!-- EarlySight Early Detection Window Zone -->
        <rect x="${getX(Math.floor(points.length * 0.45))}" y="${padTop}" width="${getX(Math.floor(points.length * 0.7)) - getX(Math.floor(points.length * 0.45))}" height="${chartH}" fill="rgba(217, 78, 52, 0.05)" rx="4"/>
        <text x="${getX(Math.floor(points.length * 0.45)) + 8}" y="${padTop + 16}" fill="var(--accent-risk)" font-size="10" font-weight="800" font-family="var(--font-mono)">
          EARLYSIGHT DETECTION HORIZON (+14.2d Lead Time Window)
        </text>

        <!-- Frequency Curve Area & Stroke -->
        <path d="${freqArea}" fill="url(#freqGradFill)"/>
        <path d="${freqPath}" fill="none" stroke="#C85A32" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Confidence Curve Stroke -->
        <path d="${confPath}" fill="none" stroke="url(#confGradStroke)" stroke-width="2.2" stroke-dasharray="4 3" stroke-linecap="round"/>

        <!-- Interactive Data Point Dots -->
        ${points.map((p, idx) => {
          const x = getX(idx);
          const y = getYFreq(p.frequencyRate || 0);
          const isSelected = p.highlight || false;
          return `
            <g class="chart-point-group" data-idx="${idx}" 
               onmouseenter="window.timelineController.showChartTooltip(evt, ${idx})" 
               onmouseleave="window.timelineController.hideChartTooltip()">
              <circle cx="${x}" cy="${y}" r="${isSelected ? 5.5 : 3.5}" 
                      fill="${isSelected ? '#C85A32' : '#FFFFFF'}" 
                      stroke="#C85A32" stroke-width="${isSelected ? 2.5 : 1.8}"/>
              ${isSelected ? `<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="#C85A32" stroke-width="1.2" opacity="0.4" class="sparkline-pulse-dot"/>` : ''}
            </g>
          `;
        }).join('')}

        <!-- X Axis Labels -->
        ${points.map((p, idx) => {
          if (this.activeTimeframe === 'daily' && idx % 3 !== 0 && idx !== points.length - 1) return '';
          const x = getX(idx);
          const label = p.dayLabel || p.weekLabel || p.monthLabel || '';
          return `
            <text x="${x}" y="${height - 12}" fill="#64748B" font-size="9.5" font-family="var(--font-mono)" text-anchor="middle">
              ${label}
            </text>
          `;
        }).join('')}
      </svg>
    `;
  }

  showChartTooltip(evt, idx) {
    const tooltip = document.getElementById('chartHoverTooltip');
    if (!tooltip) return;

    let points = [];
    if (this.activeTimeframe === 'daily') points = this.currentCase.dailyData;
    else if (this.activeTimeframe === 'weekly') points = this.currentCase.weeklyData;
    else points = this.currentCase.monthlyData;

    const p = points[idx];
    if (!p) return;

    tooltip.style.display = 'block';
    tooltip.innerHTML = `
      <div style="font-size:0.7rem; font-family:var(--font-mono); color:var(--ink-muted); text-transform:uppercase;">
        ${p.dayLabel || p.weekLabel || p.monthLabel} • ${p.stage || 'Operational Interval'}
      </div>
      <div style="font-size:0.95rem; font-weight:800; color:var(--ink-primary); margin:3px 0;">
        ${p.frequencyRate} Precursors / Day
      </div>
      <div style="display:flex; justify-content:space-between; gap:12px; font-size:0.75rem; margin-top:4px;">
        <span>Signals Logged: <strong>${p.signals || 0}</strong></span>
        <span>Confidence: <strong style="color:var(--accent-teal);">${p.confidence}%</strong></span>
      </div>
    `;

    const rect = evt.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left - 40}px`;
    tooltip.style.top = `${rect.top - 80}px`;
  }

  hideChartTooltip() {
    const tooltip = document.getElementById('chartHoverTooltip');
    if (tooltip) tooltip.style.display = 'none';
  }

  renderFrequencyAnalytics() {
    const rateEl = document.getElementById('metricFrequencySurge');
    const mtbfEl = document.getElementById('metricMTBSignals');
    const modalityListEl = document.getElementById('frequencyModalityBars');

    if (rateEl) rateEl.textContent = '+340%';
    if (mtbfEl) mtbfEl.textContent = '6.2 Hours';

    if (modalityListEl) {
      const breakdown = this.currentCase.modalityBreakdown || [];
      modalityListEl.innerHTML = breakdown.map(m => `
        <div class="modality-freq-item">
          <div class="modality-freq-info">
            <span style="display:flex; align-items:center; gap:6px;">
              <span>${m.icon}</span>
              <strong>${m.type}</strong>
            </span>
            <span class="font-mono text-muted">${m.count} Signals (${m.percentage})</span>
          </div>
          <div class="comp-bar-track">
            <div class="comp-bar-fill" style="width:${m.percentage}; background:${m.color};"></div>
          </div>
        </div>
      `).join('');
    }
  }

  renderHistoricalComparison() {
    const comp = this.currentCase.historicalComparison;
    if (!comp) return;

    const unmitigatedTitleEl = document.getElementById('histUnmitigatedTitle');
    const unmitigatedLossEl = document.getElementById('histUnmitigatedLoss');
    const mitigatedTitleEl = document.getElementById('histMitigatedTitle');
    const mitigatedLossEl = document.getElementById('histMitigatedLoss');
    const netSavingsEl = document.getElementById('histNetSavings');
    const comparisonTableBody = document.getElementById('historicalComparisonTableBody');

    if (unmitigatedTitleEl) unmitigatedTitleEl.textContent = comp.pastIncidentTitle;
    if (unmitigatedLossEl) unmitigatedLossEl.textContent = `${comp.pastIncidentLoss} • ${comp.pastIncidentDowntime}`;
    if (mitigatedTitleEl) mitigatedTitleEl.textContent = comp.mitigatedEventTitle;
    if (mitigatedLossEl) mitigatedLossEl.textContent = `${comp.mitigatedLoss} • ${comp.mitigatedDowntime}`;
    if (netSavingsEl) netSavingsEl.textContent = comp.netSavingsUSD;

    if (comparisonTableBody) {
      comparisonTableBody.innerHTML = comp.comparisonMetrics.map(m => `
        <tr>
          <td class="comp-metric-name">${m.label}</td>
          <td class="comp-unmitigated-val">${m.unmitigated}</td>
          <td class="comp-mitigated-val">${m.mitigated}</td>
          <td class="comp-advantage-val font-mono">${m.advantage}</td>
        </tr>
      `).join('');
    }

    this.renderHistoricalComparisonSvg();
  }

  renderHistoricalComparisonSvg() {
    const container = document.getElementById('historicalTrajectorySvg');
    if (!container) return;

    const comp = this.currentCase.historicalComparison;
    if (!comp || !comp.trajectories) return;

    const traj = comp.trajectories;
    const width = 860;
    const height = 240;
    const padL = 50;
    const padR = 40;
    const padT = 30;
    const padB = 40;

    const cW = width - padL - padR;
    const cH = height - padT - padB;

    const maxVal = 3.0; // Anomaly index scale

    const getX = (idx) => padL + (idx / (traj.length - 1)) * cW;
    const getY = (val) => padT + cH - (Math.min(val, maxVal) / maxVal) * cH;

    const unmitPath = traj.map((t, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(t.unmitigatedAnomaly)}`).join(' ');
    const mitPath = traj.map((t, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)},${getY(t.mitigatedAnomaly)}`).join(' ');
    const thresholdY = getY(1.0);

    container.innerHTML = `
      <svg class="trend-interactive-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <!-- Alarm Threshold Line -->
        <line x1="${padL}" y1="${thresholdY}" x2="${width - padR}" y2="${thresholdY}" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.5"/>
        <text x="${padL + 6}" y="${thresholdY - 6}" fill="#DC2626" font-size="9" font-family="var(--font-mono)">LEGACY ALARM THRESHOLD (1.0)</text>

        <!-- Unmitigated Curve (2024 Event: Breaches & explodes to catastrophic failure) -->
        <path d="${unmitPath}" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Mitigated Curve (2026 Event: Flattened by early intervention at T-7d) -->
        <path d="${mitPath}" fill="none" stroke="#1B4332" stroke-width="3.0" stroke-linecap="round"/>

        <!-- Key Trajectory Markers -->
        ${traj.map((t, i) => {
          const x = getX(i);
          const yMit = getY(t.mitigatedAnomaly);
          const yUnmit = getY(t.unmitigatedAnomaly);

          if (t.earlySightAlertPoint) {
            return `
              <circle cx="${x}" cy="${yMit}" r="5" fill="#C85A32" stroke="#FFF" stroke-width="2"/>
              <text x="${x}" y="${yMit - 10}" fill="#C85A32" font-size="9" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">
                T-10d: Early Warning Generated
              </text>
            `;
          }
          if (t.actionTakenPoint) {
            return `
              <circle cx="${x}" cy="${yMit}" r="5" fill="#1B4332" stroke="#FFF" stroke-width="2"/>
              <text x="${x}" y="${yMit + 18}" fill="#1B4332" font-size="9" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">
                T-7d: Action Taken (Gasket Replaced)
              </text>
            `;
          }
          if (t.pastCatastrophicFailure) {
            return `
              <circle cx="${x}" cy="${yUnmit}" r="6" fill="#DC2626" stroke="#FFF" stroke-width="2"/>
              <text x="${x}" y="${yUnmit - 10}" fill="#DC2626" font-size="9" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">
                2024: Flooding Stoppage ($1.4M)
              </text>
            `;
          }
          return '';
        }).join('')}

        <!-- X Axis labels -->
        ${traj.map((t, i) => `
          <text x="${getX(i)}" y="${height - 10}" fill="#64748B" font-size="9" font-family="var(--font-mono)" text-anchor="middle">
            ${t.label}
          </text>
        `).join('')}
      </svg>
    `;
  }

  selectStage(stageIdx, shouldScroll = true) {
    this.activeStageIndex = stageIdx;

    // Update Stepper UI
    const stepNodes = document.querySelectorAll('.stepper-step-node');
    stepNodes.forEach(node => {
      const s = parseInt(node.getAttribute('data-stage'), 10);
      if (s === stageIdx) node.classList.add('active');
      else node.classList.remove('active');
    });

    // Update Cards UI
    const cards = document.querySelectorAll('.timeline-stage-card');
    cards.forEach(card => {
      const s = parseInt(card.getAttribute('data-stage'), 10);
      if (s === stageIdx) {
        card.classList.add('stage-card-active');
      } else {
        card.classList.remove('stage-card-active');
      }
    });

    // Optionally scroll to active card
    if (shouldScroll) {
      const targetCard = document.getElementById(`stageCard-${stageIdx}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  nextStage() {
    let next = this.activeStageIndex + 1;
    if (next > 7) next = 1;
    this.selectStage(next, true);
  }

  prevStage() {
    let prev = this.activeStageIndex - 1;
    if (prev < 1) prev = 7;
    this.selectStage(prev, true);
  }

  togglePlayback() {
    this.isPlaying = !this.isPlaying;
    const playBtn = document.getElementById('timelinePlayBtn');
    
    if (this.isPlaying) {
      if (playBtn) playBtn.innerHTML = '<span>⏸ Pause Progression</span>';
      this.playbackTimer = setInterval(() => {
        this.nextStage();
        if (this.activeStageIndex === 7) {
          // Finished loop
          setTimeout(() => {
            if (this.isPlaying) this.selectStage(1, true);
          }, 3000);
        }
      }, this.playbackSpeed);
    } else {
      if (playBtn) playBtn.innerHTML = '<span>▶ Play Lifecycle Evolution</span>';
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  setTimeframe(timeframe) {
    this.activeTimeframe = timeframe;
    
    // Update button states
    const tfBtns = document.querySelectorAll('.timeline-tf-btn');
    tfBtns.forEach(btn => {
      if (btn.getAttribute('data-timeframe') === timeframe) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.renderTrendCharts();
  }

  switchCaseStudy(caseIndex) {
    this.activeCaseIndex = caseIndex;
    this.activeStageIndex = 1;
    if (this.isPlaying) this.togglePlayback();

    this.renderCaseStudyHeader();
    this.renderLifecycleStepper();
    this.renderTimelineCards();
    this.renderTrendCharts();
    this.renderFrequencyAnalytics();
    this.renderHistoricalComparison();
    this.selectStage(1, false);
  }

  setupScrollObserver() {
    if (!('IntersectionObserver' in window)) return;

    const cards = document.querySelectorAll('.timeline-stage-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          const stage = parseInt(entry.target.getAttribute('data-stage'), 10);
          if (stage && stage !== this.activeStageIndex && !this.isPlaying) {
            this.activeStageIndex = stage;
            const stepNodes = document.querySelectorAll('.stepper-step-node');
            stepNodes.forEach(node => {
              const s = parseInt(node.getAttribute('data-stage'), 10);
              if (s === stage) node.classList.add('active');
              else node.classList.remove('active');
            });
          }
        }
      });
    }, {
      rootMargin: '-10% 0px -40% 0px',
      threshold: [0.45, 0.7]
    });

    cards.forEach(c => observer.observe(c));
  }

  bindEvents() {
    // Playback buttons
    const playBtn = document.getElementById('timelinePlayBtn');
    const nextBtn = document.getElementById('timelineNextBtn');
    const prevBtn = document.getElementById('timelinePrevBtn');

    if (playBtn) playBtn.addEventListener('click', () => this.togglePlayback());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextStage());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevStage());

    // Timeframe filter buttons (Daily, Weekly, Monthly)
    const tfBtns = document.querySelectorAll('.timeline-tf-btn');
    tfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tf = btn.getAttribute('data-timeframe');
        this.setTimeframe(tf);
      });
    });

    // Case study selector
    const caseSelect = document.getElementById('timelineCaseSelect');
    if (caseSelect) {
      caseSelect.addEventListener('change', (e) => {
        this.switchCaseStudy(parseInt(e.target.value, 10));
      });
    }
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.timelineController = new EarlySightTimelineController();
});
