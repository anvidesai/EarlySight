/**
 * EarlySight — Enterprise Animation Engine (Stage 1 & 2)
 * Visualizing: Scattered Signals -> Connected Data -> Pattern -> Emerging Risk
 * High DPI Canvas + Orchestrated Physics & SVG/DOM integration
 * Interactive Hover Information Cards & Connected Correlation Graph
 */

class EarlySightAnimation {
  constructor(canvasId, overlayId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.overlay = document.getElementById(overlayId);
    this.signals = options.signals || [];
    this.connections = options.connections || [];
    
    // Callbacks
    this.onPhaseChange = options.onPhaseChange || null;
    this.onSignalClick = options.onSignalClick || null;
    this.onSignalHover = options.onSignalHover || null;
    this.onComplete = options.onComplete || null;

    // Animation state machine — Unified 7-Stage EarlySight Story
    this.phases = [
      { id: 0, name: "System Initialization", duration: 700, label: "00. Initialization", subtitle: "Operational telemetry stream online" },
      { id: 1, name: "Scattered Signals", duration: 3200, label: "01. Scattered Signals", subtitle: "Individual complaints, reports and data" },
      { id: 2, name: "Connection", duration: 3000, label: "02. Connection", subtitle: "Related information gets connected" },
      { id: 3, name: "Pattern", duration: 2800, label: "03. Pattern", subtitle: "A recurring pattern becomes visible" },
      { id: 4, name: "Early Warning", duration: 2800, label: "04. Early Warning", subtitle: "An emerging problem is identified" },
      { id: 5, name: "Evidence", duration: 2800, label: "05. Evidence", subtitle: "The system explains why" },
      { id: 6, name: "Action", duration: 2800, label: "06. Action", subtitle: "A responsible team investigates and acts" },
      { id: 7, name: "Verification", duration: 3200, label: "07. Verification", subtitle: "The system checks whether the problem actually decreases" }
    ];

    this.currentPhaseIndex = 0;
    this.phaseElapsed = 0;
    this.totalElapsed = 0;
    this.isPlaying = true;
    this.speedMultiplier = 1.0;
    this.lastTimestamp = null;
    this.animFrameId = null;

    // Hover & interaction
    this.hoveredSignalId = null;
    this.radarAngle = 0;

    // Background ambient particles (subtle noise data points)
    this.ambientParticles = [];
    this.initAmbientParticles(28);

    // Initialize node physics structures
    this.nodes = [];
    this.domBadges = new Map();
    this.hoverPopover = null;

    // Resize & High DPI
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    this.initNodes();
    this.initHoverPopover();
    this.bindCanvasEvents();
  }

