"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_GLIDE } from "@/components/motion/easing";

/**
 * The single considered scroll-reveal moment permitted per marketing page
 * (spec 6.2). Static under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE_GLIDE as unknown as [number, number, number, number] }}
    >
      {children}
    </motion.div>
  );
}
