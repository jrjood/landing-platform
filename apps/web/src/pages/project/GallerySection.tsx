import { motion, type Variants } from 'framer-motion';
import { AccordionGallery } from './AccordionGallery';
import type { GalleryImage, Project, ProjectVideo } from '@/lib/api';
import SpotlightCard from '@/components/SpotlightCard';
import { ArrowDown, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuroraTextEffect } from '@/components/lightswind/aurora-text-effect';
import VideoGallery from '@/components/VideoGallery';

interface GallerySectionProps {
  images: GalleryImage[];
  brochureUrl?: string;
  project: Project;
  videos?: ProjectVideo[];
}

const easing: [number, number, number, number] = [0.23, 1, 0.32, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easing, delay: custom },
  }),
};

const fadeScale: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: easing, delay: custom },
  }),
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easing, delay: custom },
  }),
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easing, delay: custom },
  }),
};

export function GallerySection({
  images,
  brochureUrl,
  project,
  videos,
}: GallerySectionProps) {

  return (
    <motion.section
      className='panel bg-background py-16'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2, margin: '-10% 0px' }}
    >
      <div className='container mx-auto px-4'>
        {/* Header */}
        <motion.div
          className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'
          variants={fadeUp}
          custom={0}
        >
          <div className='max-w-2xl'>
            <motion.div
              className='flex items-center gap-3'
              variants={fadeUp}
              custom={0.05}
            >
              <span className='h-px w-10 bg-card-foreground/50' />
              <h3 className='text-md uppercase tracking-[0.28em] text-card-foreground'>
                Gallery & Media
              </h3>
            </motion.div>

            <motion.div
              className='flex items-center gap-3'
              variants={fadeUp}
              custom={0.12}
            >
              <h3 className='text-3xl md:text-3xl text-foreground leading-tight'>
                {project.caption1}
              </h3>

              <AuroraTextEffect
                text={project.title}
                fontSize='clamp(3rem, 8vw, 3rem)'
                colors={{
                  first: 'bg-cyan-400',
                  second: 'bg-yellow-400',
                  third: 'bg-green-400',
                  fourth: 'bg-primary',
                }}
                blurAmount='blur-lg'
              />
            </motion.div>

            <motion.p
              className='mt-2 text-muted-foreground'
              variants={fadeUp}
              custom={0.2}
            >
              A cinematic walkthrough, featured visuals, and brochure
              highlights.
            </motion.p>
          </div>
        </motion.div>

        {/* MEDIA STAGE (unified) */}
        <motion.div
          className='mt-10 relative'
          variants={fadeScale}
          custom={0.08}
        >
          {/* Main stage */}
          <motion.div
            className='relative rounded-lg border border-border bg-card shadow-xl overflow-hidden'
            variants={fadeScale}
            custom={0.12}
            // whileHover={{ y: -3 }}
            transition={{ duration: 0.4, ease: easing }}
          >
            {/* Stage content grid */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-0'>
              <motion.div
                className='lg:col-span-6  '
                variants={fadeLeft}
                custom={0.15}
              >
                <VideoGallery videos={videos} />
              </motion.div>

              {/* Right visual column (only on lg) */}
              <motion.div
                className='hidden lg:block lg:col-span-6 relative'
                variants={fadeRight}
                custom={0.2}
              >
                <div className='absolute inset-0 border-l border-border bg-gradient-to-br from-background via-background to-muted/60' />

                <div className='relative h-full'>
                  <SpotlightCard
                    className='h-full rounded-2xl bg-card/80'
                    spotlightColor='rgba(83, 255, 156, 0.2)'
                  >
                    <div className='absolute inset-0 bg-gradient-to-br from-green-main/10 via-transparent to-foreground/5 pointer-events-none' />

                    <div className='relative flex h-full flex-col justify-center  gap-10 p-8'>
                      <motion.div className='space-y-4'>
                        <motion.div
                          className='inline-flex items-center gap-2 rounded-full border border-green-main/30 bg-green-main/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-main'
                          variants={fadeUp}
                          custom={0.1}
                        >
                          Brochure ready
                        </motion.div>

                        <motion.div
                          className='space-y-2'
                          variants={fadeUp}
                          custom={0.18}
                        >
                          <p className='text-xs uppercase tracking-[0.22em] text-muted-foreground'>
                            Premium Visual Suite
                          </p>
                          <h3 className='text-2xl font-semibold text-foreground leading-tight'>
                            Hero shot, specs, and brochure in one place.
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            Download the PDF or talk with us about finishes,
                            floorplans, and the walkthrough experience.
                          </p>
                        </motion.div>

                        <motion.div
                          className='grid grid-cols-2 gap-3 text-xs text-muted-foreground'
                          variants={fadeUp}
                          custom={0.26}
                        >
                          <div className='rounded-lg border border-border/60 bg-background/70 px-3 py-3'>
                            <p className='text-foreground font-semibold text-sm'>
                              High-res
                            </p>
                            <p className='text-xs'>
                              Curated hero angle for press + sharing.
                            </p>
                          </div>

                          <div className='rounded-lg border border-border/60 bg-background/70 px-3 py-3'>
                            <p className='text-foreground font-semibold text-sm'>
                              Full brochure
                            </p>
                            <p className='text-xs'>
                              Floorplans, finishes, and amenity details.
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                      <div className=''>
                        <motion.div
                          className='px-4 py-3 flex items-start'
                          variants={fadeUp}
                          custom={0.32}
                        >
                          <div className='flex flex-wrap items-center gap-2'>
                            <Button
                              size='sm'
                              className='bg-transparent border-primary border text-black hover:bg-primary/10 px-3'
                              onClick={() => {
                                document
                                  .getElementById('contact-form')
                                  ?.scrollIntoView({ behavior: 'smooth' });
                              }}
                            >
                              Request a Call
                              <PhoneCall className='ml-1.5 h-4 w-4' />
                            </Button>

                            {brochureUrl ? (
                              <a
                                href={brochureUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                <Button
                                  size='sm'
                                  className='bg-primary  text-white hover:bg-primary/90 hover:text-white px-3'
                                >
                                  Download PDF
                                  <ArrowDown className='ml-1.5 h-4 w-4' />
                                </Button>
                              </a>
                            ) : (
                              <span className='text-xs text-card-foreground/80'>
                                No brochure available yet.
                              </span>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              </motion.div>

              {/* Mobile featured card (shows under stage, not beside it) */}
              <motion.div
                className='lg:hidden lg:col-span-8 p-4 md:p-6'
                variants={fadeUp}
                custom={0.22}
              >
                <SpotlightCard
                  className='rounded-xl bg-card/90'
                  spotlightColor='rgba(83, 255, 156, 0.2)'
                >
                  <motion.div
                    className='px-6 py-4 space-y-5'
                    variants={fadeUp}
                    custom={0.26}
                  >
                    <div className='inline-flex items-center gap-2 rounded-full border border-green-main/30 bg-green-main/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-green-main'>
                      Brochure ready
                    </div>

                    <div className='space-y-2'>
                      <p className='text-xs uppercase tracking-[0.22em] text-muted-foreground'>
                        Premium Visual Suite
                      </p>
                      <h3 className='text-xl font-semibold text-foreground leading-tight'>
                        Hero shot, specs, and brochure in one place.
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        Download the PDF or talk with us about finishes,
                        floorplans, and the walkthrough experience.
                      </p>
                    </div>

                    <div className='grid grid-cols-2 gap-3 text-xs text-muted-foreground'>
                      <div className='rounded-lg border border-border/60 bg-background/70 px-3 py-3'>
                        <p className='text-foreground font-semibold text-sm'>
                          High-res
                        </p>
                        <p className='text-xs'>
                          Curated hero angle for press + sharing.
                        </p>
                      </div>

                      <div className='rounded-lg border border-border/60 bg-background/70 px-3 py-3'>
                        <p className='text-foreground font-semibold text-sm'>
                          Full brochure
                        </p>
                        <p className='text-xs'>
                          Floorplans, finishes, and amenity details.
                        </p>
                      </div>
                    </div>

                    <div className='flex flex-wrap justify-center items-center gap-2'>
                      <Button
                        size='sm'
                        className='bg-transparent border-primary border text-black hover:bg-primary/10 px-3 w-full'
                        onClick={() => {
                          document
                            .getElementById('contact-form')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Request a Call
                        <PhoneCall className='ml-1.5 h-4 w-4' />
                      </Button>

                      {brochureUrl ? (
                        <a
                          href={brochureUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='w-full'
                        >
                          <Button
                            size='sm'
                            className='bg-primary text-white hover:bg-primary/90 hover:text-white px-3 w-full'
                          >
                            Download PDF
                            <ArrowDown className='ml-1.5 h-4 w-4' />
                          </Button>
                        </a>
                      ) : (
                        <span className='text-xs text-card-foreground/80'>
                          No brochure available yet.
                        </span>
                      )}
                    </div>
                  </motion.div>
                </SpotlightCard>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Gallery */}
        <motion.div
          className='mt-10 bg-card p-5 shadow-sm'
          variants={fadeUp}
          custom={0.3}
        >
          <AccordionGallery images={images} />
        </motion.div>
      </div>
    </motion.section>
  );
}
