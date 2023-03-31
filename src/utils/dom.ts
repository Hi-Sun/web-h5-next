const getEle = (id: string | Element) => {
  let ele;
  if (typeof id === 'string') {
    ele = document.getElementById(id);
  } else {
    ele = id;
  }

  return ele;
};

const headerId = 'page-header';
let headerHeight: number;
const getHeaderHeight = () => {
  if (!headerHeight) {
    const headerEle = document?.getElementById('page-header');
    headerHeight = headerEle?.getBoundingClientRect().height || 74; // header高度目前是74px
  }
  return headerHeight;
};

const scrollPageByAnchor = (id: string) => {
  const ele = document?.getElementById(id);
  // const tabEle = document?.getElementById('J_TabWrap');
  const eleTop = Number(ele?.getBoundingClientRect()?.top) || 0;
  // const tabHeight = Number(tabEle?.getBoundingClientRect()?.height) || 0;
  if (eleTop > 0) {
    setTimeout(() => {
      window.scrollTo(0, eleTop);
    }, 1500);
  }
};

const getScrollY = () => {
  return (
    window.scrollY ||
    window.pageYOffset ||
    (document.documentElement.scrollTop === 0
      ? document.body.scrollTop
      : document.documentElement.scrollTop)
  );
};

export { getEle, headerId, getHeaderHeight, getScrollY, scrollPageByAnchor };
