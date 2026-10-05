/**
 * EarlySight — Enterprise Main Dashboard Dataset
 * Sections: Overview, Active Early Warnings, Emerging Issues, Verified Alerts,
 *           Issues Under Investigation, Resolved Issues, Impact Monitoring
 */

const DASHBOARD_METRICS = {
  activeSignalsCount: 128,
  emergingRisksCount: 7,
  highPriorityCount: 12,
  openActionsCount: 19,
  activeWarningsCount: 4,
  emergingIssuesCount: 7,
  verifiedAlertsCount: 3,
  underInvestigationCount: 5,
  resolvedIssuesCount: 18,
  meanLeadTimeDays: 19.4,
  totalDowntimeAvertedUSD: "$1,840,000",
  monitoredAssets: 342,
  signalIngestionRate: "1,420 / sec",
  modelConfidenceAvg: "93.8%",
  falsePositiveRate: "1.8%"
};

// 1. Active Early Warnings (High priority, concrete countdown lead times)
const ACTIVE_EARLY_WARNINGS = [
  {
    id: "EW-2026-091",
    title: "Sub-Surface Bearing Cage Fatigue Cascade",
    asset: "High-Throughput Feeder #4 — Drive AX-402",
    location: "Block A / Assembly Bay 4",
    leadTime: "18 Days",
    leadTimeDays: 18,
    urgency: "Critical Lead",
    confidence: "94.6%",
    impactRisk: "$340k Downtime Risk",
    signalsLinked: 6,
    precursorTypes: ["Maintenance", "Sensor", "Complaint", "FLIR Image"],
    statusIndicator: "critical", // red dot
    assignedTeam: "Mechanical Reliability",
    summary: "High-frequency 3,420 Hz envelope resonance combined with operator vibration reports and +4.7°C flanged hotspot indicate impending sub-surface cage spallation."
  },
  {
    id: "EW-2026-088",
    title: "Hydraulic Proportional Valve Cavitation Drift",
    asset: "Primary Extrusion Press #2 — Pump Station B",
    location: "Block C / Heavy Extrusion",
    leadTime: "12 Days",
    leadTimeDays: 12,
    urgency: "High Lead",
    confidence: "91.2%",
    impactRisk: "$210k Secondary Damage",
    signalsLinked: 5,
    precursorTypes: ["Telemetry", "SCADA Pressure", "Fluid Log"],
    statusIndicator: "critical",
    assignedTeam: "Hydraulics & Fluid Power",
    summary: "Differential pressure response delay (+140ms) with ultrasonic acoustic cavitation bursts detected prior to seal breach."
  },
  {
    id: "EW-2026-084",
    title: "Stator Winding Asymmetric Thermal Degradation",
    asset: "Main Turbine Compressor Unit 3",
    location: "Power Island / Generator Hall",
    leadTime: "24 Days",
    leadTimeDays: 24,
    urgency: "Moderate Lead",
    confidence: "88.9%",
    impactRisk: "$680k Outage Risk",
    signalsLinked: 4,
    precursorTypes: ["Thermal FLIR", "Historian Log", "Current Signature"],
    statusIndicator: "warning", // amber dot
    assignedTeam: "Electrical Asset Team",
    summary: "Phase B phase-to-ground resistance drift correlates with periodic cooling water intake delta and ambient shift humidity."
  },
  {
    id: "EW-2026-079",
    title: "Conveyor Drive Reducer Gear Tooth Pitting",
    asset: "Overland Bulk Conveyor Belt #7",
    location: "Stockyard Terminal / Zone 1",
    leadTime: "31 Days",
    leadTimeDays: 31,
    urgency: "Proactive Window",
    confidence: "87.4%",
    impactRisk: "$150k Material Spillage",
    signalsLinked: 4,
    precursorTypes: ["Lube Analysis", "Acoustic Sensor"],
    statusIndicator: "warning",
    assignedTeam: "Field Maintenance",
    summary: "Microscopic ferrous debris in quarterly oil sample matches periodic shock pulse load cycles on intermediate shaft pinion."
  }
];

