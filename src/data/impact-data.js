/**
 * EarlySight — Impact Monitoring Dataset (Stage 11)
 * 
 * Verifies whether operational interventions actually reduced the problem.
 * Tracks pre-intervention precursor frequency, intervention demarcation,
 * post-intervention signal decay, resolution status, and quantified ROI.
 */

const IMPACT_MONITORING_DATA = {
  executiveKPIs: {
    averageSignalReductionPct: "-95.2%",
    totalAvertedLoss2026: "$1,922,000",
    totalDowntimeHoursAverted: 180,
    activeAuditedInterventions: 5,
    truePositiveVerificationRate: "100%",
    meanTimeToStabilizationDays: 3.4
  },

  interventions: [
    // 1. ANCHOR CASE: Sub-Slab Pressurized Flange Micro-Leakage (17 -> 6 -> 1)
    {
      id: "IMP-2026-088",
      alertId: "EW-2026-088",
      actionTicketId: "ACT-2026-088",
      title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
      asset: "DI Water Main Trench Feed — Joint 4B-12",
      location: "Block A — Trench 4B / Assembly Bay 4",
      responsibleTeam: "Civil & Piping Infrastructure",
      assignedPerson: "Marcus Vance (Senior Piping Lead)",
      priority: "Critical P1",
      
      // Before Action
      beforeSignalsCount: 17,
      beforeFrequency: "4.8 signals / day",
      beforeMTBS: "6.2 hours between signals",
      
      // Action Taken
      actionTaken: "Isolated auxiliary trench bypass loop, conducted ultrasonic bolt elongation check, replaced degraded EPDM elastomer with chemical-resistant Viton FKM gasket ring, retorqued studs to 340 Nm, and cleared concrete raceway drainage channel.",
      actionDate: "Sep 20, 2026 — 02:30 (Midnight Shift)",
      workOrder: "WO-2026-8841",
      
      // After Action
      afterActionInitialCount: 6, // 48h after intervention
      afterActionFinalCount: 1,   // Current 14-day stabilized residual
      afterFrequency: "0.14 signals / day",
      afterMTBS: "168.0 hours between signals",
      reductionPercentage: "-94.1%",
      
      // Mandatory Stage 11 Dimensions
      resolutionStatus: "Verified Remediated",
      monitoringPeriod: "14-Day Post-Intervention Audit (Sep 20 – Oct 04, 2026)",
      currentTrend: "Decaying to Baseline (-94.1%)",
      trendStatus: "improving", // 'improving' | 'stable' | 'watch'
      
      // Quantified ROI Impact
      financialSavings: "$512,000",
      avertedDowntimeHours: 36,
      secondaryFaultsAvoided: "Cleanroom Cell C subterranean water inundation & 3.3kV conduit short circuit",
      
      // Multi-Day Trend Telemetry Data (Days -5 to Day 0 to Day +5)
      timelineDays: ["Day -5", "Day -4", "Day -3", "Day -2", "Day -1", "Day 0 (Action)", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5"],
      beforeTrendValues: [1.2, 1.8, 2.4, 3.6, 4.8, 4.8],
      afterTrendValues: [4.8, 1.8, 1.2, 0.6, 0.3, 0.14],
      dailySignals: [1, 2, 3, 4, 7, 6, 3, 2, 1, 1, 0],
      
      telemetryStreams: [
        { name: "Sub-slab Soil Moisture (Probe SM-4B)", preVal: "68.4% VWC", postVal: "24.1% VWC (Baseline)", delta: "-64.8%", status: "Nominal" },
        { name: "High-Frequency Ultrasonic Hiss (AE-04)", preVal: "48.2 kHz", postVal: "1.2 kHz (Background)", delta: "-97.5%", status: "Nominal" },
        { name: "Trench Sump Ingress Rate", preVal: "18.4 L / day", postVal: "0.1 L / day", delta: "-99.5%", status: "Nominal" },
        { name: "Operator Shift Dampness Complaints", preVal: "8 logs / 14d", postVal: "0 logs / 10d", delta: "-100%", status: "Resolved" }
      ],

      verificationNotes: "Ultrasonic acoustic imaging confirms zero micro-cavitation leakage along joint 4B-12 circumference. Soil probe SM-4B shows normal moisture decay gradient as concrete slab dries out. Pressure transducer PT-102 holds nominal 4.2 bar with zero cyclic pulsation. True positive early warning confirmed: averted complete conduit inundation."
    },

    // 2. CASE: Hydraulic Proportional Valve Cavitation Drift (12 -> 4 -> 1)
    {
      id: "IMP-2026-094",
      alertId: "EW-2026-094",
      actionTicketId: "ACT-2026-094",
      title: "Hydraulic Proportional Valve Cavitation Drift",
      asset: "Hydraulic Power Unit — Valve PV-02",
      location: "Block C — Press Station #2",
      responsibleTeam: "Hydraulics & Fluid Power",
      assignedPerson: "Elena Rostova (Fluid Power Specialist)",
      priority: "High P2",
      
      // Before Action
      beforeSignalsCount: 12,
      beforeFrequency: "3.2 signals / day",
      beforeMTBS: "8.5 hours between signals",
      
      // Action Taken
      actionTaken: "Replaced cavitation-eroded hardened proportional spool valve PV-02, micro-polished manifold valve block mating face, deployed temporary 3-micron offline filtration cart, and restored anti-wear hydraulic oil additive package.",
      actionDate: "Sep 22, 2026 — 14:00 (Scheduled Tooling Window)",
      workOrder: "WO-2026-8910",
      
      // After Action
      afterActionInitialCount: 4,
      afterActionFinalCount: 1,
      afterFrequency: "0.10 signals / day",
      afterMTBS: "192.0 hours between signals",
      reductionPercentage: "-91.7%",
      
      // Mandatory Stage 11 Dimensions
      resolutionStatus: "Verified Remediated",
      monitoringPeriod: "10-Day Continuous Pressure Run (Sep 22 – Oct 02, 2026)",
      currentTrend: "Stabilized Nominal Baseline (-91.7%)",
      trendStatus: "improving",
      
      // Quantified ROI Impact
      financialSavings: "$340,000",
      avertedDowntimeHours: 24,
      secondaryFaultsAvoided: "Main press hydraulic ram seizure & hydraulic oil thermal breakdown",
      
      timelineDays: ["Day -5", "Day -4", "Day -3", "Day -2", "Day -1", "Day 0 (Action)", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5"],
      beforeTrendValues: [0.8, 1.4, 2.1, 2.7, 3.2, 3.2],
      afterTrendValues: [3.2, 1.4, 0.7, 0.4, 0.2, 0.10],
      dailySignals: [1, 2, 2, 3, 4, 3, 2, 1, 1, 0, 0],
      
      telemetryStreams: [
        { name: "Proportional Spool Response Lag", preVal: "14.2 ms (Erratic)", postVal: "2.1 ms (Spec)", delta: "-85.2%", status: "Nominal" },
        { name: "Acoustic Transducer Cavitation Burst", preVal: "42 kHz spikes", postVal: "0 spikes", delta: "-100%", status: "Nominal" },
        { name: "ISO 4406 Cleanliness Code", preVal: "22/19/16 (Contaminated)", postVal: "15/13/10 (Clean)", delta: "Purified", status: "Nominal" },
        { name: "Oil Temperature Transient Excursions", preVal: "+8.4°C over setpoint", postVal: "52°C steady", delta: "-8.4°C", status: "Nominal" }
      ],

      verificationNotes: "High-speed linear encoder confirms cylinder velocity repeatability within ±0.05 mm/s. Manifold pressure stability verified across 14,000 press cycles. Zero fluid foaming observed in sight glass."
    },

    // 3. CASE: Turbine Dynamic Unbalance & Bearing Race Drift (15 -> 5 -> 2)
    {
      id: "IMP-2026-077",
      alertId: "EW-2026-077",
      actionTicketId: "ACT-2026-077",
      title: "Turbine Bearing Dynamic Unbalance & Cage Drift",
      asset: "Co-Gen Steam Turbine TG-01",
      location: "Power Island — Turbine Hall",
      responsibleTeam: "Mechanical Reliability",
      assignedPerson: "Devon Chen (Vibration Specialist)",
      priority: "Critical P1",
      
      // Before Action
      beforeSignalsCount: 15,
      beforeFrequency: "2.8 signals / day",
      beforeMTBS: "9.2 hours between signals",
      
      // Action Taken
      actionTaken: "Executed multi-plane dynamic field balancing with portable optical tachometer, cleaned flue ash particulate deposits from turbine blading, flushed bearing oil reservoir, and retorqued bearing pedestal anchor bolts.",
      actionDate: "Sep 24, 2026 — 18:30 (Planned Night Shift Outage)",
      workOrder: "WO-2026-8955",
      
      // After Action
      afterActionInitialCount: 5,
      afterActionFinalCount: 2,
      afterFrequency: "0.20 signals / day",
      afterMTBS: "120.0 hours between signals",
      reductionPercentage: "-86.7%",
      
      // Mandatory Stage 11 Dimensions
      resolutionStatus: "Monitoring in Progress",
      monitoringPeriod: "7-Day Burn-in Telemetry Watch (Sep 24 – Oct 01, 2026)",
      currentTrend: "Sub-Harmonics Decaying (-86.7%)",
      trendStatus: "improving",
      
      // Quantified ROI Impact
      financialSavings: "$420,000",
      avertedDowntimeHours: 48,
      secondaryFaultsAvoided: "Catastrophic turbine shaft rub & power island generator emergency trip",
      
      timelineDays: ["Day -5", "Day -4", "Day -3", "Day -2", "Day -1", "Day 0 (Action)", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5"],
      beforeTrendValues: [0.6, 1.1, 1.7, 2.2, 2.8, 2.8],
      afterTrendValues: [2.8, 1.4, 0.8, 0.5, 0.3, 0.20],
      dailySignals: [1, 1, 2, 3, 4, 3, 2, 1, 1, 0, 1],
      
      telemetryStreams: [
        { name: "1X RPM Overall Vibration Velocity", preVal: "7.4 mm/s RMS (Alarm)", postVal: "1.2 mm/s RMS (ISO Good)", delta: "-83.8%", status: "Nominal" },
        { name: "Bearing Journal Temperature", preVal: "78.4°C (Rising)", postVal: "62.1°C (Stable)", delta: "-16.3°C", status: "Nominal" },
        { name: "Shaft Centerline Orbit Eccentricity", preVal: "48 μm peak-to-peak", postVal: "9 μm peak-to-peak", delta: "-81.2%", status: "Nominal" },
        { name: "Oil Sump Spectrometry Iron PPM", preVal: "44 PPM", postVal: "6 PPM", delta: "-86.4%", status: "Nominal" }
      ],

      verificationNotes: "Turbine generator synchronized to grid at 3,600 RPM. Shaft vibration levels consistently below 1.5 mm/s ISO limit. 7-day burn-in telemetry indicates thermal equilibrium achieved without sub-harmonic resonance."
    },

    // 4. CASE: Conveyor Drive Pulley Ceramic Pitting & Slip (8 -> 3 -> 0)
    {
      id: "IMP-2026-062",
      alertId: "EW-2026-062",
      actionTicketId: "ACT-2026-062",
      title: "Conveyor Drive Pulley Lagging Pitting & Micro-Slip",
      asset: "High-Bay Sortation Main Header Belt CV-04",
      location: "Logistics & Sortation Yard",
      responsibleTeam: "Automation & Robotics",
      assignedPerson: "Carlos Mendez (Automation Lead)",
      priority: "Medium P3",
      
      // Before Action
      beforeSignalsCount: 8,
      beforeFrequency: "1.8 signals / day",
      beforeMTBS: "13.3 hours between signals",
      
      // Action Taken
      actionTaken: "Replaced degraded ceramic pulley lagging on head drive roller #12, readjusted counterweight tension carriage stroke, and reprogrammed VFD acceleration ramp rate from 1.8s to 2.4s to mitigate belt stretch shock.",
      actionDate: "Sep 21, 2026 — 08:00 (Day Shift Change)",
      workOrder: "WO-2026-8802",
      
      // After Action
      afterActionInitialCount: 3,
      afterActionFinalCount: 0,
      afterFrequency: "0.00 signals / day",
      afterMTBS: "No events (> 200h)",
      reductionPercentage: "-100.0%",
      
      // Mandatory Stage 11 Dimensions
      resolutionStatus: "Verified Remediated",
      monitoringPeriod: "12-Day High-Throughput Run (Sep 21 – Oct 03, 2026)",
      currentTrend: "Fully Cleared to Zero (-100%)",
      trendStatus: "improving",
      
      // Quantified ROI Impact
      financialSavings: "$165,000",
      avertedDowntimeHours: 18,
      secondaryFaultsAvoided: "Main sortation line jam during peak truck dispatch window",
      
      timelineDays: ["Day -5", "Day -4", "Day -3", "Day -2", "Day -1", "Day 0 (Action)", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5"],
      beforeTrendValues: [0.4, 0.7, 1.1, 1.4, 1.8, 1.8],
      afterTrendValues: [1.8, 0.8, 0.3, 0.1, 0.0, 0.0],
      dailySignals: [1, 1, 1, 2, 3, 2, 1, 0, 0, 0, 0],
      
      telemetryStreams: [
        { name: "Drive Pulley vs Belt Speed Tach Variance", preVal: "4.8% Micro-Slip", postVal: "0.1% Nominal", delta: "-97.9%", status: "Nominal" },
        { name: "Drive Motor VFD Stator Current Ripples", preVal: "18.2A peak transients", postVal: "4.1A smooth", delta: "-77.5%", status: "Nominal" },
        { name: "Acoustic Belt Squeal Sensors", preVal: "6 events / shift", postVal: "0 events", delta: "-100%", status: "Resolved" }
      ],

      verificationNotes: "Sortation header has operated through 14 consecutive shifts without a single belt tracking alarm or package jam. Tachometer variance holds steady at 0.1% under maximum 4,200 packages/hour payload."
    },

    // 5. CASE: Cleanroom AHU Blower Fan Bearing Race Spall (11 -> 4 -> 1)
    {
      id: "IMP-2026-051",
      alertId: "EW-2026-051",
      actionTicketId: "ACT-2026-051",
      title: "Cleanroom AHU Blower Fan Bearing Spall Inception",
      asset: "Cleanroom Air Handling Unit AHU-02",
      location: "Utility Basement / Block B",
      responsibleTeam: "HVAC & Plant Utilities",
      assignedPerson: "Sarah Lin (Thermal Systems)",
      priority: "High P2",
      
      // Before Action
      beforeSignalsCount: 11,
      beforeFrequency: "2.4 signals / day",
      beforeMTBS: "10.0 hours between signals",
      
      // Action Taken
      actionTaken: "Replaced pillow block rolling element bearing SKF 22212 with sealed spherical roller unit, installed vibration damping isolation pads under motor mount, and conducted laser shaft alignment.",
      actionDate: "Sep 18, 2026 — 11:00",
      workOrder: "WO-2026-8740",
      
      // After Action
      afterActionInitialCount: 4,
      afterActionFinalCount: 1,
      afterFrequency: "0.08 signals / day",
      afterMTBS: "240.0 hours between signals",
      reductionPercentage: "-90.9%",
      
      // Mandatory Stage 11 Dimensions
      resolutionStatus: "Verified Remediated",
      monitoringPeriod: "14-Day Post-Intervention Audit (Sep 18 – Oct 02, 2026)",
      currentTrend: "Stabilized Nominal Baseline (-90.9%)",
      trendStatus: "improving",
      
      // Quantified ROI Impact
      financialSavings: "$485,000",
      avertedDowntimeHours: 54,
      secondaryFaultsAvoided: "Cleanroom positive pressure loss and silicon wafer batch contamination",
      
      timelineDays: ["Day -5", "Day -4", "Day -3", "Day -2", "Day -1", "Day 0 (Action)", "Day +1", "Day +2", "Day +3", "Day +4", "Day +5"],
      beforeTrendValues: [0.5, 0.9, 1.4, 1.9, 2.4, 2.4],
      afterTrendValues: [2.4, 1.0, 0.5, 0.2, 0.1, 0.08],
      dailySignals: [1, 2, 2, 3, 3, 2, 1, 1, 0, 0, 0],
      
      telemetryStreams: [
        { name: "High-Frequency Envelope Peak Value", preVal: "6.8 g-pk (Spalling)", postVal: "0.4 g-pk (Smooth)", delta: "-94.1%", status: "Nominal" },
        { name: "Cleanroom Differential Static Pressure", preVal: "+18 Pa (Dipping to 12)", postVal: "+24 Pa (Rock solid)", delta: "+12 Pa margin", status: "Nominal" },
        { name: "Airlock Particulate Count (Class 100)", preVal: "82 particles/m³", postVal: "8 particles/m³", delta: "-90.2%", status: "Nominal" }
      ],

      verificationNotes: "Differential cleanroom pressure maintained within sterile ISO 5 requirements continuously. Pillow block bearing operating temperature settled at 44°C (down from 68°C). Zero particulate excursion logged."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.IMPACT_MONITORING_DATA = IMPACT_MONITORING_DATA;
}

export { IMPACT_MONITORING_DATA };
