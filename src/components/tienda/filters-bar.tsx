"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryOption = { slug: string; name: string };

const SORT_OPTIONS = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "descuento", label: "Mayor descuento" },
  { value: "rating", label: "Mejor calificados" },
];

const QUICK_FILTERS = [
  { value: "ofertas", label: "En oferta" },
  { value: "bestsellers", label: "Más vendidos" },
  { value: "nuevos", label: "Nuevos" },
];

export function FiltersBar({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const activeCategory = searchParams.get("categoria") ?? "";
  const activeFilter = searchParams.get("filter") ?? "";
  const activeSort = searchParams.get("sort") ?? "relevancia";

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => {
      router.push(`/tienda?${params.toString()}`);
    });
  };

  const hasActiveFilters = activeCategory || activeFilter || searchParams.get("q");

  return (
    <div className={cn("space-y-4", isPending && "opacity-70")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ q: search || null });
        }}
        className="flex items-center gap-2 rounded-full border border-border-soft bg-surface px-4 py-2.5 shadow-sm"
      >
        <Search size={16} className="text-foreground/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos, beneficios, categorías..."
          className="flex-1 bg-transparent text-sm outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              updateParams({ q: null });
            }}
            className="text-foreground/40 hover:text-foreground/70"
          >
            <X size={15} />
          </button>
        )}
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => updateParams({ categoria: null })}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
            !activeCategory
              ? "bg-brand-600 text-white"
              : "border border-border-soft text-foreground/60 hover:border-brand-400"
          )}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => updateParams({ categoria: activeCategory === cat.slug ? null : cat.slug })}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
              activeCategory === cat.slug
                ? "bg-brand-600 text-white"
                : "border border-border-soft text-foreground/60 hover:border-brand-400"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => updateParams({ filter: activeFilter === f.value ? null : f.value })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                activeFilter === f.value
                  ? "border-accent-500 bg-accent-400/20 text-accent-500"
                  : "border-border-soft text-foreground/55 hover:border-accent-400"
              )}
            >
              {f.label}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={() => router.push("/tienda")}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-red-500 hover:underline"
            >
              <X size={12} /> Limpiar
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-foreground/60">
          <SlidersHorizontal size={14} />
          <select
            value={activeSort}
            onChange={(e) => updateParams({ sort: e.target.value === "relevancia" ? null : e.target.value })}
            className="rounded-full border border-border-soft bg-surface px-3 py-1.5 outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
