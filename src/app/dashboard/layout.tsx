import Link from "next/link";
import { Heart, LayoutDashboard, Package, Sparkles, User } from "lucide-react";
import { auth } from "@/auth";

const LINKS = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/pedidos", label: "Mis pedidos", icon: Package },
  { href: "/consulta", label: "Consulta IA", icon: Sparkles },
  { href: "/dashboard/favoritos", label: "Favoritos", icon: Heart },
  { href: "/dashboard/perfil", label: "Mi perfil", icon: User },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Mi panel</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold">
          Hola, {session?.user?.name?.split(" ")[0] ?? "de nuevo"} 👋
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex shrink-0 items-center gap-2 rounded-2xl border border-border-soft px-4 py-2.5 text-sm font-medium text-foreground/70 transition hover:border-brand-400 hover:text-brand-600 lg:shrink"
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div>{children}</div>
      </div>
    </div>
  );
}
