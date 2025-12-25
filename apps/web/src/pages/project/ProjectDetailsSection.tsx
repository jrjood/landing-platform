import { Project } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Clock, MapPin } from 'lucide-react';
import { CheckCircle } from 'lucide-react';

interface ProjectDetailsProps {
  project: Project;
}

export function ProjectDetailsSection({ project }: ProjectDetailsProps) {
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
    <section className='py-14 bg-muted'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-[1fr_2fr] gap-6'>
          <div className='  flex items-center justify-center '>
            <img
              src='/icon_Wealth.png'
              alt='Wealth Holding'
              className=' object-contain'
            />
          </div>
          <div>
            <div className='mb-12'>
              <h2 className='text-3xl md:text-4xl font-bold mb-8 '>
                About the Project
              </h2>
              <p className='text-lg leading-relaxed text-stone-400'>
                {project.description}
              </p>
            </div>

            <div className=' '>
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
                        <CheckCircle className='w-4 h-4 text-primary' />
                      </div>
                      <p className='font-medium text-gray-800'>{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
