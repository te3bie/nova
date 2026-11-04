/** Reproducible, fictional market: all prices and trades use this one source. */
export const OPENING_BALANCE = 5000;
export const TAX_RATE = 0.13;
export const INFLATION = 0.06;
export const TICKERS = ["AAPL", "TSLA", "MSFT"];
export const STOCKS = {
  AAPL: {
    name: "Apple",
    color: "#2168e8",
    shape: "circle",
    prices: [
      148, 151, 149, 153, 155, 144, 147, 150, 146, 154, 158, 152, 160, 162,
    ],
  },
  TSLA: {
    name: "Tesla",
    color: "#d8781c",
    shape: "square",
    prices: [
      205, 211, 207, 215, 220, 187, 195, 203, 190, 208, 217, 201, 224, 218,
    ],
  },
  MSFT: {
    name: "Microsoft",
    color: "#169581",
    shape: "triangle",
    prices: [
      302, 305, 301, 310, 315, 296, 300, 308, 303, 318, 322, 313, 326, 330,
    ],
  },
};
export const EVENTS = [
  [
    "A calm opening",
    "Fictional technology shares open the practice window. A share is ownership, and its price can change.",
  ],
  [
    "Product optimism",
    "A fictional product launch lifts expectations. Good news can already be priced in.",
  ],
  [
    "A cautious outlook",
    "Investors question future demand. Short-term prices reflect changing expectations.",
  ],
  [
    "Earnings expectations rise",
    "A fictional earnings preview encourages buyers. Expectations are not a promise.",
  ],
  [
    "Before the shock",
    "An upbeat week ends. Past gains do not guarantee what happens next.",
  ],
  [
    "Recession concerns hit technology",
    "Fictional weak consumer-spending news triggers a broad sell-off. Tesla moves most in this scenario, illustrating volatility and concentrated risk.",
  ],
  [
    "A partial rebound",
    "Buyers return after yesterday’s drop. A bounce does not erase a loss.",
  ],
  [
    "Markets digest new information",
    "Fictional spending data is less negative than expected. Different investors interpret it differently.",
  ],
  [
    "Borrowing costs weigh on confidence",
    "Fictional rate uncertainty sends prices lower. Borrowing can amplify the effect of a decline.",
  ],
  [
    "Earnings offer reassurance",
    "A fictional earnings update lifts prices. One headline is not a full investment thesis.",
  ],
  [
    "Optimism builds",
    "Fictional demand improves. Repeated gains can encourage overconfidence.",
  ],
  [
    "Profit-taking",
    "Some fictional investors sell after a rise. A short price series is too little evidence to predict a trend.",
  ],
  [
    "Recovery broadens",
    "Fictional demand news supports technology shares. Diversification still matters.",
  ],
  [
    "The practice window closes",
    "The last prices are a snapshot, not a forecast. Review your reasoning and compare risk.",
  ],
].map(([title, description], day) => ({
  day,
  title,
  description,
  date: new Date(Date.UTC(2026, 10, 2 + day)).toISOString().slice(0, 10),
}));
export const money = (n) =>
  Number(n).toLocaleString("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
export const round = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
export const priceAt = (ticker, day) =>
  STOCKS[ticker]?.prices[Math.max(0, Math.min(day, 13))] ?? 0;
export const freshSimulation = () => ({
  day: 4,
  trades: [],
  cash: OPENING_BALANCE,
  challenge: false,
});
export function portfolio(sim) {
  const holdings = Object.fromEntries(
    TICKERS.map((t) => [t, { quantity: 0, costBasis: 0 }]),
  );
  let cash = OPENING_BALANCE,
    realised = 0,
    tax = 0;
  for (const t of sim.trades || []) {
    const h = holdings[t.ticker];
    if (!h) continue;
    if (t.side === "buy") {
      h.quantity += t.quantity;
      h.costBasis = round(h.costBasis + t.gross);
      cash = round(cash - t.gross);
    } else {
      h.quantity -= t.quantity;
      h.costBasis = round(h.costBasis - t.costBasisReleased);
      cash = round(cash + t.gross - t.tax);
      realised = round(realised + t.realised);
      tax = round(tax + t.tax);
    }
  }
  let holdingsValue = 0,
    costBasis = 0;
  for (const ticker of TICKERS) {
    const h = holdings[ticker];
    h.value = round(h.quantity * priceAt(ticker, sim.day));
    h.unrealised = round(h.value - h.costBasis);
    h.average = h.quantity ? h.costBasis / h.quantity : 0;
    holdingsValue += h.value;
    costBasis += h.costBasis;
  }
  const value = round(cash + holdingsValue);
  return {
    cash,
    holdings,
    holdingsValue: round(holdingsValue),
    costBasis: round(costBasis),
    value,
    realised,
    tax,
    unrealised: round(holdingsValue - costBasis),
    profit: round(value - OPENING_BALANCE),
    returnPct: (value / OPENING_BALANCE - 1) * 100,
    realValue: value / Math.pow(1 + INFLATION, Math.max(0, sim.day - 4) / 252),
  };
}
export function previewTrade(sim, side, ticker, quantity) {
  if (!TICKERS.includes(ticker))
    return { error: "Choose one of the three demo stocks." };
  if (!["buy", "sell"].includes(side))
    return { error: "Choose purchase or sell." };
  const n = Number(quantity);
  if (!Number.isSafeInteger(n) || n <= 0)
    return { error: "Enter a positive whole number of shares." };
  const p = portfolio(sim),
    price = priceAt(ticker, sim.day),
    gross = round(price * n),
    h = p.holdings[ticker];
  if (side === "buy" && gross > p.cash)
    return {
      error: `Not enough trading Stars. Available: ${money(p.cash)}; order: ${money(gross)}.`,
    };
  if (side === "sell" && n > h.quantity)
    return {
      error: `You own ${h.quantity} ${ticker} shares. Reduce the quantity or buy shares first.`,
    };
  const costBasisReleased =
    side === "sell"
      ? n === h.quantity
        ? h.costBasis
        : round(h.average * n)
      : 0;
  const realised = side === "sell" ? round(gross - costBasisReleased) : 0;
  const tax = side === "sell" ? round(Math.max(0, realised) * TAX_RATE) : 0;
  return {
    side,
    ticker,
    quantity: n,
    day: sim.day,
    price,
    gross,
    costBasisReleased,
    realised,
    tax,
    total: round(gross - tax),
    balanceAfter: round(p.cash + (side === "buy" ? -gross : gross - tax)),
  };
}
export function executeTrade(sim, side, ticker, quantity) {
  const trade = previewTrade(sim, side, ticker, quantity);
  if (trade.error) return { error: trade.error, sim };
  const trades = [
    ...(sim.trades || []),
    { ...trade, id: `trade-${(sim.trades || []).length + 1}` },
  ];
  return { trade, sim: { ...sim, trades, cash: trade.balanceAfter } };
}
