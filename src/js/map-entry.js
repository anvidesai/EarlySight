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
  
  // Toggle hotspots
  const btnToggleHotspots = document.getElementById('btnToggleHotspots');
  const mapHotspotsCollapsible = document.getElementById('mapHotspotsCollapsible');
  const toggleHotspotsBtnText = document.getElementById('toggleHotspotsBtnText');
  if (btnToggleHotspots && mapHotspotsCollapsible) {
    btnToggleHotspots.addEventListener('click', () => {
      const isHidden = mapHotspotsCollapsible.style.display === 'none';
      mapHotspotsCollapsible.style.display = isHidden ? 'block' : 'none';
      if (toggleHotspotsBtnText) {
        toggleHotspotsBtnText.textContent = isHidden ? 'Hide Hotspots' : 'Zone Hotspots';
      }
      if (isHidden) {
        mapHotspotsCollapsible.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Modal close listener
  const modal = document.getElementById('signalModal');
  const closeBtn = document.getElementById('modalClose');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // Initial focus: check for URL parameter ?zone=, otherwise default to Block A
  setTimeout(() => {
    const zones = typeof FACILITY_MAP_ZONES !== 'undefined' ? FACILITY_MAP_ZONES : window.FACILITY_MAP_ZONES;
    if (zones && window.signalMapEngine) {
      const urlParams = new URLSearchParams(window.location.search);
      const requestedZoneId = urlParams.get('zone');
      const targetZone = requestedZoneId ? zones.find(z => z.id === requestedZoneId) : zones.find(z => z.id === 'block-a');
      if (targetZone) {
        window.signalMapEngine.focusAndInspectZone(targetZone.id);
      }
    }
  }, 350);
});
