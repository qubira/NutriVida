import Link from "next/link";
import { ArrowUpRight, Package, Sparkles, TrendingUp } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { recommendProductsForUser } from "@/lib/recommendations";
import { toCardData } from "@/types/product";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/utils";

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [orders, recommended] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    recommendProductsForUser(userId, 4),
  ]);

  const pending = orders.filter((o) => !["ENTREGADO", "CANCELADO"].includes(o.status)).length;
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border-soft p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40">
            <Package size={16} />
          </span>
          <p className="mt-3 font-display text-2xl font-extrabold">{orders.length}</p>
          <p className="text-xs text-foreground/50">Pedidos recientes</p>
        </div>
        <div className="rounded-2xl border border-border-soft p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-400/20 text-accent-500">
            <TrendingUp size={16} />
          </span>
          <p className="mt-3 font-display text-2xl font-extrabold">{pending}</p>
          <p className="text-xs text-foreground/50">En proceso</p>
        </div>
        <div className="rounded-2xl border border-border-soft p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40">
            <Sparkles size={16} />
          </span>
          <p className="mt-3 font-display text-2xl font-extrabold">{formatPrice(totalSpent)}</p>
          <p className="text-xs text-foreground/50">Invertido en tu bienestar</p>
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-brand-300 bg-brand-50 p-6 dark:bg-brand-900/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold">¿Aún no haces tu consulta personalizada?</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Responde unas preguntas y descubre los productos ideales para tus objetivos.
            </p>
          </div>
          <Link
            href="/consulta"
            className="flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Empezar ahora <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Pedidos recientes</h2>
          <Link href="/dashboard/pedidos" className="text-sm font-medium text-brand-600 hover:underline">
            Ver todos
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="rounded-2xl border border-border-soft p-6 text-center text-sm text-foreground/50">
            Aún no tienes pedidos. ¡Explora la tienda!
          </p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/pedido/${order.code}`}
                className="flex items-center justify-between rounded-2xl border border-border-soft p-4 transition hover:border-brand-400"
              >
                <div>
                  <p className="text-sm font-semibold">{order.code}</p>
                  <p className="text-xs text-foreground/50">
                    {new Date(order.createdAt).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-xs text-brand-600">{order.status}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {recommended.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-lg font-bold">Recomendado para ti</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {recommended.map((p, i) => (
              <ProductCard key={p.id} product={toCardData(p)} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
