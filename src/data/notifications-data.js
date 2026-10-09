/**
 * EarlySight — Notifications & System Health Mock Data (Milestone 10)
 *
 * Provides realistic mock telemetry for operational monitoring, alerts,
 * data source health, intelligence pipelines, data freshness, and system events.
 */

export const HEALTH_METRICS = {
  overallHealth: { value: '98.4%', status: 'Operational', stateClass: 'status-healthy' },
  dataSources: { value: '12 / 12', status: 'Connected', stateClass: 'status-healthy' },
  pipelineHealth: { value: '6 / 6', status: 'Healthy', stateClass: 'status-healthy' },
  dataFreshness: { value: '98%', status: 'Within SLA', stateClass: 'status-healthy' },
  activeAlerts: { value: '04', status: 'Attention', stateClass: 'status-attention' },
  lastSync: { value: '2 min ago', status: 'Healthy', stateClass: 'status-healthy' }
};

export const DEMO_SYSTEM_STATES = {
  operational: {
    name: 'Operational',
    statusBadge: 'SYSTEM STATUS // OPERATIONAL',
    badgeClass: 'badge-healthy',
    overallHealth: '98.4%',
    overallStatus: 'Operational',
    dataSources: '12 / 12',
    sourcesStatus: 'Connected',
    pipelineHealth: '6 / 6',
    pipelineStatus: 'Healthy',
    dataFreshness: '98%',
    freshnessStatus: 'Within SLA',
    activeAlerts: '04',
    alertsStatus: 'Nominal',
    lastSync: '2 min ago',
    description: 'All 8 core intelligence components, 12 data sources, and 9 pipeline stages are operating within normal SLA latency tolerances.'
  },
  attention: {
    name: 'Attention Required',
    statusBadge: 'SYSTEM STATUS // ATTENTION REQUIRED',
    badgeClass: 'badge-attention',
    overallHealth: '91.2%',
    overallStatus: 'Attention Required',
    dataSources: '11 / 12',
    sourcesStatus: '1 Delayed',
    pipelineHealth: '5 / 6',
    pipelineStatus: 'Attention',
    dataFreshness: '89%',
    freshnessStatus: 'Delayed',
    activeAlerts: '06',
    alertsStatus: 'Attention',
    lastSync: '4 min ago',
    description: 'Optical image OCR ingestion latency elevated (+280ms). Operator review recommended for Document ingestion gateway.'
  },
  degraded: {
    name: 'Degraded',
    statusBadge: 'SYSTEM STATUS // DEGRADED',
    badgeClass: 'badge-degraded',
    overallHealth: '78.5%',
    overallStatus: 'Degraded',
    dataSources: '9 / 12',
    sourcesStatus: '3 Degraded',
    pipelineHealth: '4 / 6',
    pipelineStatus: 'Degraded',
    dataFreshness: '76%',
    freshnessStatus: 'Stale',
    activeAlerts: '09',
    alertsStatus: 'Action Needed',
    lastSync: '12 min ago',
    description: 'Evidence synthesis pipeline latency > 850ms. Telemetry queue buffering in Utility Zone and Bay 4. Freshness fallen below SLA.'
  }
};

