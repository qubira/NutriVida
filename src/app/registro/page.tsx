"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Leaf, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "No se pudo crear la cuenta");
        setLoading(false);
        return;
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (signInRes?.error) {
        toast.success("Cuenta creada. Ahora inicia sesión.");
        router.push("/login");
        return;
      }

      toast.success("¡Cuenta creada! Bienvenido a NutriVida 🌿");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
      toast.error("Ocurrió un error, intenta de nuevo");
    }
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
          <h1 className="font-display text-2xl font-bold">Crea tu cuenta</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Accede a la consulta personalizada y sigue tus pedidos en tiempo real.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/60">Nombre completo</label>
            <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 focus-within:border-brand-500">
              <User size={16} className="text-foreground/40" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="María López"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

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
            <label className="mb-1 block text-xs font-medium text-foreground/60">Celular / WhatsApp</label>
            <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 focus-within:border-brand-500">
              <Phone size={16} className="text-foreground/40" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+51 999 999 999"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
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
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
