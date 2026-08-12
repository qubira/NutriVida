import Link from "next/link";
import { Leaf, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-100 text-brand-700 dark:bg-brand-900/40">
        <SearchX size={30} />
      </span>
      <h1 className="font-display text-3xl font-extrabold">Página no encontrada</h1>
      <p className="mt-3 text-sm text-foreground/60">
        Parece que este enlace se marchitó 🌿 Pero tenemos muchos productos esperándote.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Leaf size={15} /> Volver al inicio
        </Link>
        <Link
          href="/tienda"
          className="rounded-full border border-border-soft px-6 py-3 text-sm font-semibold hover:border-brand-400"
        >
          Ir a la tienda
        </Link>
      </div>
    </div>
  );
}
