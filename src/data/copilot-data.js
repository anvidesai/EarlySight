/**
 * EarlySight — AI Copilot Intelligence Dataset (Milestone 9)
 * 
 * Provides deterministic knowledge, reasoning stages, insight cards,
 * pre-computed analytical responses with evidence traces, and activity logs.
 * 
 * Frontend demonstration mock data only.
 */

export const COPILOT_METRICS = {
  signalsAnalyzed: 128,
  relatedGroups: "06",
  emergingRisks: "04",
  evidenceChains: "06",
  openActions: 19,
  contextLabel: "Current operational context",
  disclaimer: "Frontend demonstration using mock AI responses. No live model is connected."
};

export const REASONING_STAGES = [
  {
    stage: "01",
    name: "Signal",
    sub: "Individual observation",
    desc: "Single vibration anomaly, technician complaint, or sensor deviation recorded in isolation."
  },
  {
    stage: "02",
    name: "Relationship",
    sub: "Connected observations",
    desc: "Cross-silo signals linked by shared timestamp, spatial proximity, or equipment category."
  },
  {
    stage: "03",
    name: "Pattern",
    sub: "Recurring behavior",
    desc: "Repeated or converging multi-signal trends exhibiting frequency acceleration over time."
  },
  {
    stage: "04",
    name: "Risk",
    sub: "Emerging problem",
    desc: "High-confidence operational hazard synthesized before functional failure or downtime."
  },
  {
    stage: "05",
    name: "Evidence",
    sub: "Supporting proof",
    desc: "Causal explanation graph quantifying statistical confidence, observed facts, and hypotheses."
  },
  {
    stage: "06",
    name: "Action",
    sub: "Recommended response",
    desc: "Prescriptive engineering intervention dispatched to close the operational loop."
  }
];

export const INSIGHT_CARDS = [
  {
    id: "card-risk",
    category: "Emerging Risk",
    title: "Water Infrastructure Degradation",
    score: "86 / 100",
    trend: "Increasing (+340%)",
    statusBadge: "Critical P1",
    statusBadgeClass: "badge-vermilion",
    linkText: "View Risk Dossier →",
    url: "risks.html?riskId=RSK-001"
  },
  {
    id: "card-pattern",
    category: "Pattern",
    title: "Recurring leakage around Trench 4B",
    signals: "14 Signals",
    recurrence: "4 days continuous",
    statusBadge: "PAT-006",
    statusBadgeClass: "badge-amber",
    linkText: "View Pattern Timeline →",
    url: "timeline.html?zone=block-a&case=0"
  },
  {
    id: "card-evidence",
    category: "Evidence",
    title: "Multi-source convergence",
    confidence: "84% Confidence",
    support: "SCADA + Soil Probe + Logs",
    statusBadge: "EVD-014",
    statusBadgeClass: "badge-teal",
    linkText: "View Causal Evidence →",
    url: "evidence.html?riskId=RSK-001"
  },
  {
    id: "card-action",
    category: "Action",
    title: "Targeted sub-slab inspection",
    priority: "Priority: P1 Urgent",
    owner: "Facilities Engineering",
    statusBadge: "ACT-001 In Progress",
    statusBadgeClass: "badge-forest",
    linkText: "View Action Center →",
    url: "actions.html?actionId=ACT-001"
  }
];

export const SUGGESTED_QUERIES = [
  "What emerging risks need attention?",
  "Why was the Block A risk flagged?",
  "What changed in the last 7 days?",
  "Which signals are converging?",
  "What action should be prioritized?",
  "Show evidence behind the highest-risk issue.",
  "Which risks are accelerating?",
  "Which areas show repeated anomalies?"
];

export const INITIAL_RECENT_ACTIVITY = [
  {
    id: "act-1",
    timestamp: "18:42",
    query: "Why is Block A high priority?",
    context: "Risks",
    status: "Analyzed"
  },
  {
    id: "act-2",
    timestamp: "18:36",
    query: "What risks are increasing?",
    context: "All Intelligence",
    status: "Analyzed"
  },
  {
    id: "act-3",
    timestamp: "18:21",
    query: "Show evidence for RSK-001",
    context: "Evidence",
    status: "Analyzed"
  },
  {
    id: "act-4",
    timestamp: "18:04",
    query: "What should we inspect next?",
    context: "Actions",
    status: "Analyzed"
  }
];

