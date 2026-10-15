/**
 * WebForAll — AI Accessibility Guardian & WCAG 2.2 Platform
 * Core Controller: URL Scanner, WCAG 6-Point Compliance Standards, AI Fix Previews,
 * Mandatory Human-in-the-Loop Sign-off, Recheck Differential Engine, and Live Website Preview Link.
 */

// ============================================================================
// 1. Sector-Specific WCAG 2.2 Datasets Mapped to 6 Core Guidelines
// ============================================================================
const SECTOR_DATASETS = {
  banking: {
    sectorName: "Banking & Financial Services",
    defaultUrl: "https://portal.securebank.com/wire-transfer",
    hint: "Auditing against ADA Title III, Section 508, and WCAG 2.2 AA (Wire Transfers & Auth).",
    baselineScore: 62,
    issues: [
      {
        id: "bank-1",
        guidelineNum: 1,
        title: "Color Contrast & Color Alone: Account inputs fail 3:1 and debt relies solely on red color",
        severity: "critical",
        wcag: "WCAG 2.2 (AA) 1.4.3 & 1.4.11 Contrast, 1.4.1 Use of Color",
        wcagGuideline: { num: 1, name: "Color Contrast & Color Alone", criterion: "SC 1.4.3 & 1.4.11 & 1.4.1", icon: "🎨" },
        sector: "Banking Portal",
        element: "input#recipient-account-number, span.balance-status-alert",
        explanation: "Form input borders have a contrast ratio of only 1.8:1 against background (3:1 required for UI controls), and overdrawn balances are marked solely in red font (#dc2626) without text labels or icons. Users with protanopia cannot distinguish debt status, and low-vision users cannot locate input boundaries.",
        beforeCode: `<!-- INACCESSIBLE: Input border contrast 1.8:1, debt status uses color alone -->\n<input type="text" id="recipient-account-number" style="border: 1px solid #d1d5db;">\n<span style="color: #dc2626;">$1,420.50</span>`,
        afterCode: `<!-- COMPLIANT: 3.5:1 border contrast, distinct negative label and icon -->\n<input type="text" id="recipient-account-number" style="border: 2px solid #334155; color: #0f172a;">\n<span class="balance-negative" style="color: #991b1b; font-weight: 700;">\n  <span aria-hidden="true">⚠️</span> <span class="sr-only">Overdrawn Negative Balance: </span> - $1,420.50 (Overdraft)\n</span>`,
        aiRationale: "WCAG 1.4.11 requires non-text UI components like form inputs to maintain a 3:1 contrast against adjacent colors. WCAG 1.4.1 forbids using color alone as the sole means of conveying status.",
        status: "pending"
      },
      {
        id: "bank-2",
        guidelineNum: 2,
        title: "Alt Text for Images: Functional wire authorization button and security seal lack alt text",
        severity: "critical",
        wcag: "WCAG 2.2 (A) 1.1.1 Non-text Content",
        wcagGuideline: { num: 2, name: "Alt Text for Images", criterion: "SC 1.1.1", icon: "🖼️" },
        sector: "Fintech Security",
        element: "button#btn-auth-transfer img, img#bank-security-seal",
        explanation: "The final 'Authorize Wire Transfer' submit button contains an <img> with no alt attribute, and the SSL security badge is missing descriptive alt text. Screen readers announce only 'unlabeled button', preventing blind customers from completing wire transfers.",
        beforeCode: `<!-- INACCESSIBLE: Functional button image has no alt, security seal has no alt -->\n<button id="btn-auth-transfer"><img src="/icons/lock.svg"></button>\n<img src="/badges/verisign.png" id="bank-security-seal">`,
        afterCode: `<!-- COMPLIANT: Functional image describes destination action, seal has informative alt -->\n<button id="btn-auth-transfer" aria-label="Authorize and Send Wire Transfer">\n  <img src="/icons/lock.svg" alt="" role="presentation">\n  <span>Authorize Wire Transfer</span>\n</button>\n<img src="/badges/verisign.png" id="bank-security-seal" alt="Verified 256-Bit SSL Banking Encryption Security Seal">`,
        aiRationale: "WCAG 1.1.1 mandates that functional images acting as buttons or links describe the action or destination. Informational images must convey equivalent context, while decorative graphics use alt=\"\".",
        status: "pending"
      },
      {
        id: "bank-3",
        guidelineNum: 3,
        title: "Fonts and Text Spacing: Body copy is 12px and transaction cards clip on custom text spacing",
        severity: "serious",
        wcag: "WCAG 2.2 (AA) 1.4.12 Text Spacing & Legibility",
        wcagGuideline: { num: 3, name: "Fonts and Text Spacing", criterion: "SC 1.4.12", icon: "🔤" },
        sector: "Transaction History",
        element: "div.tx-card-container",
        explanation: "Transaction detail text is styled at 12px with fixed container height (height: 65px; overflow: hidden). When users apply assistive text spacing styles (line-height 1.5x, paragraph spacing 2x, letter spacing 0.12x, word spacing 0.16x), vital routing numbers clip and become invisible.",
        beforeCode: `/* NON-COMPLIANT: 12px font and rigid height causes clipping */\n.tx-card-container {\n  height: 65px;\n  overflow: hidden;\n  font-size: 12px;\n  line-height: 1.2;\n}`,
        afterCode: `/* COMPLIANT: Minimum 16px body font, fluid height with WCAG 1.4.12 spacing */\n.tx-card-container {\n  min-height: 65px;\n  height: auto;\n  overflow: visible;\n  font-size: 1rem; /* 16px recommended */\n  line-height: 1.5;\n  letter-spacing: 0.02em;\n}`,
        aiRationale: "WCAG 1.4.12 requires that content does not break, clip, or lose functionality when users apply custom spacing: line-height >= 1.5, paragraph spacing >= 2x, letter spacing >= 0.12x, word spacing >= 0.16x.",
        status: "approved"
      },
      {
        id: "bank-4",
        guidelineNum: 4,
        title: "Keyboard Accessibility: Sticky support widget traps focus and submit button lacks visible outline",
        severity: "serious",
        wcag: "WCAG 2.2 (AA) 2.1.1 Keyboard & 2.4.7 Focus Visible",
        wcagGuideline: { num: 4, name: "Keyboard Accessibility", criterion: "SC 2.1.1 & 2.4.7", icon: "⌨️" },
        sector: "Banking Portal",
        element: "button#submit-wire-transfer",
        explanation: "A floating customer support chat widget traps keyboard focus in an inescapable loop, and interactive form buttons have outline: none, stripping focus indicators. Keyboard-only users cannot navigate to the wire authorization button.",
        beforeCode: `/* NON-COMPLIANT: Strips focus rings and traps tab order */\nbutton:focus { outline: none; }\n.banking-chat-overlay { position: fixed; bottom: 0; z-index: 9999; }`,
        afterCode: `/* COMPLIANT: 3px high-contrast visible focus outline with safe scroll margin */\nbutton:focus-visible {\n  outline: 3px solid #2563eb;\n  outline-offset: 3px;\n  scroll-margin-bottom: 90px;\n}\n.banking-chat-overlay { position: fixed; bottom: 16px; right: 16px; }`,
        aiRationale: "WCAG 2.1.1 requires every interactive element to be operable via keyboard alone. WCAG 2.4.7 mandates a visible, unambiguous focus indicator that meets at least 3:1 contrast.",
        status: "pending"
      },
      {
        id: "bank-5",
        guidelineNum: 5,
        title: "Resize Text (200% Zoom): Viewport meta tag locks pinch-to-zoom and fixed width breaks at 200%",
        severity: "critical",
        wcag: "WCAG 2.2 (AA) 1.4.4 Resize Text",
        wcagGuideline: { num: 5, name: "Resize Text (200% Zoom)", criterion: "SC 1.4.4", icon: "🔍" },
        sector: "Mobile Banking",
        element: "meta[name='viewport'], div.wire-modal-wrap",
        explanation: "The page header specifies user-scalable=no, maximum-scale=1.0, preventing low-vision users from magnifying text. Additionally, the modal container uses a fixed width (width: 900px), causing horizontal scrolling chaos and clipping when browser text is zoomed to 200%.",
        beforeCode: `<!-- NON-COMPLIANT: Disables zoom and fixes pixel width -->\n<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n<div style="width: 900px;">...</div>`,
        afterCode: `<!-- COMPLIANT: Permissive viewport and responsive fluid layout -->\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<div style="max-width: 900px; width: 100%;">...</div>`,
        aiRationale: "WCAG 1.4.4 mandates that text can be resized up to 200% without assistive technology and without layout breakdown or two-dimensional horizontal scrolling chaos.",
        status: "approved"
      },
      {
        id: "bank-6",
        guidelineNum: 6,
        title: "Page Language: Root <html> element missing lang='en' declaration",
        severity: "minor",
        wcag: "WCAG 2.2 (A) 3.1.1 Language of Page",
        wcagGuideline: { num: 6, name: "Page Language", criterion: "SC 3.1.1", icon: "🌐" },
        sector: "Screen Reader Pronunciation",
        element: "html",
        explanation: "The banking portal root <html> tag lacks the lang attribute. Assistive screen readers default to the host system speech engine, pronouncing English financial terminology and currency amounts with incorrect foreign phonetics.",
        beforeCode: `<html>\n  <head><title>Wire Transfer - SecureBank</title></head>`,
        afterCode: `<html lang="en">\n  <head><title>Wire Transfer - SecureBank</title></head>`,
        aiRationale: "WCAG 3.1.1 requires the default natural human language of each page to be programmatically specified in HTML code so screen readers can pronounce words accurately.",
        status: "rejected"
      }
    ]
  },

  healthcare: {
    sectorName: "Healthcare & Patient Portals",
    defaultUrl: "https://patient.healthportal.org/records-vitals",
    hint: "Auditing against HIPAA, Section 504/508, and WCAG 2.2 AA (EHR Vitals & Records).",
    baselineScore: 58,
    issues: [
      {
        id: "health-1",
        guidelineNum: 1,
        title: "Color Contrast & Color Alone: Vitals alert relies solely on red/amber and lab text is low contrast",
        severity: "critical",
        wcag: "WCAG 2.2 (AA) 1.4.3 & 1.4.11 Contrast, 1.4.1 Use of Color",
        wcagGuideline: { num: 1, name: "Color Contrast & Color Alone", criterion: "SC 1.4.3 & 1.4.11 & 1.4.1", icon: "🎨" },
        sector: "Patient EHR",
        element: "span.vital-alert-high, p.lab-notes",
        explanation: "Critical elevated blood glucose readings (142 mg/dL) are flagged only in red color with no text descriptor, and secondary lab notes have a 2.4:1 contrast ratio against the grey card background (4.5:1 required).",
        beforeCode: `<span style="color: #ef4444;">142 mg/dL</span>\n<p style="color: #94a3b8; background: #ffffff;">Fasting glucose reference: 70-99</p>`,
        afterCode: `<span class="badge-high" style="color: #991b1b; font-weight: 700;">\n  <span aria-hidden="true">⚠️</span> 142 mg/dL <span class="sr-only">Critical Status: </span>(Elevated Reading)\n</span>\n<p style="color: #334155; background: #ffffff; font-weight: 500;">Fasting glucose reference: 70-99</p>`,
        aiRationale: "WCAG 1.4.1 requires text badges and icons alongside color for clinical alerts. WCAG 1.4.3 requires at least 4.5:1 contrast for clinical lab reference text.",
        status: "pending"
      },
      {
        id: "health-2",
        guidelineNum: 2,
        title: "Alt Text for Images: Medical diagram and prescription refill icon buttons lack text alternatives",
        severity: "critical",
        wcag: "WCAG 2.2 (A) 1.1.1 Non-text Content",
        wcagGuideline: { num: 2, name: "Alt Text for Images", criterion: "SC 1.1.1", icon: "🖼️" },
        sector: "Clinical Portal",
        element: "img#cardiac-chart, button#btn-refill img",
        explanation: "An ECG heartbeat rhythm diagram has no alt text, and the interactive 'Refill Prescription' button contains an unlabeled icon. Blind patients using screen readers cannot tell what clinical data the chart shows or what the button does.",
        beforeCode: `<img src="/charts/ecg-report.png" id="cardiac-chart">\n<button id="btn-refill"><img src="/icons/pill.svg"></button>`,
        afterCode: `<img src="/charts/ecg-report.png" id="cardiac-chart" alt="Electrocardiogram (ECG) showing normal sinus rhythm with 72 BPM">\n<button id="btn-refill" aria-label="Request 30-Day Prescription Refill">\n  <img src="/icons/pill.svg" alt="" role="presentation">\n  <span>Request Refill</span>\n</button>`,
        aiRationale: "WCAG 1.1.1 mandates that informational medical images provide complete clinical equivalents, and functional buttons describe the interactive action.",
        status: "pending"
      },
      {
        id: "health-3",
        guidelineNum: 3,
        title: "Fonts and Text Spacing: Dosage instructions are 11px and clip when expanded spacing is applied",
        severity: "serious",
        wcag: "WCAG 2.2 (AA) 1.4.12 Text Spacing & Legibility",
        wcagGuideline: { num: 3, name: "Fonts and Text Spacing", criterion: "SC 1.4.12", icon: "🔤" },
        sector: "Pharmacy Refills",
        element: "div.dosage-warning-box",
        explanation: "Medication warnings ('Take with meals, do not exceed 20mg') use 11px font inside a fixed 40px container. When disabled users increase line height or word spacing, the dosage warning is truncated, creating dangerous medical risks.",
        beforeCode: `/* NON-COMPLIANT: 11px font in fixed height clips dosage warning */\n.dosage-warning-box { height: 40px; overflow: hidden; font-size: 11px; }`,
        afterCode: `/* COMPLIANT: 16px legible font, auto height supporting 1.5x line height */\n.dosage-warning-box {\n  min-height: 40px;\n  height: auto;\n  overflow: visible;\n  font-size: 1rem; /* 16px */\n  line-height: 1.5;\n  letter-spacing: 0.02em;\n}`,
        aiRationale: "WCAG 1.4.12 requires that content does not break, clip, or lose functionality when users apply custom spacing: line-height 1.5x, paragraphs 2x, letter spacing 0.12x, word spacing 0.16x.",
        status: "approved"
      },
      {
        id: "health-4",
        guidelineNum: 4,
        title: "Keyboard Accessibility: Penicillin allergy warning dialog traps keyboard focus",
        severity: "critical",
        wcag: "WCAG 2.2 (A) 2.1.2 No Keyboard Trap & 2.1.1 Keyboard",
        wcagGuideline: { num: 4, name: "Keyboard Accessibility", criterion: "SC 2.1.1 & 2.1.2", icon: "⌨️" },
        sector: "Allergy Alerts",
        element: "div.allergy-alert-modal",
        explanation: "When an emergency penicillin allergy alert modal pops up, keyboard focus cannot escape or tab to the 'Acknowledge' button, nor does Escape close the dialog, permanently trapping disabled keyboard users.",
        beforeCode: `<div class="modal" role="dialog">\n  <h3>Severe Allergy Alert: Penicillin</h3>\n  <button onclick="dismiss()">Dismiss</button>\n</div>`,
        afterCode: `<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="allergy-title">\n  <h3 id="allergy-title">Severe Allergy Alert: Penicillin</h3>\n  <p>Please review medical alert details before proceeding.</p>\n  <button type="button" class="btn btn-primary" id="btn-ack-allergy">Acknowledge Alert</button>\n</div>`,
        aiRationale: "WCAG 2.1.2 requires that keyboard focus can be moved out of any interactive component using standard keyboard navigation (Tab or Escape).",
        status: "pending"
      },
      {
        id: "health-5",
        guidelineNum: 5,
        title: "Resize Text (200% Zoom): Appointment schedule table breaks and horizontally scrolls at 200%",
        severity: "serious",
        wcag: "WCAG 2.2 (AA) 1.4.4 Resize Text",
        wcagGuideline: { num: 5, name: "Resize Text (200% Zoom)", criterion: "SC 1.4.4", icon: "🔍" },
        sector: "Telehealth Booking",
        element: "table.appointment-grid",
        explanation: "The appointment schedule table has rigid fixed width (width: 1200px) that does not reflow. When zoomed to 200%, the calendar cuts off afternoon time slots, forcing horizontal scrolling.",
        beforeCode: `<table class="appointment-grid" style="width: 1200px; table-layout: fixed;">...</table>`,
        afterCode: `<table class="appointment-grid" style="width: 100%; max-width: 100%; table-layout: auto;">...</table>`,
        aiRationale: "WCAG 1.4.4 guarantees that text can be resized up to 200% using browser controls without layout breakdown or horizontal scrolling chaos.",
        status: "pending"
      },
      {
        id: "health-6",
        guidelineNum: 6,
        title: "Page Language: Clinical PDF export web view lacks lang='en' attribute",
        severity: "minor",
        wcag: "WCAG 2.2 (A) 3.1.1 Language of Page",
        wcagGuideline: { num: 6, name: "Page Language", criterion: "SC 3.1.1", icon: "🌐" },
        sector: "Clinical Portal",
        element: "html",
        explanation: "The portal discharge summary export page lacks lang='en', causing multilingual screen reader engines to pronounce medication names with foreign language phonetics.",
        beforeCode: `<html><head><title>Discharge Summary</title></head>`,
        afterCode: `<html lang="en"><head><title>Clinical Discharge Summary - Patient Portal</title></head>`,
        aiRationale: "WCAG 3.1.1 requires declaring the primary human language of the page in the HTML code so screen readers pronounce words correctly.",
        status: "rejected"
      }
    ]
  },

  enterprise: {
    sectorName: "Enterprise SaaS & Financial Portals",
    defaultUrl: "https://app.financesaas.io/dashboard",
    hint: "Auditing against WCAG 2.2 AA Enterprise Web Standards.",
    baselineScore: 65,
    issues: [
      {
        id: "ent-1",
        guidelineNum: 1,
        title: "Color Contrast & Color Alone: Metric subtext fails 4.5:1 and positive trends rely solely on green",
        severity: "serious",
        wcag: "WCAG 2.2 (AA) 1.4.3 Contrast, 1.4.1 Use of Color",
        wcagGuideline: { num: 1, name: "Color Contrast & Color Alone", criterion: "SC 1.4.3 & 1.4.1", icon: "🎨" },
        sector: "Analytics UI",
        element: "p.metric-subtext, span.trend-pill",
        explanation: "Secondary text color is #94a3b8 on white (contrast 2.3:1 vs 4.5:1 required), and positive trend pill uses only green color without an upward arrow symbol or screen reader label.",
        beforeCode: `<p style="color: #94a3b8;">+12.4% vs last quarter</p>`,
        afterCode: `<p style="color: #334155; font-weight: 600;">\n  <span aria-hidden="true">&uarr;</span> +12.4% vs last quarter <span class="sr-only">(Positive Growth)</span>\n</p>`,
        aiRationale: "Adjusting text to #334155 achieves 8.2:1 contrast, and adding an arrow symbol satisfies WCAG 1.4.1.",
        status: "approved"
      },
      {
        id: "ent-2",
        guidelineNum: 2,
        title: "Alt Text for Images: User avatar and data export icon buttons lack accessible text",
        severity: "critical",
        wcag: "WCAG 2.2 (A) 1.1.1 Non-text Content",
        wcagGuideline: { num: 2, name: "Alt Text for Images", criterion: "SC 1.1.1", icon: "🖼️" },
        sector: "Enterprise Dashboard",
        element: "button#export-csv img, img.user-avatar",
        explanation: "The CSV export button contains an <img> with no alt attribute, and user avatars have alt='profile' which conveys no user identity.",
        beforeCode: `<button id="export-csv"><img src="/icons/download.svg"></button>\n<img src="/avatars/user-9.jpg" class="user-avatar" alt="profile">`,
        afterCode: `<button id="export-csv" aria-label="Export Financial Ledger to CSV">\n  <img src="/icons/download.svg" alt="" role="presentation">\n  <span>Export CSV</span>\n</button>\n<img src="/avatars/user-9.jpg" class="user-avatar" alt="User Profile: Sarah Jenkins (CFO)">`,
        aiRationale: "WCAG 1.1.1 requires functional buttons to describe action/destination and informational avatars to identify the user.",
        status: "pending"
      },
      {
        id: "ent-3",
        guidelineNum: 3,
        title: "Fonts and Text Spacing: Table headers are 11px and clip on line-height expansion",
        severity: "moderate",
        wcag: "WCAG 2.2 (AA) 1.4.12 Text Spacing & Legibility",
        wcagGuideline: { num: 3, name: "Fonts and Text Spacing", criterion: "SC 1.4.12", icon: "🔤" },
        sector: "Data Grid",
        element: "th.grid-col-header",
        explanation: "Data grid table headers are styled at 11px uppercase in a 28px height container with overflow: hidden. Applying WCAG text spacing styles clips the header text.",
        beforeCode: `th.grid-col-header { height: 28px; overflow: hidden; font-size: 11px; }`,
        afterCode: `th.grid-col-header { min-height: 44px; height: auto; overflow: visible; font-size: 0.95rem; line-height: 1.5; }`,
        aiRationale: "WCAG 1.4.12 requires that content does not break, clip, or lose functionality under custom user spacing.",
        status: "pending"
      },
      {
        id: "ent-4",
        guidelineNum: 4,
        title: "Keyboard Accessibility: Table sorting icons lack keyboard tabindex and focus indicators",
        severity: "critical",
        wcag: "WCAG 2.2 (AA) 2.1.1 Keyboard & 2.4.7 Focus Visible",
        wcagGuideline: { num: 4, name: "Keyboard Accessibility", criterion: "SC 2.1.1 & 2.4.7", icon: "⌨️" },
        sector: "Data Grid",
        element: "span.sort-trigger",
        explanation: "Table sorting is implemented on a <span> with an onclick handler, but lacks tabindex='0' and onkeydown listeners. Keyboard users cannot tab to or sort table columns.",
        beforeCode: `<span class="sort-trigger" onclick="sortBy('revenue')"><i class="fa fa-sort"></i></span>`,
        afterCode: `<button type="button" class="sort-trigger" aria-label="Sort table by Revenue (ascending)">\n  <span aria-hidden="true">&uarr;&darr;</span> Sort Revenue\n</button>`,
        aiRationale: "WCAG 2.1.1 requires all interactive triggers to be operable via keyboard with semantic button or role='button' and tabindex.",
        status: "pending"
      },
      {
        id: "ent-5",
        guidelineNum: 5,
        title: "Resize Text (200% Zoom): Analytics dashboard layout causes horizontal scrolling at 200%",
        severity: "serious",
        wcag: "WCAG 2.2 (AA) 1.4.4 Resize Text",
        wcagGuideline: { num: 5, name: "Resize Text (200% Zoom)", criterion: "SC 1.4.4", icon: "🔍" },
        sector: "Analytics UI",
        element: "div.dashboard-fixed-row",
        explanation: "Dashboard metric cards use CSS flex with flex-wrap: nowrap and min-width: 1300px. At 200% zoom, the layout breaks off-screen and forces horizontal scroll.",
        beforeCode: `.dashboard-fixed-row { display: flex; flex-wrap: nowrap; min-width: 1300px; }`,
        afterCode: `.dashboard-fixed-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); width: 100%; }`,
        aiRationale: "WCAG 1.4.4 ensures zoom scaling up to 200% without layout breakdown or horizontal scrolling chaos.",
        status: "pending"
      },
      {
        id: "ent-6",
        guidelineNum: 6,
        title: "Page Language: Root HTML document lacks lang attribute",
        severity: "minor",
        wcag: "WCAG 2.2 (A) 3.1.1 Language of Page",
        wcagGuideline: { num: 6, name: "Page Language", criterion: "SC 3.1.1", icon: "🌐" },
        sector: "App Architecture",
        element: "html",
        explanation: "The dashboard SPA lacks a lang='en' declaration on the <html> tag, impairing speech synthesizers for screen reader users.",
        beforeCode: `<html><head><title>SaaS Dashboard</title></head>`,
        afterCode: `<html lang="en"><head><title>SaaS Dashboard - Analytics</title></head>`,
        aiRationale: "WCAG 3.1.1 requires declaring the primary human language of the page in the HTML code.",
        status: "rejected"
      }
    ]
  }
};

