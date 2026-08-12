import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-14 w-14 rounded-xl",
  md: "h-24 w-24 rounded-2xl",
  lg: "h-40 w-40 rounded-3xl",
  hero: "h-full w-full rounded-[2rem]",
} as const;

export function ProductImage({
  src,
  alt = "",
  size = "md",
  className = "",
}: {
  src: string | null | undefined;
  alt?: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const box = SIZES[size];

  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden bg-surface-muted text-foreground/25",
          box,
          className
        )}
      >
        <ImageOff size={size === "hero" ? 40 : 20} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden bg-surface-muted", box, className)}>
      {/* Product photos are admin-uploaded data URIs, not static assets —
          next/image's optimizer doesn't apply here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
