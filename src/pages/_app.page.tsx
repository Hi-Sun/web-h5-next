import React, { FC } from 'react';
import type { NextPage } from 'next';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';
import H5Layout from '@src/components/h5/layout';
import WebLayout from '@src/components/web/layout';
import '@src/styles/globals.less';
import '@src/styles/reset.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

interface IAppPropsExtend {
  isMobile: boolean;
}

type TApp = AppProps & {
  Component: NextPage;
  isMobile: boolean;
};

const PageLayout: FC<{ isMobile: boolean, children: React.ReactNode }> = (props: { isMobile: boolean, children: React.ReactNode }) => {
  if (props.isMobile) {
    return <H5Layout>{props.children}</H5Layout>
  } else {
    return <WebLayout>{props.children}</WebLayout>
  }
}

const _App = ({ Component, pageProps, isMobile }: TApp) => {

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <PageLayout isMobile={isMobile}>
          <Component isMobile={isMobile} {...pageProps} />
        </PageLayout>
      </Hydrate>
    </QueryClientProvider>
  );
};

_App.getInitialProps = async (
  appContext: AppContext,
): Promise<AppInitialProps & IAppPropsExtend> => {
  const { req } = appContext.ctx;
  const ua = req?.headers['user-agent'];
  const isMobile = ua ? !!ua.match(/Android|iPhone|iPad/) : false;
  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    isMobile,
  };
};

export default _App;
