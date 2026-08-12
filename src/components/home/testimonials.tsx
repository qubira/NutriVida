"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { StarRating } from "@/components/star-rating";

const TESTIMONIALS = [
  {
    name: "Carla Ramírez",
    role: "Cliente desde 2023",
    text: "El cuestionario me recomendó justo lo que necesitaba para bajar de peso. En 3 meses noté muchísimos cambios y la atención por WhatsApp fue súper rápida.",
  },
  {
    name: "Jorge Medina",
    role: "Deportista amateur",
    text: "Uso los productos de nutrición deportiva antes y después de entrenar. La entrega se coordina fácil y siempre me asesoran bien sobre las dosis.",
  },
  {
    name: "Lucía Fernández",
    role: "Cliente frecuente",
    text: "Amo la crema hidratante de aloe vera. Pedí por WhatsApp y en minutos ya tenía mi pedido confirmado con seguimiento en la web.",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
          Testimonios
        </span>
        <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">
          Historias reales, resultados reales
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative rounded-3xl border border-border-soft bg-surface p-6"
          >
            <Quote className="mb-3 text-brand-200" size={28} />
            <p className="text-sm text-foreground/70">{t.text}</p>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-foreground/50">{t.role}</p>
              </div>
              <StarRating rating={5} showValue={false} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
