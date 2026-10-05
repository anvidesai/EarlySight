/**
 * EarlySight — Action Center Controller (Stage 10)
 * 
 * Handles:
 * - 6-Stage Kanban Board & Tabular Matrix rendering
 * - Smooth status-transition animations with stage glow, card slide, & counter bounce
 * - Interactive 6-step progress visualizer on each card
 * - Granular issue inspector & resolution notes editor modal
 * - Search, team, and priority filtering
 * - Dynamic KPI metrics calculation
 * - Toast notification system for state transitions
 */

import '../data/actions-data.js';

(function () {
  'use strict';

  class ActionCenterApp {
    constructor() {
      this.store = window.EarlySightActionStore;
      this.currentView = 'kanban'; // 'kanban' | 'table' | 'urgency'
      this.filterTeam = 'all';
      this.filterPriority = 'all';
      this.searchQuery = '';
      this.selectedIssueId = null;
      this.animatingIssueId = null;

      this.init();
    }

    init() {
      this.bindEvents();
      this.render();

      // Subscribe to store changes
      this.store.subscribe((event) => {
        this.handleStoreEvent(event);
      });

      // Auto-open modal if URL has ?issue=...
      const urlParams = new URLSearchParams(window.location.search);
      const targetIssue = urlParams.get('issue');
      if (targetIssue) {
        setTimeout(() => {
          this.openIssueModal(targetIssue);
        }, 300);
      }
    }

    bindEvents() {
      // Search input
      const searchInput = document.getElementById('actionSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.renderBoard();
        });
      }

      // Team filter buttons
      document.querySelectorAll('[data-filter-team]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('[data-filter-team]').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.filterTeam = e.currentTarget.getAttribute('data-filter-team');
          this.renderBoard();
        });
      });

      // Priority filter buttons
      document.querySelectorAll('[data-filter-priority]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('[data-filter-priority]').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.filterPriority = e.currentTarget.getAttribute('data-filter-priority');
          this.renderBoard();
        });
      });

      // View Switcher (Kanban vs Table vs Urgency)
      document.querySelectorAll('[data-action-view]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('[data-action-view]').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.currentView = e.currentTarget.getAttribute('data-action-view');
          
          const kanbanEl = document.getElementById('actionKanbanBoard');
          const tableEl = document.getElementById('actionTableView');
          
          if (this.currentView === 'table') {
            if (kanbanEl) kanbanEl.style.display = 'none';
            if (tableEl) tableEl.style.display = 'block';
            this.renderTable();
          } else {
            if (kanbanEl) kanbanEl.style.display = 'grid';
            if (tableEl) tableEl.style.display = 'none';
            this.renderBoard();
          }
        });
      });

      // Close modal handlers
      const modalCloseBtn = document.getElementById('actionModalClose');
      const modalOverlay = document.getElementById('actionModalOverlay');
      if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => this.closeIssueModal());
      if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) this.closeIssueModal();
      });

      // Modal save button
      const modalSaveBtn = document.getElementById('actionModalSave');
      if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', () => this.saveModalChanges());
      }

      // Modal advance button
      const modalAdvanceBtn = document.getElementById('actionModalAdvance');
      if (modalAdvanceBtn) {
        modalAdvanceBtn.addEventListener('click', () => {
          if (this.selectedIssueId) {
            this.triggerAdvance(this.selectedIssueId);
          }
        });
      }

      // Quick add ticket button
      const addTicketBtn = document.getElementById('btnNewActionTicket');
      if (addTicketBtn) {
        addTicketBtn.addEventListener('click', () => this.openNewTicketModal());
      }
    }

    render() {
      this.renderKPIs();
      if (this.currentView === 'table') {
        this.renderTable();
      } else {
        this.renderBoard();
      }
    }

    renderKPIs() {
      const metrics = this.store.getMetrics();

      const elTotal = document.getElementById('kpiTotalIssues');
      const elInProgress = document.getElementById('kpiInProgress');
      const elResolved = document.getElementById('kpiResolved');
      const elSavings = document.getElementById('kpiSavings');
      const elAvertedHours = document.getElementById('kpiAvertedHours');
      const elSla = document.getElementById('kpiSla');

      if (elTotal) elTotal.textContent = metrics.total;
      if (elInProgress) elInProgress.textContent = metrics.inProgress;
      if (elResolved) elResolved.textContent = metrics.resolved;
      if (elSavings) elSavings.textContent = metrics.totalSavingsFormatted;
      if (elAvertedHours) elAvertedHours.textContent = metrics.totalAvertedHours + " hrs";
      if (elSla) elSla.textContent = metrics.slaCompliance;
    }

    getFilteredIssues() {
      let list = this.store.getAllIssues();

      // Team filter
      if (this.filterTeam !== 'all') {
        list = list.filter(item => item.responsibleTeam.toLowerCase().includes(this.filterTeam.toLowerCase()));
      }

      // Priority filter
      if (this.filterPriority !== 'all') {
        list = list.filter(item => item.priority.toLowerCase().includes(this.filterPriority.toLowerCase()));
      }

      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery;
        list = list.filter(item => 
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.asset.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.assignedPerson.toLowerCase().includes(q) ||
          item.responsibleTeam.toLowerCase().includes(q) ||
          item.action.toLowerCase().includes(q) ||
          item.resolutionNotes.toLowerCase().includes(q)
        );
      }

      // Urgency sorting
      if (this.currentView === 'urgency') {
        list = [...list].sort((a, b) => a.deadlineDaysRemaining - b.deadlineDaysRemaining);
      }

      return list;
    }

    renderBoard() {
      const kanbanBoard = document.getElementById('actionKanbanBoard');
      if (!kanbanBoard) return;

      const filtered = this.getFilteredIssues();
      const stages = this.store.stages;

      kanbanBoard.innerHTML = '';

      stages.forEach((stage, stageIndex) => {
        const stageIssues = filtered.filter(item => item.currentStatus === stage.id);

        const col = document.createElement('div');
        col.className = 'action-kanban-col';
        col.setAttribute('data-stage-id', stage.id);

        col.innerHTML = `
          <div class="action-col-header" style="border-top-color: ${stage.color};">
            <div class="action-col-title-wrap">
              <span class="action-stage-icon" style="background:${stage.bg}; color:${stage.color}; border: 1px solid ${stage.border};">${stage.icon}</span>
              <div class="action-stage-name-box">
                <span class="action-stage-name">${stage.label}</span>
                <span class="action-stage-subtext">${stage.description}</span>
              </div>
            </div>
            <span class="action-col-count-badge" id="count-${stage.id}">${stageIssues.length}</span>
          </div>

          <div class="action-col-cards-feed" id="col-feed-${stage.id}">
            ${stageIssues.length === 0 ? `
              <div class="action-col-empty">
                <span class="empty-icon">✓</span>
                <span>No issues in ${stage.label}</span>
              </div>
            ` : ''}
          </div>
        `;

        const cardsFeed = col.querySelector('.action-col-cards-feed');

        stageIssues.forEach(issue => {
          const card = this.createIssueCard(issue, stageIndex, stages);
          cardsFeed.appendChild(card);
        });

        kanbanBoard.appendChild(col);
      });
    }

    createIssueCard(issue, stageIndex, stages) {
      const card = document.createElement('article');
      card.className = `action-issue-card priority-${issue.priority.replace(/\s+/g, '-').toLowerCase()}`;
      card.id = `card-${issue.id}`;
      card.setAttribute('data-issue-id', issue.id);

      // Check if this card was just animated
      if (this.animatingIssueId === issue.id) {
        card.classList.add('card-transition-in');
      }

      // Priority Styling
      const priorityDef = window.PRIORITIES.find(p => p.id === issue.priority) || { color: '#64748B', bg: '#F1F5F9' };

      // Deadline urgency badge color
      let deadlineColor = '#64748B';
      let deadlineBg = '#F8FAFC';
      if (issue.deadlineDaysRemaining > 0 && issue.deadlineDaysRemaining <= 2) {
        deadlineColor = '#D94E34'; // Critical red
        deadlineBg = 'rgba(217, 78, 52, 0.12)';
      } else if (issue.deadlineDaysRemaining > 2 && issue.deadlineDaysRemaining <= 5) {
        deadlineColor = '#EA580C'; // Amber
        deadlineBg = 'rgba(234, 88, 12, 0.12)';
      } else if (issue.currentStatus === 'resolved' || issue.currentStatus === 'impact_verified') {
        deadlineColor = '#059669'; // Green done
        deadlineBg = 'rgba(5, 150, 105, 0.12)';
      }

      // Render 6-Stage Stepper Track
      let stepperHtml = `
        <div class="card-stepper-track" title="Workflow Progress: ${stageIndex + 1} of 6 stages">
      `;
      stages.forEach((st, idx) => {
        let stepClass = 'step-node';
        if (idx < stageIndex) stepClass += ' completed';
        else if (idx === stageIndex) stepClass += ' active pulse';
        else stepClass += ' upcoming';

        stepperHtml += `
          <div class="stepper-node-wrap">
            <span class="${stepClass}" style="${idx === stageIndex ? `background:${st.color}; border-color:${st.color};` : ''}" title="${st.label}">
              ${idx < stageIndex ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="display:inline-block; vertical-align:middle;"><polyline points="20 6 9 17 4 12"/></svg>' : idx + 1}
            </span>
            ${idx < stages.length - 1 ? `<span class="stepper-conn-line ${idx < stageIndex ? 'filled' : ''}"></span>` : ''}
          </div>
        `;
      });
      stepperHtml += `</div>`;

      // Assignee Initials Avatar & Clean Name
      const rawPerson = issue.assignedPerson || "Unassigned";
      const personName = rawPerson.replace(/\s*\(.*\)/, '');
      const initials = personName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

      card.innerHTML = `
        <!-- Card Header -->
        <div class="action-card-header">
          <div class="action-card-tags">
            <span class="action-id-tag">${issue.id}</span>
            <span class="action-priority-badge" style="color:${priorityDef.color}; background:${priorityDef.bg}; border-color:${priorityDef.border};">
              ${issue.priority}
            </span>
          </div>
          <span class="action-leadtime-chip" title="Anticipated Early Warning Window">⚡ ${issue.leadTime}</span>
        </div>

        <!-- Issue Title & Physical Asset -->
        <h4 class="action-card-title">${issue.title}</h4>
        <div class="action-card-asset">
          <span class="asset-pin"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
          <span>${issue.location}</span>
        </div>

        <!-- 6-Stage Stepper Visualizer -->
        ${stepperHtml}

        <!-- Concrete Action Callout Box -->
        <div class="action-instruction-box">
          <div class="action-box-label">
            <span class="icon">🔧</span>
            <span>PRESCRIPTIVE ACTION:</span>
          </div>
          <p class="action-box-text">${issue.action}</p>
        </div>

        <!-- People & Team Assignment -->
        <div class="action-meta-grid">
          <div class="action-meta-item">
            <span class="meta-label">Responsible Team</span>
            <span class="team-badge" title="${issue.responsibleTeam}">${issue.responsibleTeam}</span>
          </div>
          <div class="action-meta-item">
            <span class="meta-label">Assigned Lead</span>
            <div class="assignee-pill" title="${issue.assignedPerson}">
              <span class="avatar-initials">${initials}</span>
              <span class="assignee-name">${personName}</span>
            </div>
          </div>
        </div>

        <!-- Deadline & Current Status Row -->
        <div class="action-status-deadline-row">
          <div class="action-deadline-badge" style="color:${deadlineColor}; background:${deadlineBg};">
            <span class="deadline-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:3px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
            <span>${issue.deadline}</span>
          </div>
          <span class="action-status-pill" style="color:${stages[stageIndex].color}; background:${stages[stageIndex].bg}; border: 1px solid ${stages[stageIndex].border};">
            ${stages[stageIndex].label}
          </span>
        </div>

        <!-- Resolution Notes Accordion Preview -->
        <div class="action-notes-preview">
          <div class="notes-header" onclick="this.parentElement.classList.toggle('expanded')">
            <span class="notes-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Resolution Notes</span>
            <span class="toggle-icon">&darr;</span>
          </div>
          <p class="notes-content">${issue.resolutionNotes}</p>
        </div>

        <!-- Impact Savings Tag (if resolved or impact verified) -->
        ${issue.impactMetrics ? `
          <div class="action-impact-banner">
            <span class="impact-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:5px;"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
            <span><strong>Verified Averted Loss:</strong> ${issue.impactMetrics.financialSavings} • ${issue.impactMetrics.avertedDowntimeHours}h Saved</span>
          </div>
        ` : ''}

        <!-- Interactive Transition Footer -->
        <div class="action-card-footer">
          <div class="stage-nav-btns">
            ${stageIndex > 0 ? `
              <button class="btn-stage-rollback" data-id="${issue.id}" title="Roll back to previous stage">
                &larr; Prev
              </button>
            ` : ''}
            
            ${stageIndex < stages.length - 1 ? `
              <button class="btn-stage-advance" data-id="${issue.id}" style="background:${stages[stageIndex + 1].color};" title="Advance to ${stages[stageIndex + 1].label}">
                Advance to ${stages[stageIndex + 1].label} &rarr;
              </button>
            ` : `
              <span class="btn-stage-complete">✓ Full Workflow Verified</span>
            `}
          </div>

          <button class="btn-card-inspect" data-inspect-id="${issue.id}">
            Inspect & Edit
          </button>
        </div>
      `;

      // Bind button events on the card
      const advanceBtn = card.querySelector('.btn-stage-advance');
      if (advanceBtn) {
        advanceBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.triggerAdvance(issue.id);
        });
      }

      const rollbackBtn = card.querySelector('.btn-stage-rollback');
      if (rollbackBtn) {
        rollbackBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.triggerRollback(issue.id);
        });
      }

      const inspectBtn = card.querySelector('.btn-card-inspect');
      if (inspectBtn) {
        inspectBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openIssueModal(issue.id);
        });
      }

      // Clicking card body also opens modal
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('.notes-header')) {
          this.openIssueModal(issue.id);
        }
      });

      return card;
    }

    renderTable() {
      const tableBody = document.getElementById('actionTableBody');
      if (!tableBody) return;

      const filtered = this.getFilteredIssues();
      const stages = this.store.stages;

      tableBody.innerHTML = '';

      if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px; color:var(--text-muted);">No issues match current filters.</td></tr>`;
        return;
      }

      filtered.forEach(issue => {
        const stageObj = stages.find(s => s.id === issue.currentStatus) || stages[0];
        const tr = document.createElement('tr');
        tr.id = `tablerow-${issue.id}`;

        tr.innerHTML = `
          <td>
            <div style="font-family:var(--font-mono); font-weight:700; color:var(--brand-black);">${issue.id}</div>
            <span class="action-priority-badge" style="font-size:10px; padding:2px 6px;">${issue.priority}</span>
          </td>
          <td>
            <div style="font-weight:700; color:var(--brand-black); margin-bottom:2px;">${issue.title}</div>
            <div style="font-size:11px; color:var(--text-muted);">📍 ${issue.location}</div>
          </td>
          <td>
            <span class="team-badge" style="font-size:11px;">${issue.responsibleTeam}</span>
          </td>
          <td>
            <span style="font-weight:600; font-size:12px;">${issue.assignedPerson}</span>
          </td>
          <td>
            <select class="table-stage-select" data-select-id="${issue.id}">
              ${stages.map(s => `
                <option value="${s.id}" ${s.id === issue.currentStatus ? 'selected' : ''}>
                  ${s.shortLabel}
                </option>
              `).join('')}
            </select>
          </td>
          <td>
            <div style="font-size:11px; font-weight:600;">${issue.deadline}</div>
            <div style="font-size:10px; color:var(--text-muted);">⚡ ${issue.leadTime}</div>
          </td>
          <td style="max-width:280px;">
            <div style="font-size:12px; line-height:1.4; max-height:48px; overflow:hidden; text-overflow:ellipsis;">
              ${issue.action}
            </div>
          </td>
          <td>
            <button class="btn-table-inspect" data-inspect-id="${issue.id}">Inspect</button>
          </td>
        `;

        const select = tr.querySelector('.table-stage-select');
        select.addEventListener('change', (e) => {
          this.triggerSetStage(issue.id, e.target.value);
        });

        const inspectBtn = tr.querySelector('.btn-table-inspect');
        inspectBtn.addEventListener('click', () => this.openIssueModal(issue.id));

        tableBody.appendChild(tr);
      });
    }

    triggerAdvance(issueId) {
      const card = document.getElementById(`card-${issueId}`);
      if (card) {
        card.classList.add('card-transition-out');
      }

      this.animatingIssueId = issueId;

      setTimeout(() => {
        const res = this.store.advanceStage(issueId);
        if (res) {
          const stageName = this.store.stages.find(s => s.id === res.newStage)?.label || res.newStage;
          this.showToast(`✓ [${res.issue.id}] Advanced to "${stageName}" • Assigned: ${res.issue.assignedPerson}`, res.newStage);
        }
      }, 240);
    }

    triggerRollback(issueId) {
      const card = document.getElementById(`card-${issueId}`);
      if (card) {
        card.classList.add('card-transition-out');
      }

      this.animatingIssueId = issueId;

      setTimeout(() => {
        const res = this.store.rollbackStage(issueId);
        if (res) {
          const stageName = this.store.stages.find(s => s.id === res.newStage)?.label || res.newStage;
          this.showToast(`↺ [${res.issue.id}] Rolled back to "${stageName}"`, res.newStage);
        }
      }, 240);
    }

    triggerSetStage(issueId, newStageId) {
      const card = document.getElementById(`card-${issueId}`);
      if (card) {
        card.classList.add('card-transition-out');
      }

      this.animatingIssueId = issueId;

      setTimeout(() => {
        const res = this.store.setStage(issueId, newStageId);
        if (res) {
          const stageName = this.store.stages.find(s => s.id === res.newStage)?.label || res.newStage;
          this.showToast(`✓ [${res.issue.id}] Status transitioned to "${stageName}"`, res.newStage);
        }
      }, 240);
    }

    handleStoreEvent({ issueId, oldStage, newStage, actionType }) {
      this.renderKPIs();
      
      if (this.currentView === 'table') {
        this.renderTable();
      } else {
        this.renderBoard();
      }

      // If modal is currently open with this issue, update modal view
      if (this.selectedIssueId === issueId) {
        this.populateModal(issueId);
      }

      // Clear animation flag after 1.2s
      setTimeout(() => {
        if (this.animatingIssueId === issueId) {
          this.animatingIssueId = null;
        }
      }, 1200);
    }

    // Modal Inspector & Editor
    openIssueModal(issueId) {
      this.selectedIssueId = issueId;
      const modal = document.getElementById('actionInspectorModal');
      const overlay = document.getElementById('actionModalOverlay');
      if (!modal || !overlay) return;

      this.populateModal(issueId);

      overlay.classList.add('active');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    closeIssueModal() {
      const modal = document.getElementById('actionInspectorModal');
      const overlay = document.getElementById('actionModalOverlay');
      if (modal) modal.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
      this.selectedIssueId = null;
    }

    populateModal(issueId) {
      const issue = this.store.getIssueById(issueId);
      if (!issue) return;

      const stages = this.store.stages;
      const currentStageIndex = stages.findIndex(s => s.id === issue.currentStatus);

      // Header fields
      document.getElementById('modalIssueId').textContent = issue.id;
      document.getElementById('modalIssueTitle').textContent = issue.title;
      document.getElementById('modalAssetLocation').textContent = `${issue.asset} • ${issue.location}`;
      document.getElementById('modalLeadTime').textContent = `⚡ ${issue.leadTime}`;
      document.getElementById('modalPotentialLoss').textContent = `💰 Potential Loss: ${issue.potentialLoss}`;
      document.getElementById('modalWorkOrder').textContent = `Work Order: ${issue.workOrder}`;

      // Large Interactive Stepper
      const stepperContainer = document.getElementById('modalStepperTrack');
      if (stepperContainer) {
        stepperContainer.innerHTML = '';
        stages.forEach((st, idx) => {
          const stepBtn = document.createElement('div');
          stepBtn.className = `modal-step-node-item ${idx < currentStageIndex ? 'completed' : ''} ${idx === currentStageIndex ? 'active' : ''}`;
          stepBtn.setAttribute('data-stage-id', st.id);

          stepBtn.innerHTML = `
            <div class="step-circle" style="${idx === currentStageIndex ? `background:${st.color}; border-color:${st.color};` : ''}">
              ${idx < currentStageIndex ? '✓' : st.icon}
            </div>
            <div class="step-text-wrap">
              <span class="step-num">Step ${idx + 1}</span>
              <span class="step-name">${st.label}</span>
            </div>
          `;

          stepBtn.addEventListener('click', () => {
            this.triggerSetStage(issue.id, st.id);
          });

          stepperContainer.appendChild(stepBtn);
        });
      }

      // Form inputs
      const teamSelect = document.getElementById('editResponsibleTeam');
      if (teamSelect) {
        teamSelect.innerHTML = window.TEAMS_LIST.map(t => `
          <option value="${t}" ${t === issue.responsibleTeam ? 'selected' : ''}>${t}</option>
        `).join('');
      }

      const assignedInput = document.getElementById('editAssignedPerson');
      if (assignedInput) assignedInput.value = issue.assignedPerson;

      const prioritySelect = document.getElementById('editPriority');
      if (prioritySelect) prioritySelect.value = issue.priority;

      const deadlineInput = document.getElementById('editDeadline');
      if (deadlineInput) deadlineInput.value = issue.deadline;

      const actionTextarea = document.getElementById('editAction');
      if (actionTextarea) actionTextarea.value = issue.action;

      const notesTextarea = document.getElementById('editResolutionNotes');
      if (notesTextarea) notesTextarea.value = issue.resolutionNotes;

      // Audit History Trail
      const historyList = document.getElementById('modalHistoryList');
      if (historyList) {
        historyList.innerHTML = '';
        (issue.history || []).forEach(h => {
          const item = document.createElement('div');
          item.className = 'history-log-item';
          const stageDef = stages.find(s => s.id === h.stage) || { color: '#64748B', label: h.stage };
          
          item.innerHTML = `
            <div class="history-dot" style="background:${stageDef.color};"></div>
            <div class="history-content">
              <div class="history-header">
                <span class="history-stage-pill" style="color:${stageDef.color}; border-color:${stageDef.color};">${stageDef.label}</span>
                <span class="history-author">${h.author}</span>
                <span class="history-time">${h.timestamp}</span>
              </div>
              <p class="history-note">${h.note}</p>
            </div>
          `;
          historyList.appendChild(item);
        });
      }

      // Impact Verification Box
      const impactBox = document.getElementById('modalImpactBox');
      if (impactBox) {
        if (issue.impactMetrics) {
          impactBox.style.display = 'block';
          impactBox.innerHTML = `
            <div class="impact-verified-card">
              <div class="impact-card-head">
                <span class="impact-badge-tag">✓ STAGE 6 VERIFIED IMPACT</span>
                <span class="impact-status">${issue.impactMetrics.falsePositiveCheck}</span>
              </div>
              <div class="impact-metrics-grid">
                <div class="impact-metric">
                  <span class="val">${issue.impactMetrics.financialSavings}</span>
                  <span class="lbl">Averted Downtime Loss</span>
                </div>
                <div class="impact-metric">
                  <span class="val">${issue.impactMetrics.avertedDowntimeHours} Hours</span>
                  <span class="lbl">Production Loss Prevented</span>
                </div>
                <div class="impact-metric">
                  <span class="val">${issue.impactMetrics.mtbfDelta}</span>
                  <span class="lbl">MTBF Reliability Extension</span>
                </div>
              </div>
            </div>
          `;
        } else {
          impactBox.style.display = 'none';
        }
      }

      // Update Modal Advance Button label
      const modalAdvanceBtn = document.getElementById('actionModalAdvance');
      if (modalAdvanceBtn) {
        if (currentStageIndex < stages.length - 1) {
          modalAdvanceBtn.style.display = 'inline-flex';
          modalAdvanceBtn.textContent = `Advance to ${stages[currentStageIndex + 1].label} →`;
          modalAdvanceBtn.style.backgroundColor = stages[currentStageIndex + 1].color;
        } else {
          modalAdvanceBtn.style.display = 'none';
        }
      }
    }

    saveModalChanges() {
      if (!this.selectedIssueId) return;

      const team = document.getElementById('editResponsibleTeam')?.value;
      const person = document.getElementById('editAssignedPerson')?.value;
      const priority = document.getElementById('editPriority')?.value;
      const deadline = document.getElementById('editDeadline')?.value;
      const action = document.getElementById('editAction')?.value;
      const notes = document.getElementById('editResolutionNotes')?.value;

      this.store.updateIssue(this.selectedIssueId, {
        responsibleTeam: team,
        assignedPerson: person,
        priority: priority,
        deadline: deadline,
        action: action,
        resolutionNotes: notes
      });

      this.showToast(`✓ Ticket [${this.selectedIssueId}] changes saved successfully.`, 'saved');
      this.closeIssueModal();
    }

    // New Ticket Modal
    openNewTicketModal() {
      const title = prompt("Enter Emerging Issue Title (e.g. Compressor Bearing Micro-Vibration):");
      if (!title) return;

      const newId = "ACT-2026-" + Math.floor(100 + Math.random() * 900);
      const newIssue = {
        id: newId,
        title: title,
        asset: "Monitored Plant Asset",
        location: "Block A / Quad 2",
        responsibleTeam: "Mechanical Reliability",
        assignedPerson: "Marcus Vance (Lead Tech)",
        priority: "High P2",
        action: "Perform immediate diagnostic scan and inspect lubrication boundary.",
        deadline: "Oct 12, 2026 • 18:00",
        deadlineDaysRemaining: 14.0,
        currentStatus: "detected",
        resolutionNotes: "Discovered via EarlySight cross-silo anomaly correlation.",
        leadTime: "14.0 Days Lead",
        potentialLoss: "$120,000",
        confidence: "84.5%",
        signalsLinked: 3,
        workOrder: "WO-2026-9999",
        history: [
          { stage: "detected", timestamp: "Just now", author: "Operator Manual Ticket", note: "Created via Action Center interface." }
        ],
        impactMetrics: null
      };

      this.store.addIssue(newIssue);
      this.showToast(`✓ Created new action ticket [${newId}].`, 'detected');
    }

    // Toast Notification System
    showToast(message, stageKey = 'detected') {
      let toastContainer = document.getElementById('actionToastContainer');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'actionToastContainer';
        toastContainer.className = 'action-toast-container';
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement('div');
      toast.className = `action-toast-item toast-${stageKey}`;
      toast.innerHTML = `
        <span class="toast-indicator"></span>
        <span class="toast-text">${message}</span>
      `;

      toastContainer.appendChild(toast);

      // Trigger enter animation
      requestAnimationFrame(() => {
        toast.classList.add('visible');
      });

      // Auto-dismiss
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    }
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    window.EarlySightActionCenter = new ActionCenterApp();
  });

})();
