'use client'
import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { DashboardHeader } from '@/components/dashboard/header'
import { Footer } from '@/components/landing/footer'
import {
  AlertCircle,
  Bus,
  Clock,
  MapPin,
  AlertTriangle,
  FileText,
  Send,
  Loader2,
  CheckCircle,
  ShieldAlert,
  Users,
  Route
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ReportPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStep, setFormStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  const [problemType, setProblemType] = useState('')
  const [route, setRoute] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [location, setLocation] = useState('')
  const [severity, setSeverity] = useState('')
  const [description, setDescription] = useState('')


  const availableTimes = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ]

  const commonProblems = [
    { type: 'delay', label: '🚌 Atraso', desc: 'Ônibus atrasou mais de 15 min' },
    { type: 'bus_missing', label: '❌ Não apareceu', desc: 'Ônibus não passou no horário' },
    { type: 'overcrowded', label: '👥 Superlotado', desc: 'Não consegui entrar' },
    { type: 'driver', label: '👨‍✈️ Motorista', desc: 'Problema com condutor' },
    { type: 'safety', label: '🛡️ Segurança', desc: 'Questão de segurança' },
  ]

  const handleNextStep = () => {
    if (formStep === 1 && (!problemType || !route || !scheduledTime)) {
      toast({
        title: 'Informações básicas',
        description: 'Preencha tipo, rota e horário para continuar.',
        variant: 'destructive'
      })
      return
    }
    setFormStep(2)
  }

  const handlePrevStep = () => {
    setFormStep(1)
  }

  const submit = async () => {
    if (!location || !severity || !description) {
      toast({
        title: 'Detalhes obrigatórios',
        description: 'Preencha localização, gravidade e descrição.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        toast({
          title: 'Não autenticado',
          description: 'Faça login para reportar um problema.',
          variant: 'destructive'
        })
        return
      }

      const reportData = {
        title: `${problemType.toUpperCase()} - ${route.toUpperCase()}`,
        fullDescription: `
Horário programado: ${scheduledTime}
Local: ${location}
Gravidade: ${severity}

Descrição:
${description}
      `,
        category: problemType.toUpperCase(), // ENUM
        status: "OPEN"
      }

      console.log('Enviando report:', reportData)

      await axios.post(
        'http://localhost:8080/api/reports',
        reportData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      setShowSuccess(true)

      toast({
        title: '✅ Reporte enviado com sucesso!',
        description: 'Obrigado por contribuir.',
      })

      setTimeout(() => {
        setProblemType('')
        setRoute('')
        setScheduledTime('')
        setLocation('')
        setSeverity('')
        setDescription('')
        setFormStep(1)
        setShowSuccess(false)
      }, 3000)

    } catch (error: any) {
      console.error(error)
      toast({
        title: '❌ Erro ao enviar',
        description: 'Tente novamente.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }





  if (showSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8 flex items-center justify-center">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-10 pb-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Reporte Enviado!
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Obrigado por contribuir para a melhoria do intercampi.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm bg-muted px-3 py-1 rounded-full">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Redirecionando em 3 segundos...</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuccess(false)
                    setFormStep(1)
                  }}
                >
                  Enviar outro reporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <DashboardHeader />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto">

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <ShieldAlert className="h-8 w-8 text-destructive" />
                  Reportar Problema
                </h1>
                <p className="text-muted-foreground mt-2">
                  Ajude-nos a melhorar o transporte entre os campus relatando problemas
                </p>
              </div>
              <Badge variant="outline" className="text-sm">
                Passo {formStep}/2
              </Badge>
            </div>

            <Progress value={formStep === 1 ? 50 : 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Informações básicas</span>
              <span>Detalhes do problema</span>
            </div>
          </div>

          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                {formStep === 1 ? (
                  <>
                    <Bus className="h-5 w-5 text-primary" />
                    Informações do Ônibus
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 text-primary" />
                    Detalhes do Problema
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {formStep === 1
                  ? 'Informe sobre qual ônibus e horário do problema'
                  : 'Descreva detalhadamente o que aconteceu'}
              </CardDescription>
            </CardHeader>

            <CardContent>

              {formStep === 1 ? (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Qual tipo de problema você encontrou?
                    </Label>
                    <Tabs defaultValue="common" className="mb-4">
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="common">Comuns</TabsTrigger>
                        <TabsTrigger value="all">Todos</TabsTrigger>
                      </TabsList>
                      <TabsContent value="common" className="mt-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {commonProblems.map((problem) => (
                            <button
                              key={problem.type}
                              onClick={() => setProblemType(problem.type)}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${problemType === problem.type
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
                            >
                              <div className="font-medium">{problem.label}</div>
                              <div className="text-xs text-muted-foreground mt-1">{problem.desc}</div>
                            </button>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="all" className="mt-4">
                        <Select value={problemType} onValueChange={setProblemType}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Selecione o tipo de problema" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delay">Atraso significativo (15+ minutos)</SelectItem>
                            <SelectItem value="bus_missing">Ônibus não apareceu</SelectItem>
                            <SelectItem value="overcrowded">Superlotação </SelectItem>
                            <SelectItem value="driver">Problema com motorista</SelectItem>
                            <SelectItem value="safety">Segurança</SelectItem>
                            <SelectItem value="route">Problema na rota</SelectItem>
                            <SelectItem value="comfort">Conforto/limpeza</SelectItem>
                            <SelectItem value="other">Outro problema</SelectItem>
                          </SelectContent>
                        </Select>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 font-medium">
                        <Route className="h-4 w-4" />
                        Rota do Intercampi *
                      </Label>
                      <Select value={route} onValueChange={setRoute}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Selecione a rota" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="c1_to_c2">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                              <span>Campus I → Campus II</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="c2_to_c1">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-green-500"></div>
                              <span>Campus II → Campus I</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 font-medium">
                        <Clock className="h-4 w-4" />
                        Horário Programado *
                      </Label>
                      <Select value={scheduledTime} onValueChange={setScheduledTime}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          <div className="grid grid-cols-2 gap-1">
                            {availableTimes.map(time => (
                              <SelectItem key={time} value={time} className="text-center">
                                {time}
                              </SelectItem>
                            ))}
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 font-medium">
                        <MapPin className="h-4 w-4" />
                        Onde ocorreu? *
                      </Label>
                      <Input
                        placeholder="Ex: Ponto principal C1, Terminal C2"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="h-12"
                      />
                      <p className="text-xs text-muted-foreground">
                        Seja específico sobre o local
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 font-medium">
                        <AlertTriangle className="h-4 w-4" />
                        Qual a gravidade? *
                      </Label>
                      <Select value={severity} onValueChange={setSeverity}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Selecione a gravidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center gap-3">
                              <div className="h-3 w-3 rounded-full bg-green-500"></div>
                              <div>
                                <div className="font-medium">Baixa</div>
                                <div className="text-xs text-muted-foreground">Inconveniente pontual</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-3">
                              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                              <div>
                                <div className="font-medium">Média</div>
                                <div className="text-xs text-muted-foreground">Problema recorrente</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-3">
                              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                              <div>
                                <div className="font-medium">Alta</div>
                                <div className="text-xs text-muted-foreground">Impacta muitos alunos</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="critical">
                            <div className="flex items-center gap-3">
                              <div className="h-3 w-3 rounded-full bg-red-500"></div>
                              <div>
                                <div className="font-medium">Crítica</div>
                                <div className="text-xs text-muted-foreground">Risco de segurança</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 font-medium">
                      <FileText className="h-4 w-4" />
                      Conte-nos o que aconteceu *
                    </Label>
                    <Textarea
                      placeholder={`• Descreva exatamente o que ocorreu
• Qual foi o impacto para você e outros alunos?
• Há quanto tempo esse problema acontece?
• Número do ônibus ou outras informações úteis`}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="resize-none min-h-[150px] text-base"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Quanto mais detalhes, melhor</span>
                      <span>{description.length}/1000 caracteres</span>
                    </div>
                  </div>


                  <Card className="bg-muted/30 border">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-3">Resumo do seu reporte:</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tipo:</span>
                          <div className="font-medium">
                            {problemType === 'delay' && 'Atraso significativo'}
                            {problemType === 'bus_missing' && 'Ônibus não apareceu'}
                            {problemType === 'overcrowded' && 'Superlotação'}
                            {problemType === 'driver' && 'Problema com motorista'}
                            {problemType === 'safety' && 'Questão de segurança'}
                            {problemType === 'route' && 'Problema na rota'}
                            {problemType === 'comfort' && 'Conforto/limpeza'}
                            {problemType === 'other' && 'Outro problema'}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rota:</span>
                          <div className="font-medium">
                            {route === 'c1_to_c2' ? 'Campus I → Campus II' : 'Campus II → Campus I'}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Horário:</span>
                          <div className="font-medium">{scheduledTime}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gravidade:</span>
                          <div className="font-medium">
                            {severity === 'low' && 'Baixa'}
                            {severity === 'medium' && 'Média'}
                            {severity === 'high' && 'Alta'}
                            {severity === 'critical' && 'Crítica'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between pt-6 border-t">
              {formStep === 1 ? (
                <>
                  <div className="text-sm text-muted-foreground">
                    <Users className="h-4 w-4 inline mr-1" />
                    Sua contribuição ajuda todos os alunos
                  </div>
                  <Button
                    onClick={handleNextStep}
                    disabled={!problemType || !route || !scheduledTime}
                    className="gap-2"
                  >
                    Continuar
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={submit}
                    disabled={isSubmitting || !location || !severity || !description}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar Reporte
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>


          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Seja específico</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Inclua horários exatos, números de ônibus e locais precisos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Ajude a comunidade</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Seu reporte ajuda a melhorar o transporte para todos os alunos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <ShieldAlert className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Resposta garantida</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Todos os reportes são analisados pela administração.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}