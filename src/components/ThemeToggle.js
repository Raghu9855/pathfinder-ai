import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { BsSun, BsMoonStars } from 'react-icons/bs';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="theme-toggle-button">
      {theme === 'light' ? <BsMoonStars /> : <BsSun />}
    </button>
  );
};

export default ThemeToggle;