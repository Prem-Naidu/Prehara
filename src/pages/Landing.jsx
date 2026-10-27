import { useState } from 'react';
import {
  GraduationCap, UserCheck, Building2, Sparkles, ShieldCheck, Check, Menu, X, Mail, Phone, MapPin,
} from 'lucide-react';
import Logo, { Ring } from '../components/Logo';
import { useStore } from '../store';

const PORTALS = [
  {
    role: 'student', icon: GraduationCap, name: 'Student portal', tint: 'iris',
    line: 'Everything a student checks before class, in one screen.',
    points: ['Today’s timetable and upcoming deadlines', 'Attendance per course with “classes you need” to reach 75%', 'Upload assignments and see graded feedback', 'Practice quizzes and a study assistant that cites the notes'],
  },
  {
    role: 'faculty', icon: UserCheck, name: 'Faculty portal', tint: 'saffron',
    line: 'Less paperwork between the bell and the evening.',
    points: ['Mark attendance with one switch per student', 'Grading queue with AI-drafted scores you approve', 'Publish assignments and quizzes in seconds', 'At-risk list with a ready message to each student'],
  },
  {
    role: 'admin', icon: Building2, name: 'Admin portal', tint: 'mint',
    line: 'The registrar sees the whole college and signs off on it.',
    points: ['Approve internal marks before students see them', 'Timetable clash detection with a proposed fix', 'User accounts with contact details masked by default', 'Full audit log of every sensitive action'],
  },
];

const AGENTS = [
  ['Study assistant', 'Answers from course notes and builds study plans', 'Every answer cites its source'],
  ['Grading assistant', 'Scores submissions against the rubric', 'Faculty approves each grade'],
  ['Quiz generator', 'Drafts questions from uploaded material', 'Faculty edits, then publishes'],
  ['At-risk monitor', 'Spots falling attendance or marks', 'Faculty sends or dismisses the message'],
  ['Operations agent', 'Finds timetable clashes', 'Registrar approves the change'],
];

const STAGES = [
  ['Portal and roles', 'Website, database and sign-in for admin, trainers, students and guests. Same pages, different access.'],
  ['Courses and content', 'Study material, embedded video lessons, course brochures and course purchase.'],
  ['Coding activity', 'Students link GitHub and coding platforms. Faculty see daily progress for each student.'],
  ['AI monitoring', 'Assistants that watch progress, help each student and turn data into reports.'],
  ['Code execution', 'Our own compiler so students run code inside the portal.'],
  ['Assessment platform', 'MCQ, coding, website-building and API testing rounds in one place.'],
];

const TODAY = [
  ['9:00', 'Operating Systems', 'done'],
  ['10:00', 'Discrete Mathematics', 'done'],
  ['11:15', 'Data Structures', 'now'],
  ['12:15', 'Professional Communication', 'next'],
  ['2:00', 'Operating Systems lab', 'next'],
];

