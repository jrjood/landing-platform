import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BadgeCheck, Building2, Lock, MapPin, PhoneCall } from 'lucide-react';
import type { Project } from '@/lib/api';
import { LeadForm } from '@/components/LeadForm';
import { getAmenityIcon } from '@/lib/amenityIcons';
import { ShineButton } from '@/components/lightswind/shine-button';

interface HeroSectionProps {
  project: Project;
}

export function HeroSection({ project }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mobileHero = project.heroImageMobile ?? project.heroImage;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 320]);
  const topbarY = useTransform(scrollYProgress, [0, 1], [0, -420]);

  const scrollToLeadForm = () => {
    const target = document.getElementById('contact-form');
    if (!target) return;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  };

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
      ref={sectionRef}
      className='project-hero relative flex min-h-screen items-center overflow-hidden'
    >
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        style={{ y: backgroundY }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className='absolute -inset-y-16 inset-x-0 z-0'
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

      <motion.div className='project-hero__top-wrap' style={{ y: topbarY }}>
        <div className='project-hero__topbar'>
          <a
            href='https://wealthholding-eg.com'
            className='project-hero__logo'
            aria-label='Wealth Holding'
          >
            <img
              src='/logo1-white.png'
              alt='Wealth Holding'
              className='h-full w-full object-contain'
            />
          </a>

          <ShineButton
            type='button'
            onClick={scrollToLeadForm}
            label={
              <>
                <PhoneCall className='ml-1.5 h-4 w-4' /> Enquire Now
              </>
            }
            size='lg'
            bgColor='linear-gradient(325deg, #c69a5c 0%, #252017 55%, #c69a5c 90%)'
            className='lead-form__submit project-hero__enquire h-9 px-3 text-[10px]'
          />
        </div>
      </motion.div>

      <div className='relative z-10 container mx-auto px-4 pb-16 pt-28 md:pt-32'>
        <div className='grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]'>
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
            className='w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto'
          >
            <div
              id='contact-form'
              className='project-enquiry-card lead-form-shell relative overflow-hidden'
            >
              <div className='p-7 md:p-10'>
                <div className='text-center'>
                  <span className='project-enquiry-card__eyebrow'>
                    Enquire Now
                  </span>
                  <h3>Book Your Private Consultation</h3>
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
    </section>
  );
}
