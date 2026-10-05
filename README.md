# EarlySight — AI-Powered Early Warning System for Emerging Problems

> **"From scattered signals to actionable early warnings."**

An enterprise-grade platform engineered to detect, correlate, and avert emerging operational, quality, and mechanical failures weeks before critical thresholds are breached.

---

## Architectural Principle

EarlySight visually and interactively communicates the core thesis:
```
Scattered Signals ➔ Connected Data ➔ Pattern ➔ Emerging Risk ➔ Evidence ➔ Action ➔ Verification
```

---

## STAGE 1 & 2: Landing Page & Interactive Signal Animation

- **Warm-Ivory Enterprise Theme (`#FAF8F5`)**: Designed to avoid sci-fi neon clichés, using an architectural editorial palette with subtle stone borders and crisp typography.
- **5-Phase Opening Sequence**: Scattered operational dots (Complaint, Maintenance, Incident, Image, Historical Data, Sensor) glide and harmonize into a concentric radar indicator, revealing the brand wordmark, tagline, and `Explore EarlySight →` CTA.
- **Interactive Floating Nodes & Popover Information Cards**: Small floating operational signals hover behind and beside hero content. Hovering any signal displays:
  - **Title**: e.g., `Maintenance Report`
  - **Location**: `Block A`
  - **Frequency**: `Increasing`
  - **Status**: `Related Signal`
  - **Cross-Silo Causal Note**: Details how this report correlates with other disparate signals.
- **Interactive Scrubber Bar**: Step pips allowing users to jump directly to any animation phase (`1. Scattered Signals`, `2. Connected Data`, `3. Pattern`, `4. Early Warning`, `5. Brand Reveal`).
- **Cross-Silo Synthesis Progression Flow Widget**: Traces the synthesis pathway from individual operational precursors to pattern detection and quantified lead time.

---

## STAGE 3: Main Dashboard

Organized into 7 enterprise operational sections with compact cards, clean typography, and subtle indicators (no excessive icons):

1. **Overview**: Key metrics including Mean Early Lead Time ($19.4\text{ days}$), Downtime Cost Averted ($\$1.84\text{M}$), Active Warnings, and Telemetry Ingestion Rate ($1,420/\text{sec}$ across 342 assets).
2. **Active Early Warnings**: High-urgency cards with concrete lead-time countdown badges, impact estimates, and precursor breakdowns.
3. **Emerging Issues**: Weak-signal clusters crossing coherence thresholds with rate-of-emergence metrics.
4. **Verified Alerts**: Engineering-validated signatures with assigned SAP/CMMS work orders.
5. **Issues Under Investigation**: Multi-disciplinary review tickets with telemetry trails and active hypotheses.
6. **Resolved Issues**: Verified averted outages with documented hours saved and financial proof.
7. **Impact Monitoring**: Proven ROI analytics and lead-time distribution benchmarks.

---

## STAGE 4: Prominent Emerging Risks Panel

Dedicated, prominent grid displaying synthesized pre-failure hazards across operations. Each card contains:

- **Problem Title**: e.g., `Water Infrastructure Issue`
- **Location**: `Block A`
- **Number of Related Signals**: `17 related signals`
- **Trend**: `Increasing trend` (with subtle animated SVG sparkline)
- **Severity**: `High`
- **Confidence**: `87%`
- **First Detected**: `14 days ago (Sep 10)`
- **Last Updated**: `12 minutes ago`
- **Status**: `Investigation Required`
- **Subtle Animated Trend Lines**: Lightweight SVG sparkline paths with smooth CSS draw keyframes and pulsating apex indicators.

---

## STAGE 5: Interactive Signal Map & Geospatial Clustering

An interactive, high-DPI Canvas map visualization showing exactly where multi-modal signals are occurring across facility zones and how they merge into risk clusters:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FACILITY SCHEMATIC // COMPLEX QUAD-A THROUGH F                             │
│  ┌─────────────────────────┐  Conduit  ┌─────────────────────────┐         │
│  │ BLOCK A — ASSEMBLY      │┄┄┄┄┄┄┄┄┄┄┄│ BLOCK B — UTILITY       │         │
│  │ 17 Signals [ 17 ]       │           │ 9 Signals [ 9 ]         │         │
│  │ Water Infrastructure 87%│           │ Chilled Water Loop 82%  │         │
│  └─────────────────────────┘           └─────────────────────────┘         │
│  ┌─────────────────────────┐           ┌─────────────────────────┐         │
│  │ POWER ISLAND — TURBINES │           │ LOGISTICS & HIGH-BAY    │         │
│  │ 15 Signals [ 15 ]       │           │ 8 Signals [ 8 ]         │         │
│  │ Stator Thermal 88.9%    │           │ Conveyor Pitting 87.4%  │         │
│  └─────────────────────────┘           └─────────────────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Features

1. **Aesthetic Muted Palette**:
   - Replaces conventional bright red/blue AI dashboards with architectural ivory-sand (`#FAF8F5`), muted terracotta (`#EA580C`), soft vermilion (`#D94E34`), warm amber (`#D97706`), sage green (`#059669`), and slate blue (`#2563EB`).
2. **Signal Clusters**:
   - Multi-signal groupings within facility zones showing cluster count pills, radial shockwave rings, and modality breakdown previews.
   - Anchor Example: **Block A** contains **17 related signals** for the **Water Infrastructure Issue** (micro-pressure drops, floor dampness logs, ultrasonic hiss, FLIR thermal anomalies, DI water cavitation, soil probe saturation).
3. **Emerging-Risk Locations**:
   - Flagged epicenter pins floating above zone clusters indicating the primary pre-failure threat and confidence score.
