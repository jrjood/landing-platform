import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  /**
   * Enable the looping snap effect. When true, a clone of the first panel is appended.
   */
  loop?: boolean;
  /**
   * Limit how many wrap-arounds happen before allowing natural scroll (0 = unlimited).
   */
  maxLoops?: number;
  /**
   * CSS selector for panels inside this container.
   */
  panelSelector?: string;
  /**
   * Whether to preserve space behind pins. Use false for layered overlap, true to keep natural flow.
   */
  pinSpacing?: boolean;
};

export function PinnedSnapScroll({
  children,
  loop = false,
  maxLoops = 1,
  panelSelector = '.panel',
  pinSpacing = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      let panels = gsap.utils.toArray<HTMLElement>(
        panelSelector,
        containerRef.current
      );

      if (!panels.length) return;

      let clone: HTMLElement | null = null;
      if (loop && panels.length > 1) {
        clone = panels[0].cloneNode(true) as HTMLElement;
        panels[0].parentNode?.appendChild(clone);
        panels = [...panels, clone];
      }

      const triggers = panels.map((panel) =>
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          pin: true,
          pinSpacing,
        })
      );

      const snapTrigger = ScrollTrigger.create({
        snap: {
          snapTo: panels.length > 1 ? 1 / (panels.length - 1) : 1,
          duration: 0.35,
          ease: 'power2.out',
          // ensure we only snap when inside this container
          directional: true,
        },
      });

      let loopCount = 0;
      let maxScroll = ScrollTrigger.maxScroll(window) - 1;

      const onResize = () => {
        maxScroll = ScrollTrigger.maxScroll(window) - 1;
      };
      onResize();

      const onScroll = (e: Event) => {
        if (!loop || (maxLoops > 0 && loopCount >= maxLoops)) return;
        const scroll = snapTrigger.scroll();
        if (scroll > maxScroll) {
          snapTrigger.scroll(1);
          loopCount += 1;
          e.preventDefault();
        } else if (scroll < 1) {
          snapTrigger.scroll(maxScroll - 1);
          loopCount += 1;
          e.preventDefault();
        }
      };

      if (loop) {
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onScroll, { passive: false });
      }

      return () => {
        if (loop) {
          window.removeEventListener('resize', onResize);
          window.removeEventListener('scroll', onScroll);
        }
        snapTrigger.kill();
        triggers.forEach((t) => t.kill());
        clone?.remove();
      };
    }, containerRef);

    return () => ctx.revert();
  }, [loop, maxLoops, panelSelector]);

  return <div ref={containerRef}>{children}</div>;
}