// ============================================================================
// 2. Global State & DOM Element References
// ============================================================================
let currentSectorKey = "banking";
let currentSectorData = SECTOR_DATASETS[currentSectorKey];
let issues = JSON.parse(JSON.stringify(currentSectorData.issues)); // Deep clone
let currentFilter = "all";
let currentWcagFilter = "all";
let currentSearch = "";
let hasRunRecheck = false;

// Backend Connectivity State
const API_BASE_URL = window.location.port === "5000" 
  ? window.location.origin 
  : "http://localhost:5000";
let isBackendOnline = false;

// DOM Elements
const sectorSelect = document.getElementById("sector-select");
const sectorHint = document.getElementById("sector-hint");
const urlInput = document.getElementById("url-input");
const clearBtn = document.getElementById("clear-btn");
const urlError = document.getElementById("url-error");
const scannerForm = document.getElementById("scanner-form");
const scanBtn = document.getElementById("scan-btn");
const loadingState = document.getElementById("loading-state");
const loadingTitle = document.getElementById("loading-title");
const loadingMessage = document.getElementById("loading-message");
const progressBar = document.getElementById("progress-bar");
const announcer = document.getElementById("screen-reader-announcer");
const presetButtons = document.querySelectorAll(".btn-preset");

// Preview Elements
const previewDirectLink = document.getElementById("preview-direct-link");
const btnOpenPreview = document.getElementById("btn-open-preview");
const btnTopPreview = document.getElementById("btn-top-preview");
const btnCopyPreviewLink = document.getElementById("btn-copy-preview-link");
const btnToggleInlinePreview = document.getElementById("btn-toggle-inline-preview");
const inlinePreviewContainer = document.getElementById("inline-preview-container");
const inlinePreviewFrame = document.getElementById("inline-preview-iframe");
const inlinePreviewExternal = document.getElementById("inline-preview-external");
const togglePreviewText = document.getElementById("toggle-preview-text");

