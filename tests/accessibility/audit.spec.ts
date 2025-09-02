import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

const paths = ['/login', '/courses/1/copo', '/assessments'];

for (const path of paths) {
  test(`no WCAG AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa'],
        },
      },
    });
  });
}
