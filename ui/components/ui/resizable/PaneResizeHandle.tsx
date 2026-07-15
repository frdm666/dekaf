import React from 'react';
import s from './PaneResizeHandle.module.css';

export const PaneResizeHandle: React.FC<{
  onResizeStart: (startClientX: number, containerWidth: number) => void,
  mode?: 'inline' | 'edge',
  title?: string,
}> = ({ onResizeStart, mode = 'inline', title = 'Drag to resize' }) => (
  <div
    className={`${s.PaneResizeHandle} ${mode === 'edge' ? s.Edge : ''}`}
    title={title}
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
      const containerWidth = e.currentTarget.parentElement?.getBoundingClientRect().width ?? 0;
      onResizeStart(e.clientX, containerWidth);
    }}
  />
);

export default PaneResizeHandle;