export default function Landing() {
  const { notify } = useStore();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="site">
      <header className="site-header">
        <div className="wrap site-bar">
          <a href="#/" className="brand-link" aria-label="Prehara home"><Logo size={34} /></a>
          <nav className={`site-nav ${open ? 'open' : ''}`} aria-label="Main">
            <a href="#portals" onClick={close}>Portals</a>
            <a href="#ai" onClick={close}>AI assistants</a>
            <a href="#rollout" onClick={close}>Rollout</a>
            <a href="#contact" onClick={close}>Contact</a>
            <a href="#/login" className="btn primary" onClick={close}>Open the demo</a>
          </nav>
          <button className="icon-btn nav-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="hero-kicker"><Ring size={18} dot={false} width={16} /> Learning portal for colleges and training cells</p>
            <h1>Run every class period from one portal.</h1>
            <p className="hero-sub">
              Prehara gives students, faculty and the registrar one place for courses, attendance, assessments and results.
              AI assistants draft the routine work, and a person approves it before anything goes out.
            </p>
            <div className="hero-cta">
              <a href="#/login" className="btn primary lg">Try the live demo</a>
              <a href="#portals" className="btn lg">See what each role gets</a>
            </div>
            <ul className="hero-facts">
              <li><Check size={16} /> Works on phones and lab PCs</li>
              <li><Check size={16} /> Runs in any browser, nothing to install</li>
              <li><Check size={16} /> Pilot with one department first</li>
            </ul>
          </div>

          <div className="hero-visual" aria-label="Example of a student’s day in Prehara">
            <div className="dial-card">
              <Ring size={300} segments={5} done={2} current={2} width={11} gap={8} dot={false} animate className="dial">
                <span className="dial-label">In session</span>
                <strong>Data Structures</strong>
                <span className="dial-meta">11:15, Room R101</span>
              </Ring>
              <ol className="dial-list">
                {TODAY.map(([t, n, s]) => (
                  <li key={t} className={s}>
                    <span className="dl-t">{t}</span>
                    <span className="dl-n">{n}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="float-note n1">
              <Sparkles size={15} />
              <div><b>Attendance agent</b><span>CS303 is at 64%. Attend the next 12 classes to reach 75%.</span></div>
            </div>
            <div className="float-note n2">
              <ShieldCheck size={15} />
              <div><b>Waiting for Dr. Ravi Kumar</b><span>4 grades drafted. None sent until he approves.</span></div>
            </div>
          </div>
        </section>

        <section id="portals" className="band">
          <div className="wrap">
            <div className="section-head">
              <h2>Three portals, one record</h2>
              <p>Attendance marked by a teacher shows up for the student and the registrar at the same moment. Nobody copies data between registers and spreadsheets.</p>
            </div>
            <div className="portal-grid">
              {PORTALS.map(({ role, icon: Icon, name, tint, line, points }) => (
                <article key={role} className={`portal-card t-${tint}`}>
                  <span className="pc-icon"><Icon size={22} /></span>
                  <h3>{name}</h3>
                  <p className="pc-line">{line}</p>
                  <ul>{points.map((p) => <li key={p}><Check size={15} /> {p}</li>)}</ul>
                  <a className="btn" href={`#/login?role=${role}`}>Open {name.toLowerCase()}</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ai" className="wrap split">
          <div className="section-head left">
            <h2>AI drafts the work. People decide.</h2>
            <p>
              Each assistant works inside one role and stops at a checkpoint. The registrar can switch any of them off,
              and every action lands in the audit log.
            </p>
            <a href="#/login?role=admin" className="btn">See the agent controls</a>
          </div>
          <div className="agent-table" role="table" aria-label="AI assistants and their checks">
            <div className="at-row at-head" role="row">
              <span role="columnheader">Assistant</span><span role="columnheader">What it does</span><span role="columnheader">Human check</span>
            </div>
            {AGENTS.map(([n, d, c]) => (
              <div className="at-row" role="row" key={n}>
                <span role="cell" className="at-name"><Sparkles size={14} /> {n}</span>
                <span role="cell">{d}</span>
                <span role="cell" className="at-check"><ShieldCheck size={14} /> {c}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="rollout" className="band soft">
          <div className="wrap">
            <div className="section-head">
              <h2>How we roll it out</h2>
              <p>Stage 1 is what you can click through in the demo today. Each stage after that ships on its own, so the college uses Prehara from the first month.</p>
            </div>
            <ol className="stages">
              {STAGES.map(([t, d], i) => (
                <li key={t} className={i === 0 ? 'live' : ''}>
                  <span className="st-n">{i + 1}</span>
                  <div>
                    <h3>{t} {i === 0 && <span className="pill ok">Ready to demo</span>}</h3>
                    <p>{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contact" className="wrap contact">
          <div>
            <h2>Start with one department for one semester</h2>
            <p>We set up the portal, import your student list from a spreadsheet and train faculty in a single session. You decide after the semester whether to roll it out to every branch.</p>
            <ul className="contact-list">
              <li><Mail size={16} /> hello@prehara.demo</li>
              <li><Phone size={16} /> +91 00000 00000</li>
              <li><MapPin size={16} /> Andhra Pradesh and Telangana</li>
            </ul>
          </div>
          <form
            className="card contact-form"
            onSubmit={(e) => { e.preventDefault(); setSent(true); e.target.reset(); notify('Request sent. We will call you within two working days.'); }}
          >
            <h3>Book a walkthrough</h3>
            <label>Your name<input name="name" required autoComplete="name" /></label>
            <label>College<input name="college" required /></label>
            <label>Phone or email<input name="contact" required /></label>
            <label>Students in the pilot department<input name="size" type="number" min="1" placeholder="e.g. 240" /></label>
            <button className="btn primary">Request a walkthrough</button>
            {sent && <p className="muted small">Thanks. Our team will reach out shortly.</p>}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap foot">
          <Logo size={28} sub="Learning, period by period" />
          <p className="muted small">© {new Date().getFullYear()} Prehara. Industry-level training for college students and freshers.</p>
        </div>
      </footer>
    </div>
  );
}
