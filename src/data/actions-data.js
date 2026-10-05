/**
 * EarlySight — Action Center Dataset (Stage 10)
 * 
 * Workflow: Detected → Verified → Assigned → Action Taken → Resolved → Impact Verified
 * 
 * Each issue contains:
 * - Responsible team
 * - Assigned person
 * - Priority
 * - Action
 * - Deadline
 * - Current status
 * - Resolution notes
 * Plus rich operational linkages (linked signals, asset location, lead time, averted loss).
 */

const WORKFLOW_STAGES = [
  {
    id: "detected",
    label: "Detected",
    index: 0,
    shortLabel: "1. Detected",
    color: "#64748B",
    bg: "rgba(100, 116, 139, 0.12)",
    border: "rgba(100, 116, 139, 0.35)",
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="7"/></svg>',
    description: "Multi-modal precursor signals synthesized into an unverified candidate issue"
  },
  {
    id: "verified",
    label: "Verified",
    index: 1,
    shortLabel: "2. Verified",
    color: "#1B4332",
    bg: "rgba(27, 67, 50, 0.10)",
    border: "rgba(27, 67, 50, 0.30)",
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
    description: "Engineering reliability lead confirms causal signature & validates anomaly"
  },
  {
    id: "assigned",
    label: "Assigned",
    index: 2,
    shortLabel: "3. Assigned",
    color: "#D97706",
    bg: "rgba(217, 119, 6, 0.12)",
    border: "rgba(217, 119, 6, 0.35)",
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
    description: "Allocated to responsible domain team, technician & target maintenance window"
  },
  {
    id: "action_taken",
    label: "Action Taken",
    index: 3,
    shortLabel: "4. Action Taken",
    color: "#EA580C",
    bg: "rgba(234, 88, 12, 0.12)",
    border: "rgba(234, 88, 12, 0.35)",
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    description: "Field maintenance performed, replacement parts installed, or calibration executed"
  },
  {
    id: "resolved",
    label: "Resolved",
    index: 4,
    shortLabel: "5. Resolved",
    color: "#0D9488",
    bg: "rgba(13, 148, 136, 0.12)",
    border: "rgba(13, 148, 136, 0.35)",
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg>',
    description: "Physical remediation completed and baseline operational logging restored"
  },
  {
    id: "impact_verified",
    label: "Impact Verified",
    index: 5,
    shortLabel: "6. Impact Verified",
    color: "#059669",
    bg: "rgba(5, 150, 105, 0.12)",
    border: "rgba(5, 150, 105, 0.35)",
    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    description: "Telemetry verified stable across 72h, averted loss logged, MTBF extension validated"
  }
];

const TEAMS_LIST = [
  "Civil & Piping Infrastructure",
  "Hydraulics & Fluid Power",
  "Mechanical Reliability",
  "Electrical Asset Engineering",
  "Automation & Robotics",
  "HVAC & Plant Utilities",
  "Environmental & Chemical Plant"
];

const PRIORITIES = [
  { id: "Critical P1", color: "#D94E34", bg: "rgba(217, 78, 52, 0.12)", border: "rgba(217, 78, 52, 0.35)", leadWindow: "< 48 Hours" },
  { id: "High P2", color: "#EA580C", bg: "rgba(234, 88, 12, 0.12)", border: "rgba(234, 88, 12, 0.35)", leadWindow: "3 - 7 Days" },
  { id: "Medium P3", color: "#D97706", bg: "rgba(217, 119, 6, 0.12)", border: "rgba(217, 119, 6, 0.35)", leadWindow: "7 - 14 Days" },
  { id: "Low P4", color: "#0D9488", bg: "rgba(13, 148, 136, 0.12)", border: "rgba(13, 148, 136, 0.35)", leadWindow: "> 14 Days" }
];

