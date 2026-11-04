import { test, expect } from "@playwright/test";
async function enterDemo(page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the student demo" }).click();
}

test("NOVA assistant answers curated prompts and typed questions, opens lessons and restores focus", async ({
  page,
}) => {
  await enterDemo(page);
  const launcher = page.getByRole("button", {
    name: "Open NOVA learning assistant",
    exact: true,
  });
  await launcher.click();
  let dialog = page.getByRole("dialog", { name: "A little help from NOVA" });
  await expect(
    dialog.getByRole("textbox", { name: "Ask NOVA a learning question" }),
  ).toBeFocused();
  await expect(
    dialog.getByText("Curated educational demo · no AI service connected"),
  ).toBeVisible();
  await dialog
    .getByRole("button", { name: "Explain stocks", exact: true })
    .click();
  await expect(dialog.locator(".from-nova").last()).toContainText(
    "A share is a small piece of a company",
  );
  await dialog
    .getByRole("button", { name: "Make sense of stocks", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Basics of Stocks", exact: true }),
  ).toBeVisible();
  await expect(launcher).toHaveAttribute("aria-expanded", "false");
  await launcher.click();
  dialog = page.getByRole("dialog", { name: "A little help from NOVA" });
  await dialog
    .getByRole("textbox", { name: "Ask NOVA a learning question" })
    .fill("What is a bond?");
  await dialog
    .getByRole("button", { name: "Send learning question", exact: true })
    .click();
  await expect(dialog.locator(".from-nova").last()).toContainText(
    "lend to a government or company",
  );
  await dialog
    .getByRole("button", { name: "Explore this lesson", exact: true })
    .last()
    .click();
  await expect(
    page.getByRole("heading", { name: "Bonds", exact: true }),
  ).toBeVisible();
  await launcher.click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "A little help from NOVA" }),
  ).toHaveCount(0);
  await expect(launcher).toBeFocused();
});

test("phone assistant sits above the app dock, remains in bounds and opens fraud practice", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterDemo(page);
  const launcher = page.getByRole("button", {
    name: "Open NOVA learning assistant",
    exact: true,
  });
  const nav = page.getByRole("navigation", { name: "App navigation" });
  const launcherBox = await launcher.boundingBox();
  const navBox = await nav.boundingBox();
  expect(launcherBox.y + launcherBox.height).toBeLessThanOrEqual(navBox.y);
  await launcher.click();
  const dialog = page.getByRole("dialog", { name: "A little help from NOVA" });
  const box = await dialog.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  expect(box.y + box.height).toBeLessThanOrEqual(navBox.y);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await dialog
    .getByRole("button", { name: "Spot a scam", exact: true })
    .click();
  await expect(dialog.locator(".from-nova").last()).toContainText(
    "independent evidence",
  );
  await dialog
    .getByRole("button", { name: "Practise checking a claim", exact: true })
    .click();
  await expect(page.locator(".fraud-screen")).toBeVisible();
  await expect(launcher).toHaveAttribute("aria-expanded", "false");
});
