import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import type { Project } from '@/lib/api';

interface LocationProps {
  project: Project;
}

function CountUp({
  value,
  duration = 1600,
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
  const accessTimes = {
    citra: [
      { minutes: 2, from: 'Mall of Arabia and the 26th of July Axis' },
      { minutes: 15, from: ' Sphinx Airport' },
      { minutes: 15, from: ' Grand Egyptian Museum' },
      { minutes: 12, from: 'Smart Village' },
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCounting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className='panel bg-muted py-16  '>
      <div className='container mx-auto px-4'>
        <div className='grid gap-10 lg:grid-cols-2 items-stretch'>
          <div className='space-y-4 h-full flex flex-col'>
            <h2 className='text-3xl font-semibold text-card-foreground tracking-wide uppercase'>
              Location
            </h2>
            <div className='rounded-lg border border-primary/70 bg-white shadow-lg overflow-hidden h-full min-h-[300px]'>
              {project.mapEmbedUrl ? (
                <iframe
                  src={project.mapEmbedUrl}
                  className='h-full w-full'
                  style={{ border: 0, filter: 'grayscale(5%) contrast(110%)' }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title={`${project.title} location map`}
                />
              ) : (
                <div className='flex h-[520px] items-center justify-center bg-slate-50'>
                  <div className='text-center text-primary'>
                    <MapPin className='w-12 h-12 mx-auto mb-4' />
                    <p className='font-medium'>{project.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='space-y-4 h-full flex flex-col' ref={countersRef}>
            <h2 className='text-2xl md:text-3xl font-semibold text-card-foreground leading-tight'>
              At the heart of green revolution
            </h2>
            <div className='grid grid-cols-2 lg:grid-cols-2 gap-4'>
              {list.map((item) => (
                <div
                  key={item.from}
                  className='rounded-lg border border-primary/70 bg-white p-5 shadow-sm'
                >
                  <div className='flex items-baseline gap-3 text-primary '>
                    <span className='text-5xl font-semibold leading-none'>
                      <CountUp value={item.minutes} start={startCounting} />
                    </span>
                    <span className='text-lg font-serif italic uppercase tracking-wide'>
                      mins
                    </span>
                  </div>
                  <p className='mt-3 text-sm text-gray-700 uppercase tracking-wide'>
                    From:
                  </p>
                  <p className='text-base font-semibold text-gray-900'>
                    {item.from}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
