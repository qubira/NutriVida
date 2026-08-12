import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { recommendProductsForGoals, goalLabel } from "@/lib/recommendations";
import { toCardData } from "@/types/product";

const GOAL_VALUES = [
  "BAJAR_PESO",
  "GANAR_MASA_MUSCULAR",
  "MAS_ENERGIA",
  "BIENESTAR_DIGESTIVO",
  "CUIDADO_DE_LA_PIEL",
  "SALUD_GENERAL",
  "RENDIMIENTO_DEPORTIVO",
  "CONTROL_DE_ESTRES",
] as const;

const ACTIVITY_VALUES = ["SEDENTARIO", "LIGERO", "MODERADO", "ALTO"] as const;

const consultationSchema = z.object({
  goal: z.enum(GOAL_VALUES),
  activityLevel: z.enum(ACTIVITY_VALUES),
  secondaryGoals: z.array(z.enum(GOAL_VALUES)).max(2).default([]),
  diet: z.string().optional(),
  sleep: z.string().optional(),
  notes: z.string().max(600).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 }
    );
  }

  const { goal, activityLevel, secondaryGoals, diet, sleep, notes } = parsed.data;

  const scored = await recommendProductsForGoals(goal, secondaryGoals, activityLevel);

  if (scored.length === 0) {
    return NextResponse.json({ error: "No pudimos generar recomendaciones" }, { status: 500 });
  }

  const summaryParts = [
    `Basado en tu objetivo principal de ${goalLabel(goal)}`,
    secondaryGoals.length > 0
      ? ` y tu interés en ${secondaryGoals.map((g) => goalLabel(g)).join(" y ")}`
      : "",
    `, junto con tu nivel de actividad ${activityLevel.toLowerCase()}, `,
    `preparamos una selección de ${scored.length} productos pensados para ti.`,
  ];

  const summary = summaryParts.join("");

  const consultation = await prisma.consultation.create({
    data: {
      userId: session.user.id,
      goal,
      activityLevel,
      answers: { secondaryGoals, diet, sleep, notes },
      summary,
      recommendations: {
        create: scored.map((s) => ({
          productId: s.product.id,
          score: Math.round(s.score * 10),
          reason: s.reason,
        })),
      },
    },
  });

  return NextResponse.json({
    consultationId: consultation.id,
    summary,
    recommendations: scored.map((s) => ({
      product: toCardData(s.product),
      reason: s.reason,
    })),
  });
}
