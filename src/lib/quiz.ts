import type { Goal, ActivityLevel } from "@/generated/prisma/client";

export type QuizOption = { value: string; label: string; emoji: string };

export type QuizStep =
  | { id: string; type: "single"; question: string; helper?: string; options: QuizOption[] }
  | { id: string; type: "multi"; question: string; helper?: string; options: QuizOption[]; max?: number }
  | { id: string; type: "text"; question: string; helper?: string; placeholder: string };

export const GOAL_OPTIONS: QuizOption[] = [
  { value: "BAJAR_PESO", label: "Bajar de peso", emoji: "⚖️" },
  { value: "GANAR_MASA_MUSCULAR", label: "Ganar masa muscular", emoji: "💪" },
  { value: "MAS_ENERGIA", label: "Tener más energía", emoji: "⚡" },
  { value: "BIENESTAR_DIGESTIVO", label: "Mejorar mi digestión", emoji: "🌿" },
  { value: "CUIDADO_DE_LA_PIEL", label: "Cuidar mi piel", emoji: "✨" },
  { value: "SALUD_GENERAL", label: "Salud general", emoji: "❤️" },
  { value: "RENDIMIENTO_DEPORTIVO", label: "Rendimiento deportivo", emoji: "🏃" },
  { value: "CONTROL_DE_ESTRES", label: "Controlar el estrés", emoji: "🧘" },
];

export const ACTIVITY_OPTIONS: QuizOption[] = [
  { value: "SEDENTARIO", label: "Sedentario", emoji: "🛋️" },
  { value: "LIGERO", label: "Ligero (1-2 días/sem)", emoji: "🚶" },
  { value: "MODERADO", label: "Moderado (3-4 días/sem)", emoji: "🚴" },
  { value: "ALTO", label: "Alto (5+ días/sem)", emoji: "🏋️" },
];

export const DIET_OPTIONS: QuizOption[] = [
  { value: "equilibrada", label: "Equilibrada", emoji: "🥗" },
  { value: "irregular", label: "Irregular", emoji: "🍔" },
  { value: "procesados", label: "Alta en procesados", emoji: "🍟" },
  { value: "vegetariana", label: "Vegetariana / vegana", emoji: "🥦" },
];

export const SLEEP_OPTIONS: QuizOption[] = [
  { value: "menos-6", label: "Menos de 6 horas", emoji: "😴" },
  { value: "6-7", label: "6 a 7 horas", emoji: "🌙" },
  { value: "7-8", label: "7 a 8 horas", emoji: "⭐" },
  { value: "mas-8", label: "Más de 8 horas", emoji: "🛌" },
];

export function buildQuizSteps(primaryGoal?: string): QuizStep[] {
  return [
    {
      id: "goal",
      type: "single",
      question: "¡Hola! Soy tu asistente NutriVida 🌿 ¿Cuál es tu principal objetivo hoy?",
      options: GOAL_OPTIONS,
    },
    {
      id: "activityLevel",
      type: "single",
      question: "Perfecto. ¿Qué tan activo eres físicamente?",
      options: ACTIVITY_OPTIONS,
    },
    {
      id: "secondaryGoals",
      type: "multi",
      question: "¿Te gustaría trabajar en algo más al mismo tiempo? (opcional, máx. 2)",
      helper: "Puedes elegir hasta 2 objetivos adicionales",
      max: 2,
      options: GOAL_OPTIONS.filter((o) => o.value !== primaryGoal),
    },
    {
      id: "diet",
      type: "single",
      question: "¿Cómo describirías tu alimentación actual?",
      options: DIET_OPTIONS,
    },
    {
      id: "sleep",
      type: "single",
      question: "¿Cuántas horas duermes en promedio?",
      options: SLEEP_OPTIONS,
    },
    {
      id: "notes",
      type: "text",
      question: "Por último, ¿algo más que quieras contarnos? (opcional)",
      placeholder: "Ej: tengo molestias digestivas frecuentes, entreno para una maratón, etc.",
    },
  ];
}

export function goalToLabel(value: string) {
  return GOAL_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export type QuizAnswers = {
  goal: Goal;
  activityLevel: ActivityLevel;
  secondaryGoals: Goal[];
  diet?: string;
  sleep?: string;
  notes?: string;
};
