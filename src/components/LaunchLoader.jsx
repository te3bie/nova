import React, { useEffect, useRef, useState } from "react";
import { Logo, Icon } from "./UI.jsx";
import "./launch-loader.css";

const BLOCKS = [
  { x: 57, y: 0, tone: "sky", fall: -92, turn: -48 },
  { x: 113, y: 0, tone: "blue", fall: -30, turn: -21 },
  { x: 169, y: 0, tone: "aqua", fall: 102, turn: 43 },
  { x: 85, y: 43, tone: "ice", fall: -67, turn: -64 },
  { x: 141, y: 43, tone: "sky", fall: 69, turn: 66 },
  { x: 113, y: 86, tone: "gold", fall: 32, turn: 35 },
];

function Cube({ tone = "sky", star = false }) {
  return (
    <svg viewBox="0 0 80 88" fill="none" aria-hidden="true">
      <path className={`launch-cube-left ${tone}`} d="M3 24 40 45v40L3 64Z" />
      <path
        className={`launch-cube-right ${tone}`}
        d="m40 45 37-21v40L40 85Z"
      />
      <path className={`launch-cube-top ${tone}`} d="M40 3 77 24 40 45 3 24Z" />
      <path
        d="m3 24 37 21 37-21M40 45v40"
        stroke="#fff"
        strokeOpacity=".27"
        strokeWidth="1.1"
      />
      {star ? (
        <path
          d="m21 39 3 8 7 4-6 2 1 8-5-7-6-1 2-6-2-8Z"
          fill="#fff7d4"
          opacity=".95"
        />
      ) : (
        <path
          d="m12 39 18 10m-18-4 12 7"
          stroke="white"
          strokeOpacity=".55"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/**
 * A real boot interlude: waits for fonts and optional app preparation, with a
 * short animation window. Every refresh can show this without changing learner
 * progress. A remount also works as a replay from Settings.
 */
export default function LaunchLoader({
  onComplete,
  reducedMotion = false,
  preparation,
  duration = 2400,
}) {
  const [systemReduced, setSystemReduced] = useState(
    () =>
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false,
  );
  const [drops, setDrops] = useState([]);
  const completeRef = useRef(onComplete);
  const brandRef = useRef(null);
  const completed = useRef(false);
  const dropId = useRef(0);
  const gentle = reducedMotion || systemReduced;
  completeRef.current = onComplete;

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const change = () => setSystemReduced(!!media?.matches);
    media?.addEventListener?.("change", change);
    return () => media?.removeEventListener?.("change", change);
  }, []);

  function finish() {
    if (completed.current) return;
    completed.current = true;
    completeRef.current?.();
  }

  useEffect(() => {
    let mounted = true;
    const timers = [];
    const wait = (milliseconds) =>
      new Promise((resolve) => {
        timers.push(setTimeout(resolve, milliseconds));
      });
    const logoImages = [
      ...(brandRef.current?.querySelectorAll("img") || []),
    ].map((image) => {
      if (image.complete && image.naturalWidth) return Promise.resolve();
      if (image.decode) return image.decode();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    });
    const ready = Promise.allSettled([
      ...logoImages,
      document.fonts?.ready || Promise.resolve(),
      preparation || Promise.resolve(),
    ]);
    const animationWindow = gentle
      ? 280
      : Math.max(1200, Math.min(duration, 3000));
    Promise.all([
      wait(animationWindow),
      Promise.race([ready, wait(gentle ? 280 : 3000)]),
    ]).then(() => {
      if (mounted) finish();
    });
    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, [gentle, preparation, duration]);

  function dropBlock() {
    const id = ++dropId.current;
    setDrops((current) => [
      ...current.slice(-5),
      {
        id,
        x: 68 + (id % 4) * 34,
        tone: id % 3 === 0 ? "gold" : id % 2 ? "ice" : "aqua",
      },
    ]);
  }

  return (
    <div
      className={`nova-launch ${gentle ? "nova-launch-gentle" : ""}`}
      data-testid="launch-loader"
    >
      <div
        className="nova-launch-orbit nova-launch-orbit-one"
        aria-hidden="true"
      />
      <div
        className="nova-launch-orbit nova-launch-orbit-two"
        aria-hidden="true"
      />
      <header className="nova-launch-header">
        <span className="nova-launch-word">
          A LITTLE CURIOSITY GOES A LONG WAY
        </span>
        <button type="button" className="nova-launch-skip" onClick={finish}>
          Skip intro <Icon name="arrow" size={15} />
        </button>
      </header>
      <div className="nova-launch-content">
        <div className="nova-launch-brand" ref={brandRef}>
          <Logo />
        </div>
        <p className="nova-launch-tagline">
          Illuminating Your Path to Success.
        </p>
        <button
          type="button"
          className="nova-launch-play"
          aria-label="Drop a block"
          onClick={dropBlock}
        >
          <span className="nova-launch-stage" aria-hidden="true">
            <span className="nova-launch-halo" />
            <span className="nova-launch-ground" />
            {BLOCKS.map((block, index) => (
              <span
                className="nova-launch-block"
                key={index}
                style={{
                  left: block.x,
                  bottom: block.y + 22,
                  "--block-delay": `${index * 0.105}s`,
                  "--block-fall": `${block.fall}px`,
                  "--block-turn": `${block.turn}deg`,
                }}
              >
                <Cube tone={block.tone} star={index === 5} />
              </span>
            ))}
            {drops.map((block) => (
              <span
                className="nova-launch-drop"
                key={block.id}
                style={{
                  left: block.x,
                  "--drop-turn": `${block.id % 2 ? -78 : 68}deg`,
                  "--drop-drift": `${block.id % 2 ? -100 : 100}px`,
                }}
              >
                <Cube tone={block.tone} star />
              </span>
            ))}
            <span className="nova-launch-spark spark-one">✦</span>
            <span className="nova-launch-spark spark-two">✧</span>
            <span className="nova-launch-spark spark-three">✦</span>
          </span>
          <span className="nova-launch-play-hint">
            <Icon name="plus" size={13} /> Tap to drop a little possibility
          </span>
        </button>
        <div className="nova-launch-status" role="status" aria-live="polite">
          <span className="nova-launch-status-dot" aria-hidden="true" />
          Getting your learning space ready
        </div>
        <p className="nova-launch-note">
          Big things start with little building blocks.
        </p>
      </div>
      <footer className="nova-launch-footer">
        <span>LEARN. TRY. GROW.</span>
        <span>Your next chapter is taking shape.</span>
      </footer>
    </div>
  );
}
