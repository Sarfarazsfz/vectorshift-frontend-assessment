import { memo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { DraggableNode } from './draggableNode';
import { nodeConfig } from '../nodes';
import { useStore } from '../store';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

export const PipelineToolbar = memo(() => {
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [showAbout, setShowAbout] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [toggles, setToggles] = useState({
    sidebar: true,
    toolbar: true,
    addons: false,
    horizontalAddons: true,
  });

  const settingsRef = useRef(null);
  const searchInputRef = useRef(null);
  const nodes = useStore((state) => state.nodes);

  const toggleSidebar = () => document.querySelector('.menu-toggle')?.click();
  const toggleToolbar = () => {
    const tb = document.querySelector('.bottom-toolbar');
    if (tb) tb.style.display = tb.style.display === 'none' ? 'flex' : 'none';
  };
  const toggleAddons = () => {
    const panel = document.querySelector('.templates-panel');
    if (panel && panel.className.includes('open')) {
      document.querySelector('.templates-close')?.click();
    } else {
      document.querySelector('.templates-btn')?.click();
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle sidebar: Alt + S
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        toggleSidebar();
        setToggles(p => ({ ...p, sidebar: !p.sidebar }));
      }
      // Toggle toolbar: Alt + T
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleToolbar();
        setToggles(p => ({ ...p, toolbar: !p.toolbar }));
      }
      // Toggle addons: Alt + A
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        toggleAddons();
        setToggles(p => ({ ...p, addons: !p.addons }));
      }
      // Change addons orientation: Alt + D
      if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setToggles(p => ({ ...p, horizontalAddons: !p.horizontalAddons }));
      }
      // Go full screen: Alt + F
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => { });
        } else {
          document.exitFullscreen().catch(() => { });
        }
      }
      // Search focus: Ctrl + K or Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Node selection shortcuts (DOM simulated for global coverage)
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault(); // Previous component
      }
      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault(); // Next component
      }
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault(); // Previous story
        const pane = document.querySelector('.react-flow__pane');
        if (pane) pane.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault(); // Next story
        const pane = document.querySelector('.react-flow__pane');
        if (pane) pane.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        e.preventDefault(); // Collapse all
        document.querySelectorAll('.node-control-btn[aria-label="Minimize node"]').forEach(btn => {
          const card = btn.closest('.node-card');
          if (card && !card.classList.contains('collapsed')) {
            btn.click();
          }
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSettingsOpen &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target) &&
        !event.target.closest('.sidebar-settings-btn')
      ) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSettingsOpen]);

  // Derive recently used from canvas nodes
  // For each node in `nodes`, find its config to show icon/label
  // Unique by type
  const activeNodeTypes = Array.from(new Set(nodes.map(n => n.type)));

  const allAvailableNodes = nodeConfig.flatMap(g => g.nodes);
  const recentlyUsedNodes = activeNodeTypes
    .map(type => allAvailableNodes.find(n => n.type === type))
    .filter(Boolean);

  const totalNodes = allAvailableNodes.length;

  const filteredGroups = nodeConfig.map(group => ({
    ...group,
    nodes: group.nodes.filter(node =>
      node.label.toLowerCase().includes(search.toLowerCase()) ||
      node.type.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(group => group.nodes.length > 0);

  return (
    <div className="sidebar">
      <div className="sidebar-header-row">
        <div className="sidebar-header">NODE PALETTE ({totalNodes})</div>
        <div style={{ position: 'relative' }} ref={settingsRef}>
          <button
            className="sidebar-settings-btn"
            onClick={() => {
              if (!isSettingsOpen && settingsRef.current) {
                const rect = settingsRef.current.getBoundingClientRect();
                setDropdownPosition({
                  top: rect.bottom + 4,
                  left: rect.left,
                });
              }
              setIsSettingsOpen(!isSettingsOpen);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-secondary)' }}
          >
            <SettingsIcon className="sidebar-settings-icon" />
          </button>

          {isSettingsOpen && createPortal(
            <div
              className="sidebar-dropdown-menu"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                position: 'fixed',
                marginTop: 0
              }}
            >
              {/* Section 1 */}
              <div className="sidebar-dropdown-section">
                <button className="sidebar-dropdown-item" onClick={() => { setShowAbout(true); setIsSettingsOpen(false); }}>
                  <span>About VectorShift Pipeline Builder</span>
                </button>
                <a href="https://docs.vectorshift.ai/" target="_blank" rel="noreferrer" className="sidebar-dropdown-item" onClick={() => setIsSettingsOpen(false)}>
                  <span>Documentation</span>
                </a>
                <button className="sidebar-dropdown-item" onClick={() => { setShowShortcuts(true); setIsSettingsOpen(false); }}>
                  <span>Keyboard shortcuts</span>
                </button>
              </div>

              <div className="sidebar-dropdown-divider" />

              {/* Section 2 */}
              <div className="sidebar-dropdown-section">
                <button className="sidebar-dropdown-item" onClick={() => { toggleSidebar(); setToggles(p => ({ ...p, sidebar: !p.sidebar })); }}>
                  <div className="sidebar-dropdown-item-left">
                    <span style={{ width: 14, display: 'inline-block' }}>{toggles.sidebar && <CheckIcon style={{ fontSize: 14 }} />}</span>
                    <span>Show sidebar</span>
                  </div>
                  <span className="sidebar-dropdown-shortcut">Alt + S</span>
                </button>
                <button className="sidebar-dropdown-item" onClick={() => { toggleToolbar(); setToggles(p => ({ ...p, toolbar: !p.toolbar })); }}>
                  <div className="sidebar-dropdown-item-left">
                    <span style={{ width: 14, display: 'inline-block' }}>{toggles.toolbar && <CheckIcon style={{ fontSize: 14 }} />}</span>
                    <span>Show toolbar</span>
                  </div>
                  <span className="sidebar-dropdown-shortcut">Alt + T</span>
                </button>
                <button className="sidebar-dropdown-item" onClick={() => { toggleAddons(); setToggles(p => ({ ...p, addons: !p.addons })); }}>
                  <div className="sidebar-dropdown-item-left">
                    <span style={{ width: 14, display: 'inline-block' }}>{toggles.addons && <CheckIcon style={{ fontSize: 14 }} />}</span>
                    <span>Show addons panel</span>
                  </div>
                  <span className="sidebar-dropdown-shortcut">Alt + A</span>
                </button>
              </div>

              <div className="sidebar-dropdown-divider" />

              {/* Section 3 */}
              <div className="sidebar-dropdown-section">
                <button className="sidebar-dropdown-item" onClick={() => setToggles(p => ({ ...p, horizontalAddons: !p.horizontalAddons }))}>
                  <span>Change addons orientation</span>
                  <span className="sidebar-dropdown-shortcut">Alt + D</span>
                </button>
                <button className="sidebar-dropdown-item" onClick={() => {
                  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => { });
                  else document.exitFullscreen().catch(() => { });
                }}>
                  <span>Go full screen</span>
                  <span className="sidebar-dropdown-shortcut">Alt + F</span>
                </button>
                <button className="sidebar-dropdown-item" onClick={() => { searchInputRef.current?.focus(); setIsSettingsOpen(false); }}>
                  <span>Search</span>
                  <span className="sidebar-dropdown-shortcut">Ctrl + K</span>
                </button>
              </div>

              <div className="sidebar-dropdown-divider" />

              {/* Section 4 */}
              <div className="sidebar-dropdown-section">
                <button className="sidebar-dropdown-item">
                  <span>Previous component</span>
                  <span className="sidebar-dropdown-shortcut">Alt + ↑</span>
                </button>
                <button className="sidebar-dropdown-item">
                  <span>Next component</span>
                  <span className="sidebar-dropdown-shortcut">Alt + ↓</span>
                </button>
                <button className="sidebar-dropdown-item" onClick={() => {
                  const pane = document.querySelector('.react-flow__pane');
                  if (pane) pane.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                }}>
                  <span>Previous story</span>
                  <span className="sidebar-dropdown-shortcut">Alt + ←</span>
                </button>
                <button className="sidebar-dropdown-item" onClick={() => {
                  const pane = document.querySelector('.react-flow__pane');
                  if (pane) pane.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                }}>
                  <span>Next story</span>
                  <span className="sidebar-dropdown-shortcut">Alt + →</span>
                </button>
                <button className="sidebar-dropdown-item" onClick={() => {
                  document.querySelectorAll('.node-control-btn[aria-label="Minimize node"]').forEach(btn => {
                    const card = btn.closest('.node-card');
                    if (card && !card.classList.contains('collapsed')) btn.click();
                  });
                }}>
                  <span>Collapse all</span>
                  <span className="sidebar-dropdown-shortcut">Ctrl + Shift + ↑</span>
                </button>
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>

      <div className="sidebar-search-container">
        <div className={`sidebar-search-box ${isFocused ? 'focused' : ''}`}>
          <SearchIcon className="sidebar-search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="sidebar-search-input"
            placeholder="Search nodes"
            value={search}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <ClearIcon className="sidebar-search-clear" onMouseDown={(e) => { e.preventDefault(); setSearch(''); }} />}
        </div>
      </div>

      <div className="sidebar-scrollable">
        {isFocused && recentlyUsedNodes.length > 0 && (
          <div className="sidebar-group">
            <div className="sidebar-group-title">RECENTLY USED</div>
            <div className="sidebar-nodes">
              {recentlyUsedNodes.map((node) => (
                <DraggableNode
                  key={`recent-${node.type}`}
                  type={node.type}
                  label={node.label}
                  icon={node.icon}
                />
              ))}
            </div>
          </div>
        )}

        {filteredGroups.map((group) => (
          <div key={group.category} className="sidebar-group">
            <div className="sidebar-group-title">{group.category}</div>
            <div className="sidebar-nodes">
              {group.nodes.map((node) => (
                <DraggableNode
                  key={node.type}
                  type={node.type}
                  label={node.label}
                  icon={node.icon}
                />
              ))}
            </div>
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <div className="sidebar-no-results">No nodes found</div>
        )}
      </div>

      {/* Info Popups */}
      {showAbout && (
        <>
          <div className="sidebar-info-popup-overlay" onClick={() => setShowAbout(false)} />
          <div className="sidebar-info-popup">
            <h3 style={{ fontSize: 14, margin: 0, color: 'var(--text-primary)' }}>VectorShift Pipeline Builder</h3>
            <p style={{ fontSize: 12, margin: 0, color: 'var(--text-secondary)' }}>Version 1.0</p>
            <p style={{ fontSize: 12, margin: 0, color: 'var(--text-secondary)' }}>Frontend React Pipeline Editor</p>
            <button onClick={() => setShowAbout(false)} style={{ marginTop: 8, padding: '6px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Close</button>
          </div>
        </>
      )}

      {showShortcuts && (
        <>
          <div className="sidebar-info-popup-overlay" onClick={() => setShowShortcuts(false)} />
          <div className="sidebar-info-popup" style={{ width: 320, alignItems: 'stretch', textAlign: 'left' }}>
            <h3 style={{ fontSize: 14, margin: '0 0 8px 0', color: 'var(--text-primary)', textAlign: 'center' }}>Keyboard Shortcuts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
              {[
                { label: 'Show sidebar', key: 'Alt + S' },
                { label: 'Show toolbar', key: 'Alt + T' },
                { label: 'Show addons panel', key: 'Alt + A' },
                { label: 'Change addons orientation', key: 'Alt + D' },
                { label: 'Go full screen', key: 'Alt + F' },
                { label: 'Search', key: 'Ctrl + K' },
                { label: 'Previous component', key: 'Alt + ↑' },
                { label: 'Next component', key: 'Alt + ↓' },
                { label: 'Previous story', key: 'Alt + ←' },
                { label: 'Next story', key: 'Alt + →' },
                { label: 'Collapse all', key: 'Ctrl + Shift + ↑' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)' }}>
                  <span>{s.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{s.key}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowShortcuts(false)} style={{ marginTop: 12, padding: '6px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, alignSelf: 'center' }}>Close</button>
          </div>
        </>
      )}
    </div>
  );
});

PipelineToolbar.displayName = 'PipelineToolbar';
