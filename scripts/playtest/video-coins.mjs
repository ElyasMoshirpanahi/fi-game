// One end-to-end video on a phone (360x640): the golden Coin, the Coins in the header counting up with a chest
// and with the quest chest, and the week of streak dots filling from the first day.
//   4-coins-and-streak-dots.mp4
// node scripts/playtest/video-coins.mjs <outDir> <debugPort>
// Needs ffmpeg on the PATH. Serve the repo first: python -m http.server 8766. GAME_URL overrides the address.
// <outDir> is created fresh: use a folder outside the repo. It edits localStorage inside its own fresh profile only.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { launch } from './cdp-lib.mjs';
const out = process.argv[2];
const b = await launch(out, { port: +(process.argv[3] || 9599), width: 400, height: 720 });
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
  const checkFor = (id, text) => FI.content.station(id).items.find((i) => i.kind === 'check' && [i.prompt.en, i.fare && i.fare.en].filter(Boolean).some((p) => norm(p) === text));
  const openLesson = async (id) => {
    let btn = find('OPEN_STATION', id);
    if (!btn) { const c = FI.content.circleOf(id); const circle = q('[data-circle="' + c.id + '"] .ubtn') || qa('.node .ubtn, .node button').find((x) => x.textContent.includes(FI.content.station(id).title.en)); if (!circle) throw new Error('no way into ' + id); await tap(circle, 500); btn = find('OPEN_STATION', id); }
    await tap(btn, 900);
  };
  const play = async (id) => {
    let guard = 200;
    while (!q('.scoreboard') && guard-- > 0) {
      const cont = act('CONTINUE'); const prompt = q('h2.prompt');
      if (cont) { await tap(cont, 260); continue; }
      if (!prompt) throw new Error('stuck');
      const k = checkFor(id, norm(prompt.innerText)); if (!k) throw new Error('no check');
      if (k.type === 'order') { for (const i of k.answer) await tap(find('UI_ORDER_ADD', i), 120); await tap(qa('.station.run .actions .btn.primary')[0], 520); }
      else await tap(find('ANSWER', k.answer), 520);
    }
  };`;
const log = [];
const run = async (code) => { const r = await b.js(`${H}\ntry { ${code}; return 'ok'; } catch (e) { return 'FAILED: ' + e.message; }`); if (r !== 'ok') log.push(r + ' in: ' + code.slice(0, 60) + ' | screen: ' + await b.js(`return (q('main') || {}).className + ' ' + ['scoreboard','chest','streakbig','onward'].filter((x) => q('.' + x)).join(',') + ' acts ' + [...new Set(qa('main [data-action]').map((x) => JSON.parse(x.getAttribute('data-action')).type))].join(',');`)); return r; };
const samples = [];

await b.go(U + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + Date.now()); await b.sleep(700);
rec.t0 = Date.now();
rec.loop = (async () => { while (rec.on) { const s = await b.send('Page.captureScreenshot', { format: 'jpeg', quality: 72 }); if (s.result) fs.writeFileSync(path.join(dir, `f${String(++rec.n).padStart(5, '0')}.jpg`), Buffer.from(s.result.data, 'base64')); await b.sleep(30); } })();

await run(`caption('Day 1. The Coin in the header is a golden coin now.'); await wait(2200); await tap(find('OPEN_STATION', 's1'), 900)`);
await run(`caption('Each right answer: the Coins in the header climb.'); await play('s1')`);
await run(`caption('The chest: the Coins count up on the chest and in the header while the sound pours.'); await wait(1200); await tap(act('CONTINUE'), 600)`);
// sample the header number while the chest pours: it must pass through values between the start and the end
samples.push(await b.js(`const seen = []; const n = () => q('.coins .n').textContent; seen.push(n()); find('OPEN_CHEST').click(); for (let i = 0; i < 40; i++) { await wait(80); seen.push(n()); } return [...new Set(seen)];`));
await run(`await wait(900); await tap(act('CONTINUE'), 600)`);
await run(`caption('Day 1 of the streak: the first circle on the left is filled.'); await wait(3200); await tap(act('CONTINUE'), 600); await wait(1200); await tap(act('BACK_TO_PATH'), 900)`);
// Day 2 and day 3: move the clock inside this profile, play one Lesson a day.
for (const [n, id] of [[2, 's2'], [3, 's3']]) {
  await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); const k = d.streak; const shift = 1; k.last -= shift; k.from -= shift; const m = {}; for (const x of Object.keys(d.marks)) m[+x - shift] = d.marks[x]; d.marks = m; if (d.quests) d.quests.day -= shift; localStorage.setItem('fi-roadmap-v1', JSON.stringify(d)); return 1;`);
  await b.go(U + Date.now()); await b.sleep(700);
  await run(`caption('Day ${n}.'); await wait(900); await openLesson('${id}'); await play('${id}'); await tap(act('CONTINUE'), 500); await tap(act('OPEN_CHEST'), 2600); await tap(act('CONTINUE'), 600)`);
  await run(`caption('Day ${n}: the circles fill from left to right, from the first day played.'); await wait(3000); await tap(act('CONTINUE'), 600); await wait(700); await tap(act('BACK_TO_PATH'), 900)`);
}
// The quest chest: finish today's quests inside this profile, then open it.
await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); for (const x of d.quests.list) x.have = x.need; d.quests.chest = 'ready'; localStorage.setItem('fi-roadmap-v1', JSON.stringify(d)); return 1;`);
await b.go(U + Date.now()); await b.sleep(700);
await run(`caption('All three quests done. The quest chest counts its Coins up too.'); const c = qa('.questchest').find((x) => x.getBoundingClientRect().width > 0); c.scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(1800)`);
samples.push(await b.js(`const seen = []; const n = () => q('.coins .n').textContent; seen.push(n()); qa('.questchest').find((x) => x.getBoundingClientRect().width > 0).click(); for (let i = 0; i < 45; i++) { await wait(80); seen.push(n()); } return [...new Set(seen)];`));
await run(`await wait(1500); caption('')`);
rec.on = false; await rec.loop;
const secs = (Date.now() - rec.t0) / 1000; const fps = (rec.n / secs).toFixed(2);
const file = path.join(out, '4-coins-and-streak-dots.mp4');
const ff = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', fps, '-i', path.join(dir, 'f%05d.jpg'), '-vf', 'scale=540:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '27', '-movflags', '+faststart', file]);
fs.rmSync(dir, { recursive: true, force: true });
const saved = await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); return { coins: d.coins, streak: d.streak, dots: qa('.streakpanel .dayd, .week .dayd').slice(0, 7).map((x) => x.className) };`);
console.log(JSON.stringify({ file, secs: Math.round(secs), ffmpeg: ff.status, failedSteps: log, pageErrors: b.errors, headerSamples: samples, saved }, null, 1));
b.close();
