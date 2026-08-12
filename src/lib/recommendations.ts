import { prisma } from "@/lib/prisma";
import { Goal, type ActivityLevel } from "@/generated/prisma/client";

const GOAL_LABELS: Record<Goal, string> = {
  BAJAR_PESO: "bajar de peso",
  GANAR_MASA_MUSCULAR: "ganar masa muscular",
  MAS_ENERGIA: "tener más energía",
  BIENESTAR_DIGESTIVO: "mejorar tu digestión",
  CUIDADO_DE_LA_PIEL: "cuidar tu piel",
  SALUD_GENERAL: "cuidar tu salud en general",
  RENDIMIENTO_DEPORTIVO: "mejorar tu rendimiento deportivo",
  CONTROL_DE_ESTRES: "controlar el estrés",
};

export function goalLabel(goal: Goal) {
  return GOAL_LABELS[goal];
}

/** Productos relacionados a partir de categoría y tags compartidos. */
export async function getRelatedProducts(productId: string, limit = 4) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, categoryId: true, tags: true },
  });

  if (!product) return [];

  const candidates = await prisma.product.findMany({
    where: {
      id: { not: productId },
      active: true,
      OR: [{ categoryId: product.categoryId }, { tags: { hasSome: product.tags } }],
    },
    include: { category: true, flavor: true },
  });

  const scored = candidates
    .map((p) => {
      const sharedTags = p.tags.filter((t) => product.tags.includes(t)).length;
      const sameCategory = p.categoryId === product.categoryId ? 1 : 0;
      const score = sharedTags * 2 + sameCategory + Number(p.rating) / 10;
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.product);

  return scored;
}

/** Recomendaciones a partir de las respuestas del cuestionario inteligente. */
export async function recommendProductsForGoals(
  primaryGoal: Goal,
  secondaryGoals: Goal[] = [],
  activityLevel?: ActivityLevel | null
) {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true, flavor: true },
  });

  const scored = products
    .map((p) => {
      let score = 0;
      const reasons: string[] = [];

      if (p.tags.includes(primaryGoal)) {
        score += 5;
        reasons.push(`Ideal para ${goalLabel(primaryGoal)}`);
      }

      for (const g of secondaryGoals) {
        if (p.tags.includes(g)) {
          score += 2;
          reasons.push(`Ayuda con ${goalLabel(g)}`);
        }
      }

      if (
        activityLevel === "ALTO" &&
        p.tags.some((t) => t === Goal.RENDIMIENTO_DEPORTIVO || t === Goal.GANAR_MASA_MUSCULAR)
      ) {
        score += 1.5;
      }

      if (p.bestSeller) score += 0.8;
      if (p.featured) score += 0.4;
      score += Number(p.rating) / 10;

      return { product: p, score, reason: reasons[0] ?? "Recomendado para tu perfil" };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return scored;
}

/** Recomendaciones personalizadas por historial de compras del usuario. */
export async function recommendProductsForUser(userId: string, limit = 4) {
  const pastItems = await prisma.orderItem.findMany({
    where: { order: { userId } },
    include: { product: true },
  });

  const purchasedIds = new Set(pastItems.map((i) => i.productId));
  const tagFrequency = new Map<Goal, number>();

  for (const item of pastItems) {
    for (const tag of item.product.tags) {
      tagFrequency.set(tag, (tagFrequency.get(tag) ?? 0) + 1);
    }
  }

  if (tagFrequency.size === 0) {
    return prisma.product.findMany({
      where: { active: true, OR: [{ bestSeller: true }, { featured: true }] },
      include: { category: true, flavor: true },
      take: limit,
    });
  }

  const products = await prisma.product.findMany({
    where: { active: true, id: { notIn: Array.from(purchasedIds) } },
    include: { category: true, flavor: true },
  });

  const scored = products
    .map((p) => {
      const score = p.tags.reduce((sum, t) => sum + (tagFrequency.get(t) ?? 0), 0);
      return { product: p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.product);

  if (scored.length < limit) {
    const fillers = await prisma.product.findMany({
      where: { active: true, id: { notIn: [...purchasedIds, ...scored.map((p) => p.id)] } },
      orderBy: { rating: "desc" },
      include: { category: true, flavor: true },
      take: limit - scored.length,
    });
    return [...scored, ...fillers];
  }

  return scored;
}