export const SYSTEM_COMPONENTS = [
  {
    id: 'comp-ingestion',
    name: 'Signal Ingestion',
    status: 'Healthy',
    statusClass: 'status-healthy',
    lastUpdate: '14 sec ago',
    latency: '182 ms',
    throughput: '48 ev/s',
    stateDesc: 'Continuous Kafka-style stream indexing',
    category: 'Ingress'
  },
  {
    id: 'comp-pattern',
    name: 'Pattern Detection',
    status: 'Healthy',
    statusClass: 'status-healthy',
    lastUpdate: '42 sec ago',
    latency: '264 ms',
    throughput: '06 active clusters',
    stateDesc: 'Multi-variable 72h correlation window active',
    category: 'Analysis'
  },
  {
    id: 'comp-risk',
    name: 'Risk Engine',
    status: 'Healthy',
    statusClass: 'status-healthy',
    lastUpdate: '1 min ago',
    latency: '310 ms',
    throughput: '04 active hazards',
    stateDesc: 'Bayesian synthesis & severity recalculation',
    category: 'Intelligence'
  },
  {
    id: 'comp-evidence',
    name: 'Evidence Processing',
    status: 'Healthy',
    statusClass: 'status-healthy',
    lastUpdate: '2 min ago',
    latency: '195 ms',
    throughput: '87% mean coherence',
    stateDesc: '18 causal chains indexed with graph verification',
    category: 'Explainability'
  },
  {
    id: 'comp-action',
    name: 'Action Tracking',
    status: 'Healthy',
    statusClass: 'status-healthy',
    lastUpdate: '3 min ago',
    latency: '120 ms',
    throughput: '19 open actions',
    stateDesc: 'Closed-loop verification & SLA dispatch active',
    category: 'Resolution'
  },
  {
    id: 'comp-copilot',
    name: 'AI Copilot',
    status: 'Healthy',
    statusClass: 'status-healthy',
    lastUpdate: '5 min ago',
    latency: '420 ms',
    throughput: '128 signals context',
    stateDesc: 'Operational context cache primed and validated',
    category: 'Assistant'
  },
  {
    id: 'comp-timeline',
    name: 'Timeline Processing',
    status: 'Healthy',
    statusClass: 'status-healthy',
    lastUpdate: '2 min ago',
    latency: '215 ms',
    throughput: '04 lifecycles',
    stateDesc: 'Precursor failure trajectory forecasting stable',
    category: 'Temporal'
  },
  {
    id: 'comp-map',
    name: 'Map Intelligence',
    status: 'Healthy',
    statusClass: 'status-healthy',
    lastUpdate: '3 min ago',
    latency: '175 ms',
    throughput: '04 facility zones',
    stateDesc: 'Spatial cluster coordinate aggregation nominal',
    category: 'Spatial'
  }
];

export const DATA_SOURCES = [
  {
    id: 'src-complaint',
    source: 'Complaint',
    category: 'Operational Voice',
    status: 'Connected',
    statusClass: 'status-healthy',
    lastSync: '2 min ago',
    recordsToday: 24,
    freshness: '99%',
    protocol: 'REST / Webhook',
    details: 'Tenant feedback and facility service requests'
  },
  {
    id: 'src-maint',
    source: 'Maintenance Report',
    category: 'CMMS / Work Orders',
    status: 'Connected',
    statusClass: 'status-healthy',
    lastSync: '4 min ago',
    recordsToday: 18,
    freshness: '97%',
    protocol: 'SAP / Maximo Sync',
    details: 'Technician shift logs, inspection checklists & punch items'
  },
  {
    id: 'src-sensor',
    source: 'Sensor',
    category: 'IoT Telemetry',
    status: 'Connected',
    statusClass: 'status-healthy',
    lastSync: '18 sec ago',
    recordsToday: 62,
    freshness: '100%',
    protocol: 'MQTT / OPC-UA',
    details: 'Vibration (28Hz), thermal IR, flow rate & pressure sensors'
  },
  {
    id: 'src-image',
    source: 'Image',
    category: 'Visual & Thermal',
    status: 'Connected',
    statusClass: 'status-healthy',
    lastSync: '6 min ago',
    recordsToday: 11,
    freshness: '95%',
    protocol: 'Blob Ingestion',
    details: 'Thermographic scans, acoustic camera captures & site photos'
  },
  {
    id: 'src-document',
    source: 'Document',
    category: 'PDF & Standards',
    status: 'Connected',
    statusClass: 'status-healthy',
    lastSync: '8 min ago',
    recordsToday: 7,
    freshness: '93%',
    protocol: 'Document Parser',
    details: 'OEM equipment manuals, engineering P&IDs & vendor certs'
  },
  {
    id: 'src-incident',
    source: 'Incident Report',
    category: 'EHS / Safety Audit',
    status: 'Connected',
    statusClass: 'status-healthy',
    lastSync: '3 min ago',
    recordsToday: 6,
    freshness: '98%',
    protocol: 'Audit Gateway',
    details: 'Near-miss filings, safety observations & OSHA compliance logs'
  }
];

export const ALERT_PRIORITIES = {
  critical: 2,
  high: 5,
  medium: 9,
  low: 14,
  resolved: 21
};

