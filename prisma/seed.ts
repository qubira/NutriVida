import "dotenv/config";
import { PrismaClient, Goal } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type SeedProduct = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  howToUse: string;
  ingredients: string;
  price: number;
  compareAtPrice: number;
  image: string;
  tags: Goal[];
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
};

const categories: {
  name: string;
  slug: string;
  description: string;
  icon: string;
  colorFrom: string;
  colorTo: string;
  products: SeedProduct[];
}[] = [
  {
    name: "Control de Peso",
    slug: "control-de-peso",
    description: "Fórmulas balanceadas para ayudarte a alcanzar tu peso ideal de forma saludable.",
    icon: "Scale",
    colorFrom: "#22c55e",
    colorTo: "#15803d",
    products: [
      {
        name: "Fórmula 1 Batido Nutricional",
        slug: "formula-1-batido-nutricional",
        shortDescription: "Batido sustitutivo con proteína, vitaminas y minerales.",
        description:
          "Batido nutricional balanceado ideal para reemplazar una comida. Aporta proteína de alta calidad, fibra y una mezcla de 21 vitaminas y minerales para acompañar tu proceso de control de peso sin sacrificar nutrientes esenciales.",
        benefits: [
          "Aporta proteína de calidad en cada porción",
          "21 vitaminas y minerales esenciales",
          "Bajo en azúcar, alto en saciedad",
          "Disponible en varios sabores",
        ],
        howToUse: "Mezcla 2 cucharadas con 250ml de leche descremada o bebida vegetal. Licúa y disfruta como reemplazo de una comida.",
        ingredients: "Proteína de soya, fructosa, vitaminas y minerales, fibra prebiótica.",
        price: 145,
        compareAtPrice: 189,
        image: "Blend",
        tags: [Goal.BAJAR_PESO, Goal.SALUD_GENERAL],
        featured: true,
        bestSeller: true,
        rating: 4.9,
        reviewCount: 312,
      },
      {
        name: "Proteína de Fórmula 3",
        slug: "proteina-formula-3",
        shortDescription: "Complemento proteico en polvo de rápida absorción.",
        description:
          "Complemento en polvo pensado para potenciar el aporte proteico diario, ideal para acompañar el batido nutricional o incorporarlo en otras preparaciones durante tu plan de control de peso.",
        benefits: ["Alto contenido en proteína", "Fácil de mezclar", "Sin sabor, versátil"],
        howToUse: "Agrega 1 cucharada a tu batido o bebida favorita.",
        ingredients: "Proteína de soya aislada.",
        price: 98,
        compareAtPrice: 120,
        image: "Dumbbell",
        tags: [Goal.BAJAR_PESO, Goal.GANAR_MASA_MUSCULAR],
        rating: 4.7,
        reviewCount: 156,
      },
      {
        name: "Té Herbal Concentrado",
        slug: "te-herbal-concentrado",
        shortDescription: "Té instantáneo que aporta un impulso de energía natural.",
        description:
          "Bebida herbal concentrada que se disfruta caliente o fría. Un clásico para acompañar el desayuno y activar el metabolismo con un toque natural de energía.",
        benefits: ["Impulso natural de energía", "Bajo en calorías", "Antioxidantes naturales"],
        howToUse: "Disuelve media cucharadita en agua caliente o fría.",
        ingredients: "Extracto de té verde y negro, cafeína natural.",
        price: 68,
        compareAtPrice: 85,
        image: "Coffee",
        tags: [Goal.BAJAR_PESO, Goal.MAS_ENERGIA],
        bestSeller: true,
        rating: 4.8,
        reviewCount: 204,
      },
      {
        name: "Barritas Proteicas Sabor Chocolate",
        slug: "barritas-proteicas-chocolate",
        shortDescription: "Snack saludable alto en proteína para controlar la ansiedad.",
        description:
          "Barritas crujientes cubiertas de chocolate, perfectas como snack entre comidas para mantener la saciedad y evitar los antojos fuera de horario.",
        benefits: ["Alto en proteína", "Snack práctico", "Sabor delicioso"],
        howToUse: "Consume una unidad como snack a media mañana o media tarde.",
        ingredients: "Proteína de soya, avena, chocolate.",
        price: 55,
        compareAtPrice: 65,
        image: "Cookie",
        tags: [Goal.BAJAR_PESO],
        isNew: true,
        rating: 4.6,
        reviewCount: 88,
      },
    ],
  },
  {
    name: "Nutrición Deportiva",
    slug: "nutricion-deportiva",
    description: "Potencia tu rendimiento, recuperación y desarrollo muscular.",
    icon: "Dumbbell",
    colorFrom: "#3b82f6",
    colorTo: "#1d4ed8",
    products: [
      {
        name: "Rebuild Endurance",
        slug: "rebuild-endurance",
        shortDescription: "Recuperación muscular post entrenamiento intenso.",
        description:
          "Bebida formulada para apoyar la recuperación muscular después de entrenamientos de resistencia, con carbohidratos y proteína en proporción óptima.",
        benefits: ["Favorece la recuperación", "Repone electrolitos", "Ideal post-entrenamiento"],
        howToUse: "Mezcla una porción con agua fría inmediatamente después de entrenar.",
        ingredients: "Carbohidratos complejos, proteína de suero, electrolitos.",
        price: 130,
        compareAtPrice: 160,
        image: "Activity",
        tags: [Goal.RENDIMIENTO_DEPORTIVO, Goal.GANAR_MASA_MUSCULAR],
        featured: true,
        rating: 4.8,
        reviewCount: 97,
      },
      {
        name: "Hydrate Electrolitos",
        slug: "hydrate-electrolitos",
        shortDescription: "Bebida hidratante con electrolitos para el rendimiento.",
        description:
          "Fórmula ligera con electrolitos esenciales para mantenerte hidratado durante sesiones de entrenamiento prolongadas o climas cálidos.",
        benefits: ["Hidratación rápida", "Repone sodio y potasio", "Sabor refrescante"],
        howToUse: "Disuelve en 500ml de agua y consume durante el ejercicio.",
        ingredients: "Sales minerales, extracto de frutas.",
        price: 60,
        compareAtPrice: 75,
        image: "Droplets",
        tags: [Goal.RENDIMIENTO_DEPORTIVO, Goal.MAS_ENERGIA],
        rating: 4.7,
        reviewCount: 64,
      },
      {
        name: "Creatina Monohidratada",
        slug: "creatina-monohidratada",
        shortDescription: "Apoyo para fuerza y potencia muscular.",
        description:
          "Suplemento de creatina en su forma más estudiada, para acompañar rutinas orientadas a fuerza, potencia y ganancia de masa muscular magra.",
        benefits: ["Favorece la fuerza muscular", "Apoya la ganancia de masa magra", "Sin sabor"],
        howToUse: "Consume 1 medida diaria, preferentemente post-entrenamiento.",
        ingredients: "Creatina monohidratada micronizada.",
        price: 110,
        compareAtPrice: 140,
        image: "Zap",
        tags: [Goal.GANAR_MASA_MUSCULAR, Goal.RENDIMIENTO_DEPORTIVO],
        bestSeller: true,
        rating: 4.9,
        reviewCount: 178,
      },
    ],
  },
  {
    name: "Energía & Vitalidad",
    slug: "energia-vitalidad",
    description: "Suplementos para mantenerte activo y con energía todo el día.",
    icon: "Zap",
    colorFrom: "#f59e0b",
    colorTo: "#d97706",
    products: [
      {
        name: "N-R-G Tabletas de Té",
        slug: "nrg-tabletas-te",
        shortDescription: "Tabletas de té para un impulso rápido de energía.",
        description:
          "Prácticas tabletas a base de extracto de té, perfectas para llevar contigo y disfrutar de un impulso de energía en cualquier momento del día.",
        benefits: ["Energía inmediata", "Fácil de transportar", "Bajo en calorías"],
        howToUse: "Toma 1 a 2 tabletas cuando necesites un impulso de energía.",
        ingredients: "Extracto de té, guaraná, cafeína natural.",
        price: 72,
        compareAtPrice: 90,
        image: "BatteryCharging",
        tags: [Goal.MAS_ENERGIA],
        isNew: true,
        rating: 4.6,
        reviewCount: 51,
      },
      {
        name: "Multivitamínico Xtra-Cal",
        slug: "multivitaminico-xtra-cal",
        shortDescription: "Complejo multivitamínico con calcio para el día a día.",
        description:
          "Complemento multivitamínico diseñado para acompañar tu rutina diaria, aportando calcio, vitamina D y otros micronutrientes esenciales.",
        benefits: ["Apoya la salud ósea", "Refuerza tus defensas", "Uso diario"],
        howToUse: "Toma 1 tableta al día junto con una comida.",
        ingredients: "Calcio, vitamina D3, magnesio, zinc.",
        price: 85,
        compareAtPrice: 100,
        image: "Sparkles",
        tags: [Goal.SALUD_GENERAL, Goal.MAS_ENERGIA],
        rating: 4.7,
        reviewCount: 133,
      },
      {
        name: "Complejo B Energizante",
        slug: "complejo-b-energizante",
        shortDescription: "Vitaminas del complejo B para reducir el cansancio.",
        description:
          "Fórmula con vitaminas del complejo B que contribuye a reducir el cansancio y la fatiga, apoyando tu energía diaria de forma natural.",
        benefits: ["Reduce el cansancio", "Apoya el sistema nervioso", "Cápsulas de fácil consumo"],
        howToUse: "Toma 1 cápsula al día con las comidas.",
        ingredients: "Vitaminas B1, B2, B6, B12.",
        price: 58,
        compareAtPrice: 70,
        image: "Sun",
        tags: [Goal.MAS_ENERGIA, Goal.CONTROL_DE_ESTRES],
        rating: 4.5,
        reviewCount: 42,
      },
    ],
  },
  {
    name: "Bienestar Digestivo",
    slug: "bienestar-digestivo",
    description: "Cuida tu salud intestinal y mejora tu digestión.",
    icon: "Leaf",
    colorFrom: "#14b8a6",
    colorTo: "#0f766e",
    products: [
      {
        name: "Herbal Aloe Concentrado",
        slug: "herbal-aloe-concentrado",
        shortDescription: "Bebida concentrada de aloe vera para la digestión.",
        description:
          "Bebida a base de aloe vera que ayuda a mantener una digestión saludable, ideal para incorporar en tu rutina diaria de hidratación.",
        benefits: ["Favorece la digestión", "Refrescante", "Bajo en calorías"],
        howToUse: "Mezcla 2 cucharadas en un vaso de agua fría.",
        ingredients: "Concentrado de aloe vera, extracto de frutas.",
        price: 78,
        compareAtPrice: 95,
        image: "Leaf",
        tags: [Goal.BIENESTAR_DIGESTIVO],
        featured: true,
        rating: 4.8,
        reviewCount: 121,
      },
      {
        name: "Fibra Activa Prebiótica",
        slug: "fibra-activa-prebiotica",
        shortDescription: "Suplemento de fibra para la regularidad intestinal.",
        description:
          "Complemento en polvo con fibra prebiótica soluble, formulado para apoyar la regularidad y el bienestar del sistema digestivo.",
        benefits: ["Favorece la regularidad", "Apoya la flora intestinal", "Sin sabor"],
        howToUse: "Disuelve una porción en agua o en tu batido diario.",
        ingredients: "Fibra prebiótica soluble (inulina).",
        price: 64,
        compareAtPrice: 80,
        image: "Wheat",
        tags: [Goal.BIENESTAR_DIGESTIVO, Goal.SALUD_GENERAL],
        rating: 4.6,
        reviewCount: 77,
      },
      {
        name: "Enzimas Digestivas Plus",
        slug: "enzimas-digestivas-plus",
        shortDescription: "Complejo enzimático para mejorar la absorción de nutrientes.",
        description:
          "Cápsulas con complejo enzimático que apoyan la digestión de proteínas, grasas y carbohidratos, favoreciendo una mejor absorción de nutrientes.",
        benefits: ["Mejora la digestión", "Reduce la pesadez", "Uso antes de comidas"],
        howToUse: "Toma 1 cápsula antes de tus comidas principales.",
        ingredients: "Amilasa, proteasa, lipasa.",
        price: 70,
        compareAtPrice: 88,
        image: "FlaskConical",
        tags: [Goal.BIENESTAR_DIGESTIVO],
        isNew: true,
        rating: 4.7,
        reviewCount: 39,
      },
    ],
  },
  {
    name: "Cuidado Personal",
    slug: "cuidado-personal",
    description: "Línea de cuidado facial y corporal para verte y sentirte bien.",
    icon: "Sparkles",
    colorFrom: "#ec4899",
    colorTo: "#be185d",
    products: [
      {
        name: "Crema Hidratante Facial Aloe",
        slug: "crema-hidratante-facial-aloe",
        shortDescription: "Hidratación facial profunda con extracto de aloe vera.",
        description:
          "Crema facial de rápida absorción formulada con aloe vera para hidratar y suavizar la piel del rostro en tu rutina diaria de cuidado.",
        benefits: ["Hidratación profunda", "Rápida absorción", "Apta para piel sensible"],
        howToUse: "Aplica sobre rostro limpio por la mañana y noche.",
        ingredients: "Extracto de aloe vera, ácido hialurónico, vitamina E.",
        price: 92,
        compareAtPrice: 115,
        image: "Droplet",
        tags: [Goal.CUIDADO_DE_LA_PIEL],
        bestSeller: true,
        rating: 4.9,
        reviewCount: 145,
      },
      {
        name: "Gel Limpiador Facial Suave",
        slug: "gel-limpiador-facial-suave",
        shortDescription: "Limpieza suave que respeta el equilibrio natural de la piel.",
        description:
          "Gel limpiador de uso diario que remueve impurezas sin resecar la piel, formulado para todo tipo de piel.",
        benefits: ["Limpieza profunda", "No reseca la piel", "Uso diario"],
        howToUse: "Aplica sobre rostro húmedo, masajea y enjuaga.",
        ingredients: "Extractos botánicos, glicerina.",
        price: 65,
        compareAtPrice: 80,
        image: "Droplet",
        tags: [Goal.CUIDADO_DE_LA_PIEL],
        rating: 4.6,
        reviewCount: 58,
      },
      {
        name: "Sérum Antiedad Revitalizante",
        slug: "serum-antiedad-revitalizante",
        shortDescription: "Sérum concentrado para piel radiante y firme.",
        description:
          "Fórmula concentrada de rápida absorción que ayuda a mejorar la apariencia de la piel, aportando luminosidad y firmeza.",
        benefits: ["Efecto revitalizante", "Mejora la firmeza", "Textura ligera"],
        howToUse: "Aplica 2-3 gotas sobre rostro limpio antes de la crema hidratante.",
        ingredients: "Colágeno vegetal, vitamina C, ácido hialurónico.",
        price: 135,
        compareAtPrice: 170,
        image: "Sparkle",
        tags: [Goal.CUIDADO_DE_LA_PIEL, Goal.SALUD_GENERAL],
        isNew: true,
        featured: true,
        rating: 4.8,
        reviewCount: 63,
      },
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.consultationRecommendation.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.orderStatusEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        colorFrom: cat.colorFrom,
        colorTo: cat.colorTo,
      },
    });

    for (const p of cat.products) {
      const discountPercent = Math.round(
        ((p.compareAtPrice - p.price) / p.compareAtPrice) * 100
      );
      await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          shortDescription: p.shortDescription,
          description: p.description,
          benefits: p.benefits,
          howToUse: p.howToUse,
          ingredients: p.ingredients,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          discountPercent,
          image: p.image,
          gallery: [p.image],
          tags: p.tags,
          featured: p.featured ?? false,
          bestSeller: p.bestSeller ?? false,
          isNew: p.isNew ?? false,
          rating: p.rating,
          reviewCount: p.reviewCount,
          categoryId: category.id,
        },
      });
    }
  }

  const demoPasswordHash = await bcrypt.hash("nutrivida123", 10);

  await prisma.user.create({
    data: {
      name: "Admin NutriVida",
      email: "admin@nutrivida.pe",
      passwordHash: demoPasswordHash,
      role: "ADMIN",
      phone: "+51916133130",
    },
  });

  await prisma.user.create({
    data: {
      name: "Cliente Demo",
      email: "demo@nutrivida.pe",
      passwordHash: demoPasswordHash,
      role: "CLIENTE",
      phone: "+51999999999",
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