4. **Gradual Merging Animation**:
   - When multiple signals occur in an area, they animate gradually merging along vector paths into the central cluster badge!
   - Controls:
     - `[ Scattered Signals ]`: Disperses signals to individual physical bay coordinates.
     - `[ Merged Clusters ]`: Glides signals toward the zone centroid to coalesce into the cluster badge.
     - `[ Re-run Cluster Merge ]`: Plays the gradual merge animation on demand.
     - **Merge Scrub Slider**: Allows the user to scrub the transition smoothly from 0% (scattered) to 100% (merged).
5. **Location Filtering**:
   - Quick filter buttons for `All Zones`, `Block A`, `Block B`, `Block C`, `Power Island`, `Logistics Yard`, and `Chemical & Env`.
   - Highlights the selected facility quad while gently dimming other areas.
6. **Time Horizon Filtering**:
   - Filter buttons for `Last 24h`, `Last 7d`, `Last 14d`, and `Last 30d`.
   - Dynamically recalculates signal density and animates the progressive arrival and clustering of operational precursors.
7. **Interactive Hover Popover Card**:
   - Hovering any individual signal displays its modality tag, asset ID, exact bay location, trend velocity, and linked emerging risk.
   - Hovering any zone cluster displays the full synthesis summary with modality counts (Sensors, Maintenance, Complaints, FLIR Images, Historian logs).
8. **Click-to-Inspect Modal**:
   - Clicking any signal node, cluster badge, or emerging risk card opens the detailed forensic inspector dialog with full telemetry and action pathways.

---

---

## STAGE 6: Interactive Signal Map & Geospatial Intelligence

