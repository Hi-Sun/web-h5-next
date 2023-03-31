import * as Sentry from '@sentry/nextjs';
import {
  isError,
  isErrorEvent,
  isDOMError,
  isDOMException,
  isMediaError,
  isArray,
  isObjectLike,
  isPlainObject,
  isString,
} from './typeof';

const MSG_PREFIX = '® ';
const MEDIA_ERROR_NAMES = [
  '',
  'MEDIA_ERR_ABORTED',
  'MEDIA_ERR_NETWORK',
  'MEDIA_ERR_DECODE',
  'MEDIA_ERR_SRC_NOT_SUPPORTED',
];

interface TOptions {
  message?: string;
  data?: {
    [key: string]: any;
  };
  level?: Sentry.Severity | 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' | 'critical';
  group?: string[];
}

/**
 * 上报异常到 Sentry
 * @param {*} e - 异常信息，格式可以是 error、string、json object
 * @param {(object, string)=} options - 附加文案，或以下参数
 * @param {string=} options.message - 附加文案
 * @param {object=} options.data - 附加数据
 * @param {string=} options.level - 异常级别，可选值：'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' | 'critical'
 * @param {array<string>=} options.group - 分组信息
 *
 * @example
 *   reportSentry(e);
 *   reportSentry(e, '附加文案');
 *   reportSentry(e, {
 *     message: '附加文案',
 *     data: { k: 'v' },
 *     level: 'info',
 *     group: ['Label 1', 'Label 2', '...'],
 *   });
 *   reportSentry('附加文案');
 *   reportSentry('上报文案', { level: 'error' });
 *   reportSentry({code: 500, message: '附加文案'});
 */
const reportSentry = (e: any, options?: TOptions | string): void => {
  const {
    message = '',
    data = null,
    level = Sentry.Severity.Warning,
    group = [],
    // eslint-disable-next-line no-nested-ternary
  } = isPlainObject(options)
    ? (options as TOptions)
    : isString(options)
      ? { message: options as string }
      : {};

  try {
    // Add data, message to Breadcrumbs
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/enriching-events/breadcrumbs/
    data &&
      Sentry.addBreadcrumb({
        data,
        level: level as Sentry.Severity,
      });
    message &&
      Sentry.addBreadcrumb({
        message,
        level: level as Sentry.Severity,
      });

    Sentry.withScope((scope) => {
      // Levels: 'fatal', 'error', 'warning', 'log', 'info', 'debug', 'critical'.
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/usage/set-level/
      scope.setLevel(level as Sentry.Severity);

      // Group errors into issues.
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/usage/sdk-fingerprinting/
      scope.setFingerprint([
        ...(isArray(group) && group.length
          ? group
          : [
            (isObjectLike(e) ? String(e.message || e.msg || '') : String(e)) + message ||
                '{{ default }}',
          ]),
        level,
      ]);

      const defaultMessage = message || '未知异常';
      let exception;
      switch (true) {
        case isError(e):
        case isErrorEvent(e) && e.error:
        case isDOMError(e):
        case isDOMException(e):
          exception = e;
          break;

        case isMediaError(e):
          // https://developer.mozilla.org/en-US/docs/Web/API/MediaError
          exception = new Error(
            `MediaError: #${e.code} ${MEDIA_ERROR_NAMES[e.code || 0]}, ${
              e.message || defaultMessage
            }`,
          );
          break;

        case isString(e):
          if (
            [
              Sentry.Severity.Log,
              Sentry.Severity.Info,
              Sentry.Severity.Debug,
              Sentry.Severity.Warning,
            ].includes(level as Sentry.Severity)
          ) {
            Sentry.captureMessage(MSG_PREFIX + (e || defaultMessage), level as Sentry.Severity);
            return;
          }
          exception = new Error(e);
          break;

        case isPlainObject(e):
          Sentry.addBreadcrumb({
            data: e,
            level: level as Sentry.Severity,
          });
          exception = new Error(e.message || e.msg || defaultMessage);
          break;

        default:
          console.warn(e);
          exception = new Error(String(e) || defaultMessage);

        // TODO:
        // Sentry.captureEvent({
        //   message: 'Manual',
        //   stacktrace: [
        //     // ...
        //   ],
        // });
      }

      try {
        exception.name = MSG_PREFIX + exception.name;
      } catch (err) {
        // do nothing
      }

      Sentry.captureException(exception);
      exception = null;
    });
  } catch (err) {
    // do nothing
  }
};

const reportSentryMsg = Sentry.captureMessage;

export default reportSentry;
export { reportSentryMsg };
