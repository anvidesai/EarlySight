/**
 * EarlySight — Evidence & Explainability Dataset (Milestone 7)
 * Structured evidence graphs, cross-silo supporting records,
 * and transparent explainability models for early warnings.
 *
 * Core Principle:
 * Confidence communicates the strength and coherence of the available evidence,
 * NOT mathematical certainty or inevitability of failure.
 *
 * Core Story Progression:
 * RAW SIGNALS -> RELATED SIGNALS -> PATTERN -> EMERGING RISK -> EVIDENCE -> CONFIDENCE -> EXPLANATION
 */

export const EVIDENCE_OVERVIEW_KPIS = {
  evidenceItems: 28,
  linkedSignals: 42,
  evidenceChains: 6,
  highConfidence: "87%",
  activeInvestigations: 4,
  mockDisclaimer: "ILLUSTRATIVE / MOCK FRONTEND VALUES FOR OPERATIONAL EXPLAINABILITY"
};

export const EVIDENCE_ALERTS_DATA = [
  {
    id: "EW-2026-088",
    riskId: "RSK-001",
    riskIdAlt: "RSK-01",
    title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
    shortTitle: "Water Infrastructure Issue",
    riskTitle: "Water Infrastructure Degradation",
    subsystem: "Civil & Auxiliary Fluid Infrastructure",
    location: "Block A / Trench 4B",
    locationFull: "Block A — Trench 4B / Assembly Bay 4 / Cleanroom Cell C Boundary",
    facilityQuad: "BLOCK A",
    zoneSlug: "block-a",
    severity: "High",
    priority: "P1",
    priorityLabel: "Immediate",
    riskScore: 86,
    trend: "Increasing",
    trendSymbol: "↑",
    leadTimeDays: 14.2,
    leadTimeCountdown: "14.2 Days Lead",
    projectedLossUSD: "$512,000",
    
    // Core Explainability Metrics (Illustrative / Mock)
    confidence: "87%",
    confidenceScore: 0.87,
    patternCoherence: "91%",
    signalAgreement: "87%",
    temporalConsistency: "89%",
    confidenceExplanation: "This confidence rating of 87% communicates the mathematical strength and coherence of 5 independent operational streams (operator reports, CMMS tickets, spatial proximity, velocity surge, and historical similarity). It represents the strength of available evidence, NOT certainty that a catastrophic rupture has already occurred.",

    // Core Question: "Why was this risk flagged?"
    whyFlagged: {
      headline: "WHY WAS THIS RISK FLAGGED?",
      summary: "This warning was generated because 5 independent, historically disconnected operational indicators converged in the exact same 8.5-meter sub-slab utility corridor in Block A with an exponential acceleration (+340% frequency surge over 72 hours).",
      causalNarrative: "Standard SCADA alarms remained silent because no individual sensor exceeded legacy single-point trip limits. However, EarlySight cross-correlated 8 operator complaint logs (acoustic hiss, localized floor dampness) with 3 separate maintenance inspection tickets (gasket wear, condensation notes), pinpointing an active micro-leak on flange 4B-12. The temporal velocity and spatial co-location match past unmitigated trench flooding signatures with 94.2% similarity.",
      
      // 5 Compact Evidence Pillars
      pillars: [
        {
          num: "01",
          name: "Frequency Increase",
          title: "Frequency Surge (+340%)",
          desc: "Repeated leakage-related signals increased over the observation period from 0.04 to 3.40 signals/day. Recurrence interval collapsed from 168 hours down to 6.2 hours.",
          badge: "Velocity Surge",
          type: "observed"
        },
        {
          num: "02",
          name: "Spatial Co-location",
          title: "Spatial Clustering (8.5m)",
          desc: "Multiple related signals originated from the exact same sub-slab infrastructure corridor along Trench 4B near Assembly Bay 4 and Cleanroom Cell C boundary.",
          badge: "Spatial Convergence",
          type: "observed"
        },
        {
          num: "03",
          name: "Signal Convergence",
          title: "Multi-Source Alignment",
          desc: "Complaints (8 logs), maintenance reports (3 work orders), soil probe (SM-4B at 68.4%), and acoustic transducer (AC-14 at 4.2 kHz) all point toward the same underlying anomaly.",
          badge: "Cross-Silo Evidence",
          type: "observed"
        },
        {
          num: "04",
          name: "Temporal Persistence",
          title: "Persistent Progression",
          desc: "The issue continued across multiple consecutive days and 3 operational shift rotations instead of appearing as a transient isolated spike.",
          badge: "4-Day Recurrence",
          type: "observed"
        },
        {
          num: "05",
          name: "Severity Escalation",
          title: "Impact Escalation (68 → 86)",
          desc: "Signal severity increased from subtle acoustic resonance to active floor weeping, sub-slab saturation, and P1 operational hazard.",
          badge: "Score Escalation",
          type: "observed"
        }
      ],

      // Distinction between Observed Evidence and AI Interpretation
      observedEvidenceFacts: [
        "8 operator logs filed across Shifts A, B, and C noting hissing sounds and dampness near Bay 4.",
        "3 CMMS tickets (WO-7812, WO-7540, WO-7201) recording flange stud rust and 18L trench sump runoff.",
        "Soil probe SM-4B telemetry measuring 68.4% volumetric water content (+44% over dry baseline).",
        "Acoustic transducer AC-14 recording continuous 4.2 kHz ultrasonic hiss localized at pipe sleeve."
      ],

      aiInterpretationHypothesis: [
        "Probabilistic Failure Mechanism: EPDM elastomer gasket embrittlement combined with transient booster pump P-102 hydraulic shock.",
        "Cosine Pattern Match: 94.2% mathematical similarity to Nov 2024 unmitigated trench blowout incident ($1.42M loss).",
        "Forecasted Lead Time: 14.2 days remaining before floor inundation reaches CNC Mill 12 raceway.",
        "Prescriptive Action: Ultrasonic pinpointing on joint 4B-12 during shift break and Viton seal replacement."
      ],

      disclaimer: "CRITICAL DISTINCTION: Observed evidence comprises verified physical logs and sensor telemetry. AI interpretations represent probabilistic pattern correlations derived from multi-signal clustering, NOT confirmed physical facts or operational certainties."
    },

    // Visual Evidence Chain
    evidenceChain: [
      {
        step: "01",
        stage: "SIGNALS",
        label: "14 Related Signals",
        detail: "8 operator complaint logs, 3 maintenance tickets, 2 acoustic spikes, 1 soil probe saturation",
        icon: "📡",
        badge: "Raw Signals",
        color: "#1B4332"
      },
      {
        step: "02",
        stage: "CORRELATED GROUP",
        label: "Precursor Cluster (CLU-01)",
        detail: "Sub-slab pressurized conduit seepage cluster localized within 8.5m radius along Trench 4B",
        icon: "🔗",
        badge: "Co-Location",
        color: "#4D7C5D"
      },
      {
        step: "03",
        stage: "PATTERN",
        label: "Pattern (PAT-006)",
        detail: "Recurring water infrastructure degradation pattern with 91.4% signature coherence",
        icon: "⚡",
        badge: "Pattern Identified",
        color: "#C27803"
      },
      {
        step: "04",
        stage: "RISK",
        label: "Emerging Risk (RSK-001)",
        detail: "Water Infrastructure Degradation • Score: 86 / 100 • Priority P1 Immediate",
        icon: "⚠️",
        badge: "Risk Active",
        color: "#C85A32"
      },
      {
        step: "05",
        stage: "RECOMMENDED ACTION",
        label: "Targeted Inspection",
        detail: "Deploy ultrasonic acoustic leak pinpointing on joint 4B-12 & replace seal with Viton gasket",
        icon: "🛠️",
        badge: "Prescriptive Action",
        color: "#1B4332"
      }
    ],

    // Evidence Graph Nodes & Links
    evidenceGraph: {
      nodes: [
        { id: "EVD-014", label: "EVD-014", title: "Maintenance Report", type: "evidence", source: "CMMS WO-7812", status: "High", color: "#D97706" },
        { id: "EVD-021", label: "EVD-021", title: "Operator Complaint", type: "evidence", source: "Shift B Log", status: "High", color: "#C85A32" },
        { id: "EVD-033", label: "EVD-033", title: "Soil Moisture Probe", type: "evidence", source: "Sensor SM-4B", status: "Critical", color: "#A43A2A" },
        { id: "EVD-042", label: "EVD-042", title: "Inspection Image", type: "evidence", source: "Borescope NDT", status: "High", color: "#4D7C5D" },
        { id: "SIG-031", label: "SIG-031", title: "Leakage Signal", type: "signal", source: "Acoustic Hiss", status: "High", color: "#1B4332" },
        { id: "SIG-044", label: "SIG-044", title: "Moisture Saturation", type: "signal", source: "68.4% Telemetry", status: "High", color: "#1B4332" },
        { id: "PAT-006", label: "PAT-006", title: "Water Infra Pattern", type: "pattern", source: "91.4% Coherence", status: "Pattern", color: "#C27803" },
        { id: "RSK-001", label: "RSK-001", title: "Water Degradation", type: "risk", source: "Score: 86 / P1", status: "Risk", color: "#C85A32" }
      ],
      links: [
        { from: "EVD-014", to: "SIG-031", label: "Corroborates" },
        { from: "EVD-021", to: "SIG-031", label: "Reports" },
        { from: "EVD-033", to: "SIG-044", label: "Measures" },
        { from: "EVD-042", to: "SIG-031", label: "Visualizes" },
        { from: "SIG-031", to: "PAT-006", label: "Forms" },
        { from: "SIG-044", to: "PAT-006", label: "Strengthens" },
        { from: "PAT-006", to: "RSK-001", label: "Synthesizes" }
      ]
    },

    // Causal Pillars (Why this matters)
    causalPillars: {
      title: "WHY THIS MATTERS",
      subtitle: "Four operational dimensions synthesized into the 86/100 risk score:",
      pillars: [
        {
          key: "FREQUENCY",
          label: "FREQUENCY",
          summary: "Repeated Occurrences",
          detail: "Signal velocity accelerated from 0.04 to 3.40 signals/day over 72 hours (+340% surge).",
          impact: "+28% Score Impact",
          color: "#C85A32"
        },
        {
          key: "LOCATION",
          label: "LOCATION",
          summary: "Spatial Concentration",
          detail: "All 17 precursors originated within an 8.5m radius along Trench 4B sub-slab corridor.",
          impact: "+24% Score Impact",
          color: "#4D7C5D"
        },
        {
          key: "TIME",
          label: "TIME",
          summary: "Persistent Progression",
          detail: "Recurring signals persisted over 4+ days across 3 distinct operator shifts.",
          impact: "+22% Score Impact",
          color: "#C27803"
        },
        {
          key: "SEVERITY",
          label: "SEVERITY",
          summary: "Increasing Impact",
          detail: "Initial micro-hissing escalated into active soil saturation and cleanroom boundary hazard.",
          impact: "+26% Score Impact",
          color: "#A43A2A"
        }
      ]
    },

    // Evidence Progression Timeline
    evidenceTimeline: [
      { day: "Day 1", time: "08:42", label: "Initial Complaint", type: "complaint", desc: "Operator M. Kovacs logged subtle acoustic hiss near Assembly Bay 4 during idle cycle.", badge: "DETECTED", color: "#4D7C5D" },
      { day: "Day 2", time: "14:15", label: "Maintenance Report", type: "maintenance", desc: "Facilities ticket WO-7540 logged 18L unmetered sump runoff accumulation in Trench 4B.", badge: "FORMING", color: "#C27803" },
      { day: "Day 3", time: "09:20", label: "Repeated Signal Detected", type: "sensor", desc: "Soil probe SM-4B measured 68.4% volumetric moisture; arrival frequency surged +340%.", badge: "FORMING", color: "#D97706" },
      { day: "Day 4", time: "11:05", label: "Pattern Formed", type: "pattern", desc: "Pattern PAT-006 confirmed across 7 multi-modal signals with 78% mathematical confidence.", badge: "EMERGING", color: "#C85A32" },
      { day: "Day 5", time: "16:30", label: "Risk Generated", type: "risk", desc: "EarlySight synthesized Risk RSK-001 (Score: 86, P1 Immediate Priority) with 14.2 days lead time.", badge: "ACTIVE", color: "#A43A2A" },
      { day: "Day 6", time: "10:15", label: "Inspection Evidence Added", type: "image", desc: "Borescope NDT and FLIR thermal capture confirmed stud rust blooming on flange 4B-12.", badge: "ACTIVE", color: "#A43A2A" },
      { day: "Day 8", time: "13:40", label: "Risk Begins De-escalating", type: "action", desc: "Targeted gasket swap executed on flange 4B-12; risk score dropped from 86 to 41.", badge: "DE-ESCALATING", color: "#4D7C5D" },
      { day: "Day 10", time: "15:20", label: "Risk Fully Resolved", type: "resolution", desc: "Moisture probe normalized to 24% baseline; $512,000 verified loss averted with 0h downtime.", badge: "RESOLVED", color: "#2D6A4F" }
    ]
  },

  {
    id: "EW-2026-094",
    riskId: "RSK-002",
    riskIdAlt: "RSK-02",
    title: "Hydraulic Proportional Valve Cavitation Drift",
    shortTitle: "Valve Cavitation Drift",
    riskTitle: "Hydraulic Cavitation Drift",
    subsystem: "Hydraulic Fluid Power",
    location: "Block C / Press Station #2",
    locationFull: "Block C — Press Station #2 / Valve Block VB-4",
    facilityQuad: "BLOCK C",
    zoneSlug: "block-c",
    severity: "High",
    priority: "P2",
    priorityLabel: "High",
    riskScore: 78,
    trend: "Increasing",
    trendSymbol: "↑",
    leadTimeDays: 12.0,
    leadTimeCountdown: "12.0 Days Lead",
    projectedLossUSD: "$340,000",
    confidence: "91.2%",
    confidenceScore: 0.912,
    patternCoherence: "94%",
    signalAgreement: "89%",
    temporalConsistency: "91%",
    confidenceExplanation: "This confidence rating of 91.2% reflects the strong convergence of spool lag feedback, ultrasonic cavitation emissions, and laser thickness quality ripples. It represents the strength of available multi-sensor evidence, NOT certainty that the spool has completely seized.",
    whyFlagged: {
      headline: "WHY WAS THIS RISK FLAGGED?",
      summary: "This warning was generated because high-frequency acoustic emissions (>40 kHz) at valve PV-02 directly phase-matched a 14ms spool feedback lag and periodic micro-ripples on extruded billet thickness.",
      causalNarrative: "Negative suction head transients during rapid accumulator recharge entrained air micro-bubbles into the hydraulic reservoir. Under 210 bar line pressure, micro-bubbles collapsed violently against valve metering edges, pitting the hardened steel and causing spool stick-slip.",
      pillars: [
        { num: "01", name: "Frequency Increase", title: "Emission Velocity Surge", desc: "Ultrasonic cavitation burst frequency doubled from 22 kHz to 48 kHz over 5 consecutive operating days.", badge: "Acoustic Surge", type: "observed" },
        { num: "02", name: "Spatial Co-location", title: "Manifold Gallery VB-4", desc: "All 12 signals localized directly to Press Station #2 hydraulic manifold gallery VB-4 within 4.2 meters.", badge: "Spatial Focus", type: "observed" },
        { num: "03", name: "Signal Convergence", title: "LVDT & Acoustic Correlation", desc: "Valve spool position hysteresis (14ms lag) phase-matched ultrasonic acoustic spikes ($r = 0.88$).", badge: "Cross-Domain", type: "observed" },
        { num: "04", name: "Temporal Persistence", title: "5-Day Drift Signature", desc: "Spool stick-slip persisted across every rapid decompression cycle over 5 consecutive production days.", badge: "Persistent Drift", type: "observed" },
        { num: "05", name: "Severity Escalation", title: "Score Escalation (58 → 78)", desc: "Elevated hydraulic coil temperatures (+14°C) indicated coil overdrive to overcome mechanical drag.", badge: "Thermal Stress", type: "observed" }
      ],
      observedEvidenceFacts: [
        "LVDT sensor measuring 14ms spool response lag during rapid stroke (nominal: 3ms).",
        "Ultrasonic sensor capturing 48 kHz acoustic implosion bursts at valve cartridge PV-02.",
        "Laser thickness gauge recording cyclical 0.12mm surface ripples on extruded billet batch B-442.",
        "Lube technician logged 5% oil sight-glass foaming during reservoir inspection."
      ],
      aiInterpretationHypothesis: [
        "Probabilistic Failure Mechanism: Reservoir micro-vortexing entraining air into suction line under rapid recharge.",
        "Cosine Pattern Match: 91.8% similarity to March 2025 Press #1 catastrophic valve blowout.",
        "Forecasted Lead Time: 12.0 days before complete spool seizure and blown manifold seals.",
        "Prescriptive Action: Replace valve cartridge PV-02, de-aerate fluid, and replenish anti-foaming chemistry."
      ],
      disclaimer: "CRITICAL DISTINCTION: Observed evidence comprises verified physical logs and sensor telemetry. AI interpretations represent probabilistic pattern correlations derived from multi-signal clustering, NOT confirmed physical facts."
    },
    evidenceChain: [
      { step: "01", stage: "SIGNALS", label: "12 Related Signals", detail: "5 operator complaints, 4 maintenance tickets, 3 ultrasonic acoustic spikes", icon: "📡", badge: "Raw Signals", color: "#1B4332" },
      { step: "02", stage: "CORRELATED GROUP", label: "Precursor Cluster (CLU-02)", detail: "Hydraulic Cavitation Drift cluster localized to Press Station #2", icon: "🔗", badge: "Co-Location", color: "#4D7C5D" },
      { step: "03", stage: "PATTERN", label: "Pattern (PAT-002)", detail: "Proportional Valve Spool Stick-Slip Pattern (94% coherence)", icon: "⚡", badge: "Pattern Identified", color: "#C27803" },
      { step: "04", stage: "RISK", label: "Emerging Risk (RSK-002)", detail: "Hydraulic Cavitation Drift • Score: 78 / 100 • Priority P2 High", icon: "⚠️", badge: "Risk Active", color: "#C85A32" },
      { step: "05", stage: "RECOMMENDED ACTION", label: "Cartridge Swap", detail: "Execute WO-2026-8902: Swap valve cartridge PV-02 and replenish fluid", icon: "🛠️", badge: "Prescriptive Action", color: "#1B4332" }
    ],
    evidenceGraph: {
      nodes: [
        { id: "EVD-101", label: "EVD-101", title: "LVDT Spool Sensor", type: "evidence", source: "14ms Lag", status: "High", color: "#D97706" },
        { id: "EVD-102", label: "EVD-102", title: "Operator Complaint", type: "evidence", source: "Press Tech", status: "High", color: "#C85A32" },
        { id: "EVD-103", label: "EVD-103", title: "Ultrasonic Acoustic", type: "evidence", source: "48 kHz Burst", status: "Critical", color: "#A43A2A" },
        { id: "EVD-104", label: "EVD-104", title: "Laser Gauge", type: "evidence", source: "Billet Ripple", status: "High", color: "#4D7C5D" },
        { id: "SIG-012", label: "SIG-012", title: "Spool Hesitation", type: "signal", source: "Feedback Lag", status: "High", color: "#1B4332" },
        { id: "SIG-018", label: "SIG-018", title: "Cavitation Emission", type: "signal", source: "48 kHz Telemetry", status: "High", color: "#1B4332" },
        { id: "PAT-002", label: "PAT-002", title: "Cavitation Pattern", type: "pattern", source: "94% Coherence", status: "Pattern", color: "#C27803" },
        { id: "RSK-002", label: "RSK-002", title: "Hydraulic Cavitation", type: "risk", source: "Score: 78 / P2", status: "Risk", color: "#C85A32" }
      ],
      links: [
        { from: "EVD-101", to: "SIG-012", label: "Measures" },
        { from: "EVD-102", to: "SIG-012", label: "Reports" },
        { from: "EVD-103", to: "SIG-018", label: "Detects" },
        { from: "EVD-104", to: "SIG-018", label: "Corroborates" },
        { from: "SIG-012", to: "PAT-002", label: "Forms" },
        { from: "SIG-018", to: "PAT-002", label: "Strengthens" },
        { from: "PAT-002", to: "RSK-002", label: "Synthesizes" }
      ]
    },
    causalPillars: {
      title: "WHY THIS MATTERS",
      subtitle: "Four operational dimensions synthesized into the 78/100 risk score:",
      pillars: [
        { key: "FREQUENCY", label: "FREQUENCY", summary: "Burst Rate Doubled", detail: "Acoustic cavitation spikes doubled from 22 kHz to 48 kHz over 5 days.", impact: "+26% Score Impact", color: "#C85A32" },
        { key: "LOCATION", label: "LOCATION", summary: "Manifold Gallery VB-4", detail: "All indicators isolated to Press 2 hydraulic valve block within 4.2m radius.", impact: "+22% Score Impact", color: "#4D7C5D" },
        { key: "TIME", label: "TIME", summary: "Persistent Drift", detail: "Spool hesitation observed consistently over 5 consecutive operating shifts.", impact: "+24% Score Impact", color: "#C27803" },
        { key: "SEVERITY", label: "SEVERITY", summary: "Thermal Overdrive", detail: "Valve coil temperature rose +14°C to overcome mechanical friction.", impact: "+28% Score Impact", color: "#A43A2A" }
      ]
    },
    evidenceTimeline: [
      { day: "Day 1", time: "09:10", label: "Initial Operator Note", type: "complaint", desc: "Press operator noted spongy response and cylinder lag on ram stroke 2.", badge: "DETECTED", color: "#4D7C5D" },
      { day: "Day 2", time: "14:20", label: "Foam in Sight Glass", type: "maintenance", desc: "Lube tech logged 5% oil surface foam in reservoir sight glass.", badge: "FORMING", color: "#C27803" },
      { day: "Day 3", time: "11:35", label: "Ultrasonic Emission Surge", type: "sensor", desc: "Acoustic transducer logged 48 kHz high-frequency cavitation bursts.", badge: "FORMING", color: "#D97706" },
      { day: "Day 4", time: "16:00", label: "Quality Ripple Detected", type: "sensor", desc: "Laser thickness gauge flagged micro-ripples on aluminum billet runout.", badge: "EMERGING", color: "#C85A32" },
      { day: "Day 5", time: "18:40", label: "Risk Generated", type: "risk", desc: "EarlySight synthesized Risk RSK-002 (Score: 78, Priority P2 High).", badge: "ACTIVE", color: "#A43A2A" },
      { day: "Day 7", time: "11:15", label: "Action Initiated", type: "action", desc: "Valve cartridge swap scheduled and fluid de-aeration begun.", badge: "DE-ESCALATING", color: "#4D7C5D" },
      { day: "Day 9", time: "14:30", label: "Risk Mitigated", type: "resolution", desc: "Cartridge replaced; spool lag normalized to 3ms; $340,000 loss averted.", badge: "RESOLVED", color: "#2D6A4F" }
    ]
  },

  {
    id: "EW-2026-105",
    riskId: "RSK-003",
    riskIdAlt: "RSK-03",
    title: "Switchgear Busbar 3B Thermal Plume & Harmonic Resonance",
    shortTitle: "Thermal Overload & Resonance",
    riskTitle: "Thermal Overload & Harmonic Distortion",
    subsystem: "Electrical Distribution / 13.8 kV Grid",
    location: "Power Island / Generator Hall",
    locationFull: "Power Island — Switchgear Busbar 3B / Generator Hall Substation 2",
    facilityQuad: "POWER ISLAND",
    zoneSlug: "power-island",
    severity: "Critical",
    priority: "P1",
    priorityLabel: "Immediate",
    riskScore: 88,
    trend: "Increasing",
    trendSymbol: "↑",
    leadTimeDays: 9.0,
    leadTimeCountdown: "9.0 Days Lead",
    projectedLossUSD: "$1,850,000",
    confidence: "94.0%",
    confidenceScore: 0.94,
    patternCoherence: "96%",
    signalAgreement: "93%",
    temporalConsistency: "95%",
    confidenceExplanation: "This confidence rating of 94.0% reflects the correlation of power meter harmonics, IR thermal camera telemetry, and transformer oil gas analysis. It represents multi-modal evidence strength, NOT certainty of an immediate arc flash.",
    whyFlagged: {
      headline: "WHY WAS THIS RISK FLAGGED?",
      summary: "This warning was generated because 13.8 kV Busbar 3B joint exhibited a +6.1°C thermal plume directly correlating with 4.8% THD Phase B harmonic resonance and DGA acetylene gas generation.",
      causalNarrative: "High non-linear variable frequency drive loading on Mill #4 induced 5th and 7th harmonic circulating currents through switchgear Bus 3B. The harmonic skin effect concentrated thermal dissipation into bolt joint 3B-4, inducing micro-arcing and contact resistance creep.",
      pillars: [
        { num: "01", name: "Frequency Increase", title: "Thermal Rise Acceleration", desc: "Joint temperature rose from +1.8°C to +6.1°C above ambient baseline over 6 days under steady load.", badge: "Thermal Escalation", type: "observed" },
        { num: "02", name: "Spatial Co-location", title: "Power Island Bus 3B", desc: "All 15 electrical indicators originate inside Switchgear Cabinet SW-3B in Generator Hall.", badge: "Spatial Focus", type: "observed" },
        { num: "03", name: "Signal Convergence", title: "Power Quality & IR Convergence", desc: "Power quality harmonics (4.8% THD) align exactly with FLIR infrared hot-spot coordinates.", badge: "Cross-Silo", type: "observed" },
        { num: "04", name: "Temporal Persistence", title: "Steady-State Heating", desc: "Thermal delta persisted across both peak production and idle weekend holding cycles.", badge: "Persistent Plume", type: "observed" },
        { num: "05", name: "Severity Escalation", title: "Score Escalation (70 → 88)", desc: "Acetylene DGA gas detection indicated micro-arcing inside enclosed bus duct.", badge: "Arc Flash Risk", type: "observed" }
      ],
      observedEvidenceFacts: [
        "FLIR A310 radiometric camera logging +6.1°C thermal plume on Busbar 3B bolt joint.",
        "Fluke 1775 Power Quality Analyzer recording 4.8% Total Harmonic Distortion (THD) on Phase B.",
        "DGA transformer oil gas analysis detecting 8 ppm dissolved acetylene ($C_2H_2$) gas.",
        "Electrician inspection log noting faint ozone smell and audible 120 Hz corona hum."
      ],
      aiInterpretationHypothesis: [
        "Probabilistic Failure Mechanism: Harmonic skin effect causing localized joint overheating and insulation carbonization.",
        "Cosine Pattern Match: 95.4% match to 2023 Substation #1 switchgear busbar arc flash catastrophe.",
        "Forecasted Lead Time: 9.0 days before catastrophic three-phase busbar arc flash and plant-wide blackout.",
        "Prescriptive Action: Re-torque bus joint bolts to 75 Nm, apply thermal torque paste, and enable harmonic filter HF-02."
      ],
      disclaimer: "CRITICAL DISTINCTION: Observed evidence comprises verified physical logs and sensor telemetry. AI interpretations represent probabilistic pattern correlations derived from multi-signal clustering, NOT confirmed physical facts."
    },
    evidenceChain: [
      { step: "01", stage: "SIGNALS", label: "15 Related Signals", detail: "6 power meter logs, 4 infrared alerts, 3 DGA gas reports, 2 technician logs", icon: "📡", badge: "Raw Signals", color: "#1B4332" },
      { step: "02", stage: "CORRELATED GROUP", label: "Precursor Cluster (CLU-03)", detail: "Busbar 3B Thermal Overload cluster in Generator Hall Substation 2", icon: "🔗", badge: "Co-Location", color: "#4D7C5D" },
      { step: "03", stage: "PATTERN", label: "Pattern (PAT-003)", detail: "Harmonic Overload & Thermal Plume Pattern (96% coherence)", icon: "⚡", badge: "Pattern Identified", color: "#C27803" },
      { step: "04", stage: "RISK", label: "Emerging Risk (RSK-003)", detail: "Thermal Overload & Harmonics • Score: 88 / 100 • Priority P1 Immediate", icon: "⚠️", badge: "Risk Active", color: "#A43A2A" },
      { step: "05", stage: "RECOMMENDED ACTION", label: "Torque & Filter", detail: "Re-torque bus joint bolts to 75 Nm and engage harmonic active filter HF-02", icon: "🛠️", badge: "Prescriptive Action", color: "#1B4332" }
    ],
    evidenceGraph: {
      nodes: [
        { id: "EVD-201", label: "EVD-201", title: "IR Thermal Camera", type: "evidence", source: "+6.1°C Plume", status: "Critical", color: "#A43A2A" },
        { id: "EVD-202", label: "EVD-202", title: "Power Meter THD", type: "evidence", source: "4.8% Harmonics", status: "Critical", color: "#C85A32" },
        { id: "EVD-203", label: "EVD-203", title: "DGA Oil Gas Lab", type: "evidence", source: "8 ppm C2H2", status: "Critical", color: "#D97706" },
        { id: "EVD-204", label: "EVD-204", title: "Electrician Log", type: "evidence", source: "Ozone Smell", status: "High", color: "#4D7C5D" },
        { id: "SIG-022", label: "SIG-022", title: "Harmonic Distortion", type: "signal", source: "Phase B 5th/7th", status: "Critical", color: "#1B4332" },
        { id: "SIG-029", label: "SIG-029", title: "Thermal Hotspot", type: "signal", source: "+6.1°C Telemetry", status: "Critical", color: "#1B4332" },
        { id: "PAT-003", label: "PAT-003", title: "Harmonic Thermal", type: "pattern", source: "96% Coherence", status: "Pattern", color: "#C27803" },
        { id: "RSK-003", label: "RSK-003", title: "Busbar Overload", type: "risk", source: "Score: 88 / P1", status: "Risk", color: "#A43A2A" }
      ],
      links: [
        { from: "EVD-201", to: "SIG-029", label: "Measures" },
        { from: "EVD-202", to: "SIG-022", label: "Analyzes" },
        { from: "EVD-203", to: "SIG-029", label: "Confirms" },
        { from: "EVD-204", to: "SIG-022", label: "Notes" },
        { from: "SIG-022", to: "PAT-003", label: "Forms" },
        { from: "SIG-029", to: "PAT-003", label: "Strengthens" },
        { from: "PAT-003", to: "RSK-003", label: "Synthesizes" }
      ]
    },
    causalPillars: {
      title: "WHY THIS MATTERS",
      subtitle: "Four operational dimensions synthesized into the 88/100 risk score:",
      pillars: [
        { key: "FREQUENCY", label: "FREQUENCY", summary: "Rapid Thermal Creep", detail: "Joint thermal delta climbed from +1.8°C to +6.1°C over 6 days.", impact: "+28% Score Impact", color: "#A43A2A" },
        { key: "LOCATION", label: "LOCATION", summary: "Power Island SW-3B", detail: "All 15 precursors pinpoint Switchgear 3B enclosed bus compartment.", impact: "+24% Score Impact", color: "#4D7C5D" },
        { key: "TIME", label: "TIME", summary: "Steady-State Plume", detail: "Heating signature persisted across continuous 24/7 power telemetry.", impact: "+22% Score Impact", color: "#C27803" },
        { key: "SEVERITY", label: "SEVERITY", summary: "Arc Flash Risk", detail: "Acetylene generation indicated severe contact micro-arcing hazard.", impact: "+26% Score Impact", color: "#C85A32" }
      ]
    },
    evidenceTimeline: [
      { day: "Day 1", time: "07:30", label: "Electrician Routine Log", type: "complaint", desc: "Shift electrician logged faint ozone odor and corona hum in Substation 2.", badge: "DETECTED", color: "#4D7C5D" },
      { day: "Day 2", time: "13:45", label: "Power Meter THD Surge", type: "sensor", desc: "Fluke 1775 recorded Phase B 5th harmonic distortion climbing to 4.8%.", badge: "FORMING", color: "#C27803" },
      { day: "Day 3", time: "16:20", label: "IR Camera Thermal Plume", type: "image", desc: "FLIR A310 radiometric camera detected +6.1°C thermal plume on bus joint 3B-4.", badge: "EMERGING", color: "#D97706" },
      { day: "Day 4", time: "10:15", label: "DGA Gas Analysis Alert", type: "maintenance", desc: "Lab analysis identified 8 ppm dissolved acetylene ($C_2H_2$) gas.", badge: "EMERGING", color: "#C85A32" },
      { day: "Day 5", time: "17:00", label: "Risk Escalation (Score 88)", type: "risk", desc: "EarlySight escalated Risk RSK-003 to Critical 88 / P1 Immediate.", badge: "ACTIVE", color: "#A43A2A" },
      { day: "Day 6", time: "09:30", label: "Emergency Interlocking Action", type: "action", desc: "Active harmonic filter HF-02 engaged; load shedding initiated on Mill #4.", badge: "DE-ESCALATING", color: "#4D7C5D" },
      { day: "Day 8", time: "14:00", label: "Risk Mitigated", type: "resolution", desc: "Busbar re-torqued and paste applied; thermal delta dropped to +0.8°C; $1.85M loss averted.", badge: "RESOLVED", color: "#2D6A4F" }
    ]
  }
];