const INITIAL_ACTION_ISSUES = [
  // 1. STAGE: DETECTED
  {
    id: "ACT-2026-104",
    title: "Cooling Loop Heat Exchanger Fouling Trajectory",
    asset: "Chilled Water Loop #3 — Heat Exchanger HX-09",
    location: "Utility Basement / Block B",
    responsibleTeam: "HVAC & Plant Utilities",
    assignedPerson: "Sarah Lin (Thermal Systems)",
    priority: "Medium P3",
    action: "Schedule backflush cycle on secondary plate pack, inspect delta-P transducer calibration, and replenish cooling tower biocide dosing.",
    deadline: "Oct 08, 2026 • 17:00",
    deadlineDaysRemaining: 9.8,
    currentStatus: "detected",
    resolutionNotes: "Early thermal delta expansion flagged (+0.3°C/day). Candidate issue synthesized from 3 acoustic sensor bursts and 2 cooling tower water chemistry logs.",
    leadTime: "21.4 Days Lead",
    potentialLoss: "$85,000",
    confidence: "78.4%",
    signalsLinked: 3,
    workOrder: "WO-2026-9988",
    history: [
      { stage: "detected", timestamp: "Today, 06:15 AM", author: "EarlySight Synthesizer", note: "Thermal gradient divergence crossed threshold (+18% / week)." }
    ],
    impactMetrics: null
  },
  {
    id: "ACT-2026-107",
    title: "Pneumatic Robotic Gripper Micro-Slip Variance",
    asset: "Pick & Place Gantry Robot Cell 5",
    location: "Packaging Hall / Line 2",
    responsibleTeam: "Automation & Robotics",
    assignedPerson: "Carlos Mendez (Controls Eng)",
    priority: "Medium P3",
    action: "Inspect silicone vacuum suction cups for micro-tears, test PWM proportional vacuum valve response time, and adjust gripping dwell by 35ms.",
    deadline: "Oct 06, 2026 • 14:00",
    deadlineDaysRemaining: 7.6,
    currentStatus: "detected",
    resolutionNotes: "Vacuum decay curves lengthened by 42ms during high-speed acceleration. Rejects up 2.4% over 3 shifts. Suspected vacuum generator seal wear.",
    leadTime: "16.8 Days Lead",
    potentialLoss: "$42,000",
    confidence: "82.1%",
    signalsLinked: 4,
    workOrder: "WO-2026-9972",
    history: [
      { stage: "detected", timestamp: "Yesterday, 19:40", author: "EarlySight Synthesizer", note: "Vacuum curve decay anomaly correlated with reject telemetry." }
    ],
    impactMetrics: null
  },

  // 2. STAGE: VERIFIED
  {
    id: "ACT-2026-095",
    title: "Centrifugal Baghouse Dynamic Unbalance Inception",
    asset: "Exhaust Baghouse Blower #4",
    location: "Scrubber Plant / Roof Quad",
    responsibleTeam: "Mechanical Reliability",
    assignedPerson: "Devon Chen (Vibration Specialist)",
    priority: "High P2",
    action: "Conduct on-site dynamic balance trim with portable strobe tachometer; steam-clean flue particulate buildup on impeller blade trailing edges.",
    deadline: "Oct 04, 2026 • 12:00",
    deadlineDaysRemaining: 5.5,
    currentStatus: "verified",
    resolutionNotes: "Engineering review confirmed 1X RPM harmonic growth. Flue opacity logs indicate transient lime dust flyover during burner relight.",
    leadTime: "15.0 Days Lead",
    potentialLoss: "$115,000",
    confidence: "79.8%",
    signalsLinked: 3,
    workOrder: "WO-2026-9950",
    history: [
      { stage: "detected", timestamp: "Sep 25, 08:30", author: "EarlySight Synthesizer", note: "1X harmonic peak detected." },
      { stage: "verified", timestamp: "Sep 27, 14:15", author: "Devon Chen (Vibration Lead)", note: "Confirmed signature: unbalance from particle buildup, not bearing raceway spall." }
    ],
    impactMetrics: null
  },
  {
    id: "ACT-2026-099",
    title: "Boiler Feed Pump Impeller Minor Cavitation Flutter",
    asset: "Auxiliary Steam Feed Pump B-1",
    location: "Boiler House",
    responsibleTeam: "Power & Steam Operations",
    assignedPerson: "Mateo Hernandez (Station Lead)",
    priority: "High P2",
    action: "Inspect suction strainer differential pressure screen for scaling, calibrate deaerator feed head level sensor, and throttle recirculation bypass.",
    deadline: "Oct 03, 2026 • 18:00",
    deadlineDaysRemaining: 4.8,
    currentStatus: "verified",
    resolutionNotes: "Verified transient acoustic cavitation signature during boiler load ramping. Suction NPSH margin dipping 0.4 bar below design curve.",
    leadTime: "11.2 Days Lead",
    potentialLoss: "$175,000",
    confidence: "75.6%",
    signalsLinked: 3,
    workOrder: "WO-2026-9941",
    history: [
      { stage: "detected", timestamp: "Sep 24, 11:20", author: "EarlySight Synthesizer", note: "Transient acoustic burst during deaerator replenishment." },
      { stage: "verified", timestamp: "Sep 26, 16:45", author: "Mateo Hernandez (Lead)", note: "NPSH margin dip validated with local pressure gauge recordings." }
    ],
    impactMetrics: null
  },

  // 3. STAGE: ASSIGNED
  {
    id: "ACT-2026-088",
    title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
    asset: "DI Water Main Trench Feed — Flange 4B-12",
    location: "Block A — Trench 4B / Assembly Bay 4",
    responsibleTeam: "Civil & Piping Infrastructure",
    assignedPerson: "Marcus Vance (Senior Piping Lead)",
    priority: "Critical P1",
    action: "Isolate auxiliary trench bypass loop, conduct ultrasonic bolt elongation check, replace degraded EPDM gasket with braided reinforced PTFE ring, retorque studs to 340 Nm.",
    deadline: "Sep 30, 2026 • 16:00",
    deadlineDaysRemaining: 1.7,
    currentStatus: "assigned",
    resolutionNotes: "Work package prepared. Replacement gasket kit #PK-884 verified in stock. Ultrasonic bolt probe staged at Bay 4 tool crib. Scheduled for midnight shift shutdown window.",
    leadTime: "14.2 Days Lead",
    potentialLoss: "$512,000",
    confidence: "87.0%",
    signalsLinked: 17,
    workOrder: "WO-2026-7812",
    history: [
      { stage: "detected", timestamp: "Sep 14, 04:15", author: "EarlySight Synthesizer", note: "First acoustic hiss & micro-pressure delta correlated." },
      { stage: "verified", timestamp: "Sep 20, 11:00", author: "Dr. K. Patel (Reliability)", note: "Verified cross-silo match with 8 operator shift complaints." },
      { stage: "assigned", timestamp: "Sep 26, 09:30", author: "Operations Director", note: "Assigned to Marcus Vance. Mandatory execution before weekend." }
    ],
    impactMetrics: null
  },
  {
    id: "ACT-2026-094",
    title: "Hydraulic Proportional Valve Cavitation Drift",
    asset: "Primary Extrusion Press #2 — Pump Station B",
    location: "Block C — Heavy Extrusion",
    responsibleTeam: "Hydraulics & Fluid Power",
    assignedPerson: "Elena Rostova (Fluid Power Specialist)",
    priority: "Critical P1",
    action: "Flush proportional manifold circuit, replace cavitation-eroded spool cartridge with hardened tungsten carbide trim, replace 10μm high-pressure filter element, recalibrate LVDT null point.",
    deadline: "Oct 01, 2026 • 10:00",
    deadlineDaysRemaining: 2.5,
    currentStatus: "assigned",
    resolutionNotes: "Spool hysteresis latency reached 140ms. Replacement servo cartridge #V-902 checked out from Central Spares. Turnaround slot reserved on Press #2.",
    leadTime: "12.0 Days Lead",
    potentialLoss: "$340,000",
    confidence: "91.2%",
    signalsLinked: 5,
    workOrder: "WO-2026-8402",
    history: [
      { stage: "detected", timestamp: "Sep 16, 14:20", author: "EarlySight Synthesizer", note: "Pressure latency hysteresis detected." },
      { stage: "verified", timestamp: "Sep 22, 10:15", author: "Elena Rostova", note: "Oil particle count confirmed cavitation micro-spallation." },
      { stage: "assigned", timestamp: "Sep 27, 08:00", author: "Plant Superintendent", note: "Assigned to Elena Rostova with priority parts release." }
    ],
    impactMetrics: null
  },

  // 4. STAGE: ACTION TAKEN
  {
    id: "ACT-2026-084",
    title: "Stator Winding Asymmetric Thermal Degradation",
    asset: "Main Turbine Compressor Unit 3",
    location: "Power Island / Generator Hall",
    responsibleTeam: "Electrical Asset Engineering",
    assignedPerson: "Dr. K. Patel (Senior Electrical Eng)",
    priority: "High P2",
    action: "Chemical cleaning of air-to-water heat exchanger tubes, replacement of phase B surge suppressors, and re-torquing of Phase B terminal lugs to 180 Nm with thermal imaging confirmation.",
    deadline: "Sep 29, 2026 • 18:00",
    deadlineDaysRemaining: 0.8,
    currentStatus: "action_taken",
    resolutionNotes: "Physical maintenance complete: Phase B lug was found oxidized and slightly loose (115 Nm vs 180 Nm spec). Lugs retorqued, contacts polished with conductive paste, and cooler tubes acid-washed. Awaiting post-run heat soak verification.",
    leadTime: "24.0 Days Lead",
    potentialLoss: "$680,000",
    confidence: "88.9%",
    signalsLinked: 4,
    workOrder: "WO-2026-7730",
    history: [
      { stage: "detected", timestamp: "Sep 08, 09:12", author: "EarlySight Synthesizer", note: "Phase-to-ground resistance drift detected." },
      { stage: "verified", timestamp: "Sep 15, 14:00", author: "Dr. K. Patel", note: "FLIR thermal scan confirmed +8.2°C localized hotspot on Phase B." },
      { stage: "assigned", timestamp: "Sep 18, 08:30", author: "Chief Electrical Eng", note: "Scheduled for Unit 3 minor maintenance window." },
      { stage: "action_taken", timestamp: "Today, 11:45 AM", author: "Dr. K. Patel", note: "Lug re-torquing and tube descaling executed. Initial run smooth." }
    ],
    impactMetrics: null
  },
  {
    id: "ACT-2026-079",
    title: "Conveyor Drive Reducer Gear Tooth Pitting",
    asset: "Overland Bulk Conveyor Belt #7",
    location: "Stockyard Terminal / Zone 1",
    responsibleTeam: "Mechanical Reliability",
    assignedPerson: "Jack O'Connor (Millwright Lead)",
    priority: "Medium P3",
    action: "Drain contaminated mineral oil, flush gearbox housing with solvent, replenish with ISO VG 320 synthetic PAO gear oil, and adjust intermediate shaft pinion backlash by 0.12mm.",
    deadline: "Sep 30, 2026 • 12:00",
    deadlineDaysRemaining: 1.5,
    currentStatus: "action_taken",
    resolutionNotes: "Oil dump confirmed ferrous micro-debris. Internal bore inspection showed light micro-pitting on 3 pinion teeth. Synthetic lube recharged and gear mesh pattern laser-aligned. Running under test load.",
    leadTime: "31.0 Days Lead",
    potentialLoss: "$150,000",
    confidence: "87.4%",
    signalsLinked: 4,
    workOrder: "WO-2026-7640",
    history: [
      { stage: "detected", timestamp: "Sep 02, 16:30", author: "EarlySight Synthesizer", note: "Quarterly oil sample analysis matched shock pulse harmonics." },
      { stage: "verified", timestamp: "Sep 10, 09:15", author: "Devon Chen", note: "Micro-pitting acoustic signature verified." },
      { stage: "assigned", timestamp: "Sep 18, 10:00", author: "Stockyard Supervisor", note: "Assigned to Jack O'Connor." },
      { stage: "action_taken", timestamp: "Yesterday, 15:30", author: "Jack O'Connor", note: "Full flush and synthetic recharge completed. Gear mesh dialed in." }
    ],
    impactMetrics: null
  },

  // 5. STAGE: RESOLVED
  {
    id: "ACT-2026-052",
    title: "Switchgear Bus 3B Harmonic Distortion & Phase Imbalance",
    asset: "Main Switchgear Bus 3B",
    location: "Substation 2 / Bay 3",
    responsibleTeam: "Electrical Asset Engineering",
    assignedPerson: "Dr. K. Patel (Senior Electrical Eng)",
    priority: "High P2",
    action: "Replaced degraded 480V detuned capacitor bank cell #4, torqued busbar thermal expansion joints, and rebalanced neutral feeder loads.",
    deadline: "Completed Sep 27",
    deadlineDaysRemaining: 0,
    currentStatus: "resolved",
    resolutionNotes: "Bus 3B successfully energized after 4-hour scheduled downtime. Total harmonic distortion (THD) dropped from 6.8% down to 1.4% (well within IEEE 519 spec). Neutral current stabilized at 4.2A.",
    leadTime: "18.5 Days Ahead",
    potentialLoss: "$240,000",
    confidence: "93.4%",
    signalsLinked: 5,
    workOrder: "WO-2026-9904",
    history: [
      { stage: "detected", timestamp: "Sep 05, 12:00", author: "EarlySight Synthesizer", note: "Current signature harmonic anomaly logged." },
      { stage: "verified", timestamp: "Sep 11, 15:20", author: "Dr. K. Patel", note: "Capacitor degradation verified with power quality analyzer." },
      { stage: "assigned", timestamp: "Sep 14, 08:30", author: "Electrical Operations", note: "Assigned for planned Sunday substation window." },
      { stage: "action_taken", timestamp: "Sep 26, 23:00", author: "Dr. K. Patel", note: "Capacitor cells swapped; busbar joints torqued." },
      { stage: "resolved", timestamp: "Sep 27, 04:30", author: "Dr. K. Patel", note: "Bus re-energized; THD < 1.5%; zero operational alarm." }
    ],
    impactMetrics: {
      avertedDowntimeHours: 24,
      financialSavings: "$240,000",
      mtbfDelta: "+680 hrs",
      falsePositiveCheck: "Confirmed Valid Early Warning"
    }
  },
  {
    id: "ACT-2026-049",
    title: "Reactor Agitator Mechanical Seal Face Micro-Chipping",
    asset: "Continuous Polymerizer Reactor R-201",
    location: "Chemical Synthesis / Train 1",
    responsibleTeam: "Mechanical Reliability",
    assignedPerson: "M. Torres (Reliability Specialist)",
    priority: "Critical P1",
    action: "Removed damaged silicon-carbide mechanical seal, installed upgraded diamond-coated dual cartridge seal, and purged barrier fluid loop with synthetic lubricant.",
    deadline: "Completed Sep 25",
    deadlineDaysRemaining: 0,
    currentStatus: "resolved",
    resolutionNotes: "Seal face examination revealed localized edge chipping due to thermal cycling. Upgraded diamond-face seal installed with 1.8 bar barrier pressure differential. VOC sniffer reads 0.0 ppm at stuffing box.",
    leadTime: "19.0 Days Ahead",
    potentialLoss: "$480,000",
    confidence: "94.2%",
    signalsLinked: 6,
    workOrder: "WO-2026-9871",
    history: [
      { stage: "detected", timestamp: "Sep 03, 10:14", author: "EarlySight Synthesizer", note: "Acoustic envelope variance on agitator drive." },
      { stage: "verified", timestamp: "Sep 09, 11:30", author: "M. Torres", note: "Barrier fluid pressure decay verified." },
      { stage: "assigned", timestamp: "Sep 12, 09:00", author: "Production Manager", note: "Assigned to M. Torres." },
      { stage: "action_taken", timestamp: "Sep 24, 06:00", author: "M. Torres", note: "Dual cartridge seal installed during batch changeover." },
      { stage: "resolved", timestamp: "Sep 25, 14:00", author: "M. Torres", note: "Leak rate zero; baseline acoustic vibration confirmed." }
    ],
    impactMetrics: {
      avertedDowntimeHours: 36,
      financialSavings: "$480,000",
      mtbfDelta: "+820 hrs",
      falsePositiveCheck: "Confirmed Valid Early Warning"
    }
  },

  // 6. STAGE: IMPACT VERIFIED
  {
    id: "ACT-2026-018",
    title: "Slurry Circulation Pump 2 Ceramic Liner Fracture Inception",
    asset: "Flue Gas Desulfurization Pump 2",
    location: "Environmental Plant",
    responsibleTeam: "Environmental & Chemical Plant",
    assignedPerson: "Devon Chen (Reliability Specialist)",
    priority: "Critical P1",
    action: "Replaced fractured brittle ceramic liner with hardened high-chrome alloy sleeve (Ni-Hard 4) and replaced impeller wear ring during scheduled turnaround.",
    deadline: "Completed Sep 18 • Verified Sep 22",
    deadlineDaysRemaining: 0,
    currentStatus: "impact_verified",
    resolutionNotes: "Post-intervention 72h telemetry verification complete: Suction & discharge pressures flat within ±0.05 bar. Baseline acoustic harmonics restored. Zero unplanned leakage. Environmental compliance 100%.",
    leadTime: "22.0 Days Ahead",
    potentialLoss: "$420,000",
    confidence: "95.8%",
    signalsLinked: 6,
    workOrder: "WO-2026-9410",
    history: [
      { stage: "detected", timestamp: "Aug 26, 08:00", author: "EarlySight Synthesizer", note: "Cavitation acoustic harmonics detected." },
      { stage: "verified", timestamp: "Sep 01, 14:00", author: "Devon Chen", note: "Casing ultrasonic thickness scan confirmed inner liner spall." },
      { stage: "assigned", timestamp: "Sep 04, 09:30", author: "Maintenance Superintendent", note: "Assigned to Devon Chen." },
      { stage: "action_taken", timestamp: "Sep 16, 10:00", author: "Devon Chen", note: "Ceramic liner replaced with Ni-Hard 4 alloy sleeve." },
      { stage: "resolved", timestamp: "Sep 18, 16:00", author: "Devon Chen", note: "Pump restarted under partial load." },
      { stage: "impact_verified", timestamp: "Sep 22, 12:00", author: "Plant Operations Audit", note: "72h continuous run audited. 48h downtime avoided ($420k savings verified)." }
    ],
    impactMetrics: {
      avertedDowntimeHours: 48,
      financialSavings: "$420,000",
      mtbfDelta: "+1,200 hrs",
      falsePositiveCheck: "True Positive — Averted Critical Catastrophe"
    }
  },
  {
    id: "ACT-2026-014",
    title: "Roller Kiln Main Drive Pinion Tooth Fracture Prevention",
    asset: "Rotary Calcination Kiln #1 — Drive Train",
    location: "Thermal Processing Bay",
    responsibleTeam: "Mechanical Reliability",
    assignedPerson: "Marcus Vance (Senior Piping & Mechanical Lead)",
    priority: "Critical P1",
    action: "Replaced 24-tooth intermediate pinion shaft prior to root fatigue cleavage, dialed gear backlash to 0.45mm, and recharged forced lubrication circuit with molybdenum disulfide synthetic grease.",
    deadline: "Completed Sep 09 • Verified Sep 14",
    deadlineDaysRemaining: 0,
    currentStatus: "impact_verified",
    resolutionNotes: "Post-intervention audit verified 14-day zero-defect continuous rotation. Metallurgical lab report confirmed 40% depth micro-crack on tooth #11 root radius. Pinion replaced with zero damage to the $1.2M girth gear.",
    leadTime: "17.0 Days Ahead",
    potentialLoss: "$650,000",
    confidence: "96.4%",
    signalsLinked: 7,
    workOrder: "WO-2026-9280",
    history: [
      { stage: "detected", timestamp: "Aug 20, 11:30", author: "EarlySight Synthesizer", note: "Vibration envelope and lube particle count divergence." },
      { stage: "verified", timestamp: "Aug 26, 14:00", author: "Marcus Vance", note: "Tooth root micro-crack confirmed via dye-penetrant inspection." },
      { stage: "assigned", timestamp: "Aug 29, 09:00", author: "Plant Manager", note: "Assigned emergency work order." },
      { stage: "action_taken", timestamp: "Sep 07, 08:00", author: "Marcus Vance", note: "Pinion shaft swapped during planned product changeover." },
      { stage: "resolved", timestamp: "Sep 09, 18:00", author: "Marcus Vance", note: "Drive train run-in completed." },
      { stage: "impact_verified", timestamp: "Sep 14, 15:00", author: "Reliability Engineering Council", note: "Audit completed: $650,000 verified savings, 72h downtime prevented." }
    ],
    impactMetrics: {
      avertedDowntimeHours: 72,
      financialSavings: "$650,000",
      mtbfDelta: "+2,400 hrs",
      falsePositiveCheck: "True Positive — Girth Gear Preserved Intact"
    }
  }
];

