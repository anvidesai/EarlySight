/**
 * EarlySight — Action & Resolution Intelligence Dataset (Milestone 8)
 * 
 * Complete Closed-Loop Operational Workflow:
 * EMERGING RISK -> RECOMMENDED ACTION -> ASSIGNED -> IN PROGRESS -> RESOLVED -> VERIFIED
 * 
 * Front-end mock data only.
 */

export const ACTION_CENTER_KPIS = {
  openActions: 19,
  p1p2Actions: 8,
  inProgress: 6,
  awaitingVerification: 3,
  resolved: 12,
  verificationRate: "94.2%",
  mockDisclaimer: "ILLUSTRATIVE / MOCK FRONTEND OPERATIONAL VALUES"
};

export const ACTION_WORKFLOW_STAGES = [
  {
    step: "01",
    id: "risk_identified",
    name: "RISK IDENTIFIED",
    subtitle: "Signal & Pattern Synthesis",
    desc: "EarlySight detects spatial and temporal convergence forming an emerging problem."
  },
  {
    step: "02",
    id: "action_recommended",
    name: "ACTION RECOMMENDED",
    subtitle: "Prescriptive Mitigation",
    desc: "Domain-specific engineering intervention and parts specification proposed."
  },
  {
    step: "03",
    id: "assigned",
    name: "ASSIGNED",
    subtitle: "Ownership & Dispatch",
    desc: "Allocated to lead technician and scheduled into standard maintenance window."
  },
  {
    step: "04",
    id: "in_progress",
    name: "IN PROGRESS",
    subtitle: "Physical Execution",
    desc: "Active field investigation, torque inspection, component replacement in turnaround."
  },
  {
    step: "05",
    id: "resolved",
    name: "RESOLVED",
    subtitle: "Remediation Completed",
    desc: "Gasket replaced, bolts torqued, and initial operational baseline checked."
  },
  {
    step: "06",
    id: "verified",
    name: "VERIFIED",
    subtitle: "Closed-Loop Verification",
    desc: "Telemetry monitored across 72h to confirm anomaly decay and averted financial loss."
  }
];

