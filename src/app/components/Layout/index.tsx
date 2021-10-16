import classnames from 'classnames';
import * as React from 'react';

import Nav from '../Nav';
import { useThemeContext } from '../../theme';

import Header from '../Header';

interface IProps {
  className?: string;
  children: React.ReactNode;
}

const Component = (props: IProps): React.ReactElement => {
  const { className } = props;
  const { currentThemeName } = useThemeContext();

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
