// touchDragState.js
// Shared mutable state for mobile touch drag-and-drop.
// Native HTML5 drag API doesn't work on mobile, so we simulate it with
// touch events and a shared state module.

export const touchDragState = {
    nodeType: null,   // The type string of the node being dragged
    active: false,    // Whether a touch drag is currently in progress
};
