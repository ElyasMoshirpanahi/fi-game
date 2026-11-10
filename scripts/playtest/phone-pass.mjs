// Spec 7 phone pass at 360 x 740: on each screen, nothing wider than the viewport, tap targets of 44 px,
// and no control covered by the fixed picker button or the disclaimer.
// node scripts/playtest/phone-pass.mjs <outDir> <debugPort> [shots]   (PHONE_W and PHONE_H set another size)
// <outDir> is created fresh and holds the browser profile and any screenshots: use a folder outside the repo.
import { launch } from './cdp-lib.mjs';
const b = await launch(process.argv[2], { port: +(process.argv[3] || 9580), width: 420, height: 860 });
const shots = process.argv[4] === 'shots';
const W = +(process.env.PHONE_W || 360), H = +(process.env.PHONE_H || 740);
await b.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
// Serve the repo first, for example: python -m http.server 8766. GAME_URL overrides the address.
const U = (process.env.GAME_URL || 'http://localhost:8766/index.html') + '?phone=';
await b.go(U + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + Date.now()); await b.sleep(500);
const AUDIT = `
  const vw = innerWidth; const out = { wide: [], small: [], covered: [] };
  const name = (el) => (el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '') + (el.getAttribute('data-action') ? '[' + JSON.parse(el.getAttribute('data-action')).type + ']' : ''));
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const skip = (el) => el.closest('.roadlayer, #fx, svg, .confetti, .scan, .ring') || el.id === 'fx';
  for (const el of document.querySelectorAll('#app *')) {
    if (skip(el) || !visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) out.wide.push(name(el) + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > vw) out.wide.push('PAGE scrollWidth ' + document.documentElement.scrollWidth);
  const controls = [...document.querySelectorAll('#app button, #app a[href], #app input, #app textarea, #app select')].filter((el) => visible(el) && !el.disabled);
  for (const el of controls) {
    const r = el.getBoundingClientRect();
    const range = false; // sliders are held to the same 44 px
    const habit = el.classList.contains('cell') && r.height >= 43.5; // the documented exception: 44 tall, as wide as a week allows
    if (Math.min(r.width, r.height) < 44 - 0.5 && !range && !habit) out.small.push(name(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
  }
  // At the bottom of the page: is any control under the fixed picker or the disclaimer?
  const y = scrollY; scrollTo(0, document.documentElement.scrollHeight); await wait(120);
  for (const el of controls) {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) continue;
    const top = document.elementFromPoint(Math.min(vw - 2, Math.max(2, r.left + r.width / 2)), Math.min(innerHeight - 2, Math.max(2, r.top + r.height / 2)));
    if (top && top !== el && !el.contains(top) && !top.contains(el)) { const over = top.closest('.picker, .disc, .combo'); if (over && over !== el && !over.contains(el)) out.covered.push(name(el) + ' under ' + name(over)); }
  }
  scrollTo(0, y);
  const uniq = (a) => [...new Set(a)];
  return { wide: uniq(out.wide).slice(0, 12), small: uniq(out.small).slice(0, 30), covered: uniq(out.covered).slice(0, 12) };`;
const report = {};
const audit = async (label) => { await b.sleep(250); report[label] = await b.js(AUDIT); if (shots) await b.frame(1); };
const act = (code) => b.js(`${code}; await wait(350); return 1;`);
const R1 = `const right = (id) => { const k = FI.content.item(id, cur(id)); return k; };`;

