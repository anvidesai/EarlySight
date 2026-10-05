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
  {
    id: "SIG-WTR-01",
    title: "WATER LEAKAGE — BLOCK A",
    category: "Water leakage",
    location: "Block A",
    severity: "High",
    status: "Correlated",
    detected: "2 hours ago",
    createdDate: "Oct 05, 2026 • 07:15 AM",
    relatedCount: 12,
    source: "Sub-slab Acoustic Transducer AC-14 • SCADA Flow Differential",
    description: "Localized micro-pressure drops and subsurface moisture accumulation detected across auxiliary chilled feed line near Joint 4B-12.",
    locationsCount: 4,
    observationDuration: "3 weeks",
    frequencyTrend: "Increasing frequency (+320% velocity)",
    evidence: [
      { type: "SCADA Telemetry", title: "Auxiliary Feed Flow Rate Delta", detail: "-4.2% differential pressure across isolation gate valve BV-12" },
      { type: "Maintenance Log", title: "WO-89104 Floor Moisture Report", detail: "Shift supervisor noted efflorescence blooming on concrete floor slabs" },
      { type: "Acoustic Sensor", title: "Acoustic Transducer AC-14 Peak", detail: "High-frequency hiss (4.2 kHz) localized at underground pipe sleeve" },
      { type: "Soil Probe", title: "Moisture Sensor MS-08 Saturation", detail: "Groundwater probe indicates 88% saturation in sub-slab bedding sand" }
    ],
    timeline: [
      { period: "Week 1", count: 2, note: "Sub-slab pressure transient logged" },
      { period: "Week 2", count: 4, note: "Operator dampness report in Bay 4" },
      { period: "Week 3", count: 7, note: "Ultrasonic acoustic hiss detected" },
      { period: "Week 4", count: 12, note: "Active pressure drop & spread" }
    ],
    aiAnalysis: "Multiple leakage reports have been detected in Block A over the past three weeks. Frequency has increased compared with the previous period, indicating a potential recurring infrastructure issue.",
    recommendedAction: "Deploy ultrasonic acoustic leak detector to Block A Trench 4B flange joint. Isolate auxiliary bypass valve BV-12 within 48 hours to avert main assembly line flooding."
  },
  {
    id: "SIG-EQP-02",
    title: "BEARING CAGE CATASTROPHIC SPALLATION INCEPTION",
    category: "Equipment failure",
    location: "Engineering Building",
    severity: "Critical",
    status: "Active",
    detected: "35 minutes ago",
    createdDate: "Oct 05, 2026 • 08:40 AM",
    relatedCount: 8,
    source: "High-Frequency Envelope Accelerometer AX-402",
    description: "3,420 Hz envelope harmonic vibration surge on primary feeder motor drive shaft with casing thermal bloom.",
    locationsCount: 2,
    observationDuration: "2 weeks",
    frequencyTrend: "Accelerating trend (+2.84σ deviation)",
    evidence: [
      { type: "Sensor Telemetry", title: "Vibration Envelope Acceleration", detail: "Impulsive peak-to-peak shock pulse readings crossed 8.4 g-pk" },
      { type: "Lube Analysis", title: "Spectrographic Ferrous Particles", detail: "Severe metal debris concentration rising in quarterly oil sample" },
      { type: "Thermal FLIR", title: "Bearing Housing Heat Dissipation", detail: "+4.7°C localized temperature rise on outboard drive end" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Subtle cyclical hum dismissed as ambient resonance" },
      { period: "Week 2", count: 3, note: "Premature relubrication logged by maintenance tech" },
      { period: "Week 3", count: 8, note: "Severe high-frequency envelope harmonics surge" }
    ],
    aiAnalysis: "Tribological grease particle degradation matches 3,420 Hz envelope harmonic. Subsurface micro-spalling threatens shaft seizure within 18 days.",
    recommendedAction: "Execute emergency drive bearing replacement during planned shift changeover window to avert catastrophic mechanical seizure."
  },
  {
    id: "SIG-ELE-03",
    title: "SWITCHGEAR BUS 3B HARMONIC DISTORTION",
    category: "Electrical issue",
    location: "Power Island",
    severity: "High",
    status: "Investigating",
    detected: "Yesterday, 16:30",
    createdDate: "Oct 04, 2026 • 04:30 PM",
    relatedCount: 6,
    source: "Digital Power Quality Meter PQ-09 • EHS Safety Near-Miss Portal",
    description: "Phase B phase-to-ground resistance drift correlates with periodic cooling water intake delta and ambient shift humidity.",
    locationsCount: 3,
    observationDuration: "3 weeks",
    frequencyTrend: "Cyclical upward drift",
    evidence: [
      { type: "Power Meter", title: "Total Harmonic Distortion (THD)", detail: "5th and 7th harmonic voltages elevated by +4.8% on Bus 3B" },
      { type: "Safety Portal", title: "Micro-trip on Thermal Relay #T-12", detail: "Inverter tripped for 1.8 seconds then automatically reset" },
      { type: "Thermal Inspection", title: "Thermographic Scan #FLIR-104", detail: "+6.1°C hot spot on Busbar A-to-B phase isolation coupling" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Transient voltage sag recorded" },
      { period: "Week 2", count: 3, note: "Harmonic distortion THD up 1.8%" },
      { period: "Week 3", count: 6, note: "Thermal bloom on phase connector" }
    ],
    aiAnalysis: "Harmonic resonance between capacitor bank and variable frequency drives is accelerating thermal degradation across feeder busbars.",
    recommendedAction: "Torque busbar mechanical connections during 4-hour scheduled downtime and service harmonic filter bank capacitors."
  },
  {
    id: "SIG-CRW-04",
    title: "MAIN CAFETERIA OVERCROWDING & BOTTLENECK",
    category: "Overcrowding",
    location: "Main Cafeteria",
    severity: "Medium",
    status: "Active",
    detected: "1 hour ago",
    createdDate: "Oct 05, 2026 • 08:15 AM",
    relatedCount: 15,
    source: "Optical Egress Counters & Occupancy Vision Sensors",
    description: "Peak meal queuing times exceed safety comfort thresholds by 240% during shift changeover hours.",
    locationsCount: 2,
    observationDuration: "3 weeks",
    frequencyTrend: "Recurring peak surges",
    evidence: [
      { type: "Vision Analytics", title: "Egress Density Threshold Exceeded", detail: "Corridor density peaked at 3.2 persons/sq.m during 12:15-13:00" },
      { type: "Shift Feedback", title: "15 Student / Staff Complaints", detail: "Turnstile delays causing academic and shift transition tardiness" },
      { type: "Turnstile Telemetry", title: "Card Reader Latency Log", detail: "Queue evacuation cycle time increased from 45s to 4.2 minutes" }
    ],
    timeline: [
      { period: "Week 1", count: 3, note: "Initial meal queue delay logged" },
      { period: "Week 2", count: 7, note: "Turnstile bottleneck reported" },
      { period: "Week 3", count: 15, note: "Persistent corridor spillover" }
    ],
    aiAnalysis: "Recurring congestion pattern detected during 12:00-13:30 hours. Bottleneck is concentrated at north entry turnstiles and food station #2.",
    recommendedAction: "Stagger meal break intervals by 15 minutes, activate auxiliary queue line #3, and open secondary turnstiles during peak hours."
  },
  {
    id: "SIG-SFT-05",
    title: "EXHAUST SCRUBBER GUIDE VANE ANOMALY",
    category: "Safety concern",
    location: "Engineering Building",
    severity: "High",
    status: "Action Queued",
    detected: "3 hours ago",
    createdDate: "Oct 05, 2026 • 06:10 AM",
    relatedCount: 9,
    source: "Differential Pressure Transducer DP-SCI-03",
    description: "Negative pressure variance detected in chemical lab exhaust ducting during high-demand fume hood hours.",
    locationsCount: 3,
    observationDuration: "2 weeks",
    frequencyTrend: "Surging (3.4 events / day)",
    evidence: [
      { type: "Pressure Transducer", title: "Duct Static Pressure Fluctuation", detail: "Duct pressure fluttering between -18 Pa and -4 Pa (Spec: -25 Pa)" },
      { type: "Safety Incident", title: "4 Graduate Student Odor Reports", detail: "Intermittent chemical vapor detection logged in 3rd-floor hallway" },
      { type: "Blower Telemetry", title: "Exhaust Fan Motor Amp Oscillations", detail: "Motor current hunting by ±12% indicating aerodynamic stalling" }
    ],
    timeline: [
      { period: "Week 1", count: 2, note: "Minor static pressure fluctuation" },
      { period: "Week 2", count: 4, note: "Shift complaint logged in lab" },
      { period: "Week 3", count: 9, note: "Pressure flutter crosses alarm boundary" }
    ],
    aiAnalysis: "Guide vane mechanical linkage binding intermittently under cross-wind shear, risking reverse fume drift into occupied lab suites.",
    recommendedAction: "Lubricate guide vane actuator pivot linkage and replace differential pressure sensor pitot tube assembly within 24 hours."
  },
  {
    id: "SIG-MNT-06",
    title: "CHILLED WATER PUMP CAVITATION SURGE",
    category: "Maintenance complaint",
    location: "Utility Basement",
    severity: "Medium",
    status: "Investigating",
    detected: "4 hours ago",
    createdDate: "Oct 05, 2026 • 05:20 AM",
    relatedCount: 7,
    source: "Operator Shift Log #MNT-9821 • Acoustic Strain Gauge SG-48",
    description: "Operators noted gravel-like rattling sound coming from Secondary Chiller Pump #3 during low-demand cycling.",
    locationsCount: 2,
    observationDuration: "2 weeks",
    frequencyTrend: "Low-frequency periodic surge",
    evidence: [
      { type: "Operator Log", title: "Acoustic Cavitation Rattle Reported", detail: "Log notes persistent metallic pinging at 48 Hz during ramp-down" },
      { type: "SCADA Telemetry", title: "Suction Pressure Dip", detail: "NPSH margin dropped to 1.1m (Threshold: 1.8m) on low flow" },
      { type: "Vibration Probe", title: "Impeller Vane Pass Frequency", detail: "Vane pass harmonic amplitude doubled over past 14 days" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Acoustic noise noted on night round" },
      { period: "Week 2", count: 3, note: "Suction pressure dip during reload" },
      { period: "Week 3", count: 7, note: "Frequent cavitation acoustic bursts" }
    ],
    aiAnalysis: "Suction basket strainer partial occlusion reduces available NPSH, triggering localized vapor cavity collapse on impeller tips.",
    recommendedAction: "Backflush suction basket strainer and verify minimum bypass flow valve modulation before impeller cavitation pitting worsens."
  },
  {
    id: "SIG-TMP-07",
    title: "CLEANROOM CEILING PLENUM TEMPERATURE ANOMALY",
    category: "Temperature anomaly",
    location: "Clean Packaging Suite 1",
    severity: "Medium",
    status: "Correlated",
    detected: "Yesterday",
    createdDate: "Oct 04, 2026 • 02:00 PM",
    relatedCount: 5,
    source: "Environmental Thermocouple Array TC-04",
    description: "Zone 4 ceiling plenum temperature rising +0.4°C above ISO Class 5 cleanroom thermal specification.",
    locationsCount: 2,
    observationDuration: "3 weeks",
    frequencyTrend: "Steady upward thermal drift",
    evidence: [
      { type: "Thermocouple Grid", title: "Plenum Delta-T Expansion", detail: "Continuous +0.08°C/day expansion relative to outdoor wet bulb" },
      { type: "Heat Exchanger", title: "Chilled Water Approach Delta", detail: "Heat exchanger HX-09 approach widened from 1.8°C to 2.9°C" },
      { type: "Quality Log", title: "Packaging Seal Consistency Drift", detail: "Minor heat-seal cycle variations recorded on Line 3" }
    ],
    timeline: [
      { period: "Week 1", count: 1, note: "Slight temperature overshoot on startup" },
      { period: "Week 2", count: 2, note: "Cooling recovery time lengthened" },
      { period: "Week 3", count: 5, note: "Steady thermal drift logged" }
    ],
    aiAnalysis: "Biofilm fouling in heat exchanger tubes is reducing overall heat transfer coefficient, causing gradual thermal drift in cleanroom zones.",
    recommendedAction: "Conduct automated CIP biocide chemical flush on heat exchanger HX-09 during weekend maintenance window."
  },
  {
    id: "SIG-INF-08",
    title: "SUB-SLAB CONDUIT TRENCH SEEPAGE & EFFLORESCENCE",
    category: "Infrastructure damage",
    location: "Block A",
    severity: "Critical",
    status: "Action Queued",
    detected: "3 days ago",
    createdDate: "Oct 02, 2026 • 11:15 AM",
    relatedCount: 11,
    source: "Trench Moisture Sensor Array MS-12 • Civil Engineering Audit",
    description: "Pressurized micro-seepage pooling in primary utility trench beneath electrical bus conduits.",
    locationsCount: 4,
    observationDuration: "3 weeks",
    frequencyTrend: "Accelerating water ingress",
    evidence: [
      { type: "Civil Inspection", title: "Concrete Efflorescence Spall", detail: "White mineral salt leaching observed across 18 meters of trench wall" },
      { type: "Soil Moisture", title: "Bedding Sand Saturation", detail: "Moisture sensor array MS-12 shows 94% continuous fluid presence" },
      { type: "Sump Telemetry", title: "Sump Pump Run Frequency", detail: "Sump evacuation cycles increased from 2 runs/day to 18 runs/day" }
    ],
    timeline: [
      { period: "Week 1", count: 2, note: "Efflorescence crystals observed" },
      { period: "Week 2", count: 5, note: "Sump pump run-time increased 35%" },
      { period: "Week 3", count: 11, note: "Continuous micro-seepage pooled in trench" }
    ],
    aiAnalysis: "Gasket elastomer creep on 48-inch main distribution conduit has breached primary seal, risking electrical conduit flooding.",
    recommendedAction: "Excavate trench access hatch 4B, install mechanical containment sleeve, and isolate secondary line during Sunday maintenance."
  }
];

window.OPERATIONAL_SIGNALS_REGISTRY = OPERATIONAL_SIGNALS_REGISTRY;

