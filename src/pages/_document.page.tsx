import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { isMobile } from '@src/utils/ua';

export default class MyDocument extends Document {
  render() {
    if (isMobile()) {
      return (
        <Html lang="zh-Hans-CN">
          <Head>
            <meta name="applicable-device" content="pc" />
            <meta httpEquiv="Cache-Control" content="no-siteapp" />
            <meta httpEquiv="Cache-Control" content="no-transform" />
            <link rel="canonical" href="https://www.tianyancha.com" />
            <meta name="mobile-agent" content="format=html5; url=https://m.tianyancha.com" />
            <link
              rel="alternate"
              media="only screen and(max-width:640px)"
              href="https://m.tianyancha.com"
            />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      );
    } else {
      return (
        <Html lang="zh-Hans-CN">
          <Head />
          {/* 注意，这个 Head 不同于 next/head，参考 https://nextjs.org/docs/advanced-features/custom-document#caveats */}
          <body id="important">
            <Main />
            <NextScript />
          </body>
        </Html>
      )
    }
  }
}
