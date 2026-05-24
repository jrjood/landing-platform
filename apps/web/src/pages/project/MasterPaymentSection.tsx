import { motion } from 'framer-motion';
import { Project } from '@/lib/api';
import { X } from 'lucide-react';
import { useState } from 'react';
import { fadeUp, viewportOnce } from '@/lib/animations';
import { getAmenityIcon } from '@/lib/amenityIcons';

interface MasterPaymentSectionProps {
  project: Project;
}

export function MasterPaymentSection({ project }: MasterPaymentSectionProps) {
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const amenities = project.amenities || [];

  return (
    <motion.section
      id='master-plan'
      initial='hidden'
      whileInView='visible'
      viewport={viewportOnce}
      className='master-payment'
    >
      <div className='master-payment__full relative px-4'>
        <div className='master-payment__section-head'>
          <p className='brand-eyebrow'>Master Plan</p>
          <h2>Thoughtfully Planned. Beautifully Designed.</h2>
        </div>

        <motion.div variants={fadeUp} custom={0}>
          <div className='master-payment__layout'>
            <aside id='amenities' className='master-payment__amenities'>
              <div className='master-payment__amenities-head'>
                {/* <p className='brand-eyebrow'>Amenities</p> */}
                <h3>Facilities and Amenities</h3>
                {/* <span>{amenities.length || 'Curated'} lifestyle features</span> */}
              </div>

              {amenities.length === 0 ? (
                <p className='master-payment__amenities-empty'>
                  Amenities list will be shared by the sales team.
                </p>
              ) : (
                <div className='master-payment__amenities-list'>
                  {amenities.map((amenity) => {
                    const Icon = getAmenityIcon(amenity.icon);
                    return (
                      <article
                        key={amenity.slug || amenity.name}
                        className='master-payment__amenity-item'
                        title={amenity.description || amenity.name}
                      >
                        <Icon className='h-4 w-4' />
                        <span>{amenity.name}</span>
                      </article>
                    );
                  })}
                </div>
              )}
            </aside>

            <div className='master-payment__plan'>
              <button
                type='button'
                onClick={() => setIsPlanOpen(true)}
                className='master-payment__image-button'
                aria-label='View master plan in full screen'
              >
                <img
                  src={project.masterplanImage}
                  alt={`${project.title} master plan`}
                  loading='lazy'
                />
              </button>
            </div>
          </div>
        </motion.div>
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
    </motion.section>
  );
}
