/**
 * 类型检测
 * 只做了常规的类型检测，如有遗漏可参考 lodash 的实现进行补充
 *
 * 参考：
 *  - https://262.ecma-international.org/#sec-ecmascript-data-types-and-values
 *  - https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
 *  - https://github.com/lodash/lodash/blob/4.17.15/lodash.js
 */

// const MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
const nativeObjectToString = Object.prototype.toString;
function toObjectString(value: any): string {
  return nativeObjectToString.call(value);
}

/**
 * 原始数据类型 (Undefined, Null, Boolean, Number, BigInt, String, Symbol)
 *
 * 参考：
 *  - https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive
 *  - https://developer.mozilla.org/en-US/docs/Glossary/Primitive
 */

function isPrimitive(value: any): boolean {
  const type = typeof value;
  return value === null || (type !== 'object' && type !== 'function');
}

function isUndefined(value: any): boolean {
  return value === undefined;
  // return typeof value === 'undefined';
}

function isNull(value: any): boolean {
  return value === null;
}

function isBoolean(value: any): boolean {
  return (
    value === true ||
    value === false ||
    (isObjectLike(value) && toObjectString(value) === '[object Boolean]')
  );
}

function isNumber(value: any): boolean {
  return (
    typeof value === 'number' ||
    (isObjectLike(value) && toObjectString(value) === '[object Number]')
  );
}

// function isNaN(value: any): boolean {
//   return isNumber(value) && value !== +value;
// }

function isBigInt(value: any): boolean {
  // eslint-disable-next-line
  return (
    typeof value === 'bigint' ||
    (isObjectLike(value) && toObjectString(value) === '[object BigInt]')
  );
}

function isString(value: any): boolean {
  return (
    typeof value === 'string' ||
    (isObjectLike(value) && toObjectString(value) === '[object String]')
  );
}

function isSymbol(value: any): boolean {
  return (
    typeof value === 'symbol' ||
    (isObjectLike(value) && toObjectString(value) === '[object Symbol]')
  );
}

/**
 * 引用数据类型 (Object, Array, Function, RegExp 等)
 */

function isObject(value: any): boolean {
  const type = typeof value;
  return (type === 'object' || type === 'function') && value !== null;
}

function isObjectLike(value: any): boolean {
  return typeof value === 'object' && value !== null;
}

function isPlainObject(value: any): boolean {
  return toObjectString(value) === '[object Object]';
}

function isArray(value: any): boolean {
  return Array.isArray(value);
}

// function isArrayLike(value: any): boolean {
//   return value != null && isLength(value.length) && !isFunction(value);
// }

// 有长度的数组
function isLengthArray(value: any): boolean {
  return isArray(value) && value.length;
}

// function isLength(value: any): boolean {
//   return typeof value === 'number' && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
// }

function isFunction(value: any): boolean {
  // return typeof value === 'function';
  if (!isObject(value)) {
    return false;
  }
  const tag = toObjectString(value);
  return (
    tag === '[object Function]' ||
    tag === '[object GeneratorFunction]' ||
    tag === '[object AsyncFunction]' ||
    tag === '[object Proxy]'
  );
}

function isThenable(value: any): boolean {
  return isObjectLike(value) && toObjectString(value.then) === '[object Function]';
}

function isRegExp(value: any): boolean {
  return isObjectLike(value) && toObjectString(value) === '[object RegExp]';
}

function isDate(value: any): boolean {
  return isObjectLike(value) && toObjectString(value) === '[object Date]';
}

function isURLObject(value: any): boolean {
  return isObjectLike(value) && toObjectString(value) === '[object URL]';
}

function isElement(value: any): boolean {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}

function isArrayBuffer(value: any): boolean {
  return isObjectLike(value) && toObjectString(value) === '[object ArrayBuffer]';
}

function isBlob(value: any): boolean {
  return isObjectLike(value) && toObjectString(value) === '[object Blob]';
}

function isFormData(value: any): boolean {
  return isObjectLike(value) && toObjectString(value) === '[object FormData]';
}

function isEvent(value: any): boolean {
  return value instanceof Event;
}

// React 合成事件，参考：https://zh-hans.reactjs.org/docs/events.html
function isSyntheticEvent(value: any): boolean {
  return isObjectLike(value) && isEvent(value.nativeEvent);
}

/**
 * 对错误、异常的判断，与 Sentry 保持一致
 */

function isError(value: any): boolean {
  if (!isObjectLike(value)) {
    return false;
  }
  const tag = toObjectString(value);
  return (
    tag === '[object Error]' ||
    tag === '[object Exception]' ||
    tag === '[object DOMException]' ||
    value instanceof Error
  );
}

function isErrorEvent(value: any): boolean {
  return toObjectString(value) === '[object ErrorEvent]';
}

function isDOMError(value: any): boolean {
  return toObjectString(value) === '[object DOMError]';
}

function isDOMException(value: any): boolean {
  return toObjectString(value) === '[object DOMException]';
}

function isMediaError(value: any): boolean {
  return toObjectString(value) === '[object MediaError]';
}

export {
  isNull,
  isUndefined,
  isBoolean,
  isNumber,
  isBigInt,
  isString,
  isSymbol,
  isPrimitive,
  isObject,
  isObjectLike,
  isPlainObject,
  isArray,
  // isArrayLike,
  isLengthArray,
  isFunction,
  isThenable,
  isRegExp,
  isDate,
  isURLObject,
  isElement,
  isArrayBuffer,
  isBlob,
  isFormData,
  isEvent,
  isSyntheticEvent,
  isError,
  isErrorEvent,
  isDOMError,
  isDOMException,
  isMediaError,
};
