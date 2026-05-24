import { useLayoutEffect, useRef } from 'react';
import type { Project } from '@/lib/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AboutDeveloperSectionProps {
  project: Project;
}

export function AboutDeveloperSection({ project }: AboutDeveloperSectionProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  const developer = project.developer;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q('[data-fade]'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  if (!developer) return null;

  const stats = [
    {
      value: developer.yearsOfExperience,
      label: 'Years of Excellence',
    },
    {
      value: developer.projectsDelivered,
      label: 'Projects Delivered',
    },
    {
      value: developer.happyFamilies,
      label: 'Happy Families',
    },
  ].filter((stat) => stat.value);

  const showcaseImage =
    developer.showcaseImageUrl ||
    project.gallery[1]?.url ||
    project.aboutImage ||
    project.heroImage;

  return (
    <section
      id='developer'
      ref={(el) => {
        rootRef.current = el;
      }}
      className='project-developer developer-band'
    >
      <div className='container mx-auto px-4'>
        <div className='developer-band__grid' data-fade>
          <div className='developer-band__copy'>
            <p className='brand-eyebrow'>The Developer</p>
            <h2>{developer.headline || 'Built on Trust. Driven by Excellence.'}</h2>
            {developer.description && <p>{developer.description}</p>}

            {!!stats.length && (
              <div className='developer-band__stats'>
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='developer-band__logo'>
            <div>
              {developer.logoUrl ? (
                <img
                  src={developer.logoUrl}
                  alt={developer.name}
                  loading='lazy'
                />
              ) : (
                <Building2 className='h-16 w-16' />
              )}
              <span>{developer.name}</span>
            </div>
          </div>

          <div className='developer-band__image'>
            <img src={showcaseImage} alt={`${developer.name} showcase`} loading='lazy' />
          </div>
        </div>
      </div>
    </section>
  );
}
