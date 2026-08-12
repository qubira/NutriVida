import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export const revalidate = 0;

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
  });

  return (
    <div className="overflow-x-auto rounded-3xl border border-border-soft">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="border-b border-border-soft bg-surface-muted text-left text-xs uppercase tracking-wide text-foreground/50">
          <tr>
            <th className="px-4 py-3">Código</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Productos</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border-soft last:border-0">
              <td className="px-4 py-3">
                <Link href={`/pedido/${order.code}`} className="font-medium text-brand-600 hover:underline">
                  {order.code}
                </Link>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{order.user.name}</p>
                <p className="text-xs text-foreground/50">{order.user.email}</p>
              </td>
              <td className="px-4 py-3 text-foreground/60">{order.items.length} ítem(s)</td>
              <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
              <td className="px-4 py-3 text-foreground/50">
                {new Date(order.createdAt).toLocaleDateString("es-PE")}
              </td>
              <td className="px-4 py-3">
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <p className="p-8 text-center text-sm text-foreground/50">Aún no hay pedidos.</p>
      )}
    </div>
  );
}
