import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Building2,
  ArrowRight,
  Loader2,
  ArrowDown,
} from 'lucide-react';
import { getProjects, type Project } from '@/lib/api';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-burgundy' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-burgundy/20 to-gray-900'>
        {/* Background Image */}
        <div
          className='absolute inset-0 z-0'
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1649700410676-44e577354d3a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-burgundy/40' />
        </div>

        {/* Content */}
        <div className='relative z-10 container mx-auto px-4 py-20'>
          <div className='flex items-center justify-center'>
            {/* Centered Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='text-white text-center max-w-4xl'
            >
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='mb-8 flex items-center justify-center gap-4'
              >
                <div className='h-20 w-20 flex items-center justify-center '>
                  <img
                    src='/icon_Wealth.png'
                    alt='Wealth Holding'
                    className='h-20 w-20 object-contain'
                  />
                </div>
                <div className='uppercase flex flex-col items-start'>
                  <h1 className='text-2xl font-bold text-white'>
                    Wealth Holding
                  </h1>
                  <p className='text-gray-300'>Developments</p>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className='text-5xl md:text-6xl font-bold mb-6 leading-tight'
              >
                Building Your Future, Today
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className='text-xl text-gray-300 mb-8 leading-relaxed'
              >
                Discover exceptional real estate projects that redefine luxury
                living and investment opportunities in Egypt's most prestigious
                locations.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className='flex flex-wrap gap-4 justify-center'
              >
                <Button
                  size='lg'
                  className=' backdrop-blur-md bg-transparent border-2 text-white px-8 py-6 text-lg group hover:bg-transparent'
                  onClick={() => {
                    document
                      .getElementById('projects')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore Projects
                  <ArrowDown className='ml-2 w-5 h-5 group-hover:animate-pulse group-hover:translate-y-0.5 transition-transform' />
                </Button>
                <Button
                  size='lg'
                  className='!border-2 border-white !text-black bg-white hover:!bg-[#6f1322cc] hover:!text-white hover:border-[#6f1322cc] px-8 py-6 text-lg transition-all'
                  onClick={() => window.open('tel:19640')}
                >
                  Call Us: 19640
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className='grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20'
              >
                <div>
                  <div className='text-4xl font-bold text-burgundy mb-2'>
                    {projects.length}+
                  </div>
                  <div className='text-gray-300'>Projects</div>
                </div>
                <div>
                  <div className='text-4xl font-bold text-burgundy mb-2'>
                    23+
                  </div>
                  <div className='text-gray-300'>Years Experience</div>
                </div>
                <div>
                  <div className='text-4xl font-bold text-burgundy mb-2'>
                    1000+
                  </div>
                  <div className='text-gray-300'>Happy Clients</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

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
      </section>

      {/* Projects Section */}
      <section id='projects' className='py-24 bg-white'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center mb-16'
          >
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-gray-900'>
              Our Projects
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Explore our portfolio of exceptional real estate developments
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/${project.slug}`}>
                  <Card className='group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-burgundy/20'>
                    <div className='relative h-64 overflow-hidden'>
                      <img
                        src={project.heroImage}
                        alt={project.title}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                      <div className='absolute top-4 right-4'>
                        <span className='px-4 py-1.5 bg-burgundy bg-white text-black text-sm font-medium rounded-full'>
                          {project.type}
                        </span>
                      </div>
                    </div>
                    <CardContent className='p-6'>
                      <h3 className='text-2xl font-bold mb-2 group-hover:text-burgundy transition-colors'>
                        {project.title}
                      </h3>
                      <p className='text-gray-600 mb-4 line-clamp-2'>
                        {project.subtitle}
                      </p>
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <MapPin className='w-4 h-4' />
                          <span>{project.location}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Building2 className='w-4 h-4' />
                          <span>{project.status}</span>
                        </div>
                      </div>
                      <div className='mt-4 flex items-center text-burgundy font-medium group-hover:gap-2 transition-all'>
                        View Details
                        <ArrowRight className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform' />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>
                No projects available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
