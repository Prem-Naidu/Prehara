import { Users, BookOpen, ShieldCheck, CalendarClock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useStore, log, aiact, agentOn } from '../store';
import { PERIODS, DAYS, COURSE_COLORS } from '../data/sample';
import { clashes, mask } from '../lib';
import { Pill, Card, PageHead, Stat, AiNote, Empty, Switch, Avatar } from '../components/ui';

function Dashboard({ go }) {
  const { state } = useStore();
  const pend = Object.keys(state.approvals).filter((c) => state.approvals[c] === 'pending');
  const cl = clashes(state.tt).length;
  const months = [['Jun', 82], ['Jul', 79], ['Aug', 81], ['Sep', 77], ['Oct', 80]];
  return (
    <>
      <PageHead title="Admin overview" sub="Institution-wide status for the current semester" />
      <div className="grid g4">
        <Stat icon={Users} value={state.users.length * 8} label="Registered users" />
        <Stat icon={BookOpen} value={5} label="Active courses" />
        <Stat icon={ShieldCheck} value={pend.length} label="Result sets to approve" k={pend.length ? 'warn' : ''} />
        <Stat icon={CalendarClock} value={cl} label="Timetable clashes" k={cl ? 'bad' : ''} />
      </div>
      <div className="grid g2">
        <Card title="Average attendance by month">
          <div className="cols" role="img" aria-label="Average attendance by month">
            {months.map(([m, v]) => (
              <div key={m}><b>{v}%</b><i style={{ height: `${((v - 60) / 40) * 100}%` }} /><span>{m}</span></div>
            ))}
          </div>
        </Card>
        <Card title="Needs your attention">
          <div className="list">
            {pend.map((c) => <div className="row" key={c}><div className="grow">{c} marks awaiting approval</div><button className="btn sm" onClick={() => go('approvals')}>Review</button></div>)}
            {cl > 0 && <div className="row"><div className="grow">Timetable clash on Tuesday</div><button className="btn sm" onClick={() => go('timetable')}>Resolve</button></div>}
            {!pend.length && !cl && <Empty>Nothing pending.</Empty>}
          </div>
        </Card>
      </div>
    </>
  );
}

function UsersView() {
  const { state, update, notify } = useStore();
  const f = state.userFilter;
  const list = state.users.filter((u) => f === 'All' || u.role === f);
  const add = (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    update((n) => {
      n.users.push({ name: d.get('name'), email: d.get('email'), role: d.get('role'), active: true });
      log(n, n.session.user, `Created ${d.get('role').toLowerCase()} account for ${d.get('name')}`);
    });
    e.target.reset();
    notify('Account created');
  };
  return (
    <>
      <PageHead title="Users" sub="Create accounts and control access. Contact details stay masked until you choose to show them." />
      <Card>
        <div className="seg" role="group" aria-label="Filter by role">
          {['All', 'Student', 'Faculty', 'Admin'].map((r) => (
            <button key={r} aria-pressed={f === r} onClick={() => update((n) => { n.userFilter = r; })}>{r}</button>
          ))}
        </div>
        <div className="tw">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.email}>
                  <td><span className="person"><Avatar name={u.name} k="soft" /> {u.name}</span></td>
                  <td className="mono">{state.reveal[u.email] ? u.email : mask(u.email)}</td>
                  <td>{u.role}</td>
                  <td>{u.active ? <Pill k="ok">Active</Pill> : <Pill>Disabled</Pill>}</td>
                  <td className="actions">
                    <button className="btn sm" onClick={() => update((n) => {
                      n.reveal[u.email] = !n.reveal[u.email];
                      if (n.reveal[u.email]) log(n, n.session.user, `Viewed contact details of ${u.name}`);
                    })}>
                      {state.reveal[u.email] ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Show</>}
                    </button>
                    <button className="btn sm" onClick={() => update((n) => {
                      const x = n.users.find((y) => y.email === u.email); x.active = !x.active;
                      log(n, n.session.user, `${x.active ? 'Enabled' : 'Disabled'} account for ${x.name}`);
                    })}>{u.active ? 'Disable' : 'Enable'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <form className="card form" onSubmit={add}>
        <h2 className="full">Add a user</h2>
        <label>Full name<input name="name" required /></label>
        <label>Email<input type="email" name="email" required placeholder="name@prehara.demo" /></label>
        <label>Role<select name="role"><option>Student</option><option>Faculty</option><option>Admin</option></select></label>
        <div className="full"><button className="btn primary"><UserPlus size={16} /> Create account</button></div>
      </form>
    </>
  );
}

