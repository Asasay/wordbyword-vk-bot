import _puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { PuppeteerExtraPluginAdblocker } from "puppeteer-extra-plugin-adblocker";
import sharp from "sharp";
import type { ElementHandle, Page } from "puppeteer";
// import increment from "add-filename-increment";

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
    // executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    userDataDir: "./tmp/chrome-data",
    defaultViewport: { width: 950, height: 1000 },
    args: [`--window-size=850,800`],
    protocolTimeout: 0,
  });
  const page = await browser.newPage();
  page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  );

  await page.goto("https://vk.com/app4670469");
  removeWrapper(page);

  return page;
}

const removeWrapper = async (page: Page) => {
  getFrame(page)
    .then((frame) => frame.$("div.l-wrapper"))
    .then((el) => el?.evaluate((elem) => (elem.style.display = "block")))
    .catch((e) => console.log(e));
};

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
