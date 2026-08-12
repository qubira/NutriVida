"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function FinalCta() {
  const message = encodeURIComponent(
    "Hola NutriVida! Quiero asesoría para elegir mis productos 🌿"
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[2.5rem] border border-border-soft bg-surface-muted px-6 py-14 sm:px-14"
      >
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
          Habla con nosotros ahora mismo
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/60 sm:text-base">
          ¿Tienes dudas sobre algún producto o quieres una recomendación rápida?
          Escríbenos directo por WhatsApp y te respondemos al toque.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-green-600/20 transition hover:scale-[1.03]"
        >
          <MessageCircle size={18} /> Chatear por WhatsApp
        </a>
      </motion.div>
    </section>
  );
}
