// 格式化倒计时时间：天、时、分、秒
export const dealTimeFormat = (endTime: number) => {
  const curTime = new Date().getTime();
  const time = endTime - curTime;
  if (time <= 0) {
    return {
      doing: false,
    };
  }
  const day = Math.floor(time / 1000 / 60 / 60 / 24);
  const hour = Math.floor((time / 1000 / 60 / 60) % 24);
  const minute = Math.floor((time / 1000 / 60) % 60);
  const second = Math.floor((time / 1000) % 60);

  return {
    doing: true,
    day: day > 9 ? day : `0${day}`,
    hour: hour > 9 ? hour : `0${hour}`,
    minute: minute > 9 ? minute : `0${minute}`,
    second: second > 9 ? second : `0${second}`,
  };
};

/**
 * 在个位数前补 0
 * @param {number | string} num - 数值
 * @returns {string} - 补 0 后的字符串
 */
const preZero = (num: number | string): string => {
  return (num < 10 ? '0' : '') + num;
};

// 将时间戳转为年-月-日
export const transferTime = (time: number, Hyphen = '-') => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (year && month && day) {
    return year + Hyphen + preZero(month) + Hyphen + preZero(day);
  } else {
    return '-';
  }
};
