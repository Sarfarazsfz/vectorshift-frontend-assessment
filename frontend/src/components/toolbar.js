// toolbar.js — Sidebar with categorized draggable nodes

import { memo } from 'react';
import { DraggableNode } from './draggableNode';
import { nodeConfig } from '../nodes';

export const PipelineToolbar = memo(() => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">Components</div>
      {nodeConfig.map((group) => (
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
    </div>
  );
});

PipelineToolbar.displayName = 'PipelineToolbar';