export const MOCK_RESPONSES = {
  water_block_a: {
    id: "resp-water-block-a",
    queryMatched: "Why was the Block A risk flagged?",
    title: "Block A / Trench 4B Water Seepage & Infrastructure Degradation",
    context: "Risks & Evidence",
    aiInterpretation: "EarlySight identifies a recurring infrastructure degradation pattern in Block A / Trench 4B driven by subterranean pressurized joint fatigue.",
    evidence: [
      "14 related signals logged across 3 distinct operator shifts",
      "Repeated over 4 consecutive operational days",
      "+320% signal frequency increase (velocity surge from 1.2 to 5.1 events/day)",
      "Strong spatial co-location within 8.5-meter radius along utility trench",
      "Severity increased from Medium to High (Score: 86 / 100)"
    ],
    whyItMatters: "The signals are no longer isolated events. Their frequency, location, and severity indicate a persistent emerging condition that threatens cleanroom operations and line drive electronics with an estimated $512,000 potential downtime loss.",
    recommendedNextStep: "Prioritize targeted sub-slab inspection and Viton gasket replacement on Flange 4B-12 during the upcoming scheduled shift turnaround.",
    confidence: {
      evidenceConfidence: "84% evidence confidence",
      patternCoherence: "91% pattern coherence",
      leadTime: "14.2 Days Lead Time"
    },
    evidenceTrace: [
      { step: "SOURCE SIGNALS", label: "14 Signals", link: "signals.html?zone=block-a", type: "signals" },
      { step: "RELATED CLUSTER", label: "CLU-04 Trench 4B", link: "signals.html?zone=block-a", type: "cluster" },
      { step: "PATTERN", label: "PAT-006 Infra Recurrence", link: "timeline.html?zone=block-a&case=0", type: "pattern" },
      { step: "EMERGING RISK", label: "RSK-001 Water Degradation", link: "risks.html?riskId=RSK-001", type: "risk" },
      { step: "RECOMMENDED ACTION", label: "ACT-001 Targeted Inspection", link: "actions.html?actionId=ACT-001", type: "action" }
    ],
    inspectorData: {
      query: "Why was the Block A risk flagged?",
      context: "Risks & Evidence",
      interpretation: "Recurrent joint fatigue and subterranean seepage in Trench 4B.",
      supportingSignals: "SIG-031 (Moisture Probe), SIG-044 (Visual Floor Seepage), SIG-WTR-01 (Pressure Drop)",
      pattern: "PAT-006: Recurring Water Infrastructure Anomaly",
      risk: "RSK-001: Water Infrastructure Degradation (Score 86/100, P1)",
      evidence: "EVD-014: Multi-sensor spatial convergence with 84% statistical confidence",
      action: "ACT-001: Viton Gasket Replacement (Due: 20 Sep 2026, Owner: Facilities)",
      confidence: "84% Evidence Confidence / 91% Pattern Coherence",
      timeline: "14.2 Days Lead Time / T-18 days detection to T-0 projected breach",
      deepLinks: {
        signals: "signals.html?zone=block-a",
        risk: "risks.html?riskId=RSK-001",
        evidence: "evidence.html?riskId=RSK-001",
        timeline: "timeline.html?zone=block-a&case=0",
        action: "actions.html?actionId=ACT-001",
        map: "map.html?zone=block-a"
      }
    }
  },

  risks_priority: {
    id: "resp-risks-priority",
    queryMatched: "What emerging risks need attention?",
    title: "High-Priority Emerging Risks Requiring Operational Attention",
    context: "Emerging Risks",
    aiInterpretation: "EarlySight currently tracks 4 active emerging risks. Two are classified Critical P1: Switchgear Busbar Thermal Overload (RSK-003, Score 88) and Water Infrastructure Degradation (RSK-001, Score 86).",
    evidence: [
      "RSK-003: +6.1°C thermal plume on Switchgear Bus 3B with 4.8% THD harmonics and dissolved acetylene gas",
      "RSK-001: 14 signals in Block A accelerating +320% frequency across 72 hours",
      "RSK-004: +2.84σ bearing cage vibration jitter on Conveyor Drive #4 in Assembly Bay 4",
      "RSK-002: Hydraulic proportional valve spool hysteresis lag (14ms vs 3ms nominal) in Block C"
    ],
    whyItMatters: "Unchecked thermal heating on Bus 3B risks catastrophic arc flash and plant-wide outage ($1.85M loss), while the water seepage threatens cleanroom sub-slab conduits ($512k loss).",
    recommendedNextStep: "Dispatch Electrical Maintenance for immediate torque check on Bus 3B (ACT-002); proceed with planned gasket turnaround on Flange 4B-12 (ACT-001).",
    confidence: {
      evidenceConfidence: "89% evidence confidence",
      patternCoherence: "93% pattern coherence",
      leadTime: "9.0 - 18.0 Days Lead Time"
    },
    evidenceTrace: [
      { step: "SOURCE SIGNALS", label: "29 Signals", link: "signals.html", type: "signals" },
      { step: "RELATED CLUSTER", label: "Power Island & Block A", link: "map.html", type: "cluster" },
      { step: "PATTERN", label: "PAT-003 & PAT-006", link: "timeline.html", type: "pattern" },
      { step: "EMERGING RISK", label: "RSK-003 & RSK-001 (P1)", link: "risks.html", type: "risk" },
      { step: "RECOMMENDED ACTION", label: "ACT-002 & ACT-001", link: "actions.html", type: "action" }
    ],
    inspectorData: {
      query: "What emerging risks need attention?",
      context: "Emerging Risks",
      interpretation: "Dual P1 critical hazards in Power Island and Block A assembly trenches.",
      supportingSignals: "SIG-022 (Thermal IR Bloom), SIG-029 (THD Harmonic), SIG-031 (Trench Moisture)",
      pattern: "PAT-003 (Harmonic Thermal Plume) & PAT-006 (Infrastructure Seepage)",
      risk: "RSK-003 (Score 88/100) & RSK-001 (Score 86/100)",
      evidence: "EVD-201 (FLIR IR Thermography) & EVD-014 (Soil Capacitive Saturation)",
      action: "ACT-002 (Torque Audit) & ACT-001 (Gasket Replacement)",
      confidence: "89% Evidence Confidence / 93% Coherence",
      timeline: "9.0 Days Lead on Power Island / 14.2 Days Lead on Water Trench",
      deepLinks: {
        signals: "signals.html",
        risk: "risks.html?riskId=RSK-003",
        evidence: "evidence.html?riskId=RSK-003",
        timeline: "timeline.html",
        action: "actions.html?actionId=ACT-002",
        map: "map.html?zone=power-island"
      }
    }
  },

  evidence_explain: {
    id: "resp-evidence-explain",
    queryMatched: "Show evidence behind the highest-risk issue.",
    title: "Causal Evidence Behind Switchgear 3B Thermal Overload (RSK-003)",
    context: "Evidence & Explainability",
    aiInterpretation: "EarlySight constructs a multi-modal evidence chain confirming micro-arcing and resistive heating inside the 13.8 kV enclosed switchgear cabinet.",
    evidence: [
      "FLIR radiometric scan confirmed +6.1°C hotspot localized to bolted bus joint 3B-4",
      "Power Quality Analyzer logged 4.8% Total Harmonic Distortion (THD) on phase C",
      "Dissolved Gas Analysis (DGA) laboratory sample detected 8 ppm dissolved acetylene (C2H2)",
      "Ultrasonic acoustic detector logged 42 kHz partial discharge corona crackle",
      "15 convergent indicators logged across 6 consecutive operating shifts"
    ],
    whyItMatters: "Acetylene gas generation is an undeniable marker of electrical micro-arcing. At 13.8 kV, sustained thermal degradation leads directly to catastrophic phase-to-phase arc flash explosion.",
    recommendedNextStep: "Execute planned load isolation, inspect Belleville washers, re-torque bolts to 75 Nm, and activate active harmonic filter HF-02.",
    confidence: {
      evidenceConfidence: "94% evidence confidence",
      patternCoherence: "96% pattern coherence",
      leadTime: "9.0 Days Lead Time"
    },
    evidenceTrace: [
      { step: "SOURCE SIGNALS", label: "15 Signals", link: "signals.html?zone=power-island", type: "signals" },
      { step: "RELATED CLUSTER", label: "Switchgear Cabinet SW-3B", link: "map.html?zone=power-island", type: "cluster" },
      { step: "PATTERN", label: "PAT-003 Harmonic Thermal Plume", link: "timeline.html?zone=power-island", type: "pattern" },
      { step: "EMERGING RISK", label: "RSK-003 Busbar Thermal Overload", link: "risks.html?riskId=RSK-003", type: "risk" },
      { step: "RECOMMENDED ACTION", label: "ACT-002 Joint Torque Audit", link: "actions.html?actionId=ACT-002", type: "action" }
    ],
    inspectorData: {
      query: "Show evidence behind the highest-risk issue.",
      context: "Evidence & Explainability",
      interpretation: "Multi-modal confirmation of micro-arcing inside enclosed 13.8 kV switchgear.",
      supportingSignals: "SIG-022 (Radiometric Thermal Delta), SIG-029 (THD Harmonic Spectrum)",
      pattern: "PAT-003: Harmonic Overload & Thermal Plume Pattern",
      risk: "RSK-003: Switchgear Busbar Thermal Overload (Critical 88)",
      evidence: "EVD-201 (FLIR IR Thermography), EVD-202 (Power Quality THD), EVD-203 (DGA Chemistry)",
      action: "ACT-002: Joint Torque Audit & Active Filter Activation",
      confidence: "94% Evidence Confidence / 96% Pattern Coherence",
      timeline: "9.0 Days Lead Time until projected insulator tracking breakdown",
      deepLinks: {
        signals: "signals.html?zone=power-island",
        risk: "risks.html?riskId=RSK-003",
        evidence: "evidence.html?riskId=RSK-003",
        timeline: "timeline.html?zone=power-island",
        action: "actions.html?actionId=ACT-002",
        map: "map.html?zone=power-island"
      }
    }
  },

  action_prioritized: {
    id: "resp-action-prioritized",
    queryMatched: "What action should be prioritized?",
    title: "Operational Action Prioritization & Turnaround Alignment",
    context: "Actions & Resolution",
    aiInterpretation: "Top priority is assigned to ACT-001 (Targeted Sub-Slab Flange Gasket Swap) and ACT-002 (Switchgear 3B Joint Torque Audit). Both mitigate immediate P1 hazards with high ROI impact.",
    evidence: [
      "ACT-001 has 14.2 days lead time, requires 4.2-hour planned turnaround window, protects $512,000",
      "ACT-002 has 9.0 days lead time, requires electrical isolation during low-demand shift, protects $1,850,000",
      "ACT-003 is currently Awaiting Verification following spherical bearing replacement on Drive Feeder #4",
      "All 19 active actions map directly to verified causal evidence chains"
    ],
    whyItMatters: "Proactive turnaround execution during scheduled shift windows incurs zero unplanned manufacturing line downtime halts.",
    recommendedNextStep: "Confirm technician assignment for G. Ramirez (ACT-001) and authorize arc-flash safety permit for H. Kowal (ACT-002).",
    confidence: {
      evidenceConfidence: "92% evidence confidence",
      patternCoherence: "95% pattern coherence",
      leadTime: "Turnaround Window Synchronized"
    },
    evidenceTrace: [
      { step: "SOURCE SIGNALS", label: "Weak Signals Ingress", link: "signals.html", type: "signals" },
      { step: "RELATED CLUSTER", label: "Correlated Risk Groups", link: "risks.html", type: "cluster" },
      { step: "PATTERN", label: "Recurring Patterns", link: "timeline.html", type: "pattern" },
      { step: "EMERGING RISK", label: "RSK-001 & RSK-003", link: "risks.html", type: "risk" },
      { step: "RECOMMENDED ACTION", label: "ACT-001 & ACT-002", link: "actions.html", type: "action" }
    ],
    inspectorData: {
      query: "What action should be prioritized?",
      context: "Actions & Resolution",
      interpretation: "Execution window prioritized for P1 interventions before mechanical rupture.",
      supportingSignals: "Cross-facility signals in Block A and Power Island",
      pattern: "Prescriptive Turnaround Alignment",
      risk: "RSK-001 (Water Infra) and RSK-003 (Switchgear Thermal)",
      evidence: "Verified operational proof and telemetry baselines",
      action: "ACT-001 (Facilities) and ACT-002 (Electrical)",
      confidence: "92% Operational Confidence",
      timeline: "Target completion within 48 hours",
      deepLinks: {
        signals: "signals.html",
        risk: "risks.html",
        evidence: "evidence.html",
        timeline: "timeline.html",
        action: "actions.html?actionId=ACT-001",
        map: "map.html"
      }
    }
  },

  signals_converging: {
    id: "resp-signals-converging",
    queryMatched: "Which signals are converging?",
    title: "Multi-Signal Convergence & Precursor Cluster Analysis",
    context: "Signals & Map",
    aiInterpretation: "The strongest multi-signal convergence is centered on Block A (Trench 4B) with 17 converging indicators, and Power Island (Switchgear 3B) with 15 indicators.",
    evidence: [
      "Block A Cluster: Acoustic ultrasonic leak sensor, soil moisture probe, and operator dampness logs converge in 8.5m zone",
      "Power Island Cluster: Thermal IR bloom, THD harmonic analyzer, and gas chromatography converge in Cabinet SW-3B",
      "Assembly Bay 4: Vibration velocity spikes and thermal casing bloom converge on Conveyor Drive #4",
      "Convergence confidence threshold exceeds 85% across all 6 active clusters"
    ],
    whyItMatters: "Isolated signals often represent normal industrial background noise. When 3 or more independent measurement types converge on the same physical coordinates, true positive probability exceeds 94%.",
    recommendedNextStep: "Review geospatial density on the Interactive Signal Map and inspect precursor cluster CLU-04.",
    confidence: {
      evidenceConfidence: "95% convergence confidence",
      patternCoherence: "92% spatial coherence",
      leadTime: "6 Converging Clusters Active"
    },
    evidenceTrace: [
      { step: "SOURCE SIGNALS", label: "128 Analyzed Signals", link: "signals.html", type: "signals" },
      { step: "RELATED CLUSTER", label: "06 Related Clusters", link: "signals.html", type: "cluster" },
      { step: "PATTERN", label: "Spatial Convergence", link: "map.html", type: "pattern" },
      { step: "EMERGING RISK", label: "04 Emerging Risks", link: "risks.html", type: "risk" },
      { step: "RECOMMENDED ACTION", label: "Targeted Mitigation", link: "actions.html", type: "action" }
    ],
    inspectorData: {
      query: "Which signals are converging?",
      context: "Signals & Map",
      interpretation: "Spatial-temporal clustering across multi-modal sensor and human input modalities.",
      supportingSignals: "128 total signals / 54 active in primary clusters",
      pattern: "Geospatial Convergence & Co-location",
      risk: "Multiple active risks (RSK-001, RSK-002, RSK-003, RSK-004)",
      evidence: "Multi-source sensor correlation",
      action: "Cluster-based field dispatch",
      confidence: "95% Convergence Confidence",
      timeline: "Continuous real-time spatial clustering",
      deepLinks: {
        signals: "signals.html",
        risk: "risks.html",
        evidence: "evidence.html",
        timeline: "timeline.html",
        action: "actions.html",
        map: "map.html"
      }
    }
  },

  timeline_changes: {
    id: "resp-timeline-changes",
    queryMatched: "What changed in the last 7 days?",
    title: "7-Day Operational Evolution & Lifecycle Velocity Delta",
    context: "Timeline & Trends",
    aiInterpretation: "Over the last 7 days, signal velocity in Block A accelerated from 1.2 to 5.1 events/day (+320%), transitioning RSK-001 from Stage 3 (Pattern) to Stage 4 (Early Warning).",
    evidence: [
      "12 Sep: Initial subterranean moisture rise noted on probe SM-4B (34.2% saturation)",
      "14 Sep: Secondary acoustic hissing report submitted during shift handover",
      "16 Sep: Velocity surge detected (+320% frequency increase across 72h)",
      "18 Sep: Early warning synthesized and escalated to Critical P1 (Score 86)",
      "19 Sep: Prescriptive work order ACT-001 dispatched to Facilities Engineering"
    ],
    whyItMatters: "Observing the velocity delta proves this is an active expanding leak rather than residual static moisture.",
    recommendedNextStep: "Open the Progression Timeline to compare this trajectory against historical failure curves.",
    confidence: {
      evidenceConfidence: "88% trend confidence",
      patternCoherence: "94% velocity coherence",
      leadTime: "T-18 to T-0 Lifecycle Tracking"
    },
    evidenceTrace: [
      { step: "SOURCE SIGNALS", label: "Chronological Signals", link: "signals.html", type: "signals" },
      { step: "RELATED CLUSTER", label: "7-Day Window", link: "timeline.html", type: "cluster" },
      { step: "PATTERN", label: "Velocity Acceleration", link: "timeline.html", type: "pattern" },
      { step: "EMERGING RISK", label: "RSK-001 Escalation", link: "risks.html?riskId=RSK-001", type: "risk" },
      { step: "RECOMMENDED ACTION", label: "ACT-001 Turnaround", link: "actions.html?actionId=ACT-001", type: "action" }
    ],
    inspectorData: {
      query: "What changed in the last 7 days?",
      context: "Timeline & Trends",
      interpretation: "Significant acceleration in Block A trench moisture and Switchgear 3B thermal loading.",
      supportingSignals: "Historical telemetry records from Sep 12 through Sep 19",
      pattern: "Exponential velocity surge (+320% over 72 hours)",
      risk: "RSK-001 (Water Infra) and RSK-003 (Switchgear)",
      evidence: "Time-series trend comparison with audited benchmark failures",
      action: "Proactive turnaround intervention before run-to-failure",
      confidence: "88% Trend Confidence",
      timeline: "7-Day Lookback / 14.2 Days Forward Lead Time",
      deepLinks: {
        signals: "signals.html",
        risk: "risks.html?riskId=RSK-001",
        evidence: "evidence.html?riskId=RSK-001",
        timeline: "timeline.html?zone=block-a&case=0",
        action: "actions.html?actionId=ACT-001",
        map: "map.html?zone=block-a"
      }
    }
  },

  default_general: {
    id: "resp-default-general",
    queryMatched: "General Operational Inquiry",
    title: "EarlySight Plant Intelligence Overview",
    context: "All Intelligence",
    aiInterpretation: "EarlySight is actively monitoring 128 multi-modal signals across 6 facility zones. Currently, 4 emerging risks have been synthesized with 19 open operational actions under tracking.",
    evidence: [
      "128 weak signals analyzed across SCADA telemetry, work orders, operator walkdowns, and IoT probes",
      "06 precursor clusters identified with strong spatial and temporal co-location",
      "04 emerging risks flagged before functional failure (2 Critical P1, 2 High P2)",
      "06 verified evidence chains providing transparent causal explainability",
      "19 assigned actions tracked through closed-loop verification pipeline"
    ],
    whyItMatters: "Early intervention avoids catastrophic line halts, preserving plant reliability and eliminating an audited $2.84M in projected downtime loss.",
    recommendedNextStep: "Select a suggested inquiry or ask about a specific asset, risk ID, or facility quad.",
    confidence: {
      evidenceConfidence: "87% platform confidence",
      patternCoherence: "93% overall coherence",
      leadTime: "14.8 Days Average Lead Time"
    },
    evidenceTrace: [
      { step: "SOURCE SIGNALS", label: "128 Signals", link: "signals.html", type: "signals" },
      { step: "RELATED CLUSTER", label: "06 Clusters", link: "signals.html", type: "cluster" },
      { step: "PATTERN", label: "Recurring Patterns", link: "timeline.html", type: "pattern" },
      { step: "EMERGING RISK", label: "04 Risks", link: "risks.html", type: "risk" },
      { step: "RECOMMENDED ACTION", label: "19 Actions", link: "actions.html", type: "action" }
    ],
    inspectorData: {
      query: "General Operational Inquiry",
      context: "All Intelligence",
      interpretation: "Cross-silo synthesis active across all plant zones.",
      supportingSignals: "128 Total Analyzed Signals",
      pattern: "Multi-Zone Operational Synthesis",
      risk: "4 Active Emerging Risks (2 P1, 2 P2)",
      evidence: "6 Causal Evidence Dossiers",
      action: "19 Tracked Actions (6 In Progress, 12 Resolved)",
      confidence: "87% Overall Platform Confidence",
      timeline: "14.8 Days Average Early Warning Lead Time",
      deepLinks: {
        signals: "signals.html",
        risk: "risks.html",
        evidence: "evidence.html",
        timeline: "timeline.html",
        action: "actions.html",
        map: "map.html"
      }
    }
  }
};