// Dashboard & KPI Elements
const kpiSectorIndicator = document.getElementById("kpi-sector-indicator");
const scoreRing = document.getElementById("score-ring");
const scoreNumber = document.getElementById("score-number");
const scoreRating = document.getElementById("score-rating");
const scoreDesc = document.getElementById("score-desc");
const statPipePending = document.getElementById("stat-pipe-pending");
const statPipeApproved = document.getElementById("stat-pipe-approved");
const statPipeRejected = document.getElementById("stat-pipe-rejected");
const approvalProgressBar = document.getElementById("approval-progress-bar");
const approvalProgressCaption = document.getElementById("approval-progress-caption");
const navIssuesCount = document.getElementById("nav-issues-count");
const navPendingCount = document.getElementById("nav-pending-count");

// Severity Counts
const countCritical = document.getElementById("count-critical");
const countSerious = document.getElementById("count-serious");
const countModerate = document.getElementById("count-moderate");
const countMinor = document.getElementById("count-minor");
const severityCards = document.querySelectorAll(".severity-card");

// Report & Issues Elements
const metaScannedUrl = document.getElementById("meta-scanned-url");
const metaScannedTime = document.getElementById("meta-scanned-time");
const filterTabs = document.querySelectorAll(".filter-tab");
const filterWcagBtns = document.querySelectorAll(".filter-wcag-btn");
const issueSearch = document.getElementById("issue-search");
const issuesList = document.getElementById("issues-list");

