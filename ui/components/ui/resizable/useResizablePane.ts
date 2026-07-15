import { useCallback, useRef } from 'react';
import useLocalStorage from 'use-local-storage-state';
import { beginHorizontalDragResize } from './dragResize';

export type UseResizablePane = {
  size: number;
  startResize: (startClientX: number) => void;
};

export type ResizablePaneOptions = {
  defaultSize: number;
  minSize: number;
  maxSize: number;
  side?: 'left' | 'right';
};

export function useResizablePane(paneId: string, opts: ResizablePaneOptions): UseResizablePane {
  const [size, setSize] = useLocalStorage<number>(`pane:${paneId}:size`, { defaultValue: opts.defaultSize });

  const sizeRef = useRef(size);
  sizeRef.current = size;

  const { minSize, maxSize } = opts;
  const sign = opts.side === 'right' ? -1 : 1;

  const startResize = useCallback((startClientX: number) => {
    beginHorizontalDragResize({
      startClientX,
      startValue: sizeRef.current,
      min: minSize,
      max: maxSize,
      sign,
      onChange: setSize,
    });
  }, [minSize, maxSize, sign, setSize]);

  return { size, startResize };
}