// 2. Emerging Issues (Weak signal clusters crossing correlation threshold)
const EMERGING_ISSUES = [
  {
    id: "EMG-104",
    title: "Cooling Loop Heat Exchanger Fouling Trajectory",
    asset: "Chilled Water Loop #3 — Heat Exchanger HX-09",
    location: "Utility Basement / Block B",
    detectedTime: "2 days ago",
    velocity: "+18% / week",
    confidence: "78.4%",
    signalsLinked: 3,
    statusIndicator: "emerging",
    trend: "Gradual Upward Drift",
    note: "Approach temperature gradient expanding by +0.3°C/day. Cross-correlated with cooling tower biocide dosing log gap."
  },
  {
    id: "EMG-102",
    title: "Pneumatic Robotic Gripper Micro-Slip Variance",
    asset: "Pick & Place Gantry Robot Cell 5",
    location: "Packaging Hall / Line 2",
    detectedTime: "4 days ago",
    velocity: "+12% / week",
    confidence: "82.1%",
    signalsLinked: 4,
    statusIndicator: "emerging",
    trend: "Intermittent Micro-Drops",
    note: "Vacuum transducer pressure drop curves lengthened by 42ms; operator vision rejects up 2.4% during speed ramp."
  },
  {
    id: "EMG-099",
    title: "Boiler Feed Pump Impeller Minor Cavitation Flutter",
    asset: "Auxiliary Steam Feed Pump B-1",
    location: "Boiler House",
    detectedTime: "6 days ago",
    velocity: "+8% / week",
    confidence: "75.6%",
    signalsLinked: 3,
    statusIndicator: "emerging",
    trend: "Low-Frequency Surge",
    note: "Suction head variance during deaerator replenishment cycles triggering transient acoustic signature."
  },
  {
    id: "EMG-095",
    title: "Centrifugal Fan Dynamic Unbalance Inception",
    asset: "Exhaust Baghouse Blower #4",
    location: "Scrubber Plant / Roof",
    detectedTime: "8 days ago",
    velocity: "+15% / week",
    confidence: "79.8%",
    signalsLinked: 3,
    statusIndicator: "emerging",
    trend: "1X RPM Harmonic Growth",
    note: "Particulate accumulation on impeller blade trailing edge suspected from flue gas opacity logging."
  }
];

// 3. Verified Alerts (Engineers confirmed signature, interventions queued)
const VERIFIED_ALERTS = [
  {
    id: "VFD-2026-052",
    title: "Feed Line Bus 3B Harmonic Distortion & Phase Imbalance",
    asset: "Main Switchgear Bus 3B",
    location: "Substation 2 / Bay 3",
    verifiedBy: "Dr. K. Patel (Senior Electrical Engineer)",
    verificationDate: "Yesterday, 16:30",
    workOrder: "WO-2026-9904 (Scheduled)",
    targetWindow: "Day 6 Planned Outage",
    statusIndicator: "verified",
    actionPlan: "Harmonic filter bank capacitor replacement and busbar thermal tightening during 4-hour scheduled downtime."
  },
  {
    id: "VFD-2026-049",
    title: "Reactor Agitator Mechanical Seal Face Micro-Chipping",
    asset: "Continuous Polymerizer Reactor R-201",
    location: "Chemical Synthesis / Train 1",
    verifiedBy: "M. Torres (Reliability Specialist)",
    verificationDate: "3 days ago",
    workOrder: "WO-2026-9871 (Approved)",
    targetWindow: "Day 9 Turnaround",
    statusIndicator: "verified",
    actionPlan: "Tandem cartridge seal replacement prepared. Barrier fluid pressure raised to prevent volatile leakage."
  },
  {
    id: "VFD-2026-044",
    title: "Spindle Drive Axis Thermal Growth Misalignment",
    asset: "5-Axis CNC Precision Gantry Mill #12",
    location: "Tooling & Machining Bay",
    verifiedBy: "A. Weber (Precision Metrologist)",
    verificationDate: "5 days ago",
    workOrder: "WO-2026-9812 (In Queue)",
    targetWindow: "Next Shift Maintenance",
    statusIndicator: "verified",
    actionPlan: "Laser interferometer calibration and chiller fluid heat-sink cleaning."
  }
];

