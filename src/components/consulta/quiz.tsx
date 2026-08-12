"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { buildQuizSteps, type QuizStep } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { useCartStore } from "@/lib/cart-store";
import type { ProductCardData } from "@/types/product";
import Link from "next/link";

type ChatMessage = { id: string; from: "bot" | "user"; content: string };

type RecommendationResult = {
  product: ProductCardData;
  reason: string;
};

export function Quiz() {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ summary: string; recommendations: RecommendationResult[] } | null>(
    null
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  const primaryGoal = answers.goal as string | undefined;
  const steps = buildQuizSteps(primaryGoal);
  const currentStep: QuizStep | undefined = steps[stepIndex];

  useEffect(() => {
    if (messages.length === 0 && steps[0]) {
      setMessages([{ id: "q0", from: "bot", content: steps[0].question }]);
    }
  }, [messages.length, steps]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, results]);

  const pushBotQuestion = (step: QuizStep) => {
    setMessages((m) => [...m, { id: `${step.id}-q`, from: "bot", content: step.question }]);
  };

  const advance = (updatedAnswers: Record<string, unknown>) => {
    const nextIndex = stepIndex + 1;
    setAnswers(updatedAnswers);
    setMultiSelected([]);
    setTextValue("");

    if (nextIndex < steps.length) {
      setStepIndex(nextIndex);
      const nextStep = buildQuizSteps(updatedAnswers.goal as string)[nextIndex];
      setTimeout(() => pushBotQuestion(nextStep), 350);
    } else {
      submitQuiz(updatedAnswers);
    }
  };

  const handleSingleSelect = (value: string, label: string) => {
    if (!currentStep) return;
    setMessages((m) => [...m, { id: `${currentStep.id}-a`, from: "user", content: label }]);
    advance({ ...answers, [currentStep.id]: value });
  };

  const handleMultiConfirm = () => {
    if (!currentStep || currentStep.type !== "multi") return;
    const labels =
      multiSelected.length > 0
        ? currentStep.options.filter((o) => multiSelected.includes(o.value)).map((o) => o.label).join(", ")
        : "Prefiero no elegir más objetivos";
    setMessages((m) => [...m, { id: `${currentStep.id}-a`, from: "user", content: labels }]);
    advance({ ...answers, [currentStep.id]: multiSelected });
  };

  const handleTextSubmit = () => {
    if (!currentStep || currentStep.type !== "text") return;
    setMessages((m) => [
      ...m,
      { id: `${currentStep.id}-a`, from: "user", content: textValue.trim() || "Sin comentarios adicionales" },
    ]);
    advance({ ...answers, [currentStep.id]: textValue.trim() });
  };

  const submitQuiz = async (finalAnswers: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: finalAnswers.goal,
          activityLevel: finalAnswers.activityLevel,
          secondaryGoals: finalAnswers.secondaryGoals ?? [],
          diet: finalAnswers.diet,
          sleep: finalAnswers.sleep,
          notes: finalAnswers.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults({ summary: data.summary, recommendations: data.recommendations });
    } catch {
      toast.error("No pudimos generar tus recomendaciones, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  const addAllToCart = () => {
    if (!results) return;
    for (const r of results.recommendations) {
      addItem({
        productId: r.product.id,
        slug: r.product.slug,
        name: r.product.name,
        image: r.product.image,
        price: r.product.price,
        compareAtPrice: r.product.compareAtPrice,
        stock: r.product.stock,
      });
    }
    toast.success("Productos recomendados agregados al carrito");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          <Sparkles size={20} />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold">Consulta personalizada</h1>
          <p className="text-xs text-foreground/50">Tu asistente de bienestar NutriVida</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border-soft bg-surface p-4 sm:p-6">
        <div className="max-h-[55vh] space-y-4 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex items-end gap-2", msg.from === "user" && "flex-row-reverse")}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white",
                    msg.from === "bot" ? "bg-brand-600" : "bg-foreground/20"
                  )}
                >
                  {msg.from === "bot" ? <Sparkles size={13} /> : <User size={13} />}
                </span>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    msg.from === "bot"
                      ? "rounded-bl-sm bg-surface-muted"
                      : "rounded-br-sm bg-brand-600 text-white"
                  )}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-foreground/50">
              <Loader2 size={15} className="animate-spin" /> Analizando tus respuestas...
            </div>
          )}

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-2"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                <Sparkles size={13} />
              </span>
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface-muted px-4 py-2.5 text-sm">
                {results.summary}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {!results && !loading && currentStep && (
          <div className="mt-5 border-t border-border-soft pt-4">
            {currentStep.type === "single" && (
              <div className="flex flex-wrap gap-2">
                {currentStep.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSingleSelect(opt.value, opt.label)}
                    className="rounded-full border border-border-soft px-4 py-2 text-sm font-medium transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-900/20"
                  >
                    <span className="mr-1.5">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {currentStep.type === "multi" && (
              <div>
                <div className="flex flex-wrap gap-2">
                  {currentStep.options.map((opt) => {
                    const selected = multiSelected.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setMultiSelected((sel) =>
                            selected
                              ? sel.filter((v) => v !== opt.value)
                              : sel.length < (currentStep.max ?? 2)
                              ? [...sel, opt.value]
                              : sel
                          )
                        }
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition",
                          selected
                            ? "border-brand-600 bg-brand-600 text-white"
                            : "border-border-soft hover:border-brand-400"
                        )}
                      >
                        <span className="mr-1.5">{opt.emoji}</span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleMultiConfirm}
                  className="mt-3 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Continuar
                </button>
              </div>
            )}

            {currentStep.type === "text" && (
              <div className="flex items-end gap-2">
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={currentStep.placeholder}
                  rows={2}
                  className="flex-1 resize-none rounded-2xl border border-border-soft bg-surface-muted p-3 text-sm outline-none focus:border-brand-500"
                />
                <button
                  onClick={handleTextSubmit}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700"
                  aria-label="Enviar"
                >
                  <Send size={15} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <h2 className="font-display text-lg font-bold">Recomendado para ti</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {results.recommendations.map((r, i) => (
              <div key={r.product.id} className="space-y-2">
                <ProductCard product={r.product} index={i} />
                <p className="px-1 text-xs italic text-brand-600">💡 {r.reason}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={addAllToCart}
              className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Agregar todo al carrito
            </button>
            <Link
              href="/tienda"
              className="rounded-full border border-border-soft px-5 py-2.5 text-sm font-semibold hover:border-brand-400"
            >
              Seguir explorando
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
