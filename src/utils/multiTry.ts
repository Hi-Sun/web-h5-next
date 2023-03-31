const doNextTry = (
  doTry: () => Promise<unknown>,
  resolve: (value: unknown) => void,
  reject: (reason?: any) => void,
  maxTimes: number,
  currentTimes: number,
  minInterval: number,
) => {
  doTry()
    .then(
      (value: unknown) => resolve(value),
      (reason?: any) => {
        if (currentTimes < maxTimes) {
          setTimeout(() => {
            doNextTry(doTry, resolve, reject, maxTimes, currentTimes + 1, minInterval);
          }, minInterval * (currentTimes * 2 - 1));
        } else {
          reject(reason);
        }
      },
    )
    .catch(() => {
      // do nothing.
    });
};

/**
 * 多次尝试
 * @param {function} doTry - 尝试过程，返回一个 promise
 * @param {number} maxTimes - 最多尝试次数，默认 10
 * @param {number} minInterval - 最小间隔时间，单位 ms，默认 500
 * @returns {promise} 多次尝试的结果
 */
const multiTry = (
  doTry: () => Promise<unknown>,
  maxTimes = 10,
  minInterval = 500,
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    doNextTry(doTry, resolve, reject, maxTimes, 1, minInterval);
  });
};

export default multiTry;
