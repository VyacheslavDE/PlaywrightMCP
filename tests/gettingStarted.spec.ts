import { test, expect } from '@playwright/test';
import { DocsPage } from '../pages/DocsPage';

test('Collect Getting Started titles from Playwright Docs', async ({ page }) => {
  const docsPage = new DocsPage(page);

  await docsPage.goto();
  await docsPage.openDocsTab();
  const titles = await docsPage.getGettingStartedTitles();
  console.log('Getting Started Titles:', titles);
  expect(titles.length).toBeGreaterThan(0);
});

test('Validate Getting Started titles under Docs', async ({ page }) => {
  const docsPage = new DocsPage(page);
  await docsPage.goto();
  await docsPage.openDocsTab();
  const titles = await docsPage.getGettingStartedTitles();
  // Update the expectedTitles array to match the actual expected order and values
  const expectedTitles = [
    'Installation',
    'Writing tests',
    'Generating tests',
    'Running and debugging tests',
    'Trace viewer',
    'Setting up CI'
  ];
  expect(titles).toEqual(expectedTitles);
});
