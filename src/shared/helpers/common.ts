export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[], count: number):T[] {
  const start = generateRandomValue(0, items.length - count);
  return items.slice(start, start + count);
}

export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function generateRandomBoolean() {
  return (Math.random() < 0.5);
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : error;
}
