// Specs 15 and 16: one end-to-end video on a small phone (360x640) in both languages.
//   3-recap-and-phone-fit.mp4   one Continue on a Card, the button fixed at the bottom, a wrong answer sent to
//                               Review by itself, the last Lesson leading into the Recap, the Recap, the Path after
// node scripts/playtest/video-recap.mjs <outDir> <debugPort>
// Needs ffmpeg on the PATH. Serve the repo first: python -m http.server 8766. GAME_URL overrides the address.
// <outDir> is created fresh: use a folder outside the repo. It edits localStorage inside its own fresh profile only.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { launch } from './cdp-lib.mjs';
const out = process.argv[2];
const b = await launch(out, { port: +(process.argv[3] || 9598), width: 400, height: 720 });
const U = (process.env.GAME_URL || 'http://localhost:8766/index.html') + '?video=';
await b.send('Emulation.setDeviceMetricsOverride', { width: 360, height: 640, deviceScaleFactor: 2, mobile: true });
const dir = path.join(out, 'frames'); fs.mkdirSync(dir, { recursive: true });
const rec = { n: 0, on: true, t0: 0 };
const H = `
  const tap = async (el, hold = 420) => {
    if (!el) throw new Error('nothing to tap');
    if (getComputedStyle(el.closest('.actions, .feedback') || el).position !== 'fixed') { el.scrollIntoView({ block: 'center' }); await wait(160); }
    const r = el.getBoundingClientRect(); const d = document.createElement('div');
    d.style.cssText = 'position:fixed;z-index:99999;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.55);border:2px solid #fff;pointer-events:none;left:' + (r.left + r.width / 2 - 22) + 'px;top:' + (r.top + r.height / 2 - 22) + 'px';
    document.body.appendChild(d); await wait(200); el.click(); await wait(120); d.remove(); await wait(hold);
  };
  const caption = (text) => {
    let c = document.getElementById('vcap');
    if (!c) { c = document.createElement('div'); c.id = 'vcap'; c.style.cssText = 'position:fixed;z-index:99998;left:8px;right:8px;top:72px;padding:7px 10px;border-radius:10px;background:rgba(0,0,0,.88);color:#fff;font:600 12.5px/1.35 system-ui;text-align:center;border:1px solid #fff5;pointer-events:none'; document.body.appendChild(c); }
    c.textContent = text; c.style.display = text ? 'block' : 'none';
  };
  const norm = (x) => x.replace(/\\s+/g, ' ').trim();
  const act = (type) => qa('[data-action]').find((x) => x.getAttribute('data-action') === JSON.stringify({ type }) && x.getBoundingClientRect().width > 0 && !x.disabled);
  const checkFor = (ids, text) => { for (const id of ids) for (const i of FI.content.station(id).items) if (i.kind === 'check' && [i.prompt.en, i.prompt.fa, i.prompt.en + ' ' + i.prompt.fa, i.fare && i.fare.en, i.fare && i.fare.fa, i.fare && (i.fare.en + ' ' + i.fare.fa)].filter(Boolean).some((p) => norm(p) === text)) return i; return null; };
  const wrongOf = (k) => (k.type === 'tf' ? !k.answer : (k.answer + 1) % k.options.length);`;
const log = [];
const run = async (code) => { const r = await b.js(`${H}\ntry { ${code}; return 'ok'; } catch (e) { return 'FAILED: ' + e.message; }`); if (r !== 'ok') log.push(r); return r; };

// The player has passed every Station of Basics but the first: one Lesson is left before the Recap opens.
await b.go(U + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + Date.now()); await b.sleep(700);
await b.js(`find('SET_MODE', 'BOTH').click(); await wait(300); const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); const runs = FI.content.sections[0].runs; d.farePassed = {}; d.lit = {}; for (const id of runs.slice(1)) { d.farePassed[id] = true; if (id !== runs[runs.length - 1]) d.lit[id] = true; } d.xp = 200; localStorage.setItem('fi-roadmap-v1', JSON.stringify(d)); return 1;`);
await b.go(U + Date.now()); await b.sleep(700);
rec.t0 = Date.now();
rec.loop = (async () => { while (rec.on) { const s = await b.send('Page.captureScreenshot', { format: 'jpeg', quality: 72 }); if (s.result) fs.writeFileSync(path.join(dir, `f${String(++rec.n).padStart(5, '0')}.jpg`), Buffer.from(s.result.data, 'base64')); await b.sleep(30); } })();

