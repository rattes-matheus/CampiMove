import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Phone, User } from 'lucide-react';
import { Transport } from '@/types/transport';

interface TransportCardProps {
    transport: Transport;
    onClick?: () => void;
}

const TransportCard: React.FC<TransportCardProps> = ({ transport, onClick }) => {
    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'CARPOOL': return 'Carona';
            case 'BIKE': return 'Bicicleta';
            case 'SCOOTER': return 'Patinete';
            default: return type;
        }
    };

    return (
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{transport.model}</span>
                    <Badge variant={transport.active ? "default" : "secondary"}>
                        {transport.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline">
                            {getTypeLabel(transport.type)}
                        </Badge>
                        <div className="flex items-center text-sm">
                            <User className="h-4 w-4 mr-1" />
                            <span>{transport.motorist}</span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Users className="h-4 w-4 ml-2 mr-1" />
                        <span className="text-sm">Capacidade: {transport.capacity}</span>
                    </div>
                    <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 font-semibold">{transport.averageRating.toFixed(1)}</span>
                        <span className="ml-1 text-sm text-gray-500">({transport.totalRatings} avaliações)</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-1" />
                        <span>{transport.contact}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TransportCard;