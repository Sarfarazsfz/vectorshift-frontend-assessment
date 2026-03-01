// ui.js
// ReactFlow canvas — handles desktop drag-drop, mobile touch-drop, zoom, pan.

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import { nodeTypes } from '../nodes';
import { useTheme } from './ThemeContext';

import 'reactflow/dist/style.css';

const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { isDark } = useTheme();
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  // ── fitView once after instance is ready ──────────────────
  useEffect(() => {
    if (!reactFlowInstance) return;
    const timer = setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.15, duration: 400 });
    }, 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactFlowInstance]);

  // ── Helper: create a new node at a given screen position ──
  const createNodeAt = useCallback(
    (type, clientX, clientY) => {
      if (!reactFlowInstance || !reactFlowWrapper.current) return;
      const position = reactFlowInstance.screenToFlowPosition
        ? reactFlowInstance.screenToFlowPosition({ x: clientX, y: clientY })
        : (() => {
          const bounds = reactFlowWrapper.current.getBoundingClientRect();
          return reactFlowInstance.project({
            x: clientX - bounds.left,
            y: clientY - bounds.top,
          });
        })();
      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  // ── Desktop: HTML5 drag-and-drop ──────────────────────────
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;
      createNodeAt(type, event.clientX, event.clientY);
    },
    [createNodeAt]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // ── Mobile: custom touch-node-drop event ──────────────────
  useEffect(() => {
    const handleTouchDrop = (event) => {
      const { nodeType, clientX, clientY } = event.detail;
      if (!nodeType) return;

      // Only create if the drop landed on or inside the canvas wrapper
      if (!reactFlowWrapper.current) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      if (
        clientX < bounds.left ||
        clientX > bounds.right ||
        clientY < bounds.top ||
        clientY > bounds.bottom
      ) {
        return; // Dropped outside canvas — ignore
      }

      createNodeAt(nodeType, clientX, clientY);
    };

    document.addEventListener('touch-node-drop', handleTouchDrop);
    return () => document.removeEventListener('touch-node-drop', handleTouchDrop);
  }, [createNodeAt]);

  // ── Edge appearance ────────────────────────────────────────
  const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: {
      stroke: isDark ? '#4A4A4A' : '#018790',
      strokeWidth: 1.5,
    },
  };

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.1}
        maxZoom={3}
        defaultViewport={{ x: 80, y: 80, zoom: 0.85 }}
        // ── Interaction ──────────────────────────
        panOnDrag={true}
        // panOnScroll conflicts with trackpad scrolling on some browsers.
        // Keep false — trackpad pinch-to-zoom is handled by zoomOnPinch.
        panOnScroll={false}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        // ── Connections ──────────────────────────
        connectionLineType="smoothstep"
        connectionRadius={40}
        defaultEdgeOptions={defaultEdgeOptions}
        // ── Performance & Keys ───────────────────
        onlyRenderVisibleElements={false}
        deleteKeyCode="Backspace"
        multiSelectionKeyCode="Shift"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={2}
          color={isDark ? 'rgba(255,255,255,0.18)' : '#D1D5DB'}
        />
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
        <MiniMap
          nodeColor={isDark ? '#5DD3B6' : '#018790'}
          maskColor={isDark ? 'rgba(30,30,30,0.88)' : 'rgba(244,244,244,0.88)'}
          style={{
            background: isDark ? '#202020' : '#FFFFFF',
            border: `1px solid ${isDark ? '#3A3A3A' : '#E5E7EB'}`,
            borderRadius: 10,
          }}
          nodeStrokeWidth={2}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
};
