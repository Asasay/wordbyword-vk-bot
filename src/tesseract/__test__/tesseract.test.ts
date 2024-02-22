import sharp from "sharp";
import gridOCR from "../tesseract.js";
import fs from "fs";

describe("Tesseract", () => {
  it("should ocr test-image-1", async () => {
    const imagePath = new URL("./test-grid-1.png", import.meta.url);
    const image = fs.readFileSync(imagePath);
    const filtered = await sharp(image).threshold(115).blur(1.5).normalise().toBuffer();
    const grid = await gridOCR(filtered);
    expect(grid).toEqual([
      ["с", "к", "и", "р", "о"],
      ["т", "а", "з", "б", "в"],
      ["а", "м", "а", "г", "а"],
      ["т", "е", "д", "ь", "т"],
      ["у", "п", "о", "д", "о"],
    ]);
  });

  it("should ocr test-image-2", async () => {
    const imagePath = new URL("./test-grid-2.png", import.meta.url);
    const image = fs.readFileSync(imagePath);
    const filtered = await sharp(image).threshold(115).blur(1.5).normalise().toBuffer();
    const grid = await gridOCR(filtered);
    console.log(grid);
    expect(grid).toEqual([
      ["п", "г", "р", "е", "т"],
      ["р", "о", "с", "а", "е"],
      ["ь", "т", "т", "п", "н"],
      ["и", "о", "л", "о", "ч"],
      ["к", "и", "с", "л", "д"],
    ]);
  });
});
