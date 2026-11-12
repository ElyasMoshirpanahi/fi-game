// Specs 9 to 13 browser pass: the Path, the Lesson pop-up, the navigation, the Profile and the rail
// at phone (360), tablet (820) and desktop (1366) width, in EN and FA.
// node scripts/playtest/shell-pass.mjs <outDir> <debugPort>
// Serve the repo first, for example: python -m http.server 8766. GAME_URL overrides the address.
// <outDir> is created fresh and holds the browser profile and the screenshots: use a folder outside the repo.
import fs from 'node:fs';
import path from 'node:path';
import { launch } from './cdp-lib.mjs';
const out = process.argv[2];
const b = await launch(out, { port: +(process.argv[3] || 9590), width: 1400, height: 900 });
const U = (process.env.GAME_URL || 'http://localhost:8766/index.html') + '?shell=';
const report = {};
const shot = async (name) => { const r = await b.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(r.result.data, 'base64')); };
const size = async (w, h, mobile) => { await b.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile: !!mobile }); await b.sleep(350); };
const act = (code) => b.js(`${code}; await wait(380); return 1;`);
const AUDIT = `
  const vw = innerWidth; const res = { wide: [], small: [], covered: [] };
  const name = (el) => (el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '') + (el.getAttribute('data-action') ? '[' + JSON.parse(el.getAttribute('data-action')).type + ']' : ''));
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const skip = (el) => el.closest('.roadlayer, #fx, svg, .confetti, .scan, .ring') || el.id === 'fx';
  for (const el of document.querySelectorAll('#app *')) {
    if (skip(el) || !visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) res.wide.push(name(el) + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > vw) res.wide.push('PAGE scrollWidth ' + document.documentElement.scrollWidth);
  const controls = [...document.querySelectorAll('#app button, #app a[href], #app input, #app textarea')].filter((el) => visible(el) && !el.disabled);
  for (const el of controls) {
    const r = el.getBoundingClientRect();
    const habit = el.classList.contains('cell') && r.height >= 43.5;
    if (Math.min(r.width, r.height) < 44 - 0.5 && !habit) res.small.push(name(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
  }
  // At the end of the page: is any control under the navigation or the Disclaimer?
  const y = scrollY; scrollTo(0, document.documentElement.scrollHeight); await wait(150);
  for (const el of controls) {
    if (el.closest('.nav, .rail')) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) continue;
    const top = document.elementFromPoint(Math.min(vw - 2, Math.max(2, r.left + r.width / 2)), Math.min(innerHeight - 2, Math.max(2, r.top + r.height / 2)));
    if (top && top !== el && !el.contains(top) && !top.contains(el)) { const over = top.closest('.nav, .disc, .combo'); if (over && !over.contains(el)) res.covered.push(name(el) + ' under ' + name(over)); }
  }
  scrollTo(0, y);
  const uniq = (a) => [...new Set(a)];
  return { wide: uniq(res.wide).slice(0, 10), small: uniq(res.small).slice(0, 20), covered: uniq(res.covered).slice(0, 10) };`;
const audit = async (label) => { await b.sleep(200); report[label] = await b.js(AUDIT); };
const LAYOUT = `
  const box = (sel) => { const el = q(sel); if (!el) return null; const cs = getComputedStyle(el); if (cs.display === 'none') return 'hidden'; const r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)].join(','); };
  return { vw: innerWidth, vh: innerHeight, nav: box('.nav'), navPos: q('.nav') ? getComputedStyle(q('.nav')).position : null, label: box('.navlabel'), rail: box('.rail'), main: box('main'), top: box('.top'), disc: box('.disc'), picker: box('.picker'),
    secs: qa('.sec').length, roads: qa('.road .rbase').filter((p) => (p.getAttribute('d') || '').length > 10).length, go: qa('.go').length, font: getComputedStyle(q('h1') || q('h2')).fontFamily.split(',')[0], h1shadow: q('h1') ? getComputedStyle(q('h1')).textShadow : null };`;

