'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import {
  FileText,
  ArrowLeft,
  User,
  Calendar,
  ClipboardList,
  Clock,
  Loader2,
} from 'lucide-react';

type Incident = {
  id: number;
  title: string;
  full_description: string;
  formatted_summary: string;
  category: string;
  reporter_id: number;
  reporter_name: string;
  created_at: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
};

export default function IncidentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const incidentId = Number(params.id);

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusConfig = {
    OPEN: { label: 'Em análise' },
    IN_PROGRESS: { label: 'Em andamento' },
    RESOLVED: { label: 'Resolvido' },
  };

  const fetchIncident = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8080/incidents/${incidentId}`
      );

      setIncident(response.data);
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 404) {
        return notFound();
      }

      setError('Não foi possível carregar os detalhes do incidente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (incidentId) fetchIncident();
  }, [incidentId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg">
          Carregando incidente #{incidentId}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
          <Alert variant="destructive">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <Button
            onClick={() => router.push('/dashboard/admin/report')}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (!incident) return null;

  const updateStatus = async (newStatus: Incident['status']) => {
    try {
      await axios.patch(
        `http://localhost:8080/incidents/${incidentId}/status`,
        null,
        {
          params: { status: newStatus },
        }
      );

      setIncident(prev =>
        prev ? { ...prev, status: newStatus } : prev
      );
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar status do incidente.');
    }
  };

  const deleteIncident = async () => {
    const confirmed = confirm(
      'Tem certeza que deseja deletar este incidente? Essa ação não pode ser desfeita.'
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:8080/incidents/${incidentId}`
      );

      router.push('/dashboard/admin/report');
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar o incidente.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FileText className="mr-3 h-7 w-7 text-primary" />
            Detalhes do Incidente #{incident.id}
          </h1>

          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/admin/report')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5" />
                  {incident.formatted_summary}
                </CardTitle>

                <CardDescription>
                  Relato do incidente ocorrido.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Alert className="bg-muted">
                  <User className="h-4 w-4" />
                  <AlertTitle>Reportado Por:</AlertTitle>

                  <AlertDescription className="font-medium">
                    {incident.reporter_name ?? 'Usuário desconhecido'}
                    {incident.reporter_id &&
                      ` (ID: ${incident.reporter_id})`}
                  </AlertDescription>
                </Alert>

                <p className="text-sm font-semibold">
                  Descrição Completa:
                </p>

                <p className="whitespace-pre-wrap text-muted-foreground">
                  {incident.full_description}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Informações
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Categoria:
                  </span>
                  <Badge>{incident.category}</Badge>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Criado em:
                  </span>
                  <span>
                    {new Date(
                      incident.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    ID do Reportador:
                  </span>
                  <span>
                    #{incident.reporter_id ?? '—'}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Status do Incidente
                  </p>

                  <Badge className="mb-2">
                    {statusConfig[incident.status].label}
                  </Badge>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={incident.status === 'OPEN'}
                      onClick={() => updateStatus('OPEN')}
                    >
                      Marcar como Em análise
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={incident.status === 'IN_PROGRESS'}
                      onClick={() => updateStatus('IN_PROGRESS')}
                    >
                      Marcar como Em andamento
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={incident.status === 'RESOLVED'}
                      onClick={() => updateStatus('RESOLVED')}
                    >
                      Marcar como Resolvido
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={deleteIncident}
                  >
                    Deletar Incidente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
