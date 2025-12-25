import { motion } from 'framer-motion';
import { MapPin, Building2, Clock, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/api';

interface HeroSectionProps {
  project: Project;
}

export function HeroSection({ project }: HeroSectionProps) {
  return (
    <section className='relative min-h-[50vh] flex items-center justify-center overflow-hidden'>
      {/* Background Image with Parallax Effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className='absolute inset-0 z-0'
      >
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(${project.heroImage})`,
          }}
        />
        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80' />
      </motion.div>

      {/* Content */}
      <div className='relative z-10 container mx-auto px-4 py-20'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='max-w-4xl mx-auto text-center text-white'
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='text-5xl md:text-7xl font-bold mb-6 leading-tight'
          >
            {project.title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className='text-xl md:text-2xl mb-8 text-stone-200 font-light'
          >
            {project.subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='mt-8'
          >
            <Button
              size='lg'
              className=' backdrop-blur-md !bg-white/10 !text-white border-primary px-8 py-6 text-lg transition-all hover:!bg-primary/20 '
              onClick={() => {
                document
                  .getElementById('contact-form')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Request a Call
              <ArrowDown className='ml-2 w-5 h-5 group-hover:animate-pulse' />
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className='absolute bottom-6 left-1/2 transform -translate-x-1/2'
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className='w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2'
            >
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className='w-1.5 h-1.5 bg-white rounded-full'
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
