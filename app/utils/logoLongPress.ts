/** Intentional hold duration for mobile logo → Spectral Flight Deck unlock. */
export const LOGO_LONG_PRESS_MS = 1200;

/** Cancel long-press when the pointer drifts (scroll / swipe intent). */
export const LOGO_LONG_PRESS_MOVE_TOLERANCE_PX = 12;

export interface LogoLongPressControllerOptions {
  /** When false (desktop fine pointer), handlers are no-ops. */
  isEnabled: () => boolean;
  onLongPress: () => void;
  delayMs?: number;
  moveTolerancePx?: number;
}

export interface LogoLongPressController {
  onPointerDown: (event: Pick<PointerEvent, 'button' | 'clientX' | 'clientY'>) => void;
  onPointerMove: (event: Pick<PointerEvent, 'clientX' | 'clientY'>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  /** Returns true when the click should be suppressed (long-press already fired). */
  onClick: (event: { preventDefault: () => void; stopPropagation?: () => void }) => boolean;
  dispose: () => void;
}

/**
 * Pointer long-press state machine for the navbar logo.
 * Short taps leave click alone; a held press fires once and suppresses the click.
 */
export function createLogoLongPressController(
  options: LogoLongPressControllerOptions,
): LogoLongPressController {
  const delayMs = options.delayMs ?? LOGO_LONG_PRESS_MS;
  const moveTolerancePx = options.moveTolerancePx ?? LOGO_LONG_PRESS_MOVE_TOLERANCE_PX;

  let timer: ReturnType<typeof setTimeout> | null = null;
  let startX = 0;
  let startY = 0;
  let suppressClick = false;
  let armed = false;

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function cancelPress() {
    clearTimer();
    armed = false;
  }

  function onPointerDown(event: Pick<PointerEvent, 'button' | 'clientX' | 'clientY'>) {
    if (!options.isEnabled()) return;
    if (event.button !== 0) return;

    cancelPress();
    suppressClick = false;
    armed = true;
    startX = event.clientX;
    startY = event.clientY;

    timer = setTimeout(() => {
      timer = null;
      if (!armed) return;
      armed = false;
      suppressClick = true;
      options.onLongPress();
    }, delayMs);
  }

  function onPointerMove(event: Pick<PointerEvent, 'clientX' | 'clientY'>) {
    if (!armed || !timer) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (dx * dx + dy * dy > moveTolerancePx * moveTolerancePx) {
      cancelPress();
    }
  }

  function onPointerUp() {
    cancelPress();
  }

  function onPointerCancel() {
    cancelPress();
  }

  function onClick(event: { preventDefault: () => void; stopPropagation?: () => void }) {
    if (!suppressClick) return false;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation?.();
    return true;
  }

  function dispose() {
    cancelPress();
    suppressClick = false;
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onClick,
    dispose,
  };
}