// In-Memory Action Center Store
class ActionCenterStore {
  constructor() {
    this.issues = JSON.parse(JSON.stringify(INITIAL_ACTION_ISSUES));
    this.stages = WORKFLOW_STAGES;
    this.listeners = [];
  }

  getAllIssues() {
    return this.issues;
  }

  getIssueById(id) {
    return this.issues.find(item => item.id === id);
  }

  getIssuesByStage(stageId) {
    return this.issues.filter(item => item.currentStatus === stageId);
  }

  getMetrics() {
    const total = this.issues.length;
    const inProgress = this.issues.filter(i => i.currentStatus === "assigned" || i.currentStatus === "action_taken").length;
    const resolved = this.issues.filter(i => i.currentStatus === "resolved" || i.currentStatus === "impact_verified").length;
    const critical = this.issues.filter(i => i.priority === "Critical P1" && i.currentStatus !== "impact_verified").length;
    
    let totalSavings = 0;
    let totalAvertedHours = 0;
    this.issues.forEach(i => {
      if (i.impactMetrics) {
        totalSavings += parseInt((i.impactMetrics.financialSavings || "0").replace(/[^0-9]/g, ""), 10);
        totalAvertedHours += i.impactMetrics.avertedDowntimeHours || 0;
      }
    });

    return {
      total,
      inProgress,
      resolved,
      critical,
      totalSavingsFormatted: "$" + totalSavings.toLocaleString(),
      totalAvertedHours,
      slaCompliance: "98.4%"
    };
  }

