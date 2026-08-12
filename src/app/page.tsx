import { prisma } from "@/lib/prisma";
import { toCardData } from "@/types/product";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductSection } from "@/components/home/product-section";
import { QuizBanner } from "@/components/home/quiz-banner";
import { StatsSection } from "@/components/home/stats-section";
import { Testimonials } from "@/components/home/testimonials";
import { FinalCta } from "@/components/home/final-cta";

export const revalidate = 0;

export default async function Home() {
  const [categories, featured, bestSellers, deals] = await Promise.all([
    prisma.category.findMany({
      where: { active: true },
      include: { _count: { select: { products: { where: { active: true } } } } },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { featured: true, active: true },
      include: { category: true, flavor: true },
      take: 8,
    }),
    prisma.product.findMany({
      where: { bestSeller: true, active: true },
      include: { category: true, flavor: true },
      take: 4,
    }),
    prisma.product.findMany({
      where: { discountPercent: { gte: 15 }, active: true },
      include: { category: true, flavor: true },
      orderBy: { discountPercent: "desc" },
      take: 4,
    }),
  ]);

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} />
      <ProductSection
        eyebrow="Ofertas del momento"
        title="Descuentos que no puedes dejar pasar"
        products={deals.map(toCardData)}
        viewAllHref="/tienda?filter=ofertas"
      />
      <QuizBanner />
      <ProductSection
        eyebrow="Seleccionados para ti"
        title="Productos destacados"
        products={featured.map(toCardData)}
        viewAllHref="/tienda"
      />
      <StatsSection />
      <ProductSection
        eyebrow="Los favoritos"
        title="Más vendidos"
        products={bestSellers.map(toCardData)}
        viewAllHref="/tienda?filter=bestsellers"
      />
      <Testimonials />
      <FinalCta />
    </>
  );
}
