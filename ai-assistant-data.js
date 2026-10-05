/**
 * EarlySight — AI Assistant Knowledge Base & Organization Data (Stage 9)
 * 
 * Provides structured plant ontology, cross-silo evidence records,
 * pre-computed analytical responses with inline SVG charts, evidence references,
 * and related alert linkages.
 */

const AI_ASSISTANT_KNOWLEDGE_BASE = {
  organization: {
    facilityName: "Advanced Manufacturing Quad — Facility 04",
    monitoredAssets: 148,
    activeSensors: 840,
    activeSignals: 54,
    leadTimeLeadAverageDays: 14.8,
    totalAvertedLoss2026: "$2,840,000",
    activeZones: ["Block A (Machining)", "Block B (Electronics)", "Block C (Extrusion)", "Power Island", "Logistics", "Chemical Env"]
  },

  suggestedQuestions: [
    {
      id: "q-increasing",
      label: "Which problems are increasing?",
      category: "Trend & Velocity",
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
      queryText: "Which problems are increasing?"
    },
    {
      id: "q-highest-risk",
      label: "What are the highest-risk locations?",
      category: "Geospatial Intelligence",
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
      queryText: "What are the highest-risk locations?"
    },
    {
      id: "q-why-block-a",
      label: "Why was Block A flagged?",
      category: "Evidence Explanation",
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      queryText: "Why was Block A flagged?"
    },
    {
      id: "q-recurring-maint",
      label: "Show recurring maintenance issues.",
      category: "Recurrence Tracking",
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
      queryText: "Show recurring maintenance issues."
    },
    {
      id: "q-prioritize-today",
      label: "What should we prioritize today?",
      category: "Action Prioritization",
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      queryText: "What should we prioritize today?"
    }
  ],

  initialHistory: [
    {
      id: "hist-01",
      query: "Which problems are increasing?",
      timestamp: "Today, 10:14 AM",
      category: "Trend & Velocity",
      pinned: true
    },
    {
      id: "hist-02",
      query: "Why was Block A flagged?",
      timestamp: "Today, 08:42 AM",
      category: "Evidence Explanation",
      pinned: false
    },
    {
      id: "hist-03",
      query: "What are the highest-risk locations?",
      timestamp: "Yesterday, 04:30 PM",
      category: "Geospatial Intelligence",
      pinned: true
    },
    {
      id: "hist-04",
      query: "What should we prioritize today?",
      timestamp: "Sep 26, 11:15 AM",
      category: "Action Prioritization",
      pinned: false
    }
  ],

  // Structured Knowledge Responses
  responses: {
    // 1. What problems are increasing this week?
    "increasing_problems": {
      topic: "Velocity & Frequency Acceleration",
      headline: "2 Emerging Problems Show Severe Velocity Acceleration This Week",
      executiveSummary: "Which problems are increasing:\n\n• Water Leakage Pattern (Block A): 12 related signals, surging from 2 (Week 1) to 12 (Week 4), representing a +500% velocity surge.\n• HVAC Failure Trend (Engineering Building): 8 related signals, differential pressure flutter increasing (+3.4 events/day).\n• Bearing Spallation Precursors: 3,420 Hz envelope harmonic accelerating +2.84σ over past 72 hours.",
      
      chartData: {
        type: "velocity_bar_chart",
        title: "Daily Precursor Arrival Velocity (Signals / Day)",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun (Today)"],
        values: [0.4, 0.6, 0.8, 1.4, 2.2, 3.1, 4.8],
        trendLabel: "+340% Acceleration Trajectory"
      },

      evidenceReferences: [
        {
          id: "ref-complaints-8",
          type: "Operator Logs",
          title: "8 Shift Complaints (Bay 4 / Cell C)",
          snippet: "Acoustic hiss audible through hearing protection; localized water puddles under raceway 4B.",
          source: "Floor Shift Logs • Shift A/B/C",
          fullDetail: "8 independent complaints filed over 14 days by operators M. Kovacs, J. Chen, and R. Vance noting acoustic hiss and floor dampness near Trench 4B conduit."
        },
        {
          id: "ref-cmms-3",
          type: "Maintenance",
          title: "3 CMMS Work Orders (WO-2026-7812, 7540, 7201)",
          snippet: "18L unmetered sump accumulation; minor rust blooming on flange 4B-12 lower studs.",
          source: "CMMS Asset System",
          fullDetail: "WO-2026-7812 noted lower flange stud corrosion; WO-2026-7540 recorded 18 liters unmetered sump runoff; WO-2026-7201 logged transient booster pressure bounce."
        },
        {
          id: "ref-ultrasonic-c",
          type: "Acoustic IoT",
          title: "48 kHz Ultrasonic Spikes (Valve PV-02)",
          snippet: "Micro-bubble cavitation implosion frequencies doubled from 22 kHz to 48 kHz in 72 hours.",
          source: "High-Frequency Transducer AE-04",
          fullDetail: "Sensor AE-04 at Press Station #2 detected rapid acoustic bursts matching hardened spool cavitation erosion signatures."
        }
      ],

      relatedAlerts: [
        {
          id: "EW-2026-088",
          title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
          location: "Block A — Trench 4B / Bay 4",
          severity: "Critical",
          leadTime: "14.2 Days",
          avertedLoss: "$512,000",
          confidence: "87% (Evidence Strength)",
          linkPage: "evidence.html"
        },
        {
          id: "EW-2026-094",
          title: "Hydraulic Proportional Valve Cavitation Drift",
          location: "Block C — Press Station #2",
          severity: "High",
          leadTime: "12.0 Days",
          avertedLoss: "$340,000",
          confidence: "91.2% (Evidence Strength)",
          linkPage: "evidence.html"
        }
      ],

      suggestedFollowUps: [
        "Show emerging issues in Block A.",
        "Why was this warning generated?",
        "Which issues require investigation?"
      ]
    },

    // 2. Show emerging issues in Block A
    "block_a_issues": {
      topic: "Facility Quad Block A Spatial Convergence",
      headline: "Block A Appears to be the Highest Emerging Risk",
      executiveSummary: "Block A appears to be the highest emerging risk.\n\nEvidence:\n• 12 related signals\n• 3-week recurrence\n• Increasing frequency\n• High severity\n• 91% confidence\n\nAll precursors in Block A are localized within an 8.5-meter radius along utility trench 4B, adjacent to Cleanroom Cell C and Assembly Bay 4. Volumetric moisture in sub-slab probe SM-4B has reached 68.4% (+44% over dry baseline), threatening structural foundations and high-speed CNC cable conduits.",
      
      chartData: {
        type: "spatial_risk_radial",
        title: "Block A Multi-Modal Signal Co-Location",
        items: [
          { name: "Flange 4B-12 Moisture", pct: 88, color: "#C85A32" },
          { name: "Booster Pump P-102 Shock", pct: 76, color: "#B87333" },
          { name: "Cleanroom Cell C Humidity", pct: 64, color: "#5E7E6C" },
          { name: "Bay 4 Operator Complaints", pct: 92, color: "#C85A32" }
        ],
        trendLabel: "8.5m Spatial Dispersion Radius"
      },

      evidenceReferences: [
        {
          id: "ref-sm4b-moisture",
          type: "Subsurface Telemetry",
          title: "Soil Moisture Probe SM-4B: 68.4% VWC",
          snippet: "Volumetric water content elevated 44% above nominal dry baseline (24%).",
          source: "Sub-slab Environmental Array",
          fullDetail: "Probe SM-4B installed at -1.2m depth under Bay 4 concrete footing confirms active subterranean fluid migration from joint 4B-12."
        },
        {
          id: "ref-flir-plume",
          type: "Thermal Imaging",
          title: "FLIR Plume: 14.8°C Sub-Floor Cold Anomaly",
          snippet: "Localized chill plume traces 6.4 meters down conduit raceway towards Cell C boundary.",
          source: "Shift B Thermal Survey",
          fullDetail: "Handheld FLIR E96 thermography revealed 14.8°C cold footprint corresponding to pressurized municipal chilled water line breach."
        },
        {
          id: "ref-p102-cycling",
          type: "SCADA Telemetry",
          title: "Booster Pump P-102 Short-Cycling (+18 cycles/hr)",
          snippet: "Pressure transducer PT-102 registered transient -1.4 bar suction line shock.",
          source: "Auxiliary Fluid SCADA",
          fullDetail: "Booster pump short-cycling indicates hydraulic accumulator membrane pressure decay, inducing line water hammer."
        }
      ],

      relatedAlerts: [
        {
          id: "EW-2026-088",
          title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
          location: "Block A — Trench 4B / Bay 4",
          severity: "Critical",
          leadTime: "14.2 Days",
          avertedLoss: "$512,000",
          confidence: "87% (Evidence Strength)",
          linkPage: "evidence.html"
        }
      ],

      suggestedFollowUps: [
        "Why was this warning generated?",
        "Show related reports for this issue.",
        "Which issues require investigation?"
      ]
    },

    // 3. Why was this warning generated?
    "why_warning_generated": {
      topic: "Causal Explainability & Evidence Synthesis",
      headline: "5 Independent Operational Streams Converged with Exponential Velocity",
      executiveSummary: "This warning was generated because 5 historically disconnected data silos converged in the exact same 8.5-meter sub-slab corridor in Block A. Legacy SCADA systems missed it because single-point telemetry did not exceed high-level trip thresholds. EarlySight cross-correlated operator complaints, CMMS work orders, soil moisture, transducer transients, and historical disaster patterns.",
      
      chartData: {
        type: "evidence_weights_pie",
        title: "Evidence Strength Decomposition (Why Confidence = 87%)",
        items: [
          { name: "Complaints & Logs (30%)", contrib: "+0.28", color: "#C85A32" },
          { name: "Spatial Co-Location (25%)", contrib: "+0.22", color: "#5E7E6C" },
          { name: "Velocity Surge (20%)", contrib: "+0.19", color: "#C85A32" },
          { name: "Transducer Phase Correlation (15%)", contrib: "+0.10", color: "#B87333" },
          { name: "Historical Signature (10%)", contrib: "+0.08", color: "#1B4332" }
        ],
        trendLabel: "Confidence = 87% (Evidence Strength, NOT Failure Certainty)"
      },

      evidenceReferences: [
        {
          id: "ref-scada-blindspot",
          type: "System Architecture",
          title: "Legacy SCADA Blindspot Analysis",
          snippet: "Legacy alarm setpoint is 120 mm sump float switch. Current level is 18 mm, meaning SCADA would not trip for 14.2 more days.",
          source: "SCADA Alarm Philosophy Audit",
          fullDetail: "By relying strictly on high-level float trips, traditional DCS systems fail to detect sub-slab accumulation until water breaches electrical raceways."
        },
        {
          id: "ref-root-cause",
          type: "Failure Physics",
          title: "EPDM Elastomer Embrittlement Hypothesis",
          snippet: "Periodic chloramine exposure combined with hydraulic pressure shock caused micro-fissuring of flange 4B-12 gasket seal.",
          source: "Materials Engineering Diagnostics",
          fullDetail: "Gasket installed in 2021 reached physical hardening threshold (Shore 88A vs 70A nominal), failing to absorb booster pump start-up pulses."
        },
        {
          id: "ref-action-prescriptive",
          type: "Prescriptive Action",
          title: "Recommended Work Order: WO-2026-8841",
          snippet: "Replace with Viton gasket ring during scheduled 45-minute shift changeover.",
          source: "Reliability Engineering Dispatch",
          fullDetail: "Replacing flange seal with chemical-resistant Viton FKM eliminates risk of unmitigated trench inundation, protecting $512,000 in cleanroom equipment."
        }
      ],

      relatedAlerts: [
        {
          id: "EW-2026-088",
          title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
          location: "Block A — Trench 4B / Bay 4",
          severity: "Critical",
          leadTime: "14.2 Days Remaining",
          avertedLoss: "$512,000",
          confidence: "87% (Evidence Strength)",
          linkPage: "evidence.html"
        }
      ],

      suggestedFollowUps: [
        "Show related reports for this issue.",
        "What problems are increasing this week?",
        "Which issues require investigation?"
      ]
    },

    // 4. Which issues require investigation?
    "investigation_priorities": {
      topic: "Prioritized Operational Risk Ranking",
      headline: "3 Urgent Issues Ranked by Lead-Time Horizon & Financial Exposure",
      executiveSummary: "Based on active signal velocity, unmitigated downtime impact, and evidence confidence, 3 issues require immediate dispatch or investigation. Top priority is Alert EW-2026-088 due to proximity to the ISO 5 Cleanroom Cell C boundary.",
      
      chartData: {
        type: "priority_ranked_bars",
        title: "Risk Exposure & Lead Time Urgency Matrix",
        items: [
          { rank: "#1", asset: "Flange 4B-12 Seepage (Block A)", leadTime: "14.2 Days", loss: "$512,000", conf: "87%", color: "#C85A32" },
          { rank: "#2", asset: "Valve PV-02 Cavitation (Block C)", leadTime: "12.0 Days", loss: "$340,000", conf: "91.2%", color: "#C85A32" },
          { rank: "#3", asset: "Turbine Bearing Cage Drift (Power Island)", leadTime: "22.5 Days", loss: "$185,000", conf: "82.4%", color: "#5E7E6C" }
        ],
        trendLabel: "Combined Potential Loss: $1,037,000"
      },

      evidenceReferences: [
        {
          id: "ref-cell-c-cleanroom",
          type: "Impact Risk",
          title: "Cleanroom Cell C Contamination Hazard",
          snippet: "Sub-slab moisture migration within 3.2 meters of Class 100 sterile boundary.",
          source: "Cleanroom Environmental Monitoring",
          fullDetail: "A floor breach would halt silicon fabrication, resulting in $65,000 per hour unrecoverable production downtime."
        },
        {
          id: "ref-valve-spool",
          type: "Machinery Risk",
          title: "Valve PV-02 Spool Sticking Probability: 78%",
          snippet: "14ms hysteresis lag indicates imminent hydraulic cylinder ram stall.",
          source: "Hydraulic Fluid Power Diagnostics",
          fullDetail: "Metal spalling particles detected in fluid sample verify active cavitation erosion on metering edges."
        }
      ],

      relatedAlerts: [
        {
          id: "EW-2026-088",
          title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
          location: "Block A — Trench 4B / Bay 4",
          severity: "Critical",
          leadTime: "14.2 Days Remaining",
          avertedLoss: "$512,000",
          confidence: "87% (Evidence Strength)",
          linkPage: "evidence.html"
        },
        {
          id: "EW-2026-094",
          title: "Hydraulic Proportional Valve Cavitation Drift",
          location: "Block C — Press Station #2",
          severity: "High",
          leadTime: "12.0 Days Remaining",
          avertedLoss: "$340,000",
          confidence: "91.2% (Evidence Strength)",
          linkPage: "evidence.html"
        }
      ],

      suggestedFollowUps: [
        "Show emerging issues in Block A.",
        "Why was this warning generated?",
        "Show related reports for this issue."
      ]
    },

    // 5. Show related reports for this issue
    "related_reports": {
      topic: "Cross-Departmental Evidence Dossier",
      headline: "8 Operator Logs, 3 CMMS Tickets & Historical Disaster Signature Corroborated",
      executiveSummary: "Corroborated evidence pack for Alert EW-2026-088 (Flange 4B-12 Micro-Leakage). NLP semantic analysis linked 8 verbal/written shift reports spanning 3 rotations with 3 isolated maintenance tickets and the Nov 2024 unmitigated trench incident archive.",
      
      chartData: {
        type: "evidence_timeline_strip",
        title: "Multi-Source Precursor Timeline (Aug 29 — Sep 14)",
        events: [
          { date: "Aug 29", type: "CMMS", desc: "WO-7201 Transducer recalibration" },
          { date: "Aug 31", type: "Shift Log", desc: "Acoustic hiss reported beneath grating" },
          { date: "Sep 06", type: "CMMS", desc: "WO-7540 Trench sump 18L accumulation" },
          { date: "Sep 11", type: "Shift Log", desc: "Operator damp socks in Cell C airlock" },
          { date: "Sep 13", type: "Shift Log", desc: "High-pitch hiss + water puddle Bay 4" },
          { date: "Sep 14", type: "EarlySight", desc: "Alert EW-2026-088 Generated (87% Conf)" }
        ],
        trendLabel: "16-Day Multi-Silo Correlation Chain"
      },

      evidenceReferences: [
        {
          id: "ref-verbatim-01",
          type: "Shift Transcript",
          title: "Sep 13 • 22:15 — M. Kovacs (Shift C Operator)",
          snippet: "\"Noticed persistent high-pitch hiss near Assembly Bay 4 feed conduit during idle cycle. Cleaned small water puddle under conduit raceway.\"",
          source: "Shift C Electronic Logbook",
          fullDetail: "Operator identified physical fluid pool under conduit tray. Initially suspected pneumatic airline condensation."
        },
        {
          id: "ref-cmms-7812",
          type: "CMMS Work Order",
          title: "WO-2026-7812 — G. Ramirez (Mechanical Maintenance)",
          snippet: "\"Tightened bolts on adjacent drainage line; noted flange 4B-12 showed minor rust blooming on lower studs.\"",
          source: "CMMS Asset History",
          fullDetail: "Maintenance technician observed rust discoloration on studs but lacked cross-domain sensor data to diagnose active flange gasket failure."
        },
        {
          id: "ref-hist-2024",
          type: "Disaster Archive",
          title: "Nov 14, 2024 Incident: Unmitigated Trench Inundation",
          snippet: "46 Hours Plant Stoppage • $1,420,000 Damage. Identical 4-stage precursor sequence.",
          source: "Facility Root Cause Review Archive",
          fullDetail: "Historical similarity score of 94.2% cosine match. In 2024, identical acoustic hiss was ignored until pressurized line burst, submerging drive motor pits."
        }
      ],

      relatedAlerts: [
        {
          id: "EW-2026-088",
          title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
          location: "Block A — Trench 4B / Bay 4",
          severity: "Critical",
          leadTime: "14.2 Days Remaining",
          avertedLoss: "$512,000",
          confidence: "87% (Evidence Strength)",
          linkPage: "evidence.html"
        }
      ],

      suggestedFollowUps: [
        "Why was this warning generated?",
        "What problems are increasing this week?",
        "Show emerging issues in Block A."
      ]
    }
  },

  // Dynamic Query Matcher
  findResponse: function(userQuery) {
    const q = (userQuery || "").toLowerCase();

    if (q.includes("increasing") || q.includes("this week") || q.includes("frequency") || q.includes("accelerat") || q.includes("surge") || q.includes("velocity")) {
      return this.responses["increasing_problems"];
    }
    if (q.includes("block a") || q.includes("location") || q.includes("bay 4") || q.includes("flange") || q.includes("water") || q.includes("trench")) {
      return this.responses["block_a_issues"];
    }
    if (q.includes("why") || q.includes("generated") || q.includes("warning") || q.includes("explain") || q.includes("cause") || q.includes("scada")) {
      return this.responses["why_warning_generated"];
    }
    if (q.includes("investigat") || q.includes("priorit") || q.includes("which") || q.includes("urgency") || q.includes("action") || q.includes("ranked")) {
      return this.responses["investigation_priorities"];
    }
    if (q.includes("report") || q.includes("related") || q.includes("complaint") || q.includes("work order") || q.includes("cmms") || q.includes("log") || q.includes("shift")) {
      return this.responses["related_reports"];
    }

    // Default intelligent fallback synthesis
    return {
      topic: "Cross-Silo Operations Search",
      headline: `Analysis for "${userQuery}"`,
      executiveSummary: `EarlySight scanned 54 active telemetry signals, 12 CMMS work orders, and 18 operator logs for "${userQuery}". The closest operational correlation relates to Alert EW-2026-088 (Block A Water Infrastructure Micro-Leakage, 87% confidence) and Alert EW-2026-094 (Block C Hydraulic Valve Cavitation, 91.2% confidence).`,
      chartData: {
        type: "priority_ranked_bars",
        title: "Correlated Operational Risks",
        items: [
          { rank: "#1", asset: "Block A Trench 4B Flange Seepage", leadTime: "14.2 Days", loss: "$512,000", conf: "87%", color: "#C85A32" },
          { rank: "#2", asset: "Block C Press Station Valve Cavitation", leadTime: "12.0 Days", loss: "$340,000", conf: "91.2%", color: "#C85A32" }
        ],
        trendLabel: "Multi-Modal Operational Correlation"
      },
      evidenceReferences: [
        {
          id: "ref-gen-1",
          type: "Shift Logs",
          title: "8 Operator Shift Complaints (Block A)",
          snippet: "Acoustic hiss and floor moisture noted across 3 rotations.",
          source: "Shift Logs",
          fullDetail: "Correlated operator observations indicating pressurized fluid breach."
        },
        {
          id: "ref-gen-2",
          type: "CMMS",
          title: "WO-2026-7812 Flange Stud Wear",
          snippet: "Corrosion blooming logged on lower flange studs.",
          source: "CMMS Work Orders",
          fullDetail: "Corroborated maintenance ticket linking to active joint degradation."
        }
      ],
      relatedAlerts: [
        {
          id: "EW-2026-088",
          title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
          location: "Block A — Trench 4B / Bay 4",
          severity: "Critical",
          leadTime: "14.2 Days Remaining",
          avertedLoss: "$512,000",
          confidence: "87% (Evidence Strength)",
          linkPage: "evidence.html"
        }
      ],
      suggestedFollowUps: [
        "What problems are increasing this week?",
        "Show emerging issues in Block A.",
        "Why was this warning generated?"
      ]
    };
  }
};

window.AI_ASSISTANT_KNOWLEDGE_BASE = AI_ASSISTANT_KNOWLEDGE_BASE;
