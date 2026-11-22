// Captures endcard.html frame by frame (used by build.sh).
// node ecap.js <html> <outdir> <mode: frames|times> <fps|t1,t2,...> [duration]
const { chromium } = require('playwright'); const fs = require('fs');
const [page, out, mode, arg, dur] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() !== 'log') errs.push(m.text()); });
  await p.goto('file://' + encodeURI(page) + '?capture=1'); await p.waitForSelector('body[data-ready="1"]', { timeout: 60000 });
  const c = await p.context().newCDPSession(p);
  const times = mode === 'frames' ? Array.from({ length: Math.round(parseFloat(dur) * parseFloat(arg)) }, (_, i) => i / parseFloat(arg)) : arg.split(',').map(Number);
  let i = 0;
  for (const t of times) {
    await p.evaluate(t => { EC_TL.time(t); }, t);
    const r = await c.send('Page.captureScreenshot', { format: mode === 'frames' ? 'jpeg' : 'png', quality: 95 });
    fs.writeFileSync(mode === 'frames' ? `${out}/${String(i).padStart(5, '0')}.jpg` : `${out}/t${t.toFixed(2)}.png`, Buffer.from(r.data, 'base64')); i++;
  }
  console.log('frames', i, 'errors', errs); await b.close();
})();
