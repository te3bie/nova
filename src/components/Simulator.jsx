import React, { useEffect, useState } from "react";
import { useApp } from "../store.jsx";
import { Icon, Button, Modal, Badge, PageTitle, EmptyState } from "./UI.jsx";
import {
  STOCKS,
  TICKERS,
  EVENTS,
  priceAt,
  money,
  portfolio,
  previewTrade,
  executeTrade,
  freshSimulation,
} from "../data/market.js";
import "./simulator.css";

const signed = (n) => `${n >= 0 ? "+" : "−"}${money(Math.abs(n))}`;
const ACCOUNT_DATA = {
  cash: {
    title: "Cash",
    icon: "wallet",
    subtitle: "Start with what you have",
    explanation:
      "Buy investments with money already in the account. You do not borrow to invest.",
    tradeoff:
      "Your buying power is limited to your available funds. Investments can still lose value.",
    fit: "First-time practice with a fixed balance.",
    poor: "A goal that specifically requires comparing the effects of borrowing.",
    example:
      "With 1,000 Stars, you can invest up to 1,000 Stars. A 10% fall leaves 900 Stars.",
  },
  margin: {
    title: "Margin",
    icon: "chart",
    subtitle: "Understand borrowed exposure",
    explanation:
      "Borrow from an institution to increase the amount you invest. Interest and lending conditions apply.",
    tradeoff:
      "Borrowing amplifies gains and losses. You can lose more than your original funds and may face a demand to add money.",
    fit: "An educational comparison of leverage, with a clear understanding of the risks.",
    poor: "A beginner seeking to avoid borrowing or someone who cannot absorb additional losses.",
    example:
      "Invest 1,000 Stars plus 1,000 borrowed Stars. A 10% fall leaves 1,800; after repaying 1,000, only 800 of your money remains, before interest.",
  },
  retirement: {
    title: "Retirement",
    icon: "leaf",
    subtitle: "Think in decades",
    explanation:
      "An account category intended for a long-term retirement goal. The investments inside still determine much of the risk.",
    tradeoff:
      "Tax treatment, contribution limits and withdrawal restrictions depend on the actual product and eligibility.",
    fit: "Exploring how consistent long-term saving and a long time horizon work together.",
    poor: "Money you need soon for a car or school expenses.",
    example:
      "Regular contributions and a long time horizon allow time for compounding, but returns are not guaranteed.",
  },
  joint: {
    title: "Joint",
    icon: "users",
    subtitle: "Share responsibility",
    explanation:
      "Two or more account holders share ownership or control under the account agreement.",
    tradeoff:
      "Access, responsibilities and what happens if holders disagree depend on the agreement.",
    fit: "Learning to agree on shared goals, contributions and decisions.",
    poor: "Someone who needs sole control or does not trust the other account holder.",
    example:
      "Two fictional siblings set a shared 1,000-Star goal and agree on who can make decisions.",
  },
  custodial: {
    title: "Custodial",
    icon: "shield",
    subtitle: "Learn with adult support",
    explanation:
      "An adult manages assets for a minor under the applicable arrangement.",
    tradeoff:
      "Control, ownership and when management transfers depend on local rules and the account structure.",
    fit: "Learning about investments with a responsible adult managing the arrangement.",
    poor: "Someone expecting immediate, unrestricted personal control.",
    example:
      "A fictional adult explains investment decisions to a learner while managing the assets on their behalf.",
  },
};
const SCENARIOS = [
  {
    id: "first",
    title: "My first practice account",
    description:
      "You have 1,000 practice Stars and want to invest only what you already have, without borrowing.",
    answer: "cash",
    hint: "Focus on available funds and avoiding debt.",
  },
  {
    id: "borrow",
    title: "Compare borrowed exposure",
    description:
      "You want to model how investing borrowed funds changes both gains and losses. This is a risk comparison, not an account recommendation.",
    answer: "margin",
    hint: "Which category introduces borrowing and amplified losses?",
  },
  {
    id: "future",
    title: "Plan for a distant future",
    description:
      "You are exploring a goal several decades away and want to understand an account category designed around retirement.",
    answer: "retirement",
    hint: "Match the purpose and time horizon. Real eligibility still needs checking.",
  },
  {
    id: "together",
    title: "Share a responsibility",
    description:
      "Two fictional adult learners want shared ownership and agree to make account decisions together.",
    answer: "joint",
    hint: "Look for shared control and a clear agreement.",
  },
  {
    id: "support",
    title: "Learn with adult support",
    description:
      "A minor is learning while a responsible adult manages assets on their behalf under an eligible arrangement.",
    answer: "custodial",
    hint: "Who manages the assets while the learner is a minor?",
  },
];
function Guide() {
  return (
    <svg
      className="account-guide"
      viewBox="0 0 170 190"
      role="img"
      aria-label="Illustrated NOVA learning guide holding an account comparison"
    >
      <circle cx="85" cy="92" r="76" fill="#d8eeff" />
      <path d="M26 173c4-43 29-52 57-52s57 14 61 52" fill="#2765de" />
      <rect x="70" y="108" width="30" height="30" rx="12" fill="#d49c7b" />
      <ellipse cx="85" cy="78" rx="37" ry="44" fill="#efbd98" />
      <path
        d="M49 83c-12-61 70-81 76-22 2 10-2 23-4 26l-7-29c-18 13-34 1-42-2l-17 29"
        fill="#172f56"
      />
      <circle cx="72" cy="80" r="3" fill="#1b3056" />
      <circle cx="99" cy="80" r="3" fill="#1b3056" />
      <path
        d="M76 99q11 9 22-1"
        fill="none"
        stroke="#9c5e49"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M68 136l17 17 18-17" fill="white" />
      <rect
        x="49"
        y="153"
        width="74"
        height="36"
        rx="6"
        fill="#fff"
        stroke="#99c9ef"
      />
      <path d="M62 163h46m-46 8h30m-30 8h39" stroke="#7aa9dc" strokeWidth="3" />
      <path d="M22 55l4-10 4 10 10 4-10 4-4 10-4-10-10-4z" fill="#efbe49" />
    </svg>
  );
}

