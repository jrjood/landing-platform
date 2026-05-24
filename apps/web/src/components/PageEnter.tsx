import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageEnterProps {
  children: ReactNode;
  className?: string;
}

export function PageEnter({ children, className }: PageEnterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
