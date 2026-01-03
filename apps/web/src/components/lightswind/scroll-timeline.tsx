'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';
import { Calendar } from 'lucide-react';

export interface TimelineEvent {
  id?: string;
  year?: string;
  title: string;
  subtitle?: string;
  // description: string;
  icon?: React.ReactNode | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
}

export interface ScrollTimelineProps {
  events: TimelineEvent[];
  title?: string;
  subtitle?: string;
  animationOrder?: 'sequential' | 'staggered' | 'simultaneous';
  cardAlignment?: 'alternating' | 'left' | 'right';
  lineColor?: string;
  activeColor?: string;
  progressIndicator?: boolean;
  cardVariant?: 'default' | 'elevated' | 'outlined' | 'filled';
  cardEffect?: 'none' | 'glow' | 'shadow' | 'bounce';
  parallaxIntensity?: number;
  progressLineWidth?: number;
  progressLineCap?: 'round' | 'square';
  dateFormat?: 'text' | 'badge';
  className?: string;
  revealAnimation?: 'fade' | 'slide' | 'scale' | 'flip' | 'none';
  connectorStyle?: 'dots' | 'line' | 'dashed';
  perspective?: boolean;
  darkMode?: boolean;
  smoothScroll?: boolean;
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  {
    year: '2023',
    title: 'Major Achievement',
    subtitle: 'Organization Name',
    /* description:
      'Description of the achievement or milestone reached during this time period.', */
  },
  {
    year: '2022',
    title: 'Important Milestone',
    subtitle: 'Organization Name',
    /*     description: 'Details about this significant milestone and its impact.',
     */
  },
  {
    year: '2021',
    title: 'Key Event',
    subtitle: 'Organization Name',
    /*     description: 'Information about this key event in the timeline.',
     */
  },
];

