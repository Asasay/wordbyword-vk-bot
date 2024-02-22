import Tesseract, { ImageLike, createScheduler, createWorker } from "tesseract.js";
import { chunks } from "../utils/utils.js";

export default async function gridOCR(img: ImageLike) {
  const scheduler = createScheduler();

  const worker1 = await createWorker(
    "rus",
    Tesseract.OEM.TESSERACT_ONLY,
    {},
    { load_system_dawg: "false", load_freq_dawg: "false" }
  );
  const worker2 = await createWorker(
    "rus",
    Tesseract.OEM.TESSERACT_ONLY,
    {},
    { load_system_dawg: "false", load_freq_dawg: "false" }
  );

  worker1.setParameters({
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR,
    tessedit_char_whitelist: "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ",
  });
  worker2.setParameters({
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR,
    tessedit_char_whitelist: "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ",
  });

  const rectangles = [
    {
      left: 28,
      top: 25,
      width: 42,
      height: 38,
    },
    {
      left: 94,
      top: 25,
      width: 42,
      height: 38,
    },
    {
      left: 162,
      top: 25,
      width: 42,
      height: 38,
    },
    {
      left: 228,
      top: 25,
      width: 42,
      height: 38,
    },
    {
      left: 296,
      top: 25,
      width: 42,
      height: 38,
    },

    {
      left: 28,
      top: 88,
      width: 42,
      height: 38,
    },
    {
      left: 94,
      top: 88,
      width: 42,
      height: 38,
    },
    {
      left: 162,
      top: 88,
      width: 42,
      height: 38,
    },
    {
      left: 228,
      top: 88,
      width: 42,
      height: 38,
    },
    {
      left: 296,
      top: 88,
      width: 42,
      height: 38,
    },

    {
      left: 28,
      top: 158,
      width: 42,
      height: 38,
    },
    {
      left: 94,
      top: 158,
      width: 42,
      height: 38,
    },
    {
      left: 162,
      top: 158,
      width: 42,
      height: 38,
    },
    {
      left: 228,
      top: 158,
      width: 42,
      height: 38,
    },
    {
      left: 296,
      top: 158,
      width: 42,
      height: 38,
    },

    {
      left: 28,
      top: 220,
      width: 42,
      height: 42,
    },
    {
      left: 94,
      top: 220,
      width: 42,
      height: 42,
    },
    {
      left: 162,
      top: 220,
      width: 42,
      height: 42,
    },
    {
      left: 228,
      top: 220,
      width: 42,
      height: 42,
    },
    {
      left: 296,
      top: 220,
      width: 42,
      height: 42,
    },

    {
      left: 28,
      top: 290,
      width: 42,
      height: 38,
    },
    {
      left: 94,
      top: 290,
      width: 42,
      height: 38,
    },
    {
      left: 162,
      top: 290,
      width: 42,
      height: 38,
    },
    {
      left: 228,
      top: 290,
      width: 42,
      height: 38,
    },
    {
      left: 296,
      top: 290,
      width: 42,
      height: 38,
    },
  ];

  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);
  const results = await Promise.all(
    rectangles.map((rectangle) =>
      scheduler.addJob(
        "recognize",
        img,
        { rectangle }
        // { imageGrey: true }
      )
    )
  );
  scheduler.terminate();

  const resultingGrid = [
    ...chunks(
      results.map((r) => r.data.text[0].toLowerCase()),
      5
    ),
  ];

  // console.log(results.map((r) => r.data.imageGrey));

  return resultingGrid;
}
