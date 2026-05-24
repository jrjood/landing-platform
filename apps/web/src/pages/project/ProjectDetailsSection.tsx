import { Project } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowDownToLine } from 'lucide-react';

interface ProjectDetailsProps { project: Project; }

export function ProjectDetailsSection({ project }: ProjectDetailsProps) {
  const descriptionParts = project.description
    .split(/[.۔]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  const galleryImage = project.aboutImage || project.gallery[0]?.url || project.heroImage;

  return (
    <section
      id='projects-details'
      className='project-about project-about--reference'
    >
      <div className='container relative mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className='project-about__reference-grid'
        >
          <div className='project-about__intro'>
            <p className='brand-eyebrow'>About The Project</p>
            <h2 className='brand-title mt-3'>
              {project.subtitle}
            </h2>
            <div className='project-about__body'>
              {descriptionParts.map((part, idx) => (
                <p key={idx}>{part}.</p>
              ))}
            </div>
            {project.brochureUrl && (
              <a
                href={project.brochureUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='project-button project-button--dark'
              >
                Know More
                <ArrowDownToLine className='h-4 w-4' />
              </a>
            )}
          </div>

          <div className='project-about__wide-image'>
            <img src={galleryImage} alt={project.title} loading='lazy' />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
