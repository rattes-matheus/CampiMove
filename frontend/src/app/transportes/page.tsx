'use client';

import React, { useEffect, useState } from 'react';
import { Transport } from '@/types/transport';
import { transportService } from '@/service/transportService';
import TransportCard from '@/components/transport/TransportCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

export default function TransportesPage() {
    const [transports, setTransports] = useState<Transport[]>([]);
    const [filteredTransports, setFilteredTransports] = useState<Transport[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [ratingFilter, setRatingFilter] = useState<string>('all');

    useEffect(() => {
        loadTransports();
    }, []);

    useEffect(() => {
        filterTransports();
    }, [transports, search, typeFilter, ratingFilter]);

    const loadTransports = async () => {
        try {
            const data = await transportService.getActiveTransports();
            setTransports(data);
        } catch (error) {
            console.error('Erro ao carregar transportes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTransports = () => {
        let filtered = transports;

        if (search) {
            filtered = filtered.filter(t =>
                t.model.toLowerCase().includes(search.toLowerCase()) ||
                t.contact.toLowerCase().includes(search.toLowerCase()) ||
                t.motorist.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (typeFilter !== 'all') {
            filtered = filtered.filter(t => t.type === typeFilter);
        }

        if (ratingFilter !== 'all') {
            const minRating = parseFloat(ratingFilter);
            filtered = filtered.filter(t => t.averageRating >= minRating);
        }

        setFilteredTransports(filtered);
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Carregando transportes...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Transportes Disponíveis</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="md:col-span-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Buscar por modelo, contato ou motorista..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os tipos</SelectItem>
                            <SelectItem value="CARPOOL">Carona</SelectItem>
                            <SelectItem value="BIKE">Bicicleta</SelectItem>
                            <SelectItem value="SCOOTER">Patinete</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Avaliação mínima" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Qualquer avaliação</SelectItem>
                            <SelectItem value="4.5">4.5 estrelas ou mais</SelectItem>
                            <SelectItem value="4.0">4.0 estrelas ou mais</SelectItem>
                            <SelectItem value="3.5">3.5 estrelas ou mais</SelectItem>
                            <SelectItem value="3.0">3.0 estrelas ou mais</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredTransports.length === 0 ? (
                <div className="text-center py-12">
                    <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Nenhum transporte encontrado</h3>
                    <p className="text-gray-500">Tente ajustar os filtros de busca.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTransports.map(transport => (
                        <TransportCard
                            key={transport.id}
                            transport={transport}
                            onClick={() => window.location.href = `/transportes/${transport.id}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}