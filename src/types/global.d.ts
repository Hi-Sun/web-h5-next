declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.less';

declare module 'qrcode.react';
declare module 'md5';

declare interface Window {
  initGeetest: any;
  sensorsServerUrl: string;
  sensorsDebug: boolean;
}

// 后端返回数据  根据当前项目自定义
declare interface IResponseData<T> {
  code: number;
  msg: string;
  data: T;
  st?: number;
  logid?: string;
}
