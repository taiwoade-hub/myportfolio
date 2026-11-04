"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Clean, architectural portrait framing for the Hero section.
 * - Zero gradients, zero neon, zero gimmicks
 * - Double hairline border frame with understated depth
 * - Fluid, subtle entrance reveal and calm resting micro-float
 * - Smooth interactive lift and image scaling on hover
 * - Strict reduced-motion support
 */
export function HeroAvatar() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative flex items-center justify-center p-2 sm:p-4 select-none">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
        animate={
          shouldReduceMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                scale: 1,
                y: [-3, 3, -3],
              }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0.4 }
            : {
                opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                y: {
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                y: -4,
                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              }
        }
        className="group relative cursor-pointer"
      >
        {/* Outer architectural hairline ring */}
        <div className="rounded-full p-2 sm:p-2.5 border border-border/70 dark:border-zinc-800/80 bg-card/60 transition-all duration-500 ease-out group-hover:border-foreground/25 group-hover:shadow-2xl">
          {/* Inner crisp circular photo container */}
          <div className="relative h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-[300px] lg:w-[300px] xl:h-[330px] xl:w-[330px] rounded-full overflow-hidden border border-border dark:border-zinc-700/80 bg-muted/30 shadow-inner">
            <Image
              src="/profile.jpg"
              alt="Taiwo Adebola"
              fill
              priority
              sizes="(max-width: 640px) 224px, (max-width: 1024px) 300px, 330px"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
