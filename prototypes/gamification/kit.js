// PROTOTYPE kit: throwaway. Shared by the gamification batches. Not part of the game.
// Each batch page calls Proto.start({ batch, question, variants }). A variant is
// { key, name, why, risk, src, tryIt: [..], sim: { label: action }, init(), view(state), actions, show(state) }.
// State lives in memory only: a reload starts over. The side panel prints the state after every tap.
const Proto = (() => {
  // Six Checks in the game's voice, for variants that need a playable Lesson.
  const Q = [
    { q: '€40k at a 5 percent real return pays about how much a year?', o: ['€2k', '€20k', '€200'], a: 0 },
    { q: 'The 25x rule says your target capital is…', o: ['25 times your salary', '25 times your yearly expenses', '25 years of saving'], a: 1 },
    { q: 'True or false: a higher income always means more wealth.', o: ['True', 'False'], a: 1 },
    { q: 'What does an index ETF buy?', o: ['One company the manager likes', 'A whole market at low cost', 'Only bonds'], a: 1 },
    { q: 'Compounding rewards mostly…', o: ['Timing the market', 'Picking winners', 'Time in the market'], a: 2 },
    { q: 'True or false: a decision journal is re-read months later.', o: ['True', 'False'], a: 0 },
  ];
  const $ = (s) => document.querySelector(s);
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  function start({ batch, question, variants }) {
    const keys = variants.map((v) => v.key);
    const url = new URL(location.href);
    let cur = keys.includes(url.searchParams.get('variant')) ? url.searchParams.get('variant') : keys[0];
    document.body.innerHTML = `<header class="phead"><a href="index.html">← all batches</a><h1>${batch}</h1><p>${question}</p></header>
      <div class="stage"><div class="phone"><div id="screen"></div></div>
        <aside class="side"><h2 id="vname"></h2><p id="vwhy"></p><p class="risk" id="vrisk"></p><p class="src" id="vsrc"></p>
          <h3>Outside the phone (simulate)</h3><div class="sim" id="sim"></div>
          <h3>State right now</h3><dl id="state"></dl>
          <h3>What to try</h3><ol id="try"></ol></aside></div>
      <nav class="switch"><button id="prev" aria-label="Previous variant">←</button><span id="vlabel"></span><button id="next" aria-label="Next variant">→</button></nav>`;
    let state, last = {};
    const v = () => variants.find((x) => x.key === cur);
    const draw = () => {
      const now = v().show(state);
      $('#screen').innerHTML = v().view(state);
      $('#state').innerHTML = Object.entries(now).map(([k, val]) => `<dt>${k}</dt><dd class="${k in last && last[k] !== String(val) ? 'changed' : ''}">${val}</dd>`).join('');
      last = Object.fromEntries(Object.entries(now).map(([k, val]) => [k, String(val)]));
    };
    const act = (name, arg) => { const f = v().actions[name]; if (f) { f(state, arg); draw(); } };
    const open = () => {
      const x = v();
      url.searchParams.set('variant', cur); history.replaceState(null, '', url);
      $('#vlabel').textContent = `${x.key} · ${x.name}`; $('#vname').textContent = `${x.key}. ${x.name}`;
      $('#vwhy').textContent = x.why; $('#vrisk').textContent = 'Risk: ' + x.risk; $('#vsrc').textContent = x.src || '';
      $('#try').innerHTML = x.tryIt.map((t) => `<li>${t}</li>`).join('');
      $('#sim').innerHTML = Object.entries({ ...(x.sim || {}), 'Reset this variant': '__reset' }).map(([label, a]) => `<button data-sim="${a}">${label}</button>`).join('');
      state = x.init(); last = {}; draw();
    };
    const step = (d) => { cur = keys[(keys.indexOf(cur) + d + keys.length) % keys.length]; open(); };
    $('#prev').onclick = () => step(-1); $('#next').onclick = () => step(1);
    document.addEventListener('keydown', (e) => { if (e.target.matches('input, textarea, [contenteditable]')) return; if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
    $('#screen').addEventListener('click', (e) => { const b = e.target.closest('[data-do]'); if (b && !b.disabled) act(b.dataset.do, b.dataset.arg); });
    $('#sim').addEventListener('click', (e) => { const b = e.target.closest('[data-sim]'); if (!b) return; if (b.dataset.sim === '__reset') open(); else act(b.dataset.sim); });
    open();
  }
  const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  return { start, Q, rnd, DAYS };
})();
