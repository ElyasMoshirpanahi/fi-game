// Spec 14, releases 1 and 2: two end-to-end videos at phone width, played through the real page by taps.
//   1-first-day.mp4    a first Lesson: quests, scoreboard, gold chest, streak screen, onward, quest chest, Profile
//   2-later-days.mp4   later days, reached by editing the saved progress: a freeze used, a Lesson with misses,
//                      Review offered first, the seventh day, a streak lost, buying a freeze
// node scripts/playtest/video-e2e.mjs <outDir> <debugPort>
// Needs ffmpeg on the PATH. Serve the repo first: python -m http.server 8766. GAME_URL overrides the address.
// <outDir> is created fresh: use a folder outside the repo. It edits localStorage inside its own fresh profile only.
// Never point it at a browser that holds real progress. A headless browser records no sound.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { launch } from './cdp-lib.mjs';
const out = process.argv[2];
const b = await launch(out, { port: +(process.argv[3] || 9595), width: 400, height: 800 });
const U = (process.env.GAME_URL || 'http://localhost:8766/index.html') + '?video=';
await b.send('Emulation.setDeviceMetricsOverride', { width: 360, height: 740, deviceScaleFactor: 2, mobile: true });

// ---- recorder: screenshots as fast as the browser gives them, stitched at the measured rate
let rec = null;
const startRec = (name) => {
  const dir = path.join(out, name); fs.mkdirSync(dir, { recursive: true });
  const r = { name, dir, n: 0, on: true, t0: Date.now() };
  r.loop = (async () => { while (r.on) { const s = await b.send('Page.captureScreenshot', { format: 'jpeg', quality: 72 }); if (s.result) fs.writeFileSync(path.join(dir, `f${String(++r.n).padStart(5, '0')}.jpg`), Buffer.from(s.result.data, 'base64')); await b.sleep(30); } })();
  rec = r;
};
const stopRec = async () => {
  rec.on = false; await rec.loop;
  const secs = (Date.now() - rec.t0) / 1000; const fps = (rec.n / secs).toFixed(2);
  const file = path.join(out, rec.name + '.mp4');
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', fps, '-i', path.join(rec.dir, 'f%05d.jpg'), '-vf', 'scale=540:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '27', '-movflags', '+faststart', file]);
  fs.rmSync(rec.dir, { recursive: true, force: true });
  return { file, secs: Math.round(secs), frames: rec.n, fps: +fps, ffmpeg: r.status, err: String(r.stderr || '').slice(0, 200) };
};

// ---- in-page helpers: a visible tap, a caption, and players for a Lesson and a Review
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
    if (!c) { c = document.createElement('div'); c.id = 'vcap'; c.style.cssText = 'position:fixed;z-index:99998;left:8px;right:8px;top:78px;padding:8px 12px;border-radius:10px;background:rgba(0,0,0,.86);color:#fff;font:600 13px/1.35 system-ui;text-align:center;border:1px solid #fff5;pointer-events:none'; document.body.appendChild(c); }
    c.textContent = text; c.style.display = text ? 'block' : 'none';
  };
  const norm = (x) => x.replace(/\\s+/g, ' ').trim();
  const act = (type) => qa('[data-action]').find((x) => x.getAttribute('data-action') === JSON.stringify({ type }) && x.getBoundingClientRect().width > 0);
  // Play the open Station to its scoreboard; \`miss\` Checks are answered wrong twice.
  const playLesson = async (id, miss, pace) => {
    const st = FI.content.station(id); let left = miss; let guard = 300;
    while (!q('.scoreboard') && !q('.onward') && !q('.streakbig') && guard-- > 0) {
      const knew = find('RATE', 'knew'); const cont = act('CONTINUE'); const prompt = q('h2.prompt');
      if (prompt) {
        const text = norm(prompt.innerText);
        const k = st.items.find((i) => i.kind === 'check' && (norm(i.prompt.en) === text || (i.fare && norm(i.fare.en) === text)));
        if (!k) throw new Error('no check for: ' + text);
        if (cont) await tap(cont, pace);
        else if (!q('.kicker.fare') && left > 0) { const bad = k.type === 'tf' ? !k.answer : (k.answer + 1) % k.options.length; await tap(find('ANSWER', bad), pace); if (find('ANSWER', bad)) await tap(find('ANSWER', bad), pace); left -= 1; }
        else await tap(find('ANSWER', k.answer), pace);
      } else if (knew) await tap(knew, pace); else if (cont) await tap(cont, pace); else throw new Error('stuck in the Lesson');
    }
  };
  const playReview = async (pace) => {
    const deck = Object.values(JSON.parse(localStorage.getItem('fi-roadmap-v1')).deck); let guard = 80;
    while (!q('.streakline') && guard-- > 0) {
      const next = find('REVIEW_NEXT'); const prompt = q('h2.prompt'); const knew = find('REVIEW_RATE', 'knew');
      if (prompt && qa('[data-action]').some((x) => x.getAttribute('data-action').includes('REVIEW_ANSWER'))) {
        const e = deck.find((d) => d.check && norm(d.check.prompt.en) === norm(prompt.innerText));
        if (!e) throw new Error('no Deck entry for: ' + prompt.innerText);
        await tap(find('REVIEW_ANSWER', e.check.answer), pace);
      } else if (knew) await tap(knew, pace); else if (next) await tap(next, pace); else break;
    }
  };`;
const run = async (code) => { const r = await b.js(`${H}\ntry { ${code}; return 'ok'; } catch (e) { return 'FAILED: ' + e.message; }`); if (r !== 'ok') log.push(r); return r; };
const log = [];
// Edit the saved progress and reload: the way to reach another day without waiting for one.
const travel = async (label, editBody) => {
  await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); const T = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5); ${editBody}; d.run = null; localStorage.setItem('fi-roadmap-v1', JSON.stringify(d)); return 1;`);
  await b.go(U + Date.now()); await b.sleep(500);
  await run(`caption(${JSON.stringify(label)}); await wait(2600)`);
};

