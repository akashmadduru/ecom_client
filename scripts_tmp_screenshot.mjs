import { chromium } from '@playwright/test'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push('pageerror: ' + err.message))

await page.goto('http://localhost:5174/products', { waitUntil: 'networkidle', timeout: 15000 })
await page.waitForTimeout(1000)
await page.screenshot({ path: '/tmp/products-page.png', fullPage: false })

// Expand the first top-level category to check the drill-down UI
const expandBtn = page.locator('button[aria-label^="Expand"]').first()
if (await expandBtn.count() > 0) {
  await expandBtn.click()
  await page.waitForTimeout(800)
  await page.screenshot({ path: '/tmp/products-page-expanded.png', fullPage: false })
}

console.log('ERRORS:', JSON.stringify(errors, null, 2))
await browser.close()