await run(`caption('A small phone, both languages. The Recap at the end of Basics is closed: one Lesson is left.'); await wait(1500); q('.recapstop').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(3200); scrollTo({ top: 0, behavior: 'smooth' }); await wait(900)`);
await run(`caption('A Card has one button, fixed at the bottom. No more Knew it or Did not know.'); await tap(find('OPEN_STATION', 's1'), 900); await wait(2200); await tap(act('CONTINUE'), 500)`);
await run(`
  caption('A wrong answer. The game takes it as: not understood.');
  const ids = ['s1']; let missed = false; let guard = 200;
  while (!q('.scoreboard') && guard-- > 0) {
    const cont = act('CONTINUE'); const prompt = q('h2.prompt');
    if (cont) { await tap(cont, missed === 'now' ? 900 : 300); if (missed === 'now') { missed = true; caption('The Card comes back later in this Lesson, and goes to Review.'); } continue; }
    if (!prompt) throw new Error('stuck');
    const k = checkFor(ids, norm(prompt.innerText)); if (!k) throw new Error('no check');
    if (!missed && !q('.kicker.fare')) { await tap(find('ANSWER', wrongOf(k)), 1300); caption('The Hint, then a second try.'); await tap(find('ANSWER', k.answer), 900); missed = 'now'; }
    else await tap(find('ANSWER', k.answer), 300);
  }`);
await run(`caption('The same fixed button on every screen at the end of a Lesson.'); await wait(2200); await tap(act('CONTINUE'), 500); await tap(act('OPEN_CHEST'), 3000); await tap(act('CONTINUE'), 500); if (q('.streakbig')) { await wait(900); await tap(act('CONTINUE'), 500); }`);
await run(`caption('The missed Card is named. And this was the last Lesson: the button leads into the Recap.'); await wait(4200); await tap(find('OPEN_RECAP', FI.content.sections[0].id), 900)`);
await run(`
  caption('The Recap: questions from the whole Section, the missed Card first.');
  const ids = FI.content.sections[0].runs; let n = 0; let guard = 60;
  while (!q('.recapscore') && guard-- > 0) {
    const next = act('REVIEW_NEXT'); const prompt = q('h2.prompt');
    if (next) { await tap(next, 450); continue; }
    if (!prompt) throw new Error('stuck in the Recap');
    const k = checkFor(ids, norm(prompt.innerText)); if (!k) throw new Error('no check for: ' + prompt.innerText.slice(0, 50));
    await wait(n === 0 ? 1600 : 300);
    if (k.type === 'order') { for (const i of k.answer) await tap(find('UI_ORDER_ADD', i), 120); await tap(qa('.station.run .actions .btn.primary')[0], 600); }
    else if (n === 2) { caption('A miss in the Recap shows the answer and sends the Card to Review.'); await tap(find('REVIEW_ANSWER', wrongOf(k)), 2200); }
    else await tap(find('REVIEW_ANSWER', k.answer), 600);
    n += 1;
  }`);
await run(`caption('Recap done: the score, and Coins once for closing the Section.'); await wait(3600); await tap(act('BACK_TO_PATH'), 900)`);
await run(`caption('On the Path the Recap is marked done. It can be taken again any time.'); q('.recapstop').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(3600); caption('')`);
rec.on = false; await rec.loop;
const secs = (Date.now() - rec.t0) / 1000; const fps = (rec.n / secs).toFixed(2);
const file = path.join(out, '3-recap-and-phone-fit.mp4');
const ff = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', fps, '-i', path.join(dir, 'f%05d.jpg'), '-vf', 'scale=540:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '27', '-movflags', '+faststart', file]);
fs.rmSync(dir, { recursive: true, force: true });
const saved = await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); return { recaps: d.recaps, deck: Object.keys(d.deck).length, coins: d.coins, streak: d.streak.n };`);
console.log(JSON.stringify({ file, secs: Math.round(secs), ffmpeg: ff.status, failedSteps: log, pageErrors: b.errors, saved }, null, 1));
b.close();
