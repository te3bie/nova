import React, { useState, useEffect } from "react";
import { useApp, makeState } from "./store.jsx";
import {
  Icon,
  Logo,
  Button,
  Badge,
  Progress,
  Modal,
  Illustration,
  PageTitle,
} from "./components/UI.jsx";
import { Pathways, Pathway, Lesson, Fraud } from "./components/Learning.jsx";
import Simulator from "./components/Simulator.jsx";
import LaunchLoader from "./components/LaunchLoader.jsx";
import LearningAssistant from "./components/LearningAssistant.jsx";
import { Discover, Classroom, Teacher } from "./components/Community.jsx";
import { sampleRoster } from "./data/opportunities.js";
import { lessons, pathways } from "./data/lessons.js";
const logoReady = new Promise((resolve) => {
  const image = new Image();
  image.onload = image.onerror = () => resolve();
  image.src = "/assets/nova-wordmark-white.svg";
});
const nav = [
  ["class", "users", "Class"],
  ["simulate", "chart", "Simulate"],
  ["home", "home", "Home"],
  ["discover", "compass", "Discover"],
  ["settings", "settings", "Settings"],
];
function Splash() {
  const { setState } = useApp();
  const [stage, setStage] = useState("splash");
  const enter = (returning = false, role = "student") =>
    setState({
      ...makeState(returning),
      onboarded: true,
      role,
      view: role === "teacher" ? "teacher" : "home",
    });
  return stage === "splash" ? (
    <div className="splash">
      <div className="splash-orbit orbit-a" />
      <div className="splash-orbit orbit-b" />
      <div className="splash-top">
        <Logo />
        <Badge tone="blue">THE LEARNING PLAYGROUND</Badge>
      </div>
      <div className="splash-body">
        <span className="splash-spark">✦</span>
        <Logo />
        <p className="tagline">Illuminating Your Path to Success.</p>
        <h1>
          A little curiosity.
          <br />A brighter financial future.
        </h1>
        <p>
          Learn the money stuff. Try it for yourself.
          <br />
          Build confidence, one small win at a time.
        </p>
        <Button onClick={() => setStage("onboard")}>
          Find my starting point <Icon name="arrow" />
        </Button>
        <button className="splash-link" onClick={() => enter(true)}>
          Explore the student demo <Icon name="arrow" size={16} />
        </button>
      </div>
      <div className="splash-footer">
        <span>MADE FOR YOUR NEXT CHAPTER</span>
        <button onClick={() => enter(true, "teacher")}>
          Teacher & school demo <Icon name="external" size={14} />
        </button>
        <span>Simulated learning. Real confidence.</span>
      </div>
    </div>
  ) : (
    <Onboarding
      onBack={() => setStage("splash")}
      onFinish={(profile) =>
        setState({
          ...makeState(),
          onboarded: true,
          profile: { ...makeState().profile, ...profile },
        })
      }
    />
  );
}
function Onboarding({ onBack, onFinish }) {
  const [step, setStep] = useState(0),
    [profile, setProfile] = useState({
      joined: false,
      confidence: "Beginner",
      claimHabit: "Check the original source",
      goal: "First car",
      format: "Visual",
    }),
    [code, setCode] = useState(""),
    [error, setError] = useState("");
  const update = (key, value) => setProfile((p) => ({ ...p, [key]: value }));
  const items = [
    {
      title: "Your future, your way.",
      text: "Choose how you want to explore NOVA. Your progress stays in this browser.",
      key: "joined",
      options: [
        [true, "Join a Class", "Learn together with your school."],
        [false, "Learn Independently", "Your own pace. Your own goals."],
      ],
    },
    {
      title: "Let’s find your starting point.",
      text: "How confident do you feel about investing?",
      key: "confidence",
      options: [
        ["Beginner", "Brand new", "I’m not sure what a stock is yet."],
        ["Some knowledge", "Getting there", "I know a few of the basics."],
        [
          "Confident",
          "Feeling confident",
          "I want to put my knowledge into practice.",
        ],
      ],
    },
    {
      title: "A big claim pops up. Now what?",
      text: "A creator promises to double your money. What would you usually do?",
      key: "claimHabit",
      options: [
        [
          "Check the original source",
          "Check the source",
          "Look for evidence, date and sponsorship.",
        ],
        [
          "Ask a trusted adult",
          "Ask someone I trust",
          "Get a second opinion before acting.",
        ],
        [
          "Follow the crowd",
          "See what everyone thinks",
          "Look at likes and comments.",
        ],
      ],
    },
    {
      title: "What are you working towards?",
      text: "We’ll connect lessons to things that matter to you.",
      key: "goal",
      options: [
        ["First car", "My first car", "Understand saving, time and risk."],
        [
          "University expenses",
          "Life after high school",
          "Plan ahead for education costs.",
        ],
        [
          "Money confidence",
          "Feeling money confident",
          "Build the foundations.",
        ],
      ],
    },
    {
      title: "A pathway with your name on it.",
      text: "Your starting point is ready. You can change your goals and format anytime.",
    },
  ];
  const current = items[step];
  const next = () => {
    if (
      step === 0 &&
      profile.joined &&
      code.trim().toUpperCase() !== "NOVA24"
    ) {
      setError("Try the demo class code NOVA24.");
      return;
    }
    setError("");
    setStep((s) => s + 1);
  };
  return (
    <div className="onboarding">
      <header>
        <button
          className="text-button"
          onClick={step ? () => setStep((s) => s - 1) : onBack}
        >
          <Icon name="arrowLeft" /> Back
        </button>
        <Logo />
        <button
          className="text-button"
          onClick={() => onFinish({ ...profile, confidence: "Beginner" })}
        >
          Skip quiz
        </button>
      </header>
      <div className="onboard-content">
        <div className="row spread">
          <span className="eyebrow">A FRESH START</span>
          <span className="small muted">{step + 1} of 5</span>
        </div>
        <Progress value={(step + 1) * 20} />
        <h1>{current.title}</h1>
        <p className="muted">{current.text}</p>
        {current.options ? (
          <div className="onboard-options">
            {current.options.map(([value, label, detail]) => (
              <button
                key={label}
                className={`onboard-choice ${profile[current.key] === value ? "selected" : ""}`}
                onClick={() => update(current.key, value)}
              >
                <span className="radio-dot" />
                <span>
                  <strong>{label}</strong>
                  <small>{detail}</small>
                </span>
                {profile[current.key] === value && <Icon name="check" />}
              </button>
            ))}
            {step === 0 && profile.joined && (
              <label className="field">
                Demo class code{" "}
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="NOVA24"
                />
                <small>Try NOVA24 · Maple Grove Secondary, Business 10</small>
              </label>
            )}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="recommendation">
            <div className="recommendation-icon">
              <Icon name="compass" size={36} />
            </div>
            <h3>Your NOVA Pathway</h3>
            {[
              [
                "Welcome to NOVA!",
                "Get comfortable with goals, Stars and your learning space.",
              ],
              [
                "Types of Investments",
                `${profile.confidence === "Beginner" ? "Start with ownership and risk" : "Build on your knowledge"} before practising for your ${profile.goal.toLowerCase()} goal.`,
              ],
              [
                "Media Literacy and Fraud",
                profile.claimHabit === "Follow the crowd"
                  ? "Likes are not evidence. Practise checking a claim before acting."
                  : "Build on your source-checking habits with realistic examples.",
              ],
            ].map(([name, why], i) => (
              <div className="recommended-step" key={name}>
                <span>{i + 1}</span>
                <div>
                  <strong>{name}</strong>
                  <p>{why}</p>
                </div>
              </div>
            ))}
            <label className="field">
              I learn best with
              <select
                value={profile.format}
                onChange={(e) => update("format", e.target.value)}
              >
                <option>Visual</option>
                <option>Reading</option>
                <option>Practice</option>
              </select>
            </label>
            <p className="small muted">
              Why this is next: your answers choose from our curated lessons
              using simple rules. No AI model or personal financial advice.
            </p>
          </div>
        )}
        <Button
          className="full"
          onClick={step < 4 ? next : () => onFinish(profile)}
        >
          {step < 4 ? "Continue" : "Let’s get started"} <Icon name="arrow" />
        </Button>
        <p className="onboard-privacy">
          <Icon name="shield" size={14} /> Fictional classroom. No banking or
          identity details needed.
        </p>
      </div>
    </div>
  );
}
function Dashboard() {
  const { state, navigate } = useApp();
  const completed = state.completed.length;
  const entries = Object.entries(state.lessonProgress);
  const started = entries.find(([, p]) => !p.completed);
  const stocks = state.lessonProgress["investments:stocks"];
  const nodeOrder = [
    "overview",
    "stocks",
    "bonds",
    "mutual-funds",
    "etfs",
    "real-estate",
    "gics",
  ];
  const target = started
    ? { pathway: started[0].split(":")[0], node: started[0].split(":")[1] }
    : {
        pathway: "investments",
        node: stocks?.completed
          ? nodeOrder
              .slice(2)
              .find(
                (n) => !state.lessonProgress[`investments:${n}`]?.completed,
              ) || "stocks"
          : "stocks",
      };
  const activeLesson = lessons[target.node] || lessons.stocks;
  const activePath =
    pathways.find((p) => p.id === target.pathway) || pathways[1];
  const activeComplete =
    state.lessonProgress[`${target.pathway}:${target.node}`]?.completed;
  const progress = Math.round(
    (Object.entries(state.lessonProgress).filter(
      ([key, x]) => key.startsWith("investments:") && x.completed,
    ).length /
      7) *
      100,
  );
  const resume = () => navigate("lesson", target);
  const [why, setWhy] = useState(false);
  return (
    <>
      <div className="home-greeting">
        <div>
          <div className="eyebrow">
            YOUR FUTURE STARTS WITH A LITTLE CURIOSITY
          </div>
          <h1>
            {state.stars
              ? "Keep your curiosity growing,"
              : "Welcome to your next chapter,"}
            <br />
            <span>{state.profile.name}.</span>{" "}
            <span className="greeting-spark">✦</span>
          </h1>
        </div>
        <button className="goal-chip" onClick={() => navigate("settings")}>
          <Icon name="target" size={17} />
          {state.profile.goal}
          <Icon name="chevron" size={14} />
        </button>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="continue-card">
            <div className="continue-copy">
              <div className="row gap-sm">
                <span className="live-dot" />
                <span className="eyebrow">
                  {started ? "PICK UP WHERE YOU LEFT OFF" : "CONTINUE LEARNING"}
                </span>
              </div>
              <h2>
                Big ideas.
                <br />
                Small first steps.
              </h2>
              <p>
                {activeLesson.description} <br />
                Let’s make your next investment in knowledge.
              </p>
              <div className="lesson-label">
                <span className="square-icon">
                  <Icon name="chart" />
                </span>
                <div>
                  <strong>{activeLesson.title}</strong>
                  <span>
                    {activePath.title} · {target.node === "stocks" ? "5" : "3"}{" "}
                    min
                  </span>
                </div>
              </div>
              <Button onClick={resume}>
                {activeComplete
                  ? "Review lesson"
                  : started
                    ? "Resume lesson"
                    : "Let’s learn"}
                <Icon name="arrow" size={18} />
              </Button>
              <button className="why-link" onClick={() => setWhy(true)}>
                Why this is next <Icon name="info" size={13} />
              </button>
            </div>
            <Illustration type="hero" />
            <div className="hero-bottom">
              <span>Every expert was once a beginner.</span>
              <span>
                {String(
                  Math.max(0, activePath.nodes.indexOf(target.node)) + 1,
                ).padStart(2, "0")}{" "}
                <span className="muted">
                  / {String(activePath.nodes.length).padStart(2, "0")}
                </span>
              </span>
            </div>
          </section>
          <section className="pathway-section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">A LITTLE LEARNING GOES A LONG WAY</div>
                <h2>Your NOVA Pathways</h2>
              </div>
              <button className="text-button" onClick={() => navigate("learn")}>
                Explore all <Icon name="arrow" size={17} />
              </button>
            </div>
            <div className="home-pathways">
              {[
                {
                  id: "welcome",
                  title: "Welcome to NOVA!",
                  desc: "Find your feet. Set your direction.",
                  icon: "book",
                  tone: "aqua",
                  count: "3 bite-size lessons",
                },
                {
                  id: "investments",
                  title: "Types of Investments",
                  desc: "A world of possibilities, explained.",
                  icon: "chart",
                  tone: "blue",
                  count: "7 bite-size lessons",
                },
                {
                  id: "styles",
                  title: "Investment Styles",
                  desc: "Discover an approach that fits.",
                  icon: "lightbulb",
                  tone: "lavender",
                  count: "5 bite-size lessons",
                },
              ].map((p) => (
                <button
                  className={`pathway-card ${p.tone}`}
                  key={p.id}
                  onClick={() => navigate("pathway", p.id)}
                >
                  <div className="pathway-top">
                    <span className="pathway-orb">
                      <Icon name={p.icon} size={35} />
                      <span className="mini-spark">✦</span>
                    </span>
                    {state.completed.includes(p.id) ? (
                      <span className="complete-check">
                        <Icon name="check" size={14} />
                      </span>
                    ) : (
                      <Icon name="arrow" size={20} />
                    )}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <Progress
                    value={
                      state.completed.includes(p.id)
                        ? 100
                        : p.id === "investments"
                          ? progress
                          : 0
                    }
                  />
                  <span className="pathway-meta">
                    {state.completed.includes(p.id)
                      ? "Completed. Nicely done!"
                      : p.count}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section className="practice-section">
            <div className="section-heading">
              <h2>Make it click.</h2>
              <span className="small muted">
                A safe space to try something new
              </span>
            </div>
            <div className="grid-2">
              <button
                className="quick-card"
                onClick={() => navigate("simulate")}
              >
                <span className="quick-icon">
                  <Icon name="chart" size={24} />
                </span>
                <div>
                  <h3>Your first trade starts here</h3>
                  <p>Explore the Stock Market Simulator</p>
                </div>
                <Icon name="arrow" />
              </button>
              <button
                className="quick-card"
                onClick={() => navigate("discover")}
              >
                <span className="quick-icon gold">
                  <Icon name="compass" size={24} />
                </span>
                <div>
                  <h3>Find your next opportunity</h3>
                  <p>Workshops, competitions & more</p>
                </div>
                <Icon name="arrow" />
              </button>
            </div>
          </section>
        </div>
        <aside className="dashboard-aside">
          <section className="profile-card">
            <div className="row spread">
              <span className="eyebrow">A LITTLE BETTER, EVERY DAY</span>
              <button
                className="icon-btn"
                aria-label="Edit profile"
                onClick={() => navigate("settings")}
              >
                <Icon name="settings" size={17} />
              </button>
            </div>
            <button
              className="avatar"
              aria-label="Open profile"
              onClick={() => navigate("settings")}
            >
              <svg viewBox="0 0 80 80" aria-hidden="true">
                <circle cx="40" cy="40" r="40" fill="#c1ebfa" />
                <path d="M13 80c0-24 13-31 27-31s27 7 27 31" fill="#fff" />
                <ellipse cx="40" cy="34" rx="14" ry="17" fill="#f6bc91" />
                <path
                  d="M25 33c-4-21 32-27 31 1-8-1-11-9-11-9s-8 8-20 8"
                  fill="#243655"
                />
                <path d="M27 28c-1-12 25-16 29 3l-4 14-2-14Z" fill="#243655" />
              </svg>
              <span />
            </button>
            <h3>
              {state.profile.name}{" "}
              <span className="profile-handle">@{state.profile.handle}</span>
            </h3>
            <p>Future-ready, one lesson at a time.</p>
            <div className="profile-stats">
              <button onClick={() => navigate("learn")}>
                <strong>{completed}</strong>
                <span>Pathways completed</span>
              </button>
              <button onClick={() => navigate("class")}>
                <strong>
                  <Icon name="crown" size={22} />
                  {sampleRoster.filter(
                    (p) => p.id !== "you" && p.stars > state.stars,
                  ).length + 1}
                </strong>
                <span>{state.profile.joined ? "Class rank" : "Demo rank"}</span>
              </button>
            </div>
          </section>
          <section className="card weekly-card">
            <div className="row spread">
              <h3>Your weekly spark</h3>
              <span className="flame-light">
                <Icon name="flame" size={22} />
              </span>
            </div>
            <p className="muted">A few minutes today. A habit for life.</p>
            <div className="week-days">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i}>
                  <span>{d}</span>
                  <span
                    className={
                      i < Math.min(state.streak, 5)
                        ? "done"
                        : i === 5
                          ? "today"
                          : ""
                    }
                  >
                    {i < Math.min(state.streak, 5) ? (
                      <Icon name="check" size={13} />
                    ) : i === 5 ? (
                      "·"
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="weekly-bottom">
              <span>
                <strong>{Math.min(state.streak, 5)}</strong> learning days this
                week
              </span>
              <span>Keep glowing ✦</span>
            </div>
          </section>
          {state.profile.joined ? (
            <section className="card home-assignment-card">
              <div className="row spread">
                <h3>From your classroom</h3>
                <span className="tiny-icon">
                  <Icon name="users" size={18} />
                </span>
              </div>
              <p className="small muted">Maple Grove · Business 10</p>
              {state.assignments
                .filter((x) => x.status !== "complete")
                .slice(0, 2)
                .map((a) => (
                  <button
                    className="assignment-mini"
                    key={a.id}
                    onClick={() => navigate("class")}
                  >
                    <span className="assignment-dot" />
                    <span>
                      <strong>{a.title}</strong>
                      <small>
                        Due {a.due} · {a.type}
                      </small>
                    </span>
                    <Icon name="chevron" size={17} />
                  </button>
                ))}
              {state.assignments.every((x) => x.status === "complete") && (
                <p className="small">You’re all caught up. Keep exploring!</p>
              )}
              <button className="text-button" onClick={() => navigate("class")}>
                Visit my class <Icon name="arrow" size={16} />
              </button>
            </section>
          ) : (
            <section className="card home-assignment-card">
              <Icon name="users" size={25} />
              <h3>Learning is better together.</h3>
              <p className="muted small">
                Join a demo classroom to explore assignments and celebrate
                progress.
              </p>
              <Button variant="secondary" onClick={() => navigate("class")}>
                Find my class <Icon name="arrow" size={15} />
              </Button>
            </section>
          )}
          <button className="fraud-nudge" onClick={() => navigate("fraud")}>
            <span>
              <Icon name="shield" size={22} />
            </span>
            <div>
              <strong>Too good to be true?</strong>
              <p>Learn to spot a financial red flag.</p>
            </div>
            <Icon name="arrow" size={18} />
          </button>
        </aside>
      </div>
      <div className="home-footnote">
        <Icon name="shield" size={14} /> Your practice space. All market data,
        classroom accounts and listings are simulated.
      </div>
      {why && (
        <Modal title="Why this is next" onClose={() => setWhy(false)}>
          <div className="recommendation-icon">
            <Icon name="lightbulb" size={30} />
          </div>
          <p>
            You chose <strong>{state.profile.goal.toLowerCase()}</strong> and
            described your confidence as{" "}
            <strong>{state.profile.confidence.toLowerCase()}</strong>.{" "}
            {activeLesson.title} builds your understanding before a real
            financial decision. {activeLesson.takeaway}
          </p>
          <p>
            Rule: begin with foundations; suggest review for missed concepts;
            suggest the next lesson after mastery. Your preferred format is{" "}
            <strong>{state.profile.format.toLowerCase()}</strong>.
          </p>
          <Badge>Curated lessons · deterministic demo rules</Badge>
          <Button
            className="full"
            onClick={() => {
              setWhy(false);
              resume();
            }}
          >
            Start learning <Icon name="arrow" />
          </Button>
        </Modal>
      )}
    </>
  );
}
function Settings({ onReplayLoading }) {
  const { state, setState, navigate, toast } = useApp();
  const [profile, setProfile] = useState(state.profile),
    [confirm, setConfirm] = useState(false),
    [about, setAbout] = useState(false);
  const update = (key, value) => setProfile((p) => ({ ...p, [key]: value }));
  return (
    <>
      <PageTitle eyebrow="MAKE THIS SPACE YOURS" title="A little more you.">
        Your goals can change. Your pathway can, too.
      </PageTitle>
      <div className="settings-grid">
        <section className="card padded stack">
          <h2>Your profile & goals</h2>
          <label className="field">
            Demo display name
            <input
              value={profile.name}
              onChange={(e) => update("name", e.target.value)}
              maxLength={30}
            />
          </label>
          <label className="field">
            My goal
            <select
              value={profile.goal}
              onChange={(e) => update("goal", e.target.value)}
            >
              <option>First car</option>
              <option>University expenses</option>
              <option>Money confidence</option>
            </select>
          </label>
          <label className="field">
            Preferred learning format
            <select
              value={profile.format}
              onChange={(e) => update("format", e.target.value)}
            >
              <option>Visual</option>
              <option>Reading</option>
              <option>Practice</option>
            </select>
          </label>
          <label className="field">
            Region
            <select
              value={profile.region}
              onChange={(e) => update("region", e.target.value)}
            >
              {[
                "Greater Toronto Area",
                "Ontario",
                "Greater Montreal",
                "Quebec",
                "Winnipeg",
              ].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="field">
            Language
            <select
              value={profile.language}
              onChange={(e) => update("language", e.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">Français · navigation preview</option>
            </select>
            <small>
              French navigation preview; lessons remain in English pending
              translation and review.
            </small>
          </label>
          <Button
            onClick={() => {
              if (!profile.name.trim()) {
                toast("Enter a demo display name.");
                return;
              }
              setState((s) => ({
                ...s,
                profile: { ...profile, name: profile.name.trim() },
              }));
              toast(
                "Profile saved. Your recommendations now reflect your goal.",
              );
            }}
          >
            Save preferences <Icon name="check" />
          </Button>
        </section>
        <div className="stack">
          <section className="card padded stack">
            <h2>Comfort & accessibility</h2>
            {[
              [
                "reducedMotion",
                "Reduce motion",
                "Keep transitions and awards still.",
              ],
              [
                "contrast",
                "Increase contrast",
                "Strengthen text, borders and focus outlines.",
              ],
            ].map(([key, label, desc]) => (
              <label className="toggle-row" key={key}>
                <span>
                  <strong>{label}</strong>
                  <small>{desc}</small>
                </span>
                <input
                  type="checkbox"
                  checked={state.preferences[key]}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      preferences: {
                        ...s.preferences,
                        [key]: e.target.checked,
                      },
                    }))
                  }
                />
              </label>
            ))}
            <p className="small muted">
              Keyboard controls, captions and chart tables are available
              throughout. Your system’s reduced-motion setting is also
              respected.
            </p>
          </section>
          <section className="card padded stack">
            <h2>Demo controls</h2>
            <Button variant="ghost" onClick={onReplayLoading}>
              <Icon name="play" /> Replay the loading screen
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setState((s) => ({
                  ...s,
                  role: s.role === "teacher" ? "student" : "teacher",
                  view: s.role === "teacher" ? "home" : "teacher",
                }));
              }}
            >
              <Icon name="users" /> Switch to{" "}
              {state.role === "teacher" ? "student" : "teacher"} demo
            </Button>
            <Button
              variant="ghost"
              onClick={() => setState({ ...makeState(true), onboarded: true })}
            >
              <Icon name="refresh" /> Load returning-student demo
            </Button>
            <Button variant="ghost" onClick={() => setAbout(true)}>
              <Icon name="info" /> About NOVA & distribution
            </Button>
            <Button variant="ghost" onClick={() => setConfirm(true)}>
              <Icon name="refresh" /> Reset all demo data
            </Button>
            <p className="small muted">
              Data stays in this browser. No account, payments or external
              registration is created.
            </p>
          </section>
          <section className="card padded">
            <h3>Access for every starting point</h3>
            <p className="muted small">
              {state.profile.joined
                ? "School-board classroom demo entitlement"
                : "Independent learner demo entitlement"}{" "}
              · All prototype lessons included. School licences and iOS /
              Android paid downloads are proposed models. No billing is
              connected.
            </p>
          </section>
        </div>
      </div>
      {confirm && (
        <Modal title="Start a fresh chapter?" onClose={() => setConfirm(false)}>
          <p>
            This clears this browser’s learning progress, teacher assignments,
            saved opportunities, Stars and simulator trades.
          </p>
          <Button
            onClick={() => {
              setState(makeState());
              setConfirm(false);
            }}
          >
            Reset demo & return to splash
          </Button>
          <Button variant="ghost" onClick={() => setConfirm(false)}>
            Keep my progress
          </Button>
        </Modal>
      )}
      {about && (
        <Modal
          title="Built for your next chapter"
          onClose={() => setAbout(false)}
        >
          <Logo />
          <p>Illuminating Your Path to Success.</p>
          <p>
            NOVA is a classroom financial-literacy prototype for ages 14–18. The
            planned rollout is GTA → Ontario → Greater Montreal → Quebec →
            Winnipeg.
          </p>
          <h3>Showcase · sample distribution</h3>
          <p>
            School and board outreach, iOS / Android store previews, bite-size
            Instagram, YouTube and TikTok clips, student success stories,
            creator partnerships and corporate education workshops.
          </p>
          <Badge tone="gold">
            All partnerships and sponsorships are illustrative
          </Badge>
          <h3>Local demo activity</h3>
          <p>
            {state.events.length} recorded learning events ·{" "}
            {state.saved.length} saved listings ·{" "}
            {state.assignments.filter((a) => a.status === "complete").length}{" "}
            completed assignments. These are local demo measurements, not
            monthly active users or sales.
          </p>
          <p className="small muted">
            Production needs live integrations, real authentication, educator
            review, privacy and security work for student data. Business
            projections and source disagreements are documented in
            docs/HANDOFF.md.
          </p>
        </Modal>
      )}
    </>
  );
}
export default function App() {
  const { state, setState, navigate } = useApp();
  const [booting, setBooting] = useState(true),
    [quickMenu, setQuickMenu] = useState(false),
    [metric, setMetric] = useState(null),
    [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang =
      state.profile.language === "fr" ? "fr-CA" : "en-CA";
    document.body.classList.toggle(
      "reduce-motion",
      state.preferences.reducedMotion,
    );
    document.body.classList.toggle("high-contrast", state.preferences.contrast);
  }, [state.preferences, state.profile.language]);
  if (booting)
    return (
      <LaunchLoader
        preparation={logoReady}
        reducedMotion={state.preferences.reducedMotion}
        onComplete={() => setBooting(false)}
      />
    );
  if (!state.onboarded) return <Splash />;
  const view = state.view;
  const active = ["learn", "pathway", "lesson", "fraud"].includes(view)
    ? "home"
    : view === "teacher"
      ? "class"
      : view;
  const labels =
    state.profile.language === "fr"
      ? ["Classe", "Simuler", "Accueil", "Découvrir", "Réglages"]
      : nav.map((n) => n[2]);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="main-shell">
        <header className="topbar app-topbar">
          <button
            className="app-profile-shortcut"
            aria-label="Your profile and settings"
            onClick={() => navigate("settings")}
          >
            <span className="small-avatar">
              {state.profile.name.slice(0, 1)}
            </span>
            <span>
              <strong>{state.profile.name}</strong>
              <small>
                {state.role === "teacher"
                  ? "Teacher demo"
                  : "Your learning space"}
              </small>
            </span>
          </button>
          <div className="stats-bar">
            <button
              className="metric flame"
              aria-label={`${state.streak} day streak. Learn about streaks`}
              onClick={() => setMetric("streak")}
            >
              <Icon name="flame" size={21} />
              <strong>{state.streak}</strong>
            </button>
            <button
              className="metric heart"
              aria-label={`${state.hearts} hearts. Practice support`}
              onClick={() => setMetric("hearts")}
            >
              <Icon name="heart" size={21} />
              <strong>{state.hearts}</strong>
            </button>
            <button
              className="stats-logo"
              aria-label="NOVA home"
              onClick={() => navigate("home")}
            >
              <Logo compact />
            </button>
            <button
              className="metric stars"
              aria-label={`${state.stars} earned Stars. Reward ledger`}
              onClick={() => setMetric("stars")}
            >
              <Icon name="star" size={22} />
              <strong>{state.stars.toLocaleString()}</strong>
            </button>
          </div>
          <button
            className="app-menu-trigger icon-btn"
            aria-label="Open menu"
            onClick={() => setQuickMenu(true)}
          >
            <Icon name="menu" size={23} />
          </button>
        </header>
        {!online && (
          <div className="offline-banner" role="status">
            You’re offline. All demo lessons and simulations still work.
            External sources will be available when you reconnect.
          </div>
        )}
        {state.role === "teacher" && view !== "teacher" && (
          <div className="teacher-banner">
            Teacher preview · shared sample classroom{" "}
            <button onClick={() => navigate("teacher")}>
              Return to teacher view <Icon name="arrow" size={14} />
            </button>
          </div>
        )}
        <main
          id="main-content"
          tabIndex={-1}
          key={view}
          className={view === "home" ? "dashboard-page" : ""}
        >
          {view === "home" ? (
            <Dashboard />
          ) : view === "learn" ? (
            <Pathways />
          ) : view === "pathway" ? (
            <Pathway />
          ) : view === "lesson" ? (
            <Lesson />
          ) : view === "fraud" ? (
            <Fraud />
          ) : view === "simulate" ? (
            <Simulator />
          ) : view === "discover" ? (
            <Discover />
          ) : view === "class" ? (
            <Classroom />
          ) : view === "teacher" ? (
            <Teacher />
          ) : (
            <Settings onReplayLoading={() => setBooting(true)} />
          )}
        </main>
      </div>
      <nav className="bottom-nav" aria-label="App navigation">
        {nav.map(([id, icon], i) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            className={`${active === id ? "active" : ""} ${id === "home" ? "nav-home" : ""}`}
            aria-current={active === id ? "page" : undefined}
          >
            <span>
              <Icon name={icon} size={21} />
            </span>
            <small>{labels[i]}</small>
          </button>
        ))}
      </nav>
      <LearningAssistant />
      {quickMenu && (
        <Modal title="Your NOVA space" onClose={() => setQuickMenu(false)}>
          <p className="muted">
            A little learning, wherever your curiosity takes you.
          </p>
          <div className="stack">
            {[
              ["home", "home", "Home"],
              ["learn", "book", "NOVA Pathways"],
              ["simulate", "chart", "Both simulators"],
              ["discover", "compass", "Discover"],
              ["class", "users", "Class"],
              ["teacher", "users", "Teacher & school demo"],
              ["settings", "settings", "Profile, goals & settings"],
            ].map(([id, icon, label]) => (
              <Button
                variant="secondary"
                key={id}
                onClick={() => {
                  setQuickMenu(false);
                  navigate(id);
                }}
              >
                <Icon name={icon} />
                {label}
                <Icon name="arrow" size={16} />
              </Button>
            ))}
          </div>
        </Modal>
      )}
      {metric && (
        <Modal
          title={
            metric === "stars"
              ? "Your NOVA Stars"
              : metric === "hearts"
                ? "Room to learn"
                : "Keep your spark going"
          }
          onClose={() => setMetric(null)}
        >
          {metric === "stars" ? (
            <>
              <div className="metric-total">
                <Icon name="star" size={34} />
                <strong>{state.stars}</strong>
                <span>earned Stars</span>
              </div>
              <p>
                Earned Stars celebrate learning and unlock challenges. They are
                never spent on trades. The simulator has a separate 5,000-Star
                practice wallet. Neither balance has cash value.
              </p>
              <h3>Your reward ledger</h3>
              <div className="reward-list">
                {state.rewardLedger.length ? (
                  state.rewardLedger.map((r) => (
                    <div className="row spread" key={r.id}>
                      <span>
                        {r.reason}
                        <small>{r.date}</small>
                      </span>
                      <strong>+{r.amount} ✦</strong>
                    </div>
                  ))
                ) : (
                  <p className="muted">
                    Your first lesson is the first spark. Complete one to earn
                    Stars.
                  </p>
                )}
              </div>
            </>
          ) : metric === "hearts" ? (
            <>
              <p>
                Hearts are practice feedback. A missed answer may use a heart,
                but you can review and keep learning. They never block a lesson.
              </p>
              <p>
                <strong>{state.hearts} of 4 hearts</strong> · mistakes help us
                see what to revisit.
              </p>
              <Button
                onClick={() => {
                  setState((s) => ({ ...s, hearts: 4 }));
                  setMetric(null);
                }}
              >
                Review & refill hearts <Icon name="heart" />
              </Button>
            </>
          ) : (
            <>
              <p>
                Your demo streak is{" "}
                <strong>{state.streak} learning days</strong>. It celebrates
                showing up, not getting every answer right.
              </p>
              <p>
                The returning-student demo starts at 5 days. A fresh start
                begins at 1. Take breaks whenever you need.
              </p>
              <Button
                onClick={() => {
                  setMetric(null);
                  navigate("learn");
                }}
              >
                Find a little inspiration <Icon name="book" />
              </Button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