await audit('path EN');
await act(`find('SET_MODE','FA').click()`); await audit('path FA');
await act(`find('SET_MODE','BOTH').click()`); await audit('path BOTH');
await act(`find('SET_MODE','EN').click()`);
await act(`const f = q('[data-find]'); f.value = 'money'; f.dispatchEvent(new Event('input', { bubbles: true }))`); await audit('search results');
await act(`const f = q('[data-find]'); f.value = ''; f.dispatchEvent(new Event('input', { bubbles: true }))`);
await act(`find('UI_PICKER').click()`); await audit('section picker');
await act(`find('UI_PICKER').click()`);
await act(`qa('.sechead')[1].click()`); await act(`q('.node.circle .ubtn').click()`); await audit('book section, Circle open');
await act(`find('UI_RESTORE_OPEN').click()`); await act(`const t = q('[data-restore-text]'); t.value = JSON.stringify({ app: 'fi-roadmap', format: 1, exported: '2026-11-11', data: { v: 1, xp: 50, coins: 3 } }); t.dispatchEvent(new Event('input', { bubbles: true }))`); await audit('restore panel with summary');
await act(`find('UI_RESTORE_CLOSE').click()`);
await act(`find('UI_RESET_ASK').click()`); await audit('reset confirm'); await act(`find('UI_RESET_CANCEL').click()`);
await act(`find('OPEN_STATION','s1').click()`); await audit('Card');
await act(`q('.markbtn').click()`);
await act(`find('RATE','knew').click()`); await audit('Check (tap)');
// answer right, see feedback
await act(`const id = 's1k1'; const k = FI.content.item('s1', id); const want = JSON.stringify(k.answer); qa('[data-action]').find((x) => { const a = JSON.parse(x.getAttribute('data-action')); return a.type === 'ANSWER' && JSON.stringify(a.value) === want; }).click()`); await audit('feedback');
// walk on to an order Check if the Station has one, then to the Fare and the result
const walk = `const st = FI.content.station('s1'); const shown = () => { const p = q('.prompt'); if (!p) return null; const t = p.textContent; return st.items.find((i) => i.kind === 'check' && (t.includes(i.prompt.en) || t.includes(i.fare.en))); };
  const answer = (k) => { const want = JSON.stringify(k.answer); if (k.type === 'order') { for (const i of k.answer) find('UI_ORDER_ADD', i).click(); return qa('[data-action]').find((x) => JSON.parse(x.getAttribute('data-action')).type === 'ANSWER').click(); } return qa('[data-action]').find((x) => { const a = JSON.parse(x.getAttribute('data-action')); return a.type === 'ANSWER' && JSON.stringify(a.value) === want; }).click(); };`;
let sawOrder = false, sawFare = false;
for (let i = 0; i < 80; i++) {
  const st = await b.js(`${walk}
    if (q('.result')) return 'result';
    const k = shown();
    if (k && k.type === 'order' && !window.__order) { window.__order = 1; return 'order'; }
    if (q('.kicker.fare') && !window.__fare) { window.__fare = 1; return 'fare'; }
    if (find('RATE','knew')) { find('RATE','knew').click(); return 'knew'; }
    if (q('.feedback') && find('CONTINUE')) { find('CONTINUE').click(); return 'continue'; }
    if (k) { answer(k); return 'answer'; }
    if (find('CONTINUE')) { find('CONTINUE').click(); return 'continue'; }
    return 'none';`);
  await b.sleep(120);
  if (st === 'order' && !sawOrder) { sawOrder = true; await act(`find('UI_ORDER_ADD', 0) && find('UI_ORDER_ADD', 0).click()`); await audit('Check (order)'); await act(`find('UI_ORDER_CLEAR') && find('UI_ORDER_CLEAR').click()`); }
  if (st === 'fare' && !sawFare) { sawFare = true; await audit('Fare'); }
  if (st === 'result' || st === 'none') break;
}
await audit('Fare passed');
await act(`find('CONTINUE').click()`);
await act(`qa('.sechead')[0].click()`);
for (const id of ['s1', 's4', 's5', 's6']) { await act(`find('OPEN_TOOLS', ${JSON.stringify(id)}) ? find('OPEN_TOOLS', ${JSON.stringify(id)}).click() : 0`); await audit('Tools ' + id); await act(`find('BACK_TO_PATH') ? find('BACK_TO_PATH').click() : 0`); }
await act(`find('OPEN_BOOKMARKS').click()`); await audit('Bookmarks'); await act(`find('BACK_TO_PATH').click()`);
await act(`if (!q('.secbar')) qa('.sechead')[1].click()`); await act(`q('.secbar [data-action]').click()`); await act(`const t = q('[data-note]'); t.value = 'A note. یک یادداشت.'; t.dispatchEvent(new Event('input', { bubbles: true }))`); await audit('Notes'); await act(`find('BACK_TO_PATH').click()`);
await act(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); for (const k of Object.keys(d.deck)) d.deck[k].due = 0; localStorage.setItem('fi-roadmap-v1', JSON.stringify(d))`);
await b.go(U + 'r' + Date.now()); await b.sleep(500);
await act(`find('OPEN_REVIEW').click()`); await audit('Review Card');
await act(`find('REVIEW_NEXT') && find('REVIEW_NEXT').click()`); await audit('Review Check');
const flat = Object.entries(report).map(([k, v]) => ({ screen: k, ...v })).filter((x) => x.wide.length || x.small.length || x.covered.length);
console.log(JSON.stringify({ screens: Object.keys(report).length, clean: Object.keys(report).length - flat.length, problems: flat, errors: b.errors }, null, 1));
b.close();
