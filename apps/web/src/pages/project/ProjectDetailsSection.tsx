import { Project } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Clock, MapPin } from 'lucide-react';

interface ProjectDetailsProps {
  project: Project;
}

export function ProjectDetailsSection({ project }: ProjectDetailsProps) {
  return (
    <section className='py-14 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 grid gap-6 md:grid-cols-3'>
          <Card className='transition-all hover:shadow-lg hover:-translate-y-1'>
            <CardContent className='flex items-start gap-4 p-6'>
              <div className='rounded-lg bg-burgundy/10 p-3'>
                <MapPin className='h-6 w-6 text-burgundy' />
              </div>
              <div>
                <h3 className='font-semibold mb-1'>Location</h3>
                <p className='text-sm text-gray-600'>{project.location}</p>
              </div>
            </CardContent>
          </Card>

          <Card className='transition-all hover:shadow-lg hover:-translate-y-1'>
            <CardContent className='flex items-start gap-4 p-6'>
              <div className='rounded-lg bg-burgundy/10 p-3'>
                <Building className='h-6 w-6 text-burgundy' />
              </div>
              <div>
                <h3 className='font-semibold mb-1'>Project Type</h3>
                <p className='text-sm text-gray-600'>{project.type}</p>
              </div>
            </CardContent>
          </Card>

          <Card className='transition-all hover:shadow-lg hover:-translate-y-1'>
            <CardContent className='flex items-start gap-4 p-6'>
              <div className='rounded-lg bg-burgundy/10 p-3'>
                <Clock className='h-6 w-6 text-burgundy' />
              </div>
              <div>
                <h3 className='font-semibold mb-1'>Status</h3>
                <p className='text-sm text-gray-600'>{project.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='mb-12'>
          <h2 className='mb-4 text-3xl font-bold'>About the Project</h2>
          <p className='text-lg leading-relaxed text-gray-600'>
            {project.description}
          </p>
        </div>
      </div>
    </section>
  );
}
