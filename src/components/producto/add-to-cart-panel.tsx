"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function AddToCartPanel({
  product,
  initialWishlisted = false,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
  };
  initialWishlisted?: boolean;
}) {
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [wishLoading, setWishLoading] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
      },
      qty
    );
    toast.success(`${qty} x ${product.name} agregado al carrito`);
  };

  const handleBuyNow = () => {
    const message = [
      `Hola NutriVida! Quiero comprar:`,
      `• ${qty}x ${product.name} — ${formatPrice(product.price * qty)}`,
      ``,
      `¿Me ayudan a coordinar el pago y la entrega?`,
    ].join("\n");
    window.open(buildWhatsappLink(message), "_blank");
  };

  const toggleWishlist = async () => {
    if (!session?.user) {
      toast.info("Inicia sesión para guardar tus favoritos");
      router.push("/login");
      return;
    }
    setWishLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      setWishlisted(data.added);
      toast.success(data.added ? "Agregado a tus favoritos" : "Quitado de favoritos");
    } catch {
      toast.error("No se pudo actualizar favoritos");
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border border-border-soft px-2 py-1.5">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-muted"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-sm font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-muted"
          >
            <Plus size={14} />
          </button>
        </div>
        <span className="text-xs text-foreground/50">{product.stock} disponibles</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
        >
          <ShoppingCart size={17} /> Agregar al carrito
        </button>
        <button
          onClick={toggleWishlist}
          disabled={wishLoading}
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition",
            wishlisted
              ? "border-red-300 bg-red-50 text-red-500"
              : "border-border-soft text-foreground/50 hover:text-red-500"
          )}
          aria-label="Guardar en favoritos"
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <button
        onClick={handleBuyNow}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:brightness-95"
      >
        <MessageCircle size={17} /> Comprar directo por WhatsApp
      </button>
    </div>
  );
}
