/**
 * EarlySight — Interactive Signal Map Engine (Stage 6)
 * Complete Geospatial Intelligence, Pan & Zoom, Search, Multi-Filter,
 * Gradual Merge Physics & Cluster Revelation Drawer.
 * 
 * Features:
 * - Zoom & Pan with mouse wheel, drag, and on-screen controls (+, -, reset)
 * - Live keyword Search across signals, assets, bays, and risks
 * - Location filtering (All Zones + 6 Facility Quads)
 * - Date filtering (Range pickers, quick horizons, and interactive date timeline scrubber)
 * - Signal modality filtering (Sensors, Maintenance, Complaints, Images, Historical, Incidents)
 * - Risk severity & issue filtering
 * - Gradual merging animation when multiple signals occur in one area
 * - Cluster Revelation: Location, Related Signals, Emerging Issue, Confidence, Trend
 */

class EarlySightSignalMap {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;

    // Base coordinate space
    this.baseWidth = 1160;
    this.baseHeight = 580;

    // Pan & Zoom Viewport Transform
    this.scale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.minScale = 0.55;
    this.maxScale = 3.6;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.hasDragged = false;

    // Filtering State
    this.searchQuery = '';
    this.activeLocationFilter = 'all'; // 'all' or zoneId
    this.activeTimeFilter = '30d'; // '24h', '7d', '14d', '30d', 'custom'
    this.dateRange = {
      start: '2026-08-25',
      end: '2026-09-24'
    };
    this.activeSignalTypes = new Set(['Sensor', 'Maintenance', 'Complaint', 'Image', 'Historical', 'Incident']);
    this.activeSeverityFilter = 'all'; // 'all', 'critical', 'high', 'moderate', 'low'
    this.activeRiskIssueFilter = 'all'; // 'all' or specific risk title

    // Merge Animation Physics
    this.mergeProgress = 1.0; // 0.0 = completely scattered, 1.0 = completely merged
    this.targetMergeProgress = 1.0;
    this.isAnimatingMerge = false;
    this.mergeAnimationStartTime = 0;
    this.mergeAnimationDuration = 1800; // ms
    this.startMergeValue = 1.0;

    // Hover & Interaction
    this.mouseWorldPos = { x: -100, y: -100 };
    this.mouseScreenPos = { x: -100, y: -100 };
    this.hoveredSignal = null;
    this.hoveredCluster = null;
    this.hoveredZone = null;
    this.selectedCluster = null;
    this.rippleTime = 0;

    // Signal Particles State
    this.particles = [];

