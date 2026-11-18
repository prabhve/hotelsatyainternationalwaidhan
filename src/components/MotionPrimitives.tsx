import React from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  Variants,
} from 'motion/react';

export const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const LUXURY_SPRING = {
  type: 'spring' as const,
  stiffness: 82,
  damping: 22,
  mass: 0.88,
};

export const sectionContainerSpringVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...LUXURY_SPRING,
      staggerChildren: 0.14,
      delayChildren: 0.05,
    },
  },
};

export const sectionChildSpringVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
    scale: 0.992,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: LUXURY_SPRING,
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: LUXURY_SPRING,
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: LUXURY_SPRING,
  },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 24,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              ...LUXURY_SPRING,
              delay,
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#183D32] via-[#C6A66B] to-[#183D32] origin-left z-50 pointer-events-none"
    />
  );
}
