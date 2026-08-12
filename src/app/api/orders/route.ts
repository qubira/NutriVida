import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderCode } from "@/lib/utils";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1),
  note: z.string().max(500).optional(),
  address: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(6),
    line1: z.string().min(3),
    district: z.string().min(2),
    city: z.string().min(2),
    reference: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const { items, note, address } = parsed.data;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, active: true },
  });

  if (products.length !== items.length) {
    return NextResponse.json({ error: "Algún producto ya no está disponible" }, { status: 400 });
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (item.quantity > product.stock) {
      return NextResponse.json(
        { error: `Solo quedan ${product.stock} unidades de "${product.name}"` },
        { status: 400 }
      );
    }
  }

  let subtotal = 0;
  let total = 0;
  const orderItemsData = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const unitPrice = Number(product.price);
    const compareAt = product.compareAtPrice ? Number(product.compareAtPrice) : unitPrice;
    subtotal += compareAt * item.quantity;
    total += unitPrice * item.quantity;
    return {
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      quantity: item.quantity,
      unitPrice: product.price,
    };
  });

  const discount = subtotal - total;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const savedAddress = await tx.address.create({
        data: { ...address, userId: session.user.id },
      });

      const created = await tx.order.create({
        data: {
          code: generateOrderCode(),
          userId: session.user.id,
          addressId: savedAddress.id,
          subtotal,
          discount,
          total,
          note,
          items: { create: orderItemsData },
          statusEvents: { create: { status: "PENDIENTE", note: "Pedido creado" } },
        },
        include: { items: true },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json(
      { error: "No se pudo crear el pedido, intenta de nuevo" },
      { status: 500 }
    );
  }
}
