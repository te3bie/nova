import { test, expect } from "@playwright/test";

async function enterDemo(page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the student demo" }).click();
}
async function openFinder(page) {
  await page.getByRole("button", { name: "Discover", exact: true }).click();
}
async function findListing(page, title) {
  await page.getByRole("textbox", { name: "Search opportunities" }).fill(title);
  const card = page
    .locator(".opportunity-card")
    .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "See more" }).click();
  return page.getByRole("dialog");
}

test("Finder opens all six source listings, filters, saves and preserves a saved listing", async ({
  page,
}) => {
  await enterDemo(page);
  await openFinder(page);
  const titles = [
    "Premier Student Bank Account",
    "Student Chequing Account",
    "Funding Futures Scholarship",
    "Student Life Network",
    "Student Banking Advantage Plan",
    "Senior Stock Market Competition",
  ];
  for (const title of titles) {
    const dialog = await findListing(page, title);
    await expect(
      dialog.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(
      dialog.getByText("Review status", { exact: true }),
    ).toBeVisible();
    await dialog.getByRole("button", { name: "Close dialog" }).click();
  }
  await page
    .getByRole("textbox", { name: "Search opportunities" })
    .fill("no-such-finance-opportunity");
  await expect(
    page.getByRole("heading", { name: "No matching opportunities" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await page
    .getByRole("combobox", { name: "Opportunity category" })
    .selectOption("Bank accounts");
  await expect(page.locator(".opportunity-card")).toHaveCount(3);
  const rbc = page
    .locator(".opportunity-card")
    .filter({ hasText: "Premier Student Bank Account" });
  await rbc
    .getByRole("button", {
      name: "Save Premier Student Bank Account",
      exact: true,
    })
    .click();
  await expect(
    rbc.getByRole("button", { name: "Unsave Premier Student Bank Account" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /^Saved / }).click();
  await expect(page.locator(".opportunity-card")).toHaveCount(1);
  await page.reload();
  await page.getByRole("button", { name: /^Saved / }).click();
  await expect(page.locator(".opportunity-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", {
      name: "Premier Student Bank Account",
      exact: true,
    }),
  ).toBeVisible();
});

test("Finder workshop RSVP, mock competition, external preview and unavailable states are complete", async ({
  page,
}) => {
  await enterDemo(page);
  await openFinder(page);
  let dialog = await findListing(page, "Your first investment, explained");
  await dialog.getByRole("button", { name: "Preview demo RSVP" }).click();
  dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Continue to RSVP" }).click();
  await expect(
    dialog.getByRole("button", { name: "Confirm demo RSVP" }),
  ).toBeDisabled();
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Confirm demo RSVP" }).click();
  await expect(
    dialog.getByRole("heading", { name: "Demo RSVP confirmed" }),
  ).toBeVisible();
  await expect(
    dialog.getByText(/No email was sent and no external place was booked/),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Keep exploring" }).click();
  dialog = await findListing(page, "Senior Stock Market Competition");
  await dialog.getByRole("button", { name: "Compete now" }).click();
  dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Continue to challenge entry" })
    .click();
  await expect(
    dialog.getByRole("button", { name: "Confirm demo entry" }),
  ).toBeDisabled();
  await dialog
    .getByRole("combobox", { name: "What will you focus on?" })
    .selectOption("Diversification and risk awareness");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Confirm demo entry" }).click();
  await expect(
    dialog.getByRole("heading", { name: "Challenge registration complete" }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Keep exploring" }).click();
  dialog = await findListing(page, "Premier Student Bank Account");
  await dialog.getByRole("button", { name: "Preview provider visit" }).click();
  dialog = page.getByRole("dialog");
  await expect(
    dialog.getByText("Preview only · no external navigation"),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Finish preview" }).click();
  dialog = await findListing(page, "Ask an educator: risk & reward");
  await expect(dialog.getByText("Expired · no registration")).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Preview demo RSVP" }),
  ).toHaveCount(0);
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("textbox", { name: "Search opportunities" }).fill("");
  await page
    .getByRole("combobox", { name: "Opportunity location" })
    .selectOption("Greater Montreal");
  dialog = await findListing(page, "L’argent au quotidien");
  await expect(
    dialog.getByText("Unavailable · planning preview"),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Preview demo RSVP" }),
  ).toHaveCount(0);
});

test("Teacher assignment appears in student mode and completing it updates class progress", async ({
  page,
}) => {
  await enterDemo(page);
  await page.getByRole("button", { name: "Class", exact: true }).click();
  await page.getByRole("button", { name: "Teacher demo", exact: true }).click();
  await page
    .getByRole("button", { name: "Assign activity", exact: true })
    .click();
  const instructions =
    "Explain one ownership right and one price risk after completing the four questions.";
  let dialog = page.getByRole("dialog");
  await dialog
    .getByRole("combobox", { name: "Activity", exact: true })
    .selectOption("0");
  await dialog
    .getByRole("textbox", { name: "Instructions for students" })
    .fill(instructions);
  await dialog.getByRole("button", { name: "Preview assignment" }).click();
  await expect(dialog.getByText(instructions, { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Assign to demo class" }).click();
  await page.getByRole("button", { name: "Student demo", exact: true }).click();
  const task = page
    .locator(".assignment-card")
    .filter({ hasText: instructions });
  await expect(task).toBeVisible();
  await task.getByRole("button", { name: "Start", exact: true }).click();
  await page.getByRole("button", { name: "Try the knowledge check" }).click();
  for (const answer of [
    /A share of ownership in the company\./,
    /False$/,
    /The right to vote on company decisions\./,
    /Share$/,
  ]) {
    await page
      .locator(".answer-options")
      .getByRole("button", { name: answer })
      .click();
    const last = answer.source === "Share$";
    await page
      .getByRole("button", {
        name: last ? "See my progress" : "Next",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Lesson Complete!" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "600 earned Stars. Reward ledger" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Class", exact: true }).click();
  await expect(
    page
      .locator(".assignment-card")
      .filter({ hasText: instructions })
      .getByText("Completed", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Teacher demo", exact: true }).click();
  await expect(
    page.locator(".teacher-metrics").getByText("2/2", { exact: true }),
  ).toBeVisible();
});

test("Teacher toolkit offers chapter transcripts, workshop planning and locally saved feedback", async ({
  page,
}) => {
  await enterDemo(page);
  await page.getByRole("button", { name: "Class", exact: true }).click();
  await page.getByRole("button", { name: "Teacher demo", exact: true }).click();
  await page.getByRole("tab", { name: "Toolkit", exact: true }).click();
  await page
    .getByRole("button", { name: /The NOVA classroom walkthrough/ })
    .click();
  let dialog = page.getByRole("dialog");
  await expect(
    dialog.getByText("Chaptered demo · text-based tutorial"),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Next chapter" }).click();
  await expect(dialog.getByText(/Choose Assign activity/)).toBeVisible();
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await page
    .getByRole("button", { name: /Bring the conversation to school/ })
    .click();
  dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Save planning preview" }).click();
  await expect(
    dialog.getByRole("heading", { name: "Workshop plan saved", exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByText(/No school, educator or provider was contacted/),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Back to toolkit" }).click();
  await page.getByRole("button", { name: /Help shape the learning/ }).click();
  dialog = page.getByRole("dialog");
  await dialog
    .getByRole("textbox", { name: "What should we improve?" })
    .fill("A useful sample discussion. Add more paired activities.");
  await dialog.getByRole("button", { name: "Save demo feedback" }).click();
  await expect(
    dialog.getByText(/It has not been sent to NOVA or anyone else/),
  ).toBeVisible();
});
