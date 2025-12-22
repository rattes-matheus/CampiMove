'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { DashboardHeader } from '@/components/dashboard/header'
import { Footer } from '@/components/landing/footer'
import {
  Loader2,
  CheckCircle,
  Send
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'

export default function ReportPage() {
  const { toast } = useToast()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStep, setFormStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [meId, setMeId] = useState<number | null>(null)

  const [problemType, setProblemType] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [location, setLocation] = useState('')
  const [severity, setSeverity] = useState('')
  const [description, setDescription] = useState('')
  const [route, setRoute] = useState('')

  const availableTimes = [
    '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ]

  const commonProblems = [
    { type: 'delay', label: '🚌 Atraso' },
    { type: 'bus_missing', label: '❌ Não apareceu' },
    { type: 'overcrowded', label: '👥 Superlotado' },
    { type: 'driver', label: '👨‍✈️ Motorista' },
    { type: 'safety', label: '🛡️ Segurança' }
  ]

  const handlePrevStep = () => setFormStep(1)

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const res = await axios.get(
          'http://localhost:8080/auth/me',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setMeId(res.data.id)
      } catch (err) {
        console.error(err)
        router.push('/login')
      }
    }

    fetchMe()
  }, [router])

  const handleNextStep = () => {
    if (!problemType || !route || !scheduledTime) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha tipo, rota e horário.',
        variant: 'destructive'
      })
      return
    }
    setFormStep(2)
  }

  const submit = async () => {
    if (!meId) {
      toast({
        title: 'Erro',
        description: 'Usuário não identificado.',
        variant: 'destructive'
      })
      return
    }

    if (!location || !severity || !description) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha localização, gravidade e descrição.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('jwt_token')

      const payload = {
        title: `${problemType.toUpperCase()} - ${route.toUpperCase()} - ${scheduledTime}`,
        full_description: `
Local: ${location}
Gravidade: ${severity}
Rota: ${route}
Horário: ${scheduledTime}

Descrição:
${description}
        `.trim(),
        category: problemType.toUpperCase(),
        reporter_id: meId
      }

      await axios.post(
        'http://localhost:8080/incidents/post',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast({
        title: 'Reporte enviado',
        description: 'Obrigado por contribuir.'
      })

      setShowSuccess(true)
      setFormStep(1)
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erro',
        description: 'Falha ao enviar reporte.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-grow flex items-center justify-center">
          <Card className="max-w-md text-center">
            <CardContent className="pt-10 pb-8 space-y-6">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
              <h2 className="text-2xl font-bold">Reporte enviado!</h2>
              <Button onClick={() => setShowSuccess(false)}>
                Enviar outro
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-grow container mx-auto py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Reportar Problema</CardTitle>
            <CardDescription>Passo {formStep}/2</CardDescription>
            <Progress value={formStep === 1 ? 50 : 100} />
          </CardHeader>

          <CardContent>
            {formStep === 1 ? (
              <div className="space-y-4">
                <Tabs defaultValue="common">
                  <TabsList>
                    <TabsTrigger value="common">Comuns</TabsTrigger>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="common">
                    <div className="grid grid-cols-2 gap-2">
                      {commonProblems.map(p => (
                        <Button
                          key={p.type}
                          variant={problemType === p.type ? 'default' : 'outline'}
                          onClick={() => setProblemType(p.type)}
                        >
                          {p.label}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="all">
                    <Select value={problemType} onValueChange={setProblemType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de problema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delay">Atraso</SelectItem>
                        <SelectItem value="bus_missing">Não apareceu</SelectItem>
                        <SelectItem value="overcrowded">Superlotado</SelectItem>
                        <SelectItem value="driver">Motorista</SelectItem>
                        <SelectItem value="safety">Segurança</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </TabsContent>
                </Tabs>

                <Select value={route} onValueChange={setRoute}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c1_to_c2">Campus I → Campus II</SelectItem>
                    <SelectItem value="c2_to_c1">Campus II → Campus I</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={scheduledTime} onValueChange={setScheduledTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  placeholder="Local"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />

                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Gravidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Descreva o problema"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {formStep === 1 ? (
              <Button onClick={handleNextStep}>Continuar</Button>
            ) : (
              <>
                <Button variant="outline" onClick={handlePrevStep}>
                  Voltar
                </Button>
                <Button onClick={submit} disabled={isSubmitting}>
                  {isSubmitting
                    ? <Loader2 className="animate-spin" />
                    : <Send />
                  }
                  Enviar
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
