import { ATT } from './data/sample';

export const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
export const attPct = (a, h) => Math.round((a / h) * 100);
export const tone = (p) => (p < 75 ? 'bad' : p < 80 ? 'warn' : 'ok');
export const fname = (n = '') => n.split(' ')[0];
export const initials = (n = '') => n.replace(/^(Dr\.|Prof\.|Ms\.|Mr\.)\s*/, '').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
export const mask = (e) => { const [u, d] = e.split('@'); return `${u[0]}•••••@${d}`; };
export const kb = (n) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`);
export const ytLink = (course, topic) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} ${course} tutorial`)}&sp=CAM%253D`;

export const pctOf = (course) => {
  const l = course.lessons;
  return Math.round((l.filter((x) => x[1]).length / l.length) * 100);
};

export function overallAtt() {
  let a = 0, h = 0;
  Object.values(ATT).forEach(([x, y]) => { a += x; h += y; });
  return attPct(a, h);
}

export function atRisk(students) {
  return students
    .filter((s) => s.att.CS301 < 75 || s.att.CS302 < 75 || s.mark.CS301 < 16 || s.mark.CS302 < 16)
    .map((s) => {
      const why = [];
      ['CS301', 'CS302'].forEach((c) => {
        if (s.att[c] < 75) why.push(`${c} attendance ${s.att[c]}%`);
        if (s.mark[c] < 16) why.push(`${c} internal marks ${s.mark[c]}/40`);
      });
      return { s, why };
    });
}

export function clashes(tt) {
  const m = {};
  tt.forEach((e, i) => { (m[`${e[0]}-${e[1]}`] ||= []).push(i); });
  return Object.values(m).filter((a) => a.length > 1);
}

export function draftGrade(note) {
  const L = note.length;
  const c = Math.min(10, 5 + Math.floor(L / 25)), x = L > 70 ? 4 : 2, q = 4;
  return {
    c, x, q,
    fb: L > 70
      ? 'Good coverage of the required traversals with reasoning about cost. Add comments explaining the approach.'
      : 'Core idea is present but the write-up is short. Explain the approach and its running time.',
  };
}

export const statusPill = (s) =>
  s === 'published' ? ['Published', 'ok'] : s === 'pending' ? ['Awaiting admin', 'acc'] : ['Draft', 'warn'];

export function navigate(path) {
  window.location.hash = path;
}
