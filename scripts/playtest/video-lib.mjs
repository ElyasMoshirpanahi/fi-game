// A screen recording with the game's own sound, for the end-to-end videos.
// The picture is a loop of screenshots. The sound is the game's Web Audio, tapped inside the page: every node that
// connects to the speakers is also connected to a tap that keeps the raw samples. A page load ends one sound segment and starts the next;
// each segment is laid on the timeline at the moment it started.
// Needs ffmpeg on the PATH.
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

// Chromium keeps an AudioContext suspended until a real key or pointer press; this flag lifts that for the recording.
export const AUDIO_FLAGS = ['--autoplay-policy=no-user-gesture-required'];

const TAP = `(() => {
  if (window.__tap) return; const taps = new Map(); window.__tap = { taps };
  const connect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function (dest, ...rest) {
    const ctx = this.context;
    if (dest === ctx.destination && !this.__isTap) {
      let t = taps.get(ctx);
      if (!t) {
        // Raw samples through a ScriptProcessor: MediaRecorder yields nothing in a headless browser.
        const bus = ctx.createGain(); const sp = ctx.createScriptProcessor(4096, 1, 1); sp.__isTap = true;
        t = { bus, sp, parts: [], at: 0, rate: ctx.sampleRate };
        sp.onaudioprocess = (e) => { if (!t.at) t.at = Date.now() - Math.round(4096 / ctx.sampleRate * 1000); const f = e.inputBuffer.getChannelData(0); const o = new Int16Array(f.length); for (let i = 0; i < f.length; i++) o[i] = Math.max(-1, Math.min(1, f[i])) * 32767; t.parts.push(o); };
        connect.call(bus, sp); connect.call(sp, ctx.destination); taps.set(ctx, t);
      }
      connect.call(this, t.bus);
    }
    return connect.call(this, dest, ...rest);
  };
  window.__tapStop = async () => {
    const res = [];
    for (const t of taps.values()) {
      t.sp.onaudioprocess = null;
      const n = t.parts.reduce((a, p) => a + p.length, 0); if (!n) continue;
      const all = new Int16Array(n); let o = 0; for (const p of t.parts) { all.set(p, o); o += p.length; }
      const buf = new Uint8Array(all.buffer); let bin = '';
      for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      res.push({ at: t.at, rate: t.rate, data: btoa(bin) });
    }
    taps.clear(); window.__tapOut = res; return res.map((x) => ({ at: x.at, rate: x.rate, size: x.data.length }));
  };
})();`;

// b: a browser from cdp-lib's launch(). Returns { go, start, finish }.
//   go(url)      navigate, keeping the sound recorded so far
//   start()      begin the picture
//   finish(file) stop, and write an mp4 with picture and sound; returns { secs, sound, ffmpeg }
export async function recorder(b, outDir) {
  const dir = path.join(outDir, 'frames'); fs.mkdirSync(dir, { recursive: true });
  await b.send('Page.addScriptToEvaluateOnNewDocument', { source: TAP });
  const rec = { n: 0, on: false, t0: 0, segs: [] };
  // The samples come back in slices: one large reply stalls the DevTools socket.
  const harvest = async () => {
    const r = await b.js(`return window.__tapStop ? await window.__tapStop() : [];`); if (!Array.isArray(r)) return;
    for (let i = 0; i < r.length; i++) {
      let data = ''; const step = 400000;
      for (let o = 0; o < r[i].size; o += step) data += await b.js(`return window.__tapOut[${i}].data.slice(${o}, ${o + step});`);
      if (data.length === r[i].size && data.length) rec.segs.push({ at: r[i].at, rate: r[i].rate, data });
    }
  };
  const go = async (url) => { await harvest(); await b.go(url); };
  const start = () => {
    rec.on = true; rec.t0 = Date.now();
    rec.loop = (async () => { while (rec.on) { const s = await b.send('Page.captureScreenshot', { format: 'jpeg', quality: 72 }); if (s.result) fs.writeFileSync(path.join(dir, `f${String(++rec.n).padStart(5, '0')}.jpg`), Buffer.from(s.result.data, 'base64')); await b.sleep(30); } })();
  };
  const finish = async (file) => {
    rec.on = false; await rec.loop; await harvest();
    const secs = (Date.now() - rec.t0) / 1000; const fps = (rec.n / secs).toFixed(2);
    const args = ['-y', '-loglevel', 'error', '-framerate', fps, '-i', path.join(dir, 'f%05d.jpg')];
    const segs = rec.segs.map((s, i) => { const f = path.join(outDir, `sound${i}.pcm`); fs.writeFileSync(f, Buffer.from(s.data, 'base64')); return { f, rate: s.rate, delay: Math.max(0, s.at - rec.t0) }; });
    for (const s of segs) args.push('-f', 's16le', '-ar', String(s.rate), '-ac', '1', '-i', s.f);
    const video = ['-vf', 'scale=540:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '27', '-movflags', '+faststart'];
    if (segs.length) {
      const mix = segs.map((s, i) => `[${i + 1}:a]adelay=${s.delay}:all=1[a${i}]`).join(';') + ';' + segs.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${segs.length}:normalize=0,volume=4[a]`;
      args.push('-filter_complex', mix, '-map', '0:v', '-map', '[a]', ...video, '-c:a', 'aac', '-b:a', '64k', '-t', secs.toFixed(2), file);
    } else args.push(...video, file);
    const ff = spawnSync('ffmpeg', args, { encoding: 'utf8' });
    fs.rmSync(dir, { recursive: true, force: true }); for (const s of segs) fs.rmSync(s.f, { force: true });
    return { secs: Math.round(secs), sound: segs.length, ffmpeg: ff.status, ffmpegError: (ff.stderr || '').slice(0, 300) };
  };
  return { go, start, finish };
}
export { spawn };
