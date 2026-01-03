import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/all';

import './heroBentoBackground.css';

gsap.registerPlugin(ScrollTrigger, Flip);

// Same images used in the original GSAP CodePen
const images = [
  // Same image, subtle zoom-in crop (pattern)
  'https://images.unsplash.com/photo-1588594276800-2de0522b3b73?q=80&w=1170&auto=format&fit=crop',

  // Repeated slightly darker version
  'https://images.unsplash.com/photo-1588594276800-2de0522b3b73?q=80&w=1170&auto=format&fit=crop&sat=-20&exp=0.1',

  // Hero (main real estate image)
  'devmain.jpg',
  // Slight color-shift pattern (golden tinted)
  'https://images.unsplash.com/photo-1588594276800-2de0522b3b73?q=80&w=1170&auto=format&fit=crop&hue=30',

  // Very low-detail crop (texture pattern)
  'https://images.unsplash.com/photo-1588594276800-2de0522b3b73?q=80&w=1170&auto=format&fit=crop&blur=60',

  // Red-rich version for mood tile
  'https://images.unsplash.com/photo-1588594276800-2de0522b3b73?q=80&w=1170&auto=format&fit=crop&sat=30&exp=0.15',

  // Warm gold-ish overlay version
  'https://images.unsplash.com/photo-1588594276800-2de0522b3b73?q=80&w=1170&auto=format&fit=crop&hue=15&sat=10',

  // Ultra-soft shadowed pattern
  'https://images.unsplash.com/photo-1588594276800-2de0522b3b73?q=80&w=1170&auto=format&fit=crop&blur=30&exp=0.05',
];

export function HeroBentoFlip() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const wrapEl = wrapRef.current;
    const galleryEl = galleryRef.current;
    if (!wrapEl || !galleryEl) return;

    const items = Array.from(
      galleryEl.querySelectorAll<HTMLElement>('.gallery__item')
    );

    const build = () => {
      // Kill only ScrollTriggers belonging to this gallery
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === galleryEl) st.kill();
      });

      galleryEl.classList.remove('gallery--final');
      gsap.set(items, { clearProps: 'all' });

      // Capture final layout
      galleryEl.classList.add('gallery--final');
      const state = Flip.getState(items);
      galleryEl.classList.remove('gallery--final');

      const flipTween = Flip.to(state, {
        simple: true,
        ease: 'expoScale(1, 5)',
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: galleryEl,
            start: 'center center',
            end: '+=100%',
            scrub: true,
            pin: wrapEl,
            invalidateOnRefresh: true,
            // markers: true,
          },
        })
        .add(flipTween);

      ScrollTrigger.refresh();
    };

    build();

    let t: number | null = null;
    const onResize = () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => build(), 150);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === galleryEl) st.kill();
      });
      gsap.killTweensOf(items);
      gsap.set(items, { clearProps: 'all' });
    };
  }, []);

  return (
    <>
      {/* HERO */}
      <div className='gallery-wrap' ref={wrapRef}>
        <div
          className='gallery gallery--bento gallery--switch'
          id='gallery-8'
          ref={galleryRef}
        >
          {images.map((src, i) => (
            <div className='gallery__item' key={i}>
              <img src={src} alt={`Gallery item ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT BELOW (for scrolling) */}
      <div className='section'></div>
    </>
  );
}
