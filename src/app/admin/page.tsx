import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminOverviewPage() {
  const [orderCount, userCount, productCount, orders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.findMany({ where: { status: { not: "CANCELADO" } } }),
  ]);

  const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const pending = orders.filter((o) => o.status === "PENDIENTE").length;

  const stats = [
    { label: "Ingresos totales", value: formatPrice(revenue), icon: DollarSign },
    { label: "Pedidos totales", value: orderCount, icon: ShoppingBag },
    { label: "Pedidos pendientes", value: pending, icon: Package },
    { label: "Clientes registrados", value: userCount, icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border-soft p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40">
              <s.icon size={16} />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-foreground/50">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-foreground/50">
        Catálogo activo: {productCount} productos publicados.
      </p>
    </div>
  );
}
