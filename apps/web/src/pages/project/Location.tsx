import { useEffect, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import type { Project } from '@/lib/api';

interface LocationProps {
  project: Project;
}

function CountUp({
  value,
  duration = 2600,
  start,
}: {
  value: number;
  duration?: number;
  start: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!start) {
      setDisplayValue(0);
      return;
    }
    if (
      duration <= 0 ||
      (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
    ) {
      setDisplayValue(value);
      return;
    }

    let rafId: number;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [duration, start, value]);

  return <>{displayValue}</>;
}

export function Location({ project }: LocationProps) {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationImage =
    project.locationImage ||
    (project.location &&
    (project.location.startsWith('http') || project.location.startsWith('/'))
      ? project.location
      : undefined);
  const locationText = project.locationText || project.location;
  const accessTimes = {
    citra: [
      { minutes: 2, from: 'Mall of Arabia and the 26th of July Axis' },
      { minutes: 15, from: ' Sphinx Airport' },
      { minutes: 15, from: ' Grand Egyptian Museum' },
      { minutes: 2, from: 'July 26th Axis' },
    ],
  };

  const list =
    project.slug in accessTimes
      ? accessTimes[project.slug as keyof typeof accessTimes]
      : [];

  const [startCounting, setStartCounting] = useState(false);
  const countersRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = countersRef.current;
    if (!node) return;

    let didStart = false;
    const startNow = () => {
      if (didStart) return;
      didStart = true;
      setStartCounting(true);
    };

    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      startNow();
      return;
    }

    let observer: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startNow();
            observer?.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -20% 0px' },
      );
      observer.observe(node);
    }

    const fallbackId = window.setTimeout(() => {
      if (!didStart) startNow();
    }, 1200);

    const onVisibilityChange = () => {
      if (didStart || document.visibilityState !== 'visible') return;
      const rect = node.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) startNow();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      observer?.disconnect();
      window.clearTimeout(fallbackId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <section id='location' className='project-location'>
      <div className='container mx-auto px-4'>
        <div className='project-location__shell'>
          <div className='project-location__copy' ref={countersRef}>
            <p className='brand-eyebrow'>Location</p>
            <h2>Connected to Everything That Matters</h2>
            <p>
              Strategically located with excellent connectivity to business
              districts, top schools, hospitals, shopping and entertainment
              hubs.
            </p>

            {list.length > 0 ? (
              <div className='project-location__times'>
                {list.map((item) => (
                  <div key={item.from}>
                    <MapPin className='h-4 w-4' />
                    <span>
                      <CountUp value={item.minutes} start={startCounting} />{' '}
                      mins to {item.from.trim()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              locationText && (
                <div className='project-location__times'>
                  <div>
                    <MapPin className='h-4 w-4' />
                    <span>{locationText}</span>
                  </div>
                </div>
              )
            )}

            <button
              type='button'
              onClick={() => locationImage && setIsLocationOpen(true)}
              className='project-button project-button--outline'
            >
              View on Map
            </button>
          </div>

          <div className='project-location__map'>
            <div className='project-location__map-inner'>
              {locationImage ? (
                <button
                  type='button'
                  onClick={() => setIsLocationOpen(true)}
                  className='group relative block h-full w-full focus:outline-none'
                  aria-label='View location image in full screen'
                >
                  <img
                    src={locationImage}
                    alt={`${project.title} location`}
                    className='h-full w-full object-cover'
                  />
                </button>
              ) : project.mapEmbedUrl ? (
                <iframe
                  src={project.mapEmbedUrl}
                  className='h-full w-full'
                  style={{ border: 0, filter: 'grayscale(10%) contrast(105%)' }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title={`${project.title} location map`}
                />
              ) : (
                <div className='flex h-full min-h-[300px] items-center justify-center bg-gradient-to-br from-primary/[0.02] to-secondary/[0.02] p-8'>
                  <div className='text-center'>
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                      <MapPin className='h-7 w-7 text-primary' />
                    </div>
                    {locationText && (
                      <p className='text-sm font-medium text-muted-foreground'>
                        {locationText}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
      {isLocationOpen && locationImage && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'
          onClick={() => setIsLocationOpen(false)}
        >
          <div
            className='relative max-h-[90vh] w-full max-w-5xl'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type='button'
              onClick={() => setIsLocationOpen(false)}
              className='absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white shadow-lg backdrop-blur hover:bg-white/25 transition'
              aria-label='Close full screen location'
            >
              <X className='h-5 w-5' />
            </button>
            <img
              src={locationImage}
              alt={`${project.title} location full screen`}
              className='max-h-[85vh] w-full object-contain rounded-lg border border-white/10 bg-black shadow-2xl'
            />
          </div>
        </div>
      )}
    </section>
  );
}
