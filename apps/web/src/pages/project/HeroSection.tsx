import { motion } from 'framer-motion';
import { MapPin, Building2, Clock, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/api';

interface HeroSectionProps {
  project: Project;
}

export function HeroSection({ project }: HeroSectionProps) {
  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
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
        <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70' />
      </motion.div>

      {/* Content */}
      <div className='relative z-10 container mx-auto px-4 py-32'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='max-w-4xl mx-auto text-center text-white'
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='text-5xl md:text-7xl font-bold mb-6 leading-tight'
          >
            {project.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className='text-xl md:text-2xl mb-8 text-gray-200 font-light'
          >
            {project.subtitle}
          </motion.p>

          {/* Project Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='flex flex-wrap justify-center gap-6 mt-12'
          >
            {/* Location */}
            <div className='flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-lg border border-white/20'>
              <MapPin className='w-5 h-5 text-burgundy' />
              <span className='font-medium'>{project.location}</span>
            </div>

            {/* Type */}
            <div className='flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-lg border border-white/20'>
              <Building2 className='w-5 h-5 text-burgundy' />
              <span className='font-medium'>{project.type}</span>
            </div>

            {/* Status */}
            <div className='flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-lg border border-white/20'>
              <Clock className='w-5 h-5 text-burgundy' />
              <span className='font-medium'>{project.status}</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='mt-8'
          >
            <Button
              size='lg'
              className=' backdrop-blur-md !bg-[#6f132288] !text-white border-[#6f1322cc] px-8 py-6 text-lg transition-all hover:!bg-[#6f1322cc] '
              onClick={() => {
                document
                  .getElementById('contact-form')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get in Touch
              <ArrowDown className='ml-2 w-5 h-5 group-hover:animate-pulse' />
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
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
