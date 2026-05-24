import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, Film } from 'lucide-react';
import type { ProjectVideo } from '@/lib/api';

interface VideoGalleryProps { videos?: ProjectVideo[]; }

function getEmbedUrl(url: string): string {
  if (!url) return '';
  const u = url.trim();
  if (/youtu\.be|youtube\.com/.test(u)) {
    const id = u.match(/youtu\.be\/([^?]+)/)?.[1] ?? u.match(/[?&]v=([^&]+)/)?.[1] ?? u.match(/embed\/([^?]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1` : u;
  }
  if (/facebook\.com/.test(u)) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=false&autoplay=1`;
  }
  if (/drive\.google\.com/.test(u)) {
    const id = u.match(/\/file\/d\/([^/]+)/)?.[1] ?? u.match(/[?&]id=([^&]+)/)?.[1];
    return id ? `https://drive.google.com/file/d/${id}/preview` : u;
  }
  return u;
}

function getProvider(url: string): 'youtube' | 'facebook' | 'drive' | 'other' {
  if (/youtu\.be|youtube\.com/.test(url)) return 'youtube';
  if (/facebook\.com/.test(url)) return 'facebook';
  if (/drive\.google\.com/.test(url)) return 'drive';
  return 'other';
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos = [] }) => {
  const [selected, setSelected] = useState<ProjectVideo | null>(null);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  const open = useCallback((v: ProjectVideo) => {
    const i = videos.findIndex((p) => p.videoUrl === v.videoUrl);
    setIndex(i >= 0 ? i : 0);
    setSelected(v);
    setPlaying(false);
  }, [videos]);

  const close = useCallback(() => {
    setSelected(null);
    setPlaying(false);
  }, []);

  const navigate = useCallback((dir: 'next' | 'prev') => {
    if (!videos.length) return;
    const next = dir === 'next' ? (index + 1) % videos.length : (index - 1 + videos.length) % videos.length;
    setIndex(next);
    setSelected(videos[next]);
    setPlaying(false);
  }, [index, videos]);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handler);
    };
  }, [selected, navigate, close]);

  if (!videos.length) {
    return (
      <div className='media-reference__empty'>
        <Film className='h-5 w-5' />
        <span>Videos coming soon</span>
      </div>
    );
  }

  const featured = videos[0];

  return (
    <>
      <div className='video-reference'>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          type='button'
          onClick={() => open(featured)}
          className='video-reference__preview group'
        >
          {!imgErrors.has(featured.id ?? 0) ? (
            <img
              src={featured.thumbnailUrl}
              alt={featured.title}
              loading='lazy'
              onError={() => setImgErrors((prev) => new Set(prev).add(featured.id ?? 0))}
            />
          ) : (
            <div className='video-reference__fallback'>
              <Film className='h-10 w-10' />
            </div>
          )}

          <div className='video-reference__overlay'>
            <motion.div
              whileHover={{ scale: 1.08 }}
              className='video-reference__play'
            >
              <Play className='h-8 w-8' />
            </motion.div>
          </div>
        </motion.button>

        <div className='media-reference__actions'>
          <button
            type='button'
            className='media-reference__outline-button'
            onClick={() => open(featured)}
          >
            Watch Full Video
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 md:p-6'
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className='relative w-full max-w-4xl overflow-hidden rounded-lg bg-black shadow-2xl'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 py-3'>
                <span className='text-[11px] font-medium text-white/40'>
                  {index + 1} / {videos.length}
                </span>
                <button
                  onClick={close}
                  type='button'
                  className='flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 backdrop-blur-sm transition hover:bg-white/10 hover:text-white'
                  aria-label='Close'
                >
                  <X className='h-3.5 w-3.5' />
                </button>
              </div>

              {videos.length > 1 && (
                <>
                  <button
                    onClick={() => navigate('prev')}
                    className='absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 backdrop-blur-sm transition hover:bg-white/10 hover:text-white'
                    type='button'
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => navigate('next')}
                    className='absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 backdrop-blur-sm transition hover:bg-white/10 hover:text-white'
                    type='button'
                  >
                    <ChevronRight className='h-4 w-4' />
                  </button>
                </>
              )}

              <div className='aspect-video'>
                {getProvider(selected.videoUrl) !== 'other' && !playing ? (
                  <div className='relative h-full w-full'>
                    <img
                      src={selected.thumbnailUrl}
                      alt={selected.title}
                      className='h-full w-full object-cover'
                    />
                    <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => { e.stopPropagation(); setPlaying(true); }}
                        type='button'
                        className='flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:border-white/50 hover:bg-white/20'
                        aria-label='Play video'
                      >
                        <Play className='ml-0.5 h-6 w-6' />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={getEmbedUrl(selected.videoUrl)}
                    title={selected.title}
                    className='h-full w-full'
                    allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  />
                )}
              </div>

              <div className='bg-gradient-to-t from-black to-black/80 px-4 py-3.5'>
                <h3 className='text-base font-semibold text-white'>{selected.title}</h3>
                {selected.description && (
                  <p className='mt-0.5 text-sm text-white/40'>{selected.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoGallery;
