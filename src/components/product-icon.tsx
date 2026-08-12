"use client";

import { motion } from "framer-motion";
import {
  Scale,
  Dumbbell,
  Zap,
  Leaf,
  Sparkles,
  Blend,
  Coffee,
  Cookie,
  Activity,
  Droplets,
  BatteryCharging,
  Sun,
  Wheat,
  FlaskConical,
  Droplet,
  Sparkle,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Scale,
  Dumbbell,
  Zap,
  Leaf,
  Sparkles,
  Blend,
  Coffee,
  Cookie,
  Activity,
  Droplets,
  BatteryCharging,
  Sun,
  Wheat,
  FlaskConical,
  Droplet,
  Sparkle,
};

const SIZES = {
  sm: { box: "h-14 w-14 rounded-xl", icon: 22 },
  md: { box: "h-24 w-24 rounded-2xl", icon: 36 },
  lg: { box: "h-40 w-40 rounded-3xl", icon: 56 },
  hero: { box: "h-full w-full rounded-[2rem]", icon: 96 },
} as const;

export function ProductIcon({
  icon,
  colorFrom = "#22c55e",
  colorTo = "#15803d",
  size = "md",
  animated = true,
  className = "",
}: {
  icon: string;
  colorFrom?: string;
  colorTo?: string;
  size?: keyof typeof SIZES;
  animated?: boolean;
  className?: string;
}) {
  const Icon = ICON_MAP[icon] ?? Sparkles;
  const dims = SIZES[size];

  const content = (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${dims.box} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
      }}
    >
      <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/20 blur-xl" />
      <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-black/10 blur-2xl" />
      <Icon
        size={dims.icon}
        strokeWidth={1.6}
        className="relative z-10 text-white drop-shadow-lg"
      />
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={size === "hero" ? "block h-full w-full" : "inline-block"}
    >
      {content}
    </motion.div>
  );
}
