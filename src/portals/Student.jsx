import { useEffect, useRef, useState } from 'react';
import { CalendarCheck, FileText, ClipboardList, Award, ArrowLeft, CirclePlay, Upload, Send, Sparkles } from 'lucide-react';
import { useStore, log, aiact, agentOn } from '../store';
import { ATT, INTERNAL, PERIODS, KB, PRACTICE_QUIZ, COURSE_COLORS } from '../data/sample';
import { attPct, tone, pctOf, overallAtt, fname, kb, ytLink, draftGrade } from '../lib';
import { Pill, Bar, Card, PageHead, Stat, AiNote, Empty } from '../components/ui';

function Dashboard({ go }) {
  const { state } = useStore();
  const C = state.courses;
  const pend = state.assignments.filter((a) => a.status === 'pending');
  let d = (new Date().getDay() + 6) % 7, dl = 'Today';
  if (d > 4) { d = 0; dl = 'Monday'; }
  const today = state.tt.filter((e) => e[0] === d).sort((a, b) => a[1] - b[1]);
  const overall = overallAtt();
  const low = Object.keys(ATT).filter((c) => attPct(...ATT[c]) < 75);

  return (
    <>
      <PageHead title={`Welcome back, ${fname(state.session.user)}`} sub="B.Tech Computer Science, semester 5" />
      <div className="grid g4">
        <Stat icon={CalendarCheck} value={`${overall}%`} label="Overall attendance" k={overall < 75 ? 'bad' : ''} />
        <Stat icon={FileText} value={pend.length} label="Assignments to submit" k={pend.length > 2 ? 'warn' : ''} />
        <Stat icon={ClipboardList} value={state.exams[0].date} label="Next exam: CS301 internal test" />
        <Stat icon={Award} value="8.4" label="Last semester SGPA" />
      </div>

      {low.length > 0 && agentOn(state, 'remind') && (
        <AiNote tag="Attendance agent">
          <p>
            {low.map((c) => `${c} attendance is ${attPct(...ATT[c])}%, below the 75% minimum. `)}
            <button className="link-btn" onClick={() => go('attendance')}>See how many classes you need</button>
          </p>
        </AiNote>
      )}

      <div className="grid g2">
        <Card title={`${dl}’s classes`}>
          <div className="list">
            {today.map((e, i) => (
              <div className="row" key={i}>
                <span className="time">{PERIODS[e[1]]}</span>
                <span className={`dot c-${COURSE_COLORS[e[2]]}`} />
                <div className="grow"><div className="t">{C[e[2]].name}</div><div className="muted">{C[e[2]].fac}</div></div>
                <Pill>{e[2]}</Pill>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Upcoming deadlines" action={<button className="btn sm" onClick={() => go('assignments')}>All assignments</button>}>
          <div className="list">
            {pend.length ? pend.map((a) => (
              <div className="row" key={a.id}>
                <div className="grow"><div className="t">{a.title}</div><div className="muted">{a.course}, {a.type.toLowerCase()}</div></div>
                <Pill k="warn">Due {a.due}</Pill>
              </div>
            )) : <Empty>Nothing due. You are caught up.</Empty>}
          </div>
        </Card>
      </div>

      <Card title="Attendance by course">
        <div className="list">
          {Object.keys(ATT).map((c) => {
            const p = attPct(...ATT[c]);
            return (
              <div className="row" key={c}>
                <div className="grow">{C[c].name}</div>
                <div className="bar-wrap"><Bar p={p} k={tone(p)} /></div>
                <b className="num-col">{p}%</b>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Announcements">
        <div className="list">
          <div className="row"><div className="grow"><div className="t">Internal test 2 schedule published</div><div className="muted">Examination cell, 22 Oct</div></div></div>
          <div className="row"><div className="grow"><div className="t">Library open till 8 pm during test week</div><div className="muted">Library, 20 Oct</div></div></div>
        </div>
      </Card>
    </>
  );
}

function Courses() {
  const { state, update } = useStore();
  const [open, setOpen] = useState(null);
  const C = state.courses;

  if (open) {
    const c = C[open];
    return (
      <>
        <PageHead
          title={c.name}
          sub={`${open}, ${c.fac}, ${c.credits} credits`}
          right={<button className="btn" onClick={() => setOpen(null)}><ArrowLeft size={16} /> Back to courses</button>}
        />
        <Card>
          <div className="progress-line"><b>{pctOf(c)}% complete</b><div className="grow"><Bar p={pctOf(c)} /></div></div>
          <p className="muted small mb">“Watch tutorial” opens YouTube for that topic sorted by view count, so the first result is the most viewed.</p>
          <div className="list">
            {c.lessons.map((l, i) => (
              <div className="row" key={i}>
                <label className="check grow">
                  <input type="checkbox" checked={!!l[1]} onChange={(e) => update((n) => { n.courses[open].lessons[i][1] = e.target.checked ? 1 : 0; })} />
                  <span>Lesson {i + 1}: {l[0]}</span>
                </label>
                <a className="btn sm" href={ytLink(c.name, l[0])} target="_blank" rel="noopener noreferrer"><CirclePlay size={15} /> Watch tutorial</a>
                {l[1] ? <Pill k="ok">Done</Pill> : <Pill>Not started</Pill>}
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHead title="My courses" sub="Semester 5, five courses, 16 credits" />
      <div className="grid g3">
        {Object.keys(C).map((k) => {
          const c = C[k];
          return (
            <article className={`card course c-${COURSE_COLORS[k]}`} key={k}>
              <div className="course-top"><span className="code">{k}</span><Pill>{c.credits} credits</Pill></div>
              <h2>{c.name}</h2>
              <p className="muted mb">{c.fac}</p>
              <Bar p={pctOf(c)} />
              <div className="course-foot">
                <span className="muted">{pctOf(c)}% complete</span>
                <button className="btn sm primary" onClick={() => setOpen(k)}>Open course</button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function Attendance() {
  const { state } = useStore();
  return (
    <>
      <PageHead title="Attendance" sub="Minimum required: 75% in each course" />
      <Card className="tw">
        <table>
          <thead><tr><th>Course</th><th className="num">Attended</th><th className="num">Held</th><th className="num">%</th><th>Status</th><th>What you need</th></tr></thead>
          <tbody>
            {Object.keys(ATT).map((c) => {
              const [a, h] = ATT[c], p = attPct(a, h), need = Math.max(0, Math.ceil(3 * h - 4 * a));
              return (
                <tr key={c}>
                  <td><b>{c}</b> <span className="muted">{state.courses[c].name}</span></td>
                  <td className="num">{a}</td><td className="num">{h}</td><td className="num"><b>{p}%</b></td>
                  <td>{p < 75 ? <Pill k="bad">Shortage</Pill> : p < 80 ? <Pill k="warn">Borderline</Pill> : <Pill k="ok">Good</Pill>}</td>
                  <td className="muted">{need ? `Attend the next ${need} classes in a row` : 'On track'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function Assignments() {
  const { state, update, notify } = useStore();

  const submit = async (e, a) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const file = d.get('upfile');
    if (!file || !file.size) return notify('Choose a file to upload');
    if (file.size > 5 * 1024 * 1024) return notify('That file is larger than 5 MB');
    let text = '';
    if (/\.(txt|md|py|java|c|cpp|js)$/i.test(file.name) || (file.type || '').startsWith('text/')) {
      try { text = (await file.text()).slice(0, 600); } catch { /* ignore */ }
    }
    const note = (`${d.get('note') || ''} ${text}`).trim() || '(no notes)';
    const user = state.session.user;
    update((n) => {
      const sub = {
        id: 200 + a.id, student: user, roll: user === 'Ananya Reddy' ? '22CS014' : 'New', course: a.course, title: a.title,
        max: a.max, file: file.name, size: kb(file.size), note, status: 'review', fromStudent: true, aid: a.id, draft: draftGrade(note),
      };
      n.queue.push(sub);
      const x = n.assignments.find((y) => y.id === a.id);
      Object.assign(x, { status: 'submitted', fileName: file.name, fileSize: kb(file.size) });
      log(n, user, `Uploaded "${file.name}" for "${a.title}"`);
      if (agentOn(n, 'remind')) aiact(n, 'Deadline agent', `Upload receipt sent to ${user} for ${a.title}`);
    });
    notify('Uploaded. Your faculty will review it.');
  };

  return (
    <>
      <PageHead title="Assignments" sub="Submit work before the deadline. Faculty review each submission." />
      <div className="stack">
        {state.assignments.map((a) => (
          <Card key={a.id}>
            <div className="row flat">
              <div className="grow"><div className="t">{a.title}</div><div className="muted">{a.course}, {a.max} marks, due {a.due}</div></div>
              {a.status === 'pending' ? <Pill k="warn">To submit</Pill> : a.status === 'submitted' ? <Pill k="acc">Submitted, awaiting review</Pill> : <Pill k="ok">Graded {a.score}/{a.max}</Pill>}
            </div>
            {a.fileName && <p className="muted mt">Uploaded: <span className="mono">{a.fileName}</span> ({a.fileSize})</p>}
            {a.status === 'graded' && <p className="feedback mt"><b>Feedback:</b> {a.feedback}</p>}
            {a.status === 'pending' && (
              <form className="form mt" onSubmit={(e) => submit(e, a)}>
                <label className="file-drop">
                  <Upload size={18} />
                  <span>Upload your file <small className="muted">PDF, Word, code, zip or image, up to 5 MB</small></span>
                  <input type="file" name="upfile" accept=".pdf,.doc,.docx,.txt,.md,.py,.java,.c,.cpp,.js,.zip,.png,.jpg" required />
                </label>
                <label className="full">Notes for your faculty<textarea name="note" placeholder="Describe your approach" /></label>
                <div className="full"><button className="btn primary">Submit assignment</button></div>
              </form>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

function Exams() {
  const { state, update } = useStore();
  const Q = state.quiz;

  const start = () => update((n) => { n.quiz = { items: PRACTICE_QUIZ, ans: [], done: false }; aiact(n, 'Quiz generator', `Generated CS301 practice quiz for ${n.session.user}`); });
  const finish = (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    update((n) => { n.quiz.ans = n.quiz.items.map((_, i) => (d.get(`q${i}`) == null ? null : +d.get(`q${i}`))); n.quiz.done = true; });
  };

  let quiz;
  if (Q && Q.done) {
    const s = Q.items.filter((x, i) => Q.ans[i] === x.a).length;
    quiz = (
      <Card title="Practice quiz result">
        <p className="score">{s} / {Q.items.length} correct</p>
        <div className="list">
          {Q.items.map((x, i) => (
            <div className="row" key={i}>
              <div className="grow"><div>{x.q}</div><div className="muted">Your answer: {Q.ans[i] != null ? x.o[Q.ans[i]] : 'none'}{Q.ans[i] === x.a ? '' : `. Correct: ${x.o[x.a]}`}</div></div>
              {Q.ans[i] === x.a ? <Pill k="ok">Correct</Pill> : <Pill k="bad">Review</Pill>}
            </div>
          ))}
        </div>
        <button className="btn mt" onClick={() => update((n) => { n.quiz = null; })}>Close</button>
      </Card>
    );
  } else if (Q) {
    quiz = (
      <form className="card" onSubmit={finish}>
        <h2>CS301 practice quiz</h2>
        <p className="muted">Auto-graded when you finish. {Q.items.length} questions.</p>
        {Q.items.map((x, i) => (
          <fieldset className="q" key={i}>
            <legend>{i + 1}. {x.q}</legend>
            {x.o.map((o, j) => <label key={j}><input type="radio" name={`q${i}`} value={j} /> {o}</label>)}
          </fieldset>
        ))}
        <button className="btn primary mt">Finish and grade</button>
      </form>
    );
  } else {
    quiz = (
      <Card title="Practice quiz">
        <p className="muted mb">Four questions from CS301 Unit 3, generated by the quiz generator from the course notes.</p>
        <button className="btn primary" onClick={start}>Start practice quiz</button>
      </Card>
    );
  }

  return (
    <>
      <PageHead title="Exams and quizzes" sub="Scheduled assessments and practice" />
      <Card title="Upcoming">
        <div className="list">
          {state.exams.map((e) => (
            <div className="row" key={e.course + e.title}>
              <div className="grow"><div className="t">{e.title}</div><div className="muted">{e.course} {state.courses[e.course].name}, {e.dur}</div></div>
              <Pill k="acc">{e.date}</Pill>
            </div>
          ))}
        </div>
      </Card>
      {quiz}
    </>
  );
}

function Results() {
  const { state } = useStore();
  const sem4 = [['Computer Organisation', 'A', 4], ['Design and Analysis of Algorithms', 'A+', 4], ['Probability and Statistics', 'B+', 3], ['Object Oriented Programming', 'A', 3], ['Environmental Science', 'A+', 2]];
  return (
    <>
      <PageHead title="Results" sub="Marks appear only after admin approval" />
      <Card title="Semester 5 internal marks" className="tw">
        <table>
          <thead><tr><th>Course</th><th className="num">Internal</th><th>Status</th></tr></thead>
          <tbody>
            {Object.keys(INTERNAL).map((c) => {
              const pub = state.approvals[c] === 'published';
              return (
                <tr key={c}>
                  <td><b>{c}</b> <span className="muted">{state.courses[c].name}</span></td>
                  <td className="num">{pub ? `${INTERNAL[c]} / 40` : '–'}</td>
                  <td>{pub ? <Pill k="ok">Published</Pill> : <Pill k="warn">{state.approvals[c] === 'pending' ? 'Awaiting admin approval' : 'Not submitted'}</Pill>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <Card title="Semester 4, SGPA 8.4" className="tw">
        <table>
          <thead><tr><th>Course</th><th>Grade</th><th className="num">Credits</th></tr></thead>
          <tbody>{sem4.map((r) => <tr key={r[0]}><td>{r[0]}</td><td><b>{r[1]}</b></td><td className="num">{r[2]}</td></tr>)}</tbody>
        </table>
      </Card>
    </>
  );
}

function Assistant() {
  const { state, update } = useStore();
  const box = useRef(null);
  const [q, setQ] = useState('');

  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [state.chat.length]);

  const ask = (text) => {
    if (!text.trim()) return;
    const hit = KB.find((k) => k[0].test(text.toLowerCase()));
    update((n) => {
      n.chat.push({ me: true, t: text });
      n.chat.push(hit ? { t: hit[1], src: hit[2] } : { t: 'I could not find that in your course notes. I have flagged the question for your faculty.' });
      aiact(n, 'Study assistant', hit ? `Answered "${text}" from ${hit[2]}` : `Escalated unanswered question "${text}"`);
    });
    setQ('');
  };

  const plan = () => update((n) => {
    const w = Object.keys(ATT).sort((a, b) => attPct(...ATT[a]) - attPct(...ATT[b]))[0];
    n.plan = [
      ['Sat', 'CS301 Unit 3: redo the BST traversal assignment, then take the practice quiz'],
      ['Sun', 'CS301 Unit 4: heaps and priority queues'],
      ['Mon', 'CS302: SQL joins and normalisation practice'],
      ['Tue', 'CS301 mock test for internal test 2 (5 Nov)'],
      ['Wed', `${w} ${n.courses[w].name}: attend every class; attendance is your lowest at ${attPct(...ATT[w])}%`],
    ];
    aiact(n, 'Study assistant', `Built a 5-day study plan for ${n.session.user}`);
  });

  if (!agentOn(state, 'study')) {
    return (<><PageHead title="Study assistant" /><Card><p>The study assistant is turned off by the administrator.</p></Card></>);
  }

  return (
    <>
      <PageHead title="Study assistant" sub="Ask about your course material. Answers cite the notes they come from." />
      <div className="grid g2 assist">
        <Card title="Ask a question">
          <div className="chat" ref={box}>
            {state.chat.length ? state.chat.map((m, i) => (
              <div key={i} className={`msg ${m.me ? 'me' : ''}`}>
                {m.t}
                {m.src && <small>Source: {m.src}</small>}
              </div>
            )) : <Empty>Try one of the questions below.</Empty>}
          </div>
          <div className="chips">
            {['What is a BST?', 'Explain deadlock', 'SQL joins', 'Stack vs queue'].map((x) => <button key={x} className="chip" onClick={() => ask(x)}>{x}</button>)}
          </div>
          <form className="ask" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about trees, SQL, scheduling…" aria-label="Question" />
            <button className="btn primary" aria-label="Send"><Send size={16} /></button>
          </form>
        </Card>
        <Card title="Study plan">
          <p className="muted mb">Built from your exam dates and lowest attendance.</p>
          {state.plan ? (
            <div className="list">
              {state.plan.map((p) => <div className="row" key={p[0]}><span className="time">{p[0]}</span><div className="grow">{p[1]}</div></div>)}
            </div>
          ) : <button className="btn primary" onClick={plan}><Sparkles size={16} /> Generate my plan</button>}
        </Card>
      </div>
    </>
  );
}

export default { dashboard: Dashboard, courses: Courses, attendance: Attendance, assignments: Assignments, exams: Exams, results: Results, assistant: Assistant };
