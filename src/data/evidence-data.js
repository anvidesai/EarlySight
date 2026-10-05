/**
 * EarlySight — Evidence & Explainability Dataset (Stage 8)
 * Structured evidence graphs, cross-silo supporting records,
 * and transparent explainability models for early warnings.
 *
 * Core Principle:
 * Confidence communicates the strength and coherence of the available evidence,
 * NOT mathematical certainty or inevitability of failure.
 */

const EVIDENCE_ALERTS_DATA = [
  {
    id: "EW-2026-088",
    title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
    shortTitle: "Water Infrastructure Issue",
    subsystem: "Civil & Auxiliary Fluid Infrastructure",
    location: "Block A — Trench 4B / Assembly Bay 4 / Cleanroom Cell C Boundary",
    facilityQuad: "BLOCK A",
    severity: "High",
    leadTimeDays: 14.2,
    leadTimeCountdown: "14 Days Remaining",
    projectedLossUSD: "$512,000",
    
    // Core Confidence Specification
    confidence: "87%",
    confidenceScore: 0.87,
    confidenceExplanation: "This confidence rating of 87% communicates the mathematical strength and coherence of the 5 convergent evidence streams (complaints, work orders, spatial proximity, velocity surge, and historical similarity). It represents the strength of available evidence, NOT certainty that a catastrophic rupture has already occurred.",
    
    // Core Explainability Answer to "Why was this warning generated?"
    whyGeneratedAnswer: {
      headline: "Why was this warning generated?",
      summary: "This warning was generated because 5 independent, historically disconnected operational indicators converged in the exact same 8.5-meter sub-slab utility corridor in Block A with an exponential acceleration (+340% frequency surge over 72 hours).",
      causalNarrative: "Standard SCADA alarms remained silent because no individual sensor exceeded legacy single-point trip limits. However, EarlySight cross-correlated 8 operator complaint logs (acoustic hiss, localized floor dampness) with 3 separate maintenance inspection tickets (gasket wear, condensation notes), pinpointing an active micro-leak on flange 4B-12. The temporal velocity and spatial co-location match past unmitigated trench flooding signatures with 94.2% similarity.",
      rootCauseHypothesis: "EPDM elastomer gasket embrittlement on pressurized line 4B combined with transient hydraulic shock from booster pump P-102 short-cycling.",
      prescriptiveAction: "Deploy ultrasonic acoustic leak pinpointing on joint 4B-12 during upcoming 45-minute shift break. Replace seal with reinforced Viton gasket ring and widen booster pump pressure deadband by 0.4 bar."
    },

    // The Connected Visual Evidence Cards (Upstream Sources converging into Problem)
    evidenceCards: [
      {
        id: "ev-complaints",
        type: "Similar Complaints",
        count: 8,
        label: "8 Similar Complaints",
        icon: "📋",
        themeColor: "#D94E34",
        badge: "Operator Logs",
        weightContribution: "+28%",
        summary: "8 independent shift logs filed across 3 operator rotations noting abnormal hissing sounds, floor dampness, and localized solvent smell near Bay 4.",
        evidenceItems: [
          { date: "Sep 13 • 22:15", author: "M. Kovacs (Shift C Operator)", text: "Noticed persistent high-pitch hiss near Assembly Bay 4 feed conduit during idle cycle. Cleaned small water puddle under conduit raceway.", bay: "Assembly Bay 4" },
          { date: "Sep 12 • 14:30", author: "J. Chen (Shift B Operator)", text: "Floor dampness reappeared near machining conduit 4B after morning washdown. Odor resembles stagnant utility water.", bay: "Feed Conduit 4B" },
          { date: "Sep 11 • 06:40", author: "R. Vance (Shift A Operator)", text: "Acoustic hiss audible through hearing protection when booster pump kicks in. Reported to shift lead.", bay: "Machining Bay 1" },
          { date: "Sep 09 • 19:10", author: "T. Morales (Packaging Lead)", text: "Auxiliary supply line shuddered noticeably during line ramp-up. Slip hazard tape applied on floor.", bay: "Assembly Bay 4" },
          { date: "Sep 07 • 11:20", author: "M. Kovacs (Shift C Operator)", text: "Water seep visible along joint line 4B-12 after weekend pressurization.", bay: "Feed Conduit 4B" },
          { date: "Sep 05 • 16:45", author: "D. Becker (Assembly Tech)", text: "Operator complaints of damp socks in Cell C airlock entry.", bay: "Cleanroom Cell C" },
          { date: "Sep 03 • 08:30", author: "J. Chen (Shift B Operator)", text: "Hissing noise near booster return manifold. Suspected pneumatic leak.", bay: "Assembly Bay 4" },
          { date: "Aug 31 • 21:00", author: "R. Vance (Shift A Operator)", text: "Initial observation of faint trickling sound beneath floor grating 4B.", bay: "Trench 4B" }
        ]
      },
      {
        id: "ev-maintenance",
        type: "Repeated Maintenance Reports",
        count: 3,
        label: "3 Maintenance Reports",
        icon: "🔧",
        themeColor: "#D97706",
        badge: "CMMS Work Orders",
        weightContribution: "+22%",
        summary: "3 separate work orders filed over 18 days regarding flange gasket checks, trench dehumidification, and booster check-valve cycling.",
        evidenceItems: [
          { woId: "WO-2026-7812", date: "Sep 11, 2026", tech: "G. Ramirez (Mechanical)", text: "Investigated floor dampness work request. Tightened bolts on adjacent drainage line; noted flange 4B-12 showed minor rust blooming on lower studs.", status: "Closed (Partial)" },
          { woId: "WO-2026-7540", date: "Sep 06, 2026", tech: "S. Lindqvist (Facilities)", text: "Cleaned trench 4B sump basket. Logged 18 liters unmetered runoff accumulation in 48 hours. Attributed to chiller condensation.", status: "Closed (Uncorrelated)" },
          { woId: "WO-2026-7201", date: "Aug 29, 2026", tech: "H. Patel (Instrumentation)", text: "Routine calibration on booster transducer PT-102. Observed transient -1.4 bar pressure bounce, recalibrated zero offset.", status: "Completed" }
        ]
      },
      {
        id: "ev-location",
        type: "Same Location",
        count: 1,
        label: "Same Location",
        icon: "📍",
        themeColor: "#5E7E6C",
        badge: "Spatial Convergence",
        weightContribution: "+18%",
        summary: "All 17 multi-modal indicators originate within an 8.5-meter radius inside Facility Quad Block A along utility trench conduit 4B.",
        spatialMetrics: {
          quadrant: "Block A — Precision Assembly & Machining",
          trenchSegment: "Sub-slab Conduit Trench 4B (Elevation +12.4m)",
          maxDispersionRadius: "8.5 meters",
          affectedAssets: ["Auxiliary Water Line Flange 4B-12", "Booster Pump P-102", "Cleanroom Cell C Foundation Barrier", "CNC Mill #12 Cable Raceway"],
          soilMoistureProbe: "Sensor SM-4B: 68.4% volumetric water content (+44% over dry baseline)"
        }
      },
      {
        id: "ev-frequency",
        type: "Increasing Frequency",
        count: 1,
        label: "Increasing Frequency",
        icon: "📈",
        themeColor: "#DC2626",
        badge: "Velocity Surge",
        weightContribution: "+19%",
        summary: "Precursor arrival rate surged +340% from 0.04 signals/day (Aug 27) to 3.40 signals/day (Sep 14). Mean time between signals collapsed from 168h to 6.2h.",
        velocityMetrics: {
          accelerationRate: "+340% over 72h window",
          meanTimeBetweenSignals: "6.2 Hours (Down from 168h)",
          arrivalVelocityDaily: "3.4 Precursors / Day",
          coherencePhase: "Exponential Non-Linear Acceleration",
          trajectoryAlert: "Indicates progressive physical seal degradation under active line pressure."
        }
      },
      {
        id: "ev-historical",
        type: "Historical Similarity",
        count: 1,
        label: "Historical Similarity",
        icon: "📊",
        themeColor: "#059669",
        badge: "Signature Match",
        weightContribution: "+9%",
        summary: "94.2% cosine mathematical similarity to the Nov 2024 unmitigated trench blowout which caused 46 hours of plant shutdown and $1.42M in damage.",
        historicalMetrics: {
          matchScore: "94.2% Pattern Match",
          pastIncident: "November 14, 2024 — Trench Seepage & Drive Inundation",
          unmitigatedCost: "$1,420,000",
          unmitigatedDowntime: "46 Hours Plant Stoppage",
          identicalPrecursorChain: "Acoustic hiss ➔ Sump water accumulation ➔ Cleanroom humidity creep ➔ Emergency line rupture"
        }
      }
    ],

    // Downstream Convergence Target Card
    synthesizedProblem: {
      headline: "Potential Emerging Problem: Sub-Slab Pressurized Flange Micro-Leakage",
      riskLevel: "HIGH OPERATIONAL HAZARD",
      failureMechanism: "Sub-slab utility trench 4B flooding migrating toward Cleanroom Cell C foundation barrier and line drive motor raceways.",
      forecastWindow: "14.2 Days Lead Time ahead of critical high-level float switch trip",
      avertedCost: "$512,000 Verified Loss Averted",
      recommendedAction: "Execute WO-2026-8841: Viton gasket replacement during scheduled shift break."
    },

    evidenceWeightsDecomposition: [
      { factor: "Multi-Modal Operational Complaints & Logs", weight: "30%", contribution: "+0.28", rationale: "8 independent operator complaints corroborated across 3 shift rotations noting audible hissing and localized dampness." },
      { factor: "Spatial Co-Location Clustering (8.5m Radius)", weight: "25%", contribution: "+0.22", rationale: "All 17 precursors localized within an 8.5m radius along utility trench conduit 4B." },
      { factor: "Temporal Velocity Acceleration (+340% Surge)", weight: "20%", contribution: "+0.19", rationale: "Precursor recurrence interval collapsed from 168 hours to 6.2 hours, indicating active physical degradation." },
      { factor: "Cross-Domain Transducer Phase Correlation", weight: "15%", contribution: "+0.10", rationale: "Acoustic hiss directly phase-matches booster pump suction transient oscillation (r = 0.78)." },
      { factor: "Historical Failure Signature Match (Nov 2024)", weight: "10%", contribution: "+0.08", rationale: "94.2% cosine similarity match to the Nov 2024 unmitigated trench blowout incident." }
    ]
  },

  {
    id: "EW-2026-094",
    title: "Hydraulic Proportional Valve Cavitation Drift",
    shortTitle: "Valve Cavitation Drift",
    subsystem: "Hydraulic Fluid Power",
    location: "Block C — Press Station #2 / Valve Block VB-4",
    facilityQuad: "BLOCK C",
    severity: "High",
    leadTimeDays: 12.0,
    leadTimeCountdown: "12 Days Remaining",
    projectedLossUSD: "$340,000",
    confidence: "91.2%",
    confidenceScore: 0.912,
    confidenceExplanation: "This confidence rating of 91.2% reflects the strong convergence of spool lag feedback, ultrasonic cavitation emissions, and laser thickness quality ripples. It represents the strength of available multi-sensor evidence, NOT certainty that the spool has completely seized.",
    whyGeneratedAnswer: {
      headline: "Why was this warning generated?",
      summary: "This warning was generated because high-frequency acoustic emissions (>40 kHz) at valve PV-02 directly phase-matched a 14ms spool feedback lag and periodic micro-ripples on extruded billet thickness.",
      causalNarrative: "Negative suction head transients during rapid accumulator recharge entrained air micro-bubbles into the hydraulic reservoir. Under 210 bar line pressure, micro-bubbles collapsed violently against valve metering edges, pitting the hardened steel and causing spool stick-slip.",
      rootCauseHypothesis: "Fluid aeration from reservoir low-level vortexing combined with degraded anti-foaming chemistry.",
      prescriptiveAction: "Replace proportional valve spool cartridge PV-02, de-aerate reservoir fluid, replenish anti-foaming additive, and clean suction basket."
    },
    evidenceCards: [
      {
        id: "ev-complaints-c",
        type: "Similar Complaints",
        count: 5,
        label: "5 Operator Notes",
        icon: "📋",
        themeColor: "#D94E34",
        badge: "Shift Reports",
        weightContribution: "+26%",
        summary: "5 operator complaints regarding spongy press cylinder response and audible popping sounds during rapid decompression.",
        evidenceItems: [
          { date: "Sep 15 • 18:20", author: "K. Vogel (Press Operator)", text: "Ram cylinder 2 hesitation on return stroke. Sounded like gravel in valve block.", bay: "Press Station #2" },
          { date: "Sep 14 • 07:45", author: "A. Rossi (Quality Inspector)", text: "Laser thickness gauge flagged micro-ripples on aluminum billet batch B-442.", bay: "Extrusion Runout" },
          { date: "Sep 12 • 23:10", author: "K. Vogel (Press Operator)", text: "Spongy cycle response during rapid stroke. Cylinder lag ~15ms.", bay: "Press Station #2" }
        ]
      },
      {
        id: "ev-maintenance-c",
        type: "Repeated Maintenance Reports",
        count: 4,
        label: "4 Maintenance Tickets",
        icon: "🔧",
        themeColor: "#D97706",
        badge: "Work Orders",
        weightContribution: "+24%",
        summary: "4 maintenance logs noting oil sight glass foaming, accumulator pressure drift, and proportional coil temperature elevation.",
        evidenceItems: [
          { woId: "WO-2026-8012", date: "Sep 14, 2026", tech: "E. Morales (Hydraulics)", text: "Logged valve coil temperature at 78°C (+14°C over nominal). Checked dither current.", status: "Under Review" },
          { woId: "WO-2026-7789", date: "Sep 10, 2026", tech: "F. Weber (Lube Tech)", text: "Noticed 5% surface foam layer in reservoir sight glass. Topped off oil level.", status: "Closed" }
        ]
      },
      {
        id: "ev-location-c",
        type: "Same Location",
        count: 1,
        label: "Same Location",
        icon: "📍",
        themeColor: "#5E7E6C",
        badge: "Spatial Convergence",
        weightContribution: "+18%",
        summary: "All 12 signals localized to Press Station #2 hydraulic manifold gallery VB-4.",
        spatialMetrics: {
          quadrant: "Block C — Continuous Forming",
          trenchSegment: "Manifold Gallery VB-4",
          maxDispersionRadius: "4.2 meters",
          affectedAssets: ["Proportional Directional Valve PV-02", "Variable Vane Pump B", "Accumulator Bank VB-4"],
          soilMoistureProbe: "N/A (Hydraulic Manifold Enclosure)"
        }
      },
      {
        id: "ev-frequency-c",
        type: "Increasing Frequency",
        count: 1,
        label: "Increasing Frequency",
        icon: "📈",
        themeColor: "#DC2626",
        badge: "Velocity Surge",
        weightContribution: "+20%",
        summary: "Signal velocity surged +280% over 5 days; ultrasonic emissions frequency doubled from 22 kHz to 48 kHz.",
        velocityMetrics: {
          accelerationRate: "+280% over 5 days",
          meanTimeBetweenSignals: "8.4 Hours",
          arrivalVelocityDaily: "2.8 Precursors / Day",
          coherencePhase: "Spool Micro-Pitting Spalling Acceleration",
          trajectoryAlert: "High risk of total spool lockup during high-speed cycle."
        }
      },
      {
        id: "ev-historical-c",
        type: "Historical Similarity",
        count: 1,
        label: "Historical Similarity",
        icon: "📊",
        themeColor: "#059669",
        badge: "Signature Match",
        weightContribution: "+12%",
        summary: "91.8% similarity to 2025 Press #1 valve blowout incident ($340,000 lost production).",
        historicalMetrics: {
          matchScore: "91.8% Pattern Match",
          pastIncident: "March 2025 — Press #1 Hydraulic Valve Catastrophic Blowout",
          unmitigatedCost: "$340,000",
          unmitigatedDowntime: "24 Hours Plant Stoppage",
          identicalPrecursorChain: "Reservoir foaming ➔ Valve hysteresis ➔ Laser thickness ripple ➔ Spool galling"
        }
      }
    ],
    synthesizedProblem: {
      headline: "Potential Emerging Problem: Proportional Valve Metering Edge Cavitation Spalling",
      riskLevel: "HIGH HYDRAULIC FAILURE RISK",
      failureMechanism: "Micro-cavitation erosion leading to complete spool lockup, cylinder over-pressurization, and blown manifold seals.",
      forecastWindow: "12.0 Days Lead Time before catastrophic valve seizure",
      avertedCost: "$340,000 Verified Loss Averted",
      recommendedAction: "Execute WO-2026-8902: Swap valve cartridge PV-02 and replenish anti-foaming chemistry."
    },
    evidenceWeightsDecomposition: [
      { factor: "LVDT Spool Hysteresis Lag Feedback", weight: "26%", contribution: "+0.26", rationale: "Valve spool position lags command by 14ms (baseline 3ms), indicating mechanical drag." },
      { factor: "High-Frequency Ultrasonic Cavitation Spikes", weight: "24%", contribution: "+0.24", rationale: "48 kHz acoustic bursts match micro-bubble implosion signatures on hardened alloy steel." },
      { factor: "Direct Quality Variance Correlation", weight: "20%", contribution: "+0.20", rationale: "Billet thickness ripple correlates 1-to-1 with valve dither frequency oscillations ($r = 0.88$)." },
      { factor: "Localized Thermal Elevation (+14°C)", weight: "18%", contribution: "+0.18", rationale: "Coil driving excess current to overcome spool frictional sticking." },
      { factor: "Historical March 2025 Cavitation Match", weight: "12%", contribution: "+0.12", rationale: "91.8% signature similarity to past catastrophic valve blowout." }
    ]
  }
];

// Export to window
if (typeof window !== 'undefined') {
  window.EVIDENCE_ALERTS_DATA = EVIDENCE_ALERTS_DATA;
}

export { EVIDENCE_ALERTS_DATA };
