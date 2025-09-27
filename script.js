// Utility: safe evaluation of simple numeric expressions
// Supports: numbers, + - * / ^, parentheses, sqrt(), sin, cos, tan, exp, ln/log, pi, e
function evalNumericExpression(expr) {
  if (!expr || typeof expr !== 'string') return NaN;
  const map = {
    pi: Math.PI,
    e: Math.E,
  };
  const fns = {
    sqrt: Math.sqrt,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    exp: Math.exp,
    ln: Math.log,
    log: Math.log,
    abs: Math.abs,
  };

  // Replace ^ with ** for exponent
  let s = expr
    .replace(/\s+/g, '')
    .replace(/\^/g, '**')
    .replace(/π/g, 'pi');

  // Allow implied multiplication between number and parentheses: 2(3) -> 2*(3)
  s = s.replace(/(\d)\(/g, '$1*(');

  // Build a Function with limited scope
  const argNames = [...Object.keys(map), ...Object.keys(fns)];
  const argValues = [...Object.values(map), ...Object.values(fns)];
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...argNames, `return (${s});`);
    const out = fn(...argValues);
    return typeof out === 'number' && isFinite(out) ? out : NaN;
  } catch (_) {
    return NaN;
  }
}

function nearlyEqual(a, b, tol = 1e-6) {
  if (!isFinite(a) || !isFinite(b)) return false;
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= tol * scale;
}

// Problem set: 10 partial derivative questions
// Each item: { id, fLatex, variables, point, ask, answerLatex, value, notes }
const QUESTIONS = [
  {
    id: 1,
    fLatex: 'f(x,y) = x^2 y + 3xy^2',
    variables: ['x','y'],
    point: { x: 1, y: 2 },
    ask: 'Compute $\\dfrac{\\partial f}{\\partial x}$ and evaluate at $(1,2)$.',
    answerLatex: '\\dfrac{\\partial f}{\\partial x} = 2xy + 3y^2',
    value: 16, // 2*1*2 + 3*4 = 4 + 12
  },
  {
    id: 2,
    fLatex: 'f(x,y) = e^{xy}',
    variables: ['x','y'],
    point: { x: 0, y: 3 },
    ask: 'Compute $\\dfrac{\\partial f}{\\partial x}$ and evaluate at $(0,3)$.',
    answerLatex: '\\dfrac{\\partial f}{\\partial x} = y e^{xy}',
    value: 3, // y*e^{0} = 3
  },
  {
    id: 3,
    fLatex: 'f(x,y) = \\ln(x^2 + y^2)',
    variables: ['x','y'],
    point: { x: 1, y: 1 },
    ask: 'Compute $\\dfrac{\\partial f}{\\partial y}$ and evaluate at $(1,1)$.',
    answerLatex: '\\dfrac{\\partial f}{\\partial y} = \\dfrac{2y}{x^2 + y^2}',
    value: 1, // 2*1/2
  },
  {
    id: 4,
    fLatex: 'f(x,y) = x^3 - 4xy + y^2',
    variables: ['x','y'],
    point: { x: -1, y: 2 },
    ask: 'Compute $\\dfrac{\\partial f}{\\partial x}$ and evaluate at $(-1,2)$.',
    answerLatex: '\\dfrac{\\partial f}{\\partial x} = 3x^2 - 4y',
    value: -5, // 3*1 - 8 = -5
  },
  {
    id: 5,
    fLatex: 'f(x,y) = \\sqrt{x^2 + y^2}',
    variables: ['x','y'],
    point: { x: 3, y: 4 },
    ask: 'Compute $\\dfrac{\\partial f}{\\partial x}$ and evaluate at $(3,4)$.',
    answerLatex: '\\dfrac{\\partial f}{\\partial x} = \\dfrac{x}{\\sqrt{x^2 + y^2}}',
    value: 3/5,
  },
  {
    id: 6,
    fLatex: 'f(x,y) = \\sin(xy)',
    variables: ['x','y'],
    point: { x: Math.PI/2, y: 2 },
    ask: 'Compute $\\dfrac{\\partial f}{\\partial y}$ and evaluate at $(\\frac{\\pi}{2}, 2)$.',
    answerLatex: '\\dfrac{\\partial f}{\\partial y} = x \\cos(xy)',
    value: -Math.PI/2,
  },
  {
    id: 7,
    fLatex: 'f(x,y) = x \\, e^{y}',
    variables: ['x','y'],
    point: { x: 2, y: -1 },
    ask: 'Compute $\\dfrac{\\partial f}{\\partial y}$ and evaluate at $(2,-1)$.',
    answerLatex: '\\dfrac{\\partial f}{\\partial y} = x e^{y}',
    value: 2/Math.E,
  },
  {
    id: 8,
    fLatex: 'f(x,y) = \\frac{x}{y}',
    variables: ['x','y'],
    point: { x: 2, y: 1 },
    ask: 'Compute $\\dfrac{\\partial f}{\\partial x}$ and evaluate at $(2,1)$.',
    answerLatex: '\\dfrac{\\partial f}{\\partial x} = \\dfrac{1}{y}',
    value: 1,
  },
  {
    id: 9,
    fLatex: 'f(x,y) = \\arctan(y/x)',
    variables: ['x','y'],
    point: { x: 1, y: 1 },
    ask: 'Compute $\\dfrac{\\partial f}{\\partial x}$ and evaluate at $(1,1)$.',
    answerLatex: '\\dfrac{\\partial f}{\\partial x} = -\\dfrac{y}{x^2 + y^2}',
    value: -1/2,
  },
  {
    id: 10,
    fLatex: 'f(x,y) = \\ln(\\sqrt{x^2 + 4y^2})',
    variables: ['x','y'],
    point: { x: 0, y: 1 },
    ask: 'Compute $\\dfrac{\\partial f}{\\partial y}$ and evaluate at $(0,1)$.',
    answerLatex: '\\dfrac{\\partial f}{\\partial y} = \\dfrac{4y}{x^2 + 4y^2}',
    value: 1, // 4*1 / (0 + 4) = 1
  },
];

// (values already set in the question definitions)

function pointLatex(pt, vars) {
  const coords = vars.map(v => pt[v]).join(',');
  return `(${coords})`;
}

function renderQuestion(q, showApprox) {
  const container = document.createElement('article');
  container.className = 'card';
  container.id = `q-${q.id}`;

  container.innerHTML = `
    <h2>Question ${q.id}</h2>
    <div class="prompt">Given $${q.fLatex}$. ${q.ask}</div>
    <div class="meta">Point: $${pointLatex(q.point, q.variables)}$</div>

    <details class="solution" id="sol-${q.id}">
      <summary>Show solution</summary>
      <div class="solution-content">
        <div>Answer: $${q.answerLatex}$.</div>
        <div>Value at $${pointLatex(q.point, q.variables)}$: $${q.value}$ ${showApprox ? `\\;\\approx\\; ${q.value.toFixed(6)}` : ''}</div>
      </div>
    </details>
  `;

  return container;
}

function renderAll() {
  const root = document.getElementById('questions');
  root.innerHTML = '';
  const showApprox = false; // controls removed; default to no approximations for a cleaner UI
  for (const q of QUESTIONS) root.appendChild(renderQuestion(q, showApprox));
  if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise();
}

window.addEventListener('DOMContentLoaded', () => {
  renderAll();
});
