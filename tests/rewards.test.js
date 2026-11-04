import test from "node:test";
import assert from "node:assert/strict";
import { completeAssignments } from "../src/data/rewards.js";
test("assignment awards and status change atomically once, with matching tasks only", () => {
  const before = {
    stars: 500,
    rewardLedger: [],
    events: [],
    assignments: [
      { id: "a", title: "A", target: "stocks", status: "assigned" },
      { id: "b", title: "B", target: "accounts", status: "assigned" },
    ],
  };
  const after = completeAssignments(before, "stocks");
  assert.equal(after.stars, 525);
  assert.equal(after.assignments[0].status, "complete");
  assert.equal(after.assignments[1].status, "assigned");
  assert.equal(before.stars, 500);
  assert.equal(before.assignments[0].status, "assigned");
  assert.equal(after.rewardLedger[0].id, "assignment:a");
  assert.deepEqual(completeAssignments(after, "stocks"), after);
});
test("multiple assigned activities get separate ledger rewards without promotional or trading awards", () => {
  const before = {
    stars: 0,
    rewardLedger: [],
    events: [],
    assignments: [
      { id: "a", title: "Practice", target: "stocks", status: "assigned" },
      { id: "b", title: "Review", target: "stocks", status: "assigned" },
    ],
  };
  const after = completeAssignments(before, "stocks");
  assert.equal(after.stars, 50);
  assert.equal(after.rewardLedger.length, 2);
  assert.equal(completeAssignments(before, "sponsored-click"), before);
});
