import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
  max?: number;
  size?: number;
  className?: string;
  label?: string;
  reviewCount?: string;
  interactive?: boolean;
  onChange?: (value: number) => void;
};

export default function StarRating({
  value,
  max = 5,
  size = 18,
  className = "",
  label,
  reviewCount,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const roundedValue = Math.max(0, Math.min(max, Math.round(value)));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const filled = starValue <= roundedValue;
          const starNode = (
            <Star
              size={size}
              className={filled ? "text-amber-400" : "text-amber-200"}
              fill={filled ? "currentColor" : "none"}
            />
          );

          if (!interactive) {
            return <span key={starValue}>{starNode}</span>;
          }

          return (
            <button
              key={starValue}
              type="button"
              aria-label={`Rate ${starValue} out of ${max} stars`}
              onClick={() => onChange?.(starValue)}
              className="rounded-full transition hover:scale-110"
            >
              {starNode}
            </button>
          );
        })}
      </div>

      {(label || reviewCount) && (
        <div className="text-sm leading-5 text-gray-600">
          {label && <div className="font-semibold text-gray-900">{label}</div>}
          {reviewCount && <div>{reviewCount}</div>}
        </div>
      )}
    </div>
  );
}
