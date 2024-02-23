import readlinePromises from "node:readline/promises";
import chalk from "chalk";

export const printMemoryUsage = () => {
  for (const [key, value] of Object.entries(process.memoryUsage())) {
    console.log(`Memory usage by ${key}, ${value / 1000000}MB `);
  }
};

export function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

export async function waitKeyPressed(message: string, options?: waitKeyPressedOptions) {
  const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let signal;
  if (options) {
    if ("timeout" in options && typeof options.timeout === "number")
      signal = AbortSignal.timeout(options.timeout);
    else {
      signal = options.signal;
    }
  }
  await rl.question(chalk.bgRed(message + "\n"), { signal });
  rl.close();
}

type waitKeyPressedOptions =
  | { timeout: number; signal?: never }
  | { signal: AbortSignal; timeout?: never };
