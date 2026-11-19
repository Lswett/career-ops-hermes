// Silent HTML->PDF renderer via Playwright Chromium (no visible windows).
// Usage: node render_pdf.mjs <input.html> <output.pdf> [input2.html output2.pdf ...]
import { chromium } from 'playwright';

const pairs = process.argv.slice(2);
if (pairs.length < 2 || pairs.length % 2 !== 0) {
  console.error('usage: node render_pdf.mjs <in.html> <out.pdf> [...]');
  process.exit(1);
}
const browser = await chromium.launch({ headless: true });
try {
  for (let i = 0; i < pairs.length; i += 2) {
    const src = pairs[i].replace(/\\/g, '/');
    const dst = pairs[i + 1];
    const page = await browser.newPage();
    await page.goto('file:///' + src, { waitUntil: 'networkidle' });
    await page.pdf({ path: dst, preferCSSPageSize: true, printBackground: true });
    await page.close();
    console.log('rendered', dst);
  }
} finally {
  await browser.close();
}
