# NOVA

**Illuminating Your Path to Success.**

## [✦ OPEN NOVA — TRY THE APP →](https://te3bie.github.io/nova-app/)

*The public link becomes available after the GitHub Pages deployment is enabled.*

**Learn the money stuff. Try it for yourself. Build confidence, one small win at a time.**

NOVA is an interactive financial-literacy app prototype for Canadian high school students ages 14–18. Explore investing, practise financial decisions, and learn to question online money claims in a welcoming space built for beginners.

**Open it in your browser. No download, bank connection, or sign-up is needed for the demo.**

---

## Why we made NOVA

Understanding money should feel approachable. We created NOVA to help students take their first steps with investing, risk, and financial decision-making through explanations they can understand and decisions they can practise.

Our idea began with three challenges: knowing where to start, finding beginner-friendly tools, and making sense of financial advice on social media. NOVA brings lessons, hands-on simulations, and media-literacy activities into one learning space.

Whether someone is saving for a first car, thinking about university expenses, or simply curious about stocks, NOVA gives that curiosity a starting point. It also gives teachers a practical way to bring financial-literacy discussions into business and economics classrooms.

## What NOVA helps you do

- **Understand the foundations.** Learn about stocks, bonds, mutual funds, ETFs, real estate, GICs, and different investment styles.
- **Practise before real money is involved.** Buy and sell fictional shares, observe market events, compare investment-account categories, and explain the risks behind a decision.
- **Question financial claims.** Spot urgency, sponsorship, guaranteed-return claims, and other warning signs in fictional social-media posts.
- **Find a next step.** Explore sample workshops, scholarships, competitions, youth programmes, and student banking listings through the Opportunity Finder.
- **See your progress.** Review mastered concepts, revisit ideas that need practice, and earn NOVA Stars for learning.

## How to use the app

### Start as a student

1. **[Open NOVA](https://te3bie.github.io/nova-app/).** Watch the blocks build and tumble, tap to drop one, or select **Skip intro**.
2. On the welcome screen, choose **Find my starting point** for a fresh beginning, or **Explore the student demo** to try a learner with sample progress.
3. Choose **Learn Independently**, or **Join a Class** using the demo code **NOVA24**. Answer the short introductory quiz to set your goals and starting pathway. You can skip it if you prefer.
4. From **Home**, choose **Continue Learning** or open a NOVA Pathway. A good first stop is **Types of Investments → Stocks**.
5. Play the illustrated explainer, read the worked example, and try the knowledge check. Review the feedback and your mastered and learning concepts. Checkpoint tests reveal results after submission.
6. Open **Simulate** to try a trade: purchase shares, advance a day, observe the market event, and sell. Use the ledger and risk debrief to make sense of what happened. The **Investment accounts** tab lets you compare Cash, Margin, Retirement, Joint, and Custodial categories.
7. Explore **Media Literacy and Fraud** from the pathways, then visit **Discover** to search sample opportunities, save a listing, or try a workshop RSVP or competition entry.

### Find your way around

The same five tabs stay at the bottom on a phone or laptop.

| Tab | What you can do |
| --- | --- |
| **Class** | View assigned activities, your demo class, and its private leaderboard. |
| **Simulate** | Practise stock trading and compare investment-account choices. |
| **Home** | Continue learning, explore pathways, and see your progress and Stars. |
| **Discover** | Search and save educational opportunities and sample student listings. |
| **Settings** | Change your goals, region, profile, and accessibility preferences, replay the loading screen, or reset the demo. |

Tap **Ask NOVA** in the corner for a quick explanation or help finding a lesson. You can type a question or choose a suggested topic. The menu also provides direct access to all pathways and the teacher demo.

### Try the teacher experience

1. Select **Teacher & school demo** from the welcome screen, or open **Class → Teacher demo**.
2. Explore the sample class, learner progress, and mastery gaps. Copy the demo join code if you want to demonstrate classroom entry.
3. Choose **Assign activity**, select a lesson, pathway, quiz, test, or simulator task, and add a due date and instructions. Preview it, then assign it.
4. Switch to **Student demo** to see the activity. Complete it, then return to the teacher view to see the updated assignment status.
5. Open **Toolkit** for sample curriculum mapping, lesson plans, activity guides, a chaptered classroom tutorial, workshop planning, and classroom feedback.

The teacher and student views share one fictional demo classroom, so you can demonstrate the full assignment flow in the same browser.

## A space to learn at your own pace

Your learning progress, saved opportunities, and practice portfolio are stored in your browser. Return using the same browser to pick up where you left off. Clearing browser data also clears this local progress.

Earned **NOVA Stars** celebrate learning and unlock challenges. The simulator has a **separate 5,000-Star practice wallet**: trading gains never change your earned Stars, and neither balance has cash value. Hearts provide practice feedback; review and refill are available so you can keep learning.

Use **Settings → Reset all demo data** for a fresh start. The stock simulator also has its own reset, which preserves your learning rewards.

## Built with

**React · JavaScript · Vite · HTML · CSS**

NOVA uses browser **localStorage** for demo progress, original SVG illustrations and branding, and **Playwright with Chrome** for browser-flow testing. Node.js and npm provide the development and build tools.

## About this prototype

NOVA demonstrates the experience of learning and practising financial decisions. Markets, classroom identities, banking listings, partnerships, and registration flows are simulated or illustrative. Ask NOVA uses curated demo replies; no live AI service is connected. The current content is in English, with a labelled French navigation preview and configurable Canadian regions.

A production release would need verified opportunity listings, live integrations where appropriate, real authentication, educator review, and privacy and security work for student data.

<details>
<summary><strong>For developers: run NOVA locally</strong></summary>

Use Node.js 20.19+ or a recent Node.js 22/24 release.

```bash
git clone https://github.com/te3bie/nova-app.git
cd nova-app
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.

```bash
npm run build       # production files in dist/
npm run preview     # preview the production build
npm test            # learning, reward, and market-accounting checks
npm run test:e2e    # browser flows; dev server on 5173 and Google Chrome required
```

The browser tests use an isolated Chrome profile. The last report is available in `playwright-report/index.html`.

### Publish the public demo

1. Push this repository to GitHub.
2. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. In **Actions**, run **Deploy NOVA to GitHub Pages** if a deployment has not started automatically.
4. After the workflow succeeds, open **https://te3bie.github.io/nova-app/**.

The workflow builds the app for its repository path and publishes only the `dist/` output. Future pushes to `main` run the same deployment automatically.

See [the project handoff](docs/HANDOFF.md) for source-to-screen mapping, award rules, simulation assumptions, and integration boundaries.

</details>

---

**Ready for your first lightbulb moment? [Open NOVA →](https://te3bie.github.io/nova-app/)**