for (const [tag, w, h, mobile] of [['phone', 360, 740, true], ['tablet', 820, 1100, false], ['desktop', 1366, 800, false]]) {
  await size(w, h, mobile);
  await b.go(U + tag + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + tag + Date.now()); await b.sleep(900);
  report[tag + ' layout'] = await b.js(LAYOUT);
  await shot(tag + '-1-path'); await audit(tag + ' path EN');
  // paint time of the whole Path
  report[tag + ' paint ms'] = await b.js(`const t0 = performance.now(); for (let i = 0; i < 5; i++) find('SET_MODE','EN').click(); const full = Math.round((performance.now() - t0) / 5); const c = qa('.node.circle .ubtn')[3]; const t1 = performance.now(); c.click(); const open = Math.round(performance.now() - t1); qa('.node.circle .ubtn')[3].click(); return { full, circleTap: open };`);
  // a Circle in the second Section: the left-most and right-most node of the wave
  const pops = [];
  for (const i of [2, 6, 0]) {
    const r = await b.js(`const before = document.documentElement.scrollHeight; const btn = qa('#' + qa('.sec')[1].id + ' .node.circle .ubtn')[${i}] || qa('.sec.book .node.circle .ubtn')[${i}]; if (!btn) return null; btn.scrollIntoView({ block: 'center' }); btn.click(); await wait(450);
      const p = q('.lpop'); const l = q('.lessons'); const shown = (el) => el && getComputedStyle(el).display !== 'none';
      const r = shown(p) ? p.getBoundingClientRect() : null; const start = shown(p) ? p.querySelector('[data-pop-focus]') : null; const sr = start ? start.getBoundingClientRect() : null;
      const topEl = sr ? document.elementFromPoint(sr.left + sr.width / 2, sr.top + sr.height / 2) : null;
      return { pop: r ? [Math.round(r.left), Math.round(r.right), Math.round(r.top), Math.round(r.bottom)].join(',') : 'hidden', inside: r ? (r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight) : null, startOnTop: start ? (topEl === start || start.contains(topEl)) : null, focus: start ? document.activeElement === start : null, list: shown(l), grew: document.documentElement.scrollHeight - before };`);
    pops.push(r);
    if (i === 2) await shot(tag + '-2-circle-open');
  }
  report[tag + ' circle'] = pops;
  if (mobile) { await act(`q('.lpop .ldot:nth-child(2)') && q('.lpop .ldot:nth-child(2)').click()`); await audit(tag + ' pop-up'); await act(`q('h1').click()`); report[tag + ' closed by outside tap'] = await b.js(`return !q('.lpop');`); }
  else await act(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
  await act(`scrollTo(0, 0)`);
  if (tag !== 'desktop') { await act(`find('UI_PICKER').click()`); await shot(tag + '-3-sheet'); await audit(tag + ' sheet'); await act(`find('UI_JUMP_SECTION', qa('.sec')[5].id).click()`); await b.sleep(700); report[tag + ' jump'] = await b.js(`const r = qa('.sec')[5].getBoundingClientRect(); return { top: Math.round(r.top), sheet: !!q('.sheet') };`); }
  else { await act(`qa('.rail .row')[5].click()`); await b.sleep(700); report[tag + ' jump'] = await b.js(`const r = qa('.sec')[5].getBoundingClientRect(); return { top: Math.round(r.top), here: (q('.rail .row.here') || {}).dataset ? q('.rail .row.here').dataset.sec : null, want: qa('.sec')[5].id };`); await shot(tag + '-3-scrolled'); }
  // a Lesson, and back to the place
  await act(`scrollTo(0, 0)`);
  await act(`find('OPEN_STATION','s1').click()`); await shot(tag + '-4-card'); await audit(tag + ' Card');
  report[tag + ' in run'] = await b.js(`return { nav: getComputedStyle(q('.nav')).display, rail: q('.rail') ? 'present' : 'none' };`);
  await act(`find('RATE','knew').click()`); await audit(tag + ' Check');
  await act(`find('BACK_TO_PATH').click()`);
  for (const [key, type, value] of [['review', 'OPEN_REVIEW'], ['shelf', 'OPEN_TOOLS', 's6'], ['bookmarks', 'OPEN_BOOKMARKS'], ['profile', 'OPEN_PROFILE']]) {
    await act(`q('[data-nav="${key}"]').click()`);
    report[tag + ' ' + key] = await b.js(`return { current: (q('.navitem[aria-current]') || {}).dataset.nav, scrollY: Math.round(scrollY) };`);
    await audit(tag + ' ' + key);
    if (key === 'profile' || key === 'shelf') await shot(tag + '-5-' + key);
  }
  await act(`find('UI_RESET_ASK').click()`); await audit(tag + ' reset confirm'); await act(`find('UI_RESET_CANCEL').click()`);
  await act(`q('[data-nav="learn"]').click()`);
  await act(`find('SET_MODE','FA').click()`); await b.sleep(400); await shot(tag + '-6-path-fa'); await audit(tag + ' path FA');
  report[tag + ' FA layout'] = await b.js(LAYOUT);
  await act(`const btn = qa('.sec.book .node.circle .ubtn')[1]; btn.scrollIntoView({ block: 'center' }); btn.click()`); await shot(tag + '-7-circle-fa');
  report[tag + ' FA circle'] = await b.js(`const p = q('.lpop'); if (!p || getComputedStyle(p).display === 'none') return 'hidden'; const r = p.getBoundingClientRect(); return { inside: r.left >= 0 && r.right <= innerWidth };`);
  await act(`find('SET_MODE','EN').click()`);
}
// resize without a reload: desktop to phone, the road is drawn again
await size(360, 740, true); await b.sleep(500);
report['resize to phone'] = await b.js(LAYOUT);
const isAudit = (v) => !!v && Array.isArray(v.wide);
const flat = Object.entries(report).filter(([, v]) => isAudit(v)).map(([k, v]) => ({ screen: k, ...v })).filter((x) => x.wide.length || x.small.length || x.covered.length);
const rest = Object.fromEntries(Object.entries(report).filter(([, v]) => !isAudit(v)));
console.log(JSON.stringify({ audited: Object.keys(report).length - Object.keys(rest).length, problems: flat, facts: rest, errors: b.errors }, null, 1));
b.close();
