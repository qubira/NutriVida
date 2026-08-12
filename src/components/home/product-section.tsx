import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { ProductCardData } from "@/types/product";

export function ProductSection({
  eyebrow,
  title,
  products,
  viewAllHref,
}: {
  eyebrow: string;
  title: string;
  products: ProductCardData[];
  viewAllHref: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            {eyebrow}
          </span>
          <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="hidden items-center gap-1 text-sm font-medium text-brand-600 hover:underline sm:flex"
        >
          Ver todo <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
