"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";

export function ProfileForm({ name, email, phone }: { name: string; email: string; phone: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ name, phone });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo actualizar tu perfil");
        return;
      }
      toast.success("Perfil actualizado");
      router.refresh();
    } catch {
      toast.error("No se pudo actualizar tu perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground/60">Nombre completo</label>
        <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5">
          <User size={16} className="text-foreground/40" />
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground/60">Correo electrónico</label>
        <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5 opacity-60">
          <Mail size={16} className="text-foreground/40" />
          <span className="text-sm">{email}</span>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground/60">Celular / WhatsApp</label>
        <div className="flex items-center gap-2 rounded-xl border border-border-soft bg-surface-muted px-3 py-2.5">
          <Phone size={16} className="text-foreground/40" />
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        Guardar cambios
      </button>
    </form>
  );
}
