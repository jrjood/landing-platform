import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PhoneCall } from 'lucide-react';

interface StickyLeadBarProps {
  projectSlug: string;
  projectTitle: string;
}

export function StickyLeadBar({ projectTitle }: StickyLeadBarProps) {
  const [showAfterHero, setShowAfterHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector<HTMLElement>('.project-hero');
      if (!hero) {
        setShowAfterHero(window.scrollY > window.innerHeight * 0.85);
        return;
      }

      setShowAfterHero(hero.getBoundingClientRect().bottom <= 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToLeadForm = () => {
    const target = document.getElementById('contact-form');
    if (!target) return;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {showAfterHero && (
        <motion.div
          initial={{ y: 44, x: 18, opacity: 0, scale: 0.78 }}
          animate={{ y: 0, x: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, x: 10, opacity: 0, scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 28,
            mass: 0.7,
          }}
          className='fixed bottom-5 right-5 z-40 md:bottom-6 md:right-6'
        >
          <button
            type='button'
            onClick={scrollToLeadForm}
            className='lead-form__submit project-hero__enquire project-floating-enquire'
            aria-label={`Enquire now about ${projectTitle}`}
          >
            <PhoneCall className='h-4 w-4' />
            <span>Enquire Now</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
