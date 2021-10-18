// import { Middleware } from 'redux'
import storage from '../utils/storage';
// import { message } from 'antd'

export const logger /* : Middleware */ =
  (store: any, history: any) => (next: any) => (action: any) => {
    if (process.env.NODE_ENV === 'production' && action?.payload?.response?.status === 401) {
      if (action.error) {
        console.log(action);
      }
    }
    return next(action);
  };
