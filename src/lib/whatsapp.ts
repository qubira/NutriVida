import { formatPrice } from "@/lib/utils";

export const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER ?? "51916133130";

type OrderItemLike = {
  productName: string;
  quantity: number;
  unitPrice: number | string;
};

export function buildOrderWhatsappMessage(params: {
  code: string;
  items: OrderItemLike[];
  subtotal: number;
  discount: number;
  total: number;
  customerName?: string;
}) {
  const { code, items, subtotal, discount, total, customerName } = params;

  const lines = [
    `Hola NutriVida! Soy ${customerName ?? "un cliente"} 👋`,
    `Quiero confirmar mi pedido *${code}*:`,
    "",
    ...items.map(
      (i) => `• ${i.quantity}x ${i.productName} — ${formatPrice(Number(i.unitPrice) * i.quantity)}`
    ),
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
  ];

  if (discount > 0) {
    lines.push(`Descuento: -${formatPrice(discount)}`);
  }

  lines.push(`*Total: ${formatPrice(total)}*`);
  lines.push("");
  lines.push("Quedo atento(a) para coordinar el pago y la entrega. ¡Gracias!");

  return lines.join("\n");
}

export function buildWhatsappLink(message: string, number: string = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
