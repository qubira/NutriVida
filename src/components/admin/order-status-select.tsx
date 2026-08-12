"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUSES = ["PENDIENTE", "CONFIRMADO", "PREPARANDO", "ENVIADO", "ENTREGADO", "CANCELADO"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [loading, setLoading] = useState(false);

  const handleChange = async (next: string) => {
    setLoading(true);
    const previous = current;
    setCurrent(next);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCurrent(previous);
        toast.error(data.error ?? "No se pudo actualizar el estado");
        return;
      }
      toast.success("Estado actualizado");
      router.refresh();
    } catch {
      setCurrent(previous);
      toast.error("No se pudo actualizar el estado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={current}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
      className={cn(
        "rounded-full border border-border-soft bg-surface px-3 py-1.5 text-xs font-semibold outline-none",
        loading && "opacity-50"
      )}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
