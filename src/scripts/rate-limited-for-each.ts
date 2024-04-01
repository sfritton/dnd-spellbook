const getIntervalLength = () => Math.random() * 3000 + 2000;

const setRandomIntervalInner = (
  callback: (remainingIterations: number) => any,
  iterations: number,
  resolvePromise: (value: void) => void,
) => {
  callback(iterations);
  const remainingIterations = iterations - 1;

  if (remainingIterations === 0) {
    resolvePromise();
    return;
  }

  setTimeout(() => {
    setRandomIntervalInner(callback, remainingIterations, resolvePromise);
  }, getIntervalLength());
};

const setRandomInterval = (callback: (remainingIterations: number) => any, iterations: number) =>
  new Promise<void>((resolve) => {
    setRandomIntervalInner(callback, iterations, resolve);
  });

// TODO: need to be able to await async callback before starting next iteration
/**
 * Executes a callback on each element of an array, with a random 2-5s gap between each execution.
 * Intended for responsibly scraping websites without overwhelming them with bot traffic.
 */
export const rateLimitedForEach = <T>(array: T[], callback: (instance: T, index: number) => void) =>
  setRandomInterval((i) => callback(array[array.length - i], array.length - i), array.length);
