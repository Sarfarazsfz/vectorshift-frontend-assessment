import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const getHandleTop = (idx, total) =>
  total === 1 ? '50%' : `${20 + (idx * 60) / (total - 1)}%`;

export const BaseNode = memo(({
  id,
  title = 'Node',
  icon = null,
  iconClassName = '',
  inputs = [],
  outputs = [],
  children,
  cardStyle,
}) => {
  const removeNode = useStore((state) => state.removeNode);
  const edges = useStore((state) => state.edges);

  const [hasEverConnectedInputs, setHasEverConnectedInputs] = useState({});

  useEffect(() => {
    let changed = false;
    const newlyConnected = {};

    inputs.forEach((input) => {
      const handleId = `${id}-${input.id}`;
      const isConnected = edges.some(edge => edge.target === id && edge.targetHandle === handleId);

      if (isConnected && !hasEverConnectedInputs[input.id]) {
        newlyConnected[input.id] = true;
        changed = true;
      }
    });

    if (changed) {
      setHasEverConnectedInputs(prev => ({ ...prev, ...newlyConnected }));
    }
  }, [edges, id, inputs, hasEverConnectedInputs]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  const [description, setDescription] = useState('');
  const [useDefault, setUseDefault] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSettingsOpen &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target)
      ) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSettingsOpen]);

  return (
    <div className={`node-card ${isCollapsed ? 'collapsed' : ''}`} style={cardStyle}>


      {inputs.map((handle, idx) => (
        <Handle
          key={`in-${handle.id}`}
          type="target"
          position={Position.Left}
          id={`${id}-${handle.id}`}
          className="node-handle node-handle-left"
          style={{ top: getHandleTop(idx, inputs.length) }}
        />
      ))}

      <div className="node-header">
        <span className={`node-icon ${iconClassName}`}>
          {icon}
        </span>
        <span className="node-title">{title}</span>

        <div className="node-controls">
          <button
            className="node-control-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed((prev) => !prev);
            }}
            aria-label="Minimize node"
            title="Minimize"
          >
            {isCollapsed ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpIcon fontSize="small" />}
          </button>

          <button
            className="node-control-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsSettingsOpen((prev) => !prev);
            }}
            aria-label="Settings"
            title="Open settings"
          >
            <SettingsIcon fontSize="small" />
          </button>

          <button
            className="node-control-btn close-btn"
            onClick={(e) => {
              e.stopPropagation();
              removeNode(id);
            }}
            aria-label="Delete node"
            title="Delete"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="node-body">
          {children}
          {inputs.filter(input => {
            const isConnected = edges.some(edge => edge.target === id && edge.targetHandle === `${id}-${input.id}`);
            return !isConnected && hasEverConnectedInputs[input.id];
          }).length > 0 && (
              <div className="node-disconnected-warning">
                <span className="node-disconnected-title">
                  You are using nodes which are not connected:
                </span>
                <ul className="node-disconnected-list">
                  {inputs.filter(input => {
                    const isConnected = edges.some(edge => edge.target === id && edge.targetHandle === `${id}-${input.id}`);
                    return !isConnected && hasEverConnectedInputs[input.id];
                  }).map(input => (
                    <li key={input.id}>{input.label || input.id}</li>
                  ))}
                </ul>
                <span className="node-disconnected-desc">
                  Connect All the nodes that aren't connected.
                </span>
              </div>
            )}
        </div>
      )}

      {outputs.map((handle, idx) => (
        <Handle
          key={`out-${handle.id}`}
          type="source"
          position={Position.Right}
          id={`${id}-${handle.id}`}
          className="node-handle node-handle-right"
          style={{ top: getHandleTop(idx, outputs.length) }}
        />
      ))}

      {isSettingsOpen && (
        <div
          ref={settingsRef}
          className="node-settings-panel nodrag"
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking in settings
          onWheel={(e) => e.stopPropagation()}     // Prevent zoom when scrolling in settings
          style={{ width: 180, maxWidth: 180, minWidth: 180, height: 110, overflow: 'hidden', boxSizing: 'border-box' }} // Strict final ultra-compact override
        >
          <div className="settings-header">
            <span className="settings-title">Settings</span>
            <button className="settings-close" onClick={() => setIsSettingsOpen(false)}>
              <CloseIcon fontSize="small" />
            </button>
          </div>
          <div className="settings-body" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
            <div className="node-field">
              <label
                className="node-field-label"
                style={{ fontSize: 10, fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', margin: 0, padding: 0 }}
              >
                DESCRIPTION (OPTIONAL)
              </label>
              <textarea
                className="node-field-textarea"
                placeholder="Enter a description for this node"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={1}
                style={{ height: 26, resize: 'none', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', boxSizing: 'border-box', padding: 4, margin: 0, fontSize: 10 }} // Strict final ultra-compact override
              />
            </div>
            <div className="settings-toggle-row" style={{ marginTop: 2 }}>
              <span className="node-field-label" style={{ fontSize: 10, fontWeight: 'normal' }}>Use Default Value</span>
              <label className="settings-switch">
                <input
                  type="checkbox"
                  checked={useDefault}
                  onChange={(e) => setUseDefault(e.target.checked)}
                />
                <span className="settings-slider round"></span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

BaseNode.displayName = 'BaseNode';
