/**
 * Smooth inertia scrolling (Lenis) for mouse wheels and trackpads.
 * Touch devices keep native scrolling; reduced-motion users get plain scrolling.
 * In-page anchor links glide to their target; the CSS scroll-margin-top keeps it clear of the sticky header.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { prefersReducedMotion } from './motion';

export const lenis: Lenis | null = prefersReducedMotion()
  ? null
  : new Lenis({
      autoRaf: true,
      lerp: 0.1, // lower = floatier; 0.1 feels smooth without lagging behind the wheel
      wheelMultiplier: 1,
      anchors: true,
      allowNestedScroll: true, // text areas and scrollable tables scroll on their own
    });

/** Glide back to the top of the page. */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0 });
}
