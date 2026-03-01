// BaseNode.js
// Reusable base for all pipeline nodes. Handles layout, header, handles.

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

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
  return (
    <div className="node-card" style={cardStyle}>

      {/* Input Handles */}
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

      {/* Header */}
      <div className="node-header">
        <span className={`node-icon ${iconClassName}`}>
          {icon}
        </span>
        <span className="node-title">{title}</span>
      </div>

      {/* Body */}
      <div className="node-body">{children}</div>

      {/* Output Handles */}
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
    </div>
  );
});

BaseNode.displayName = 'BaseNode';
