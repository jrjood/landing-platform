import { useLayoutEffect, useMemo, useRef } from 'react';
import type { Project } from '@/lib/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ShieldCheck,
  Timer,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface AboutDeveloperSectionProps {
  project: Project;
}

export function AboutDeveloperSection({ project }: AboutDeveloperSectionProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  const heroImage = 'devmain.jpg';

  const stats = useMemo(
    () => [
      { label: 'Years building value', value: '23+' },
      { label: 'Flagship deliveries', value: '25' },
      { label: 'Families served', value: '12K+' },
      { label: 'On-time rate', value: '97%' },
    ],
    []
  );

  const proofPoints = useMemo(
    () => [
      {
        icon: BadgeCheck,
        title: 'Trusted governance',
        desc: 'Transparent milestones, disciplined delivery, and clean paperwork.',
      },
      {
        icon: ShieldCheck,
        title: 'Quality-first builds',
        desc: 'Materials, execution, and finishing aimed at long-term asset value.',
      },
      {
        icon: Users,
        title: 'Customer-first support',
        desc: 'Dedicated team before handover, during possession, and after move-in.',
      },
    ],
    []
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      gsap.fromTo(
        q('[data-animate]'),
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: q('[data-trigger]')[0],
            start: 'top 75%',
          },
        }
      );

      q('[data-float]').forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -10 : 12,
          duration: 2.8 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      gsap.to(q('[data-pulse]'), {
        scale: 1.03,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(q('[data-parallax]'), {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: q('[data-trigger]')[0],
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={(el) => {
        rootRef.current = el;
      }}
      className='bg-background py-16'
    >
      <div className='container mx-auto px-4' data-trigger>
        <div className='flex items-center gap-3 text-primary' data-animate>
          <div className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30 ring-offset-2 ring-offset-background'>
            <Building2 className='h-5 w-5' />
          </div>
          <div>
            <p className='text-xs uppercase tracking-[0.2em] text-foreground/70'>
              Wealth Holding
            </p>
            <p className='text-lg font-semibold text-foreground'>
              Developer profile
            </p>
          </div>
        </div>

        <div className='mt-8 grid gap-10 lg:grid-cols-12 lg:items-stretch'>
          <div className='lg:col-span-6' data-animate>
            <div className='relative overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-xl'>
              <div className='absolute inset-0 bg-gradient-to-b from-background/10 via-background/0 to-background/60' />
              <div className='relative md:h-[26rem] h-[22rem] w-full overflow-hidden'>
                <img
                  src={heroImage}
                  alt='Wealth Holding developer showcase'
                  className='absolute inset-0 h-full w-full object-cover'
                  data-parallax
                />

                <div
                  data-float
                  className='absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground/80 backdrop-blur'
                >
                  <BadgeCheck className='h-4 w-4 text-primary' />
                  Listed developer
                </div>

                <div
                  data-float
                  className='absolute right-4 top-16 inline-flex items-center gap-3 rounded-xl border border-primary/25 bg-background/85 px-4 py-3 text-sm text-foreground backdrop-blur'
                >
                  <Timer className='h-4 w-4 text-primary' />
                  <div className='leading-tight'>
                    <p className='font-semibold text-foreground'>On-time</p>
                    <p className='text-xs text-foreground/70'>97% delivery</p>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3 p-4 sm:grid-cols-4'>
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className='rounded-lg border border-primary/10 bg-background/90 p-3 text-center'
                    data-animate
                  >
                    <div className='text-lg font-bold text-primary'>
                      {s.value}
                    </div>
                    <div className='text-[11px] uppercase tracking-wide text-foreground/60'>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='lg:col-span-6 flex flex-col gap-6'>
            <div className='space-y-3'>
              <p
                className='text-md uppercase tracking-[0.2em] text-card-foreground'
                data-animate
              >
                About the developer
              </p>
              <h2
                className='text-3xl md:text-4xl font-bold text-card-foreground leading-tight'
                data-animate
              >
                Wealth Holding builds destinations that compound value
              </h2>
              <p
                className='text-base leading-relaxed text-foreground/70'
                data-animate
              >
                For{' '}
                <span className='font-semibold text-foreground'>
                  {project.title}
                </span>
                , the mandate is clear: meticulous engineering, disciplined
                timelines, and a post-handover team that keeps residents
                supported. Every decision is measured against long-term asset
                strength.
              </p>
            </div>

            <div className='grid gap-3 md:grid-cols-3' data-animate>
              {proofPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className='rounded-xl border border-primary/10 bg-card p-5 shadow-sm'
                  >
                    <div className='mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                      <Icon className='h-5 w-5 text-primary' />
                    </div>
                    <div className='text-base font-semibold text-foreground'>
                      {point.title}
                    </div>
                    <p className='mt-1 text-sm leading-relaxed text-foreground/70'>
                      {point.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div
              className='flex flex-col gap-3 sm:flex-row sm:items-center'
              data-animate
            >
              <Button
                onClick={() => {
                  document
                    .getElementById('contact-form')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className='group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95'
              >
                Speak with Wealth Holding
                <ArrowRight className='h-4 w-4 transition group-hover:translate-x-0.5' />
              </Button>

              <div className='rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-foreground/70'>
                Avg response time:{' '}
                <span className='font-semibold text-foreground'>
                  within 24h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
