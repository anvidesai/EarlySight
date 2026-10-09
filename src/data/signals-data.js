/**
 * EarlySight — Enterprise Operational Signals Dataset
 * Stage 1: Scattered Signals -> Connected Data -> Pattern -> Emerging Risk
 */

const EARLYSIGHT_SIGNALS = [
  {
    id: "SIG-01",
    type: "Complaint",
    label: "Complaint",
    cardTitle: "Operator Shift Complaint",
    location: "Assembly Bay 4 / Cell C",
    frequency: "Increasing (+3 logs/14d)",
    status: "Related Signal",
    badgeColor: "#C85A32",
    badgeBg: "rgba(200, 90, 50, 0.10)",
    borderColor: "rgba(200, 90, 50, 0.35)",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    timestamp: "18 days ago",
    relativeTime: "T-18d",
    source: "Field Operations & Shift Log",
    headline: "Unusual harmonic vibration reported during 3rd shift line operation",
    description: "Operators noted subtle cyclical hum on conveyor assembly #4. Dismissed as ambient resonance during routine shift handover.",
    relatedSummary: "Connects with premature bearing lubrication in Block A and 3,420 Hz acoustic telemetry.",
    metadata: {
      location: "Assembly Bay 4 / Cell C",
      recordedBy: "Line Supervisor M. Chen",
      initialSeverity: "Low (Uncategorized)",
      confidence: "88%"
    },
    scatteredPos: { x: 0.16, y: 0.28 },
    patternPos: { x: 0.38, y: 0.34 },
    clusterRole: "Human Observation Anchor"
  },
  {
    id: "SIG-02",
    type: "Maintenance",
    label: "Maintenance",
    cardTitle: "Maintenance Report",
    location: "Block A",
    frequency: "Increasing",
    status: "Related Signal",
    badgeColor: "#B87333",
    badgeBg: "rgba(184, 115, 51, 0.10)",
    borderColor: "rgba(184, 115, 51, 0.35)",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    timestamp: "14 days ago",
    relativeTime: "T-14d",
    source: "SAP PM / Work Order #WO-89104",
    headline: "Drive shaft bearing relubrication executed ahead of standard interval",
    description: "Grease sample showed fine metallic discoloration. Cleared by maintenance tech under normal wear allowance.",
    relatedSummary: "Metal fines correlate directly with FLIR thermal delta (+4.7°C) and inverter micro-trip.",
    metadata: {
      equipmentId: "DRV-AX-402",
      technician: "R. Kowalski",
      greaseViscosity: "32 cSt (Spec: 46 cSt)",
      confidence: "92%"
    },
    scatteredPos: { x: 0.78, y: 0.22 },
    patternPos: { x: 0.62, y: 0.34 },
    clusterRole: "Mechanical Evidence"
  },
  {
    id: "SIG-03",
    type: "Incident",
    label: "Incident",
    cardTitle: "Near-Miss Safety Incident",
    location: "Block A / Bus 3B",
    frequency: "Elevated (Transient)",
    status: "Related Signal",
    badgeColor: "#C85A32",
    badgeBg: "rgba(200, 90, 50, 0.10)",
    borderColor: "rgba(200, 90, 50, 0.35)",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    timestamp: "10 days ago",
    relativeTime: "T-10d",
    source: "EHS Safety Near-Miss Portal",
    headline: "Micro-trip on thermal relay #T-12 during peak throughput run",
    description: "Inverter tripped for 1.8 seconds then automatically reset. No production halt recorded; logged as transient electrical surge.",
    relatedSummary: "Instantaneous drag from bearing micro-binding caused torque overload on the inverter.",
    metadata: {
      circuit: "Feed Line Bus 3B",
      duration: "1,840 ms",
      classification: "Near-Miss Event (Closed)",
      confidence: "85%"
    },
    scatteredPos: { x: 0.84, y: 0.72 },
    patternPos: { x: 0.68, y: 0.62 },
    clusterRole: "Systemic Symptom"
  },
  {
    id: "SIG-04",
    type: "Image",
    label: "Image",
    cardTitle: "Drone FLIR Thermal Scan",
    location: "Block A / Housing 4",
    frequency: "Persistent (+4.7°C)",
    status: "Related Signal",
    badgeColor: "#5E7E6C",
    badgeBg: "rgba(94, 126, 108, 0.10)",
    borderColor: "rgba(94, 126, 108, 0.35)",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    timestamp: "7 days ago",
    relativeTime: "T-7d",
    source: "Automated Drone FLIR Thermal Audit",
    headline: "Localized thermal gradient (+4.7°C) isolated on bearing housing",
    description: "Computer vision flagged asymmetric heat dissipation across outer casing flanged joints during scheduled thermal scan.",
    relatedSummary: "Focal heat point confirms friction hotspot identified in operator hum complaints.",
    metadata: {
      sensor: "FLIR Vue Pro R 640",
      deltaT: "+4.7°C above baseline",
      visionModel: "AeroVision v3.2 (p=0.96)",
      confidence: "96%"
    },
    scatteredPos: { x: 0.22, y: 0.76 },
    patternPos: { x: 0.32, y: 0.62 },
    clusterRole: "Visual & Thermal Proof"
  },
  {
    id: "SIG-05",
    type: "Historical Data",
    label: "Historical Data",
    cardTitle: "SCADA Historian Baseline",
    location: "Fleet Multi-Year Archive",
    frequency: "Recurrent (91.4% Match)",
    status: "Related Signal",
    badgeColor: "#415A4D",
    badgeBg: "rgba(65, 90, 77, 0.10)",
    borderColor: "rgba(65, 90, 77, 0.35)",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
    timestamp: "36-Month Model Baseline",
    relativeTime: "Historical Baseline",
    source: "Enterprise SCADA Data Lake",
    headline: "Pattern matches 2022 catastrophic gearbox seizure trajectory (91.4% match)",
    description: "Multi-variate trajectory matches the exact lead signature of the Q3-2022 gearbox failure 21 days before physical lockout.",
    relatedSummary: "Mirrors historical multi-signal convergence pattern 18 days prior to catastrophic seizure.",
    metadata: {
      matchedCase: "Incident #INC-2022-09B",
      costImpactHistorical: "$480,000 unbudgeted downtime",
      similarityScore: "91.4%",
      confidence: "94%"
    },
    scatteredPos: { x: 0.50, y: 0.14 },
    patternPos: { x: 0.50, y: 0.24 },
    clusterRole: "Predictive Template"
  },
  {
    id: "SIG-06",
    type: "Sensor",
    label: "Sensor",
    cardTitle: "Vibration Sensor Telemetry",
    location: "Block A / Shaft 4",
    frequency: "Increasing (+2.84σ)",
    status: "Related Signal",
    badgeColor: "#1B4332",
    badgeBg: "rgba(27, 67, 50, 0.10)",
    borderColor: "rgba(27, 67, 50, 0.35)",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    timestamp: "Real-time Telemetry (T-0)",
    relativeTime: "Real-Time",
    source: "Tri-Axial Accelerometer #ACC-091",
    headline: "High-frequency micro-jitter (3,420 Hz envelope drift) detected",
    description: "Envelope spectrum exhibits 2.8x standard deviation shift in outer race ball pass frequency (BPFO harmonic).",
    relatedSummary: "Final kinematic confirmation locking the cross-departmental pattern into an Early Warning.",
    metadata: {
      sensorNode: "IoT Edge Node 8A",
      samplingRate: "25.6 kHz continuous",
      zScore: "+2.84 sigma",
      confidence: "97%"
    },
    scatteredPos: { x: 0.50, y: 0.88 },
    patternPos: { x: 0.50, y: 0.76 },
    clusterRole: "Kinetic Telemetry"
  }
];

// Relationship connections between signals that reveal the pattern
const SIGNAL_CONNECTIONS = [
  { from: "SIG-01", to: "SIG-02", weight: 0.86, label: "Operator complaint correlates with premature relubrication" },
  { from: "SIG-02", to: "SIG-04", weight: 0.94, label: "Grease degradation aligns directly with casing hotspot" },
  { from: "SIG-04", to: "SIG-06", weight: 0.98, label: "Thermal rise matches 3,420 Hz BPFO vibration peak" },
  { from: "SIG-06", to: "SIG-03", weight: 0.89, label: "Mechanical drag caused transient inverter micro-trip" },
  { from: "SIG-03", to: "SIG-05", weight: 0.91, label: "Compound curve matches 2022 pre-failure sequence" },
  { from: "SIG-05", to: "SIG-01", weight: 0.84, label: "Historical pattern began with identical shift complaint" },
  // Cross-chords forming the central geometric mesh
  { from: "SIG-01", to: "SIG-04", weight: 0.79, label: "Acoustic perception vs thermal manifestation" },
  { from: "SIG-02", to: "SIG-06", weight: 0.95, label: "Tribological breakdown drives vibration harmonics" },
  { from: "SIG-05", to: "SIG-06", weight: 0.92, label: "Historian anomaly curve confirms imminent failure" }
];

