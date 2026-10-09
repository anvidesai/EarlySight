/**
 * EarlySight — Animated Event Story Visualizer
 * 
 * Concept:
 * Explains how an operational crisis emerges chronologically:
 * 1. Individual reports enter the stream
 * 2. Repeated signals coalesce into visible groups
 * 3. Risk threshold escalation triggers an Early Warning
 * 4. Preventive action is executed at its real timestamp
 * 5. Telemetry verification confirms resolution
 * 
 * Features:
 * - Interactive time scrubber slider (Day 1 to Day 18)
 * - Auto-play playback with pause/step controls
 * - Live updating SVG graphic highlighting active stage and node arrivals
 * - Milestone hover & click inspection
 * - Accessible and reduced-motion compliant
 */

export class TimelineStoryVisualizer {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!this.container) return;

    this.options = options;
    this.currentDay = 12; // Default to peak emergence stage
    this.isPlaying = false;
    this.playTimer = null;

    // Chronological milestones
    this.stages = [
      {
        day: 2,
        stageNum: 1,
        title: 'Initial Signal Ingress',
        category: 'Scattered Reports',
        score: 28,
        color: '#72C6A5',
        badge: 'LOW BASELINE',
        eventDesc: 'SIG-008: Line Differential drift (-0.42 PSI) and routine operator shift walk note logged.',
        narrative: 'Disparate signals enter from 2 separate modalities. Read as ambient operational background noise.'
      },
      {
        day: 6,
        stageNum: 2,
        title: 'Repeated Signals Coalesce',
        category: 'Cluster Formation',
        score: 54,
        color: '#78C7C7',
        badge: 'MODERATE CORRELATION',
        eventDesc: 'SIG-012: Viton gasket weep noted. 4 signals co-located within 8.5m radius corridor.',
        narrative: 'Signals recur across subsequent shifts without clearing. EarlySight begins spatial clustering.'
      },
      {
        day: 10,
        stageNum: 3,
        title: 'Pattern Lock & Acceleration',
        category: 'Emerging Pattern',
        score: 72,
        color: '#F2A65A',
        badge: 'HIGH CONVERGENCE',
        eventDesc: 'SIG-044: Acoustic cavitation hiss (48 kHz). Coherence crosses 91.4% similarity to 2022 template.',
        narrative: 'Signal arrival interval compresses from 28h down to 3.2h (+34% velocity surge). Pattern locked.'
      },
      {
        day: 14,
        stageNum: 4,
        title: 'Risk Escalation & Warning Trigger',
        category: 'Emerging Risk',
        score: 86,
        color: '#EF7B7B',
        badge: 'CRITICAL EARLY WARNING',
        eventDesc: 'RSK-001 flagged P1 Urgent: $512,000 potential downtime averted with 14.2 days lead time.',
        narrative: 'Cross-silo MTGNN threshold breached. Proactive early warning alert dispatched to site leadership.'
      },
      {
        day: 16,
        stageNum: 5,
        title: 'Preventive Action Dispatched',
        category: 'Field Remediation',
        score: 62,
        color: '#B7A7E8',
        badge: 'ACTION QUEUED',
        eventDesc: 'ACT-001: Work Order #WO-89104 assigned to Facilities Engineering (G. Ramirez) for scheduled turnaround.',
        narrative: 'Pre-emptive Viton gasket replacement executed ahead of scheduled production cycle.'
      },
      {
        day: 18,
        stageNum: 6,
        title: 'Verification & Baseline Restored',
        category: 'Verified Resolution',
        score: 18,
        color: '#72C6A5',
        badge: 'RESOLVED NOMINAL',
        eventDesc: 'Post-remediation hydrophone & pressure telemetry confirm 0.0 PSI delta across 48 continuous hours.',
        narrative: 'Full closed-loop verification achieved. Hazard neutralized with zero unbudgeted production loss.'
      }
    ];

    this.render();
    this.bindEvents();
    this.updateToDay(this.currentDay);
  }

  render() {
    this.container.innerHTML = `
      <div class="es-timeline-story-card es-card" style="margin-bottom: 20px; overflow: hidden; position: relative;">
        <!-- Header Controls Row -->
        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid var(--border-subtle); background:#FCFBF8; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:28px; height:28px; border-radius:6px; background:rgba(239,123,123,0.12); display:flex; align-items:center; justify-content:center; color:#B42318;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <h3 style="margin:0; font-size:0.95rem; font-weight:700; color:var(--ink-primary); display:flex; align-items:center; gap:8px;">
                <span>Animated Problem Storyline</span>
                <span id="storyStageBadge" style="font-size:0.68rem; font-family:var(--font-mono); padding:2px 8px; border-radius:4px; font-weight:700; background:#FEE2E2; color:#B91C1C;">
                  STAGE 4 • CRITICAL EARLY WARNING
                </span>
              </h3>
              <p style="margin:2px 0 0 0; font-size:0.75rem; color:var(--ink-secondary);">
                Drag the time slider or play sequence to watch how isolated signals escalate into a proactive warning and resolution.
              </p>
            </div>
          </div>

          <!-- Play / Pause & Navigation Buttons -->
          <div style="display:flex; align-items:center; gap:8px;">
            <button id="btnStoryPrev" style="padding:5px 10px; font-size:0.74rem; font-weight:600; border:1px solid var(--border-subtle); border-radius:6px; background:#FFF; color:var(--ink-primary); cursor:pointer;">&larr; Prev</button>
            <button id="btnStoryPlay" style="padding:5px 14px; font-size:0.74rem; font-weight:700; border:none; border-radius:6px; background:var(--intel-primary); color:#FFF; cursor:pointer; display:flex; align-items:center; gap:5px;">
              <span id="playIcon">▶</span>
              <span id="playText">Play Evolution</span>
            </button>
            <button id="btnStoryNext" style="padding:5px 10px; font-size:0.74rem; font-weight:600; border:1px solid var(--border-subtle); border-radius:6px; background:#FFF; color:var(--ink-primary); cursor:pointer;">Next &rarr;</button>
          </div>
        </div>

        <!-- Visual Stage: SVG Journey Line + Story Details -->
        <div style="padding:16px 20px 10px 20px; background:#F8FAFC;">
          <!-- Interactive Time Scrubber Slider -->
          <div style="margin-bottom:14px; display:flex; align-items:center; gap:14px;">
            <span style="font-family:var(--font-mono); font-size:0.78rem; font-weight:700; color:var(--ink-primary); min-width:80px;">
              <span id="scrubberDayLabel">Day 14</span> of 18
            </span>
            <input type="range" id="storyTimeSlider" min="1" max="18" value="${this.currentDay}" style="flex:1; accent-color:var(--intel-primary); cursor:pointer; height:6px;">
            <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--ink-muted);">T-0 Active Warning</span>
          </div>

          <!-- SVG Visual Story Arc -->
          <svg id="storySvg" viewBox="0 0 940 180" preserveAspectRatio="xMidYMid meet" style="width:100%; height:160px; display:block;">
            <defs>
              <linearGradient id="storyPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#72C6A5"/>
                <stop offset="30%" stop-color="#78C7C7"/>
                <stop offset="55%" stop-color="#F2A65A"/>
                <stop offset="75%" stop-color="#EF7B7B"/>
                <stop offset="90%" stop-color="#B7A7E8"/>
                <stop offset="100%" stop-color="#72C6A5"/>
              </linearGradient>
            </defs>

            <!-- Guide Baseline -->
            <path d="M 50,120 C 180,120 220,100 340,90 C 460,80 520,35 640,35 C 740,35 780,75 880,120"
              fill="none" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>

            <!-- Active Colored Trajectory -->
            <path id="activeStoryTrack" d="M 50,120 C 180,120 220,100 340,90 C 460,80 520,35 640,35 C 740,35 780,75 880,120"
              fill="none" stroke="url(#storyPathGrad)" stroke-width="4" stroke-linecap="round"
              stroke-dasharray="900" stroke-dashoffset="300" style="transition: stroke-dashoffset 0.4s ease;"/>

            <!-- Milestone Pinned Steps -->
            ${this.renderStoryMilestones()}

            <!-- Current Scrubber Focus Head -->
            <g id="storyPlayhead" transform="translate(640, 35)" style="transition: transform 0.4s ease;">
              <circle cx="0" cy="0" r="14" fill="none" stroke="#EF7B7B" stroke-width="1.5" class="const-pulse-ring"/>
              <circle cx="0" cy="0" r="7" fill="#EF7B7B" stroke="#FFFFFF" stroke-width="2"/>
            </g>
          </svg>

          <!-- Dynamic Milestone Description Banner -->
          <div id="storyEventBanner" style="background:#FFFFFF; border:1px solid var(--border-subtle); border-radius:8px; padding:12px 16px; margin-top:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div style="flex:1; min-width:280px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <span id="bannerStagePill" style="font-family:var(--font-mono); font-size:0.7rem; font-weight:700; color:#B42318; background:#FEE2E2; padding:1px 6px; border-radius:3px;">STAGE 4</span>
                <strong id="bannerTitle" style="color:var(--ink-primary); font-size:0.88rem;">Risk Escalation & Warning Trigger</strong>
              </div>
              <div id="bannerDesc" style="font-size:0.78rem; color:var(--ink-secondary); line-height:1.4;">
                RSK-001 flagged P1 Urgent: $512,000 potential downtime averted with 14.2 days lead time.
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:16px;">
              <div style="text-align:right;">
                <span style="font-size:0.68rem; font-family:var(--font-mono); color:var(--ink-muted); text-transform:uppercase; display:block;">Risk Velocity Score</span>
                <span id="bannerScore" style="font-family:var(--font-mono); font-size:1.25rem; font-weight:800; color:#EF7B7B;">86/100</span>
              </div>
              <div style="border-left:1px solid var(--border-subtle); padding-left:12px;">
                <span style="font-size:0.68rem; font-family:var(--font-mono); color:var(--ink-muted); text-transform:uppercase; display:block;">Action Lead Time</span>
                <span id="bannerLeadTime" style="font-family:var(--font-mono); font-size:0.85rem; font-weight:700; color:var(--intel-primary);">14.2 Days Lead</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderStoryMilestones() {
    const coords = [
      { x: 50, y: 120, label: 'Day 2', name: 'Scattered Signals' },
      { x: 200, y: 112, label: 'Day 6', name: 'Cluster Cohesion' },
      { x: 380, y: 85, label: 'Day 10', name: 'Pattern Locked' },
      { x: 640, y: 35, label: 'Day 14', name: 'Risk Alert (T-0)' },
      { x: 770, y: 70, label: 'Day 16', name: 'Action Dispatched' },
      { x: 880, y: 120, label: 'Day 18', name: 'Resolved' }
    ];

    return coords.map((c, i) => `
      <g class="story-milestone-marker" data-step-index="${i}" transform="translate(${c.x}, ${c.y})" style="cursor:pointer;" role="button" tabindex="0">
        <circle cx="0" cy="0" r="8" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2"/>
        <circle cx="0" cy="0" r="4" fill="#64748B"/>
        <text x="0" y="22" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#102A43">
          ${c.label}
        </text>
        <text x="0" y="34" text-anchor="middle" font-family="'Inter', sans-serif" font-size="8" fill="#64748B">
          ${c.name}
        </text>
      </g>
    `).join('');
  }

  bindEvents() {
    const slider = this.container.querySelector('#storyTimeSlider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.updateToDay(parseInt(e.target.value, 10));
      });
    }

    const btnPlay = this.container.querySelector('#btnStoryPlay');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        this.togglePlay();
      });
    }

    const btnPrev = this.container.querySelector('#btnStoryPrev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        const nextDay = Math.max(1, this.currentDay - 2);
        this.updateToDay(nextDay);
      });
    }

    const btnNext = this.container.querySelector('#btnStoryNext');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const nextDay = Math.min(18, this.currentDay + 2);
        this.updateToDay(nextDay);
      });
    }

    // Milestone clicks
    const milestones = this.container.querySelectorAll('.story-milestone-marker');
    milestones.forEach((m, idx) => {
      const days = [2, 6, 10, 14, 16, 18];
      m.addEventListener('click', () => {
        this.updateToDay(days[idx]);
      });
    });
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const playIcon = this.container.querySelector('#playIcon');
    const playText = this.container.querySelector('#playText');

    if (this.isPlaying) {
      if (playIcon) playIcon.textContent = '⏸';
      if (playText) playText.textContent = 'Pause';
      if (this.currentDay >= 18) this.currentDay = 1;

      this.playTimer = setInterval(() => {
        if (this.currentDay >= 18) {
          this.togglePlay();
          return;
        }
        this.updateToDay(this.currentDay + 1);
      }, 750);
    } else {
      if (playIcon) playIcon.textContent = '▶';
      if (playText) playText.textContent = 'Play Evolution';
      if (this.playTimer) clearInterval(this.playTimer);
    }
  }

  updateToDay(day) {
    this.currentDay = day;
    const slider = this.container.querySelector('#storyTimeSlider');
    const dayLabel = this.container.querySelector('#scrubberDayLabel');
    if (slider) slider.value = day;
    if (dayLabel) dayLabel.textContent = `Day ${day}`;

    // Find nearest stage
    let stage = this.stages[0];
    for (const s of this.stages) {
      if (day >= s.day) stage = s;
    }

    // Playhead coordinates interpolation
    const progress = (day - 1) / 17; // 0.0 to 1.0
    const startX = 50, endX = 880;
    const playheadX = startX + progress * (endX - startX);
    
    // Parabolic curve height
    let playheadY = 120;
    if (progress <= 0.72) {
      // Climbing from 120 to 35
      playheadY = 120 - Math.sin((progress / 0.72) * (Math.PI / 2)) * 85;
    } else {
      // Descending from 35 to 120
      const subProg = (progress - 0.72) / 0.28;
      playheadY = 35 + Math.sin(subProg * (Math.PI / 2)) * 85;
    }

    const playhead = this.container.querySelector('#storyPlayhead');
    if (playhead) {
      playhead.setAttribute('transform', `translate(${playheadX}, ${playheadY})`);
      const circle = playhead.querySelectorAll('circle');
      if (circle[0]) circle[0].setAttribute('stroke', stage.color);
      if (circle[1]) circle[1].setAttribute('fill', stage.color);
    }

    // Dash offset on active track (total length ~900)
    const track = this.container.querySelector('#activeStoryTrack');
    if (track) {
      const offset = 900 - (progress * 900);
      track.setAttribute('stroke-dashoffset', offset);
    }

    // Update banner & badge
    const badge = this.container.querySelector('#storyStageBadge');
    const bStage = this.container.querySelector('#bannerStagePill');
    const bTitle = this.container.querySelector('#bannerTitle');
    const bDesc = this.container.querySelector('#bannerDesc');
    const bScore = this.container.querySelector('#bannerScore');
    const bLead = this.container.querySelector('#bannerLeadTime');

    if (badge) {
      badge.textContent = `STAGE ${stage.stageNum} • ${stage.badge}`;
      badge.style.background = `${stage.color}22`;
      badge.style.color = stage.color;
    }
    if (bStage) {
      bStage.textContent = `STAGE ${stage.stageNum}`;
      bStage.style.background = `${stage.color}22`;
      bStage.style.color = stage.color;
    }
    if (bTitle) bTitle.textContent = stage.title;
    if (bDesc) bDesc.textContent = stage.eventDesc;
    if (bScore) {
      bScore.textContent = `${stage.score}/100`;
      bScore.style.color = stage.color;
    }
    if (bLead) {
      bLead.textContent = day <= 14 ? `${(18 - day).toFixed(1)} Days Lead` : 'Action Executed';
    }
  }
}
