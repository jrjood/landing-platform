import { Project } from '@/lib/api';
import {
  Wallet,
  CalendarRange,
  Percent,
  Clock3,
  Ruler,
  Building2,
  X,
  Expand,
} from 'lucide-react';
import { useState } from 'react';

interface MasterPaymentSectionProps {
  project: Project;
}

export function MasterPaymentSection({ project }: MasterPaymentSectionProps) {
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  const paymentPlan = {
    citra: [
      {
        icon: Wallet,
        label: 'Down Payment',
        value: '5%',
        detail: 'On booking',
      },
      {
        icon: CalendarRange,
        label: 'Installments',
        value: 'Up to 10 years',
        detail: 'Flexible installment plans',
      },
      {
        icon: Percent,
        label: 'Maintenance',
        value: 'TBD',
        detail: 'Announced prior to delivery',
      },
      {
        icon: Clock3,
        label: 'Delivery',
        value: 'TBD',
        detail: 'According to project phase',
      },
    ],
  };

  const list =
    project.slug in paymentPlan
      ? paymentPlan[project.slug as keyof typeof paymentPlan]
      : [];

  const masterHighlights = {
    citra: [
      { icon: Ruler, label: 'Plot Area', value: '60,000 m²' },
      { icon: Building2, label: 'Built-Up', value: '22,000 m²' },
    ],
  };

  const list2 =
    project.slug in masterHighlights
      ? masterHighlights[project.slug as keyof typeof masterHighlights]
      : [];

  return (
    <section className='  panel relative overflow-hidden bg-stone-900 py-20 text-white'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(36,189,100,0.2),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(24,180,150,0.18),transparent_30%)]' />
      <div className='container relative mx-auto px-4'>
        <div className='flex items-center gap-3 text-md font-semibold uppercase tracking-[0.25em] text-card'>
          <div className='h-px w-10 bg-card' />
          Master & Payment
        </div>

        <div className='mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch'>
          <div className='relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/5 via-white/3 to-white/5 shadow-2xl'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_45%)]' />
            <div className='relative p-6 sm:p-8'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <h2 className='text-2xl uppercase tracking-[0.2em] text-card'>
                    Master Plan
                  </h2>
                </div>
                <div className='flex [@media(min-width:446px)]:flex-nowrap flex-wrap  gap-2'>
                  {list2.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className='flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100'
                      >
                        <Icon className='h-4 w-4' />
                        <span>
                          {item.label}: {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <h3 className='text-lg font-semibold text-white mt-4'>
                {project.title} Layout
              </h3>

              <div className='mt-2 overflow-hidden rounded-lg border border-white/10 bg-black/40 shadow-lg'>
                <button
                  type='button'
                  onClick={() => setIsPlanOpen(true)}
                  className='group relative block w-full focus:outline-none'
                  aria-label='View master plan in full screen'
                >
                  <img
                    src={project.masterplanImage}
                    alt={`${project.title} master plan`}
                    className='max-h-[80vh] w-full object-fill transition duration-300 group-hover:scale-[1.01] group-hover:brightness-105'
                  />
                  <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                  <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                    <span className='flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                      <Expand className='h-4 w-4' />
                      Fullscreen
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className='relative rounded-lg border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl'>
            <div className='mb-6 flex items-center justify-between gap-3'>
              <div>
                <h2 className='text-2xl uppercase tracking-[0.2em] text-card'>
                  Payment Plan
                </h2>
              </div>
              <div className='rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary'>
                Flexible Options
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-1 gap-4'>
              {list.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className='group rounded-lg border border-white/10 bg-white/5 p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-cyan-500/20'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary'>
                        <Icon className='h-5 w-5' />
                      </span>
                      <div>
                        <p className='text-sm uppercase tracking-wide text-card'>
                          {item.label}
                        </p>
                        <p className='text-2xl font-semibold text-white'>
                          {item.value}
                        </p>
                      </div>
                    </div>
                    <p className='mt-3 text-sm text-card/80'>{item.detail}</p>
                  </div>
                );
              })}
            </div>
            <div className='mt-6 rounded-lg border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200'>
              * Terms are illustrative. Adjust installments to fit your
              preference upon reservation.
            </div>
          </div>
        </div>
      </div>

      {isPlanOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'
          onClick={() => setIsPlanOpen(false)}
        >
          <div
            className='relative max-h-[90vh] w-full max-w-5xl'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type='button'
              onClick={() => setIsPlanOpen(false)}
              className='absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white shadow-lg backdrop-blur hover:bg-white/25 transition'
              aria-label='Close full screen master plan'
            >
              <X className='h-5 w-5' />
            </button>

            <img
              src={project.masterplanImage}
              alt={`${project.title} master plan full screen`}
              className='max-h-[85vh] w-full object-contain rounded-lg border border-white/10 bg-black shadow-2xl'
            />
          </div>
        </div>
      )}
    </section>
  );
}
