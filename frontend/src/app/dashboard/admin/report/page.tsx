'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/header'
import { Footer } from '@/components/landing/footer'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FileText, Search, Eye } from 'lucide-react'

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

export default function AdminReportsStaticPage() {
  const router = useRouter()

  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch('http://localhost:8080/incidents')
        if (!res.ok) throw new Error('Erro ao buscar incidents')
        const data = await res.json()
        setIncidents(data)
      } catch (err) {
        setError('Não foi possível carregar incidents. Verifique o backend.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchIncidents()
  }, [])

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const text = search.toLowerCase()

      const matchSearch =
        incident.title.toLowerCase().includes(text) ||
        incident.full_description.toLowerCase().includes(text) ||
        incident.formatted_summary.toLowerCase().includes(text) ||
        incident.category.toLowerCase().includes(text)

      const matchCategory =
        category === 'all' || incident.category === category

      return matchSearch && matchCategory
    })
  }, [incidents, search, category])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center">
          <FileText className="mr-3 h-7 w-7 text-primary" />
          Central de Ocorrências 
        </h1>

        <p className="text-muted-foreground mb-8">
          Visualize os incidents enviados pelos usuários.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-10 pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filtrar por Categoria" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Atraso">Atraso</SelectItem>
              <SelectItem value="Rota">Rota</SelectItem>
              <SelectItem value="Superlotação">Superlotação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Lista de Ocorrências
            </CardTitle>
            <CardDescription>
              Dados reais do backend Spring Boot.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loading && <p className="text-center py-4">Carregando...</p>}
            {error && (
              <p className="text-center text-red-500 py-4">{error}</p>
            )}

            {!loading && !error && filteredIncidents.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Nenhum incident encontrado.
              </p>
            )}

            {!loading && !error && filteredIncidents.length > 0 && (
              <div className="max-h-[60vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Resumo</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>{incident.reporter_name}</TableCell>

                        <TableCell>
                          {incident.formatted_summary}
                        </TableCell>

                        <TableCell>
                          <Badge>{incident.category}</Badge>
                        </TableCell>

                        <TableCell>
                          {new Date(
                            incident.created_at
                          ).toLocaleDateString()}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/dashboard/admin/report/${incident.id}`
                              )
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
