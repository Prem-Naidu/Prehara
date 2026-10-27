import { useState } from 'react';
import {
  LayoutDashboard, BookOpen, CalendarCheck, FileText, ClipboardList, Award, Sparkles, Users, CalendarClock,
  ShieldCheck, Bot, ScrollText, ClipboardCheck, FilePlus2, TriangleAlert, Menu, X, LogOut, Bell, BarChart3,
} from 'lucide-react';
import Logo from '../components/Logo';
import { Avatar } from '../components/ui';
import { useStore, log } from '../store';
import { navigate, atRisk, clashes } from '../lib';
import Student from '../portals/Student';
import Faculty from '../portals/Faculty';
import Admin from '../portals/Admin';

const NAV = {
  student: [
    ['dashboard', 'Dashboard', LayoutDashboard], ['courses', 'My courses', BookOpen], ['attendance', 'Attendance', CalendarCheck],
    ['assignments', 'Assignments', FileText], ['exams', 'Exams and quizzes', ClipboardList], ['results', 'Results', Award],
    ['assistant', 'Study assistant', Sparkles],
  ],
  faculty: [
    ['dashboard', 'Dashboard', LayoutDashboard], ['attendance', 'Mark attendance', CalendarCheck], ['grading', 'Grading queue', ClipboardCheck],
    ['create', 'New assessment', FilePlus2], ['marks', 'Marks entry', BarChart3], ['risk', 'At-risk monitor', TriangleAlert],
  ],
  admin: [
    ['dashboard', 'Overview', LayoutDashboard], ['users', 'Users', Users], ['timetable', 'Timetable', CalendarClock],
    ['approvals', 'Result approvals', ShieldCheck], ['agents', 'AI agents', Bot], ['audit', 'Audit log', ScrollText],
  ],
};

const VIEWS = { student: Student, faculty: Faculty, admin: Admin };
const PORTAL_NAME = { student: 'Student portal', faculty: 'Faculty portal', admin: 'Admin portal' };
const TINT = { student: 'iris', faculty: 'saffron', admin: 'mint' };

export default function Portal() {
  const { state, update } = useStore();
  const { role, user } = state.session;
  const [view, setView] = useState('dashboard');
  const [menu, setMenu] = useState(false);

  const go = (v) => { setView(v); setMenu(false); window.scrollTo(0, 0); };
  const View = VIEWS[role][view];
  const current = NAV[role].find((n) => n[0] === view);

  // Badge counts on the nav so the important queues are visible from anywhere
  const badges = {
    student: { assignments: state.assignments.filter((a) => a.status === 'pending').length },
    faculty: {
      grading: state.queue.filter((q) => q.status === 'review').length,
      risk: atRisk(state.students).filter((x) => !x.s.nudge).length,
    },
    admin: {
      approvals: Object.values(state.approvals).filter((s) => s === 'pending').length,
      timetable: clashes(state.tt).length,
    },
  }[role];
  const alertCount = Object.values(badges).reduce((a, b) => a + b, 0);

  const signOut = () => {
    update((n) => { log(n, user, 'Signed out'); n.session = null; });
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className={`shell tint-${TINT[role]}`}>
      <aside className={`side ${menu ? 'open' : ''}`} aria-label="Portal navigation">
        <div className="side-top">
          <a href="#/" aria-label="Prehara website"><Logo size={32} /></a>
          <button className="icon-btn side-close" onClick={() => setMenu(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="side-portal">{PORTAL_NAME[role]}</div>
        <nav className="side-nav">
          {NAV[role].map(([id, label, Icon]) => (
            <button key={id} aria-current={view === id ? 'page' : undefined} onClick={() => go(id)}>
              <Icon size={18} />
              <span>{label}</span>
              {badges[id] > 0 && <em className="nav-badge">{badges[id]}</em>}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <div className="me">
            <Avatar name={user} k={TINT[role]} />
            <div><b>{user}</b><small>{PORTAL_NAME[role].replace(' portal', '')}</small></div>
          </div>
          <button className="btn sm ghost" onClick={signOut}><LogOut size={15} /> Sign out</button>
        </div>
      </aside>
      {menu && <div className="scrim" onClick={() => setMenu(false)} />}

      <div className="workspace">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="crumbs">
            <span className="muted">{PORTAL_NAME[role]}</span>
            <span className="muted">/</span>
            <b>{current[1]}</b>
          </div>
          <div className="top-right">
            <span className="today">{today}</span>
            <button className="icon-btn bell" aria-label={`${alertCount} items need attention`} onClick={() => go(Object.keys(badges).find((k) => badges[k] > 0) || 'dashboard')}>
              <Bell size={18} />
              {alertCount > 0 && <em>{alertCount}</em>}
            </button>
            <Avatar name={user} k={TINT[role]} />
          </div>
        </header>
        <main className="main">
          <View go={go} />
        </main>
        <p className="demo-note">
          Demo with sample data. Work you do carries across the three portals until you reload. AI agents here follow scripted rules
          over the sample data; the production build connects them to an LLM with the same approval steps.
        </p>
      </div>
    </div>
  );
}
