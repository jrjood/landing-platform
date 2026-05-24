import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps { children: ReactNode; }

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      if (target.hash) {
        const el = document.querySelector(target.hash);
        if (el) {
          e.preventDefault();
          if (lenisRef.current) {
            lenisRef.current.scrollTo(el as HTMLElement, { offset: -80 });
          } else {
            (el as HTMLElement).scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        }
      }
    };

    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchors.forEach((a) => {
      a.addEventListener('click', handleAnchorClick);
    });

    return () => {
      anchors.forEach((a) => {
        a.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  return <>{children}</>;
}
