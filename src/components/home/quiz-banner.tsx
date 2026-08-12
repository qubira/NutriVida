"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquareHeart, Sparkles, Target } from "lucide-react";

export function QuizBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-6 py-14 text-white sm:px-14"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur">
              <Sparkles size={13} /> Agente de consulta inteligente
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              ¿No sabes qué producto elegir?
              <br />
              Te lo decimos nosotros.
            </h2>
            <p className="mt-3 max-w-lg text-sm text-white/80 sm:text-base">
              Responde unas preguntas rápidas sobre tus objetivos, tu estilo de vida y tu
              salud. Nuestro asistente analiza tus respuestas y te recomienda los productos
              ideales para ti, al instante.
            </p>
            <Link
              href="/consulta"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-xl transition hover:scale-[1.03]"
            >
              Iniciar mi consulta gratis
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative mx-auto hidden w-full max-w-xs lg:block">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="rounded-2xl bg-white/95 p-4 text-brand-900 shadow-2xl"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-700">
                <Target size={14} /> Tu objetivo
              </div>
              <p className="mt-1 text-sm font-bold">Bajar de peso</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-100">
                <div className="h-full w-3/4 rounded-full bg-brand-600" />
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 0.6 }}
              className="mt-4 ml-8 flex items-center gap-2 rounded-2xl bg-white/95 p-4 text-brand-900 shadow-2xl"
            >
              <MessageSquareHeart size={18} className="text-brand-600" />
              <p className="text-xs font-semibold">3 productos recomendados para ti</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