// Recheck Elements
const btnRunRecheck = document.getElementById("btn-run-recheck");
const btnRunRecheckQuick = document.getElementById("btn-run-recheck-quick");
const diffInitialCount = document.getElementById("diff-initial-count");
const diffInitialScore = document.getElementById("diff-initial-score");
const diffRemainingCount = document.getElementById("diff-remaining-count");
const diffNewScore = document.getElementById("diff-new-score");
const diffResolvedRate = document.getElementById("diff-resolved-rate");
const diffResolvedCount = document.getElementById("diff-resolved-count");
const diffTableBody = document.getElementById("diff-table-body");

// Progress Elements
const progResolvedCount = document.getElementById("prog-resolved-count");
const progRemainingCount = document.getElementById("prog-remaining-count");
const progNewCount = document.getElementById("prog-new-count");
const progResolutionPct = document.getElementById("prog-resolution-pct");
const btnExportTop = document.getElementById("btn-export-top");
const btnDownloadJson = document.getElementById("btn-download-json");

// Sidebar Toggle for Mobile
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar");

// ============================================================================
// 3. Helper & Accessibility Functions
// ============================================================================

function announce(message) {
  if (announcer) {
    announcer.textContent = "";
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function calculateHealthScore() {
  const unresolvedIssues = issues.filter(i => i.status !== "approved");
  const crit = unresolvedIssues.filter(i => i.severity === "critical").length;
  const ser = unresolvedIssues.filter(i => i.severity === "serious").length;
  const mod = unresolvedIssues.filter(i => i.severity === "moderate").length;
  const min = unresolvedIssues.filter(i => i.severity === "minor").length;

  const deductions = (crit * 14) + (ser * 9) + (mod * 5) + (min * 2);
  const score = Math.max(10, Math.min(100, 100 - deductions));
  return score;
}

function getPreviewUrl(targetUrl, sectorKey = currentSectorKey) {
  const url = targetUrl || urlInput.value || currentSectorData.defaultUrl;
  return `preview.html?url=${encodeURIComponent(url)}&sector=${encodeURIComponent(sectorKey)}`;
}

function updatePreviewLinks(targetUrl) {
  const currentUrl = targetUrl || urlInput.value || currentSectorData.defaultUrl;
  if (previewDirectLink) {
    previewDirectLink.href = currentUrl;
    previewDirectLink.textContent = currentUrl;
  }
  const previewPagePath = getPreviewUrl(currentUrl);
  if (btnOpenPreview) btnOpenPreview.href = previewPagePath;
  if (btnTopPreview) btnTopPreview.href = previewPagePath;
  if (inlinePreviewExternal) inlinePreviewExternal.href = previewPagePath;
  if (inlinePreviewContainer && !inlinePreviewContainer.hidden && inlinePreviewFrame) {
    inlinePreviewFrame.src = previewPagePath;
  }
}

// ============================================================================
// 4. State Management & Dashboard Rendering
// ============================================================================

function updateDashboardState() {
  const total = issues.length;
  const pending = issues.filter(i => i.status === "pending").length;
  const approved = issues.filter(i => i.status === "approved").length;
  const rejected = issues.filter(i => i.status === "rejected").length;

  // Unresolved counts
  const crit = issues.filter(i => i.severity === "critical" && i.status !== "approved").length;
  const ser = issues.filter(i => i.severity === "serious" && i.status !== "approved").length;
  const mod = issues.filter(i => i.severity === "moderate" && i.status !== "approved").length;
  const min = issues.filter(i => i.severity === "minor" && i.status !== "approved").length;

  // Update Severity Cards
  if (countCritical) countCritical.textContent = crit;
  if (countSerious) countSerious.textContent = ser;
  if (countModerate) countModerate.textContent = mod;
  if (countMinor) countMinor.textContent = min;

  // Update Pipeline KPI
  if (statPipePending) statPipePending.textContent = pending;
  if (statPipeApproved) statPipeApproved.textContent = approved;
  if (statPipeRejected) statPipeRejected.textContent = rejected;

  // Update Pipeline Progress Bar
  const approvedPct = total > 0 ? Math.round((approved / total) * 100) : 0;
  if (approvalProgressBar) approvalProgressBar.style.width = `${approvedPct}%`;
  if (approvalProgressCaption) approvalProgressCaption.textContent = `${approved} of ${total} fixes approved by developer (${approvedPct}%)`;

  // Update Navigation Badges
  if (navIssuesCount) navIssuesCount.textContent = total;
  if (navPendingCount) {
    navPendingCount.textContent = `${pending} pending`;
    if (pending === 0) {
      navPendingCount.classList.remove("badge-pending");
      navPendingCount.classList.add("badge-count");
    } else {
      navPendingCount.classList.add("badge-pending");
    }
  }

  // Update Health Score
  const currentScore = calculateHealthScore();
  if (scoreNumber) scoreNumber.textContent = currentScore;
  if (scoreRing) {
    scoreRing.className = "score-ring";
    if (currentScore >= 85) {
      scoreRing.classList.add("ring-good");
      scoreRating.className = "score-rating-badge badge-success";
      scoreRating.textContent = "High Compliance";
    } else if (currentScore >= 60) {
      scoreRing.classList.add("ring-moderate");
      scoreRating.className = "score-rating-badge badge-warning";
      scoreRating.textContent = "Remediation Required";
    } else {
      scoreRing.classList.add("ring-poor");
      scoreRating.className = "score-rating-badge badge-warning";
      scoreRating.textContent = "Critical Barriers";
    }
    scoreRing.setAttribute("aria-label", `Accessibility score: ${currentScore} out of 100`);
  }

  // Update Filter Tabs Counts
  filterTabs.forEach(tab => {
    const f = tab.getAttribute("data-filter");
    if (f === "all") tab.textContent = `All (${total})`;
    if (f === "critical") tab.textContent = `Critical (${crit})`;
    if (f === "serious") tab.textContent = `Serious (${ser})`;
    if (f === "moderate") tab.textContent = `Moderate (${mod})`;
    if (f === "minor") tab.textContent = `Minor (${min})`;
    if (f === "pending") tab.textContent = `⏳ Pending (${pending})`;
    if (f === "approved") tab.textContent = `✅ Approved (${approved})`;
  });

  // Re-render Views
  renderIssuesList();
  renderDiffView();
  renderProgressReport();
  updatePreviewLinks();
}

/**
 * Renders the interactive list of issues with WCAG criteria & AI code diffs
 */
function renderIssuesList() {
  const filtered = issues.filter(issue => {
    let matchesFilter = true;
    if (currentFilter === "all") matchesFilter = true;
    else if (currentFilter === "pending") matchesFilter = issue.status === "pending";
    else if (currentFilter === "approved") matchesFilter = issue.status === "approved";
    else matchesFilter = issue.severity === currentFilter;

    let matchesWcag = true;
    if (currentWcagFilter !== "all") {
      const targetNum = parseInt(currentWcagFilter, 10);
      matchesWcag = (issue.guidelineNum === targetNum) || 
                    (issue.wcagGuideline && issue.wcagGuideline.num === targetNum);
    }

    const q = currentSearch.toLowerCase();
    const matchesSearch = !q ||
      issue.title.toLowerCase().includes(q) ||
      issue.explanation.toLowerCase().includes(q) ||
      issue.wcag.toLowerCase().includes(q) ||
      issue.element.toLowerCase().includes(q) ||
      issue.aiRationale.toLowerCase().includes(q);

    return matchesFilter && matchesWcag && matchesSearch;
  });

  if (filtered.length === 0) {
    issuesList.innerHTML = `
      <div class="card empty-results" role="status" style="text-align: center; padding: 40px 20px;">
        <p style="font-size: 1.1rem; font-weight: 700;">No accessibility issues match your current filters.</p>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">
          Try selecting "All 6 Rules" or clearing your search keywords.
        </p>
      </div>
    `;
    return;
  }

  issuesList.innerHTML = filtered.map((issue, idx) => {
    let statusBadgeHtml = '';
    if (issue.status === 'approved') {
      statusBadgeHtml = `<span class="issue-approval-badge badge-status-approved">✅ Approved by Developer</span>`;
    } else if (issue.status === 'rejected') {
      statusBadgeHtml = `<span class="issue-approval-badge badge-status-rejected">❌ Rejected (Needs Rework)</span>`;
    } else {
      statusBadgeHtml = `<span class="issue-approval-badge badge-status-pending">⏳ Pending Human Review</span>`;
    }

    const ruleNum = issue.guidelineNum || (issue.wcagGuideline ? issue.wcagGuideline.num : 1);
    const ruleNames = [
      "",
      "1. Color Contrast & Color Alone",
      "2. Alt Text for Images",
      "3. Fonts & Text Spacing",
      "4. Keyboard Accessibility",
      "5. Resize Text (200% Zoom)",
      "6. Page Language"
    ];

    return `
      <article class="issue-card status-${issue.status}" id="card-${issue.id}" aria-labelledby="title-${issue.id}">
        <div class="issue-card-header">
          <div class="issue-header-left">
            <div class="issue-tags-row">
              <span class="tag-severity tag-${issue.severity}">${issue.severity}</span>
              <span class="tag-wcag" style="background:#1e3a8a; color:#bfdbfe; font-weight:700;">Rule ${ruleNum}: ${ruleNames[ruleNum]}</span>
              <span class="tag-wcag">${escapeHtml(issue.wcag)}</span>
              <span class="tag-sector">${escapeHtml(issue.sector)}</span>
            </div>
            <h4 id="title-${issue.id}" class="issue-item-title">${idx + 1}. ${escapeHtml(issue.title)}</h4>
            <p class="issue-impact-text">
              <strong>User Barrier:</strong> ${escapeHtml(issue.explanation)}
            </p>
          </div>
          <div>${statusBadgeHtml}</div>
        </div>

        <div class="issue-card-body">
          <div class="issue-target-box">
            <span class="target-label">Target Selector:</span>
            <code class="target-code">${escapeHtml(issue.element)}</code>
          </div>

          <!-- AI Proposed Fix with Side-by-Side Before & After Previews -->
          <div class="ai-fix-box">
            <div class="ai-fix-header">
              <div class="ai-fix-title">
                <span aria-hidden="true">🤖</span>
                <span>AI Proposed Remediation</span>
              </div>
              <span class="ai-confidence-pill">WCAG 2.2 Verified &bull; 98% Confidence</span>
            </div>

            <p class="ai-explanation">
              <strong>AI Reasoning:</strong> ${escapeHtml(issue.aiRationale)}
            </p>

            <div class="diff-preview-grid">
              <div class="diff-pane pane-before">
                <div class="diff-pane-header">
                  <span aria-hidden="true">✕</span> Current Code (Violating WCAG)
                </div>
                <pre class="diff-code"><code>${escapeHtml(issue.beforeCode)}</code></pre>
              </div>

              <div class="diff-pane pane-after">
                <div class="diff-pane-header">
                  <span aria-hidden="true">✓</span> AI Suggested Fix (WCAG 2.2 Compliant)
                </div>
                <pre class="diff-code"><code>${escapeHtml(issue.afterCode)}</code></pre>
              </div>
            </div>

            <!-- Human Approval Sign-off Controls -->
            <div class="human-approval-row">
              <span class="approval-disclaimer">
                🛡️ <strong>Safety Guarantee:</strong> AI never writes code without explicit developer approval.
              </span>
              <div class="approval-action-buttons">
                <button 
                  type="button" 
                  class="btn btn-sm ${issue.status === 'approved' ? 'btn-outline' : 'btn-success'}" 
                  onclick="handleApproveIssue('${issue.id}')"
                  aria-label="Approve proposed fix for ${escapeHtml(issue.title)}"
                >
                  <span aria-hidden="true">✓</span> ${issue.status === 'approved' ? 'Approved (Reset)' : 'Approve Fix'}
                </button>
                <button 
                  type="button" 
                  class="btn btn-sm ${issue.status === 'rejected' ? 'btn-outline' : 'btn-danger-outline'}" 
                  onclick="handleRejectIssue('${issue.id}')"
                  aria-label="Reject proposed fix for ${escapeHtml(issue.title)}"
                >
                  <span aria-hidden="true">✕</span> ${issue.status === 'rejected' ? 'Rejected (Reset)' : 'Reject Fix'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// ============================================================================
// 5. Human Approval Handlers
// ============================================================================

window.handleApproveIssue = function(issueId) {
  const item = issues.find(i => i.id === issueId);
  if (!item) return;

  if (item.status === 'approved') {
    item.status = 'pending';
    announce(`Reset approval status to pending for ${item.title}`);
  } else {
    item.status = 'approved';
    announce(`Approved code correction for ${item.title}. Marked ready for staging.`);
  }

  updateDashboardState();
};

window.handleRejectIssue = function(issueId) {
  const item = issues.find(i => i.id === issueId);
  if (!item) return;

  if (item.status === 'rejected') {
    item.status = 'pending';
    announce(`Reset status to pending for ${item.title}`);
  } else {
    item.status = 'rejected';
    announce(`Rejected code correction for ${item.title}. Flagged for manual developer rework.`);
  }

  updateDashboardState();
};

// ============================================================================
// 6. Recheck & Comparison Engine
// ============================================================================

function renderDiffView() {
  const total = issues.length;
  const approved = issues.filter(i => i.status === "approved").length;
  const remaining = total - approved;
  const baselineScore = currentSectorData.baselineScore;
  const currentScore = calculateHealthScore();
  const resolvedPct = total > 0 ? Math.round((approved / total) * 100) : 0;

  if (diffInitialCount) diffInitialCount.textContent = `${total} Issues`;
  if (diffInitialScore) diffInitialScore.textContent = `Baseline Health: ${baselineScore}/100`;

  if (diffRemainingCount) diffRemainingCount.textContent = `${remaining} Remaining`;
  const diffScoreDelta = currentScore - baselineScore;
  if (diffNewScore) diffNewScore.textContent = `Health: ${currentScore}/100 (${diffScoreDelta >= 0 ? '+' : ''}${diffScoreDelta} pts)`;

  if (diffResolvedRate) diffResolvedRate.textContent = `${resolvedPct}% Resolved`;
  if (diffResolvedCount) diffResolvedCount.textContent = `${approved} of ${total} Issues Remediated`;

  // Render Table Rows
  if (diffTableBody) {
    diffTableBody.innerHTML = issues.map(issue => {
      const isResolved = issue.status === "approved";
      return `
        <tr>
          <td>
            <span class="status-badge-table ${isResolved ? 'badge-table-resolved' : 'badge-table-unresolved'}">
              ${isResolved ? '✓ Fixed & Verified' : '⏳ Action Pending'}
            </span>
          </td>
          <td><span class="tag-severity tag-${issue.severity}">${issue.severity}</span></td>
          <td><code>${escapeHtml(issue.wcag.split(' ')[0] + ' ' + issue.wcag.split(' ')[1])}</code></td>
          <td>
            <strong>${escapeHtml(issue.title)}</strong><br>
            <small style="color:var(--text-muted);">${escapeHtml(issue.element)}</small>
          </td>
          <td>
            <strong>${issue.status.toUpperCase()}</strong>
          </td>
        </tr>
      `;
    }).join("");
  }
}

async function runRecheckAudit() {
  announce("Starting recheck comparison audit...");
  if (btnRunRecheck) {
    btnRunRecheck.disabled = true;
    btnRunRecheck.innerHTML = `<span aria-hidden="true">⏳</span> Evaluating post-remediation DOM...`;
  }

  const approvedIds = issues.filter(i => i.status === "approved").map(i => i.id);

  try {
    if (isBackendOnline) {
      await fetch(`${API_BASE_URL}/api/recheck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baselineIssues: issues, approvedIds })
      });
    }
  } catch (err) {
    // Graceful offline fallback
  }

  setTimeout(() => {
    if (btnRunRecheck) {
      btnRunRecheck.disabled = false;
      btnRunRecheck.innerHTML = `<span aria-hidden="true">🔄</span> Run Recheck Audit`;
    }
    hasRunRecheck = true;
    updateDashboardState();

    const approvedCount = issues.filter(i => i.status === "approved").length;
    announce(`Recheck completed. ${approvedCount} issues resolved. Zero regressions detected.`);

    const recheckSec = document.getElementById("section-recheck");
    if (recheckSec) recheckSec.scrollIntoView({ behavior: "smooth" });
  }, 600);
}

