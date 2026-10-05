'use strict';

// ABS Data API (CORS-enabled, no key). Same queries as scripts/update-data.sh.
const ABS = 'https://data.api.abs.gov.au/rest/data';
const START = '2010-Q1';
const SOURCES = {
  live: {
    spending: `${ABS}/ABS,ANA_SFD,1.0.0/C.FCE+GFC.GGC+GGS_SL+GGS+GES_SL+GEC.10.1+2+3+4+5+6+7+8.Q?startPeriod=${START}&format=csvfile`,
    population: `${ABS}/ABS,ERP_Q,1.0.0/1.3.TOT.1+2+3+4+5+6+7+8.Q?startPeriod=${START}&format=csvfile`,
  },
  snapshot: {
    spending: 'data/spending.csv',
    population: 'data/population.csv',
    fetchedAt: 'data/fetched-at.txt',
  },
};

const STATES = [
  { code: '1', abbr: 'NSW', name: 'New South Wales' },
  { code: '2', abbr: 'VIC', name: 'Victoria' },
  { code: '3', abbr: 'QLD', name: 'Queensland' },
  { code: '4', abbr: 'SA', name: 'South Australia' },
  { code: '5', abbr: 'WA', name: 'Western Australia' },
  { code: '6', abbr: 'TAS', name: 'Tasmania' },
  { code: '7', abbr: 'NT', name: 'Northern Territory' },
  { code: '8', abbr: 'ACT', name: 'Australian Capital Territory' },
];

// Spending components, in fixed categorical order.
const PARTS = [
  { key: 'cc', label: 'Commonwealth consumption', color: 'var(--s1)' },
  { key: 'sc', label: 'State & local consumption', color: 'var(--s2)' },
  { key: 'gi', label: 'Government investment', color: 'var(--s3)' },
  { key: 'pi', label: 'Public corporation investment', color: 'var(--s4)' },
];

const state = { data: null, fy: null, metric: 'total', sel: '1' };
const $ = (id) => document.getElementById(id);
const SVG = 'http://www.w3.org/2000/svg';

// ---------- data ----------

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const head = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row = {};
    head.forEach((h, i) => { row[h] = cells[i]; });
    return row;
  });
}

async function fetchText(url, ms) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctl.signal });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function load() {
  try {
    const [s, p] = await Promise.all([
      fetchText(SOURCES.live.spending, 20000),
      fetchText(SOURCES.live.population, 20000),
    ]);
    return { ...build(s, p), origin: 'live' };
  } catch (err) {
    console.warn('Live ABS fetch failed, using snapshot', err);
    const E = window.EMBED; // set by the standalone build
    if (E) return { ...build(E.spending, E.population), origin: 'snapshot', fetchedAt: E.fetchedAt };
    const [s, p, at] = await Promise.all([
      fetchText(SOURCES.snapshot.spending, 10000),
      fetchText(SOURCES.snapshot.population, 10000),
      fetchText(SOURCES.snapshot.fetchedAt, 10000).catch(() => ''),
    ]);
    return { ...build(s, p), origin: 'snapshot', fetchedAt: at.trim() };
  }
}

// spend[stateCode][period] = { cc, sc, gi, pi, total }
function build(spendCsv, popCsv) {
  const spend = {};
  const periods = new Set();
  for (const r of parseCsv(spendCsv)) {
    if (r.OBS_VALUE === '' || r.OBS_VALUE === undefined) continue;
    const v = Number(r.OBS_VALUE) * 1e6; // UNIT_MULT 6 = millions of AUD
    // sl = all state & local spending (consumption, investment, public corporation investment).
    const keys = {
      'FCE GGC': ['cc'], 'FCE GGS_SL': ['sc', 'sl'], 'GFC GGS': ['gi'],
      'GFC GGS_SL': ['sl'], 'GFC GES_SL': ['pi', 'sl'], 'GFC GEC': ['pi'],
    }[`${r.DATA_ITEM} ${r.SECTOR}`];
    if (!keys) continue;
    const s = (spend[r.REGION] ??= {});
    const q = (s[r.TIME_PERIOD] ??= { cc: 0, sc: 0, gi: 0, pi: 0, sl: 0 });
    for (const k of keys) q[k] += v;
    periods.add(r.TIME_PERIOD);
  }
  // Keep only quarters where every state has all four components.
  const quarters = [...periods].sort().filter((p) =>
    STATES.every((st) => {
      const q = spend[st.code]?.[p];
      return q && PARTS.every((part) => Number.isFinite(q[part.key]));
    }));
  for (const st of STATES) {
    for (const p of quarters) {
      const q = spend[st.code][p];
      q.total = q.cc + q.sc + q.gi + q.pi;
    }
  }
  const pop = {};
  for (const r of parseCsv(popCsv)) {
    if (!r.OBS_VALUE) continue;
    (pop[r.REGION] ??= {})[r.TIME_PERIOD] = Number(r.OBS_VALUE);
  }
  return { spend, pop, quarters };
}

// Financial year "2025-26" = 2025-Q3 .. 2026-Q2.
function fyQuarters(fyStart) {
  return [`${fyStart}-Q3`, `${fyStart}-Q4`, `${fyStart + 1}-Q1`, `${fyStart + 1}-Q2`];
}
const fyLabel = (y) => `${y}-${String((y + 1) % 100).padStart(2, '0')}`;

function completeYears(quarters) {
  const have = new Set(quarters);
  const first = Number(quarters[0].slice(0, 4));
  const last = Number(quarters[quarters.length - 1].slice(0, 4));
  const out = [];
  for (let y = first; y <= last; y++) if (fyQuarters(y).every((q) => have.has(q))) out.push(y);
  return out;
}

// Population at the given quarter, or the latest earlier one published.
function popAt(code, period) {
  const series = state.data.pop[code] || {};
  if (series[period]) return series[period];
  const earlier = Object.keys(series).filter((p) => p <= period).sort();
  return earlier.length ? series[earlier[earlier.length - 1]] : NaN;
}

function sumQuarters(code, qs) {
  const acc = { cc: 0, sc: 0, gi: 0, pi: 0, sl: 0, total: 0 };
  for (const q of qs) {
    const v = state.data.spend[code][q];
    for (const k in acc) acc[k] += v[k];
  }
  return acc;
}

function yearFigures(fy) {
  const qs = fyQuarters(fy);
  const prevQs = fyQuarters(fy - 1);
  const hasPrev = prevQs.every((q) => state.data.quarters.includes(q));
  const rows = STATES.map((st) => {
    const cur = sumQuarters(st.code, qs);
    const prev = hasPrev ? sumQuarters(st.code, prevQs) : null;
    const people = popAt(st.code, qs[3]);
    return {
      ...st, ...cur, people,
      perCapita: cur.total / people,
      growth: prev ? cur.total / prev.total - 1 : NaN,
    };
  });
  const aus = { cc: 0, sc: 0, gi: 0, pi: 0, sl: 0, total: 0, people: 0, prevTotal: 0 };
  for (const r of rows) {
    for (const k of ['cc', 'sc', 'gi', 'pi', 'sl', 'total', 'people']) aus[k] += r[k];
    if (hasPrev) aus.prevTotal += r.total / (1 + r.growth);
  }
  aus.perCapita = aus.total / aus.people;
  aus.growth = hasPrev ? aus.total / aus.prevTotal - 1 : NaN;
  return { rows, aus, popPeriod: qs[3] };
}