export const ACTION_REGISTRY_DATA = [
  {
    id: "ACT-001",
    actionIdAlt: "ACT-2026-088",
    title: "Sub-Slab Pressurized Flange 4B-12 Targeted Gasket Swap",
    riskTitle: "Water Infrastructure Degradation",
    riskId: "RSK-001",
    riskIdAlt: "RSK-01",
    riskScore: 86,
    priority: "P1",
    priorityClass: "priority-p1",
    location: "Block A / Trench 4B",
    zoneSlug: "block-a",
    facilityQuad: "BLOCK A",
    recommendedAction: "Targeted sub-slab inspection & Viton gasket replacement during scheduled shift turnaround.",
    owner: "Facilities Engineering",
    leadTech: "G. Ramirez (Mechanical)",
    status: "IN PROGRESS",
    statusCategory: "in_progress",
    statusBadgeClass: "status-in-progress",
    createdDate: "18 Sep 2026",
    dueDate: "20 Sep 2026",
    daysRemaining: 1.8,
    leadTime: "14.2 Days Lead",
    potentialLoss: "$512,000",
    verificationState: "Pending Work Completion",
    
    // Why was this action recommended?
    whyRecommended: {
      riskName: "Water Infrastructure Degradation",
      evidenceSummary: [
        "17 related signals logged across 3 distinct operator shifts",
        "Repeated moisture accumulation reports in Trench 4B service trench",
        "Soil probe SM-4B volumetric water content surged to 68.4% (+44% over baseline)",
        "Spatial concentration within tight 8.5-meter radius along utility conduit",
        "Exponential velocity surge (+340% frequency acceleration over 72 hours)"
      ],
      patternName: "PAT-006 (Recurring Water Infrastructure Anomaly)",
      actionText: "Targeted sub-slab inspection + Viton seal replacement on joint 4B-12",
      reasonNarrative: "Early intervention is recommended because multiple independent signals converge on the same infrastructure zone and the recurrence rate is increasing. Replacing the gasket before full rupture avoids estimated $512,000 in cleanroom flooding and line drive destruction.",
      disclaimer: "MOCK / ILLUSTRATIVE ACTION RECOMMENDATION"
    },

    // Action Progress History
    progressTimeline: [
      { date: "18 Sep • 08:42", stage: "Risk Identified", desc: "RSK-001 synthesized with score 86 (P1 Immediate).", state: "completed" },
      { date: "19 Sep • 09:15", stage: "Action Recommended", desc: "Prescriptive Viton gasket replacement work order proposed.", state: "completed" },
      { date: "19 Sep • 11:30", stage: "Assigned to Facilities", desc: "Allocated to G. Ramirez; shift window reserved.", state: "completed" },
      { date: "20 Sep • 07:00", stage: "Inspection Started", desc: "Ultrasonic acoustic leak pinpointing initiated on flange 4B-12.", state: "current" },
      { date: "21 Sep • 14:00", stage: "Gasket Replacement", desc: "Execute planned physical seal replacement.", state: "upcoming" },
      { date: "22 Sep • 10:00", stage: "Verification Requested", desc: "Activate automated 72-hour soil probe telemetric audit.", state: "upcoming" },
      { date: "23 Sep • 16:00", stage: "Resolution Verified", desc: "Confirm moisture levels return to 21.3% baseline.", state: "upcoming" }
    ],

    // Before / After Telemetry Verification
    resolutionVerification: {
      before: {
        moistureProbe: "68.4% Saturation",
        leakageRecurrence: "High (+340% velocity surge)",
        riskScore: "86 / 100 (P1 Immediate)",
        acousticHiss: "4.2 kHz continuous hiss"
      },
      after: {
        moistureProbe: "21.3% (Dry Baseline)",
        leakageRecurrence: "Normal (0 new events in 72h)",
        riskScore: "18 / 100 (Low Residual)",
        acousticHiss: "0.4 kHz ambient floor"
      },
      verificationResult: "VERIFIED",
      explanation: "Post-action signals indicate that the abnormal pattern has returned toward baseline. 0 new moisture spikes detected across 72 hours of continuous monitoring.",
      disclaimer: "MOCK / ILLUSTRATIVE FRONTEND RESOLUTION DATA"
    },

    // Verification Checklist
    checklist: [
      { id: "chk-1", text: "Root cause addressed (Flange 4B-12 gasket swapped)", checked: true },
      { id: "chk-2", text: "Expected signal reduction observed (-95% anomaly decay)", checked: true },
      { id: "chk-3", text: "No new related incidents detected over 72h window", checked: true },
      { id: "chk-4", text: "Post-action evidence reviewed (Borescope confirmed dry)", checked: true },
      { id: "chk-5", text: "Risk score decreased from 86 to 18", checked: true },
      { id: "chk-6", text: "Resolution verified by Reliability Lead", checked: false }
    ],

    linkedEvidenceIds: ["EVD-014", "EVD-021", "EVD-033", "EVD-042"],
    linkedSignalIds: ["SIG-031", "SIG-044", "SIG-WTR-01", "SIG-01"]
  },

  {
    id: "ACT-002",
    title: "Switchgear 3B Joint Torque Audit & Active Filter Activation",
    riskTitle: "Switchgear Busbar Thermal Overload",
    riskId: "RSK-003",
    riskIdAlt: "RSK-03",
    riskScore: 88,
    priority: "P1",
    priorityClass: "priority-p1",
    location: "Power Island / Bus 3B",
    zoneSlug: "power-island",
    facilityQuad: "POWER ISLAND",
    recommendedAction: "Thermal inspection + load isolation & joint torque check; engage active harmonic filter HF-02.",
    owner: "Electrical Maintenance",
    leadTech: "H. Kowal (Master Electrician)",
    status: "ASSIGNED",
    statusCategory: "assigned",
    statusBadgeClass: "status-assigned",
    createdDate: "18 Sep 2026",
    dueDate: "19 Sep 2026",
    daysRemaining: 0.9,
    leadTime: "9.0 Days Lead",
    potentialLoss: "$1,850,000",
    verificationState: "Scheduled for Turnaround",
    
    whyRecommended: {
      riskName: "Thermal Overload & Harmonic Distortion",
      evidenceSummary: [
        "15 electrical indicators in enclosed Switchgear Cabinet SW-3B",
        "FLIR IR thermal camera logging +6.1°C thermal plume on joint 3B-4",
        "Power Quality Analyzer recording 4.8% Total Harmonic Distortion (THD)",
        "DGA oil lab detected 8 ppm dissolved acetylene (C2H2) gas",
        "Corona discharge hum and ozone smell logged during operator walkdown"
      ],
      patternName: "PAT-003 (Harmonic Overload & Thermal Plume Pattern)",
      actionText: "Re-torque bus joint bolts to 75 Nm, apply thermal paste, and enable harmonic filter HF-02",
      reasonNarrative: "Immediate intervention is critical because acetylene gas formation indicates micro-arcing inside the 13.8 kV bus enclosure. Unchecked heating risks catastrophic arc flash and plant-wide blackout.",
      disclaimer: "MOCK / ILLUSTRATIVE ACTION RECOMMENDATION"
    },

    progressTimeline: [
      { date: "18 Sep • 10:15", stage: "Risk Identified", desc: "RSK-003 escalated to Critical 88 (P1 Immediate).", state: "completed" },
      { date: "18 Sep • 13:40", stage: "Action Recommended", desc: "Emergency torque audit and harmonic filtering planned.", state: "completed" },
      { date: "18 Sep • 16:00", stage: "Assigned to Electrical", desc: "Dispatched to H. Kowal with arc-flash PPE protocol.", state: "current" },
      { date: "19 Sep • 08:00", stage: "Load Shedding & Torque", desc: "Isolate Bus 3B and torque bolt cluster to 75 Nm.", state: "upcoming" },
      { date: "19 Sep • 14:00", stage: "Filter Interlock", desc: "Engage active harmonic filter bank HF-02.", state: "upcoming" },
      { date: "20 Sep • 10:00", stage: "Resolution Verified", desc: "Verify joint thermal plume drops below +1.0°C baseline.", state: "upcoming" }
    ],

    resolutionVerification: {
      before: {
        moistureProbe: "N/A (Electrical Bus)",
        leakageRecurrence: "+6.1°C Thermal Plume",
        riskScore: "88 / 100 (Critical P1)",
        acousticHiss: "4.8% THD Harmonics"
      },
      after: {
        moistureProbe: "N/A",
        leakageRecurrence: "+0.8°C Nominal Ambient",
        riskScore: "14 / 100 (Residual Normal)",
        acousticHiss: "1.2% THD (Filtered)"
      },
      verificationResult: "AWAITING VERIFICATION",
      explanation: "Torque completed; waiting for 24-hour thermal radiometric camera confirmation under full factory load.",
      disclaimer: "MOCK / ILLUSTRATIVE FRONTEND RESOLUTION DATA"
    },

    checklist: [
      { id: "chk-1", text: "Root cause addressed (Joint re-torqued & paste applied)", checked: true },
      { id: "chk-2", text: "Harmonic active filter HF-02 engaged", checked: true },
      { id: "chk-3", text: "No corona hum or ozone detected", checked: true },
      { id: "chk-4", text: "FLIR radiometric scan confirms temperature drop", checked: false },
      { id: "chk-5", text: "Risk score decreased from 88 to 14", checked: false },
      { id: "chk-6", text: "Substation safety permit signed off", checked: false }
    ],

    linkedEvidenceIds: ["EVD-201", "EVD-202", "EVD-203", "EVD-204"],
    linkedSignalIds: ["SIG-022", "SIG-029"]
  },

  {
    id: "ACT-003",
    title: "Continuous Drive Feeder #4 Harmonic Vibration Source Mitigation",
    riskTitle: "Drive Feeder Failure Risk",
    riskId: "RSK-004",
    riskIdAlt: "RSK-04",
    riskScore: 82,
    priority: "P1",
    priorityClass: "priority-p1",
    location: "Assembly Bay 4",
    zoneSlug: "assembly-bay-4",
    facilityQuad: "BLOCK A",
    recommendedAction: "Inspect feeder coupling and vibration source; trim drive balance and replace cage bearings.",
    owner: "Reliability Engineering",
    leadTech: "Devon Chen (Vibration)",
    status: "AWAITING VERIFICATION",
    statusCategory: "awaiting_verification",
    statusBadgeClass: "status-awaiting-verification",
    createdDate: "15 Sep 2026",
    dueDate: "21 Sep 2026",
    daysRemaining: 2.8,
    leadTime: "18.0 Days Lead",
    potentialLoss: "$340,000",
    verificationState: "Post-Fix Telemetry Active",
    
    whyRecommended: {
      riskName: "Sub-Surface Bearing Cage Fatigue Cascade",
      evidenceSummary: [
        "8 operator complaints noting subtle harmonic hum on conveyor #4",
        "Vibration accelerometer logged +2.84σ jitter surge at 3,420 Hz",
        "FLIR thermal delta logged +4.7°C bearing casing bloom",
        "Grease lube sample showed premature metallic micro-spalls"
      ],
      patternName: "PAT-004 (High-Frequency Mechanical Resonance)",
      actionText: "Replace bearing cage assembly during shift turnaround and adjust torque envelope -12%",
      reasonNarrative: "Early bearing swap prevents high-speed drive seizure and collateral stator damage, eliminating an estimated 48 hours of assembly stoppage.",
      disclaimer: "MOCK / ILLUSTRATIVE ACTION RECOMMENDATION"
    },

    progressTimeline: [
      { date: "15 Sep • 09:00", stage: "Risk Identified", desc: "Precursor cluster detected with 94.6% confidence.", state: "completed" },
      { date: "16 Sep • 11:20", stage: "Action Recommended", desc: "Bearing cage replacement work order issued.", state: "completed" },
      { date: "17 Sep • 08:30", stage: "Assigned", desc: "Devon Chen assigned; turnaround window reserved.", state: "completed" },
      { date: "18 Sep • 14:00", stage: "Bearing Replacement", desc: "New SKF Explorer spherical bearing installed.", state: "completed" },
      { date: "19 Sep • 16:30", stage: "Verification Requested", desc: "Acoustic accelerometer data stream activated.", state: "current" },
      { date: "21 Sep • 12:00", stage: "Resolution Sign-off", desc: "Confirm 0.8 g-pk baseline across 7 shifts.", state: "upcoming" }
    ],

    resolutionVerification: {
      before: {
        moistureProbe: "N/A",
        leakageRecurrence: "+2.84σ Vibration Jitter",
        riskScore: "82 / 100 (P1 Immediate)",
        acousticHiss: "+4.7°C Casing Heat Bloom"
      },
      after: {
        moistureProbe: "N/A",
        leakageRecurrence: "0.8 g-pk Baseline (-95% decay)",
        riskScore: "12 / 100 (Normal Baseline)",
        acousticHiss: "+0.2°C Ambient Tracking"
      },
      verificationResult: "VERIFIED",
      explanation: "7 consecutive shift cycles completed with zero vibration spikes. MTBF extended by 18 months.",
      disclaimer: "MOCK / ILLUSTRATIVE FRONTEND RESOLUTION DATA"
    },

    checklist: [
      { id: "chk-1", text: "Root cause addressed (SKF spherical bearing replaced)", checked: true },
      { id: "chk-2", text: "Vibration envelope normalized below 1.0 g-pk", checked: true },
      { id: "chk-3", text: "Torque envelope recalibrated -12%", checked: true },
      { id: "chk-4", text: "Lube analysis clear of metallic debris", checked: true },
      { id: "chk-5", text: "Risk score decreased from 82 to 12", checked: true },
      { id: "chk-6", text: "Reliability Engineering verification complete", checked: true }
    ],

    linkedEvidenceIds: ["EVD-021"],
    linkedSignalIds: ["SIG-01", "SIG-02"]
  },

  {
    id: "ACT-004",
    title: "Hydraulic Manifold VB-4 Valve Cartridge PV-02 Replacement",
    riskTitle: "Extrusion Press Cavitation Risk",
    riskId: "RSK-002",
    riskIdAlt: "RSK-02",
    riskScore: 78,
    priority: "P2",
    priorityClass: "priority-p2",
    location: "Block C / Press Station #2",
    zoneSlug: "block-c",
    facilityQuad: "BLOCK C",
    recommendedAction: "Inspect cooling loop and acoustic anomaly; swap proportional valve spool cartridge PV-02.",
    owner: "Process Engineering",
    leadTech: "E. Morales (Hydraulics)",
    status: "RECOMMENDED",
    statusCategory: "recommended",
    statusBadgeClass: "status-recommended",
    createdDate: "16 Sep 2026",
    dueDate: "24 Sep 2026",
    daysRemaining: 5.6,
    leadTime: "12.0 Days Lead",
    potentialLoss: "$340,000",
    verificationState: "Awaiting Allocation",
    
    whyRecommended: {
      riskName: "Hydraulic Proportional Valve Cavitation Drift",
      evidenceSummary: [
        "12 signals localized to Press Station #2 manifold gallery",
        "LVDT spool position feedback lags setpoint by 14ms (nominal: 3ms)",
        "Ultrasonic transducer logged 48 kHz high-frequency cavitation bursts",
        "Laser thickness gauge flagged micro-ripples on extruded billet",
        "Lube technician logged 5% oil sight-glass foaming"
      ],
      patternName: "PAT-002 (Proportional Valve Spool Stick-Slip Pattern)",
      actionText: "Replace proportional valve spool cartridge PV-02 and replenish anti-foaming chemistry",
      reasonNarrative: "Replacing the spool cartridge during planned mold change avoids complete spool seizure under 210 bar line pressure and blown manifold seals.",
      disclaimer: "MOCK / ILLUSTRATIVE ACTION RECOMMENDATION"
    },

    progressTimeline: [
      { date: "16 Sep • 14:00", stage: "Risk Identified", desc: "Cavitation pattern flagged at 91.2% confidence.", state: "completed" },
      { date: "17 Sep • 09:30", stage: "Action Recommended", desc: "Cartridge replacement WO-8902 generated.", state: "current" },
      { date: "18 Sep • 16:00", stage: "Assigned", desc: "Pending technical lead assignment.", state: "upcoming" },
      { date: "22 Sep • 10:00", stage: "Cartridge Swap", desc: "Execute replacement during mold turnaround.", state: "upcoming" },
      { date: "24 Sep • 14:00", stage: "Verification", desc: "Confirm LVDT response time returns to 3ms.", state: "upcoming" }
    ],

    resolutionVerification: {
      before: {
        moistureProbe: "N/A",
        leakageRecurrence: "14ms Spool Hysteresis Lag",
        riskScore: "78 / 100 (P2 High)",
        acousticHiss: "48 kHz Ultrasonic Cavitation Spikes"
      },
      after: {
        moistureProbe: "N/A",
        leakageRecurrence: "3ms Nominal Response",
        riskScore: "16 / 100 (Normal Baseline)",
        acousticHiss: "12 kHz Quiescent Flow"
      },
      verificationResult: "PENDING RESOLUTION",
      explanation: "Awaiting work execution during upcoming scheduled shift mold change.",
      disclaimer: "MOCK / ILLUSTRATIVE FRONTEND RESOLUTION DATA"
    },

    checklist: [
      { id: "chk-1", text: "Replacement spool cartridge PV-02 staged", checked: true },
      { id: "chk-2", text: "Hydraulic reservoir anti-foaming agent prepared", checked: false },
      { id: "chk-3", text: "Suction basket cleaned", checked: false },
      { id: "chk-4", text: "LVDT response tested under 210 bar load", checked: false },
      { id: "chk-5", text: "Billet surface ripple inspection verified", checked: false },
      { id: "chk-6", text: "Engineering sign-off completed", checked: false }
    ],

    linkedEvidenceIds: ["EVD-101", "EVD-102", "EVD-103", "EVD-104"],
    linkedSignalIds: ["SIG-012", "SIG-018"]
  },

  {
    id: "ACT-005",
    title: "Centrifugal Baghouse Blower #4 Dynamic Trim Balancing",
    riskTitle: "Baghouse Dynamic Unbalance Inception",
    riskId: "RSK-005",
    riskIdAlt: "RSK-05",
    riskScore: 64,
    priority: "P2",
    priorityClass: "priority-p2",
    location: "Utility Zone / Roof Quad",
    zoneSlug: "utility-zone",
    facilityQuad: "BLOCK B",
    recommendedAction: "Conduct on-site dynamic balance trim with portable strobe tachometer and clean impeller blade deposits.",
    owner: "Mechanical Reliability",
    leadTech: "Devon Chen (Vibration Specialist)",
    status: "RESOLVED",
    statusCategory: "resolved",
    statusBadgeClass: "status-resolved",
    createdDate: "10 Sep 2026",
    dueDate: "17 Sep 2026",
    daysRemaining: 0,
    leadTime: "15.0 Days Lead",
    potentialLoss: "$115,000",
    verificationState: "Remediation Executed",
    
    whyRecommended: {
      riskName: "Impeller Unbalance Trajectory",
      evidenceSummary: [
        "1X RPM harmonic amplitude grew +18% weekly",
        "Flue particulate lime dust flyover during burner relight",
        "Optical tachometer logged 28.4 mm/s vibration amplitude"
      ],
      patternName: "PAT-005 (Centrifugal Blower Blade Fouling)",
      actionText: "Steam-clean impeller and apply 45g balance trim weight to blade #6",
      reasonNarrative: "Early trim balancing prevents unbalance vibration from brinelling blower pillow block bearings.",
      disclaimer: "MOCK / ILLUSTRATIVE ACTION RECOMMENDATION"
    },

    progressTimeline: [
      { date: "10 Sep", stage: "Risk Identified", desc: "1X harmonic growth detected.", state: "completed" },
      { date: "12 Sep", stage: "Action Recommended", desc: "Trim balance work order created.", state: "completed" },
      { date: "13 Sep", stage: "Assigned", desc: "Devon Chen scheduled.", state: "completed" },
      { date: "15 Sep", stage: "Cleaned & Balanced", desc: "45g balance weight applied; blades cleaned.", state: "completed" },
      { date: "17 Sep", stage: "Resolved", desc: "Blower vibration dropped to 2.1 mm/s.", state: "completed" }
    ],

    resolutionVerification: {
      before: {
        moistureProbe: "N/A",
        leakageRecurrence: "28.4 mm/s Vibration Peak",
        riskScore: "64 / 100 (P2 High)",
        acousticHiss: "1X Harmonic Dominant"
      },
      after: {
        moistureProbe: "N/A",
        leakageRecurrence: "2.1 mm/s ISO Class A Level",
        riskScore: "08 / 100 (Nominal Residual)",
        acousticHiss: "Harmonic Peaks Cleared"
      },
      verificationResult: "VERIFIED",
      explanation: "Vibration telemetry verified stable across 96 hours post-balancing. Zero bearing damage.",
      disclaimer: "MOCK / ILLUSTRATIVE FRONTEND RESOLUTION DATA"
    },

    checklist: [
      { id: "chk-1", text: "Impeller steam cleaned", checked: true },
      { id: "chk-2", text: "45g balance weight tack-welded", checked: true },
      { id: "chk-3", text: "Vibration reduced -92%", checked: true },
      { id: "chk-4", text: "Bearing temperature nominal", checked: true },
      { id: "chk-5", text: "Risk score decreased from 64 to 08", checked: true },
      { id: "chk-6", text: "Maintenance supervisor sign-off", checked: true }
    ],

    linkedEvidenceIds: ["EVD-050"],
    linkedSignalIds: ["SIG-01", "SIG-06"]
  },

  {
    id: "ACT-006",
    title: "Cleanroom Cell C Humidity Barrier Seal Replacement",
    riskTitle: "Cleanroom Micro-Climate Humidity Drift",
    riskId: "RSK-006",
    riskIdAlt: "RSK-06",
    riskScore: 58,
    priority: "P3",
    priorityClass: "priority-p3",
    location: "Block A / Cleanroom Cell C",
    zoneSlug: "block-a",
    facilityQuad: "BLOCK A",
    recommendedAction: "Inspect perimeter airlock silicon gasket and calibrate differential pressure magnehelic gauge.",
    owner: "Facilities Engineering",
    leadTech: "S. Lindqvist (Facilities)",
    status: "BLOCKED",
    statusCategory: "blocked",
    statusBadgeClass: "status-blocked",
    createdDate: "12 Sep 2026",
    dueDate: "26 Sep 2026",
    daysRemaining: 7.2,
    leadTime: "24.0 Days Lead",
    potentialLoss: "$92,000",
    verificationState: "Blocked (Parts on Order)",
    
    whyRecommended: {
      riskName: "Cleanroom Barrier Integrity Anomaly",
      evidenceSummary: [
        "Cleanroom humidity creeping +4.2% RH during weekend cycles",
        "Airlock entry door magnetic interlock alignment drift",
        "Particulate sensor logged transient ISO Class 6 bump"
      ],
      patternName: "PAT-007 (HVAC Micro-Climate Boundary Seepage)",
      actionText: "Replace perimeter silicone compression gasket and re-align interlock striker",
      reasonNarrative: "Perimeter seal maintenance preserves ISO Class 5 certification and prevents moisture entry.",
      disclaimer: "MOCK / ILLUSTRATIVE ACTION RECOMMENDATION"
    },

    progressTimeline: [
      { date: "12 Sep", stage: "Risk Identified", desc: "Humidity drift flagged.", state: "completed" },
      { date: "14 Sep", stage: "Action Recommended", desc: "Seal swap work order created.", state: "completed" },
      { date: "16 Sep", stage: "Blocked", desc: "High-spec silicone gasket awaiting customs clearance.", state: "current" }
    ],

    resolutionVerification: {
      before: {
        moistureProbe: "N/A",
        leakageRecurrence: "+4.2% RH Humidity Creep",
        riskScore: "58 / 100 (P3 Medium)",
        acousticHiss: "Airlock ΔP: 8 Pa (Spec 15 Pa)"
      },
      after: {
        moistureProbe: "N/A",
        leakageRecurrence: "Pending Part Arrival",
        riskScore: "58 / 100",
        acousticHiss: "Pending Part Arrival"
      },
      verificationResult: "PENDING RESOLUTION",
      explanation: "Action blocked pending arrival of certified cleanroom silicone gasket part #GKT-CR-55.",
      disclaimer: "MOCK / ILLUSTRATIVE FRONTEND RESOLUTION DATA"
    },

    checklist: [
      { id: "chk-1", text: "Specialty gasket order PO-8812 tracked", checked: true },
      { id: "chk-2", text: "Cleanroom production schedule aligned", checked: false },
      { id: "chk-3", text: "Seal replacement completed", checked: false },
      { id: "chk-4", text: "Differential pressure >15 Pa verified", checked: false },
      { id: "chk-5", text: "ISO Class 5 particle count certified", checked: false },
      { id: "chk-6", text: "Quality sign-off recorded", checked: false }
    ],

    linkedEvidenceIds: ["EVD-009"],
    linkedSignalIds: ["SIG-01"]
  },

  {
    id: "ACT-007",
    title: "Chilled Water Booster Pump P-102 Recirculation Valve Tuning",
    riskTitle: "Booster Pump Hydraulic Transient Surge",
    riskId: "RSK-001",
    riskIdAlt: "RSK-01",
    riskScore: 74,
    priority: "P2",
    priorityClass: "priority-p2",
    location: "Block A / Trench 4B",
    zoneSlug: "block-a",
    facilityQuad: "BLOCK A",
    recommendedAction: "Widen booster pump pressure deadband by 0.4 bar and tune check-valve soft-closing damper.",
    owner: "Hydraulics & Fluid Power",
    leadTech: "H. Patel (Instrumentation)",
    status: "VERIFIED",
    statusCategory: "verified",
    statusBadgeClass: "status-verified",
    createdDate: "05 Sep 2026",
    dueDate: "14 Sep 2026",
    daysRemaining: 0,
    leadTime: "16.0 Days Lead",
    potentialLoss: "$180,000",
    verificationState: "Resolution Verified (Audited)",
    
    whyRecommended: {
      riskName: "Hydraulic Water Hammer Transient Pressure Shock",
      evidenceSummary: [
        "Booster pump P-102 short-cycling every 4.2 minutes",
        "Transient -1.4 bar pressure bounce recorded by transducer PT-102",
        "Water hammer shock waves transmitting through flange 4B-12"
      ],
      patternName: "PAT-008 (Hydraulic Shock Transmission Pattern)",
      actionText: "Calibrate soft-closing check valve and reprogram PLC pump deadband",
      reasonNarrative: "Damping the hydraulic shock eliminates transient pressure spikes that caused gasket fatigue on flange 4B-12.",
      disclaimer: "MOCK / ILLUSTRATIVE ACTION RECOMMENDATION"
    },

    progressTimeline: [
      { date: "05 Sep", stage: "Risk Identified", desc: "Pressure bounce flagged.", state: "completed" },
      { date: "07 Sep", stage: "Action Recommended", desc: "PLC deadband retuning proposed.", state: "completed" },
      { date: "09 Sep", stage: "Assigned & Tuned", desc: "H. Patel recalibrated soft damper.", state: "completed" },
      { date: "12 Sep", stage: "Resolved", desc: "Pressure spikes eliminated.", state: "completed" },
      { date: "14 Sep", stage: "Verified", desc: "Telemetry confirmed zero water hammer transients.", state: "completed" }
    ],

    resolutionVerification: {
      before: {
        moistureProbe: "N/A",
        leakageRecurrence: "±1.4 bar Pressure Transients",
        riskScore: "74 / 100 (P2 High)",
        acousticHiss: "Water Hammer Clank Audible"
      },
      after: {
        moistureProbe: "N/A",
        leakageRecurrence: "±0.05 bar Smooth Ramping",
        riskScore: "06 / 100 (Fully Mitigated)",
        acousticHiss: "Smooth Pump Ramp-Up"
      },
      verificationResult: "VERIFIED",
      explanation: "72-hour pressure trace confirms hydraulic shock completely eliminated. No transient stress on downstream flanges.",
      disclaimer: "MOCK / ILLUSTRATIVE FRONTEND RESOLUTION DATA"
    },

    checklist: [
      { id: "chk-1", text: "PLC deadband widened +0.4 bar", checked: true },
      { id: "chk-2", text: "Check valve soft damper installed", checked: true },
      { id: "chk-3", text: "Water hammer pressure spikes eliminated", checked: true },
      { id: "chk-4", text: "Downstream vibration logged nominal", checked: true },
      { id: "chk-5", text: "Risk score decreased from 74 to 06", checked: true },
      { id: "chk-6", text: "Instrumentation lead verified", checked: true }
    ],

    linkedEvidenceIds: ["EVD-014"],
    linkedSignalIds: ["SIG-WTR-01"]
  }
];

