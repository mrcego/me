import { onScopeDispose, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

let lockCount = 0;
let scrollY = 0;
let previousBodyStyles: Partial<CSSStyleDeclaration> = {};
let previousHtmlOverflow = '';

function lockBodyScroll() {
  if (import.meta.server) return;

  lockCount += 1;
  if (lockCount > 1) return;

  const { body, documentElement } = document;
  scrollY = window.scrollY;
  const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

  previousHtmlOverflow = documentElement.style.overflow;
  previousBodyStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
  };

  documentElement.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function unlockBodyScroll() {
  if (import.meta.server || lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0) return;

  const { body, documentElement } = document;
  documentElement.style.overflow = previousHtmlOverflow;
  body.style.position = previousBodyStyles.position ?? '';
  body.style.top = previousBodyStyles.top ?? '';
  body.style.left = previousBodyStyles.left ?? '';
  body.style.right = previousBodyStyles.right ?? '';
  body.style.width = previousBodyStyles.width ?? '';
  body.style.overflow = previousBodyStyles.overflow ?? '';
  body.style.paddingRight = previousBodyStyles.paddingRight ?? '';
  window.scrollTo(0, scrollY);

  previousBodyStyles = {};
  previousHtmlOverflow = '';
}

export function useBodyScrollLock(isLocked: MaybeRefOrGetter<boolean>) {
  let active = false;

  const stop = watch(
    () => toValue(isLocked),
    (locked) => {
      if (locked && !active) {
        lockBodyScroll();
        active = true;
      } else if (!locked && active) {
        unlockBodyScroll();
        active = false;
      }
    },
    { immediate: true },
  );

  onScopeDispose(() => {
    stop();
    if (active) {
      unlockBodyScroll();
      active = false;
    }
  });
}
