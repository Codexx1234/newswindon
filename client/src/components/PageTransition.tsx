import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  key?: string;
  skipInitialAnimation?: boolean;
}

export function PageTransition({ children, key, skipInitialAnimation = false }: PageTransitionProps) {
  return (
    <motion.div
      key={key}
      initial={skipInitialAnimation ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: skipInitialAnimation ? 0 : 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