    this.init();
  }

  init() {
    this.setupCanvasDimensions();
    this.initParticles();
    this.bindControls();
    this.updateStatsBar();
    this.startRenderLoop();

    // Reveal primary epicenter cluster on startup
    const blockA = FACILITY_MAP_ZONES.find(z => z.id === 'block-a');
    if (blockA) {
      this.selectedCluster = blockA;
      this.revealClusterDetails(blockA);
    }
  }

  setupCanvasDimensions() {
    if (!this.canvas) return;
    this.canvas.width = this.baseWidth * this.dpr;
    this.canvas.height = this.baseHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  initParticles() {
    this.particles = FACILITY_SIGNALS_DATA.map((sig, idx) => {
      const zone = FACILITY_MAP_ZONES.find(z => z.id === sig.zoneId) || FACILITY_MAP_ZONES[0];
      
      // Calculate small radial cluster offset around zone centroid for merged state
      const angle = (idx * 0.94) + (sig.id.charCodeAt(sig.id.length - 1) * 0.5);
      const radius = 8 + (idx % 4) * 6;
      const mergedX = zone.centroid.x + Math.cos(angle) * radius;
      const mergedY = zone.centroid.y + Math.sin(angle) * radius;

      return {
        ...sig,
        scatteredX: sig.scatteredCoord.x,
        scatteredY: sig.scatteredCoord.y,
        mergedX: mergedX,
        mergedY: mergedY,
        currentX: mergedX,
        currentY: mergedY,
        currentRadius: 5.5,
        opacity: 1.0,
        floatSeed: Math.random() * 100,
        zoneCentroid: zone.centroid,
        zoneColor: zone.themeColor,
        date: sig.date || '2026-09-20'
      };
    });
  }

  bindControls() {
    // 1. Mouse Wheel Zoom (centered around pointer)
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseScreenX = (e.clientX - rect.left) * (this.baseWidth / rect.width);
      const mouseScreenY = (e.clientY - rect.top) * (this.baseHeight / rect.height);

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * zoomFactor));

      // Zoom centered on cursor
      this.panX = mouseScreenX - (mouseScreenX - this.panX) * (newScale / this.scale);
      this.panY = mouseScreenY - (mouseScreenY - this.panY) * (newScale / this.scale);
      this.scale = newScale;

      this.updateZoomBadge();
    }, { passive: false });

    // 2. Mouse Drag to Pan
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // left button
        this.isDragging = true;
        this.dragStartX = e.clientX - this.panX;
        this.dragStartY = e.clientY - this.panY;
        this.hasDragged = false;
        this.canvas.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const newPanX = e.clientX - this.dragStartX;
        const newPanY = e.clientY - this.dragStartY;
        if (Math.abs(newPanX - this.panX) > 3 || Math.abs(newPanY - this.panY) > 3) {
          this.hasDragged = true;
        }
        this.panX = newPanX;
        this.panY = newPanY;
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.canvas.style.cursor = 'crosshair';
      }
    });

    // 3. Mouse Move Hover Detection (projected to world coordinates)
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const screenX = (e.clientX - rect.left) * (this.baseWidth / rect.width);
      const screenY = (e.clientY - rect.top) * (this.baseHeight / rect.height);

      this.mouseScreenPos = { x: e.clientX, y: e.clientY };
      // World coordinates transformed by current pan and scale
      this.mouseWorldPos = {
        x: (screenX - this.panX) / this.scale,
        y: (screenY - this.panY) / this.scale
      };

      if (!this.isDragging) {
        this.checkHoverInteractions();
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouseWorldPos = { x: -1000, y: -1000 };
      this.hoveredSignal = null;
      this.hoveredCluster = null;
      this.hoveredZone = null;
      this.hideTooltip();
    });

    // 4. Click Handler (reveals Cluster details or Signal modal)
    this.canvas.addEventListener('click', (e) => {
      if (this.hasDragged) return; // Ignore drag release

      if (this.hoveredCluster) {
        this.revealClusterDetails(this.hoveredCluster);
      } else if (this.hoveredSignal) {
        if (window.dashboardController && typeof window.dashboardController.inspectMapSignal === 'function') {
          window.dashboardController.inspectMapSignal(this.hoveredSignal.id);
        }
      } else if (this.hoveredZone) {
        this.revealClusterDetails(this.hoveredZone);
      }
    });

    // 5. Zoom Buttons (+ / - / Reset)
    const btnZoomIn = document.getElementById('mapZoomIn');
    const btnZoomOut = document.getElementById('mapZoomOut');
    const btnZoomReset = document.getElementById('mapZoomReset');

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => this.zoomRelative(1.25));
    }
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => this.zoomRelative(0.8));
    }
    if (btnZoomReset) {
      btnZoomReset.addEventListener('click', () => this.resetView());
    }

    // 6. Live Search Input
    const searchInput = document.getElementById('mapSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.updateStatsBar();
      });
    }

    // 7. Location Filter Buttons / Select
    const locBtns = document.querySelectorAll('.map-loc-btn');
    locBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        locBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const loc = btn.getAttribute('data-zone');
        this.setLocationFilter(loc);
      });
    });

    const locSelect = document.getElementById('mapLocationSelect');
    if (locSelect) {
      locSelect.addEventListener('change', (e) => {
        this.setLocationFilter(e.target.value);
      });
    }

    // 8. Time Horizon Quick Pills
    const timeBtns = document.querySelectorAll('.map-time-btn');
    timeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const horizon = btn.getAttribute('data-horizon');
        this.setTimeFilter(horizon);
      });
    });

    // 9. Date Range Inputs & Date Timeline Scrubber
    const dateStartInput = document.getElementById('mapDateStart');
    const dateEndInput = document.getElementById('mapDateEnd');
    if (dateStartInput && dateEndInput) {
      const handleDateChange = () => {
        this.activeTimeFilter = 'custom';
        this.dateRange.start = dateStartInput.value || '2026-08-25';
        this.dateRange.end = dateEndInput.value || '2026-09-24';
        timeBtns.forEach(b => b.classList.remove('active'));
        this.updateStatsBar();
        this.animateMergeTo(this.mergeProgress > 0.5 ? 1.0 : 0.0);
      };
      dateStartInput.addEventListener('change', handleDateChange);
      dateEndInput.addEventListener('change', handleDateChange);
    }

    const dateScrubber = document.getElementById('mapDateScrubber');
    if (dateScrubber) {
      dateScrubber.addEventListener('input', (e) => {
        const dayOffset = parseInt(e.target.value, 10); // 0 to 30
        const d = new Date(2026, 7, 25); // Aug 25 2026
        d.setDate(d.getDate() + dayOffset);
        const iso = d.toISOString().split('T')[0];
        
        this.activeTimeFilter = 'custom';
        this.dateRange.end = iso;
        if (dateEndInput) dateEndInput.value = iso;
        
        const scrubberLabel = document.getElementById('mapDateScrubberLabel');
        if (scrubberLabel) scrubberLabel.textContent = `Up to ${iso}`;
        
        this.updateStatsBar();
        this.animateMergeTo(1.0);
      });
    }

    // 10. Signal Modality Checkbox / Filter Pills
    const modalityPills = document.querySelectorAll('.map-modality-pill');
    modalityPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const mod = pill.getAttribute('data-modality');
        if (mod === 'all') {
          this.activeSignalTypes = new Set(['Sensor', 'Maintenance', 'Complaint', 'Image', 'Historical', 'Incident']);
          modalityPills.forEach(p => p.classList.add('active'));
        } else {
          if (this.activeSignalTypes.has(mod)) {
            this.activeSignalTypes.delete(mod);
            pill.classList.remove('active');
          } else {
            this.activeSignalTypes.add(mod);
            pill.classList.add('active');
          }
        }
        this.updateStatsBar();
      });
    });

    // 11. Risk Severity Filter
    const severitySelect = document.getElementById('mapSeveritySelect');
    if (severitySelect) {
      severitySelect.addEventListener('change', (e) => {
        this.activeSeverityFilter = e.target.value;
        this.updateStatsBar();
      });
    }

    // 12. Emerging Risk Issue Select
    const issueSelect = document.getElementById('mapIssueSelect');
    if (issueSelect) {
      issueSelect.addEventListener('change', (e) => {
        this.activeRiskIssueFilter = e.target.value;
        this.updateStatsBar();
      });
    }

    // 13. Merge Mode Switcher & Scrubber Slider
    const btnScattered = document.getElementById('mapModeScattered');
    const btnMerged = document.getElementById('mapModeMerged');
    const btnReplay = document.getElementById('mapReplayMerge');
    const mergeSlider = document.getElementById('mapMergeSlider');

    if (btnScattered) {
      btnScattered.addEventListener('click', () => {
        btnScattered.classList.add('active');
        if (btnMerged) btnMerged.classList.remove('active');
        this.animateMergeTo(0.0);
      });
    }

    if (btnMerged) {
      btnMerged.addEventListener('click', () => {
        btnMerged.classList.add('active');
        if (btnScattered) btnScattered.classList.remove('active');
        this.animateMergeTo(1.0);
      });
    }

    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        this.replayMergeAnimation();
      });
    }

    if (mergeSlider) {
      mergeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        this.mergeProgress = val;
        this.targetMergeProgress = val;
        this.isAnimatingMerge = false;
        this.updateSliderUI(val);
      });
    }

    // 14. Drawer Close Button
    const drawerCloseBtn = document.getElementById('closeClusterDrawer');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => {
        this.closeClusterDetails();
      });
    }

    // Resize handler
    window.addEventListener('resize', () => {
      this.setupCanvasDimensions();
    });
  }

  zoomRelative(factor) {
    const cx = this.baseWidth / 2;
    const cy = this.baseHeight / 2;
    const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * factor));
    this.panX = cx - (cx - this.panX) * (newScale / this.scale);
    this.panY = cy - (cy - this.panY) * (newScale / this.scale);
    this.scale = newScale;
    this.updateZoomBadge();
  }

  resetView() {
    this.scale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.updateZoomBadge();
  }

  updateZoomBadge() {
    const badge = document.getElementById('mapZoomLevelBadge');
    if (badge) {
      badge.textContent = `${Math.round(this.scale * 100)}%`;
    }
  }

  setLocationFilter(zoneId) {
    this.activeLocationFilter = zoneId;
    
    // If specific zone selected, smoothly frame and focus it & open cluster details
    if (zoneId !== 'all') {
      const zone = FACILITY_MAP_ZONES.find(z => z.id === zoneId);
      if (zone) {
        this.focusOnZone(zone);
        this.revealClusterDetails(zone);
      }
    } else {
      this.resetView();
    }
    
    this.updateStatsBar();
  }

  focusOnZone(zone) {
    const cx = this.baseWidth / 2;
    const cy = this.baseHeight / 2;
    const targetScale = 1.45;
    this.scale = targetScale;
    this.panX = cx - zone.centroid.x * targetScale;
    this.panY = cy - zone.centroid.y * targetScale;
    this.updateZoomBadge();
  }

  setTimeFilter(horizon) {
    this.activeTimeFilter = horizon;
    
    // Set concrete date ranges for horizon
    const today = '2026-09-24';
    if (horizon === '24h') {
      this.dateRange.start = '2026-09-23';
      this.dateRange.end = today;
    } else if (horizon === '7d') {
      this.dateRange.start = '2026-09-17';
      this.dateRange.end = today;
    } else if (horizon === '14d') {
      this.dateRange.start = '2026-09-10';
      this.dateRange.end = today;
    } else {
      this.dateRange.start = '2026-08-25';
      this.dateRange.end = today;
    }

    const dateStartInput = document.getElementById('mapDateStart');
    const dateEndInput = document.getElementById('mapDateEnd');
    if (dateStartInput) dateStartInput.value = this.dateRange.start;
    if (dateEndInput) dateEndInput.value = this.dateRange.end;

    this.updateStatsBar();
    this.animateMergeTo(this.mergeProgress > 0.5 ? 1.0 : 0.0);
  }

  animateMergeTo(targetVal) {
    this.startMergeValue = this.mergeProgress;
    this.targetMergeProgress = targetVal;
    this.mergeAnimationStartTime = performance.now();
    this.isAnimatingMerge = true;

    const btnScattered = document.getElementById('mapModeScattered');
    const btnMerged = document.getElementById('mapModeMerged');
    if (targetVal < 0.5) {
      if (btnScattered) btnScattered.classList.add('active');
      if (btnMerged) btnMerged.classList.remove('active');
    } else {
      if (btnMerged) btnMerged.classList.add('active');
      if (btnScattered) btnScattered.classList.remove('active');
    }
  }

  replayMergeAnimation() {
    this.mergeProgress = 0.0;
    this.startMergeValue = 0.0;
    this.targetMergeProgress = 1.0;
    this.mergeAnimationStartTime = performance.now();
    this.isAnimatingMerge = true;

    const btnScattered = document.getElementById('mapModeScattered');
    const btnMerged = document.getElementById('mapModeMerged');
    if (btnMerged) btnMerged.classList.add('active');
    if (btnScattered) btnScattered.classList.remove('active');
  }

  updateSliderUI(val) {
    const slider = document.getElementById('mapMergeSlider');
    const label = document.getElementById('mapMergeSliderLabel');
    if (slider) slider.value = Math.round(val * 100);
    if (label) {
      if (val < 0.2) label.textContent = 'Individual Nodes (Scattered)';
      else if (val > 0.8) label.textContent = 'Synthesized Risk Clusters (Merged)';
      else label.textContent = `Merging Clusters (${Math.round(val * 100)}%)`;
    }
  }

  // Filter Match Checker
  isSignalMatch(sig) {
    // 1. Location filter
    if (this.activeLocationFilter !== 'all' && sig.zoneId !== this.activeLocationFilter) {
      return false;
    }

    // 2. Date filter
    const sigDate = sig.date || '2026-09-20';
    if (sigDate < this.dateRange.start || sigDate > this.dateRange.end) {
      return false;
    }

    // 3. Modality / Signal Type filter
    if (!this.activeSignalTypes.has(sig.type)) {
      return false;
    }

    // 4. Severity filter
    if (this.activeSeverityFilter !== 'all' && sig.severity !== this.activeSeverityFilter) {
      return false;
    }

    // 5. Emerging Risk Issue filter
    if (this.activeRiskIssueFilter !== 'all') {
      if (!sig.riskLink.toLowerCase().includes(this.activeRiskIssueFilter.toLowerCase())) {
        return false;
      }
    }

    // 6. Search query
    if (this.searchQuery) {
      const q = this.searchQuery;
      const haystack = `${sig.title} ${sig.asset} ${sig.zoneName} ${sig.bayName} ${sig.note} ${sig.riskLink} ${sig.id}`.toLowerCase();
      if (!haystack.includes(q)) {
        return false;
      }
    }

    return true;
  }

  // Hover detection using World Coordinates
  checkHoverInteractions() {
    const wx = this.mouseWorldPos.x;
    const wy = this.mouseWorldPos.y;

    this.hoveredSignal = null;
    this.hoveredCluster = null;
    this.hoveredZone = null;

    // 1. Check clusters first if merged
    if (this.mergeProgress > 0.6) {
      for (const zone of FACILITY_MAP_ZONES) {
        if (this.activeLocationFilter !== 'all' && this.activeLocationFilter !== zone.id) continue;
        const dx = wx - zone.centroid.x;
        const dy = wy - zone.centroid.y;
        if (Math.sqrt(dx * dx + dy * dy) < 34) {
          this.hoveredCluster = zone;
          this.showClusterTooltip(zone);
          return;
        }
      }
    }

    // 2. Check individual signal nodes
    for (const p of this.particles) {
      if (!this.isSignalMatch(p)) continue;
      const dx = wx - p.currentX;
      const dy = wy - p.currentY;
      const hitRadius = this.mergeProgress > 0.7 ? 11 : 13;
      if (Math.sqrt(dx * dx + dy * dy) < hitRadius) {
        this.hoveredSignal = p;
        this.showSignalTooltip(p);
        return;
      }
    }

    // 3. Check zone cards
    for (const zone of FACILITY_MAP_ZONES) {
      const b = zone.bounds;
      if (wx >= b.x && wx <= b.x + b.width && wy >= b.y && wy <= b.y + b.height) {
        this.hoveredZone = zone;
        break;
      }
    }

    this.hideTooltip();
  }

  showSignalTooltip(sig) {
    const tooltip = document.getElementById('mapTooltip');
    if (!tooltip) return;

    let badgeClass = 'badge-severity-low';
    if (sig.severity === 'critical') badgeClass = 'badge-severity-critical';
    else if (sig.severity === 'high') badgeClass = 'badge-severity-high';
    else if (sig.severity === 'moderate') badgeClass = 'badge-severity-moderate';

    tooltip.innerHTML = `
      <div class="map-tooltip-header">
        <span class="tooltip-type-tag" style="background:${sig.color}22; color:${sig.color}; border:1px solid ${sig.color}44;">
          ${sig.type}
        </span>
        <span class="tooltip-id-tag">${sig.id}</span>
        <span class="risk-severity-pill ${badgeClass}" style="margin-left:auto; font-size:0.65rem;">
          ${sig.severity.toUpperCase()}
        </span>
      </div>
      <div class="tooltip-title">${sig.title}</div>
      <div class="tooltip-location-row">
        <span>📍 ${sig.zoneName}</span>
      </div>
      <div class="tooltip-asset-row">
        <strong>Asset:</strong> ${sig.asset}
      </div>
      <div class="tooltip-trend-row">
        <span style="color:var(--accent-risk); font-weight:700;">↗ ${sig.trend}</span>
        <span class="tooltip-time-text">• ${sig.dateFormatted || sig.timeAgo}</span>
      </div>
      <div class="tooltip-risk-link">
        <span style="font-size:0.68rem; color:var(--ink-muted); text-transform:uppercase;">Connected Risk:</span>
        <div style="font-weight:700; color:var(--ink-primary);">${sig.riskLink}</div>
      </div>
      <p class="tooltip-note">${sig.note}</p>
      <div class="tooltip-click-hint">Click node to inspect forensic record</div>
    `;

    this.positionTooltip();
  }

  showClusterTooltip(zone) {
    const tooltip = document.getElementById('mapTooltip');
    if (!tooltip) return;

    const matchingSignals = this.particles.filter(p => p.zoneId === zone.id && this.isSignalMatch(p));
    
    tooltip.innerHTML = `
      <div class="map-tooltip-header">
        <span class="tooltip-cluster-badge" style="background:${zone.themeColor}18; color:${zone.themeColor}; border:1px solid ${zone.themeColor}55;">
          ${zone.shortCode} CLUSTER
        </span>
        <span class="risk-severity-pill badge-severity-high" style="margin-left:auto; font-size:0.65rem;">
          ${zone.riskBadge}
        </span>
      </div>
      <div class="tooltip-title" style="font-size:1.05rem;">${zone.primaryRiskTitle}</div>
      <div class="tooltip-location-row">
        <span>🏢 ${zone.name}</span>
      </div>
      <div class="tooltip-signals-tally">
        <div class="tally-big-number">${matchingSignals.length}</div>
        <div>
          <div style="font-weight:700; color:var(--ink-primary);">Related Precursor Signals</div>
          <div style="font-size:0.75rem; color:var(--ink-secondary);">${zone.trend}</div>
        </div>
      </div>
      <div class="tooltip-cluster-meta">
        <div><strong>Status:</strong> ${zone.primaryRiskSummary.split('•').pop().trim()}</div>
        <div><strong>Confidence:</strong> <span style="color:var(--accent-risk); font-weight:700;">${zone.confidence}</span></div>
      </div>
      <div class="tooltip-click-hint">Click cluster to reveal Location, Signals, Issue, Confidence & Trend</div>
    `;

    this.positionTooltip();
  }

  positionTooltip() {
    const tooltip = document.getElementById('mapTooltip');
    if (!tooltip) return;

    tooltip.style.display = 'block';
    const tooltipWidth = 330;
    const tooltipHeight = tooltip.offsetHeight || 220;

    let left = this.mouseScreenPos.x + 16;
    let top = this.mouseScreenPos.y + 16;

    if (left + tooltipWidth > window.innerWidth - 20) {
      left = this.mouseScreenPos.x - tooltipWidth - 16;
    }
    if (top + tooltipHeight > window.innerHeight - 20) {
      top = this.mouseScreenPos.y - tooltipHeight - 16;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  hideTooltip() {
    const tooltip = document.getElementById('mapTooltip');
    if (tooltip) tooltip.style.display = 'none';
  }

  /**
   * STAGE 6 CORE REQUIREMENT:
   * Clicking a cluster should reveal:
   * 1. Location
   * 2. Related Signals
   * 3. Emerging Issue
   * 4. Confidence
   * 5. Trend
   */
  revealClusterDetails(zone) {
    this.selectedCluster = zone;
    const drawer = document.getElementById('clusterDetailsDrawer');
    if (!drawer) {
      // Fallback to modal inspector if drawer element absent
      if (window.dashboardController && typeof window.dashboardController.inspectMapZone === 'function') {
        window.dashboardController.inspectMapZone(zone.id);
      }
      return;
    }

    const matchingSignals = this.particles.filter(p => p.zoneId === zone.id && this.isSignalMatch(p));
    
    // Group signals by modality for summary chips
    const sensorCount = matchingSignals.filter(s => s.type === 'Sensor').length;
    const maintCount = matchingSignals.filter(s => s.type === 'Maintenance').length;
    const compCount = matchingSignals.filter(s => s.type === 'Complaint').length;
    const imgCount = matchingSignals.filter(s => s.type === 'Image').length;
    const histCount = matchingSignals.filter(s => s.type === 'Historical').length;
    const incCount = matchingSignals.filter(s => s.type === 'Incident').length;

    // Render Drawer Content
    drawer.innerHTML = `
      <div class="drawer-header-bar">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="indicator-dot ${zone.severity === 'Critical' ? 'dot-vermilion' : (zone.severity === 'High' ? 'dot-amber' : 'dot-slate')}"></span>
          <span class="drawer-header-tag">${zone.shortCode} GEOSPATIAL CLUSTER</span>
        </div>
        <button class="drawer-close-btn" id="closeClusterDrawer" title="Close Cluster Inspector">&times;</button>
      </div>

      <div class="drawer-scroll-body">
        
        <!-- 1. LOCATION -->
        <div class="drawer-info-section">
          <div class="drawer-section-label">1. Location & Spatial Topology</div>
          <h3 class="drawer-location-title">${zone.name}</h3>
          <p class="drawer-location-sub">${zone.description}</p>
          
          <div class="drawer-bays-grid">
            ${zone.bays.map(b => `
              <div class="drawer-bay-chip">
                <span class="bay-chip-name">${b.name}</span>
                <span class="bay-chip-asset">${b.asset}</span>
              </div>
            `).join('')}
          </div>
          <div class="drawer-coord-note">Complex UTM Grid: 44.912°N 93.341°W • Bay Elevation +12.4m</div>
        </div>

        <!-- 2. EMERGING ISSUE -->
        <div class="drawer-info-section" style="border-left: 3px solid var(--accent-risk); padding-left:14px;">
          <div class="drawer-section-label" style="color:var(--accent-risk);">2. Emerging Issue & Failure Mode</div>
          <h4 class="drawer-issue-title">${zone.primaryRiskTitle}</h4>
          <div class="drawer-badge-row">
            <span class="risk-severity-pill ${zone.severity === 'Critical' ? 'badge-severity-critical' : 'badge-severity-high'}">${zone.severity} Severity</span>
            <span class="drawer-pill-subsystem">${zone.subsystem || 'Critical Subsystem'}</span>
            <span class="drawer-pill-lead">${zone.leadTime || '14 Days Lead'}</span>
          </div>
          <p class="drawer-failure-text"><strong>Failure Prognosis:</strong> ${zone.failureMode || zone.primaryRiskSummary}</p>
          <p class="drawer-rootcause-text"><strong>Root Cause Hypotheses:</strong> ${zone.rootCause || 'Cross-silo mechanical vibration resonance coupled with auxiliary line degradation.'}</p>
        </div>

        <!-- 3. CONFIDENCE & 4. TREND (Side-by-side KPI Cards) -->
        <div class="drawer-info-section">
          <div class="drawer-kpi-row">
            
            <!-- 3. CONFIDENCE -->
            <div class="drawer-kpi-card">
              <div class="drawer-section-label">3. Confidence Rating</div>
              <div class="kpi-value-huge text-vermilion">${zone.confidence}</div>
              <div class="kpi-sub-text">MTGNN Causal Correlation</div>
              <div class="kpi-badge-fine">P(False Positive) &lt; 1.8%</div>
            </div>

            <!-- 4. TREND -->
            <div class="drawer-kpi-card">
              <div class="drawer-section-label">4. Signal Trend Velocity</div>
              <div class="kpi-value-huge text-amber">↗ ${zone.trend.split('(')[0]}</div>
              <div class="kpi-sub-text">${zone.trend.includes('(') ? zone.trend.split('(')[1].replace(')', '') : 'Accelerating'}</div>
              <div class="kpi-badge-fine">Active Trajectory</div>
            </div>

          </div>

          <!-- Animated SVG Sparkline for Trend -->
          <div class="drawer-sparkline-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-size:0.7rem; font-family:var(--font-mono); color:var(--ink-muted); text-transform:uppercase;">30-Day Multi-Modal Signal Velocity</span>
              <span style="font-size:0.7rem; font-family:var(--font-mono); color:var(--accent-risk); font-weight:700;">Rate of Growth</span>
            </div>
            <svg class="sparkline-svg" viewBox="0 0 160 48" preserveAspectRatio="none">
              <defs>
                <linearGradient id="drawerGrad-${zone.id}" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="${zone.themeColor}" stop-opacity="0.32"/>
                  <stop offset="100%" stop-color="${zone.themeColor}" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="${zone.sparklineFill || 'M 0,38 Q 25,35 50,29 T 100,18 T 150,6 L 150,48 L 0,48 Z'}" fill="url(#drawerGrad-${zone.id})"/>
              <path class="sparkline-path" d="${zone.sparklineD || 'M 0,38 Q 25,35 50,29 T 100,18 T 150,6'}" fill="none" stroke="${zone.themeColor}" stroke-width="2.4" stroke-linecap="round"/>
              <circle class="sparkline-pulse-dot" cx="150" cy="6" r="4" fill="${zone.themeColor}"/>
            </svg>
          </div>
        </div>

        <!-- 5. RELATED SIGNALS -->
        <div class="drawer-info-section">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <div class="drawer-section-label">5. Related Contributing Signals (${matchingSignals.length})</div>
            <span class="tab-count-pill" style="color:var(--accent-risk);">${matchingSignals.length} Active</span>
          </div>

          <div class="drawer-modality-counts-bar">
            ${sensorCount > 0 ? `<span class="mod-pill">⚡ ${sensorCount} Sensors</span>` : ''}
            ${maintCount > 0 ? `<span class="mod-pill">🔧 ${maintCount} Maintenance</span>` : ''}
            ${compCount > 0 ? `<span class="mod-pill">📋 ${compCount} Complaints</span>` : ''}
            ${imgCount > 0 ? `<span class="mod-pill">📷 ${imgCount} FLIR</span>` : ''}
            ${histCount > 0 ? `<span class="mod-pill">📊 ${histCount} Historian</span>` : ''}
            ${incCount > 0 ? `<span class="mod-pill">⚠️ ${incCount} Incident</span>` : ''}
          </div>

          <!-- Scrollable Signal Cards List -->
          <div class="drawer-signals-list">
            ${matchingSignals.map(sig => `
              <div class="drawer-signal-item" onclick="if(window.dashboardController){window.dashboardController.inspectMapSignal('${sig.id}')}">
                <div class="drawer-signal-item-top">
                  <span class="tooltip-type-tag" style="background:${sig.color}22; color:${sig.color}; border:1px solid ${sig.color}44;">${sig.type}</span>
                  <span class="drawer-sig-id">${sig.id}</span>
                  <span class="drawer-sig-time">${sig.dateFormatted || sig.timeAgo}</span>
                </div>
                <div class="drawer-sig-title">${sig.title}</div>
                <div class="drawer-sig-asset">📍 ${sig.bayName} • <strong>${sig.asset}</strong></div>
                <p class="drawer-sig-note">${sig.note}</p>
                <div class="drawer-sig-meta-row">
                  <span style="color:var(--accent-risk); font-weight:700;">↗ ${sig.trend}</span>
                  <span>Confidence: <strong>${sig.confidence}</strong></span>
                </div>
              </div>
            `).join('')}
          </div>

        </div>

        <!-- Action Buttons -->
        <div class="drawer-actions-row">
          <button class="drawer-btn-primary" onclick="alert('Prescriptive Work Order dispatched for ${zone.shortCode}: WO-2026-${Math.floor(1000 + Math.random() * 9000)}')">
            Dispatch Work Order
          </button>
          <button class="drawer-btn-secondary" onclick="if(window.dashboardController){window.dashboardController.inspectMapZone('${zone.id}')}">
            Open Full Dossier
          </button>
        </div>

      </div>
    `;

    drawer.classList.add('active');

    // Re-bind close button
    const closeBtn = document.getElementById('closeClusterDrawer');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeClusterDetails());
    }

    // Auto-focus zone smoothly on canvas
    this.focusOnZone(zone);
  }

  closeClusterDetails() {
    const drawer = document.getElementById('clusterDetailsDrawer');
    if (drawer) {
      drawer.classList.remove('active');
    }
    this.selectedCluster = null;
  }

  updateStatsBar() {
    const matching = this.particles.filter(p => this.isSignalMatch(p));
    
    const countEl = document.getElementById('mapActiveSignalsCount');
    if (countEl) {
      countEl.textContent = `${matching.length} Signals`;
    }

    const searchCountBadge = document.getElementById('mapSearchMatchesBadge');
    if (searchCountBadge) {
      if (this.searchQuery) {
        searchCountBadge.style.display = 'inline-flex';
        searchCountBadge.textContent = `${matching.length} matches`;
      } else {
        searchCountBadge.style.display = 'none';
      }
    }

    const horizonLabel = document.getElementById('mapCurrentHorizonLabel');
    if (horizonLabel) {
      if (this.activeTimeFilter === 'custom') {
        horizonLabel.textContent = `${this.dateRange.start} → ${this.dateRange.end}`;
      } else {
        const labels = {
          '24h': 'Last 24 Hours',
          '7d': 'Last 7 Days',
          '14d': 'Last 14 Days',
          '30d': 'Last 30 Days'
        };
        horizonLabel.textContent = labels[this.activeTimeFilter] || '30 Days';
      }
    }

    const hotspotEl = document.getElementById('mapHotspotLabel');
    if (hotspotEl) {
      if (this.activeLocationFilter === 'all') {
        hotspotEl.textContent = 'Block A (17 Precursors • 87% Confidence)';
      } else {
        const zone = FACILITY_MAP_ZONES.find(z => z.id === this.activeLocationFilter);
        hotspotEl.textContent = zone ? `${zone.shortCode} (${matching.length} Active Signals)` : 'Selected Zone';
      }
    }
  }

  // Physics Loop
  startRenderLoop() {
    const render = (time) => {
      this.updatePhysics(time);
      this.drawCanvas(time);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  updatePhysics(time) {
    if (this.isAnimatingMerge) {
      const elapsed = time - this.mergeAnimationStartTime;
      const progress = Math.min(1.0, elapsed / this.mergeAnimationDuration);
      
      const eased = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.mergeProgress = this.startMergeValue + (this.targetMergeProgress - this.startMergeValue) * eased;
      this.updateSliderUI(this.mergeProgress);

      if (progress >= 1.0) {
        this.mergeProgress = this.targetMergeProgress;
        this.isAnimatingMerge = false;
        this.rippleTime = time;
      }
    }

    const t = this.mergeProgress;
    for (const p of this.particles) {
      const floatX = Math.sin(time * 0.002 + p.floatSeed) * (1.2 * (1 - t * 0.8));
      const floatY = Math.cos(time * 0.0025 + p.floatSeed) * (1.2 * (1 - t * 0.8));

      p.currentX = p.scatteredX + (p.mergedX - p.scatteredX) * t + floatX;
      p.currentY = p.scatteredY + (p.mergedY - p.scatteredY) * t + floatY;

      if (t > 0.85) {
        p.currentRadius = 5.5 * (1 - (t - 0.85) / 0.15 * 0.7);
        p.opacity = 1 - (t - 0.85) / 0.15 * 0.65;
      } else {
        p.currentRadius = 5.5;
        p.opacity = 1.0;
      }
    }
  }

  drawCanvas(time) {
    const ctx = this.ctx;
    const w = this.baseWidth;
    const h = this.baseHeight;

    ctx.clearRect(0, 0, w, h);

    // Apply Viewport Pan & Zoom Transform
    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.scale, this.scale);

    // 1. Architectural Floorplan Grid
    this.drawFloorplanGrid(ctx, w, h);

    // 2. Inter-Bay Conduits
    this.drawConduitNetwork(ctx);

    // 3. Facility Zones & Bays
    this.drawFacilityZones(ctx, time);

    // 4. Merge Vector Trajectories
    if (this.mergeProgress > 0.05 && this.mergeProgress < 0.95) {
      this.drawMergeTrajectories(ctx);
    }

    // 5. Individual Signal Nodes
    this.drawSignalParticles(ctx, time);

    // 6. Cluster Badges & Risk Beacons
    this.drawClusterBadges(ctx, time);

    ctx.restore();
  }

  drawFloorplanGrid(ctx, w, h) {
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(218, 214, 206, 0.45)';
    ctx.lineWidth = 0.8;

    const gridSize = 40;
    ctx.beginPath();
    for (let x = 20; x < w; x += gridSize) {
      ctx.moveTo(x, 10);
      ctx.lineTo(x, h - 10);
    }
    for (let y = 20; y < h; y += gridSize) {
      ctx.moveTo(10, y);
      ctx.lineTo(w - 10, y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#E2DDD4';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(15, 15, w - 30, h - 30);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('FACILITY SCHEMATIC // COMPLEX QUAD-A THROUGH F // UTM 44.912°N 93.341°W', 30, 30);
    ctx.fillText('PAN & ZOOM ACTIVE • REAL-TIME OPERATIONAL SENSING TOPOLOGY', w - 440, 30);
  }

  drawConduitNetwork(ctx) {
    ctx.save();
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);

    // Water Supply Line: Block B -> Block A
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
    ctx.beginPath();
    ctx.moveTo(575, 155);
    ctx.lineTo(370, 155);
    ctx.lineTo(370, 105);
    ctx.lineTo(205, 105);
    ctx.stroke();

    // Hydraulic Line: Block B -> Block C
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.30)';
    ctx.beginPath();
    ctx.moveTo(575, 155);
    ctx.lineTo(780, 155);
    ctx.lineTo(945, 155);
    ctx.stroke();

    // HV Bus Duct: Power Island -> Block A & C
    ctx.strokeStyle = 'rgba(217, 78, 52, 0.28)';
    ctx.beginPath();
    ctx.moveTo(205, 425);
    ctx.lineTo(205, 270);
    ctx.moveTo(205, 425);
    ctx.lineTo(575, 425);
    ctx.lineTo(945, 425);
    ctx.stroke();

    ctx.restore();
  }

  drawFacilityZones(ctx, time) {
    for (const zone of FACILITY_MAP_ZONES) {
      const b = zone.bounds;
      const isSelected = this.activeLocationFilter === 'all' || this.activeLocationFilter === zone.id;
      const isHovered = this.hoveredZone === zone;
      const isDrawerSelected = this.selectedCluster === zone;

      ctx.save();
      ctx.globalAlpha = isSelected ? 1.0 : 0.25;

      ctx.fillStyle = (isHovered || isDrawerSelected) ? '#FFFFFF' : '#FDFCFA';
      ctx.strokeStyle = (isDrawerSelected || (isSelected && this.activeLocationFilter === zone.id))
        ? zone.themeColor 
        : (isHovered ? '#CBD5E1' : '#E2DDD4');
      ctx.lineWidth = (isDrawerSelected || (isSelected && this.activeLocationFilter === zone.id)) ? 2.5 : 1;

      this.drawRoundedRect(ctx, b.x, b.y, b.width, b.height, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = (isSelected && this.activeLocationFilter === zone.id) ? zone.lightColor : 'rgba(241, 238, 233, 0.6)';
      this.drawRoundedRect(ctx, b.x, b.y, b.width, 28, { tl: 8, tr: 8, bl: 0, br: 0 });
      ctx.fill();

      ctx.fillStyle = zone.themeColor;
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.fillText(zone.shortCode, b.x + 12, b.y + 18);

      const codeW = ctx.measureText(zone.shortCode).width;
      ctx.fillStyle = '#64748B';
      ctx.font = '500 10px "Inter", -apple-system, sans-serif';
      ctx.fillText(`• ${zone.category}`, b.x + 12 + codeW + 8, b.y + 18);

      // Bay sub-rectangles
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.6)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 3]);

      for (const bay of zone.bays) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        this.drawRoundedRect(ctx, bay.x, bay.y, bay.w, bay.h, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.6)';
        ctx.stroke();

        // Determine if bay is on the right half or bottom half to position text safely away from center centroid
        const isRightSide = (bay.x + bay.w / 2) > zone.centroid.x;
        const isBottomSide = (bay.y + bay.h / 2) > zone.centroid.y;

        ctx.save();
        ctx.font = '600 10px "Inter", -apple-system, sans-serif';
        ctx.fillStyle = '#334155';

        if (isRightSide) {
          ctx.textAlign = 'right';
          const textX = bay.x + bay.w - 8;
          const textY = isBottomSide ? (bay.y + bay.h - 22) : (bay.y + 16);
          ctx.fillText(bay.name, textX, textY);

          ctx.font = '500 9px "Inter", -apple-system, sans-serif';
          ctx.fillStyle = '#64748B';
          ctx.fillText(bay.asset, textX, textY + 12);
        } else {
          ctx.textAlign = 'left';
          const textX = bay.x + 8;
          const textY = isBottomSide ? (bay.y + bay.h - 22) : (bay.y + 16);
          ctx.fillText(bay.name, textX, textY);

          ctx.font = '500 9px "Inter", -apple-system, sans-serif';
          ctx.fillStyle = '#64748B';
          ctx.fillText(bay.asset, textX, textY + 12);
        }
        ctx.restore();
      }

      ctx.restore();
    }
  }

  drawMergeTrajectories(ctx) {
    const t = this.mergeProgress;
    ctx.save();
    ctx.lineWidth = 1.0;

    for (const p of this.particles) {
      if (!this.isSignalMatch(p)) continue;
      
      const grad = ctx.createLinearGradient(p.scatteredX, p.scatteredY, p.mergedX, p.mergedY);
      grad.addColorStop(0, 'rgba(203, 213, 225, 0.05)');
      grad.addColorStop(1, `${p.color}55`);

      ctx.strokeStyle = grad;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(p.scatteredX, p.scatteredY);
      ctx.lineTo(p.currentX, p.currentY);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawSignalParticles(ctx, time) {
    for (const p of this.particles) {
      const isMatch = this.isSignalMatch(p);
      const isHovered = this.hoveredSignal === p;
      const isSelectedZone = this.activeLocationFilter === 'all' || this.activeLocationFilter === p.zoneId;

      ctx.save();
      // If not matching filter or search query, render heavily dimmed
      ctx.globalAlpha = isMatch ? (p.opacity * (isSelectedZone ? 1.0 : 0.2)) : 0.08;

      if (isMatch && (p.severity === 'critical' || p.severity === 'high')) {
        const pulseR = p.currentRadius + 3 + Math.sin(time * 0.004 + p.floatSeed) * 2;
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = p.severity === 'critical' ? 'rgba(217, 78, 52, 0.18)' : 'rgba(234, 88, 12, 0.14)';
        ctx.fill();
      }

      if (isHovered) {
        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.currentRadius + 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217, 78, 52, 0.25)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.currentX, p.currentY, isHovered ? p.currentRadius + 2 : p.currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      if (isHovered && this.mergeProgress < 0.4) {
        ctx.fillStyle = '#1E293B';
        ctx.font = '700 9px "Inter", sans-serif';
        ctx.fillText(p.title, p.currentX + 9, p.currentY - 4);
      }

      ctx.restore();
    }
  }

  drawClusterBadges(ctx, time) {
    const t = this.mergeProgress;

    for (const zone of FACILITY_MAP_ZONES) {
      const isSelected = this.activeLocationFilter === 'all' || this.activeLocationFilter === zone.id;
      const isHovered = this.hoveredCluster === zone;
      const isDrawerSelected = this.selectedCluster === zone;

      const matchingZoneSignals = this.particles.filter(p => p.zoneId === zone.id && this.isSignalMatch(p));
      const count = matchingZoneSignals.length;
      if (count === 0 && !isSelected) continue;

      const cx = zone.centroid.x;
      const cy = zone.centroid.y;

      ctx.save();
      ctx.globalAlpha = isSelected ? 1.0 : 0.25;

      const scale = 0.5 + t * 0.5;
      const baseR = 26 * scale;

      // 1. Concentric Radial Shockwave Pulse
      if (t > 0.4 && count > 0) {
        const pulsePhase = ((time * 0.0018) + (zone.centroid.x * 0.01)) % 1;
        const rippleR = baseR + pulsePhase * 24;
        const rippleAlpha = (1 - pulsePhase) * 0.35 * t;

        ctx.beginPath();
        ctx.arc(cx, cy, rippleR, 0, Math.PI * 2);
        ctx.strokeStyle = zone.themeColor;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = rippleAlpha * (isSelected ? 1.0 : 0.25);
        ctx.stroke();

        ctx.globalAlpha = isSelected ? 1.0 : 0.25;
      }

      // 2. Cluster Outer Shadow & Ring
      ctx.beginPath();
      ctx.arc(cx, cy, baseR + 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      ctx.fill();
      ctx.strokeStyle = (isHovered || isDrawerSelected) ? zone.themeColor : '#CBD5E1';
      ctx.lineWidth = (isHovered || isDrawerSelected) ? 2.8 : 1.5;
      ctx.stroke();

      // 3. Cluster Center Disc Fill
      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.fillStyle = count > 0 ? zone.themeColor : '#94A3B8';
      ctx.fill();

      // 4. Cluster Numeric Count & Micro-Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `800 ${Math.round(14 * scale)}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${count}`, cx, cy - 3 * scale);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.font = `700 ${Math.round(7 * scale)}px "JetBrains Mono", monospace`;
      ctx.fillText(`SIGNALS`, cx, cy + 7 * scale);

      // 5. Severity Tag Pill above cluster
      if (t > 0.35) {
        this.drawClusterSeverityTag(ctx, zone, cx, cy - baseR - 12, isHovered || isDrawerSelected);
      }

      // 6. Mini Modality Dots below count
      if (t > 0.6 && count > 0) {
        this.drawClusterSubDots(ctx, zone, cx, cy + baseR + 8, matchingZoneSignals);
      }

      // 7. Emerging Risk Pin Beacon below modality dots
      if (t > 0.45) {
        this.drawRiskEpicenterPin(ctx, zone, cx, cy + baseR + 24, t, isHovered || isDrawerSelected);
      }

      ctx.restore();
    }
  }

  drawClusterSeverityTag(ctx, zone, x, y, isHovered) {
    ctx.save();
    const tagText = `${zone.severity.toUpperCase()} • ${zone.confidence}`;
    ctx.font = '700 8px "JetBrains Mono", monospace';
    const tagW = ctx.measureText(tagText).width + 14;
    const tagH = 16;
    const bx = x - tagW / 2;
    const by = y - tagH / 2;

    ctx.fillStyle = isHovered ? zone.themeColor : '#FFFFFF';
    ctx.strokeStyle = zone.themeColor;
    ctx.lineWidth = 1.2;
    this.drawRoundedRect(ctx, bx, by, tagW, tagH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isHovered ? '#FFFFFF' : zone.themeColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tagText, x, by + tagH / 2);
    ctx.restore();
  }

  drawRiskEpicenterPin(ctx, zone, x, y, t, isHovered) {
    if (t < 0.25) return;

    ctx.save();
    ctx.font = '600 8.5px "Inter", -apple-system, sans-serif';

    const maxChars = 28;
    const displayTitle = zone.primaryRiskTitle.length > maxChars 
      ? zone.primaryRiskTitle.slice(0, maxChars - 1) + '…' 
      : zone.primaryRiskTitle;

    const textWidth = ctx.measureText(displayTitle).width;
    const beaconW = textWidth + 24;
    const beaconH = 19;
    const bx = x - beaconW / 2;
    const by = y - beaconH / 2;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = isHovered ? zone.themeColor : 'rgba(203, 213, 225, 0.9)';
    ctx.lineWidth = isHovered ? 1.8 : 1.0;
    this.drawRoundedRect(ctx, bx, by, beaconW, beaconH, 9);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(bx + 8, by + beaconH / 2, 3, 0, Math.PI * 2);
    ctx.fillStyle = zone.themeColor;
    ctx.fill();

    ctx.fillStyle = isHovered ? zone.themeColor : '#1E293B';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayTitle, bx + 15, by + beaconH / 2 + 0.5);

    ctx.restore();
  }

  drawClusterSubDots(ctx, zone, cx, cy, signals) {
    const modalities = [
      { type: 'Sensor', color: '#1B4332' },
      { type: 'Maintenance', color: '#B87333' },
      { type: 'Complaint', color: '#C85A32' },
      { type: 'Image', color: '#5E7E6C' },
      { type: 'Historical', color: '#415A4D' },
      { type: 'Incident', color: '#C85A32' }
    ];

    const present = modalities.filter(m => signals.some(s => s.type === m.type));
    const totalDots = present.length;
    const spacing = 8;
    const startX = cx - ((totalDots - 1) * spacing) / 2;

    for (let i = 0; i < totalDots; i++) {
      ctx.beginPath();
      ctx.arc(startX + i * spacing, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = present[i].color;
      ctx.fill();
    }
  }

  drawRoundedRect(ctx, x, y, width, height, radius) {
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      radius = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, radius);
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
  }
}

// Global initialization
window.EarlySightSignalMap = EarlySightSignalMap;
