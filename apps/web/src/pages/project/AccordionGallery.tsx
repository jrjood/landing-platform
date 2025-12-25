import { useState } from 'react';

interface AccordionGalleryProps {
  images: { url: string; alt: string }[];
}

export function AccordionGallery({ images }: AccordionGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Mobile: 2x2 Grid */}
      <div className='grid grid-cols-2 gap-2 rounded-xl md:hidden'>
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => openLightbox(index)}
            className='relative cursor-pointer overflow-hidden rounded-lg aspect-square'
          >
            <img
              src={image.url}
              alt={image.alt}
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'>
              <div className='absolute bottom-3 left-3 text-white'>
                <p className='text-sm font-semibold'>{image.alt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Accordion */}
      <div className='hidden md:flex h-[400px] gap-2 overflow-hidden rounded-xl'>
        {images.map((image, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => openLightbox(index)}
            className={`relative cursor-pointer overflow-hidden rounded-lg transition-all duration-500 ease-out ${
              hoveredIndex === null
                ? 'flex-1'
                : hoveredIndex === index
                ? 'flex-[1]'
                : 'flex-[0.5]'
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className='h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-110'
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 ${
                hoveredIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className='absolute bottom-6 left-6 text-white'>
                <p className='text-lg font-semibold'>{image.alt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-in fade-in duration-200'>
          <button
            onClick={closeLightbox}
            className='absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20'
            aria-label='Close'
          >
            <svg
              className='h-6 w-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          <button
            onClick={prevImage}
            className='absolute left-4 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110'
            aria-label='Previous image'
          >
            <svg
              className='h-8 w-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>

          <div className='max-h-[90vh] max-w-[90vw] animate-in zoom-in-95 duration-300'>
            <img
              src={images[selectedImageIndex].url}
              alt={images[selectedImageIndex].alt}
              className='max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl'
            />
            <p className='mt-4 text-center text-white text-lg'>
              {images[selectedImageIndex].alt}
            </p>
          </div>

          <button
            onClick={nextImage}
            className='absolute right-4 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110'
            aria-label='Next image'
          >
            <svg
              className='h-8 w-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>

          <div className='absolute bottom-8 text-white text-sm backdrop-blur-sm bg-black/30 px-4 py-2 rounded-full'>
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
