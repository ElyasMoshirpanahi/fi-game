// Spec 16 browser pass: on a phone, is the forward button always on screen, big enough, and clear of the answers?
// Plays the first Station and one book Lesson at 360x640 and 390x844 in EN, FA and Both, and measures every step.
// node scripts/playtest/phone-fit-pass.mjs <outDir> <debugPort>
// Serve the repo first: python -m http.server 8766. GAME_URL overrides the address.
// <outDir> is created fresh: use a folder outside the repo. It clears localStorage in its own fresh profile only.
import fs from 'node:fs';
import path from 'node:path';
import { launch } from './cdp-lib.mjs';
const out = process.argv[2];
const b = await launch(out, { port: +(process.argv[3] || 9596), width: 420, height: 900 });
const U = (process.env.GAME_URL || 'http://localhost:8766/index.html') + '?fit=';
const shot = async (name) => { const r = await b.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(r.result.data, 'base64')); };
// One step of a run, measured as a thumb meets it. Returns the problems of this step and what the step was.
const STEP = `
  const vh = innerHeight; const disc = q('.disc').getBoundingClientRect(); const problems = [];
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  const fwd = qa('.station.run .actions .btn, .station.run .feedback .btn').filter(vis);
  const kind = q('.scoreboard') ? 'scoreboard' : q('.chest') ? 'chest' : q('.streakbig') ? 'streak' : q('.onward') ? 'onward' : q('.recapscore') ? 'recap-done' : q('.feedback .btn') ? 'feedback' : q('h2.prompt') ? 'question' : q('.ctext') ? 'card' : q('.result') ? 'result' : 'other';
  if (!fwd.length && kind !== 'question') problems.push(kind + ': no forward button');
  scrollTo(0, 0); await wait(30);
  for (const el of fwd) {
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.bottom > disc.top + 1) problems.push(kind + ': button off screen or under the Disclaimer (' + Math.round(r.top) + '..' + Math.round(r.bottom) + ' of ' + Math.round(disc.top) + ')');
    if (r.height < 53.5) problems.push(kind + ': button ' + Math.round(r.height) + 'px tall');
    if (r.left < 0 || r.right > innerWidth + 1) problems.push(kind + ': button wider than the screen');
  }
  const bar = fwd.length ? fwd[0].closest('.actions, .feedback').getBoundingClientRect() : null;
  // every answer option can be scrolled clear of the fixed block and is tall enough
  const opts = qa('.station.run .opts .btn, .station.run .tf .btn').filter(vis);
  for (const el of opts) {
    el.scrollIntoView({ block: 'center' }); await wait(20);
    const r = el.getBoundingClientRect();
    if (r.height < 51.5) problems.push(kind + ': option ' + Math.round(r.height) + 'px tall');
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    if (top !== el && !el.contains(top)) problems.push(kind + ': option covered by ' + (top ? top.className : 'nothing'));
  }
  // the end of the text can be scrolled clear of the fixed block
  const body = q('.station.run .ctext, .station.run .missedlist, .station.run .scoreboard');
  if (body && bar) { scrollTo(0, document.documentElement.scrollHeight); await wait(30); const r = body.getBoundingClientRect(); const b2 = fwd[0].closest('.actions, .feedback').getBoundingClientRect(); if (r.bottom > b2.top + 1) problems.push(kind + ': text ends under the button block (' + Math.round(r.bottom) + ' > ' + Math.round(b2.top) + ')'); }
  const needsScroll = document.documentElement.scrollHeight > vh + 2 && body ? (() => { scrollTo(0, 0); const r = body.getBoundingClientRect(); return bar ? r.bottom > bar.top + 1 : false; })() : false;
  scrollTo(0, 0);
  if (document.documentElement.scrollWidth > innerWidth) problems.push(kind + ': page wider than the screen');
  return { kind, problems, needsScroll, barHeight: bar ? Math.round(bar.height) : 0 };`;
