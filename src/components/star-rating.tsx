import { Star } from "lucide-react";

export function StarRating({
  rating,
  size = 13,
  showValue = true,
  reviewCount,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(rating);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "fill-accent-400 text-accent-400" : "fill-none text-foreground/20"}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs text-foreground/50">
          {rating.toFixed(1)}
          {reviewCount !== undefined && ` (${reviewCount})`}
        </span>
      )}
    </div>
  );
}
