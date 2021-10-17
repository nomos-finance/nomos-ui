import React, { ReactNode, useContext, useState } from 'react';
interface ThemeContextProps {
  currentThemeName: string;
  changeTheme: (name: string) => void;
  isCurrentThemeDark: boolean;
}

const ThemeContext = React.createContext({} as ThemeContextProps);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentThemeName, setCurrentThemeName] = useState(
    localStorage.getItem('theme') || 'default'
  );

  const changeTheme = (name: string) => {
    localStorage.setItem('theme', name);
    setCurrentThemeName(name);
  };

  const isCurrentThemeDark = currentThemeName === 'dark';

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