// ---------- formatting ----------

const fmtBn = (v) => `${v < 0 ? '−' : ''}$${Math.abs(v) < 1e9
  ? `${Math.round(Math.abs(v) / 1e6).toLocaleString('en-AU')}m`
  : `${(Math.abs(v) / 1e9).toLocaleString('en-AU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}bn`}`;
const fmtPp = (v) => `$${Math.round(v).toLocaleString('en-AU')}`;
const fmtPct = (v) => (Number.isFinite(v) ? `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(1)}%` : '–');
const fmtMetric = (v) => (state.metric === 'total' ? fmtBn(v) : fmtPp(v));
const qLabel = (p) => {
  const [y, q] = p.split('-Q');
  return `${['Mar', 'Jun', 'Sep', 'Dec'][Number(q) - 1]} ${y}`;
};

function el(tag, attrs = {}, text) {
  const node = tag.startsWith('svg:') ? document.createElementNS(SVG, tag.slice(4)) : document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

// ---------- tooltip ----------

const tip = $('tooltip');
function showTip(evt, title, rows) {
  tip.replaceChildren(el('div', { class: 't' }, title));
  for (const r of rows) {
    const line = el('div', { class: `r${r.sel ? ' sel' : ''}` });
    const key = el('i');
    key.style.background = r.color;
    line.append(key, el('b', {}, r.value), el('span', {}, r.label));
    tip.append(line);
  }
  tip.hidden = false;
  const x = evt.clientX ?? evt.target.getBoundingClientRect().right;
  const y = evt.clientY ?? evt.target.getBoundingClientRect().top;
  const w = tip.offsetWidth;
  tip.style.left = `${Math.min(x + 14, window.innerWidth - w - 8)}px`;
  const h = tip.offsetHeight;
  tip.style.top = `${y + 14 + h > window.innerHeight ? Math.max(8, y - h - 14) : y + 14}px`;
}
const hideTip = () => { tip.hidden = true; };
// Hide on tap or focus elsewhere. Not on blur: re-rendering after a click removes the focused path.
for (const type of ['pointerdown', 'focusin']) {
  document.addEventListener(type, (e) => { if (!e.target.closest?.('.state, .act-ring')) hideTip(); });
}

// ---------- render ----------

function render() {
  const { rows, aus, popPeriod } = yearFigures(state.fy);
  const label = fyLabel(state.fy);
  renderKpis(rows, aus, label);
  renderMap(rows, aus, label);
  renderFindings(rows, aus, label);
  renderBars(rows, label);
  renderTrend();
  renderTable(rows, aus, label, popPeriod);
  if (state.tax) renderTax();
  if (state.debt) renderDebt();
  if (state.jobs) renderJobs();
  if (state.companies) renderCompanies();
  if (state.contracts) renderContracts();
  if (state.econ) renderEcon();
}

// Sequential blue ramp (light to dark), one step per quantile class.
const RAMP = ['#b7d3f6', '#86b6ef', '#3987e5', '#256abf', '#104281'];

function renderMap(rows, aus, label) {
  const box = $('map');
  if (!state.geo) { box.closest('.card').hidden = true; return; }
  const m = state.metric;
  const sorted = [...rows].sort((a, b) => a[m] - b[m]);
  // ponytail: quantile classes over 8 states; switch to fixed breaks if more regions are added.
  const classOf = (r) => Math.min(RAMP.length - 1, Math.floor(sorted.indexOf(r) * RAMP.length / sorted.length));
  const rankBy = (k, r) => [...rows].sort((a, b) => b[k] - a[k]).indexOf(r) + 1;
  const svg = el('svg:svg', { viewBox: state.geo.viewBox, role: 'img', 'aria-label': `Map of public spending by state, ${label}` });
  const labels = [];
  for (const r of rows) {
    const shape = el('svg:path', { d: state.geo.paths[r.code], class: `state${r.code === state.sel ? ' sel' : ''}`, tabindex: '0', role: 'button', 'aria-label': `${r.name}: ${fmtMetric(r[m])}` });
    shape.style.fill = RAMP[classOf(r)];
    const show = (e) => showTip(e, `${r.name} · ${label}`, mapDetail(r, aus, rankBy));
    shape.addEventListener('pointermove', show);
    shape.addEventListener('pointerdown', show); // touch has no hover
    shape.addEventListener('focus', show);
    shape.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') hideTip(); }); // touch: keep it open after the tap
    const choose = () => { state.sel = r.code; $('state').value = r.code; render(); };
    shape.addEventListener('click', choose);
    shape.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
    svg.append(shape);
    labels.push([r, shape]);
  }
  box.replaceChildren(svg);
  // Labels go on after the paths are in the DOM so getBBox works.
  for (const [r, shape] of labels) {
    const b = shape.getBBox();
    const small = r.code === '8';
    let cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    if (r.code === '1') cx -= b.width * 0.1; // keep NSW label clear of the ACT callout
    if (small) {
      // ACT is a few pixels wide: add a larger ring as its hit target and label it outside.
      const ring = el('svg:circle', { cx, cy, r: 14, class: 'act-ring' });
      ring.addEventListener('pointermove', (e) => shape.dispatchEvent(new PointerEvent('pointermove', e)));
      ring.addEventListener('pointerleave', hideTip);
      ring.addEventListener('click', () => shape.dispatchEvent(new MouseEvent('click')));
      svg.append(ring);
      cx += 34; cy += 4;
    }
    const t = el('svg:text', { x: cx, y: cy + 5, 'text-anchor': 'middle', class: 'maplbl' }, r.abbr);
    svg.append(t);
  }
  const fmt = state.metric === 'total' ? fmtBn : fmtPp;
  const items = RAMP.map((c, i) => {
    const members = sorted.filter((r) => classOf(r) === i);
    if (!members.length) return null;
    const s = el('span');
    const sw = el('i');
    sw.style.background = c;
    const lo = members[0][m], hi = members[members.length - 1][m];
    s.append(sw, `${lo === hi ? fmt(lo) : `${fmt(lo)} – ${fmt(hi)}`} (${members.map((r) => r.abbr).join(', ')})`);
    return s;
  }).filter(Boolean);
  $('map-legend').replaceChildren(...items);
  $('map-note').textContent = `Financial year ${label}, shaded by ${m === 'total' ? 'total spending' : 'spending per person'}. Hover or tab to a state for the breakdown; click to highlight it below.`;
}

// Every figure in the map tooltip.
function mapDetail(r, aus, rankBy) {
  const { spend, quarters } = state.data;
  const qs = fyQuarters(state.fy);
  const fiveAgo = fyQuarters(state.fy - 5);
  const fiveYr = fiveAgo.every((q) => quarters.includes(q))
    ? r.total / sumQuarters(r.code, fiveAgo).total - 1 : NaN;
  const lastQ = spend[r.code][qs[3]].total;
  const popQ = Object.keys(state.data.pop[r.code]).filter((p) => p <= qs[3]).sort().pop();
  const info = (label, value) => ({ color: 'transparent', label, value });
  return [
    info(`total · rank ${rankBy('total', r)} of 8 · ${(r.total / aus.total * 100).toFixed(1)}% of Australia`, fmtBn(r.total)),
    info(`per person · rank ${rankBy('perCapita', r)} of 8 · Australia ${fmtPp(aus.perCapita)}`, fmtPp(r.perCapita)),
    info('change on previous year', fmtPct(r.growth)),
    info(`change over 5 years (vs ${fyLabel(state.fy - 5)})`, fmtPct(fiveYr)),
    info(`in the ${qLabel(qs[3])} quarter`, fmtBn(lastQ)),
    info(`population, ${qLabel(popQ)}`, `${(r.people / 1e6).toFixed(2)}m`),
    ...extraDetail(r),
    ...PARTS.map((p) => ({
      color: p.color,
      label: `${p.label} · ${(r[p.key] / r.total * 100).toFixed(0)}% · ${fmtPp(r[p.key] / r.people)} per person`,
      value: fmtBn(r[p.key]),
    })),
  ];
}

// ---------- tax, contracts, economic index ----------

// Latest tax year at or before the selected financial year.
function taxYear() {
  const years = Object.keys(state.tax.states['1']).sort();
  const want = fyLabel(state.fy);
  return years.includes(want) ? want : years.filter((y) => y < want).pop() ?? years[0];
}

const TAX_LINES = [
  ['payroll', 'Payroll tax'], ['conveyance', 'Stamp duty on property sales'], ['land', 'Land tax'],
  ['rates', 'Council rates'], ['motor', 'Motor vehicle taxes'], ['insurance', 'Insurance taxes'], ['gambling', 'Gambling taxes'],
];
const fmtShare = (v) => (Number.isFinite(v) ? `${(v * 100).toFixed(0)}%` : '–');

// Tax, contract and AI-usage lines for the map tooltip.
function extraDetail(r) {
  const info = (label, value) => ({ color: 'transparent', label, value });
  const out = [];
  if (state.tax) {
    const ty = taxYear();
    const t = state.tax.states[r.code][ty];
    const sl = sumQuarters(r.code, fyQuarters(Number(ty.slice(0, 4)))).sl;
    out.push(info(`state & local taxes, ${ty} · cover ${fmtShare(t.total / sl)} of state & local spending`, fmtBn(t.total)));
  }
  const jobs = state.jobs?.[r.code];
  if (jobs) {
    const p = Object.keys(jobs).sort().pop();
    out.push(info(`job vacancies, ${jvLabel(p)} · ${(jobs[p]['7'] / popAt(r.code, p) * 1000).toFixed(1)} per 1,000 people`, jobs[p]['7'].toLocaleString('en-AU')));
  }
  const debt = state.debt?.states[r.code];
  if (debt) {
    const dy = Object.keys(debt).sort().pop();
    out.push(info(`state government net debt, 30 June ${dy.slice(0, 2)}${dy.slice(5)} · ${fmtPp(debt[dy].gg.net / popAt(r.code, `${dy.slice(0, 2)}${dy.slice(5)}-Q2`))} per person`, fmtBn(debt[dy].gg.net)));
  }
  const c = state.contracts?.states[r.code];
  if (c) {
    const m = Object.keys(state.contracts.monthly ?? {});
    const span = m.length ? ` from ${qMonth(m[0])} to ${qMonth(m[m.length - 1])}` : '';
    out.push(info(`federal contracts ≥ $1m won by suppliers based here${span} (${c.count})`, fmtBn(c.value)));
  }
  const e = state.econ?.states[r.code];
  if (state.econ) out.push(info('share of Australia\'s Claude usage (Economic Index)', e ? `${e.share}%` : 'not published'));
  return out;
}

// Horizontal bars, one or more series per row, with a tooltip per row.
const qMonth = (m) => new Date(`${m}-01T00:00:00Z`).toLocaleString('en-AU', { month: 'short', year: 'numeric', timeZone: 'UTC' });

function pairBars(box, data, series, fmt, tick, tipFor) {
  const W = Math.max(320, box.clientWidth);
  const left = 44, right = 84, top = 8, barH = 10, gap = 2;
  const rowH = series.length * (barH + gap) + 12;
  const ticks = niceTicks(Math.max(...data.flatMap((d) => d.values.filter(Number.isFinite))), W < 560 ? 3 : 5);
  const max = ticks[ticks.length - 1];
  const H = top + data.length * rowH + 24;
  const x = (v) => left + (v / max) * (W - left - right);
  const svg = el('svg:svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': series.map((s) => s.label).join(' and ') });
  for (const t of ticks) {
    svg.append(el('svg:line', { class: 'gridline', x1: x(t), x2: x(t), y1: top, y2: H - 20 }));
    svg.append(el('svg:text', { x: x(t), y: H - 4, 'text-anchor': 'middle' }, tick(t)));
  }
  data.forEach((d, i) => {
    const y0 = top + i * rowH;
    const g = el('svg:g', { class: 'row', tabindex: '0', 'aria-label': `${d.label}: ${d.values.map(fmt).join(', ')}` });
    g.append(el('svg:rect', { x: 0, y: y0, width: W, height: rowH, fill: 'transparent' }));
    g.append(el('svg:text', { class: 'lbl', x: 0, y: y0 + (rowH - 12) / 2 + 4 }, d.label));
    series.forEach((s, j) => {
      const v = d.values[j];
      if (!Number.isFinite(v)) return;
      const y = y0 + j * (barH + gap);
      const bar = el('svg:path', { d: roundedRight(left, y, Math.max(1, x(v) - left), barH, 4) });
      bar.style.fill = s.color;
      g.append(bar, el('svg:text', { class: 'val', x: x(v) + 6, y: y + barH - 1 }, fmt(v)));
    });
    const show = (e) => showTip(e, ...tipFor(d));
    for (const type of ['pointermove', 'pointerdown', 'focus']) g.addEventListener(type, show);
    g.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') hideTip(); });
    svg.append(g);
  });
  svg.append(el('svg:line', { class: 'baseline', x1: left, x2: left, y1: top, y2: H - 20 }));
  box.replaceChildren(svg);
}

function legendOf(id, series) {
  $(id).replaceChildren(...series.map((s) => {
    const span = el('span');
    const sw = el('i');
    sw.style.background = s.color;
    span.append(sw, s.label);
    return span;
  }));
}

function simpleTable(id, head, rows) {
  const hr = el('tr');
  head.forEach((h) => hr.append(el('th', { scope: 'col' }, h)));
  const tbody = el('tbody');
  for (const r of rows) {
    const tr = el('tr');
    r.forEach((c) => tr.append(el('td', {}, c)));
    tbody.append(tr);
  }
  const thead = el('thead');
  thead.append(hr);
  $(id).replaceChildren(thead, tbody);
}

function renderTax() {
  const ty = taxYear();
  const fy = Number(ty.slice(0, 4));
  const { rows } = yearFigures(fy);
  const per = state.metric === 'perCapita';
  const series = [
    { label: 'State & local government spending', color: 'var(--s1)' },
    { label: 'State & local taxes collected', color: 'var(--s2)' },
  ];
  const data = rows.map((r) => {
    const t = state.tax.states[r.code][ty];
    const d = per ? r.people : 1;
    return { r, t, label: r.abbr, values: [r.sl / d, t.total / d] };
  }).sort((a, b) => b.values[0] - a.values[0]);
  const fmt = per ? fmtPp : fmtBn;
  pairBars($('taxbars'), data, series, fmt, tickFmt, (d) => [`${d.r.name} · ${ty}`, [
    { color: 'var(--s1)', label: 'state & local government spending', value: fmt(d.values[0]) },
    { color: 'var(--s2)', label: 'state & local taxes collected', value: fmt(d.values[1]) },
    { color: 'transparent', label: 'of spending covered by these taxes', value: fmtShare(d.t.total / d.r.sl) },
    ...TAX_LINES.map(([k, name]) => ({ color: 'transparent', label: `${name} · ${fmtShare(d.t[k] / d.t.total)} of taxes`, value: fmt(d.t[k] / (per ? d.r.people : 1)) })),
  ]]);
  legendOf('tax-legend', series);
  const sl = rows.reduce((a, r) => a + r.sl, 0);
  const tx = data.reduce((a, d) => a + d.t.total, 0);
  const cover = [...data].sort((a, b) => b.t.total / b.r.sl - a.t.total / a.r.sl);
  $('tax-note').textContent = `${ty}: states, territories and councils spent ${fmtBn(sl)} and collected ${fmtBn(tx)} in their own taxes, `
    + `which covers ${fmtShare(tx / sl)} of that spending. Coverage is highest in ${cover[0].r.name} (${fmtShare(cover[0].t.total / cover[0].r.sl)}) `
    + `and lowest in ${cover[cover.length - 1].r.name} (${fmtShare(cover[cover.length - 1].t.total / cover[cover.length - 1].r.sl)}). `
    + 'The rest comes mainly from GST and other Commonwealth payments, mining royalties, and fees.';
  simpleTable('tax-table', ['State', 'Spending', 'Taxes', 'Covered', ...TAX_LINES.map(([, n]) => n)],
    data.map((d) => [d.r.name, fmt(d.values[0]), fmt(d.values[1]), fmtShare(d.t.total / d.r.sl), ...TAX_LINES.map(([k]) => fmtShare(d.t[k] / d.t.total))]));
}

// ABS Job Vacancies are surveyed in the middle month of each quarter.
const jvLabel = (p) => `${['February', 'May', 'August', 'November'][Number(p.slice(-1)) - 1]} ${p.slice(0, 4)}`;

function renderJobs() {
  const p = Object.keys(state.jobs['1']).sort().pop();
  const prev = `${Number(p.slice(0, 4)) - 1}${p.slice(4)}`;
  const per = state.metric === 'perCapita';
  const num = (v) => Math.round(v).toLocaleString('en-AU');
  const fmt = per ? (v) => v.toFixed(1) : num;
  const series = [
    { label: 'Private sector vacancies', color: 'var(--s1)' },
    { label: 'Public sector vacancies', color: 'var(--s2)' },
  ];
  const data = STATES.map((st) => {
    const j = state.jobs[st.code];
    const people = popAt(st.code, p);
    const d = per ? people / 1000 : 1;
    return { ...st, now: j[p], before: j[prev], people, label: st.abbr, values: [j[p]['1'] / d, j[p]['2'] / d] };
  }).sort((a, b) => (b.values[0] + b.values[1]) - (a.values[0] + a.values[1]));
  pairBars($('jobsbars'), data, series, fmt, per ? (v) => `${v}` : (v) => `${v / 1000}k`, (d) => [`${d.name} · ${jvLabel(p)}`, [
    { color: 'transparent', label: 'job vacancies, all sectors', value: num(d.now['7']) },
    { color: 'var(--s1)', label: 'private sector', value: num(d.now['1']) },
    { color: 'var(--s2)', label: `public sector · ${fmtShare(d.now['2'] / d.now['7'])} of vacancies`, value: num(d.now['2']) },
    { color: 'transparent', label: 'vacancies per 1,000 residents', value: (d.now['7'] / d.people * 1000).toFixed(1) },
    { color: 'transparent', label: `change since ${jvLabel(prev)}`, value: d.before ? fmtPct(d.now['7'] / d.before['7'] - 1) : '–' },
  ]]);
  legendOf('jobs-legend', series);
  const tot = data.reduce((a, d) => ({ now: a.now + d.now['7'], before: a.before + (d.before?.['7'] ?? 0), pub: a.pub + d.now['2'] }), { now: 0, before: 0, pub: 0 });
  const rate = [...data].sort((a, b) => b.now['7'] / b.people - a.now['7'] / a.people);
  const chg = [...data].filter((d) => d.before).sort((a, b) => b.now['7'] / b.before['7'] - a.now['7'] / a.before['7']);
  $('jobs-note').textContent = `In ${jvLabel(p)} employers across the states and territories had ${num(tot.now)} jobs vacant, `
    + `${fmtPct(tot.now / tot.before - 1)} on a year earlier; ${fmtShare(tot.pub / tot.now)} were in the public sector. `
    + `Per 1,000 residents, vacancies are highest in ${rate[0].name} (${(rate[0].now['7'] / rate[0].people * 1000).toFixed(1)}) and lowest in ${rate[rate.length - 1].name} (${(rate[rate.length - 1].now['7'] / rate[rate.length - 1].people * 1000).toFixed(1)}). `
    + `The strongest change over the year was in ${chg[0].name} (${fmtPct(chg[0].now['7'] / chg[0].before['7'] - 1)}) and the weakest in ${chg[chg.length - 1].name} (${fmtPct(chg[chg.length - 1].now['7'] / chg[chg.length - 1].before['7'] - 1)}).`;
  simpleTable('jobs-table', ['State', 'Vacancies', 'Private', 'Public', 'Per 1,000 people', `Change since ${jvLabel(prev)}`],
    data.map((d) => [d.name, num(d.now['7']), num(d.now['1']), num(d.now['2']), (d.now['7'] / d.people * 1000).toFixed(1), d.before ? fmtPct(d.now['7'] / d.before['7'] - 1) : '–']));
}

// Official job boards. `q` builds a keyword search URL where the board supports one (checked);
// otherwise the link opens the board and the keywords are copied for pasting.
const BOARDS = [
  { state: 'all', name: 'Workforce Australia', note: 'Australian Government job board, all employers', url: 'https://www.workforceaustralia.gov.au/individuals/jobs/search' },
  { state: 'all', name: 'APSJobs', note: 'Australian Public Service (federal government) jobs', url: 'https://www.apsjobs.gov.au/s/job-search' },
  { state: '1', name: 'I work for NSW', note: 'NSW Government jobs', url: 'https://iworkfor.nsw.gov.au/jobs' },
  { state: '2', name: 'Careers.vic', note: 'Victorian Government jobs', url: 'https://www.careers.vic.gov.au/jobs', q: (k) => `https://www.careers.vic.gov.au/jobs?keywords=${encodeURIComponent(k)}` },
  { state: '3', name: 'SmartJobs', note: 'Queensland Government jobs', url: 'https://smartjobs.qld.gov.au/' },
  { state: '4', name: 'I work for SA', note: 'South Australian Government jobs', url: 'https://www.iworkfor.sa.gov.au/' },
  { state: '5', name: 'WA Government Jobs', note: 'Western Australian Government jobs', url: 'https://search.jobs.wa.gov.au/' },
  { state: '6', name: 'Tasmanian Government Jobs', note: 'Tasmanian Government jobs', url: 'https://www.jobs.tas.gov.au/' },
  { state: '7', name: 'NT Government Jobs', note: 'Northern Territory Government jobs', url: 'https://jobs.nt.gov.au/Home/Search' },
  { state: '8', name: 'ACT Government Jobs', note: 'ACT Government jobs', url: 'https://www.jobs.act.gov.au/' },
];

function renderJobSearch() {
  const k = $('job-q').value.trim();
  const st = $('job-state').value;
  const boards = BOARDS.filter((b) => b.state === 'all' || st === 'all' || b.state === st);
  $('job-links').replaceChildren(...boards.map((b) => {
    const li = el('li');
    const direct = k && b.q;
    const a = el('a', { href: direct ? b.q(k) : b.url, target: '_blank', rel: 'noopener' }, b.name);
    a.addEventListener('click', () => {
      if (k && !b.q) navigator.clipboard?.writeText(k).then(() => { $('job-msg').textContent = `"${k}" copied. Paste it into the ${b.name} search box.`; }, () => {});
    });
    const tag = el('span', { class: 'note' }, ` · ${b.note}${k ? (direct ? ' · opens your search' : ' · copies your keywords') : ''}`);
    li.append(a, tag);
    return li;
  }));
  const j = state.jobs;
  if (j) {
    const codes = st === 'all' ? STATES.map((s) => s.code) : [st];
    const p = Object.keys(j['1']).sort().pop();
    const n = codes.reduce((a, c) => a + j[c][p]['7'], 0);
    $('job-msg').textContent = `${Math.round(n).toLocaleString('en-AU')} jobs were vacant ${st === 'all' ? 'across Australia' : `in ${STATES.find((s) => s.code === st).name}`} in ${jvLabel(p)} (ABS).`;
  }
}

function renderDebt() {
  const states = state.debt.states;
  const dy = Object.keys(states['1']).sort().pop();
  const end = `${dy.slice(0, 2)}${dy.slice(5)}`; // "2024-25" -> "2025"
  const back = `${Number(dy.slice(0, 4)) - 5}-${String((Number(dy.slice(0, 4)) - 4) % 100).padStart(2, '0')}`;
  const per = state.metric === 'perCapita';
  const fmt = per ? fmtPp : fmtBn;
  const series = [
    { label: 'State government (general government) net debt', color: 'var(--s1)' },
    { label: 'Including state-owned businesses (non-financial public sector)', color: 'var(--s2)' },
  ];
  const data = STATES.map((st) => {
    const y = states[st.code][dy];
    const people = popAt(st.code, `${end}-Q2`);
    const d = per ? people : 1;
    return { ...st, y, old: states[st.code][back], people, label: st.abbr, values: [y.gg.net / d, y.nfps.net / d] };
  }).sort((a, b) => b.values[0] - a.values[0]);
  pairBars($('debtbars'), data, series, fmt, tickFmt, (d) => [`${d.name} · 30 June ${end}`, [
    { color: 'var(--s1)', label: 'state government net debt', value: fmt(d.values[0]) },
    { color: 'var(--s2)', label: 'including state-owned businesses', value: fmt(d.values[1]) },
    { color: 'transparent', label: 'state government gross debt (before cash and loans held)', value: fmt(d.y.gg.gross / (per ? d.people : 1)) },
    { color: 'transparent', label: 'net debt per person', value: fmtPp(d.y.gg.net / d.people) },
    { color: 'transparent', label: `interest paid in ${dy} (excluding super)`, value: fmtBn(d.y.gg.interest) },
    { color: 'transparent', label: `net debt at 30 June ${Number(end) - 5}`, value: d.old ? fmtBn(d.old.gg.net) : '–' },
  ]]);
  legendOf('debt-legend', series);
  const tot = data.reduce((a, d) => ({ gg: a.gg + d.y.gg.net, nfps: a.nfps + d.y.nfps.net, int: a.int + d.y.gg.interest, old: a.old + (d.old?.gg.net ?? 0) }), { gg: 0, nfps: 0, int: 0, old: 0 });
  const pp = [...data].sort((a, b) => b.y.gg.net / b.people - a.y.gg.net / a.people);
  $('debt-note').textContent = `At 30 June ${end} the eight state and territory governments owed ${fmtBn(tot.gg)} in net debt, `
    + `up from ${fmtBn(tot.old)} five years earlier, and paid ${fmtBn(tot.int)} in interest during ${dy}. `
    + `Counting state-owned businesses such as transport, water and power utilities, net debt was ${fmtBn(tot.nfps)}. `
    + `Per person, ${pp[0].name} owes the most (${fmtPp(pp[0].y.gg.net / pp[0].people)}) and ${pp[pp.length - 1].name} the least (${fmtPp(pp[pp.length - 1].y.gg.net / pp[pp.length - 1].people)}).`;
  simpleTable('debt-table', ['State', 'Net debt', 'Gross debt', 'Per person', `Interest ${dy}`, `Net debt ${Number(end) - 5}`, 'With state businesses'],
    data.map((d) => [d.name, fmtBn(d.y.gg.net), fmtBn(d.y.gg.gross), fmtPp(d.y.gg.net / d.people), fmtBn(d.y.gg.interest), d.old ? fmtBn(d.old.gg.net) : '–', fmtBn(d.y.nfps.net)]));
}

function renderCompanies() {
  const c = state.companies;
  const pct = (a, b) => (b ? `${(a / b * 100).toFixed(1)}%` : '–');
  const row = (x) => [x.name, fmtBn(x.income), x.taxable ? fmtBn(x.taxable) : 'nil', x.tax ? fmtBn(x.tax) : 'nil', pct(x.tax, x.taxable)];
  const head = ['Company (reporting entity)', 'Total income', 'Taxable income', 'Tax payable', 'Tax ÷ taxable income'];
  simpleTable('co-most', head, c.mostTax.map(row));
  simpleTable('co-none', head, c.noTaxBiggest.map(row));
  simpleTable('co-low', head, c.lowRate.map(row));
  $('co-note').textContent = `${c.year}: ${c.count.toLocaleString('en-AU')} companies with income of $100m or more reported `
    + `${fmtBn(c.totalIncome)} of total income and ${fmtBn(c.totalTax)} of tax payable. `
    + `${c.noTaxCount.toLocaleString('en-AU')} of them (${pct(c.noTaxCount, c.count)}) had no tax payable.`;
}

function renderContracts() {
  const c = state.contracts;
  const series = [{ label: 'Value of federal contracts won', color: 'var(--s1)' }];
  const data = [...STATES.map((s) => ({ ...c.states[s.code], label: s.abbr, name: s.name })),
    { ...c.states.other, label: 'O/S', name: 'Suppliers outside Australia' }]
    .filter((d) => d.count).map((d) => ({ ...d, values: [d.value] })).sort((a, b) => b.value - a.value);
  const tip = (d) => [`${d.name} · ${d.count} contracts`, [
    { color: 'var(--s1)', label: `total value · ${fmtShare(d.value / c.national.value)} of all`, value: fmtBn(d.value) },
    { color: 'transparent', label: 'limited tenders (no open competition)', value: `${d.limited} of ${d.count}` },
    ...d.topSuppliers.slice(0, 3).map(([n, v]) => ({ color: 'transparent', label: `supplier: ${n}`, value: fmtBn(v) })),
    ...d.topAgencies.slice(0, 3).map(([n, v]) => ({ color: 'transparent', label: `buyer: ${n}`, value: fmtBn(v) })),
  ]];
  pairBars($('ctbars'), data, series, fmtBn, (v) => `$${v / 1e9}bn`, tip);
  $('ct-note').textContent = `${c.window}. ${c.national.count.toLocaleString('en-AU')} of the ${c.published.toLocaleString('en-AU')} notices published `
    + `were worth $1m or more, totalling ${fmtBn(c.national.value)}; ${fmtShare(c.national.limited / c.national.count)} used a limited tender. `
    + 'Grouped by the state of the supplier\'s address. Values are the whole contract, which may run for several years.';
  if (c.monthly) {
    const months = Object.entries(c.monthly).map(([m, d]) => ({
      ...d, label: new Date(`${m}-01T00:00:00Z`).toLocaleString('en-AU', { month: 'short', timeZone: 'UTC' }),
      name: new Date(`${m}-01T00:00:00Z`).toLocaleString('en-AU', { month: 'long', year: 'numeric', timeZone: 'UTC' }), values: [d.value],
    }));
    pairBars($('ctmonths'), months, series, fmtBn, (v) => `$${v / 1e9}bn`, (d) => [d.name, [
      { color: 'var(--s1)', label: `${d.count} contracts`, value: fmtBn(d.value) },
      { color: 'transparent', label: 'limited tenders', value: `${d.limited} of ${d.count}` },
    ]]);
    simpleTable('ct-cat', ['Category (UNSPSC)', 'Contract value'], c.national.topCategories.map(([n, v]) => [n, fmtBn(v)]));
    simpleTable('ct-why', ['Reason given for a limited tender', 'Contracts'],
      c.limitedReasons.map(([n, k]) => [n, `${k} (${fmtShare(k / c.national.limited)})`]));
  }
  simpleTable('ct-sup', ['Supplier', 'Contract value'], c.national.topSuppliers.map(([n, v]) => [n, fmtBn(v)]));
  simpleTable('ct-ag', ['Buying agency', 'Contract value'], c.national.topAgencies.map(([n, v]) => [n, fmtBn(v)]));
}

function renderEcon() {
  const e = state.econ;
  const q = state.data.quarters[state.data.quarters.length - 1];
  const totalPop = STATES.reduce((a, s) => a + popAt(s.code, q), 0);
  const series = [
    { label: 'Share of Australia\'s Claude usage', color: 'var(--s1)' },
    { label: 'Share of Australia\'s population', color: 'var(--s2)' },
  ];
  const data = STATES.map((s) => ({ ...s, ...(e.states[s.code] ?? {}), label: s.abbr, pop: popAt(s.code, q) / totalPop * 100 }))
    .map((d) => ({ ...d, values: [d.share ?? NaN, d.pop] })).sort((a, b) => b.pop - a.pop);
  const pctf = (v) => `${v.toFixed(1)}%`;
  pairBars($('eibars'), data, series, pctf, (v) => `${v}%`, (d) => [d.name, d.share === undefined
    ? [{ color: 'transparent', label: 'not published for this territory', value: '–' }]
    : [
      { color: 'var(--s1)', label: 'share of national Claude usage', value: pctf(d.share) },
      { color: 'var(--s2)', label: 'share of national population', value: pctf(d.pop) },
      { color: 'transparent', label: `work · national ${e.national.work}%`, value: `${d.work}%` },
      { color: 'transparent', label: `personal · national ${e.national.personal}%`, value: `${d.personal}%` },
      { color: 'transparent', label: `coursework · national ${e.national.coursework}%`, value: `${d.coursework}%` },
      { color: 'transparent', label: `augmentation (working with Claude) · national ${e.national.augmentation}%`, value: `${d.augmentation}%` },
      { color: 'transparent', label: `top task category: ${d.topCategory[0]}`, value: `${d.topCategory[1]}%` },
      { color: 'transparent', label: `top request topic: ${d.topTopic[0]}`, value: `${d.topTopic[1]}%` },
    ]]);
  legendOf('ei-legend', series);
  const n = e.national;
  $('ei-note').textContent = `Period ${e.period}. Australia ranks ${n.rank} of ${n.rankedOutOf} countries on the Anthropic Usage Index at ${n.usageIndex}: `
    + 'its share of Claude usage is that many times its share of the world\'s working-age population (1.0 = proportional). '
    + `Conversations split ${n.work}% work, ${n.personal}% personal and ${n.coursework}% coursework (global ${n.global.work}%, ${n.global.personal}%, ${n.global.coursework}%). `
    + 'State figures are each state\'s share of Australian usage, which tracks population size; the Northern Territory is not published.';
  simpleTable('ei-cat', ['Task category', 'Australia', 'Global'], n.topCategories.map(([name, a, g]) => [name, `${a}%`, `${g}%`]));
}

function renderKpis(rows, aus, label) {
  const topPc = [...rows].sort((a, b) => b.perCapita - a.perCapita)[0];
  const fastest = [...rows].sort((a, b) => b.growth - a.growth)[0];
  const tiles = [
    { label: `Australia, ${label}`, value: fmtBn(aus.total), delta: aus.growth, note: 'on previous year' },
    { label: 'Per person, Australia', value: fmtPp(aus.perCapita), note: `${(aus.people / 1e6).toFixed(1)}m people` },
    { label: 'Highest per person', value: topPc.abbr, note: `${fmtPp(topPc.perCapita)} per person` },
    { label: 'Fastest growth', value: fastest.abbr, delta: fastest.growth, note: 'on previous year' },
  ];
  $('kpis').replaceChildren(...tiles.map((t) => {
    const card = el('div', { class: 'kpi' });
    const delta = el('div', { class: 'delta' });
    if (t.delta !== undefined && Number.isFinite(t.delta)) {
      delta.append(el('span', { class: t.delta >= 0 ? 'up' : 'down' }, `${t.delta >= 0 ? '▲' : '▼'} ${fmtPct(t.delta)}`), ` ${t.note}`);
    } else {
      delta.textContent = t.note;
    }
    card.append(el('div', { class: 'label' }, t.label), el('div', { class: 'value' }, t.value), delta);
    return card;
  }));
}

function renderFindings(rows, aus, label) {
  const byTotal = [...rows].sort((a, b) => b.total - a.total);
  const byPc = [...rows].sort((a, b) => b.perCapita - a.perCapita);
  const byGrowth = [...rows].filter((r) => Number.isFinite(r.growth)).sort((a, b) => b.growth - a.growth);
  const top2Share = (byTotal[0].total + byTotal[1].total) / aus.total;
  const cmwlthShare = aus.cc / aus.total;
  const invShare = (aus.gi + aus.pi) / aus.total;
  const items = [
    `In ${label}, public spending across all states and territories totalled ${fmtBn(aus.total)}` +
      (Number.isFinite(aus.growth) ? `, ${fmtPct(aus.growth)} on the previous year.` : '.'),
    `${byTotal[0].name} (${fmtBn(byTotal[0].total)}) and ${byTotal[1].name} (${fmtBn(byTotal[1].total)}) together account for ${(top2Share * 100).toFixed(0)}% of the total.`,
    `Per person, ${byPc[0].name} is highest at ${fmtPp(byPc[0].perCapita)} and ${byPc[byPc.length - 1].name} lowest at ${fmtPp(byPc[byPc.length - 1].perCapita)}, against a national ${fmtPp(aus.perCapita)}.`,
  ];
  if (byGrowth.length) {
    const lo = byGrowth[byGrowth.length - 1];
    items.push(`Growth was fastest in ${byGrowth[0].name} (${fmtPct(byGrowth[0].growth)}) and slowest in ${lo.name} (${fmtPct(lo.growth)}).`);
  }
  const fedHeavy = [...rows].sort((a, b) => b.cc / b.total - a.cc / a.total)[0];
  if (fedHeavy.cc / fedHeavy.total > 1.5 * cmwlthShare) {
    items.push(`${fedHeavy.name} stands out because ${(fedHeavy.cc / fedHeavy.total * 100).toFixed(0)}% of its total is Commonwealth consumption (national average ${(cmwlthShare * 100).toFixed(0)}%), which raises its per-person figure.`);
  }
  items.push(`Commonwealth consumption makes up ${(cmwlthShare * 100).toFixed(0)}% of the total; investment by governments and public corporations makes up ${(invShare * 100).toFixed(0)}%.`);
  $('findings').replaceChildren(...items.map((t) => el('li', {}, t)));
}

function roundedRight(x, y, w, h, r) {
  const rr = Math.min(r, w, h / 2);
  return `M${x},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h - rr}Q${x + w},${y + h} ${x + w - rr},${y + h}H${x}Z`;
}

function niceTicks(max, count = 5) {
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
  const ticks = [];
  for (let v = 0; v <= max + step * 0.001; v += step) ticks.push(v);
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

const tickFmt = (v) => (state.metric === 'total' ? `$${v / 1e9}bn` : `$${(v / 1000).toLocaleString('en-AU')}k`);

function renderBars(rows, label) {
  const box = $('bars');
  const W = Math.max(320, box.clientWidth);
  const left = 44, right = 76, top = 8, rowH = 32, barH = 20;
  const sorted = [...rows].sort((a, b) => b[state.metric] - a[state.metric]);
  const scaleOf = (r) => (state.metric === 'total' ? 1 : 1 / r.people);
  const ticks = niceTicks(Math.max(...sorted.map((r) => r[state.metric])), W < 560 ? 3 : 5);
  const max = ticks[ticks.length - 1];
  const plotW = W - left - right;
  const H = top + sorted.length * rowH + 24;
  const x = (v) => left + (v / max) * plotW;

  const svg = el('svg:svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `Public spending by state, ${label}` });
  for (const t of ticks) {
    svg.append(el('svg:line', { class: 'gridline', x1: x(t), x2: x(t), y1: top, y2: H - 20 }));
    svg.append(el('svg:text', { x: x(t), y: H - 4, 'text-anchor': 'middle' }, tickFmt(t)));
  }
  sorted.forEach((r, i) => {
    const y = top + i * rowH + (rowH - barH) / 2;
    const g = el('svg:g', { class: `row${r.code === state.sel ? ' sel' : ''}`, tabindex: '0', role: 'button', 'aria-label': `${r.name}: ${fmtMetric(r[state.metric])}` });
    g.append(el('svg:text', { class: 'lbl', x: 0, y: y + barH / 2 + 4 }, r.abbr));
    let cx = left;
    const k = scaleOf(r);
    const parts = PARTS.filter((p) => r[p.key] * k > 0);
    parts.forEach((p, j) => {
      const w = (r[p.key] * k / max) * plotW;
      const gap = j < parts.length - 1 ? 2 : 0;
      const shape = j === parts.length - 1
        ? el('svg:path', { d: roundedRight(cx, y, Math.max(0, w), barH, 4) })
        : el('svg:rect', { x: cx, y, width: Math.max(0, w - gap), height: barH });
      shape.style.fill = p.color;
      const show = (e) => showTip(e, `${r.name}, ${label}`, PARTS.map((pp) => ({
        color: pp.color, label: `${pp.label} (${(r[pp.key] / r.total * 100).toFixed(0)}%)`,
        value: fmtMetric(r[pp.key] * k), sel: pp.key === p.key,
      })));
      shape.addEventListener('pointermove', show);
      shape.addEventListener('pointerleave', hideTip);
      g.append(shape);
      cx += w;
    });
    g.append(el('svg:text', { class: 'val', x: cx + 6, y: y + barH / 2 + 4 }, fmtMetric(r[state.metric])));
    // Full-row hit area so short bars are easy to target.
    const hit = el('svg:rect', { x: 0, y: top + i * rowH, width: W, height: rowH, fill: 'transparent' });
    g.prepend(hit);
    const choose = () => { state.sel = r.code; $('state').value = r.code; render(); };
    g.addEventListener('click', choose);
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
    svg.append(g);
  });
  svg.append(el('svg:line', { class: 'baseline', x1: left, x2: left, y1: top, y2: H - 20 }));
  box.replaceChildren(svg);
  $('bars-note').textContent = state.metric === 'total'
    ? `Financial year ${label}, sorted by total. Click a state to highlight it.`
    : `Financial year ${label}, dollars per resident, sorted. Click a state to highlight it.`;
}

function renderTrend() {
  const box = $('trend');
  const { quarters, spend } = state.data;
  const W = Math.max(320, box.clientWidth);
  const H = Math.round(Math.min(360, Math.max(240, W * 0.42)));
  const left = 56, right = 48, top = 12, bottom = 28;
  const xs = quarters.slice(3); // rolling 4-quarter sums need 3 prior quarters
  const series = STATES.map((st) => ({
    ...st,
    values: xs.map((p, i) => {
      const sum = quarters.slice(i, i + 4).reduce((a, q) => a + spend[st.code][q].total, 0);
      return state.metric === 'total' ? sum : sum / popAt(st.code, p);
    }),
  }));
  const ticks = niceTicks(Math.max(...series.flatMap((s) => s.values.filter(Number.isFinite))));
  const max = ticks[ticks.length - 1];
  const x = (i) => left + (i / (xs.length - 1)) * (W - left - right);
  const y = (v) => H - bottom - (v / max) * (H - top - bottom);

  const svg = el('svg:svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Rolling 12-month public spending by state' });
  for (const t of ticks) {
    svg.append(el('svg:line', { class: t === 0 ? 'baseline' : 'gridline', x1: left, x2: W - right, y1: y(t), y2: y(t) }));
    svg.append(el('svg:text', { x: left - 6, y: y(t) + 4, 'text-anchor': 'end' }, tickFmt(t)));
  }
  const yearStep = W < 560 ? 4 : 2;
  xs.forEach((p, i) => {
    if (p.endsWith('Q2') && Number(p.slice(0, 4)) % yearStep === 0) {
      svg.append(el('svg:text', { x: x(i), y: H - 8, 'text-anchor': 'middle' }, p.slice(0, 4)));
    }
  });
  const path = (vals) => vals.map((v, i) => (Number.isFinite(v) ? `${i && Number.isFinite(vals[i - 1]) ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}` : '')).join('');
  const selected = series.find((s) => s.code === state.sel);
  for (const s of series) {
    if (s === selected) continue;
    svg.append(el('svg:path', { d: path(s.values), fill: 'none', stroke: 'var(--deemph)', 'stroke-width': 1.5 }));
  }
  svg.append(el('svg:path', { d: path(selected.values), fill: 'none', stroke: 'var(--s1)', 'stroke-width': 2 }));
  const lastI = xs.length - 1;
  svg.append(el('svg:circle', { cx: x(lastI), cy: y(selected.values[lastI]), r: 4, fill: 'var(--s1)', stroke: 'var(--surface)', 'stroke-width': 2 }));
  svg.append(el('svg:text', { class: 'lbl', x: x(lastI) + 8, y: y(selected.values[lastI]) + 4 }, selected.abbr));

  const cross = el('svg:line', { class: 'crosshair', y1: top, y2: H - bottom, visibility: 'hidden' });
  svg.append(cross);
  const overlay = el('svg:rect', { x: left, y: top, width: W - left - right, height: H - top - bottom, fill: 'transparent' });
  overlay.addEventListener('pointermove', (e) => {
    const r = svg.getBoundingClientRect();
    const px = (e.clientX - r.left) * (W / r.width);
    const i = Math.max(0, Math.min(lastI, Math.round(((px - left) / (W - left - right)) * lastI)));
    cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('visibility', 'visible');
    const rows = [...series].sort((a, b) => b.values[i] - a.values[i]).map((s) => ({
      color: s === selected ? 'var(--s1)' : 'var(--deemph)', label: s.abbr, value: fmtMetric(s.values[i]), sel: s === selected,
    }));
    showTip(e, `12 months to ${qLabel(xs[i])}`, rows);
  });
  overlay.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); hideTip(); });
  svg.append(overlay);
  box.replaceChildren(svg);
  $('trend-note').textContent = `${selected.name} highlighted in blue; other states in grey. Each point is the sum of the previous four quarters${state.metric === 'perCapita' ? ', per resident' : ''}.`;
}

