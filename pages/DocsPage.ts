import { Page, Locator } from '@playwright/test';

export class DocsPage {
  readonly page: Page;
  readonly docsTab: Locator;
  readonly gettingStartedNav: Locator;
  readonly gettingStartedTitles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.docsTab = page.getByRole('link', { name: 'Docs' });
    this.gettingStartedNav = page.locator('nav[aria-label="Docs sidebar"]');
    // Select only the links under the 'Getting Started' section
    this.gettingStartedTitles = page.locator(
      'nav[aria-label="Docs sidebar"] li:has(> .menu__list-item-collapsible > a:text("Getting Started")) > ul > li > a'
    );
  }

  async goto() {
    await this.page.goto('https://playwright.dev/');
  }

  async openDocsTab() {
    await this.docsTab.click();
  }

  async getGettingStartedTitles(): Promise<string[]> {
    // Wait for nav and titles to be visible
    await this.gettingStartedNav.waitFor();
    const titles = await this.gettingStartedTitles.allTextContents();
    // Filter out empty strings
    return titles.map(t => t.trim()).filter(Boolean);
  }
}
