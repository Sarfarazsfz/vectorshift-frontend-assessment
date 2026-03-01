// App.js
// Root application component with navbar, collapsible sidebar, and canvas.

import { useState, useEffect, useCallback } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { ThemeProvider, useTheme } from './ThemeContext';
import { Toaster } from 'react-hot-toast';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import '../styles/App.css';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTheme();
    }
  };

  return (
    <div
      className="theme-toggle"
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Toggle dark mode"
    >
      <span className="theme-toggle-icon">
        {isDark ? <DarkModeIcon /> : <LightModeIcon />}
      </span>
      <div className={`theme-toggle-switch ${isDark ? 'active' : ''}`}>
        <div className="theme-toggle-knob" />
      </div>
    </div>
  );
};

const AppContent = () => {
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <button
            className="menu-toggle"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>
          <div className="navbar-logo">
            <AccountTreeIcon />
          </div>
          <span className="navbar-title">VectorShift</span>
        </div>
        <div className="navbar-actions">
          <ThemeToggle />
          <SubmitButton />
        </div>
      </nav>

      {/* Main: Sidebar + Canvas */}
      <div className="main-content">
        {/* Transform-based sidebar — no layout reflow */}
        <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : 'collapsed'}`}>
          <PipelineToolbar />
        </div>

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar} />
        )}

        {/* Canvas fills the rest */}
        <div className="canvas-area">
          <PipelineUI />
        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: isDark ? '#262626' : '#ffffff',
            color: isDark ? '#E4E6EB' : '#0f172a',
            border: `1px solid ${isDark ? '#3A3A3A' : '#E4E6EB'}`,
            borderRadius: 10,
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            boxShadow: isDark
              ? '0 8px 24px rgba(0,0,0,0.3)'
              : '0 8px 24px rgba(0,0,0,0.08)',
          },
          success: {
            iconTheme: {
              primary: isDark ? '#5DD3B6' : '#10b981',
              secondary: isDark ? '#1A1A1A' : '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: isDark ? '#fb7185' : '#f43f5e',
              secondary: isDark ? '#020617' : '#ffffff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
