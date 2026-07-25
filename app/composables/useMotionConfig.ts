/**
 * Shared Motion (motion-v) entrance config.
 *
 * - Mobile / coarse pointer: disabled (instant rest state — no while-in-view work).
 * - Desktop: short transform-only entrances (no opacity fade, small travel).
 * - prefers-reduced-motion: always disabled.
 */

import { computed } from 'vue';
import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core';

type MotionState = Record<string, unknown>;

const smoothEase = [0.22, 1, 0.36, 1] as const;

const withoutFade = <T>(state: T): T => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    return state;
  }

  const next = { ...state } as MotionState;
  if (next.opacity === 0) {
    next.opacity = 1;
  }
  return next as T;
};

/** Clamp travel so desktop entrances feel crisp, not floaty/clunky. */
const softenDesktop = <T>(state: T): T => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    return state;
  }

  const next = { ...withoutFade(state) } as MotionState;

  if (typeof next.x === 'number') {
    next.x = Math.sign(next.x) * Math.min(Math.abs(next.x), 14);
  }
  if (typeof next.y === 'number') {
    next.y = Math.sign(next.y) * Math.min(Math.abs(next.y), 12);
  }
  if (typeof next.scale === 'number' && next.scale < 1) {
    next.scale = Math.max(next.scale, 0.985);
  }
  next.opacity = 1;

  return next as T;
};

export const useMotionConfig = () => {
  const prefersReducedMotion = usePreferredReducedMotion();
  const isMobileBudget = useMediaQuery('(max-width: 1023px), (pointer: coarse)');
  const nuxtApp = tryUseNuxtApp();

  /** Entrance motion only on desktop + when motion is allowed. */
  const motionEnabled = computed(
    () => prefersReducedMotion.value !== 'reduce' && !isMobileBudget.value,
  );

  /**
   * Pre-scroll state. SSR/hydration stay at rest; mobile never animates;
   * desktop uses softened transform offsets (never opacity 0).
   */
  const motionInitial = <T>(hidden: T, visible: T): T => {
    if (!motionEnabled.value) {
      return visible;
    }
    if (import.meta.server || nuxtApp?.isHydrating) {
      return visible;
    }
    return softenDesktop(hidden);
  };

  /** Target while-in-view state — always defined so SSR and client markup match. */
  const motionInView = <T>(visible: T): T => visible;

  const motionAnimate = <T>(value: T): T => value;

  /**
   * Caps long/clunky transitions. Pass delay for stagger; duration is clamped.
   */
  const motionTransition = (
    opts: { duration?: number; delay?: number; ease?: readonly number[] } = {},
  ) => {
    if (!motionEnabled.value) {
      return { duration: 0, delay: 0 };
    }

    return {
      duration: Math.min(opts.duration ?? 0.42, 0.5),
      delay: Math.min(opts.delay ?? 0, 0.12),
      ease: opts.ease ?? smoothEase,
    };
  };

  const baseViewport = {
    once: true,
    amount: 0.15,
    // Trigger closer to the viewport so entrances feel intentional, not late/laggy.
    margin: '0px 0px -10% 0px',
  };

  const slideInLeft = (duration = 0.42) => ({
    initial: softenDesktop({ opacity: 1, x: -14 }),
    whileInView: { opacity: 1, x: 0 },
    transition: motionTransition({ duration }),
    viewport: baseViewport,
  });

  const slideInRight = (duration = 0.42) => ({
    initial: softenDesktop({ opacity: 1, x: 14 }),
    whileInView: { opacity: 1, x: 0 },
    transition: motionTransition({ duration }),
    viewport: baseViewport,
  });

  const slideInUp = (duration = 0.4) => ({
    initial: softenDesktop({ opacity: 1, y: 12 }),
    whileInView: { opacity: 1, y: 0 },
    transition: motionTransition({ duration }),
    viewport: baseViewport,
  });

  const fadeIn = (duration = 0.4) => ({
    initial: softenDesktop({ opacity: 1, scale: 0.985 }),
    whileInView: { opacity: 1, scale: 1 },
    transition: motionTransition({ duration }),
    viewport: baseViewport,
  });

  const staggerItem = (index: number, duration = 0.4, delayMultiplier = 0.06) => ({
    initial: softenDesktop({ opacity: 1, y: 12 }),
    whileInView: { opacity: 1, y: 0 },
    transition: motionTransition({
      duration,
      delay: index * delayMultiplier,
    }),
    viewport: baseViewport,
  });

  return {
    motionEnabled,
    motionInitial,
    motionInView,
    motionAnimate,
    motionTransition,
    baseViewport,
    smoothEase,
    slideInLeft,
    slideInRight,
    slideInUp,
    fadeIn,
    staggerItem,
  };
};
