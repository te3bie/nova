import { test, expect } from "@playwright/test";

const readState = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("nova.prototype.v1")));
async function enterSimulator(page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the student demo" }).click();
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("nova.prototype.v1"));
    state.assignments.push(
      {
        id: "test-sim",
        title: "Practise trading and risk",
        type: "simulator",
        target: "stock-simulator",
        due: "2026-11-12",
        instructions: "Buy, advance, sell and reflect.",
        status: "assigned",
      },
      {
        id: "test-account",
        title: "Compare account choices",
        type: "simulator",
        target: "account-simulator",
        due: "2026-11-12",
        instructions: "Match an account to the scenario.",
        status: "assigned",
      },
    );
    localStorage.setItem("nova.prototype.v1", JSON.stringify(state));
  });
  await page.reload();
  await page.getByRole("button", { name: "Simulate", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Three companies. Five days." }),
  ).toBeVisible();
}
async function order(page, side, ticker, quantity) {
  await page
    .locator(".sim-trade-buttons")
    .getByRole("button", {
      name: side === "buy" ? "Purchase Stocks" : "Sell Stocks",
      exact: true,
    })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Company").selectOption(ticker);
  await dialog.getByLabel("Number of shares").fill(String(quantity));
  await dialog.getByRole("button", { name: "Preview order" }).click();
  return dialog;
}

