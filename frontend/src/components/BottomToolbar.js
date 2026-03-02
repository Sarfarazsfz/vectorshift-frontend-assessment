import { useReactFlow } from 'reactflow';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import { SubmitButton } from '../submit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import toast from 'react-hot-toast';

export const BottomToolbar = () => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    const clearCanvas = useStore((state) => state.clearCanvas, shallow);

    const handleUndo = () => toast('Undo coming soon', { icon: '⏳' });
    const handleRedo = () => toast('Redo coming soon', { icon: '⏳' });

    return (
        <div className="bottom-toolbar">
            <div className="toolbar-group">
                <button className="toolbar-icon-btn" onClick={() => zoomIn()} title="Zoom In"><AddIcon fontSize="small" /></button>
                <button className="toolbar-icon-btn" onClick={() => zoomOut()} title="Zoom Out"><RemoveIcon fontSize="small" /></button>
                <button className="toolbar-icon-btn" onClick={() => fitView()} title="Fit View"><FitScreenIcon fontSize="small" /></button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <button className="toolbar-icon-btn" onClick={handleUndo} title="Undo"><UndoIcon fontSize="small" /></button>
                <button className="toolbar-icon-btn" onClick={handleRedo} title="Redo"><RedoIcon fontSize="small" /></button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <SubmitButton />
                <button className="toolbar-icon-btn danger" onClick={clearCanvas} title="Clear Canvas"><DeleteOutlineIcon fontSize="small" /></button>
            </div>
        </div>
    );
};
