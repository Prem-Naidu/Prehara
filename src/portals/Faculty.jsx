import { useState } from 'react';
import { CalendarClock, ClipboardCheck, TriangleAlert, CalendarCheck, Sparkles } from 'lucide-react';
import { useStore, log, aiact, agentOn } from '../store';
import { atRisk, fname, statusPill } from '../lib';
import { Pill, Card, PageHead, Stat, AiNote, Empty, Switch, Avatar } from '../components/ui';

const CourseSelect = ({ value, onChange }) => (
  <label className="inline-select">Course
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="CS301">CS301 Data Structures</option>
      <option value="CS302">CS302 Database Systems</option>
    </select>
  </label>
);

function Dashboard({ go }) {
  const { state } = useStore();
  const r = atRisk(state.students);
  const rv = state.queue.filter((x) => x.status === 'review').length;
  const avg = Math.round(state.students.reduce((a, s) => a + s.att.CS301, 0) / state.students.length);
  return (
    <>
      <PageHead title={`Welcome, ${state.session.user}`} sub="Computer Science, teaching CS301 and CS302" />
      <div className="grid g4">
        <Stat icon={CalendarClock} value={3} label="Classes today" />
        <Stat icon={ClipboardCheck} value={rv} label="Submissions to grade" k={rv ? 'warn' : ''} />
        <Stat icon={TriangleAlert} value={r.filter((x) => !x.s.nudge).length} label="Students at risk" k={r.length ? 'bad' : ''} />
        <Stat icon={CalendarCheck} value={`${avg}%`} label="Average CS301 attendance" />
      </div>
      <div className="grid g2">
        <Card title="Today">
          <div className="list">
            <div className="row"><span className="time">9:00</span><div className="grow t">CS301 Data Structures, R101</div><button className="btn sm" onClick={() => go('attendance')}>Mark attendance</button></div>
            <div className="row"><span className="time">10:00</span><div className="grow t">CS302 Database Systems, R101</div><Pill>Upcoming</Pill></div>
            <div className="row"><span className="time">12:15</span><div className="grow t">Grading review, {rv} pending</div><button className="btn sm" onClick={() => go('grading')}>Open queue</button></div>
          </div>
        </Card>
        <Card title="Marks submission status">
          <div className="list">
            {['CS301', 'CS302'].map((c) => {
              const [t, k] = statusPill(state.approvals[c]);
              return <div className="row" key={c}><div className="grow">{c} {state.courses[c].name}</div><Pill k={k}>{t}</Pill></div>;
            })}
          </div>
          <button className="btn sm mt" onClick={() => go('marks')}>Open marks entry</button>
        </Card>
      </div>
    </>
  );
}

