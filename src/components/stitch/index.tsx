"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Glass Card Component - Core Stitch pattern
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "secondary" | "tertiary";
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = "",
  variant = "default",
  hover = false,
  onClick,
}: GlassCardProps) {
  const variants = {
    default: "border-white/10",
    primary: "border-primary/30 shadow-[0_0_15px_rgba(208,188,255,0.1)]",
    secondary: "border-secondary/30 shadow-[0_0_15px_rgba(255,176,205,0.1)]",
    tertiary: "border-tertiary/30 shadow-[0_0_15px_rgba(222,183,255,0.1)]",
  };

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`glass-panel rounded-xl ${variants[variant]} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Neon Badge Component
interface NeonBadgeProps {
  children: ReactNode;
  color?: "primary" | "secondary" | "tertiary" | "success" | "error";
  pulse?: boolean;
  className?: string;
}

export function NeonBadge({
  children,
  color = "primary",
  pulse = false,
  className = "",
}: NeonBadgeProps) {
  const colors = {
    primary: "bg-primary/15 text-primary border-primary/30",
    secondary: "bg-secondary/15 text-secondary border-secondary/30",
    tertiary: "bg-tertiary/15 text-tertiary border-tertiary/30",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    error: "bg-red-500/15 text-red-400 border-red-500/30",
  };

  const dotColors = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary",
    success: "bg-emerald-400",
    error: "bg-red-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${colors[color]} ${className}`}
    >
      {pulse && (
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-2 h-2 rounded-full ${dotColors[color]}`}
        />
      )}
      {children}
    </span>
  );
}

// Stat Card with animated counter
interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: "primary" | "secondary" | "tertiary";
  className?: string;
}

export function StitchStatCard({
  icon,
  label,
  value,
  color = "primary",
  className = "",
}: StatCardProps) {
  const colors = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
  };

  return (
    <GlassCard className={`p-4 flex flex-col items-center justify-center text-center ${className}`}>
      <div className={`${colors[color]} mb-2`}>{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      <span className={`font-headline-md text-lg ${colors[color]}`}>{value}</span>
    </GlassCard>
  );
}

// Action Button with neon glow
interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function ActionButton({
  children,
  onClick,
  variant = "primary",
  icon,
  disabled = false,
  fullWidth = false,
  className = "",
}: ActionButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-tertiary-container to-primary-container text-white shadow-[0_0_20px_rgba(160,120,255,0.4)]",
    secondary:
      "glass-panel border-primary/30 text-primary hover:bg-primary/10",
    ghost: "bg-white/5 text-on-surface-variant hover:bg-white/10",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
        fullWidth ? "w-full" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </motion.button>
  );
}

// Avatar with neon ring
interface NeonAvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline" | "away";
  className?: string;
}

export function NeonAvatar({
  src,
  alt,
  size = "md",
  status,
  className = "",
}: NeonAvatarProps) {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  const statusColors = {
    online: "bg-emerald-400",
    offline: "bg-gray-400",
    away: "bg-amber-400",
  };

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div className={`${sizes[size]} rounded-full p-[2px] bg-gradient-to-tr from-primary to-secondary`}>
        <div className="w-full h-full rounded-full bg-surface-container overflow-hidden">
          {src ? (
            <img
              src={src}
              alt={alt || "Avatar"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              👤
            </div>
          )}
        </div>
      </div>
      {status && (
        <div
          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-surface ${statusColors[status]}`}
        />
      )}
    </div>
  );
}

// Section Header
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex justify-between items-end ${className}`}>
      <div>
        <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
        {subtitle && (
          <p className="text-sm text-on-surface-variant">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// Progress Bar with gradient
interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
}

export function GradientProgressBar({
  value,
  max = 100,
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs text-on-surface-variant mb-1">
          <span>Progresso</span>
          <span className="font-bold text-primary">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_8px_rgba(208,188,255,0.5)]"
        />
      </div>
    </div>
  );
}
