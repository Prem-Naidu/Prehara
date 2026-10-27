// Sample data for the Prehara demo. Swap these for API calls in the production build.

export const PERIODS = ['9:00', '10:00', '11:15', '12:15', '2:00'];
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const COURSE_COLORS = {
  CS301: 'iris', CS302: 'sky', CS303: 'saffron', MA301: 'mint', HS301: 'rose',
};

export const ATT = { CS301: [27, 32], CS302: [24, 30], CS303: [18, 28], MA301: [26, 30], HS301: [14, 16] };
export const INTERNAL = { CS301: 33, CS302: 35, CS303: 31, MA301: 28, HS301: 36 };

export const ACCOUNTS = {
  student: { email: 'ananya.reddy@prehara.demo', name: 'Ananya Reddy' },
  faculty: { email: 'ravi.kumar@prehara.demo', name: 'Dr. Ravi Kumar' },
  admin: { email: 'registrar@prehara.demo', name: 'Registrar Office' },
};

export const KB = [
  [/stack|queue/, 'A stack removes the newest item first (LIFO) and a queue removes the oldest first (FIFO). Both support push and pop, or enqueue and dequeue, in O(1) when built on a linked list or circular array.', 'CS301 notes, Unit 2'],
  [/bst|tree|traversal/, 'A binary search tree keeps smaller keys on the left and larger on the right, so search, insert and delete take O(h). Inorder traversal visits keys in sorted order.', 'CS301 notes, Unit 3'],
  [/heap|priority/, 'A binary heap stores a complete tree in an array. Insert and extract-min take O(log n); building a heap from n items takes O(n).', 'CS301 notes, Unit 4'],
  [/join|sql/, 'An inner join keeps rows that match in both tables; a left join keeps all rows from the left table and fills gaps with NULL.', 'CS302 notes, Unit 3'],
  [/normal|bcnf|3nf/, 'Normalisation removes redundancy. 3NF requires every non-key attribute to depend on the key, the whole key and nothing but the key. BCNF requires every determinant to be a candidate key.', 'CS302 notes, Unit 4'],
  [/deadlock/, 'Deadlock needs four conditions together: mutual exclusion, hold and wait, no preemption and circular wait. Breaking any one prevents it.', 'CS303 notes, Unit 4'],
  [/schedul|process/, 'Round robin gives each process a fixed time quantum. A small quantum improves response time but adds context-switch overhead.', 'CS303 notes, Unit 2'],
];