// ================= video 1: the first day
await b.go(U + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + Date.now()); await b.sleep(900);
const today = await b.js(`return JSON.parse(localStorage.getItem('fi-roadmap-v1') || '{}').quests ? JSON.parse(localStorage.getItem('fi-roadmap-v1')).quests.day : null;`);
startRec('1-first-day');
await run(`caption('A new player. Today\\u2019s three quests sit under Continue.'); await wait(1600); q('.quests.inmain').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(2400)`);
await run(`caption('First Lesson, every answer right.'); await tap(find('OPEN_STATION', 's1'), 700); await playLesson('s1', 0, 330)`);
await run(`caption('Scoreboard: accuracy, time, best Combo, earned.'); await wait(2800); await tap(act('CONTINUE'), 500)`);
await run(`caption('No misses: a gold chest. The range is shown first.'); await wait(1800); await tap(act('OPEN_CHEST'), 200); caption('Coins count up. A gold chest always gives a shard.'); await wait(3900); await tap(act('CONTINUE'), 500)`);
await run(`caption('First Lesson of the day: the streak starts.'); await wait(2600); await tap(act('CONTINUE'), 500)`);
await run(`caption('Onward: place in the Section, next Lesson one tap away.'); await wait(2800); await tap(act('CONTINUE'), 900)`);
await run(`caption('Back on the Path: the flame is lit, the quests are done.'); q('.quests.inmain').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(2600); await tap(act('OPEN_QUEST_CHEST'), 200); caption('The quest chest: 30 to 60 Coins.'); await wait(3800)`);
await run(`caption('Profile: streak, last 7 days, freezes, Coins.'); await tap(find('OPEN_PROFILE'), 900); q('.streakpanel').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(3200); caption('')`);
const v1 = await stopRec();

// ================= video 2: later days
startRec('2-later-days');
await travel('Two days later. One day was missed, one freeze was held.', `d.streak = { n: 5, best: 5, last: T - 2 }; d.freezes = 1; d.marks = {}; for (let i = 2; i <= 6; i++) d.marks[T - i] = 'on'; d.quests = null`);
await run(`q('.streaknote').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(2600); await tap(act('DISMISS_STREAK_NOTE'), 600)`);
await run(`caption('A Lesson with two wrong answers.'); await tap(find('OPEN_STATION', 's3'), 700); await playLesson('s3', 2, 300)`);
await run(`caption('Lower accuracy on the scoreboard.'); await wait(2400); await tap(act('CONTINUE'), 500); caption('A plain chest: fewer Coins, no shard.'); await wait(1500); await tap(act('OPEN_CHEST'), 200); await wait(3000); await tap(act('CONTINUE'), 500)`);
await run(`caption('The streak goes on: the freeze covered the missed day.'); await wait(2800); await tap(act('CONTINUE'), 500)`);
await run(`caption('The missed Cards are named, with the day they return.'); await wait(3600); await tap(act('CONTINUE'), 700)`);
await travel('The next day. The missed Cards are due: Continue offers the Review first.', `for (const id of Object.keys(d.deck)) d.deck[id].due = 0; d.streak.last = T - 1; d.marks[T - 1] = 'on'; delete d.marks[T]; d.quests = null`);
await run(`await wait(1200); await tap(q('.reviewfirst button'), 700); caption('Review: each Card, then its question.'); await playReview(520)`);
await run(`caption('A finished Review counts for the streak too.'); await wait(3000); await tap(find('BACK_TO_PATH'), 700)`);
await travel('Day seven of the streak.', `d.streak = { n: 6, best: 6, last: T - 1 }; d.marks = {}; for (let i = 1; i <= 6; i++) d.marks[T - i] = 'on'; d.nudge7 = null; d.quests = null`);
await run(`caption('A replayed Lesson counts for the streak. It pays no Coins and no chest.'); await tap(find('OPEN_STATION', 's1'), 700); await playLesson('s1', 0, 150)`);
await run(`caption('Seven days: a milestone.'); await wait(3200); await tap(act('CONTINUE'), 600); await wait(1200); await tap(act('CONTINUE'), 800)`);
await run(`caption('Once, at seven days: back up your progress.'); q('.nudge7').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(3400); await tap(act('DISMISS_NUDGE'), 600)`);
await travel('Two days away with no freeze: the streak ends. The best stays.', `d.streak = { n: 7, best: 7, last: T - 2 }; d.freezes = 0; d.quests = null`);
await run(`q('.streaknote').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(3200); await tap(act('DISMISS_STREAK_NOTE'), 500)`);
await travel('Coins buy a freeze on the Profile: 250 each, two at most.', `d.coins = 600; d.earned = Math.max(d.earned || 0, 900)`);
await run(`await tap(find('OPEN_PROFILE'), 800); q('.streakpanel').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(1800); await tap(act('BUY_FREEZE'), 1300); await tap(act('BUY_FREEZE'), 1500); caption('Two held. Coins held went down; Coins earned did not.'); q('.stats').scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(3400); caption('')`);
const v2 = await stopRec();
const saved = await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); return { coins: d.coins, earned: d.earned, freezes: d.freezes, streak: d.streak, shards: d.shards };`);
console.log(JSON.stringify({ videos: [v1, v2], failedSteps: log, pageErrors: b.errors, today, saved }, null, 1));
b.close();
