/**
 * Hover Effects Library
 * 
 * Standardized hover effect classes and utilities for consistent interactions.
 */

import { animationClasses } from "./animation-tokens";

export const cardHoverEffects = {
  lift: `${animationClasses.transition.all} ${animationClasses.duration.fast} ${animationClasses.ease.out} ${animationClasses.hover.lift.small}`,
  liftMedium: `${animationClasses.transition.all} ${animationClasses.duration.fast} ${animationClasses.ease.out} ${animationClasses.hover.lift.medium}`,
  scale: `${animationClasses.transition.all} ${animationClasses.duration.fast} ${animationClasses.ease.out} ${animationClasses.hover.scale.subtle} hover:shadow-xl`,
  glow: `${animationClasses.transition.all} ${animationClasses.duration.normal} ${animationClasses.ease.out} hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]`,
  tilt: `${animationClasses.transition.all} ${animationClasses.duration.fast} ${animationClasses.ease.out} hover:rotate-1`,
} as const;

export const buttonHoverEffects = {
  scale: `${animationClasses.transition.all} ${animationClasses.duration.fast} ${animationClasses.ease.out} ${animationClasses.hover.scale.subtle} ${animationClasses.active.scale.subtle}`,
  lift: `${animationClasses.transition.all} ${animationClasses.duration.fast} ${animationClasses.ease.out} hover:-translate-y-0.5 hover:shadow-lg`,
  glow: `${animationClasses.transition.all} ${animationClasses.duration.normal} ${animationClasses.ease.out} hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]`,
} as const;

export const linkHoverEffects = {
  underline: `relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full`,
  color: `${animationClasses.transition.colors} ${animationClasses.duration.fast} hover:text-primary`,
} as const;

export const iconHoverEffects = {
  rotate: `${animationClasses.transition.transform} ${animationClasses.duration.fast} hover:rotate-12`,
  scale: `${animationClasses.transition.transform} ${animationClasses.duration.fast} ${animationClasses.hover.scale.small}`,
  spin: `${animationClasses.transition.transform} ${animationClasses.duration.normal} hover:rotate-180`,
} as const;
