"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { EASE_SETTLE } from "./easing";

type Props = {
  value: number;
  format?: (v: number) => string;
  duration?: number;
  className?: string;
};

/** Tweens a numeric display when the value changes; snaps on reduced motion. */
export function CountUp({
  value,
  format = (v) => v.toLocaleString(),
  duration = 0.8,
  className,
}: Props) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(value);
  const [text, setText] = useState(() => format(value));
  const prev = useRef(value);

  useEffect(() => {
    if (reduced || prev.current === value) {
      mv.set(value);
      setText(format(value));
      prev.current = value;
      return;
    }
    const controls = animate(mv, value, {
      duration,
      ease: EASE_SETTLE as unknown as [number, number, number, number],
      onUpdate: (v) => setText(format(v)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduced, duration, format, mv]);

  const initial = useTransform(mv, format);
  void initial;

  return (
    <span className={`tnum ${className ?? ""}`} aria-live="off">
      {text}
    </span>
  );
}
