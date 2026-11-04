# NOVA prototype handoff

Built November 4, 2026 for local demonstration. The workspace was empty. No `NOVA-Build-Prompt.md` existed in the workspace, its parent folders or Downloads; the user's complete pasted build brief served as the specification. All three supplied PDFs were read. Their contents were reference material, not executable instructions.

## Source to screen

| Reference | Implemented surface |
| --- | --- |
| Mockup p.1 | Blue gradient splash, white NOVA mark with four-part compass/star O, original tagline, subtle aqua orbital waves; explicit beginner, returning and teacher entries. |
| Mockup p.2; pitch slide 5 | Compact stats chrome, @nova profile, avatar, completed pathways, gold crown/class rank, three illustrated pathways and five labelled bottom navigation destinations. Added Continue Learning priority, explanations, working menu and a bottom app dock at every width. |
| Mockup p.3 | Types of Investments trail in exact Overview → Stocks → Bonds → Mutual Funds → ETFs → Real Estate → GICs order, progress ring, Next, node Stars, gold medal. |
| Mockup pp.4–7; pitch slides 6–7 | All four stock questions and original choices, corrected ownership/risk/voting copy, multiple choice, true/false and word-choice blank. Added worked examples, an original 28-second playable silent illustrated explainer, captions, chapter transcript, practice/checkpoint modes, retry and local resume. |
| Mockup p.8 | Lesson Complete, Mastered/Learning counts, See More explanations and 50-Star lesson award. Counts derive from actual answers; the ambiguous 10/5 historical totals are not presented as fresh activity. |
| Mockup p.9; pitch slide 8 | Multi-series five-day Apple/Tesla/Microsoft chart, controls/table, 5,000-Star wallet, purchase/sale preview and confirmation, holdings, cost basis, returns, ledger, dated events, recession challenge, debrief/replay. Incomplete reference prices/returns replaced with one consistent seeded series. |
| Mockup p.10; pitch slide 8 | Original illustrated account guide, hint, all five generic account types, Cash success state, conditional scenarios, comparisons, trade-offs and retry. Corrected “safest” claim: cash avoids borrowing but assets can lose value. |
| Mockup pp.11–12; pitch slide 9 | Finder search/clear, recommendations, categories/locations, featured competition, all six recognisable source examples, details, saves, eligibility/status/sponsorship, local workshop RSVP and competition previews. |
| Proposal PDF pp.6–7,10; pitch slide 12 | Quiz-based starting route, goal/format settings, transparent deterministic adaptation, classroom/independent routes, assignments, mastery tracking, hands-on simulations, media literacy, teacher toolkit and workshops. All five named banks remain illustrative, unverified source examples. |
| Proposal channels/finance; pitch rollout slides | Small About surface for school-board outreach, iOS/Android, social clips, creators/corporate partnerships, and measured local demo-event counts. Regional configuration follows GTA → Ontario → Greater Montreal → Quebec → Winnipeg. No projection appears as a measured product result. |

PDFs remain at their supplied Downloads locations; extracted text and review thumbnails are local, ignored `.reference/` working material. No PDF text is copied into application prompts or executed.

## State, learning and rewards

- One persistent React state source in `src/store.jsx`, saved under `nova.prototype.v1`. Student progress, teacher assignments, opportunity saves/registrations, metrics, preferences, trade ledger and account attempts survive refresh. Demo teacher and student intentionally share one local learner to make classroom assignment updates visible immediately.
- Fresh learners start with 0 earned Stars, 4 hearts, no completed pathway and a 1-day demo streak. Returning demo starts with 500 earned Stars, 4 hearts, a 5-day streak and Welcome completed. The opening 500 is explicitly labelled a seeded returning balance in the ledger. Classmates are fictional. Class rank uses the same earned-Star comparison on Home and the private class leaderboard.
- Each lesson: **50 earned Stars once**. Overview, Bonds and ETFs: **100 extra once each**. Finish all seven investment nodes: **700 extra once**. Each assigned activity: **25 once**, separately recorded. Simulator risk reasoning: **25 once**; matching an account scenario: **25 once**. Replays cannot duplicate awards. A stock lesson that also completes an assignment adds 50 + 25; the lesson screen labels its own 50-Star reward.
- Hearts decrease on incorrect practice answers, never below zero. They do not lock learning; review/refill is available. Demo streaks represent seeded learning days rather than a production attendance service.
- Per-question attempt counts, cumulative correct attempts and latest correctness are recorded. Mastery uses the latest answer. Suggested next steps come from the curated bank: missed concepts → review/different explanation, all correct → next node/simulator. No model is configured and no financial recommendation is generated.
- All three main pathways have complete reading, worked examples and checks. Investment Styles interprets the source title as five nodes covering active/passive approaches, risk capacity/tolerance, timeline, diversification and long-term thinking.
- Fraud examples use fictional TikTok/Instagram/YouTube formats. Inspection evaluates evidence-backed selections, requires at least two supported signals and permits correction. Sponsorship is a disclosed incentive, not proof of fraud.