export const DATA_FRESHNESS = [
  { domain: 'Signals', freshness: '98%', lastSync: '2 min ago', status: 'Within SLA', statusClass: 'status-healthy' },
  { domain: 'Patterns', freshness: '96%', lastSync: '4 min ago', status: 'Within SLA', statusClass: 'status-healthy' },
  { domain: 'Risks', freshness: '99%', lastSync: '3 min ago', status: 'Within SLA', statusClass: 'status-healthy' },
  { domain: 'Evidence', freshness: '94%', lastSync: '7 min ago', status: 'Within SLA', statusClass: 'status-healthy' },
  { domain: 'Actions', freshness: '97%', lastSync: '5 min ago', status: 'Within SLA', statusClass: 'status-healthy' },
  { domain: 'Timeline', freshness: '99%', lastSync: '2 min ago', status: 'Within SLA', statusClass: 'status-healthy' },
  { domain: 'Map', freshness: '98%', lastSync: '3 min ago', status: 'Within SLA', statusClass: 'status-healthy' },
  { domain: 'Copilot Context', freshness: '95%', lastSync: '6 min ago', status: 'Within SLA', statusClass: 'status-healthy' }
];

export const PIPELINE_STAGES = [
  { step: '01', name: 'SOURCE', status: 'Healthy', lastProcessed: '8 sec', statusClass: 'status-healthy' },
  { step: '02', name: 'INGESTION', status: 'Healthy', lastProcessed: '14 sec', statusClass: 'status-healthy' },
  { step: '03', name: 'NORMALIZATION', status: 'Healthy', lastProcessed: '22 sec', statusClass: 'status-healthy' },
  { step: '04', name: 'RELATIONSHIP', status: 'Healthy', lastProcessed: '35 sec', statusClass: 'status-healthy' },
  { step: '05', name: 'PATTERN', status: 'Healthy', lastProcessed: '42 sec', statusClass: 'status-healthy' },
  { step: '06', name: 'RISK', status: 'Healthy', lastProcessed: '1 min', statusClass: 'status-healthy' },
  { step: '07', name: 'EVIDENCE', status: 'Healthy', lastProcessed: '2 min', statusClass: 'status-healthy' },
  { step: '08', name: 'ACTION', status: 'Healthy', lastProcessed: '3 min', statusClass: 'status-healthy' },
  { step: '09', name: 'COPILOT', status: 'Healthy', lastProcessed: '6 min', statusClass: 'status-healthy' }
];

export const SYSTEM_EVENTS = [
  {
    time: '14:42',
    title: 'Sensor ingestion synchronized',
    details: '12 sources processed • 0 frame loss • 182ms avg latency',
    badge: 'INGESTION',
    type: 'system'
  },
  {
    time: '14:38',
    title: 'Pattern analysis completed',
    details: '06 clusters updated • PAT-006 recurrence score revalidated',
    badge: 'ANALYSIS',
    type: 'pattern'
  },
  {
    time: '14:31',
    title: 'Risk scores recalculated',
    details: '04 emerging risks evaluated • RSK-001 updated to Score 86 (P1)',
    badge: 'RISK',
    type: 'risk'
  },
  {
    time: '14:24',
    title: 'Evidence registry synchronized',
    details: '18 records indexed • Causal graph confidence at 87%',
    badge: 'EVIDENCE',
    type: 'evidence'
  },
  {
    time: '14:18',
    title: 'Action verification updated',
    details: '03 actions awaiting verification • ACT-003 status advanced',
    badge: 'ACTION',
    type: 'action'
  },
  {
    time: '14:10',
    title: 'Copilot context refreshed',
    details: '128 signals available • Cross-silo correlation cache rebuilt',
    badge: 'COPILOT',
    type: 'copilot'
  },
  {
    time: '13:55',
    title: 'Temporal partition verified',
    details: '14-day lookback cycle closed • Failure trajectory index intact',
    badge: 'TIMELINE',
    type: 'temporal'
  },
  {
    time: '13:40',
    title: 'Spatial coordinate alignment completed',
    details: '04 facility zones mapped • Trench 4B micro-cluster confirmed',
    badge: 'MAP',
    type: 'spatial'
  }
];

