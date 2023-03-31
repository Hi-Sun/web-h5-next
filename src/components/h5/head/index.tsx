import React, { FC } from 'react';
import Head from 'next/head';

interface TYCHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const TYCHead: FC<TYCHeadProps> = (props) => {
  const { title, description, keywords } = props;
  const originCdn = ''; // 预连接 cdn 服务器 
  const originServer = ''; // 预连接 http请求 服务器 
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" itemProp="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="preconnect" href={originCdn} crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={originCdn} />
      <link rel="preconnect" href={originServer} />
      <link rel="dns-prefetch" href={originServer} />
      <link
        rel="shortcut icon"
        href="https://cdn.tianyancha.com/wap/images/18blue/weixinlogo.png"
        type="image/x-icon"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
      />
      <meta name="renderer" content="webkit" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    </Head>
  );
};

export default TYCHead;
