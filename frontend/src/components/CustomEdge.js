import React, { useState, useEffect } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import { useStore } from '../store';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from './ThemeContext';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}) {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const removeEdge = useStore((state) => state.removeEdge);
    const { isDark } = useTheme();

    const [isArmed, setIsArmed] = useState(false);

    // Auto-reset armed state after 2 seconds
    useEffect(() => {
        let timeoutId;
        if (isArmed) {
            timeoutId = setTimeout(() => {
                setIsArmed(false);
            }, 2000);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isArmed]);

    const onEdgeClick = (evt) => {
        evt.stopPropagation();
        if (isArmed) {
            removeEdge(id);
        } else {
            setIsArmed(true);
        }
    };

    const currentColor = isArmed ? 'var(--color-rose)' : (isDark ? '#4A4A4A' : '#018790');

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: currentColor,
                    strokeWidth: isArmed ? 2 : 1.5,
                    transition: 'stroke 0.2s',
                }}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: isArmed ? 'var(--color-rose)' : (isDark ? '#2C2C2C' : '#FFFFFF'),
                        border: `1px solid ${isArmed ? 'var(--color-rose)' : (isDark ? '#4A4A4A' : '#D1D5DB')}`,
                        borderRadius: '50%',
                        width: 18,
                        height: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        pointerEvents: 'all',
                        transition: 'all 0.2s',
                        zIndex: isArmed ? 10 : 1,
                        boxShadow: isArmed
                            ? '0 0 10px rgba(244, 63, 94, 0.4)'
                            : '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    className="nodrag nopan"
                    onClick={onEdgeClick}
                >
                    <CloseIcon
                        style={{
                            fontSize: 12,
                            color: isArmed ? '#FFFFFF' : (isDark ? '#E4E6EB' : '#6B7280')
                        }}
                    />
                </div>
            </EdgeLabelRenderer >
        </>
    );
}
