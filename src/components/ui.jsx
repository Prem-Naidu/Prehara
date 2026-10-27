import { Sparkles } from 'lucide-react';

export const Pill = ({ k = '', children }) => <span className={`pill ${k}`}>{children}</span>;

export const Bar = ({ p, k = '' }) => (
  <div className={`bar ${k}`} role="img" aria-label={`${p}%`}>
    <i style={{ width: `${p}%` }} />
  </div>
);

export const Card = ({ title, action, className = '', children, ...rest }) => (
  <section className={`card ${className}`} {...rest}>
    {(title || action) && (
      <div className="card-head">
        {title && <h2>{title}</h2>}
        {action}
      </div>
    )}
    {children}
  </section>
);

export const PageHead = ({ title, sub, right }) => (
  <div className="page-head">
    <div>
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </div>
    {right}
  </div>
);

export const Stat = ({ icon: Icon, value, label, k = '' }) => (
  <div className={`card stat ${k}`}>
    {Icon && <span className="stat-ic"><Icon size={18} /></span>}
    <div className="stat-n">{value}</div>
    <div className="stat-l">{label}</div>
  </div>
);

export const Switch = ({ checked, onChange, label }) => (
  <span className="sw">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
    <span />
  </span>
);

export const AiNote = ({ tag, children, className = '' }) => (
  <div className={`ai ${className}`}>
    <div className="ai-tag"><Sparkles size={14} /> {tag}</div>
    {children}
  </div>
);

export const Empty = ({ children }) => <p className="muted empty">{children}</p>;

export const Avatar = ({ name, k = 'iris' }) => {
  const parts = name.replace(/^(Dr\.|Prof\.|Ms\.|Mr\.)\s*/, '').split(' ');
  const ini = parts.map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return <span className={`avatar ${k}`}>{ini}</span>;
};
