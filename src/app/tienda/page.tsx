import { Suspense } from "react";
import { PackageSearch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toCardData } from "@/types/product";
import { ProductCard } from "@/components/product-card";
import { FiltersBar } from "@/components/tienda/filters-bar";
import type { Prisma } from "@/generated/prisma/client";

export const revalidate = 0;

type SearchParams = {
  categoria?: string;
  filter?: string;
  q?: string;
  sort?: string;
};

async function TiendaResults({ searchParams }: { searchParams: SearchParams }) {
  const where: Prisma.ProductWhereInput = { active: true };

  if (searchParams.categoria) {
    where.category = { slug: searchParams.categoria };
  }

  if (searchParams.filter === "ofertas") {
    where.discountPercent = { gte: 10 };
  } else if (searchParams.filter === "bestsellers") {
    where.bestSeller = true;
  } else if (searchParams.filter === "nuevos") {
    where.isNew = true;
  }

  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { shortDescription: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  switch (searchParams.sort) {
    case "precio-asc":
      orderBy = { price: "asc" };
      break;
    case "precio-desc":
      orderBy = { price: "desc" };
      break;
    case "descuento":
      orderBy = { discountPercent: "desc" };
      break;
    case "rating":
      orderBy = { rating: "desc" };
      break;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true, flavor: true },
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <PackageSearch size={40} className="text-foreground/20" />
        <p className="text-foreground/60">No encontramos productos con esos filtros.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={toCardData(p)} index={i} />
      ))}
    </div>
  );
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Tienda</span>
        <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
          Todos nuestros productos
        </h1>
        <p className="mt-2 max-w-xl text-sm text-foreground/60">
          Filtra por categoría, busca por objetivo o descubre las mejores ofertas de la semana.
        </p>
      </div>

      <div className="mb-8">
        <Suspense fallback={<div className="h-32" />}>
          <FiltersBar categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
        </Suspense>
      </div>

      <Suspense fallback={<div className="py-24 text-center text-sm text-foreground/50">Cargando productos...</div>}>
        <TiendaResults searchParams={params} />
      </Suspense>
    </div>
  );
}
