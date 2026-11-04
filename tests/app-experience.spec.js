import { test, expect } from "@playwright/test";
const stateOf = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("nova.prototype.v1")));

test("branded launch builds and tumbles, accepts a block, then preserves gradient intro", async ({
  page,
}) => {
  await page.goto("/");
  const loader = page.getByTestId("launch-loader");
  await expect(loader).toBeVisible();
  await expect(loader.locator(".nova-launch-block")).toHaveCount(6);
  await loader
    .getByRole("button", { name: "Drop a block", exact: true })
    .click();
  await expect(loader.locator(".nova-launch-drop")).toHaveCount(1);
  await expect(
    loader.getByRole("img", { name: "NOVA — original wordmark" }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/nova-block-loading.png" });
  await expect(loader).toHaveCount(0);
  await expect(page.locator(".splash")).toBeVisible();
  await expect(
    page.getByText("Illuminating Your Path to Success.", { exact: true }),
  ).toBeVisible();
  const shape = page.locator(".splash-body .wordmark-shape");
  await expect(shape).toHaveCSS("mask-image", /nova-wordmark-white.svg/);
  await page.screenshot({
    path: "test-results/nova-original-gradient-intro.png",
  });
  await page.getByRole("button", { name: "Explore the student demo" }).click();
  await expect(page.locator(".sidebar")).toHaveCount(0);
  const nav = page.getByRole("navigation", { name: "App navigation" });
  await expect(nav).toBeVisible();
  const logoCenter = await page.locator(".stats-logo").boundingBox();
  expect(
    Math.abs(
      logoCenter.x + logoCenter.width / 2 - page.viewportSize().width / 2,
    ),
  ).toBeLessThan(1);
  const box = await nav.boundingBox();
  expect(box.y).toBeGreaterThan(800);
  await page.screenshot({
    path: "test-results/nova-app-desktop.png",
    fullPage: true,
  });
  await nav.getByRole("button", { name: "Class", exact: true }).click();
  await page.getByRole("tab", { name: "Leaderboard", exact: true }).click();
  for (const name of ["Aarav P.", "Imani B.", "Mei C.", "Sofía R."])
    await expect(
      page.locator(".leaderboard-row").filter({ hasText: name }),
    ).toBeVisible();
  await nav.getByRole("button", { name: "Settings", exact: true }).click();
  const before = await stateOf(page);
  await page.getByRole("button", { name: "Replay the loading screen" }).click();
  await expect(loader).toBeVisible();
  await loader.getByRole("button", { name: "Skip intro" }).click();
  await expect(
    page.getByRole("heading", { name: "A little more you." }),
  ).toBeVisible();
  expect((await stateOf(page)).stars).toBe(before.stars);
});

test("same bottom app navigation at 390px and reduced-motion launch remains calm", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Find my starting point" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explore the student demo" }).click();
  const nav = page.getByRole("navigation", { name: "App navigation" });
  await expect(nav).toBeVisible();
  const logoCenter = await page.locator(".stats-logo").boundingBox();
  expect(
    Math.abs(
      logoCenter.x + logoCenter.width / 2 - page.viewportSize().width / 2,
    ),
  ).toBeLessThan(1);
  await expect(page.locator(".sidebar")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await nav.getByRole("button", { name: "Simulate", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Three companies. Five days." }),
  ).toBeVisible();
  await nav.getByRole("button", { name: "Home", exact: true }).click();
  await expect(
    nav.getByRole("button", { name: "Home", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.screenshot({
    path: "test-results/nova-app-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "NOVA Pathways", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your NOVA Pathways", exact: true }),
  ).toBeVisible();
});
