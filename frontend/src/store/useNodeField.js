// useNodeField.js
// Local node field state with persistence into the global store.
// NOTE: initialValue is only used on mount (useState), not tracked as a dep.
// This prevents re-initialization loops when parent components recompute
// derived values (e.g. id.replace(...)) on every render.

import { useState, useEffect, useRef } from 'react';
import { useStore } from './index';

export const useNodeField = (nodeId, fieldName, initialValue) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  // Capture initialValue only on first mount using a ref
  const initialRef = useRef(initialValue);
  const [value, setValue] = useState(initialRef.current);

  // Sync field value into the global Zustand store on every change
  useEffect(() => {
    updateNodeField(nodeId, fieldName, value);
  }, [nodeId, fieldName, value, updateNodeField]);

  return [value, setValue];
};
