import { test, expect } from '@playwright/test';

test('should load the first question', async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000');

    // click on "Set 1" 
    await page.click('text=Set 1');

    // ensure the first question is displayed
    const firstQuestion = await page.locator('h2').first();
    await expect(firstQuestion).toHaveText(/^Question 1 of/);

    // ensure the "Test Set #1" is displayed
    const testSet = await page.locator('div').filter({ hasText: /^Test Set #1$/ });
    await expect(testSet).toBeVisible();
});
