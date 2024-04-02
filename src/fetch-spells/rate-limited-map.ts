const getIntervalLength = () => Math.random() * 5000 + 10000;

/** Executes a callback, but doesn't return the result for 2-5s. */
const executeThenWait = async <ReturnType>(callback: () => Promise<ReturnType>) => {
  const timer = new Promise<void>((resolve) => setTimeout(resolve, getIntervalLength()));

  const result = await callback();

  // Wait for the remainder of the timer before returning
  await timer;

  return result;
};

/**
 * Executes a callback on each element of an array, with a random 2-5s gap between each execution.
 * Intended for responsibly scraping websites without overwhelming them with bot traffic.
 */
export const rateLimitedMap = async <ArrayType, ReturnType>(
  array: ArrayType[],
  callback: (instance: ArrayType, index: number) => Promise<ReturnType>,
) => {
  const result: ReturnType[] = [];
  for (let i = 0; i < array.length; i++) {
    const instanceResult = await executeThenWait(() => callback(array[i], i));
    result.push(instanceResult);
  }

  return result;
};
