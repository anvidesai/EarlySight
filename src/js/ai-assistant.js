/**
 * EarlySight — AI Assistant Controller (Stage 9)
 * 
 * Provides an integrated, industrial-grade operational AI Copilot.
 * Connects natural language queries directly back to the organization's data:
 * SCADA telemetry, CMMS work orders, operator shift logs, and geospatial clusters.
 */

import { AI_ASSISTANT_KNOWLEDGE_BASE } from '../data/ai-assistant-data.js';

(function () {
  'use strict';

  class EarlySightAIAssistant {
    constructor() {
      this.kb = (typeof AI_ASSISTANT_KNOWLEDGE_BASE !== 'undefined' ? AI_ASSISTANT_KNOWLEDGE_BASE : window.AI_ASSISTANT_KNOWLEDGE_BASE) || {};
      this.history = [...(this.kb.initialHistory || [])];
      this.historyFilterTerm = "";
      
      this.dom = {
        container: document.getElementById('earlySightAiAssistantContainer'),
        feed: document.getElementById('aiChatFeed'),
        inputForm: document.getElementById('aiQueryForm'),
        inputField: document.getElementById('aiQueryInput'),
        suggestedList: document.getElementById('aiSuggestedQuestionsList'),
        historyList: document.getElementById('aiHistoryList'),
        historySearch: document.getElementById('aiHistorySearchInput'),
        clearBtn: document.getElementById('aiClearThreadBtn'),
        exportBtn: document.getElementById('aiExportBriefingBtn'),
        evidenceModal: document.getElementById('aiEvidenceModal'),
        evidenceModalTitle: document.getElementById('aiEvidenceModalTitle'),
        evidenceModalSource: document.getElementById('aiEvidenceModalSource'),
        evidenceModalBody: document.getElementById('aiEvidenceModalBody'),
        evidenceModalClose: document.getElementById('aiEvidenceModalClose')
      };

      this.init();
    }

    init() {
      if (!this.dom.container) return;

      this.renderSuggestedQuestions();
      this.renderHistory();
      this.bindEvents();

      // Render initial default welcome conversation if feed is empty
      if (this.dom.feed && this.dom.feed.children.length === 0) {
        this.renderInitialWelcome();
      }

      // Check if URL query parameter 'q' is provided
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const qParam = urlParams.get('q');
        if (qParam) {
          setTimeout(() => {
            this.executeUserQuery(qParam, "URL Query");
          }, 100);
        }
      } catch (err) {
        console.warn("URL query parsing error:", err);
      }
    }

    bindEvents() {
      // Query submission
      if (this.dom.inputForm) {
        this.dom.inputForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleQuerySubmit();
        });
      }

      // History search filter
      if (this.dom.historySearch) {
        this.dom.historySearch.addEventListener('input', (e) => {
          this.historyFilterTerm = (e.target.value || "").toLowerCase();
          this.renderHistory();
        });
      }

      // Clear thread
      if (this.dom.clearBtn) {
        this.dom.clearBtn.addEventListener('click', () => {
          this.clearThread();
        });
      }

      // Export briefing
      if (this.dom.exportBtn) {
        this.dom.exportBtn.addEventListener('click', () => {
          this.exportBriefing();
        });
      }

      // Evidence modal close
      if (this.dom.evidenceModalClose) {
        this.dom.evidenceModalClose.addEventListener('click', () => {
          this.closeEvidenceModal();
        });
      }

      // Close modal on backdrop click
      if (this.dom.evidenceModal) {
        this.dom.evidenceModal.addEventListener('click', (e) => {
          if (e.target === this.dom.evidenceModal) {
            this.closeEvidenceModal();
          }
        });
      }
    }

    renderSuggestedQuestions() {
      if (!this.dom.suggestedList || !this.kb.suggestedQuestions) return;
      this.dom.suggestedList.innerHTML = '';

      this.kb.suggestedQuestions.forEach(q => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ai-suggested-chip';
        btn.innerHTML = `
          <span class="chip-icon">${q.icon}</span>
          <span class="chip-text">${q.label}</span>
        `;
        btn.addEventListener('click', () => {
          if (this.dom.inputField) {
            this.dom.inputField.value = q.queryText;
          }
          this.executeUserQuery(q.queryText, q.category);
        });
        this.dom.suggestedList.appendChild(btn);
      });
    }

    renderHistory() {
      if (!this.dom.historyList) return;
      this.dom.historyList.innerHTML = '';

      const filtered = this.history.filter(h => 
        h.query.toLowerCase().includes(this.historyFilterTerm) ||
        h.category.toLowerCase().includes(this.historyFilterTerm)
      );

      if (filtered.length === 0) {
        this.dom.historyList.innerHTML = `
          <div class="history-empty-note font-mono">No matching investigations.</div>
        `;
        return;
      }

      const iconPin = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z"/></svg>';

      filtered.forEach(h => {
        const item = document.createElement('div');
        item.className = 'ai-history-item';
        item.innerHTML = `
          <div class="history-item-top">
            <span class="history-category font-mono">${h.category}</span>
            <span class="history-time font-mono">${h.timestamp}</span>
          </div>
          <div class="history-query-text" title="${h.query}">
            ${h.pinned ? iconPin : ''}${h.query}
          </div>
        `;
        item.addEventListener('click', () => {
          if (this.dom.inputField) {
            this.dom.inputField.value = h.query;
          }
          this.executeUserQuery(h.query, h.category);
        });
        this.dom.historyList.appendChild(item);
      });
    }

    handleQuerySubmit() {
      if (!this.dom.inputField) return;
      const query = this.dom.inputField.value.trim();
      if (!query) return;

      this.dom.inputField.value = '';
      this.executeUserQuery(query, "Operational Query");
    }

    executeUserQuery(queryText, category = "General Query") {
      // 1. Add to history
      const newHistItem = {
        id: "hist-" + Date.now(),
        query: queryText,
        timestamp: "Just now",
        category: category,
        pinned: false
      };
      this.history.unshift(newHistItem);
      this.renderHistory();

      // 2. Render user message bubble
      this.renderUserMessage(queryText);

      // 3. Render thinking state & assistant response
      this.renderAssistantResponse(queryText);
    }

    renderUserMessage(text) {
      if (!this.dom.feed) return;

      const userRow = document.createElement('div');
      userRow.className = 'ai-message-row user-row';
      userRow.innerHTML = `
        <div class="ai-avatar user-avatar">OP</div>
        <div class="ai-message-bubble user-bubble">
          <div class="user-meta-row font-mono">
            <span>OPERATIONS ENGINEER</span>
            <span>•</span>
            <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p class="user-query-text">${this.escapeHtml(text)}</p>
        </div>
      `;
      this.dom.feed.appendChild(userRow);
      this.scrollToBottom();
    }

    renderAssistantResponse(queryText) {
      if (!this.dom.feed) return;

      // Lookup structured response from knowledge base
      const data = this.kb.findResponse(queryText);

      // Create assistant container
      const asstRow = document.createElement('div');
      asstRow.className = 'ai-message-row asst-row';

      asstRow.innerHTML = `
        <div class="ai-avatar asst-avatar">
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#D9E2EC" stroke-width="2" stroke-dasharray="2 2"/>
            <circle cx="16" cy="16" r="8" fill="#B7A7E8"/>
          </svg>
        </div>

        <div class="ai-message-bubble asst-bubble">
          
          <!-- Message Header Ribbon -->
          <div class="asst-header-ribbon">
            <div class="asst-badge-cluster">
              <span class="asst-topic-tag font-mono">${data.topic}</span>
              <span class="asst-scope-tag font-mono">FACILITY 04 • CROSS-SILO SYNTHESIS</span>
            </div>
            <span class="asst-time-tag font-mono">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <!-- Headline & Synthesis -->
          <h4 class="asst-headline">${data.headline}</h4>
          <p class="asst-synthesis-body">${data.executiveSummary}</p>

          <!-- Inline Visual Data Chart -->
          <div class="asst-chart-card">
            <div class="chart-card-top font-mono">
              <span class="chart-title">${data.chartData.title}</span>
              <span class="chart-trend-tag">${data.chartData.trendLabel}</span>
            </div>
            <div class="chart-render-wrapper">
              ${this.generateChartSvg(data.chartData)}
            </div>
          </div>

          <!-- Clickable Evidence References (Connecting back to Org Data) -->
          <div class="asst-evidence-block">
            <div class="evidence-block-header font-mono">
              <span>SUPPORTING EVIDENCE CITATIONS (CLICK TO INSPECT):</span>
            </div>
            <div class="evidence-chips-grid">
              ${data.evidenceReferences.map((ref, idx) => `
                <button type="button" class="evidence-citation-pill" data-ref-idx="${idx}">
                  <span class="citation-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
                  <div class="citation-text-group">
                    <span class="citation-title">${ref.title}</span>
                    <span class="citation-source font-mono">${ref.source}</span>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Related Alerts Block -->
          <div class="asst-alerts-block">
            <div class="alerts-block-header font-mono">
              <span>CORRELATED EARLY WARNING ALERTS:</span>
            </div>
            <div class="related-alerts-grid">
              ${data.relatedAlerts.map(alert => `
                <div class="related-alert-card">
                  <div class="alert-card-top">
                    <span class="alert-id font-mono">${alert.id}</span>
                    <span class="alert-sev-badge ${alert.severity === 'Critical' ? 'badge-vermilion' : 'badge-amber'} font-mono">${alert.severity}</span>
                  </div>
                  <div class="alert-card-title">${alert.title}</div>
                  <div class="alert-card-meta font-mono">
                    <span>${alert.location}</span>
                    <span>•</span>
                    <span class="text-vermilion">Lead Time: ${alert.leadTime}</span>
                  </div>
                  <div class="alert-card-footer">
                    <span class="alert-conf-pill font-mono">${alert.confidence}</span>
                    <a href="${alert.linkPage}" class="btn-alert-inspect font-mono">Inspect Evidence &rarr;</a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Suggested Follow-Up Actions -->
          <div class="asst-followup-block">
            <span class="followup-label font-mono">SUGGESTED NEXT INQUIRIES:</span>
            <div class="followup-pills-row">
              ${data.suggestedFollowUps.map(fu => `
                <button type="button" class="followup-chip font-mono">
                  ${fu}
                </button>
              `).join('')}
            </div>
          </div>

        </div>
      `;

      // Bind Evidence Click Listeners
      const evidencePills = asstRow.querySelectorAll('.evidence-citation-pill');
      evidencePills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-ref-idx'), 10);
          const ref = data.evidenceReferences[idx];
          if (ref) {
            this.openEvidenceModal(ref);
          }
        });
      });

      // Bind Follow-Up Click Listeners
      const followUpBtns = asstRow.querySelectorAll('.followup-chip');
      followUpBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const text = e.currentTarget.textContent.trim();
          if (this.dom.inputField) {
            this.dom.inputField.value = text;
          }
          this.executeUserQuery(text, "Follow-Up Query");
        });
      });

      this.dom.feed.appendChild(asstRow);
      setTimeout(() => {
        asstRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }

    renderInitialWelcome() {
      const welcomeRow = document.createElement('div');
      welcomeRow.className = 'ai-message-row asst-row';
      welcomeRow.innerHTML = `
        <div class="ai-avatar asst-avatar">
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#D9E2EC" stroke-width="2" stroke-dasharray="2 2"/>
            <circle cx="16" cy="16" r="8" fill="#B7A7E8"/>
          </svg>
        </div>

        <div class="ai-message-bubble asst-bubble">
          <div class="asst-header-ribbon">
            <div class="asst-badge-cluster">
              <span class="asst-topic-tag font-mono">INTELLIGENCE COPILOT</span>
              <span class="asst-scope-tag font-mono">54 SIGNALS LIVE • 6 ZONES MONITORED</span>
            </div>
            <span class="asst-time-tag font-mono">System Ready</span>
          </div>

          <h4 class="asst-headline">EarlySight Industrial AI Copilot Initialized</h4>
          <p class="asst-synthesis-body">
            I continuously synthesize cross-silo plant data: <strong>SCADA pressure & acoustic transients</strong>, <strong>CMMS work order tickets</strong>, <strong>operator shift handovers</strong>, and <strong>subsurface soil probes</strong>. 
            Ask any question regarding emerging risk velocities, spatial convergence, causal failure mechanisms, or evidence dossiers.
          </p>

          <div class="asst-followup-block">
            <span class="followup-label font-mono">QUICK LAUNCH OPERATIONS BRIEFING:</span>
            <div class="followup-pills-row">
              <button type="button" class="followup-chip font-mono">What problems are increasing this week?</button>
              <button type="button" class="followup-chip font-mono">Show emerging issues in Block A.</button>
              <button type="button" class="followup-chip font-mono">Why was this warning generated?</button>
              <button type="button" class="followup-chip font-mono">Which issues require investigation?</button>
            </div>
          </div>
        </div>
      `;

      // Bind initial buttons
      const btns = welcomeRow.querySelectorAll('.followup-chip');
      btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const text = e.currentTarget.textContent.trim();
          this.executeUserQuery(text, "Operations Launch");
        });
      });

      this.dom.feed.appendChild(welcomeRow);
    }

    generateChartSvg(chartData) {
      if (!chartData) return '';

      if (chartData.type === 'velocity_bar_chart') {
        const maxVal = Math.max(...chartData.values, 5);
        const bars = chartData.values.map((v, i) => {
          const height = Math.round((v / maxVal) * 80);
          const y = 95 - height;
          const x = 30 + i * 85;
          const isLatest = i === chartData.values.length - 1;
          const fill = isLatest ? '#F2A65A' : '#F1F5F9';
          const stroke = isLatest ? '#D98838' : '#D9E2EC';

          return `
            <g class="bar-group">
              <rect x="${x}" y="${y}" width="48" height="${height}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.2" />
              <text x="${x + 24}" y="${y - 6}" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="${isLatest ? '#9A4D00' : '#486581'}">${v.toFixed(1)}</text>
              <text x="${x + 24}" y="112" font-size="10" font-family="monospace" text-anchor="middle" fill="#627D98">${chartData.days[i]}</text>
            </g>
          `;
        }).join('');

        return `
          <svg viewBox="0 0 660 130" class="inline-asst-svg">
            <line x1="20" y1="95" x2="640" y2="95" stroke="#D9E2EC" stroke-width="1" />
            ${bars}
          </svg>
        `;
      }

      if (chartData.type === 'spatial_risk_radial') {
        const rows = chartData.items.map((item, i) => {
          const y = 20 + i * 26;
          const barWidth = Math.round((item.pct / 100) * 380);
          return `
            <g>
              <text x="10" y="${y + 11}" font-size="11" font-weight="600" font-family="sans-serif" fill="#1C2024">${item.name}</text>
              <rect x="220" y="${y}" width="380" height="14" rx="4" fill="#F7F5F0" />
              <rect x="220" y="${y}" width="${barWidth}" height="14" rx="4" fill="${item.color}" />
              <text x="615" y="${y + 11}" font-size="11" font-weight="700" font-family="monospace" fill="${item.color}">${item.pct}%</text>
            </g>
          `;
        }).join('');

        return `
          <svg viewBox="0 0 660 130" class="inline-asst-svg">
            ${rows}
          </svg>
        `;
      }

      if (chartData.type === 'evidence_weights_pie') {
        const rows = chartData.items.map((item, i) => {
          const y = 14 + i * 22;
          return `
            <g>
              <rect x="15" y="${y}" width="12" height="12" rx="3" fill="${item.color}" />
              <text x="35" y="${y + 10}" font-size="11" font-weight="600" font-family="sans-serif" fill="#1C2024">${item.name}</text>
              <text x="560" y="${y + 10}" font-size="11" font-weight="800" font-family="monospace" fill="${item.color}">${item.contrib} Contribution</text>
            </g>
          `;
        }).join('');

        return `
          <svg viewBox="0 0 660 130" class="inline-asst-svg">
            ${rows}
          </svg>
        `;
      }

      if (chartData.type === 'priority_ranked_bars') {
        const rows = chartData.items.map((item, i) => {
          const y = 16 + i * 36;
          return `
            <g>
              <rect x="15" y="${y}" width="28" height="22" rx="4" fill="${item.color}" />
              <text x="29" y="${y + 15}" font-size="11" font-weight="800" font-family="monospace" text-anchor="middle" fill="#FFFFFF">${item.rank}</text>
              <text x="54" y="${y + 15}" font-size="12" font-weight="700" font-family="sans-serif" fill="#102A43">${item.asset}</text>
              <text x="440" y="${y + 15}" font-size="11" font-weight="700" font-family="monospace" fill="#9A4D00">Lead: ${item.leadTime}</text>
              <text x="560" y="${y + 15}" font-size="11" font-weight="800" font-family="monospace" fill="#B42318">${item.loss}</text>
            </g>
          `;
        }).join('');

        return `
          <svg viewBox="0 0 660 130" class="inline-asst-svg">
            ${rows}
          </svg>
        `;
      }

      if (chartData.type === 'evidence_timeline_strip') {
        const events = chartData.events.map((ev, i) => {
          const x = 35 + i * 105;
          return `
            <g>
              <circle cx="${x + 20}" cy="50" r="6" fill="#EF7B7B" />
              <text x="${x + 20}" y="32" font-size="10" font-weight="800" font-family="monospace" text-anchor="middle" fill="#102A43">${ev.date}</text>
              <text x="${x + 20}" y="42" font-size="8.5" font-weight="700" font-family="monospace" text-anchor="middle" fill="#486581">${ev.type}</text>
              <foreignObject x="${x - 20}" y="65" width="80" height="60">
                <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:9px; color:#243B53; line-height:1.2; text-align:center;">
                  ${ev.desc}
                </div>
              </foreignObject>
            </g>
          `;
        }).join('');

        return `
          <svg viewBox="0 0 660 130" class="inline-asst-svg">
            <line x1="45" y1="50" x2="600" y2="50" stroke="#D9E2EC" stroke-width="2" stroke-dasharray="4 4" />
            ${events}
          </svg>
        `;
      }

      return '';
    }

    openEvidenceModal(ref) {
      if (!this.dom.evidenceModal) return;
      if (this.dom.evidenceModalTitle) this.dom.evidenceModalTitle.textContent = ref.title;
      if (this.dom.evidenceModalSource) this.dom.evidenceModalSource.textContent = `${ref.type} • Source: ${ref.source}`;
      if (this.dom.evidenceModalBody) {
        this.dom.evidenceModalBody.innerHTML = `
          <div class="evidence-modal-inner">
            <div class="evidence-quote-box">
              <span class="quote-label font-mono">VERBATIM RECORD EXTRACT:</span>
              <p class="quote-content font-mono">"${ref.snippet}"</p>
            </div>
            <div class="evidence-context-box">
              <span class="context-label font-mono">CROSS-SILO CORROBORATION CONTEXT:</span>
              <p class="context-text">${ref.fullDetail}</p>
            </div>
            <div class="evidence-modal-actions font-mono">
              <a href="evidence.html" class="btn-modal-link">Open in Evidence Graph &rarr;</a>
              <a href="map.html" class="btn-modal-link">Locate on Signal Map &rarr;</a>
            </div>
          </div>
        `;
      }
      this.dom.evidenceModal.classList.add('active');
    }

    closeEvidenceModal() {
      if (this.dom.evidenceModal) {
        this.dom.evidenceModal.classList.remove('active');
      }
    }

    clearThread() {
      if (!this.dom.feed) return;
      this.dom.feed.innerHTML = '';
      this.renderInitialWelcome();
    }

    exportBriefing() {
      const activeQueries = this.history.map(h => `- [${h.category}] ${h.query} (${h.timestamp})`).join('\n');
      const briefingReport = `# EarlySight Operational Intelligence Briefing\n\n` +
        `**Facility:** Advanced Manufacturing Quad — Facility 04\n` +
        `**Date:** ${new Date().toLocaleString()}\n` +
        `**Active Telemetry Signals:** 54 Live\n` +
        `**Active Critical Alerts:** 2 (EW-2026-088, EW-2026-094)\n` +
        `**Averted Downtime Loss (2026):** $2,840,000\n\n` +
        `## Recent Operations Copilot Investigations\n` +
        `${activeQueries}\n\n` +
        `## Active Alert Summary\n` +
        `- **Alert EW-2026-088**: Sub-Slab Pressurized Water Seepage on Flange 4B-12 (Block A Trench 4B). Lead time: 14.2 Days. Confidence: 87%. Potential loss: $512,000.\n` +
        `- **Alert EW-2026-094**: Hydraulic Proportional Valve Cavitation Drift (Block C Press Station #2). Lead time: 12.0 Days. Confidence: 91.2%. Potential loss: $340,000.\n\n` +
        `Generated by EarlySight AI Assistant Copilot (Stage 9).\n`;

      try {
        const blob = new Blob([briefingReport], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EarlySight-Briefing-${new Date().toISOString().slice(0,10)}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.warn('Download error, falling back to alert', err);
      }
      alert(`[EarlySight Intelligence Briefing Generated & Downloaded]\n\nFacility: Facility 04\nSignals: 54 Live\nAlerts: EW-2026-088, EW-2026-094\n\nA markdown briefing dossier has been downloaded.`);
    }

    scrollToBottom() {
      if (!this.dom.feed) return;
      setTimeout(() => {
        this.dom.feed.scrollTop = this.dom.feed.scrollHeight;
      }, 50);
    }

    escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    window.earlySightAiAssistant = new EarlySightAIAssistant();
  });

})();
