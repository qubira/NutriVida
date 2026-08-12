import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductImage } from "@/components/product-image";
import { OrderStatusTimeline } from "@/components/order-status-timeline";
import { formatPrice } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const revalidate = 0;

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/pedido/${code}`);

  const order = await prisma.order.findUnique({
    where: { code },
    include: {
      items: { include: { product: { include: { category: true } } } },
      address: true,
    },
  });

  if (!order) notFound();
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40">
          <CheckCircle2 size={28} />
        </span>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">¡Pedido creado con éxito!</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Código de pedido <span className="font-semibold text-brand-600">{order.code}</span>
        </p>
      </div>

      <div className="rounded-3xl border border-border-soft p-6">
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="mt-6 rounded-3xl border border-border-soft p-6">
        <h2 className="mb-4 text-sm font-semibold">Productos</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <ProductImage src={item.productImage} alt={item.productName} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-foreground/50">
                  {item.quantity} x {formatPrice(item.unitPrice)}
                </p>
              </div>
              <span className="text-sm font-semibold">
                {formatPrice(Number(item.unitPrice) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-1.5 border-t border-border-soft pt-4 text-sm">
          <div className="flex justify-between text-foreground/60">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-brand-600">
              <span>Descuento</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {order.address && (
        <div className="mt-6 rounded-3xl border border-border-soft p-6 text-sm">
          <h2 className="mb-2 text-sm font-semibold">Entrega</h2>
          <p className="text-foreground/70">{order.address.fullName} · {order.address.phone}</p>
          <p className="text-foreground/60">
            {order.address.line1}, {order.address.district}, {order.address.city}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-95"
        >
          <MessageCircle size={16} /> Escribir por WhatsApp
        </a>
        <Link
          href="/dashboard/pedidos"
          className="rounded-full border border-border-soft px-6 py-3 text-sm font-semibold hover:border-brand-400"
        >
          Ver todos mis pedidos
        </Link>
      </div>
    </div>
  );
}
