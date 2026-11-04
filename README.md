# NOVA

A functional, mobile-first financial-literacy prototype for Canadian students ages 14–18. **Illuminating Your Path to Success.** Built with React and Vite; no backend, accounts, API keys or real money are required.

## Run locally

Use Node.js 20.19+ or a recent Node.js 22/24 release, then:

```bash
cd "/Users/ateebameher/Desktop/Coding Begining/nova-app"
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/**. If Vite prints a different port because 5173 is occupied, use the printed URL.

```bash
npm run build       # production files in dist/
npm run preview     # serve the production build
npm test            # learning, rewards and trading calculations
npm run test:e2e    # browser flows; needs installed Google Chrome and dev server on 5173
```

The Playwright configuration uses your installed Chrome in an isolated headless test profile. It does not use your personal tabs or signed-in profile. `playwright-report/index.html` contains the last browser report. On Linux without Chrome, install Google Chrome or change `channel: 'chrome'` in `playwright.config.js` to use Playwright Chromium, then run `npx playwright install chromium`.

## Try the demo

1. Watch the interactive stacking-block launch (tap to drop a block or skip). The original gradient intro follows. **Find my starting point** → Join a Class with **NOVA24**, or Learn Independently → answer the short quiz → inspect the recommendation. **Explore the student demo** seeds 500 Stars, 4 hearts, a 5-day streak, 1 completed pathway and class rank 3.
2. Home → **Types of Investments** → **Basics of Stocks**. Play the illustrated explainer, read its transcript, try all four questions, inspect mastery, then reload and resume. Checkpoint tests show results after submission.
3. **Simulate** → buy Apple shares → Advance Day → sell a share → inspect the ledger and risk debrief. Try an invalid quantity. Compare every investment-account category.
4. **NOVA Pathways** → **Media Literacy and Fraud**. Inspect a fictional claim, check evidence and choose a safe action. **Discover** has search, categories, locations, saves, workshop RSVP and competition registration previews.
5. **Class** → **Teacher demo** → Assign activity → preview and assign → Student demo → complete it → return to class progress. Settings offers profile/goals, regions, French navigation preview, accessibility, loading-screen replay and reset. The five app tabs sit at the bottom on laptop and phone. **Ask NOVA** in the corner offers curated demo explanations and links to lessons; no AI service is connected.

All data persists in this browser’s local storage. Reset through Settings to return to the splash. The simulator also has a separate reset that preserves learning rewards.

See [the handoff and source-to-screen checklist](docs/HANDOFF.md) for source decisions, award rules, integration boundaries and verification details.
