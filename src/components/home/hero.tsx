"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Truck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-300/40 blur-3xl animate-blob dark:bg-brand-700/20" />
        <div
          className="absolute top-40 right-0 h-96 w-96 rounded-full bg-accent-400/30 blur-3xl animate-blob dark:bg-accent-500/10"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl animate-blob dark:bg-brand-600/10"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
            <Sparkles size={13} /> Nueva consulta con IA disponible
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Tu bienestar,
            <br />
            <span className="gradient-text">a un mensaje de distancia</span>
          </h1>

          <p className="mt-5 max-w-lg text-base text-foreground/60 sm:text-lg">
            Descubre productos de nutrición y bienestar con descuentos exclusivos.
            Responde un cuestionario inteligente y recibe recomendaciones a tu medida,
            luego coordina tu pedido directo por WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/tienda"
              className="group flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
            >
              Explorar tienda
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/consulta"
              className="flex items-center gap-2 rounded-full border border-border-soft bg-surface px-6 py-3.5 text-sm font-semibold transition hover:border-brand-400 hover:text-brand-600"
            >
              <Sparkles size={16} className="text-brand-500" />
              Consulta personalizada
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-xs text-foreground/50">
            <span className="flex items-center gap-1.5">
              <Truck size={15} className="text-brand-600" /> Coordinación directa por WhatsApp
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-brand-600" /> Productos originales
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle size={15} className="text-brand-600" /> Asesoría 1 a 1
            </span>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 shadow-2xl shadow-brand-600/30" />
          <div className="absolute inset-3 rounded-[2.5rem] border border-white/20" />

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-6 top-8 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-3 shadow-xl backdrop-blur"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Sparkles size={16} />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-foreground/80">Plan sugerido</p>
              <p className="text-[10px] text-foreground/50">Basado en tus objetivos</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 right-4 rounded-2xl bg-white/95 px-4 py-3 shadow-xl backdrop-blur"
          >
            <p className="text-[11px] font-semibold text-foreground/80">-30% esta semana</p>
            <p className="text-[10px] text-foreground/50">En productos seleccionados</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-8 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white shadow-xl"
          >
            <MessageCircle size={14} /> Pedido confirmado
          </motion.div>
        </div>
      </div>
    </section>
  );
}
