/**
 * EarlySight — Multi-Organization Workspace Dataset (Stage 12)
 * 
 * Defines strict per-tenant data structures ensuring absolute workspace separation.
 * Organizations:
 * 1. ABC College (Higher Education & Academic Facilities)
 * 2. City Hospital (Tertiary Healthcare, Surgical Theatres & Life Support)
 * 3. Green Residency (Eco-Luxury Smart Residential Community)
 * 4. Apex Industrial Fab 04 (Advanced Semiconductor & Mechanical Manufacturing)
 * 
 * Each tenant encapsulates its own:
 * - Dashboard & Executive KPIs
 * - Multi-Modal Signals
 * - Emerging Risk Alerts
 * - Teams & Engineering Personnel
 * - Audited Compliance & Incident Reports
 * - Predictive Analytics & Lead-Time Metrics
 * - Scoped AI Assistant Knowledge Base & Prompts
 */

const MULTI_ORG_DATA = {
  activeTenantId: "org-abc-college",

  tenants: {
    // =========================================================================
    // 1. ABC COLLEGE — Campus & Academic Facilities
    // =========================================================================
    "org-abc-college": {
      id: "org-abc-college",
      tenantCode: "TENANT-EDU-01",
      name: "ABC College",
      category: "Higher Education & Academic Campus",
      shortDesc: "Main Academic Quad, Science Laboratories & Residence Halls",
      location: "North Campus, Gate 4 • 14 Buildings • 18,500 Students",
      facilityManager: "Dr. Arthur Campbell (Director of Campus Facilities)",
      securityTier: "SOC2 Type II • Academic FERPA/Data Air-Gapped",
      themeColor: "#1D4ED8", // Oxford Blue
      themeAccent: "#F59E0B", // Academic Amber/Gold
      badgeClass: "badge-org-blue",
      logoIconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
      
      // Executive KPIs
      kpis: {
        totalMonitoredAssets: 86,
        activeSensors: 420,
        activeWeakSignals: 14,
        criticalAlertsCount: 2,
        meanLeadTimeDays: 16.4,
        avertedDisruptionCost: "$485,000",
        studentComfortIndex: "98.2%",
        sustainabilityRating: "LEED Gold Certified"
      },

      // Dashboard Overview Data
      dashboard: {
        facilityZones: [
          { name: "Science & Engineering Complex", assetCount: 28, status: "Active Watch", signals: 7, leadRisk: "Chemistry Lab Fume Scrubber Delta-P Drift" },
          { name: "Central Humanities Library", assetCount: 16, status: "Nominal", signals: 2, leadRisk: "Rare Book Vault Micro-Humidity Excursion" },
          { name: "Main Dining & Food Services", assetCount: 12, status: "Nominal", signals: 1, leadRisk: "Walk-in Freezer Compressor Vibration" },
          { name: "Freshman Residence Quad (Halls A-D)", assetCount: 18, status: "Investigation", signals: 4, leadRisk: "Booster Pump #2 Cyclic Pulsation" },
          { name: "Campus Central Heating Plant", assetCount: 12, status: "Nominal", signals: 0, leadRisk: "All thermal telemetry nominal" }
        ],
        recentMilestone: "Averted catastrophic chemical lab shutdown during midterm exams via 18-day advance predictive scrubber warning."
      },

      // Signals (Campus Specific)
      signals: [
        {
          id: "SIG-EDU-101",
          title: "Chemistry Lab Exhaust Scrubber Delta-P Flutter",
          location: "Science Complex — Lab Wing B / Floor 3",
          modality: "IoT Differential Pressure",
          frequency: "3.4 events / day (Surging)",
          trend: "increasing",
          severity: "High",
          timestamp: "18 minutes ago",
          source: "Sensor DP-SCI-03",
          crossSiloNote: "Correlated with 4 graduate student odor nuisance shift tickets logged via Campus Safety portal."
        },
        {
          id: "SIG-EDU-102",
          title: "Rare Book Archive Humidity Micro-Excursion",
          location: "Central Library — Sub-Basement Archive Vault",
          modality: "IoT Hygro-Thermal Probe",
          frequency: "1.2 events / day",
          trend: "stable",
          severity: "Medium",
          timestamp: "1 hour ago",
          source: "Probe RH-LIB-02",
          crossSiloNote: "Chilled water coil inlet valve lagging 8.4 seconds behind PID demand schedule."
        },
        {
          id: "SIG-EDU-103",
          title: "Student Dorm Quad Hot Water Booster Cavitation",
          location: "Hall C — Mechanical Basement",
          modality: "Acoustic Transducer",
          frequency: "4.1 events / day",
          trend: "increasing",
          severity: "High",
          timestamp: "3 hours ago",
          source: "Sensor AC-DORM-04",
          crossSiloNote: "Matched 9 resident student complaints regarding erratic morning shower pressure."
        },
        {
          id: "SIG-EDU-104",
          title: "Lecture Hall 101 Air Handler Blower V-Belt Squeal",
          location: "Humanities Hall — Rooftop Penthouse AHU-01",
          modality: "Vibration Sensor",
          frequency: "0.8 events / day",
          trend: "decreasing",
          severity: "Low",
          timestamp: "6 hours ago",
          source: "VIB-AHU-101",
          crossSiloNote: "Belts tensioned during last quarterly PM; slight pulley pitch alignment drift remaining."
        },
        {
          id: "SIG-EDU-105",
          title: "Campus Substation #2 Transformer Oil Dissolved Gas Drift",
          location: "Electrical Substation East",
          modality: "Dissolved Gas Analyzer (DGA)",
          frequency: "0.4 events / day",
          trend: "watch",
          severity: "Medium",
          timestamp: "Yesterday",
          source: "DGA-XFMR-02",
          crossSiloNote: "Hydrogen levels rose from 14 PPM to 28 PPM during campus heat wave peak chiller load."
        }
      ],

      // Alerts (Campus Specific)
      alerts: [
        {
          id: "ALR-EDU-081",
          title: "Science Complex Lab Acid Fume Exhaust Impairment",
          location: "Science Complex — Roof Scrubber Fan 02",
          severity: "Critical P1",
          countdownLeadTime: "12.4 Days Lead",
          confidence: "89.2%",
          affectedStakeholders: "380 Chemistry undergrads & 14 faculty researchers",
          rootCauseHypothesis: "Chemical particulate buildup on variable inlet guide vanes causing motor stator current hunting and imminent stall.",
          recommendedAction: "Dispatch HVAC lead to flush scrubber spray nozzles and clean guide vane linkages during weekend academic hiatus.",
          status: "Under Engineering Review",
          leadTimeSavings: "$210,000 in spoiled synthetic research assays"
        },
        {
          id: "ALR-EDU-082",
          title: "Freshman Dorm Domestic Hot Water Loop Siphon Risk",
          location: "Quad Residence Hall C/D Domestic Loop",
          severity: "High P2",
          countdownLeadTime: "9.1 Days Lead",
          confidence: "84.5%",
          affectedStakeholders: "820 On-campus dormitory residents",
          rootCauseHypothesis: "Check valve CV-04 spring fatigue allowing cold water thermal siphoning back into recirc loop.",
          recommendedAction: "Isolate bypass circuit and replace check valve with silent spring-assisted wafer unit.",
          status: "Assigned to Plumbing Squad",
          leadTimeSavings: "$65,000 in emergency plumbing overtime & temporary hoteling"
        }
      ],

      // Teams (Campus Specific)
      teams: [
        {
          id: "TEAM-EDU-01",
          name: "Campus HVAC & Thermal Utilities",
          lead: "Marcus Henderson (PE, Chief Thermal Engineer)",
          membersCount: 8,
          shiftCoverage: "24/7 On-Call Campus Response",
          activeTickets: 3,
          specialties: "Chillers, Boilers, Fume Hoods, Clean Steam",
          contact: "radio: Ch-4 • Ext 4410"
        },
        {
          id: "TEAM-EDU-02",
          name: "Academic Lab Safety & HAZMAT Support",
          lead: "Dr. Elena Rostova (Campus Chemical Hygiene Officer)",
          membersCount: 5,
          shiftCoverage: "Day Shift + Emergency HAZMAT Duty",
          activeTickets: 2,
          specialties: "Acid Scrubbers, Gas Leak Detection, Fume Extractors",
          contact: "radio: Ch-9 • Ext 8812"
        },
        {
          id: "TEAM-EDU-03",
          name: "Campus Electrical & Power Substation Squad",
          lead: "Dwight Turner (Master Electrician)",
          membersCount: 6,
          shiftCoverage: "Rotating 2-Shift Schedule",
          activeTickets: 1,
          specialties: "13.8kV Grid Distribution, Backup Diesel Gensets, Solar Inverters",
          contact: "radio: Ch-2 • Ext 4415"
        },
        {
          id: "TEAM-EDU-04",
          name: "Dormitory & Residential MEP Squad",
          lead: "Carmen Vega (Residential Maintenance Supervisor)",
          membersCount: 11,
          shiftCoverage: "3 Shifts Round-the-Clock",
          activeTickets: 4,
          specialties: "Domestic Water, Elevators, Fire Dampers, Plumbing",
          contact: "radio: Ch-5 • Ext 3300"
        }
      ],

      // Reports (Campus Specific)
      reports: [
        {
          id: "REP-EDU-2026-09",
          title: "Quarterly Science Complex Air Quality & Lab Scrubber Audit",
          date: "Sep 22, 2026",
          author: "Dr. Elena Rostova",
          complianceCode: "OSHA 1910.1450 Lab Standard",
          summary: "Verified 42 fume hoods compliant with face velocity specs (>100 FPM). Recommended preventive cleaning on Rooftop Scrubber 02.",
          status: "Audited & Certified"
        },
        {
          id: "REP-EDU-2026-08",
          title: "Campus Energy Efficiency & Thermal Chilled Water Assessment",
          date: "Sep 15, 2026",
          author: "Marcus Henderson",
          complianceCode: "State Energy Decarbonization Mandate",
          summary: "Chilled water reset saved 14,200 kWh across humanities lecture halls. Identified minor valve delay in library branch.",
          status: "Filed with Provost"
        },
        {
          id: "REP-EDU-2026-07",
          title: "Residence Quad Domestic Water Pressure Investigation",
          date: "Sep 10, 2026",
          author: "Carmen Vega",
          complianceCode: "Municipal Plumbing & Health Code",
          summary: "Traced student pressure complaints to booster pump check valve CV-04 micro-leakage. Replacement scheduled.",
          status: "Action In Progress"
        }
      ],

      // Analytics (Campus Specific)
      analytics: {
        avgLeadTimeDays: 16.4,
        avertedCost2026: "$485,000",
        campusUptimePct: "99.85%",
        emergencyDisruptionsAverted: 8,
        complianceScore: "99.4%",
        monthlySavings: [
          { month: "May", amount: "$38,000" },
          { month: "Jun", amount: "$72,000" },
          { month: "Jul", amount: "$94,000" },
          { month: "Aug", amount: "$141,000" },
          { month: "Sep", amount: "$140,000" }
        ],
        riskBreakdown: [
          { category: "Lab & Chemical Safety", pct: 45, color: "#1D4ED8" },
          { category: "Dorm MEP & Plumbing", pct: 30, color: "#F59E0B" },
          { category: "Campus Power & HV", pct: 15, color: "#10B981" },
          { category: "HVAC & Thermal", pct: 10, color: "#6366F1" }
        ]
      },

      // AI Assistant (Campus Scoped)
      aiAssistant: {
        workspaceIdentity: "ABC College Campus Operations Intelligence Copilot",
        welcomeMessage: "Hello Dr. Campbell. I am scoped strictly to ABC College campus infrastructure, chemistry laboratories, residence halls, and academic buildings. How can I assist with campus operations today?",
        suggestedPrompts: [
          "What campus buildings have increasing HVAC issues?",
          "Show chemistry lab exhaust safety status.",
          "Check student dorm water pressure complaints.",
          "Which campus assets have upcoming preventive deadlines?"
        ],
        knowledgeBaseAnswers: {
          "What campus buildings have increasing HVAC issues?": {
            headline: "HVAC Velocity Surge Detected in Science Complex (Lab Wing B)",
            text: "Precursor signals for Chemistry Lab Exhaust Scrubber 02 have climbed from 0.8 to 3.4 events/day over the last 72 hours. This is correlated with 4 graduate student odor complaints. Human Humanities AHU-01 is stabilizing.",
            kpiPills: ["Science Wing B: 3.4/day", "Library: Nominal", "Dorm C: Watch"],
            referenceTag: "Campus Facilities Log #EDU-2026-88"
          },
          "Show chemistry lab exhaust safety status.": {
            headline: "Chemistry Lab Exhaust: Early Warning ALR-EDU-081 Active (89.2% Conf)",
            text: "Differential pressure sensor DP-SCI-03 reports inlet guide vane hunting. OSHA face velocity currently remains safe at 104 FPM, but without preventive cleaning of spray nozzles, air handler stall is projected in 12.4 days.",
            kpiPills: ["Face Velocity: 104 FPM (Safe)", "Lead Time: 12.4 Days", "Action: Weekend Flush"],
            referenceTag: "OSHA 1910 Compliance File SCI-02"
          },
          "Check student dorm water pressure complaints.": {
            headline: "Residence Quad Domestic Water: Cavitation on Booster Pump #2",
            text: "Acoustic transducer AC-DORM-04 registered 4.1 cavitation transients/day. Cross-referenced with 9 student portal complaints from Hall C. Check valve CV-04 is scheduled for wafer valve replacement on Saturday.",
            kpiPills: ["Complaints: 9 logs", "Cavitation: 4.1/day", "Work Order: WO-EDU-4412"],
            referenceTag: "Residential CMMS Ticket #4412"
          }
        }
      }
    },


    // =========================================================================
    // 2. CITY HOSPITAL — Healthcare & Critical Clinical Facilities
    // =========================================================================
    "org-city-hospital": {
      id: "org-city-hospital",
      tenantCode: "TENANT-MED-02",
      name: "City Hospital",
      category: "Tertiary Healthcare & Surgical Care Complex",
      shortDesc: "650-Bed Level 1 Trauma Center, 24 Operating Suites & ICUs",
      location: "Metropolitan Medical District • 3 Clinical Towers",
      facilityManager: "Dr. Raymond Vance (VP of Hospital Clinical Engineering)",
      securityTier: "HIPAA Compliant • JCAHO Life-Safety Air-Gapped",
      themeColor: "#0D9488", // Clinical Teal
      themeAccent: "#EF4444", // Life-Safety Crimson
      badgeClass: "badge-org-teal",
      logoIconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5v14M5 12h14"/></svg>`,

      // Executive KPIs
      kpis: {
        totalMonitoredAssets: 124,
        activeSensors: 980,
        activeWeakSignals: 9,
        criticalAlertsCount: 1,
        meanLeadTimeDays: 21.2,
        avertedDisruptionCost: "$1,450,000",
        studentComfortIndex: "100.0%", // Life-Safety Index
        sustainabilityRating: "JCAHO Gold Seal of Approval"
      },

      // Dashboard Overview Data
      dashboard: {
        facilityZones: [
          { name: "Surgical Suite Core (OR 1–12)", assetCount: 36, status: "Active Watch", signals: 4, leadRisk: "OR Suite 04 Positive Pressure Gradient Dip" },
          { name: "Neonatal & Adult ICU Towers", assetCount: 26, status: "Nominal", signals: 1, leadRisk: "Medical Air Compressor Micro-Duty Cycle Surge" },
          { name: "Cryogenic Oxygen & Gas Farm", assetCount: 18, status: "Nominal", signals: 2, leadRisk: "Liquid O2 Vaporizer Coil 02 Frost Gradient" },
          { name: "Emergency Trauma & Imaging (CT/MRI)", assetCount: 24, status: "Nominal", signals: 1, leadRisk: "MRI Chiller Secondary Loop Pressure Fluctuation" },
          { name: "Life-Safety Emergency Generator Bunker", assetCount: 20, status: "Nominal", signals: 1, leadRisk: "Genset 03 Automatic Transfer Switch Exercise Delay" }
        ],
        recentMilestone: "Averted operating theater emergency decant: detected HEPA laminar flow pressure loss 14 days before surgical sterile envelope violation."
      },

      // Signals (Hospital Specific)
      signals: [
        {
          id: "SIG-MED-201",
          title: "Operating Room Suite 04 Differential Static Pressure Dip",
          location: "Surgical Pavilion — Clean Core OR-04",
          modality: "IoT Static Pressure Transducer",
          frequency: "5.2 events / shift",
          trend: "increasing",
          severity: "Critical",
          timestamp: "12 minutes ago",
          source: "Sensor PT-OR-04",
          crossSiloNote: "Room pressure dropped from +24 Pa to +14 Pa during airlock door cycling. 2 surgical nurse shift logs noted damper flutter."
        },
        {
          id: "SIG-MED-202",
          title: "Bulk Liquid Oxygen Vaporizer Bank Micro-Frost Buildup",
          location: "Utility Yard — Cryogenic Tank Farm",
          modality: "FLIR Thermal Matrix",
          frequency: "1.8 events / day",
          trend: "stable",
          severity: "High",
          timestamp: "45 minutes ago",
          source: "FLIR-O2-01",
          crossSiloNote: "Thermal gradient indicates ambient vaporizer manifold ice bridging during high hospital ventilator demand."
        },
        {
          id: "SIG-MED-203",
          title: "Sterile Processing Autoclave Steam Trap Thermal Leak",
          location: "Central Sterile Supply Department (CSSD)",
          modality: "Ultrasonic Acoustic Sensor",
          frequency: "2.6 events / day",
          trend: "increasing",
          severity: "Medium",
          timestamp: "2 hours ago",
          source: "Sensor AE-CSSD-03",
          crossSiloNote: "Acoustic hiss pattern indicates steam blow-through on Trap ST-12, reducing cycle chamber heat rate."
        },
        {
          id: "SIG-MED-204",
          title: "ICU Medical Vacuum Pump #2 Oil Mist Back-Pressure",
          location: "Clinical Mechanical Sub-Basement",
          modality: "IoT Pressure Transducer",
          frequency: "0.9 events / day",
          trend: "decreasing",
          severity: "Low",
          timestamp: "5 hours ago",
          source: "VAC-PUMP-02",
          crossSiloNote: "Exhaust coalescing filter differential pressure elevated following 3,000h run cycle."
        },
        {
          id: "SIG-MED-205",
          title: "Trauma Bay 1 Emergency Lighting Battery Internal Impedance",
          location: "Emergency Department",
          modality: "Battery Telemetry Monitor",
          frequency: "0.2 events / day",
          trend: "watch",
          severity: "Low",
          timestamp: "Yesterday",
          source: "UPS-EM-01",
          crossSiloNote: "String resistance increased 4.1% above NFPA 110 nominal replacement limit."
        }
      ],

      // Alerts (Hospital Specific)
      alerts: [
        {
          id: "ALR-MED-094",
          title: "OR Suite 04 Sterile Positive Pressure Envelope Degradation",
          location: "Surgical Pavilion — Clean Core OR-04",
          severity: "Critical P1",
          countdownLeadTime: "7.8 Days Lead",
          confidence: "93.4%",
          affectedStakeholders: "Cardiothoracic Surgery Schedule & JCAHO Sterile Compliance",
          rootCauseHypothesis: "VAV terminal box reheat damper actuator motor pinion slipping, failing to maintain 15% minimum clean-room exfiltration air volume.",
          recommendedAction: "Execute calibrated damper actuator replacement during scheduled night decontamination turnover.",
          status: "Active Engineering Priority",
          leadTimeSavings: "$620,000 in cancelled cardiac procedures & sterile recertification"
        },
        {
          id: "ALR-MED-095",
          title: "Cryogenic Oxygen Manifold Auto-Switchover Valve Drift",
          location: "Utility Yard — Main Liquid O2 Reserve",
          severity: "High P2",
          countdownLeadTime: "18.5 Days Lead",
          confidence: "88.1%",
          affectedStakeholders: "65 Intensive Care Ventilator Stations",
          rootCauseHypothesis: "Cryogenic seat seal hardened due to thermal cycling, causing 0.3 bar pressure lag during tank manifold transition.",
          recommendedAction: "Perform heated purge and rebuild secondary regulator train before winter peak clinical demand.",
          status: "Assigned to Biomed Squad",
          leadTimeSavings: "$410,000 in backup cylinder deployment & regulatory citations"
        }
      ],

      // Teams (Hospital Specific)
      teams: [
        {
          id: "TEAM-MED-01",
          name: "Clinical Engineering & Life-Safety",
          lead: "Dr. Raymond Vance (VP Clinical Engineering)",
          membersCount: 14,
          shiftCoverage: "24/7 Immediate Clinical Escalation",
          activeTickets: 2,
          specialties: "OR Pressure, Anesthesia Scavenging, Isolation Suites",
          contact: "radio: MedCode-1 • Ext 9901"
        },
        {
          id: "TEAM-MED-02",
          name: "Medical Gas & Cryogenic Systems Squad",
          lead: "Liam O'Connor (Certified MedGas Inspector)",
          membersCount: 6,
          shiftCoverage: "Continuous Monitoring & Shift Audit",
          activeTickets: 2,
          specialties: "Oxygen, Nitrous Oxide, Medical Vacuum, Compressed Air",
          contact: "radio: MedCode-4 • Ext 9904"
        },
        {
          id: "TEAM-MED-03",
          name: "Emergency Power & Electrical Resilience",
          lead: "Sarah Chen (Critical Power Lead)",
          membersCount: 8,
          shiftCoverage: "Rotating 3 Shifts",
          activeTickets: 1,
          specialties: "3.2MW Diesel Gensets, Isolated Power Panels, UPS",
          contact: "radio: MedCode-2 • Ext 9902"
        },
        {
          id: "TEAM-MED-04",
          name: "Infection Control Facilities Taskforce",
          lead: "Nurse Director Maya Lin (Infection Preventionist)",
          membersCount: 9,
          shiftCoverage: "Day/Evening Clinical Liaison",
          activeTickets: 3,
          specialties: "HEPA Filtration, Autoclave Validation, Water Pathogens",
          contact: "radio: MedCode-7 • Ext 9907"
        }
      ],

      // Reports (Hospital Specific)
      reports: [
        {
          id: "REP-MED-2026-14",
          title: "Joint Commission Sterile Operating Room Positive Pressure Audit",
          date: "Sep 25, 2026",
          author: "Dr. Raymond Vance",
          complianceCode: "NFPA 99 / JCAHO Life Safety 2026",
          summary: "Audited 24 surgical theaters. OR 04 flagged for impending VAV damper slip. Corrective work order issued before sterile breach.",
          status: "Certified Compliant"
        },
        {
          id: "REP-MED-2026-13",
          title: "Medical Gas Pipeline Verification & Cryogenic Reserve Audit",
          date: "Sep 18, 2026",
          author: "Liam O'Connor",
          complianceCode: "NFPA 99 Category 1 Medical Gas",
          summary: "Bulk O2 capacity tested at 14 days emergency reserve. Vaporizer manifold thermal defrost scheduled.",
          status: "Approved by Chief Medical Officer"
        },
        {
          id: "REP-MED-2026-12",
          title: "Emergency Generator 10-Second Transfer Test Certificate",
          date: "Sep 11, 2026",
          author: "Sarah Chen",
          complianceCode: "NFPA 110 Type 10 Emergency Power",
          summary: "All 4 diesel generators achieved 100% emergency load within 7.4 seconds. Zero battery bank deviation.",
          status: "Certified by State Health Dept"
        }
      ],

      // Analytics (Hospital Specific)
      analytics: {
        avgLeadTimeDays: 21.2,
        avertedCost2026: "$1,450,000",
        campusUptimePct: "100.00%",
        emergencyDisruptionsAverted: 11,
        complianceScore: "100.0%",
        monthlySavings: [
          { month: "May", amount: "$180,000" },
          { month: "Jun", amount: "$220,000" },
          { month: "Jul", amount: "$310,000" },
          { month: "Aug", amount: "$380,000" },
          { month: "Sep", amount: "$360,000" }
        ],
        riskBreakdown: [
          { category: "Surgical Sterile Envelopes", pct: 50, color: "#0D9488" },
          { category: "Medical Gas Infrastructure", pct: 25, color: "#EF4444" },
          { category: "Emergency Power & UPS", pct: 15, color: "#F59E0B" },
          { category: "Sterile CSSD Autoclaves", pct: 10, color: "#3B82F6" }
        ]
      },

      // AI Assistant (Hospital Scoped)
      aiAssistant: {
        workspaceIdentity: "City Hospital Clinical Engineering Intelligence Copilot",
        welcomeMessage: "Dr. Vance, EarlySight clinical copilot is online. Operating strictly within City Hospital's HIPAA-compliant, JCAHO Life-Safety isolated workspace. No data is shared across external tenants. What clinical engineering telemetry would you like to review?",
        suggestedPrompts: [
          "Inspect Operating Room 4 positive pressure risk.",
          "Check bulk liquid oxygen vaporizer status.",
          "Show medical gas pipeline integrity audit.",
          "Are emergency generators compliant with NFPA 10-second rule?"
        ],
        knowledgeBaseAnswers: {
          "Inspect Operating Room 4 positive pressure risk.": {
            headline: "OR Suite 04: Positive Pressure Dropping (+24 Pa to +14 Pa)",
            text: "Differential pressure sensor PT-OR-04 exhibits a degrading pressure profile during airlock cycles. Actuator motor pinion on VAV terminal box is slipping. Scheduled for nighttime replacement to prevent surgical cancelations.",
            kpiPills: ["Current: +14 Pa (Minimum: +12.5)", "Lead Time: 7.8 Days", "Confidence: 93.4%"],
            referenceTag: "JCAHO Sterile Record OR-04"
          },
          "Check bulk liquid oxygen vaporizer status.": {
            headline: "Bulk Liquid Oxygen: Vaporizer Bank 2 Ice Bridging Detected",
            text: "Thermal imaging from FLIR-O2-01 indicates frost gradient bridging across secondary manifold fins during peak clinical ventilatory load. Manifold auto-switchover valve exhibits a 0.3 bar pressure lag.",
            kpiPills: ["Liquid Reserve: 14 Days", "Ice Depth: 12 mm", "Action: Scheduled Defrost"],
            referenceTag: "NFPA 99 Cryo Log #O2-881"
          },
          "Check medical gas pipeline integrity audit.": {
            headline: "Medical Gas Pipeline: All 6 Core Streams Within Category 1 Specs",
            text: "Medical Air, Vacuum, Oxygen, N2O, and Nitrogen hold steady line pressures. Central Sterile CSSD steam trap ST-12 shows acoustic leakage, but does not impact surgical patient gas supply.",
            kpiPills: ["O2 Line: 54.2 PSI", "Vacuum: -22.4 inHg", "Med Air: 50.1 PSI"],
            referenceTag: "MedGas Daily Cert Sep 29"
          }
        }
      }
    },


    // =========================================================================
    // 3. GREEN RESIDENCY — Luxury Smart Residential & Real Estate
    // =========================================================================
    "org-green-residency": {
      id: "org-green-residency",
      tenantCode: "TENANT-RES-03",
      name: "Green Residency",
      category: "Eco-Luxury Smart Residential Community",
      shortDesc: "Twin 48-Story Towers, 840 Residential Units & Podium Amenities",
      location: "Bayside District • Tower Alpha & Tower Beta • 3,200 Residents",
      facilityManager: "Julian Thorne (Director of Property & MEP Operations)",
      securityTier: "Tenant Privacy Shield • IoT Smart Building Air-Gapped",
      themeColor: "#059669", // Emerald Eco Green
      themeAccent: "#D97706", // Amber
      badgeClass: "badge-org-emerald",
      logoIconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,

      // Executive KPIs
      kpis: {
        totalMonitoredAssets: 68,
        activeSensors: 380,
        activeWeakSignals: 8,
        criticalAlertsCount: 1,
        meanLeadTimeDays: 18.5,
        avertedDisruptionCost: "$320,000",
        studentComfortIndex: "99.1%", // Resident Satisfaction Index
        sustainabilityRating: "BREEAM Outstanding • Net Zero Ready"
      },

      // Dashboard Overview Data
      dashboard: {
        facilityZones: [
          { name: "Tower Alpha (Floors 1–48)", assetCount: 22, status: "Active Watch", signals: 4, leadRisk: "Elevator Bank #2 Gearless Motor Vibro-Acoustic Flutter" },
          { name: "Tower Beta (Floors 1–48)", assetCount: 20, status: "Nominal", signals: 1, leadRisk: "Domestic Booster Pump VFD Inverter Harmonic Ripple" },
          { name: "Subterranean Parking & Storm Sump", assetCount: 12, status: "Active Watch", signals: 2, leadRisk: "Basement L2 Sump Pump Ingress Rate Transient" },
          { name: "Rooftop Solar & Energy Storage", assetCount: 8, status: "Nominal", signals: 1, leadRisk: "String Inverter 04 Thermal Throttling" },
          { name: "Clubhouse & Leisure Amenities", assetCount: 6, status: "Nominal", signals: 0, leadRisk: "All pool and HVAC systems nominal" }
        ],
        recentMilestone: "Averted high-bay elevator outage during weekend holiday rush: detected traction cable micro-slip 16 days ahead of schedule."
      },

      // Signals (Residential Specific)
      signals: [
        {
          id: "SIG-RES-301",
          title: "Tower Alpha High-Speed Elevator #2 Traction Motor Vibration",
          location: "Tower Alpha — Rooftop Machine Room",
          modality: "IoT Tri-Axial Vibration",
          frequency: "3.8 events / day",
          trend: "increasing",
          severity: "High",
          timestamp: "24 minutes ago",
          source: "Sensor VIB-ELEV-02",
          crossSiloNote: "Peak velocity rose to 4.2 mm/s at 28 Hz. 3 resident concierge complaints logged about subtle cabin shudder during 30th floor express run."
        },
        {
          id: "SIG-RES-302",
          title: "Basement Level 2 Storm Water Sump Ingress Acceleration",
          location: "Sub-Slab Parking Trench — Sump Pit B",
          modality: "Ultrasonic Level Transmitter",
          frequency: "2.1 events / day",
          trend: "increasing",
          severity: "Medium",
          timestamp: "1 hour ago",
          source: "Sensor LVL-SUMP-02",
          crossSiloNote: "Water ingress rate climbed from 4.2 L/min to 14.8 L/min following bay high-tide event."
        },
        {
          id: "SIG-RES-303",
          title: "Penthouse Domestic Water Booster Pump VFD Current Ripple",
          location: "Tower Beta — Mechanical Intermediate Plant",
          modality: "VFD Motor Current Telemetry",
          frequency: "1.4 events / day",
          trend: "stable",
          severity: "Medium",
          timestamp: "3 hours ago",
          source: "VFD-PUMP-03",
          crossSiloNote: "Micro-cavitation pulses detected during evening peak 19:00 bath hours across floors 40-48."
        },
        {
          id: "SIG-RES-304",
          title: "Rooftop Solar Array Inverter 04 DC Bus Voltage Spike",
          location: "Rooftop Solar Deck",
          modality: "Smart Inverter Telemetry",
          frequency: "0.6 events / day",
          trend: "decreasing",
          severity: "Low",
          timestamp: "5 hours ago",
          source: "INV-SOLAR-04",
          crossSiloNote: "DC capacitor ripple stabilized following cloud cover dissipation."
        }
      ],

      // Alerts (Residential Specific)
      alerts: [
        {
          id: "ALR-RES-061",
          title: "Tower Alpha Elevator #2 Gearless Motor Sheave Bearing Drift",
          location: "Tower Alpha Machine Room",
          severity: "Critical P1",
          countdownLeadTime: "11.2 Days Lead",
          confidence: "91.8%",
          affectedStakeholders: "420 Penthouse & Upper-Tower Luxury Residents",
          rootCauseHypothesis: "Drive sheave spherical roller bearing outer race spall inception causing sub-harmonic 28 Hz resonance during high-speed acceleration.",
          recommendedAction: "Execute scheduled sheave bearing swap and traction cable re-grooving during Tuesday 01:00-05:00 low-occupancy window.",
          status: "Work Order WO-RES-7714 Dispatched",
          leadTimeSavings: "$145,000 in emergency elevator crane overhaul & resident hotel credits"
        },
        {
          id: "ALR-RES-062",
          title: "Basement L2 Sump Pump Check Valve Silt Jam Threat",
          location: "Parking Level B2 Sump 02",
          severity: "High P2",
          countdownLeadTime: "14.6 Days Lead",
          confidence: "86.4%",
          affectedStakeholders: "180 Luxury Tenant Vehicles in Basement Parking",
          rootCauseHypothesis: "Fine construction silt accumulation preventing dual flapper check valve from fully seating, causing back-flow recycling.",
          recommendedAction: "Flush silt settlement basin and install vortex solids separator prior to forecast weekend coastal storm.",
          status: "Under Maintenance Scheduling",
          leadTimeSavings: "$175,000 in averted vehicle water damage"
        }
      ],

      // Teams (Residential Specific)
      teams: [
        {
          id: "TEAM-RES-01",
          name: "Smart Building MEP & Energy Operations",
          lead: "Julian Thorne (Property Operations Director)",
          membersCount: 8,
          shiftCoverage: "Day Shift + 24/7 Rapid Incident Dispatch",
          activeTickets: 2,
          specialties: "HVAC Chillers, VFD Booster Pumps, Solar Micro-Grid",
          contact: "app: GreenPortal • Ext 2100"
        },
        {
          id: "TEAM-RES-02",
          name: "Vertical Transportation (Elevators/Lifts) Squad",
          lead: "Kenji Sato (Master Elevator Specialist)",
          membersCount: 4,
          shiftCoverage: "Contracted Otis/Kone Priority On-Site",
          activeTickets: 2,
          specialties: "High-Speed Gearless Traction, Regenerative Drives, Cable Resonance",
          contact: "direct: 555-0192 • Ext 2104"
        },
        {
          id: "TEAM-RES-03",
          name: "Subterranean Drainage & Hydro Systems",
          lead: "Dave Miller (Chief Plumber)",
          membersCount: 5,
          shiftCoverage: "2-Shift + Weather Alert Activation",
          activeTickets: 1,
          specialties: "Sump Pumps, Grease Traps, Storm Retention, Backflow",
          contact: "radio: Resident-Ops 2 • Ext 2102"
        },
        {
          id: "TEAM-RES-04",
          name: "Resident Experience & Smart Concierge",
          lead: "Chloe Dupont (Head Concierge)",
          membersCount: 12,
          shiftCoverage: "24/7 Front Desk & Mobile App Dispatch",
          activeTickets: 3,
          specialties: "Resident Ticket Triage, Access Control, Noise Logging",
          contact: "app: ResidentDesk • Ext 1000"
        }
      ],

      // Reports (Residential Specific)
      reports: [
        {
          id: "REP-RES-2026-11",
          title: "Bimonthly High-Speed Elevator Acoustic & Cable Safety Audit",
          date: "Sep 24, 2026",
          author: "Kenji Sato",
          complianceCode: "ASME A17.1 Safety Code for Elevators",
          summary: "Inspected all 8 tower elevators. Flagged Elevator Alpha 02 for 28Hz resonance. Averted sudden safety governor trip.",
          status: "Certified Safe for Operations"
        },
        {
          id: "REP-RES-2026-10",
          title: "Pre-Storm Subterranean Drainage & Sump Pump Integrity Audit",
          date: "Sep 17, 2026",
          author: "Dave Miller",
          complianceCode: "Municipal Flood Resilience Code",
          summary: "Tested all 6 basement sump pumps on emergency power. Basin 2 silt flush ordered.",
          status: "Action Item Closed"
        },
        {
          id: "REP-RES-2026-09",
          title: "Rooftop Solar PV Micro-Grid Carbon Offsetting Certification",
          date: "Sep 05, 2026",
          author: "Julian Thorne",
          complianceCode: "ISO 50001 Energy Management",
          summary: "Generated 48,200 kWh solar power in August. Offset 34.1 metric tons CO2 for residents.",
          status: "Published to Resident Portal"
        }
      ],

      // Analytics (Residential Specific)
      analytics: {
        avgLeadTimeDays: 18.5,
        avertedCost2026: "$320,000",
        campusUptimePct: "99.92%",
        emergencyDisruptionsAverted: 6,
        complianceScore: "99.8%",
        monthlySavings: [
          { month: "May", amount: "$35,000" },
          { month: "Jun", amount: "$52,000" },
          { month: "Jul", amount: "$68,000" },
          { month: "Aug", amount: "$85,000" },
          { month: "Sep", amount: "$80,000" }
        ],
        riskBreakdown: [
          { category: "High-Speed Elevators", pct: 40, color: "#059669" },
          { category: "Storm & Sub-Slab Water", pct: 35, color: "#D97706" },
          { category: "Domestic Booster Pressure", pct: 15, color: "#2563EB" },
          { category: "Solar Micro-Grid", pct: 10, color: "#10B981" }
        ]
      },

      // AI Assistant (Residential Scoped)
      aiAssistant: {
        workspaceIdentity: "Green Residency Smart Building Intelligence Copilot",
        welcomeMessage: "Good day Julian. EarlySight residential copilot is active. Scoped exclusively to Green Residency Twin Towers, smart elevators, domestic water, and sub-slab drainage. Resident privacy is strictly preserved. How can I assist?",
        suggestedPrompts: [
          "Show Tower A elevator vibration trend.",
          "Check storm sump water ingress rate.",
          "Review resident concierge noise complaints.",
          "Summarize solar micro-grid energy generation."
        ],
        knowledgeBaseAnswers: {
          "Show Tower A elevator vibration trend.": {
            headline: "Elevator #2 (Tower Alpha): 28 Hz Resonant Shudder Detected",
            text: "Tri-axial sensor VIB-ELEV-02 records 4.2 mm/s vibration at 28 Hz during mid-flight deceleration. Cross-referenced with 3 resident concierge complaints. Drive sheave bearing outer race spall predicted. Scheduled for low-occupancy Tuesday replacement.",
            kpiPills: ["Velocity: 4.2 mm/s", "Lead Time: 11.2 Days", "Work Order: WO-RES-7714"],
            referenceTag: "ASME Elevator Log ELEV-02"
          },
          "Check storm sump water ingress rate.": {
            headline: "Basement L2 Sump 02: Ingress Climbed to 14.8 L/min",
            text: "High-tide coastal surge elevated basement sub-slab hydrostatic pressure. Dual flapper check valve is partially obstructed with sediment, reducing pump effective throughput. Silt flushing is planned before weekend rain.",
            kpiPills: ["Ingress: 14.8 L/min", "Pump Duty: 42%", "Status: Pre-Storm Watch"],
            referenceTag: "Drainage File B2-SUMP-02"
          },
          "Review resident concierge noise complaints.": {
            headline: "3 Concierge Tickets Correlated to Elevator Alpha 02",
            text: "Tenants on floors 28, 31, and 34 noted subtle vibrations between 08:00 and 09:00. Telemetry confirmed peak vibration coincides with morning elevator dispatch peaks.",
            kpiPills: ["Tickets: 3 Concierge Logs", "Origin: Elevator #2", "Resident Notice: Sent"],
            referenceTag: "Resident Experience Desk Log"
          }
        }
      }
    },


    // =========================================================================
    // 4. APEX INDUSTRIAL — Heavy Manufacturing & Semiconductor Fab
    // =========================================================================
    "org-apex-industrial": {
      id: "org-apex-industrial",
      tenantCode: "TENANT-IND-04",
      name: "Apex Industrial Plant 04",
      category: "Semiconductor Fab & Advanced Manufacturing",
      shortDesc: "Cleanroom Cells A-D, Turbine Co-Gen Island & Extrusion Lines",
      location: "Industrial Complex Quad-A Through F • 148 Assets",
      facilityManager: "Marcus Vance (Senior Piping & Reliability Lead)",
      securityTier: "ISA/IEC 62443 Industrial Cybersecurity • Air-Gapped SCADA",
      themeColor: "#D94E34", // Industrial Vermilion
      themeAccent: "#1E293B", // Slate Navy
      badgeClass: "badge-org-vermilion",
      logoIconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,

      // Executive KPIs
      kpis: {
        totalMonitoredAssets: 148,
        activeSensors: 1420,
        activeWeakSignals: 54,
        criticalAlertsCount: 3,
        meanLeadTimeDays: 14.8,
        avertedDisruptionCost: "$2,840,000",
        studentComfortIndex: "99.8%", // Overall Equipment Effectiveness
        sustainabilityRating: "ISO 55001 Asset Management Certified"
      },

      // Dashboard Overview Data
      dashboard: {
        facilityZones: [
          { name: "Block A — Machining & Cleanroom", assetCount: 42, status: "Active Watch", signals: 17, leadRisk: "Water Infrastructure Joint 4B-12 Flange Seepage" },
          { name: "Block C — Extrusion & Press Lines", assetCount: 32, status: "Active Watch", signals: 12, leadRisk: "Hydraulic Proportional Valve PV-02 Cavitation" },
          { name: "Power Island — Steam Turbines", assetCount: 24, status: "Investigation", signals: 15, leadRisk: "Co-Gen Turbine TG-01 Bearing Dynamic Unbalance" },
          { name: "Logistics Yard & High-Bay Sortation", assetCount: 28, status: "Nominal", signals: 8, leadRisk: "Drive Pulley Lagging Micro-Slip" },
          { name: "Utility Basement — Cleanroom AHUs", assetCount: 22, status: "Nominal", signals: 2, leadRisk: "AHU-02 Blower Bearing Spall Stabilization" }
        ],
        recentMilestone: "Averted complete Cleanroom Cell C inundation via 14-day advance detection on Sub-Slab Joint 4B-12 ($512,000 net savings)."
      },

      // Signals (Industrial Specific)
      signals: [
        {
          id: "SIG-IND-401",
          title: "Sub-Slab Pressurized Flange Micro-Pressure Transient",
          location: "Block A — Trench 4B / Bay 4",
          modality: "IoT Pressure Transducer",
          frequency: "4.8 signals / day",
          trend: "increasing",
          severity: "Critical",
          timestamp: "5 minutes ago",
          source: "Sensor PT-102",
          crossSiloNote: "Synthesized with 8 verbal dampness complaints and soil moisture probe SM-4B reading 68.4% VWC."
        },
        {
          id: "SIG-IND-402",
          title: "Hydraulic Proportional Valve Spool Response Lag",
          location: "Block C — Press Station #2",
          modality: "High-Speed Linear Encoder",
          frequency: "3.2 signals / day",
          trend: "increasing",
          severity: "High",
          timestamp: "32 minutes ago",
          source: "Sensor ENC-PV02",
          crossSiloNote: "Acoustic sensor registered 42 kHz micro-cavitation bursts during high-tonnage cycling."
        },
        {
          id: "SIG-IND-403",
          title: "Co-Gen Steam Turbine TG-01 Bearing Cage Orbit Drift",
          location: "Power Island — Turbine Hall",
          modality: "Proximity Probe Orbit Analyzer",
          frequency: "2.8 signals / day",
          trend: "increasing",
          severity: "Critical",
          timestamp: "1 hour ago",
          source: "Sensor VIB-TG01",
          crossSiloNote: "Shaft centerline orbit expanded to 48 μm peak-to-peak during evening co-gen grid synchronization."
        }
      ],

      // Alerts (Industrial Specific)
      alerts: [
        {
          id: "EW-2026-088",
          title: "Sub-Slab Pressurized Water Seepage on Flange 4B-12",
          location: "Block A — Trench 4B / Assembly Bay 4",
          severity: "Critical P1",
          countdownLeadTime: "14.2 Days Lead",
          confidence: "87.0%",
          affectedStakeholders: "Cleanroom Cell C & Subterranean 3.3kV Conduit",
          rootCauseHypothesis: "Cyclic thermal shock causing flange bolt torque relaxation and EPDM gasket micro-extrusion under 4.2 bar pressure.",
          recommendedAction: "Isolate auxiliary trench bypass loop, replace elastomer with Viton FKM gasket, and retorque studs to 340 Nm.",
          status: "Verified Remediated & Audited",
          leadTimeSavings: "$512,000 / 36h Outage Averted"
        }
      ],

      // Teams (Industrial Specific)
      teams: [
        {
          id: "TEAM-IND-01",
          name: "Civil & Piping Infrastructure Squad",
          lead: "Marcus Vance (Senior Piping Lead)",
          membersCount: 8,
          shiftCoverage: "24/7 Heavy Industrial Coverage",
          activeTickets: 2,
          specialties: "High-Pressure DI Water, Steam Conduits, Flange Bolting",
          contact: "radio: HeavyCh-1 • Ext 7701"
        },
        {
          id: "TEAM-IND-02",
          name: "Hydraulics & Fluid Power Squad",
          lead: "Elena Rostova (Fluid Power Specialist)",
          membersCount: 6,
          shiftCoverage: "Day & Evening Press Tooling",
          activeTickets: 1,
          specialties: "Proportional Valves, 350-Bar Manifolds, Fluid Contamination",
          contact: "radio: HeavyCh-3 • Ext 7703"
        }
      ],

      // Reports (Industrial Specific)
      reports: [
        {
          id: "REP-IND-2026-88",
          title: "Stage 11 Closed-Loop Impact Audit: Joint 4B-12 Remediation",
          date: "Sep 20, 2026",
          author: "Marcus Vance",
          complianceCode: "ISO 13374 Condition Monitoring Level 4",
          summary: "Remediation verified: signal frequency dropped from 4.8/day to 0.14/day (-94.1% decay). Averted $512,000 loss.",
          status: "Audited & Certified Remediated"
        }
      ],

      // Analytics (Industrial Specific)
      analytics: {
        avgLeadTimeDays: 14.8,
        avertedCost2026: "$2,840,000",
        campusUptimePct: "99.82%",
        emergencyDisruptionsAverted: 14,
        complianceScore: "100.0%",
        monthlySavings: [
          { month: "May", amount: "$320,000" },
          { month: "Jun", amount: "$450,000" },
          { month: "Jul", amount: "$610,000" },
          { month: "Aug", amount: "$740,000" },
          { month: "Sep", amount: "$720,000" }
        ],
        riskBreakdown: [
          { category: "High-Pressure Piping", pct: 40, color: "#D94E34" },
          { category: "Extrusion Hydraulics", pct: 30, color: "#EA580C" },
          { category: "Turbine Co-Gen", pct: 20, color: "#D97706" },
          { category: "Sortation Automation", pct: 10, color: "#059669" }
        ]
      },

      // AI Assistant (Industrial Scoped)
      aiAssistant: {
        workspaceIdentity: "Apex Industrial Complex Operational Copilot",
        welcomeMessage: "Marcus, EarlySight industrial copilot is online. Air-gapped to Facility 04 telemetry, SCADA, and CMMS work orders. What heavy machinery subsystem shall we inspect?",
        suggestedPrompts: [
          "What problems are increasing this week?",
          "Show emerging issues in Block A.",
          "Why was Alert EW-2026-088 generated?",
          "Which issues require investigation?"
        ],
        knowledgeBaseAnswers: {
          "What problems are increasing this week?": {
            headline: "Precursor Surges in Block A Piping & Block C Hydraulics",
            text: "Signals have surged 340% over 72 hours around Joint 4B-12. Proportional valve PV-02 response lag is also accelerating.",
            kpiPills: ["Block A: 4.8/day", "Block C: 3.2/day", "Lead Time: 14.2 Days"],
            referenceTag: "SCADA Historian Archive"
          }
        }
      }
    },

    // =========================================================================
    // 5. METRO MUNICIPAL — Public Facilities & Water Infrastructure
    // =========================================================================
    "org-metro-public": {
      id: "org-metro-public",
      tenantCode: "TENANT-PUB-05",
      name: "Metro Municipal",
      category: "Public Facilities & Utilities",
      shortDesc: "Regional Aqueducts, Water Reclamation & Municipal Pumping Infrastructure",
      location: "Metro Quad Utility Corridor • 32 Pumping Stations • 1.2M Citizens",
      facilityManager: "Evelyn Ross, PE (Director of Water Resources & Reliability)",
      securityTier: "CISA Critical Infrastructure • Water SCADA Isolated",
      themeColor: "#1B4332",
      themeAccent: "#C85A32",
      badgeClass: "badge-org-green",
      logoIconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`,
      
      kpis: {
        totalMonitoredAssets: 124,
        activeSensors: 680,
        activeWeakSignals: 19,
        criticalAlertsCount: 3,
        meanLeadTimeDays: 17.8,
        avertedDisruptionCost: "$1,450,000",
        publicContinuityScore: "99.98%",
        complianceRating: "EPA / CISA Verified"
      },

      dashboard: {
        facilityZones: [
          { name: "Central Intake Aqueduct Trench 2", assetCount: 34, status: "Active Watch", signals: 8, leadRisk: "Intake Flange Seal Elastic Degradation" },
          { name: "High-Lift Pumping Station 07", assetCount: 28, status: "Investigation", signals: 5, leadRisk: "Pump #3 Cavitation Precursor Flutter" },
          { name: "Clarification Basin & Flow Valves", assetCount: 32, status: "Nominal", signals: 3, leadRisk: "Actuator Gear Mesh Friction" },
          { name: "Emergency Diesel Auxiliary Backup", assetCount: 30, status: "Nominal", signals: 3, leadRisk: "Battery Float Voltage Deviation" }
        ],
        recentMilestone: "Averted catastrophic 48-inch aqueduct trench blowout serving 1.2M citizens via 17.8-day advance flange seal degradation warning."
      },

      signals: [
        {
          id: "SIG-PUB-01",
          title: "Sub-harmonic cavitation resonance detected on High-Lift Pump #3",
          location: "Pumping Station 07 — Bay 2 Sub-level",
          modality: "IoT SCADA Acoustic",
          frequency: "5.2 events / day (Surging)",
          trend: "increasing",
          severity: "Critical",
          timestamp: "12 hours ago",
          source: "Pumping SCADA Strain Gauge SG-48",
          crossSiloNote: "Acoustic flutter at 48 Hz aligns with impeller suction pressure dip and operator whistle reports."
        },
        {
          id: "SIG-PUB-02",
          title: "Elastomer flange seal micro-extrusion noted on Aqueduct Trench 2",
          location: "Aqueduct Trench 2 — Flange Joint 12A",
          modality: "CMMS Work Order",
          frequency: "2.1 events / day",
          trend: "increasing",
          severity: "High",
          timestamp: "1.5 days ago",
          source: "City Water PM Work Order #WO-4921",
          crossSiloNote: "Elastomer hardening identified during routine seal inspection; matched sub-slab moisture telemetry."
        },
        {
          id: "SIG-PUB-03",
          title: "Abnormal valve hunting during peak distribution run",
          location: "East Main Feeder Valve #4",
          modality: "Operator Log",
          frequency: "1.8 events / day",
          trend: "watch",
          severity: "Medium",
          timestamp: "2 days ago",
          source: "SCADA Log & Shift Notes",
          crossSiloNote: "Shift engineer reported 12% flow oscillations matching pressure surge reflection."
        },
        {
          id: "SIG-PUB-04",
          title: "Clarification basin variable-speed drive thermal drift",
          location: "Clarification Basin #3 — VFD Inverter Cabinet",
          modality: "IoT Thermal Telemetry",
          frequency: "0.9 events / day",
          trend: "stable",
          severity: "Medium",
          timestamp: "3 days ago",
          source: "Thermal IR Probe IR-VFD-09",
          crossSiloNote: "Cabinet cooling fan dust loading identified as secondary contributor."
        },
        {
          id: "SIG-PUB-05",
          title: "Auxiliary diesel generator weekly cranking battery float drop",
          location: "Emergency Co-Gen Vault — Genset 01",
          modality: "Electrical Telemetry",
          frequency: "0.3 events / week",
          trend: "decreasing",
          severity: "Low",
          timestamp: "4 days ago",
          source: "Battery Float Sensor BFS-01",
          crossSiloNote: "Trickle charger recalibrated; backup starting capacity verified at 99.4%."
        }
      ],

      alerts: [
        {
          id: "ALR-PUB-001",
          title: "Aqueduct Intake Flange 12A Micro-Seepage & Hydrostatic Blowout",
          location: "Aqueduct Trench 2 Main Distribution Flange (Joint 12A)",
          severity: "Critical P1",
          countdownLeadTime: "17.8 Days Lead",
          confidence: "93.4%",
          affectedStakeholders: "1,200,000 Municipal water distribution recipients",
          rootCauseHypothesis: "Precursor convergence across seal extrusion work orders, sub-slab pressure harmonics, and flow differential variance indicates imminent catastrophic blowout within 18 days.",
          recommendedAction: "Schedule trench depressurization bypass and install reinforced nitrile composite seal ring during off-peak night window.",
          status: "Under Engineering Review",
          leadTimeSavings: "$840,000 in emergency aqueduct trench excavation & flood damages"
        },
        {
          id: "ALR-PUB-002",
          title: "High-Lift Pump #3 Impeller Cavitation Micro-Pitting Cascade",
          location: "High-Lift Pumping Unit #3 (Station 07)",
          severity: "High P2",
          countdownLeadTime: "12.4 Days Lead",
          confidence: "88.2%",
          affectedStakeholders: "Regional industrial district pressurized water supply",
          rootCauseHypothesis: "Acoustic sensor flutter at 48 Hz aligns with impeller suction pressure dip and operator whistle reports.",
          recommendedAction: "Adjust suction guide vane angle by +4.5 degrees and inspect impeller bronze wear rings.",
          status: "Assigned to Pumping Mechanics",
          leadTimeSavings: "$420,000 in catastrophic pump core destruction"
        }
      ],

      teams: [
        {
          id: "TEAM-PUB-01",
          name: "Civil Hydraulics & Aqueduct Engineering Squad",
          lead: "Marcus Vance, PE (Chief Water Reliability Engineer)",
          membersCount: 12,
          shiftCoverage: "24/7 Municipal Standby Duty",
          activeTickets: 3,
          specialties: "High-Pressure Aqueducts, Trench Seals, Hydrostatic Testing",
          contact: "radio: Ch-1 • Ext 6100"
        },
        {
          id: "TEAM-PUB-02",
          name: "Pumping Plant Mechanics & Fluid Machinery",
          lead: "Robert Kowalski (Master Millwright)",
          membersCount: 8,
          shiftCoverage: "Rotating 2-Shift Pumping Maintenance",
          activeTickets: 2,
          specialties: "Multi-Stage High-Lift Pumps, Impeller Balancing, Cavitation Mitigation",
          contact: "radio: Ch-3 • Ext 6220"
        },
        {
          id: "TEAM-PUB-03",
          name: "Municipal SCADA & Telemetry Operations",
          lead: "Elena Rostova (SCADA Systems Architect)",
          membersCount: 6,
          shiftCoverage: "Round-the-Clock Network Operations Center",
          activeTickets: 4,
          specialties: "Remote Terminal Units, Acoustic Vibration, Flow Strain Gauges",
          contact: "radio: Ch-7 • Ext 6330"
        }
      ],

      reports: [
        {
          id: "REP-PUB-2026-09",
          title: "Monthly Regional Aqueduct Trench Integrity & Seepage Inspection",
          date: "Sep 25, 2026",
          author: "Marcus Vance, PE",
          complianceCode: "CISA Water Critical Infrastructure Mandate",
          summary: "Ultrasonic testing across 32 km aqueduct corridor verified 99.8% structural integrity with isolated elastomer creep on Flange 12A.",
          status: "Audited & Certified"
        },
        {
          id: "REP-PUB-2026-08",
          title: "High-Lift Pumping Cavitation Baseline & Acoustic Harmonic Audit",
          date: "Sep 18, 2026",
          author: "Robert Kowalski",
          complianceCode: "EPA Safe Drinking Water Act / AWWA M42",
          summary: "Acoustic spectrum characterization on Stations 01-12. Flagged Station 07 Unit 3 for vane pitch adjustment.",
          status: "Filed with Board"
        },
        {
          id: "REP-PUB-2026-07",
          title: "Emergency Co-Gen Auxiliary Starting Fleet Reliability Review",
          date: "Sep 12, 2026",
          author: "Elena Rostova",
          complianceCode: "State Grid Emergency Standby Mandate",
          summary: "All 14 auxiliary diesel generators tested under full simulated power-loss load. Float charge restored on Genset 01.",
          status: "Action Completed"
        }
      ],

      analytics: {
        avgLeadTimeDays: 17.8,
        avertedCost2026: "$1,450,000",
        campusUptimePct: "99.98%",
        emergencyDisruptionsAverted: 18,
        complianceScore: "100.0%",
        monthlySavings: [
          { month: "May", amount: "$180,000" },
          { month: "Jun", amount: "$290,000" },
          { month: "Jul", amount: "$420,000" },
          { month: "Aug", amount: "$560,000" },
          { month: "Sep", amount: "$1,450,000" }
        ],
        riskBreakdown: [
          { category: "Aqueduct High-Pressure Flanges", pct: 45, color: "#1B4332" },
          { category: "High-Lift Pump Cavitation", pct: 30, color: "#C85A32" },
          { category: "Distribution Feeder Actuators", pct: 15, color: "#5E7E6C" },
          { category: "Auxiliary Diesel Co-Gen", pct: 10, color: "#B87333" }
        ]
      },

      aiAssistant: {
        workspaceIdentity: "Metro Municipal Water & Utilities Operational Copilot",
        welcomeMessage: "Director Ross, EarlySight public utilities copilot is online. Air-gapped to Metro Municipal SCADA, pumping telemetry, and civil work orders. Which municipal infrastructure subsystem shall we audit?",
        suggestedPrompts: [
          "What municipal risks are accelerating this week?",
          "Explain the Flange 12A aqueduct precursor chain.",
          "Show pumping cavitation telemetry in Station 07.",
          "Verify averted downtime and EPA compliance metrics."
        ],
        knowledgeBaseAnswers: {
          "What municipal risks are accelerating this week?": {
            headline: "Accelerating Micro-Seepage in Aqueduct Trench 2",
            text: "Flange 12A hydrostatic differential has surged +18.4% over 48 hours, converging with maintenance work order WO-4921.",
            kpiPills: ["Trench 2: 17.8d Lead", "Station 07: 12.4d Lead", "EPA Verified"],
            referenceTag: "Municipal SCADA Archive"
          }
        }
      }
    }
  }
};

window.MULTI_ORG_DATA = MULTI_ORG_DATA;
