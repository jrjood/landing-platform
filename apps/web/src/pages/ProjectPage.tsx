import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProjectBySlug, type Project } from '@/lib/api';
import { PageEnter } from '@/components/PageEnter';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/pages/project/HeroSection';
import { ProjectDetailsSection } from '@/pages/project/ProjectDetailsSection';
import { MasterPaymentSection } from '@/pages/project/MasterPaymentSection';
import { PaymentPlanSection } from '@/pages/project/PaymentPlanSection';
import { AboutDeveloperSection } from '@/pages/project/AboutDeveloperSection';
import { Location } from '@/pages/project/Location';
import { GallerySection } from '@/pages/project/GallerySection';
import { useGlobalLoading } from '@/contexts/LoadingContext';
import { toast } from 'sonner';
import { getProjectCanonicalUrl } from '@/lib/routing';
import { StickyLeadBar } from '@/components/StickyLeadBar';

type ProjectPageProps = { forcedSlug?: string };

export function ProjectPage({ forcedSlug }: ProjectPageProps) {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const resolvedSlug = forcedSlug || projectSlug;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { startLoading, stopLoading } = useGlobalLoading();

  useEffect(() => {
    document.body.style.overflow = '';
  }, []);

  const loadProject = useCallback(async () => {
    if (!resolvedSlug) return;
    setLoading(true);
    startLoading();
    try {
      const project = await getProjectBySlug(resolvedSlug);
      setProject(project);
    } catch {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
      stopLoading();
    }
  }, [resolvedSlug, startLoading, stopLoading]);

  useEffect(() => {
    if (resolvedSlug) loadProject();
  }, [resolvedSlug, loadProject]);

  if (loading) return null;

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

  const canonicalUrl =
    project.canonicalUrl ||
    getProjectCanonicalUrl(project.slug, project.subdomain);
  const metaTitle =
    project.seoTitle ||
    project.ogTitle ||
    `${project.title} | Wealth Holding Developments`;
  const metaDescription =
    project.seoDescription || project.ogDescription || project.subtitle;
  const ogImage = project.ogImage || project.heroImage;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: project.developer?.name || 'Wealth Holding Developments',
      url: project.developer?.websiteUrl || canonicalUrl,
      image: project.developer?.logoUrl || ogImage,
      areaServed: project.locationText || project.location,
      telephone: project.developer?.contactPhone,
      email: project.developer?.contactEmail,
      sameAs: project.developer?.socialLinks
        ? Object.values(project.developer.socialLinks).filter(Boolean)
        : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: project.title,
      description: metaDescription,
      image: ogImage,
      brand: project.developer?.name,
      category: project.type,
      url: canonicalUrl,
      offers: {
        '@type': 'Offer',
        name: project.title,
        category: project.type,
        availability: project.status,
        priceSpecification: project.paymentPlans?.[0]?.startingPrice
          ? {
              '@type': 'PriceSpecification',
              price: project.paymentPlans[0].startingPrice,
            }
          : undefined,
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name='description' content={metaDescription} />
        <link rel='canonical' href={canonicalUrl} />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={project.ogTitle || metaTitle} />
        <meta
          property='og:description'
          content={project.ogDescription || metaDescription}
        />
        <meta property='og:image' content={ogImage} />
        <meta property='og:url' content={canonicalUrl} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={project.ogTitle || metaTitle} />
        <meta
          name='twitter:description'
          content={project.ogDescription || metaDescription}
        />
        <meta name='twitter:image' content={ogImage} />
        <script type='application/ld+json'>
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <PageEnter className='project-brochure-page min-h-screen bg-background pb-24 lg:pb-0'>
        <HeroSection project={project} />
        <ProjectDetailsSection project={project} />
        <Location project={project} />
        <MasterPaymentSection project={project} />
        <PaymentPlanSection project={project} />
        <GallerySection images={project.gallery} videos={project.videos} project={project} />
        <AboutDeveloperSection project={project} />
        <Footer />
        <StickyLeadBar
          projectSlug={project.slug}
          projectTitle={project.title}
        />
      </PageEnter>
    </>
  );
}
