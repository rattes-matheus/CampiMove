'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/landing/footer';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, Calendar } from 'lucide-react';

type Incident = {
  id: number;
  title: string;
  full_description: string;
  category: string;
  created_at: string;
  status: string;
};

const statusMap: Record<string, string> = {
  OPEN: 'Em análise',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvido',
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function AllIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    axios
      .get<Incident[]>('http://localhost:8080/incidents')
      .then(res => {
        console.log('Incidents from API:', res.data); 
        setIncidents(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredIncidents =
    statusFilter === 'ALL'
      ? incidents
      : incidents.filter(i => i.status === statusFilter);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 flex-grow">
        
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <AlertTriangle className="text-orange-500" />
              Denúncias do Sistema
            </CardTitle>
            <CardDescription>
              Visualização de todas as denúncias registradas
            </CardDescription>
          </CardHeader>

          <CardContent className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="OPEN">Em análise</SelectItem>
                <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
                <SelectItem value="RESOLVED">Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredIncidents.map(incident => (
            <Card key={incident.id} className="hover:shadow-lg transition duration-200">
              <CardHeader className="pb-2">
                
                <CardTitle className="font-semibold text-base">
                  {incident.category || 'Outro'}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {formatDate(incident.created_at)}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm text-gray-700">{incident.full_description}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 w-fit">
                  {statusMap[incident.status]}
                </span>
              </CardContent>
            </Card>
          ))}

          {filteredIncidents.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              Nenhuma denúncia encontrada.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
