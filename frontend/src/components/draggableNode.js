// draggableNode.js
// Supports both mouse (HTML5 drag API) and touch (custom touch tracking).

import { memo, useRef, useCallback } from 'react';
import { touchDragState } from './touchDragState';

export const DraggableNode = memo(({ type, label, icon }) => {
  const ghostRef = useRef(null);

  /* ── Mouse / Desktop: HTML5 drag API ────────────────────── */
  const onDragStart = useCallback((event) => {
    if (!event.dataTransfer) return;
    event.stopPropagation();
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  }, [type]);

  /* ── Touch / Mobile: custom ghost-element drag ───────────── */
  const onTouchStart = useCallback((event) => {
    const touch = event.touches[0];
    if (!touch) return;

    touchDragState.nodeType = type;
    touchDragState.active = true;

    // Floating ghost label that follows the finger
    const ghost = document.createElement('div');
    ghost.id = '__touch-drag-ghost__';
    ghost.textContent = label;
    ghost.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      padding: 6px 14px;
      border-radius: 8px;
      background: #018790;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      white-space: nowrap;
      box-shadow: 0 4px 16px rgba(1,135,144,0.4);
      transform: translate(-50%, -50%);
      left: ${touch.clientX}px;
      top: ${touch.clientY}px;
      opacity: 0.92;
    `;
    document.body.appendChild(ghost);
    ghostRef.current = ghost;
  }, [type, label]);

  const onTouchMove = useCallback((event) => {
    if (!touchDragState.active) return;
    const touch = event.touches[0];
    if (!touch) return;
    const ghost = ghostRef.current;
    if (ghost) {
      ghost.style.left = `${touch.clientX}px`;
      ghost.style.top = `${touch.clientY}px`;
    }
  }, []);

  const onTouchEnd = useCallback((event) => {
    const ghost = ghostRef.current;
    if (ghost) {
      ghost.remove();
      ghostRef.current = null;
    }

    if (!touchDragState.active) return;

    const touch = event.changedTouches[0];
    if (!touch) {
      touchDragState.active = false;
      touchDragState.nodeType = null;
      return;
    }

    // Fire a custom event caught by ui.js to create the node
    document.dispatchEvent(new CustomEvent('touch-node-drop', {
      bubbles: true,
      detail: {
        nodeType: touchDragState.nodeType,
        clientX: touch.clientX,
        clientY: touch.clientY,
      },
    }));

    touchDragState.active = false;
    touchDragState.nodeType = null;
  }, []);

  return (
    <div
      className="draggable-node"
      draggable={true}
      onDragStart={onDragStart}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <span className="draggable-node-icon">{icon}</span>
      <span className="draggable-node-label">{label}</span>
    </div>
  );
});

DraggableNode.displayName = 'DraggableNode';