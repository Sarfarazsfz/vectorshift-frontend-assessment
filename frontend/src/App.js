// App.js
// Root application component with navbar, collapsible sidebar, and canvas.

import { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { PipelineToolbar } from './components/toolbar';
import { PipelineUI } from './components/ui';
import { TemplatesButton } from './components/TemplatesButton';
import { TemplatesPanel } from './components/TemplatesPanel';
import { BottomToolbar } from './components/BottomToolbar';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { useStore } from './store';
import { Toaster } from 'react-hot-toast';
import HomeIcon from '@mui/icons-material/Home';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import IosShareIcon from '@mui/icons-material/IosShare';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './styles/App.css';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const pipelineName = useStore((state) => state.pipelineName);
  const setPipelineName = useStore((state) => state.setPipelineName);

  const [tempName, setTempName] = useState(pipelineName);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const handleTitleSave = () => {
    if (tempName.trim()) {
      setPipelineName(tempName);
    } else {
      setTempName(pipelineName); // revert if empty
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-brand">
            <button className="menu-toggle" onClick={() => setSidebarOpen((prev) => !prev)}>
              {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <div className="navbar-logo">
              <AccountTreeIcon />
            </div>
            <span className="navbar-title">VectorShift</span>
          </div>
          <div className="navbar-breadcrumbs" style={{ marginLeft: '12px' }}>
            <HomeIcon fontSize="small" className="home-icon-teal" />
            <span>Home</span> <span className="slash">/</span>
            {isEditingTitle ? (
              <input
                className="pipeline-name-input"
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <div className="pipeline-name-display" onClick={() => setIsEditingTitle(true)}>
                <span className="pipeline-name-text">{pipelineName}</span>
                <EditIcon className="pipeline-name-edit-icon" fontSize="inherit" />
              </div>
            )}
          </div>
        </div>
        <div className="navbar-actions">
          <ThemeToggle />
          <div className="header-actions">
            <button className="header-action-btn"><IosShareIcon fontSize="small" /> Share</button>
            <div className="header-status"><CheckCircleOutlineIcon fontSize="small" className="saved-icon" /> Saved</div>
          </div>
          <button className="header-icon-btn"><MoreVertIcon fontSize="small" /></button>
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
          <ReactFlowProvider>
            <PipelineUI />
            <TemplatesButton onClick={() => setTemplatesOpen(true)} />
            <TemplatesPanel isOpen={templatesOpen} onClose={() => setTemplatesOpen(false)} />
            <BottomToolbar />
          </ReactFlowProvider>
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
