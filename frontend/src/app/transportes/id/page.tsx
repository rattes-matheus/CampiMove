'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Transport, TransportRating } from '@/types/transport';
import { transportService } from '@/service/transportService';
import RatingStars from '@/components/transport/RatingStars';
import ReviewForm from '@/components/transport/ReviewForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Phone, User, Calendar } from 'lucide-react';

export default function TransportDetailsPage() {
    const params = useParams();
    const transportId = Number(params.id);

    const [transport, setTransport] = useState<Transport | null>(null);
    const [ratings, setRatings] = useState<TransportRating[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (transportId) {
            loadTransportDetails();
        }
    }, [transportId]);

    const loadTransportDetails = async () => {
        try {
            const [transportData, ratingsData] = await Promise.all([
                transportService.getTransportById(transportId),
                transportService.getTransportRatings(transportId)
            ]);
            setTransport(transportData);
            setRatings(ratingsData);
        } catch (error) {
            console.error('Erro ao carregar detalhes do transporte:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (rating: number, review: string) => {
        setSubmittingReview(true);
        try {
            // Aqui você precisa obter o ID do usuário logado
            const userId = 1; // Substituir pelo ID real do usuário logado
            await transportService.rateTransport(transportId, userId, { rating, review });
            await loadTransportDetails(); // Recarregar dados
        } catch (error) {
            console.error('Erro ao enviar avaliação:', error);
        } finally {
            setSubmittingReview(false);
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'CARPOOL': return 'Carona';
            case 'BIKE': return 'Bicicleta';
            case 'SCOOTER': return 'Patinete';
            default: return type;
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Carregando detalhes...</div>;
    }

    if (!transport) {
        return <div className="container mx-auto px-4 py-8">Transporte não encontrado</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{transport.model}</span>
                                <Badge variant={transport.active ? "default" : "secondary"}>
                                    {transport.active ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <Badge variant="outline" className="mr-2">
                                            {getTypeLabel(transport.type)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <RatingStars rating={transport.averageRating} totalRatings={transport.totalRatings} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <User className="h-5 w-5 mr-2 text-gray-500" />
                                        <span className="font-medium">Motorista:</span>
                                        <span className="ml-2">{transport.motorist}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 mr-2 text-gray-500" />
                                        <span className="font-medium">Contato:</span>
                                        <span className="ml-2">{transport.contact}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-5 w-5 mr-2 text-gray-500" />
                                        <span className="font-medium">Capacidade:</span>
                                        <span className="ml-2">{transport.capacity} pessoas</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Avaliações ({ratings.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {ratings.length === 0 ? (
                                <p className="text-gray-500">Nenhuma avaliação ainda.</p>
                            ) : (
                                <div className="space-y-4">
                                    {ratings.map((rating) => (
                                        <div key={rating.id} className="border-b pb-4 last:border-0">
                                            <div className="flex justify-between items-center mb-2">
                                                <div>
                                                    <span className="font-medium">{rating.userName}</span>
                                                    <RatingStars rating={rating.rating} />
                                                </div>
                                                <span className="text-sm text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                                            </div>
                                            {rating.review && (
                                                <p className="text-gray-700">{rating.review}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Avaliar este transporte</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ReviewForm onSubmit={handleSubmitReview} loading={submittingReview} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}