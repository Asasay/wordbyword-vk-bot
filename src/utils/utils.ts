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

export async function waitKeyPressed(message: string, timeout?: number) {
  const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const signal = timeout ? AbortSignal.timeout(timeout) : undefined;
  await rl.question(chalk.bgRed(message + "\n"), { signal });
  rl.close();
}
