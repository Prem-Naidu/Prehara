// The Prehara mark: a day split into eight praharas (watches). Filled arcs are periods done,
// the saffron arc is the one in progress. The same ring becomes the live "today" dial on the home page.

function arc(i, segs, gap, r, c) {
  const a0 = ((-90 + (i * 360) / segs + gap / 2) * Math.PI) / 180;
  const a1 = ((-90 + ((i + 1) * 360) / segs - gap / 2) * Math.PI) / 180;
  const p = (a) => `${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`;
  return `M${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}`;
}

export function Ring({ size = 34, segments = 8, done = 5, current = 5, width = 13, gap = 10, dot = true, animate = false, className = '', children }) {
  return (
    <div className={`ring ${animate ? 'ring-anim' : ''} ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        {Array.from({ length: segments }, (_, i) => (
          <path
            key={i}
            d={arc(i, segments, gap, 38, 50)}
            fill="none"
            strokeLinecap="round"
            strokeWidth={width}
            style={{ '--i': i }}
            className={i < done ? 'seg-done' : i === current ? 'seg-now' : 'seg-off'}
          />
        ))}
        {dot && <circle cx="50" cy="50" r="11" className="seg-dot" />}
      </svg>
      {children && <div className="ring-center">{children}</div>}
    </div>
  );
}

export default function Logo({ size = 34, sub }) {
  return (
    <div className="logo">
      <Ring size={size} />
      <div className="logo-text">
        <span className="wordmark">Prehara</span>
        {sub && <small>{sub}</small>}
      </div>
    </div>
  );
}