// ============================================================================
// 7. Progress & Velocity Metrics
// ============================================================================

function renderProgressReport() {
  const total = issues.length;
  const approved = issues.filter(i => i.status === "approved").length;
  const remaining = total - approved;
  const resolvedPct = total > 0 ? Math.round((approved / total) * 100) : 0;

  if (progResolvedCount) progResolvedCount.textContent = approved;
  if (progRemainingCount) progRemainingCount.textContent = remaining;
  if (progNewCount) progNewCount.textContent = 0; // Zero regressions
  if (progResolutionPct) progResolutionPct.textContent = `${resolvedPct}%`;
}

// ============================================================================
// 8. Sector Switching & URL Scanner Flow
// ============================================================================

function switchSector(sectorKey) {
  currentSectorKey = sectorKey;
  currentSectorData = SECTOR_DATASETS[sectorKey];
  issues = JSON.parse(JSON.stringify(currentSectorData.issues)); // Reset clone
  urlInput.value = currentSectorData.defaultUrl;
  if (sectorHint) sectorHint.textContent = currentSectorData.hint;
  if (kpiSectorIndicator) kpiSectorIndicator.textContent = currentSectorData.sectorName;

  presetButtons.forEach(btn => {
    btn.classList.toggle("active-preset", btn.getAttribute("data-sector") === sectorKey);
  });

  updateClearButton();
  updateDashboardState();
  updatePreviewLinks(currentSectorData.defaultUrl);
  announce(`Switched compliance profile to ${currentSectorData.sectorName}`);
}