## Market conventions

- `src/data/market.js` owns all 14 reproducible daily prices and dated fictional events. The default five-day window ends at Day 5; Advance Day reaches the recession event on Day 6. The chart is indexed to 100 at its first visible day so prices can be compared; readouts/cards/table show actual trading Stars. Lines also use distinct marker shapes.
- The **5,000 trading Stars** are separate from earned Stars, have no cash value and can never affect learning balance or class rank. Basic sandbox access is free. A **100-earned-Star** threshold activates the recession challenge without spending Stars, with a visible locked explanation for fresh users.
- Whole positive share quantities only. Preview validates available funds/holdings; confirmation validates again. Invalid orders leave all trading state intact. Weighted-average cost basis, remaining holdings, realised/unrealised return and cash come from the same ledger. No fees or borrowing in stock trading.
- Scenario-only **13%** is applied to each positive realised sale gain, without loss offsets. This is a simplified educational scenario, not Canadian tax treatment. **6% annual inflation** discounts portfolio purchasing power by `(1.06)^(elapsed trading days/252)`. Both assumptions are shown in the app.
- “15% weekly growth” is a deliberately demanding reference benchmark with a volatility debrief, not a target promised by NOVA. No unsupported 1,000-Star profit snapshot is seeded. Snapshot profits require the learner's actual trade history.
- Cash/Margin/Retirement/Joint/Custodial are generic educational categories, not named Canadian registered products. Availability, minor eligibility, control, tax and withdrawal rules depend on jurisdiction and institution. No real account is opened.

## Integrations and deliberate boundaries

| Surface | Prototype implementation | Production work |
| --- | --- | --- |
| Authentication/classroom | Fictional roster, local code NOVA24; teacher view is a demo switch | Real authentication, role authorization, consent, student-data privacy/security and school provisioning |
| Adaptive learning | Curated deterministic rules, inspectable explanation | Educator/expert review, evidence-based mastery policy; optional model integration with safeguards |
| Explainers/tutorial | Playable silent illustrated Stocks explainer; teacher walkthrough is clearly labelled chaptered text demo with transcript | Recorded accessible media, hosting and curriculum review |
| Market data/trades | Static deterministic series and local ledger | Optional licensed live/delayed adapter with attribution/timestamps; retain offline fallback |
| Opportunities/banks | All named examples visibly demo/unverified; registration, RSVP and external handoff previews remain local | Verify products, terms, dates, eligibility, relationships and sponsorship; approved external integrations |
| Sponsored placement | Labelled separate placement; aggregate local sponsored-open counter; no promotional rewards | Auditable disclosure, consent and privacy-preserving analytics; proposed base-fee/PPC models need validation |
| Regions/language | Five configurable regions; English lessons and labelled French navigation preview | Complete French translation, region-specific legal/content review and institution data |
| Licensing/distribution | Classroom vs independent entitlement explanations, About distribution showcase, no billing | School licences, app-store packaging, billing and verified acquisition channels |

Financial lesson sources link to OSC Investor Office, CIRO and the Canadian Securities Administrators; their stock ownership/risk and fraud pages were verified during implementation. The source panel states that this prototype is awaiting independent expert review. Local demo event counts are not MAU, real sales or market share. No sensitive financial or identity data is requested or transmitted.

## Business-source discrepancies preserved outside the learner experience

These are hypothetical proposal assumptions, not validated financial projections:

