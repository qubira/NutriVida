import Link from "next/link";
import { Package } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, cn } from "@/lib/utils";

export const revalidate = 0;

const STATUS_STYLES: Record<string, string> = {
  PENDIENTE: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  CONFIRMADO: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  PREPARANDO: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  ENVIADO: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  ENTREGADO: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300",
  CANCELADO: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export default async function PedidosPage() {
  const session = await auth();

  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border-soft py-20 text-center">
        <Package size={36} className="text-foreground/20" />
        <p className="text-sm text-foreground/60">Todavía no tienes pedidos.</p>
        <Link href="/tienda" className="text-sm font-medium text-brand-600 hover:underline">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/pedido/${order.code}`}
          className="block rounded-2xl border border-border-soft p-5 transition hover:border-brand-400 hover:shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{order.code}</p>
              <p className="text-xs text-foreground/50">
                {new Date(order.createdAt).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · {order.items.length} producto(s)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  STATUS_STYLES[order.status]
                )}
              >
                {order.status}
              </span>
              <span className="font-display text-base font-bold text-brand-700">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
