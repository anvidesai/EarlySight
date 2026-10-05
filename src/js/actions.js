/**
 * EarlySight — Action & Resolution Interactive Controller (Milestone 8)
 * 
 * Complete Closed-Loop Operational Workflow:
 * EMERGING RISK -> RECOMMENDED ACTION -> ASSIGNED -> IN PROGRESS -> RESOLVED -> VERIFIED
 */

import {
  ACTION_CENTER_KPIS,
  ACTION_WORKFLOW_STAGES,
  ACTION_REGISTRY_DATA,
  getActionById,
  filterActionsRegistry
} from '../data/actions-data.js';

class ActionsController {
  constructor() {
    this.actions = JSON.parse(JSON.stringify(ACTION_REGISTRY_DATA)); // Clone for interactive mock updates
    this.activeAction = this.actions[0];
    this.currentViewMode = 'board'; // 'board' | 'table'

    this.filters = {
      search: '',
      priority: 'all',
      status: 'all',
      owner: 'all',
      location: 'all',
      riskId: 'all',
      verification: 'all'
    };

    this.isDrawerOpen = false;
  }

  init() {
    this.parseUrlParameters();
    this.bindEvents();
    this.renderWorkflowStrip();
    this.renderPriorityActions();
    this.renderActionsViews();

    // Check if initial drawer open requested via URL parameter
    if (this.urlRequestedActionId) {
      const target = this.actions.find(a => 
        a.id.toLowerCase() === this.urlRequestedActionId.toLowerCase() ||
        (a.actionIdAlt && a.actionIdAlt.toLowerCase() === this.urlRequestedActionId.toLowerCase())
      );
      if (target) {
        this.openActionInspector(target);
      }
    }
  }

  parseUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const actionParam = params.get('actionId') || params.get('issue');
    const riskParam = params.get('riskId');
    const zoneParam = params.get('zone');

    if (actionParam) {
      this.urlRequestedActionId = actionParam;
    }

    if (riskParam) {
      this.filters.riskId = riskParam;
      const riskSelect = document.getElementById('filterRiskSelect');
      if (riskSelect) riskSelect.value = riskParam;
    }

