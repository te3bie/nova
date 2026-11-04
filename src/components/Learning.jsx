import React, { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../store.jsx";
import { Icon, Button, Modal, Badge, Progress, PageTitle } from "./UI.jsx";
import {
  pathways,
  lessons,
  videoChapters,
  sourceLinks,
  recordConceptAttempt,
  isPathwayFinished,
  evaluateRedFlags,
} from "../data/lessons.js";
import "./learning.css";

const aliases = {
  types: "investments",
  "Types of Investments": "investments",
  "investment-styles": "styles",
  "media-literacy": "media",
};
function pathFrom(payload) {
  const id =
    typeof payload === "string" ? payload : payload?.id || payload?.pathway;
  return pathways.find((p) => p.id === (aliases[id] || id)) || pathways[1];
}
const nodeDone = (state, path, id) =>
  !!state.lessonProgress?.[`${path}:${id}`]?.completed ||
  state.completed?.includes(path);
const pc = (state, p) =>
  Math.round(
    (p.nodes.filter((n) => nodeDone(state, p.id, n)).length / p.nodes.length) *
      100,
  );
export function PathwayArt({ kind = "chart", className = "" }) {
  return (
    <svg
      viewBox="0 0 180 150"
      className={`pathway-art ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`art-${kind}`} x2="0" y2="1">
          <stop stopColor="#bdeeff" />
          <stop offset="1" stopColor="#e9f8ff" />
        </linearGradient>
      </defs>
      <circle cx="90" cy="76" r="61" fill={`url(#art-${kind})`} />
      <ellipse cx="91" cy="126" rx="53" ry="9" fill="#98bddd" opacity=".23" />
      {kind === "shield" ? (
        <>
          <path
            d="M90 31l39 15v32c0 22-17 38-39 48-22-10-39-26-39-48V46z"
            fill="#5079ea"
          />
          <path
            d="M72 76l12 13 25-29"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : kind === "compass" ? (
        <>
          <path
            d="M91 27l18 32 34 15-34 17-18 35-16-35-34-17 34-15z"
            fill="#408be2"
          />
          <path d="M91 49l11 25-11 28-11-28z" fill="#fff" />
          <circle cx="91" cy="74" r="7" fill="#ffc65c" />
        </>
      ) : kind === "target" ? (
        <>
          <circle cx="87" cy="79" r="43" fill="#4583db" />
          <circle cx="87" cy="79" r="31" fill="#eef8ff" />
          <circle cx="87" cy="79" r="18" fill="#ffc965" />
          <path
            d="M87 79l41-40m-14-1h15v16"
            fill="none"
            stroke="#254b87"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <rect x="40" y="84" width="23" height="37" rx="5" fill="#83b5f5" />
          <rect x="70" y="64" width="23" height="57" rx="5" fill="#4d88e6" />
          <rect x="101" y="41" width="23" height="80" rx="5" fill="#2b62c3" />
          <path
            d="M40 67l32-21 23 7 34-30m-18 0h18v18"
            fill="none"
            stroke="#30568a"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="130" cy="109" r="22" fill="#ffcf68" />
          <path
            d="M130 96v26m6-21h-9a5 5 0 000 9h6a5 5 0 010 9h-10"
            stroke="#b27a19"
            strokeWidth="3"
            fill="none"
          />
        </>
      )}
      <path
        d="M32 43v11m-5-6h10m108 38v9m-4-4h9"
        stroke="#8fb9dc"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Pathways() {
  const { state, navigate } = useApp();
  return (
    <div className="learning-screen">
      <PageTitle
        eyebrow="A LITTLE MORE CONFIDENT, EVERY DAY"
        title="Your NOVA Pathways"
      >
        Big ideas, broken into small steps. Find your next lightbulb moment.
      </PageTitle>
      <div className="learning-path-grid">
        {pathways.map((p, i) => (
          <button
            key={p.id}
            className={`pathway-preview card ${p.color}`}
            onClick={() =>
              navigate(p.id === "media" ? "fraud" : "pathway", { id: p.id })
            }
          >
            <div className="row spread">
              <Badge tone={pc(state, p) === 100 ? "gold" : "blue"}>
                {pc(state, p) === 100
                  ? "Completed"
                  : i === 1
                    ? "Recommended for you"
                    : `${p.nodes.length} lessons`}
              </Badge>
              <span className="small muted">{p.duration}</span>
            </div>
            <PathwayArt kind={p.icon} />
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <Progress value={pc(state, p)} />
            <div className="row spread small">
              <span>{pc(state, p)}% complete</span>
              <span className="row">
                {pc(state, p) === 100 ? "Review pathway" : "Explore pathway"}
                <Icon name="arrow" size={16} />
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="source-note">
        <Icon name="lightbulb" />
        <p>
          <strong>Made for your pace.</strong> Your next step uses your goals
          and recent answers, with clear rules you can inspect. You can always
          choose another pathway.
        </p>
      </div>
    </div>
  );
}

export function Pathway() {
  const { state, navigate } = useApp();
  const p = pathFrom(state.payload);
  if (p.id === "media") return <Fraud />;
  const done = pc(state, p);
  return (
    <div className="learning-screen">
      <Button variant="ghost" onClick={() => navigate("learn")}>
        <Icon name="arrowLeft" /> All pathways
      </Button>
      <div className="pathway-heading">
        <div>
          <Badge tone={done === 100 ? "gold" : "blue"}>
            {done === 100 ? "Pathway complete" : "YOUR LEARNING JOURNEY"}
          </Badge>
          <h1>{p.title}</h1>
          <p className="muted">{p.description}</p>
          <div className="row gap-sm small">
            <Icon name="clock" size={16} />
            {p.duration}
            <span>•</span>
            {p.nodes.length} bite-size lessons
          </div>
        </div>
        <div
          className="pathway-ring"
          style={{ "--progress": `${done * 3.6}deg` }}
        >
          <div>
            <Icon name={done === 100 ? "trophy" : "compass"} size={27} />
            <strong>{done}%</strong>
            <span>completed</span>
          </div>
        </div>
      </div>
      <div className="pathway-body">
        <section className="orbit-path card">
          <div className="orbit-line" />
          {p.nodes.map((id, i) => {
            const l = lessons[id],
              completed = nodeDone(state, p.id, id),
              recommended =
                !completed &&
                p.nodes.slice(0, i).every((n) => nodeDone(state, p.id, n));
            return (
              <button
                key={id}
                className={`orbit-node ${i % 2 ? "right" : "left"} ${completed ? "done" : ""} ${recommended ? "recommended" : ""}`}
                onClick={() => navigate("lesson", { pathway: p.id, node: id })}
              >
                <span className="orbit-disc">
                  <Icon
                    name={
                      completed
                        ? "check"
                        : id === "stocks"
                          ? "chart"
                          : i === 0
                            ? "compass"
                            : "book"
                    }
                    size={26}
                  />
                  {recommended && <i />}
                </span>
                <span className="orbit-copy">
                  <span className="eyebrow">
                    {completed
                      ? "COMPLETE"
                      : recommended
                        ? "UP NEXT"
                        : `LESSON ${i + 1}`}
                  </span>
                  <strong>
                    {id === "overview"
                      ? "Overview"
                      : id === "stocks"
                        ? "Stocks"
                        : l.title}
                  </strong>
                  <span className="muted small">
                    {id === "stocks"
                      ? "Explainer + 4 questions"
                      : "Read + worked example + practice"}
                  </span>
                </span>
                {["overview", "bonds", "etfs"].includes(id) &&
                  p.id === "investments" && (
                    <span className="node-reward">
                      <Icon name="star" size={15} />
                      100
                    </span>
                  )}
              </button>
            );
          })}
          <div className={`path-medal ${done === 100 ? "awarded" : ""}`}>
            <span>
              <Icon name="trophy" size={36} />
            </span>
            <strong>
              {done === 100 ? "You did it!" : "A brighter understanding awaits"}
            </strong>
            <small>
              {p.id === "investments"
                ? "700-Star pathway milestone"
                : "Your completion medal"}
            </small>
          </div>
        </section>
        <aside className="pathway-aside stack">
          <div className="card padded">
            <PathwayArt kind={p.icon} />
            <h3>One step at a time.</h3>
            <p className="muted">
              You can explore any node, then return to finish the trail. Your
              place is saved automatically.
            </p>
            <Button
              onClick={() =>
                navigate("lesson", {
                  pathway: p.id,
                  node:
                    p.nodes.find((n) => !nodeDone(state, p.id, n)) ||
                    p.nodes[0],
                })
              }
            >
              {done === 100 ? "Review lessons" : "Continue learning"}
              <Icon name="arrow" size={17} />
            </Button>
          </div>
          <details className="card padded">
            <summary>
              <Icon name="star" size={18} /> Your award schedule
            </summary>
            <p className="small muted">
              50 earned Stars once for each completed lesson.{" "}
              {p.id === "investments"
                ? "Overview, Bonds, and ETFs each add a 100-Star node milestone. Finish all seven nodes for one 700-Star pathway milestone."
                : "Finish each lesson to receive your pathway medal."}{" "}
              Reviewing or replaying does not repeat an award.
            </p>
          </details>
          <SourcePanel />
        </aside>
      </div>
    </div>
  );
}

function Explainer() {
  const [playing, setPlaying] = useState(false),
    [time, setTime] = useState(0),
    [captions, setCaptions] = useState(true);
  const chapter = Math.min(3, Math.floor(time / 7));
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setTime((t) => Math.min(28, t + 1)), 1000);
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (time >= 28) setPlaying(false);
  }, [time]);
  const ch = videoChapters[chapter];
  return (
    <div className="explainer">
      <div
        className={`explainer-stage stage-${ch.kind}`}
        role="img"
        aria-label={ch.title}
      >
        <div className="row spread">
          <Badge tone="blue">NOVA EXPLAINS</Badge>
          <span className="small">{chapter + 1} / 4</span>
        </div>
        {ch.kind === "ownership" ? (
          <div className="share-illustration">
            {Array.from({ length: 25 }, (_, i) => (
              <span key={i} className={i < 2 ? "owned" : ""} />
            ))}
          </div>
        ) : ch.kind === "risk" ? (
          <svg
            className="explainer-chart"
            viewBox="0 0 400 130"
            aria-hidden="true"
          >
            <path
              d="M20 15v95h355"
              fill="none"
              stroke="#b3cde4"
              strokeWidth="2"
            />
            <path
              d="M30 40l65-5 60 22 70-10 65 37 70 13"
              fill="none"
              stroke="#3669d2"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="360" cy="97" r="7" fill="#f28c78" />
            <text x="28" y="26">
              40 Stars
            </text>
            <text x="289" y="122">
              36 Stars
            </text>
          </svg>
        ) : (
          <div className="explainer-icons">
            <Icon name={ch.kind === "rights" ? "users" : "shield"} size={48} />
            <span>+</span>
            <Icon name={ch.kind === "rights" ? "chart" : "clock"} size={48} />
          </div>
        )}
        <h3>{ch.title}</h3>
        <span className="small">{ch.label}</span>
        {captions && (
          <p className="video-caption" aria-live={playing ? "polite" : "off"}>
            {ch.caption}
          </p>
        )}
      </div>
      <div className="explainer-controls">
        <Button
          variant="ghost"
          aria-label={playing ? "Pause explainer" : "Play explainer"}
          onClick={() => {
            if (time >= 28) setTime(0);
            setPlaying((v) => !v);
          }}
        >
          <Icon name={playing ? "pause" : "play"} size={18} />
          {playing ? "Pause" : "Play"}
        </Button>
        <label className="sr-only" htmlFor="explainer-position">
          Explainer position
        </label>
        <input
          id="explainer-position"
          type="range"
          min="0"
          max="28"
          value={time}
          onChange={(e) => setTime(+e.target.value)}
        />
        <span className="small">0:{String(time).padStart(2, "0")} / 0:28</span>
        <button
          className={`caption-control ${captions ? "active" : ""}`}
          aria-label="Toggle captions"
          aria-pressed={captions}
          onClick={() => setCaptions((v) => !v)}
        >
          CC
        </button>
      </div>
      <p className="small muted explainer-label">
        28-second silent, illustrated explainer • captions and chaptered
        transcript
      </p>
      <details className="transcript">
        <summary>Read the transcript</summary>
        {videoChapters.map((c, i) => (
          <div key={c.title}>
            <strong>
              0:{String(i * 7).padStart(2, "0")} · {c.title}
            </strong>
            <p>{c.caption}</p>
            <button
              className="text-action"
              onClick={() => {
                setTime(i * 7);
                setPlaying(false);
              }}
            >
              Go to chapter {i + 1}
            </button>
          </div>
        ))}
      </details>
    </div>
  );
}
function SourcePanel() {
  const [preview, setPreview] = useState(null);
  return (
    <>
      <details className="card padded lesson-sources">
        <summary>
          <Icon name="shield" size={18} /> Sources & review status
        </summary>
        <Badge tone="gold">Draft educational content</Badge>
        <p className="small muted">
          Written for this prototype. References support the concepts; they have
          not reviewed or endorsed NOVA. A qualified Canadian educator /
          financial expert review is pending.
        </p>
        {sourceLinks.map((s) => (
          <button
            className="source-link"
            key={s.title}
            onClick={() => setPreview(s)}
          >
            {s.title}
            <Icon name="external" size={15} />
          </button>
        ))}
        <p className="small muted">
          Reference check: 4 November 2026. Sample numbers are fictional
          learning examples, not forecasts.
        </p>
      </details>
      {preview && (
        <Modal
          title="Educational source preview"
          onClose={() => setPreview(null)}
        >
          <p>
            You’re about to leave the local NOVA demo to read{" "}
            <strong>{preview.title}</strong>.
          </p>
          <p className="source-url">{preview.url}</p>
          <p className="small muted">
            No student profile or lesson progress is sent by NOVA.
          </p>
          <a
            className="btn btn-primary"
            href={preview.url}
            target="_blank"
            rel="noreferrer"
          >
            Open educational source <Icon name="external" size={16} />
          </a>
        </Modal>
      )}
    </>
  );
}

export function Lesson() {
  const { state, setState, navigate, award, completeTask } = useApp();
  const payload = state.payload || {};
  const path = aliases[payload.pathway] || payload.pathway || "investments";
  const id = typeof payload === "string" ? payload : payload.node || "stocks";
  const l = lessons[id] || lessons.stocks;
  const key = `${path}:${id}`;
  const initial = state.lessonProgress?.[key] || {};
  const [stage, setStage] = useState(initial.stage || "learn"),
    [index, setIndex] = useState(initial.index || 0),
    [answers, setAnswers] = useState(initial.answers || {}),
    [test, setTest] = useState(!!payload.test || initial.test || false),
    [feedback, setFeedback] = useState(false),
    [review, setReview] = useState(null),
    [selected, setSelected] = useState(null);
  const top = useRef(null);
  const loggedKey = useRef(null);
  const questions = l.questions;
  const current = questions[Math.min(index, questions.length - 1)];
  const save = (changes) =>
    setState((s) => ({
      ...s,
      lessonProgress: {
        ...s.lessonProgress,
        [key]: { ...s.lessonProgress?.[key], ...changes },
      },
    }));
  useEffect(() => {
    const saved = state.lessonProgress?.[key] || {};
    const freshTest =
      payload.test && !(saved.test && saved.stage === "practice");
    const nextAnswers = freshTest ? {} : saved.answers || {};
    const nextIndex = freshTest ? 0 : saved.index || 0;
    const nextTest = !!payload.test || saved.test || false;
    const savedChoice =
      nextAnswers[questions[Math.min(nextIndex, questions.length - 1)].id];
    setStage(freshTest ? "practice" : saved.stage || "learn");
    setIndex(nextIndex);
    setAnswers(nextAnswers);
    setTest(nextTest);
    setFeedback(!nextTest && savedChoice != null);
    setSelected(savedChoice ?? null);
    const eventKey = key + ":" + !!payload.test;
    if (loggedKey.current !== eventKey) {
      loggedKey.current = eventKey;
      setState((s) => ({
        ...s,
        events: [
          ...(s.events || []),
          { type: "lesson_start", target: key, at: new Date().toISOString() },
        ],
      }));
    }
  }, [key, !!payload.test]);
  const changeStage = (next) => {
    setStage(next);
    save({ stage: next });
    setFeedback(false);
    setSelected(null);
    top.current?.scrollIntoView({ behavior: "instant", block: "start" });
  };
  const record = (question, choice) =>
    setState((s) => recordConceptAttempt(s, question, choice));
  const choose = (choice) => {
    if (feedback) return;
    setSelected(choice);
    const updated = { ...answers, [current.id]: choice };
    setAnswers(updated);
    save({ answers: updated, index, stage: "practice", test });
    if (!test) {
      record(current, choice);
      setFeedback(true);
    }
  };
  const finish = () => {
    if (test) questions.forEach((q) => record(q, answers[q.id]));
    const nowComplete = {
      ...state.lessonProgress,
      [key]: {
        ...state.lessonProgress?.[key],
        answers,
        index: questions.length - 1,
        completed: true,
        stage: "complete",
        test,
      },
    };
    const p = pathways.find((p) => p.id === path);
    const all = isPathwayFinished(state, path, id);
    setState((s) => ({
      ...s,
      lessonProgress: { ...s.lessonProgress, [key]: nowComplete[key] },
      completed: all
        ? [...new Set([...(s.completed || []), path])]
        : s.completed,
      events: [
        ...(s.events || []),
        { type: "lesson_complete", target: key, at: new Date().toISOString() },
      ],
    }));
    award(`lesson:${key}`, 50, `${l.title} lesson complete`);
    if (path === "investments" && ["overview", "bonds", "etfs"].includes(id))
      award(`node:${key}`, 100, `${l.title} node milestone`);
    if (all && path === "investments")
      award(
        "pathway:investments",
        700,
        "Types of Investments pathway milestone",
      );
    completeTask(id);
    completeTask(key);
    if (payload.test) completeTask(`test:${id}`);
    if (all) completeTask(path);
    setStage("complete");
    setFeedback(false);
  };
  const next = () => {
    if (index === questions.length - 1) {
      finish();
      return;
    }
    const n = index + 1;
    setIndex(n);
    save({ index: n, stage: "practice" });
    setSelected(answers[questions[n].id] ?? null);
    setFeedback(false);
    top.current?.scrollIntoView({ behavior: "instant", block: "start" });
  };
  const retry = () => {
    setIndex(0);
    setAnswers({});
    setSelected(null);
    setFeedback(false);
    setStage("practice");
    save({ stage: "practice", index: 0, answers: {}, test });
  };
  const earned = state.rewardLedger?.some((r) => r.id === `lesson:${key}`);
  const qResults = questions.map((q) => ({
    ...q,
    correct: answers[q.id] === q.answer,
  }));
  const mastered = qResults.filter((q) => q.correct);
  const learning = qResults.filter((q) => !q.correct);
  const nextP = pathways.find((p) => p.id === path);
  const nextNode = nextP?.nodes[nextP.nodes.indexOf(id) + 1];
  const overall = Object.values(state.mastery || {});
  const isComplete = stage === "complete";
  return (
    <div className="lesson-screen" ref={top}>
      <div className="lesson-topline">
        <Button
          variant="ghost"
          onClick={() => navigate("pathway", { id: path })}
        >
          <Icon name="arrowLeft" /> {l.eyebrow}
        </Button>
        <Badge tone={test ? "gold" : "blue"}>
          {test ? "Checkpoint test" : "Guided practice"}
        </Badge>
      </div>
      <div className="lesson-layout">
        <section className="lesson-main">
          <div className="lesson-kicker row spread">
            <span className="eyebrow">
              {stage === "learn"
                ? "LET’S MAKE IT CLICK"
                : stage === "complete"
                  ? "ANOTHER STEP FORWARD"
                  : `QUESTION ${index + 1} OF ${questions.length}`}
            </span>
            <span className="small muted">
              {stage === "learn"
                ? "4 min"
                : stage === "complete"
                  ? "Saved to your progress"
                  : `${Math.round(((index + (selected != null ? 1 : 0)) / questions.length) * 100)}%`}
            </span>
          </div>
          <Progress
            value={
              stage === "learn"
                ? 0
                : stage === "complete"
                  ? 100
                  : ((index + (selected != null ? 1 : 0)) / questions.length) *
                    100
            }
          />
          <h1>{stage === "complete" ? "Lesson Complete!" : l.title}</h1>
          {stage === "learn" ? (
            <>
              <p className="lesson-description">{l.description}</p>
              {id === "stocks" ? (
                <Explainer />
              ) : (
                <div className="lesson-hero-art">
                  <PathwayArt
                    kind={
                      path === "welcome"
                        ? "compass"
                        : path === "styles"
                          ? "target"
                          : "chart"
                    }
                  />
                  <span>{l.takeaway}</span>
                </div>
              )}
              <section className="lesson-copy">
                <h2>The idea</h2>
                <p>{l.overview}</p>
                <div className="worked-example">
                  <Badge tone="blue">LET’S TRY AN EXAMPLE</Badge>
                  <p>{l.example}</p>
                  {id === "stocks" && (
                    <div className="share-example">
                      <div className="row">
                        {Array.from({ length: 10 }, (_, i) => (
                          <span key={i} className={i < 2 ? "owned" : ""} />
                        ))}
                      </div>
                      <small>
                        Two highlighted pieces represent ownership. Diagram
                        simplified.
                      </small>
                    </div>
                  )}
                </div>
                <div className="takeaway">
                  <Icon name="lightbulb" />
                  <p>{l.takeaway}</p>
                </div>
              </section>
              <div className="lesson-actions">
                <Button
                  onClick={() => {
                    setTest(false);
                    setIndex(0);
                    setAnswers({});
                    save({ test: false, index: 0, answers: {} });
                    changeStage("practice");
                  }}
                >
                  Try the knowledge check <Icon name="arrow" size={18} />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setTest(true);
                    setIndex(0);
                    setAnswers({});
                    save({ test: true, index: 0, answers: {} });
                    changeStage("practice");
                  }}
                >
                  Take checkpoint test
                </Button>
              </div>
              <p className="small muted">
                Practice gives feedback after each answer. A checkpoint reveals
                feedback after submission.
              </p>
            </>
          ) : isComplete ? (
            <>
              <div className="lesson-award">
                <div className="award-rays">
                  <Icon name="trophy" size={54} />
                </div>
                <Badge tone="gold">50 NOVA Stars Earned!</Badge>
                <p>
                  {earned
                    ? "Your lesson reward is recorded once. Replays help your understanding."
                    : "Your learning reward has been added to your Stars."}
                </p>
              </div>
              <h2 className="section-heading">See your progress</h2>
              <div className="mastery-cards">
                <button
                  className="mastery-card mastered"
                  onClick={() => setReview("mastered")}
                >
                  <Icon name="check" />
                  <strong>{mastered.length}</strong>
                  <span>Mastered</span>
                  <small>
                    See More <Icon name="arrow" size={14} />
                  </small>
                </button>
                <button
                  className="mastery-card learning"
                  onClick={() => setReview("learning")}
                >
                  <Icon name="lightbulb" />
                  <strong>{learning.length}</strong>
                  <span>Learning</span>
                  <small>
                    See More <Icon name="arrow" size={14} />
                  </small>
                </button>
              </div>
              <p className="small muted">
                Counts reflect this lesson’s {questions.length} question
                {questions.length === 1 ? "" : "s"}. Across your activity:{" "}
                {overall.filter((x) => x.lastCorrect).length} mastered,{" "}
                {overall.filter((x) => !x.lastCorrect).length} learning.
              </p>
              <div className="next-recommendation">
                <div className="row gap-sm">
                  <Icon name="compass" />
                  <span className="eyebrow">YOUR NEXT STEP</span>
                </div>
                <h3>
                  {learning.length
                    ? "A small review, a stronger foundation"
                    : nextNode
                      ? lessons[nextNode].title
                      : "Put your understanding into practice"}
                </h3>
                <p>
                  {learning.length
                    ? `Revisit ${[...new Set(learning.map((q) => q.concept))].join(" and ")} with a fresh read, then try again.`
                    : nextNode
                      ? `You’re ready to explore ${lessons[nextNode].title.toLowerCase()}.`
                      : "Try a simulated decision and explain the risks before acting."}
                </p>
                <details>
                  <summary>Why this is next</summary>
                  <p className="small">
                    {learning.length
                      ? "Rule: at least one answer needs review, so NOVA prioritises those concepts over moving ahead."
                      : "Rule: all answers in this lesson are correct, so NOVA suggests the next curated node or a simulator task."}{" "}
                    Your goal is “{state.profile.goal}” and your preferred
                    format is {state.profile.format?.toLowerCase() || "visual"}.
                    This is a transparent demo rule, not a live AI model.
                  </p>
                </details>
                <div className="row lesson-actions">
                  <Button
                    onClick={() =>
                      learning.length
                        ? retry()
                        : nextNode
                          ? navigate("lesson", {
                              pathway: path,
                              node: nextNode,
                            })
                          : navigate("simulate")
                    }
                  >
                    {learning.length
                      ? "Try a short review"
                      : nextNode
                        ? "Next lesson"
                        : "Try the simulator"}
                    <Icon name="arrow" size={17} />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      changeStage("learn");
                    }}
                  >
                    Read a different explanation
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate("pathway", { id: path })}
              >
                See pathway progress <Icon name="arrow" size={17} />
              </Button>
            </>
          ) : (
            <>
              <div className="question-meta">
                <Badge tone="blue">
                  {current.type === "blank"
                    ? "Fill in the blank"
                    : current.type === "boolean"
                      ? "True or false"
                      : "Multiple choice"}
                </Badge>
                <span className="small muted">{current.concept}</span>
              </div>
              <h2 className="question-title">
                {current.text.replace(
                  "___",
                  selected != null
                    ? current.options[selected].toLowerCase()
                    : "______",
                )}
              </h2>
              {current.type === "blank" && (
                <div className="ownership-visual" aria-hidden="true">
                  <Icon name="users" size={30} />
                  <span>YOU</span>
                  <Icon name="arrow" />
                  <div className="mini-company">
                    ▦<span>A COMPANY</span>
                  </div>
                </div>
              )}
              <fieldset
                className={`answer-options ${current.type === "blank" ? "word-options" : ""}`}
              >
                <legend className="sr-only">Choose an answer</legend>
                {current.options.map((option, i) => (
                  <button
                    key={option}
                    className={`answer-button ${selected === i ? "selected" : ""} ${feedback && i === current.answer ? "correct" : ""} ${feedback && selected === i && i !== current.answer ? "incorrect" : ""}`}
                    aria-pressed={selected === i}
                    disabled={feedback}
                    onClick={() => choose(i)}
                  >
                    <span className="answer-letter">
                      {current.type === "boolean"
                        ? i === 0
                          ? "T"
                          : "F"
                        : String.fromCharCode(65 + i)}
                    </span>
                    <span>{option}</span>
                    {feedback && i === current.answer && (
                      <Icon name="check" size={20} />
                    )}
                  </button>
                ))}
              </fieldset>
              {feedback && (
                <div
                  className={`answer-feedback ${selected === current.answer ? "correct" : "incorrect"}`}
                  role="status"
                >
                  <strong>
                    <Icon
                      name={selected === current.answer ? "check" : "lightbulb"}
                      size={20}
                    />
                    {selected === current.answer
                      ? "You’ve got it!"
                      : "A useful moment to learn."}
                  </strong>
                  <p>{current.explanation}</p>
                </div>
              )}
              {test && (
                <p className="small muted">
                  Your answers are saved. Feedback appears when you submit this
                  checkpoint.
                </p>
              )}
              {state.hearts === 0 && (
                <div className="heart-refill">
                  <Icon name="heart" />
                  <p>
                    Take a breath. Hearts are practice feedback, so you can keep
                    learning.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setState((s) => ({ ...s, hearts: 4 }))}
                  >
                    Refill 4 hearts
                  </Button>
                </div>
              )}
              <div className="question-footer">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (index === 0) {
                      changeStage("learn");
                      return;
                    }
                    setIndex((i) => i - 1);
                    setFeedback(false);
                    setSelected(answers[questions[index - 1].id] ?? null);
                    save({ index: index - 1 });
                  }}
                >
                  Back
                </Button>
                <Button
                  disabled={selected == null || (!test && !feedback)}
                  onClick={next}
                >
                  {index === questions.length - 1
                    ? test
                      ? "Submit checkpoint"
                      : "See my progress"
                    : "Next"}
                  <Icon name="arrow" size={17} />
                </Button>
              </div>
            </>
          )}
        </section>
        <aside className="lesson-aside stack">
          <div className="card padded">
            <span className="eyebrow">YOU’RE BUILDING</span>
            <h3>{l.eyebrow}</h3>
            <p className="muted small">{l.takeaway}</p>
            <div className="lesson-side-stars">
              <Icon name="star" />
              50 earned Stars{" "}
              <span className="small muted">once per lesson</span>
            </div>
          </div>
          <SourcePanel />
          <div className="kind-note">
            <Icon name="heart" size={19} />
            <p>
              Getting it wrong is part of getting it. Every retry is a new
              chance to understand.
            </p>
          </div>
        </aside>
      </div>
      {review && (
        <Modal
          title={
            review === "mastered"
              ? "What you mastered"
              : "What you’re still learning"
          }
          onClose={() => setReview(null)}
        >
          <p className="small muted">
            From your latest answers in this lesson.
          </p>
          {(review === "mastered" ? mastered : learning).length === 0 ? (
            <p>
              {review === "mastered"
                ? "Try a review to build your first mastered concept."
                : "You answered every question correctly. Keep the ideas fresh by revisiting later."}
            </p>
          ) : (
            (review === "mastered" ? mastered : learning).map((q) => (
              <div className="review-item" key={q.id}>
                <Badge tone={q.correct ? "green" : "gold"}>{q.concept}</Badge>
                <h4>{q.text}</h4>
                <p>{q.explanation}</p>
                <small className="muted">
                  Correct answer: {q.options[q.answer]}
                </small>
              </div>
            ))
          )}
          <Button onClick={() => setReview(null)}>Keep going</Button>
        </Modal>
      )}
    </div>
  );
}

