import test from "node:test";
import assert from "node:assert/strict";
import {
  freshSimulation,
  portfolio,
  executeTrade,
  previewTrade,
  priceAt,
} from "../src/data/market.js";
test("opening portfolio and coherent prices", () => {
  const s = freshSimulation();
  assert.equal(portfolio(s).value, 5000);
  assert.equal(priceAt("AAPL", 4), 155);
});
test("buy, advance through recession, sell: ledger preserves cash and cost basis", () => {
  let s = freshSimulation();
  s = executeTrade(s, "buy", "AAPL", 10).sim;
  assert.equal(portfolio(s).cash, 3450);
  s = { ...s, day: 5 };
  assert.equal(portfolio(s).unrealised, -110);
  s = executeTrade(s, "sell", "AAPL", 4).sim;
  const p = portfolio(s);
  assert.equal(p.cash, 4026);
  assert.equal(p.holdings.AAPL.quantity, 6);
  assert.equal(p.holdings.AAPL.costBasis, 930);
  assert.equal(p.realised, -44);
  assert.equal(p.tax, 0);
  assert.equal(p.value, 4890);
});
test("tax only applies to positive realised gains; full sale closes cost basis", () => {
  let s = freshSimulation();
  s = executeTrade(s, "buy", "MSFT", 3).sim;
  s = { ...s, day: 13 };
  const order = previewTrade(s, "sell", "MSFT", 3);
  assert.equal(order.realised, 45);
  assert.equal(order.tax, 5.85);
  s = executeTrade(s, "sell", "MSFT", 3).sim;
  assert.equal(portfolio(s).cash, 5039.15);
  assert.equal(portfolio(s).holdings.MSFT.costBasis, 0);
});
test("all invalid trades preserve original state", () => {
  const s = freshSimulation();
  for (const [side, ticker, q] of [
    ["buy", "AAPL", 0],
    ["buy", "AAPL", -1],
    ["buy", "AAPL", 1.2],
    ["buy", "AAPL", 100],
    ["sell", "AAPL", 1],
    ["buy", "FAKE", 1],
    ["swap", "AAPL", 1],
  ]) {
    const r = executeTrade(s, side, ticker, q);
    assert.ok(r.error);
    assert.strictEqual(r.sim, s);
    assert.equal(s.trades.length, 0);
  }
});
test("weighted average basis survives multiple purchases and partial sales", () => {
  let s = freshSimulation();
  s = executeTrade(s, "buy", "AAPL", 2).sim;
  s = { ...s, day: 5 };
  s = executeTrade(s, "buy", "AAPL", 2).sim;
  assert.equal(portfolio(s).holdings.AAPL.costBasis, 598);
  s = executeTrade(s, "sell", "AAPL", 1).sim;
  assert.equal(portfolio(s).holdings.AAPL.costBasis, 448.5);
  assert.equal(portfolio(s).realised, -5.5);
  assert.equal(portfolio(s).value, 4978);
});
test("preview does not mutate the wallet, and rejected sale preserves an existing position", () => {
  const initial = freshSimulation();
  const s = executeTrade(initial, "buy", "TSLA", 2).sim;
  const before = JSON.stringify(s);
  const quote = previewTrade(s, "sell", "TSLA", 1);
  assert.equal(quote.gross, 220);
  assert.equal(JSON.stringify(s), before);
  const failed = executeTrade(s, "sell", "TSLA", 3);
  assert.strictEqual(failed.sim, s);
  assert.equal(JSON.stringify(s), before);
  assert.equal(portfolio(s).holdings.TSLA.quantity, 2);
});
test("multiple assets conserve the portfolio equation throughout a reproducible sequence", () => {
  let s = freshSimulation();
  for (const [day, side, ticker, quantity] of [
    [4, "buy", "AAPL", 5],
    [4, "buy", "MSFT", 3],
    [5, "buy", "TSLA", 4],
    [7, "sell", "AAPL", 2],
    [9, "sell", "TSLA", 2],
    [12, "sell", "MSFT", 3],
    [13, "sell", "AAPL", 3],
    [13, "sell", "TSLA", 2],
  ]) {
    s = { ...s, day };
    const r = executeTrade(s, side, ticker, quantity);
    assert.ok(!r.error);
    s = r.sim;
    const p = portfolio(s);
    assert.ok(
      Math.abs(p.value - (5000 + p.realised + p.unrealised - p.tax)) < 0.011,
    );
    assert.ok(p.cash >= 0);
  }
  assert.equal(portfolio(s).holdingsValue, 0);
  assert.equal(portfolio(s).costBasis, 0);
  assert.ok(portfolio(s).tax > 0);
});
test("same-price sale creates no gain or tax", () => {
  let s = freshSimulation();
  s = executeTrade(s, "buy", "AAPL", 1).sim;
  s = executeTrade(s, "sell", "AAPL", 1).sim;
  assert.equal(portfolio(s).value, 5000);
  assert.equal(portfolio(s).tax, 0);
  assert.equal(portfolio(s).realised, 0);
});
