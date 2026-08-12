import { CheckCircle2, ChefHat, CircleDot, PackageCheck, Truck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "PENDIENTE", label: "Pedido recibido", icon: CircleDot },
  { key: "CONFIRMADO", label: "Confirmado", icon: CheckCircle2 },
  { key: "PREPARANDO", label: "Preparando", icon: ChefHat },
  { key: "ENVIADO", label: "Enviado", icon: Truck },
  { key: "ENTREGADO", label: "Entregado", icon: PackageCheck },
] as const;

export function OrderStatusTimeline({ status }: { status: string }) {
  if (status === "CANCELADO") {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/30">
        <XCircle size={18} /> Este pedido fue cancelado
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-start">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step.key} className={cn("flex items-center", !isLast && "flex-1")}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition",
                  done
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-border-soft bg-surface text-foreground/30"
                )}
              >
                <step.icon size={16} />
              </div>
              <span
                className={cn(
                  "max-w-[70px] text-center text-[10px] font-medium",
                  done ? "text-brand-700" : "text-foreground/40"
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={cn("mx-1 h-0.5 flex-1", i < currentIndex ? "bg-brand-600" : "bg-border-soft")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
