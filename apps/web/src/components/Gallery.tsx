import { useState } from 'react';
import { X } from 'lucide-react';

interface GalleryProps {
  images: { url: string; alt: string }[];
}

export function Gallery({ images }: GalleryProps) {
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
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className='group relative aspect-video overflow-hidden rounded-lg'
          >
            <img
              src={image.url}
              alt={image.alt}
              className='h-full w-full object-cover transition-transform group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20' />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/90'>
          <button
            onClick={closeLightbox}
            className='absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20'
          >
            <X className='h-6 w-6' />
          </button>

          <button
            onClick={prevImage}
            className='absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20'
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
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>

          <img
            src={images[selectedImageIndex].url}
            alt={images[selectedImageIndex].alt}
            className='max-h-[90vh] max-w-[90vw] object-contain'
          />

          <button
            onClick={nextImage}
            className='absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20'
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
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>

          <div className='absolute bottom-4 text-white'>
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
