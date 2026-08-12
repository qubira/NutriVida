import type { Product, Category, Flavor } from "@/generated/prisma/client";

export type ProductWithCategory = Product & { category: Category; flavor?: Flavor | null };

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  size: string | null;
  flavor: string | null;
  price: number;
  compareAtPrice: number | null;
  discountPercent: number;
  image: string;
  stock: number;
  rating: number;
  reviewCount: number;
  bestSeller: boolean;
  isNew: boolean;
  category: { name: string; slug: string };
};

export function toCardData(p: ProductWithCategory): ProductCardData {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    size: p.size,
    flavor: p.flavor?.name ?? null,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    discountPercent: p.discountPercent,
    image: p.image,
    stock: p.stock,
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    bestSeller: p.bestSeller,
    isNew: p.isNew,
    category: {
      name: p.category.name,
      slug: p.category.slug,
    },
  };
}
