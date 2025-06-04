import { setTimeout } from 'node:timers/promises';

export async function cbWithTimeout(cb: () => void, timeout: number = 0): Promise<void> {
  return Promise.race([
    Promise.resolve().then(cb),
    setTimeout(timeout).then(() => {
      throw new Error('Timeout exceeded');
    }),
  ]);
}

export async function cbWithAttempts(cb: () => void, attemptsCount: number = 1, withTimeout: boolean = false, delay: number = 0) {
  let attempt = 0;

  while (attempt < attemptsCount) {
    try {
      return withTimeout ? await cbWithTimeout(cb, delay) : cb();
    } catch (e) {
      attempt++;
    }
  }

  throw new Error(`Unable to complete callback after ${attemptsCount} attempts`);
}
