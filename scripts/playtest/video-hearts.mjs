// Spec 14, release 3: one end-to-end video on a small phone (360x640), with the game's sound.
//   7-hearts.mp4   a wrong answer in a new Lesson costs a heart; at zero the Lesson pauses on the hearts screen with
//                  its countdown; a heart is bought and the Lesson goes on; a new Lesson is locked at zero;
//                  a replayed old Lesson gives a heart back; the paused Lesson opens at its place
// node scripts/playtest/video-hearts.mjs <outDir> <debugPort>
// Needs ffmpeg on the PATH. Serve the repo first: python -m http.server 8766. GAME_URL overrides the address.
// <outDir> is created fresh: use a folder outside the repo. It edits localStorage inside its own fresh profile only.
import path from 'node:path';
import { launch } from './cdp-lib.mjs';
import { recorder, AUDIO_FLAGS } from './video-lib.mjs';
const out = process.argv[2];
const b = await launch(out, { port: +(process.argv[3] || 9602), width: 400, height: 720, flags: AUDIO_FLAGS });
const U = (process.env.GAME_URL || 'http://localhost:8766/index.html') + '?video=';
await b.send('Emulation.setDeviceMetricsOverride', { width: 360, height: 640, deviceScaleFactor: 2, mobile: true });
const rec = await recorder(b, out);
const H = `
  const tap = async (el, hold = 420) => {
    if (!el) throw new Error('nothing to tap');
    if (getComputedStyle(el.closest('.actions, .feedback, .overlay') || el).position !== 'fixed') { el.scrollIntoView({ block: 'center' }); await wait(160); }
    const r = el.getBoundingClientRect(); const d = document.createElement('div');
    d.style.cssText = 'position:fixed;z-index:99999;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.55);border:2px solid #fff;pointer-events:none;left:' + (r.left + r.width / 2 - 22) + 'px;top:' + (r.top + r.height / 2 - 22) + 'px';
    document.body.appendChild(d); await wait(200); el.click(); await wait(120); d.remove(); await wait(hold);
  };
  const caption = (text) => {
    let c = document.getElementById('vcap');
    if (!c) { c = document.createElement('div'); c.id = 'vcap'; c.style.cssText = 'position:fixed;z-index:99998;left:8px;right:8px;top:72px;padding:7px 10px;border-radius:10px;background:rgba(0,0,0,.9);color:#fff;font:600 12.5px/1.35 system-ui;text-align:center;border:1px solid #fff5;pointer-events:none'; document.body.appendChild(c); }
    c.textContent = text; c.style.display = text ? 'block' : 'none';
  };
  const norm = (x) => x.replace(/\\s+/g, ' ').trim();
  const act = (type, value) => qa('[data-action]').find((x) => { const a = JSON.parse(x.getAttribute('data-action')); return a.type === type && (value === undefined || a.value === value) && x.getBoundingClientRect().width > 0 && !x.disabled; });
  const checkFor = (id, text) => FI.content.station(id).items.find((i) => i.kind === 'check' && [i.prompt.en, i.fare && i.fare.en].filter(Boolean).some((p) => norm(p) === text));
  const wrongOf = (k) => (k.type === 'tf' ? !k.answer : (k.answer + 1) % k.options.length);
  const hearts = () => { const c = q('.heartchip .n'); return c ? c.textContent : null; };
  // Play on. wrongs: how many wrong answers to give (never on an Order question). Stops at the scoreboard or at the hearts screen.
  const play = async (id, wrongs = 0) => {
    let guard = 220;
    while (!q('.scoreboard') && !q('.heartwall') && !q('.onward') && guard-- > 0) {
      const cont = act('CONTINUE'); const prompt = q('h2.prompt');
      if (cont) { await tap(cont, 240); continue; }
      if (!prompt) throw new Error('stuck');
      const k = checkFor(id, norm(prompt.innerText)); if (!k) throw new Error('no check for ' + prompt.innerText.slice(0, 40));
      if (k.type === 'order') { for (const i of k.answer) await tap(find('UI_ORDER_ADD', i), 100); await tap(qa('.station.run .actions .btn.primary')[0], 460); }
      else if (wrongs > 0) { wrongs -= 1; await tap(find('ANSWER', wrongOf(k)), 1500); if (!wrongs) return; } // stop right after the last wrong answer
      else await tap(find('ANSWER', k.answer), 460);
    }
  };`;