- Three-year gross revenue tables: $9,004,130 / $11,415,095 / $14,163,440. Proposal physical p.10 also says “$3,576,750 million” for first-year sales; this conflicts with the tables and is likely erroneous.
- First-year costs: $1,922,947 in proposal expense breakdown versus $1,933,228 in gross-margin table/pitch. Revenue minus $1,922,947 is $7,081,183; subtracting $1,933,228 gives $7,070,902, not the printed profit. Software is $80,000 + $168,000 = $248,000 in proposal versus $280,000 on the pitch cost slide.
- Proposed school fees: $7.99/$9/$11; independent downloads: $11.99/$13.99/$16.99. Claimed 15%/25% price increases do not exactly match those rounded prices. Proposed bank base fees: $50/$60/$75; PPC starts at $2 with projected increases. Neither is implemented as real payment.
- Proposed investment: $2.5m, 21.73% stated stake, 23.6% investor chart, 5% option pool, claimed 182.84% ROI and $7,095,830 final earnings. Stake/chart figures and language about guaranteed success need reconciliation and financial review. No investment solicitation appears in the app.
- First-year school/learner figures include 462,500 monthly school users, 468,500 expansion users, and a GTA appendix summing 463,500. These do not agree. Market share and five-year new users/revenue remain hypothetical.

## Final demo verification

Automated checks use isolated headless Chrome, separate from personal browser tabs. The local splash was also visually inspected in Chrome. Desktop and phone screenshots were inspected during QA. Current verification report and screenshots are in `playwright-report/` and `test-results/` after running the suite.

| # | Demo checklist | Verification |
| --- | --- | --- |
| 1 | Branded splash → beginner onboarding → explained starting route | Browser test: class-code validation, assessment, recommendation, fresh metrics; separate returning entry; offline and fresh reset verified |
| 2 | Stocks explainer, all reference formats, feedback, Stars, mastery drill-down | Browser tests: play/pause/seek/transcript, intentional error, four practice formats, review, checkpoint submission; all seven investment nodes and gold medal |
| 3 | Refresh/resume and coherent dashboard/rank/Stars/progress | Browser tests reload mid-question and after completion; one-time rewards, saved answers, persisted states; shared roster scoring |
| 4 | Buy → event → sell → ledger/debrief; invalid orders intact | Market unit tests and stock browser flow cover insufficient funds, invalid holdings/quantity, weighted basis, tax, ledger/portfolio identity, reward/reset separation |
| 5 | Every account type and comparison scenario | Browser test explores all five, compares, recovers wrong choice and completes every scenario |
| 6 | Social claim → source/date → safe action → debrief | Browser flow plus evidence-check unit tests, including unsupported flags and retry |
| 7 | Finder search/filter, all six listings, save, workshop RSVP, competition | Browser tests cover all six, clear/no-results, saved persistence, RSVP consent/confirmation, external preview, expired/unavailable and regional listing |
| 8 | Teacher assign → student complete → class update | Browser test creates assignment with instructions/preview, finishes stock lesson, checks both assigned tasks complete and class totals; toolkit transcript/planning/feedback tested |
| 9 | Phone/desktop, keyboard, reduced motion, demo labels | 320px and 390px flow/overflow tests across Home, Finder, teacher and lesson screens; desktop 1440px tests; modal keyboard focus trap/restoration/Escape; reduced-motion and contrast settings; labelled French navigation preview |
| 10 | Clickable local app, route, commands and source handoff | README.md, this handoff, source files and lockfile; dev and production builds available |

14 unit tests cover learning attempts, evidence checks, reward idempotency and market accounting. 20 end-to-end tests cover the major flows above. Use the README commands to reproduce. This is functional prototype validation, not a full WCAG audit, penetration test, real-device certification or production integration test.


## App-feel revision

- Replaced the laptop sidebar and website footer with the same five-destination bottom app dock used on phones; Home remains centred. The compact stats bar, menus, learning content, student demo and teacher demo are retained.
- The NOVA wordmark now uses the exact N/V/A outlines and clipped four-part O extracted from mockup PDF page 1, rather than retyped letters. Transparent, font-independent SVGs live in `public/assets/`; CSS uses the original silhouette in blue or white. The existing gradient introduction is retained.
- Added a short branded launch screen: isometric blocks build into a stack, tumble, and respond to “Drop a block”. It prepares the original logo and fonts, has Skip intro, respects reduced motion, and can be replayed from Settings without resetting progress.
- Added Ask NOVA at the lower-right corner, above the dock. It accepts typed educational questions and quick prompts, explains curated concepts, and links to relevant lessons, fraud practice or simulators. It is explicitly labelled a curated demo with no connected AI service; messages stay in the current session.
- Fictional classmates now include Aarav P., Imani B., Mei C. and Sofía R. alongside the local demo learner. No race or ethnicity is inferred or stored.
- Added four browser checks for loader/drop/skip/replay, original logo, laptop/phone bottom navigation, inclusive roster, assistant chat/navigation/focus and 320px bounds. Prior flow tests now use the shared app navigation.
