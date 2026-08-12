"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Plus, Sparkle } from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "@/components/product-image";
import { StarRating } from "@/components/star-rating";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import type { ProductCardData } from "@/types/product";

export function ProductCard({ product, index = 0 }: { product: ProductCardData; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      stock: product.stock,
    });
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
    >
      <Link
        href={`/producto/${product.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border-soft bg-surface p-4 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/5"
      >
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
          {product.discountPercent > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              -{product.discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="flex items-center gap-1 rounded-full bg-blue-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              <Sparkle size={10} /> Nuevo
            </span>
          )}
          {product.bestSeller && (
            <span className="flex items-center gap-1 rounded-full bg-accent-500 px-2.5 py-1 text-[11px] font-bold text-brand-900 shadow-sm">
              <Flame size={10} /> Top ventas
            </span>
          )}
        </div>

        <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-surface-muted">
          <ProductImage
            src={product.image}
            alt={product.name}
            size="hero"
            className="!rounded-2xl transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
            {product.category.name}
          </span>
          {product.size && (
            <span className="rounded-full bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground/50">
              {product.size}
            </span>
          )}
          {product.flavor && (
            <span className="rounded-full bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground/50">
              {product.flavor}
            </span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-2 font-display text-sm font-bold leading-snug">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-foreground/55">{product.shortDescription}</p>

        <div className="mt-2">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            {product.compareAtPrice && (
              <span className="block text-xs text-foreground/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="font-display text-lg font-extrabold text-brand-700">
              {formatPrice(product.price)}
            </span>
          </div>
          <button
            onClick={handleAdd}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition hover:scale-105 hover:bg-brand-700 active:scale-95"
            aria-label="Agregar al carrito"
          >
            <Plus size={18} />
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
