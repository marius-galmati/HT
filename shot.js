import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const preview = spawn('npx', ['astro', 'preview', '--port', '8087'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 3500));

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());

async function shoot(url, out, { width = 1440, height = 900, full = true, mobile = false } = {}) {
  const ctx = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width, height },
    deviceScaleFactor: 1.5,
    isMobile: mobile,
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);
  // scroll through to trigger reveals
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 450) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 90)); }
    await new Promise((r) => setTimeout(r, 350));
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: out, fullPage: full });
  await ctx.close();
  console.log('shot', out);
}

const B = 'http://localhost:8087';
await shoot(`${B}/`, 'preview/hero-desktop.png', { full: false });
await shoot(`${B}/?noanim`, 'preview/home-ro-complet.png');
await shoot(`${B}/servicii?noanim`, 'preview/servicii-complet.png');
await shoot(`${B}/branduri?noanim`, 'preview/branduri-complet.png');
await shoot(`${B}/uniforme?noanim`, 'preview/uniforme-complet.png');
await shoot(`${B}/atelier?noanim`, 'preview/atelier-complet.png');
await shoot(`${B}/contact?noanim`, 'preview/contact-complet.png');
await shoot(`${B}/en/`, 'preview/home-en-hero.png', { full: false });
await shoot(`${B}/?noanim`, 'preview/home-mobil.png', { mobile: true });

await browser.close();
preview.kill();
process.exit(0);
