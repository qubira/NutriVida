"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { toast } from "sonner";

export function ReviewForm({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session?.user) {
    return (
      <div className="rounded-2xl border border-dashed border-border-soft p-5 text-center text-sm text-foreground/60">
        <button onClick={() => router.push("/login")} className="font-medium text-brand-600 hover:underline">
          Inicia sesión
        </button>{" "}
        para dejar tu reseña sobre este producto.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 3) {
      toast.error("Escribe un comentario un poco más detallado");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo enviar tu reseña");
        return;
      }
      toast.success("¡Gracias por tu reseña!");
      setComment("");
      router.refresh();
    } catch {
      toast.error("No se pudo enviar tu reseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border-soft p-5">
      <p className="mb-2 text-sm font-semibold">Deja tu reseña</p>
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          const filled = value <= (hoverRating || rating);
          return (
            <button
              key={value}
              type="button"
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
            >
              <Star size={20} className={filled ? "fill-accent-400 text-accent-400" : "text-foreground/20"} />
            </button>
          );
        })}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cuéntanos tu experiencia con este producto..."
        rows={3}
        className="w-full resize-none rounded-xl border border-border-soft bg-surface-muted p-3 text-sm outline-none focus:border-brand-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-3 rounded-full bg-brand-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        Publicar reseña
      </button>
    </form>
  );
}
