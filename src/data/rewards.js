/** Complete matching activities and reward each assignment once, independently of lesson awards. */
export function completeAssignments(state, target) {
  const finished = state.assignments.filter(
    (a) => a.target === target && a.status !== "complete",
  );
  if (!finished.length) return state;
  const additions = finished
    .filter(
      (a) => !state.rewardLedger.some((r) => r.id === `assignment:${a.id}`),
    )
    .map((a) => ({
      id: `assignment:${a.id}`,
      amount: 25,
      reason: `Assignment complete: ${a.title}`,
      date: "2026-11-04",
    }));
  return {
    ...state,
    assignments: state.assignments.map((a) =>
      a.target === target ? { ...a, status: "complete" } : a,
    ),
    stars: state.stars + additions.reduce((sum, r) => sum + r.amount, 0),
    rewardLedger: [...additions, ...state.rewardLedger],
    events: [
      ...state.events,
      ...finished.map((a) => ({ type: "assignment_complete", target: a.id })),
    ],
  };
}
