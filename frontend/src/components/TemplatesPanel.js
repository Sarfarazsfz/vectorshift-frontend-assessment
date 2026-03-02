import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';

const selector = (state) => ({
    addNode: state.addNode,
    getNodeID: state.getNodeID,
    onEdgesChange: state.onEdgesChange,
    clearCanvas: state.clearCanvas,
});

export const TemplatesPanel = ({ isOpen, onClose }) => {
    const panelRef = useRef(null);
    const { addNode, getNodeID, onEdgesChange, clearCanvas } = useStore(selector, shallow);

    // Close on Outside Click
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e) => {
            // ignore clicks on the toggle button
            if (e.target.closest('.templates-btn')) return;
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleTextVariablesDemo = () => {
        clearCanvas();

        setTimeout(() => {
            // Generate IDs
            const inUserName = getNodeID('customInput');
            const inUserEmail = getNodeID('customInput');
            const inCompanyName = getNodeID('customInput');
            const textNode = getNodeID('text');
            const llmNode = getNodeID('llm');
            const outNode = getNodeID('customOutput');

            // 1. Create Input Nodes
            addNode({
                id: inUserName,
                type: 'customInput',
                position: { x: 100, y: 150 },
                data: { id: inUserName, nodeType: 'customInput', inputName: 'userName', inputType: 'Text' },
            });
            addNode({
                id: inUserEmail,
                type: 'customInput',
                position: { x: 100, y: 300 },
                data: { id: inUserEmail, nodeType: 'customInput', inputName: 'userEmail', inputType: 'Text' },
            });
            addNode({
                id: inCompanyName,
                type: 'customInput',
                position: { x: 100, y: 450 },
                data: { id: inCompanyName, nodeType: 'customInput', inputName: 'companyName', inputType: 'Text' },
            });

            // 2. Create Text Node
            addNode({
                id: textNode,
                type: 'text',
                position: { x: 450, y: 280 },
                data: {
                    id: textNode,
                    nodeType: 'text',
                    text: 'Hello {{name}}, your email is {{email}} and you work at {{company}}',
                },
            });

            // 3. Create LLM Node
            addNode({
                id: llmNode,
                type: 'llm',
                position: { x: 800, y: 280 },
                data: { id: llmNode, nodeType: 'llm' },
            });

            // 4. Create Output Node
            addNode({
                id: outNode,
                type: 'customOutput',
                position: { x: 1150, y: 320 },
                data: { id: outNode, nodeType: 'customOutput', outputName: 'output', outputType: 'Text' },
            });

            // 5. Connect Edges
            const newEdges = [
                { id: `e-${inUserName}-${textNode}-name`, source: inUserName, target: textNode, sourceHandle: `${inUserName}-value`, targetHandle: `${textNode}-name` },
                { id: `e-${inUserEmail}-${textNode}-email`, source: inUserEmail, target: textNode, sourceHandle: `${inUserEmail}-value`, targetHandle: `${textNode}-email` },
                { id: `e-${inCompanyName}-${textNode}-company`, source: inCompanyName, target: textNode, sourceHandle: `${inCompanyName}-value`, targetHandle: `${textNode}-company` },
                { id: `e-${textNode}-${llmNode}-system`, source: textNode, target: llmNode, sourceHandle: `${textNode}-output`, targetHandle: `${llmNode}-system` },
                { id: `e-${textNode}-${llmNode}-prompt`, source: textNode, target: llmNode, sourceHandle: `${textNode}-output`, targetHandle: `${llmNode}-prompt` },
                { id: `e-${llmNode}-${outNode}-output`, source: llmNode, target: outNode, sourceHandle: `${llmNode}-response`, targetHandle: `${outNode}-value` },
            ];

            onEdgesChange(newEdges.map(e => ({ type: 'add', item: e })));
        }, 0);

        onClose();
    };

    const handleClearCanvas = () => {
        clearCanvas();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="quick-start-panel" ref={panelRef}>
            <div className="quick-start-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>QUICK START</span>
                <button
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-secondary)', padding: 0 }}
                >
                    <CloseIcon fontSize="small" />
                </button>
            </div>
            <div className="quick-start-list">
                <button className="quick-start-item" onClick={handleTextVariablesDemo}>
                    <span className="quick-start-icon accent"><AutoAwesomeIcon fontSize="small" /></span>
                    <span className="quick-start-text">Text Variables Demo</span>
                </button>
                <button className="quick-start-item danger" onClick={handleClearCanvas}>
                    <span className="quick-start-icon danger"><DeleteOutlineIcon fontSize="small" /></span>
                    <span className="quick-start-text">Clear Canvas</span>
                </button>
            </div>
        </div>
    );
};
