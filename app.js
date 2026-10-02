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
    let key = null;
    if (r.DATA_ITEM === 'FCE' && r.SECTOR === 'GGC') key = 'cc';
    else if (r.DATA_ITEM === 'FCE' && r.SECTOR === 'GGS_SL') key = 'sc';
    else if (r.DATA_ITEM === 'GFC' && r.SECTOR === 'GGS') key = 'gi';
    else if (r.DATA_ITEM === 'GFC' && (r.SECTOR === 'GES_SL' || r.SECTOR === 'GEC')) key = 'pi';
    if (!key) continue;
    const s = (spend[r.REGION] ??= {});
    const q = (s[r.TIME_PERIOD] ??= { cc: 0, sc: 0, gi: 0, pi: 0 });
    q[key] += v;
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
  const acc = { cc: 0, sc: 0, gi: 0, pi: 0, total: 0 };
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
  const aus = { cc: 0, sc: 0, gi: 0, pi: 0, total: 0, people: 0, prevTotal: 0 };
  for (const r of rows) {
    for (const k of ['cc', 'sc', 'gi', 'pi', 'total', 'people']) aus[k] += r[k];
    if (hasPrev) aus.prevTotal += r.total / (1 + r.growth);
  }
  aus.perCapita = aus.total / aus.people;
  aus.growth = hasPrev ? aus.total / aus.prevTotal - 1 : NaN;
  return { rows, aus, popPeriod: qs[3] };
}

// ---------- formatting ----------

const fmtBn = (v) => `$${(v / 1e9).toLocaleString('en-AU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}bn`;
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
    ...PARTS.map((p) => ({
      color: p.color,
      label: `${p.label} · ${(r[p.key] / r.total * 100).toFixed(0)}% · ${fmtPp(r[p.key] / r.people)} per person`,
      value: fmtBn(r[p.key]),
    })),
  ];
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
  state.geo = window.EMBED?.geo ?? await fetchText('data/states.json', 10000).then(JSON.parse).catch(() => null);
  setupControls(years);
  renderLegend();
  render();
})();
