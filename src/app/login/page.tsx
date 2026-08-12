"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Leaf, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Correo o contraseña incorrectos");
      return;
    }

    toast.success("¡Bienvenido de nuevo!");
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-border-soft bg-surface p-8 shadow-xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Leaf size={22} />
          </span>
          <h1 className="font-display text-2xl font-bold">Bienvenido de nuevo</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Inicia sesión para ver tus pedidos y tu consulta personalizada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/60">Correo electrónico</label>
            <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 focus-within:border-brand-500">
              <Mail size={16} className="text-foreground/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/60">Contraseña</label>
            <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 focus-within:border-brand-500">
              <Lock size={16} className="text-foreground/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Iniciar sesión
          </button>
        </form>

        <div className="mt-5 rounded-xl bg-surface-muted p-3 text-center text-xs text-foreground/50">
          Demo: <span className="font-medium">demo@nutrivida.pe</span> / <span className="font-medium">nutrivida123</span>
        </div>

        <p className="mt-6 text-center text-sm text-foreground/60">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-medium text-brand-600 hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
