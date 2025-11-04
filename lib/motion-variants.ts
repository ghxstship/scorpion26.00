/**
 * Framer Motion Variants Library
 * 
 * Reusable animation variants for consistent motion design.
 * Import and use these variants with Framer Motion components.
 */

import { Variants, Transition } from "framer-motion";
import { animationTokens } from "./animation-tokens";

/**
 * Fade Animations
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

/**
 * Slide Up Animation
 */
export const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

/**
 * Slide Down Animation
 */
export const slideDownVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

/**
 * Slide Left Animation
 */
export const slideLeftVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

/**
 * Slide Right Animation
 */
export const slideRightVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

/**
 * Scale In Animation
 */
export const scaleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

/**
 * Blur In Animation
 */
export const blurVariants: Variants = {
  hidden: { 
    opacity: 0, 
    filter: `blur(${animationTokens.blur.medium}px)`,
  },
  visible: { 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: {
      duration: animationTokens.duration.slow / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    filter: `blur(${animationTokens.blur.small}px)`,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

/**
 * Bounce In Animation
 */
export const bounceVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.3,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: animationTokens.duration.slow / 1000,
      ease: animationTokens.easing.bounce,
    },
  },
};

/**
 * Rotate In Animation
 */
export const rotateVariants: Variants = {
  hidden: { 
    opacity: 0, 
    rotate: -10,
    scale: 0.9,
  },
  visible: { 
    opacity: 1, 
    rotate: 0,
    scale: 1,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Stagger Container
 * Use with staggerChildren to animate child elements sequentially
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: animationTokens.stagger.normal,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger Item
 * Use as child of staggerContainer
 */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Card Hover Variants
 */
export const cardHoverVariants: Variants = {
  rest: { 
    scale: 1, 
    y: 0,
  },
  hover: { 
    scale: 1.02,
    y: -4,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  tap: { 
    scale: 0.98,
    transition: {
      duration: animationTokens.duration.instant / 1000,
    },
  },
};

/**
 * Button Hover Variants
 */
export const buttonHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: animationTokens.duration.instant / 1000,
    },
  },
};

/**
 * Icon Hover Variants
 */
export const iconHoverVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Modal/Dialog Variants
 */
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

/**
 * Backdrop Variants
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: animationTokens.duration.fast / 1000,
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: animationTokens.duration.fast / 1000,
    },
  },
};

/**
 * Drawer Variants (Slide from side)
 */
export const drawerVariants = {
  left: {
    hidden: { x: '-100%' },
    visible: { 
      x: 0,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
    exit: { 
      x: '-100%',
      transition: {
        duration: animationTokens.duration.fast / 1000,
        ease: animationTokens.easing.easeIn,
      },
    },
  },
  right: {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: {
        duration: animationTokens.duration.normal / 1000,
        ease: animationTokens.easing.easeOut,
      },
    },
    exit: { 
      x: '100%',
      transition: {
        duration: animationTokens.duration.fast / 1000,
        ease: animationTokens.easing.easeIn,
      },
    },
  },
};

/**
 * Notification/Toast Variants
 */
export const notificationVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.bounce,
    },
  },
  exit: { 
    opacity: 0,
    x: 100,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

/**
 * Counter Animation (for stats)
 */
export const counterVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationTokens.duration.slow / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
};

/**
 * Pulse Animation (for badges, notifications)
 */
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: animationTokens.easing.easeInOut,
    },
  },
};

/**
 * Shake Animation (for errors)
 */
export const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: animationTokens.duration.slow / 1000,
    },
  },
};

/**
 * Page Transition Variants
 */
export const pageVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 20,
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: animationTokens.duration.normal / 1000,
      ease: animationTokens.easing.easeOut,
    },
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: animationTokens.duration.fast / 1000,
      ease: animationTokens.easing.easeIn,
    },
  },
};

/**
 * Utility function to create custom viewport config
 */
export const createViewportConfig = (
  threshold: keyof typeof animationTokens.viewport = 'partial',
  once: boolean = true
) => ({
  once,
  amount: animationTokens.viewport[threshold],
});

/**
 * Utility function to create custom stagger config
 */
export const createStaggerConfig = (
  speed: keyof typeof animationTokens.stagger = 'normal',
  delay: number = 0
) => ({
  staggerChildren: animationTokens.stagger[speed],
  delayChildren: delay,
});

const motionVariants = {
  fadeVariants,
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  scaleVariants,
  blurVariants,
  bounceVariants,
  rotateVariants,
  staggerContainerVariants,
  staggerItemVariants,
  cardHoverVariants,
  buttonHoverVariants,
  iconHoverVariants,
  modalVariants,
  backdropVariants,
  drawerVariants,
  notificationVariants,
  counterVariants,
  pulseVariants,
  shakeVariants,
  pageVariants,
};

export default motionVariants;
