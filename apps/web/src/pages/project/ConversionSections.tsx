import { motion } from 'framer-motion';
import type { Project } from '@/lib/api';
import { fadeUp, viewportOnce } from '@/lib/animations';
import { getAmenityIcon } from '@/lib/amenityIcons';

interface ConversionSectionsProps {
  project: Project;
}

export function ConversionSections({ project }: ConversionSectionsProps) {
  const amenities = project.amenities || [];

  return (
    <>
      {amenities.length > 0 && (
        <motion.section
          id='amenities'
          initial='hidden'
          whileInView='visible'
          viewport={viewportOnce}
          className='amenities-showcase'
        >
          <div className='container mx-auto px-4'>
            <motion.div
              variants={fadeUp}
              custom={0}
              className='amenities-showcase__header'
            >
              <p className='brand-eyebrow'>Facilities and amenities</p>
              <h2>Thoughtfully Planned. Beautifully Designed.</h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={0.08}
              className='amenities-showcase__panel'
            >
              <div className='amenities-showcase__list'>
                {amenities.map((amenity) => {
                  const Icon = getAmenityIcon(amenity.icon);
                  return (
                    <article
                      key={amenity.slug || amenity.name}
                      className='amenities-showcase__item'
                      title={amenity.description || amenity.name}
                    >
                      <span className='amenities-showcase__icon'>
                        <Icon className='h-4 w-4' />
                      </span>
                      <div>
                        <p>{amenity.name}</p>
                        <small>{amenity.category || 'Lifestyle'}</small>
                      </div>
                    </article>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

    </>
  );
}
