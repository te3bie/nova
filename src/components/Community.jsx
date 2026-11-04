import React, { useMemo, useState } from "react";
import { useApp } from "../store.jsx";
import {
  Icon,
  Button,
  Modal,
  Badge,
  Progress,
  PageTitle,
  EmptyState,
} from "./UI.jsx";
import {
  opportunities,
  categories,
  sampleRoster,
  assignmentOptions,
} from "../data/opportunities.js";
import "./community.css";

const fmt = (n) => Number(n || 0).toLocaleString("en-CA");
const joinCode = "NOVA24";
const launchAssignment = (a, navigate) => {
  if (a.target === "stocks-test" || a.target === "test:stocks")
    navigate("lesson", { pathway: "investments", node: "stocks", test: true });
  else if (a.target === "stocks")
    navigate("lesson", { pathway: "investments", node: "stocks" });
  else if (a.target === "investments") navigate("pathway", "investments");
  else if (a.target === "media-literacy") navigate("fraud");
  else if (a.target === "stock-simulator")
    navigate("simulate", { tab: "stocks" });
  else if (a.target === "account-simulator")
    navigate("simulate", { tab: "accounts" });
  else navigate("learn");
};
function CommunityTabs({ items, value, onChange, label }) {
  return (
    <div className="community-tabs" role="tablist" aria-label={label}>
      {items.map((t, i) => (
        <button
          role="tab"
          aria-selected={value === t}
          tabIndex={value === t ? 0 : -1}
          key={t}
          className={value === t ? "active" : ""}
          onClick={() => onChange(t)}
          onKeyDown={(e) => {
            let next = i;
            if (e.key === "ArrowRight") next = (i + 1) % items.length;
            else if (e.key === "ArrowLeft")
              next = (i - 1 + items.length) % items.length;
            else if (e.key === "Home") next = 0;
            else if (e.key === "End") next = items.length - 1;
            else return;
            e.preventDefault();
            onChange(items[next]);
            e.currentTarget.parentElement.children[next].focus();
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
function ProviderMark({ provider, large = false }) {
  const abbreviation =
    provider === "Scotiabank"
      ? "S"
      : provider.startsWith("NOVA")
        ? "✦"
        : provider;
  return (
    <span
      className={`provider-mark provider-${provider.toLowerCase().split(" ")[0]} ${large ? "large" : ""}`}
      aria-label={provider}
    >
      {abbreviation}
    </span>
  );
}
function TrophyArt() {
  return (
    <div className="competition-art" aria-hidden="true">
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <span className="art-spark spark-one">✦</span>
      <span className="art-spark spark-two">✦</span>
      <span className="art-spark spark-three">✧</span>
      <div className="competition-trophy">
        <Icon name="trophy" size={90} />
      </div>
      <span className="art-coin coin-one">✦</span>
      <span className="art-coin coin-two">✦</span>
      <span className="art-pill">
        <Icon name="chart" size={18} /> Your next big move
      </span>
    </div>
  );
}

export function Discover() {
  const { state, setState, toast } = useApp();
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All opportunities"),
    [location, setLocation] = useState("Recommended region"),
    [onlySaved, setOnlySaved] = useState(false),
    [detail, setDetail] = useState(null),
    [flow, setFlow] = useState(null),
    [step, setStep] = useState(0),
    [reflection, setReflection] = useState(""),
    [agreed, setAgreed] = useState(false);
  const saved = state.saved || [],
    registered = state.registrations || [];
  const featured = opportunities[0];
  const visible = useMemo(
    () =>
      opportunities.filter((o) => {
        const matchesSearch =
          `${o.title} ${o.provider} ${o.category} ${o.description}`
            .toLowerCase()
            .includes(query.toLowerCase());
        let matchesLocation = true;
        if (location === "Recommended region")
          matchesLocation =
            o.location === "Canada-wide" ||
            o.location === state.profile.region ||
            (state.profile.region === "Greater Toronto Area" &&
              o.location === "Ontario");
        else if (location !== "All Canada")
          matchesLocation =
            o.location === location || o.location === "Canada-wide";
        return (
          matchesSearch &&
          (category === "All opportunities" || o.category === category) &&
          matchesLocation &&
          (!onlySaved || saved.includes(o.id))
        );
      }),
    [query, category, location, onlySaved, saved, state.profile.region],
  );
  const toggleSave = (id) => {
    const existed = saved.includes(id);
    setState((s) => ({
      ...s,
      saved: existed ? s.saved.filter((x) => x !== id) : [...s.saved, id],
    }));
    toast(
      existed
        ? "Removed from saved opportunities"
        : "Opportunity saved for later",
    );
  };
  const open = (o) => {
    setDetail(o);
    setState((s) => ({
      ...s,
      clicks: { ...s.clicks, [o.id]: (s.clicks?.[o.id] || 0) + 1 },
      events: [
        ...(s.events || []),
        { type: "opportunity-open", id: o.id, date: "2026-11-04" },
      ],
    }));
  };
  const begin = (kind, o) => {
    setDetail(null);
    setFlow({ kind, item: o });
    setStep(0);
    setAgreed(false);
    setReflection("");
  };
  const register = () => {
    setState((s) => ({
      ...s,
      registrations: [...new Set([...(s.registrations || []), flow.item.id])],
      events: [
        ...(s.events || []),
        { type: "demo-registration", id: flow.item.id, date: "2026-11-04" },
      ],
    }));
    setStep(2);
  };
  return (
    <div className="discover-screen">
      <PageTitle
        eyebrow="OPEN NEW DOORS"
        title="A little curiosity. A lot of possibility."
      >
        Find learning experiences, student opportunities and your next
        challenge.
      </PageTitle>
      <div className="finder-search">
        <Icon name="search" size={23} />
        <input
          aria-label="Search opportunities"
          placeholder="Search opportunities, providers, or topics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            className="icon-btn"
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            <Icon name="close" />
          </button>
        )}
        <Button
          onClick={() =>
            document
              .getElementById("finder-results")
              ?.scrollIntoView({
                block: "start",
                behavior: state.preferences?.reducedMotion ? "auto" : "smooth",
              })
          }
        >
          Explore <Icon name="arrow" size={18} />
        </Button>
      </div>
      <div className="finder-controls">
        <div className="finder-select">
          <Icon name="filter" size={16} />
          <select
            aria-label="Opportunity category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="finder-select">
          <Icon name="globe" size={16} />
          <select
            aria-label="Opportunity location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {[
              "Recommended region",
              "All Canada",
              "Greater Toronto Area",
              "Ontario",
              "Greater Montreal",
              "Quebec",
              "Winnipeg",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          className={`saved-filter ${onlySaved ? "active" : ""}`}
          aria-pressed={onlySaved}
          onClick={() => setOnlySaved((v) => !v)}
        >
          <Icon name="bookmark" size={17} /> Saved <span>{saved.length}</span>
        </button>
      </div>
      {!query && !onlySaved && category === "All opportunities" && (
        <section className="featured-competition">
          <div className="featured-copy">
            <div className="row gap-sm">
              <Badge tone="gold">FEATURED CHALLENGE</Badge>
              <span className="sponsor-label">Sponsored · demo</span>
            </div>
            <h2>
              Your ideas.
              <br />A world of potential.
            </h2>
            <p>
              Make your first market moves in the Senior Stock Market
              Competition. Learn together. Think bigger.
            </p>
            <div className="featured-meta">
              <span>
                <Icon name="calendar" size={16} /> Nov 16–20
              </span>
              <span>
                <Icon name="users" size={16} /> Ages 14–18
              </span>
            </div>
            <Button onClick={() => open(featured)}>
              Explore the competition <Icon name="arrow" size={17} />
            </Button>
          </div>
          <TrophyArt />
        </section>
      )}
      <div id="finder-results" className="community-section-title">
        <div>
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h2>
            {onlySaved
              ? "Saved for your future"
              : query
                ? "Search results"
                : "Recommended for you"}
          </h2>
        </div>
        <span className="muted small">{visible.length} opportunities</span>
      </div>
      <p className="finder-context">
        <Icon name="lightbulb" size={16} /> Selected for your{" "}
        {state.profile.goal?.toLowerCase() || "money"} goal and{" "}
        {state.profile.region} region. Sponsored positions are labelled
        separately.
      </p>
      {visible.length === 0 ? (
        <EmptyState
          title={
            onlySaved
              ? "Your next opportunity is waiting"
              : "No matching opportunities"
          }
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setCategory("All opportunities");
                setLocation("All Canada");
                setOnlySaved(false);
              }}
            >
              Explore all opportunities
            </Button>
          }
        >
          {onlySaved
            ? "Save a listing with the bookmark button and find it here."
            : "Try a different search, category or location."}
        </EmptyState>
      ) : (
        <div className="opportunity-grid">
          {visible.map((o) => (
            <article className="opportunity-card card" key={o.id}>
              <div className="row spread">
                <ProviderMark provider={o.provider} />
                <button
                  className={`save-button ${saved.includes(o.id) ? "is-saved" : ""}`}
                  aria-label={`${saved.includes(o.id) ? "Unsave" : "Save"} ${o.title}`}
                  aria-pressed={saved.includes(o.id)}
                  onClick={() => toggleSave(o.id)}
                >
                  <Icon name="bookmark" size={20} />
                </button>
              </div>
              <div className="listing-labels">
                <span className={`listing-category category-${o.color}`}>
                  {o.category}
                </span>
                {o.sponsored && (
                  <span className="sponsor-label">Sponsored</span>
                )}
              </div>
              <h3>{o.title}</h3>
              <p>{o.description}</p>
              <div className="opportunity-location">
                <Icon name="globe" size={14} />
                {o.location} <span>·</span> {o.format}
              </div>
              <div className="opportunity-footer">
                <span
                  className={
                    o.status === "open" ? "verification-label" : "expired-label"
                  }
                >
                  {o.status === "expired"
                    ? "Session ended"
                    : o.status === "unavailable"
                      ? "Coming later"
                      : o.verified
                        ? "Curated demo content"
                        : "Unverified demo listing"}
                </span>
                <button className="text-link" onClick={() => open(o)}>
                  See more <Icon name="arrow" size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <details className="sponsorship-disclosure">
        <summary>How recommendations and sponsorship work</summary>
        <p>
          Educational recommendations use your goal, class context and selected
          region. Paid demo placements are labelled Sponsored and do not change
          lesson suggestions. The proposed partner model combines a base listing
          fee and pay-per-click visibility. No billing occurs here.
        </p>
        <p>
          <strong>
            {opportunities
              .filter((o) => o.sponsored)
              .reduce((n, o) => n + (state.clicks?.[o.id] || 0), 0)}{" "}
            sponsored listing opens
          </strong>{" "}
          recorded in this device’s demo, aggregated across fictional partner
          placements. No promotional interaction earns Stars. This counter
          resets with the full demo reset.
        </p>
      </details>
      <aside className="community-note">
        <Icon name="shield" size={19} />
        <p>
          <strong>A safe place to explore.</strong> All opportunities, provider
          relationships and registrations are illustrative. Product terms and
          availability have not been verified. No money or personal documents
          are collected.
        </p>
      </aside>
      {detail && (
        <Modal title={detail.title} onClose={() => setDetail(null)}>
          <div className="detail-provider">
            <ProviderMark provider={detail.provider} />
            <div>
              <strong>{detail.provider}</strong>
              <div className="muted small">
                {detail.category} ·{" "}
                {detail.sponsored
                  ? "Sponsored placement"
                  : "Educational recommendation"}
              </div>
            </div>
          </div>
          <Badge tone={detail.status === "open" ? "blue" : "gray"}>
            {detail.status === "open"
              ? "Demo listing"
              : detail.status === "expired"
                ? "Expired · no registration"
                : "Unavailable · planning preview"}
          </Badge>
          <p>{detail.details}</p>
          <dl className="listing-facts">
            <div>
              <dt>Where</dt>
              <dd>
                {detail.location} · {detail.format}
              </dd>
            </div>
            <div>
              <dt>When</dt>
              <dd>{detail.timing}</dd>
            </div>
            <div>
              <dt>Who can join</dt>
              <dd>{detail.eligibility}</dd>
            </div>
            <div>
              <dt>Review status</dt>
              <dd>
                {detail.verified
                  ? "Curated fictional educational content; expert review pending."
                  : "Provider, relationship, terms and availability unverified."}
              </dd>
            </div>
          </dl>
          {detail.scholarship && (
            <div className="sample-prize">
              <Icon name="star" />
              <p>{detail.scholarship}</p>
            </div>
          )}
          <div className="recommendation-why">
            <Icon name="lightbulb" />
            <div>
              <strong>Why this was suggested</strong>
              <p>
                {detail.why} Region preference: {state.profile.region}.
                Sponsorship does not determine your learning route.
              </p>
            </div>
          </div>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => toggleSave(detail.id)}>
              <Icon name="bookmark" size={17} />
              {saved.includes(detail.id) ? "Saved" : "Save for later"}
            </Button>
            {detail.status === "open" ? (
              registered.includes(detail.id) ? (
                <Badge tone="green">Demo registration confirmed</Badge>
              ) : (
                <Button
                  onClick={() =>
                    begin(
                      detail.category === "Competitions"
                        ? "competition"
                        : ["Workshops", "Seminars", "Expert sessions"].includes(
                              detail.category,
                            )
                          ? "rsvp"
                          : "external",
                      detail,
                    )
                  }
                >
                  {detail.category === "Competitions"
                    ? "Compete now"
                    : ["Workshops", "Seminars", "Expert sessions"].includes(
                          detail.category,
                        )
                      ? "Preview demo RSVP"
                      : "Preview provider visit"}
                  <Icon name="arrow" size={16} />
                </Button>
              )
            ) : (
              <Button variant="secondary" onClick={() => setDetail(null)}>
                Back to opportunities
              </Button>
            )}
          </div>
        </Modal>
      )}
      {flow && (
        <Modal
          title={
            step === 2
              ? "You’re on the demo list!"
              : flow.kind === "competition"
                ? "Your first competition starts here"
                : flow.kind === "rsvp"
                  ? "Preview your workshop RSVP"
                  : "Before you visit a provider"
          }
          onClose={() => setFlow(null)}
        >
          {step === 2 ? (
            <div className="registration-success">
              <span className="success-circle">
                <Icon name="check" size={30} />
              </span>
              <h3>
                {flow.kind === "competition"
                  ? "Challenge registration complete"
                  : "Demo RSVP confirmed"}
              </h3>
              <p>{flow.item.title}</p>
              <p className="muted">{flow.item.timing}</p>
              <div className="demo-confirmation">
                Reference: NOVA-{flow.item.id.toUpperCase().slice(0, 12)}
                <br />
                Saved locally for @{state.profile.handle || "nova"}. No email
                was sent and no external place was booked.
              </div>
              <Button onClick={() => setFlow(null)}>Keep exploring</Button>
            </div>
          ) : flow.kind === "external" ? (
            <>
              <Badge tone="gold">Preview only · no external navigation</Badge>
              <p>
                You selected{" "}
                <strong>
                  {flow.item.provider} · {flow.item.title}
                </strong>
                .
              </p>
              <p>
                This listing is a reference example. NOVA has not verified a
                current official destination or partnership, so the prototype
                does not send you to an external website.
              </p>
              <div className="recommendation-why">
                <Icon name="shield" />
                <div>
                  <strong>Before any real visit</strong>
                  <p>
                    Find the provider’s official website, check the date and
                    eligibility, and review costs and data collection with a
                    trusted adult. Never share banking passwords.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  toast(
                    "Provider visit preview recorded. No external website opened.",
                  );
                  setFlow(null);
                }}
              >
                Finish preview <Icon name="check" size={17} />
              </Button>
            </>
          ) : step === 0 ? (
            <>
              <Badge tone="blue">
                {flow.kind === "competition"
                  ? "Competition preview"
                  : "School-hosted education preview"}
              </Badge>
              <h3>{flow.item.title}</h3>
              <p>{flow.item.details}</p>
              {flow.kind === "competition" && (
                <div className="competition-rubric">
                  <div>
                    <strong>50%</strong>
                    <span>Reasoning</span>
                  </div>
                  <div>
                    <strong>30%</strong>
                    <span>Risk awareness</span>
                  </div>
                  <div>
                    <strong>20%</strong>
                    <span>Reflection</span>
                  </div>
                </div>
              )}
              <div className="demo-confirmation">
                Uses only your fictional demo profile. This is not an actual
                entry, booking or prize application.
              </div>
              <Button onClick={() => setStep(1)}>
                Continue to{" "}
                {flow.kind === "competition" ? "challenge entry" : "RSVP"}{" "}
                <Icon name="arrow" size={17} />
              </Button>
            </>
          ) : (
            <>
              <p>
                <strong>{flow.item.title}</strong>
              </p>
              <p className="muted">{flow.item.timing}</p>
              <label className="field">
                Demo participant
                <input
                  value={`${state.profile.name || "Alex"} · @${state.profile.handle || "nova"}`}
                  readOnly
                />
              </label>
              {flow.kind === "competition" && (
                <label className="field">
                  What will you focus on?
                  <select
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                  >
                    <option value="">Choose a learning focus</option>
                    <option>Diversification and risk awareness</option>
                    <option>Explaining decisions with evidence</option>
                    <option>Comparing long-term strategies</option>
                  </select>
                </label>
              )}
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  I understand this is a simulated registration using a
                  fictional account, with no real prize or booking.
                </span>
              </label>
              <div className="modal-actions">
                <Button variant="secondary" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button
                  disabled={
                    !agreed || (flow.kind === "competition" && !reflection)
                  }
                  onClick={register}
                >
                  Confirm demo {flow.kind === "competition" ? "entry" : "RSVP"}
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}

function useRoster(state) {
  return useMemo(
    () =>
      sampleRoster
        .map((p) =>
          p.id === "you"
            ? {
                ...p,
                name: `${state.profile.name || "Alex"} · you`,
                stars: state.stars,
                completed: state.completed?.length || 0,
                progress: Math.min(
                  100,
                  Math.round(
                    ((state.completed?.length || 0) * 7 +
                      Object.values(state.mastery || {}).filter(
                        (x) => x === true || x?.lastCorrect || x?.mastered,
                      ).length) *
                      4,
                  ),
                ),
              }
            : p,
        )
        .sort((a, b) => b.stars - a.stars),
    [state.stars, state.completed, state.mastery, state.profile.name],
  );
}
function AssignmentCards({ assignments, navigate, empty = true }) {
  return assignments.length ? (
    <div className="assignment-list">
      {assignments.map((a) => (
        <article
          key={a.id}
          className={`assignment-card ${a.status === "complete" ? "assignment-complete" : ""}`}
        >
          <div className="assignment-icon">
            <Icon
              name={
                a.type?.includes("Simulator")
                  ? "chart"
                  : a.type === "Test"
                    ? "shield"
                    : "book"
              }
              size={23}
            />
          </div>
          <div className="assignment-copy">
            <div className="row gap-sm">
              <span className="eyebrow">{a.type}</span>
              <Badge tone={a.status === "complete" ? "green" : "blue"}>
                {a.status === "complete" ? "Completed" : "Assigned"}
              </Badge>
            </div>
            <h3>{a.title}</h3>
            <p>
              {a.instructions ||
                "Complete the activity and review your learning."}
            </p>
            <span className="assignment-due">
              <Icon name="calendar" size={14} /> Due {a.due || "Nov 20, 2026"}
            </span>
          </div>
          <Button
            variant={a.status === "complete" ? "secondary" : "primary"}
            onClick={() => launchAssignment(a, navigate)}
          >
            {a.status === "complete" ? "Review" : "Start"}
            <Icon name="arrow" size={16} />
          </Button>
        </article>
      ))}
    </div>
  ) : empty ? (
    <EmptyState
      title="You’re all caught up"
      action={
        <Button onClick={() => navigate("learn")}>Explore your pathways</Button>
      }
    >
      New activities from your teacher will appear here. Keep following your own
      learning goals in the meantime.
    </EmptyState>
  ) : null;
}

export function Classroom() {
  const { state, setState, navigate, toast } = useApp(),
    roster = useRoster(state);
  const [tab, setTab] = useState("Assignments"),
    [student, setStudent] = useState(null),
    [code, setCode] = useState(""),
    [error, setError] = useState(""),
    [showScoring, setShowScoring] = useState(false);
  const assignments = state.assignments || [],
    completed = assignments.filter((a) => a.status === "complete").length;
  const join = () => {
    if (code.trim().toUpperCase() !== joinCode) {
      setError(
        "Try the demo code NOVA24. Class codes contain six letters or numbers.",
      );
      return;
    }
    setState((s) => ({ ...s, profile: { ...s.profile, joined: true } }));
    toast("Welcome to the NOVA Business Lab demo class");
  };
  if (!state.profile.joined)
    return (
      <div>
        <PageTitle
          eyebrow="LEARN TOGETHER"
          title="Big ideas belong in a classroom."
        >
          Join your teacher’s space for shared activities and a little friendly
          motivation.
        </PageTitle>
        <section className="class-join card">
          <div className="class-large-icon">
            <Icon name="users" size={46} />
          </div>
          <h2>Your next chapter, together.</h2>
          <p>
            Enter your teacher’s class code. For this prototype, use{" "}
            <strong>NOVA24</strong>.
          </p>
          <label className="field">
            Class code
            <input
              placeholder="NOVA24"
              maxLength={12}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              autoCapitalize="characters"
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <Button onClick={join}>
            Join demo class <Icon name="arrow" size={17} />
          </Button>
          <p className="muted small">
            Independent pathways stay available. No school account is required.
          </p>
        </section>
      </div>
    );
  return (
    <div className="classroom-screen">
      <PageTitle
        eyebrow="YOUR LEARNING CREW"
        title="Good things grow together."
        action={
          <Button variant="secondary" onClick={() => navigate("teacher")}>
            <Icon name="users" size={17} /> Teacher demo
          </Button>
        }
      >
        Your private classroom space. Learn at your own pace and celebrate each
        step.
      </PageTitle>
      <section className="class-banner">
        <div className="class-banner-symbol">
          <Icon name="users" size={36} />
        </div>
        <div>
          <Badge tone="blue">PRIVATE DEMO CLASS</Badge>
          <h2>NOVA Business Lab</h2>
          <p>Maple Grove Secondary · Grade 10 Business · Ms. Taylor</p>
        </div>
        <div className="class-banner-stat">
          <strong>
            {completed}/{assignments.length}
          </strong>
          <span>your tasks complete</span>
        </div>
      </section>
      <CommunityTabs
        items={["Assignments", "Leaderboard"]}
        value={tab}
        onChange={setTab}
        label="Classroom sections"
      />
      {tab === "Assignments" ? (
        <>
          <div className="community-section-title">
            <div>
              <span className="eyebrow">A LITTLE FOCUS GOES A LONG WAY</span>
              <h2>Your assigned activities</h2>
            </div>
            <span className="muted small">
              {assignments.length - completed} to go
            </span>
          </div>
          <AssignmentCards assignments={assignments} navigate={navigate} />
        </>
      ) : (
        <>
          <div className="community-section-title">
            <div>
              <span className="eyebrow">CELEBRATE THE LEARNING</span>
              <h2>Class leaderboard</h2>
            </div>
            <button className="text-link" onClick={() => setShowScoring(true)}>
              How scoring works <Icon name="info" size={15} />
            </button>
          </div>
          <div className="leaderboard-podium">
            {roster.slice(0, 3).map((p, i) => (
              <div className={`podium-person podium-${i + 1}`} key={p.id}>
                <span className={`roster-avatar avatar-${p.color}`}>
                  {i === 0 && (
                    <span className="podium-crown">
                      <Icon name="crown" size={25} />
                    </span>
                  )}
                  {p.initials}
                </span>
                <strong>{p.name}</strong>
                <span className="podium-star">✦ {fmt(p.stars)}</span>
                <span className="podium-rank">{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="card leaderboard-table">
            {roster.map((p, i) => (
              <button
                key={p.id}
                className={`leaderboard-row ${p.id === "you" ? "leaderboard-you" : ""}`}
                onClick={() =>
                  p.id === "you"
                    ? setStudent(p)
                    : toast(
                        "Classmates’ individual learning details are private. Teachers can use the private teacher demo.",
                      )
                }
              >
                <strong className="rank-number">{i + 1}</strong>
                <span className={`mini-avatar avatar-${p.color}`}>
                  {p.initials}
                </span>
                <span className="leaderboard-name">
                  {p.name}
                  <small>{p.completed} pathways completed</small>
                </span>
                <span className="podium-star">✦ {fmt(p.stars)}</span>
                <Icon name="chevron" size={16} />
              </button>
            ))}
          </div>
          <p className="muted small">
            Fictional display names. Visible only within this sample class.
            Learning progress earns Stars; trading returns and promotional
            clicks do not.
          </p>
        </>
      )}
      {showScoring && (
        <Modal
          title="Progress is the point."
          onClose={() => setShowScoring(false)}
        >
          <p>
            Class rank uses <strong>earned NOVA Stars</strong>, which reflect
            completed lessons, assignments and learning milestones.
          </p>
          <ul className="plain-detail-list">
            <li>Stocks showcase lesson: 50 Stars, once.</li>
            <li>
              Assignment completion: 25 Stars per assigned activity, once.
            </li>
            <li>Risk reasoning and account comparison: 25 Stars each, once.</li>
            <li>Selected investment nodes: 100 Stars, once per node.</li>
            <li>Types of Investments medal: 700 Stars, once.</li>
            <li>Sandbox money and stock returns never affect class rank.</li>
            <li>Sponsored clicks and registrations never earn Stars.</li>
          </ul>
          <p className="muted small">
            The other classmates’ progress is seeded fictional demo data. Your
            row updates from actual local activity.
          </p>
          <Button onClick={() => setShowScoring(false)}>Got it</Button>
        </Modal>
      )}
      {student && (
        <Modal title="Your learning snapshot" onClose={() => setStudent(null)}>
          <div className="row gap-sm">
            <span className={`roster-avatar avatar-sky`}>
              {student.initials}
            </span>
            <div>
              <h3>@{state.profile.handle || "nova"}</h3>
              <p className="muted">Private demo learning profile</p>
            </div>
          </div>
          <div className="community-metrics">
            <div>
              <strong>{fmt(state.stars)}</strong>
              <span>earned Stars</span>
            </div>
            <div>
              <strong>{state.completed?.length || 0}</strong>
              <span>pathways complete</span>
            </div>
            <div>
              <strong>{completed}</strong>
              <span>tasks complete</span>
            </div>
          </div>
          <Button
            onClick={() => {
              setStudent(null);
              navigate("learn");
            }}
          >
            Continue learning <Icon name="arrow" size={16} />
          </Button>
        </Modal>
      )}
    </div>
  );
}

const toolkitResources = [
  {
    id: "curriculum",
    icon: "book",
    title: "Curriculum connections",
    subtitle: "Sample Ontario business & economics mapping",
    content: (
      <>
        <p>
          This is an illustrative teaching map, not an official curriculum
          alignment or ministry endorsement.
        </p>
        <div className="toolkit-map">
          <article>
            <strong>Financial literacy & personal finance</strong>
            <p>
              Money goals, account comparisons, fees, saving and borrowing.
              Activity: compare the five generic account types and justify a
              choice.
            </p>
          </article>
          <article>
            <strong>Business ownership & markets</strong>
            <p>
              Share ownership, capital, risk and market behaviour. Activity:
              Basics of Stocks plus the recession simulator reflection.
            </p>
          </article>
          <article>
            <strong>Economics & decision-making</strong>
            <p>
              Inflation, opportunity cost, taxation assumptions and uncertainty.
              Activity: compare real purchasing power with nominal simulation
              results.
            </p>
          </article>
          <article>
            <strong>Digital citizenship & critical thinking</strong>
            <p>
              Sources, sponsorship, persuasion and fraud warning signs.
              Activity: annotate a fictional financial-influencer post.
            </p>
          </article>
        </div>
      </>
    ),
  },
  {
    id: "plan",
    icon: "calendar",
    title: "A lesson that fits your period",
    subtitle: "50-minute sample lesson plan",
    content: (
      <ol className="plain-detail-list">
        <li>
          <strong>0–5 min · Start with a claim.</strong> Ask, “Does owning a
          stock guarantee income?” Collect predictions without scoring.
        </li>
        <li>
          <strong>5–15 min · Explore.</strong> Play the captioned explainer and
          pause to explain ownership in students’ own words.
        </li>
        <li>
          <strong>15–30 min · Practise.</strong> Students answer four question
          formats and review feedback.
        </li>
        <li>
          <strong>30–42 min · Apply.</strong> Make a single sandbox trade and
          compare the next-day outcome with a prediction.
        </li>
        <li>
          <strong>42–50 min · Reflect.</strong> Explain one risk and one
          source-checking habit. Review class gaps before the next lesson.
        </li>
      </ol>
    ),
  },
  {
    id: "guide",
    icon: "lightbulb",
    title: "Student activity guide",
    subtitle: "Discussion prompts & accessible alternatives",
    content: (
      <>
        <p>
          Pair students as “decision maker” and “risk checker,” then switch
          roles. Offer the chart’s data table and lesson transcript as equal
          ways to participate.
        </p>
        <ol className="plain-detail-list">
          <li>
            Explain the difference between a share and a loan using a small
            business example.
          </li>
          <li>
            Write a prediction before a market event. Record what actually
            happened and what you cannot infer from one day.
          </li>
          <li>
            Compare cash and margin exposure. Identify who bears a loss and why
            borrowing changes the risk.
          </li>
          <li>
            Check a post’s author, publication date, evidence and compensation
            disclosure.
          </li>
          <li>Exit ticket: “My next learning step is ___ because ___.”</li>
        </ol>
        <p>
          No student needs a real bank account, financial details or personal
          social-media profile.
        </p>
      </>
    ),
  },
];
const tutorialChapters = [
  {
    title: "1. Welcome & class setup",
    time: "0:00",
    text: "Welcome to the NOVA teacher demo. Open your sample class, copy code NOVA24, and invite a learner through the Join a Class route. All identities in this prototype are fictional and saved only on this device.",
  },
  {
    title: "2. Assign a meaningful activity",
    time: "1:20",
    text: "Choose Assign activity. Select a lesson, pathway, quiz, checkpoint test or simulator task. Add a due date and clear student-facing instructions. Preview the task, then publish it to the demo class. It appears immediately in the student classroom.",
  },
  {
    title: "3. Read progress with context",
    time: "3:05",
    text: "Class progress combines labelled fictional class data with your current demo learner’s activity. Use mastery gaps to plan a short review, rather than treating a wrong first answer as a fixed ability. Individual drill-downs are available in teacher mode only.",
  },
  {
    title: "4. Project the simulator",
    time: "4:40",
    text: "Use the stock simulator as a group decision exercise. The opening wallet contains 5,000 simulated Stars, separate from earned NOVA Stars. Ask for a prediction, place a small trade, advance one day, and discuss the event. Profit alone is not a learning score.",
  },
  {
    title: "5. Reflect & plan a workshop",
    time: "6:15",
    text: "Collect classroom feedback and open the workshop planning preview. Discuss timing, accessibility and the learning objective. No booking or message is sent from this prototype. Use the student activity guide for a follow-up discussion.",
  },
];

export function Teacher() {
  const { state, setState, navigate, toast } = useApp(),
    roster = useRoster(state);
  const [tab, setTab] = useState("Overview"),
    [editor, setEditor] = useState(false),
    [assignmentIndex, setAssignmentIndex] = useState(0),
    [due, setDue] = useState("2026-11-20"),
    [instructions, setInstructions] = useState(
      assignmentOptions[0].description,
    ),
    [preview, setPreview] = useState(false),
    [error, setError] = useState(""),
    [student, setStudent] = useState(null),
    [resource, setResource] = useState(null),
    [video, setVideo] = useState(false),
    [chapter, setChapter] = useState(0),
    [workshop, setWorkshop] = useState(false),
    [bookingStep, setBookingStep] = useState(0),
    [feedback, setFeedback] = useState(false),
    [feedbackText, setFeedbackText] = useState(""),
    [feedbackRating, setFeedbackRating] = useState("Useful"),
    [feedbackSent, setFeedbackSent] = useState(false),
    [workshopDate, setWorkshopDate] = useState("2026-11-25"),
    [feedbackError, setFeedbackError] = useState("");
  const assignments = state.assignments || [],
    studentComplete = assignments.filter((a) => a.status === "complete").length;
  const selected = assignmentOptions[assignmentIndex];
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      toast("Class code NOVA24 copied");
    } catch {
      toast("Demo class code: NOVA24. Select and copy it from the class card.");
    }
  };
  const newAssignment = () => {
    setAssignmentIndex(0);
    setInstructions(assignmentOptions[0].description);
    setDue("2026-11-20");
    setPreview(false);
    setError("");
    setEditor(true);
  };
  const publish = () => {
    if (!due || !instructions.trim()) {
      setError("Add a due date and student instructions.");
      setPreview(false);
      return;
    }
    const item = {
      id: `assignment-${Date.now()}`,
      title: selected.title,
      type: selected.type,
      target: selected.target,
      due,
      instructions: instructions.trim(),
      status: "assigned",
    };
    setState((s) => ({
      ...s,
      assignments: [...s.assignments, item],
      events: [
        ...(s.events || []),
        { type: "assignment-created", id: item.id, date: "2026-11-04" },
      ],
    }));
    setEditor(false);
    setTab("Assignments");
    toast("Activity assigned. It is now visible in the student demo.");
  };
  const learned = Object.values(state.mastery || {}).filter(
    (v) => v === true || v?.lastCorrect || v?.mastered,
  ).length;
  return (
    <div className="teacher-screen">
      <PageTitle
        eyebrow="TEACHER DEMO · MS. TAYLOR"
        title="Make room for their next bright idea."
        action={
          <Button
            variant="secondary"
            onClick={() => {
              setState((s) => ({
                ...s,
                profile: { ...s.profile, joined: true },
              }));
              navigate("class");
            }}
          >
            <Icon name="arrowLeft" size={16} /> Student demo
          </Button>
        }
      >
        A practical classroom companion for confident conversations about money.
      </PageTitle>
      <section className="teacher-class-header card">
        <div className="row gap-sm">
          <span className="teacher-class-avatar">
            <Icon name="users" size={27} />
          </span>
          <div>
            <h2>NOVA Business Lab</h2>
            <p className="muted small">
              Maple Grove Secondary · Grade 10 Business · 5 fictional learners
            </p>
          </div>
        </div>
        <div className="class-code">
          <span className="eyebrow">CLASS JOIN CODE</span>
          <button onClick={copyCode} aria-label="Copy demo class code NOVA24">
            <strong>{joinCode}</strong>
            <Icon name="copy" size={17} />
          </button>
        </div>
        <Button onClick={newAssignment}>
          <Icon name="plus" size={17} /> Assign activity
        </Button>
      </section>
      <CommunityTabs
        items={["Overview", "Assignments", "Toolkit"]}
        value={tab}
        onChange={setTab}
        label="Teacher sections"
      />
      {tab === "Overview" && (
        <>
          <div className="teacher-metrics">
            <div className="card">
              <span className="metric-icon">
                <Icon name="users" />
              </span>
              <strong>5</strong>
              <span>demo learners</span>
              <small>Fictional classroom roster</small>
            </div>
            <div className="card">
              <span className="metric-icon">
                <Icon name="book" />
              </span>
              <strong>{assignments.length}</strong>
              <span>activities assigned</span>
              <small>Live local demo count</small>
            </div>
            <div className="card">
              <span className="metric-icon">
                <Icon name="check" />
              </span>
              <strong>
                {studentComplete}/{assignments.length}
              </strong>
              <span>your demo learner’s tasks</span>
              <small>Updates from completed flows</small>
            </div>
          </div>
          <div className="teacher-overview-grid">
            <section className="card padded">
              <div className="row spread">
                <h3>Learning signals</h3>
                <Badge tone="blue">Sample class + local activity</Badge>
              </div>
              <p className="muted small">
                Curated fictional aggregate gaps help demonstrate the teaching
                workflow.
              </p>
              {[
                {
                  title: "Prices can rise or fall",
                  score: 60,
                  detail: "2 of 5 sample learners would benefit from a review.",
                },
                {
                  title: "Ownership vs. lending",
                  score: 80,
                  detail:
                    "1 of 5 sample learners would benefit from a worked example.",
                },
                {
                  title: "Checking sponsored claims",
                  score: 40,
                  detail:
                    "3 of 5 sample learners would benefit from a guided discussion.",
                },
              ].map((g) => (
                <div className="mastery-gap" key={g.title}>
                  <div className="row spread">
                    <strong>{g.title}</strong>
                    <span>{g.score}%</span>
                  </div>
                  <Progress value={g.score} />
                  <small className="muted">{g.detail}</small>
                </div>
              ))}
              <div className="local-learning-signal">
                <Icon name="lightbulb" size={18} />
                <span>
                  Current demo learner: <strong>{learned}</strong> mastered
                  concepts from local activity.
                </span>
              </div>
            </section>
            <section className="teacher-tip">
              <span className="eyebrow">READY FOR YOUR NEXT CLASS?</span>
              <h3>A small question can open a big conversation.</h3>
              <p>
                Ask students: “A creator promises a guaranteed return. What
                would you check before you trust them?”
              </p>
              <Button variant="secondary" onClick={() => navigate("fraud")}>
                Preview media literacy <Icon name="arrow" size={16} />
              </Button>
              <div className="teacher-tip-art" aria-hidden="true">
                ✦ <span>?</span> ✧
              </div>
            </section>
          </div>
          <div className="community-section-title">
            <div>
              <span className="eyebrow">PRIVATE TO TEACHER DEMO</span>
              <h2>Class progress</h2>
            </div>
            <span className="muted small">Select a learner to inspect</span>
          </div>
          <div className="card class-progress-table">
            <div className="progress-table-head">
              <span>Learner</span>
              <span>Pathways</span>
              <span>Learning progress</span>
              <span>Stars</span>
            </div>
            {roster.map((p) => (
              <button
                className="progress-table-row"
                key={p.id}
                onClick={() => setStudent(p)}
              >
                <span className="row gap-sm">
                  <span className={`mini-avatar avatar-${p.color}`}>
                    {p.initials}
                  </span>
                  <strong>{p.name}</strong>
                </span>
                <span>{p.completed}</span>
                <span>
                  <Progress value={p.progress} />
                  <small>
                    {p.id === "you" ? "Local activity" : "Seeded sample"} ·{" "}
                    {p.progress}%
                  </small>
                </span>
                <span>
                  ✦ {fmt(p.stars)} <Icon name="chevron" size={14} />
                </span>
              </button>
            ))}
          </div>
        </>
      )}
      {tab === "Assignments" && (
        <>
          <div className="community-section-title">
            <div>
              <span className="eyebrow">GIVE LEARNING A DIRECTION</span>
              <h2>Class assignments</h2>
            </div>
            <Button variant="secondary" onClick={newAssignment}>
              <Icon name="plus" size={16} /> New activity
            </Button>
          </div>
          <p className="muted small">
            The status below reflects your current student demo. Other class
            responses are fictional sample data.
          </p>
          <AssignmentCards assignments={assignments} navigate={navigate} />
        </>
      )}
      {tab === "Toolkit" && (
        <>
          <div className="toolkit-intro">
            <span className="eyebrow">LESS PREP. MORE POSSIBILITY.</span>
            <h2>Your classroom toolkit</h2>
            <p>
              Ready-to-use sample resources for business, economics and
              media-literacy discussions.
            </p>
          </div>
          <div className="toolkit-grid">
            {toolkitResources.map((r) => (
              <button
                className="toolkit-card card"
                key={r.id}
                onClick={() => setResource(r)}
              >
                <span className="toolkit-icon">
                  <Icon name={r.icon} size={26} />
                </span>
                <h3>{r.title}</h3>
                <p>{r.subtitle}</p>
                <span className="text-link">
                  Open resource <Icon name="arrow" size={16} />
                </span>
              </button>
            ))}
            <button
              className="toolkit-card card"
              onClick={() => {
                setVideo(true);
                setChapter(0);
              }}
            >
              <span className="toolkit-icon toolkit-coral">
                <Icon name="play" size={26} />
              </span>
              <h3>The NOVA classroom walkthrough</h3>
              <p>Chaptered demo tutorial with a complete transcript</p>
              <span className="text-link">
                Explore 5 chapters <Icon name="arrow" size={16} />
              </span>
            </button>
            <button
              className="toolkit-card card"
              onClick={() => {
                setWorkshop(true);
                setBookingStep(0);
              }}
            >
              <span className="toolkit-icon toolkit-gold">
                <Icon name="calendar" size={26} />
              </span>
              <h3>Bring the conversation to school</h3>
              <p>Workshop planning details & booking preview</p>
              <span className="text-link">
                Plan a demo workshop <Icon name="arrow" size={16} />
              </span>
            </button>
            <button
              className="toolkit-card card"
              onClick={() => {
                setFeedback(true);
                setFeedbackSent(false);
                setFeedbackError("");
              }}
            >
              <span className="toolkit-icon toolkit-green">
                <Icon name="mail" size={26} />
              </span>
              <h3>Help shape the learning</h3>
              <p>A quick classroom feedback form, saved on this device</p>
              <span className="text-link">
                Share classroom feedback <Icon name="arrow" size={16} />
              </span>
            </button>
          </div>
        </>
      )}
      <div className="community-note">
        <Icon name="shield" size={19} />
        <p>
          School-board access is a proposed licensing route. This teacher space
          uses a sample entitlement with no billing, authentication or student
          identity verification.
        </p>
      </div>
      {editor && (
        <Modal
          title={
            preview ? "Preview student assignment" : "Assign a little progress"
          }
          onClose={() => setEditor(false)}
        >
          {preview ? (
            <>
              <Badge tone="blue">STUDENT PREVIEW · {selected.type}</Badge>
              <h3>{selected.title}</h3>
              <p>{instructions}</p>
              <div className="demo-confirmation">
                Due: {due}
                <br />
                Class: NOVA Business Lab
                <br />
                Completion will update your student demo’s classroom status.
              </div>
              <div className="modal-actions">
                <Button variant="secondary" onClick={() => setPreview(false)}>
                  Edit activity
                </Button>
                <Button onClick={publish}>
                  Assign to demo class <Icon name="check" size={16} />
                </Button>
              </div>
            </>
          ) : (
            <div className="stack">
              <label className="field">
                Activity
                <select
                  value={assignmentIndex}
                  onChange={(e) => {
                    const i = Number(e.target.value);
                    setAssignmentIndex(i);
                    setInstructions(assignmentOptions[i].description);
                  }}
                >
                  {assignmentOptions.map((a, i) => (
                    <option value={i} key={a.target}>
                      {a.type} · {a.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Due date
                <input
                  type="date"
                  value={due}
                  min="2026-11-04"
                  onChange={(e) => setDue(e.target.value)}
                />
              </label>
              <label className="field">
                Instructions for students
                <textarea
                  rows={4}
                  value={instructions}
                  maxLength={1000}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </label>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <Button
                onClick={() => {
                  if (!due || !instructions.trim()) {
                    setError("Add a due date and student instructions.");
                    return;
                  }
                  setPreview(true);
                }}
              >
                Preview assignment <Icon name="arrow" size={16} />
              </Button>
            </div>
          )}
        </Modal>
      )}
      {student && (
        <Modal
          title={`${student.name.replace(" · you", "")} · private progress`}
          onClose={() => setStudent(null)}
        >
          <Badge tone="blue">
            {student.id === "you"
              ? "Local student activity"
              : "Fictional sample record"}
          </Badge>
          <div className="community-metrics">
            <div>
              <strong>{student.completed}</strong>
              <span>pathways</span>
            </div>
            <div>
              <strong>{student.progress}%</strong>
              <span>learning progress</span>
            </div>
            <div>
              <strong>{fmt(student.stars)}</strong>
              <span>earned Stars</span>
            </div>
          </div>
          <h3>Next teaching step</h3>
          <p>
            {student.id === "you"
              ? learned
                ? "Build on the concepts practised so far. Ask the learner to explain ownership and risk in their own words."
                : "Start with the captioned Stocks explainer and one ownership question. Offer the transcript or a worked example as an alternative."
              : "This fictional learner benefits from a short source-checking discussion and a recap of why returns are uncertain."}
          </p>
          {student.id === "you" && (
            <>
              <h3>Assignment status</h3>
              {assignments.length ? (
                assignments.map((a) => (
                  <div className="private-assignment-row" key={a.id}>
                    <span>{a.title}</span>
                    <Badge tone={a.status === "complete" ? "green" : "blue"}>
                      {a.status === "complete" ? "Completed" : "Assigned"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="muted">No tasks assigned yet.</p>
              )}
            </>
          )}
          <p className="muted small">
            No real student records are used or transmitted.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setStudent(null);
              newAssignment();
            }}
          >
            Assign a next step <Icon name="arrow" size={16} />
          </Button>
        </Modal>
      )}
      {resource && (
        <Modal title={resource.title} onClose={() => setResource(null)}>
          <Badge tone="blue">Sample teaching resource</Badge>
          {resource.content}
          <Button
            variant="secondary"
            onClick={() => {
              const content =
                resource.id === "curriculum"
                  ? "Sample curriculum map: financial literacy, ownership and markets, economics and decision-making, digital citizenship."
                  : resource.id === "plan"
                    ? "50-minute lesson: 0–5 claim; 5–15 explainer; 15–30 practice; 30–42 simulation; 42–50 reflection."
                    : "Student guide: explain ownership; predict a market event; compare cash and margin; check a financial claim; write a next-step reflection.";
              const blob = new Blob(
                [
                  `NOVA Classroom Toolkit\n${resource.title}\n\n${content}\n\nIllustrative educational demo, not official curriculum alignment.`,
                ],
                { type: "text/plain" },
              );
              const url = URL.createObjectURL(blob),
                link = document.createElement("a");
              link.href = url;
              link.download = `nova-${resource.id}.txt`;
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
              toast("Sample resource downloaded");
            }}
          >
            <Icon name="download" size={16} /> Download sample notes
          </Button>
        </Modal>
      )}
      {video && (
        <Modal
          title="NOVA classroom walkthrough"
          onClose={() => setVideo(false)}
        >
          <Badge tone="gold">Chaptered demo · text-based tutorial</Badge>
          <p className="muted small">
            A structured preview of the planned in-depth video. Each chapter
            includes its full transcript; no video recording is hosted in this
            prototype.
          </p>
          <div className="tutorial-player">
            <Icon name="play" size={40} />
            <span>{tutorialChapters[chapter].time}</span>
            <h3>{tutorialChapters[chapter].title}</h3>
          </div>
          <div className="tutorial-chapters">
            {tutorialChapters.map((c, i) => (
              <button
                key={c.title}
                aria-pressed={chapter === i}
                className={chapter === i ? "active" : ""}
                onClick={() => setChapter(i)}
              >
                <span>{c.time}</span>
                {c.title}
              </button>
            ))}
          </div>
          <h3>Chapter transcript</h3>
          <p>{tutorialChapters[chapter].text}</p>
          <div className="modal-actions">
            <Button
              variant="secondary"
              disabled={chapter === 0}
              onClick={() => setChapter((v) => v - 1)}
            >
              Previous chapter
            </Button>
            <Button
              onClick={() =>
                chapter < 4 ? setChapter((v) => v + 1) : setVideo(false)
              }
            >
              {chapter < 4 ? "Next chapter" : "Finish tutorial"}
              <Icon name="arrow" size={16} />
            </Button>
          </div>
        </Modal>
      )}
      {workshop && (
        <Modal
          title={
            bookingStep === 2
              ? "Workshop plan saved"
              : "A workshop with room for questions"
          }
          onClose={() => setWorkshop(false)}
        >
          {bookingStep === 2 ? (
            <>
              <div className="registration-success">
                <span className="success-circle">
                  <Icon name="check" size={29} />
                </span>
                <h3>Your demo planning note is ready.</h3>
                <p>
                  Preferred date: {workshopDate}. A 60-minute beginner workshop
                  on stocks, diversification and financial-claim checks.
                </p>
                <p className="muted">
                  This preview is stored locally. No school, educator or
                  provider was contacted.
                </p>
                <Button onClick={() => setWorkshop(false)}>
                  Back to toolkit
                </Button>
              </div>
            </>
          ) : (
            <>
              <Badge tone="blue">School workshop · booking preview</Badge>
              <p>
                A sample 60-minute session for up to 30 learners: 10-minute
                introduction, 20-minute investing activity, 15-minute claim
                inspection and 15-minute discussion.
              </p>
              <ul className="plain-detail-list">
                <li>
                  Format: classroom or remote, with a projector-friendly demo.
                </li>
                <li>
                  Accessibility: captions, transcripts, data tables and paired
                  activities.
                </li>
                <li>
                  Safeguarding: school-hosted delivery, fictional accounts, no
                  product sales.
                </li>
                <li>
                  Guest educator, cost and availability require verification
                  before any real booking.
                </li>
              </ul>
              <label className="field">
                Preferred demo date
                <input
                  type="date"
                  min="2026-11-04"
                  value={workshopDate}
                  onChange={(e) => setWorkshopDate(e.target.value)}
                />
              </label>
              <Button
                disabled={!workshopDate}
                onClick={() => {
                  setState((s) => ({
                    ...s,
                    workshopPlan: {
                      date: workshopDate,
                      topic: "Stocks, risk and claim-checking",
                      status: "preview",
                    },
                  }));
                  setBookingStep(2);
                }}
              >
                Save planning preview <Icon name="check" size={16} />
              </Button>
            </>
          )}
        </Modal>
      )}
      {feedback && (
        <Modal
          title={
            feedbackSent
              ? "Thanks for the classroom perspective"
              : "What worked in your classroom?"
          }
          onClose={() => setFeedback(false)}
        >
          {feedbackSent ? (
            <>
              <div className="registration-success">
                <span className="success-circle">
                  <Icon name="check" size={29} />
                </span>
                <p>
                  Your feedback was saved to this device’s demo data. It has not
                  been sent to NOVA or anyone else.
                </p>
                <Button onClick={() => setFeedback(false)}>
                  Return to toolkit
                </Button>
              </div>
            </>
          ) : (
            <div className="stack">
              <label className="field">
                How useful was this demo?
                <select
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(e.target.value)}
                >
                  <option>Useful</option>
                  <option>Very useful</option>
                  <option>Needs improvement</option>
                </select>
              </label>
              <label className="field">
                What should we improve?
                <textarea
                  placeholder="Describe the activity or teaching support. Please leave out names and personal information."
                  rows={4}
                  maxLength={1000}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </label>
              {feedbackError && (
                <p className="form-error" role="alert">
                  {feedbackError}
                </p>
              )}
              <p className="muted small">
                Demo feedback stays on this device. Please use fictional
                examples.
              </p>
              <Button
                onClick={() => {
                  if (!feedbackText.trim()) {
                    setFeedbackError(
                      "Add a brief note so the feedback has useful context.",
                    );
                    return;
                  }
                  setState((s) => ({
                    ...s,
                    teacherFeedback: [
                      ...(s.teacherFeedback || []),
                      {
                        rating: feedbackRating,
                        text: feedbackText.trim(),
                        date: "2026-11-04",
                      },
                    ],
                  }));
                  setFeedbackSent(true);
                  setFeedbackText("");
                }}
              >
                Save demo feedback <Icon name="check" size={16} />
              </Button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
