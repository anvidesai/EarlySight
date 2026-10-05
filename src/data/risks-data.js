/**
 * EarlySight — Enterprise Operational Risk Intelligence Dataset (Milestone 5)
 * 
 * Core Intelligence Workflow:
 * SIGNALS -> PATTERN -> RISK -> PRIORITY -> RECOMMENDED ACTION
 * 
 * Fields per risk:
 * - id: unique risk ID (e.g., RSK-01)
 * - title: human-readable risk title
 * - description: concise operational description
 * - location: facility zone & area
 * - subsystem: engineering subsystem
 * - score: 0–100 integer (0-24 Low, 25-49 Moderate, 50-74 High, 75-100 Critical)
 * - severity: Critical | High | Medium | Low (potential consequence/impact)
 * - severityReason: explanation of severity rating
 * - confidence: percentage string (evidence certainty)
 * - confidenceReason: explanation of model confidence
 * - evidenceCount: number of contributing precursors
 * - signalBreakdown: { maintenance, complaint, sensor, imageDoc }
 * - trend: 'Increasing' | 'Stable' | 'Decreasing'
 * - trendTrajectory: array of recent score readings [72, 79, 81, 86]
 * - status: 'Emerging' | 'Active' | 'Resolved'
 * - priority: 'P1' | 'P2' | 'P3' | 'P4'
 * - priorityLabel: 'Immediate' | 'High' | 'Monitor' | 'Low'
 * - leadTime: estimated window before functional failure
 * - financialRisk: potential unplanned downtime cost
 * - clusterId: link to M4 cluster (e.g. CLU-01)
 * - pattern: { name, coherence, synthesisEquation }
 * - whyItMatters: explainability paragraph
 * - contributingSignals: array of key signal items
 * - recommendedAction: { action, urgency, team, objective }
 */

export const RISKS_KPI_OVERVIEW = {
  activeRisks: 7,
  emergingRisks: 4,
  criticalHighRisks: 5,
  avgRiskScore: 71,
  risksIncreasing: 4,
  risksResolved: 2,
  monitoredAssets: 342,
  meanLeadDays: 16.8
};