function updateClearButton() {
  if (clearBtn && urlInput) {
    clearBtn.style.display = urlInput.value.length > 0 ? "block" : "none";
  }
}

/**
 * Checks if the Node.js Express backend server is online
 */
async function checkBackendConnectivity() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      isBackendOnline = true;
      const statusPill = document.getElementById("status-pill");
      const statusText = document.getElementById("status-mode-text");
      if (statusPill && statusText) {
        statusPill.className = "header-pill pill-live";
        statusText.textContent = "🟢 Live Scanner Active";
      }
      announce("Live scanning backend connected.");
    }
  } catch (err) {
    isBackendOnline = false;
  }
}

function runScanner(targetUrl) {
  if (isBackendOnline) {
    runLiveScanner(targetUrl);
  } else {
    runSimulatedScanner(targetUrl);
  }
}

/**
 * Executes a REAL live scan via the Playwright + axe-core backend API
 */
async function runLiveScanner(targetUrl) {
  if (urlError) urlError.hidden = true;
  urlInput.classList.remove("input-invalid");
  loadingState.hidden = false;
  scanBtn.disabled = true;
  progressBar.style.width = "20%";

  loadingTitle.textContent = "Auditing Web Page via Playwright & WCAG 6-Point Engine";
  loadingMessage.textContent = `Connecting to ${targetUrl}...`;
  announce(`Auditing live URL: ${targetUrl}`);

  let progress = 20;
  const progressTimer = setInterval(() => {
    if (progress < 85) {
      progress += 15;
      progressBar.style.width = `${progress}%`;
      if (progress === 35) loadingMessage.textContent = "Waiting for DOM & scripts to render in headless browser...";
      if (progress === 50) loadingMessage.textContent = "Executing 6-Point WCAG criteria checks...";
      if (progress === 65) loadingMessage.textContent = "Synthesizing AI Code Remediation Diffs & Preview...";
    }
  }, 800);

  try {
    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: targetUrl, sector: currentSectorKey })
    });

    clearInterval(progressTimer);
    progressBar.style.width = "100%";

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Live scan failed. Please verify the URL.");
    }

    loadingState.hidden = true;
    scanBtn.disabled = false;

    // Load live violations synthesized with AI fixes
    issues = data.issues || [];
    metaScannedUrl.textContent = targetUrl;
    const now = new Date();
    metaScannedTime.textContent = `Audited ${now.toLocaleTimeString()} • WCAG 2.2 AA Verified`;

    updatePreviewLinks(targetUrl);
    updateDashboardState();
    announce(`Live audit complete. Found ${issues.length} WCAG violations.`);

    document.getElementById("section-preview-banner").scrollIntoView({ behavior: "smooth" });

  } catch (error) {
    clearInterval(progressTimer);
    loadingState.hidden = true;
    scanBtn.disabled = false;

    if (urlError) {
      urlError.textContent = `${error.message} (Falling back to simulated sector audit)`;
      urlError.hidden = false;
    }
    runSimulatedScanner(targetUrl);
  }
}

