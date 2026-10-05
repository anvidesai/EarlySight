/**
 * EarlySight — Stage 14 Animation & Micro-Interactions System
 * 
 * Provides purposeful, fast, smooth, and professional micro-interactions:
 * 1. Smooth page transitions
 * 2. Viewport fade/slide reveals with staggered cascades
 * 3. Smooth animated numeric counters (preserving currency, decimals, signs & units)
 * 4. Animated SVG stroke-drawing and chart bar reveals
 * 5. Subtle node connection vector flows
 * 6. Card & row hover elevation with active press feedback
 * 7. Snappy button micro-interactions
 * 8. Loading skeleton states with shimmer gradient
 * 9. Notification toasts and organic breathing badges
 * 10. Timeline stepper scaling & progress filling
 * 11. Smooth filtering for signal cards and tables
 * 12. Modal backdrop & scale-in dialog transitions
 * 
 * STRICT STANDARDS:
 * - No excessive bouncing, spinning, flashing, neon glows, particles, or 3D tilts.
 * - Respects prefers-reduced-motion.
 */

(function () {
  'use strict';

  class EarlySightMotionEngine {
    constructor() {
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.countersAnimated = new WeakSet();
      this.pathsAnimated = new WeakSet();
      this.observer = null;
      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.boot());
      } else {
        this.boot();
      }

      // Listen for reduced motion system preference changes
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        this.isReducedMotion = e.matches;
      });
    }

    boot() {
      // 1. Smooth Page Entrance
      requestAnimationFrame(() => {
        document.body.classList.add('page-loaded');
      });

      // 2. Initialize IntersectionObserver for Viewport Reveals
      this.setupIntersectionObserver();

      // 3. Mark and attach reveals to elements
      this.attachScrollReveals();

      // 4. Attach animated SVG paths
      this.setupSvgPathAnimations();

      // 5. Attach button and interactive card press feedback
      this.attachButtonInteractions();

      // 6. Connect Smooth Filtering hooks
      this.setupSmoothFiltering();

      // 7. Enhance Modal Transitions
      this.setupModalTransitions();

      // 8. Attach connection vector flows
      this.setupNodeConnectionFlows();

      // Expose globally
      window.EarlySightMotion = this;
    }

    /**
     * 1. Viewport Scroll Reveals
     */
    setupIntersectionObserver() {
      if (this.isReducedMotion || !('IntersectionObserver' in window)) {
        // Fallback: reveal immediately
        document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
        return;
      }

      const options = {
        root: null,
        rootMargin: '0px 0px -30px 0px',
        threshold: 0.08
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            target.classList.add('is-revealed');

            // Check if element contains animated counters
            this.triggerCountersInside(target);

            // Check if element contains SVG paths to draw
            this.triggerSvgPathsInside(target);

            // Check if element has animated progress bars
            this.triggerProgressBarsInside(target);

            // Once revealed, unobserve to free memory
            this.observer.unobserve(target);
          }
        });
      }, options);
    }

    attachScrollReveals() {
      // Key sections and containers to reveal smoothly
      const selectors = [
        '.metric-card',
        '.risk-card',
        '.signal-card',
        '.step-card',
        '.dim-item',
        '.hist-card',
        '.action-card',
        '.action-kpi-card',
        '.org-card-box',
        '.freq-kpi-card',
        '.evidence-card',
        '.impact-chart-card',
        '.ledger-table-container',
        '.dashboard-grid > div',
        '.section-block-header'
      ];

      const elements = document.querySelectorAll(selectors.join(', '));
      elements.forEach((el, index) => {
        if (!el.classList.contains('reveal-on-scroll')) {
          el.classList.add('reveal-on-scroll');
          // Add subtle stagger to siblings
          const staggerIndex = (index % 6) + 1;
          el.classList.add(`stagger-${staggerIndex}`);
        }
        if (this.observer) {
          this.observer.observe(el);
        } else {
          el.classList.add('is-revealed');
        }
      });
    }

    /**
     * 2. Smooth Animated Counters
     * Counts up numbers without altering currency, signs, decimals or units
     */
    triggerCountersInside(container) {
      if (this.isReducedMotion) return;

      const counterSelectors = [
        '.metric-card-value',
        '.dim-value',
        '.step-card-metric-value',
        '.kpi-val',
        '.hist-card-stat',
        '.action-kpi-val',
        '.badge-count',
        '.evidence-factor-weight',
        '#valBeforeFreq',
        '#valAfterFreq',
        '#valBeforeMTBS',
        '#valAfterMTBS',
        '#dimFreqBefore',
        '#dimFreqAfter',
        '#heroSignalsCount'
      ];

      const targets = container.querySelectorAll(counterSelectors.join(', '));
      targets.forEach(el => this.animateSingleCounter(el));
    }

    animateSingleCounter(el) {
      if (this.countersAnimated.has(el)) return;
      const text = el.textContent.trim();

      // Extract number: match optional minus/arrow, followed by digits, commas, decimal point
      const match = text.match(/([^\d.-]*)([-+]?[0-9,]+(?:\.[0-9]+)?)(.*)/);
      if (!match) return;

      const prefix = match[1] || '';
      const rawNumStr = match[2];
      const suffix = match[3] || '';

      const cleanNumStr = rawNumStr.replace(/,/g, '');
      const targetVal = parseFloat(cleanNumStr);
      if (isNaN(targetVal)) return;

      const hasCommas = rawNumStr.includes(',');
      const decimals = cleanNumStr.includes('.') ? cleanNumStr.split('.')[1].length : 0;

      this.countersAnimated.add(el);
      el.classList.add('counter-animate');

      const duration = 650; // ms
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Clean ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = targetVal * ease;

        let formattedNum = currentVal.toFixed(decimals);
        if (hasCommas) {
          const parts = formattedNum.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          formattedNum = parts.join('.');
        }

        el.textContent = `${prefix}${formattedNum}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // Final exact value
          let finalNum = targetVal.toFixed(decimals);
          if (hasCommas) {
            const parts = finalNum.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            finalNum = parts.join('.');
          }
          el.textContent = `${prefix}${finalNum}${suffix}`;
          el.classList.add('counter-pulse-highlight');
          setTimeout(() => el.classList.remove('counter-pulse-highlight'), 400);
        }
      };

      requestAnimationFrame(update);
    }

    /**
     * 3. Animated SVG Vector Paths & Chart Lines
     */
    setupSvgPathAnimations() {
      if (this.isReducedMotion) return;

      const pathSelectors = [
        '#trendPathBefore',
        '#trendPathAfter',
        '#trendPathBaseline',
        '.evidence-flow-canvas path',
        '.flow-svg-line',
        '.sparkline-line'
      ];

      const paths = document.querySelectorAll(pathSelectors.join(', '));
      paths.forEach(path => {
        if (!path.classList.contains('animated-svg-path')) {
          path.classList.add('animated-svg-path');
          try {
            const length = path.getTotalLength ? path.getTotalLength() : 800;
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
          } catch (e) {
            // In case path is not yet rendered in DOM
          }
        }
      });
    }

    triggerSvgPathsInside(container) {
      if (this.isReducedMotion) return;

      const paths = container.querySelectorAll('.animated-svg-path');
      paths.forEach(path => {
        if (!this.pathsAnimated.has(path)) {
          this.pathsAnimated.add(path);
          try {
            const length = path.getTotalLength ? path.getTotalLength() : 800;
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            // Trigger draw in next frame
            requestAnimationFrame(() => {
              path.classList.add('drawn');
            });
          } catch (e) {
            path.classList.add('drawn');
          }
        }
      });
    }

    triggerProgressBarsInside(container) {
      const bars = container.querySelectorAll('.modality-frequency-bars-container .freq-modality-fill, .animated-fill-width');
      bars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width') || bar.style.width;
        if (targetWidth) {
          bar.style.setProperty('--target-width', targetWidth);
          bar.classList.add('animated-fill-width');
          requestAnimationFrame(() => {
            bar.classList.add('filled');
          });
        }
      });
    }

    /**
     * 4. Button & Interactive Element Micro-Press
     */
    attachButtonInteractions() {
      const interactiveSelectors = [
        'button',
        '.btn',
        '.btn-modal-primary',
        '.btn-modal-secondary',
        '.sidebar-nav-item',
        '.tab-btn',
        '.view-switch-btn',
        '.filter-chip'
      ];

      document.addEventListener('pointerdown', (e) => {
        const target = e.target.closest(interactiveSelectors.join(', '));
        if (target) {
          target.style.transform = 'scale(0.985)';
        }
      }, { passive: true });

      const resetScale = (e) => {
        const target = e.target.closest(interactiveSelectors.join(', '));
        if (target) {
          target.style.transform = '';
        }
      };

      document.addEventListener('pointerup', resetScale, { passive: true });
      document.addEventListener('pointercancel', resetScale, { passive: true });

    }
    /**
     * 5. Smooth Filtering Integration
     */
    setupSmoothFiltering() {
      // Connect to search inputs to provide smooth fade-out and slide-in for filtered rows/cards
      const searchInputs = document.querySelectorAll('#signalSearchInput, #actionsSearchInput, #workspaceSearchInput');
      searchInputs.forEach(input => {
        input.addEventListener('input', () => {
          // Slight debounce transition
          const cards = document.querySelectorAll('.signal-card, .action-card, .ledger-table tbody tr');
          cards.forEach(card => {
            if (card.style.display === 'none' && !card.classList.contains('is-filtering-out')) {
              card.classList.add('is-filtering-out');
            } else if (card.style.display !== 'none') {
              card.classList.remove('is-filtering-out');
            }
          });
        }, { passive: true });
      });
    }

    /**
     * 6. Enhanced Modal Transitions
     */
    setupModalTransitions() {
      const modals = document.querySelectorAll('.modal-overlay, .audit-modal-overlay, .ai-evidence-modal');
      modals.forEach(modal => {
        modal.style.transition = 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
        const content = modal.querySelector('.modal-content, .audit-modal-content, .ai-evidence-dialog');
        if (content) {
          content.style.transition = 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1)';
        }
      });
    }

    /**
     * 7. Node Connection Vector Flows (Evidence Graph & Signal Pipeline)
     */
    setupNodeConnectionFlows() {
      const flowVectors = document.querySelectorAll('#evidenceFlowSvg path, .flow-arrow-down');
      flowVectors.forEach(vec => {
        vec.classList.add('connection-flow-dash');
      });
    }

    /**
     * 8. Loading Skeleton Simulation Utility
     * Replaces an element's children with shimmer skeleton boxes and gracefully restores
     */
    simulateSkeleton(containerSelector, durationMs = 800, onDone = null) {
      const container = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
      if (!container) return;

      const originalHtml = container.innerHTML;
      const originalDisplay = container.style.display;

      container.innerHTML = `
        <div class="skeleton-box" style="width: 100%; height: 60px; margin-bottom: 12px;"></div>
        <div class="skeleton-text" style="width: 80%; height: 16px;"></div>
        <div class="skeleton-text" style="width: 60%; height: 16px;"></div>
      `;

      setTimeout(() => {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          container.innerHTML = originalHtml;
          container.style.opacity = '1';
          if (onDone) onDone();
        }, 200);
      }, durationMs);
    }

    /**
     * Replays all reveal animations and counters on command
     */
    replayReveals() {
      this.countersAnimated = new WeakSet();
      this.pathsAnimated = new WeakSet();

      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach(el => {
        el.classList.remove('is-revealed');
      });

      setTimeout(() => {
        elements.forEach(el => {
          el.classList.add('is-revealed');
          this.triggerCountersInside(el);
          this.triggerSvgPathsInside(el);
          this.triggerProgressBarsInside(el);
        });
      }, 50);
    }

    toggleReducedMotion(forceVal) {
      this.isReducedMotion = forceVal !== undefined ? forceVal : !this.isReducedMotion;
      if (this.isReducedMotion) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }
      return this.isReducedMotion;
    }
  }

  // Instantiate motion engine
  new EarlySightMotionEngine();

})();
