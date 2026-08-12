import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getRelatedProducts } from "@/lib/recommendations";
import { toCardData } from "@/types/product";
import { ProductImage } from "@/components/product-image";
import { StarRating } from "@/components/star-rating";
import { ProductTabs } from "@/components/producto/product-tabs";
import { AddToCartPanel } from "@/components/producto/add-to-cart-panel";
import { ReviewForm } from "@/components/producto/review-form";
import { ProductCard } from "@/components/product-card";
import { formatPrice, formatProductCode } from "@/lib/utils";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: `${product.name} | NutriVida`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  const product = await prisma.product.findFirst({
    where: { slug, active: true },
    include: {
      category: true,
      flavor: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const [related, wishlisted] = await Promise.all([
    getRelatedProducts(product.id, 4),
    session?.user
      ? prisma.wishlistItem.findUnique({
          where: { userId_productId: { userId: session.user.id, productId: product.id } },
        })
      : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-1.5 text-xs text-foreground/50">
        <Link href="/" className="hover:text-brand-600">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/tienda" className="hover:text-brand-600">Tienda</Link>
        <ChevronRight size={12} />
        <Link href={`/tienda?categoria=${product.category.slug}`} className="hover:text-brand-600">
          {product.category.name}
        </Link>
        <ChevronRight size={12} />
        <span className="text-foreground/70">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2.5rem] bg-surface-muted">
          <ProductImage
            src={product.image}
            alt={product.name}
            size="hero"
            className="!rounded-[2.5rem]"
          />
          {product.discountPercent > 0 && (
            <span className="absolute left-6 top-6 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              -{product.discountPercent}% OFF
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              {product.category.name}
            </span>
            <span className="font-mono text-xs text-foreground/35">{formatProductCode(product.sku)}</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={Number(product.rating)} reviewCount={product.reviewCount} size={16} />
            {product.size && (
              <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground/60">
                {product.size}
              </span>
            )}
            {product.flavor && (
              <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground/60">
                {product.flavor.name}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground/65">{product.shortDescription}</p>

          <div className="mt-5 flex items-end gap-3">
            {product.compareAtPrice && (
              <span className="text-lg text-foreground/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="font-display text-4xl font-extrabold text-brand-700">
              {formatPrice(product.price)}
            </span>
          </div>

          {product.benefits.length > 0 && (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground/70">
                  <Sparkles size={14} className="mt-0.5 shrink-0 text-brand-500" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7">
            <AddToCartPanel
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                image: product.image,
                price: Number(product.price),
                compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
                stock: product.stock,
              }}
              initialWishlisted={!!wishlisted}
            />
          </div>

          <div className="mt-7 flex flex-wrap gap-5 border-t border-border-soft pt-5 text-xs text-foreground/50">
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-brand-600" /> Coordinación por WhatsApp
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-brand-600" /> 100% original
            </span>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <ProductTabs
          tabs={[
            {
              id: "descripcion",
              label: "Descripción",
              content: (
                <p className="max-w-3xl text-sm leading-relaxed text-foreground/70">
                  {product.description}
                </p>
              ),
            },
            {
              id: "uso",
              label: "Cómo usarlo",
              content: (
                <p className="max-w-3xl text-sm leading-relaxed text-foreground/70">
                  {product.howToUse ?? "Consulta con tu asesor NutriVida el modo de uso recomendado."}
                </p>
              ),
            },
            {
              id: "ingredientes",
              label: "Ingredientes",
              content: (
                <p className="max-w-3xl text-sm leading-relaxed text-foreground/70">
                  {product.ingredients ?? "Información disponible al momento de tu consulta."}
                </p>
              ),
            },
            {
              id: "resenas",
              label: `Reseñas (${product.reviews.length})`,
              content: (
                <div className="max-w-2xl space-y-6">
                  <ReviewForm productId={product.id} />
                  {product.reviews.length === 0 ? (
                    <p className="text-sm text-foreground/50">
                      Sé el primero en dejar una reseña de este producto.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {product.reviews.map((r) => (
                        <div key={r.id} className="rounded-2xl border border-border-soft p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">{r.user.name}</p>
                            <StarRating rating={r.rating} showValue={false} size={12} />
                          </div>
                          <p className="mt-2 text-sm text-foreground/65">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-extrabold">También te puede interesar</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={toCardData(p)} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
