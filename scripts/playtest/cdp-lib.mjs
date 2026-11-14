// Headless browser helper for the play-test scripts: a Chromium-family browser driven over the DevTools protocol.
// Set BROWSER_PATH to the browser to use (default: Brave on Windows).
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
export async function launch(outDir, { width = 420, height = 860, port = 9340, flags = [] } = {}) {
  fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true });
  const chrome = spawn(process.env.BROWSER_PATH || 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(outDir, 'profile')}`, `--window-size=${width},${height}`, ...flags, 'about:blank'], { stdio: 'ignore' });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let target;
  for (let i = 0; i < 40 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {} }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = new Map(); const errors = [];
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const js = async (body) => { const r = await send('Runtime.evaluate', { expression: `(async () => { const q=s=>document.querySelector(s); const qa=s=>[...document.querySelectorAll(s)]; const find=(t,v)=>qa('[data-action]').find(b=>{const a=JSON.parse(b.getAttribute('data-action')); return a.type===t && (v===undefined || JSON.stringify(a.value)===JSON.stringify(v));}); const wait=ms=>new Promise(r=>setTimeout(r,ms)); ${body} })()`, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description; };
  let n = 0;
  const frame = async (hold = 1) => { const r = await send('Page.captureScreenshot', { format: 'png' }); const buf = Buffer.from(r.result.data, 'base64'); for (let i = 0; i < hold; i++) fs.writeFileSync(path.join(outDir, `f${String(++n).padStart(4, '0')}.png`), buf); };
  await send('Runtime.enable'); await send('Page.enable');
  const go = async (url) => { await send('Page.navigate', { url }); await sleep(1500); };
  // Brave starts through a launcher, so the spawned pid is not the browser. Ask the browser itself to quit
  // (Browser.close ends its whole process tree), then kill the launcher tree as a fallback.
  const close = () => { try { ws.send(JSON.stringify({ id: ++id, method: 'Browser.close' })); } catch {} setTimeout(() => { try { ws.close(); } catch {} try { spawnSync('taskkill', ['/PID', String(chrome.pid), '/T', '/F'], { stdio: 'ignore' }); } catch {} }, 600); };
  return { js, frame, go, send, sleep, errors, close, frames: () => n };
}
