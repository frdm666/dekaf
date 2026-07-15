export type DragResizeOptions = {
  startClientX: number;
  startValue: number;
  min: number;
  max: number;
  sign?: 1 | -1;
  onChange: (value: number) => void;
  onEnd?: (value: number) => void;
};

export function beginHorizontalDragResize(opts: DragResizeOptions): void {
  const sign = opts.sign ?? 1;
  let raf = 0;
  let latest = opts.startValue;

  const onMove = (e: MouseEvent) => {
    latest = Math.min(opts.max, Math.max(opts.min, Math.round(opts.startValue + sign * (e.clientX - opts.startClientX))));
    if (!raf) {
      raf = requestAnimationFrame(() => {
        raf = 0;
        opts.onChange(latest);
      });
    }
  };

  const onUp = () => {
    if (raf) { cancelAnimationFrame(raf); }
    opts.onChange(latest);
    opts.onEnd?.(latest);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.body.style.removeProperty('cursor');
    document.body.style.removeProperty('user-select');
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
}