  advanceStage(issueId, note = "") {
    const issue = this.getIssueById(issueId);
    if (!issue) return null;

    const currentIndex = this.stages.findIndex(s => s.id === issue.currentStatus);
    if (currentIndex < this.stages.length - 1) {
      const oldStage = issue.currentStatus;
      const newStage = this.stages[currentIndex + 1].id;
      issue.currentStatus = newStage;

      // Add to history
      const now = new Date();
      const timeStr = "Today, " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      issue.history.push({
        stage: newStage,
        timestamp: timeStr,
        author: "Engineering Lead",
        note: note || `Status advanced from ${oldStage.toUpperCase()} to ${newStage.toUpperCase()}.`
      });

      // If advancing to impact_verified, automatically attach verified metrics if not present
      if (newStage === "impact_verified" && !issue.impactMetrics) {
        issue.impactMetrics = {
          avertedDowntimeHours: 32,
          financialSavings: issue.potentialLoss,
          mtbfDelta: "+750 hrs",
          falsePositiveCheck: "Confirmed True Positive"
        };
      }

      this.notify(issueId, oldStage, newStage, "advance");
      return { issue, oldStage, newStage };
    }
    return null;
  }

  rollbackStage(issueId, note = "") {
    const issue = this.getIssueById(issueId);
    if (!issue) return null;

    const currentIndex = this.stages.findIndex(s => s.id === issue.currentStatus);
    if (currentIndex > 0) {
      const oldStage = issue.currentStatus;
      const newStage = this.stages[currentIndex - 1].id;
      issue.currentStatus = newStage;

      const now = new Date();
      const timeStr = "Today, " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      issue.history.push({
        stage: newStage,
        timestamp: timeStr,
        author: "Engineering Lead",
        note: note || `Status rolled back from ${oldStage.toUpperCase()} to ${newStage.toUpperCase()}.`
      });

      this.notify(issueId, oldStage, newStage, "rollback");
      return { issue, oldStage, newStage };
    }
    return null;
  }

