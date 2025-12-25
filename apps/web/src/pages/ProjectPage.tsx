import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProjectBySlug, type Project } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/pages/project/HeroSection';
import { ProjectDetailsSection } from '@/pages/project/ProjectDetailsSection';

import { Location } from '@/pages/project/Location';
import { GallerySection } from '@/pages/project/GallerySection';
import { ContactSection } from '@/pages/project/ContactSection';
import { toast } from 'sonner';

export function ProjectPage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectSlug) return;

    loadProject();
  }, [projectSlug]);

  const loadProject = async () => {
    if (!projectSlug) return;

    setLoading(true);
    try {
      const project = await getProjectBySlug(projectSlug);
      setProject(project);
    } catch (error: any) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <Skeleton className='mb-4 h-12 w-3/4' />
          <Skeleton className='mb-8 h-6 w-1/2' />
          <Skeleton className='mb-8 h-96 w-full' />
          <div className='grid gap-8 md:grid-cols-2'>
            <Skeleton className='h-64' />
            <Skeleton className='h-64' />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h1 className='mb-4 text-4xl font-bold'>Project Not Found</h1>
          <Link to='/' className='text-primary hover:underline'>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | Wealth Holding Developments</title>
        <meta name='description' content={project.subtitle} />
      </Helmet>

      <div className='min-h-screen bg-background page-transition'>
        <HeroSection project={project} />
        <ProjectDetailsSection project={project} />
        <GallerySection images={project.gallery} />
        <Location project={project} />
        <ContactSection project={project} />
        <Footer />
      </div>
    </>
  );
}
