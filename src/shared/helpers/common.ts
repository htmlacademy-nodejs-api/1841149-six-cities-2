export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[], count: number):T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = generateRandomValue(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

export function getRandomItem<T>(items: T[], min: number = 1):T {
  return items[((Math.random() * ((items.length - 1) - min)) + min)];
}

export function generateRandomBoolean() {
  return (Math.random() < 0.5);
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : error;
}
