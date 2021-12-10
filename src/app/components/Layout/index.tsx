import classnames from 'classnames';
import { useEffect } from 'react';

import Nav from '../Nav';
import { useThemeContext } from '../../theme';

import Header from '../Header';
import { getCountry } from 'app/service';

interface IProps {
  className?: string;
  children: React.ReactNode;
}

const Component = (props: IProps): React.ReactElement => {
  const { className } = props;
  const { currentThemeName } = useThemeContext();

  useEffect(() => {
    const fetch = async (): Promise<void> => {
      const res = await getCountry();
      if (res.data.country_name === 'China') {
        console.log('墙内');
      }
    };
    fetch();
  }, []);

  return (
    <div className={classnames('lt-main', currentThemeName, className)}>
      <Nav />
      <div className="lt-content">
        <Header />
        <div className="content">{props.children}</div>
      </div>
    </div>
  );
};

export default Component;