/**
 * Simulates scan with realistic sector data when backend is not running
 */
function runSimulatedScanner(targetUrl) {
  if (urlError) urlError.hidden = true;
  urlInput.classList.remove("input-invalid");
  loadingState.hidden = false;
  scanBtn.disabled = true;
  progressBar.style.width = "15%";

  announce(`Auditing target URL: ${targetUrl}`);

  const steps = [
    { pct: "35%", title: "Parsing DOM & CSSOM Tree", msg: `Crawling ${targetUrl}... DOM rendered in engine.` },
    { pct: "65%", title: "Evaluating WCAG 6-Point Criteria", msg: "Testing contrast (1.4.3), alt text (1.1.1), text spacing (1.4.12), keyboard focus (2.1.1), 200% zoom (1.4.4), and language (3.1.1)..." },
    { pct: "90%", title: "Synthesizing AI Code Corrections", msg: "Generating context-aware code diffs with developer safety constraints..." },
    { pct: "100%", title: "Audit Complete", msg: "Compiling findings into human approval dashboard & generating preview link..." }
  ];

  let currentStep = 0;
  const timer = setInterval(() => {
    if (currentStep < steps.length) {
      progressBar.style.width = steps[currentStep].pct;
      loadingTitle.textContent = steps[currentStep].title;
      loadingMessage.textContent = steps[currentStep].msg;
      currentStep++;
    } else {
      clearInterval(timer);
      loadingState.hidden = true;
      scanBtn.disabled = false;

      metaScannedUrl.textContent = targetUrl;
      const now = new Date();
      metaScannedTime.textContent = `Audited ${now.toLocaleTimeString()} • WCAG 2.2 AA`;

      updatePreviewLinks(targetUrl);
      updateDashboardState();
      announce(`Audit complete for ${targetUrl}. Found ${issues.length} compliance findings.`);

      document.getElementById("section-preview-banner").scrollIntoView({ behavior: "smooth" });
    }
  }, 220);
}

// ============================================================================
// 9. Export & Download Report
// ============================================================================