const ADVANCE = (id) => `
  const st = FI.content.station('${id}'); const norm = (x) => x.replace(/\\s+/g, ' ').trim();
  const pick = (type) => qa('.station.run [data-action]').find((x) => x.getAttribute('data-action') === JSON.stringify({ type }) && !x.disabled);
  const cont = pick('CONTINUE'); const chest = pick('OPEN_CHEST'); const prompt = q('h2.prompt');
  if (q('.onward')) return 'end';
  if (chest) { chest.click(); await wait(250); return 'go'; }
  if (cont) { cont.click(); await wait(140); return 'go'; }
  if (prompt) {
    const text = norm(prompt.innerText);
    const k = st.items.find((i) => i.kind === 'check' && [i.prompt.en, i.prompt.fa, i.prompt.en + ' ' + i.prompt.fa, i.fare && i.fare.en, i.fare && i.fare.fa, i.fare && (i.fare.en + ' ' + i.fare.fa)].filter(Boolean).some((p) => norm(p) === text));
    if (!k) return 'no check for: ' + text.slice(0, 60);
    const wrongFirst = window.__missOnce && !window.__missed; // one wrong answer per Lesson, to meet the wrong-answer screens
    if (k.type === 'order') { for (const i of k.answer) { find('UI_ORDER_ADD', i).click(); await wait(40); } qa('.station.run .actions .btn.primary')[0].click(); }
    else if (wrongFirst) { window.__missed = true; const bad = k.type === 'tf' ? !k.answer : (k.answer + 1) % k.options.length; find('ANSWER', bad).click(); await wait(120); if (find('ANSWER', bad)) find('ANSWER', bad).click(); }
    else find('ANSWER', k.answer).click();
    await wait(480); return 'go';
  }
  return 'stuck';`;
const report = { steps: 0, problems: [], scrolls: {}, bars: {} };
const book = await (async () => { await b.go(U + 0); return b.js(`const sec = FI.content.sections.find((x) => x.kind === 'book'); return sec.runs[0];`); })();
for (const [tag, w, h] of [['small', 360, 640], ['tall', 390, 844]]) {
  await b.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true });
  for (const mode of ['EN', 'FA', 'BOTH']) {
    await b.go(U + tag + mode + 1); await b.js(`localStorage.clear(); return 1;`); await b.go(U + tag + mode + Date.now()); await b.sleep(700);
    await b.js(`find('SET_MODE', '${mode}').click(); await wait(300); return 1;`);
    for (const id of ['s1', book]) {
      // A book Lesson is opened as a player opens it: tap its Circle, then Start in the pop-up.
      const opened = await b.js(`window.__missOnce = true; window.__missed = false; let btn = find('OPEN_STATION', '${id}'); if (!btn) { const c = FI.content.circleOf('${id}'); const circle = q('[data-circle="' + c.id + '"] .ubtn'); circle.scrollIntoView({ block: 'center' }); circle.click(); await wait(400); btn = find('OPEN_STATION', '${id}'); } if (!btn) return 'no way in'; btn.click(); for (let i = 0; i < 40 && !q('.station.run'); i++) await wait(150); await wait(400); return q('.station.run') ? 'ok' : 'not opened';`);
      if (opened !== 'ok') { report.problems.push(`${tag} ${mode} ${id} ${opened}`); continue; }
      const seen = new Set(); let guard = 140; let state = 'go';
      while (state === 'go' && guard-- > 0) {
        const r = await b.js(STEP); report.steps += 1;
        const key = `${tag} ${mode} ${id} ${r.kind}`;
        for (const p of r.problems) report.problems.push(`${tag} ${mode} ${id} ${p}`);
        if (r.needsScroll) report.scrolls[`${tag} ${mode} ${r.kind}`] = (report.scrolls[`${tag} ${mode} ${r.kind}`] || 0) + 1;
        report.bars[r.kind] = Math.max(report.bars[r.kind] || 0, r.barHeight);
        if (!seen.has(r.kind) && (mode === 'BOTH' || tag === 'small')) { seen.add(r.kind); await shot(`${tag}-${mode}-${id}-${r.kind}`); }
        state = await b.js(ADVANCE(id));
      }
      if (state !== 'end') report.problems.push(`${tag} ${mode} ${id} run ended as: ${state}`);
      await b.js(`const x = qa('[data-action]').find((e) => e.getAttribute('data-action') === '{"type":"BACK_TO_PATH"}'); if (x) x.click(); await wait(500); return 1;`);
    }
  }
}
report.problems = [...new Set(report.problems)];
console.log(JSON.stringify({ ...report, errors: b.errors }, null, 1));
b.close();