function Timetable() {
  const { state, update, notify } = useStore();
  const cl = clashes(state.tt);
  const flag = new Set(cl.flat());
  const pr = state.ttProposal;

  const check = () => update((n) => {
    n.ttChecked = true; n.ttMoved = null; n.ttProposal = null;
    const c = clashes(n.tt);
    if (c.length) {
      const idx = c[0][1], e = n.tt[idx];
      let slot = null;
      for (let d = 0; d < 5 && !slot; d++) for (let p = 0; p < 5 && !slot; p++) if (!n.tt.some((x) => x[0] === d && x[1] === p)) slot = [d, p];
      n.ttProposal = {
        idx, slot,
        msg: `${e[2]} and ${n.tt[c[0][0]][2]} are both set for ${DAYS[e[0]]} ${PERIODS[e[1]]} and share a faculty member. Move ${e[2]} to ${DAYS[slot[0]]} ${PERIODS[slot[1]]}, the first free slot for the whole batch.`,
      };
      aiact(n, 'Operations agent', `Found clash on ${DAYS[e[0]]} ${PERIODS[e[1]]}; proposed moving ${e[2]}`);
    } else aiact(n, 'Operations agent', 'Checked timetable: no clashes');
  });
  const apply = () => {
    update((n) => {
      const p = n.ttProposal;
      n.tt[p.idx][0] = p.slot[0]; n.tt[p.idx][1] = p.slot[1]; n.ttMoved = p.slot; n.ttProposal = null;
      log(n, n.session.user, 'Approved timetable change proposed by operations agent');
    });
    notify('Timetable updated');
  };

  return (
    <>
      <PageHead title="Timetable" sub="Semester 5, one batch, five periods a day" />
      <Card className="tw">
        <table className="tt">
          <thead><tr><th>Day</th>{PERIODS.map((p) => <th key={p}>{p}</th>)}</tr></thead>
          <tbody>
            {DAYS.map((D, d) => (
              <tr key={D}>
                <td><b>{D}</b></td>
                {PERIODS.map((_, p) => {
                  const es = state.tt.map((e, i) => ({ e, i })).filter((x) => x.e[0] === d && x.e[1] === p);
                  const isC = es.some((x) => flag.has(x.i));
                  const mv = state.ttMoved && state.ttMoved[0] === d && state.ttMoved[1] === p;
                  return (
                    <td key={p} className={isC ? 'clash' : mv ? 'moved' : ''}>
                      {es.length ? es.map((x) => <span key={x.i} className={`cell c-${COURSE_COLORS[x.e[2]]}`}>{x.e[2]}</span>) : <span className="muted">–</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card title="Operations agent">
        {!agentOn(state, 'ops') ? <p>The operations agent is turned off.</p> : (
          <>
            <div className="btn-row">
              <button className="btn primary" onClick={check}>Check for clashes</button>
              {state.ttChecked && (cl.length ? <Pill k="bad">{cl.length} clash found</Pill> : <Pill k="ok">No clashes</Pill>)}
            </div>
            {pr && (
              <AiNote tag="Proposed fix" className="mt">
                <p>{pr.msg}</p>
                <div className="btn-row mt">
                  <button className="btn primary sm" onClick={apply}>Approve change</button>
                  <button className="btn sm" onClick={() => update((n) => { n.ttProposal = null; log(n, n.session.user, 'Rejected timetable change'); })}>Reject</button>
                </div>
              </AiNote>
            )}
          </>
        )}
      </Card>
    </>
  );
}

function Approvals() {
  const { state, update, notify } = useStore();
  return (
    <>
      <PageHead title="Result approvals" sub="Marks stay hidden from students until you publish them" />
      <Card>
        <div className="list">
          {Object.keys(state.approvals).map((c) => {
            const s = state.approvals[c];
            return (
              <div className="row" key={c}>
                <div className="grow"><div className="t">{c} {state.courses[c].name}</div><div className="muted">Submitted by {state.courses[c].fac}</div></div>
                {s === 'published' ? <Pill k="ok">Published</Pill> : s === 'pending' ? (
                  <span className="btn-row">
                    <button className="btn primary sm" onClick={() => { update((n) => { n.approvals[c] = 'published'; log(n, n.session.user, `Published ${c} internal marks`); }); notify(`${c} results published to students`); }}>Approve and publish</button>
                    <button className="btn sm" onClick={() => update((n) => { n.approvals[c] = 'draft'; log(n, n.session.user, `Returned ${c} marks to faculty`); })}>Return to faculty</button>
                  </span>
                ) : <Pill k="warn">Faculty still editing</Pill>}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

function Agents() {
  const { state, update } = useStore();
  return (
    <>
      <PageHead title="AI agents" sub="Switch agents on or off. Each one acts only within the role it serves." />
      <Card>
        <div className="list">
          {state.agents.map((a) => (
            <div className="row" key={a.id}>
              <div className="grow">
                <div className="t">{a.name}</div>
                <div className="muted">{a.desc} Used by {a.who.toLowerCase()}.</div>
                <div className="check-line"><ShieldCheck size={14} /> {a.check}</div>
              </div>
              <label className="switch-label">
                <Switch checked={a.on} label={a.name} onChange={(v) => update((n) => {
                  n.agents.find((x) => x.id === a.id).on = v;
                  log(n, n.session.user, `${v ? 'Enabled' : 'Disabled'} agent: ${a.name}`);
                })} />
                {a.on ? 'On' : 'Off'}
              </label>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Agent activity">
        {state.aiLog.length ? (
          <div className="list">
            {state.aiLog.map((l, i) => <div className="row" key={i}><span className="time">{l.t}</span><div className="grow">{l.x}</div><Pill k="acc">{l.agent}</Pill></div>)}
          </div>
        ) : <Empty>No agent activity yet. Use the student, faculty or admin portals to trigger agents.</Empty>}
      </Card>
    </>
  );
}

function Audit() {
  const { state } = useStore();
  return (
    <>
      <PageHead title="Audit log" sub="Sensitive actions across all portals, newest first" />
      <Card className="tw">
        <table>
          <thead><tr><th>Time</th><th>Actor</th><th>Action</th></tr></thead>
          <tbody>{state.audit.map((l, i) => <tr key={i}><td className="mono">{l.t}</td><td>{l.a}</td><td>{l.x}</td></tr>)}</tbody>
        </table>
      </Card>
    </>
  );
}

export default { dashboard: Dashboard, users: UsersView, timetable: Timetable, approvals: Approvals, agents: Agents, audit: Audit };
