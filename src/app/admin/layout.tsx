import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package } from "lucide-react";
import { auth } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Panel admin</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold">Gestión NutriVida</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          <Link
            href="/admin"
            className="flex shrink-0 items-center gap-2 rounded-2xl border border-border-soft px-4 py-2.5 text-sm font-medium text-foreground/70 transition hover:border-brand-400 hover:text-brand-600"
          >
            <LayoutDashboard size={16} /> Resumen
          </Link>
          <Link
            href="/admin/pedidos"
            className="flex shrink-0 items-center gap-2 rounded-2xl border border-border-soft px-4 py-2.5 text-sm font-medium text-foreground/70 transition hover:border-brand-400 hover:text-brand-600"
          >
            <Package size={16} /> Pedidos
          </Link>
        </nav>

        <div>{children}</div>
      </div>
    </div>
  );
}