// 4. Issues Under Investigation (Currently being reviewed by cross-functional teams)
const UNDER_INVESTIGATION = [
  {
    id: "INV-2026-031",
    title: "Intermittent Air Receiver Pressure Decay After Midnight Shift",
    asset: "Central Plant Compressed Air System (Header 4)",
    location: "Utility Building 1",
    leadInvestigator: "H. Jensen (Operations)",
    team: "Utility Operations & Facilities",
    investigationStatus: "Collecting Forensic Telemetry",
    startedDate: "Sep 22, 2026",
    hypothesis: "Suspected automatic drain valve solenoid failure stuck partially open during cold ambient night cycle.",
    statusIndicator: "investigating"
  },
  {
    id: "INV-2026-028",
    title: "Automated Guided Vehicle AGV-04 Obstacle Lidar False E-Stops",
    asset: "Intralogistics Fleet AGV Unit 4",
    location: "Warehouse Logistics Aisles 7-12",
    leadInvestigator: "S. Tanaka (Automation)",
    team: "Robotics & Logistics",
    investigationStatus: "Cross-Checking Vision Scans",
    startedDate: "Sep 20, 2026",
    hypothesis: "Lens reflection from new retro-reflective floor tape installed last week under sodium vapor illumination.",
    statusIndicator: "investigating"
  },
  {
    id: "INV-2026-025",
    title: "Finished Product Bag Sealer Temperature Jitter",
    asset: "Rotary Heat Sealer Unit #3",
    location: "Clean Packaging Suite 1",
    leadInvestigator: "E. Morales (Quality QC)",
    team: "Quality Assurance & Production",
    investigationStatus: "Thermocouple Bench Test",
    startedDate: "Sep 19, 2026",
    hypothesis: "PID loop gain oscillation due to degraded solid-state relay contact resistance.",
    statusIndicator: "investigating"
  }
];

// 5. Resolved Issues (Averted failures with verified post-intervention savings)
const RESOLVED_ISSUES = [
  {
    id: "RES-2026-018",
    title: "Slurry Circulation Pump 2 Ceramic Liner Fracture Inception",
    asset: "Flue Gas Desulfurization Pump 2",
    location: "Environmental Plant",
    resolutionDate: "Sep 18, 2026",
    leadTimeProvided: "22 Days Ahead",
    downtimeAvoided: "48 Hours",
    costSaved: "$420,000",
    resolutionSummary: "Early warning detected cavitation acoustic harmonics 22 days before wall failure. Liner swapped during planned weekend turnaround with zero unplanned production stoppage.",
    statusIndicator: "resolved"
  },
  {
    id: "RES-2026-014",
    title: "Roller Kiln Main Drive Pinion Tooth Fracture Prevention",
    asset: "Rotary Calcination Kiln #1",
    location: "Thermal Processing Bay",
    resolutionDate: "Sep 09, 2026",
    leadTimeProvided: "17 Days Ahead",
    downtimeAvoided: "72 Hours",
    costSaved: "$650,000",
    resolutionSummary: "Multi-modal correlation of vibration envelope and lube metal particle count triggered early pin replacement, preventing catastrophic ring gear destruction.",
    statusIndicator: "resolved"
  },
  {
    id: "RES-2026-009",
    title: "Packaging Case Packer Pneumatic Pusher Cam Jam Cascade",
    asset: "High-Speed Case Packer 4",
    location: "Packaging Line 1",
    resolutionDate: "Aug 29, 2026",
    leadTimeProvided: "11 Days Ahead",
    downtimeAvoided: "16 Hours",
    costSaved: "$120,000",
    resolutionSummary: "Motor current micro-surges flagged follower bearing binding before shaft scoring occurred. Lubrication passage cleared.",
    statusIndicator: "resolved"
  }
];

// 6. Impact Monitoring (Quantitative ROI & Operational Integrity)
const IMPACT_METRICS = {
  monthlyAvertedHours: [38, 44, 52, 64, 78, 92],
  months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  breakdownByCategory: [
    { category: "Mechanical Failure", avertedCost: "$890,000", percentage: "48%" },
    { category: "Electrical & Power Quality", avertedCost: "$440,000", percentage: "24%" },
    { category: "Thermal & Cooling", avertedCost: "$320,000", percentage: "18%" },
    { category: "Fluid & Hydraulic", avertedCost: "$190,000", percentage: "10%" }
  ],
  leadTimeDistribution: [
    { range: "7-14 Days Lead", count: 12, percent: "32%" },
    { range: "15-21 Days Lead", count: 18, percent: "48%" },
    { range: "22-35 Days Lead", count: 8, percent: "20%" }
  ],
  benchmarkComparison: {
    earlySightMeanLeadDays: 19.4,
    traditionalThresholdLeadDays: 2.1,
    unplannedDowntimeReduction: "-76.4%",
    catastrophicBreakdownsAvoided: 14
  }
};