  setStage(issueId, newStageId, note = "") {
    const issue = this.getIssueById(issueId);
    if (!issue) return null;

    const stageExists = this.stages.some(s => s.id === newStageId);
    if (!stageExists || issue.currentStatus === newStageId) return null;

    const oldStage = issue.currentStatus;
    issue.currentStatus = newStageId;

    const now = new Date();
    const timeStr = "Today, " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    issue.history.push({
      stage: newStageId,
      timestamp: timeStr,
      author: "Engineering Lead",
      note: note || `Direct stage transition to ${newStageId.toUpperCase()}.`
    });

    if (newStageId === "impact_verified" && !issue.impactMetrics) {
      issue.impactMetrics = {
        avertedDowntimeHours: 32,
        financialSavings: issue.potentialLoss,
        mtbfDelta: "+750 hrs",
        falsePositiveCheck: "Confirmed True Positive"
      };
    }

    this.notify(issueId, oldStage, newStageId, "direct");
    return { issue, oldStage, newStage: newStageId };
  }

  updateIssue(id, updates) {
    const issue = this.getIssueById(id);
    if (!issue) return null;

    Object.assign(issue, updates);
    this.notify(id, issue.currentStatus, issue.currentStatus, "update");
    return issue;
  }

  addIssue(newIssue) {
    this.issues.unshift(newIssue);
    this.notify(newIssue.id, null, newIssue.currentStatus, "create");
    return newIssue;
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify(issueId, oldStage, newStage, actionType) {
    this.listeners.forEach(cb => cb({ issueId, oldStage, newStage, actionType }));
  }
}

if (typeof window !== 'undefined') {
  window.EarlySightActionStore = new ActionCenterStore();
  window.WORKFLOW_STAGES = WORKFLOW_STAGES;
  window.TEAMS_LIST = TEAMS_LIST;
  window.PRIORITIES = PRIORITIES;
  window.INITIAL_ACTION_ISSUES = INITIAL_ACTION_ISSUES;
}

export {
  ActionCenterStore,
  WORKFLOW_STAGES,
  TEAMS_LIST,
  PRIORITIES,
  INITIAL_ACTION_ISSUES
};