export const ScrollTimeline = ({
  events = DEFAULT_EVENTS,
  title = 'Timeline',
  subtitle = 'Scroll to explore the journey',
  animationOrder = 'sequential',
  cardAlignment = 'alternating',
  lineColor = 'bg-primary/30',
  activeColor = 'bg-primary',
  progressIndicator = true,
  cardVariant = 'default',
  cardEffect = 'none',
  parallaxIntensity = 0.2,
  progressLineWidth = 2,
  progressLineCap = 'round',
  dateFormat = 'badge',
  revealAnimation = 'fade',
  className = '',
  connectorStyle = 'line',
  perspective = false,
  darkMode = false,
  smoothScroll = true,
}: ScrollTimelineProps) => {
  // Keep API-surface props acknowledged for future styling hooks
  void activeColor;
  void smoothScroll;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const newIndex = Math.floor(v * events.length);
      if (
        newIndex !== activeIndex &&
        newIndex >= 0 &&
        newIndex < events.length
      ) {
        setActiveIndex(newIndex);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, events.length, activeIndex]);

  const getCardVariants = (index: number) => {
    const baseDelay =
      animationOrder === 'simultaneous'
        ? 0
        : animationOrder === 'staggered'
        ? index * 0.2
        : index * 0.3;

    const initialStates = {
      fade: { opacity: 0, y: 20 },
      slide: {
        x:
          cardAlignment === 'left'
            ? -100
            : cardAlignment === 'right'
            ? 100
            : index % 2 === 0
            ? -100
            : 100,
        opacity: 0,
      },
      scale: { scale: 0.8, opacity: 0 },
      flip: { rotateY: 90, opacity: 0 },
      none: { opacity: 1 },
    };

    return {
      initial: initialStates[revealAnimation],
      whileInView: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotateY: 0,
        transition: {
          duration: 0.7,
          delay: baseDelay,
          ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number],
        },
      },
      viewport: { once: false, margin: '-100px' },
    };
  };

  const getConnectorClasses = () => {
    const baseClasses = cn(
      'absolute left-1/2 transform -translate-x-1/2',
      lineColor
    );
    const widthStyle = `w-[${progressLineWidth}px]`;
    switch (connectorStyle) {
      case 'dots':
        return cn(baseClasses, 'w-1 rounded-full');
      case 'dashed':
        return cn(
          baseClasses,
          widthStyle,
          `[mask-image:linear-gradient(to_bottom,black_33%,transparent_33%,transparent_66%,black_66%)] [mask-size:1px_12px]`
        );
      case 'line':
      default:
        return cn(baseClasses, widthStyle);
    }
  };

  const getCardClasses = (index: number) => {
    const baseClasses = 'relative z-30 rounded-lg transition-all duration-300';
    const variantClasses = {
      default: 'bg-card  shadow-sm',
      elevated: 'bg-card border border-border/40 shadow-md',
      outlined: 'bg-card/50 backdrop-blur border-2 border-primary/20',
      filled: 'bg-primary/10 border border-primary/30',
    };
    const effectClasses = {
      none: '',
      glow: 'hover:shadow-[0_0_15px_rgba(var(--primary-rgb)/0.5)]',
      shadow: 'hover:shadow-lg hover:-translate-y-1',
      bounce: 'hover:scale-[1.03] hover:shadow-md active:scale-[0.97]',
    };
    const alignmentClassesDesktop =
      cardAlignment === 'alternating'
        ? index % 2 === 0
          ? 'lg:mr-[calc(50%+20px)]'
          : 'lg:ml-[calc(50%+20px)]'
        : cardAlignment === 'left'
        ? 'lg:mr-auto lg:ml-0'
        : 'lg:ml-auto lg:mr-0';

    return cn(
      baseClasses,
      variantClasses[cardVariant],
      effectClasses[cardEffect],
      alignmentClassesDesktop,
      perspective ? 'transform-gpu will-change-transform' : '',
      'w-full lg:w-[calc(50%-40px)]'
    );
  };

  const renderEventIcon = (icon?: TimelineEvent['icon']) => {
    if (!icon) {
      return <Calendar className='h-8 w-8 mr-2 text-accent' />;
    }

    if (React.isValidElement(icon)) {
      return icon;
    }

    // Handle both function components and forwardRef exotic components (objects)
    if (typeof icon === 'function' || typeof icon === 'object') {
      const IconComponent = icon as React.ComponentType<
        React.SVGProps<SVGSVGElement>
      >;
      return <IconComponent className='h-8 w-8 mr-2 text-card' />;
    }

    return <Calendar className='h-8 w-8 mr-2 text-primary' />;
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        'relative min-h-screen w-full overflow-hidden',
        darkMode ? 'bg-background text-foreground' : '',
        className
      )}
    >
      <div className='text-center py-16 px-4'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>{title}</h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          {subtitle}
        </p>
      </div>

      <div className='relative max-w-6xl mx-auto px-4 pb-20'>
        <div className='relative mx-auto'>
          <div
            className={cn(getConnectorClasses(), 'h-full absolute top-0 z-10')}
          ></div>

          {/* === MODIFICATION START === */}
          {/* Enhanced Progress Indicator with Traveling Glow */}
          {progressIndicator && (
            <>
              {/* The main filled progress line */}
              <motion.div
                className='absolute top-0 z-10'
                style={{
                  height: progressHeight,
                  width: progressLineWidth,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderRadius: progressLineCap === 'round' ? '9999px' : '0px',
                  background: `
          linear-gradient(
            to bottom,
            hsl(var(--foreground)) 0%,
            #f5d27a 50%,
            #e6b65c 100%
          )
        `,
                  // Enhanced shadow for a constant luxury glow effect along the path
                  boxShadow: `
          0 0 12px  hsl(var(--foreground)),
          0 0 24px rgba(245,210,122,0.45),
          0 0 40px rgba(230,182,92,0.25)
        `,
                }}
              />

              {/* The traveling glow "comet" at the head of the line */}
              <motion.div
                className='absolute z-20'
                style={{
                  top: progressHeight,
                  left: '50%',
                  translateX: '-50%',
                  translateY: '-50%', // Center the comet on the line's end point
                }}
              >
                <motion.div
                  className='w-5 h-5 rounded-full' // Size of the comet core
                  style={{
                    background: `
            radial-gradient(
              circle,
               hsl(var(--foreground)) 0%,
              rgba(245,210,122,0.6) 35%,
              rgba(230,182,92,0.25) 55%,
              rgba(230,182,92,0) 75%
            )
          `,
                    // Intense, layered luxury glow effect for the comet
                    boxShadow: `
            0 0 12px 4px  hsl(var(--foreground)),
            0 0 25px 10px rgba(245,210,122,0.5),
            0 0 45px 18px rgba(230,182,92,0.3)
          `,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            </>
          )}
          {/* === MODIFICATION END === */}

          <div className='relative z-20'>
            {events.map((event, index) => {
              const yOffset = useTransform(
                smoothProgress,
                [0, 1],
                [parallaxIntensity * 100, -parallaxIntensity * 100]
              );
              const badgeLabel =
                event.year ?? event.title ?? `Item ${index + 1}`;
              return (
                <div
                  key={event.id || index}
                  ref={(el) => {
                    timelineRefs.current[index] = el;
                  }}
                  className={cn(
                    'relative flex items-center  py-4',
                    'flex-col lg:flex-row',
                    cardAlignment === 'alternating'
                      ? index % 2 === 0
                        ? 'lg:justify-start'
                        : 'lg:flex-row-reverse lg:justify-start'
                      : cardAlignment === 'left'
                      ? 'lg:justify-start'
                      : 'lg:flex-row-reverse lg:justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-1/2 transform -translate-y-1/2 z-30',
                      'left-1/2 -translate-x-1/2'
                    )}
                  >
                    <motion.div
                      className={cn(
                        'w-6 h-6 rounded-full border-4 bg-background flex items-center justify-center',
                        index <= activeIndex
                          ? 'border-foreground/80'
                          : 'border bg-card-foreground/10'
                      )}
                      animate={
                        index <= activeIndex
                          ? {
                              scale: [1, 1.3, 1],
                              boxShadow: [
                                '0 0 0px rgba(99,102,241,0)',
                                '0 0 12px  hsl(var(--foreground))',
                                '0 0 0px rgba(234, 203, 200, 0)',
                              ],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>
                  <motion.div
                    className={cn(getCardClasses(index), 'mt-12 lg:mt-0')}
                    variants={getCardVariants(index)}
                    initial='initial'
                    whileInView='whileInView'
                    viewport={{ once: true, margin: '-100px' }}
                    style={parallaxIntensity > 0 ? { y: yOffset } : undefined}
                  >
                    <Card className='bg-card-foreground border-none text-center'>
                      <CardContent className='p-6 border-none'>
                        {dateFormat === 'badge' ? (
                          <div className='flex flex-col items-center gap-0 justify-center'>
                            {renderEventIcon(event.icon)}
                            <span
                              className={cn(
                                'text-lg font-extrabold',
                                event.color
                                  ? `text-${event.color}`
                                  : 'text-card'
                              )}
                            >
                              {badgeLabel}
                            </span>
                          </div>
                        ) : (
                          <p className='text-2xl font-extrabold text-primary mb-1'>
                            {event.year ?? badgeLabel}
                          </p>
                        )}

                        {event.subtitle && (
                          <p className='text-muted-foreground font-medium mb-1'>
                            {event.subtitle}
                          </p>
                        )}
                        <p className='text-muted-foreground'>
                          {/* {event.description} */}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