export default function Simulator() {
  const { state } = useApp();
  const [tab, setTab] = useState(
    state.payload?.tab === "accounts" ? "accounts" : "stocks",
  );
  useEffect(() => {
    if (state.payload?.tab)
      setTab(state.payload.tab === "accounts" ? "accounts" : "stocks");
  }, [state.payload?.tab]);
  return (
    <div className="simulator-page">
      <PageTitle
        eyebrow="LEARN BY DOING"
        title="A little practice. A brighter future."
      >
        Try an idea, see what happens, and build your confidence.
      </PageTitle>
      <div className="sim-tabs" aria-label="Simulator">
        <button
          className={tab === "stocks" ? "active" : ""}
          onClick={() => setTab("stocks")}
        >
          <Icon name="chart" />
          Stock market
        </button>
        <button
          className={tab === "accounts" ? "active" : ""}
          onClick={() => setTab("accounts")}
        >
          <Icon name="wallet" />
          Investment accounts
        </button>
      </div>
      {tab === "stocks" ? <StockSimulator /> : <AccountSimulator />}
    </div>
  );
}
function StockSimulator() {
  const { state, setState, award, completeTask, toast } = useApp();
  const sim = state.sim || freshSimulation(),
    p = portfolio(sim);
  const [visible, setVisible] = useState(TICKERS),
    [point, setPoint] = useState(sim.day),
    [table, setTable] = useState(false),
    [order, setOrder] = useState(null),
    [ticker, setTicker] = useState("AAPL"),
    [quantity, setQuantity] = useState("1"),
    [error, setError] = useState(""),
    [preview, setPreview] = useState(false),
    [reset, setReset] = useState(false),
    [debrief, setDebrief] = useState(false),
    [reason, setReason] = useState(""),
    [benchmark, setBenchmark] = useState(""),
    [reflectionDone, setReflectionDone] = useState(false);
  const start = Math.max(0, sim.day - 4),
    days = Array.from({ length: 5 }, (_, i) => start + i),
    selected = days.includes(point) ? point : sim.day;
  const latest = EVENTS[sim.day];
  const tradePreview = order
    ? previewTrade(sim, order, ticker, quantity)
    : null;
  const maxShares =
    order === "buy"
      ? Math.floor(p.cash / priceAt(ticker, sim.day))
      : p.holdings[ticker].quantity;
  function openOrder(side, stock) {
    setOrder(side);
    setTicker(stock || "AAPL");
    setQuantity("1");
    setError("");
    setPreview(false);
  }
  function confirmTrade() {
    const r = executeTrade(sim, order, ticker, quantity);
    if (r.error) {
      setError(r.error);
      setPreview(false);
      return;
    }
    setState((s) => ({
      ...s,
      sim: r.sim,
      events: [
        ...(s.events || []),
        { type: "simulated_trade", side: order, ticker, day: sim.day },
      ],
    }));
    toast(
      `${order === "buy" ? "Purchased" : "Sold"} ${r.trade.quantity} ${ticker} ${r.trade.quantity === 1 ? "share" : "shares"} in the demo.`,
    );
    setOrder(null);
  }
  function advance() {
    const next = Math.min(13, sim.day + 1);
    setState((s) => ({ ...s, sim: { ...s.sim, day: next } }));
    setPoint(next);
    toast(EVENTS[next].title);
  }
  function reflect() {
    if (reason !== "diversify" || benchmark !== "uncertain") {
      toast("Review both explanations and try again.");
      return;
    }
    setReflectionDone(true);
    award(
      "simulation-risk-reflection",
      25,
      "Identified concentration risk and an unrealistic return benchmark",
    );
    if (
      sim.trades.some((t) => t.side === "buy") &&
      sim.trades.some((t) => t.side === "sell") &&
      sim.day > 4
    ) {
      completeTask("stock-simulator");
    }
    toast(
      "Risk reflection complete. Your learning, not your trading profit, earns Stars.",
    );
  }
  return (
    <>
      <div className="sim-wallet card">
        <div>
          <div className="row gap-sm">
            <Badge tone="blue">SIMULATED MARKET</Badge>
            <span className="small muted">No real money. No live prices.</span>
          </div>
          <h2>Your ideas. A safe place to try them.</h2>
          <p className="muted">
            A separate trading wallet starts with 5,000 Stars. Trades never
            change your earned NOVA Stars.
          </p>
        </div>
        <div className="sim-wallet-total">
          <span>Portfolio value</span>
          <strong>
            {money(p.value)} <span>★</span>
          </strong>
          <small className={p.profit >= 0 ? "sim-positive" : "sim-negative"}>
            {signed(p.profit)} Stars ({signed(p.returnPct)}%)
            <br />
            since 5,000-Star opening balance
          </small>
        </div>
      </div>
      <div className="sim-metrics">
        <div className="card">
          <Icon name="wallet" />
          <span>Available cash</span>
          <strong>
            {money(p.cash)} <small>★</small>
          </strong>
        </div>
        <div className="card">
          <Icon name="chart" />
          <span>Holdings value</span>
          <strong>
            {money(p.holdingsValue)} <small>★</small>
          </strong>
        </div>
        <div className="card">
          <Icon name="target" />
          <span>Unrealised return</span>
          <strong
            className={p.unrealised >= 0 ? "sim-positive" : "sim-negative"}
          >
            {signed(p.unrealised)} <small>★</small>
          </strong>
        </div>
        <div className="card">
          <Icon name="check" />
          <span>Realised, before tax</span>
          <strong className={p.realised >= 0 ? "sim-positive" : "sim-negative"}>
            {signed(p.realised)} <small>★</small>
          </strong>
        </div>
      </div>
      <section className="card padded sim-market">
        <div className="row spread">
          <div>
            <span className="eyebrow">YOUR MARKET WINDOW</span>
            <h2>Three companies. Five days.</h2>
          </div>
          <Badge tone="gray">Day {sim.day + 1} of 14</Badge>
        </div>
        <p className="small muted">
          Indexed to 100 at the first visible day so different prices are
          comparable. Fictional series • {EVENTS[start].date} to {latest.date}.
        </p>
        <div className="sim-chart-legend">
          {TICKERS.map((t) => (
            <button
              key={t}
              aria-pressed={visible.includes(t)}
              onClick={() =>
                setVisible((v) =>
                  v.includes(t) ? v.filter((x) => x !== t) : [...v, t],
                )
              }
            >
              <span
                className={`sim-legend-symbol ${STOCKS[t].shape}`}
                style={{
                  background: STOCKS[t].color,
                  opacity: visible.includes(t) ? 1 : 0.25,
                }}
              />
              {STOCKS[t].name}
              <span className="muted">{t}</span>
            </button>
          ))}
        </div>
        <svg
          className="sim-chart"
          viewBox="0 0 800 255"
          role="img"
          aria-label={`Five-day indexed share prices. Selected ${EVENTS[selected].date}. Use day controls or the accessible price table below.`}
        >
          {[80, 90, 100, 110, 120].map((n) => (
            <g key={n}>
              <line
                x1="48"
                x2="770"
                y1={218 - (n - 80) * 4.65}
                y2={218 - (n - 80) * 4.65}
                stroke="#e6eef5"
                strokeDasharray={n === 100 ? "0" : "4 5"}
              />
              <text
                x="35"
                y={222 - (n - 80) * 4.65}
                textAnchor="end"
                fill="#7a8a9f"
                fontSize="12"
              >
                {n}
              </text>
            </g>
          ))}
          {visible.map((t) => {
            const points = days
              .map(
                (d, i) =>
                  `${60 + i * 174},${218 - ((priceAt(t, d) / priceAt(t, start)) * 100 - 80) * 4.65}`,
              )
              .join(" ");
            return (
              <g key={t}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={STOCKS[t].color}
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {days.map((d, i) => {
                  const x = 60 + i * 174,
                    y =
                      218 -
                      ((priceAt(t, d) / priceAt(t, start)) * 100 - 80) * 4.65;
                  return STOCKS[t].shape === "square" ? (
                    <rect
                      key={d}
                      x={x - 4}
                      y={y - 4}
                      width="8"
                      height="8"
                      fill={STOCKS[t].color}
                    />
                  ) : STOCKS[t].shape === "triangle" ? (
                    <path
                      key={d}
                      d={`M${x} ${y - 5}l5 9h-10z`}
                      fill={STOCKS[t].color}
                    />
                  ) : (
                    <circle
                      key={d}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={STOCKS[t].color}
                    />
                  );
                })}
              </g>
            );
          })}
          <line
            x1={60 + (selected - start) * 174}
            x2={60 + (selected - start) * 174}
            y1="20"
            y2="222"
            stroke="#6984a5"
            strokeDasharray="3 5"
          />
          {days.map((d, i) => (
            <text
              key={d}
              x={60 + i * 174}
              y="247"
              textAnchor="middle"
              fill="#69798e"
              fontSize="12"
            >
              Day {d + 1}
            </text>
          ))}
        </svg>
        {!visible.length && (
          <p className="sim-chart-empty">
            Choose a company above to show its line.
          </p>
        )}
        <div className="sim-day-buttons" aria-label="Select a day">
          {days.map((d) => (
            <button
              key={d}
              aria-pressed={selected === d}
              className={selected === d ? "active" : ""}
              onClick={() => setPoint(d)}
            >
              Day {d + 1}
            </button>
          ))}
        </div>
        <div className="sim-selected" aria-live="polite">
          <span>
            <Icon name="calendar" /> {EVENTS[selected].date}
          </span>
          {TICKERS.map((t) => (
            <span key={t}>
              <b>{t}</b> {money(priceAt(t, selected))} ★
            </span>
          ))}
        </div>
        <div className="row spread sim-chart-actions">
          <Button
            variant="ghost"
            onClick={() => setTable(!table)}
            aria-expanded={table}
          >
            {table ? "Hide" : "Show"} accessible price table
          </Button>
          <Button onClick={advance} disabled={sim.day === 13}>
            Advance Day <Icon name="arrow" />
          </Button>
        </div>
        {table && (
          <div className="sim-table-wrap">
            <table className="sim-table">
              <caption>
                Fictional prices in trading Stars, not indexed values
              </caption>
              <thead>
                <tr>
                  <th scope="col">Date / day</th>
                  {TICKERS.map((t) => (
                    <th key={t} scope="col">
                      {STOCKS[t].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d}>
                    <th scope="row">
                      {EVENTS[d].date} / {d + 1}
                    </th>
                    {TICKERS.map((t) => (
                      <td key={t}>{money(priceAt(t, d))}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <div className="sim-stock-grid">
        {TICKERS.map((t) => {
          const price = priceAt(t, sim.day),
            previous = priceAt(t, Math.max(0, sim.day - 1)),
            change = price - previous,
            overall = price - priceAt(t, 0);
          return (
            <article className="card padded sim-stock-card" key={t}>
              <div className="row spread">
                <div className="row gap-sm">
                  <span
                    className="sim-ticker-avatar"
                    style={{
                      color: STOCKS[t].color,
                      background: STOCKS[t].color + "12",
                    }}
                  >
                    {t === "AAPL" ? "A" : t === "TSLA" ? "T" : "M"}
                  </span>
                  <div>
                    <h3>{STOCKS[t].name}</h3>
                    <span className="small muted">{t} · Demo</span>
                  </div>
                </div>
                <Badge tone="gray">{p.holdings[t].quantity} shares</Badge>
              </div>
              <strong className="sim-stock-price">
                {money(price)} <small>★ / share</small>
              </strong>
              <span
                className={`small ${change >= 0 ? "sim-positive" : "sim-negative"}`}
              >
                {signed(change)} ({signed((change / previous) * 100)}%) vs
                previous day
              </span>
              <p className="small muted">
                Series return: {signed(overall)} ★ / share (
                {signed((overall / priceAt(t, 0)) * 100)}%) vs Day 1
              </p>
              <div className="sim-stock-controls">
                <Button variant="secondary" onClick={() => openOrder("buy", t)}>
                  Purchase
                </Button>
                <Button variant="ghost" onClick={() => openOrder("sell", t)}>
                  Sell
                </Button>
              </div>
            </article>
          );
        })}
      </div>
      <section className="card padded sim-news">
        <div className="sim-news-icon">
          <Icon name="globe" size={25} />
        </div>
        <div>
          <div className="row gap-sm">
            <span className="eyebrow">MARKET EVENT</span>
            <Badge tone="gray">Fictional news • {latest.date}</Badge>
          </div>
          <h3>{latest.title}</h3>
          <p>{latest.description}</p>
          <details>
            <summary>Previous market events</summary>
            {EVENTS.slice(0, sim.day)
              .reverse()
              .map((e) => (
                <p className="small" key={e.day}>
                  <b>
                    {e.date} · {e.title}
                  </b>
                  <br />
                  {e.description}
                </p>
              ))}
          </details>
        </div>
      </section>
      <section className="card padded sim-challenge">
        <div className="row spread">
          <div>
            <span className="eyebrow">THE RECESSION CHALLENGE</span>
            <h2>Can you explain your decisions?</h2>
          </div>
          <Icon name="shield" size={32} />
        </div>
        <p>
          Goal: make a trade, observe a market event, sell, and explain the
          risk. Learning and reasoning earn rewards; profitable trades do not.
        </p>
        <div className="sim-assumptions">
          <span>
            <strong>6%</strong> annual inflation assumption
          </span>
          <span>
            <strong>13%</strong> tax on each positive realised gain
          </span>
          <span>
            <strong>15%</strong> illustrative weekly growth benchmark
          </span>
        </div>
        <p className="small muted">
          Tax is deducted on a profitable sale with no loss offsets; this
          simplified classroom rule is not a Canadian tax calculation. Inflation
          is shown as purchasing power using (1.06)^(elapsed trading days ÷
          252), without debiting cash. Current purchasing-power value:{" "}
          {money(p.realValue)} Stars. A sustained 15% weekly return is not a
          dependable goal.
        </p>
        {!sim.challenge ? (
          <div className="sim-unlock">
            <span>
              <Icon name={state.stars >= 100 ? "check" : "lock"} /> Requires 100
              earned NOVA Stars. You have {state.stars}. Unlocking does not
              spend them.
            </span>
            <Button
              disabled={state.stars < 100}
              onClick={() => {
                setState((s) => ({ ...s, sim: { ...s.sim, challenge: true } }));
                toast(
                  "Recession challenge activated. Trading Stars remain separate.",
                );
              }}
            >
              Activate challenge
            </Button>
          </div>
        ) : (
          <div className="row spread">
            <Badge tone="green">Challenge active</Badge>
            <Button
              onClick={() => {
                setDebrief(true);
                setReflectionDone(false);
              }}
            >
              Risk debrief <Icon name="arrow" />
            </Button>
          </div>
        )}
      </section>
      <section className="card padded">
        <div className="row spread">
          <h2>Your portfolio & ledger</h2>
          <Button variant="ghost" onClick={() => setReset(true)}>
            <Icon name="refresh" />
            Reset sandbox
          </Button>
        </div>
        <div className="sim-table-wrap">
          <table className="sim-table">
            <caption>
              Positions at Day {sim.day + 1} prices · all values in simulated
              Stars
            </caption>
            <thead>
              <tr>
                <th>Holding</th>
                <th>Shares</th>
                <th>Cost basis</th>
                <th>Value</th>
                <th>Unrealised</th>
              </tr>
            </thead>
            <tbody>
              {TICKERS.map((t) => (
                <tr key={t}>
                  <th scope="row">{t}</th>
                  <td>{p.holdings[t].quantity}</td>
                  <td>{money(p.holdings[t].costBasis)}</td>
                  <td>{money(p.holdings[t].value)}</td>
                  <td>{signed(p.holdings[t].unrealised)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sim-ledger-summary">
          <span>
            Total held cost basis <b>{money(p.costBasis)} ★</b>
          </span>
          <span>
            Simulated tax paid <b>{money(p.tax)} ★</b>
          </span>
        </div>
        <h3>Trade history</h3>
        {!sim.trades.length ? (
          <EmptyState
            title="Your first trade is ahead of you."
            action={
              <Button variant="secondary" onClick={() => openOrder("buy")}>
                Purchase Stocks
              </Button>
            }
          >
            Choose a company, preview the order, then confirm. Every trade will
            appear here.
          </EmptyState>
        ) : (
          <div className="sim-table-wrap">
            <table className="sim-table">
              <caption>Confirmed transactions, oldest first</caption>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Action</th>
                  <th>Shares</th>
                  <th>Price</th>
                  <th>Gross</th>
                  <th>Realised</th>
                  <th>Tax</th>
                  <th>Cash after</th>
                </tr>
              </thead>
              <tbody>
                {sim.trades.map((t) => (
                  <tr key={t.id}>
                    <td>{t.day + 1}</td>
                    <th scope="row">
                      {t.side === "buy" ? "Buy" : "Sell"} {t.ticker}
                    </th>
                    <td>{t.quantity}</td>
                    <td>{money(t.price)}</td>
                    <td>{money(t.gross)}</td>
                    <td>{t.side === "sell" ? signed(t.realised) : "—"}</td>
                    <td>{money(t.tax)}</td>
                    <td>{money(t.balanceAfter)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="sim-trade-buttons">
          <Button onClick={() => openOrder("buy")}>Purchase Stocks</Button>
          <Button variant="secondary" onClick={() => openOrder("sell")}>
            Sell Stocks
          </Button>
        </div>
      </section>
      {sim.day === 13 && (
        <div className="sim-end card padded">
          <Icon name="trophy" size={35} />
          <h3>Your practice window is complete.</h3>
          <p>
            Review your trades and risk reasoning. Replay restores only your
            simulated wallet.
          </p>
          <Button variant="secondary" onClick={() => setReset(true)}>
            Replay scenario
          </Button>
        </div>
      )}
      <p className="small muted sim-source">
        Educational source context: Ontario Securities Commission’s
        GetSmarterAboutMoney and CIRO investor education. This simulation is
        curated demo content, pending expert review. All prices, headlines, tax
        and inflation applications are fictional teaching assumptions.
      </p>
      {order && (
        <Modal
          title={
            preview
              ? "Review your simulated order"
              : order === "buy"
                ? "Purchase Stocks"
                : "Sell Stocks"
          }
          onClose={() => setOrder(null)}
        >
          {preview && !tradePreview.error ? (
            <div className="stack">
              <Badge tone="blue">DEMO ORDER · NO REAL MONEY</Badge>
              <h3>
                {order === "buy" ? "Buy" : "Sell"} {tradePreview.quantity}{" "}
                {ticker} {tradePreview.quantity === 1 ? "share" : "shares"}
              </h3>
              <dl className="sim-order-details">
                <div>
                  <dt>Price per share · Day {sim.day + 1}</dt>
                  <dd>{money(tradePreview.price)} ★</dd>
                </div>
                <div>
                  <dt>Gross amount</dt>
                  <dd>{money(tradePreview.gross)} ★</dd>
                </div>
                {order === "sell" && (
                  <>
                    <div>
                      <dt>Realised return before tax</dt>
                      <dd>{signed(tradePreview.realised)} ★</dd>
                    </div>
                    <div>
                      <dt>Simulated tax (13% of positive gain)</dt>
                      <dd>{money(tradePreview.tax)} ★</dd>
                    </div>
                    <div>
                      <dt>Net sale proceeds</dt>
                      <dd>{money(tradePreview.total)} ★</dd>
                    </div>
                  </>
                )}
                <div>
                  <dt>Available cash after confirmation</dt>
                  <dd>{money(tradePreview.balanceAfter)} ★</dd>
                </div>
              </dl>
              <p className="small muted">
                Only the simulated trading wallet changes. Your {state.stars}{" "}
                earned NOVA Stars stay separate.
              </p>
              <Button onClick={confirmTrade}>
                Confirm {order === "buy" ? "purchase" : "sale"}
              </Button>
              <Button variant="ghost" onClick={() => setPreview(false)}>
                Edit order
              </Button>
            </div>
          ) : (
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                const p = previewTrade(sim, order, ticker, quantity);
                if (p.error) {
                  setError(p.error);
                  return;
                }
                setError("");
                setPreview(true);
              }}
            >
              <p className="muted">
                {order === "buy"
                  ? `Available cash: ${money(p.cash)} trading Stars.`
                  : "You can sell only shares you currently hold."}
              </p>
              <label className="field">
                Company
                <select
                  value={ticker}
                  onChange={(e) => {
                    setTicker(e.target.value);
                    setError("");
                  }}
                >
                  {TICKERS.map((t) => (
                    <option value={t} key={t}>
                      {STOCKS[t].name} ({t}) · {money(priceAt(t, sim.day))} ★
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Number of shares
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setError("");
                  }}
                  required
                />
              </label>
              <p className="small muted">
                {order === "buy"
                  ? "Affordable at today’s price"
                  : "Available to sell"}
                : {maxShares} shares. Whole shares only.
              </p>
              {error && (
                <div className="sim-error" role="alert">
                  <Icon name="info" />
                  {error}
                </div>
              )}
              <Button type="submit">
                Preview order <Icon name="arrow" />
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setOrder(null)}
              >
                Cancel
              </Button>
            </form>
          )}
        </Modal>
      )}
      {reset && (
        <Modal
          title="Reset the trading sandbox?"
          onClose={() => setReset(false)}
        >
          <p>
            Restore Day 5 and a 5,000-Star trading wallet. This clears simulated
            trades only. Your learning, earned Stars and completed assignments
            are kept.
          </p>
          <div className="row">
            <Button
              onClick={() => {
                setState((s) => ({ ...s, sim: freshSimulation() }));
                setPoint(4);
                setReset(false);
                toast("Trading sandbox reset.");
              }}
            >
              Reset sandbox
            </Button>
            <Button variant="ghost" onClick={() => setReset(false)}>
              Keep practising
            </Button>
          </div>
        </Modal>
      )}
      {debrief && (
        <Modal title="Pause. Reflect. Learn." onClose={() => setDebrief(false)}>
          {reflectionDone ? (
            <div className="stack">
              <div className="sim-reflect-medal">
                <Icon name="shield" size={45} />
              </div>
              <h3>Good reasoning is a skill worth keeping.</h3>
              <p>
                Concentrating in one company can amplify a loss. Diversification
                can reduce company-specific risk, although it cannot remove
                market risk. A 15% weekly gain is unpredictable and difficult to
                sustain.
              </p>
              <p className="small">
                25 earned Stars are awarded once for this reflection. Replaying
                trades cannot generate learning rewards.
              </p>
              {!(
                sim.trades.some((t) => t.side === "buy") &&
                sim.trades.some((t) => t.side === "sell") &&
                sim.day > 4
              ) && (
                <p className="sim-hint">
                  To complete a class simulator task, also buy, advance beyond
                  Day 5, and sell, then revisit this reflection.
                </p>
              )}
              <Button onClick={() => setDebrief(false)}>
                Back to the sandbox
              </Button>
            </div>
          ) : (
            <div className="stack">
              <p>
                Your simulated result is {signed(p.profit)} Stars. A short
                outcome alone cannot tell you whether a strategy was sensible.
              </p>
              <fieldset className="sim-options">
                <legend>What could reduce company-specific risk?</legend>
                {[
                  [
                    "concentrate",
                    "Put everything into the fastest-rising share",
                  ],
                  [
                    "diversify",
                    "Diversify and consider how much loss I could handle",
                  ],
                  ["headline", "Follow the latest exciting headline"],
                ].map(([v, label]) => (
                  <label key={v}>
                    <input
                      type="radio"
                      name="risk"
                      value={v}
                      checked={reason === v}
                      onChange={() => setReason(v)}
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
              <fieldset className="sim-options">
                <legend>How should I read the 15% weekly benchmark?</legend>
                {[
                  [
                    "guaranteed",
                    "A reliable weekly return if I pick a popular stock",
                  ],
                  [
                    "uncertain",
                    "An illustrative, highly uncertain target that is difficult to sustain",
                  ],
                ].map(([v, label]) => (
                  <label key={v}>
                    <input
                      type="radio"
                      name="benchmark"
                      value={v}
                      checked={benchmark === v}
                      onChange={() => setBenchmark(v)}
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
              <Button disabled={!reason || !benchmark} onClick={reflect}>
                Check my reasoning
              </Button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
function AccountSimulator() {
  const { state, setState, award, completeTask, toast } = useApp();
  const [selected, setSelected] = useState("cash"),
    [scenarioId, setScenarioId] = useState("first"),
    [feedback, setFeedback] = useState(false),
    [compare, setCompare] = useState("margin");
  const account = ACCOUNT_DATA[selected],
    scenario = SCENARIOS.find((s) => s.id === scenarioId),
    correct = selected === scenario.answer;
  function check() {
    setFeedback(true);
    setState((s) => ({
      ...s,
      accountAttempts: [
        ...(s.accountAttempts || []),
        { scenario: scenario.id, choice: selected, correct },
      ],
    }));
    if (correct) {
      award(
        "account-comparison",
        25,
        "Matched an account category to a scenario and reviewed the trade-offs",
      );
      completeTask("account-simulator");
      toast("Account comparison complete. 25 learning Stars awarded once.");
    }
  }
  return (
    <>
      <section className="card padded sim-account-intro">
        <Guide />
        <div>
          <Badge tone="blue">INVESTMENT ACCOUNT SIMULATOR</Badge>
          <h2>A good fit starts with your situation.</h2>
          <p>
            Please choose what type of account you would like to explore as a
            beginner. Meet the trade-offs before you make a choice.
          </p>
          <p className="sim-hint">
            <Icon name="lightbulb" />
            Hint: pick the account that best applies to the scenario, not the
            one that promises the most.
          </p>
        </div>
      </section>
      <section className="card padded">
        <span className="eyebrow">1. PICK A SITUATION</span>
        <h2>What are you practising for?</h2>
        <div className="sim-scenario-grid">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              className={scenarioId === s.id ? "active" : ""}
              aria-pressed={scenarioId === s.id}
              onClick={() => {
                setScenarioId(s.id);
                setFeedback(false);
              }}
            >
              {s.title}
              <Icon name={scenarioId === s.id ? "check" : "chevron"} />
            </button>
          ))}
        </div>
        <div className="sim-scenario-description">
          <h3>{scenario.title}</h3>
          <p>{scenario.description}</p>
          <span className="small muted">Hint: {scenario.hint}</span>
        </div>
      </section>
      <section>
        <div className="section-heading">
          <div>
            <span className="eyebrow">2. EXPLORE YOUR CHOICES</span>
            <h2>Five categories. Different responsibilities.</h2>
          </div>
        </div>
        <div className="sim-account-choices">
          {Object.entries(ACCOUNT_DATA).map(([id, a]) => (
            <button
              className={`card ${selected === id ? "active" : ""}`}
              key={id}
              aria-pressed={selected === id}
              onClick={() => {
                setSelected(id);
                setFeedback(false);
              }}
            >
              <span className="sim-account-icon">
                <Icon name={a.icon} size={27} />
              </span>
              <b>{a.title} Account</b>
              <small>{a.subtitle}</small>
              {selected === id && (
                <span className="sim-account-check">
                  <Icon name="check" size={15} />
                </span>
              )}
            </button>
          ))}
        </div>
      </section>
      <section className="card padded sim-account-detail">
        <div className="row gap-sm">
          <Icon name={account.icon} size={30} />
          <h2>{account.title} Account</h2>
        </div>
        <p>{account.explanation}</p>
        <div className="grid-2">
          <div className="sim-account-info">
            <h3>When it could fit</h3>
            <p>{account.fit}</p>
            <h3>When it may be a poor fit</h3>
            <p>{account.poor}</p>
          </div>
          <div className="sim-account-info">
            <h3>Trade-off to understand</h3>
            <p>{account.tradeoff}</p>
            <h3>A simple example</h3>
            <p>{account.example}</p>
          </div>
        </div>
        <Button onClick={check}>
          Check my choice <Icon name="arrow" />
        </Button>
        {feedback && (
          <div
            className={`sim-account-feedback ${correct ? "correct" : "review"}`}
            role="status"
          >
            <Icon name={correct ? "check" : "lightbulb"} size={27} />
            <div>
              <h3>
                {correct
                  ? selected === "cash"
                    ? "Great choice! Cash avoids borrowing."
                    : "That matches the scenario."
                  : "Consider the situation again."}
              </h3>
              <p>
                {correct
                  ? `A ${account.title.toLowerCase()} account matches this learning goal. ${account.tradeoff}`
                  : `You chose ${account.title}. ${account.explanation} For this scenario, ${ACCOUNT_DATA[scenario.answer].title.toLowerCase()} is the closer match: ${ACCOUNT_DATA[scenario.answer].fit}`}
              </p>
              {correct && (
                <p className="small">
                  Comparison complete • 25 Stars once for demonstrated learning.
                </p>
              )}
              <Button
                variant="ghost"
                onClick={() => {
                  setFeedback(false);
                  if (!correct) setSelected(scenario.answer);
                  else
                    setScenarioId(
                      SCENARIOS[
                        (SCENARIOS.findIndex((s) => s.id === scenarioId) + 1) %
                          SCENARIOS.length
                      ].id,
                    );
                }}
              >
                {correct ? "Try another scenario" : "Review the closer match"}
              </Button>
            </div>
          </div>
        )}
      </section>
      <section className="card padded">
        <span className="eyebrow">3. COMPARE BEFORE YOU DECIDE</span>
        <h2>Put two categories side by side.</h2>
        <label className="field sim-compare-select">
          Compare {account.title} with
          <select value={compare} onChange={(e) => setCompare(e.target.value)}>
            {Object.entries(ACCOUNT_DATA).map(([id, a]) => (
              <option key={id} value={id}>
                {a.title} Account
              </option>
            ))}
          </select>
        </label>
        {selected === compare ? (
          <p className="sim-hint">
            Choose a different category to see the trade-offs side by side.
          </p>
        ) : (
          <div className="sim-table-wrap">
            <table className="sim-table sim-compare">
              <caption>
                Generic educational categories, not specific Canadian financial
                products
              </caption>
              <thead>
                <tr>
                  <th scope="col">Consideration</th>
                  <th scope="col">{account.title}</th>
                  <th scope="col">{ACCOUNT_DATA[compare].title}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["How it works", "explanation"],
                  ["Possible fit", "fit"],
                  ["Trade-off", "tradeoff"],
                  ["Poor fit", "poor"],
                ].map(([label, key]) => (
                  <tr key={key}>
                    <th scope="row">{label}</th>
                    <td>{account[key]}</td>
                    <td>{ACCOUNT_DATA[compare][key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <div className="sim-jurisdiction">
        <Icon name="info" />
        <p>
          These are generic account categories. A retirement category is not a
          specific RRSP or other Canadian product, and a custodial arrangement
          is not universally available. Actual availability, age requirements,
          tax rules and control vary by province, jurisdiction and institution.
          This demo opens no account and collects no financial or identity
          information.
        </p>
      </div>
      <p className="small muted sim-source">
        Curated classroom content • Pending expert review. Discuss actual
        product eligibility and terms with a trusted adult and the relevant
        institution.
      </p>
    </>
  );
}