function renderTable(rows, aus, label, popPeriod) {
  const t = $('table');
  const head = ['State', `Total ${label}`, 'Per person', 'Change on year', ...PARTS.map((p) => p.label)];
  const thead = el('thead');
  const hr = el('tr');
  head.forEach((h) => hr.append(el('th', { scope: 'col' }, h)));
  thead.append(hr);
  const cells = (r, name) => [name, fmtBn(r.total), fmtPp(r.perCapita), fmtPct(r.growth), ...PARTS.map((p) => `${(r[p.key] / r.total * 100).toFixed(0)}%`)];
  const tbody = el('tbody');
  for (const r of [...rows].sort((a, b) => b[state.metric] - a[state.metric])) {
    const tr = el('tr', r.code === state.sel ? { class: 'sel' } : {});
    cells(r, r.name).forEach((c) => tr.append(el('td', {}, c)));
    tbody.append(tr);
  }
  const tfoot = el('tfoot');
  const fr = el('tr');
  cells(aus, 'Australia').forEach((c) => fr.append(el('td', {}, c)));
  tfoot.append(fr);
  const cap = el('caption', { class: 'note' }, `Population as at ${qLabel(popPeriod)} or latest published. Component columns are shares of each state's total.`);
  cap.style.captionSide = 'bottom';
  cap.style.textAlign = 'left';
  t.replaceChildren(cap, thead, tbody, tfoot);
}

