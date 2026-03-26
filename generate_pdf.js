const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BRAVE_PATH = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';

async function generatePDF() {
  const launchOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };

  if (fs.existsSync(BRAVE_PATH)) {
    console.log('Using Brave Browser');
    launchOptions.executablePath = BRAVE_PATH;
  } else {
    console.log('Using Playwright bundled Chromium');
  }

  console.log('Launching browser...');
  const browser = await chromium.launch(launchOptions);

  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'dgrayling_cv.html');
  console.log(`Loading ${htmlPath}...`);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  const outputPath = process.env.OUTPUT_PATH
    ? path.resolve(process.env.OUTPUT_PATH)
    : path.resolve(__dirname, 'dgrayling_cv.pdf');
  console.log('Generating PDF...');
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  const scale = Math.min(1, (297 * 3.7795) / bodyHeight); // A4 height in px at 96dpi

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    scale,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log(`Done: ${outputPath}`);
}

generatePDF().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
