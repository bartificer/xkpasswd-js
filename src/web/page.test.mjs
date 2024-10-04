/**
 * Test puppeteer
 * This is merely a test file to test some Puppeteer tests.
 *
 * Everything in here should pass.
 *
 */
/* @jest-environment jsdom */

import "expect-puppeteer";

const xkp_url = "http://localhost:8080";

describe("Google", () => {
  beforeAll(async () => {
    await page.goto("https://google.com");
  }, 10000);

  test('should display "google" text on page', async () => {
    await expect(page).toMatchTextContent("Google");
  }, 10000);
});

describe('About', () => {
  beforeAll(async () => {
    await page.goto(xkp_url);
  }, 10000);

  test('should display "About" on the page', async () => {
    await expect(page).toMatchTextContent("About");
  }, 1000);
});
