import { type Variants } from 'framer-motion';

const easing: [number, number, number, number] = [0.23, 1, 0.32, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: easing, delay: i * 0.08 },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: easing, delay: i * 0.08 },
  }),
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: (i: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, ease: easing, delay: i * 0.08 },
  }),
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: (i: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, ease: easing, delay: i * 0.08 },
  }),
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.8, ease: easing, delay: i * 0.08 },
  }),
};

export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { transition: { staggerChildren: 0.06 } },
};

export const staggerSlow: Variants = {
  hidden: { opacity: 1 },
  visible: { transition: { staggerChildren: 0.12 } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: easing, delay: i * 0.08 },
  }),
};

export const slideDownEnter = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: { duration: 0.3, ease: easing },
};

export const springUp = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: 'spring', damping: 25, stiffness: 300 },
};

export const viewportOnce = { once: true, amount: 0.15, margin: '-5% 0px' } as const;

export const viewportLazy = { once: true, amount: 0.05, margin: '-10% 0px' } as const;
