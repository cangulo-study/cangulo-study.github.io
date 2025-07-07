import { test, expect } from '@playwright/test';
import fs from 'fs';

test('should load the home page', async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000');

    // Verify the presence of the main heading
    const mainHeading = await page.locator('h1');
    await expect(mainHeading).toHaveText('Available Tests');
});

test('should load all tests available', async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000');

    const content = fs.readFileSync('public/tests/test-list.json', 'utf-8');
    const tests = JSON.parse(content);
    const totalTests = tests.length;

    // Verify the number of test cards displayed under the div class-name="test-cards"
    const testCards = await page.locator('.test-card');
    await expect(testCards).toHaveCount(totalTests);

});
