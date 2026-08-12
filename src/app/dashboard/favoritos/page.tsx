import Link from "next/link";
import { Heart } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toCardData } from "@/types/product";
import { ProductCard } from "@/components/product-card";

export const revalidate = 0;

export default async function FavoritosPage() {
  const session = await auth();

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session!.user.id },
    include: { product: { include: { category: true, flavor: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border-soft py-20 text-center">
        <Heart size={36} className="text-foreground/20" />
        <p className="text-sm text-foreground/60">Aún no guardaste productos favoritos.</p>
        <Link href="/tienda" className="text-sm font-medium text-brand-600 hover:underline">
          Explorar tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {wishlist.map((w, i) => (
        <ProductCard key={w.id} product={toCardData(w.product)} index={i} />
      ))}
    </div>
  );
}
