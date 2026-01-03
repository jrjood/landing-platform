'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  type Variants,
  type Transition,
} from 'framer-motion';
import {
  PlayCircle,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Expand,
  Minimize,
  Share2,
} from 'lucide-react';
import type { ProjectVideo } from '@/lib/api';

interface AnimationVariants extends Variants {
  hidden: {
    opacity: number;
    y?: number;
    scale?: number;
    width?: number | string;
  };
  visible: {
    opacity: number;
    y?: number;
    scale?: number;
    width?: number | string;
    transition: Transition;
  };
}

const DEFAULT_ASPECT_RATIO = '2.35 / 1';
const DEFAULT_ASPECT_RATIO_NUM = 2.35;
const MAX_STAGE_HEIGHT = '70vh';

function parseAspectRatio(value?: string): number | null {
  if (!value) return null;
  const parts = value.split('/').map((p) => parseFloat(p.trim()));
  if (parts.length === 2 && parts.every((n) => Number.isFinite(n) && n > 0)) {
    return parts[0] / parts[1];
  }
  const asNumber = parseFloat(value);
  return Number.isFinite(asNumber) && asNumber > 0 ? asNumber : null;
}

type VideoGalleryProps = {
  videos?: ProjectVideo[];
};

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos = [] }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectVideo | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { containerAnimation, itemAnimation } = useScrollAnimation();

  const visibleProjects = videos;

  const openProject = useCallback(
    (project: ProjectVideo) => {
      const projectIndex = visibleProjects.findIndex(
        (p) =>
          (p.id && project.id && p.id === project.id) ||
          p.videoUrl === project.videoUrl
      );
      setCurrentProjectIndex(projectIndex === -1 ? 0 : projectIndex);
      setSelectedProject(project);
      setIsPlaying(false);
      document.body.style.overflow = 'hidden';
    },
    [visibleProjects]
  );

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    setIsPlaying(false);
    setIsFullscreen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const navigateProject = useCallback(
    (direction: 'next' | 'prev') => {
      const len = visibleProjects.length;
      if (!len) return;

      const newIndex =
        direction === 'next'
          ? (currentProjectIndex + 1) % len
          : (currentProjectIndex - 1 + len) % len;

      setCurrentProjectIndex(newIndex);
      setSelectedProject(visibleProjects[newIndex]);
      setIsPlaying(false);
    },
    [currentProjectIndex, visibleProjects]
  );

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handleShare = useCallback(async () => {
    if (!selectedProject) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedProject.title,
          text: selectedProject.description,
          url: window.location.href,
        });
        return;
      } catch {
        // fall back
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // ignore
    }
  }, [selectedProject]);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';

    const u = url.trim();

    // =====================
    // YOUTUBE
    // =====================
    // Supports:
    // - https://www.youtube.com/watch?v=ID
    // - https://youtu.be/ID
    // - https://www.youtube.com/embed/ID
    if (/youtu\.be|youtube\.com/.test(u)) {
      const id =
        u.match(/youtu\.be\/([^?]+)/)?.[1] ??
        u.match(/[?&]v=([^&]+)/)?.[1] ??
        u.match(/embed\/([^?]+)/)?.[1];

      if (!id) return u;

      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }

    // =====================
    // FACEBOOK
    // =====================
    // Supports:
    // - https://www.facebook.com/{page}/videos/{id}/
    // - https://www.facebook.com/watch/?v={id}
    // - https://www.facebook.com/reel/{id}
    if (/facebook\.com/.test(u)) {
      const href = encodeURIComponent(u);
      return `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&autoplay=1`;
    }

    return u;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;

      switch (e.key) {
        case 'Escape':
          closeProject();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateProject('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateProject('next');
          break;
        case ' ':
          e.preventDefault();
          if (!isPlaying) setIsPlaying(true);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          handleShare();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedProject,
    isPlaying,
    navigateProject,
    closeProject,
    handleShare,
    toggleFullscreen,
  ]);

  const handleImageError = (id?: number) => {
    if (id === undefined) return;
    setImageError((prev) => ({ ...prev, [id]: true }));
  };

  // const buttonHoverAnimation = {
  //   scale: 1.05,
  //   transition: { stiffness: 400, damping: 10 },
  // };

  const cardHoverAnimation = {
    scale: 1.03,
    // y: -8,
    transition: { stiffness: 300, damping: 20 },
  };

  return (
    <section
      id='gallery'
      className='py-12 sm:py-10 md:py-10 bg-black relative overflow-hidden'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <motion.div
          ref={ref}
          variants={containerAnimation}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          className='text-center mb-8'
        >
          <div className='flex items-center justify-between mb-4'>
            <motion.div
              className='flex items-center gap-2'
              variants={itemAnimation}
              custom={0.22}
            >
              <span className='inline-flex h-9 w-9 items-center justify-center rounded-lg bg-card/30'>
                <PlayCircle className='h-5 w-5 text-green-main' />
              </span>

              <div>
                <p className='text-sm font-semibold text-card text-start'>
                  Walkthrough
                </p>
                <p className='text-xs text-card text-start'>
                  Explore the project in motion
                </p>
              </div>
            </motion.div>
          </div>
          <motion.p
            variants={itemAnimation}
            className='text-gray-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed'
          >
            <span className='block text-sm text-gray-400 mt-2 text-start'>
              Tip: Open a video, then use ← → to navigate. Space to play. Esc to
              close.
            </span>
          </motion.p>
        </motion.div>

        <motion.div
          layout
          variants={containerAnimation}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 xxl:grid-cols-2 gap-6 sm:gap-4'
        >
          <AnimatePresence mode='popLayout'>
            {visibleProjects.length === 0 && (
              <motion.div
                className='col-span-full flex items-center justify-center rounded border border-gray-800 bg-gray-900/40 py-8 text-gray-300'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No videos available yet.
              </motion.div>
            )}
            {visibleProjects.map((project, idx) => (
              <motion.div
                layout
                key={`${project.id ?? project.videoUrl}-${idx}`}
                variants={itemAnimation}
                className='relative group cursor-pointer rounded overflow-hidden aspect-video bg-gray-900 border border-gray-800'
                onClick={() => openProject(project)}
                whileHover={cardHoverAnimation}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                {!imageError[project.id ?? idx] ? (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                    onError={() => handleImageError(project.id ?? idx)}
                    loading='lazy'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-900 flex items-center justify-center'>
                    <span className='text-gray-400 text-sm font-medium'>
                      Image unavailable
                    </span>
                  </div>
                )}

                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6'>
                  <motion.h3
                    className='text-lg sm:text-xl font-bold text-white mb-1'
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {project.title}
                  </motion.h3>
                  <motion.div
                    className='flex items-center space-x-3'
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className='w-12 h-12 rounded bg-white flex items-center justify-center'>
                      <Play className='text-black ml-1' size={16} />
                    </div>
                    <span className='text-white text-sm font-medium'>
                      View Project
                    </span>
                  </motion.div>
                </div>

                <div className='absolute top-4 left-4 px-3 py-1 bg-black/60 rounded text-xs text-gray-300 uppercase tracking-wider font-semibold'>
                  {project.category || 'video'}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 ${
              isFullscreen ? 'p-0' : ''
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProject}
          >
            <motion.div
              ref={modalRef}
              className={`relative bg-black w-full overflow-y-auto rounded shadow border border-gray-800 ${
                isFullscreen
                  ? 'max-w-none max-h-none h-full rounded-none'
                  : 'max-w-6xl max-h-[90vh]'
              }`}
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent'>
                <div className='flex items-center space-x-4'>
                  <span className='text-white text-sm'>
                    {currentProjectIndex + 1} / {visibleProjects.length}
                  </span>
                  <span className='text-gray-400 text-sm'>
                    Use ← → to navigate
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={handleShare}
                    className='w-10 h-10 rounded bg-gray-800/80 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300'
                    title='Share (S)'
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className='w-10 h-10 rounded bg-gray-800/80 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300'
                    title='Fullscreen (F)'
                  >
                    {isFullscreen ? (
                      <Minimize size={16} />
                    ) : (
                      <Expand size={16} />
                    )}
                  </button>
                  <button
                    onClick={closeProject}
                    className='w-10 h-10 rounded bg-gray-800/80 flex items-center justify-center text-white hover:bg-gray-500 transition-colors duration-300'
                    title='Close (Esc)'
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {visibleProjects.length > 1 && (
                <>
                  <button
                    onClick={() => navigateProject('prev')}
                    className='absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded bg-black/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300'
                    title='Previous'
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => navigateProject('next')}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded bg-black/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300'
                    title='Next'
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {(() => {
                const videoAspect =
                  parseAspectRatio(selectedProject.aspectRatio) ??
                  DEFAULT_ASPECT_RATIO_NUM;
                const containerAspect = DEFAULT_ASPECT_RATIO_NUM;
                const videoStyle =
                  videoAspect >= containerAspect
                    ? { width: '100%', height: 'auto', aspectRatio: videoAspect }
                    : {
                        height: '100%',
                        width: 'auto',
                        maxWidth: '100%',
                        aspectRatio: videoAspect,
                      };

                return (
                  <div
                    className={`relative bg-black ${isFullscreen ? 'h-full' : ''} flex items-center justify-center`}
                    style={
                      !isFullscreen
                        ? { aspectRatio: DEFAULT_ASPECT_RATIO, maxHeight: MAX_STAGE_HEIGHT }
                        : undefined
                    }
                  >
                    {isPlaying ? (
                      <iframe
                        src={getEmbedUrl(selectedProject.videoUrl)}
                        title={selectedProject.title}
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                        style={videoStyle}
                      />
                    ) : (
                      <>
                        <img
                          src={selectedProject.thumbnailUrl}
                          alt={selectedProject.title}
                          className='object-contain'
                          style={videoStyle}
                        />
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <motion.button
                            className='w-16 h-16 sm:w-20 sm:h-20 rounded bg-white flex items-center justify-center'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handlePlayClick}
                            title='Play (Space)'
                          >
                            <Play className='text-black ml-1' size={24} />
                          </motion.button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              {!isFullscreen && (
                <motion.div
                  className='p-6 sm:p-8 md:p-10'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white'>
                    {selectedProject.title}
                  </h2>
                  <p className='text-gray-300 text-sm uppercase tracking-widest mb-4'>
                    {selectedProject.category || 'Video'}
                  </p>
                  <p className='text-gray-200 text-base sm:text-lg leading-relaxed'>
                    {selectedProject.description ||
                      'Watch the walkthrough to explore this project.'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

function useScrollAnimation() {
  const containerAnimation: AnimationVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemAnimation: AnimationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return { containerAnimation, itemAnimation };
}

export default VideoGallery;
