import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BsSun, BsMoonStars } from 'react-icons/bs';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-button"
      aria-label="Toggle theme"
      title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === 'light' ? <BsMoonStars size={18} /> : <BsSun size={20} />}
    </button>
  );
};

export default ThemeToggle;