const posts = [
  {
    platform: "TikTok-style",
    name: "@futureflex.demo",
    avatar: "FF",
    text: "I doubled my money in 7 days 🚀 Guaranteed 20% EVERY week. Only 10 spots left. DM me your bank login to join before midnight!",
    tag: "#MoneyHack #ad",
    date: "3 Nov 2026",
    source: "Fictional creator · sponsored sample",
    flags: [
      "Guaranteed returns",
      "Urgency and FOMO",
      "Request for private information",
      "Sponsorship needs checking",
      "Get-rich-quick promise",
    ],
  },
  {
    platform: "Instagram-style",
    name: "@levelup.cash.demo",
    avatar: "LC",
    text: "Everyone at school is buying this coin. If you miss today, you’ll regret it forever. My partner pays me when you sign up. Look at my luxury car!",
    tag: "Paid partnership · fictional post",
    date: "12 Aug 2023 · resurfaced",
    source: "Fictional affiliate creator · old post",
    flags: [
      "Urgency and FOMO",
      "Sponsorship needs checking",
      "Old or missing context",
      "Lifestyle is not evidence",
    ],
  },
  {
    platform: "YouTube-style",
    name: "@wealthshortcut.demo",
    avatar: "WS",
    text: "Turn 100 into 10,000 with my secret method. No risk, no work, no experience. This screenshot proves it. Pay a small upfront fee to unlock the strategy.",
    tag: "Promotional sample · fictional creator",
    date: "2 Nov 2026",
    source: "Fictional channel · unverified screenshot",
    flags: [
      "Guaranteed returns",
      "Upfront payment pressure",
      "Unverified evidence",
      "Get-rich-quick promise",
    ],
  },
];
const flags = [
  "Guaranteed returns",
  "Urgency and FOMO",
  "Request for private information",
  "Sponsorship needs checking",
  "Old or missing context",
  "Lifestyle is not evidence",
  "Upfront payment pressure",
  "Unverified evidence",
  "Get-rich-quick promise",
];
export function Fraud() {
  const { state, setState, navigate, award, completeTask } = useApp();
  const [postIndex, setPostIndex] = useState(0),
    [step, setStep] = useState(0),
    [selected, setSelected] = useState([]),
    [checked, setChecked] = useState(false),
    [sourceAnswer, setSourceAnswer] = useState(null),
    [action, setAction] = useState(null);
  const post = posts[postIndex];
  const flagResult = evaluateRedFlags(post, selected);
  const finish = () => {
    setState((s) => ({
      ...s,
      fraudComplete: true,
      completed: [...new Set([...(s.completed || []), "media"])],
      mastery: {
        ...s.mastery,
        "fraud-flags": {
          concept: "Spotting financial red flags",
          question: "Inspect a financial claim",
          explanation:
            "Check the original source, date, conflicts, and independent evidence. Avoid sharing private information.",
          attempts: (s.mastery?.["fraud-flags"]?.attempts || 0) + 1,
          correct: 1,
          lastCorrect: true,
        },
      },
      events: [
        ...(s.events || []),
        {
          type: "lesson_complete",
          target: "media-literacy",
          at: new Date().toISOString(),
        },
      ],
    }));
    award("lesson:media:claims", 50, "Financial-claim check complete");
    completeTask("media-literacy");
    completeTask("media");
    setStep(3);
  };
  return (
    <div className="learning-screen fraud-screen">
      <Button variant="ghost" onClick={() => navigate("learn")}>
        <Icon name="arrowLeft" /> All pathways
      </Button>
      <PageTitle
        eyebrow="MEDIA LITERACY AND FRAUD"
        title={
          step === 3
            ? "Your money-claim radar is growing."
            : "Good with money. Better with questions."
        }
      >
        A fictional feed. Real critical-thinking skills. Practise a pause before
        you act.
      </PageTitle>
      <div className="fraud-progress">
        <Progress value={(step / 3) * 100} />
        <span className="small muted">
          {
            [
              "1 · Inspect the claim",
              "2 · Check source & date",
              "3 · Choose a safe next step",
              "Complete · Keep your guard up",
            ][step]
          }
        </span>
      </div>
      {step === 3 ? (
        <div className="fraud-complete card padded">
          <div className="fraud-shield">
            <Icon name="shield" size={48} />
          </div>
          <Badge tone="gold">50 NOVA Stars · awarded once</Badge>
          <h2>Pause. Check. Protect.</h2>
          <p>
            You spotted pressure, checked the source and date, and chose
            independent evidence over a private message.
          </p>
          <div className="grid-3">
            <div>
              <strong>Notice the pitch</strong>
              <p>
                Guaranteed returns, urgency, and luxury imagery do not prove a
                sound investment.
              </p>
            </div>
            <div>
              <strong>Check the context</strong>
              <p>
                Sponsorship is a conflict to disclose. Check original dates,
                evidence, and credentials.
              </p>
            </div>
            <div>
              <strong>Take a safer step</strong>
              <p>
                Keep private details private. Ask a trusted adult or educator,
                and check regulator resources.
              </p>
            </div>
          </div>
          <details>
            <summary>Why this matters</summary>
            <p>
              A paid creator can be honest, and an unsponsored post can be
              misleading. Sponsorship is a reason to inspect incentives, not
              proof of fraud. A screenshot is easy to fabricate. No post alone
              establishes suitability or legitimacy.
            </p>
          </details>
          <div className="row lesson-actions">
            <Button
              onClick={() => {
                setPostIndex((postIndex + 1) % posts.length);
                setStep(0);
                setSelected([]);
                setChecked(false);
                setSourceAnswer(null);
                setAction(null);
              }}
            >
              Try another example
            </Button>
            <Button variant="secondary" onClick={() => navigate("home")}>
              Back to Home
            </Button>
          </div>
        </div>
      ) : (
        <div className="fraud-layout">
          <div className="sample-post">
            <div className="post-top">
              <Badge tone="gray">
                FICTIONAL {post.platform.toUpperCase()} POST
              </Badge>
              <span className="small muted">Demo only</span>
            </div>
            <div className="creator">
              <span>{post.avatar}</span>
              <div>
                <strong>{post.name}</strong>
                <small>{post.date}</small>
              </div>
              <Icon name="menu" size={18} />
            </div>
            <div className="post-art">
              <Icon name="chart" size={54} />
              <span>THE NEXT BIG THING?</span>
              <div className="post-sparkles">✦　✦</div>
            </div>
            <blockquote>{post.text}</blockquote>
            <p className="post-tags">{post.tag}</p>
            <div className="post-disclaimer">
              <Icon name="info" size={16} /> Invented for learning. No offer or
              real creator.
            </div>
          </div>
          <div className="card padded fraud-questions">
            {step === 0 ? (
              <>
                <span className="eyebrow">LOOK PAST THE HYPE</span>
                <h2>What would make you pause?</h2>
                <p className="muted">
                  Select at least two red flags. Some are subtle.
                </p>
                <fieldset className="flag-options">
                  <legend className="sr-only">Choose red flags</legend>
                  {flags.map((flag) => (
                    <label
                      className={selected.includes(flag) ? "selected" : ""}
                      key={flag}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(flag)}
                        disabled={checked}
                        onChange={() =>
                          setSelected((s) =>
                            s.includes(flag)
                              ? s.filter((f) => f !== flag)
                              : [...s, flag],
                          )
                        }
                      />
                      {flag}
                    </label>
                  ))}
                </fieldset>
                {checked && (
                  <div
                    className={`answer-feedback ${flagResult.canContinue ? "correct" : "incorrect"}`}
                    role="status"
                  >
                    <strong>
                      {flagResult.canContinue
                        ? "Your pause is well supported."
                        : "Let’s sharpen your claim check."}
                    </strong>
                    <p>
                      You identified {flagResult.hits.length} supported red flag
                      {flagResult.hits.length === 1 ? "" : "s"}.{" "}
                      {flagResult.unsupported.length > 0
                        ? `These need stronger evidence in this sample: ${flagResult.unsupported.join(", ")}.`
                        : flagResult.hits.length < 2
                          ? "Find at least two signals in the actual post."
                          : "Look for evidence and incentives rather than deciding from popularity."}
                    </p>
                    <p>Signals in this sample: {post.flags.join(" · ")}.</p>
                  </div>
                )}
                <Button
                  disabled={selected.length < 2}
                  onClick={() =>
                    checked
                      ? flagResult.canContinue
                        ? setStep(1)
                        : setChecked(false)
                      : setChecked(true)
                  }
                >
                  {checked
                    ? flagResult.canContinue
                      ? "Check the source"
                      : "Try my choices again"
                    : "Inspect my choices"}
                  <Icon name="arrow" size={17} />
                </Button>
              </>
            ) : step === 1 ? (
              <>
                <span className="eyebrow">A QUICK CONTEXT CHECK</span>
                <h2>Who said it, and when?</h2>
                <div className="source-check">
                  <p>
                    <strong>Source:</strong> {post.source}
                  </p>
                  <p>
                    <strong>Post date:</strong> {post.date}
                  </p>
                  <p>
                    <strong>Independent evidence:</strong> Not supplied
                  </p>
                </div>
                <p>Which check is most useful?</p>
                {[
                  "Compare original sources, date, sponsorship, and registration where relevant.",
                  "Trust the creator because the post has lots of likes.",
                  "Assume a paid post must be true.",
                ].map((a, i) => (
                  <button
                    className={`answer-button ${sourceAnswer === i ? "selected" : ""}`}
                    key={a}
                    onClick={() => setSourceAnswer(i)}
                  >
                    {a}
                  </button>
                ))}
                {sourceAnswer != null && (
                  <div className="answer-feedback" role="status">
                    <p>
                      {sourceAnswer === 0
                        ? "Exactly. A current date alone is not proof. Independent evidence and a source’s incentives matter."
                        : "Popularity and payment do not establish credibility. Compare the original source, date, conflicts, and independent evidence."}
                    </p>
                  </div>
                )}
                <Button
                  disabled={sourceAnswer !== 0}
                  onClick={() => setStep(2)}
                >
                  Choose my next action
                  <Icon name="arrow" size={17} />
                </Button>
              </>
            ) : (
              <>
                <span className="eyebrow">YOU’RE IN CONTROL</span>
                <h2>What’s a safer next step?</h2>
                {[
                  "Send my login before the offer expires.",
                  "Pause, verify independently, and ask a trusted adult or teacher.",
                  "Share the post with friends as a proven opportunity.",
                ].map((a, i) => (
                  <button
                    className={`answer-button ${action === i ? "selected" : ""}`}
                    key={a}
                    onClick={() => setAction(i)}
                  >
                    {a}
                  </button>
                ))}
                {action != null && (
                  <div
                    className={`answer-feedback ${action === 1 ? "correct" : "incorrect"}`}
                    role="status"
                  >
                    <p>
                      {action === 1
                        ? "A thoughtful choice. Never share bank logins or send money because a creator pressures you. Use official regulator resources and support from someone you trust."
                        : "Pause before sharing money, credentials, or an unverified claim. You can choose again."}
                    </p>
                  </div>
                )}
                <Button disabled={action !== 1} onClick={finish}>
                  See the debrief <Icon name="arrow" size={17} />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="fraud-footer">
        <SourcePanel />
        {step === 0 && (
          <div className="sample-switch">
            <span className="small muted">Explore another format</span>
            {posts.map((p, i) => (
              <button
                key={p.platform}
                className={`chip ${i === postIndex ? "active" : ""}`}
                onClick={() => {
                  setPostIndex(i);
                  setSelected([]);
                  setChecked(false);
                }}
              >
                {p.platform}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
