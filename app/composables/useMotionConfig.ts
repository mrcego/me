/**
 * Composable para configuraciones de Motion reutilizables
 * Configuración óptima para evitar el efecto "latido" durante scroll
 */

import { usePreferredReducedMotion } from '@vueuse/core';

export const useMotionConfig = () => {
  const prefersReducedMotion = usePreferredReducedMotion();
  const motionEnabled = computed(() => prefersReducedMotion.value !== 'reduce');

  const motionInitial = <T>(value: T): T | false => (motionEnabled.value ? value : false);

  const motionInView = <T>(value: T): T | undefined => (motionEnabled.value ? value : undefined);

  const motionAnimate = <T>(value: T): T => value;
  /**
   * Configuración base para animaciones sin latido
   * - amount: 0.1 = solo requiere 10% de visibilidad
   * - margin: -400px = trigger 400px antes del viewport
   * - once: true = anima solo una vez
   */
  const baseViewport = {
    once: true,
    amount: 0.1,
    margin: '0px 0px -400px 0px',
  };

  /**
   * Easing suave y profesional
   */
  const smoothEase = [0.19, 1, 0.22, 1] as const;

  /**
   * Animación de entrada desde la izquierda
   */
  const slideInLeft = (duration = 1.4) => ({
    initial: { opacity: 0, x: -40, scale: 0.9 },
    whileInView: { opacity: 1, x: 0, scale: 1 },
    transition: { duration, ease: smoothEase },
    viewport: baseViewport,
  });

  /**
   * Animación de entrada desde la derecha
   */
  const slideInRight = (duration = 1.4) => ({
    initial: { opacity: 0, x: 40, scale: 0.9 },
    whileInView: { opacity: 1, x: 0, scale: 1 },
    transition: { duration, ease: smoothEase },
    viewport: baseViewport,
  });

  /**
   * Animación de entrada desde abajo
   */
  const slideInUp = (duration = 1.2) => ({
    initial: { opacity: 0, y: 50, scale: 0.92 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    transition: { duration, ease: smoothEase },
    viewport: baseViewport,
  });

  /**
   * Animación de fade in simple
   */
  const fadeIn = (duration = 1.2) => ({
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration, ease: smoothEase },
    viewport: baseViewport,
  });

  /**
   * Animación con delay para stagger
   */
  const staggerItem = (index: number, duration = 1.2, delayMultiplier = 0.15) => ({
    initial: { opacity: 0, y: 50, scale: 0.92 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    transition: {
      duration,
      delay: index * delayMultiplier,
      ease: smoothEase,
    },
    viewport: baseViewport,
  });

  return {
    motionEnabled,
    motionInitial,
    motionInView,
    motionAnimate,
    baseViewport,
    smoothEase,
    slideInLeft,
    slideInRight,
    slideInUp,
    fadeIn,
    staggerItem,
  };
};
