import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  LOGO_LONG_PRESS_MS,
  LOGO_LONG_PRESS_MOVE_TOLERANCE_PX,
  createLogoLongPressController,
} from '../../app/utils/logoLongPress';

describe('createLogoLongPressController', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('exposes the intentional ~1.2s delay', () => {
    expect(LOGO_LONG_PRESS_MS).toBe(1200);
    expect(LOGO_LONG_PRESS_MOVE_TOLERANCE_PX).toBeGreaterThan(0);
  });

  it('fires onLongPress after the delay and suppresses the following click', () => {
    vi.useFakeTimers();
    const onLongPress = vi.fn();
    const controller = createLogoLongPressController({
      isEnabled: () => true,
      onLongPress,
    });

    controller.onPointerDown(pointerEvent({ clientX: 10, clientY: 10 }));
    expect(onLongPress).not.toHaveBeenCalled();

    vi.advanceTimersByTime(LOGO_LONG_PRESS_MS - 1);
    expect(onLongPress).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onLongPress).toHaveBeenCalledTimes(1);

    const click = pointerEvent({ type: 'click' });
    const prevented = controller.onClick(click);
    expect(prevented).toBe(true);
    expect(click.defaultPrevented).toBe(true);
  });

  it('does not fire on short press and allows the click through', () => {
    vi.useFakeTimers();
    const onLongPress = vi.fn();
    const controller = createLogoLongPressController({
      isEnabled: () => true,
      onLongPress,
    });

    controller.onPointerDown(pointerEvent({ clientX: 4, clientY: 4 }));
    vi.advanceTimersByTime(400);
    controller.onPointerUp();

    expect(onLongPress).not.toHaveBeenCalled();
    const click = pointerEvent({ type: 'click' });
    expect(controller.onClick(click)).toBe(false);
    expect(click.defaultPrevented).toBe(false);
  });

  it('cancels when the pointer moves beyond tolerance (scroll intent)', () => {
    vi.useFakeTimers();
    const onLongPress = vi.fn();
    const controller = createLogoLongPressController({
      isEnabled: () => true,
      onLongPress,
    });

    controller.onPointerDown(pointerEvent({ clientX: 0, clientY: 0 }));
    controller.onPointerMove(
      pointerEvent({
        clientX: 0,
        clientY: LOGO_LONG_PRESS_MOVE_TOLERANCE_PX + 1,
      }),
    );
    vi.advanceTimersByTime(LOGO_LONG_PRESS_MS);
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('is a no-op when disabled (desktop fine pointer)', () => {
    vi.useFakeTimers();
    const onLongPress = vi.fn();
    const controller = createLogoLongPressController({
      isEnabled: () => false,
      onLongPress,
    });

    controller.onPointerDown(pointerEvent({ clientX: 1, clientY: 1 }));
    vi.advanceTimersByTime(LOGO_LONG_PRESS_MS);
    expect(onLongPress).not.toHaveBeenCalled();
    expect(controller.onClick(pointerEvent({ type: 'click' }))).toBe(false);
  });

  it('ignores non-primary pointers', () => {
    vi.useFakeTimers();
    const onLongPress = vi.fn();
    const controller = createLogoLongPressController({
      isEnabled: () => true,
      onLongPress,
    });

    controller.onPointerDown(pointerEvent({ button: 2, clientX: 1, clientY: 1 }));
    vi.advanceTimersByTime(LOGO_LONG_PRESS_MS);
    expect(onLongPress).not.toHaveBeenCalled();
  });
});

function pointerEvent(
  partial: Partial<PointerEvent> & { type?: string; clientX?: number; clientY?: number } = {},
): PointerEvent {
  const event = new Event(partial.type ?? 'pointerdown', {
    bubbles: true,
    cancelable: true,
  }) as PointerEvent;
  Object.defineProperties(event, {
    button: { value: partial.button ?? 0 },
    clientX: { value: partial.clientX ?? 0 },
    clientY: { value: partial.clientY ?? 0 },
    pointerId: { value: partial.pointerId ?? 1 },
  });
  return event;
}
