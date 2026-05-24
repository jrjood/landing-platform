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
            <div className='media-reference__heading'>
              <span>Gallery</span>
              <h2>Explore the Beauty</h2>
            </div>

            <AccordionGallery images={images} />
          </div>

          <div className='media-reference__panel media-reference__panel--video'>
            <div className='media-reference__heading'>
              <span>Video</span>
              <h2>Experience {project.title}</h2>
            </div>

            <VideoGallery videos={videos} />
          </div>
        </div>
      </div>
    </section>
  );
}
