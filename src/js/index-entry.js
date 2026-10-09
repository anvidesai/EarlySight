/**
 * EarlySight — Official Homepage Entry (Premium Pastel Enterprise)
 */
import '../styles/styles.css';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hash redirection to main operational dashboard if requested
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('dashboard') || hash.includes('maindashboardsection')) {
    window.location.href = 'dashboard.html' + window.location.hash;
    return;
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('homeMobileToggle');
  const mobileMenu = document.getElementById('homeMobileMenu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isExpanded = mobileMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // 3. Interactive Demo Modal
  const btnWatchDemo = document.getElementById('btnWatchDemo');
  const demoModal = document.getElementById('homeDemoModal');
  const demoClose = document.getElementById('homeDemoClose');
  const demoTabs = document.querySelectorAll('.demo-stage-tab');
  const demoPanels = document.querySelectorAll('.demo-stage-panel');

  if (btnWatchDemo && demoModal) {
    btnWatchDemo.addEventListener('click', (e) => {
      e.preventDefault();
      demoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (demoClose && demoModal) {
    demoClose.addEventListener('click', () => {
      demoModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        demoModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.classList.contains('active')) {
        demoModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Demo Modal Tabs
  if (demoTabs.length > 0) {
    demoTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const stage = tab.getAttribute('data-stage');
        demoTabs.forEach(t => {
          t.classList.remove('active');
          t.style.background = '#FFFFFF';
          t.style.color = 'var(--home-text-body)';
          t.style.borderColor = 'var(--home-border)';
        });
        demoPanels.forEach(p => {
          p.classList.remove('active');
          p.style.display = 'none';
        });
        tab.classList.add('active');
        tab.style.background = 'var(--home-pale-aqua)';
        tab.style.color = 'var(--home-primary-teal)';
        tab.style.borderColor = 'rgba(8,126,139,0.3)';
        const targetPanel = document.getElementById('demoPanel_' + stage);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.style.display = 'block';
        }
      });
    });
  }

  // 4. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
});

