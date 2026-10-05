/**
 * EarlySight — Interactive Signal Map Page Entry
 */
import '../styles/styles.css';
import '../data/signals-data.js';
import '../data/dashboard-data.js';
import { FACILITY_MAP_ZONES } from '../data/signal-map-data.js';
import { EarlySightSignalMap } from './signal-map.js';
import './dashboard.js';
import './global-nav.js';
import './micro-interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  window.signalMapEngine = new EarlySightSignalMap('facilityMapCanvas', 'signalMapWrapper');
  
  // Modal close listener
  const modal = document.getElementById('signalModal');
  const closeBtn = document.getElementById('modalClose');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // Initial focus: if anchor block A exists, open its revelation drawer after 400ms for immediate impact
  setTimeout(() => {
    const zones = typeof FACILITY_MAP_ZONES !== 'undefined' ? FACILITY_MAP_ZONES : window.FACILITY_MAP_ZONES;
    if (zones) {
      const blockA = zones.find(z => z.id === 'block-a');
      if (blockA && window.signalMapEngine) {
        window.signalMapEngine.revealClusterDetails(blockA);
      }
    }
  }, 400);
});