// Comprehensive Source Evidence Registry (for Filtered Cards & Inspector Drawer)
export const SOURCE_EVIDENCE_REGISTRY = [
  // --- Block A Source Evidence (Water Infrastructure Degradation) ---
  {
    id: "EVD-014",
    title: "Maintenance Work Order — Trench 4B Moisture Investigation",
    sourceType: "Maintenance Report",
    sourceCategory: "maintenance",
    sourceSystem: "SAP PM / Work Order #WO-2026-7812",
    timestamp: "18 Sep 2026 — 10:42",
    dateRelative: "T-18d",
    location: "Block A / Trench 4B",
    zoneSlug: "block-a",
    facilityQuad: "BLOCK A",
    description: "Repeated moisture accumulation reported near service trench conduit 4B. Minor stud rust blooming observed on lower flange studs.",
    severity: "Medium",
    relevance: "High",
    confidence: "88%",
    linkedSignalsCount: 4,
    linkedSignals: ["SIG-031", "SIG-WTR-01", "SIG-01", "SIG-02"],
    linkedRiskId: "RSK-001",
    linkedRiskName: "Water Infrastructure Degradation",
    linkedPattern: "PAT-006 (Recurring Water Infrastructure Anomaly)",
    whyItMatters: "Independent technician verification confirmed standing water accumulation beneath conduit grating, validating operator complaints.",
    authorOrTech: "G. Ramirez (Mechanical Specialist)",
    status: "Closed (Partial)",
    evidenceTimelineSummary: "Filed Day 2 after initial operator report; confirmed recurring seepage on Day 3."
  },
  {
    id: "EVD-021",
    title: "Operator Shift Complaint — Audible Hiss & Floor Moisture",
    sourceType: "Complaint",
    sourceCategory: "complaint",
    sourceSystem: "Shift Operations Log (Shift B)",
    timestamp: "17 Sep 2026 — 14:15",
    dateRelative: "T-19d",
    location: "Block A / Assembly Bay 4",
    zoneSlug: "block-a",
    facilityQuad: "BLOCK A",
    description: "Operator noted persistent high-pitch hiss near Assembly Bay 4 feed conduit during idle cycle. Water puddle cleaned under conduit raceway.",
    severity: "Medium",
    relevance: "High",
    confidence: "85%",
    linkedSignalsCount: 3,
    linkedSignals: ["SIG-031", "SIG-WTR-01", "SIG-01"],
    linkedRiskId: "RSK-001",
    linkedRiskName: "Water Infrastructure Degradation",
    linkedPattern: "PAT-006 (Recurring Water Infrastructure Anomaly)",
    whyItMatters: "First acoustic indicator filed by frontline operators, correlating directly with subsequent soil moisture telemetry.",
    authorOrTech: "J. Chen (Shift B Senior Operator)",
    status: "Verified",
    evidenceTimelineSummary: "Filed Day 1 as an unclassified ambient noise; escalated when moisture reappeared on Day 2."
  },
  {
    id: "EVD-033",
    title: "Subsurface Soil Moisture Sensor Telemetry",
    sourceType: "Sensor Reading",
    sourceCategory: "sensor",
    sourceSystem: "Sub-Slab SCADA Telemetry (Probe SM-4B)",
    timestamp: "18 Sep 2026 — 08:30",
    dateRelative: "T-18d",
    location: "Block A / Trench 4B",
    zoneSlug: "block-a",
    facilityQuad: "BLOCK A",
    description: "Volumetric soil moisture probe SM-4B reached 68.4% volumetric water content (+44% over baseline), confirming sub-slab pooling.",
    severity: "High",
    relevance: "High",
    confidence: "94%",
    linkedSignalsCount: 5,
    linkedSignals: ["SIG-044", "SIG-031", "SIG-WTR-01", "SIG-01", "SIG-02"],
    linkedRiskId: "RSK-001",
    linkedRiskName: "Water Infrastructure Degradation",
    linkedPattern: "PAT-006 (Recurring Water Infrastructure Anomaly)",
    whyItMatters: "Quantitative confirmation that water is actively pooling beneath the foundation slab rather than being surface condensation.",
    authorOrTech: "Automated Sub-Slab Telemetry Engine",
    status: "Active Telemetry",
    evidenceTimelineSummary: "Continuously logged on Day 3; demonstrated exponential saturation curve."
  },
  {
    id: "EVD-042",
    title: "NDT Predictive Inspection — Borescope & Thermography",
    sourceType: "Inspection Image",
    sourceCategory: "image",
    sourceSystem: "FLIR Thermography & Olympus Borescope Archive",
    timestamp: "19 Sep 2026 — 11:20",
    dateRelative: "T-17d",
    location: "Block A / Trench 4B Joint 12",
    zoneSlug: "block-a",
    facilityQuad: "BLOCK A",
    description: "Borescope imaging and thermal scan confirmed moisture weeping at lower flange gasket 4B-12 with early stud rust blooming.",
    severity: "High",
    relevance: "High",
    confidence: "92%",
    linkedSignalsCount: 4,
    linkedSignals: ["SIG-031", "SIG-044", "SIG-WTR-01", "SIG-02"],
    linkedRiskId: "RSK-001",
    linkedRiskName: "Water Infrastructure Degradation",
    linkedPattern: "PAT-006 (Recurring Water Infrastructure Anomaly)",
    whyItMatters: "Definitive visual evidence establishing the exact physical component failure point on flange 4B-12.",
    authorOrTech: "D. Becker (NDT Level II Specialist)",
    status: "Visual Confirmed",
    evidenceTimelineSummary: "Captured on Day 6 following automated EarlySight inspection recommendation."
  },
  {
    id: "EVD-009",
    title: "EHS Safety Incident Log — Slip Hazard Caution Tape",
    sourceType: "Incident Report",
    sourceCategory: "incident",
    sourceSystem: "Cority EHS Incident Tracker #SAF-441",
    timestamp: "16 Sep 2026 — 09:40",
    dateRelative: "T-20d",
    location: "Block A / Cleanroom Cell C Boundary",
    zoneSlug: "block-a",
    facilityQuad: "BLOCK A",
    description: "Slip hazard caution tape deployed along pedestrian walkway between Bay 4 and Cell C due to recurring floor weeping.",
    severity: "Low",
    relevance: "Medium",
    confidence: "79%",
    linkedSignalsCount: 2,
    linkedSignals: ["SIG-01", "SIG-WTR-01"],
    linkedRiskId: "RSK-001",
    linkedRiskName: "Water Infrastructure Degradation",
    linkedPattern: "PAT-006 (Recurring Water Infrastructure Anomaly)",
    whyItMatters: "Safety incident log confirms floor dampness had migrated out of the utility trench into active personnel circulation zones.",
    authorOrTech: "T. Morales (EHS Safety Officer)",
    status: "EHS Open",
    evidenceTimelineSummary: "Logged Day 1 as an ergonomic/slip precaution; linked to infrastructure leak on Day 4."
  },
  {
    id: "EVD-050",
    title: "Historical Plant Failure Archive — Nov 2024 Trench Blowout",
    sourceType: "Historical Record",
    sourceCategory: "historical",
    sourceSystem: "Plant Disaster & Root-Cause Archive (Incident 2024-11)",
    timestamp: "14 Nov 2024 — 04:10",
    dateRelative: "Historical (2024)",
    location: "Block A / Trench 4B",
    zoneSlug: "block-a",
    facilityQuad: "BLOCK A",
    description: "Archive record of unmitigated sub-slab blowout in Trench 4B which caused 46 hours of plant shutdown and $1,420,000 in water damage.",
    severity: "Critical",
    relevance: "Supporting",
    confidence: "94%",
    linkedSignalsCount: 6,
    linkedSignals: ["SIG-031", "SIG-044", "SIG-WTR-01", "SIG-01", "SIG-02", "SIG-06"],
    linkedRiskId: "RSK-001",
    linkedRiskName: "Water Infrastructure Degradation",
    linkedPattern: "PAT-006 (Recurring Water Infrastructure Anomaly)",
    whyItMatters: "Cosine pattern similarity of 94.2% to current precursor sequence proved current micro-leak would follow identical catastrophic trajectory.",
    authorOrTech: "Reliability Engineering Root-Cause Committee",
    status: "Historical Benchmark",
    evidenceTimelineSummary: "Retrieved on Day 4 during EarlySight pattern matching to compute averted financial damage."
  },

  // --- Block C Source Evidence (Hydraulic Valve Cavitation) ---
  {
    id: "EVD-101",
    title: "LVDT Spool Position Feedback Lag Sensor",
    sourceType: "Sensor Reading",
    sourceCategory: "sensor",
    sourceSystem: "Press SCADA Telemetry (Sensor LVDT-PV02)",
    timestamp: "14 Sep 2026 — 07:45",
    dateRelative: "T-22d",
    location: "Block C / Press Station #2",
    zoneSlug: "block-c",
    facilityQuad: "BLOCK C",
    description: "Proportional directional valve spool position feedback lags setpoint command by 14ms (nominal: 3ms), indicating severe mechanical drag.",
    severity: "High",
    relevance: "High",
    confidence: "92%",
    linkedSignalsCount: 4,
    linkedSignals: ["SIG-012", "SIG-018"],
    linkedRiskId: "RSK-002",
    linkedRiskName: "Hydraulic Cavitation Drift",
    linkedPattern: "PAT-002 (Proportional Valve Spool Stick-Slip)",
    whyItMatters: "Quantifies mechanical resistance inside valve sleeve before total spool lockup occurs.",
    authorOrTech: "Real-Time PLC Bus",
    status: "Active Telemetry",
    evidenceTimelineSummary: "Logged Day 1; demonstrated progressive hysteresis drift over 5 days."
  },
  {
    id: "EVD-102",
    title: "Operator Complaint — Cylinder Hesitation & Popping Sound",
    sourceType: "Complaint",
    sourceCategory: "complaint",
    sourceSystem: "Press Line Shift Log",
    timestamp: "15 Sep 2026 — 18:20",
    dateRelative: "T-21d",
    location: "Block C / Press Station #2",
    zoneSlug: "block-c",
    facilityQuad: "BLOCK C",
    description: "Ram cylinder 2 hesitation observed on return stroke. Operator noted acoustic popping sounding like gravel inside valve manifold.",
    severity: "High",
    relevance: "High",
    confidence: "86%",
    linkedSignalsCount: 3,
    linkedSignals: ["SIG-012", "SIG-018"],
    linkedRiskId: "RSK-002",
    linkedRiskName: "Hydraulic Cavitation Drift",
    linkedPattern: "PAT-002 (Proportional Valve Spool Stick-Slip)",
    whyItMatters: "Frontline human observation of acoustic micro-bubble implosions.",
    authorOrTech: "K. Vogel (Senior Press Operator)",
    status: "Verified",
    evidenceTimelineSummary: "Filed Day 1; corroborated with acoustic transducer on Day 3."
  },
  {
    id: "EVD-103",
    title: "Ultrasonic Acoustic Emission Sensor Telemetry",
    sourceType: "Sensor Reading",
    sourceCategory: "sensor",
    sourceSystem: "UE Systems Ultrasonic Transducer UT-902",
    timestamp: "16 Sep 2026 — 11:35",
    dateRelative: "T-20d",
    location: "Block C / Press Station #2",
    zoneSlug: "block-c",
    facilityQuad: "BLOCK C",
    description: "Ultrasonic emissions frequency doubled from 22 kHz to 48 kHz, confirming energetic micro-bubble implosion on hardened spool metering edges.",
    severity: "Critical",
    relevance: "High",
    confidence: "95%",
    linkedSignalsCount: 4,
    linkedSignals: ["SIG-012", "SIG-018"],
    linkedRiskId: "RSK-002",
    linkedRiskName: "Hydraulic Cavitation Drift",
    linkedPattern: "PAT-002 (Proportional Valve Spool Stick-Slip)",
    whyItMatters: "Direct physical signature of cavitation metal erosion in progress.",
    authorOrTech: "Predictive Condition Telemetry",
    status: "Active Telemetry",
    evidenceTimelineSummary: "Spiked on Day 3; prompted automated cartridge replacement work order."
  },
  {
    id: "EVD-104",
    title: "Laser Thickness Runout Quality Inspection",
    sourceType: "Inspection Image",
    sourceCategory: "image",
    sourceSystem: "Keyence In-Line Optical Profiler",
    timestamp: "17 Sep 2026 — 16:00",
    dateRelative: "T-19d",
    location: "Block C / Extrusion Runout",
    zoneSlug: "block-c",
    facilityQuad: "BLOCK C",
    description: "High-resolution optical profiler detected cyclical 0.12mm surface micro-ripples on extruded billet batch B-442 correlating with valve dither.",
    severity: "Medium",
    relevance: "High",
    confidence: "90%",
    linkedSignalsCount: 3,
    linkedSignals: ["SIG-012", "SIG-018"],
    linkedRiskId: "RSK-002",
    linkedRiskName: "Hydraulic Cavitation Drift",
    linkedPattern: "PAT-002 (Proportional Valve Spool Stick-Slip)",
    whyItMatters: "Connects internal machine valve degradation to external customer quality variance.",
    authorOrTech: "A. Rossi (Quality Control Inspector)",
    status: "Quality Flagged",
    evidenceTimelineSummary: "Captured Day 4; confirmed downstream commercial impact."
  },

  // --- Power Island Source Evidence (Thermal Overload & Harmonics) ---
  {
    id: "EVD-201",
    title: "FLIR Radiometric Infrared Thermal Camera Telemetry",
    sourceType: "Sensor Reading",
    sourceCategory: "sensor",
    sourceSystem: "FLIR A310 Radiometric Automated IR Camera",
    timestamp: "18 Sep 2026 — 14:10",
    dateRelative: "T-18d",
    location: "Power Island / Generator Hall",
    zoneSlug: "power-island",
    facilityQuad: "POWER ISLAND",
    description: "Continuous IR thermal camera detected a +6.1°C thermal plume concentrated on switchgear Busbar 3B bolt joint 3B-4 under normal line load.",
    severity: "Critical",
    relevance: "High",
    confidence: "96%",
    linkedSignalsCount: 5,
    linkedSignals: ["SIG-022", "SIG-029"],
    linkedRiskId: "RSK-003",
    linkedRiskName: "Thermal Overload & Harmonic Distortion",
    linkedPattern: "PAT-003 (Harmonic Overload & Thermal Plume)",
    whyItMatters: "Direct thermographic measurement of progressive electrical connection degradation.",
    authorOrTech: "Automated Substation IR System",
    status: "Thermal Alert",
    evidenceTimelineSummary: "Detected Day 3; climbed steadily from +1.8°C to +6.1°C by Day 5."
  },
  {
    id: "EVD-202",
    title: "Power Quality Analyzer — Harmonic THD Spectrum",
    sourceType: "Sensor Reading",
    sourceCategory: "sensor",
    sourceSystem: "Fluke 1775 Power Quality Telemetry",
    timestamp: "18 Sep 2026 — 13:45",
    dateRelative: "T-18d",
    location: "Power Island / Switchgear 3B",
    zoneSlug: "power-island",
    facilityQuad: "POWER ISLAND",
    description: "Fluke analyzer logged 4.8% Total Harmonic Distortion (THD) on Phase B with elevated 5th and 7th harmonic current spikes.",
    severity: "Critical",
    relevance: "High",
    confidence: "94%",
    linkedSignalsCount: 4,
    linkedSignals: ["SIG-022", "SIG-029"],
    linkedRiskId: "RSK-003",
    linkedRiskName: "Thermal Overload & Harmonic Distortion",
    linkedPattern: "PAT-003 (Harmonic Overload & Thermal Plume)",
    whyItMatters: "Establishes electrical root cause: non-linear harmonic skin effect heating up joint.",
    authorOrTech: "Power Meter SCADA Node",
    status: "Active Telemetry",
    evidenceTimelineSummary: "Captured Day 2; coincided with Mill #4 high-torque operation."
  },
  {
    id: "EVD-203",
    title: "Dissolved Gas Analysis (DGA) Transformer Oil Lab Report",
    sourceType: "Maintenance Report",
    sourceCategory: "maintenance",
    sourceSystem: "Weidmann DGA Laboratory Report #LAB-9041",
    timestamp: "19 Sep 2026 — 10:15",
    dateRelative: "T-17d",
    location: "Power Island / Substation 2",
    zoneSlug: "power-island",
    facilityQuad: "POWER ISLAND",
    description: "Dissolved gas analysis identified 8 ppm dissolved acetylene (C2H2) gas inside enclosed bus duct oil, indicating active micro-arcing.",
    severity: "Critical",
    relevance: "High",
    confidence: "95%",
    linkedSignalsCount: 4,
    linkedSignals: ["SIG-022", "SIG-029"],
    linkedRiskId: "RSK-003",
    linkedRiskName: "Thermal Overload & Harmonic Distortion",
    linkedPattern: "PAT-003 (Harmonic Overload & Thermal Plume)",
    whyItMatters: "Acetylene is a definitive gas signature of high-temperature electrical arcing.",
    authorOrTech: "Dr. K. Vance (High Voltage Chemist)",
    status: "Lab Certified",
    evidenceTimelineSummary: "Sample taken Day 3; results expedited on Day 4 triggering P1 escalation."
  },
  {
    id: "EVD-204",
    title: "Master Electrician Log — Ozone Odor & Corona Hum",
    sourceType: "Complaint",
    sourceCategory: "complaint",
    sourceSystem: "Substation Shift Walkdown Log",
    timestamp: "17 Sep 2026 — 07:30",
    dateRelative: "T-19d",
    location: "Power Island / Generator Hall",
    zoneSlug: "power-island",
    facilityQuad: "POWER ISLAND",
    description: "Shift electrician noted faint ozone smell and audible 120 Hz corona hum in Substation 2 near Switchgear 3B during morning walkdown.",
    severity: "High",
    relevance: "High",
    confidence: "88%",
    linkedSignalsCount: 3,
    linkedSignals: ["SIG-022", "SIG-029"],
    linkedRiskId: "RSK-003",
    linkedRiskName: "Thermal Overload & Harmonic Distortion",
    linkedPattern: "PAT-003 (Harmonic Overload & Thermal Plume)",
    whyItMatters: "Human sensory confirmation of dielectric ionization and corona discharge.",
    authorOrTech: "H. Kowal (Master Electrician)",
    status: "Logged",
    evidenceTimelineSummary: "Recorded on Day 1; initially treated as ambient humidity effect."
  }
];