export const NOTIFICATIONS_DATA = [
  {
    id: 'NOTIF-001',
    severity: 'Critical',
    category: 'Critical',
    title: 'Switchgear Busbar Thermal Overload reached P1 priority.',
    explanation: 'Thermal IR and current imbalance sensors detected joint delta-T > 28°C on Power Island Bus 3B.',
    timestamp: '2 min ago',
    exactTime: '14:46',
    timeFilter: '24h',
    location: 'Power Island / Bus 3B',
    unread: true,
    relatedEntity: 'RSK-003',
    event: {
      whatHappened: 'Infrared thermography scan and Phase B current telemetry detected an escalating thermal divergence (+28.4°C over ambient). The Bayesian risk model elevated hazard RSK-003 from High to Critical P1.',
      whyItMatters: 'If unchecked, continuous thermal escalation will cause busbar insulation breakdown and catastrophic arc flash in 6.4 days, resulting in total fab power cutoff.',
      relatedIntelligence: {
        signalId: 'SIG-042',
        patternId: 'PAT-003',
        riskId: 'RSK-003',
        evidenceId: 'EVD-044',
        actionId: 'ACT-002',
        zone: 'power-island'
      },
      recommendedNextStep: 'Deploy high-voltage thermographer for calibrated radiometric scan and execute bolt torque recalibration on Busbar 3B.'
    }
  },
  {
    id: 'NOTIF-002',
    severity: 'High',
    category: 'Risk',
    title: 'Water Infrastructure Degradation increased from 74 → 86.',
    explanation: 'Sub-slab acoustic leak telemetry and moisture alarms converged in Block A / Trench 4B with +320% frequency increase.',
    timestamp: '18 min ago',
    exactTime: '14:30',
    timeFilter: '24h',
    location: 'Block A / Trench 4B',
    unread: true,
    relatedEntity: 'RSK-001',
    event: {
      whatHappened: '14 related weak signals over 4 days converged across acoustic flow sensors, maintenance work order complaints, and pipe pressure logs, elevating the hazard score to 86/100.',
      whyItMatters: 'Persistent water egress beneath foundation slab risks soil wash-out, differential slab settlement, and flooding of sensitive cable trenches.',
      relatedIntelligence: {
        signalId: 'SIG-031',
        patternId: 'PAT-006',
        riskId: 'RSK-001',
        evidenceId: 'EVD-033',
        actionId: 'ACT-001',
        zone: 'block-a'
      },
      recommendedNextStep: 'Authorize emergency sub-slab endoscopic camera inspection and verify expansion joint flange 4B gasket integrity.'
    }
  },
  {
    id: 'NOTIF-003',
    severity: 'Medium',
    category: 'Action',
    title: 'ACT-003 is awaiting resolution verification.',
    explanation: 'Harmonic line reactor installed on Assembly Bay 4 Drive Feeder; post-intervention telemetry decay requires sign-off.',
    timestamp: '31 min ago',
    exactTime: '14:17',
    timeFilter: '24h',
    location: 'Assembly Bay 4',
    unread: true,
    relatedEntity: 'ACT-003',
    event: {
      whatHappened: 'Lead electrical technician completed installation of line choke reactor (WO-IND-9912). EarlySight automated monitor is verifying vibration frequency attenuation.',
      whyItMatters: 'Harmonic resonance must drop below 2.4 mm/s RMS to prevent premature bearing race pitting and stator winding failure in VFD motors.',
      relatedIntelligence: {
        signalId: 'SIG-012',
        patternId: 'PAT-002',
        riskId: 'RSK-002',
        evidenceId: 'EVD-012',
        actionId: 'ACT-003',
        zone: 'assembly-bay'
      },
      recommendedNextStep: 'Review 48-hour post-action telemetry graph in Impact Resolution workspace and close work order.'
    }
  },
  {
    id: 'NOTIF-004',
    severity: 'Low',
    category: 'Evidence',
    title: 'New maintenance report strengthened PAT-006 evidence chain.',
    explanation: 'Technician inspection log entered for Trench 4B flange seal; evidence confidence rose from 81% → 87%.',
    timestamp: '42 min ago',
    exactTime: '14:06',
    timeFilter: '24h',
    location: 'Block A',
    unread: true,
    relatedEntity: 'PAT-006',
    event: {
      whatHappened: 'Document parser ingested maintenance log #M-2026-881 indicating recurring dampness and salt efflorescence along sub-floor trench wall.',
      whyItMatters: 'Provides physical corroboration for acoustic anomaly signals, elevating Bayesian causality confidence to 87%.',
      relatedIntelligence: {
        signalId: 'SIG-088',
        patternId: 'PAT-006',
        riskId: 'RSK-001',
        evidenceId: 'EVD-033',
        actionId: 'ACT-001',
        zone: 'block-a'
      },
      recommendedNextStep: 'Inspect evidence causal chain graph in Evidence workspace to verify multi-source alignment.'
    }
  },
  {
    id: 'NOTIF-005',
    severity: 'Low',
    category: 'System',
    title: 'Sensor ingestion latency returned to normal.',
    explanation: 'Telemetry stream broker recovered from temporary buffer queue; packet latency stabilized at 182 ms.',
    timestamp: '1 hr ago',
    exactTime: '13:48',
    timeFilter: '24h',
    location: 'Utility Zone',
    unread: false,
    relatedEntity: 'INGEST-01',
    event: {
      whatHappened: 'Utility Zone edge gateway re-synchronized buffer backlog following network interface card burst. All 62 active sensor channels returned to nominal throughput.',
      whyItMatters: 'Ensures real-time precursor signals arrive within the 1-second operational ingestion SLA without dropping micro-events.',
      relatedIntelligence: {
        signalId: 'SIG-005',
        patternId: 'PAT-001',
        riskId: 'RSK-003',
        evidenceId: 'EVD-044',
        actionId: 'ACT-002',
        zone: 'utility-zone'
      },
      recommendedNextStep: 'No action required. Telemetry health monitor has cleared transient warning flag.'
    }
  },
  {
    id: 'NOTIF-006',
    severity: 'Resolved',
    category: 'Resolved',
    title: 'Drive Feeder Failure Risk verification completed.',
    explanation: 'Signal decay exceeded 95% threshold across 72 hours; risk RSK-002 marked successfully mitigated.',
    timestamp: '2 hr ago',
    exactTime: '12:48',
    timeFilter: '24h',
    location: 'Assembly Bay 4',
    unread: false,
    relatedEntity: 'RSK-002',
    event: {
      whatHappened: 'Post-intervention monitoring confirmed VFD motor vibration dropped from 28.4 Hz flutter peak to baseline 4.1 Hz. Signal decay reached 95.2%.',
      whyItMatters: 'Demonstrates closed-loop resolution proof, preventing $142,000 in unscheduled production downtime and motor replacement costs.',
      relatedIntelligence: {
        signalId: 'SIG-012',
        patternId: 'PAT-002',
        riskId: 'RSK-002',
        evidenceId: 'EVD-012',
        actionId: 'ACT-003',
        zone: 'assembly-bay'
      },
      recommendedNextStep: 'Archive resolution audit report and log verified savings to ROI registry.'
    }
  },
  {
    id: 'NOTIF-007',
    severity: 'High',
    category: 'Risk',
    title: 'Clean Room Positive Pressure Depletion rate accelerating.',
    explanation: 'Differential air pressure across Airlock 2 falling at 0.4 Pa/hour; filter plenum bypass suspected.',
    timestamp: '4 hr ago',
    exactTime: '10:48',
    timeFilter: '24h',
    location: 'Clean Core / Fab 2',
    unread: false,
    relatedEntity: 'RSK-004',
    event: {
      whatHappened: 'Clean Room ISO Class 4 sensor cluster reported persistent negative trend in differential pressure across Airlock 2 doors and HEPA bank.',
      whyItMatters: 'Loss of positive pressure allows airborne particulate infiltration, jeopardizing semiconductor wafer yield.',
      relatedIntelligence: {
        signalId: 'SIG-019',
        patternId: 'PAT-004',
        riskId: 'RSK-004',
        evidenceId: 'EVD-019',
        actionId: 'ACT-004',
        zone: 'clean-core'
      },
      recommendedNextStep: 'Inspect intake pre-filter differential manometer and verify airlock seal magnetic latch alignment.'
    }
  },
  {
    id: 'NOTIF-008',
    severity: 'Medium',
    category: 'Action',
    title: 'ACT-001 field dispatch scheduled for tomorrow 08:00.',
    explanation: 'Reliability engineering team assigned work order for Block A sub-slab non-destructive testing.',
    timestamp: '6 hr ago',
    exactTime: '08:48',
    timeFilter: '24h',
    location: 'Block A',
    unread: false,
    relatedEntity: 'ACT-001',
    event: {
      whatHappened: 'Operations manager dispatched certified leak detection contractor with acoustic correlator and ground penetrating radar.',
      whyItMatters: 'Targeted early inspection resolves water egress before concrete slab voids require major structural remediation.',
      relatedIntelligence: {
        signalId: 'SIG-031',
        patternId: 'PAT-006',
        riskId: 'RSK-001',
        evidenceId: 'EVD-033',
        actionId: 'ACT-001',
        zone: 'block-a'
      },
      recommendedNextStep: 'Ensure safety permit and trench access authorization are signed by facility manager.'
    }
  },
  {
    id: 'NOTIF-009',
    severity: 'Low',
    category: 'Evidence',
    title: 'Acoustic frequency spectrum confirmed 18 kHz cavitation peak.',
    explanation: 'Spectral decomposition of sensor telemetry confirmed hydraulic micro-jet formation at Flange 4B-12.',
    timestamp: '1 day ago',
    exactTime: 'Yesterday 16:15',
    timeFilter: '7d',
    location: 'Block A / Trench 4B',
    unread: false,
    relatedEntity: 'EVD-033',
    event: {
      whatHappened: 'Digital signal processor completed high-frequency FFT decomposition, detecting steady 18.2 kHz acoustic signature typical of sub-surface fluid seepage.',
      whyItMatters: 'Rules out mechanical structural vibration and establishes turbulent fluid flow as the causal root mechanism.',
      relatedIntelligence: {
        signalId: 'SIG-031',
        patternId: 'PAT-006',
        riskId: 'RSK-001',
        evidenceId: 'EVD-033',
        actionId: 'ACT-001',
        zone: 'block-a'
      },
      recommendedNextStep: 'Review spectral FFT chart in Evidence Dossier.'
    }
  },
  {
    id: 'NOTIF-010',
    severity: 'Critical',
    category: 'Critical',
    title: 'Busbar thermal rise gradient exceeded 2.5°C/hr threshold.',
    explanation: 'Automated telemetry threshold alarm fired on Phase B joint; thermal acceleration warning active.',
    timestamp: '2 days ago',
    exactTime: '03 Oct • 11:20',
    timeFilter: '7d',
    location: 'Power Island / Bus 3B',
    unread: false,
    relatedEntity: 'RSK-003',
    event: {
      whatHappened: 'Phase B joint temperature jumped from 48.2°C to 54.1°C during peak production shift, initiating automatic P1 escalation.',
      whyItMatters: 'High rate-of-rise indicates contact resistance deterioration from bolt loosening or galvanic corrosion.',
      relatedIntelligence: {
        signalId: 'SIG-042',
        patternId: 'PAT-003',
        riskId: 'RSK-003',
        evidenceId: 'EVD-044',
        actionId: 'ACT-002',
        zone: 'power-island'
      },
      recommendedNextStep: 'Schedule load shedding or transfer primary feeder to Redundant Bus 3A.'
    }
  },
  {
    id: 'NOTIF-011',
    severity: 'Resolved',
    category: 'Resolved',
    title: 'Trench 2 intake micro-seepage gasket replaced & sealed.',
    explanation: 'Verification telemetry confirmed water flow rates restored to zero differential loss.',
    timestamp: '4 days ago',
    exactTime: '01 Oct • 14:10',
    timeFilter: '7d',
    location: 'Metro Municipal / Trench 2',
    unread: false,
    relatedEntity: 'ACT-005',
    event: {
      whatHappened: 'Utility maintenance team completed gasket swap and torque verification on Intake Flange 12A.',
      whyItMatters: 'Prevented public utility roadway subsidence and eliminated 400 gallon/day treated water loss.',
      relatedIntelligence: {
        signalId: 'SIG-054',
        patternId: 'PAT-005',
        riskId: 'RSK-005',
        evidenceId: 'EVD-054',
        actionId: 'ACT-005',
        zone: 'utility-zone'
      },
      recommendedNextStep: 'File post-action verification report.'
    }
  },
  {
    id: 'NOTIF-012',
    severity: 'Medium',
    category: 'System',
    title: 'OCR document parser schema updated to v2.4.',
    explanation: 'Enhanced optical character recognition for handwritten maintenance shift logs and PDF work slips.',
    timestamp: '12 days ago',
    exactTime: '23 Sep • 09:30',
    timeFilter: '30d',
    location: 'Global Platform',
    unread: false,
    relatedEntity: 'SCHEMA-24',
    event: {
      whatHappened: 'System admin applied updated parsing rules to convert legacy technician maintenance forms into structured precursor signals.',
      whyItMatters: 'Increases unstructured document signal capture by +24% across paper-based work order archives.',
      relatedIntelligence: {
        signalId: 'SIG-001',
        patternId: 'PAT-001',
        riskId: 'RSK-001',
        evidenceId: 'EVD-001',
        actionId: 'ACT-001',
        zone: 'block-a'
      },
      recommendedNextStep: 'Verify document parser throughput in Data Source Health panel.'
    }
  }
];
