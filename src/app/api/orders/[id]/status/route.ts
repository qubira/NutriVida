import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum(["PENDIENTE", "CONFIRMADO", "PREPARANDO", "ENVIADO", "ENTREGADO", "CANCELADO"]),
  note: z.string().max(300).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  const justCancelled = parsed.data.status === "CANCELADO" && existing.status !== "CANCELADO";
  const justReactivated = existing.status === "CANCELADO" && parsed.data.status !== "CANCELADO";

  if (justReactivated) {
    const insufficient = existing.items.find((item) => item.product.stock < item.quantity);
    if (insufficient) {
      return NextResponse.json(
        {
          error: `No se puede reactivar: solo quedan ${insufficient.product.stock} unidades de "${insufficient.productName}" en stock`,
        },
        { status: 400 }
      );
    }
  }

  const order = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id },
      data: {
        status: parsed.data.status,
        statusEvents: { create: { status: parsed.data.status, note: parsed.data.note } },
      },
    });

    if (justCancelled) {
      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    } else if (justReactivated) {
      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    return updated;
  });

  return NextResponse.json({ order });
}