// ---------- boot ----------

function renderLegend() {
  $('legend').replaceChildren(...PARTS.map((p) => {
    const s = el('span');
    const sw = el('i');
    sw.style.background = p.color;
    s.append(sw, p.label);
    return s;
  }));
}

function setupControls(years) {
  const yearSel = $('year');
  yearSel.replaceChildren(...[...years].reverse().map((y) => el('option', { value: y }, fyLabel(y))));
  yearSel.value = state.fy;
  yearSel.addEventListener('change', () => { state.fy = Number(yearSel.value); render(); });

  const stateSel = $('state');
  stateSel.replaceChildren(...STATES.map((s) => el('option', { value: s.code }, s.name)));
  stateSel.value = state.sel;
  stateSel.addEventListener('change', () => { state.sel = stateSel.value; render(); });

  for (const b of document.querySelectorAll('.seg button')) {
    b.addEventListener('click', () => {
      state.metric = b.dataset.metric;
      for (const o of document.querySelectorAll('.seg button')) o.setAttribute('aria-checked', String(o === b));
      render();
    });
  }
  let pending;
  window.addEventListener('resize', () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(render); });
}

(async function main() {
  const status = $('status');
  try {
    state.data = await load();
  } catch (err) {
    console.error(err);
    status.textContent = 'Could not load data from the ABS or the local snapshot. If you opened index.html directly from disk, serve the folder instead (e.g. "python3 -m http.server").';
    status.classList.add('warn');
    return;
  }
  const years = completeYears(state.data.quarters);
  state.fy = years[years.length - 1];
  const latest = state.data.quarters[state.data.quarters.length - 1];
  status.textContent = state.data.origin === 'live'
    ? `Live from the ABS Data API · latest quarter ${qLabel(latest)}`
    : `ABS live feed unavailable — showing saved snapshot${state.data.fetchedAt ? ` from ${state.data.fetchedAt.slice(0, 10)}` : ''} · latest quarter ${qLabel(latest)}`;
  const loadJson = (name) => window.EMBED?.[name] ?? fetchText(`data/${name}.json`, 10000).then(JSON.parse).catch(() => null);
  [state.geo, state.tax, state.companies, state.contracts, state.econ, state.debt] = await Promise.all(
    ['states', 'state-tax', 'company-tax', 'contracts', 'economic-index', 'state-debt'].map(loadJson));
  const jobsCsv = window.EMBED?.vacancies ?? await fetchText('data/vacancies.csv', 10000).catch(() => null);
  if (jobsCsv) {
    state.jobs = {};
    for (const r of parseCsv(jobsCsv)) {
      if (r.OBS_VALUE) ((state.jobs[r.REGION] ??= {})[r.TIME_PERIOD] ??= {})[r.SECTOR] = Number(r.OBS_VALUE) * 1000;
    }
  }
  for (const [id, key] of [['jobs-card', 'jobs'], ['debt-card', 'debt'], ['tax-card', 'tax'], ['co-card', 'companies'], ['ct-card', 'contracts'], ['ei-card', 'econ']]) {
    $(id).hidden = !state[key];
  }
  setupControls(years);
  $('job-state').replaceChildren(el('option', { value: 'all' }, 'All of Australia'), ...STATES.map((x) => el('option', { value: x.code }, x.name)));
  $('job-form').addEventListener('submit', (e) => { e.preventDefault(); renderJobSearch(); });
  $('job-state').addEventListener('change', renderJobSearch);
  renderJobSearch();
  renderLegend();
  render();
})();
