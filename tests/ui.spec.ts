import { expect, test } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:8000';

test.describe('PKM Semantic Vault UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
  });

  test('page loads and has title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('PKM Semantic Vault');
  });

  test('load vault button loads notes', async ({ page }) => {
    await page.click('button:has-text("Load ./vault/")');
    await page.waitForSelector('text=All Notes');
    const allNotesHeader = await page.locator('text=All Notes');
    expect(await allNotesHeader.count()).toBeGreaterThan(0);
  });

  test('search filters notes', async ({ page }) => {
    await page.click('button:has-text("Load ./vault/")');
    await page.fill('input[type="text"]', 'Research');
    // small wait for UI
    await page.waitForTimeout(300);
    const content = await page.locator('#fileList').innerText();
    expect(content.toLowerCase()).toContain('research');
  });

  test('open a note and view content', async ({ page }) => {
    await page.click('button:has-text("Load ./vault/")');
    await page.waitForSelector('.list-item');
    const first = page.locator('.list-item').first();
    const name = await first.getAttribute('data-name');
    await first.click();
    await page.waitForSelector('#noteView h2');
    const heading = await page.locator('#noteView h2').innerText();
    expect(heading.length).toBeGreaterThan(0);
  });
});