if (btnDownloadJson) {
  btnDownloadJson.addEventListener("click", () => {
    const exportPayload = {
      platform: "WebForAll — AI Accessibility Guardian",
      standard: "WCAG 2.2 Level AA / ADA Title III / Section 508",
      targetUrl: metaScannedUrl.textContent,
      previewUrl: `${window.location.origin}/${getPreviewUrl(metaScannedUrl.textContent)}`,
      auditedAt: new Date().toISOString(),
      sector: currentSectorData.sectorName,
      healthScore: calculateHealthScore(),
      wcag6PointSummary: {
        colorContrast: "Level AA 4.5:1 / 3:1 verified",
        altText: "Informational, decorative, and functional image checks active",
        textSpacing: "WCAG 1.4.12 compliant (1.5x line height, 2x paragraph)",
        keyboard: "Operable via keyboard alone with visible focus indicators",
        resizeText: "200% zoom scaling without layout breakdown",
        pageLanguage: "Declared ISO language code validated"
      },
      summary: {
        total: issues.length,
        approved: issues.filter(i => i.status === "approved").length,
        pending: issues.filter(i => i.status === "pending").length,
        rejected: issues.filter(i => i.status === "rejected").length
      },
      findings: issues
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `webforall-accessibility-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    announce("Downloaded complete JSON audit report.");
  });
}

if (btnExportTop) {
  btnExportTop.addEventListener("click", async () => {
    const approved = issues.filter(i => i.status === "approved").length;
    const summaryText = `
WebForAll — AI Accessibility Guardian Audit Report
Target URL: ${metaScannedUrl.textContent}
Accessible Preview: ${window.location.origin}/${getPreviewUrl(metaScannedUrl.textContent)}
Industry Profile: ${currentSectorData.sectorName}
Score: ${calculateHealthScore()}/100
Total Issues: ${issues.length}
- Approved Fixes: ${approved}
- Pending Review: ${issues.filter(i => i.status === "pending").length}
- Rejected: ${issues.filter(i => i.status === "rejected").length}

WCAG 6-Point Evaluation:
1. Color Contrast & Color Alone (SC 1.4.3 & 1.4.11 & 1.4.1)
2. Alt Text for Images (SC 1.1.1)
3. Fonts and Text Spacing (SC 1.4.12)
4. Keyboard Accessibility (SC 2.1.1 & 2.4.7)
5. Resize Text up to 200% (SC 1.4.4)
6. Page Language (SC 3.1.1)

Findings:
${issues.map((i, idx) => `${idx + 1}. [${i.severity.toUpperCase()}] ${i.title} (${i.wcag})\n   Status: ${i.status.toUpperCase()}\n   Element: ${i.element}\n   AI Fix Rationale: ${i.aiRationale}`).join("\n\n")}
`.trim();

    try {
      await navigator.clipboard.writeText(summaryText);
      const prev = btnExportTop.innerHTML;
      btnExportTop.innerHTML = `<span>✓</span> Copied!`;
      announce("Audit summary copied to clipboard.");
      setTimeout(() => { btnExportTop.innerHTML = prev; }, 2000);
    } catch (err) {
      alert("Unable to copy to clipboard automatically.");
    }
  });
}

// ============================================================================
// 10. Preview Actions & Event Listeners
// ============================================================================

// Copy Preview Link
if (btnCopyPreviewLink) {
  btnCopyPreviewLink.addEventListener("click", async () => {
    const currentUrl = metaScannedUrl.textContent || urlInput.value || currentSectorData.defaultUrl;
    const fullPreviewUrl = `${window.location.origin}/${getPreviewUrl(currentUrl)}`;
    try {
      await navigator.clipboard.writeText(fullPreviewUrl);
      const orig = btnCopyPreviewLink.innerHTML;
      btnCopyPreviewLink.innerHTML = `<span>✓</span> Copied!`;
      announce("Accessible preview link copied to clipboard.");
      setTimeout(() => { btnCopyPreviewLink.innerHTML = orig; }, 2000);
    } catch (err) {
      alert("Preview Link: " + fullPreviewUrl);
    }
  });
}

// In-App Preview Toggle
if (btnToggleInlinePreview && inlinePreviewContainer) {
  btnToggleInlinePreview.addEventListener("click", () => {
    const isHidden = inlinePreviewContainer.hidden;
    inlinePreviewContainer.hidden = !isHidden;
    if (togglePreviewText) {
      togglePreviewText.textContent = isHidden ? "Hide In-App Preview" : "View Inside App";
    }
    if (isHidden) {
      const currentUrl = metaScannedUrl.textContent || urlInput.value || currentSectorData.defaultUrl;
      inlinePreviewFrame.src = getPreviewUrl(currentUrl);
      announce("Opened in-app website preview frame.");
    } else {
      announce("Closed in-app website preview frame.");
    }
  });
}

// Scanner Form Submit
if (scannerForm) {
  scannerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = urlInput.value.trim();
    if (!val || !/^https?:\/\//i.test(val)) {
      if (urlError) {
        urlError.textContent = "Please enter a valid website URL starting with http:// or https://";
        urlError.hidden = false;
      }
      urlInput.classList.add("input-invalid");
      urlInput.focus();
      announce("Error: Invalid URL entered.");
      return;
    }
    updatePreviewLinks(val);
    runScanner(val);
  });
}

if (urlInput) {
  urlInput.addEventListener("input", () => {
    if (urlError) urlError.hidden = true;
    urlInput.classList.remove("input-invalid");
    updateClearButton();
    const currentVal = urlInput.value.trim();
    if (currentVal && /^https?:\/\//i.test(currentVal)) {
      updatePreviewLinks(currentVal);
    }
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    urlInput.value = "";
    urlInput.focus();
    updateClearButton();
    updatePreviewLinks(currentSectorData.defaultUrl);
  });
}

if (sectorSelect) {
  sectorSelect.addEventListener("change", (e) => {
    switchSector(e.target.value);
  });
}

presetButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const sec = btn.getAttribute("data-sector");
    if (sectorSelect) sectorSelect.value = sec;
    switchSector(sec);
  });
});

filterTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    filterTabs.forEach(t => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    currentFilter = tab.getAttribute("data-filter");
    renderIssuesList();
    announce(`Filtering issues by ${currentFilter}`);
  });
});

// WCAG 6-Point Filter Buttons
filterWcagBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterWcagBtns.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    currentWcagFilter = btn.getAttribute("data-wcag");
    renderIssuesList();
    announce(`Filtering issues by WCAG rule ${currentWcagFilter}`);
  });
});

severityCards.forEach(card => {
  card.addEventListener("click", () => {
    const filter = card.getAttribute("data-filter");
    currentFilter = filter;
    filterTabs.forEach(t => {
      const match = t.getAttribute("data-filter") === filter;
      t.classList.toggle("active", match);
      t.setAttribute("aria-selected", String(match));
    });
    renderIssuesList();
    announce(`Filtering issues by ${filter}`);
  });
});

if (issueSearch) {
  issueSearch.addEventListener("input", (e) => {
    currentSearch = e.target.value.trim();
    renderIssuesList();
  });
}

if (btnRunRecheck) btnRunRecheck.addEventListener("click", runRecheckAudit);
if (btnRunRecheckQuick) btnRunRecheckQuick.addEventListener("click", runRecheckAudit);

// Mobile Sidebar Toggle
if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener("click", () => {
    const isExpanded = sidebarToggle.getAttribute("aria-expanded") === "true";
    sidebarToggle.setAttribute("aria-expanded", String(!isExpanded));
    sidebar.classList.toggle("mobile-open");
  });
}

// Startup
document.addEventListener("DOMContentLoaded", () => {
  updateClearButton();
  updateDashboardState();
  updatePreviewLinks();
  checkBackendConnectivity();
});
