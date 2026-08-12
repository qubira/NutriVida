"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { ProductImage } from "@/components/product-image";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, setQuantity, removeItem, subtotal, totalDiscount, total } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <ShoppingBag size={20} className="text-brand-600" />
                Tu carrito
              </h2>
              <button
                onClick={close}
                className="rounded-full p-2 text-foreground/60 hover:bg-surface-muted"
                aria-label="Cerrar carrito"
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag size={40} className="text-foreground/20" />
                <p className="text-foreground/60">Tu carrito está vacío por ahora.</p>
                <Link
                  href="/tienda"
                  onClick={close}
                  className="rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
                >
                  Explorar productos
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <ProductImage src={item.image} alt={item.name} size="sm" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/producto/${item.slug}`}
                            onClick={close}
                            className="text-sm font-medium leading-tight hover:text-brand-600"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-foreground/40 hover:text-red-500"
                            aria-label="Quitar producto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-border-soft px-1.5 py-0.5">
                            <button
                              onClick={() => setQuantity(item.productId, item.quantity - 1)}
                              className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-surface-muted"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => setQuantity(item.productId, item.quantity + 1)}
                              className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-surface-muted"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-brand-700">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-border-soft px-5 py-4">
                  <div className="flex justify-between text-sm text-foreground/60">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal())}</span>
                  </div>
                  {totalDiscount() > 0 && (
                    <div className="flex justify-between text-sm text-brand-600">
                      <span>Descuento</span>
                      <span>-{formatPrice(totalDiscount())}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total())}</span>
                  </div>
                  <Link
                    href="/carrito"
                    onClick={close}
                    className="block w-full rounded-full bg-brand-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
                  >
                    Ir a pagar
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
