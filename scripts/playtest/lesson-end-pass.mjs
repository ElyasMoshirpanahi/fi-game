// Spec 14, release 1 browser pass: the three screens that end a Lesson, and Continue offering a due Review,
// at phone (360) and desktop (1366) width, in EN and FA.
// node scripts/playtest/lesson-end-pass.mjs <outDir> <debugPort>
// Serve the repo first, for example: python -m http.server 8766. GAME_URL overrides the address.
// <outDir> is created fresh and holds the browser profile and the screenshots: use a folder outside the repo.
// It clears localStorage inside its own fresh profile only. Never point it at a browser that holds real progress.
import fs from 'node:fs';
import path from 'node:path';
import { launch } from './cdp-lib.mjs';
const out = process.argv[2];
const b = await launch(out, { port: +(process.argv[3] || 9591), width: 1400, height: 900 });
const U = (process.env.GAME_URL || 'http://localhost:8766/index.html') + '?end=';
const report = {};
const shot = async (name) => { const r = await b.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(r.result.data, 'base64')); };
const size = async (w, h, mobile) => { await b.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile: !!mobile }); await b.sleep(350); };
// Nothing wider than the screen, no control smaller than 44px, and the main button on screen.
const AUDIT = `
  const vw = innerWidth; const res = { wide: [], small: [] };
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const name = (el) => el.tagName.toLowerCase() + '.' + String(el.className).trim().split(/\\s+/).slice(0, 2).join('.');
  for (const el of document.querySelectorAll('#app main *')) { if (el.closest('svg, .confetti') || !visible(el)) continue; const r = el.getBoundingClientRect(); if (r.right > vw + 1 || r.left < -1) res.wide.push(name(el)); }
  if (document.documentElement.scrollWidth > vw) res.wide.push('PAGE ' + document.documentElement.scrollWidth);
  for (const el of document.querySelectorAll('#app main button')) { if (!visible(el)) continue; const r = el.getBoundingClientRect(); if (Math.min(r.width, r.height) < 43.5) res.small.push(name(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); }
  const main = q('.result [data-focus]'); const mr = main ? main.getBoundingClientRect() : null;
  return { wide: [...new Set(res.wide)].slice(0, 8), small: [...new Set(res.small)].slice(0, 8), mainButton: mr ? (mr.bottom <= innerHeight && mr.top >= 0 ? 'on screen' : 'needs scroll ' + Math.round(mr.bottom) + '>' + innerHeight) : 'none', text: (q('.result') || q('main')).innerText.replace(/\\s+/g, ' ').slice(0, 260) };`;
// Play the open Station to its passed Fare. `miss` Checks are answered wrong twice, so their Cards go to Review.
const PLAY = (id, miss) => `
  const st = FI.content.station('${id}'); let left = ${miss}; let guard = 400;
  const norm = (x) => x.replace(/\\s+/g, ' ').trim();
  while (!q('.scoreboard') && guard-- > 0) {
    const knew = find('RATE', 'knew'); const cont = find('CONTINUE'); const prompt = q('h2.prompt');
    if (prompt) {
      const text = norm(prompt.innerText);
      const k = st.items.find((i) => i.kind === 'check' && (norm(i.prompt.en) === text || (i.fare && norm(i.fare.en) === text)));
      if (!k) return 'no check for: ' + text;
      const inFare = !!q('.kicker.fare');
      if (!inFare && left > 0 && !cont) { const bad = k.type === 'tf' ? !k.answer : (k.answer + 1) % k.options.length; find('ANSWER', bad).click(); await wait(60); if (find('ANSWER', bad)) find('ANSWER', bad).click(); left -= 1; }
      else if (cont) cont.click(); else find('ANSWER', k.answer).click();
    } else if (knew) knew.click(); else if (cont) cont.click(); else return 'stuck';
    await wait(40);
  }
  await wait(1400); return q('.scoreboard') ? 'scoreboard' : 'no scoreboard';`;

