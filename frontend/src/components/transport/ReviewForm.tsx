'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RatingStars from './RatingStars';

interface ReviewFormProps {
    onSubmit: (rating: number, review: string) => void;
    loading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, loading }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating > 0) {
            onSubmit(rating, review);
            setRating(0);
            setReview('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Avaliação</label>
                <RatingStars rating={rating} interactive={true} onRate={setRating} />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Comentário (opcional)</label>
                <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Conte sobre sua experiência..."
                    rows={3}
                />
            </div>
            <Button type="submit" disabled={rating === 0 || loading}>
                {loading ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
        </form>
    );
};

export default ReviewForm;