export const OPERATIONAL_RISKS = [
  {
    id: "RSK-01",
    title: "Water Infrastructure Degradation",
    description: "Sub-slab pressurized conduit seepage causing localized concrete efflorescence, acoustic micro-hissing, and sump pump activation surges.",
    location: "Block A / Trench 4B",
    asset: "Pressurized Supply Conduit 4B-12",
    subsystem: "Civil / Water Utilities",
    score: 86,
    scoreTier: "Critical",
    severity: "High",
    severityReason: "Trench flooding threatens underground Bus 3B electrical feeder conduits and line assembly power.",
    confidence: "91%",
    confidenceReason: "Cross-correlated by 12 multi-modal signals across acoustic sensors, operator shift complaints, and drone thermography.",
    evidenceCount: 12,
    signalBreakdown: {
      maintenance: 4,
      complaint: 5,
      sensor: 2,
      imageDoc: 1
    },
    trend: "Increasing",
    trendSymbol: "↑",
    trendTrajectory: [68, 74, 80, 86],
    status: "Emerging",
    statusBadgeClass: "status-emerging",
    priority: "P1",
    priorityLabel: "Immediate",
    priorityBadgeClass: "priority-p1",
    leadTime: "14 Days Remaining",
    financialRisk: "$340,000 Trench Flooding & Feeder Halt",
    clusterId: "CLU-01",
    pattern: {
      name: "Repeated Sub-Slab Moisture Saturation Pattern",
      coherence: "91.4% Coherence",
      synthesisEquation: [
        "Repeated leakage reports",
        "Maintenance recurrence",
        "Same location (Trench 4B)",
        "Increasing frequency (+320%)"
      ]
    },
    whyItMatters: "Repeated water leakage reports in Block A increased over four consecutive days and overlap with maintenance incidents from the same area. The increasing frequency and spatial convergence indicate a developing infrastructure risk before pipe burst occurs.",
    contributingSignals: [
      { id: "SIG-WTR-01", title: "Sub-Slab Acoustic Micro-Hiss Detected", type: "Sensor", date: "Oct 05, 07:15 AM", severity: "High" },
      { id: "SIG-WTR-02", title: "Shift Supervisor Floor Dampness Observation", type: "Complaint", date: "Oct 05, 04:30 AM", severity: "High" },
      { id: "SIG-WTR-03", title: "Trench 4B Concrete Mineral Efflorescence", type: "Image", date: "Oct 04, 02:10 PM", severity: "Critical" },
      { id: "SIG-WTR-04", title: "Sump Pump Basin Run Frequency Surge (+320%)", type: "Maintenance", date: "Oct 03, 09:40 AM", severity: "High" }
    ],
    recommendedAction: {
      action: "Inspect Block A water supply and drainage infrastructure within next maintenance cycle. Isolate auxiliary bypass valve BV-12 and deploy ultrasonic pipe crawler.",
      urgency: "Immediate (within 24 hours)",
      team: "Civil Utilities & Plant Maintenance",
      expectedObjective: "Avert pressurized line blowout and prevent $340k downtime & trench flooding."
    },
    firstDetected: "21 days ago (Sep 14)",
    lastDetected: "14 minutes ago",
    sparklinePoints: [
      { x: 0, y: 32 }, { x: 30, y: 26 }, { x: 60, y: 18 }, { x: 90, y: 8 }
    ]
  },
  {
    id: "RSK-04",
    title: "Drive Feeder Failure Risk",
    description: "High-frequency 3,420 Hz envelope harmonic jitter combined with metal fines in lube sample and +4.7°C flanged casing hotspot.",
    location: "Assembly Bay 4",
    asset: "Continuous High-Throughput Feeder #4 — Drive AX-402",
    subsystem: "Mechanical Drive Train",
    score: 78,
    scoreTier: "Critical",
    severity: "High",
    severityReason: "Impending bearing cage spallation will freeze feeder line #4, resulting in emergency stator shutdown.",
    confidence: "88%",
    confidenceReason: "High-coherence envelope detection verified by SAP work order metallic particle count and FLIR thermography.",
    evidenceCount: 8,
    signalBreakdown: {
      maintenance: 3,
      complaint: 2,
      sensor: 2,
      imageDoc: 1
    },
    trend: "Increasing",
    trendSymbol: "↑",
    trendTrajectory: [58, 66, 72, 78],
    status: "Active",
    statusBadgeClass: "status-active",
    priority: "P1",
    priorityLabel: "Immediate",
    priorityBadgeClass: "priority-p1",
    leadTime: "18 Days Remaining",
    financialRisk: "$480,000 Unplanned Outage & Stator Destruction",
    clusterId: "CLU-02",
    pattern: {
      name: "Sub-Surface Bearing Cage Fatigue Cascade",
      coherence: "94.6% Coherence",
      synthesisEquation: [
        "3rd-shift operator cyclical hum complaint",
        "Premature relube metallic fines (32 cSt)",
        "Inverter micro-trip near-miss (1,840ms)",
        "Envelope resonance at 3,420 Hz"
      ]
    },
    whyItMatters: "Single-metric vibration monitors classified early harmonic hum as routine ambient noise. Cross-correlating operator shift logs with lube metallic fines and FLIR thermography proves progressive micro-binding and imminent bearing collapse.",
    contributingSignals: [
      { id: "SIG-EQP-01", title: "High-Frequency 3,420 Hz Harmonic Jitter Surge", type: "Sensor", date: "Oct 05, 08:40 AM", severity: "Critical" },
      { id: "SIG-EQP-02", title: "Operator 3rd-Shift Cyclical Hum Complaint", type: "Complaint", date: "Sep 17, 11:20 PM", severity: "High" },
      { id: "SIG-EQP-03", title: "Premature Bearing Relubrication & Metallic Fines", type: "Maintenance", date: "Sep 21, 09:15 AM", severity: "High" },
      { id: "SIG-EQP-04", title: "Drone FLIR Casing Thermal Gradient (+4.7°C)", type: "Image", date: "Sep 28, 10:45 AM", severity: "High" }
    ],
    recommendedAction: {
      action: "Execute precision laser shaft alignment and replace roller cage assembly during scheduled Thursday 2-hour changeover window.",
      urgency: "Immediate (within 48 hours)",
      team: "Mechanical Reliability Engineering",
      expectedObjective: "Avert catastrophic shaft seizure and preserve $480,000 throughput asset."
    },
    firstDetected: "18 days ago (Sep 06)",
    lastDetected: "4 minutes ago",
    sparklinePoints: [
      { x: 0, y: 34 }, { x: 30, y: 28 }, { x: 60, y: 20 }, { x: 90, y: 12 }
    ]
  },
  {
    id: "RSK-05",
    title: "Extrusion Press Reliability Risk",
    description: "Proportional directional valve cavitation drift causing +140ms actuation lag and gravel-like rattle during high-tonnage cycling.",
    location: "Block C",
    asset: "Primary Extrusion Press #2 — Pump Station B",
    subsystem: "Hydraulic Systems",
    score: 64,
    scoreTier: "High",
    severity: "Medium",
    severityReason: "Micro-cavitation is eroding spool chrome plating; threatens billet surface quality rejection and hydraulic fluid contamination.",
    confidence: "82%",
    confidenceReason: "Acoustic emission spikes match negative suction pressure dips and spectrographic fluid micro-debris.",
    evidenceCount: 12,
    signalBreakdown: {
      maintenance: 3,
      complaint: 4,
      sensor: 3,
      imageDoc: 2
    },
    trend: "Stable",
    trendSymbol: "→",
    trendTrajectory: [62, 65, 63, 64],
    status: "Emerging",
    statusBadgeClass: "status-emerging",
    priority: "P2",
    priorityLabel: "High",
    priorityBadgeClass: "priority-p2",
    leadTime: "12 Days Remaining",
    financialRisk: "$260,000 Hydraulic Contamination & Scrapped Stock",
    clusterId: "CLU-03",
    pattern: {
      name: "Proportional Directional Valve Cavitation Drift",
      coherence: "91.2% Coherence",
      synthesisEquation: [
        "Acoustic cavitation burst (48 Hz ping)",
        "Operator gravel rattle report",
        "Differential valve delay (+140ms)",
        "Billet surface thickness ripple"
      ]
    },
    whyItMatters: "Acoustic gravel sounds were dismissed as normal tooling wear. Multi-modal correlation proves negative suction head is entraining air micro-bubbles that implode against valve spool lands, accelerating internal erosion.",
    contributingSignals: [
      { id: "SIG-HYD-01", title: "Proportional Valve Acoustic Cavitation Burst", type: "Sensor", date: "Oct 05, 05:20 AM", severity: "High" },
      { id: "SIG-HYD-02", title: "Press Operator Gravel-Like Rattle Report", type: "Complaint", date: "Oct 04, 07:45 PM", severity: "Medium" },
      { id: "SIG-HYD-03", title: "Hydraulic Fluid Spectrographic Micro-Debris", type: "Document", date: "Sep 30, 02:00 PM", severity: "High" },
      { id: "SIG-HYD-04", title: "Billet Surface Thickness Ripple Quality Rejection", type: "Incident", date: "Sep 29, 11:15 AM", severity: "Medium" }
    ],
    recommendedAction: {
      action: "Backflush suction basket strainer and replace internal proportional spool cartridge before seal breach occurs.",
      urgency: "High (within 5 days)",
      team: "Hydraulics & Fluid Power",
      expectedObjective: "Restore 1.8m NPSH suction margin and prevent hydraulic manifold contamination."
    },
    firstDetected: "12 days ago (Sep 12)",
    lastDetected: "18 minutes ago",
    sparklinePoints: [
      { x: 0, y: 22 }, { x: 30, y: 20 }, { x: 60, y: 21 }, { x: 90, y: 20 }
    ]
  },
  {
    id: "RSK-07",
    title: "Cooling System Pressure Anomaly",
    description: "Centrifugal chiller return loop pressure pulsation with delta-P fluctuations across secondary condenser plate heat exchanger.",
    location: "Utility Zone",
    asset: "Central Chiller Station #3 — Secondary Loop",
    subsystem: "Chilled Water Loop",
    score: 42,
    scoreTier: "Moderate",
    severity: "Medium",
    severityReason: "Gradual thermal efficiency loss; potential compressor surging if loop flow decays further.",
    confidence: "74%",
    confidenceReason: "Moderate confidence derived from 7 telemetry points; manual flow rate verification underway.",
    evidenceCount: 7,
    signalBreakdown: {
      maintenance: 2,
      complaint: 2,
      sensor: 3,
      imageDoc: 0
    },
    trend: "Decreasing",
    trendSymbol: "↓",
    trendTrajectory: [54, 49, 45, 42],
    status: "Active",
    statusBadgeClass: "status-active",
    priority: "P3",
    priorityLabel: "Monitor",
    priorityBadgeClass: "priority-p3",
    leadTime: "24 Days Remaining",
    financialRisk: "$85,000 Energy Inefficiency & Auxiliary Chiller Run",
    clusterId: "CLU-07",
    pattern: {
      name: "Chiller Condenser Tube Partial Fouling Pattern",
      coherence: "76.4% Coherence",
      synthesisEquation: [
        "Return loop pressure ripple (+12 kPa)",
        "Approach temperature divergence (+1.4°C)",
        "Secondary pump VFD hunting (52-58 Hz)",
        "Operator log of mild condenser whistle"
      ]
    },
    whyItMatters: "Mild pressure oscillations are dampening following chemical biocide dosing on Oct 03, but approach temperature remains elevated. Continued automated surveillance ensures scale does not reform.",
    contributingSignals: [
      { id: "SIG-CLG-01", title: "Condenser Approach Temperature Divergence", type: "Sensor", date: "Oct 04, 09:10 AM", severity: "Medium" },
      { id: "SIG-CLG-02", title: "Secondary Chilled Water Pump VFD Hunting", type: "Sensor", date: "Oct 03, 11:45 PM", severity: "Medium" },
      { id: "SIG-CLG-03", title: "Operator Whistling Sound Log", type: "Complaint", date: "Oct 02, 03:20 PM", severity: "Low" }
    ],
    recommendedAction: {
      action: "Review chemical biocide dosage schedule and perform automated tube-brushing cycle during low-load weekend period.",
      urgency: "Routine (within 10 days)",
      team: "Central Utilities & Facilities Engineering",
      expectedObjective: "Stabilize delta-P within 4 kPa nominal variance and optimize chiller COP."
    },
    firstDetected: "15 days ago (Sep 19)",
    lastDetected: "35 minutes ago",
    sparklinePoints: [
      { x: 0, y: 14 }, { x: 30, y: 18 }, { x: 60, y: 22 }, { x: 90, y: 26 }
    ]
  },
  {
    id: "RSK-02",
    title: "Switchgear Busbar Thermal Overload",
    description: "Elevated Phase B Total Harmonic Distortion (+4.8% THD) driving localized inductive eddy-current heating on busbar phase joints.",
    location: "Power Island / Bus 3B",
    asset: "Medium-Voltage Main Switchgear Busbar 3B",
    subsystem: "Electrical Switchgear",
    score: 88,
    scoreTier: "Critical",
    severity: "Critical",
    severityReason: "Unchecked thermal runaway on busbar joints risks dielectric breakdown and explosive 13.8 kV arc flash.",
    confidence: "94%",
    confidenceReason: "Corroborated by calibrated FLIR radiometric thermography (+6.1°C delta) and power quality analyzer THD logs.",
    evidenceCount: 6,
    signalBreakdown: {
      maintenance: 1,
      complaint: 1,
      sensor: 3,
      imageDoc: 1
    },
    trend: "Increasing",
    trendSymbol: "↑",
    trendTrajectory: [70, 76, 82, 88],
    status: "Active",
    statusBadgeClass: "status-active",
    priority: "P1",
    priorityLabel: "Immediate",
    priorityBadgeClass: "priority-p1",
    leadTime: "9 Days Remaining",
    financialRisk: "$195,000 Main Feeder Trip & Facility Blackout",
    clusterId: "CLU-04",
    pattern: {
      name: "Harmonic Resonance & Phase Connector Degradation",
      coherence: "88.4% Coherence",
      synthesisEquation: [
        "Phase B THD harmonic surge (9.4% peak)",
        "Inverter thermal relay micro-trip (Near-Miss)",
        "Radiometric hotspot (+6.1°C delta)",
        "Cyclical upward load correlation"
      ]
    },
    whyItMatters: "Harmonic currents injected by variable frequency drives are creating localized eddy current heating on loose phase joint bolts, which will trigger an uncontained arc flash if left unmitigated.",
    contributingSignals: [
      { id: "SIG-ELE-01", title: "Switchgear Bus 3B Total Harmonic Distortion Surge", type: "Sensor", date: "Oct 04, 04:30 PM", severity: "High" },
      { id: "SIG-ELE-02", title: "Inverter Thermal Relay Micro-Trip Near-Miss", type: "Incident", date: "Sep 25, 02:40 PM", severity: "High" },
      { id: "SIG-ELE-03", title: "Thermographic Scan: +6.1°C Phase Hotspot", type: "Image", date: "Sep 27, 09:20 AM", severity: "High" }
    ],
    recommendedAction: {
      action: "De-energize Bus 3B during Sunday planned maintenance. Torque joint hardware to 75 Nm and install harmonic trap filter bank.",
      urgency: "Immediate (within 48 hours)",
      team: "High-Voltage Electrical Maintenance",
      expectedObjective: "Eliminate thermal hotspot and reduce THD below 3.0% IEEE-519 standard."
    },
    firstDetected: "14 days ago (Sep 20)",
    lastDetected: "8 minutes ago",
    sparklinePoints: [
      { x: 0, y: 35 }, { x: 30, y: 27 }, { x: 60, y: 16 }, { x: 90, y: 6 }
    ]
  },
  {
    id: "RSK-06",
    title: "Chemical Vapor Infiltration Hazard",
    description: "Duct static differential pressure flutter caused by mechanical guide vane binding on chemical exhaust scrubber system.",
    location: "Engineering Bldg (Lab 3)",
    asset: "Fume Scrubber Exhaust Fan SF-02",
    subsystem: "Industrial Hygiene & HVAC",
    score: 76,
    scoreTier: "Critical",
    severity: "High",
    severityReason: "Transient back-drafting into academic laboratory suites risks personnel chemical exposure and OSHA compliance breach.",
    confidence: "86%",
    confidenceReason: "9 multi-modal inputs connecting graduate student odor complaints with differential pressure telemetry.",
    evidenceCount: 9,
    signalBreakdown: {
      maintenance: 3,
      complaint: 4,
      sensor: 2,
      imageDoc: 0
    },
    trend: "Increasing",
    trendSymbol: "↑",
    trendTrajectory: [60, 65, 71, 76],
    status: "Emerging",
    statusBadgeClass: "status-emerging",
    priority: "P2",
    priorityLabel: "High",
    priorityBadgeClass: "priority-p2",
    leadTime: "5 Days Remaining",
    financialRisk: "Environmental Violation & Laboratory Evacuation",
    clusterId: "CLU-05",
    pattern: {
      name: "Scrubber Aerodynamic Stalling & Flow Reversal",
      coherence: "86.2% Coherence",
      synthesisEquation: [
        "Duct static pressure flutter (±18 Pa)",
        "Graduate student chemical odor reports",
        "Guide vane actuator linkage mechanical binding",
        "Surge rate of 3.4 events / day"
      ]
    },
    whyItMatters: "Intermittent chemical odor reports in academic corridors correlate with guide vane actuator linkage binding, creating brief negative pressure pulses that pull fumes out of certified hoods.",
    contributingSignals: [
      { id: "SIG-SFT-01", title: "Duct Static Differential Pressure Flutter", type: "Sensor", date: "Oct 05, 06:10 AM", severity: "High" },
      { id: "SIG-SFT-02", title: "Graduate Student Chemical Odor Reports", type: "Complaint", date: "Oct 04, 11:30 AM", severity: "High" },
      { id: "SIG-SFT-03", title: "Scrubber Guide Vane Actuator Linkage Binding", type: "Maintenance", date: "Oct 01, 03:45 PM", severity: "High" }
    ],
    recommendedAction: {
      action: "Clean and lubricate guide vane linkage pivots. Calibrate electronic actuator position feedback potentiometer.",
      urgency: "High (within 24 hours)",
      team: "EHS & Building Automation",
      expectedObjective: "Eliminate static pressure flutter and maintain negative plenum pressure > 45 Pa."
    },
    firstDetected: "7 days ago (Sep 27)",
    lastDetected: "22 minutes ago",
    sparklinePoints: [
      { x: 0, y: 30 }, { x: 30, y: 24 }, { x: 60, y: 17 }, { x: 90, y: 10 }
    ]
  },
  {
    id: "RSK-03",
    title: "Cleanroom Thermal Excursion Risk",
    description: "Gradual +0.08°C/day baseline drift in cleanroom ceiling plenum caused by micro-biofilm fouling on plate heat exchanger HX-09.",
    location: "Clean Packaging Suite 1",
    asset: "Plate Heat Exchanger HX-09 — HVAC Unit 4",
    subsystem: "HVAC & Thermal Systems",
    score: 52,
    scoreTier: "High",
    severity: "Medium",
    severityReason: "Risk of exceeding ISO Class 5 20.0°C ± 0.5°C validated packaging limit, invalidating sterile medical blister batches.",
    confidence: "80%",
    confidenceReason: "Supported by 5 multi-modal signals including thermocouple grids and packaging foil cycle seal complaints.",
    evidenceCount: 5,
    signalBreakdown: {
      maintenance: 1,
      complaint: 2,
      sensor: 2,
      imageDoc: 0
    },
    trend: "Stable",
    trendSymbol: "→",
    trendTrajectory: [49, 51, 52, 52],
    status: "Active",
    statusBadgeClass: "status-active",
    priority: "P3",
    priorityLabel: "Monitor",
    priorityBadgeClass: "priority-p3",
    leadTime: "21 Days Remaining",
    financialRisk: "$110,000 Packaging Seal Invalidation & Lot Re-Test",
    clusterId: "CLU-06",
    pattern: {
      name: "Heat Exchanger Fouling Thermal Drift Pattern",
      coherence: "82.5% Coherence",
      synthesisEquation: [
        "Ceiling thermocouple grid delta (+0.4°C)",
        "Plate heat exchanger HX-09 approach drift",
        "Packaging foil cycle seal variation complaint",
        "Steady upward slope (+0.08°C / day)"
      ]
    },
    whyItMatters: "Individual thermal sensors showed negligible day-to-day deltas (+0.08°C), but spatial grid correlation reveals systematic heat exchange efficiency loss heading toward sterile boundary violation.",
    contributingSignals: [
      { id: "SIG-TMP-01", title: "Cleanroom Zone 4 Ceiling Thermocouple Grid Delta", type: "Sensor", date: "Oct 04, 02:00 PM", severity: "Medium" },
      { id: "SIG-TMP-02", title: "Heat Exchanger HX-09 Approach Divergence", type: "Document", date: "Oct 01, 10:00 AM", severity: "Medium" },
      { id: "SIG-TMP-03", title: "Packaging Foil Heat-Seal Cycle Variation Complaint", type: "Complaint", date: "Sep 30, 04:15 PM", severity: "Low" }
    ],
    recommendedAction: {
      action: "Execute scheduled CIP (Clean-In-Place) chemical flush of HX-09 plate channels during Sunday cleanroom sanitation window.",
      urgency: "Routine (within 7 days)",
      team: "Cleanroom Validation & Utilities",
      expectedObjective: "Recover 2.2°C approach temperature delta and stabilize room temp at 19.8°C."
    },
    firstDetected: "16 days ago (Sep 18)",
    lastDetected: "1 hour ago",
    sparklinePoints: [
      { x: 0, y: 24 }, { x: 30, y: 22 }, { x: 60, y: 21 }, { x: 90, y: 21 }
    ]
  },
  {
    id: "RSK-08",
    title: "Conveyor Reducer Tooth Micro-Pitting",
    description: "Ferrous wear particles in quarterly lube analysis matching cyclical torsional shock pulses on intermediate shaft pinion.",
    location: "Stockyard Terminal",
    asset: "Bulk Conveyor Drive C-07 Reducer",
    subsystem: "Bulk Handling Logistics",
    score: 22,
    scoreTier: "Low",
    severity: "Low",
    severityReason: "Superficial gear tooth micro-pitting; no immediate tooth shear or thermal distress detected.",
    confidence: "87%",
    confidenceReason: "High-accuracy oil spectroscopy confirmed 45 ppm iron particulates; telemetry baseline remains stable.",
    evidenceCount: 8,
    signalBreakdown: {
      maintenance: 4,
      complaint: 1,
      sensor: 2,
      imageDoc: 1
    },
    trend: "Decreasing",
    trendSymbol: "↓",
    trendTrajectory: [30, 26, 24, 22],
    status: "Emerging",
    statusBadgeClass: "status-emerging",
    priority: "P4",
    priorityLabel: "Low",
    priorityBadgeClass: "priority-p4",
    leadTime: "60+ Days Remaining",
    financialRisk: "$28,000 Gearbox Rebuild if unaddressed",
    clusterId: "CLU-08",
    pattern: {
      name: "Torsional Gear Tooth Wear Stabilization",
      coherence: "84.1% Coherence",
      synthesisEquation: [
        "Quarterly lube spectroscopy (45 ppm Fe)",
        "Low-frequency torsional shock pulses",
        "Post-lubrication vibration settling",
        "Gradual decay in micro-abrasion rate"
      ]
    },
    whyItMatters: "Wear rate has plateaued following high-viscosity synthetic lubricant change on Sep 15. The condition requires routine logging rather than immediate operational stoppage.",
    contributingSignals: [
      { id: "SIG-GR-01", title: "Spectrographic Lube Iron Particle Count", type: "Document", date: "Sep 28, 08:30 AM", severity: "Low" },
      { id: "SIG-GR-02", title: "Conveyor Intermediate Pinion Acoustic Baseline", type: "Sensor", date: "Oct 02, 10:15 AM", severity: "Low" }
    ],
    recommendedAction: {
      action: "Execute magnetic chip detector inspection during next scheduled quarterly plant turnaround.",
      urgency: "Routine (within 30 days)",
      team: "Bulk Material Handling Maintenance",
      expectedObjective: "Verify wear stabilization and prevent premature reducer overhaul."
    },
    firstDetected: "31 days ago (Aug 24)",
    lastDetected: "2 hours ago",
    sparklinePoints: [
      { x: 0, y: 18 }, { x: 30, y: 22 }, { x: 60, y: 26 }, { x: 90, y: 30 }
    ]
  },
  {
    id: "RSK-09",
    title: "Transformer T-2 Oil Dielectric Degradation (Resolved)",
    description: "Dissolved gas analysis (DGA) flagged trace acetylene and ethylene spikes; vacuum degassing and gasket refurbishment completed.",
    location: "Power Island / Substation",
    asset: "Primary Substation Transformer T-2 (25 MVA)",
    subsystem: "Electrical Switchgear",
    score: 16,
    scoreTier: "Low",
    severity: "Low",
    severityReason: "Dielectric breakdown voltage restored to 68 kV; gas concentrations returned to IEEE normal baseline.",
    confidence: "96%",
    confidenceReason: "Laboratory gas chromatography post-service verified complete removal of combustible gases.",
    evidenceCount: 14,
    signalBreakdown: {
      maintenance: 6,
      complaint: 1,
      sensor: 5,
      imageDoc: 2
    },
    trend: "Decreasing",
    trendSymbol: "↓",
    trendTrajectory: [84, 52, 28, 16],
    status: "Resolved",
    statusBadgeClass: "status-resolved",
    priority: "P4",
    priorityLabel: "Low",
    priorityBadgeClass: "priority-p4",
    leadTime: "Mitigated / Healthy",
    financialRisk: "Avoided $650,000 Catastrophic Transformer Flashover",
    clusterId: "CLU-09",
    pattern: {
      name: "Dielectric Degradation Resolution Signature",
      coherence: "95.8% Coherence",
      synthesisEquation: [
        "Online DGA combustible gas surge",
        "Conservator tank moisture ingress",
        "Vacuum oil dehydration & degassing",
        "Post-treatment dielectric recovery (68 kV)"
      ]
    },
    whyItMatters: "Early detection of 4.2 ppm acetylene averted catastrophic core flashover. The risk is now formally categorized as Resolved with post-intervention telemetry confirming 0.2 ppm baseline.",
    contributingSignals: [
      { id: "SIG-TR-01", title: "Post-Service Dielectric Breakdown Voltage Certified", type: "Document", date: "Sep 22, 04:00 PM", severity: "Low" },
      { id: "SIG-TR-02", title: "Online DGA Acetylene Concentration Baseline", type: "Sensor", date: "Oct 01, 08:00 AM", severity: "Low" }
    ],
    recommendedAction: {
      action: "Maintain routine quarterly DGA automated oil sampling; continue standard continuous moisture monitoring.",
      urgency: "Resolved (Continuous monitoring)",
      team: "High-Voltage Electrical Maintenance",
      expectedObjective: "Audit post-service dielectric integrity and document avoided risk in compliance ledger."
    },
    firstDetected: "45 days ago (Aug 10)",
    lastDetected: "3 days ago (Audited)",
    sparklinePoints: [
      { x: 0, y: 8 }, { x: 30, y: 16 }, { x: 60, y: 26 }, { x: 90, y: 34 }
    ]
  },
  {
    id: "RSK-10",
    title: "Cooling Tower Fan Imbalance (Resolved)",
    description: "Blade aerodynamic mass imbalance detected via 1X shaft vibration spike; dynamic balance weights installed and verified.",
    location: "Utility Zone / CT-01",
    asset: "Evaporative Cooling Tower Fan #1",
    subsystem: "Chilled Water Loop",
    score: 12,
    scoreTier: "Low",
    severity: "Low",
    severityReason: "Residual vibration amplitude under 0.8 mm/s RMS (ISO 10816-3 Good Range).",
    confidence: "92%",
    confidenceReason: "Accelerometers confirm 84% reduction in peak 1X vibration harmonics.",
    evidenceCount: 6,
    signalBreakdown: {
      maintenance: 2,
      complaint: 1,
      sensor: 3,
      imageDoc: 0
    },
    trend: "Decreasing",
    trendSymbol: "↓",
    trendTrajectory: [72, 40, 20, 12],
    status: "Resolved",
    statusBadgeClass: "status-resolved",
    priority: "P4",
    priorityLabel: "Low",
    priorityBadgeClass: "priority-p4",
    leadTime: "Mitigated / Healthy",
    financialRisk: "Avoided $90,000 Fan Blade Hub Fracture",
    clusterId: "CLU-10",
    pattern: {
      name: "Rotational Mass Imbalance Correction",
      coherence: "93.4% Coherence",
      synthesisEquation: [
        "1X rotational vibration peak (4.2 mm/s)",
        "Operator rhythmic flutter complaint",
        "Dynamic field balancing (240g weight installed)",
        "Post-balance RMS drop to 0.8 mm/s"
      ]
    },
    whyItMatters: "Proactive field balancing averted blade tip fatigue cracking before hub separation could damage condenser tubes. All sensors report within normal green envelope.",
    contributingSignals: [
      { id: "SIG-CT-01", title: "Post-Balance 1X Vibration Spectrum Normalization", type: "Sensor", date: "Sep 29, 02:30 PM", severity: "Low" }
    ],
    recommendedAction: {
      action: "Archive vibration balance report in SAP PM; resume standard quarterly vibration surveillance.",
      urgency: "Resolved (Archive completed)",
      team: "Central Utilities & Facilities Engineering",
      expectedObjective: "Maintain stable vibration below 1.0 mm/s RMS."
    },
    firstDetected: "28 days ago (Aug 27)",
    lastDetected: "4 days ago (Audited)",
    sparklinePoints: [
      { x: 0, y: 10 }, { x: 30, y: 20 }, { x: 60, y: 28 }, { x: 90, y: 35 }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.RISKS_KPI_OVERVIEW = RISKS_KPI_OVERVIEW;
  window.OPERATIONAL_RISKS = OPERATIONAL_RISKS;
}
