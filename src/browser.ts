import _puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { PuppeteerExtraPluginAdblocker } from "puppeteer-extra-plugin-adblocker";
import sharp from "sharp";
import type { ElementHandle, Page } from "puppeteer";
import fs from "fs";
import { RequestInterceptionManager } from "puppeteer-intercept-and-modify-requests";

async function getGridScreenshot(canvas: ElementHandle<HTMLDivElement>) {
  const screenshot = await canvas?.screenshot();
  const filtered = await sharp(screenshot).threshold(115).blur(1.5).normalise().toBuffer();
  // sharp(screenshot)
  //   .png()
  //   .toFile(increment("iframe-screenshot.png", { fs: true }));
  return filtered;
}

async function openGamePage() {
  const puppeteer = _puppeteer.default;
  puppeteer.use(StealthPlugin());
  puppeteer.use(new PuppeteerExtraPluginAdblocker({ blockTrackers: true }));
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./tmp/chrome-data",
    defaultViewport: { width: 950, height: 1000 },
    args: [`--window-size=850,800`],
    protocolTimeout: 0,
  });
  const page = await browser.newPage();
  page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  );

  const clientCDP = await browser.target().createCDPSession();
  const interceptManager = new RequestInterceptionManager(clientCDP);
  await interceptManager.intercept(
    {
      urlPattern: "https://social.wordbyword.me/js/bin/main.vk.js*",
      resourceType: "Script",
      modifyResponse: async () => {
        const data = fs.readFileSync("overrides/social.wordbyword.me/js/bin/main.vk.js", "utf-8");
        return { 
          body: data,
        };
      },
    },
    {
      urlPattern: "https://social.wordbyword.me/css/bin/main.css*",
      resourceType: "Stylesheet",
      modifyResponse: async ({ body }) => {
        return {
          body: body!.replace(/(?<=\.l-wrapper .*?)display: flex/s, "display: block"),
        };
      },
    }
  );

  await page.goto("https://vk.com/app4670469");
  return page;
}

async function getCanvas(page: Page) {
  const iframe = await getFrame(page);
  process.stdout.write("Looking for canvas...");
  const canvasSelector = "div#canvasContainer";
  await iframe.waitForSelector(canvasSelector, { visible: true });
  const canvas = await iframe.$(canvasSelector);
  process.stdout.write("\r\x1b[K");
  return canvas;
}

async function getFrame(page: Page) {
  process.stdout.write("Looking for the game frame...");
  const iframeSelector = "div#app_4670469_container iframe";
  await page.waitForSelector(iframeSelector, { visible: true });
  const iframeElementHandle = await page.$(iframeSelector);
  process.stdout.write("\r\x1b[K");
  return iframeElementHandle!.contentFrame();
}

export { openGamePage, getFrame, getCanvas, getGridScreenshot };
