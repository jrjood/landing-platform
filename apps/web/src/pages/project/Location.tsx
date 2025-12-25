import { MapPin } from 'lucide-react';
import type { Project } from '@/lib/api';

interface Location {
  project: Project;
}

export function Location({ project }: Location) {
  return (
    <section className='p-14  '>
      <div className='container mx-auto px-4'>
        <div className=' '>
          {/* Location Map */}
          <div className='flex flex-col h-full'>
            <h2 className='text-3xl md:text-4xl font-bold mb-8'>Location</h2>
            <div className='relative flex-1 rounded-2xl overflow-hidden shadow-xl bg-gray-200'>
              {project.mapEmbedUrl ? (
                <iframe
                  src={project.mapEmbedUrl}
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title={`${project.title} location map`}
                />
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <div className='text-center text-gray-500'>
                    <MapPin className='w-12 h-12 mx-auto mb-4' />
                    <p className='font-medium'>{project.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