test("stock flow: invalid orders are atomic, buy → event → sell, ledger, risk award, reload and reset", async ({
  page,
}) => {
  await enterSimulator(page);
  const initial = await readState(page);
  const invalid = await order(page, "buy", "AAPL", 100000);
  await expect(invalid.getByRole("alert")).toContainText(
    "Not enough trading Stars",
  );
  expect((await readState(page)).sim).toEqual(initial.sim);
  await invalid.getByRole("button", { name: "Cancel", exact: true }).click();
  const buy = await order(page, "buy", "AAPL", 2);
  await expect(
    buy.getByRole("heading", { name: "Buy 2 AAPL shares" }),
  ).toBeVisible();
  await expect(buy.locator(".sim-order-details")).toContainText("310.00");
  await buy
    .getByRole("button", { name: "Confirm purchase", exact: true })
    .click();
  let state = await readState(page);
  expect(state.sim.cash).toBe(4690);
  expect(state.sim.trades).toHaveLength(1);
  expect(state.stars).toBe(500);
  await page
    .getByRole("button", { name: "Show accessible price table" })
    .click();
  await expect(
    page.getByRole("table", {
      name: "Fictional prices in trading Stars, not indexed values",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Day 3", exact: true }).click();
  await expect(page.locator(".sim-selected")).toContainText("149.00");
  const legend = page.getByRole("button", { name: "Apple AAPL", exact: true });
  await legend.click();
  await expect(legend).toHaveAttribute("aria-pressed", "false");
  await legend.click();
  await expect(legend).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Advance Day", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Recession concerns hit technology" }),
  ).toBeVisible();
  expect((await readState(page)).sim.day).toBe(5);
  const sell = await order(page, "sell", "AAPL", 1);
  await expect(sell.locator(".sim-order-details")).toContainText("−11.00");
  await sell.getByRole("button", { name: "Confirm sale", exact: true }).click();
  state = await readState(page);
  expect(state.sim.cash).toBe(4834);
  expect(state.sim.trades).toHaveLength(2);
  expect(state.sim.trades[1].realised).toBe(-11);
  expect(state.sim.trades[1].tax).toBe(0);
  await expect(
    page.getByRole("table", { name: "Confirmed transactions, oldest first" }),
  ).toContainText("Sell AAPL");
  const beforeInvalid = state.sim;
  const oversell = await order(page, "sell", "AAPL", 2);
  await expect(oversell.getByRole("alert")).toContainText(
    "You own 1 AAPL shares",
  );
  expect((await readState(page)).sim).toEqual(beforeInvalid);
  await oversell.getByRole("button", { name: "Cancel", exact: true }).click();
  await page
    .getByRole("button", { name: "Activate challenge", exact: true })
    .click();
  await page.getByRole("button", { name: "Risk debrief", exact: true }).click();
  let debrief = page.getByRole("dialog");
  await debrief
    .getByRole("radio", {
      name: "Diversify and consider how much loss I could handle",
    })
    .check();
  await debrief
    .getByRole("radio", {
      name: "An illustrative, highly uncertain target that is difficult to sustain",
    })
    .check();
  await debrief
    .getByRole("button", { name: "Check my reasoning", exact: true })
    .click();
  await expect(
    debrief.getByRole("heading", {
      name: "Good reasoning is a skill worth keeping.",
    }),
  ).toBeVisible();
  await debrief
    .getByRole("button", { name: "Back to the sandbox", exact: true })
    .click();
  state = await readState(page);
  expect(state.stars).toBe(550);
  expect(state.assignments.find((a) => a.id === "test-sim").status).toBe(
    "complete",
  );
  expect(
    state.rewardLedger.filter((r) => r.id === "simulation-risk-reflection"),
  ).toHaveLength(1);
  await page.getByRole("button", { name: "Risk debrief", exact: true }).click();
  debrief = page.getByRole("dialog");
  await debrief
    .getByRole("button", { name: "Check my reasoning", exact: true })
    .click();
  await debrief
    .getByRole("button", { name: "Back to the sandbox", exact: true })
    .click();
  expect((await readState(page)).stars).toBe(550);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Recession concerns hit technology" }),
  ).toBeVisible();
  await expect(
    page.getByRole("table", { name: "Confirmed transactions, oldest first" }),
  ).toContainText("Sell AAPL");
  expect((await readState(page)).stars).toBe(550);
  await page
    .getByRole("button", { name: "Reset sandbox", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Reset sandbox", exact: true })
    .click();
  state = await readState(page);
  expect(state.sim.cash).toBe(5000);
  expect(state.sim.day).toBe(4);
  expect(state.sim.trades).toHaveLength(0);
  expect(state.stars).toBe(550);
});

test("accounts flow: explore every category, compare choices, recover a mismatch and complete all scenarios", async ({
  page,
}) => {
  await enterSimulator(page);
  await page
    .getByRole("button", { name: "Investment accounts", exact: true })
    .click();
  const expected = {
    Cash: "You do not borrow to invest.",
    Margin: "Borrowing amplifies gains and losses.",
    Retirement:
      "Tax treatment, contribution limits and withdrawal restrictions",
    Joint: "Access, responsibilities and what happens if holders disagree",
    Custodial: "Control, ownership and when management transfers",
  };
  for (const [name, text] of Object.entries(expected)) {
    await page
      .getByRole("button", { name: new RegExp(`^${name} Account`) })
      .click();
    await expect(
      page
        .locator(".sim-account-detail")
        .getByRole("heading", { name: `${name} Account`, exact: true }),
    ).toBeVisible();
    await expect(page.locator(".sim-account-detail")).toContainText(text);
  }
  await page.getByLabel("Compare Custodial with").selectOption("margin");
  await expect(
    page.getByRole("table", {
      name: "Generic educational categories, not specific Canadian financial products",
    }),
  ).toContainText("Margin");
  await page.getByRole("button", { name: /^Margin Account/ }).click();
  await page
    .getByRole("button", { name: "Check my choice", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Consider the situation again." }),
  ).toBeVisible();
  expect((await readState(page)).stars).toBe(500);
  const scenarios = [
    ["My first practice account", "Cash"],
    ["Compare borrowed exposure", "Margin"],
    ["Plan for a distant future", "Retirement"],
    ["Share a responsibility", "Joint"],
    ["Learn with adult support", "Custodial"],
  ];
  for (const [scenario, account] of scenarios) {
    await page.getByRole("button", { name: scenario, exact: true }).click();
    await page
      .getByRole("button", { name: new RegExp(`^${account} Account`) })
      .click();
    await page
      .getByRole("button", { name: "Check my choice", exact: true })
      .click();
    await expect(page.locator(".sim-account-feedback.correct")).toBeVisible();
  }
  const state = await readState(page);
  expect(state.accountAttempts.filter((a) => a.correct)).toHaveLength(5);
  expect(state.accountAttempts.filter((a) => !a.correct)).toHaveLength(1);
  expect(state.stars).toBe(550);
  expect(state.assignments.find((a) => a.id === "test-account").status).toBe(
    "complete",
  );
  expect(
    state.rewardLedger.filter((r) => r.id === "account-comparison"),
  ).toHaveLength(1);
  await expect(
    page.getByText("These are generic account categories.", { exact: false }),
  ).toBeVisible();
});

test("mobile reduced-motion: chart and account controls remain usable without page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the student demo" }).click();
  await page
    .getByRole("navigation", { name: "App navigation" })
    .getByRole("button", { name: "Simulate", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Three companies. Five days." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Advance Day", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Recession concerns hit technology" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Investment accounts", exact: true })
    .click();
  await page.getByRole("button", { name: /^Cash Account/ }).click();
  await page
    .getByRole("button", { name: "Check my choice", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Great choice! Cash avoids borrowing." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("keyboard: purchase dialog traps focus, supports Escape and restores the trigger", async ({
  page,
}) => {
  await enterSimulator(page);
  const trigger = page
    .locator(".sim-trade-buttons")
    .getByRole("button", { name: "Purchase Stocks", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close dialog", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close dialog", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
