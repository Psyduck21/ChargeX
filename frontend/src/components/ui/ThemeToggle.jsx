import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from './Button';

const ThemeToggle = ({ size = 'sm', variant = 'ghost', className }) => {
  const { theme, themeType, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (themeType) {
      case 'dark':
        return <Moon className="w-4 h-4 text-text-primary group-hover:text-primary transition-colors" />;
      case 'system':
        return <Monitor className="w-4 h-4 text-text-primary group-hover:text-primary transition-colors" />;
      default:
        return <Sun className="w-4 h-4 text-text-primary group-hover:text-primary transition-colors" />;
    }
  };

  const getTooltipText = () => {
    switch (themeType) {
      case 'light':
        return 'Switch to dark theme';
      case 'dark':
        return 'Switch to system theme';
      case 'system':
        return 'Switch to light theme';
      default:
        return 'Toggle theme';
    }
  };

  return (
    <div className="relative group" title={getTooltipText()}>
      <Button
        variant={variant}
        size={size}
        onClick={toggleTheme}
        className={`hover:bg-hover transition-all duration-200 ${className}`}
        icon={getIcon()}
        aria-label="Toggle theme"
      />
    </div>
  );
};

export default ThemeToggle;
