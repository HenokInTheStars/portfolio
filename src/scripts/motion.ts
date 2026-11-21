export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
export const prefersReducedMotion = () => reduceMotion.matches;
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const EASE = 'cubic-bezier(.2, .8, .2, 1)';
export const canViewTransition = () =>
  typeof document.startViewTransition === 'function' && !prefersReducedMotion();