// Emerging Risk Synthesized from Pattern
const SYNTHESIZED_RISK = {
  riskId: "RISK-2026-0819",
  title: "Sub-Surface Bearing Cage Fatigue Cascade",
  asset: "High-Throughput Continuous Feeder #4 — Drive Train (Block A)",
  status: "Emerging Risk Confirmed",
  urgency: "Actionable Early Warning",
  leadTime: "18 Days Ahead of Critical Outage",
  confidence: "94.6%",
  potentialImpact: "$340,000 Unplanned Line Downtime & Secondary Stator Destruction",
  evidenceCount: 6,
  sourcesCount: 5,
  recommendedAction: "Schedule targeted bearing assembly replacement during standard planned maintenance window on day 7. Adjust torque envelope by -12% immediately."
};

// Architecture Pipeline stages — Unified 7-Stage EarlySight Story
const PIPELINE_STAGES = [
  {
    step: "01",
    name: "Scattered Signals",
    subtitle: "Individual complaints, reports and data",
    description: "Ingests weak, fragmented operational indicators across text, SCADA, vision, maintenance work orders, and safety logs.",
    icon: "scatter",
    keyMetric: "6 Unconnected Sources"
  },
  {
    step: "02",
    name: "Connection",
    subtitle: "Related information gets connected",
    description: "Resolves shared physical entities, temporal alignments, and cross-departmental references into an interconnected knowledge fabric.",
    icon: "network",
    keyMetric: "9 Correlation Links"
  },
  {
    step: "03",
    name: "Pattern",
    subtitle: "A recurring pattern becomes visible",
    description: "Detects non-obvious structural coherence that human inspectors and single-metric thresholds systematically miss.",
    icon: "pattern",
    keyMetric: "91.4% Signature Coherence"
  },
  {
    step: "04",
    name: "Early Warning",
    subtitle: "An emerging problem is identified",
    description: "Synthesizes multi-variable precursors into an early warning indicator with quantified lead-time and failure probability.",
    icon: "warning",
    keyMetric: "18 Days Lead Time"
  },
  {
    step: "05",
    name: "Evidence",
    subtitle: "The system explains why",
    description: "Provides explainable, multi-modal citations linking each forecast directly back to the original operational records.",
    icon: "evidence",
    keyMetric: "87% Confidence Trail"
  },
  {
    step: "06",
    name: "Action",
    subtitle: "A responsible team investigates and acts",
    description: "Generates step-by-step engineering interventions and integrates directly with CMMS/ERP for preventative dispatch.",
    icon: "action",
    keyMetric: "Auto-Routed Work Orders"
  },
  {
    step: "07",
    name: "Verification",
    subtitle: "The system checks whether the problem actually decreases",
    description: "Monitors post-mitigation telemetry to verify anomaly resolution, update confidence baselines, and eliminate false positives.",
    icon: "verification",
    keyMetric: "-95% Anomaly Decay"
  }
];

