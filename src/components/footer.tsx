import Link from "next/link";
import Image from "next/image";
import { AtSign, Share2, MessageCircle, MapPin, Mail } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-soft bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo-nutrivida.png" alt="NutriVida" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="font-display text-xl font-extrabold">
                Nutri<span className="gradient-text">Vida</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-foreground/60">
              Bienestar y nutrición con descuentos exclusivos, asesoría personalizada y
              atención directa por WhatsApp.
            </p>
            <div className="mt-4 flex gap-2">
              {[AtSign, Share2, MessageCircle].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-soft text-foreground/50 transition hover:border-brand-500 hover:text-brand-600"
                >
                  <Icon size={16} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/50">
              Tienda
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link href="/tienda" className="hover:text-brand-600">Todos los productos</Link></li>
              <li><Link href="/tienda?filter=ofertas" className="hover:text-brand-600">Ofertas</Link></li>
              <li><Link href="/tienda?filter=bestsellers" className="hover:text-brand-600">Más vendidos</Link></li>
              <li><Link href="/consulta" className="hover:text-brand-600">Consulta personalizada</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/50">
              Mi cuenta
            </h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link href="/dashboard" className="hover:text-brand-600">Mi panel</Link></li>
              <li><Link href="/dashboard/pedidos" className="hover:text-brand-600">Seguimiento de pedidos</Link></li>
              <li><Link href="/login" className="hover:text-brand-600">Iniciar sesión</Link></li>
              <li><Link href="/registro" className="hover:text-brand-600">Crear cuenta</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/50">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li className="flex items-center gap-2">
                <MessageCircle size={15} className="text-brand-600" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-600"
                >
                  +{WHATSAPP_NUMBER}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-brand-600" /> hola@nutrivida.pe
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-brand-600" /> Perú
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border-soft pt-6 text-xs text-foreground/50 sm:flex-row">
          <p>© {new Date().getFullYear()} NutriVida. Distribuidor independiente de productos de bienestar.</p>
          <p>Hecho con 💚 para una vida más saludable.</p>
        </div>
      </div>
    </footer>
  );
}
