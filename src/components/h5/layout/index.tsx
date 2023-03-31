import React, { FC, useEffect } from 'react';

const H5Layout: FC<{ children: React.ReactNode }> = (props) => {

  const setRem = () => {
    if (document.documentElement.clientWidth > 430) {
      document.getElementsByTagName('html')[0].style.fontSize = '100px';
      document.getElementsByTagName('html')[0].style.margin = '0 auto';
    } else {
      const fs = (document.documentElement.clientWidth / 375) * 100;
      document.getElementsByTagName('html')[0].style.fontSize = `${fs}px`;
    }
  };

  /**
   * 暴露神策等相关属性在 window
   * 初始化神策
   */
  useEffect(() => {
    setRem();
    window.addEventListener('DOMContentLoaded', setRem, false);
    window.addEventListener('orientationchange', setRem, false);
    window.addEventListener('resize', setRem, false);
  }, []);

  return <div className="page-container">{props.children}</div>;
};

export default H5Layout;
