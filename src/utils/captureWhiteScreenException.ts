// 监控 React 渲染异常 (白屏)
// http://172.28.84.202:8888/%E6%9F%A5%E5%85%AC%E5%8F%B8264514c008f730a6.png
// Application error: a client-side exception has occurred (see the browser console for more information).

import * as Sentry from '@sentry/nextjs';
import logger from './logger';
import multiTry from './multiTry';
import reportSentry from './reportSentry';

const ERROR_KEYWORDS = 'Application error: a client-side exception has occurred';
let hasCaptured = false;

const doCapture = (): Promise<string | null | undefined> => {
  return new Promise((resolve, reject) => {
    if (hasCaptured) {
      resolve('captured');
      return;
    }

    const bodyText = window.document.body.innerText;
    if (bodyText.indexOf(ERROR_KEYWORDS) >= 0) {
      const errMsg = '🔥 React 渲染异常 (白屏)';

      // 上报日志
      logger.error(`${errMsg}, body.innerText: ${bodyText}`);

      // 上报 Sentry
      Sentry.addBreadcrumb({ category: 'body.innerText', message: bodyText });
      reportSentry(`${errMsg}, ${ERROR_KEYWORDS}`, { level: 'fatal' });

      hasCaptured = true;
      resolve('captured');
    } else {
      reject();
    }
  });
};

const multiCapture = (): void => {
  multiTry(doCapture, 2, 100).catch(() => {
    // do nothing.
  });
};

const captureWhiteScreenException = (): void => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', multiCapture, false);
    try {
      // 尝试在 LCP 时捕获异常
      new PerformanceObserver(multiCapture).observe({
        type: 'largest-contentful-paint',
        buffered: true,
      });
    } catch (e) {
      // do nothing.
    }
  }
};

export default captureWhiteScreenException;
