
const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('https://tansacvenhuong.site', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'C:/Users/OS/.gemini/antigravity/brain/87d1edd1-546a-46f6-aaae-c0f0682e440e/scratch/mobile_home_full.png', fullPage: true });
    await page.goto('https://tansacvenhuong.site/tra-cuu-don-hang', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'C:/Users/OS/.gemini/antigravity/brain/87d1edd1-546a-46f6-aaae-c0f0682e440e/scratch/mobile_lookup_full.png', fullPage: true });
    await browser.close();
    console.log('Puppeteer screenshots done!');
})().catch(e => console.log('Puppeteer error:', e.message));