const log = []; const facts = {};
const run = async (code) => { const r = await b.js(`${H}\ntry { ${code}; return 'ok'; } catch (e) { return 'FAILED: ' + e.message; }`); if (r !== 'ok') log.push(r + ' in: ' + code.slice(0, 70)); return r; };
const fact = async (name, code) => { facts[name] = await b.js(`${H}\n${code}`); };

await b.go(U + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + Date.now()); await b.sleep(700);
// Three Lessons are passed (hearts count from the fourth), two hearts are left, 70 Coins in hand.
await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); for (const id of ['s1', 's2', 's3']) { d.farePassed[id] = true; d.lit[id] = true; } d.xp = 150; d.coins = 70; d.earned = 70; const today = Math.floor(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) / 86400000); d.hearts = { n: 2, at: Date.now() - 3600000, day: today }; localStorage.setItem('fi-roadmap-v1', JSON.stringify(d)); return 1;`);
await rec.go(U + Date.now()); await b.sleep(700);
rec.start();
await fact('header360', `return { hearts: hearts(), hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth, topFits: q('.top').scrollWidth <= q('.top').clientWidth };`);
await run(`caption('Hearts show in the header from the fourth Lesson on. Two hearts are left.'); await wait(2600); await tap(q('.heartchip'), 600); caption('A tap on the hearts opens this screen: the countdown and three ways to get a heart.'); await wait(3800); await tap(act('DISMISS_HEARTS'), 500)`);
await run(`caption('A new Lesson. A wrong answer costs a heart.'); await tap(act('OPEN_STATION', 's4'), 900); await play('s4', 1); `);
await fact('afterFirstWrong', `return hearts();`);
await run(`caption('A second wrong answer: the last heart is gone.'); await play('s4', 1)`);
await fact('atZero', `return { hearts: hearts(), wall: !!q('.heartwall'), countdown: (q('[data-heart-at]') || {}).textContent };`);
await run(`if (!q('.heartwall')) throw new Error('no hearts screen'); caption('Out of hearts: the Lesson pauses and keeps its place. The countdown runs.'); await wait(4200)`);
await fact('countdownMoves', `const a = q('[data-heart-at]').textContent; await wait(1300); return [a, q('[data-heart-at]').textContent];`);
await run(`caption('Way 1: buy a heart with Coins. The Lesson goes on at once.'); await tap(act('BUY_HEART'), 1400); if (q('.heartwall')) throw new Error('wall still open after buying')`);
await fact('afterBuy', `return { hearts: hearts(), coins: q('.coins .n').textContent };`);
await run(`caption('Wrong again: back to zero.'); await play('s4', 1); if (!q('.heartwall')) throw new Error('no wall'); await wait(1800)`);
await run(`caption('Close it and try another new Lesson: it is locked while the hearts are empty.'); await tap(act('DISMISS_HEARTS'), 500); await tap(act('BACK_TO_PATH'), 800); await tap(act('OPEN_STATION', 's5'), 900); if (!q('.heartwall')) throw new Error('new Lesson was not locked'); await wait(2600)`);
await run(`caption('Way 2: replay an old Lesson. It never costs a heart and gives one back.'); const old = qa('.heartways .btn').find((x) => x.getAttribute('data-action') && JSON.parse(x.getAttribute('data-action')).type === 'OPEN_STATION'); await tap(old, 900); const id = q('main.station') ? FI.content.stations.map((s) => s.id).find((i) => ['s1', 's2', 's3'].includes(i) && norm(q('.shead').innerText).includes(norm(FI.content.station(i).name.en))) : null; await play(id || 's3')`);
await fact('afterReplay', `return hearts();`);
await run(`caption('The old Lesson is passed: one heart is back.'); await wait(2600); const leave = act('BACK_TO_PATH'); await tap(leave, 800)`);
await run(`caption('The paused Lesson opens where it stopped, not at its start.'); await tap(act('OPEN_STATION', 's4'), 1200); await wait(2600); caption('')`);
await fact('resumed', `const m = (q('.shead') || q('main')).innerText.match(/(\\d+) of (\\d+)/); return { place: m ? m[0] : null, hearts: hearts() };`);
const file = path.join(out, '7-hearts.mp4');
const made = await rec.finish(file);
console.log(JSON.stringify({ file, ...made, failedSteps: log, pageErrors: b.errors, facts }, null, 1));
b.close();
