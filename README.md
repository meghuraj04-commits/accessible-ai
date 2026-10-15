# 🛡️ WebForAll — AI Accessibility Guardian & WCAG 2.2 Suite

> **An intelligent, human-in-the-loop accessibility auditing, remediation, and live preview platform built for enterprise banking, financial services, healthcare patient portals, and public websites.**

---

## 🌟 Overview

Ensuring digital accessibility is legally mandated under **ADA Title III**, **Section 508**, and **HHS Section 504**. **WebForAll** audits web pages against clear, testable standards for visual, textual, and keyboard accessibility, synthesizes context-aware AI code fixes with developer safety sign-offs, and provides an **Accessible Live Website Preview Suite** with direct shareable links.

---

## 📐 WCAG 6-Point Compliance Standards

WebForAll audits and validates against the 6 core visual and text accessibility guidelines:

1. **Color Contrast (Success Criterion 1.4.3 & 1.4.11 & 1.4.1)**
   - **Normal Text:** Minimum contrast ratio of 4.5:1 against background (Level AA).
   - **Large Text:** Minimum contrast ratio of 3:1 (18pt/24px or 14pt/18.6px bold and above).
   - **UI Components & Graphics:** Non-text elements like form inputs, buttons, and icons require 3:1 contrast against adjacent colors.
   - **Color Alone (SC 1.4.1):** Color cannot be the sole way to convey information, trigger actions, or denote links; text labels, icons, or patterns are enforced.

2. **Alt Text for Images (Success Criterion 1.1.1)**
   - **Informational Images:** All non-text content must have a text alternative (`alt` attribute) conveying equivalent meaning or function.
   - **Decorative Images:** Purely aesthetic or background images are hidden from screen readers using an empty alt attribute (`alt=""`) or CSS `role="presentation"`.
   - **Functional Images (Buttons/Icons):** Images acting as links or submit buttons describe the action or destination.

3. **Fonts and Text Spacing (Success Criterion 1.4.12)**
   - **Font Size Rules:** Industry consensus recommends a minimum of 16px for comfortable body text.
   - **User-Customized Text Spacing:** Content does not break, clip, or lose functionality under custom browser styles:
     - Line height (`line-height`): At least 1.5 times the font size.
     - Paragraph spacing: At least 2 times the font size.
     - Letter spacing (tracking): At least 0.12 times the font size.
     - Word spacing: At least 0.16 times the font size.
   - **Legible Letterforms:** Clean sans-serif/serif typefaces where characters like capital `I`, lowercase `l`, and number `1` are clearly distinct.

4. **Keyboard Accessibility (SC 2.1.1 & 2.4.7)**
   - Every interactive element (links, buttons, form fields) is operable via keyboard alone.
   - High-contrast, visible focus indicator (3px focus outline) that meets contrast rules.
   - No keyboard traps (SC 2.1.2): all modal dialogues permit standard Tab and Escape key traversal.

5. **Resize Text (SC 1.4.4 - 200% Zoom)**
   - Users can zoom text up to 200% using browser controls without layout breakdown or horizontal scrolling chaos.
   - Viewport meta tags do not lock zoom (`user-scalable=no` or `maximum-scale=1` are flagged).

6. **Page Language (SC 3.1.1)**
   - The primary human language of the page is declared in the HTML code (e.g. `<html lang="en">`) so screen readers pronounce words correctly.

---

## 🚀 Key Features

- **🌐 Live Preview of Previewed Website:**
  - Provides a direct link to the scanned website (`[↗ Visit Website]`).
  - Generates a shareable **Accessible Preview Suite Link** (`http://localhost:5000/preview.html?url=...`).
  - One-click `[📋 Copy Preview Link]` button with instant toast confirmation.
  - Interactive **In-App Live Preview Window** allowing developers and judges to test the website inside the dashboard.
- **🛠️ Assistive Toolbar for Disabled Users:**
  - **Original vs Remediated Mode:** Compare the buggy original webpage with the AI-remediated accessible version.
  - **Text Spacing Mode (SC 1.4.12):** Toggles line-height 1.5x, paragraph 2x, letter-spacing 0.12x, word-spacing 0.16x.
  - **Legible Font Mode (SC 1.4.12):** Distinct letterforms for dyslexia and low-vision readers.
  - **High Contrast AAA Mode (SC 1.4.3 & 1.4.11):** 7:1+ contrast ratios and high-contrast input/button borders.
  - **Alt-Text Visualizer (SC 1.1.1):** Overlays visual badges on informational, decorative, functional, and missing image alt tags.
  - **Keyboard Focus Rings (SC 2.1.1):** Enforces 3px visible high-contrast focus rings.
  - **Text-to-Speech Voice (SC 3.1.1):** Screen reader voice simulation using the declared page language.
- **🤖 AI Code Remediation Synthesizer:**
  - Side-by-side code diffs showing current violating markup vs AI-suggested accessible code.
  - Comprehensive WCAG 2.2 technical rationale.
  - **Mandatory Human-in-the-Loop Sign-off:** Developers explicitly approve or reject fixes.
- **🔄 Recheck & Differential Comparison:**
  - Compares baseline audit with post-remediation audit, measuring remediation velocity and verifying zero regressions.

---

## 🛠️ Tech Stack

- **Frontend:** Semantic HTML5, CSS3 Custom Properties (WCAG AAA/AA compliant, responsive design), Vanilla JavaScript (ES6+)
- **Backend API:** Node.js, Express.js, CORS
- **Browser Automation:** Playwright (Headless Chromium)
- **Auditing Engine:** `axe-core` + Custom 6-Point WCAG 2.2 Evaluator

---

## 💻 Local Quickstart

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Install dependencies & Playwright Chromium
```bash
npm install
npx playwright install chromium
```

### 3. Start the application
```bash
npm start
```
or
```bash
node server.js
```

Open your browser and navigate to:
👉 **http://localhost:5000**
👉 **http://localhost:5000/preview.html** (Accessible Preview Suite)

---

## 📄 License
ISC License &bull; WebForAll Hackathon 2026