/**
 * Deterministic query matcher based on user keywords and selected context
 */
export function matchCopilotQuery(queryText, selectedContext = "All Intelligence") {
  if (!queryText || !queryText.trim()) {
    return MOCK_RESPONSES.default_general;
  }

  const q = queryText.toLowerCase().trim();

  // Keyword Matching Logic according to Section 13
  if (q.includes("block a") || q.includes("water") || q.includes("leak") || q.includes("trench") || q.includes("flange") || q.includes("rsk-001")) {
    return MOCK_RESPONSES.water_block_a;
  }

  if (q.includes("risk") || q.includes("highest") || q.includes("priority") || q.includes("urgent") || q.includes("attention") || q.includes("accelerating")) {
    return MOCK_RESPONSES.risks_priority;
  }

  if (q.includes("evidence") || q.includes("why") || q.includes("flagged") || q.includes("explain") || q.includes("proof") || q.includes("confidence")) {
    return MOCK_RESPONSES.evidence_explain;
  }

  if (q.includes("action") || q.includes("next") || q.includes("do") || q.includes("inspect") || q.includes("prioritize") || q.includes("work order")) {
    return MOCK_RESPONSES.action_prioritized;
  }

  if (q.includes("signal") || q.includes("related") || q.includes("converging") || q.includes("cluster") || q.includes("co-location")) {
    return MOCK_RESPONSES.signals_converging;
  }

  if (q.includes("what changed") || q.includes("yesterday") || q.includes("7 days") || q.includes("timeline") || q.includes("delta") || q.includes("trend")) {
    return MOCK_RESPONSES.timeline_changes;
  }

  // Fallback to context-based matching if available
  if (selectedContext === "Risks") return MOCK_RESPONSES.risks_priority;
  if (selectedContext === "Evidence") return MOCK_RESPONSES.evidence_explain;
  if (selectedContext === "Actions") return MOCK_RESPONSES.action_prioritized;
  if (selectedContext === "Signals") return MOCK_RESPONSES.signals_converging;
  if (selectedContext === "Timeline") return MOCK_RESPONSES.timeline_changes;
  if (selectedContext === "Map") return MOCK_RESPONSES.signals_converging;

  return MOCK_RESPONSES.default_general;
}

// Global browser window bindings
if (typeof window !== 'undefined') {
  window.COPILOT_METRICS = COPILOT_METRICS;
  window.REASONING_STAGES = REASONING_STAGES;
  window.INSIGHT_CARDS = INSIGHT_CARDS;
  window.SUGGESTED_QUERIES = SUGGESTED_QUERIES;
  window.INITIAL_RECENT_ACTIVITY = INITIAL_RECENT_ACTIVITY;
  window.MOCK_RESPONSES = MOCK_RESPONSES;
  window.matchCopilotQuery = matchCopilotQuery;
}
