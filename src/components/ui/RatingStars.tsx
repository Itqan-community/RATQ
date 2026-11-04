// src/components/ui/RatingStars.tsx
import React from 'react';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';

interface RatingStarsProps {
  rating: number; // 0 to 5
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 14,
  interactive = false,
  onRatingChange,
}) => {
  return (
    <div className="inline-flex items-center gap-1 select-none">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = rating >= starValue;
        const isHalf = rating > index && rating < starValue;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            className={clsx(
              'transition-transform',
              interactive && 'cursor-pointer hover:scale-110 focus:outline-none'
            )}
            aria-label={`${starValue} من 5 نجوم`}
          >
            <Star
              size={size}
              className={clsx(
                isFilled || isHalf
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-border fill-transparent'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
