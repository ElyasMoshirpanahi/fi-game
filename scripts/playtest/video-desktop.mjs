// One end-to-end video on a desktop window (1366x768), with the game's sound:
//   5-desktop-tabs-and-milestone.mp4   the Path, Shelf, Bookmarks and Profile fill the width and carry the rail;
//                                      the Milestone is a badge only and pays no XP
// node scripts/playtest/video-desktop.mjs <outDir> <debugPort>
// Needs ffmpeg on the PATH. Serve the repo first: python -m http.server 8766. GAME_URL overrides the address.
// <outDir> is created fresh: use a folder outside the repo. It edits localStorage inside its own fresh profile only.
import path from 'node:path';
import { launch } from './cdp-lib.mjs';
import { recorder, AUDIO_FLAGS } from './video-lib.mjs';
const out = process.argv[2];
const b = await launch(out, { port: +(process.argv[3] || 9600), width: 1400, height: 860, flags: AUDIO_FLAGS });
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
    if (!c) { c = document.createElement('div'); c.id = 'vcap'; c.style.cssText = 'position:fixed;z-index:99998;left:50%;transform:translateX(-50%);bottom:56px;max-width:760px;padding:9px 16px;border-radius:10px;background:rgba(0,0,0,.9);color:#fff;font:600 15px/1.35 system-ui;text-align:center;border:1px solid #fff5;pointer-events:none'; document.body.appendChild(c); }
    c.textContent = text; c.style.display = text ? 'block' : 'none';
  };
  const act = (type, value) => qa('[data-action]').find((x) => { const a = JSON.parse(x.getAttribute('data-action')); return a.type === type && (value === undefined || a.value === value) && x.getBoundingClientRect().width > 0 && !x.disabled; });
  const measure = () => { const m = q('#app > main').getBoundingClientRect(); const r = q('#app > .rail'); const rr = r ? r.getBoundingClientRect() : null; return { main: [Math.round(m.left), Math.round(m.right)], rail: rr && rr.width ? [Math.round(rr.left), Math.round(rr.right)] : null, width: document.documentElement.clientWidth, hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth }; };`;
const log = []; const seen = {};
const run = async (code) => { const r = await b.js(`${H}\ntry { ${code}; return 'ok'; } catch (e) { return 'FAILED: ' + e.message; }`); if (r !== 'ok') log.push(r + ' in: ' + code.slice(0, 60)); return r; };
const note = async (name) => { seen[name] = await b.js(`${H}\nreturn measure();`); };

await b.go(U + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + Date.now()); await b.sleep(700);
// A player with some progress, one bookmark and every checklist item but one ticked.
await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); d.farePassed = { s1: true, s2: true }; d.lit = { s1: true, s2: true }; d.xp = 100; d.coins = 120; d.earned = 120; const st = FI.content.station('s1'); const card = st.items.find((i) => i.kind === 'card'); d.bookmarks = [{ stationId: 's1', cardId: card.id, text: card.text }]; for (const l of FI.content.checklists) d.checklists[l.id] = l.items.map(() => true); const last = FI.content.checklists[FI.content.checklists.length - 1]; d.checklists[last.id][last.items.length - 1] = false; localStorage.setItem('fi-roadmap-v1', JSON.stringify(d)); return 1;`);
await rec.go(U + Date.now()); await b.sleep(700);
rec.start();
await run(`caption('Desktop, 1366 px wide. The Path fills the width; the rail holds the right edge.'); await wait(2800)`); await note('path');
await run(`caption('The Shelf now fills the width too, with the same rail.'); await tap(act('OPEN_TOOLS', 's6'), 600); await wait(2600)`); await note('shelf');
await run(`caption('Bookmarks: the same layout.'); await tap(act('OPEN_BOOKMARKS'), 600); await wait(2600)`); await note('bookmarks');
await run(`caption('Profile: full width. Its rail leaves out the numbers and the streak, because the Profile shows them itself.'); await tap(act('OPEN_PROFILE'), 600); await wait(3200); scrollTo({ top: 500, behavior: 'smooth' }); await wait(1800); scrollTo({ top: 0, behavior: 'smooth' }); await wait(900)`); await note('profile');
await run(`caption('Review is a run, like a Lesson: it stays a centred column with no rail.'); await tap(act('OPEN_REVIEW'), 600); await wait(2400)`); await note('review');
const xpBefore = await b.js(`return JSON.parse(localStorage.getItem('fi-roadmap-v1')).xp;`);
await run(`caption('The Milestone. One checklist item is left. XP now: ${xpBefore}.'); await tap(act('BACK_TO_PATH'), 500); await tap(act('OPEN_TOOLS', 's5'), 700); const boxes = qa('[data-action]').filter((x) => JSON.parse(x.getAttribute('data-action')).type === 'TOGGLE_CHECK'); const open = boxes.find((x) => x.getAttribute('aria-pressed') === 'false' || x.getAttribute('aria-checked') === 'false' || (x.querySelector('input') && !x.querySelector('input').checked) || (x.matches('input') && !x.checked)); if (!open) throw new Error('no open checklist item among ' + boxes.length); open.scrollIntoView({ block: 'center', behavior: 'smooth' }); await wait(1600); await tap(open, 1200)`);
await run(`if (!q('.milestone')) throw new Error('no Milestone screen'); caption('The Milestone is a badge only: no XP is paid. XP comes from learning alone.'); await wait(4200); await tap(act('UI_MILESTONE_CLOSE'), 900); caption('')`);
const xpAfter = await b.js(`const d = JSON.parse(localStorage.getItem('fi-roadmap-v1')); return { xp: d.xp, milestone: d.milestone };`);
const file = path.join(out, '5-desktop-tabs-and-milestone.mp4');
const made = await rec.finish(file);
console.log(JSON.stringify({ file, ...made, failedSteps: log, pageErrors: b.errors, layout: seen, xpBefore, xpAfter }, null, 1));
b.close();