// 7. Prominent Emerging Risks Panel Dataset (Exact fields requested)
const EMERGING_RISKS_PANEL = [
  {
    id: "RSK-01",
    title: "WATER LEAKAGE PATTERN",
    location: "Block A",
    signalsCount: 12,
    signalsLabel: "12 related signals",
    frequency: "Increasing",
    trend: "Increasing frequency",
    severity: "High",
    confidence: "91%",
    firstDetected: "21 days ago (Sep 14)",
    lastDetected: "14 minutes ago",
    lastUpdated: "14 minutes ago",
    status: "Investigation Required",
    severityBadgeClass: "badge-severity-high",
    statusBadgeClass: "badge-status-investigation",
    recommendedAction: "Deploy ultrasonic acoustic leak detector to Block A Trench 4B flange joint. Isolate auxiliary bypass valve BV-12.",
    summary: "Multiple leakage reports have been detected in Block A over the past three weeks. Frequency has increased compared with the previous period, indicating a potential recurring infrastructure issue.",
    sparklineD: "M 0,38 Q 25,35 50,29 T 100,18 T 150,6",
    sparklineFill: "M 0,38 Q 25,35 50,29 T 100,18 T 150,6 L 150,48 L 0,48 Z",
    endPointY: 6,
    subsystem: "Civil / Water Utilities"
  },
  {
    id: "RSK-02",
    title: "HVAC FAILURE TREND",
    location: "Engineering Building",
    signalsCount: 8,
    signalsLabel: "8 related signals",
    frequency: "Increasing",
    trend: "Increasing trend",
    severity: "Medium",
    confidence: "84%",
    firstDetected: "9 days ago (Sep 26)",
    lastDetected: "28 minutes ago",
    lastUpdated: "28 minutes ago",
    status: "Under Active Monitoring",
    severityBadgeClass: "badge-severity-medium",
    statusBadgeClass: "badge-status-monitoring",
    recommendedAction: "Recalibrate chilled water valve actuator and service air-handler primary filter bank in Wing B.",
    summary: "Temperature delta and acoustic vibration anomalies in the 3rd floor AHU indicate impending actuator motor coil degradation.",
    sparklineD: "M 0,36 Q 25,38 50,26 T 100,28 T 150,12",
    sparklineFill: "M 0,36 Q 25,38 50,26 T 100,28 T 150,12 L 150,48 L 0,48 Z",
    endPointY: 12,
    subsystem: "HVAC & Thermal Systems"
  },
  {
    id: "RSK-03",
    title: "OVERCROWDING PATTERN",
    location: "Main Cafeteria",
    signalsCount: 15,
    signalsLabel: "15 related signals",
    frequency: "Recurring",
    trend: "Recurring peak surges",
    severity: "Medium",
    confidence: "88%",
    firstDetected: "14 days ago (Sep 21)",
    lastDetected: "45 minutes ago",
    lastUpdated: "45 minutes ago",
    status: "Operational Rebalancing",
    severityBadgeClass: "badge-severity-medium",
    statusBadgeClass: "badge-status-scheduled",
    recommendedAction: "Stagger academic lunch slots by 15 minutes and activate auxiliary serving queue line #3 during 12:00-13:30.",
    summary: "Optical sensor throughput and operator safety logs reveal recurring egress bottleneck during changeover hours.",
    sparklineD: "M 0,34 Q 25,28 50,35 T 100,22 T 150,14",
    sparklineFill: "M 0,34 Q 25,28 50,35 T 100,22 T 150,14 L 150,48 L 0,48 Z",
    endPointY: 14,
    subsystem: "Facility Logistics & EHS"
  },
  {
    id: "RSK-04",
    title: "Sub-Surface Bearing Cage Fatigue Cascade",
    location: "Block A / Drive AX-402",
    signalsCount: 24,
    signalsLabel: "24 related signals",
    frequency: "Accelerating",
    trend: "Accelerating trend",
    severity: "Critical",
    confidence: "94.6%",
    firstDetected: "18 days ago (Sep 06)",
    lastDetected: "4 minutes ago",
    lastUpdated: "4 minutes ago",
    status: "Actionable Early Warning",
    severityBadgeClass: "badge-severity-critical",
    statusBadgeClass: "badge-status-warning",
    recommendedAction: "Schedule drive bearing replacement during planned shift changeover window to avert shaft seizure.",
    summary: "Tribological grease particle degradation matches 3,420 Hz envelope harmonic and +4.7°C casing thermal bloom.",
    sparklineD: "M 0,42 Q 25,40 50,33 T 100,19 T 150,4",
    sparklineFill: "M 0,42 Q 25,40 50,33 T 100,19 T 150,4 L 150,48 L 0,48 Z",
    endPointY: 4,
    subsystem: "Mechanical Drive Train"
  },
  {
    id: "RSK-05",
    title: "Hydraulic Proportional Valve Cavitation Drift",
    location: "Block C / Pump Station B",
    signalsCount: 12,
    signalsLabel: "12 related signals",
    frequency: "Increasing",
    trend: "Increasing trend",
    severity: "High",
    confidence: "91.2%",
    firstDetected: "12 days ago (Sep 12)",
    lastDetected: "18 minutes ago",
    lastUpdated: "18 minutes ago",
    status: "Investigation Required",
    severityBadgeClass: "badge-severity-high",
    statusBadgeClass: "badge-status-investigation",
    recommendedAction: "Replace internal spool cartridge and inspect suction line strainer for cavitation pitting.",
    summary: "Ultrasonic cavitation micro-bursts with differential valve lag indicating internal spool erosion before seal rupture.",
    sparklineD: "M 0,39 Q 25,35 50,28 T 100,19 T 150,8",
    sparklineFill: "M 0,39 Q 25,35 50,28 T 100,19 T 150,8 L 150,48 L 0,48 Z",
    endPointY: 8,
    subsystem: "Hydraulic Fluid Power"
  },
  {
    id: "RSK-06",
    title: "Conveyor Reducer Tooth Micro-Pitting",
    location: "Stockyard Terminal / Zone 1",
    signalsCount: 8,
    signalsLabel: "8 related signals",
    frequency: "Gradual",
    trend: "Gradual upward trend",
    severity: "Low",
    confidence: "87.4%",
    firstDetected: "31 days ago (Aug 24)",
    lastDetected: "2 hours ago",
    lastUpdated: "2 hours ago",
    status: "Scheduled Inspection",
    severityBadgeClass: "badge-severity-low",
    statusBadgeClass: "badge-status-scheduled",
    recommendedAction: "Execute vibration baseline check on quarterly lube turnaround. Replace intermediate pinion.",
    summary: "Ferrous debris signature in quarterly lube analysis matches cyclical torsional shock pulses on intermediate shaft pinion.",
    sparklineD: "M 0,38 Q 25,35 50,31 T 100,24 T 150,15",
    sparklineFill: "M 0,38 Q 25,35 50,31 T 100,24 T 150,15 L 150,48 L 0,48 Z",
    endPointY: 15,
    subsystem: "Bulk Handling Logistics"
  }
];

if (typeof window !== 'undefined') {
  window.DASHBOARD_METRICS = DASHBOARD_METRICS;
  window.ACTIVE_EARLY_WARNINGS = ACTIVE_EARLY_WARNINGS;
  window.EMERGING_ISSUES = EMERGING_ISSUES;
  window.VERIFIED_ALERTS = VERIFIED_ALERTS;
  window.UNDER_INVESTIGATION = UNDER_INVESTIGATION;
  window.RESOLVED_ISSUES = RESOLVED_ISSUES;
  window.IMPACT_METRICS = IMPACT_METRICS;
  window.EMERGING_RISKS_PANEL = EMERGING_RISKS_PANEL;
}

export {
  DASHBOARD_METRICS,
  ACTIVE_EARLY_WARNINGS,
  EMERGING_ISSUES,
  VERIFIED_ALERTS,
  UNDER_INVESTIGATION,
  RESOLVED_ISSUES,
  IMPACT_METRICS,
  EMERGING_RISKS_PANEL
};
