import React, { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  Variants,
} from 'motion/react';
import { HOTEL_INFO } from '../data/hotelData';

export const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const LUXURY_SPRING = {
  type: 'spring' as const,
  stiffness: 90,
  damping: 24,
  mass: 0.85,
};

export const sectionContainerSpringVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: LUXURY_EASE,
      staggerChildren: 0.08,
      delayChildren: 0.02,
    },
  },
};

export const sectionChildSpringVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: LUXURY_EASE,
    },
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: LUXURY_EASE,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.03,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: LUXURY_EASE,
    },
  },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 16,
  duration = 0.5,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.12 }}
      transition={{
        duration,
        delay,
        ease: LUXURY_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="relative w-full h-[2.5px] bg-[#E9E2D5]/60 overflow-hidden pointer-events-none"
    >
      <motion.div
        style={{ scaleX }}
        className="h-full w-full bg-gradient-to-r from-[#183D32] via-[#C6A66B] to-[#8C6B32] origin-left shadow-[0_0_8px_rgba(198,166,107,0.45)]"
      />
    </div>
  );
}

export function OpeningWelcomeCurtain() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 950);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="opening-curtain"
          initial={{ y: '0%' }}
          exit={{
            y: '-100%',
            transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-hidden="true"
          className="fixed inset-0 z-50 bg-[#191D1B] text-[#F8F6F0] flex flex-col items-center justify-center pointer-events-none border-b-2 border-[#C6A66B]"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.5, ease: LUXURY_EASE }}
            className="flex flex-col items-center text-center px-6"
          >
            <div className="w-14 h-14 rounded-xl bg-white border border-[#C6A66B] shadow-xl overflow-hidden flex items-center justify-start mb-4">
              <img
                src={HOTEL_INFO.logo}
                alt=""
                className="h-11 w-auto max-w-none object-left object-contain ml-1"
              />
            </div>

            <motion.span
              initial={{ opacity: 0, letterSpacing: '0.08em' }}
              animate={{ opacity: 1, letterSpacing: '0.28em' }}
              transition={{ duration: 0.6, ease: LUXURY_EASE }}
              className="text-[11px] uppercase text-[#C6A66B] font-semibold mb-2"
            >
              स्वागतम् · Atithi Devo Bhava
            </motion.span>

            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[#F8F6F0] tracking-tight">
              {HOTEL_INFO.name}
            </h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.65, delay: 0.15, ease: LUXURY_EASE }}
              className="w-40 h-[1.5px] bg-gradient-to-r from-transparent via-[#C6A66B] to-transparent my-3.5 origin-center"
            />

            <p className="text-xs uppercase tracking-[0.22em] text-[#F8F6F0]/75">
              Waidhan · Singrauli · Est. 2011
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