export const PRACTICE_QUIZ = [
  { q: 'Which traversal of a BST visits keys in sorted order?', o: ['Preorder', 'Inorder', 'Postorder', 'Level order'], a: 1 },
  { q: 'What is the worst-case search time in a BST with n nodes?', o: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'], a: 2 },
  { q: 'Which structure is used for level-order traversal?', o: ['Stack', 'Queue', 'Heap', 'Hash table'], a: 1 },
  { q: 'A complete binary tree with 15 nodes has what height (root at level 0)?', o: ['2', '3', '4', '5'], a: 1 },
];

export function initialState() {
  return {
    session: null, // { user, role }
    accounts: Object.entries(ACCOUNTS).map(([role, a]) => ({ ...a, pw: 'demo123', role })),
    courses: {
      CS301: { name: 'Data Structures', fac: 'Dr. Ravi Kumar', credits: 4, lessons: [['Arrays and linked lists', 1], ['Stacks and queues', 1], ['Trees and BSTs', 1], ['Heaps and priority queues', 0], ['Hashing', 0], ['Graph basics', 0]] },
      CS302: { name: 'Database Systems', fac: 'Dr. Ravi Kumar', credits: 4, lessons: [['ER modelling', 1], ['Relational algebra', 1], ['SQL joins', 1], ['Normalisation', 1], ['Transactions', 0], ['Indexing', 0]] },
      CS303: { name: 'Operating Systems', fac: 'Prof. Lakshmi N.', credits: 3, lessons: [['Processes and threads', 1], ['CPU scheduling', 1], ['Synchronisation', 0], ['Deadlocks', 0], ['Memory management', 0]] },
      MA301: { name: 'Discrete Mathematics', fac: 'Dr. S. Meena', credits: 3, lessons: [['Logic and proofs', 1], ['Sets and relations', 1], ['Combinatorics', 1], ['Graph theory', 1], ['Recurrences', 0]] },
      HS301: { name: 'Professional Communication', fac: 'Ms. Priya D.', credits: 2, lessons: [['Email etiquette', 1], ['Presentations', 1], ['Group discussion', 0]] },
    },
    assignments: [
      { id: 1, course: 'CS301', title: 'Binary tree traversals', type: 'Assignment', due: '27 Oct', max: 20, status: 'pending' },
      { id: 2, course: 'CS302', title: 'ER diagram: hospital system', type: 'Assignment', due: '30 Oct', max: 15, status: 'pending' },
      { id: 3, course: 'CS303', title: 'Process scheduling report', type: 'Assignment', due: '3 Nov', max: 20, status: 'pending' },
      { id: 4, course: 'MA301', title: 'Graph theory problem set', type: 'Assignment', due: '12 Oct', max: 20, status: 'graded', score: 17, feedback: 'Strong proofs. Re-check the Euler path question.' },
      { id: 5, course: 'CS301', title: 'Stacks and queues lab', type: 'Assignment', due: '8 Oct', max: 20, status: 'graded', score: 18, feedback: 'Clean code and good test cases.' },
    ],
    exams: [
      { course: 'CS301', title: 'Internal test 2', date: '5 Nov', dur: '60 min' },
      { course: 'CS302', title: 'Internal test 2', date: '7 Nov', dur: '60 min' },
      { course: 'CS303', title: 'Mid-term examination', date: '10 Nov', dur: '90 min' },
    ],
    quiz: null,
    genQuiz: null,
    approvals: { CS301: 'draft', CS302: 'pending', CS303: 'published', MA301: 'pending', HS301: 'published' },
    queue: [
      { id: 101, student: 'Aditya Naidu', roll: '22CS001', course: 'CS301', title: 'Binary tree traversals', max: 20, file: 'bt_traversals.pdf', note: 'Implemented inorder, preorder and postorder recursively and iteratively with a stack. Time O(n), space O(h).', draft: { c: 9, x: 5, q: 4, fb: 'Recursive and iterative versions are both correct and the complexity analysis is complete. Add a comment on the stack invariant.' }, status: 'review' },
      { id: 102, student: 'Bhavana Rao', roll: '22CS007', course: 'CS301', title: 'Binary tree traversals', max: 20, file: 'traversals_bhavana.pdf', note: 'Recursive traversals only. Time complexity O(n). Did not attempt level order.', draft: { c: 7, x: 3, q: 4, fb: 'Recursive traversals are correct. Level-order traversal is missing and space complexity is not discussed.' }, status: 'review' },
      { id: 103, student: 'Charan Teja', roll: '22CS009', course: 'CS301', title: 'Binary tree traversals', max: 20, file: 'tree.cpp', note: 'Inorder code with sample output.', draft: { c: 5, x: 1, q: 3, fb: 'Only inorder traversal is submitted. Add preorder, postorder and an analysis of running time.' }, status: 'review' },
      { id: 104, student: 'Divya Sree', roll: '22CS011', course: 'CS301', title: 'Binary tree traversals', max: 20, file: 'divya_bt.pdf', note: 'All three traversals plus level order using a queue. Proved O(n) by counting visits. Added iterative Morris inorder with O(1) space.', draft: { c: 10, x: 5, q: 5, fb: 'Complete and well argued. The Morris traversal is a good extension.' }, status: 'review' },
    ],
    students: [
      { roll: '22CS001', name: 'Aditya Naidu', att: { CS301: 91, CS302: 88 }, mark: { CS301: 34, CS302: 31 } },
      { roll: '22CS004', name: 'Arjun Menon', att: { CS301: 62, CS302: 70 }, mark: { CS301: 21, CS302: 19 }, nudge: null },
      { roll: '22CS007', name: 'Bhavana Rao', att: { CS301: 83, CS302: 79 }, mark: { CS301: 29, CS302: 30 } },
      { roll: '22CS009', name: 'Charan Teja', att: { CS301: 78, CS302: 81 }, mark: { CS301: 14, CS302: 22 }, nudge: null },
      { roll: '22CS011', name: 'Divya Sree', att: { CS301: 96, CS302: 94 }, mark: { CS301: 38, CS302: 37 } },
      { roll: '22CS014', name: 'Ananya Reddy', att: { CS301: 84, CS302: 80 }, mark: { CS301: 33, CS302: 35 } },
      { roll: '22CS018', name: 'Harsha Vardhan', att: { CS301: 73, CS302: 68 }, mark: { CS301: 24, CS302: 20 }, nudge: null },
      { roll: '22CS021', name: 'Keerthi S.', att: { CS301: 88, CS302: 90 }, mark: { CS301: 31, CS302: 33 } },
    ],
    marksCourse: 'CS301',
    attCourse: 'CS301',
    present: {},
    users: [
      { name: 'Ananya Reddy', email: 'ananya.reddy@prehara.demo', role: 'Student', active: true },
      { name: 'Aditya Naidu', email: 'aditya.naidu@prehara.demo', role: 'Student', active: true },
      { name: 'Divya Sree', email: 'divya.sree@prehara.demo', role: 'Student', active: true },
      { name: 'Charan Teja', email: 'charan.teja@prehara.demo', role: 'Student', active: false },
      { name: 'Dr. Ravi Kumar', email: 'ravi.kumar@prehara.demo', role: 'Faculty', active: true },
      { name: 'Prof. Lakshmi N.', email: 'lakshmi.n@prehara.demo', role: 'Faculty', active: true },
      { name: 'Dr. S. Meena', email: 'meena.s@prehara.demo', role: 'Faculty', active: true },
      { name: 'Registrar Office', email: 'registrar@prehara.demo', role: 'Admin', active: true },
    ],
    // [day, period, course]
    tt: [
      [0, 0, 'CS301'], [0, 1, 'CS302'], [0, 2, 'MA301'], [0, 3, 'CS303'], [0, 4, 'HS301'],
      [1, 0, 'CS303'], [1, 1, 'MA301'], [1, 2, 'CS301'], [1, 2, 'CS302'], [1, 3, 'HS301'], [1, 4, 'CS303'],
      [2, 0, 'MA301'], [2, 1, 'CS301'], [2, 2, 'CS303'], [2, 3, 'CS302'],
      [3, 0, 'CS302'], [3, 1, 'CS303'], [3, 2, 'MA301'], [3, 3, 'CS301'], [3, 4, 'HS301'],
      [4, 0, 'CS301'], [4, 1, 'CS302'], [4, 2, 'CS303'], [4, 3, 'MA301'],
    ],
    ttProposal: null, ttMoved: null, ttChecked: false,
    agents: [
      { id: 'study', name: 'Study assistant', who: 'Students', desc: 'Answers questions from course material and builds study plans.', check: 'Answers cite course notes', on: true },
      { id: 'grade', name: 'Grading assistant', who: 'Faculty', desc: 'Scores submissions against the rubric and drafts feedback.', check: 'Faculty approves every grade', on: true },
      { id: 'content', name: 'Quiz and content generator', who: 'Faculty', desc: 'Drafts quizzes and lesson summaries from uploaded material.', check: 'Faculty edits and publishes', on: true },
      { id: 'risk', name: 'At-risk student monitor', who: 'Faculty and admin', desc: 'Flags falling attendance or marks and drafts a message.', check: 'Faculty sends or dismisses', on: true },
      { id: 'remind', name: 'Attendance and deadline agent', who: 'Students and faculty', desc: 'Sends shortage warnings and deadline reminders.', check: 'Rules set by admin', on: true },
      { id: 'ops', name: 'Admin operations agent', who: 'Admin', desc: 'Detects timetable clashes and proposes fixes.', check: 'Admin approves changes', on: true },
      { id: 'help', name: 'Student support chatbot', who: 'Everyone', desc: 'Answers fee, exam and calendar questions and escalates the rest.', check: 'Escalates to staff', on: false },
    ],
    aiLog: [],
    audit: [
      { t: '09:12', a: 'Dr. S. Meena', x: 'Submitted MA301 internal marks for approval' },
      { t: '09:40', a: 'Dr. Ravi Kumar', x: 'Submitted CS302 internal marks for approval' },
      { t: '10:05', a: 'Registrar Office', x: 'Imported 62 student accounts from CSV' },
    ],
    chat: [],
    plan: null,
    userFilter: 'All',
    reveal: {},
  };
}
