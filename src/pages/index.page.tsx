import { FC } from "react";
import H5Head from '@src/components/h5/head';
import WebHead from '@src/components/web/head';

const PAGE_TDK = {
  h5: {
    title: 'H5 Page',
    description: 'Halo, this is H5 page',
    keywords: 'H5'
  },
  web: {
    title: 'Web Page',
    description: 'Halo, this is Web Page',
    keywords: 'Web'
  }
};

const Channel: FC<{ isMobile: boolean }> = (props: { isMobile: boolean }) => {

  if (props.isMobile) {
    return (
      <>
        <H5Head
          title={PAGE_TDK.h5.title}
          description={PAGE_TDK.h5.description}
          keywords={PAGE_TDK.h5.keywords}
        />
        <div>Halo, this is H5 page</div>
      </>
    )
  } else {
    return (
      <>
        <WebHead
          title={PAGE_TDK.web.title}
          description={PAGE_TDK.web.description}
          keywords={PAGE_TDK.web.keywords}
        />
        <div>Halo, this is Web Page</div>
      </>
    )
  }
}

export default Channel