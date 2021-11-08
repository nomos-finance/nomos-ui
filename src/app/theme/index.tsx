import React, { ReactNode, useContext, useState, useEffect } from 'react';
interface ThemeContextProps {
  currentThemeName: string;
  changeTheme: (name: string) => void;
  isCurrentThemeDark: boolean;
}

const ThemeContext = React.createContext({} as ThemeContextProps);

interface ThemeProviderProps {
  children: ReactNode;
}

function hasClass(obj: Element, cls: string) {
  return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
function addClass(obj: Element, cls: string) {
  if (!hasClass(obj, cls)) obj.className += ' ' + cls;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const userPrefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [currentThemeName, setCurrentThemeName] = useState(
    localStorage.getItem('theme') || (userPrefersDark ? 'dark' : 'default')
  );

  const changeTheme = (name: string) => {
    localStorage.setItem('theme', name);
    setCurrentThemeName(name);
  };

  const isCurrentThemeDark = currentThemeName === 'dark';

  useEffect(() => {
    addClass(document.getElementsByTagName('html')[0], currentThemeName);
    return () => {};
  }, [currentThemeName]);

  return (
    <ThemeContext.Provider
      value={{
        currentThemeName,
        changeTheme,
        isCurrentThemeDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
