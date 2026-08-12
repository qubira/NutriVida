"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Loader2, Minus, MessageCircle, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";
import { ProductImage } from "@/components/product-image";
import { formatPrice } from "@/lib/utils";
import { buildOrderWhatsappMessage, buildWhatsappLink } from "@/lib/whatsapp";

export default function CarritoPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, setQuantity, removeItem, clear, subtotal, totalDiscount, total } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [form, setForm] = useState({
    fullName: session?.user?.name ?? "",
    phone: "",
    line1: "",
    district: "",
    city: "",
    reference: "",
    note: "",
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCheckout = async () => {
    if (!session?.user) {
      toast.info("Inicia sesión para continuar con tu pedido");
      router.push("/login?callbackUrl=/carrito");
      return;
    }

    if (!form.fullName || !form.phone || !form.line1 || !form.district || !form.city) {
      toast.error("Completa tus datos de entrega");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          note: form.note || undefined,
          address: {
            fullName: form.fullName,
            phone: form.phone,
            line1: form.line1,
            district: form.district,
            city: form.city,
            reference: form.reference || undefined,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo crear el pedido");
        setLoading(false);
        return;
      }

      const order = data.order;
      const message = buildOrderWhatsappMessage({
        code: order.code,
        items: order.items,
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        total: Number(order.total),
        customerName: form.fullName,
      });

      window.open(buildWhatsappLink(message), "_blank");
      clear();
      toast.success("¡Pedido creado! Confirma los detalles por WhatsApp.");
      router.push(`/pedido/${order.code}`);
    } catch {
      toast.error("Ocurrió un error al crear tu pedido");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-4 py-28 text-center">
        <ShoppingBag size={48} className="text-foreground/20" />
        <h1 className="font-display text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="text-sm text-foreground/60">Explora la tienda y encuentra productos ideales para ti.</p>
        <Link
          href="/tienda"
          className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl font-extrabold">Finalizar pedido</h1>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 rounded-2xl border border-border-soft p-4"
              >
                <ProductImage src={item.image} alt={item.name} size="sm" />
                <div className="flex-1">
                  <Link href={`/producto/${item.slug}`} className="text-sm font-semibold hover:text-brand-600">
                    {item.name}
                  </Link>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-border-soft px-2 py-1">
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-muted"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-xs font-medium">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-muted"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-foreground/40 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <span className="font-display text-base font-bold text-brand-700">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border-soft p-5">
            <h2 className="mb-4 text-sm font-semibold">Datos de entrega</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Nombre completo"
                value={form.fullName}
                onChange={update("fullName")}
                className="rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500 sm:col-span-2"
              />
              <input
                placeholder="Celular / WhatsApp"
                value={form.phone}
                onChange={update("phone")}
                className="rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
              />
              <input
                placeholder="Ciudad"
                value={form.city}
                onChange={update("city")}
                className="rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
              />
              <input
                placeholder="Distrito"
                value={form.district}
                onChange={update("district")}
                className="rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
              />
              <input
                placeholder="Referencia (opcional)"
                value={form.reference}
                onChange={update("reference")}
                className="rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
              />
              <input
                placeholder="Dirección completa"
                value={form.line1}
                onChange={update("line1")}
                className="rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500 sm:col-span-2"
              />
              <textarea
                placeholder="Nota para tu pedido (opcional)"
                value={form.note}
                onChange={update("note")}
                rows={2}
                className="resize-none rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500 sm:col-span-2"
              />
            </div>
          </div>
        </div>

        <div className="h-fit rounded-3xl border border-border-soft bg-surface-muted p-6">
          <h2 className="mb-4 text-sm font-semibold">Resumen del pedido</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-foreground/60">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            {totalDiscount() > 0 && (
              <div className="flex justify-between text-brand-600">
                <span>Descuento</span>
                <span>-{formatPrice(totalDiscount())}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border-soft pt-2 text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(total())}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:brightness-95 disabled:opacity-60"
          >
            {loading ? <Loader2 size={17} className="animate-spin" /> : <MessageCircle size={17} />}
            Confirmar y enviar por WhatsApp
          </button>
          <p className="mt-3 text-center text-[11px] text-foreground/45">
            Al confirmar, se creará tu pedido y se abrirá WhatsApp para coordinar el pago y la entrega.
          </p>
        </div>
      </div>
    </div>
  );
}
