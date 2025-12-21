'use client'

import { useState, useEffect } from 'react'
import { useRouter, notFound } from 'next/navigation'
import axios from 'axios'

import { DashboardHeader } from '@/components/dashboard/header'
import { Footer } from '@/components/landing/footer'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

import {
  FileText,
  ArrowLeft,
  User,
  Calendar,
  ClipboardList,
  Clock,
  Loader2
} from 'lucide-react'

type Incident = {
  id: number
  title: string
  full_description: string
  formatted_summary: string
  category: string
  reporter_id: number
  reporter_name: string
  created_at: string
}

export default function IncidentDetailPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const incidentId = Number(params.id)

  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔥 FETCH NO BACKEND
  const fetchIncident = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(
        `http://localhost:8080/incidents/${incidentId}`
      )

      setIncident(response.data)
    } catch (err: any) {
      console.error(err)

      if (err.response?.status === 404) {
        return notFound()
      }

      setError('Não foi possível carregar os detalhes do incidente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (incidentId) fetchIncident()
  }, [incidentId])

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg">
          Carregando incidente #{incidentId}...
        </p>
      </div>
    )
  }

  // ❌ ERRO
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
    )
  }

  if (!incident) return null

  // ✅ TELA NORMAL
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
          {/* COLUNA PRINCIPAL */}
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

          {/* LATERAL */}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
