import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        signals: resolve(__dirname, 'signals.html'),
        risks: resolve(__dirname, 'risks.html'),
        map: resolve(__dirname, 'map.html'),
        timeline: resolve(__dirname, 'timeline.html'),
        actions: resolve(__dirname, 'actions.html'),
        copilot: resolve(__dirname, 'copilot.html'),
        evidence: resolve(__dirname, 'evidence.html'),
        impact: resolve(__dirname, 'impact.html'),
        workspace: resolve(__dirname, 'workspace.html'),
        organizations: resolve(__dirname, 'organizations.html'),
      },
    },
  },
});
