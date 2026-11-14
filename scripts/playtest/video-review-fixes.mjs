// One end-to-end video of the review fixes of 2026-11-14, with the game's sound, on a desktop window (1366x768):
//   6-review-fixes.mp4   Freezes that cannot cover the gap are kept; the Milestone is a Badge on the Profile;
//                        a Section row in the rail leads to the Path; a miss before a reload still costs the gold chest
// node scripts/playtest/video-review-fixes.mjs <outDir> <debugPort>
// Needs ffmpeg on the PATH. Serve the repo first: python -m http.server 8766. GAME_URL overrides the address.
// <outDir> is created fresh: use a folder outside the repo. It edits localStorage inside its own fresh profile only.
import path from 'node:path';
import { launch } from './cdp-lib.mjs';
import { recorder, AUDIO_FLAGS } from './video-lib.mjs';
const out = process.argv[2];
const b = await launch(out, { port: +(process.argv[3] || 9601), width: 1400, height: 860, flags: AUDIO_FLAGS });
const U = (process.env.GAME_URL || 'http://localhost:8766/index.html') + '?video=';
await b.send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
const rec = await recorder(b, out);
const H = `
  const tap = async (el, hold = 420) => {
    if (!el) throw new Error('nothing to tap');
    el.scrollIntoView({ block: 'center' }); await wait(160);
    const r = el.getBoundingClientRect(); const d = document.createElement('div');
    d.style.cssText = 'position:fixed;z-index:99999;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.55);border:2px solid #fff;pointer-events:none;left:' + (r.left + r.width / 2 - 22) + 'px;top:' + (r.top + r.height / 2 - 22) + 'px';
    document.body.appendChild(d); await wait(200); el.click(); await wait(120); d.remove(); await wait(hold);
  };
  const caption = (text) => {
    let c = document.getElementById('vcap');
    if (!c) { c = document.createElement('div'); c.id = 'vcap'; c.style.cssText = 'position:fixed;z-index:99998;left:50%;transform:translateX(-50%);bottom:56px;max-width:820px;padding:9px 16px;border-radius:10px;background:rgba(0,0,0,.9);color:#fff;font:600 15px/1.35 system-ui;text-align:center;border:1px solid #fff5;pointer-events:none'; document.body.appendChild(c); }
    c.textContent = text; c.style.display = text ? 'block' : 'none';
  };
  const norm = (x) => x.replace(/\\s+/g, ' ').trim();
  const act = (type, value) => qa('[data-action]').find((x) => { const a = JSON.parse(x.getAttribute('data-action')); return a.type === type && (value === undefined || a.value === value) && x.getBoundingClientRect().width > 0 && !x.disabled; });
  const checkFor = (id, text) => FI.content.station(id).items.find((i) => i.kind === 'check' && [i.prompt.en, i.fare && i.fare.en].filter(Boolean).some((p) => norm(p) === text));
  const wrongOf = (k) => (k.type === 'tf' ? !k.answer : (k.answer + 1) % k.options.length);
  const play = async (id, until) => {
    let guard = 200;
    while (!q('.scoreboard') && guard-- > 0) {
      if (until && until()) return;
      const cont = act('CONTINUE'); const prompt = q('h2.prompt');
      if (cont) { await tap(cont, 220); continue; }
      if (!prompt) throw new Error('stuck');
      const k = checkFor(id, norm(prompt.innerText)); if (!k) throw new Error('no check');
      if (k.type === 'order') { for (const i of k.answer) await tap(find('UI_ORDER_ADD', i), 100); await tap(qa('.station.run .actions .btn.primary')[0], 420); }
      else await tap(find('ANSWER', k.answer), 420);
    }
  };`;
const log = []; const facts = {};
const run = async (code) => { const r = await b.js(`${H}\ntry { ${code}; return 'ok'; } catch (e) { return 'FAILED: ' + e.message; }`); if (r !== 'ok') log.push(r + ' in: ' + code.slice(0, 70)); return r; };
const save = (code) => b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); ${code}; localStorage.setItem('fi-roadmap-v1', JSON.stringify(d)); return 1;`);

await b.go(U + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + Date.now()); await b.sleep(700);
// A 10-day Streak last counted four days ago (three days missed), two Freezes held, the Milestone earned.
await save(`const today = Math.floor(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) / 86400000); d.streak = { n: 10, best: 10, last: today - 4, from: today - 13 }; d.marks = { [today - 4]: 'on', [today - 5]: 'on' }; d.freezes = 2; d.coins = 80; d.earned = 580; d.milestone = true; d.farePassed = { s1: true }; d.lit = { s1: true }; d.xp = 50`);
await rec.go(U + Date.now()); await b.sleep(700);
rec.start();
await run(`caption('Three days were missed with a 10-day streak and two freezes. Two freezes cannot cover three days.'); await wait(3600)`);
await run(`caption('The streak ends, and both freezes are kept. Before the fix they were spent for nothing.'); await tap(act('OPEN_PROFILE'), 600); await wait(4200)`);
facts.afterGap = await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); return { streak: d.streak.n, best: d.streak.best, freezes: d.freezes };`);
await run(`caption('The Milestone is now one of the Badges on the Profile.'); const chip = qa('.bchip').find((x) => x.textContent.includes('Milestone')); if (!chip) throw new Error('no Milestone badge'); chip.scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(600); chip.style.outline = '2px solid #fff'; await wait(3000); chip.style.outline = ''; scrollTo({ top: 0, behavior: 'smooth' }); await wait(700)`);
await run(`caption('A Section in the rail now leads to the Path from the Profile. Before, the click did nothing.'); const row = qa('.rail .row[data-sec]')[3]; if (!row) throw new Error('no rail row'); await tap(row, 2600); if (!q('main.path')) throw new Error('not on the Path')`);
await run(`caption('A wrong answer, then a reload in the middle of the Lesson.'); scrollTo({ top: 0 }); await wait(500); await tap(act('OPEN_STATION', 's2'), 800); await play('s2', () => !!q('h2.prompt') && !act('CONTINUE'))`);
await run(`let guard = 60; while (guard-- > 0) { const cont = act('CONTINUE'); const prompt = q('h2.prompt'); if (prompt && !cont) { const k = checkFor('s2', norm(prompt.innerText)); if (k.type !== 'order') { await tap(find('ANSWER', wrongOf(k)), 1400); break; } for (const i of k.answer) await tap(find('UI_ORDER_ADD', i), 100); await tap(qa('.station.run .actions .btn.primary')[0], 420); continue; } await tap(cont, 220); }`);
await rec.go(U + Date.now()); await b.sleep(700);
await run(`caption('After the reload the game no longer forgets the miss: the Lesson is not judged clean.'); await wait(1800); await play('s2')`);
await run(`caption('So the chest is a plain one, not gold, and there is no clean bonus.'); await wait(1600); await tap(act('CONTINUE'), 700); await wait(2600); await tap(act('OPEN_CHEST'), 3000); caption('')`);
facts.afterReload = await b.js(`return { goldChest: !!q('.chest.gold'), plainChest: !!q('.chest.plain') };`);
const file = path.join(out, '6-review-fixes.mp4');
const made = await rec.finish(file);
console.log(JSON.stringify({ file, ...made, failedSteps: log, pageErrors: b.errors, facts }, null, 1));
b.close();
