import enUS from './en_US.json';
import zhCN from './zh_CN.json';

interface IResource {
  [key: string]: {
    translation: {
      [key: string]: string;
    };
  };
}

const resources: IResource = {
  en_US: {
    translation: enUS,
  },
  zh_CN: {
    translation: zhCN,
  },
};

export default resources;
