import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../store.jsx";
import { lessons, pathways } from "../data/lessons.js";
import { Icon } from "./UI.jsx";
import "./learning-assistant.css";

const prompts = ["Explain stocks", "Help me choose a lesson", "Spot a scam"];
const investmentNodes = pathways.find((p) => p.id === "investments").nodes;
function initialMessage(view) {
  if (view === "simulate")
    return "A safe place to try, and a little help to understand. Ask me about shares, your practice wallet, or choosing an account.";
  if (view === "teacher")
    return "Planning a class? I can point you to an ownership lesson, a source-checking activity, or a simulator discussion.";
  if (view === "lesson")
    return "Big idea feeling a little fuzzy? I can explain it another way or help you find your next small step.";
  return "Hi, I’m your NOVA learning companion. A money question, a tricky word, or your next lesson — let’s make it click.";
}
function lessonAction(node, label = "Explore this lesson") {
  return {
    label,
    view: "lesson",
    payload: {
      pathway:
        pathways.find((path) => path.nodes.includes(node))?.id || "investments",
      node,
    },
  };
}
function responseFor(question, state) {
  const text = question.toLowerCase().replace(/[’']/g, "");
  if (
    /scam|fraud|influencer|claim|tiktok|instagram|guaranteed.*(?:return|profit)|fomo|get rich|youtube/.test(
      text,
    )
  ) {
    return {
      text: "Pause before the pitch. A guaranteed return, pressure to act now, and requests for private details are reasons to investigate. Check the original source, date, sponsorship and independent evidence. A paid post is a reason to inspect incentives; it is not proof of fraud.",
      action: { label: "Practise checking a claim", view: "fraud" },
    };
  }
  if (
    /next|choose.*lesson|where.*start|pathway|recommend|help me|learn next/.test(
      text,
    )
  ) {
    const gap = Object.values(state.mastery || {}).find(
      (concept) => concept.lastCorrect === false,
    );
    const gapNode = gap
      ? Object.entries(lessons).find(([, lesson]) =>
          lesson.questions.some((q) => q.text === gap.question),
        )?.[0]
      : null;
    const node = gap
      ? gapNode || "stocks"
      : investmentNodes.find(
          (id) => !state.lessonProgress?.[`investments:${id}`]?.completed,
        ) || "stocks";
    const lesson = lessons[node];
    return {
      text: gap
        ? `A small review can make the next step easier. Your recent answers suggest revisiting ${gap.concept?.toLowerCase() || "a foundation"}. Try ${lesson.title}, then check your understanding again. This suggestion follows your recorded answers and our curated lesson bank.`
        : `A good next step is ${node === "overview" ? "Overview: your investment toolkit" : lesson.title}. ${lesson.description} It connects to your ${state.profile.goal.toLowerCase()} goal by helping you compare risk and your timeline. This is a simple rule: build foundations, then move to the next unfinished lesson.`,
      action: lessonAction(
        node,
        gap ? `Review ${lesson.title}` : "Open my next lesson",
      ),
    };
  }
  if (/star|wallet|balance|reward|heart/.test(text)) {
    return {
      text: `You have ${state.stars.toLocaleString("en-CA")} earned NOVA Stars. They celebrate learning and can unlock challenges. Your simulator starts with a separate 5,000-Star practice wallet. A simulated trade never changes your earned Stars. Hearts are practice feedback — you can review, refill and keep learning.`,
      action: { label: "Explore both simulators", view: "simulate" },
    };
  }
  if (/margin|cash account|retirement|joint|custodial|account/.test(text)) {
    return {
      text: "A cash account uses money already available. Margin adds borrowing and can amplify losses. Retirement describes a long-term goal; joint means shared control; custodial involves an adult managing assets for a minor. These are generic learning categories. The account simulator compares their trade-offs through five situations.",
      action: {
        label: "Compare account choices",
        view: "simulate",
        payload: { tab: "accounts" },
      },
    };
  }
  if (/buy|sell|trade|trading|tesla|apple|microsoft|profit|price/.test(text)) {
    return {
      text: "Start with the decision, then the number: what do you own, what could you lose, and when might you need the money? In the simulator, preview a small whole-share order, check your available trading Stars, then advance a day and explain the event. Short-term profit alone does not show a good learning process.",
      action: {
        label: "Try a practice trade",
        view: "simulate",
        payload: { tab: "stocks" },
      },
    };
  }
  const topic = /bond/.test(text)
    ? "bonds"
    : /mutual/.test(text)
      ? "mutual-funds"
      : /etf|exchange.traded/.test(text)
        ? "etfs"
        : /property|real estate/.test(text)
          ? "real-estate"
          : /gic|certificate/.test(text)
            ? "gics"
            : null;
  if (topic) {
    const lesson = lessons[topic];
    return {
      text: `${lesson.overview}\n\nA useful question: ${lesson.takeaway}`,
      action: lessonAction(topic),
    };
  }
  if (/risk|diversif|safe|passive|active|long.term|time horizon/.test(text)) {
    return {
      text: "Risk includes the chance of losing money and needing it at the wrong time. Diversification spreads exposure across different sources of risk, but it cannot prevent every loss. Your goal, time horizon, costs and ability to absorb a loss help you compare approaches.",
      action: {
        label: "Explore Investment Styles",
        view: "pathway",
        payload: "styles",
      },
    };
  }
  if (/stock|share|own|dividend|vot/.test(text)) {
    return {
      text: `${lessons.stocks.overview}\n\nFor example, 2 shares bought at 20 Stars each cost 40 Stars. If each becomes worth 18 Stars, your holding is worth 36 Stars — a 4-Star loss. Some shares have voting rights; dividends and returns are never guaranteed.`,
      action: lessonAction("stocks", "Make sense of stocks"),
    };
  }
  return {
    text: "Let’s take one small step. I can explain stocks, bonds, ETFs, risk, account choices and NOVA Stars, or help you inspect a financial claim. My replies come from NOVA’s curated lessons, so I’ll point you to a lesson when a question needs more context.",
    action: { label: "Browse the lesson bank", view: "learn" },
  };
}
function SparkBuddy({ small = false }) {
  return (
    <span
      className={`nova-buddy ${small ? "nova-buddy-small" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40">
        <path
          d="M20 3c-1 11-6 16-17 17 11 1 16 6 17 17 1-11 6-16 17-17C26 19 21 14 20 3Z"
          fill="currentColor"
        />
        <circle cx="16.5" cy="19" r="1.3" fill="#1d5594" />
        <circle cx="23.5" cy="19" r="1.3" fill="#1d5594" />
        <path
          d="M17.5 23q2.5 2.5 5 0"
          fill="none"
          stroke="#1d5594"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
      <i />
    </span>
  );
}

export default function LearningAssistant() {
  const { state, navigate } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputError, setInputError] = useState("");
  const launcher = useRef(null),
    panel = useRef(null),
    field = useRef(null),
    conversation = useRef(null);
  const motionReduced =
    state.preferences?.reducedMotion ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  function close(restoreFocus = true) {
    setOpen(false);
    if (restoreFocus)
      requestAnimationFrame(() =>
        launcher.current?.focus({ preventScroll: true }),
      );
  }
  function toggle() {
    if (open) {
      close();
      return;
    }
    if (!messages.length)
      setMessages([
        { id: "intro", role: "assistant", text: initialMessage(state.view) },
      ]);
    setOpen(true);
  }
  useEffect(() => {
    if (!open) return;
    field.current?.focus({ preventScroll: true });
    const key = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    const outside = (event) => {
      if (
        !panel.current?.contains(event.target) &&
        !launcher.current?.contains(event.target)
      )
        close(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  useEffect(() => {
    if (!open || !conversation.current) return;
    conversation.current.scrollTo({
      top: conversation.current.scrollHeight,
      behavior: motionReduced ? "instant" : "smooth",
    });
  }, [messages, open, motionReduced]);
  function ask(value) {
    const question = value.trim();
    if (!question) {
      setInputError("Add a question or choose a topic below.");
      field.current?.focus();
      return;
    }
    const reply = responseFor(question, state);
    const stamp = Date.now();
    setMessages((previous) =>
      [
        ...previous,
        { id: `${stamp}-q`, role: "user", text: question },
        { id: `${stamp}-a`, role: "assistant", ...reply },
      ].slice(-24),
    );
    setInput("");
    setInputError("");
    field.current?.focus({ preventScroll: true });
  }
  return (
    <div className={`nova-assistant ${open ? "is-open" : ""}`}>
      {open && (
        <section
          className="nova-assistant-panel"
          id="nova-learning-companion"
          role="dialog"
          aria-modal="false"
          aria-labelledby="nova-assistant-title"
          ref={panel}
        >
          <header className="nova-assistant-heading">
            <SparkBuddy small />
            <div>
              <h2 id="nova-assistant-title">A little help from NOVA</h2>
              <p>
                <span /> Demo learning assistant
              </p>
            </div>
            <button
              className="nova-assistant-close"
              aria-label="Close learning assistant"
              onClick={() => close()}
            >
              <Icon name="close" size={19} />
            </button>
          </header>
          <div className="nova-assistant-topic">
            <Icon name="lightbulb" size={15} />
            <span>A question is a great place to start.</span>
            <span>✦</span>
          </div>
          <div
            className="nova-assistant-conversation"
            ref={conversation}
            role="log"
            aria-label="Learning assistant conversation"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`nova-assistant-message ${message.role === "user" ? "from-you" : "from-nova"}`}
              >
                <span className="nova-assistant-speaker">
                  {message.role === "user" ? "You" : "NOVA"}
                </span>
                <p>{message.text}</p>
                {message.action && (
                  <button
                    className="nova-assistant-action"
                    onClick={() => {
                      close(false);
                      navigate(message.action.view, message.action.payload);
                    }}
                  >
                    {message.action.label}
                    <Icon name="arrow" size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div
            className="nova-assistant-prompts"
            aria-label="Suggested questions"
          >
            {prompts.map((prompt) => (
              <button key={prompt} onClick={() => ask(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
          <form
            className="nova-assistant-form"
            onSubmit={(event) => {
              event.preventDefault();
              ask(input);
            }}
          >
            <label htmlFor="nova-assistant-question" className="sr-only">
              Ask NOVA a learning question
            </label>
            <input
              id="nova-assistant-question"
              ref={field}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setInputError("");
              }}
              maxLength={300}
              autoComplete="off"
              placeholder="What are you curious about?"
              aria-describedby={
                inputError
                  ? "nova-assistant-input-error"
                  : "nova-assistant-disclosure"
              }
            />
            <button type="submit" aria-label="Send learning question">
              <Icon name="arrow" size={19} />
            </button>
          </form>
          {inputError && (
            <p
              id="nova-assistant-input-error"
              className="nova-assistant-input-error"
              role="alert"
            >
              {inputError}
            </p>
          )}
          <p
            id="nova-assistant-disclosure"
            className="nova-assistant-disclosure"
          >
            Curated educational demo · no AI service connected
          </p>
        </section>
      )}
      <button
        className="nova-assistant-launcher"
        ref={launcher}
        aria-label={
          open
            ? "Close NOVA learning assistant"
            : "Open NOVA learning assistant"
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="nova-learning-companion"
        onClick={toggle}
      >
        <SparkBuddy />
        <span>
          Ask NOVA<small>A little spark of help</small>
        </span>
        {open ? (
          <Icon name="close" size={17} />
        ) : (
          <span className="nova-assistant-mini-star" aria-hidden="true">
            ✦
          </span>
        )}
      </button>
    </div>
  );
}
