/**
 * Test puppeteer
 */
import {expect, test, describe, jest} from '@jest/globals';
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
    await page.goto(xkp_url,)
  })
});
