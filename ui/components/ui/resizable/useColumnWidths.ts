import { useCallback, useRef, MutableRefObject } from 'react';
import useLocalStorage from 'use-local-storage-state';
import { beginHorizontalDragResize } from './dragResize';

export type ColumnConstraint = { minWidth?: number; maxWidth?: number };

export type UseColumnWidths<CK extends string> = {
  getWidth: (columnKey: CK) => number;
  startResize: (columnKey: CK, startClientX: number) => void;
  suppressSortClickRef: MutableRefObject<boolean>;
};

const DEFAULT_MIN_WIDTH = 48;
const DEFAULT_MAX_WIDTH = 1200;

export function useColumnWidths<CK extends string>(
  tableId: string,
  defaultWidths: Record<CK, number>,
  constraints?: Partial<Record<CK, ColumnConstraint>>,
): UseColumnWidths<CK> {
  const [widths, setWidths] = useLocalStorage<Partial<Record<CK, number>>>(
    `table:${tableId}:column-widths`,
    { defaultValue: {} },
  );
  const suppressSortClickRef = useRef(false);
  const widthsRef = useRef(widths);
  widthsRef.current = widths;
  const defaultsRef = useRef(defaultWidths);
  defaultsRef.current = defaultWidths;

  const getWidth = useCallback(
    (columnKey: CK): number => widths[columnKey] ?? defaultWidths[columnKey],
    [widths, defaultWidths],
  );

  const startResize = useCallback((columnKey: CK, startClientX: number) => {
    suppressSortClickRef.current = true;

    const startWidth = widthsRef.current[columnKey] ?? defaultsRef.current[columnKey];
    const c = constraints?.[columnKey];

    beginHorizontalDragResize({
      startClientX,
      startValue: startWidth,
      min: c?.minWidth ?? DEFAULT_MIN_WIDTH,
      max: c?.maxWidth ?? DEFAULT_MAX_WIDTH,
      onChange: (w) => setWidths(prev => ({ ...prev, [columnKey]: w })),
      onEnd: () => setTimeout(() => { suppressSortClickRef.current = false; }, 0),
    });
  }, [constraints, setWidths]);

  return { getWidth, startResize, suppressSortClickRef };
}
