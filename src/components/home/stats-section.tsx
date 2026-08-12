"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Award, Package, Smile, Star } from "lucide-react";

const STATS = [
  { icon: Smile, value: 2500, suffix: "+", label: "Clientes felices" },
  { icon: Package, value: 8000, suffix: "+", label: "Pedidos entregados" },
  { icon: Star, value: 4.8, suffix: "/5", label: "Calificación promedio", decimals: 1 },
  { icon: Award, value: 7, suffix: " años", label: "De experiencia" },
];

function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return <span ref={ref}>{display}</span>;
}

export function StatsSection() {
  return (
    <section className="border-y border-border-soft bg-surface-muted">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col items-center text-center"
          >
            <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              <stat.icon size={20} />
            </span>
            <p className="font-display text-2xl font-extrabold sm:text-3xl">
              <Counter value={stat.value} decimals={stat.decimals} />
              {stat.suffix}
            </p>
            <p className="mt-1 text-xs text-foreground/55">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
