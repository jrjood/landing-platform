import { MapPin, CheckCircle } from 'lucide-react';
import type { Project } from '@/lib/api';

interface HighlightsAndLocationSectionProps {
  project: Project;
}

export function HighlightsAndLocationSection({
  project,
}: HighlightsAndLocationSectionProps) {
  const highlights =
    project.highlights && project.highlights.length > 0
      ? project.highlights
      : [
          'Premium Quality',
          'Prime Location',
          'Modern Amenities',
          'Expert Construction',
        ];

  return (
    <section className='pb-14 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='grid lg:grid-cols-2 gap-12 items-start'>
          {/* Highlights */}
          <div className='flex flex-col h-full'>
            <h2 className='text-3xl md:text-4xl font-bold mb-8'>
              Project Highlights
            </h2>
            <div className='grid grid-cols-2 gap-y-10 gap-x-6'>
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className='flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm'
                >
                  <div className='w-6 h-6 bg-burgundy/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <CheckCircle className='w-4 h-4 text-burgundy' />
                  </div>
                  <p className='font-medium text-gray-800'>{highlight}</p>
                </div>
              ))}
            </div>
          </div>

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
