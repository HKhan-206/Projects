// node capture.js <outdir> seq <t0> <t1>      -> numbered JPEG frames at the page's fps
// node capture.js <outdir> png t1,t2,...      -> full-quality PNG stills
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [out, mode, a, b] = process.argv.slice(2);
(async () => {
  const br = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, 'index.html') + '?capture=1');
  await p.waitForSelector('body[data-ready="1"]', { timeout: 180000 });
  const fps = await p.evaluate(() => NILE_KINETIC.fps);
  const times = mode === 'seq' ? Array.from({ length: Math.round((+b - +a) * fps) }, (_, i) => +a + i / fps) : a.split(',').map(Number);
  const cdp = await p.context().newCDPSession(p);
  fs.mkdirSync(out, { recursive: true }); let i = 0;
  for (const t of times) {
    await p.evaluate(t => NILE_KINETIC.seek(t), t + 1e-4);
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const png = mode === 'png';
    const r = await cdp.send('Page.captureScreenshot', { format: png ? 'png' : 'jpeg', quality: png ? undefined : 97 });
    fs.writeFileSync(png ? `${out}/t${t}.png` : `${out}/${String(i).padStart(5, '0')}.jpg`, Buffer.from(r.data, 'base64')); i++;
  }
  console.log(JSON.stringify({ frames: i, errors: errs })); await br.close();
})();
