import { AccordionGallery } from './AccordionGallery';
import type { GalleryImage } from '@/lib/api';

interface GallerySectionProps {
  images: GalleryImage[];
}

export function GallerySection({ images }: GallerySectionProps) {
  return (
    <section className='py-14'>
      <div className='container mx-auto px-4'>
        {/* <h2 className='mb-8 text-center text-3xl font-bold'>Gallery</h2> */}
        <AccordionGallery images={images} />
      </div>
    </section>
  );
}
