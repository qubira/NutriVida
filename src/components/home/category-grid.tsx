"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ICON_MAP } from "@/components/product-icon";
import { Sparkles } from "lucide-react";

type CategoryData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  colorFrom: string;
  colorTo: string;
  _count: { products: number };
};

export function CategoryGrid({ categories }: { categories: CategoryData[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Categorías
          </span>
          <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">
            Encuentra lo que tu cuerpo necesita
          </h2>
        </div>
        <Link
          href="/tienda"
          className="hidden items-center gap-1 text-sm font-medium text-brand-600 hover:underline sm:flex"
        >
          Ver todo <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat, i) => {
          const Icon = (cat.icon && ICON_MAP[cat.icon]) || Sparkles;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/tienda?categoria=${cat.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border-soft bg-surface p-5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white transition group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${cat.colorFrom}, ${cat.colorTo})`,
                  }}
                >
                  <Icon size={22} strokeWidth={1.7} />
                </div>
                <h3 className="font-display text-sm font-bold">{cat.name}</h3>
                <p className="mt-1 text-xs text-foreground/50">
                  {cat._count.products} productos
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
