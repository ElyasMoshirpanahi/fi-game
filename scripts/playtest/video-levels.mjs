// Spec 14, release 4: one end-to-end video on a small phone (360x640), with the game's sound.
//   8-levels-records-chests-colours.mp4   a Lesson crosses into level 2 (level-up screen after the chest); the chest of a
//                                         finished Circle is opened on the Path; the Profile shows the level, this week
//                                         against last week and the records; five shards buy a Path colour
// node scripts/playtest/video-levels.mjs <outDir> <debugPort>
// Needs ffmpeg on the PATH. Serve the repo first: python -m http.server 8766. GAME_URL overrides the address.
// <outDir> is created fresh: use a folder outside the repo. It edits localStorage inside its own fresh profile only.
import path from 'node:path';
import { launch } from './cdp-lib.mjs';
import { recorder, AUDIO_FLAGS } from './video-lib.mjs';
const out = process.argv[2];
const b = await launch(out, { port: +(process.argv[3] || 9603), width: 400, height: 720, flags: AUDIO_FLAGS });
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
  const play = async (id) => {
    let guard = 220;
    while (!q('.scoreboard') && guard-- > 0) {
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
const fact = async (name, code) => { facts[name] = await b.js(`${H}\n${code}`); };

await b.go(U + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + Date.now()); await b.sleep(700);
// The first Circle of the first book was finished before this release (55 XP), four shards are held,
// and last week the player had earned 80 XP by this weekday.
await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); const sec = FI.content.sections.find((x) => x.circles); const c = sec.circles[0];
  for (const l of c.lessons) { d.lit[l] = true; d.farePassed[l] = true; } d.lit[c.id] = true; d.xp = c.lessons.length * FI.content.LESSON_XP + c.xp; d.shards = 4; d.coins = 12; d.earned = 12;
  const today = Math.floor(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) / 86400000);
  d.days = { [today - 7]: { xp: 80, lessons: 3, cards: 6 }, [today - 6]: { xp: 40, lessons: 2, cards: 0 } }; d.records = { combo: 7, lessonsDay: 3, weekXp: 120, weekCards: 6 };
  d.hearts = { n: 5, at: null, day: today }; localStorage.setItem('fi-roadmap-v1', JSON.stringify(d)); return 1;`);
await rec.go(U + Date.now()); await b.sleep(700);
rec.start();
await fact('start', `const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); return { xp: d.xp, level: FI.engine.levelOf(d.xp) + 1, shards: d.shards, hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth };`);
await run(`caption('55 XP: level 1, Saver. This Lesson is worth 50 XP and level 2 starts at 100.'); await wait(3000); await tap(act('OPEN_STATION', 's1'), 900); await play('s1')`);
await run(`caption('A clean Lesson: a gold chest, and the fifth shard.'); await wait(1800); await tap(act('CONTINUE'), 600); await tap(act('OPEN_CHEST'), 3200); await tap(act('CONTINUE'), 700)`);
await fact('levelScreen', `return { shown: !!q('.levelup'), title: q('.levelup h2') ? q('.levelup h2').innerText : null };`);
await run(`if (!q('.levelup')) throw new Error('no level-up screen'); caption('Level up: level 2, Planner. The screen comes once, when a Lesson crosses the line.'); await wait(4200); await tap(act('CONTINUE'), 700)`);
await run(`if (q('.streakbig')) { caption('Then the streak, then onward.'); await wait(1800); await tap(act('CONTINUE'), 700); } await wait(1200); await tap(act('BACK_TO_PATH'), 900)`);
await run(`caption('On the Path every Circle has a chest. This Circle was finished earlier: its chest waits.'); const c = q('.cheststop.ready .cbtn'); if (!c) throw new Error('no ready chest'); c.scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(3200)`);
await fact('coinsBeforePathChest', `return q('.coins .n').textContent;`);
await run(`caption('It opens once: 20 to 45 Coins, counted up.'); await tap(q('.cheststop.ready .cbtn'), 3400)`);
await fact('pathChest', `const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); return { coins: q('.coins .n').textContent, opened: Object.keys(d.pathChests), stillReady: qa('.cheststop.ready').length, shut: qa('.cheststop.shut').length };`);
await run(`caption('The Profile: the level and the XP to the next one.'); await tap(act('OPEN_PROFILE'), 700); const p = q('.levelpanel'); p.scrollIntoView({ block: 'start', behavior: 'smooth' }); await wait(3400)`);
await run(`caption('This week against last week, up to the same weekday. And the records.'); q('.weekpanel').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(3600); const r = qa('.panel').find((x) => x.innerText.includes('Records')); r.scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(3600)`);
await fact('profile', `return { week: q('.weekline').innerText, records: qa('.panel').find((x) => x.innerText.includes('Records')).innerText.replace(/\\n/g, ' ') };`);
await run(`caption('Path colours: five shards make one. Shards come only from clean Lessons.'); q('.colours').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(3200); await tap(act('BUY_COLOUR', 'rose'), 1800)`);
await run(`caption('Rose is in use. The Path takes the colour.'); await wait(1500); await tap(act('BACK_TO_PATH'), 900); scrollTo({ top: 0 }); await wait(3600); caption('')`);
await fact('colour', `const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); return { colours: d.colours, shards: d.shards, pathAttr: q('main.path').getAttribute('data-colour'), accent: getComputedStyle(q('main.path')).getPropertyValue('--accent').trim() };`);
const file = path.join(out, '8-levels-records-chests-colours.mp4');
const made = await rec.finish(file);
console.log(JSON.stringify({ file, ...made, failedSteps: log, pageErrors: b.errors, facts }, null, 1));
b.close();