// Helper functions for action lookup, filtering, and mock state transition
export function getActionById(actionId) {
  if (!actionId) return ACTION_REGISTRY_DATA[0];
  const query = actionId.trim().toUpperCase();
  return ACTION_REGISTRY_DATA.find(a => 
    a.id.toUpperCase() === query || 
    (a.actionIdAlt && a.actionIdAlt.toUpperCase() === query) ||
    a.riskId.toUpperCase() === query ||
    (a.riskIdAlt && a.riskIdAlt.toUpperCase() === query)
  ) || ACTION_REGISTRY_DATA[0];
}

export function filterActionsRegistry({
  search = '',
  priority = 'all',
  status = 'all',
  owner = 'all',
  location = 'all',
  riskId = 'all',
  verification = 'all'
}) {
  return ACTION_REGISTRY_DATA.filter(item => {
    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const match = item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.riskTitle.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q) ||
        item.recommendedAction.toLowerCase().includes(q) ||
        item.leadTech.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Priority filter
    if (priority !== 'all') {
      const pNorm = priority.toUpperCase();
      if (!item.priority.toUpperCase().includes(pNorm) && item.priorityClass !== priority.toLowerCase()) {
        return false;
      }
    }

    // Status filter
    if (status !== 'all') {
      const sNorm = status.toUpperCase().replace(/\s+/g, '_');
      if (item.status !== status.toUpperCase() && item.statusCategory !== status.toLowerCase()) {
        return false;
      }
    }

    // Owner / Team filter
    if (owner !== 'all') {
      if (!item.owner.toLowerCase().includes(owner.toLowerCase())) {
        return false;
      }
    }

    // Location / Zone filter
    if (location !== 'all') {
      const locSlug = location.toLowerCase().replace(/\s+/g, '-');
      if (item.zoneSlug !== locSlug && !item.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
    }

    // Risk filter
    if (riskId !== 'all') {
      const rNorm = riskId.toUpperCase();
      if (item.riskId !== rNorm && (item.riskIdAlt && item.riskIdAlt !== rNorm) && !item.riskTitle.toLowerCase().includes(riskId.toLowerCase())) {
        return false;
      }
    }

    // Verification state filter
    if (verification !== 'all') {
      const vNorm = verification.toLowerCase();
      if (vNorm === 'verified' && !item.verificationState.toLowerCase().includes('verified')) return false;
      if (vNorm === 'awaiting' && !item.verificationState.toLowerCase().includes('awaiting') && !item.verificationState.toLowerCase().includes('pending')) return false;
    }

    return true;
  });
}

// Global browser window bindings
if (typeof window !== 'undefined') {
  window.ACTION_CENTER_KPIS = ACTION_CENTER_KPIS;
  window.ACTION_WORKFLOW_STAGES = ACTION_WORKFLOW_STAGES;
  window.ACTION_REGISTRY_DATA = ACTION_REGISTRY_DATA;
  window.getActionById = getActionById;
  window.filterActionsRegistry = filterActionsRegistry;
}
