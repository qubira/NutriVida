"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Package,
  Sparkles,
  User,
  ShoppingCart,
  X,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/consulta", label: "Consulta IA" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all",
        scrolled ? "glass shadow-sm" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/30">
            <Leaf size={18} />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            Nutri<span className="gradient-text">Vida</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-border-soft bg-surface/60 px-1 py-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition",
                  active ? "text-white" : "text-foreground/70 hover:text-brand-600"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-brand-600"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  {link.label}
                  {link.href === "/consulta" && (
                    <Sparkles size={12} className={active ? "text-white" : "text-brand-500"} />
                  )}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={openCart}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-surface-muted text-foreground/70 transition hover:text-brand-600"
            aria-label="Abrir carrito"
          >
            <ShoppingCart size={17} />
            {mounted && totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-brand-900">
                {totalItems}
              </span>
            )}
          </button>

          <div className="relative hidden sm:block">
            <button
              onClick={() => setAccountOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-surface-muted text-foreground/70 transition hover:text-brand-600"
              aria-label="Cuenta"
            >
              <User size={17} />
            </button>
            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border-soft bg-surface p-1.5 shadow-xl"
                >
                  {session?.user ? (
                    <>
                      <div className="px-3 py-2">
                        <p className="truncate text-sm font-semibold">{session.user.name}</p>
                        <p className="truncate text-xs text-foreground/50">{session.user.email}</p>
                      </div>
                      <div className="my-1 h-px bg-border-soft" />
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-surface-muted"
                      >
                        <LayoutDashboard size={15} /> Mi panel
                      </Link>
                      <Link
                        href="/dashboard/pedidos"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-surface-muted"
                      >
                        <Package size={15} /> Mis pedidos
                      </Link>
                      {session.user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-surface-muted"
                        >
                          <Sparkles size={15} /> Panel admin
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                      >
                        <LogOut size={15} /> Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <div className="space-y-1 p-1">
                      <Link
                        href="/login"
                        className="block rounded-xl bg-brand-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        href="/registro"
                        className="block rounded-xl px-3 py-2 text-center text-sm text-foreground/70 hover:bg-surface-muted"
                      >
                        Crear cuenta
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-surface-muted md:hidden"
            aria-label="Menú"
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border-soft bg-surface md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-surface-muted"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-1 h-px bg-border-soft" />
              {session?.user ? (
                <>
                  <Link href="/dashboard" className="rounded-xl px-3 py-2 text-sm hover:bg-surface-muted">
                    Mi panel
                  </Link>
                  <Link href="/dashboard/pedidos" className="rounded-xl px-3 py-2 text-sm hover:bg-surface-muted">
                    Mis pedidos
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" className="rounded-xl px-3 py-2 text-sm hover:bg-surface-muted">
                      Panel admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded-xl px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="rounded-xl bg-brand-600 px-3 py-2 text-center text-sm font-medium text-white">
                    Iniciar sesión
                  </Link>
                  <Link href="/registro" className="rounded-xl px-3 py-2 text-center text-sm hover:bg-surface-muted">
                    Crear cuenta
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
