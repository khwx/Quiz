"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  count?: number;
}

export default function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClasses = "bg-surface-container-high/50 animate-pulse";
  
  const variantClasses = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };

  const defaultHeights = {
    text: "h-4",
    circular: "h-12 w-12",
    rectangular: "h-32",
    rounded: "h-24",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          className={`${baseClasses} ${variantClasses[variant]} ${
            !height ? defaultHeights[variant] : ""
          }`}
          style={{ width, height }}
        />
      ))}
    </div>
  );
}

// Preset skeleton layouts
export function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* Avatar */}
      <div className="flex flex-col items-center space-y-4">
        <Skeleton variant="circular" width={96} height={96} />
        <Skeleton variant="text" width={150} />
        <Skeleton variant="text" width={200} />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" className="h-24" />
        ))}
      </div>
      
      {/* Achievements */}
      <div className="space-y-2">
        <Skeleton variant="text" width={120} />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" className="h-20" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={100} />
          <div className="flex-1" />
          <Skeleton variant="text" width={60} />
        </div>
      ))}
    </div>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="glass-panel rounded-xl p-4 space-y-3">
      <Skeleton variant="rounded" className="h-32" />
      <Skeleton variant="text" width={150} />
      <Skeleton variant="text" width={100} />
    </div>
  );
}