  initAmbientParticles(count) {
    this.ambientParticles = [];
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.18 + 0.05,
        driftSpeedX: (Math.random() - 0.5) * 0.00008,
        driftSpeedY: (Math.random() - 0.5) * 0.00008
      });
    }
  }

  handleResize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.dpr = window.devicePixelRatio || 1;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    // Recompute screen positions for nodes
    if (this.nodes && this.nodes.length > 0) {
      this.updateNodeScreenTargets();
    }
  }

  initNodes() {
    this.nodes = this.signals.map((sig, idx) => {
      return {
        id: sig.id,
        data: sig,
        // Normalized positions (0.0 to 1.0)
        scattered: { ...sig.scatteredPos },
        pattern: { ...sig.patternPos },
        current: { ...sig.scatteredPos },
        screen: { x: 0, y: 0 },
        // Visual state
        appearDelay: 600 + idx * 380, // staggered entrance in Phase 1
        alpha: 0,
        scale: 0,
        rippleRadius: 0,
        rippleAlpha: 0,
        driftSeed: Math.random() * 100,
        color: sig.badgeColor,
        label: sig.label
      };
    });

    this.updateNodeScreenTargets();
    this.createDomBadges();
  }

  initHoverPopover() {
    if (!this.hoverPopover) {
      this.hoverPopover = document.createElement('div');
      this.hoverPopover.className = 'signal-hover-popover';
      this.hoverPopover.id = 'signalHoverPopover';
      this.overlay.appendChild(this.hoverPopover);
    }
  }

  updateNodeScreenTargets() {
    const isMobile = this.width < 768;
    // Bounds padding to keep nodes and labels comfortably within container
    const padX = isMobile ? this.width * 0.10 : this.width * 0.13;
    const padY = isMobile ? this.height * 0.14 : this.height * 0.16;
    const usableW = this.width - padX * 2;
    const usableH = this.height - padY * 2;

    this.nodes.forEach(node => {
      const interp = this.computeNodePosition(node);
      node.screen.x = padX + interp.x * usableW;
      node.screen.y = padY + interp.y * usableH;
    });
  }

  createDomBadges() {
    this.overlay.innerHTML = '';
    this.domBadges.clear();
    this.initHoverPopover();

    this.nodes.forEach(node => {
      const badge = document.createElement('div');
      badge.className = 'signal-badge-node';
      badge.id = `badge-${node.id}`;
      badge.innerHTML = `
        <span class="signal-dot" style="background-color: ${node.color}"></span>
        <span class="signal-type-tag" style="background-color: ${node.data.badgeBg}; color: ${node.color};">${node.label}</span>
        <span class="signal-headline-snippet">${node.data.relativeTime}</span>
      `;

      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onSignalClick) this.onSignalClick(node.data);
      });

      badge.addEventListener('mouseenter', () => {
        this.setHoveredSignal(node.id);
      });

      badge.addEventListener('mouseleave', () => {
        this.setHoveredSignal(null);
      });

      this.overlay.appendChild(badge);
      this.domBadges.set(node.id, badge);
    });
  }

  setHoveredSignal(signalId) {
    if (this.hoveredSignalId === signalId) return;
    this.hoveredSignalId = signalId;

    if (signalId) {
      const node = this.nodes.find(n => n.id === signalId);
      if (node) {
        this.showHoverPopover(node);
      }
    } else {
      this.hideHoverPopover();
    }
  }

  showHoverPopover(node) {
    if (!this.hoverPopover || !node) return;
    const data = node.data;
    const isIncreasing = data.frequency && data.frequency.toLowerCase().includes('increasing');

    this.hoverPopover.innerHTML = `
      <div class="hover-card-header">
        <span class="hover-card-indicator" style="background-color: ${node.color}"></span>
        <span class="hover-card-title">${data.cardTitle || (data.type + " Report")}</span>
        <span class="hover-card-badge">${data.relativeTime}</span>
      </div>
      <div class="hover-card-grid">
        <div class="hover-row">
          <span class="hover-label">Location:</span>
          <span class="hover-val">${data.location || 'Block A'}</span>
        </div>
        <div class="hover-row">
          <span class="hover-label">Frequency:</span>
          <span class="hover-val ${isIncreasing ? 'freq-increasing' : ''}">${data.frequency || 'Increasing'}</span>
        </div>
        <div class="hover-row">
          <span class="hover-label">Status:</span>
          <span class="hover-val status-pill">${data.status || 'Related Signal'}</span>
        </div>
      </div>
      <div class="hover-card-footer">
        <div class="hover-flow-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span>Signal ➔ Pattern ➔ Emerging Risk</span>
        </div>
        <div class="hover-note">${data.relatedSummary || data.headline}</div>
      </div>
    `;

    // Calculate position
    const popWidth = 280;
    const popHeight = 165;
    let left = node.screen.x + 16;
    let top = node.screen.y - 30;

    // Flip horizontally if near right boundary
    if (left + popWidth > this.width - 16) {
      left = node.screen.x - popWidth - 16;
    }
    // Clamp inside container
    if (left < 14) {
      left = 14;
    }
    if (top + popHeight > this.height - 14) {
      top = this.height - popHeight - 14;
    }
    if (top < 14) {
      top = 14;
    }

    this.hoverPopover.style.left = `${left}px`;
    this.hoverPopover.style.top = `${top}px`;
    this.hoverPopover.classList.add('visible');

    if (this.onSignalHover) {
      this.onSignalHover(data);
    }
  }

  hideHoverPopover() {
    if (this.hoverPopover) {
      this.hoverPopover.classList.remove('visible');
    }
    if (this.onSignalHover) {
      this.onSignalHover(null);
    }
  }

  isNodeConnected(nodeIdA, nodeIdB) {
    if (!nodeIdA || !nodeIdB) return false;
    return this.connections.some(c => 
      (c.from === nodeIdA && c.to === nodeIdB) || 
      (c.from === nodeIdB && c.to === nodeIdA)
    );
  }

  bindCanvasEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let found = null;
      for (const node of this.nodes) {
        const dx = node.screen.x - mouseX;
        const dy = node.screen.y - mouseY;
        if (Math.hypot(dx, dy) < 28) {
          found = node.id;
          break;
        }
      }
      this.setHoveredSignal(found);
      this.canvas.style.cursor = found ? 'pointer' : 'default';
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.setHoveredSignal(null);
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.hoveredSignalId) {
        const targetNode = this.nodes.find(n => n.id === this.hoveredSignalId);
        if (targetNode && this.onSignalClick) {
          this.onSignalClick(targetNode.data);
        }
      }
    });
  }

  computeNodePosition(node) {
    const pIdx = this.currentPhaseIndex;
    const pProg = Math.min(1, Math.max(0, this.phaseElapsed / this.phases[pIdx].duration));
    const smoothEase = this.easeInOutCubic(pProg);

    // Natural organic drift
    const time = this.totalElapsed * 0.0012;
    const driftAmp = pIdx <= 1 ? 0.025 : 0.005; // High drift when scattered, locked when patterned
    const driftX = Math.sin(time + node.driftSeed) * driftAmp;
    const driftY = Math.cos(time * 0.8 + node.driftSeed * 1.4) * driftAmp;

    if (pIdx === 0 || pIdx === 1) {
      return {
        x: node.scattered.x + driftX,
        y: node.scattered.y + driftY
      };
    } else if (pIdx === 2) {
      // Transition from scattered to pattern
      const startX = node.scattered.x;
      const startY = node.scattered.y;
      const targetX = node.pattern.x;
      const targetY = node.pattern.y;
      return {
        x: startX + (targetX - startX) * smoothEase + driftX,
        y: startY + (targetY - startY) * smoothEase + driftY
      };
    } else if (pIdx === 3) {
      // Pattern phase: held in geometric pattern
      return {
        x: node.pattern.x + driftX,
        y: node.pattern.y + driftY
      };
    } else {
      // Phase 4 & 5: Pattern condenses smoothly into focal indicator
      const centerX = 0.50;
      const centerY = 0.42;
      const condenseProg = pIdx === 4 ? smoothEase : 1;
      const currentX = node.pattern.x + (centerX - node.pattern.x) * (condenseProg * 0.72);
      const currentY = node.pattern.y + (centerY - node.pattern.y) * (condenseProg * 0.72);
      return { x: currentX, y: currentY };
    }
  }

  // Easing functions
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
  }
  easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  start() {
    this.isPlaying = true;
    this.lastTimestamp = performance.now();
    this.loop = this.loop.bind(this);
    this.animFrameId = requestAnimationFrame(this.loop);
  }

  pause() {
    this.isPlaying = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.lastTimestamp = performance.now();
      this.animFrameId = requestAnimationFrame(this.loop);
    }
  }

  replay() {
    this.currentPhaseIndex = 0;
    this.phaseElapsed = 0;
    this.totalElapsed = 0;
    this.setHoveredSignal(null);
    this.nodes.forEach(n => {
      n.alpha = 0;
      n.scale = 0;
      n.rippleRadius = 0;
    });
    this.domBadges.forEach(badge => badge.classList.remove('visible'));
    if (this.onPhaseChange) this.onPhaseChange(0, this.phases[0]);
    this.play();
  }

  seekToPhase(phaseIndex) {
    if (phaseIndex < 0 || phaseIndex >= this.phases.length) return;
    this.currentPhaseIndex = phaseIndex;
    this.phaseElapsed = 0;
    this.setHoveredSignal(null);
    
    // Compute total elapsed up to start of this phase
    let acc = 0;
    for (let i = 0; i < phaseIndex; i++) {
      acc += this.phases[i].duration;
    }
    this.totalElapsed = acc;

    // Reset node states appropriately
    this.nodes.forEach(node => {
      if (phaseIndex === 0) {
        node.alpha = 0;
        node.scale = 0;
      } else {
        node.alpha = 1;
        node.scale = 1;
      }
    });

    if (this.onPhaseChange) this.onPhaseChange(phaseIndex, this.phases[phaseIndex]);
    this.updateNodeScreenTargets();
  }

  loop(timestamp) {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const delta = (timestamp - this.lastTimestamp) * this.speedMultiplier;
    this.lastTimestamp = timestamp;

    if (this.isPlaying) {
      this.phaseElapsed += delta;
      this.totalElapsed += delta;

      const currentPhase = this.phases[this.currentPhaseIndex];
      if (this.phaseElapsed >= currentPhase.duration) {
        if (this.currentPhaseIndex < this.phases.length - 1) {
          this.currentPhaseIndex++;
          this.phaseElapsed = 0;
          if (this.onPhaseChange) {
            this.onPhaseChange(this.currentPhaseIndex, this.phases[this.currentPhaseIndex]);
          }
        } else {
          if (this.onComplete) this.onComplete();
        }
      }
    }

    this.render();
    this.animFrameId = requestAnimationFrame(this.loop);
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updateNodeScreenTargets();

    // 1. Draw subtle ambient particles
    this.drawAmbientBackground();

    // 2. Draw connections (Phase 2+, OR when any signal is hovered to reveal connection)
    if (this.currentPhaseIndex >= 2 || (this.currentPhaseIndex === 1 && this.hoveredSignalId)) {
      this.drawConnections();
    }

    // 3. Draw pattern geometric fill (Phase 3 & 4)
    if (this.currentPhaseIndex === 3 || this.currentPhaseIndex === 4) {
      this.drawPatternMesh();
    }

    // 4. Draw early warning radar indicator (Phases 4 to 6; suppressed in Phase 7 Verification where calm baseline is restored)
    if (this.currentPhaseIndex >= 4 && this.currentPhaseIndex < 7) {
      this.drawEarlyWarningRadar();
    }

    // 5. Draw evidence causal explainability overlay (Phase 5)
    if (this.currentPhaseIndex === 5) {
      this.drawEvidenceOverlay();
    }

    // 6. Draw action dispatch overlay (Phase 6)
    if (this.currentPhaseIndex === 6) {
      this.drawActionDispatchOverlay();
    }

    // 7. Draw verification decay overlay (Phase 7)
    if (this.currentPhaseIndex === 7) {
      this.drawVerificationOverlay();
    }

    // 8. Draw signal nodes & ripple waves
    this.drawNodes();

    // 9. Sync DOM floating labels & popover
    this.syncDomBadges();
  }

  drawAmbientBackground() {
    const ctx = this.ctx;
    this.ambientParticles.forEach(p => {
      p.x += p.driftSpeedX;
      p.y += p.driftSpeedY;
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;

      const px = p.x * this.width;
      const py = p.y * this.height;

      ctx.fillStyle = `rgba(111, 143, 181, ${p.alpha * 0.35})`;
      ctx.beginPath();
      ctx.arc(px, py, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawConnections() {
    const ctx = this.ctx;
    const pIdx = this.currentPhaseIndex;
    const pProg = Math.min(1, Math.max(0, this.phaseElapsed / this.phases[pIdx].duration));
    
    // Base connection opacity
    let baseAlpha = 0;
    if (pIdx === 1) {
      // In phase 1, only show connection lines for the hovered node
      baseAlpha = 0.55;
    } else if (pIdx === 2) {
      baseAlpha = this.easeOutQuad(pProg) * 0.65;
    } else if (pIdx === 3) {
      baseAlpha = 0.75 + Math.sin(this.totalElapsed * 0.003) * 0.12;
    } else if (pIdx === 4) {
      baseAlpha = (1 - pProg * 0.45) * 0.7;
    } else {
      baseAlpha = 0.30;
    }

    this.connections.forEach((conn, index) => {
      const nodeFrom = this.nodes.find(n => n.id === conn.from);
      const nodeTo = this.nodes.find(n => n.id === conn.to);
      if (!nodeFrom || !nodeTo) return;

      const x1 = nodeFrom.screen.x;
      const y1 = nodeFrom.screen.y;
      const x2 = nodeTo.screen.x;
      const y2 = nodeTo.screen.y;

      const isConnectedToHover = (this.hoveredSignalId === conn.from || this.hoveredSignalId === conn.to);
      
      // In phase 1, only render if connected to hover
      if (pIdx === 1 && !isConnectedToHover) return;

      let lineAlpha = baseAlpha * conn.weight;
      let lineWidth = 1.1;
      let strokeColor = `rgba(59, 110, 168, ${lineAlpha * 0.45})`;

      if (this.hoveredSignalId) {
        if (isConnectedToHover) {
          lineAlpha = 0.95;
          lineWidth = 2.4;
          strokeColor = 'rgba(211, 154, 90, 0.90)';
        } else {
          lineAlpha *= 0.25; // dim non-connected lines
          strokeColor = `rgba(40, 54, 77, ${lineAlpha * 0.25})`;
        }
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      if (pIdx === 1) {
        ctx.setLineDash([4, 4]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Flowing data packets along line
      if (pIdx >= 2 || isConnectedToHover) {
        const speed = isConnectedToHover ? 0.0012 : (0.0006 + (index % 3) * 0.0002);
        const offset = ((this.totalElapsed * speed) + (index * 0.23)) % 1;
        const packetX = x1 + (x2 - x1) * offset;
        const packetY = y1 + (y2 - y1) * offset;

        ctx.beginPath();
        ctx.arc(packetX, packetY, isConnectedToHover ? 3.0 : 2.0, 0, Math.PI * 2);
        ctx.fillStyle = isConnectedToHover 
          ? 'rgba(211, 154, 90, 1.0)' 
          : `rgba(111, 143, 181, ${lineAlpha * 0.75})`;
        ctx.fill();
      }

      ctx.restore();
    });
  }

  drawPatternMesh() {
    const ctx = this.ctx;
    const pIdx = this.currentPhaseIndex;
    const pProg = Math.min(1, Math.max(0, this.phaseElapsed / this.phases[pIdx].duration));
    const meshAlpha = pIdx === 3 
      ? this.easeOutQuad(pProg) * 0.06 
      : (1 - pProg * 0.5) * 0.06;

    if (this.nodes.length >= 3) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.nodes[0].screen.x, this.nodes[0].screen.y);
      for (let i = 1; i < this.nodes.length; i++) {
        ctx.lineTo(this.nodes[i].screen.x, this.nodes[i].screen.y);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(211, 154, 90, ${meshAlpha * 1.5})`;
      ctx.fill();

      ctx.strokeStyle = `rgba(211, 154, 90, ${meshAlpha * 3.2})`;
      ctx.lineWidth = 1.0;
      ctx.stroke();
      ctx.restore();
    }
  }

  drawEarlyWarningRadar() {
    const ctx = this.ctx;
    const pIdx = this.currentPhaseIndex;
    const pProg = Math.min(1, Math.max(0, this.phaseElapsed / this.phases[pIdx].duration));
    
    const centerX = this.width * 0.50;
    const centerY = this.height * 0.48;
    const radarAlpha = pIdx === 4 ? this.easeOutQuad(pProg) : 1;

    this.radarAngle += 0.020 * this.speedMultiplier;

    ctx.save();
    ctx.translate(centerX, centerY);

    const rings = [35, 75, 115, 155];
    rings.forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(211, 154, 90, ${0.16 * radarAlpha * (1 - i * 0.15)})`;
      ctx.lineWidth = 1.0;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    const sweepRadius = 150;
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, sweepRadius);
    grad.addColorStop(0, 'rgba(211, 154, 90, 0.22)');
    grad.addColorStop(0.7, 'rgba(211, 154, 90, 0.08)');
    grad.addColorStop(1, 'rgba(211, 154, 90, 0)');

    ctx.save();
    ctx.rotate(this.radarAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, sweepRadius, 0, Math.PI * 0.35, false);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(sweepRadius * Math.cos(Math.PI * 0.35), sweepRadius * Math.sin(Math.PI * 0.35));
    ctx.strokeStyle = `rgba(211, 154, 90, ${0.45 * radarAlpha})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();

    const pulseScale = 1 + Math.sin(this.totalElapsed * 0.005) * 0.12;
    ctx.beginPath();
    ctx.arc(0, 0, 8 * pulseScale, 0, Math.PI * 2);
    ctx.fillStyle = '#D39A5A';
    ctx.shadowColor = 'rgba(211, 154, 90, 0.4)';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;

    const waveProgress = (this.totalElapsed * 0.001) % 1.5;
    const waveRadius = waveProgress * 90;
    const waveAlpha = Math.max(0, (1 - waveProgress / 1.5) * 0.5 * radarAlpha);
    ctx.beginPath();
    ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(211, 154, 90, ${waveAlpha * 0.85})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  drawEvidenceOverlay() {
    const ctx = this.ctx;
    const pProg = Math.min(1, Math.max(0, this.phaseElapsed / this.phases[5].duration));
    const alpha = this.easeOutQuad(pProg);
    const centerX = this.width * 0.50;
    const centerY = this.height * 0.48;

    ctx.save();
    ctx.translate(centerX, centerY);

    // 1. Concentric Causal Contribution Arcs
    const pillars = [
      { name: "SCADA Sensors", weight: "+38%", r: 88, start: 0, end: Math.PI * 0.76, color: '#EF7B7B' },
      { name: "CMMS Tickets", weight: "+28%", r: 108, start: Math.PI * 0.82, end: Math.PI * 1.38, color: '#F2A65A' },
      { name: "Operator Logs", weight: "+21%", r: 128, start: Math.PI * 1.44, end: Math.PI * 1.86, color: '#F4C96B' },
      { name: "Acoustics", weight: "+13%", r: 148, start: Math.PI * 1.92, end: Math.PI * 2.18, color: '#72C6A5' }
    ];

    pillars.forEach((p) => {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, p.start, p.start + (p.end - p.start) * alpha);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3.0;
      ctx.stroke();

      if (alpha > 0.6) {
        const midAngle = (p.start + p.end) / 2;
        const lx = Math.cos(midAngle) * (p.r + 14);
        const ly = Math.sin(midAngle) * (p.r + 14);
        ctx.font = '700 9px monospace';
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.weight, lx, ly);
      }
    });

    // 2. Central Evidence Strength Badge
    ctx.beginPath();
    ctx.arc(0, 0, 38, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#78C7C7';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(16, 42, 67, 0.08)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.font = '800 15px monospace';
    ctx.fillStyle = '#102A43';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('87%', 0, -5);

    ctx.font = '700 8px sans-serif';
    ctx.fillStyle = '#274C77';
    ctx.fillText('EVIDENCE', 0, 10);

    // 3. Lower Explanation Card
    const boxW = Math.min(360, this.width - 32);
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#D9E2EC';
    ctx.lineWidth = 1.0;
    ctx.shadowColor = 'rgba(16, 42, 67, 0.06)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-boxW / 2, 65, boxW, 42, 6);
    } else {
      ctx.rect(-boxW / 2, 65, boxW, 42);
    }
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.font = '700 11px sans-serif';
    ctx.fillStyle = '#102A43';
    ctx.textAlign = 'center';
    ctx.fillText('STAGE 05: EVIDENCE — THE SYSTEM EXPLAINS WHY', 0, 80);
    ctx.font = '500 9.5px sans-serif';
    ctx.fillStyle = '#486581';
    ctx.fillText('Causal graph verified across 5 independent operational streams', 0, 96);

    ctx.restore();
  }

  drawActionDispatchOverlay() {
    const ctx = this.ctx;
    const pProg = Math.min(1, Math.max(0, this.phaseElapsed / this.phases[6].duration));
    const alpha = this.easeOutQuad(pProg);
    const centerX = this.width * 0.50;
    const centerY = this.height * 0.42;

    ctx.save();
    ctx.translate(centerX, centerY);

    // Dispatch Vector
    const arrowLen = 100 * alpha;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(arrowLen, -arrowLen * 0.45);
    ctx.strokeStyle = '#F2A65A';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Action Execution Box
    const boxW = Math.min(370, this.width - 32);
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#D9E2EC';
    ctx.lineWidth = 1.4;
    ctx.shadowColor = 'rgba(16, 42, 67, 0.08)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-boxW / 2, 58, boxW, 56, 8);
    } else {
      ctx.rect(-boxW / 2, 58, boxW, 56);
    }
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.font = '700 11px sans-serif';
    ctx.fillStyle = '#102A43';
    ctx.textAlign = 'center';
    ctx.fillText('STAGE 06: ACTION — RESPONSIBLE TEAM ACTS', 0, 74);

    ctx.font = '600 10px monospace';
    ctx.fillStyle = '#486581';
    ctx.fillText('Assigned: Reliability & Mechanical Team (M. Vance)', 0, 89);

    ctx.font = '500 9.5px sans-serif';
    ctx.fillStyle = '#9A4D00';
    ctx.fillText('Target: Joint 4B-12 Isolation & Seal • SLA Target < 4.2d', 0, 103);

    ctx.restore();
  }

  drawVerificationOverlay() {
    const ctx = this.ctx;
    const pProg = Math.min(1, Math.max(0, this.phaseElapsed / this.phases[7].duration));
    const alpha = this.easeOutQuad(pProg);
    const centerX = this.width * 0.50;
    const centerY = this.height * 0.42;

    ctx.save();
    ctx.translate(centerX, centerY);

    // Calm Green Stabilizing Rings
    const rings = [45, 90, 140];
    rings.forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(114, 198, 165, ${0.28 * (1 - i * 0.25) * alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Verification Success Card
    const boxW = Math.min(380, this.width - 32);
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#72C6A5';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = 'rgba(16, 42, 67, 0.08)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-boxW / 2, 54, boxW, 60, 8);
    } else {
      ctx.rect(-boxW / 2, 54, boxW, 60);
    }
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.font = '800 11px sans-serif';
    ctx.fillStyle = '#102A43';
    ctx.textAlign = 'center';
    ctx.fillText('STAGE 07: VERIFICATION — CONFIRMING PROBLEM DECREASES', 0, 71);

    ctx.font = '700 10.5px monospace';
    ctx.fillStyle = '#18794E';
    ctx.fillText('Precursor Signal Decay: -95.2% (Nominal Baseline Restored)', 0, 87);

    ctx.font = '600 9.5px monospace';
    ctx.fillStyle = '#486581';
    ctx.fillText('Averted Downtime Loss: $512,000 Verified • Post-Intervention Audit', 0, 102);

    ctx.restore();
  }

  drawNodes() {
    const ctx = this.ctx;
    const pIdx = this.currentPhaseIndex;

    this.nodes.forEach(node => {
      if (pIdx === 0) return;

      if (pIdx === 1) {
        if (this.phaseElapsed < node.appearDelay) {
          node.alpha = 0;
          node.scale = 0;
          return;
        }
        const timeSinceAppear = this.phaseElapsed - node.appearDelay;
        const appearProg = Math.min(1, timeSinceAppear / 600);
        node.alpha = this.easeOutQuad(appearProg);
        node.scale = this.easeOutQuad(appearProg);
        
        if (timeSinceAppear < 1200) {
          node.rippleRadius = (timeSinceAppear / 1200) * 38;
          node.rippleAlpha = (1 - timeSinceAppear / 1200) * 0.6;
        } else {
          node.rippleAlpha = 0;
        }
      } else {
        node.alpha = 1;
        node.scale = 1;
        node.rippleAlpha = 0;
      }

      const x = node.screen.x;
      const y = node.screen.y;
      const isHovered = (this.hoveredSignalId === node.id);
      const isConnected = this.isNodeConnected(this.hoveredSignalId, node.id);
      const effectiveColor = (pIdx === 7) ? '#5F9074' : node.color;

      ctx.save();
      ctx.translate(x, y);

      // Ripple wave on arrival
      if (node.rippleAlpha > 0.01) {
        ctx.beginPath();
        ctx.arc(0, 0, node.rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(211, 154, 90, ${node.rippleAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Outer focus ring when hovered
      if (isHovered) {
        const hoverPulse = 1 + Math.sin(this.totalElapsed * 0.008) * 0.15;
        ctx.beginPath();
        ctx.arc(0, 0, 18 * hoverPulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(211, 154, 90, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (isConnected) {
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(211, 154, 90, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Outer ring / target reticle
      ctx.beginPath();
      ctx.arc(0, 0, (isHovered ? 14 : 9) * node.scale, 0, Math.PI * 2);
      ctx.strokeStyle = isHovered 
        ? effectiveColor 
        : (isConnected ? 'rgba(211, 154, 90, 0.6)' : `rgba(40, 54, 77, ${0.45 * node.alpha})`);
      ctx.lineWidth = isHovered ? 2.0 : 1.0;
      ctx.stroke();

      // Inner solid node core
      ctx.beginPath();
      ctx.arc(0, 0, (isHovered ? 6 : 4) * node.scale, 0, Math.PI * 2);
      ctx.fillStyle = effectiveColor;
      if (isHovered) {
        ctx.shadowColor = effectiveColor;
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    });
  }

  syncDomBadges() {
    const isMobile = this.width < 768;

    this.nodes.forEach(node => {
      const badge = this.domBadges.get(node.id);
      if (!badge) return;

      if (this.currentPhaseIndex === 0 || (this.currentPhaseIndex === 1 && node.alpha < 0.2)) {
        badge.classList.remove('visible');
      } else {
        badge.classList.add('visible');
      }

      const alignX = (node.screen.x > this.width * 0.5) ? 'left' : 'right';
      const topOffset = (node.screen.y > this.height * 0.5) ? -24 : 24;

      let leftPos = node.screen.x + (alignX === 'left' ? 14 : -14);
      let topPos = node.screen.y + topOffset;

      leftPos = Math.max(76, Math.min(this.width - 76, leftPos));
      topPos = Math.max(28, Math.min(this.height - 28, topPos));

      badge.style.left = `${leftPos}px`;
      badge.style.top = `${topPos}px`;

      const isHovered = (this.hoveredSignalId === node.id);
      const isConnected = this.isNodeConnected(this.hoveredSignalId, node.id);

      if (isHovered) {
        badge.style.opacity = '1';
        badge.style.transform = 'translate(-50%, -50%) scale(1.06)';
        badge.style.zIndex = '40';
        badge.style.borderColor = 'var(--accent-risk)';
        badge.style.boxShadow = 'var(--shadow-md)';
      } else if (isConnected) {
        badge.style.opacity = '1';
        badge.style.transform = 'translate(-50%, -50%) scale(1.0)';
        badge.style.zIndex = '25';
        badge.style.borderColor = 'var(--accent-risk-border)';
      } else if (this.currentPhaseIndex >= 4) {
        badge.style.opacity = isMobile ? '0' : '0.45';
        badge.style.transform = 'translate(-50%, -50%) scale(0.85)';
        badge.style.zIndex = '10';
        badge.style.borderColor = 'var(--border-subtle)';
      } else {
        badge.style.opacity = '1';
        badge.style.transform = 'translate(-50%, -50%) scale(1)';
        badge.style.zIndex = '10';
        badge.style.borderColor = 'var(--border-subtle)';
      }
    });
  }
}

if (typeof window !== 'undefined') {
  window.EarlySightAnimation = EarlySightAnimation;
}

export { EarlySightAnimation };
