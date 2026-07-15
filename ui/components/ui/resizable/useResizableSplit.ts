import { useCallback, useRef } from 'react';
import useLocalStorage from 'use-local-storage-state';
import { beginHorizontalDragResize } from './dragResize';

export type UseResizableSplit = {
  ratio: number;
  startResize: (startClientX: number, containerWidth: number) => void;
};

export type ResizableSplitOptions = {
  defaultRatio?: number;
  minRatio?: number;
  maxRatio?: number;
};

export function useResizableSplit(splitId: string, opts: ResizableSplitOptions = {}): UseResizableSplit {
  const defaultRatio = opts.defaultRatio ?? 0.5;
  const minRatio = opts.minRatio ?? 0.2;
  const maxRatio = opts.maxRatio ?? 0.8;

  const [ratio, setRatio] = useLocalStorage<number>(`split:${splitId}`, { defaultValue: defaultRatio });
  const ratioRef = useRef(ratio);
  ratioRef.current = ratio;

  const startResize = useCallback((startClientX: number, containerWidth: number) => {
    if (containerWidth <= 0) { 
      return; 
    }

    beginHorizontalDragResize({
      startClientX,
      startValue: ratioRef.current * containerWidth,
      min: minRatio * containerWidth,
      max: maxRatio * containerWidth,
      onChange: (px) => setRatio(Math.round((px / containerWidth) * 1000) / 1000),
    });
  }, [minRatio, maxRatio, setRatio]);

  return { ratio, startResize };
}
