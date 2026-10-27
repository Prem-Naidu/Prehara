import { useState } from 'react';
import { ArrowLeft, GraduationCap, UserCheck, Building2, Eye, EyeOff } from 'lucide-react';
import Logo, { Ring } from '../components/Logo';
import { useStore, log } from '../store';
import { ACCOUNTS } from '../data/sample';
import { navigate } from '../lib';

const ROLES = [
  ['student', 'Student', GraduationCap],
  ['faculty', 'Faculty', UserCheck],
  ['admin', 'Admin', Building2],
];

const roleFromHash = () => {
  const m = window.location.hash.match(/role=(student|faculty|admin)/);
  return m ? m[1] : 'student';
};

export default function Login() {
  const { state, update } = useStore();
  const [mode, setMode] = useState('in');
  const [role, setRole] = useState(roleFromHash);
  const [email, setEmail] = useState(ACCOUNTS[roleFromHash()].email);
  const [pw, setPw] = useState('demo123');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');

  const pick = (r) => { setRole(r); setEmail(ACCOUNTS[r].email); setPw('demo123'); setErr(''); };

  const signIn = (e) => {
    e.preventDefault();
    const em = email.trim().toLowerCase();
    const a = state.accounts.find((x) => x.email === em && x.pw === pw && x.role === role);
    if (!a) { setErr('Email, password or role is not correct. Use a demo account or create one.'); return; }
    update((n) => { n.session = { user: a.name, role }; log(n, a.name, 'Signed in'); });
    navigate('/app');
  };

  const signUp = (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const em = String(d.get('email')).trim().toLowerCase();
    const nm = String(d.get('name')).trim();
    const r = d.get('role');
    if (state.accounts.some((x) => x.email === em)) return setErr('An account with this email already exists. Sign in instead.');
    if (d.get('pw') !== d.get('pw2')) return setErr('The two passwords do not match.');
    if (String(d.get('pw')).length < 6) return setErr('Use at least 6 characters for the password.');
    update((n) => {
      n.accounts.push({ email: em, pw: d.get('pw'), name: nm, role: r });
      n.users.push({ name: nm, email: em, role: r[0].toUpperCase() + r.slice(1), active: true });
      log(n, nm, `Created a ${r} account`);
      n.session = { user: nm, role: r };
    });
    navigate('/app');
  };

  return (
    <div className="auth">
      <aside className="auth-side">
        <a href="#/" className="auth-back"><ArrowLeft size={16} /> Back to website</a>
        <div className="auth-art">
          <Ring size={220} done={5} current={5} width={12} animate />
        </div>
        <div className="auth-quote">
          <h2>Learning, period by period.</h2>
          <p>A prahara is one watch of the day. Prehara keeps every one of them on record, from the first bell to the last lab.</p>
        </div>
      </aside>

      <main className="auth-main">
        {mode === 'in' ? (
          <form className="auth-form" onSubmit={signIn}>
            <Logo size={38} sub="Sign in to your portal" />
            <div className="role-pick" role="radiogroup" aria-label="I am signing in as">
              {ROLES.map(([r, label, Icon]) => (
                <button type="button" role="radio" aria-checked={role === r} key={r} className={role === r ? 'on' : ''} onClick={() => pick(r)}>
                  <Icon size={18} /> {label}
                </button>
              ))}
            </div>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" /></label>
            <label>Password
              <span className="pw">
                <input type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} required autoComplete="current-password" />
                <button type="button" className="icon-btn" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>
            {err && <p className="err" role="alert">{err}</p>}
            <button className="btn primary lg">Sign in</button>
            <p className="demo-hint">Demo accounts are filled in for you. Password for all three: <b>demo123</b></p>
            <button type="button" className="link-btn" onClick={() => { setMode('up'); setErr(''); }}>New here? Create an account</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={signUp}>
            <Logo size={38} sub="Create your account" />
            <label>Full name<input name="name" required autoComplete="name" /></label>
            <label>Email<input type="email" name="email" required autoComplete="username" /></label>
            <label>I am a
              <select name="role"><option value="student">Student</option><option value="faculty">Faculty</option></select>
            </label>
            <div className="two">
              <label>Password<input type="password" name="pw" minLength={6} required autoComplete="new-password" /></label>
              <label>Confirm password<input type="password" name="pw2" minLength={6} required autoComplete="new-password" /></label>
            </div>
            {err && <p className="err" role="alert">{err}</p>}
            <button className="btn primary lg">Create account</button>
            <p className="demo-hint">New accounts open with the same sample courses as the demo. Admin accounts are created by the registrar.</p>
            <button type="button" className="link-btn" onClick={() => { setMode('in'); setErr(''); }}>I already have an account</button>
          </form>
        )}
      </main>
    </div>
  );
}
