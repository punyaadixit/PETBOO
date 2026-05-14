import { useTheme } from '../context/ThemeContext';
import { PawPrint, Sun, Moon } from 'lucide-react';
import './DarkModeToggle.css';

export default function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      className={`theme-toggle ${isDarkMode ? 'theme-toggle--dark' : ''}`} 
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="theme-toggle__track">
        <div className="theme-toggle__paw">
          <PawPrint size={20} fill={isDarkMode ? 'currentColor' : 'none'} />
        </div>
        <div className="theme-toggle__icons">
          <Sun size={12} className="theme-toggle__icon theme-toggle__icon--sun" />
          <Moon size={12} className="theme-toggle__icon theme-toggle__icon--moon" />
        </div>
      </div>
    </button>
  );
}