function Attendance() {
  const { state, update, notify } = useStore();
  const c = state.attCourse;
  const presentCount = state.students.filter((s) => state.present[s.roll] !== false).length;
  const save = () => {
    const n0 = state.students.filter((s) => state.present[s.roll] === false).length;
    update((n) => {
      log(n, n.session.user, `Saved ${c} attendance (${n0} absent)`);
      if (agentOn(n, 'remind') && n0) aiact(n, 'Attendance agent', `Sent absence notices to ${n0} student${n0 > 1 ? 's' : ''} for ${c}`);
    });
    notify('Attendance saved');
  };
  return (
    <>
      <PageHead
        title="Mark attendance"
        sub={`Today’s session, ${c} ${state.courses[c].name}`}
        right={<CourseSelect value={c} onChange={(v) => update((n) => { n.attCourse = v; n.present = {}; })} />}
      />
      <Card>
        <div className="toolbar">
          <b>{presentCount} of {state.students.length} present</b>
          <span className="btn-row">
            <button className="btn sm" onClick={() => { update((n) => { n.present = {}; }); notify('All students marked present'); }}>Mark all present</button>
            <button className="btn sm primary" onClick={save}>Save attendance</button>
          </span>
        </div>
        <div className="tw">
          <table>
            <thead><tr><th>Roll</th><th>Student</th><th className="num">Term %</th><th>Today</th></tr></thead>
            <tbody>
              {state.students.map((s) => {
                const p = state.present[s.roll] !== false;
                return (
                  <tr key={s.roll}>
                    <td className="mono">{s.roll}</td>
                    <td><span className="person"><Avatar name={s.name} k="soft" /> {s.name}</span></td>
                    <td className="num"><Pill k={s.att[c] < 75 ? 'bad' : ''}>{s.att[c]}%</Pill></td>
                    <td>
                      <label className="switch-label">
                        <Switch checked={p} label={`${s.name} present`} onChange={(v) => update((n) => { n.present[s.roll] = v; })} />
                        {p ? 'Present' : 'Absent'}
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function GradeCard({ s }) {
  const { state, update, notify } = useStore();
  const [score, setScore] = useState(s.draft.c + s.draft.x + s.draft.q);
  const on = agentOn(state, 'grade');
  const draft = () => update((n) => {
    const x = n.queue.find((y) => y.id === s.id); x.drafted = true;
    aiact(n, 'Grading assistant', `Drafted score ${s.draft.c + s.draft.x + s.draft.q}/${s.max} for ${s.student}`);
  });
  const approve = () => {
    const v = Math.max(0, Math.min(s.max, +score || 0));
    update((n) => {
      const x = n.queue.find((y) => y.id === s.id);
      x.status = 'graded'; x.finalScore = v;
      log(n, n.session.user, `Approved grade ${v}/${s.max} for ${s.student}`);
      if (x.fromStudent) Object.assign(n.assignments.find((a) => a.id === x.aid), { status: 'graded', score: v, feedback: x.draft.fb });
    });
    notify('Grade approved');
  };
  return (
    <Card>
      <div className="row flat">
        <Avatar name={s.student} k="soft" />
        <div className="grow"><div className="t">{s.student} <span className="mono muted">{s.roll}</span></div><div className="muted">{s.course}, {s.file}{s.size ? `, ${s.size}` : ''}</div></div>
        {s.drafted ? <Pill k="acc">AI draft ready</Pill> : <Pill k="warn">Not graded</Pill>}
      </div>
      <p className="submission">{s.note}</p>
      {s.drafted ? (
        <>
          <AiNote tag="Draft from grading assistant">
            <div className="rubric">
              <span>Correctness <b>{s.draft.c}/10</b></span><span>Complexity <b>{s.draft.x}/5</b></span><span>Clarity <b>{s.draft.q}/5</b></span>
            </div>
            <p className="muted">{s.draft.fb}</p>
          </AiNote>
          <div className="approve-row">
            <label className="score-input">Final score<input type="number" min="0" max={s.max} value={score} onChange={(e) => setScore(e.target.value)} /></label>
            <button className="btn primary" onClick={approve}>Approve grade</button>
          </div>
        </>
      ) : (
        <button className="btn primary" onClick={draft} disabled={!on}><Sparkles size={16} /> Draft with assistant</button>
      )}
    </Card>
  );
}

function Grading() {
  const { state } = useStore();
  const rv = state.queue.filter((x) => x.status === 'review');
  const done = state.queue.filter((x) => x.status === 'graded');
  return (
    <>
      <PageHead title="Grading queue" sub="The grading assistant drafts scores against the rubric. You approve every grade." />
      {!agentOn(state, 'grade') && <Card><p>The grading assistant is turned off. Submissions stay in the queue for manual grading.</p></Card>}
      <Card className="rubric-card">
        <h2>Rubric: {rv[0] ? rv[0].title : 'Binary tree traversals'} (20 marks)</h2>
        <div className="rubric"><span>Correctness <b>10</b></span><span>Complexity analysis <b>5</b></span><span>Code clarity <b>5</b></span></div>
      </Card>
      <div className="stack">
        {rv.length ? rv.map((s) => <GradeCard key={s.id} s={s} />) : <Card><Empty>Queue is clear. Nothing waiting for review.</Empty></Card>}
      </div>
      {done.length > 0 && (
        <Card title="Graded this session">
          <div className="list">{done.map((s) => <div className="row" key={s.id}><div className="grow">{s.student}, {s.title}</div><Pill k="ok">{s.finalScore}/{s.max}</Pill></div>)}</div>
        </Card>
      )}
    </>
  );
}

function Create() {
  const { state, update, notify } = useStore();
  const publish = (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const due = new Date(d.get('due')).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    update((n) => {
      n.assignments.push({ id: Date.now(), course: d.get('course'), title: d.get('title'), type: d.get('type'), due, max: +d.get('max'), status: 'pending' });
      log(n, n.session.user, `Published ${d.get('type').toLowerCase()} "${d.get('title')}" for ${d.get('course')}`);
    });
    e.target.reset();
    notify('Published. Students can see it now.');
  };
  const gen = () => update((n) => {
    n.genQuiz = ['Insert 8, 3, 10, 1 into a min-heap. Draw the array after each insert.', 'Why does building a heap from n items take O(n) and not O(n log n)?', 'Give one use of a priority queue in an operating system.'];
    aiact(n, 'Quiz generator', `Drafted 3 CS301 Unit 4 questions for ${n.session.user}`);
  });
  return (
    <>
      <PageHead title="New assessment" sub="Published items show up in the student portal right away" />
      <form className="card form" onSubmit={publish}>
        <label>Course<select name="course"><option value="CS301">CS301 Data Structures</option><option value="CS302">CS302 Database Systems</option></select></label>
        <label>Type<select name="type"><option>Assignment</option><option>Quiz</option><option>Exam</option></select></label>
        <label className="full">Title<input name="title" required placeholder="e.g. Heaps and priority queues lab" /></label>
        <label>Due date<input type="date" name="due" required /></label>
        <label>Maximum marks<input type="number" name="max" min="1" max="100" defaultValue="20" required /></label>
        <div className="full"><button className="btn primary">Publish to students</button></div>
      </form>
      <Card title="Quiz generator">
        <p className="muted mb">Drafts questions from your uploaded notes. You edit before publishing.</p>
        <button className="btn" onClick={gen} disabled={!agentOn(state, 'content')}><Sparkles size={16} /> Draft 3 questions from Unit 4 notes</button>
        {state.genQuiz && (
          <AiNote tag="Draft questions" className="mt">
            <ol className="olist">{state.genQuiz.map((q) => <li key={q}>{q}</li>)}</ol>
          </AiNote>
        )}
      </Card>
    </>
  );
}

function Marks() {
  const { state, update, notify } = useStore();
  const c = state.marksCourse, st = state.approvals[c];
  const [t, k] = statusPill(st);
  return (
    <>
      <PageHead title="Marks entry" sub="Internal marks out of 40" right={<CourseSelect value={c} onChange={(v) => update((n) => { n.marksCourse = v; })} />} />
      <Card>
        <div className="toolbar">
          <span>Status: <Pill k={k}>{t}</Pill></span>
          <button className="btn primary" disabled={st !== 'draft'} onClick={() => {
            update((n) => { n.approvals[c] = 'pending'; log(n, n.session.user, `Submitted ${c} internal marks for approval`); });
            notify('Sent to admin for approval');
          }}>Submit for approval</button>
        </div>
        <div className="tw">
          <table>
            <thead><tr><th>Roll</th><th>Student</th><th className="num">Marks /40</th></tr></thead>
            <tbody>
              {state.students.map((s, i) => (
                <tr key={s.roll}>
                  <td className="mono">{s.roll}</td><td>{s.name}</td>
                  <td className="num">
                    <input
                      type="number" min="0" max="40" className="mark-input" value={s.mark[c]} disabled={st !== 'draft'} aria-label={`Marks for ${s.name}`}
                      onChange={(e) => {
                        const v = Math.max(0, Math.min(40, +e.target.value || 0));
                        if (+e.target.value !== v) notify('Marks are limited to 0–40');
                        update((n) => { n.students[i].mark[c] = v; });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function Risk() {
  const { state, update } = useStore();
  const r = atRisk(state.students);
  const act = (roll, m) => update((n) => {
    const s = n.students.find((x) => x.roll === roll); s.nudge = m;
    if (m === 'sent') { aiact(n, 'At-risk monitor', `Message to ${s.name} sent by ${n.session.user}`); log(n, n.session.user, `Sent support message to ${s.name}`); }
  });
  if (!agentOn(state, 'risk')) return (<><PageHead title="At-risk monitor" /><Card><p>The at-risk monitor is turned off by the administrator.</p></Card></>);
  return (
    <>
      <PageHead title="At-risk monitor" sub="Students under 75% attendance or under 16/40 internal marks" />
      <div className="stack">
        {r.length ? r.map(({ s, why }) => {
          const msg = `Hi ${fname(s.name)}, your records show ${why.join(' and ')}. Please meet me this week so we can plan how to catch up. – ${state.session.user}`;
          return (
            <Card key={s.roll}>
              <div className="row flat">
                <Avatar name={s.name} k="soft" />
                <div className="grow"><div className="t">{s.name} <span className="mono muted">{s.roll}</span></div><div className="muted">{why.join(', ')}</div></div>
                {s.nudge === 'sent' ? <Pill k="ok">Message sent</Pill> : s.nudge === 'dismissed' ? <Pill>Dismissed</Pill> : <Pill k="bad">Needs action</Pill>}
              </div>
              {!s.nudge && (
                <>
                  <AiNote tag="Drafted message" className="mt"><p>{msg}</p></AiNote>
                  <div className="btn-row mt">
                    <button className="btn primary sm" onClick={() => act(s.roll, 'sent')}>Send message</button>
                    <button className="btn sm" onClick={() => act(s.roll, 'dismissed')}>Dismiss</button>
                  </div>
                </>
              )}
            </Card>
          );
        }) : <Card><Empty>No students flagged.</Empty></Card>}
      </div>
    </>
  );
}

export default { dashboard: Dashboard, attendance: Attendance, grading: Grading, create: Create, marks: Marks, risk: Risk };
