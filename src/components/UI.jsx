import React, { useEffect, useRef } from "react";
const paths = {
  pause: "M8 5v14M16 5v14",
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  book: "M12 5v16M3 3c4-1 6 0 9 2 3-2 5-3 9-2v16c-4-1-6 0-9 2-3-2-5-3-9-2Z",
  chart: "M4 3v17h17M7 13l4-4 4 2 6-7M17 4h4v4",
  compass: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3a4 4 0 0 1 0 8",
  settings:
    "m9 3-1 3-3 1-2 3 2 2-1 3 2 3 3-1 3 3 3-1 1-3 3-1 2-3-2-2 1-3-2-3-3 1-3-3ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  chevron: "m9 5 7 7-7 7",
  check: "m5 12 4 4L19 6",
  star: "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
  flame:
    "M12 2c2 5-4 6-2 10 3-1 4-4 4-4 6 5 5 13-2 14C3 22 1 13 7 8c-1 5 2 6 2 6-2-7 3-8 3-12Z",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M6 18 18 6",
  play: "m8 4 12 8-12 8Z",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  filter: "M3 5h18M6 12h12M10 19h4",
  bookmark: "M6 3h12v18l-6-4-6 4Z",
  external: "M14 3h7v7m-9 2 9-9M10 3H3v18h18v-7",
  crown: "m2 6 5 4 5-7 5 7 5-4-3 13H5ZM5 22h14",
  clock: "M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Zm-4 10 3 3 5-6",
  info: "M12 11v6m0-10v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  copy: "M9 9h12v12H9ZM5 15H3V3h12v2",
  trophy:
    "M8 3h8v8a4 4 0 0 1-8 0ZM8 5H3v3a4 4 0 0 0 5 4M16 5h5v3a4 4 0 0 1-5 4M12 15v6m-5 0h10",
  globe:
    "M2 12h20M12 2a17 17 0 0 1 0 20 17 17 0 0 1 0-20M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  target:
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  wallet: "M21 7V4H3v16h18V7H3m18 4h-6v5h6",
  logout: "M9 3H3v18h6M8 12h13m-5-5 5 5-5 5",
  volume: "M11 3 6 8H2v8h4l5 5ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14",
  refresh:
    "M21 3v6h-6M3 21v-6h6M5 7a8 8 0 0 1 13-2l3 4M3 15l3 4a8 8 0 0 0 13-2",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  mail: "M3 4h18v16H3Zm0 0 9 9 9-9",
  calendar: "M3 5h18v16H3ZM7 2v6m10-6v6M3 11h18",
  lightbulb: "M9 18h6m-5 4h4M8 15a7 7 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3",
  leaf: "M3 21 17 7M3 15C2 3 15 3 21 3c0 11-2 18-13 15",
  rocket:
    "m9 15-4-4C8 5 13 2 22 2c0 9-3 14-9 17l-4-4Zm-4-4-3 1v5h5m6 2-1 3H7v-5M16 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
  lock: "M5 10h14v12H5ZM8 10V6a4 4 0 0 1 8 0v4",
  arrowLeft: "M20 12H4m6-6-6 6 6 6",
};
export function Icon({
  name = "compass",
  size = 20,
  className = "",
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.compass} />
    </svg>
  );
}
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function Badge({ children, tone = "blue" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
export function Progress({ value, label }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-label={label || "Learning progress"}
    >
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
export function PageTitle({ eyebrow, title, children, action }) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {children && <p className="muted">{children}</p>}
      </div>
      {action}
    </div>
  );
}
export function EmptyState({ title, children, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name="compass" size={34} />
      </span>
      <h3>{title}</h3>
      <p className="muted">{children}</p>
      {action}
    </div>
  );
}
export function Modal({ title, children, onClose }) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const items = ref.current?.querySelectorAll(
          'button,a[href],input,select,textarea,[tabindex="0"]',
        );
        if (!items?.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={ref}
        tabIndex={-1}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <button
            className="icon-btn"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function Logo({ compact = false }) {
  return (
    <span
      className={`wordmark ${compact ? "compact" : ""}`}
      role="img"
      aria-label="NOVA — original wordmark"
    >
      <span className="wordmark-shape" aria-hidden="true" />
    </span>
  );
}
export function Illustration({ type = "investments", className = "" }) {
  return (
    <svg
      className={`illustration ${className}`}
      viewBox="0 0 320 250"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`blue-${type}`} x1="50" y1="0" x2="270" y2="240">
          <stop stopColor="#70d8ff" />
          <stop offset="1" stopColor="#2a68ed" />
        </linearGradient>
      </defs>
      <ellipse
        cx="165"
        cy="215"
        rx="124"
        ry="16"
        fill="#0754c8"
        opacity=".07"
      />
      <ellipse
        cx="164"
        cy="130"
        rx="135"
        ry="78"
        stroke="#7bc5f0"
        strokeDasharray="4 7"
        transform="rotate(-24 164 130)"
      />
      <circle cx="166" cy="122" r="88" fill="#fff" opacity=".55" />
      <g transform="rotate(-8 150 140)">
        <rect
          x="73"
          y="73"
          width="159"
          height="124"
          rx="16"
          fill={`url(#blue-${type})`}
        />
        <rect x="88" y="89" width="129" height="92" rx="9" fill="#eff9ff" />
        <path
          d="M100 158h105M106 158v-19h15v19m12 0v-40h15v40m13 0V99h15v59m13 0v-68h15v68"
          stroke="#3271ec"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="m102 129 32-23 28 6 38-30"
          stroke="#08b8d6"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <g transform="rotate(14 239 177)">
        <rect x="203" y="143" width="63" height="73" rx="12" fill="#ffcc58" />
        <circle cx="235" cy="179" r="20" stroke="#edab2c" strokeWidth="3" />
        <path
          d="m235 163 4 10 10 1-8 7 2 10-8-5-9 5 2-10-7-7 10-1Z"
          fill="#fff6cd"
        />
      </g>
      <circle cx="71" cy="67" r="20" fill="#fff" />
      <path d="m71 54 3 10 10 3-10 3-3 10-3-10-10-3 10-3Z" fill="#2377ed" />
      <circle cx="264" cy="84" r="9" fill="#64cedb" />
      <circle cx="51" cy="174" r="5" fill="#6c98ef" />
      <path d="m254 33 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#f4b93f" />
    </svg>
  );
}
