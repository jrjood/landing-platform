import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = '',
}) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number; // kept for API compatibility (not used directly here)
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

type LenisScrollEvent = { scroll: number };

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration: _scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) => {
  void _scaleDuration;

  const scrollerRef = useRef<HTMLDivElement>(null);

  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(
    new Map<
      number,
      { translateY: number; scale: number; rotation: number; blur: number }
    >()
  );

  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback(
    (scrollTop: number, start: number, end: number) => {
      if (scrollTop <= start) return 0;
      if (scrollTop >= end) return 1;
      const denom = end - start;
      if (denom === 0) return 1;
      return (scrollTop - start) / denom;
    },
    []
  );

  const parsePercentage = useCallback(
    (value: string | number, containerHeight: number) => {
      if (typeof value === 'string' && value.includes('%')) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return Number(value);
    },
    []
  );

  const getContainerHeight = useCallback(() => {
    if (useWindowScroll) return window.innerHeight;
    return scrollerRef.current?.clientHeight ?? window.innerHeight;
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      }
      return element.offsetTop;
    },
    [useWindowScroll]
  );

  /**
   * IMPORTANT:
   * With Lenis wrapper/content, scroller.scrollTop can be unreliable (virtual scroll).
   * So we accept `scrollTopOverride` from Lenis on('scroll', e).
   */
  const updateCardTransforms = useCallback(
    (scrollTopOverride?: number) => {
      if (!cardsRef.current.length || isUpdatingRef.current) return;

      isUpdatingRef.current = true;

      const containerHeight = getContainerHeight();
      const scrollTop =
        scrollTopOverride ??
        (useWindowScroll
          ? window.scrollY
          : scrollerRef.current?.scrollTop ?? 0);

      const stackPositionPx = parsePercentage(stackPosition, containerHeight);
      const scaleEndPositionPx = parsePercentage(
        scaleEndPosition,
        containerHeight
      );

      const endElement = useWindowScroll
        ? (document.querySelector('.scroll-stack-end') as HTMLElement | null)
        : (scrollerRef.current?.querySelector(
            '.scroll-stack-end'
          ) as HTMLElement | null);

      const endElementTop = endElement ? getElementOffset(endElement) : 0;

      // Used for blur depth calc
      let topCardIndex = 0;
      if (blurAmount) {
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart =
            jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) topCardIndex = j;
        }
      }

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const cardTop = getElementOffset(card);

        const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
        const triggerEnd = cardTop - scaleEndPositionPx;

        const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
        const pinEnd = endElementTop - containerHeight / 2;

        const scaleProgress = calculateProgress(
          scrollTop,
          triggerStart,
          triggerEnd
        );
        const targetScale = baseScale + i * itemScale;
        const scale = 1 - scaleProgress * (1 - targetScale);

        const rotation = rotationAmount
          ? i * rotationAmount * scaleProgress
          : 0;

        let blur = 0;
        if (blurAmount && i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }

        let translateY = 0;
        const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

        if (isPinned) {
          translateY =
            scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
        } else if (scrollTop > pinEnd) {
          translateY =
            pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
        }

        const newTransform = {
          translateY: Math.round(translateY * 100) / 100,
          scale: Math.round(scale * 1000) / 1000,
          rotation: Math.round(rotation * 100) / 100,
          blur: Math.round(blur * 100) / 100,
        };

        const lastTransform = lastTransformsRef.current.get(i);
        const hasChanged =
          !lastTransform ||
          Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
          Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
          Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
          Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

        if (hasChanged) {
          const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
          const filter =
            newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

          card.style.transform = transform;
          card.style.filter = filter;

          lastTransformsRef.current.set(i, newTransform);
        }

        // stack complete callback (last card "in view" while pinned)
        if (i === cardsRef.current.length - 1) {
          const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
          if (isInView && !stackCompletedRef.current) {
            stackCompletedRef.current = true;
            onStackComplete?.();
          } else if (!isInView && stackCompletedRef.current) {
            stackCompletedRef.current = false;
          }
        }
      });

      isUpdatingRef.current = false;
    },
    [
      baseScale,
      blurAmount,
      calculateProgress,
      getContainerHeight,
      getElementOffset,
      itemScale,
      itemStackDistance,
      onStackComplete,
      parsePercentage,
      rotationAmount,
      scaleEndPosition,
      stackPosition,
      useWindowScroll,
    ]
  );

  const handleScroll = useCallback(
    (e?: LenisScrollEvent) => {
      updateCardTransforms(e?.scroll);
    },
    [updateCardTransforms]
  );

  const setupLenis = useCallback(() => {
    // Always use Lenis for smoothness; choose correct wrapper/content
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });

      lenis.on('scroll', handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return;
    }

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const content = scroller.querySelector(
      '.scroll-stack-inner'
    ) as HTMLElement | null;
    if (!content) return;

    const lenis = new Lenis({
      wrapper: scroller,
      content,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      gestureOrientation: 'vertical',
      wheelMultiplier: 1,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
    });

    lenis.on('scroll', handleScroll);

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);

    lenisRef.current = lenis;
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[];

    cardsRef.current = cards;

    // Apply per-card styles & spacing (single source of truth)
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      } else {
        card.style.marginBottom = `0px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transformStyle = 'preserve-3d';
      card.style.perspective = '1000px';
      // GPU hint
      card.style.webkitTransform = 'translateZ(0)';
      card.style.transform = 'translateZ(0)';
    });

    setupLenis();

    // Initial update (use Lenis scroll if available)
    updateCardTransforms(lenisRef.current?.scroll ?? undefined);

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (lenisRef.current) lenisRef.current.destroy();

      stackCompletedRef.current = false;
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
    };
  }, [itemDistance, setupLenis, updateCardTransforms, useWindowScroll]);

  return (
    <div
      className={`scroll-stack-scroller ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className='scroll-stack-inner'>
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className='scroll-stack-end' />
      </div>
    </div>
  );
};

export default ScrollStack;
