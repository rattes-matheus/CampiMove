import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
    rating: number;
    totalRatings?: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, totalRatings, interactive = false, onRate }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={() => interactive && onRate && onRate(star)}
                        disabled={!interactive}
                    >
                        <Star
                            className={`h-5 w-5 ${star <= fullStars || (hasHalfStar && star === fullStars + 1) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                        />
                    </button>
                ))}
            </div>
            {totalRatings !== undefined && (
                <span className="ml-2 text-sm text-gray-500">({totalRatings})</span>
            )}
        </div>
    );
};

export default RatingStars;