// Comprehensive Operational Signals Registry for the Signals Table & Detail Drawer
const OPERATIONAL_SIGNALS_REGISTRY = [
  // --- CLUSTER 1: Block A Sub-Slab Water Leakage & Conduit Seepage ---
  {
    id: "SIG-WTR-01",
    title: "Sub-Slab Acoustic Micro-Hiss Detected",
    source: "Acoustic Transducer AC-14 • SCADA Flow Differential",
    sourceType: "Sensor",
    category: "Water leakage",
    location: "Block A",
    bayAsset: "Feed Conduit 4B Joint 12",
    severity: "High",
    status: "Correlated",
    detected: "2 hours ago",
    createdDate: "Oct 05, 2026 • 07:15 AM",
    dateHorizon: "today",
    clusterId: "CLU-01",
    relatedClusterName: "Sub-Slab Pressurized Conduit Seepage",
    relatedPattern: "Repeated Sub-Slab Moisture Saturation Pattern",
    associatedRisk: "Block A Flooding & Feeder Line Halt",
    riskId: "RSK-01",
    riskSeverity: "High",
    leadTime: "14 Days Remaining",
    relatedCount: 12,
    frequencyTrend: "Surging (+320% velocity over 21 days)",
    description: "Subsurface 4.2 kHz acoustic hiss and micro-pressure drops identified across auxiliary chilled feed conduit adjacent to electrical trench 4B.",
    aiAnalysis: "Acoustic hiss matches pressure delta across isolation gate valve BV-12. Multiple leakage indicators in Block A over 3 weeks indicate expanding elastomer gasket failure.",
    evidence: [
      { type: "SCADA Telemetry", title: "Auxiliary Feed Flow Rate Delta", detail: "-4.2% differential pressure across isolation gate valve BV-12" },
      { type: "Acoustic Sensor", title: "Acoustic Transducer AC-14 Peak", detail: "High-frequency hiss (4.2 kHz) localized at underground pipe sleeve" },
      { type: "Soil Probe", title: "Moisture Sensor MS-08 Saturation", detail: "Groundwater probe indicates 88% saturation in sub-slab bedding sand" }
    ],
    timeline: [
      { period: "Week 1", count: 2, note: "Sub-slab pressure transient logged" },
      { period: "Week 2", count: 4, note: "Operator dampness report in Bay 4" },
      { period: "Week 3", count: 7, note: "Ultrasonic acoustic hiss detected" },
      { period: "Week 4", count: 12, note: "Active pressure drop & spread" }
    ],
    recommendedAction: "Deploy ultrasonic acoustic leak detector to Block A Trench 4B flange joint. Isolate auxiliary bypass valve BV-12 within 48 hours to avert main assembly line flooding."
  },
  {
    id: "SIG-WTR-02",
    title: "Shift Supervisor Floor Dampness Observation",
    source: "Field Operations Shift Log #OP-442",
    sourceType: "Complaint",
    category: "Water leakage",
    location: "Block A",
    bayAsset: "Assembly Bay 4 / Cell C Floor",
    severity: "High",
    status: "Correlated",
    detected: "5 hours ago",
    createdDate: "Oct 05, 2026 • 04:30 AM",
    dateHorizon: "today",
    clusterId: "CLU-01",
    relatedClusterName: "Sub-Slab Pressurized Conduit Seepage",
    relatedPattern: "Repeated Sub-Slab Moisture Saturation Pattern",
    associatedRisk: "Block A Flooding & Feeder Line Halt",
    riskId: "RSK-01",
    riskSeverity: "High",
    leadTime: "14 Days Remaining",
    relatedCount: 12,
    frequencyTrend: "Increasing frequency",
    description: "Line supervisor reported persistent moisture seeping upward through concrete joint seams along Bay 4 conveyor substructure.",
    aiAnalysis: "Visual floor moisture is not surface condensation; it directly correlates with acoustic sensor AC-14 hiss and bedding sand saturation 94%.",
    evidence: [
      { type: "Operator Log", title: "Shift Log #OP-442 Dampness Report", detail: "Technician noted recurring damp patches near Cell C footing after washdown" },
      { type: "Soil Moisture", title: "Bedding Sand Probe #MS-12", detail: "94% continuous moisture presence detected beneath floor slab" }
    ],
    timeline: [
      { period: "Week 2", count: 2, note: "Isolated damp spot recorded" },
      { period: "Week 3", count: 6, note: "Moisture spreading along seam" },
      { period: "Week 4", count: 12, note: "Active upward seepage" }
    ],
    recommendedAction: "Verify sub-slab water table elevation and inspect flange sleeve seal integrity during planned shift change."
  },
  {
    id: "SIG-WTR-03",
    title: "Trench 4B Concrete Mineral Efflorescence Inspection",
    source: "Automated Facility Drone Camera Scan #VIS-89",
    sourceType: "Image",
    category: "Infrastructure damage",
    location: "Block A",
    bayAsset: "Utility Trench 4B Wall",
    severity: "Critical",
    status: "Action Queued",
    detected: "Yesterday, 14:10",
    createdDate: "Oct 04, 2026 • 02:10 PM",
    dateHorizon: "week",
    clusterId: "CLU-01",
    relatedClusterName: "Sub-Slab Pressurized Conduit Seepage",
    relatedPattern: "Repeated Sub-Slab Moisture Saturation Pattern",
    associatedRisk: "Block A Flooding & Feeder Line Halt",
    riskId: "RSK-01",
    riskSeverity: "High",
    leadTime: "14 Days Remaining",
    relatedCount: 12,
    frequencyTrend: "Accelerating water ingress",
    description: "Visual inspection revealed 18-meter white mineral salt leaching and concrete spalling along electrical conduit trench wall.",
    aiAnalysis: "Mineral leaching proves pressurized water has been migrating through the concrete matrix for over 14 days, threatening busway conduits.",
    evidence: [
      { type: "Visual Drone Scan", title: "High-Res Photogrammetry #VIS-89", detail: "18m calcite deposit track identified along lower trench lip" },
      { type: "Civil Inspection", title: "Concrete Permeability Log", detail: "Concrete spall depth exceeds 4mm in localized saturation zone" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Faint mineral haze noted" },
      { period: "Week 3", count: 5, note: "Crystalline efflorescence blooming" },
      { period: "Week 4", count: 12, note: "Structural spalling initiated" }
    ],
    recommendedAction: "Install mechanical containment sleeve on flange 4B-12 and seal porous trench walls with epoxy injection."
  },
  {
    id: "SIG-WTR-04",
    title: "Sump Pump Basin Evacuation Run Frequency Surge",
    source: "CMMS Preventive Maintenance Log #WO-90214",
    sourceType: "Maintenance Report",
    category: "Maintenance complaint",
    location: "Block A",
    bayAsset: "Sump Pit SP-04",
    severity: "High",
    status: "Correlated",
    detected: "2 days ago",
    createdDate: "Oct 03, 2026 • 09:40 AM",
    dateHorizon: "week",
    clusterId: "CLU-01",
    relatedClusterName: "Sub-Slab Pressurized Conduit Seepage",
    relatedPattern: "Repeated Sub-Slab Moisture Saturation Pattern",
    associatedRisk: "Block A Flooding & Feeder Line Halt",
    riskId: "RSK-01",
    riskSeverity: "High",
    leadTime: "14 Days Remaining",
    relatedCount: 12,
    frequencyTrend: "Surging (+800% run cycles)",
    description: "Basement sump pump cycles surged from standard 2 runs/day to 18 runs/day with high motor thermal loading.",
    aiAnalysis: "Discharge volume analysis proves an active water source in excess of 140 liters/hour infiltrating trench 4B sand bedding.",
    evidence: [
      { type: "CMMS Work Order", title: "Pump Motor Duty Cycle Log", detail: "Pump operating 18 cycles/day vs 2 cycles baseline" },
      { type: "SCADA Telemetry", title: "Basement Flow Meter FM-02", detail: "Totalized evacuation exceeds 3,200 liters in past 48 hours" }
    ],
    timeline: [
      { period: "Week 2", count: 3, note: "Sump run-time +35%" },
      { period: "Week 3", count: 8, note: "Duty cycle doubled" },
      { period: "Week 4", count: 12, note: "18 runs/day sustained" }
    ],
    recommendedAction: "Backpressure test isolation valve BV-12 and perform ultrasound inspection on sub-slab piping."
  },
  {
    id: "SIG-WTR-05",
    title: "Epoxy Floor Slickness Near-Miss Incident",
    source: "EHS Safety Near-Miss Portal #NM-2026-104",
    sourceType: "Incident Report",
    category: "Safety concern",
    location: "Block A",
    bayAsset: "Cleanroom Cell C Entryway",
    severity: "Medium",
    status: "Investigating",
    detected: "3 days ago",
    createdDate: "Oct 02, 2026 • 03:15 PM",
    dateHorizon: "week",
    clusterId: "CLU-01",
    relatedClusterName: "Sub-Slab Pressurized Conduit Seepage",
    relatedPattern: "Repeated Sub-Slab Moisture Saturation Pattern",
    associatedRisk: "Block A Flooding & Feeder Line Halt",
    riskId: "RSK-01",
    riskSeverity: "High",
    leadTime: "14 Days Remaining",
    relatedCount: 12,
    frequencyTrend: "Elevated near-miss events",
    description: "Operator slipped on wet epoxy floor adjacent to cleanroom air curtain door. Logged as water pooling from expansion joint.",
    aiAnalysis: "Moisture is seeping through slab expansion joint beneath Cleanroom C wall, demonstrating lateral water migration from Trench 4B.",
    evidence: [
      { type: "Safety Incident", title: "EHS Slip Report #NM-104", detail: "Operator reported thin sheen of water over 2 sq.m epoxy surface" },
      { type: "Facility Log", title: "Janitorial Moisture Wipe Count", detail: "Floor wiped 4 times in one 8-hour shift" }
    ],
    timeline: [
      { period: "Week 3", count: 4, note: "Dampness flagged near door" },
      { period: "Week 4", count: 12, note: "Slip near-miss officially filed" }
    ],
    recommendedAction: "Erect temporary non-slip mats and seal joint with hydro-reactive polyurethane grout."
  },

  // --- CLUSTER 2: Drive AX-402 Bearing Cage Fatigue Cascade ---
  {
    id: "SIG-EQP-01",
    title: "High-Frequency 3,420 Hz Harmonic Jitter Surge",
    source: "Tri-Axial Envelope Accelerometer AX-402",
    sourceType: "Sensor",
    category: "Equipment failure",
    location: "Engineering Building",
    bayAsset: "Drive Feeder AX-402 Outboard End",
    severity: "Critical",
    status: "Active",
    detected: "35 minutes ago",
    createdDate: "Oct 05, 2026 • 08:40 AM",
    dateHorizon: "today",
    clusterId: "CLU-02",
    relatedClusterName: "Drive AX-402 Bearing Cage Fatigue Cascade",
    relatedPattern: "Sub-Surface Bearing Cage Fatigue Cascade",
    associatedRisk: "Continuous Feeder #4 Catastrophic Seizure",
    riskId: "RSK-04",
    riskSeverity: "Critical",
    leadTime: "18 Days Remaining",
    relatedCount: 8,
    frequencyTrend: "Accelerating (+2.84σ deviation)",
    description: "Impulsive peak-to-peak shock pulse readings crossed 8.4 g-pk at 3,420 Hz BPFO harmonic frequency on continuous feeder drive shaft.",
    aiAnalysis: "Outer race ball pass frequency (BPFO) harmonic has surged past 2.8 sigma. Cross-correlates with lube metallic fines and thermal hotspot.",
    evidence: [
      { type: "Vibration Sensor", title: "Envelope Acceleration Shock Spectrum", detail: "Shock pulse amplitude crossed 8.4 g-pk (Alert threshold: 4.5 g-pk)" },
      { type: "Lube Analysis", title: "Spectrographic Ferrous Particles", detail: "Severe metal debris concentration rising in quarterly oil sample" },
      { type: "Thermal FLIR", title: "Bearing Housing Heat Dissipation", detail: "+4.7°C localized temperature rise on outboard drive end" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Cyclical hum dismissed as ambient resonance" },
      { period: "Week 2", count: 3, note: "Premature relubrication logged by tech" },
      { period: "Week 3", count: 8, note: "Severe envelope harmonic surge" }
    ],
    recommendedAction: "Execute emergency drive bearing replacement during planned shift changeover window to avert catastrophic mechanical seizure."
  },
  {
    id: "SIG-EQP-02",
    title: "Operator 3rd-Shift Conveyor Harmonic Hum Complaint",
    source: "Field Operations & Shift Handover Log",
    sourceType: "Complaint",
    category: "Equipment failure",
    location: "Engineering Building",
    bayAsset: "Assembly Bay 4 / Cell C Feeder",
    severity: "High",
    status: "Correlated",
    detected: "18 days ago",
    createdDate: "Sep 17, 2026 • 11:20 PM",
    dateHorizon: "month",
    clusterId: "CLU-02",
    relatedClusterName: "Drive AX-402 Bearing Cage Fatigue Cascade",
    relatedPattern: "Sub-Surface Bearing Cage Fatigue Cascade",
    associatedRisk: "Continuous Feeder #4 Catastrophic Seizure",
    riskId: "RSK-04",
    riskSeverity: "Critical",
    leadTime: "18 Days Remaining",
    relatedCount: 8,
    frequencyTrend: "Increasing (+3 logs / 14d)",
    description: "Operators noted subtle cyclical harmonic drone on conveyor assembly #4 during 3rd-shift production run.",
    aiAnalysis: "Human auditory observation provided the initial weak anchor 18 days ago, correctly isolating the earliest acoustic manifestation of micro-spalling.",
    evidence: [
      { type: "Shift Handover", title: "Operator Hum Complaint Entry", detail: "Operator noted harmonic drone during high-speed feed cycle" },
      { type: "Supervisor Log", title: "Ambient Noise Baseline", detail: "Sound level meter logged +3.2 dB elevation at 3.4 kHz band" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "First acoustic report filed" },
      { period: "Week 2", count: 3, note: "Sound persistence confirmed" }
    ],
    recommendedAction: "Correlate auditory hum reports with high-resolution envelope accelerometry."
  },
  {
    id: "SIG-EQP-03",
    title: "Premature Bearing Relubrication & Metallic Fines",
    source: "SAP PM Work Order #WO-89104",
    sourceType: "Maintenance Report",
    category: "Equipment failure",
    location: "Engineering Building",
    bayAsset: "Drive Shaft DRV-AX-402",
    severity: "High",
    status: "Correlated",
    detected: "14 days ago",
    createdDate: "Sep 21, 2026 • 09:15 AM",
    dateHorizon: "month",
    clusterId: "CLU-02",
    relatedClusterName: "Drive AX-402 Bearing Cage Fatigue Cascade",
    relatedPattern: "Sub-Surface Bearing Cage Fatigue Cascade",
    associatedRisk: "Continuous Feeder #4 Catastrophic Seizure",
    riskId: "RSK-04",
    riskSeverity: "Critical",
    leadTime: "18 Days Remaining",
    relatedCount: 8,
    frequencyTrend: "Unscheduled maintenance cycle",
    description: "Maintenance technician executed grease relubrication ahead of schedule. Sample showed fine metallic flake discoloration.",
    aiAnalysis: "Grease darkening was not simple oxidation; spectrograph confirmed 46 ppm iron particles indicating roller spallation.",
    evidence: [
      { type: "Work Order", title: "SAP PM #WO-89104", detail: "Grease purged early; particulate discoloration noted" },
      { type: "Lab Sample", title: "Spectrographic Analysis #L-402", detail: "Iron particles 46 ppm; viscosity dropped to 32 cSt" }
    ],
    timeline: [
      { period: "Week 2", count: 2, note: "Early lubrication completed" },
      { period: "Week 3", count: 5, note: "Lube analysis confirms metal flakes" }
    ],
    recommendedAction: "Schedule full bearing replacement; do not rely on additional grease flushes."
  },
  {
    id: "SIG-EQP-04",
    title: "Drone FLIR Casing Thermal Gradient (+4.7°C Hotspot)",
    source: "Automated Drone FLIR Thermal Audit #FLIR-640",
    sourceType: "Image",
    category: "Equipment failure",
    location: "Engineering Building",
    bayAsset: "Bearing Housing #4 Outboard",
    severity: "High",
    status: "Correlated",
    detected: "7 days ago",
    createdDate: "Sep 28, 2026 • 10:45 AM",
    dateHorizon: "week",
    clusterId: "CLU-02",
    relatedClusterName: "Drive AX-402 Bearing Cage Fatigue Cascade",
    relatedPattern: "Sub-Surface Bearing Cage Fatigue Cascade",
    associatedRisk: "Continuous Feeder #4 Catastrophic Seizure",
    riskId: "RSK-04",
    riskSeverity: "Critical",
    leadTime: "18 Days Remaining",
    relatedCount: 8,
    frequencyTrend: "Persistent (+4.7°C delta-T)",
    description: "Computer vision flagged localized asymmetric heat dissipation (+4.7°C above baseline) across outer bearing housing flanged joints.",
    aiAnalysis: "Focal heat confirms friction hotspot generated by spalled rollers skidding across fatigued outer raceway.",
    evidence: [
      { type: "Thermography", title: "FLIR Vue Pro R 640 Thermal Scan", detail: "+4.7°C delta-T localized on drive end bearing housing" },
      { type: "Computer Vision", title: "AeroVision Model v3.2", detail: "Confidence 96% of abnormal boundary layer heat signature" }
    ],
    timeline: [
      { period: "Week 3", count: 1, note: "Thermal scan identifies hotspot" },
      { period: "Week 4", count: 8, note: "Temperature holds at elevated delta" }
    ],
    recommendedAction: "Apply torque reduction envelope (-12%) until physical bearing replacement is staged."
  },
  {
    id: "SIG-EQP-05",
    title: "SCADA Historian 2022 Failure Model Match (91.4%)",
    source: "Enterprise SCADA Data Lake Archive #INC-2022-09B",
    sourceType: "Document",
    category: "Equipment failure",
    location: "Engineering Building",
    bayAsset: "Historian Model Database",
    severity: "High",
    status: "Correlated",
    detected: "4 days ago",
    createdDate: "Oct 01, 2026 • 01:30 PM",
    dateHorizon: "week",
    clusterId: "CLU-02",
    relatedClusterName: "Drive AX-402 Bearing Cage Fatigue Cascade",
    relatedPattern: "Sub-Surface Bearing Cage Fatigue Cascade",
    associatedRisk: "Continuous Feeder #4 Catastrophic Seizure",
    riskId: "RSK-04",
    riskSeverity: "Critical",
    leadTime: "18 Days Remaining",
    relatedCount: 8,
    frequencyTrend: "Historical trajectory match",
    description: "Multi-variate trajectory matches the exact lead signature of the catastrophic Q3-2022 gearbox seizure 21 days before lockout.",
    aiAnalysis: "Historical case resulted in $480,000 unbudgeted line downtime. EarlySight detects identical multi-signal sequence with 18 days lead time.",
    evidence: [
      { type: "Historical Record", title: "Incident Archive #INC-2022-09B", detail: "Gearbox locked up after 22 days of unaddressed harmonic hum" },
      { type: "Trajectory Match", title: "Similarity Algorithm", detail: "91.4% temporal-amplitude alignment across 5 variables" }
    ],
    timeline: [
      { period: "Week 3", count: 1, note: "Pattern matched in historian" }
    ],
    recommendedAction: "Pre-order OEM bearing kit #BK-402 to ensure zero parts delay for scheduled outage."
  },

  // --- CLUSTER 3: Extrusion Press #2 Proportional Valve Cavitation ---
  {
    id: "SIG-HYD-01",
    title: "Proportional Directional Valve Acoustic Cavitation Burst",
    source: "Manifold Acoustic Emission Sensor SG-48",
    sourceType: "Sensor",
    category: "Equipment failure",
    location: "Block C",
    bayAsset: "Press Station #2 / Valve PV-02",
    severity: "High",
    status: "Active",
    detected: "4 hours ago",
    createdDate: "Oct 05, 2026 • 05:20 AM",
    dateHorizon: "today",
    clusterId: "CLU-03",
    relatedClusterName: "Extrusion Press #2 Proportional Valve Cavitation",
    relatedPattern: "Proportional Directional Valve Cavitation Drift",
    associatedRisk: "Extrusion Line Spool Seizure & Billet Spoilage",
    riskId: "RSK-05",
    riskSeverity: "High",
    leadTime: "12 Days Remaining",
    relatedCount: 12,
    frequencyTrend: "Surging (+16% / week)",
    description: "48 kHz acoustic burst emission detected across proportional directional valve manifold during hydraulic accumulator recharge cycle.",
    aiAnalysis: "Suction head drop creates transient negative pressure, collapsing micro-vapor bubbles and eroding valve metering edges.",
    evidence: [
      { type: "Acoustic Sensor", title: "Acoustic Emission Burst 48 kHz", detail: "Burst duration 120ms coinciding with high-flow recharge" },
      { type: "Pressure Sensor", title: "Suction Delta-P Transducer", detail: "NPSH margin dipped to 1.1m (Specification: 1.8m min)" }
    ],
    timeline: [
      { period: "Week 1", count: 2, note: "Transient acoustic click" },
      { period: "Week 2", count: 5, note: "Suction dip frequency increases" },
      { period: "Week 3", count: 12, note: "Continuous cavitation bursts" }
    ],
    recommendedAction: "De-aerate hydraulic fluid reservoir and replace suction basket filter element within 48 hours."
  },
  {
    id: "SIG-HYD-02",
    title: "Press Operator Gravel-Like Rattle Report",
    source: "Press Line Shift Log Book #PRS-22",
    sourceType: "Complaint",
    category: "Maintenance complaint",
    location: "Block C",
    bayAsset: "Extrusion Press Ram Drive #2",
    severity: "Medium",
    status: "Correlated",
    detected: "Yesterday, 19:45",
    createdDate: "Oct 04, 2026 • 07:45 PM",
    dateHorizon: "today",
    clusterId: "CLU-03",
    relatedClusterName: "Extrusion Press #2 Proportional Valve Cavitation",
    relatedPattern: "Proportional Directional Valve Cavitation Drift",
    associatedRisk: "Extrusion Line Spool Seizure & Billet Spoilage",
    riskId: "RSK-05",
    riskSeverity: "High",
    leadTime: "12 Days Remaining",
    relatedCount: 12,
    frequencyTrend: "Low-frequency periodic rattle",
    description: "Lead extrusion technician reported persistent gravel-like metallic rattling during maximum hydraulic ram tonnage stroke.",
    aiAnalysis: "Classic symptom of hydraulic cavitation pitting on proportional spool lands, directly preceding catastrophic stick-slip seizure.",
    evidence: [
      { type: "Operator Log", title: "Press Log Entry #PRS-22", detail: "Operator noted gravelly chattering at 180 bar pressure peak" }
    ],
    timeline: [
      { period: "Week 2", count: 1, note: "Intermittent chattering noted" },
      { period: "Week 3", count: 6, note: "Chattering occurs on every stroke" }
    ],
    recommendedAction: "Inspect valve spool metering lands with borescope during next tooling change."
  },
  {
    id: "SIG-HYD-03",
    title: "Hydraulic Fluid Spectrographic Micro-Debris Analysis",
    source: "Laboratory Oil Spectrometry Report #OIL-882",
    sourceType: "Document",
    category: "Equipment failure",
    location: "Block C",
    bayAsset: "Hydraulic Power Unit Reservoir #2",
    severity: "High",
    status: "Correlated",
    detected: "5 days ago",
    createdDate: "Sep 30, 2026 • 02:00 PM",
    dateHorizon: "week",
    clusterId: "CLU-03",
    relatedClusterName: "Extrusion Press #2 Proportional Valve Cavitation",
    relatedPattern: "Proportional Directional Valve Cavitation Drift",
    associatedRisk: "Extrusion Line Spool Seizure & Billet Spoilage",
    riskId: "RSK-05",
    riskSeverity: "High",
    leadTime: "12 Days Remaining",
    relatedCount: 12,
    frequencyTrend: "Micro-particulate escalation",
    description: "Oil sample particle count ISO 4406 jumped from 16/14/11 to 21/18/14 with high concentrations of hardened bronze and steel alloy flakes.",
    aiAnalysis: "Bronze particles originate from hydraulic pump swashplate shoe wear caused by cavitation-induced shock pulses.",
    evidence: [
      { type: "Lab Report", title: "Fluid Cleanliness ISO 4406", detail: "Contamination code 21/18/14 (Alarm limit: 18/16/13)" },
      { type: "Particle Count", title: "Micro-Debris Particle Size", detail: "Over 8,400 particles/mL in the 5-15 micron range" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Quarterly sample clean" },
      { period: "Week 3", count: 4, note: "Follow-up test shows sharp debris rise" }
    ],
    recommendedAction: "Activate kidney-loop high-efficiency polishing cart (3 micron absolute) to prevent servo valve jamming."
  },
  {
    id: "SIG-HYD-04",
    title: "Billet Surface Thickness Ripple Quality Rejection",
    source: "Automated Laser Micrometer Quality Log #QA-901",
    sourceType: "Incident Report",
    category: "Equipment failure",
    location: "Block C",
    bayAsset: "Billet Outfeed Gauge Line",
    severity: "Medium",
    status: "Investigating",
    detected: "6 days ago",
    createdDate: "Sep 29, 2026 • 11:15 AM",
    dateHorizon: "week",
    clusterId: "CLU-03",
    relatedClusterName: "Extrusion Press #2 Proportional Valve Cavitation",
    relatedPattern: "Proportional Directional Valve Cavitation Drift",
    associatedRisk: "Extrusion Line Spool Seizure & Billet Spoilage",
    riskId: "RSK-05",
    riskSeverity: "High",
    leadTime: "12 Days Remaining",
    relatedCount: 12,
    frequencyTrend: "Rising out-of-spec billets",
    description: "4 aluminum extruded billets rejected for cyclical surface striations (0.18mm thickness ripple) matching 12 Hz hydraulic hunting frequency.",
    aiAnalysis: "Spool stick-slip due to cavitation erosion produces hunting pressure waves in ram cylinder, causing physical billet ripple.",
    evidence: [
      { type: "Laser Metrology", title: "Thickness Gauge Scan #QA-901", detail: "0.18mm periodic ripple along 6-meter billet extrusion length" }
    ],
    timeline: [
      { period: "Week 3", count: 4, note: "First quality rejections logged" }
    ],
    recommendedAction: "Recalibrate proportional valve LVDT position feedback loop and adjust dither frequency."
  },

  // --- CLUSTER 4: Switchgear Bus 3B Thermal & Harmonic Drift ---
  {
    id: "SIG-ELE-01",
    title: "Switchgear Bus 3B Total Harmonic Distortion (THD) Surge",
    source: "Digital Power Quality Meter PQ-09",
    sourceType: "Sensor",
    category: "Electrical issue",
    location: "Power Island",
    bayAsset: "Switchgear Bus 3B",
    severity: "High",
    status: "Investigating",
    detected: "Yesterday, 16:30",
    createdDate: "Oct 04, 2026 • 04:30 PM",
    dateHorizon: "today",
    clusterId: "CLU-04",
    relatedClusterName: "Switchgear Bus 3B Thermal & Harmonic Drift",
    relatedPattern: "Harmonic Resonance & Phase Connector Degradation",
    associatedRisk: "Switchgear Bus 3B Thermal Overload & Arc Flash",
    riskId: "RSK-02",
    riskSeverity: "High",
    leadTime: "9 Days Remaining",
    relatedCount: 6,
    frequencyTrend: "Cyclical upward drift (+4.8% THD)",
    description: "5th and 7th harmonic voltages elevated by +4.8% across Phase B during concurrent heavy cooling compressor cycling.",
    aiAnalysis: "Harmonic resonance between power factor capacitor bank and variable frequency drives is driving high-frequency circulating currents.",
    evidence: [
      { type: "Power Meter", title: "Total Harmonic Distortion (THD)", detail: "THD voltage reached 6.2% (IEEE 519 standard limit: 5.0%)" },
      { type: "Thermal Inspection", title: "FLIR Thermography Scan", detail: "+6.1°C hot spot on Phase B disconnect coupling" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Transient voltage sag recorded" },
      { period: "Week 2", count: 3, note: "Harmonic distortion THD up 1.8%" },
      { period: "Week 3", count: 6, note: "Thermal bloom on phase connector" }
    ],
    recommendedAction: "De-tune capacitor bank steps and inspect Phase B disconnect coupling torque during 4-hour maintenance window."
  },
  {
    id: "SIG-ELE-02",
    title: "Inverter Thermal Relay Micro-Trip Near-Miss",
    source: "EHS Safety Near-Miss Portal #NM-098",
    sourceType: "Incident Report",
    category: "Electrical issue",
    location: "Power Island",
    bayAsset: "Thermal Overload Relay #T-12",
    severity: "High",
    status: "Correlated",
    detected: "10 days ago",
    createdDate: "Sep 25, 2026 • 02:40 PM",
    dateHorizon: "month",
    clusterId: "CLU-04",
    relatedClusterName: "Switchgear Bus 3B Thermal & Harmonic Drift",
    relatedPattern: "Harmonic Resonance & Phase Connector Degradation",
    associatedRisk: "Switchgear Bus 3B Thermal Overload & Arc Flash",
    riskId: "RSK-02",
    riskSeverity: "High",
    leadTime: "9 Days Remaining",
    relatedCount: 6,
    frequencyTrend: "Transient overload trips",
    description: "Thermal overload relay #T-12 tripped for 1,840 ms during peak plant load run, then auto-reset without line shutdown.",
    aiAnalysis: "Trip was dismissed as transient surge, but was caused by cumulative heating from high-frequency harmonic circulating currents.",
    evidence: [
      { type: "Relay Log", title: "Micro-Trip Timestamp Log", detail: "Tripped at 104% rated continuous current for 1.8 seconds" }
    ],
    timeline: [
      { period: "Week 2", count: 1, note: "Single micro-trip recorded" },
      { period: "Week 3", count: 3, note: "Relay operating temperature elevated" }
    ],
    recommendedAction: "Recalibrate thermal overload curve and verify harmonic filter shunt resistor health."
  },
  {
    id: "SIG-ELE-03",
    title: "Thermographic Scan: +6.1°C Phase Isolation Hotspot",
    source: "Substation Drone Thermographic Inspection #FLIR-104",
    sourceType: "Image",
    category: "Electrical issue",
    location: "Power Island",
    bayAsset: "Busbar A-to-B Phase Coupling",
    severity: "High",
    status: "Correlated",
    detected: "8 days ago",
    createdDate: "Sep 27, 2026 • 09:20 AM",
    dateHorizon: "week",
    clusterId: "CLU-04",
    relatedClusterName: "Switchgear Bus 3B Thermal & Harmonic Drift",
    relatedPattern: "Harmonic Resonance & Phase Connector Degradation",
    associatedRisk: "Switchgear Bus 3B Thermal Overload & Arc Flash",
    riskId: "RSK-02",
    riskSeverity: "High",
    leadTime: "9 Days Remaining",
    relatedCount: 6,
    frequencyTrend: "Expanding thermal dissipation",
    description: "Radiometric thermography identified +6.1°C delta-T localized on bolting hardware of Phase B busbar splice.",
    aiAnalysis: "Loose joint resistance combined with harmonic eddy currents creates thermal runaway condition that can trigger an arc flash.",
    evidence: [
      { type: "Thermography", title: "FLIR Radiometric Snapshot", detail: "Splice joint at 68.4°C vs 62.3°C on adjacent Phase A" }
    ],
    timeline: [
      { period: "Week 2", count: 1, note: "Minor +2°C gradient noted" },
      { period: "Week 3", count: 4, note: "+6.1°C thermal bloom confirmed" }
    ],
    recommendedAction: "Execute de-energized torque check and apply micro-ohm contact resistance test across all 3 phases."
  },

  // --- CLUSTER 5: Chemical Exhaust Scrubber Guide Vane Stalling ---
  {
    id: "SIG-SFT-01",
    title: "Duct Static Differential Pressure Flutter",
    source: "Differential Pressure Transducer DP-SCI-03",
    sourceType: "Sensor",
    category: "Safety concern",
    location: "Engineering Building",
    bayAsset: "Chemistry Lab Exhaust Ducting Suite 3",
    severity: "High",
    status: "Action Queued",
    detected: "3 hours ago",
    createdDate: "Oct 05, 2026 • 06:10 AM",
    dateHorizon: "today",
    clusterId: "CLU-05",
    relatedClusterName: "Chemical Exhaust Scrubber Guide Vane Stalling",
    relatedPattern: "Scrubber Aerodynamic Stalling & Flow Reversal",
    associatedRisk: "Chemical Vapor Infiltration Hazard",
    riskId: "RSK-06",
    riskSeverity: "High",
    leadTime: "5 Days Remaining",
    relatedCount: 9,
    frequencyTrend: "Surging (3.4 events / day)",
    description: "Static pressure fluttering between -18 Pa and -4 Pa (Specification: -25 Pa stable) in chemical lab exhaust ducting.",
    aiAnalysis: "Guide vane mechanical linkage binding intermittently under cross-wind shear, risking reverse fume drift into occupied lab suites.",
    evidence: [
      { type: "Pressure Transducer", title: "Duct Static Pressure Fluctuation", detail: "Negative pressure boundary breached 14 times in 24 hours" },
      { type: "Fan Telemetry", title: "Exhaust Motor Amp Oscillations", detail: "Motor current hunting by ±12% indicating aerodynamic stall" }
    ],
    timeline: [
      { period: "Week 1", count: 2, note: "Minor static pressure fluctuation" },
      { period: "Week 2", count: 4, note: "Shift complaint logged in lab" },
      { period: "Week 3", count: 9, note: "Pressure flutter crosses alarm boundary" }
    ],
    recommendedAction: "Lubricate guide vane actuator pivot linkage and replace differential pressure sensor pitot tube assembly within 24 hours."
  },
  {
    id: "SIG-SFT-02",
    title: "Graduate Student 3rd-Floor Chemical Odor Reports",
    source: "Academic Campus EHS Helpdesk Complaint Log",
    sourceType: "Complaint",
    category: "Safety concern",
    location: "Engineering Building",
    bayAsset: "Science Wing 3rd-Floor Hallway",
    severity: "High",
    status: "Correlated",
    detected: "1 day ago",
    createdDate: "Oct 04, 2026 • 11:30 AM",
    dateHorizon: "today",
    clusterId: "CLU-05",
    relatedClusterName: "Chemical Exhaust Scrubber Guide Vane Stalling",
    relatedPattern: "Scrubber Aerodynamic Stalling & Flow Reversal",
    associatedRisk: "Chemical Vapor Infiltration Hazard",
    riskId: "RSK-06",
    riskSeverity: "High",
    leadTime: "5 Days Remaining",
    relatedCount: 9,
    frequencyTrend: "Increasing student reports",
    description: "4 graduate students and lab manager filed odor complaints regarding organic solvent smells in public corridor.",
    aiAnalysis: "Odor reports correlate perfectly with static pressure flutter incidents, proving reverse air seepage past fume hood sashes.",
    evidence: [
      { type: "Campus Complaint", title: "EHS Ticket #TKT-4921", detail: "Reports of solvent vapor in hallway between 11:00 and 11:45" }
    ],
    timeline: [
      { period: "Week 2", count: 1, note: "Faint smell reported" },
      { period: "Week 3", count: 4, note: "Multiple student reports logged" }
    ],
    recommendedAction: "Check sash face velocity interlocks and purge lab ventilation lines immediately."
  },
  {
    id: "SIG-SFT-03",
    title: "Scrubber Guide Vane Actuator Linkage Binding",
    source: "HVAC Maintenance Work Order #WO-88712",
    sourceType: "Maintenance Report",
    category: "Maintenance complaint",
    location: "Engineering Building",
    bayAsset: "Scrubber Blower #4 Vane Actuator",
    severity: "High",
    status: "Correlated",
    detected: "4 days ago",
    createdDate: "Oct 01, 2026 • 03:45 PM",
    dateHorizon: "week",
    clusterId: "CLU-05",
    relatedClusterName: "Chemical Exhaust Scrubber Guide Vane Stalling",
    relatedPattern: "Scrubber Aerodynamic Stalling & Flow Reversal",
    associatedRisk: "Chemical Vapor Infiltration Hazard",
    riskId: "RSK-06",
    riskSeverity: "High",
    leadTime: "5 Days Remaining",
    relatedCount: 9,
    frequencyTrend: "Mechanical friction buildup",
    description: "Actuator arm observed sticking at 35% open position during routine preventive inspection due to corrosive salt crusting on pivot pin.",
    aiAnalysis: "Corrosion binds the linkage when weather changes wind load, triggering rapid fan stalling and lab depressurization loss.",
    evidence: [
      { type: "Maintenance Log", title: "Technician Inspection Report", detail: "Pivot pin heavily crusted with ammonium sulfate salt crystals" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Inspection scheduled" },
      { period: "Week 3", count: 3, note: "Linkage binding confirmed on physical test" }
    ],
    recommendedAction: "Disassemble actuator pivot, clean with citric acid solvent, and install Teflon-lined sealed bearing."
  },

  // --- CLUSTER 6: Clean Packaging Suite 1 Ceiling Plenum Drift ---
  {
    id: "SIG-TMP-01",
    title: "Cleanroom Zone 4 Ceiling Thermocouple Grid Delta",
    source: "Environmental Thermocouple Array TC-04",
    sourceType: "Sensor",
    category: "Temperature anomaly",
    location: "Clean Packaging Suite 1",
    bayAsset: "Ceiling Plenum Return Bank 4",
    severity: "Medium",
    status: "Correlated",
    detected: "Yesterday",
    createdDate: "Oct 04, 2026 • 02:00 PM",
    dateHorizon: "today",
    clusterId: "CLU-06",
    relatedClusterName: "Clean Packaging Suite 1 Ceiling Plenum Drift",
    relatedPattern: "Heat Exchanger Fouling Thermal Drift Pattern",
    associatedRisk: "Class 5 Cleanroom Thermal & Bio-Excursion",
    riskId: "RSK-03",
    riskSeverity: "Medium",
    leadTime: "21 Days Remaining",
    relatedCount: 5,
    frequencyTrend: "Steady upward drift (+0.08°C / day)",
    description: "Zone 4 ceiling plenum return temperature rising +0.4°C above ISO Class 5 cleanroom thermal specification.",
    aiAnalysis: "Biofilm fouling in secondary heat exchanger tubes is reducing heat transfer coefficient, causing continuous plenum micro-drift.",
    evidence: [
      { type: "Thermocouple Grid", title: "Plenum Delta-T Expansion", detail: "Continuous +0.08°C/day expansion relative to outdoor wet bulb" },
      { type: "Heat Exchanger", title: "Chilled Water Approach Delta", detail: "Approach widened from 1.8°C to 2.9°C" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Slight temperature overshoot" },
      { period: "Week 2", count: 2, note: "Cooling recovery time lengthened" },
      { period: "Week 3", count: 5, note: "Steady thermal drift logged" }
    ],
    recommendedAction: "Conduct automated CIP biocide chemical flush on heat exchanger HX-09 during weekend maintenance window."
  },
  {
    id: "SIG-TMP-02",
    title: "Heat Exchanger HX-09 Approach Temperature Divergence",
    source: "SCADA Plant Performance Historian Archive",
    sourceType: "Document",
    category: "Temperature anomaly",
    location: "Block B",
    bayAsset: "Plate Heat Exchanger HX-09",
    severity: "Medium",
    status: "Correlated",
    detected: "4 days ago",
    createdDate: "Oct 01, 2026 • 10:00 AM",
    dateHorizon: "week",
    clusterId: "CLU-06",
    relatedClusterName: "Clean Packaging Suite 1 Ceiling Plenum Drift",
    relatedPattern: "Heat Exchanger Fouling Thermal Drift Pattern",
    associatedRisk: "Class 5 Cleanroom Thermal & Bio-Excursion",
    riskId: "RSK-03",
    riskSeverity: "Medium",
    leadTime: "21 Days Remaining",
    relatedCount: 5,
    frequencyTrend: "Thermal efficiency decay",
    description: "Thermodynamic heat exchange calculation indicates overall U-value decreased by 14.8% over the past 28 operating days.",
    aiAnalysis: "Consistent with 0.12mm biological slime film insulating secondary titanium heat transfer plates.",
    evidence: [
      { type: "Thermodynamic Calculation", title: "Overall Heat Transfer Coefficient", detail: "U-value dropped from 2,400 W/m²K to 2,044 W/m²K" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Baseline logged" },
      { period: "Week 3", count: 3, note: "Efficiency loss confirmed" }
    ],
    recommendedAction: "Execute Clean-in-Place (CIP) flush and verify biocide chemical dosing levels."
  },
  {
    id: "SIG-TMP-03",
    title: "Packaging Foil Heat-Seal Cycle Variation Complaint",
    source: "Cleanroom Packaging Production Log Line 3",
    sourceType: "Complaint",
    category: "Temperature anomaly",
    location: "Clean Packaging Suite 1",
    bayAsset: "Blister Packaging Line 3",
    severity: "Low",
    status: "Investigating",
    detected: "5 days ago",
    createdDate: "Sep 30, 2026 • 04:15 PM",
    dateHorizon: "week",
    clusterId: "CLU-06",
    relatedClusterName: "Clean Packaging Suite 1 Ceiling Plenum Drift",
    relatedPattern: "Heat Exchanger Fouling Thermal Drift Pattern",
    associatedRisk: "Class 5 Cleanroom Thermal & Bio-Excursion",
    riskId: "RSK-03",
    riskSeverity: "Medium",
    leadTime: "21 Days Remaining",
    relatedCount: 5,
    frequencyTrend: "Intermittent seal rejects",
    description: "Packaging operators reported micro-variation in blister seal integrity due to room ambient temperature and humidity creep.",
    aiAnalysis: "Weak human symptom of subtle cleanroom environmental drift before formal ISO alarm thresholds trigger.",
    evidence: [
      { type: "Production Log", title: "Heat-Seal Rejection Rate", detail: "Reject rate increased from 0.02% to 0.14% during 14:00-16:00 window" }
    ],
    timeline: [
      { period: "Week 2", count: 1, note: "Operator noted seal temperature variation" }
    ],
    recommendedAction: "Trim zone 4 damper actuator to stabilize local airflow until HX-09 is serviced."
  },

  // --- ADDITIONAL PRECURSORS ---
  {
    id: "SIG-CRW-01",
    title: "North Entry Turnstile Egress Density Congestion",
    source: "Optical Egress Counter & Vision Analytics Grid",
    sourceType: "Image",
    category: "Overcrowding",
    location: "Main Cafeteria",
    bayAsset: "North Entry Turnstiles",
    severity: "Medium",
    status: "Active",
    detected: "1 hour ago",
    createdDate: "Oct 05, 2026 • 08:15 AM",
    dateHorizon: "today",
    clusterId: "CLU-07",
    relatedClusterName: "Shift Changeover Egress Bottleneck",
    relatedPattern: "Cyclical Peak Shift Queuing Congestion",
    associatedRisk: "Egress Safety & Shift Delay Hazard",
    riskId: "RSK-07",
    riskSeverity: "Medium",
    leadTime: "Operational Recurring",
    relatedCount: 15,
    frequencyTrend: "Recurring peak surges",
    description: "Corridor egress density peaked at 3.2 persons/sq.m with card reader latency increasing turnstile queue wait times by 240%.",
    aiAnalysis: "Turnstiles are creating bottleneck during shift changeover (12:00-13:30), creating fire egress compliance vulnerability.",
    evidence: [
      { type: "Vision Analytics", title: "Egress Density Threshold Exceeded", detail: "Density reached 3.2 persons/sq.m during peak hour" },
      { type: "Complaint Log", title: "15 Student / Staff Complaints", detail: "Turnstile delays causing academic tardiness" }
    ],
    timeline: [
      { period: "Week 1", count: 3, note: "Initial queue delay logged" },
      { period: "Week 2", count: 7, note: "Turnstile bottleneck reported" },
      { period: "Week 3", count: 15, note: "Persistent corridor spillover" }
    ],
    recommendedAction: "Stagger meal break intervals by 15 minutes, activate auxiliary turnstile gate #3."
  },
  {
    id: "SIG-PMP-01",
    title: "Chilled Water Secondary Pump #3 Cavitation Ping",
    source: "Operator Shift Round Log #MNT-9821",
    sourceType: "Complaint",
    category: "Maintenance complaint",
    location: "Utility Basement",
    bayAsset: "Secondary Chiller Pump #3",
    severity: "Medium",
    status: "Investigating",
    detected: "6 hours ago",
    createdDate: "Oct 05, 2026 • 03:20 AM",
    dateHorizon: "today",
    clusterId: "CLU-08",
    relatedClusterName: "Secondary Chiller Pump Cavitation Inception",
    relatedPattern: "Pump Suction Cavitation & NPSH Deficit",
    associatedRisk: "Chilled Water Core Loop Tripping",
    riskId: "RSK-08",
    riskSeverity: "Medium",
    leadTime: "16 Days Remaining",
    relatedCount: 7,
    frequencyTrend: "Periodic acoustic rattle",
    description: "Operator noted persistent gravel-like metallic pinging at 48 Hz during low-demand night cycling.",
    aiAnalysis: "Suction basket strainer partial occlusion reduces available NPSH, triggering localized vapor cavity collapse on impeller tips.",
    evidence: [
      { type: "Operator Log", title: "Acoustic Cavitation Rattle Reported", detail: "Ping audible during 40-60% VFD modulation" },
      { type: "SCADA Telemetry", title: "Suction Pressure Dip", detail: "NPSH margin dropped to 1.1m (Threshold: 1.8m)" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Noise noted on night round" },
      { period: "Week 2", count: 3, note: "Suction pressure dip during reload" },
      { period: "Week 3", count: 7, note: "Frequent cavitation bursts" }
    ],
    recommendedAction: "Backflush suction basket strainer and verify minimum bypass flow valve modulation."
  }
];

// High-Coherence Precursor Clusters for Milestone 4 Signal Intelligence
const RELATED_SIGNAL_CLUSTERS = [
  {
    id: "CLU-01",
    title: "Sub-Slab Pressurized Conduit Seepage",
    category: "Water leakage",
    location: "Block A (Assembly Bay 4 & Conduit 4B)",
    signalCount: 12,
    repetitionRate: "Surging (+320% velocity over 21 days)",
    detectedPattern: "Repeated Sub-Slab Moisture Saturation Pattern",
    patternCoherence: "91.4% Coherence",
    associatedRisk: "Block A Flooding & Feeder Line Halt",
    riskId: "RSK-01",
    riskSeverity: "High",
    leadTime: "14 Days Remaining",
    potentialImpact: "$340,000 Unplanned Line Downtime & Trench Flooding",
    primarySources: ["Sensor", "Complaint", "Image", "Maintenance Report"],
    signals: [
      { id: "SIG-WTR-01", title: "Sub-Slab Acoustic Micro-Hiss Detected", sourceType: "Sensor", date: "Oct 05, 07:15 AM", severity: "High" },
      { id: "SIG-WTR-02", title: "Shift Supervisor Floor Dampness Observation", sourceType: "Complaint", date: "Oct 05, 04:30 AM", severity: "High" },
      { id: "SIG-WTR-03", title: "Trench 4B Concrete Mineral Efflorescence", sourceType: "Image", date: "Oct 04, 02:10 PM", severity: "Critical" },
      { id: "SIG-WTR-04", title: "Sump Pump Basin Evacuation Run Frequency Surge", sourceType: "Maintenance Report", date: "Oct 03, 09:40 AM", severity: "High" }
    ],
    whyItMatters: "Individual minor floor moisture reports and acoustic hiss are often dismissed as routine spills. When cross-correlated, they reveal an expanding sub-slab pressurized pipe failure directly beneath primary electrical conduits."
  },
  {
    id: "CLU-02",
    title: "Drive AX-402 Bearing Cage Fatigue Cascade",
    category: "Equipment failure",
    location: "Engineering Building (Assembly Bay 4)",
    signalCount: 8,
    repetitionRate: "Accelerating (+2.84σ envelope deviation)",
    detectedPattern: "Sub-Surface Bearing Cage Fatigue Cascade",
    patternCoherence: "94.6% Coherence",
    associatedRisk: "Continuous Feeder #4 Catastrophic Seizure",
    riskId: "RSK-04",
    riskSeverity: "Critical",
    leadTime: "18 Days Remaining",
    potentialImpact: "$480,000 Unplanned Outage & Stator Destruction",
    primarySources: ["Sensor", "Complaint", "Maintenance Report", "Image", "Document"],
    signals: [
      { id: "SIG-EQP-01", title: "High-Frequency 3,420 Hz Harmonic Jitter Surge", sourceType: "Sensor", date: "Oct 05, 08:40 AM", severity: "Critical" },
      { id: "SIG-EQP-02", title: "Operator 3rd-Shift Cyclical Hum Complaint", sourceType: "Complaint", date: "Sep 17, 11:20 PM", severity: "High" },
      { id: "SIG-EQP-03", title: "Premature Bearing Relubrication & Metallic Fines", sourceType: "Maintenance Report", date: "Sep 21, 09:15 AM", severity: "High" },
      { id: "SIG-EQP-04", title: "Drone FLIR Casing Thermal Gradient (+4.7°C)", sourceType: "Image", date: "Sep 28, 10:45 AM", severity: "High" }
    ],
    whyItMatters: "Single-metric vibration monitors ignored early harmonic hum as ambient factory noise. Cross-correlating operator logs with lube metallic fines and FLIR thermography proves imminent mechanical seizure."
  },
  {
    id: "CLU-03",
    title: "Extrusion Press #2 Proportional Valve Cavitation",
    category: "Equipment failure",
    location: "Block C (Press Station #2)",
    signalCount: 12,
    repetitionRate: "Surging (+16% / week)",
    detectedPattern: "Proportional Directional Valve Cavitation Drift",
    patternCoherence: "91.2% Coherence",
    associatedRisk: "Extrusion Line Spool Seizure & Billet Spoilage",
    riskId: "RSK-05",
    riskSeverity: "High",
    leadTime: "12 Days Remaining",
    potentialImpact: "$260,000 Hydraulic Contamination & Scrapped Stock",
    primarySources: ["Sensor", "Complaint", "Document", "Incident Report"],
    signals: [
      { id: "SIG-HYD-01", title: "Proportional Valve Acoustic Cavitation Burst", sourceType: "Sensor", date: "Oct 05, 05:20 AM", severity: "High" },
      { id: "SIG-HYD-02", title: "Press Operator Gravel-Like Rattle Report", sourceType: "Complaint", date: "Oct 04, 07:45 PM", severity: "Medium" },
      { id: "SIG-HYD-03", title: "Hydraulic Fluid Spectrographic Micro-Debris", sourceType: "Document", date: "Sep 30, 02:00 PM", severity: "High" },
      { id: "SIG-HYD-04", title: "Billet Surface Thickness Ripple Quality Rejection", sourceType: "Incident Report", date: "Sep 29, 11:15 AM", severity: "Medium" }
    ],
    whyItMatters: "Subtle rattling sounds and minor billet surface ripple were treated as routine tooling wear. Correlation with suction pressure drops proves negative suction head is entraining air micro-bubbles into the valve spool."
  },
  {
    id: "CLU-04",
    title: "Switchgear Bus 3B Thermal & Harmonic Drift",
    category: "Electrical issue",
    location: "Power Island (Switchgear Bus 3B)",
    signalCount: 6,
    repetitionRate: "Cyclical upward drift (+4.8% THD)",
    detectedPattern: "Harmonic Resonance & Phase Connector Degradation",
    patternCoherence: "88.4% Coherence",
    associatedRisk: "Switchgear Bus 3B Thermal Overload & Arc Flash",
    riskId: "RSK-02",
    riskSeverity: "High",
    leadTime: "9 Days Remaining",
    potentialImpact: "$195,000 Main Feeder Trip & Facility-Wide Blackout",
    primarySources: ["Sensor", "Incident Report", "Image"],
    signals: [
      { id: "SIG-ELE-01", title: "Switchgear Bus 3B Total Harmonic Distortion Surge", sourceType: "Sensor", date: "Oct 04, 04:30 PM", severity: "High" },
      { id: "SIG-ELE-02", title: "Inverter Thermal Relay Micro-Trip Near-Miss", sourceType: "Incident Report", date: "Sep 25, 02:40 PM", severity: "High" },
      { id: "SIG-ELE-03", title: "Thermographic Scan: +6.1°C Phase Hotspot", sourceType: "Image", date: "Sep 27, 09:20 AM", severity: "High" }
    ],
    whyItMatters: "Harmonic voltages elevated by variable frequency drives are creating localized eddy current heating on phase couplings, risking an uncontained arc fault."
  },
  {
    id: "CLU-05",
    title: "Chemical Exhaust Scrubber Guide Vane Stalling",
    category: "Safety concern",
    location: "Engineering Building (Chemical Lab Suite 3)",
    signalCount: 9,
    repetitionRate: "Surging (3.4 events / day)",
    detectedPattern: "Scrubber Aerodynamic Stalling & Flow Reversal",
    patternCoherence: "86.2% Coherence",
    associatedRisk: "Chemical Vapor Infiltration Hazard",
    riskId: "RSK-06",
    riskSeverity: "High",
    leadTime: "5 Days Remaining",
    potentialImpact: "Environmental Breach & Lab Suite Evacuation",
    primarySources: ["Sensor", "Complaint", "Maintenance Report"],
    signals: [
      { id: "SIG-SFT-01", title: "Duct Static Differential Pressure Flutter", sourceType: "Sensor", date: "Oct 05, 06:10 AM", severity: "High" },
      { id: "SIG-SFT-02", title: "Graduate Student Chemical Odor Reports", sourceType: "Complaint", date: "Oct 04, 11:30 AM", severity: "High" },
      { id: "SIG-SFT-03", title: "Scrubber Guide Vane Actuator Linkage Binding", sourceType: "Maintenance Report", date: "Oct 01, 03:45 PM", severity: "High" }
    ],
    whyItMatters: "Intermittent odor complaints in adjacent academic hallways correlate with mechanical guide vane binding, creating negative pressure pulses that bypass fume hood containment."
  },
  {
    id: "CLU-06",
    title: "Clean Packaging Suite 1 Ceiling Plenum Drift",
    category: "Temperature anomaly",
    location: "Clean Packaging Suite 1",
    signalCount: 5,
    repetitionRate: "Steady upward drift (+0.08°C / day)",
    detectedPattern: "Heat Exchanger Fouling Thermal Drift Pattern",
    patternCoherence: "82.5% Coherence",
    associatedRisk: "Class 5 Cleanroom Thermal & Bio-Excursion",
    riskId: "RSK-03",
    riskSeverity: "Medium",
    leadTime: "21 Days Remaining",
    potentialImpact: "$110,000 Packaging Seal Invalidation",
    primarySources: ["Sensor", "Document", "Complaint"],
    signals: [
      { id: "SIG-TMP-01", title: "Cleanroom Zone 4 Ceiling Thermocouple Grid Delta", sourceType: "Sensor", date: "Oct 04, 02:00 PM", severity: "Medium" },
      { id: "SIG-TMP-02", title: "Heat Exchanger HX-09 Approach Divergence", sourceType: "Document", date: "Oct 01, 10:00 AM", severity: "Medium" },
      { id: "SIG-TMP-03", title: "Packaging Foil Heat-Seal Cycle Variation Complaint", sourceType: "Complaint", date: "Sep 30, 04:15 PM", severity: "Low" }
    ],
    whyItMatters: "Gradual +0.4°C thermal drift in cleanroom ceilings is caused by biofilm accumulation in plate heat exchangers, which will breach Class 5 certification within 3 weeks."
  }
];

// Signal Frequency & Repetition Metrics for Part 7
const SIGNAL_FREQUENCY_METRICS = {
  weeklyVelocity: [
    { week: "Week 1", count: 18, label: "Baseline Ingress" },
    { week: "Week 2", count: 34, label: "+88% Acceleration" },
    { week: "Week 3", count: 68, label: "+100% Correlation" },
    { week: "Week 4", count: 128, label: "+320% Surge Velocity" }
  ],
  categoryBreakdown: [
    { category: "Equipment failure", count: 42, percentage: 33, color: "#A43A2A" },
    { category: "Electrical issue", count: 24, percentage: 19, color: "#C27803" },
    { category: "Overcrowding", count: 20, percentage: 16, color: "#57606A" },
    { category: "Water leakage", count: 18, percentage: 14, color: "#1B4332" },
    { category: "Safety concern", count: 14, percentage: 11, color: "#4D7C5D" },
    { category: "Maintenance complaint", count: 10, percentage: 7, color: "#8C959F" }
  ],
  topRepeatingIssues: [
    { issue: "Sub-slab pressurized seepage", cluster: "Block A Trench 4B", count: 12, frequency: "+320% velocity", riskLink: "Block A Flooding" },
    { issue: "High-frequency BPFO harmonic jitter", cluster: "Drive Feeder AX-402", count: 8, frequency: "+2.84σ deviation", riskLink: "Feeder Outage" },
    { issue: "Manifold proportional valve cavitation", cluster: "Press Station #2", count: 12, frequency: "+16% / week", riskLink: "Extrusion Seizure" },
    { issue: "Phase B THD harmonic heating", cluster: "Switchgear Bus 3B", count: 6, frequency: "Cyclical upward", riskLink: "Busbar Thermal Overload" },
    { issue: "Scrubber static pressure flutter", cluster: "Lab Suite 3", count: 9, frequency: "3.4 events / day", riskLink: "Vapor Infiltration" }
  ]
};

if (typeof window !== 'undefined') {
  window.EARLYSIGHT_SIGNALS = EARLYSIGHT_SIGNALS;
  window.SIGNAL_CONNECTIONS = SIGNAL_CONNECTIONS;
  window.OPERATIONAL_SIGNALS_REGISTRY = OPERATIONAL_SIGNALS_REGISTRY;
  window.RELATED_SIGNAL_CLUSTERS = RELATED_SIGNAL_CLUSTERS;
  window.SIGNAL_FREQUENCY_METRICS = SIGNAL_FREQUENCY_METRICS;
  window.PIPELINE_STAGES = PIPELINE_STAGES;
  window.SYNTHESIZED_RISK = SYNTHESIZED_RISK;
}

export {
  EARLYSIGHT_SIGNALS,
  SIGNAL_CONNECTIONS,
  OPERATIONAL_SIGNALS_REGISTRY,
  RELATED_SIGNAL_CLUSTERS,
  SIGNAL_FREQUENCY_METRICS,
  PIPELINE_STAGES,
  SYNTHESIZED_RISK
};


