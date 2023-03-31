import Cookies from 'js-cookie';
import logger from './logger';

export const setUserInfoForLogger = (data: any) => {
  try {
    const { state, vipManager, mobile, isExpired } = data || {};
    Cookies.set('tyc-user-info', JSON.stringify({ state, vipManager, mobile, isExpired }));
  } catch (e) {
    logger.error('set cookie error', data, e);
  }
};
