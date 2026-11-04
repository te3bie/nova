import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { completeAssignments } from "./data/rewards.js";
const Context = createContext();
export const STORAGE_KEY = "nova.prototype.v1";
export function makeState(returning = false) {
  return {
    version: 1,
    onboarded: false,
    view: "home",
    payload: null,
    role: "student",
    profile: {
      name: "Alex",
      handle: "nova",
      region: "Greater Toronto Area",
      language: "en",
      goal: "First car",
      format: "Visual",
      joined: returning,
      confidence: "Beginner",
      claimHabit: "Check the original source",
    },
    stars: returning ? 500 : 0,
    hearts: 4,
    streak: returning ? 5 : 1,
    completed: returning ? ["welcome"] : [],
    lessonProgress: {},
    mastery: {},
    rewardLedger: returning
      ? [
          {
            id: "demo-opening",
            amount: 500,
            reason: "Seeded returning learner balance",
            date: "2026-11-04",
          },
        ]
      : [],
    assignments: [
      {
        id: "seed-stocks",
        title: "Your first share",
        type: "lesson",
        target: "stocks",
        due: "2026-11-12",
        instructions:
          "Learn how ownership works. Complete the Basics of Stocks practice and explain one risk.",
        status: "assigned",
      },
    ],
    saved: [],
    registrations: [],
    clicks: {},
    events: [],
    sim: { day: 4, trades: [], cash: 5000 },
    preferences: { reducedMotion: false, contrast: false },
    accountAttempts: [],
    fraudComplete: false,
  };
}
function load() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (value?.version === 1) return { ...makeState(), ...value };
  } catch {}
  return makeState();
}
export function AppProvider({ children }) {
  const [state, setState] = useState(load),
    [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      setNotice(
        "Local storage unavailable. Keep this tab open to retain your demo.",
      );
    }
  }, [state]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5500);
    return () => clearTimeout(timer);
  }, [notice]);
  const navigate = useCallback((view, payload = null) => {
    setState((s) => ({ ...s, view, payload }));
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() =>
      document.querySelector("main")?.focus({ preventScroll: true }),
    );
  }, []);
  const award = useCallback(
    (id, amount, reason) =>
      setState((s) =>
        s.rewardLedger.some((x) => x.id === id)
          ? s
          : {
              ...s,
              stars: s.stars + amount,
              rewardLedger: [
                { id, amount, reason, date: "2026-11-04" },
                ...s.rewardLedger,
              ],
              events: [...s.events, { type: "award", id, amount }],
            },
      ),
    [],
  );
  const completeTask = useCallback(
    (target) => setState((s) => completeAssignments(s, target)),
    [],
  );
  return (
    <Context.Provider
      value={{
        state,
        setState,
        navigate,
        award,
        completeTask,
        toast: setNotice,
      }}
    >
      {children}
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
    </Context.Provider>
  );
}
export function useApp() {
  return useContext(Context);
}
