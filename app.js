/**
 * EarlySight — Enterprise Platform Application Controller
 * Handles Startup Animation Orchestration, UI Transitions & Stage-Wise Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const heroBeacon = document.getElementById('heroBeacon');
  const heroTitleGroup = document.getElementById('heroTitleGroup');
  const heroTagline = document.getElementById('heroTagline');
  const heroActions = document.getElementById('heroActions');
  const btnExplore = document.getElementById('btnExplore');
  const btnReplay = document.getElementById('btnReplay');
  const phaseStepNumber = document.getElementById('phaseStepNumber');
  const phaseStepTitle = document.getElementById('phaseStepTitle');
  const phaseStepDesc = document.getElementById('phaseStepDesc');
  const scrubberPlayPause = document.getElementById('scrubberPlayPause');
  const scrubberPips = document.querySelectorAll('.scrubber-step-pip');
  const signalModal = document.getElementById('signalModal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  let currentSelectedSignal = EARLYSIGHT_SIGNALS[0];

  // Initialize Animation Engine
  const animEngine = new EarlySightAnimation('signalsCanvas', 'signalLabelsOverlay', {
    signals: EARLYSIGHT_SIGNALS,
    connections: SIGNAL_CONNECTIONS,
    onPhaseChange: (phaseIndex, phaseData) => {
      updateUIForPhase(phaseIndex);
    },
    onSignalClick: (signalData) => {
      openSignalDetails(signalData);
    },
    onSignalHover: (signalData) => {
      // Sync progression chips in hero
      document.querySelectorAll('.progression-signal-chip').forEach(chip => {
        chip.classList.remove('active');
        if (signalData && chip.getAttribute('data-sig-id') === signalData.id) {
          chip.classList.add('active');
        }
      });
      // Sync signals in sandbox list
      document.querySelectorAll('.signal-row-item').forEach(row => {
        if (signalData && row.getAttribute('data-sig-id') === signalData.id) {
          row.style.borderColor = 'var(--accent-risk)';
          row.style.boxShadow = 'var(--shadow-sm)';
        } else {
          row.style.borderColor = '';
          row.style.boxShadow = '';
        }
      });
    },
    onComplete: () => {
      // Animation cycle finished, full UI stays revealed
    }
  });

  // Bind Progression Chips to Animation Engine
  document.querySelectorAll('.progression-signal-chip').forEach(chip => {
    const sigId = chip.getAttribute('data-sig-id');
    chip.addEventListener('mouseenter', () => {
      animEngine.setHoveredSignal(sigId);
    });
    chip.addEventListener('mouseleave', () => {
      animEngine.setHoveredSignal(null);
    });
    chip.addEventListener('click', () => {
      const found = EARLYSIGHT_SIGNALS.find(s => s.id === sigId);
      if (found) openSignalDetails(found);
    });
  });

  // Phase UI orchestrator — 7-Stage EarlySight Story
  function updateUIForPhase(phaseIndex) {
    // 1. Update Scrubber Pips (pips are 1-indexed for phases 1-7)
    scrubberPips.forEach(pip => {
      const pipStep = parseInt(pip.getAttribute('data-step'), 10);
      pip.classList.remove('active', 'completed');
      if (pipStep === phaseIndex) {
        pip.classList.add('active');
      } else if (pipStep < phaseIndex) {
        pip.classList.add('completed');
      }
    });

    // 2. Update Top Phase Monitor Pill (Verbatim from FINAL DESIGN PRINCIPLE)
    const phaseDescriptions = [
      { num: "00", title: "SYSTEM INGRESS", desc: "Operational multi-modal telemetry streams online" },
      { num: "01", title: "SCATTERED SIGNALS", desc: "Individual complaints, reports and data" },
      { num: "02", title: "CONNECTION", desc: "Related information gets connected" },
      { num: "03", title: "PATTERN", desc: "A recurring pattern becomes visible" },
      { num: "04", title: "EARLY WARNING", desc: "An emerging problem is identified" },
      { num: "05", title: "EVIDENCE", desc: "The system explains why" },
      { num: "06", title: "ACTION", desc: "A responsible team investigates and acts" },
      { num: "07", title: "VERIFICATION", desc: "The system checks whether the problem actually decreases" }
    ];

    const cur = phaseDescriptions[phaseIndex] || phaseDescriptions[0];
    if (phaseStepNumber) phaseStepNumber.textContent = `STAGE ${cur.num}`;
    if (phaseStepTitle) phaseStepTitle.textContent = cur.title;
    if (phaseStepDesc) phaseStepDesc.textContent = cur.desc;

    // 3. Hero Header Elements (Always visible for clear visual hierarchy & immediate usability)
    if (heroTitleGroup) heroTitleGroup.classList.add('revealed');
    if (heroTagline) heroTagline.classList.add('revealed');
    if (heroActions) heroActions.classList.add('revealed');
    if (heroBeacon) {
      heroBeacon.classList.add('revealed');
      if (phaseIndex >= 4) {
        heroBeacon.classList.add('active-alert');
      } else {
        heroBeacon.classList.remove('active-alert');
      }
    }
  }

  // Scrubber controls
  if (scrubberPlayPause) {
    scrubberPlayPause.addEventListener('click', () => {
      if (animEngine.isPlaying) {
        animEngine.pause();
        scrubberPlayPause.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      } else {
        animEngine.play();
        scrubberPlayPause.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      }
    });
  }

  scrubberPips.forEach(pip => {
    pip.addEventListener('click', () => {
      const targetPhase = parseInt(pip.getAttribute('data-step'), 10);
      animEngine.seekToPhase(targetPhase);
      if (!animEngine.isPlaying) {
        animEngine.play();
        if (scrubberPlayPause) {
          scrubberPlayPause.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
        }
      }
    });
  });

  // Replay Button
  if (btnReplay) {
    btnReplay.addEventListener('click', (e) => {
      e.preventDefault();
      // Scroll smoothly to top if user was scrolled down
      window.scrollTo({ top: 0, behavior: 'smooth' });
      animEngine.replay();
    });
  }

  // Explore EarlySight Button: Smooth scroll to Architecture & Pipeline section
  if (btnExplore) {
    btnExplore.addEventListener('click', (e) => {
      e.preventDefault();
      const pipelineSection = document.getElementById('pipelineSection');
      if (pipelineSection) {
        pipelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Render Architecture Pipeline Ribbon
  renderPipelineRibbon();

  // Render Interactive Signals List
  renderSignalsList();

  // Render Synthesized Risk Card
  renderRiskSynthesisCard();

  // Modal Handlers
  if (modalClose) {
    modalClose.addEventListener('click', () => closeModal());
  }
  if (signalModal) {
    signalModal.addEventListener('click', (e) => {
      if (e.target === signalModal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function openSignalDetails(signal) {
    currentSelectedSignal = signal;
    renderSignalsList(); // refresh active state in sandbox

    modalContent.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
        <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:${signal.badgeColor};"></span>
        <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; font-family:var(--font-mono); color:${signal.badgeColor}; background:${signal.badgeBg}; padding:3px 8px; border-radius:4px;">${signal.type}</span>
        <span style="font-size:0.8rem; font-family:var(--font-mono); color:var(--ink-muted);">${signal.id}</span>
        <span style="margin-left:auto; font-size:0.78rem; font-family:var(--font-mono); color:var(--ink-muted);">${signal.relativeTime}</span>
      </div>
      <h3 style="font-size:1.25rem; font-weight:700; color:var(--ink-primary); margin-bottom:8px; line-height:1.3;">${signal.headline}</h3>
      <p style="font-size:0.9rem; color:var(--ink-secondary); line-height:1.6; margin-bottom:20px; background:var(--bg-canvas-subtle); padding:14px; border-radius:8px;">${signal.description}</p>
      
      <div style="margin-bottom:20px;">
        <h4 style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--ink-muted); margin-bottom:10px; font-weight:700;">Operational Context & Metadata</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.82rem;">
          ${Object.entries(signal.metadata).map(([k, v]) => `
            <div style="background:var(--bg-canvas); border:1px solid var(--border-subtle); padding:10px; border-radius:6px;">
              <span style="display:block; font-size:0.68rem; color:var(--ink-muted); text-transform:capitalize;">${k.replace(/([A-Z])/g, ' $1')}</span>
              <strong style="color:var(--ink-primary); font-family:var(--font-mono);">${v}</strong>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="border-top:1px solid var(--border-subtle); padding-top:16px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.78rem; color:var(--ink-muted);">Role in Early Warning Cluster: <strong>${signal.clusterRole}</strong></span>
        <button id="modalActionBtn" style="padding:8px 16px; background:var(--ink-primary); color:#FFF; border:none; border-radius:6px; font-size:0.82rem; font-weight:600; cursor:pointer;">Inspect Correlation Graph</button>
      </div>
    `;

    signalModal.classList.add('active');
    const modalActionBtn = document.getElementById('modalActionBtn');
    if (modalActionBtn) {
      modalActionBtn.addEventListener('click', () => {
        closeModal();
        const pipelineSection = document.getElementById('pipelineSection');
        if (pipelineSection) {
          pipelineSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  function closeModal() {
    signalModal.classList.remove('active');
  }

  function renderPipelineRibbon() {
    const ribbonContainer = document.getElementById('pipelineRibbon');
    if (!ribbonContainer) return;

    ribbonContainer.innerHTML = PIPELINE_STAGES.map((st, idx) => `
      <div class="pipeline-ribbon-step ${idx === 3 ? 'highlight-risk' : ''} ${idx === 0 ? 'active' : ''}" data-step-index="${idx}">
        <div class="ribbon-top-row">
          <span class="ribbon-step-num">${st.step}</span>
          <span style="font-size:0.7rem; color:var(--ink-muted);">➔</span>
        </div>
        <div>
          <div class="ribbon-step-name">${st.name}</div>
          <div style="font-size:0.72rem; color:var(--ink-muted); margin-top:2px;">${st.subtitle}</div>
        </div>
        <div class="ribbon-step-metric">${st.keyMetric}</div>
      </div>
    `).join('');

    // Click on ribbon steps to highlight details
    const steps = ribbonContainer.querySelectorAll('.pipeline-ribbon-step');
    steps.forEach((stepEl, i) => {
      stepEl.addEventListener('click', () => {
        steps.forEach(s => s.classList.remove('active'));
        stepEl.classList.add('active');
        const st = PIPELINE_STAGES[i];
        const banner = document.getElementById('pipelineFeatureDesc');
        if (banner) {
          banner.innerHTML = `
            <strong>Stage ${st.step} — ${st.name} (${st.subtitle}):</strong> ${st.description}
          `;
        }
      });
    });
  }

  function renderSignalsList() {
    const listEl = document.getElementById('signalsListContainer');
    if (!listEl) return;

    listEl.innerHTML = EARLYSIGHT_SIGNALS.map(sig => {
      const isSelected = currentSelectedSignal && currentSelectedSignal.id === sig.id;
      return `
        <div class="signal-row-item ${isSelected ? 'selected' : ''}" data-sig-id="${sig.id}">
          <div class="signal-type-indicator" style="background:${sig.badgeBg}; color:${sig.badgeColor};">
            ${sig.icon}
          </div>
          <div class="signal-item-content">
            <div class="signal-item-header">
              <span class="signal-item-title">${sig.label}</span>
              <span class="signal-item-time">${sig.relativeTime}</span>
            </div>
            <div class="signal-item-headline">${sig.headline}</div>
            <div class="signal-item-meta">
              <span>Source: ${sig.source}</span>
              <span>•</span>
              <span style="color:${sig.badgeColor}; font-weight:600;">Conf: ${sig.metadata.confidence || '90%'}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.signal-row-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-sig-id');
        const found = EARLYSIGHT_SIGNALS.find(s => s.id === id);
        if (found) {
          openSignalDetails(found);
        }
      });
    });
  }

  function renderRiskSynthesisCard() {
    const container = document.getElementById('riskSynthesisContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="risk-synthesis-card">
        <div class="risk-header-banner">
          <div class="risk-alert-top">
            <span class="risk-alert-tag">
              <span class="status-dot-pulse"></span>
              ${SYNTHESIZED_RISK.status}
            </span>
            <span class="risk-lead-time-pill">${SYNTHESIZED_RISK.leadTime}</span>
          </div>
          <h3 class="risk-title-main">${SYNTHESIZED_RISK.title}</h3>
          <p class="risk-asset-name">Impact Target: <strong>${SYNTHESIZED_RISK.asset}</strong></p>
        </div>

        <div class="risk-metrics-grid">
          <div class="metric-tile">
            <div class="metric-tile-label">Confidence</div>
            <div class="metric-tile-value" style="color:var(--accent-risk);">${SYNTHESIZED_RISK.confidence}</div>
          </div>
          <div class="metric-tile">
            <div class="metric-tile-label">Signals Unified</div>
            <div class="metric-tile-value">${SYNTHESIZED_RISK.evidenceCount} Sources</div>
          </div>
          <div class="metric-tile">
            <div class="metric-tile-label">Averted Cost</div>
            <div class="metric-tile-value" style="color:#059669;">$340k</div>
          </div>
        </div>

        <div class="action-recommendation-box">
          <div class="action-box-title">Prescriptive Mitigation Dispatch</div>
          <p class="action-box-text">${SYNTHESIZED_RISK.recommendedAction}</p>
        </div>

        <button class="btn-dispatch-action" id="btnDispatchWorkOrder">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 5 5L20 7"/></svg>
          Dispatch Preventative CMMS Work Order (SAP PM)
        </button>
      </div>
    `;

    const dispatchBtn = document.getElementById('btnDispatchWorkOrder');
    if (dispatchBtn) {
      dispatchBtn.addEventListener('click', () => {
        dispatchBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Work Order #WO-2026-9901 Dispatched & Confirmed
        `;
        dispatchBtn.style.background = '#059669';
        dispatchBtn.disabled = true;
      });
    }
  }

  // Start the animation engine
  animEngine.start();
});
