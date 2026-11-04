import { test, expect } from "@playwright/test";
const readState = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("nova.prototype.v1")));
async function returning(page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the student demo" }).click();
}
async function openStocks(page) {
  await page.getByRole("button", { name: "Let’s learn", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Basics of Stocks", exact: true }),
  ).toBeVisible();
}
async function answer(page, index, last = false) {
  await page.locator(".answer-options .answer-button").nth(index).click();
  await page
    .getByRole("button", {
      name: last ? "See my progress" : "Next",
      exact: true,
    })
    .click();
}

test("beginner onboarding, recommendation and class code validation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("Illuminating Your Path to Success.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Find my starting point" }).click();
  await page.getByRole("button", { name: /Join a Class/ }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("NOVA24");
  await page.getByRole("textbox", { name: "Demo class code" }).fill("NOVA24");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /Brand new/ }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /Check the source/ }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: /My first car/ }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText(/Why this is next: your answers/)).toBeVisible();
  await page.getByRole("button", { name: "Let’s get started" }).click();
  const state = await readState(page);
  expect(state.stars).toBe(0);
  expect(state.profile.joined).toBe(true);
  expect(state.profile.confidence).toBe("Beginner");
  await expect(
    page.getByRole("heading", { name: /Welcome to your next chapter/ }),
  ).toBeVisible();
});

test("Stocks explainer, all practice formats, resume, derived mastery and one-time reward", async ({
  page,
}) => {
  await returning(page);
  await openStocks(page);
  await page
    .getByRole("button", { name: "Play explainer", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Pause explainer" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pause explainer" }).click();
  await page.getByText("Read the transcript", { exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Go to chapter 4" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Go to chapter 2" }).click();
  await page.getByRole("button", { name: "Try the knowledge check" }).click();
  await page.locator(".answer-options .answer-button").nth(0).click();
  await expect(page.getByRole("status")).toContainText("A useful moment");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "Stocks are guaranteed to increase in value over time.",
    }),
  ).toBeVisible();
  await answer(page, 1);
  await answer(page, 0);
  await answer(page, 1, true);
  await expect(
    page.getByRole("heading", { name: "Lesson Complete!" }),
  ).toBeVisible();
  await expect(page.locator(".mastery-card.mastered strong")).toHaveText("3");
  await expect(page.locator(".mastery-card.learning strong")).toHaveText("1");
  await page.locator(".mastery-card.learning").click();
  await expect(page.getByRole("dialog")).toContainText(
    "What does owning a stock represent?",
  );
  await page.getByRole("button", { name: "Keep going", exact: true }).click();
  let state = await readState(page);
  expect(state.stars).toBe(575);
  expect(state.hearts).toBe(3);
  expect(state.lessonProgress["investments:stocks"].completed).toBe(true);
  await page.getByRole("button", { name: "Try a short review" }).click();
  for (const [i, a] of [1, 1, 0, 1].entries()) await answer(page, a, i === 3);
  state = await readState(page);
  expect(state.stars).toBe(575);
  expect(state.mastery.ownership.attempts).toBe(2);
  expect(state.mastery.ownership.lastCorrect).toBe(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Lesson Complete!" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Home", exact: true }).click();
  await page
    .getByRole("button", { name: "575 earned Stars. Reward ledger" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Basics of Stocks lesson complete",
  );
  await page.keyboard.press("Escape");
  await page.screenshot({
    path: "test-results/nova-desktop-dashboard.png",
    fullPage: true,
  });
});

test("checkpoint delays feedback until submission and records concepts", async ({
  page,
}) => {
  await returning(page);
  await openStocks(page);
  await page
    .getByRole("button", { name: "Take checkpoint test", exact: true })
    .click();
  for (const [i, a] of [1, 1, 0, 1].entries()) {
    await page.locator(".answer-options .answer-button").nth(a).click();
    await expect(page.locator(".answer-feedback")).toHaveCount(0);
    await page
      .getByRole("button", {
        name: i === 3 ? "Submit checkpoint" : "Next",
        exact: true,
      })
      .click();
  }
  await expect(page.locator(".mastery-card.mastered strong")).toHaveText("4");
  expect((await readState(page)).stars).toBe(575);
});

test("all seven investment nodes finish a coherent pathway and award medal once", async ({
  page,
}) => {
  await returning(page);
  await page
    .getByRole("button", { name: /Types of Investments A world/ })
    .click();
  const nodes = [
    "overview",
    "stocks",
    "bonds",
    "mutual-funds",
    "etfs",
    "real-estate",
    "gics",
  ];
  const answerSets = [[1], [1, 1, 0, 1], [1, 0], [0], [1], [0], [1]];
  for (let n = 0; n < nodes.length; n++) {
    if (n === 0) await page.locator(".orbit-node").nth(0).click();
    await page.getByRole("button", { name: "Try the knowledge check" }).click();
    for (let q = 0; q < answerSets[n].length; q++)
      await answer(page, answerSets[n][q], q === answerSets[n].length - 1);
    if (n < nodes.length - 1)
      await page
        .getByRole("button", { name: "Next lesson", exact: true })
        .click();
  }
  const state = await readState(page);
  expect(state.stars).toBe(1875);
  expect(state.completed).toContain("investments");
  expect(
    state.rewardLedger.filter((x) => x.id === "pathway:investments"),
  ).toHaveLength(1);
  await page.getByRole("button", { name: "See pathway progress" }).click();
  await expect(page.locator(".pathway-ring strong")).toHaveText("100%");
  await expect(page.getByText("You did it!", { exact: true })).toBeVisible();
});

test("social claim inspection, independent source check and safe action debrief", async ({
  page,
}) => {
  await returning(page);
  await page.getByRole("button", { name: /Too good to be true/ }).click();
  const flags = page.locator(".flag-options input");
  await flags.nth(0).check();
  await flags.nth(1).check();
  await page.getByRole("button", { name: "Inspect my choices" }).click();
  await page
    .getByRole("button", { name: "Check the source", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Compare original sources, date, sponsorship, and registration where relevant.",
    })
    .click();
  await page.getByRole("button", { name: "Choose my next action" }).click();
  await page
    .getByRole("button", {
      name: "Pause, verify independently, and ask a trusted adult or teacher.",
    })
    .click();
  await page.getByRole("button", { name: "See the debrief" }).click();
  await expect(
    page.getByRole("heading", { name: "Pause. Check. Protect." }),
  ).toBeVisible();
  expect((await readState(page)).fraudComplete).toBe(true);
});

test("mobile, keyboard, reduced motion, French navigation preview and modal focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await returning(page);
  await expect(page.locator(".bottom-nav")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/nova-mobile-dashboard.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "500 earned Stars. Reward ledger" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .locator(".bottom-nav")
    .getByRole("button", { name: "Settings" })
    .click();
  await page.getByLabel("Reduce motion").check();
  await page.getByLabel("Increase contrast").check();
  await page.getByLabel("Language").selectOption("fr");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await expect(
    page.locator(".bottom-nav").getByRole("button", { name: "Accueil" }),
  ).toBeVisible();
  await page
    .locator(".bottom-nav")
    .getByRole("button", { name: "Accueil" })
    .click();
  await page.keyboard.press("Tab");
  const state = await readState(page);
  expect(state.preferences.reducedMotion).toBe(true);
  expect(state.preferences.contrast).toBe(true);
  expect(state.profile.language).toBe("fr");
});
