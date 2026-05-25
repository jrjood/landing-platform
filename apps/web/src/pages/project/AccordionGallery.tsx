import { useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, X, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionGalleryProps {
  images: { url: string; alt: string }[];
  eyebrow?: string;
  title?: string;
}

export function AccordionGallery({ images, eyebrow, title }: AccordionGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ isDown: boolean; startX: number; scrollLeft: number; dragged: boolean }>({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    dragged: false,
  });

  const openLightbox = useCallback((index: number) => {
    setLightboxIdx(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const navigate = useCallback((dir: 'next' | 'prev') => {
    setLightboxIdx((prev) => {
      if (dir === 'next') return (prev + 1) % images.length;
      return (prev - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const scroll = useCallback((dir: 'next' | 'prev') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.34;
    scrollRef.current.scrollBy({
      left: dir === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handler);
    };
  }, [lightboxOpen, closeLightbox, navigate]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current.isDown = true;
    dragState.current.startX = e.pageX - el.offsetLeft;
    dragState.current.scrollLeft = el.scrollLeft;
    dragState.current.dragged = false;
    el.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!dragState.current.isDown || !el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    if (Math.abs(walk) > 5) dragState.current.dragged = true;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current.isDown = false;
    el.style.cursor = 'grab';
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current.isDown = false;
    el.style.cursor = 'grab';
  }, []);

  const renderHeading = (action?: ReactNode) => (
    <div className='media-reference__heading media-reference__heading--with-action'>
      <div className='media-reference__title-group'>
        {eyebrow && <span>{eyebrow}</span>}
        {title && <h2>{title}</h2>}
      </div>
      {action}
    </div>
  );

  if (!images.length) {
    return (
      <>
        {renderHeading()}
        <div className='media-reference__empty'>
          <Image className='h-5 w-5' />
          <span>Photos coming soon</span>
        </div>
      </>
    );
  }

  return (
    <>
      {renderHeading(
        <button
          type='button'
          className='media-reference__outline-button'
          onClick={() => openLightbox(0)}
        >
          View All Photos
        </button>,
      )}

      <div className='video-reference__preview overflow-hidden'>
        <div className='relative h-full w-full'>
          <div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-black/10 to-transparent' />
          <div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-black/10 to-transparent' />

          <div
            ref={scrollRef}
            className='scrollbar-hide flex h-full cursor-grab select-none gap-1.5 overflow-x-auto px-1.5 scroll-smooth'
            style={{ scrollSnapType: 'x mandatory' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {images.map((img, index) => (
              <button
                key={`${img.url}-${index}`}
                type='button'
                onClick={() => { if (!dragState.current.dragged) openLightbox(index); }}
                className='relative h-full flex-shrink-0 overflow-hidden focus:outline-none'
                style={{
                  width: '31%',
                  scrollSnapAlign: 'start',
                }}
              >
                <img
                  src={img.url}
                  alt={img.alt || `Gallery image ${index + 1}`}
                  loading='lazy'
                  className='h-full w-full rounded-[0.22rem] object-cover transition-transform duration-500 hover:scale-105'
                />
              </button>
            ))}
          </div>

          {images.length > 3 && (
            <>
              <button
                type='button'
                onClick={(e) => { e.stopPropagation(); scroll('prev'); }}
                className='absolute left-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition hover:bg-black/60 hover:text-white'
                aria-label='Previous photos'
              >
                <ChevronLeft className='h-4 w-4' />
              </button>
              <button
                type='button'
                onClick={(e) => { e.stopPropagation(); scroll('next'); }}
                className='absolute right-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition hover:bg-black/60 hover:text-white'
                aria-label='Next photos'
              >
                <ChevronRight className='h-4 w-4' />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 md:p-6'
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className='absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 backdrop-blur-sm transition hover:bg-white/10 hover:text-white'
              type='button'
            >
              <X className='h-4 w-4' />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
                  className='absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 backdrop-blur-sm transition hover:bg-white/10 hover:text-white'
                  type='button'
                >
                  <ChevronLeft className='h-4 w-4' />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('next'); }}
                  className='absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 backdrop-blur-sm transition hover:bg-white/10 hover:text-white'
                  type='button'
                >
                  <ChevronRight className='h-4 w-4' />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIdx}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className='relative max-h-[90vh] w-full max-w-5xl'
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightboxIdx].url}
                alt={images[lightboxIdx].alt}
                className='max-h-[90vh] w-full rounded-lg object-contain'
              />

              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/50 px-3.5 py-1.5 text-[11px] text-white/50 backdrop-blur-md'>
                {lightboxIdx + 1} / {images.length}
                {images[lightboxIdx].alt && (
                  <>
                    <span className='mx-2 inline-block h-1 w-1 rounded-full bg-white/20' />
                    {images[lightboxIdx].alt}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
