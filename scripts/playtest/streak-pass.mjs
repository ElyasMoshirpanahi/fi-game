// Spec 14, release 2 browser pass: the streak in the header, the quests on the Path, the streak screen at the
// end of a Lesson, the quest chest and the streak panel on the Profile, at phone (360) and desktop (1366) width.
// node scripts/playtest/streak-pass.mjs <outDir> <debugPort>
// Serve the repo first, for example: python -m http.server 8766. GAME_URL overrides the address.
// <outDir> is created fresh and holds the browser profile and the screenshots: use a folder outside the repo.
// It clears localStorage inside its own fresh profile only. Never point it at a browser that holds real progress.
import fs from 'node:fs';
import path from 'node:path';
import { launch } from './cdp-lib.mjs';
const out = process.argv[2];
const b = await launch(out, { port: +(process.argv[3] || 9594), width: 1400, height: 900 });
const U = (process.env.GAME_URL || 'http://localhost:8766/index.html') + '?streak=';
const report = {};
const shot = async (name) => { const r = await b.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(r.result.data, 'base64')); };
const size = async (w, h, mobile) => { await b.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile: !!mobile }); await b.sleep(350); };
const AUDIT = `
  const vw = innerWidth; const res = { wide: [], small: [] };
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const name = (el) => el.tagName.toLowerCase() + '.' + String(el.className).trim().split(/\\s+/).slice(0, 2).join('.');
  for (const el of document.querySelectorAll('#app header *, #app main *')) { if (el.closest('svg, .confetti, .roadlayer') || !visible(el)) continue; const r = el.getBoundingClientRect(); if (r.right > vw + 1 || r.left < -1) res.wide.push(name(el)); }
  if (document.documentElement.scrollWidth > vw) res.wide.push('PAGE ' + document.documentElement.scrollWidth);
  for (const el of document.querySelectorAll('#app main button:not(.ubtn)')) { if (!visible(el) || el.disabled) continue; const r = el.getBoundingClientRect(); if (Math.min(r.width, r.height) < 43.5) res.small.push(name(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); }
  const top = q('header.top').getBoundingClientRect();
  return { wide: [...new Set(res.wide)].slice(0, 8), small: [...new Set(res.small)].slice(0, 8), headerHeight: Math.round(top.height) };`;
const PLAY = (id) => `
  const st = FI.content.station('${id}'); let guard = 400;
  const norm = (x) => x.replace(/\\s+/g, ' ').trim();
  while (!q('.scoreboard') && guard-- > 0) {
    const knew = find('RATE', 'knew'); const cont = find('CONTINUE'); const prompt = q('h2.prompt');
    if (prompt) {
      const text = norm(prompt.innerText);
      const k = st.items.find((i) => i.kind === 'check' && (norm(i.prompt.en) === text || (i.fare && norm(i.fare.en) === text)));
      if (!k) return 'no check for: ' + text;
      if (cont) cont.click(); else find('ANSWER', k.answer).click();
    } else if (knew) knew.click(); else if (cont) cont.click(); else return 'stuck';
    await wait(40);
  }
  await wait(1200); return q('.scoreboard') ? 'scoreboard' : 'no scoreboard';`;
const text = (sel) => b.js(`const el = q('${sel}'); return el ? el.innerText.replace(/\\s+/g, ' ').slice(0, 300) : null;`);

for (const [tag, w, h, mobile] of [['phone', 360, 740, true], ['desktop', 1366, 800, false]]) {
  await size(w, h, mobile);
  await b.go(U + tag + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + tag + Date.now()); await b.sleep(900);
  await shot(tag + '-1-path-quests'); report[tag + ' path'] = await b.js(AUDIT);
  report[tag + ' quests'] = await text(mobile ? '.quests.inmain' : '.quests.inrail');
  report[tag + ' header streak'] = await text('.top .streakchip');
  await b.js(`find('OPEN_STATION', 's1').click(); await wait(400); return 1;`);
  report[tag + ' play'] = await b.js(PLAY('s1'));
  await b.js(`find('CONTINUE').click(); await wait(400); find('OPEN_CHEST').click(); await wait(3400); find('CONTINUE').click(); await wait(700); return 1;`);
  await shot(tag + '-2-streak-screen'); report[tag + ' streak screen'] = await b.js(AUDIT);
  report[tag + ' streak screen text'] = await text('.result');
  await b.js(`find('CONTINUE').click(); await wait(400); return 1;`);
  report[tag + ' onward after streak'] = await b.js(`return !!q('.onward');`);
  await b.js(`qa('[data-action]').find((x) => x.getAttribute('data-action') === '{"type":"CONTINUE"}').click(); await wait(900); return 1;`);
  await shot(tag + '-3-path-quests-done'); report[tag + ' path after'] = await b.js(AUDIT);
  report[tag + ' quests after'] = await text(mobile ? '.quests.inmain' : '.quests.inrail');
  report[tag + ' header streak after'] = await b.js(`const c = q('.top .streakchip'); return c.className + ' ' + c.innerText;`);
  const coins = await text('.coins .n');
  report[tag + ' quest chest'] = await b.js(`const btn = qa('[data-action]').filter((x) => x.getAttribute('data-action').includes('OPEN_QUEST_CHEST')).find((x) => x.getBoundingClientRect().width > 0); if (!btn) return 'no button'; btn.click(); await wait(3600); return 'opened';`);
  report[tag + ' coins'] = `${coins} -> ${await text('.coins .n')}`;
  await shot(tag + '-4-quest-chest-open');
  await b.js(`find('OPEN_PROFILE').click(); await wait(600); return 1;`);
  await shot(tag + '-5-profile'); report[tag + ' profile'] = await b.js(AUDIT);
  report[tag + ' streak panel'] = await text('.streakpanel');
  await b.js(`find('SET_MODE', 'FA').click(); await wait(500); return 1;`);
  await shot(tag + '-6-profile-fa'); report[tag + ' profile FA'] = await b.js(AUDIT);
  await b.js(`find('SET_MODE', 'EN').click(); await wait(300); return 1;`);
  report[tag + ' saved'] = await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); return { streak: d.streak, freezes: d.freezes, marks: d.marks, quests: d.quests && d.quests.chest, coins: d.coins, earned: d.earned };`);
}
const isAudit = (v) => !!v && Array.isArray(v.wide);
const problems = Object.entries(report).filter(([, v]) => isAudit(v) && (v.wide.length || v.small.length)).map(([k, v]) => ({ screen: k, ...v }));
console.log(JSON.stringify({ problems, report, errors: b.errors }, null, 1));
b.close();
