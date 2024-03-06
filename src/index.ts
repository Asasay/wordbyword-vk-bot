import type { Page } from "puppeteer";
import Board, { BoardNode } from "./board/Board.js";
import * as browser from "./browser.js";
import Queue from "./queue/Queue.js";
import OCR from "./tesseract/tesseract.js";
import Trie from "./trie/Trie.js";
import { waitKeyPressed } from "./utils/utils.js";

async function main(page: Page) {
  await waitKeyPressed("Press 'ENTER' after starting a new game to begin the recognition process!");
  console.clear();
  const canvas = await browser.getCanvas(page);
  const canvasCoords = await canvas?.boundingBox();

  const gameEndAbortCtrl = new AbortController();
  const gameEnded = () => gameEndAbortCtrl.signal.aborted;
  Promise.race([
    browser.getFrame(page).then((frame) =>
      frame.waitForSelector("div.l-result", {
        visible: true,
        signal: gameEndAbortCtrl.signal,
        timeout: 180_000,
      })
    ),
    waitKeyPressed("Press 'ENTER' to stop recognition process!", {
      signal: gameEndAbortCtrl.signal,
    }),
  ])
    .then(() => gameEndAbortCtrl.abort())
    .catch((e) => e);

  if (!canvas || !canvasCoords) return main(page);
  const image = await browser.getGridScreenshot(canvas!);

  const words = (await browser
    .getFrame(page)
    .then((frame) => frame.evaluate("_data.words"))) as string[];

  const trie = new Trie(words.map((word) => word.toLowerCase()));
  const letters = await OCR(image);
  const board = new Board(letters);
  console.log("Initial board:\n%O", letters);

  const wordsFound = [];
  crawlLoop: for (const node of board.grid.flat()) {
    const queue = new Queue();
    queue.enqueue([node]);
    while (queue.peek()) {
      board.deselect();
      queue.dequeue().map((node: BoardNode) => board.select(node));
      const selected = board.selected.toString();
      if (trie.doesWordExist(selected)) {
        trie.deleteWord(selected);
        wordsFound.push(selected);
        for (let i = 0; i < selected.length; i++) {
          const node = board.selected[i];
          const border = 18;
          const letterWidth = 60;
          const distBetweenCenters = 66;
          const borderToLetterCenter = border + letterWidth / 2;
          const xOffset = border + borderToLetterCenter + node.index[1] * distBetweenCenters;
          const yOffset = border + borderToLetterCenter + node.index[0] * distBetweenCenters;
          await new Promise((resolve) => setTimeout(resolve, 80));
          await page.mouse.move(canvasCoords.x + xOffset, canvasCoords.y + yOffset);
          if (i == 0) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            await page.mouse.down();
          }
          if (i == selected.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            await page.mouse.up();
          }
        }
      }
      const adjacent = board.getPossibleNeighbors(board.selected.at(-1)!);
      const suggested = trie.suggestNextCharacters(selected);
      if (!suggested) continue;
      const valid = adjacent.filter((node) => suggested.includes(node.letter));
      for (const node of valid) {
        queue.enqueue(board.selected.concat(node));
      }
      if (gameEnded()) break crawlLoop;
    }
  }
  console.dir(
    wordsFound.sort((a, b) => a.length - b.length),
    { maxArrayLength: null }
  );
  console.log("Words found: %d \n", wordsFound.length);
  gameEndAbortCtrl.abort();
  return main(page);
}

console.clear();
browser.openGamePage().then((page) => main(page));
