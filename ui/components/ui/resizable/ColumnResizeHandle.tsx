import React from 'react';
import s from './ColumnResizeHandle.module.css';

export const ColumnResizeHandle: React.FC<{
  onResizeStart: (startClientX: number) => void,
}> = ({ onResizeStart }) => (
  <div
    className={s.ColumnResizeHandle}
    title="Drag to resize column"
    onClick={(e) => e.stopPropagation()}
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onResizeStart(e.clientX);
    }}
  />
);

export default ColumnResizeHandle;
