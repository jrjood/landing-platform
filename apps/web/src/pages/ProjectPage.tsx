import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProjectBySlug, type Project } from '@/lib/api';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/pages/project/HeroSection';
import { ProjectDetailsSection } from '@/pages/project/ProjectDetailsSection';
import { MasterPaymentSection } from '@/pages/project/MasterPaymentSection';
import { AboutDeveloperSection } from '@/pages/project/AboutDeveloperSection';
import { Location } from '@/pages/project/Location';
import { GallerySection } from '@/pages/project/GallerySection';
import { ContactSection } from '@/pages/project/ContactSection';
import { useGlobalLoading } from '@/contexts/LoadingContext';
import { toast } from 'sonner';

export function ProjectPage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { startLoading, stopLoading } = useGlobalLoading();

  const loadProject = useCallback(async () => {
    if (!projectSlug) return;

    setLoading(true);
    startLoading();
    try {
      const project = await getProjectBySlug(projectSlug);
      setProject(project);
    } catch (error: any) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
      stopLoading();
    }
  }, [projectSlug, startLoading, stopLoading]);

  useEffect(() => {
    if (!projectSlug) return;

    loadProject();
  }, [projectSlug, loadProject]);

  if (loading) {
    return null;
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
        <GallerySection
          images={project.gallery}
          brochureUrl={project.brochureUrl}
          project={project}
          videos={project.videos}
        />
        <Location project={project} />
        <MasterPaymentSection project={project} />
        <ContactSection project={project} />
        <AboutDeveloperSection project={project} />
        <Footer />
      </div>
    </>
  );
}
