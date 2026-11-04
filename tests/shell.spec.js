import { test, expect } from "@playwright/test";

test("desktop menu, private rank, offline learning and fresh reset remain functional", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the student demo" }).click();
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  let dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Your NOVA space");
  await dialog.getByRole("button", { name: "Class", exact: true }).click();
  await page.getByRole("tab", { name: "Leaderboard", exact: true }).click();
  const own = page.locator(".leaderboard-you");
  await expect(own.locator(".rank-number")).toHaveText("3");
  await page.getByRole("button", { name: "Home", exact: true }).click();
  await context.setOffline(true);
  await expect(page.getByRole("status")).toContainText("You’re offline");
  await page.getByRole("button", { name: "Let’s learn", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Basics of Stocks", exact: true }),
  ).toBeVisible();
  await context.setOffline(false);
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page
    .getByRole("button", { name: "Reset all demo data", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reset demo & return to splash", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Find my starting point" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Find my starting point" }).click();
  await page.getByRole("button", { name: "Skip quiz", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "0 earned Stars. Reward ledger" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Simulate", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Activate challenge", exact: true }),
  ).toBeDisabled();
});

test("narrow 320px routes, phone lesson, Finder and teacher have no page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the student demo" }).click();
  const noOverflow = async () => {
    const result = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      offenders: [...document.querySelectorAll("body *")]
        .filter(
          (el) =>
            el.getBoundingClientRect().right > innerWidth + 1 &&
            getComputedStyle(el).position !== "fixed",
        )
        .map((el) => ({
          tag: el.tagName,
          cls: el.className,
          right: Math.round(el.getBoundingClientRect().right),
        }))
        .slice(0, 16),
    }));
    expect(result.scroll, JSON.stringify(result)).toBeLessThanOrEqual(
      result.width,
    );
  };
  await noOverflow();
  await page
    .locator(".bottom-nav")
    .getByRole("button", { name: "Discover", exact: true })
    .click();
  await noOverflow();
  await expect(
    page.getByRole("textbox", { name: "Search opportunities" }),
  ).toBeVisible();
  await page
    .locator(".bottom-nav")
    .getByRole("button", { name: "Class", exact: true })
    .click();
  await noOverflow();
  await page.getByRole("button", { name: "Teacher demo", exact: true }).click();
  await noOverflow();
  await expect(
    page.getByRole("button", { name: "Assign activity", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/nova-narrow-teacher.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Student demo", exact: true }).click();
  await page
    .locator(".bottom-nav")
    .getByRole("button", { name: "Home", exact: true })
    .click();
  await noOverflow();
  await page.screenshot({
    path: "test-results/nova-mobile-dashboard.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Let’s learn", exact: true }).click();
  await noOverflow();
  await page.getByRole("button", { name: "Try the knowledge check" }).click();
  await page.locator(".answer-options .answer-button").nth(1).click();
  await noOverflow();
  await page.screenshot({
    path: "test-results/nova-mobile-lesson.png",
    fullPage: true,
  });
});