// Helper functions for lookup & filtering
export function getAlertById(alertId) {
  if (!alertId) return EVIDENCE_ALERTS_DATA[0];
  const query = alertId.trim().toUpperCase();
  return EVIDENCE_ALERTS_DATA.find(a => 
    a.id.toUpperCase() === query || 
    a.riskId.toUpperCase() === query || 
    (a.riskIdAlt && a.riskIdAlt.toUpperCase() === query) ||
    a.zoneSlug.toLowerCase() === alertId.trim().toLowerCase()
  ) || EVIDENCE_ALERTS_DATA[0];
}

export function getEvidenceItemById(evidenceId) {
  if (!evidenceId) return SOURCE_EVIDENCE_REGISTRY[0];
  const query = evidenceId.trim().toUpperCase();
  return SOURCE_EVIDENCE_REGISTRY.find(e => e.id.toUpperCase() === query) || SOURCE_EVIDENCE_REGISTRY[0];
}

export function filterEvidenceRegistry({ search = '', type = 'all', location = 'all', severity = 'all', relevance = 'all', riskId = 'all' }) {
  return SOURCE_EVIDENCE_REGISTRY.filter(item => {
    // Search
    if (search) {
      const q = search.toLowerCase();
      const matchSearch = item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.sourceSystem.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    // Type
    if (type !== 'all' && item.sourceCategory.toLowerCase() !== type.toLowerCase()) {
      return false;
    }

    // Location
    if (location !== 'all') {
      const locSlug = location.toLowerCase().replace(/\s+/g, '-');
      if (item.zoneSlug !== locSlug && !item.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
    }

    // Severity
    if (severity !== 'all' && item.severity.toLowerCase() !== severity.toLowerCase()) {
      return false;
    }

    // Relevance
    if (relevance !== 'all' && item.relevance.toLowerCase() !== relevance.toLowerCase()) {
      return false;
    }

    // Linked Risk
    if (riskId !== 'all') {
      const rId = riskId.toUpperCase();
      if (item.linkedRiskId !== rId && (!item.linkedRiskName.toLowerCase().includes(riskId.toLowerCase()))) {
        return false;
      }
    }

    return true;
  });
}

// Window global bindings
if (typeof window !== 'undefined') {
  window.EVIDENCE_OVERVIEW_KPIS = EVIDENCE_OVERVIEW_KPIS;
  window.EVIDENCE_ALERTS_DATA = EVIDENCE_ALERTS_DATA;
  window.SOURCE_EVIDENCE_REGISTRY = SOURCE_EVIDENCE_REGISTRY;
  window.getAlertById = getAlertById;
  window.getEvidenceItemById = getEvidenceItemById;
  window.filterEvidenceRegistry = filterEvidenceRegistry;
}
