import { motion } from 'framer-motion';
import { BadgeCheck, Building2, Lock, MapPin, Sparkles } from 'lucide-react';
import type { Project } from '@/lib/api';
import { LeadForm } from '@/components/LeadForm';
import { getAmenityIcon } from '@/lib/amenityIcons';

interface HeroSectionProps {
  project: Project;
}

export function HeroSection({ project }: HeroSectionProps) {
  const mobileHero = project.heroImageMobile ?? project.heroImage;

  const fallbackHighlights = [
    {
      icon: MapPin,
      label: 'Prime Location',
      value: project.locationText || project.location,
    },
    { icon: Building2, label: 'Modern Residences', value: project.type },
    { icon: BadgeCheck, label: 'Flexible Plans', value: project.status },
  ];
  const highlights = project.highlights?.length
    ? project.highlights.map((highlight) => ({
        icon: getAmenityIcon(highlight.icon),
        label: highlight.label,
        value: highlight.value,
      }))
    : fallbackHighlights;

  return (
    <section
      className='project-hero relative flex min-h-screen items-center overflow-hidden'
    >
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className='absolute inset-0 z-0'
      >
        <div className='absolute inset-0'>
          <picture>
            <source media='(min-width: 768px)' srcSet={project.heroImage} />
            <img
              src={mobileHero}
              className='h-full w-full object-cover'
              alt=''
            />
          </picture>
        </div>
        <div className='project-hero__shade absolute inset-0' />
      </motion.div>

      <div className='relative z-10 container mx-auto px-4 pb-16 pt-28 md:pt-32'>
        <div className='grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]'>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='project-hero__copy text-white'
          >
            <h1>{project.title}</h1>

            <p className='project-hero__subtitle'>{project.subtitle}</p>

            <div className='project-hero__highlights'>
              {highlights
                .filter((item) => item.value)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label}>
                      <Icon className='h-6 w-6' />
                      <strong>{item.label}</strong>
                      <span>{item.value}</span>
                    </div>
                  );
                })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
            className='w-full max-w-md mx-auto lg:mx-0 lg:ml-auto'
          >
            <div
              id='contact-form'
              className='project-enquiry-card lead-form-shell relative overflow-hidden'
            >
              <div className='p-6 md:p-8'>
                <div className='text-center'>
                  <p>
                    Fill in your details and our team will get in touch with
                    you.
                  </p>
                </div>
                <LeadForm projectSlug={project.slug} />
                <p className='project-enquiry-card__secure'>
                  <Lock className='h-3.5 w-3.5' />
                  Your information is secure and confidential.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className='absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block'
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className='flex flex-col items-center gap-2'
        >
          <span className='text-xs text-white/50 uppercase tracking-widest'>
            Scroll
          </span>
          <div className='w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1.5'>
            <div className='w-1 h-2 rounded-full bg-white/60' />
          </div>
        </motion.div>
      </motion.div>
      <Sparkles className='project-hero__mark h-5 w-5' />
    </section>
  );
}