Dedicated full-page spatial intelligence page ([`map.html`](file:///c:/Users/DELL/Documents/EarlySight/map.html)):

- **Facility Quad Topology**: Monitored machine bays and conduits across 6 core operational zones.
- **Nodes vs. Clusters**: Scattered individual bay signals vs. synthesized risk clusters.
- **Physics Merging Animation**: Smooth cubic-bezier transition vector paths and replay scrub slider.
- **Multi-Dimensional Filters**: Live keyword search, facility zone pills, date horizons, date range pickers, signal modalities, and risk issues.
- **Cluster Revelation Drawer**: Slides open on cluster click revealing Location, Related Signals, Emerging Issue, Confidence, and Trend velocity.

---

## STAGE 7: Trends & Timeline Analysis

Dedicated chronological lifecycle analysis page ([`timeline.html`](file:///c:/Users/DELL/Documents/EarlySight/timeline.html)):

- **The 7-Step Problem Development Lifecycle**:
  `First Signal ➔ Repeated Reports ➔ Pattern Detected ➔ Frequency Increased ➔ Early Warning Generated ➔ Action Taken ➔ Impact Monitored`
- **Interactive Lifecycle Stepper**: Sticky navigation track with playback controller (`Play`, `Pause`, `Prev`, `Next`).
- **Scroll & Interaction Animations**: IntersectionObserver highlights active stage cards as the user scrolls.
- **Trend Charts with Granularity Filtering**: Interactive SVG charts with `Daily (30d)`, `Weekly (12w)`, and `Monthly (6m)` aggregation, tracking Precursor Frequency vs. EarlySight Confidence and Legacy Alarm thresholds.
- **Frequency Changes & Modality Surge**: Quantifies acceleration surges (→340%), drops in Mean Time Between Signals (168h ➔ 6.2h), and precursor modality breakdowns.
- **Historical Comparison**: Side-by-side comparative ledger and trajectory graph evaluating unmitigated 2024 failure ($1.42M loss, 46h downtime) against 2026 early intervention ($340, 0h downtime, $1,419,660 net savings).

---

## How to Run

### Method A: Direct File Open
Open [`index.html`](file:///c:/Users/DELL/Documents/EarlySight/index.html), [`map.html`](file:///c:/Users/DELL/Documents/EarlySight/map.html), or [`timeline.html`](file:///c:/Users/DELL/Documents/EarlySight/timeline.html) in any browser.

### Method B: Local HTTP Server (Python)
Run in PowerShell:
```powershell
cd c:\Users\DELL\Documents\EarlySight
py -m http.server 8080
```
Then navigate to:
- `http://localhost:8080/index.html` (Landing & Main Dashboard)
- `http://localhost:8080/map.html` (Interactive Signal Map)
- `http://localhost:8080/timeline.html` (Trends & Timeline Analysis)
- `http://localhost:8080/evidence.html` (Evidence & Explainability Interface)

---

## Stage 8 — Evidence & Explainability

Stage 8 introduces full causal explainability into why early warnings are triggered:
1. **Primary Explainability Engine**: Explicitly answers *"Why was this warning generated•"* with a 3-pillar breakdown (Why Legacy SCADA Missed It, Root Cause Physical Hypothesis, and Prescriptive Mitigation Action).
2. **Connected Visual Evidence Graph**: Visualizes the upstream multi-modal precursor cards converging downwards via animated SVG bezier flow paths into the synthesized problem:
   - `8 Similar Complaints` (Operator Logs • →28% Contribution)
   - `3 Maintenance Reports` (CMMS Work Orders • →22% Contribution)
   - `Same Location` (Spatial Convergence • →19% Contribution)
   - `Increasing Frequency` (Velocity Surge • →10% Contribution)
   - `Historical Similarity` (Signature Match • →8% Contribution)
   $$\Downarrow$$
   `Potential Emerging Problem: Sub-Slab Pressurized Flange Micro-Leakage`
3. **Evidence Strength Confidence (`87%`)**: Prominently displays the 87% rating alongside an explicit disclaimer clarifying that **confidence communicates the strength, volume, and coherence of available evidence, not mathematical certainty of failure**.
4. **Mathematical Evidence Decomposition**: Full transparent tabular breakdown showing how the 87% confidence is derived from weighted model components summing to 100%.
5. **Interactive Supporting Evidence Deep-Dive**: Clicking any upstream card dynamically renders granular records (e.g. verbatim operator transcripts with timestamps, CMMS ticket numbers, spatial co-location radius, or historical comparison).

---

## STAGE 9: Integrated AI Assistant & Operational Copilot

Stage 9 introduces an enterprise AI Assistant integrated directly into EarlySight:

1. **Anti-Generic Design Philosophy**:
   - Explicitly designed to avoid generic "ChatGPT-clone" aesthetics (no isolated blank white chat window).
   - Structured as an **Industrial Operational Intelligence Cockpit** that naturally anchors inside the EarlySight dashboard (`index.html#aiAssistantBlock`) and as a full-screen dedicated workstation (`copilot.html`).
   - Integrated telemetry status bar tracking 148 assets, 54 active signals, $2.84M averted downtime loss, and cross-silo data ingress status (`SCADA`, `CMMS`, `Shift Logs`, `IoT Probes`).

2. **Semantic Operational Intelligence (5 Core Questions)**:
   - **"What problems are increasing this week•"**: Detects velocity acceleration (→340% 72-hour surge) across Block A Civil & Block C Hydraulics, featuring an inline SVG daily velocity bar chart and MTBS (Mean Time Between Signals) drop from 168h to 6.2h.
   - **"Show emerging issues in Block A."**: Renders geospatial concentration analysis within an 8.5m dispersion radius in Trench 4B / Bay 4, complete with an inline spatial risk horizontal bar breakdown.
   - **"Why was this warning generated•"**: Delivers full causal explainability for Alert EW-2026-088, showing why legacy SCADA missed the micro-pressure drop (below 2 bar threshold) and rendering an inline Evidence Weight decomposition breakdown (87% confidence).
   - **"Which issues require investigation•"**: Renders a prioritized lead-time urgency matrix ranking Alert EW-2026-088 (14.2 days, $512k exposure), Alert EW-2026-094 (12.0 days, $340k exposure), and Turbine Bearing Drift (22.5 days, $185k exposure).
   - **"Show related reports for this issue."**: Synthesizes cross-silo records into an inline Precursor Timeline Strip (Aug 29 – Sep 14), linking 8 verbal/written operator shift reports, 3 CMMS work orders, and the Nov 2024 unmitigated incident archive.

3. **Visual Connections Back to Organization Data**:
   - **Evidence References & Deep Links**: Responses include interactive citation pills (`[Ref: Shift Logs]`, `[Ref: CMMS]`, `[Ref: Subsurface Probes]`, `[Ref: Disaster Archive]`) that trigger full-screen forensic modal inspectors.
   - **Related Alert Cards**: Renders interactive alert badges with direct navigation to the dedicated Evidence & Explainability interface (`evidence.html`).
   - **Suggested Follow-Up Prompts**: Contextually relevant follow-up questions dynamically appear after each response.
   - **Chronological Query History**: Searchable, pinnable audit trail of previous operational queries with timestamps.

---


---

## STAGE 10: Action Center & Closed-Loop Resolution Tracking

Stage 10 closes the loop between early warning detection and quantified operational impact:

1. **The 6-Stage Resolution Lifecycle Workflow**:
   `Detected → Verified → Assigned → Action Taken → Resolved → Impact Verified`
   - **Detected**: Multi-modal precursor signals synthesized into an unverified candidate issue.
   - **Verified**: Engineering reliability lead validates anomaly signature against operational physics.
   - **Assigned**: Allocated to responsible domain team, technician lead, and scheduled maintenance window.
   - **Action Taken**: Field remediation executed (parts replaced, studs retorqued, calibration completed).
   - **Resolved**: Physical remediation complete, telemetry returned to baseline.
   - **Impact Verified**: Operational stability audited across 72h, averted loss quantified, MTBF extension validated.

2. **Mandatory Issue Attributes on Every Card**:
   - **Responsible Team**: Domain engineering squad (Civil & Piping, Mechanical, Hydraulics, Electrical, Automation, HVAC).
   - **Assigned Person**: Technician or reliability engineer lead with initials avatar.
   - **Priority**: Urgency tier (`Critical P1`, `High P2`, `Medium P3`, `Low P4`) with lead-time horizons.
   - **Prescriptive Action**: Concrete technical instruction callout box.
   - **Deadline**: Date/time target with color-coded urgency countdown pill.
   - **Current Status**: Color-coded workflow badge and interactive 6-step progress stepper.
   - **Resolution Notes**: Expandable technician findings and post-maintenance observations.

3. **Smooth Status-Transition Animations**:
   - **Outbound Slide & Fade**: Cards smoothly slide out with `cardTransitionOut` cubic-bezier curve.
   - **Inbound Scale & Teal Glow**: Cards enter target column with `cardTransitionIn` bounce, scale-up, and teal box-shadow pulse.
   - **Live Badge Counters**: Numerical column badges pulse dynamically on state changes.
   - **Toast Notifications**: Floating interactive status toast confirms each transition with undo/rollback support.

4. **Multi-View Modes & Audit History**:
   - **6-Column Kanban Pipeline View**: Drag-and-drop / click-to-advance board.
   - **Tabular Matrix View**: Compact engineering grid with inline dropdown stage selectors.
   - **Urgency Sort View**: Chronological ordering by impending maintenance deadlines.
   - **Deep Inspector Modal**: Complete 6-stage clickable stepper track, form editor, and immutable audit history timeline.

---

## STAGE 11: Impact Monitoring & Closed-Loop Resolution Audit

Dedicated full-page impact verification workstation ([`impact.html`](file:///c:/Users/DELL/Documents/EarlySight/impact.html)):

The core purpose of Stage 11 is to **prove whether operational interventions actually reduced the problem**. Rather than stopping at work order execution, EarlySight tracks whether precursor signals decayed to nominal baseline, physical equilibrium was restored, and catastrophic downtime was averted:

1. **The 3-Step Impact Transformation Flow**:
   - **Before Action**: `17 related signals` (Precursor Frequency: `4.8 signals / day`, MTBS: `6.2 hours`, Risk Exposure: `$512,000 / 36h downtime`).
   - $$\Downarrow$$
   - **Action Taken**: `WO-2026-8841` (Trench bypass loop isolated, ultrasonic bolt elongation measured, EPDM replaced with chemical-resistant Viton FKM gasket, studs retorqued to 340 Nm on Sep 20, 2026).
   - $$\Downarrow$$
   - **After Action**: `6 related signals` (48h initial decay) $$\rightarrow$$ `1 residual signal` (Stabilized Frequency: `0.14 signals / day`, MTBS: `168.0 hours`, net reduction: `-94.1% decay`).

2. **Mandatory Stage 11 Dimensions on Every Card**:
   - **Signal frequency before intervention**: e.g., `4.8 signals / day` (MTBS: 6.2 hours).
   - **Signal frequency after intervention**: e.g., `0.14 signals / day` (MTBS: 168.0 hours).
   - **Resolution status**: `Verified Remediated` (certified sign-off) vs `Monitoring in Progress`.
   - **Monitoring period**: e.g., `14-Day Post-Intervention Audit (Sep 20 – Oct 04, 2026)`.
   - **Current trend**: e.g., `Decaying to Baseline (-94.1%)` with active stability classification.

3. **Clean Dual-Phase Trend Visualization**:
   - High-fidelity dual-phase SVG visualization:
     - **Pre-Intervention Phase (Vermilion)**: Precursor surge curve climbing up to 4.8 signals/day with translucent fill and peak markers.
     - **Action Demarcation Line (Day 0)**: Vertical marker with tool badge representing execution of work order.
     - **Post-Intervention Phase (Emerald)**: Rapid exponential decay curve descending down to nominal baseline (<0.25/day).
     - **Interactive Scrubber & Tooltip Tracker**: Day-by-day telemetry scrub pips (Day -5 to Day +5) and automated playback loop.
     - **Metric View Toggles**: Signal Frequency (Rate/day), Daily Raw Signal Bars, Cumulative Decay Curve.

4. **Multi-Modality Telemetry Matrix**:
   - Cross-silo proof showing decay across specific physical sensor streams:
     - Soil Moisture Probes: `68.4% VWC` ➔ `24.1% VWC` (-64.8%)
     - Ultrasonic Acoustic Hiss: `48.2 kHz` ➔ `1.2 kHz` (-97.5%)
     - Sump Pump Ingress: `18.4 L/day` ➔ `0.1 L/day` (-99.5%)
     - Operator Dampness Logs: `8 logs / 14d` ➔ `0 logs / 10d` (-100%)

5. **Executive Portfolio & Engineering Audit Certificate**:
   - 5 audited plant interventions across Block A, Block C, Power Island, Logistics, and Cleanroom ($1.92M total averted loss, 180 downtime hours saved, 100% true positive verification rate).
   - Master searchable & filterable Interventions Ledger Table.
---

## STAGE 12: Multi-Organization Workspace & Strict Tenant Isolation

Dedicated full-featured multi-tenant workspace application ([`workspace.html`](file:///c:/Users/DELL/Documents/EarlySight/workspace.html) & [`organizations.html`](file:///c:/Users/DELL/Documents/EarlySight/organizations.html)):

Stage 12 enables EarlySight to serve multiple distinct enterprise organizations while enforcing **absolute workspace separation and zero cross-tenant data leakage**:

1. **Organization Selector & Switcher**:
   - Master Platform: `EarlySight`
   - Organizations:
     - **ABC College**: Higher Education & Campus Academic Infrastructure (`TENANT-EDU-01`, Oxford Blue & Gold motif).
     - **City Hospital**: Tertiary Healthcare, Surgical Theatres & Life Support (`TENANT-MED-02`, Clinical Teal & Crimson motif).
     - **Green Residency**: Eco-Luxury Smart Residential Community (`TENANT-RES-03`, Forest Emerald & Amber motif).
     - **Apex Industrial Complex**: Heavy Manufacturing & Semiconductor Fab (`TENANT-IND-04`, Terracotta & Slate motif).
   - Switchable via:
     - Header Quick Selector button & dropdown
     - Security Banner Quick Switch Pills
     - Interactive Organization Directory Modal (`Switch Org`)

2. **The 7 Mandatory Organization-Specific Modules**:
   Every organization has its own isolated, non-overlapping implementations for:
   - **Dashboard**: Tailored executive KPIs (Assets, Sensors, Signals, Critical Alerts, Lead Time, Loss Averted, Operational/Comfort Index), monitored facility zones, priority emerging warnings, and latest verified operational milestone.
   - **Signals**: Domain-specific multi-modal weak signals (e.g. lab fume scrubbers for college, OR pressure gradients for hospital, high-bay elevator traction vibration for residency, sub-slab DI water flange seepage for industrial fab). Filterable by search and modality.
   - **Alerts**: Verified early warnings with countdown lead times, severity ratings (`Critical P1`, `High P2`), evidence confidence ratings, affected stakeholders, physical root causes, prescriptive action pathways, and direct squad dispatch.
   - **Teams**: Specialized domain response squads, lead engineers, initials avatars, crew counts, 24/7 shift schedules, active tickets, and direct paging protocols.
   - **Reports**: Audited compliance, incident, and preventive work order reports (e.g. OSHA 1910, JCAHO/NFPA 99, ASME A17.1, ISO 13374) with export/download capabilities.
   - **Analytics**: Historical monthly averted disruption loss SVG bar charts, normalized risk domain distribution bars, advance lead-time benchmarks, and compliance scores.
   - **AI Assistant**: Dedicated, air-gapped Operational Copilot scoped strictly to that tenant's telemetry, ontology, and records with domain-tailored suggested prompt chips, interactive chat, and verified evidence citations.

3. **Visual Communication of Workspace Separation**:
   - Dynamic per-tenant theme tints (`theme-abc-college`, `theme-city-hospital`, `theme-green-residency`, `theme-apex-industrial`).
   - Prominent air-gapped security badge: `SOC2 / HIPAA COMPLIANT • AIR-GAPPED TENANT ISOLATION • ZERO CROSS-TENANT DATA LEAKAGE`.
   - Distinct organizational iconography, color accents, and tenant identification codes.

---

## Stage 13 — Navigation & Global UI System

Stage 13 establishes a unified, enterprise-grade navigation and global interface system spanning every view of EarlySight. Built with a clean, dignified Warm-Ivory aesthetic (`#FAF8F5`, `#12161C`, stone borders `#E2DCD5`), it guarantees effortless wayfinding, instantaneous cross-page switching, and rapid access to multi-tenant operational intelligence.

### 1. Consistent Professional Sidebar
The sidebar is mounted fixed on the left (collapsible into an ultra-compact 68px icon rail) and contains all required brand and navigation items:
1. **EarlySight**: Brand logo mark with operational radar pulse animation and version subtitle.
2. **Overview**: Executive dashboard, ingress telemetry, and active warnings (`index.html#mainDashboardSection`).
3. **Signals**: Precursor multi-modal weak signals registry (`index.html#signalsSection`).
4. **Emerging Risks**: Synthesized hazard clusters and lead-time alerts (`index.html#emergingRisksSection`).
5. **Map**: Geospatial facility map with gradual cluster merging physics (`map.html`).
6. **Trends**: 7-step problem lifecycle and historical failure comparison (`timeline.html`).
7. **Evidence**: Causal explanation graph and mathematical confidence decomposition (`evidence.html`).
8. **AI Assistant**: Dedicated cross-silo Operational AI Copilot (`copilot.html`).
9. **Actions**: Closed-loop 6-stage operational resolution tracking (`actions.html`).
10. **Resolution**: Impact monitoring, post-intervention signal decay, and ROI verification (`impact.html`).
11. **Analytics**: Cross-facility lead-time benchmarks, tenant KPIs, and multi-org metrics (`workspace.html`).
12. **Settings**: Configuration modal for sensor sampling intervals, notification channels, AI confidence thresholds, and theme settings.

### 2. Global UI Controls
- **Organization Selector**:
  - Embedded in both the Sidebar header and Topbar navigation.
  - Enables instant switching across tenants:
    - `ABC College` (Higher Education Campus • TENANT-EDU-01)
    - `City Hospital` (Tertiary Healthcare • TENANT-MED-02)
    - `Green Residency` (Smart Residential • TENANT-RES-03)
    - `Apex Industrial` (Semiconductor Fab • TENANT-IND-04)
  - Synchronizes selection across browser tabs via `localStorage` (`earlysight_active_tenant`).
- **User Profile**:
  - Located in the sidebar footer and topbar profile chip.
  - Displays user avatar initials (`MV`), operational status dot (`Online`), name (**Marcus Vance**), and title (**Lead Reliability Engineer**).
  - Opens a dedicated User Profile Drawer with role certifications (ISO 13374 vibration analyst), team memberships, active session stats, and security key status.
- **Notifications**:
  - Topbar bell icon with real-time unread counter badge (`3`).
  - Opens an interactive flyout popover detailing high-priority operational alerts (joint leak warning, OR pressure anomaly, elevator motor flutter) with single-click navigation to inspect or mark read.
- **Global Search & Command Palette (`Cmd+K` / `Ctrl+K`)**:
  - Topbar search trigger with keyboard shortcut indicator.
  - Opens a modal command palette with instant filtering across all pages, operational signals, emerging risks, physical assets, and work orders.
  - Supports keyboard navigation (`Escape` to close, arrow keys, and direct link execution).

---

## Stage 14 — Animation & Micro-Interactions System

Stage 14 introduces a cohesive, purposeful, and dignified motion language across EarlySight. Conforming strictly to enterprise operational reliability standards, all micro-interactions are snappy (150ms–350ms with `cubic-bezier(0.16, 1, 0.3, 1)`), informative, and free of gratuitous distractions (zero bouncing, spinning, flashing, neon glows, particle explosions, or 3D tilts). Full accessibility is maintained via `@media (prefers-reduced-motion: reduce)`.

### 1. Architectural Capabilities
- **Smooth Page Transitions**: Seamless opacity and vertical translation entrance (`body.page-loaded`) eliminates jarring layout flash across all pages.
- **Fade / Slide Reveals**: Viewport-triggered reveals via `IntersectionObserver` with cascading child stagger delays (`stagger-1` through `stagger-8`).
- **Animated Numeric Counters**: Numeric values (KPIs, savings, countdown lead times, MTBS frequencies) count up smoothly over 650ms from zero while strictly preserving currency symbols (`$`), decimals, direction arrows (`↓`), signs, and unit suffixes.
- **Animated Charts & SVG Paths**: Stroke-dashoffset transitions on SVG line charts, trend paths, and sparklines, plus smooth vertical growth on comparative loss bars.
- **Node Connection Animations**: Flowing energy dashes along SVG causal flow vectors in the Evidence Graph and Signal Map.
- **Universal Hover Elevation**: Gentle 2px elevation and soft shadow dispersion on cards, pills, and data rows with micro-press scale feedback (`scale(0.985)`).
- **Button Micro-Interactions**: Tactile active press feedback and accessible focus rings across all primary, secondary, and navigation buttons.
- **Loading Skeleton States**: High-fidelity ivory/stone shimmering placeholder states (`.skeleton-box`, `.skeleton-text`, `.skeleton-circle`) for loading simulations.
- **Notification Micro-Animations**: Smooth slide-in/out toast alerts and a slow organic breathing ring pulse on unread badge counters.
- **Timeline Stepper Transitions**: Smooth scaling (`scale(1.22)`) on active timeline nodes and seamless fill progress bar transitions.
- **Smooth Filtering**: Filtered cards transition out gracefully (`is-filtering-out`) during live search queries to prevent abrupt visual popping.
- **Modal Dialog Transitions**: Coordinated backdrop fade-in and dialog scale-up (`scale(0.97)` to `scale(1)`).

---

## Stage 15 — Visual Design System

Stage 15 establishes an unmistakable, enterprise architectural aesthetic palette engineered to communicate operational reliability, restraint, and high legibility without succumbing to the clichéd generic AI tropes (no blue/purple gradients, no cyan neon streaks, no excessive frosted glass).

### 1. Distinctive Aesthetic Palette
- **Deep Forest Green (`#1B4332`)**:
  - Reserved strictly for **primary actions** (`.btn-primary`, `.btn-primary-explore`, `.btn-header-cta`, `.btn-chat-send`) and **important intelligence elements** (AI status beacon `.ai-status-pulse`, ontology sync badges, verified telemetry milestones, AI assistant avatars).
- **Muted Sage (`#5E7E6C`)**:
  - Applied to **secondary elements** (`.btn-secondary`, `.btn-secondary-replay`), secondary filter chips, auxiliary metric badges, supporting flow connectors, and resolved operational tags.
- **Warm Ivory / Off-White (`#FAF8F5`, `#FFFFFF`)**:
  - Forms the **main background** and solid, opaque card surfaces. Generates a dignified, architectural paper feel that promotes extended ergonomic viewing without eye strain.
- **Muted Terracotta (`#C85A32`)**:
  - Reserved for **selected highlights** (active navigation items with left terracotta accent bars, active tab switchers) and **attention states** (critical early warning countdown pills, high-severity emerging risk sparklines, pulsating radar beacon waves, unread notification badges).
- **Soft Sand / Beige (`#EFECE6`, `#F7F5F0`)**:
  - Powers **supporting UI elements**: neutral metadata chips, breadcrumb tracks, table headers (`thead th`), inactive step pips, `<kbd>` keyboard tags, and subtle card dividers.
- **Charcoal (`#1C2024`)**:
  - Provides authoritative contrast and crisp readability for **primary text**, headings, tabular telemetry, and metric values.

### 2. Design Principles & Anti-Patterns Avoided
- **No Generic AI Tropes**: Eradicates the ubiquitous blue + purple + neon gradient aesthetic. The AI Copilot operates as a precision industrial intelligence tool rather than a consumer chatbot.
- **Avoid Excessive Glassmorphism**: Eliminates heavy frosted glass filters (`backdrop-filter: blur(16px)`) and translucent glowing gradients in favor of crisp, solid Warm Ivory cards, clean stone hairline borders (`1px solid rgba(50, 42, 32, 0.08)`), and soft ambient shadows.
- **Subtle Borders & Soft Shadows**: Multi-layered diffused shadows (`rgba(35, 30, 22, 0.04)`) create calm elevation without harsh drop shadows.
- **Clean Spacing**: Consistent rhythmic scale (`--space-*`) across cards, padding, and layout grids.
- **Modern Professional Typography**: Optimized font hierarchy leveraging `Inter`, editorial serif accents (`Newsreader`), and tabular data fonts (`JetBrains Mono`).

---

## STAGE 16 — Responsive Frontend

Stage 16 delivers complete responsive versatility across the entire EarlySight platform, engineering bespoke ergonomics across 4 device classes while guaranteeing that early warnings remain prominent, unclipped, and actionable on every viewport down to 320px.

### 1. Multi-Breakpoint Support Matrix

| Viewport Class | Breakpoint | Primary Ergonomic Goal | Layout Characteristics |
| :--- | :--- | :--- | :--- |
| **Desktop** | `>= 1440px` | **Dashboard & Data Visualization Priority** | High-density 4-column KPI grids, side-by-side comparative views (`sandbox-grid-container`, `historical-compare-grid`), expansive canvas viewports (up to 1720px max-width), multi-pane AI Copilot cockpit (`ai-cockpit-sidebar` 340px + full analysis workspace). |
| **Laptop** | `1024px – 1439px` | **Ergonomic Multi-Column Analytics** | 4-column KPI grids with compact gutters (14px), 2-column emerging risk cards, contained horizontal-scroll 6-stage kanban columns, sidebar collapsible state. |
| **Tablet** | `768px – 1023px` | **Touch-Friendly 2-Column Adaptation** | Full-width canvas without fixed left margins, off-canvas navigation drawer, 2-column card layouts, touch target dimensions >= 44px for fingers, fluid topbar with responsive org/search pills. |
| **Mobile** | `< 768px` (down to 320px) | **Off-Canvas Drawer & Scrollable Sections** | Navigation drawer with backdrop and close button, large dashboards converted into horizontal swipe carousels (scroll snap), preserved 7-stage EarlySight workflow, high-contrast prominent warning badges. |

### 2. Mobile Navigation Drawer System
- **Off-Canvas Architecture**: On mobile and tablet, the desktop sidebar transforms into an off-canvas drawer (`transform: translateX(-100%)`) with an elevated z-index (2100) and smooth cubic-bezier easing (`0.28s cubic-bezier(0.16, 1, 0.3, 1)`).
- **Translucent Backdrop**: A dedicated `.mobile-sidebar-backdrop` dims the rest of the application with subtle Gaussian blur (`backdrop-filter: blur(4px)`) and dismisses the drawer on tap.
- **Dedicated Close Mechanism**: An intuitive `&times;` close button (`#btnMobileDrawerClose`) is embedded directly in the brand header alongside touch targets >= 46px.
- **Auto-Dismiss Intelligence**: Selecting any navigation link (`.sidebar-nav-item`), pressing the `Escape` key, or resizing above the tablet breakpoint automatically closes the drawer.

### 3. Large Dashboards Converted into Horizontal Scrollable Sections
Instead of exploding into endless vertical scrolling that degrades situational awareness, large analytical dashboards become horizontal touch-friendly carousels with CSS Scroll Snap (`scroll-snap-type: x mandatory`):
- **Overview Metrics Grid (`.dash-metrics-grid`)**: Swipable 78%-width metric cards with snap alignment.
- **Emerging Risks Grid (`.emerging-risks-grid`)**: Swipable cards with high-contrast lead-time badges and causal indicators.
- **6-Stage Action Center Board (`.action-kanban-board`)**: Swipable stage columns (86% viewport width) with visible stage headers and transition chips.
- **Causal Decomposition & Upstream Grids**: Horizontal tracks with discreet 4px scroll indicators styled in Soft Sand (`--color-sand-dark`).

### 4. Preservation of the Main EarlySight Workflow
The core philosophical sequence:
$$\text{Scattered Signals} \longrightarrow \text{Connected Data} \longrightarrow \text{Pattern} \longrightarrow \text{Emerging Risk} \longrightarrow \text{Evidence} \longrightarrow \text{Action} \longrightarrow \text{Verification}$$
- **Architectural Pipeline Ribbon**: On mobile, the 7-stage ribbon (`.pipeline-ribbon`) retains its numbered nodes (`01` to `07`), titles, and connectors in a touch-snap track with active step indicators.
- **Hero Cross-Silo Progression**: On small viewports, the horizontal flow transitions gracefully into a vertical hierarchical stack with directional indicators (`▼`), preserving clear visual causality from raw signals down to the 18-day lead-time alert.

### 5. Prominent Warnings & Attention State Legibility
- Warning tags (`.beacon-leadtime-tag`, `.risk-node-badge`, `.urgency-pill`, `.status-pill`) never truncate or clip (`white-space: nowrap`, `flex-shrink: 0`, min 12.5px bold tabular typography).
---

## FINAL DESIGN PRINCIPLE — One Continuous Visual Story

The entire EarlySight platform is orchestrated to tell **one coherent, unbroken visual story** from precursor telemetry ingress to audited downtime avoidance. Rather than presenting fragmented views or disjointed screens, the architecture guides operators, facility directors, and executives through a disciplined 7-stage causal narrative:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE EARLYSIGHT SEVEN-STAGE STORY ARC                 │
├──────┬────────────────────┬────────────────────────────────────────────┤
│ Step │ Stage Name         │ Core Operational Meaning                   │
├──────┼────────────────────┼────────────────────────────────────────────┤
│  01  │ SCATTERED SIGNALS  │ Individual complaints, reports and data    │
│  02  │ CONNECTION         │ Related information gets connected         │
│  03  │ PATTERN            │ A recurring pattern becomes visible        │
│  04  │ EARLY WARNING      │ An emerging problem is identified          │
│  05  │ EVIDENCE           │ The system explains why                    │
│  06  │ ACTION             │ A responsible team investigates and acts   │
│  07  │ VERIFICATION       │ System checks whether problem decreases    │
└──────┴────────────────────┴────────────────────────────────────────────┘
```

### 1. The Landing-Page Canvas Animation
The landing experience (`animation.js`, `signalsCanvas`) visually introduces this entire story arc:
1. **01. Scattered Signals**: 6 isolated multi-modal precursors (operator hum complaints, grease sample discolorations, drone FLIR thermal scans, inverter micro-trips) drift across disparate regions of the canvas in isolated Brownian motion.
2. **02. Connection**: Dynamic connective correlation vectors activate, linking maintenance tickets to vibration telemetry and shift logs across departmental silos.
3. **03. Pattern**: Weak signals snap into a coherent geometric constellation with a pulsating harmonic resonance mesh (91.4% signature match).
4. **04. Early Warning**: A focal warning beacon ignites in Muted Terracotta (`#C85A32`) with radiating radar waves, highlighting quantified lead time (`18.2 Days Lead Time Prior to Outage`).
5. **05. Evidence**: Concentric causal decomposition rings and weight badges unfold around the alert, visualizing the exact root cause weights (Sensors 38%, CMMS 28%, Operator Logs 21%, Acoustics 13%) and displaying `"87% EVIDENCE STRENGTH — The system explains why"`.
6. **06. Action**: An engineering dispatch vector extends to an assigned domain team (`Assigned: Reliability & Mechanical Team — Marcus Vance, PE`) with a targeted corrective maintenance directive and closed-loop SLA countdown.
7. **07. Verification**: Precursor signal flutter and ripple amplitude decay smoothly by 95% into a calm, steady Deep Forest Green (`#1B4332`), confirming nominal baseline restoration and displaying verified averted loss (`$512,000 Loss Averted • Post-Intervention Baseline Verified`).
- **Interactive 7-Step Scrubber**: The scrubber bar below the canvas features 7 dedicated step pips (`1. Scattered Signals` to `7. Verification`), synchronizing the real-time canvas visualization with the top phase monitor pill and narrative text reveals.

### 2. Universal Story Ribbon on Every Dashboard Page
To ensure that **every dashboard page follows the same visual language**, `global-nav.js` injects the persistent **Universal Story Arc Ribbon (`.global-story-banner`)** across all platform pages:
- **Index / Overview (`index.html`)**: Highlights Stage 01 (*Scattered Signals*) and Stage 04 (*Early Warning*).
- **Interactive Signal Map (`map.html`)**: Highlights Stage 01–02 (*Spatial Connection & Cluster Merging*).
- **Trends & Timeline (`timeline.html`)**: Highlights Stage 03 (*Pattern — 7-Step Lifecycle Recurrence*).
- **Evidence & Explainability (`evidence.html`)**: Highlights Stage 05 (*Evidence — "The System Explains Why"*).
- **Action Center (`actions.html`)**: Highlights Stage 06 (*Action — "A Responsible Team Investigates and Acts"*).
- **Resolution & Impact Monitoring (`impact.html`)**: Highlights Stage 07 (*Verification — "The System Checks Whether the Problem Decreases"*).
- **AI Operational Copilot (`copilot.html`)**: Cross-lifecycle industrial intelligence traversing steps 1 through 7 with plant ontology grounding.
- **Multi-Tenant Workspaces (`workspace.html`)**: Multi-facility intelligence across all 5 operational sectors.

Every step in the ribbon is interactive, allowing operators to jump directly to any stage of the story from any page with a single click.

### 3. Authentic Multi-Sector Enterprise Intelligence Product
EarlySight is architected as an authentic enterprise reliability system engineered for mission-critical infrastructure, completely rejecting generic AI chatbot tropes:
- **Higher Education Campuses (Colleges)**: *ABC College* (Academic Quad, Science Complex Fume Scrubbers, Dormitory Heating Boilers).
- **Tertiary Healthcare (Hospitals)**: *City Hospital* (Operating Theatre OR Suite 04 Differential Pressure, Clean Core AHUs, Emergency Backup Generators).
- **Companies & Factories (Heavy Industry & Manufacturing)**: *Apex Industrial Fab 04* (Semiconductor Cleanroom Chillers, Hydraulic Stamping Presses, Joint 4B-12 Flanges).
- **Residential Communities (Smart Real Estate)**: *Green Residency* (Tower Alpha Traction Elevators, Domestic Water Booster Pumps, Stormwater Sump Systems).
- **Public Facilities & Municipal Utilities**: *Metro Municipal* (Regional Aqueduct Pipelines, High-Lift Pumping Stations, EPA Water Compliance).

---

## File Structure

```
c:\EarlySight\
├── index.html              # Master semantic application with landing, dashboard & embedded AI Assistant
├── signals.html            # Dedicated Signals registry with multi-variable filters and signal detail drawer
├── risks.html              # Dedicated Risk & Alerts matrix (Low, Medium, High, Critical) with recommended actions
├── workspace.html          # Dedicated Stage 12 Multi-Organization Workspace application
├── organizations.html      # Stage 12 alias & redirect to workspace.html
├── actions.html            # Dedicated Stage 10 Action Center & Resolution Pipeline
├── impact.html             # Dedicated Stage 11 Impact Monitoring & Resolution Audit
├── copilot.html            # Dedicated Stage 9 AI Assistant & Operational Copilot cockpit
├── map.html                # Dedicated Stage 6 Interactive Signal Map page
├── timeline.html           # Dedicated Stage 7 Trends & Timeline Analysis page
├── evidence.html           # Dedicated Stage 8 Evidence & Explainability page
├── styles.css              # Enterprise styling, multi-tenant themes, global nav & Stage 14 motion system
├── global-nav.js           # Stage 13 universal sidebar, topbar, Cmd+K search, notifs & settings engine
├── micro-interactions.js   # Stage 14 animation engine: counters, reveals, chart draws & micro-press
├── organizations-data.js   # Stage 12 multi-tenant dataset (ABC College, City Hospital, Green Residency, Apex)
├── signals-data.js         # Multi-modal signals, operational registry & pipeline definition
├── dashboard-data.js       # Dashboard KPIs & emerging risk cards
├── actions-data.js         # Resolution tracking & 6-stage lifecycle data
├── impact-data.js          # Pre/post intervention telemetry & decay curves
├── signal-map-data.js      # Facility zones & multi-bay precursor signals
├── timeline-data.js        # Problem lifecycle, trend curves, & historical comparison
├── evidence-data.js        # Structured evidence graphs & explainability models
├── ai-assistant-data.js    # Operational ontology, 5 core queries & evidence-backed responses
├── workspace.js            # Workspace isolation, module rendering & switcher controller
├── actions.js              # Pipeline board, transition animations & inspector
├── impact.js               # Dual-phase trend chart, scrubber & audit controller
├── animation.js            # Retina 2D Canvas engine & hero scrubber controller
├── app.js                  # UI orchestration, scrubber, modal & sandbox interactions
├── signal-map.js           # Interactive Canvas map engine with cluster merging physics
├── dashboard.js            # Dashboard controller, search filter & modal inspectors
├── timeline.js             # Trends & timeline engine with stepper, charts & playback
├── evidence.js             # Connected cards controller, SVG flows & drilldowns
├── ai-assistant.js         # AI Assistant controller, chat feed, SVG generators & deep links
└── README.md               # Comprehensive platform documentation
```
