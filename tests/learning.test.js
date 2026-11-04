import test from "node:test";
import assert from "node:assert/strict";
import {
  recordConceptAttempt,
  isPathwayFinished,
  stockQuestions,
} from "../src/data/lessons.js";

test("practice tracks a misconception, then a corrected concept without losing attempt history", () => {
  const initial = {
    hearts: 4,
    mastery: { unrelated: { attempts: 1, lastCorrect: true } },
    events: [],
  };
  const wrong = recordConceptAttempt(initial, stockQuestions[0], 0);
  assert.equal(wrong.hearts, 3);
  assert.equal(wrong.mastery.ownership.lastCorrect, false);
  assert.equal(wrong.mastery.ownership.attempts, 1);
  const corrected = recordConceptAttempt(wrong, stockQuestions[0], 1);
  assert.equal(corrected.hearts, 3);
  assert.deepEqual(
    {
      attempts: corrected.mastery.ownership.attempts,
      correct: corrected.mastery.ownership.correct,
      lastCorrect: corrected.mastery.ownership.lastCorrect,
    },
    { attempts: 2, correct: 1, lastCorrect: true },
  );
  assert.deepEqual(corrected.mastery.unrelated, initial.mastery.unrelated);
  assert.equal(initial.hearts, 4);
  assert.equal(initial.mastery.ownership, undefined);
  assert.equal(corrected.events.length, 2);
});

test("practice never blocks learning with negative hearts and still records attempts", () => {
  const state = { hearts: 0, mastery: {}, events: [] };
  const next = recordConceptAttempt(state, stockQuestions[1], 0);
  assert.equal(next.hearts, 0);
  assert.equal(next.mastery.uncertainty.attempts, 1);
  assert.equal(next.mastery.uncertainty.lastCorrect, false);
});

test("a pathway completes only when its own ordered nodes are finished", () => {
  const state = {
    completed: [],
    lessonProgress: {
      "welcome:start": { completed: true },
      "styles:risk": { completed: true },
      "investments:overview": { completed: true },
      "investments:stocks": { completed: true },
      "investments:bonds": { completed: true },
      "investments:mutual-funds": { completed: true },
      "investments:etfs": { completed: true },
    },
  };
  assert.equal(isPathwayFinished(state, "investments", "gics"), false);
  const almost = {
    ...state,
    lessonProgress: {
      ...state.lessonProgress,
      "investments:real-estate": { completed: true },
    },
  };
  assert.equal(isPathwayFinished(almost, "investments", "gics"), true);
  assert.equal(isPathwayFinished(almost, "styles", "long-term"), false);
  assert.equal(isPathwayFinished(almost, "missing", "gics"), false);
});

test("claim inspection evaluates the evidence and allows recovery from unsupported flags", async () => {
  const { evaluateRedFlags } = await import("../src/data/lessons.js");
  const post = {
    flags: ["Guaranteed returns", "Urgency and FOMO", "Private information"],
  };
  assert.equal(
    evaluateRedFlags(post, ["Unrelated", "Missing date"]).canContinue,
    false,
  );
  assert.equal(
    evaluateRedFlags(post, ["Guaranteed returns"]).canContinue,
    false,
  );
  const mixed = evaluateRedFlags(post, [
    "Guaranteed returns",
    "Urgency and FOMO",
    "Unrelated",
  ]);
  assert.equal(mixed.canContinue, false);
  assert.deepEqual(mixed.unsupported, ["Unrelated"]);
  assert.equal(
    evaluateRedFlags(post, ["Guaranteed returns", "Urgency and FOMO"])
      .canContinue,
    true,
  );
});