    if (zoneParam) {
      this.filters.location = zoneParam;
      const locationSelect = document.getElementById('filterLocationSelect');
      if (locationSelect) locationSelect.value = zoneParam;
    }
  }

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('actionSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.trim();
        this.renderActionsViews();
      });
    }

    // Filter Selects
    const prioritySelect = document.getElementById('filterPrioritySelect');
    if (prioritySelect) {
      prioritySelect.addEventListener('change', (e) => {
        this.filters.priority = e.target.value;
        this.renderActionsViews();
      });
    }

    const statusSelect = document.getElementById('filterStatusSelect');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.filters.status = e.target.value;
        this.renderActionsViews();
      });
    }

    const ownerSelect = document.getElementById('filterOwnerSelect');
    if (ownerSelect) {
      ownerSelect.addEventListener('change', (e) => {
        this.filters.owner = e.target.value;
        this.renderActionsViews();
      });
    }

    const locationSelect = document.getElementById('filterLocationSelect');
    if (locationSelect) {
      locationSelect.addEventListener('change', (e) => {
        this.filters.location = e.target.value;
        this.renderActionsViews();
      });
    }

    const riskSelect = document.getElementById('filterRiskSelect');
    if (riskSelect) {
      riskSelect.addEventListener('change', (e) => {
        this.filters.riskId = e.target.value;
        this.renderActionsViews();
      });
    }

    const verificationSelect = document.getElementById('filterVerificationSelect');
    if (verificationSelect) {
      verificationSelect.addEventListener('change', (e) => {
        this.filters.verification = e.target.value;
        this.renderActionsViews();
      });
    }

    const resetBtn = document.getElementById('btnResetActionFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    // View Switcher (Board vs Table)
    const btnViewBoard = document.getElementById('btnViewBoard');
    const btnViewTable = document.getElementById('btnViewTable');
    if (btnViewBoard && btnViewTable) {
      btnViewBoard.addEventListener('click', () => {
        this.currentViewMode = 'board';
        btnViewBoard.classList.add('active');
        btnViewTable.classList.remove('active');
        document.getElementById('actionBoardSection').style.display = 'block';
        document.getElementById('actionTableSection').style.display = 'none';
      });

      btnViewTable.addEventListener('click', () => {
        this.currentViewMode = 'table';
        btnViewTable.classList.add('active');
        btnViewBoard.classList.remove('active');
        document.getElementById('actionBoardSection').style.display = 'none';
        document.getElementById('actionTableSection').style.display = 'block';
      });
    }

    // Drawer Close Buttons & Backdrop
    const drawerCloseBtn = document.getElementById('closeActionDrawerBtn');
    const drawerBackdrop = document.getElementById('actionDrawerBackdrop');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => this.closeActionInspector());
    }
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', () => this.closeActionInspector());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isDrawerOpen) {
        this.closeActionInspector();
      }
    });

    // Mock Action State Transition Buttons inside Inspector
    this.bindDrawerTransitionControls();
  }

  bindDrawerTransitionControls() {
    const btnAssign = document.getElementById('drawerBtnAssign');
    const btnStart = document.getElementById('drawerBtnStart');
    const btnResolve = document.getElementById('drawerBtnResolve');
    const btnVerifyReq = document.getElementById('drawerBtnVerifyReq');
    const btnVerifyConfirm = document.getElementById('drawerBtnVerifyConfirm');

    if (btnAssign) {
      btnAssign.addEventListener('click', () => this.updateActiveActionStatus('ASSIGNED', 'status-assigned'));
    }
    if (btnStart) {
      btnStart.addEventListener('click', () => this.updateActiveActionStatus('IN PROGRESS', 'status-in-progress'));
    }
    if (btnResolve) {
      btnResolve.addEventListener('click', () => this.updateActiveActionStatus('RESOLVED', 'status-resolved'));
    }
    if (btnVerifyReq) {
      btnVerifyReq.addEventListener('click', () => this.updateActiveActionStatus('AWAITING VERIFICATION', 'status-awaiting-verification'));
    }
    if (btnVerifyConfirm) {
      btnVerifyConfirm.addEventListener('click', () => this.updateActiveActionStatus('VERIFIED', 'status-verified'));
    }
  }

  updateActiveActionStatus(newStatus, newClass) {
    if (!this.activeAction) return;

    this.activeAction.status = newStatus;
    this.activeAction.statusBadgeClass = newClass;
    this.activeAction.statusCategory = newStatus.toLowerCase().replace(/\s+/g, '_');

    if (newStatus === 'VERIFIED') {
      this.activeAction.verificationState = 'Resolution Verified (Audited)';
      if (this.activeAction.checklist) {
        this.activeAction.checklist.forEach(c => c.checked = true);
      }
    }

    // Update in actions array
    const targetIdx = this.actions.findIndex(a => a.id === this.activeAction.id);
    if (targetIdx !== -1) {
      this.actions[targetIdx] = JSON.parse(JSON.stringify(this.activeAction));
    }

    // Re-populate drawer & views
    this.populateDrawer(this.activeAction);
    this.renderPriorityActions();
    this.renderActionsViews();
    this.showToast(`Action ${this.activeAction.id} status updated to: ${newStatus}`);
  }

  showToast(message) {
    let container = document.getElementById('actionToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'actionToastContainer';
      container.className = 'action-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'action-toast-pill font-mono';
    toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  resetFilters() {
    this.filters = {
      search: '',
      priority: 'all',
      status: 'all',
      owner: 'all',
      location: 'all',
      riskId: 'all',
      verification: 'all'
    };

    const s = document.getElementById('actionSearchInput');
    const p = document.getElementById('filterPrioritySelect');
    const st = document.getElementById('filterStatusSelect');
    const o = document.getElementById('filterOwnerSelect');
    const l = document.getElementById('filterLocationSelect');
    const r = document.getElementById('filterRiskSelect');
    const v = document.getElementById('filterVerificationSelect');

    if (s) s.value = '';
    if (p) p.value = 'all';
    if (st) st.value = 'all';
    if (o) o.value = 'all';
    if (l) l.value = 'all';
    if (r) r.value = 'all';
    if (v) v.value = 'all';

    this.renderActionsViews();
  }

  renderWorkflowStrip() {
    const strip = document.getElementById('closedLoopWorkflowStrip');
    if (!strip) return;

    strip.innerHTML = ACTION_WORKFLOW_STAGES.map((st, idx) => `
      <div class="workflow-loop-step ${idx === 3 ? 'step-active' : ''}">
        <div class="loop-step-header font-mono">
          <span class="loop-step-num">${st.step}</span>
          <span class="loop-step-name">${st.name}</span>
        </div>
        <div class="loop-step-subtitle font-sans">${st.subtitle}</div>
        <p class="loop-step-desc font-sans">${st.desc}</p>
      </div>
      ${idx < ACTION_WORKFLOW_STAGES.length - 1 ? `
        <div class="loop-step-connector" aria-hidden="true">➔</div>
      ` : ''}
    `).join('');
  }

  renderPriorityActions() {
    const container = document.getElementById('priorityActionsGrid');
    if (!container) return;

    // Show high priority actions (P1/P2 first)
    const priorityItems = this.actions.slice(0, 4);

    container.innerHTML = priorityItems.map(item => `
      <div class="priority-action-card" data-action-id="${item.id}">
        <div class="priority-card-top font-mono">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="action-id-tag font-mono">${item.id}</span>
            <span class="stat-badge ${item.priority === 'P1' ? 'badge-vermilion' : 'badge-amber'} font-mono">${item.priority}</span>
          </div>
          <span class="action-status-badge ${item.statusBadgeClass} font-mono">${item.status}</span>
        </div>

        <h4 class="priority-card-title">${item.title}</h4>
        
        <div class="priority-card-meta font-mono">
          <span class="meta-risk">⚠️ ${item.riskTitle}</span>
          <span class="meta-loc">📍 ${item.location}</span>
        </div>

        <p class="priority-card-action-text font-sans">
          <strong>Recommended:</strong> ${item.recommendedAction}
        </p>

        <div class="priority-card-footer font-mono">
          <span class="owner-pill">👤 ${item.owner}</span>
          <span class="due-pill">⏱ Due: ${item.dueDate}</span>
        </div>

        <div class="priority-card-hover-cue font-mono">
          Click to Open Action Inspector ➔
        </div>
      </div>
    `).join('');

    // Bind card clicks
    container.querySelectorAll('.priority-action-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const actionId = e.currentTarget.getAttribute('data-action-id');
        const target = this.actions.find(a => a.id === actionId);
        if (target) {
          this.openActionInspector(target);
        }
      });
    });
  }

  getFilteredActions() {
    return this.actions.filter(item => {
      if (this.filters.search) {
        const q = this.filters.search.toLowerCase();
        const m = item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.riskTitle.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.owner.toLowerCase().includes(q) ||
          item.recommendedAction.toLowerCase().includes(q);
        if (!m) return false;
      }

      if (this.filters.priority !== 'all') {
        if (!item.priority.toLowerCase().includes(this.filters.priority.toLowerCase())) return false;
      }

      if (this.filters.status !== 'all') {
        if (item.status.toUpperCase() !== this.filters.status.toUpperCase() &&
            item.statusCategory !== this.filters.status.toLowerCase()) {
          return false;
        }
      }

      if (this.filters.owner !== 'all') {
        if (!item.owner.toLowerCase().includes(this.filters.owner.toLowerCase())) return false;
      }

      if (this.filters.location !== 'all') {
        const locSlug = this.filters.location.toLowerCase().replace(/\s+/g, '-');
        if (item.zoneSlug !== locSlug && !item.location.toLowerCase().includes(this.filters.location.toLowerCase())) {
          return false;
        }
      }

      if (this.filters.riskId !== 'all') {
        const rNorm = this.filters.riskId.toUpperCase();
        if (item.riskId !== rNorm && (item.riskIdAlt && item.riskIdAlt !== rNorm) && !item.riskTitle.toLowerCase().includes(this.filters.riskId.toLowerCase())) {
          return false;
        }
      }

      if (this.filters.verification !== 'all') {
        const vNorm = this.filters.verification.toLowerCase();
        if (vNorm === 'verified' && !item.verificationState.toLowerCase().includes('verified')) return false;
        if (vNorm === 'awaiting' && !item.verificationState.toLowerCase().includes('awaiting') && !item.verificationState.toLowerCase().includes('pending')) return false;
      }

      return true;
    });
  }

  renderActionsViews() {
    const filtered = this.getFilteredActions();
    const countEl = document.getElementById('actionResultsCount');
    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${this.actions.length} Operational Actions`;
    }

    this.renderBoardView(filtered);
    this.renderTableView(filtered);
  }

  renderBoardView(filtered) {
    const boardContainer = document.getElementById('actionBoardColumnsGrid');
    if (!boardContainer) return;

    // 5 Board Columns: RECOMMENDED, ASSIGNED, IN PROGRESS, AWAITING VERIFICATION, VERIFIED
    const columnsConfig = [
      { id: "recommended", title: "RECOMMENDED", statusMatches: ["RECOMMENDED"] },
      { id: "assigned", title: "ASSIGNED", statusMatches: ["ASSIGNED", "BLOCKED"] },
      { id: "in_progress", title: "IN PROGRESS", statusMatches: ["IN PROGRESS"] },
      { id: "awaiting_verification", title: "AWAITING VERIFICATION", statusMatches: ["AWAITING VERIFICATION"] },
      { id: "verified", title: "VERIFIED", statusMatches: ["RESOLVED", "VERIFIED"] }
    ];

    boardContainer.innerHTML = columnsConfig.map(col => {
      const itemsInCol = filtered.filter(item => col.statusMatches.includes(item.status));
      return `
        <div class="action-board-column" data-col-id="${col.id}">
          <div class="board-col-header font-mono">
            <span class="board-col-title">${col.title}</span>
            <span class="board-col-count font-mono">${itemsInCol.length}</span>
          </div>

          <div class="board-col-cards-stack">
            ${itemsInCol.map(item => `
              <div class="board-item-card" data-action-id="${item.id}">
                <div class="board-item-top font-mono">
                  <span class="action-id-tag">${item.id}</span>
                  <span class="stat-badge ${item.priority === 'P1' ? 'badge-vermilion' : 'badge-amber'}">${item.priority}</span>
                </div>
                <h5 class="board-item-title font-sans">${item.title}</h5>
                <div class="board-item-risk font-mono text-muted">⚠️ ${item.riskTitle}</div>
                <div class="board-item-footer font-mono">
                  <span class="board-item-owner">👤 ${item.owner}</span>
                  <span class="board-item-due">⏱ ${item.dueDate}</span>
                </div>
              </div>
            `).join('')}
            ${itemsInCol.length === 0 ? `
              <div class="board-col-empty font-mono">No actions in this stage</div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Bind board card clicks
    boardContainer.querySelectorAll('.board-item-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-action-id');
        const target = this.actions.find(a => a.id === id);
        if (target) this.openActionInspector(target);
      });
    });
  }

  renderTableView(filtered) {
    const tbody = document.getElementById('actionTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align:center; padding:32px; color:var(--ink-secondary);">
            No operational actions found matching filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(item => `
      <tr class="action-table-row" data-action-id="${item.id}">
        <td class="font-mono"><strong>${item.id}</strong></td>
        <td class="font-sans">
          <div style="font-weight:700; color:var(--ink-primary);">${item.riskTitle}</div>
          <div class="font-mono text-muted" style="font-size:0.72rem;">Score: ${item.riskScore} (${item.riskId})</div>
        </td>
        <td class="font-mono" style="font-size:0.75rem;">${item.location}</td>
        <td class="font-sans" style="font-size:0.78rem; max-width:240px;">${item.recommendedAction}</td>
        <td class="font-sans" style="font-size:0.78rem;">${item.owner}</td>
        <td>
          <span class="stat-badge ${item.priority === 'P1' ? 'badge-vermilion' : 'badge-amber'} font-mono">${item.priority}</span>
        </td>
        <td>
          <span class="action-status-badge ${item.statusBadgeClass} font-mono">${item.status}</span>
        </td>
        <td class="font-mono text-muted" style="font-size:0.72rem;">${item.createdDate}</td>
        <td class="font-mono" style="font-size:0.72rem;"><strong>${item.dueDate}</strong></td>
        <td class="font-mono" style="font-size:0.72rem;">
          <span class="${item.verificationState.includes('Verified') ? 'text-forest font-bold' : 'text-muted'}">${item.verificationState}</span>
        </td>
        <td>
          <button class="btn-table-inspect font-mono" data-inspect-action-id="${item.id}">
            Inspect ➔
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-table-inspect').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-inspect-action-id');
        const target = this.actions.find(a => a.id === id);
        if (target) this.openActionInspector(target);
      });
    });
  }

  openActionInspector(action) {
    this.activeAction = action;
    this.isDrawerOpen = true;

    this.populateDrawer(action);

    const drawer = document.getElementById('actionInspectorDrawer');
    const backdrop = document.getElementById('actionDrawerBackdrop');
    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  populateDrawer(action) {
    const idEl = document.getElementById('drawerActionId');
    const titleEl = document.getElementById('drawerActionTitle');
    const statusEl = document.getElementById('drawerActionStatus');
    const priorityEl = document.getElementById('drawerActionPriority');
    const riskTitleEl = document.getElementById('drawerActionRiskTitle');
    const riskScoreEl = document.getElementById('drawerActionRiskScore');
    const locEl = document.getElementById('drawerActionLocation');
    const ownerEl = document.getElementById('drawerActionOwner');
    const leadEl = document.getElementById('drawerActionLeadTech');
    const dueEl = document.getElementById('drawerActionDueDate');
    const actionDescEl = document.getElementById('drawerActionRecommendedText');

    if (idEl) idEl.textContent = action.id;
    if (titleEl) titleEl.textContent = action.title;
    if (statusEl) {
      statusEl.textContent = action.status;
      statusEl.className = `action-status-badge ${action.statusBadgeClass} font-mono`;
    }
    if (priorityEl) {
      priorityEl.textContent = `${action.priority} Urgent`;
      priorityEl.className = `stat-badge ${action.priority === 'P1' ? 'badge-vermilion' : 'badge-amber'} font-mono`;
    }
    if (riskTitleEl) riskTitleEl.textContent = action.riskTitle;
    if (riskScoreEl) riskScoreEl.textContent = `Score: ${action.riskScore} / 100 (${action.leadTime})`;
    if (locEl) locEl.textContent = action.location;
    if (ownerEl) ownerEl.textContent = action.owner;
    if (leadEl) leadEl.textContent = action.leadTech;
    if (dueEl) dueEl.textContent = `${action.dueDate} (${action.daysRemaining} days)`;
    if (actionDescEl) actionDescEl.textContent = action.recommendedAction;

    // SECTION 7: WHY WAS THIS ACTION RECOMMENDED?
    const whyRiskEl = document.getElementById('drawerWhyRiskName');
    const whyEvidenceListEl = document.getElementById('drawerWhyEvidenceList');
    const whyPatternEl = document.getElementById('drawerWhyPatternName');
    const whyReasonEl = document.getElementById('drawerWhyReasonText');

    if (action.whyRecommended) {
      if (whyRiskEl) whyRiskEl.textContent = action.whyRecommended.riskName;
      if (whyEvidenceListEl && action.whyRecommended.evidenceSummary) {
        whyEvidenceListEl.innerHTML = action.whyRecommended.evidenceSummary.map(e => `
          <li style="display:flex; align-items:flex-start; gap:6px;">
            <span style="color:var(--color-rust); font-weight:bold;">•</span>
            <span>${e}</span>
          </li>
        `).join('');
      }
      if (whyPatternEl) whyPatternEl.textContent = action.whyRecommended.patternName;
      if (whyReasonEl) whyReasonEl.textContent = action.whyRecommended.reasonNarrative;
    }

    // SECTION 8: ACTION PROGRESS TIMELINE
    const timelineContainer = document.getElementById('drawerProgressTimelineContainer');
    if (timelineContainer && action.progressTimeline) {
      timelineContainer.innerHTML = action.progressTimeline.map(item => `
        <div class="progress-timeline-row state-${item.state}">
          <div class="timeline-row-bullet font-mono">
            ${item.state === 'completed' ? '✓' : (item.state === 'current' ? '▶' : '○')}
          </div>
          <div class="timeline-row-content">
            <div class="timeline-row-top font-mono">
              <span class="timeline-row-stage">${item.stage}</span>
              <span class="timeline-row-date">${item.date}</span>
            </div>
            <div class="timeline-row-desc font-sans">${item.desc}</div>
          </div>
        </div>
      `).join('');
    }

    // SECTION 9: RESOLUTION VERIFICATION (Before / After)
    if (action.resolutionVerification) {
      const b = action.resolutionVerification.before;
      const a = action.resolutionVerification.after;
      
      const bMoist = document.getElementById('drawerVerifBeforeMoisture');
      const bRecurr = document.getElementById('drawerVerifBeforeRecurr');
      const bScore = document.getElementById('drawerVerifBeforeScore');
      const aMoist = document.getElementById('drawerVerifAfterMoisture');
      const aRecurr = document.getElementById('drawerVerifAfterRecurr');
      const aScore = document.getElementById('drawerVerifAfterScore');
      const resBadge = document.getElementById('drawerVerifResultBadge');
      const resExpl = document.getElementById('drawerVerifExplanation');

      if (bMoist) bMoist.textContent = b.moistureProbe;
      if (bRecurr) bRecurr.textContent = b.leakageRecurrence;
      if (bScore) bScore.textContent = b.riskScore;
      if (aMoist) aMoist.textContent = a.moistureProbe;
      if (aRecurr) aRecurr.textContent = a.leakageRecurrence;
      if (aScore) aScore.textContent = a.riskScore;
      if (resBadge) resBadge.textContent = action.resolutionVerification.verificationResult;
      if (resExpl) resExpl.textContent = action.resolutionVerification.explanation;
    }

    // SECTION 10: VERIFICATION CHECKLIST
    const checklistContainer = document.getElementById('drawerVerificationChecklist');
    if (checklistContainer && action.checklist) {
      checklistContainer.innerHTML = action.checklist.map(chk => `
        <label class="verification-chk-item font-sans">
          <input type="checkbox" data-chk-id="${chk.id}" ${chk.checked ? 'checked' : ''} class="chk-box-input">
          <span class="chk-label-text ${chk.checked ? 'chk-done' : ''}">${chk.text}</span>
        </label>
      `).join('');

      // Bind checkbox toggles
      checklistContainer.querySelectorAll('.chk-box-input').forEach(box => {
        box.addEventListener('change', (e) => {
          const chkId = e.target.getAttribute('data-chk-id');
          const targetChk = action.checklist.find(c => c.id === chkId);
          if (targetChk) {
            targetChk.checked = e.target.checked;
            e.target.nextElementSibling.classList.toggle('chk-done', targetChk.checked);
          }
        });
      });
    }

    // SECTION 12: DEEP LINKS
    const linkRisk = document.getElementById('drawerActionDeepRisk');
    const linkEvidence = document.getElementById('drawerActionDeepEvidence');
    const linkSignals = document.getElementById('drawerActionDeepSignals');
    const linkTimeline = document.getElementById('drawerActionDeepTimeline');
    const linkMap = document.getElementById('drawerActionDeepMap');

    if (linkRisk) linkRisk.setAttribute('href', `risks.html?riskId=${action.riskId}`);
    if (linkEvidence) linkEvidence.setAttribute('href', `evidence.html?riskId=${action.riskId}`);
    if (linkSignals) linkSignals.setAttribute('href', `signals.html?zone=${action.zoneSlug}`);
    if (linkTimeline) linkTimeline.setAttribute('href', `timeline.html?zone=${action.zoneSlug}&case=0`);
    if (linkMap) linkMap.setAttribute('href', `map.html?zone=${action.zoneSlug}`);
  }

  closeActionInspector() {
    this.isDrawerOpen = false;
    const drawer = document.getElementById('actionInspectorDrawer');
    const backdrop = document.getElementById('actionDrawerBackdrop');
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Auto-instantiate when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.actionsController = new ActionsController();
  window.actionsController.init();
});
