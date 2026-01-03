import { Project } from '@/lib/api';
import PixelTransition from '@/components/PixelTransition';

import {
  Hotel,
  Building2,
  Dumbbell,
  Waves,
  Flame,
  HeartPulse,
  Trophy,
  Footprints,
  Baby,
  ShieldCheck,
  Smartphone,
  Droplets,
} from 'lucide-react';

// import TiltedCard from '@/components/TiltedCard';

interface ProjectDetailsProps {
  project: Project;
}

export function ProjectDetailsSection({ project }: ProjectDetailsProps) {
  // ƒo. Static residential features (icon + title ONLY)
  const features = {
    citra: [
      { icon: Hotel, title: 'International Hotel' },
      { icon: Building2, title: 'Commercial Zone (CafAcs, Offices & Clinics)' },
      { icon: Dumbbell, title: 'Gym & Spa' },
      { icon: Waves, title: 'Swimming Pools' },
      { icon: Flame, title: 'BBQ Areas' },
      { icon: HeartPulse, title: 'Yoga & Wellness Zones' },
      { icon: Trophy, title: 'Padel, Tennis & Football Courts' },
      { icon: Footprints, title: 'Jogging & Cycling Lanes' },
      { icon: Baby, title: '24/7 Nursery' },
      { icon: ShieldCheck, title: 'Smart Gated Access & 24/7 Security' },
      {
        icon: Smartphone,
        title: 'Residents App for Hotel & Maintenance Services',
      },
      { icon: Droplets, title: 'Lagoons & Water Features' },
    ],
  };

  // One shared height so both columns match and the section never grows
  // const PANEL_H = 'h-[520px] lg:h-[560px]';

  const list =
    project.slug in features
      ? features[project.slug as keyof typeof features]
      : [];

  return (
    <section className='panel bg-background py-16'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl   uppercase   text-card-foreground'>
          About the project
        </h2>
        <div className='grid gap-6 md:grid-cols-[0.37fr_1.1fr] items-start mt-8'>
          {/* LEFT IMAGE (full size / contain, not cover) */}
          <div className='relative h-full min-h-[260px] md:min-h-[340px] lg:min-h-[400px]'>
            {/*  <div
              className={[
                'relative   rounded-lg   h-full',
                // PANEL_H,
              ].join(' ')}
              style={{
                backgroundImage: `url(${about_bg})`,
                backgroundSize: 'contain', // ƒo. full image visible
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            ></div> */}
            {/* <TiltedCard
              imageSrc={project.aboutImage}
              altText='BY - WEALTH HOLDING'
              captionText={'Project - ' + project.title}
              containerHeight='100%'
              containerWidth='100%'
              imageHeight='100%'
              imageWidth='100%'
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <p className='uppercase lg:block hidden'>By - Wealth Holding</p>
              }
            /> */}
            <PixelTransition
              firstContent={
                <img
                  src={project.aboutImage}
                  alt='default pixel transition content '
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              }
              secondContent={
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    placeItems: 'center',
                    backgroundColor: '#111',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <p
                    style={{
                      fontWeight: 900,
                      fontSize: '3rem',
                      color: '#ffffff',
                    }}
                  >
                    BY
                  </p>
                  <img
                    className='object-containco'
                    src='/Wealth logo white.png'
                    alt='wealth holding logo'
                    // height='100px'
                    width='75px'
                  />
                </div>
              }
              gridSize={12}
              pixelColor='#ffffff'
              once={false}
              animationStepDuration={0.4}
              className='custom-pixel-card'
            />
          </div>

          {/* RIGHT CONTENT (NO SCROLL, NO GROW) */}
          <div
            className={[
              // PANEL_H,
              ' ', // ƒo. no scroll
              'flex flex-col justify-between h-full',
            ].join(' ')}
          >
            {/* Top text ƒ?" clamp so it never pushes height */}
            <div className='space-y-3'>
              <h2 className='text-2xl md:text-2xl font-bold text-card-foreground leading-tight line-clamp-2'>
                {project.subtitle}
              </h2>

              <p className='text-lg leading-relaxed text-card-foreground/70 line-clamp-4'>
                {project.description}
              </p>
            </div>

            {/* Features block ƒ?" 3-column creative grid */}
            <div className='pt-6'>
              <div className='flex items-center gap-3 mb-5'>
                <span className='h-px w-10 bg-card-foreground/50' />
                <h3 className='text-md uppercase tracking-[0.2em] text-card-foreground'>
                  Features And AMENITIES
                </h3>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6'>
                {list.map((f, idx) => {
                  const Icon = f.icon;
                  return (
                    <div key={idx} className='group flex items-center gap-3'>
                      {/* Icon dot (no border, no card) */}
                      <div className='relative flex h-10 w-10 items-center justify-center rounded-2xl bg-card-foreground/5'>
                        <span className='absolute -inset-6 opacity-0 blur-2xl bg-green-main/10 transition group-hover:opacity-100' />
                        <Icon className='h-5 w-5 text-card-foreground/85 transition group-hover:scale-110' />
                      </div>

                      {/* Title only */}
                      <p className='text-sm md:text-base font-semibold text-card-foreground/90 leading-snug'>
                        {f.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
