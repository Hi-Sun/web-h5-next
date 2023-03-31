import React, { FC } from 'react';

const Layout: FC<{ children: React.ReactNode }> = (props) => {
  return <div id="page-container">{props.children}</div>;
};

export default Layout;
