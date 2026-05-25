import { AccordionGallery } from './AccordionGallery';
import type { GalleryImage, Project, ProjectVideo } from '@/lib/api';
import VideoGallery from '@/components/VideoGallery';

interface GallerySectionProps {
  images: GalleryImage[];
  project: Project;
  videos?: ProjectVideo[];
}

export function GallerySection({ images, project, videos = [] }: GallerySectionProps) {
  return (
    <section id='gallery' className='media-reference'>
      <div className='container mx-auto px-4'>
        <div className='media-reference__grid'>
          <div className='media-reference__panel media-reference__panel--gallery'>
            <AccordionGallery images={images} eyebrow='Gallery' title='Explore the Beauty' />
          </div>

          <div className='media-reference__panel media-reference__panel--video'>
            <VideoGallery videos={videos} eyebrow='Video' title={`Experience ${project.title}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