for (const [tag, w, h, mobile] of [['phone', 360, 740, true], ['desktop', 1366, 800, false]]) {
  await size(w, h, mobile);
  await b.go(U + tag + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + tag + Date.now()); await b.sleep(900);
  // a clean Lesson: scoreboard, gold chest, onward
  await b.js(`find('OPEN_STATION', 's1').click(); await wait(400); return 1;`);
  report[tag + ' play clean'] = await b.js(PLAY('s1', 0));
  await shot(tag + '-1-scoreboard'); report[tag + ' scoreboard'] = await b.js(AUDIT);
  await b.js(`find('CONTINUE').click(); await wait(500); return 1;`);
  await shot(tag + '-2-chest'); report[tag + ' chest'] = await b.js(AUDIT);
  report[tag + ' coins before chest'] = await b.js(`return q('.coins .n').innerText;`);
  await b.js(`find('OPEN_CHEST').click(); await wait(1300); return 1;`);
  await shot(tag + '-3-chest-open'); report[tag + ' chest open'] = await b.js(AUDIT);
  report[tag + ' coins after chest'] = await b.js(`return q('.coins .n').innerText;`);
  await b.js(`find('CONTINUE').click(); await wait(500); return 1;`);
  await shot(tag + '-4-onward'); report[tag + ' onward'] = await b.js(AUDIT);
  // the next Lesson, one tap away, played with two misses: plain chest and the missed Cards named
  await b.js(`find('OPEN_STATION', 's2').click(); await wait(500); return 1;`);
  report[tag + ' next lesson opened'] = await b.js(`return !!q('.panel') && !q('.onward');`);
  await b.js(`find('BACK_TO_PATH') ? find('BACK_TO_PATH').click() : history.back(); await wait(500); return 1;`);
  // a replay of the first Lesson with misses is still a replay: onward only. So play a fresh Station with misses instead.
  await b.js(`find('OPEN_STATION', 's3').click(); await wait(500); return 1;`);
  const s3 = await b.js(`return FI.content.station('s3').items.filter((i) => i.kind === 'check').every((k) => k.type !== 'order');`);
  if (s3) {
    report[tag + ' play messy'] = await b.js(PLAY('s3', 2));
    await shot(tag + '-5-scoreboard-messy'); report[tag + ' scoreboard messy'] = await b.js(AUDIT);
    await b.js(`find('CONTINUE').click(); await wait(400); find('OPEN_CHEST').click(); await wait(1200); return 1;`);
    await shot(tag + '-6-chest-plain'); report[tag + ' chest plain'] = await b.js(AUDIT);
    await b.js(`find('CONTINUE').click(); await wait(500); return 1;`);
    await shot(tag + '-7-onward-missed'); report[tag + ' onward missed'] = await b.js(AUDIT);
    await b.js(`find('SET_MODE', 'FA').click(); await wait(500); return 1;`);
    await shot(tag + '-8-onward-fa'); report[tag + ' onward FA'] = await b.js(AUDIT);
    await b.js(`find('SET_MODE', 'EN').click(); await wait(300); return 1;`);
  } else report[tag + ' play messy'] = 'skipped: s3 has an order Check';
  report[tag + ' saved'] = await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); return { coins: d.coins, earned: d.earned, shards: d.shards, owed: d.owed };`);
  // The missed Cards fall due: make them due today in the saved progress, reload, and look at Continue on the Path.
  await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); for (const id of Object.keys(d.deck)) d.deck[id].due = 0; d.run = null; localStorage.setItem('fi-roadmap-v1', JSON.stringify(d)); return 1;`);
  await b.go(U + tag + 'due' + Date.now()); await b.sleep(900);
  await shot(tag + '-9-review-first');
  report[tag + ' review first'] = await b.js(`const r = q('.reviewfirst button'); const l = q('.btn.then.continue'); if (!r || !l) return 'missing'; const a = r.getBoundingClientRect(), c = l.getBoundingClientRect(); return { review: r.innerText.replace(/\\s+/g, ' '), then: l.innerText.replace(/\\s+/g, ' '), reviewAbove: a.bottom <= c.top + 1, wide: a.right > innerWidth || c.right > innerWidth };`);
}
const isAudit = (v) => !!v && Array.isArray(v.wide);
const problems = Object.entries(report).filter(([, v]) => isAudit(v) && (v.wide.length || v.small.length || v.mainButton !== 'on screen')).map(([k, v]) => ({ screen: k, wide: v.wide, small: v.small, mainButton: v.mainButton }));
console.log(JSON.stringify({ problems, report, errors: b.errors }, null, 1));
b.close();
