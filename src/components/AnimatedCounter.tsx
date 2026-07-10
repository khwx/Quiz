"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  value,
  duration = 2,
  delay = 0,
  prefix = "",
  suffix = "",
  className = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const startValue = 0;
      const endValue = value;

      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (endValue - startValue) * eased;
        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, value, duration, delay]);

  const formattedValue = decimals > 0 
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString("pt-PT");

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay }}
      className={`tabular-nums ${className}`}
    >
      {prefix}{formattedValue}{suffix}
    </motion.span>
  );
}

// Stat card with animated counter
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  color?: string;
  delay?: number;
}

export function StatCard({
  icon,
  label,
  value,
  suffix = "",
  color = "text-primary",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel rounded-2xl p-5 text-center hover-lift"
    >
      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 ${color}`}>
        {icon}
      </div>
      <div className={`text-3xl font-bold mb-1 ${color}`}>
        <AnimatedCounter value={value} suffix={suffix} delay={delay + 0.2} />
      </div>
      <div className="text-xs text-on-surface-variant/60 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

// Animated progress bar
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  delay?: number;
}

export function AnimatedProgressBar({
  value,
  max = 100,
  color = "from-primary to-secondary",
  height = 8,
  showLabel = false,
  delay = 0,
}: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div ref={ref} className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-xs text-on-surface-variant/60">Progresso</span>
          <span className="text-xs text-primary font-bold">
            <AnimatedCounter value={percentage} suffix="%" delay={delay + 0.3} />
          </span>
        </div>
      )}
      <div
        className="w-full bg-surface-container-highest rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : {}}
          transition={{ duration: 1.5, delay, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${color} relative`}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
