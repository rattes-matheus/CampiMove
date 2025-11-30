'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Map, Clock, Zap, Target, AlertTriangle, CheckCircle, Bus, ArrowUp, ArrowDown, Route } from 'lucide-react';
import axios from 'axios';

const ROUTE_FIXED_DATA = {
  C1: {
    distancia: 4,      
    tempoMedio: 9,     
    tempoPico: 17,    
  },
  C2: {
    distancia: 3,      
    tempoMedio: 6,     
    tempoPico: 12,    
  }
};

interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

interface CardProps extends BaseProps {
  onClick?: () => void;
}

interface ButtonProps extends BaseProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

interface SelectProps extends BaseProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

interface InputProps extends BaseProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
}

interface LabelProps extends BaseProps {
  htmlFor?: string;
}

interface HorarioOnibus {
  id: number;
  horario: string;
  rota: string;
}

interface InfoRotaResponse {
  rota: string;
  horarios: string[];
  distancia: number;
  tempoMedio: number;
  tempoPico: number;
  horarioPicoInicio: string;
  horarioPicoFim: string;
}

interface NeighbouringBusProps {
  time: string | null;
  type: 'EARLIER' | 'LATER';
  isLate?: boolean;
}

interface NextTrip {
  departureTime: string;
  minutesUntilDeparture: number;
  estimatedArrivalTime: string;
  travelTime: number;
}

interface ProactivePlanning {
  requiredTime: string;
  suggestedBus: string;
  estimatedArrivalAtBusStop: string;
  bufferAchieved: number;
  isFeasible: boolean;
  requiredDepartureTimeLimit: string;
  earlierBus: string | null;
  laterBus: string | null;
  isPeakTrip: boolean;
  tripDynamicTravelTime: number;
  message?: string;
}

const PRIMARY_COLOR_CLASSES = {
  DEFAULT_BG: 'bg-orange-600 text-white hover:bg-orange-700 shadow-md',
  ACCENT_TEXT: 'text-orange-600',
  FOCUS_RING: 'focus-visible:ring-orange-500',
  BORDER_ACCENT: 'border-l-orange-600',
  HIGHLIGHT_BG: 'bg-orange-100 dark:bg-orange-900/80 text-orange-800 dark:text-orange-300',
};

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader: React.FC<BaseProps> = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 mb-4 ${className}`}>{children}</div>
);

const CardTitle: React.FC<BaseProps> = ({ children, className = '' }) => (
  <h2 className={`text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </h2>
);

const CardDescription: React.FC<BaseProps> = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>{children}</p>
);

const CardContent: React.FC<BaseProps> = ({ children, className = '' }) => (
  <div className={`pt-0 ${className}`}>{children}</div>
);

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseStyle = `inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${PRIMARY_COLOR_CLASSES.FOCUS_RING} focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2`;
  let variantStyle = '';

  switch (variant) {
    case 'outline':
      variantStyle = 'border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100';
      break;
    case 'secondary':
      variantStyle = 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600';
      break;
    case 'ghost':
      variantStyle = 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100';
      break;
    default:
      variantStyle = PRIMARY_COLOR_CLASSES.DEFAULT_BG;
  }

  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${className}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input: React.FC<InputProps> = ({ className = '', type = 'text', value, onChange, id, ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    id={id}
    className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 ${PRIMARY_COLOR_CLASSES.FOCUS_RING} disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 ${className}`}
    {...props}
  />
);

const Select: React.FC<SelectProps> = ({ children, value, onChange, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 ${PRIMARY_COLOR_CLASSES.FOCUS_RING} dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 ${className}`}
  >
    {children}
  </select>
);

const Label: React.FC<LabelProps> = ({ children, className = '', htmlFor }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const timeToMinutes = (time: string): number => {
    if (!time || typeof time !== 'string') {
        console.error('❌ TIME INVÁLIDO NA FUNÇÃO timeToMinutes:', time);
        return 0;
    }
    
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const minutesToTime = (totalMinutes: number): string => {
    if (isNaN(totalMinutes) || totalMinutes < 0) {
        console.error('❌ MINUTOS INVÁLIDOS:', totalMinutes);
        return '00:00';
    }
    
    const normalizedMinutes = totalMinutes % (24 * 60);
    const h = Math.floor(normalizedMinutes / 60);
    const m = normalizedMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const NeighbouringBusDisplay: React.FC<NeighbouringBusProps> = ({ time, type, isLate = false }) => {
    if (!time) return null;

    const icon = type === 'EARLIER' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />;
    const label = type === 'EARLIER' ? 'Ônibus Anterior' : 'Ônibus Próximo (Chega Atrasado)';
    const colorClass = isLate ? 'text-red-500' : 'text-gray-500 dark:text-gray-300';
    const bgColor = isLate ? 'bg-red-50 dark:bg-red-900/50' : 'bg-gray-100 dark:bg-gray-700';
    
    const specificTravelTime = 15;
    const arrivalTime = minutesToTime(timeToMinutes(time) + specificTravelTime);

    return (
        <div className={`p-3 rounded-lg flex flex-col ${bgColor} border border-gray-200 dark:border-gray-600`}>
            <p className={`text-xs font-semibold uppercase flex items-center mb-1 ${colorClass}`}>
                {icon} {label}
            </p>
            <p className="text-2xl font-extrabold font-mono">{time}</p>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                Chegada Prevista: {arrivalTime}
            </p>
        </div>
    );
};

const BusSchedulePage = () => {
    const [origin, setOrigin] = useState<string>('C1');
    const [requiredArrivalTime, setRequiredArrivalTime] = useState<string>('');
    const [currentTime, setCurrentTime] = useState<string>(
        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
    );
    const [horarios, setHorarios] = useState<string[]>([]);
    const [infoRota, setInfoRota] = useState<InfoRotaResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const destination = origin === 'C1' ? 'C2' : 'C1';
    const routeKey = origin === 'C1' ? 'C1' : 'C2';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                
                console.log('🔍 Tentando conectar com:', API_BASE_URL);
                
                const horariosResponse = await axios.get(`${API_BASE_URL}/api/horarios-onibus/${routeKey}`);
                console.log('📅 RESPOSTA COMPLETA DA API:', horariosResponse);
                console.log('📅 DADOS RECEBIDOS:', horariosResponse.data);
                console.log('📅 TIPO DOS DADOS:', typeof horariosResponse.data);
                console.log('📅 É ARRAY?', Array.isArray(horariosResponse.data));
                
                let horariosData: string[] = [];
                
                if (Array.isArray(horariosResponse.data)) {
                    if (horariosResponse.data.length > 0 && typeof horariosResponse.data[0] === 'string') {
                        console.log('✅ API retornando array de strings - processando...');
                        horariosData = horariosResponse.data.map(horario => {
                            
                            if (typeof horario === 'string' && horario.includes(':')) {
                                return horario;
                            } else {
                                console.warn('❌ Horário inválido encontrado:', horario);
                                return null;
                            }
                        }).filter(Boolean) as string[]; 
                    } else {
                        console.log('✅ API retornando array de objetos - extraindo horários...');
                        horariosData = horariosResponse.data.map((item: any) => item.horario).filter(Boolean);
                    }
                } else {
                    console.error('❌ Dados não são um array:', horariosResponse.data);
                }
                
                console.log('📅 HORÁRIOS FINAIS PROCESSADOS:', horariosData);
                setHorarios(horariosData);

                try {
                    const rotaResponse = await axios.get(`${API_BASE_URL}/api/horarios-onibus/rota/${routeKey}`);
                    console.log('🗺️ Info rota recebida:', rotaResponse.data);
                    setInfoRota(rotaResponse.data);
                } catch (rotaError) {
                    console.log('ℹ️ Endpoint de info rota não disponível, usando dados fixos');
                }

            } catch (err) {
                console.error('❌ Erro ao buscar dados:', err);
                setError('Erro ao carregar dados dos horários. Verifique se o servidor está rodando.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [routeKey]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(
                new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
            );
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const dynamicTravelTimeRealTime = useMemo(() => {
        const routeData = ROUTE_FIXED_DATA[origin as keyof typeof ROUTE_FIXED_DATA];
        if (!routeData) return 15;

        const currentMinutes = timeToMinutes(currentTime);
        const peakStartMinutes = timeToMinutes("17:00");
        const peakEndMinutes = timeToMinutes("18:30");   

        if (currentMinutes >= peakStartMinutes && currentMinutes <= peakEndMinutes) {
            return routeData.tempoPico;
        }
        return routeData.tempoMedio;
    }, [currentTime, origin]);

    
    const isTimeInPeak = (time: string): boolean => {
        const timeMinutes = timeToMinutes(time);
        const peakStartMinutes = timeToMinutes("17:00"); 
        const peakEndMinutes = timeToMinutes("18:30");   
        
        return timeMinutes >= peakStartMinutes && timeMinutes <= peakEndMinutes;
    };

    const getDynamicTravelTime = (specificTime: string): number => {
        const routeData = ROUTE_FIXED_DATA[origin as keyof typeof ROUTE_FIXED_DATA];
        if (!routeData) return 15;

        if (isTimeInPeak(specificTime)) {
            return routeData.tempoPico;
        }
        return routeData.tempoMedio;
    };

    const nextTrip = useMemo((): NextTrip | null => {
        if (!horarios.length) {
            console.log('❌ Nenhum horário disponível para calcular próxima viagem');
            return null;
        }

        const currentMinutes = timeToMinutes(currentTime);
        console.log('⏰ Hora atual em minutos:', currentMinutes, 'Horários disponíveis:', horarios);
        
        for (const time of horarios) {
            const scheduleMinutes = timeToMinutes(time);
            console.log(`🔍 Verificando horário ${time} (${scheduleMinutes}min)`);
            
            if (scheduleMinutes >= currentMinutes) {
                const travelTime = getDynamicTravelTime(time);
                const arrivalMinutes = scheduleMinutes + travelTime;
                console.log(`✅ Próxima viagem encontrada: ${time} (sai em ${scheduleMinutes - currentMinutes}min)`);
                
                return {
                    departureTime: time,
                    minutesUntilDeparture: scheduleMinutes - currentMinutes,
                    estimatedArrivalTime: minutesToTime(arrivalMinutes),
                    travelTime: travelTime
                };
            }
        }
        
        console.log('❌ Nenhuma viagem encontrada para hoje');
        return null;
    }, [horarios, currentTime, origin]);

    const proactivePlanning = useMemo((): ProactivePlanning | null => {
        if (!requiredArrivalTime || !horarios.length) return null;

        const requiredArrivalMinutes = timeToMinutes(requiredArrivalTime);
        console.log('🎯 Planejamento proativo - Chegar até:', requiredArrivalTime, `(${requiredArrivalMinutes}min)`);
        
        let recommendedIndex = -1;
        let suggestedBus: string | null = null;
        
        for (let i = horarios.length - 1; i >= 0; i--) {
            const departureTime = horarios[i];
            const travelTime = getDynamicTravelTime(departureTime);
            const departureMinutes = timeToMinutes(departureTime);
            const arrivalMinutes = departureMinutes + travelTime;

            if (arrivalMinutes <= requiredArrivalMinutes) {
                recommendedIndex = i;
                suggestedBus = departureTime;
                console.log(`✅ Ônibus sugerido: ${departureTime} (chega ${minutesToTime(arrivalMinutes)})`);
                break;
            }
        }
        
        if (recommendedIndex === -1 || !suggestedBus) {
            console.log('❌ Nenhum ônibus encontrado que chegue a tempo');
            return { 
                requiredTime: requiredArrivalTime,
                suggestedBus: '',
                estimatedArrivalAtBusStop: '',
                bufferAchieved: 0,
                isFeasible: false,
                requiredDepartureTimeLimit: '',
                earlierBus: null,
                laterBus: null,
                isPeakTrip: false,
                tripDynamicTravelTime: 0,
                message: 'Não há horários de ônibus que permitam chegar a tempo. Todos os horários disponíveis chegariam após o horário limite.'
            };
        }
        
        const travelTime = getDynamicTravelTime(suggestedBus);
        const estimatedArrivalAtBusStop = minutesToTime(timeToMinutes(suggestedBus) + travelTime);
        const bufferAchieved = requiredArrivalMinutes - timeToMinutes(estimatedArrivalAtBusStop);
        const requiredDepartureTimeLimit = minutesToTime(requiredArrivalMinutes - travelTime);
        const earlierBus = recommendedIndex > 0 ? horarios[recommendedIndex - 1] : null;
        const laterBus = recommendedIndex < horarios.length - 1 ? horarios[recommendedIndex + 1] : null;

        return {
            requiredTime: requiredArrivalTime,
            suggestedBus: suggestedBus,
            estimatedArrivalAtBusStop: estimatedArrivalAtBusStop,
            bufferAchieved: bufferAchieved,
            isFeasible: true,
            requiredDepartureTimeLimit: requiredDepartureTimeLimit,
            earlierBus: earlierBus,
            laterBus: laterBus,
            isPeakTrip: isTimeInPeak(suggestedBus), 
            tripDynamicTravelTime: travelTime,
        };
    }, [requiredArrivalTime, horarios, origin]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando horários...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg">{error}</p>
                    <Button className="mt-4" onClick={() => window.location.reload()}>
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        );
    }

    const currentRouteData = ROUTE_FIXED_DATA[origin as keyof typeof ROUTE_FIXED_DATA];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 font-sans">
            <header className="flex items-center mb-6">
                <Button variant="ghost" onClick={() => window.history.back()}>
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Voltar 
                </Button>
            </header>
            
            <div className="max-w-5xl mx-auto">
                
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
                    Planejamento de Rota CEFET {origin} ↔ {destination}
                </h1>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Map className={`w-6 h-6 mr-2 ${PRIMARY_COLOR_CLASSES.ACCENT_TEXT}`} />
                            Configuração e Previsão de Rota
                        </CardTitle>
                        <CardDescription>
                            Distância e Tempo Estimado de Viagem ajustados em tempo real.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-1">
                                <Label htmlFor="origin-select">Partindo de:</Label>
                                <Select 
                                    id="origin-select"
                                    value={origin} 
                                    onChange={(e) => setOrigin(e.target.value)}
                                    className="mt-1 font-semibold"
                                >
                                    <option value="C1">Campus 1</option>
                                    <option value="C2">Campus 2</option>
                                </Select>
                            </div>
                            
                            <div className="md:col-span-1">
                                <Label>Distância Total:</Label>
                                <div className="mt-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 font-semibold text-gray-800 dark:text-gray-200 h-10 flex items-center">
                                    {currentRouteData?.distancia || 0} km
                                </div>
                            </div>
                            
                            <div className="md:col-span-2">
                                <Label htmlFor="eta-display">Tempo Estimado de Viagem:</Label>
                                <div id="eta-display" className={`mt-1 flex items-center p-2 rounded-lg h-10 ${
                                    dynamicTravelTimeRealTime > currentRouteData?.tempoMedio 
                                        ? 'bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300'
                                        : 'bg-green-100 dark:bg-green-900/50 border border-green-400 text-green-700 dark:text-green-300'
                                }`}>
                                    <Bus className="w-4 h-4 mr-2" />
                                    <span className="font-bold">{dynamicTravelTimeRealTime} minutos</span>
                                    <span className="text-xs ml-auto">
                                        {dynamicTravelTimeRealTime > currentRouteData?.tempoMedio 
                                            ? `(Pico: 17:00 - 18:30)` 
                                            : '(Normal)'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`mb-8 border-l-4 ${PRIMARY_COLOR_CLASSES.BORDER_ACCENT}`}>
                    <CardHeader>
                        <CardTitle className={`flex items-center ${PRIMARY_COLOR_CLASSES.ACCENT_TEXT}`}>
                            <Zap className="w-6 h-6 mr-2" />
                            Planejamento de viagem
                        </CardTitle>
                        <CardDescription>
                            Calcule o último ônibus que você pode pegar para chegar a tempo no ponto final.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <div>
                                <Label htmlFor="required-time">Preciso Chegar no Ponto de Ônibus (em {destination}) Até:</Label>
                                <Input 
                                    id="required-time"
                                    type="time"
                                    value={requiredArrivalTime} 
                                    onChange={(e) => setRequiredArrivalTime(e.target.value)}
                                    className="mt-1 font-mono text-lg"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Insira a hora limite. (Ex: se a aula é 8h, insira 7:50h para ter 10 min de folga).
                                </p>
                            </div>
                        </div>

                        {proactivePlanning && requiredArrivalTime && (
                            <div className={`p-4 rounded-lg border-2 ${
                                proactivePlanning.isFeasible 
                                    ? 'bg-green-50 dark:bg-green-900/50 border-green-500' 
                                    : 'bg-red-50 dark:bg-red-900/50 border-red-500'
                            }`}>
                                <h3 className="text-xl font-bold mb-2 flex items-center">
                                    {proactivePlanning.isFeasible ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                            Viagem Planejada
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                                            Planejamento Falhou
                                        </>
                                    )}
                                </h3>
                                
                                <div className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                                        <Target className="inline w-4 h-4 mr-1 text-red-500" />
                                        Partida Limite de {origin}:
                                    </p>
                                    <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 font-mono mt-1">
                                        {proactivePlanning.requiredDepartureTimeLimit}
                                    </p>
                                </div>

                                {proactivePlanning.isFeasible ? (
                                    <>
                                       
                                        {proactivePlanning.isPeakTrip && (
                                            <div className="mt-2 mb-4 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-500 text-yellow-800 dark:text-yellow-300 flex items-center shadow-md">
                                                <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold mb-1">
                                                        ⚠️ ATENÇÃO! Este ônibus parte em HORÁRIO DE PICO
                                                    </p>
                                                    <p className="text-xs">
                                                        Tempo de viagem aumentado: <strong>{proactivePlanning.tripDynamicTravelTime} minutos</strong> 
                                                        (normalmente {currentRouteData?.tempoMedio} minutos)
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-4 p-4 rounded-lg border-2 border-green-500 bg-white dark:bg-gray-800 shadow-lg">
                                            <p className="text-lg font-semibold text-green-700 dark:text-green-400 flex items-center mb-1">
                                                <Bus className="w-5 h-5 mr-2" /> Ônibus Sugerido (Último Viável):
                                            </p>
                                            <p className="text-4xl font-extrabold font-mono mb-2">{proactivePlanning.suggestedBus}</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Chegada Prevista no Ponto: <strong>{proactivePlanning.estimatedArrivalAtBusStop}</strong>
                                                <span className={`ml-2 text-xs font-semibold ${proactivePlanning.isPeakTrip ? 'text-red-500' : 'text-green-600'}`}>
                                                    (Viagem de {proactivePlanning.tripDynamicTravelTime} min)
                                                </span>
                                            </p>
                                            <p className="font-bold text-base mt-2 text-green-700 dark:text-green-400">
                                                Margem de Folga: <strong>{proactivePlanning.bufferAchieved} minutos</strong> de sobra.
                                            </p>
                                        </div>

                                        <p className="text-sm font-bold mt-4 mb-2 text-gray-700 dark:text-gray-300">
                                            Próximos horários
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <NeighbouringBusDisplay 
                                                time={proactivePlanning.earlierBus} 
                                                type="EARLIER" 
                                            />
                                            <NeighbouringBusDisplay 
                                                time={proactivePlanning.laterBus} 
                                                type="LATER" 
                                                isLate={true} 
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-lg text-red-700 dark:text-red-300">
                                        {proactivePlanning.message}
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Clock className="w-6 h-6 mr-2 text-purple-600" />
                            Próxima Partida 
                        </CardTitle>
                        <CardDescription>
                            O próximo ônibus saindo de {origin} agora ({currentTime}).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {nextTrip ? (
                            <div>
                                <div className="grid grid-cols-2 text-center border-t pt-4 dark:border-gray-700">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Partida de {origin}</p>
                                        <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">
                                            {nextTrip.departureTime}
                                        </p>
                                        <p className={`text-sm mt-2 ${PRIMARY_COLOR_CLASSES.ACCENT_TEXT}`}>
                                            Sai em {nextTrip.minutesUntilDeparture} min
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Chegada Prevista em {destination}</p>
                                        <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">
                                            {nextTrip.estimatedArrivalTime}
                                        </p>
                                        <p className={`text-sm mt-2 ${dynamicTravelTimeRealTime > currentRouteData?.tempoMedio ? 'text-red-500 font-semibold' : 'text-green-600'}`}>
                                            Viagem de {nextTrip.travelTime} min ({currentRouteData?.distancia || 0} km)
                                        </p>
                                    </div>
                                </div>
                                
                                
                                {nextTrip && isTimeInPeak(nextTrip.departureTime) && (
                                    <div className="mt-4 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-500 text-yellow-800 dark:text-yellow-300">
                                        <p className="text-sm font-semibold flex items-center">
                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                            ⚠️ Horário de pico - Viagem de {nextTrip.travelTime} minutos
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-lg text-red-500">
                                Sem mais ônibus para {origin} hoje.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Horários Completos ({origin} → {destination})</CardTitle>
                        <CardDescription>
                            Todos os horários programados para a rota selecionada.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-4 text-center">
                            {horarios.length > 0 ? (
                                horarios.map((time, index) => (
                                    <div 
                                        key={index} 
                                        className={`p-3 rounded-lg font-mono text-sm ${
                                            timeToMinutes(time) >= timeToMinutes(currentTime) 
                                                ? `${PRIMARY_COLOR_CLASSES.HIGHLIGHT_BG} font-bold shadow-md` 
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 opacity-70'
                                        }`}
                                    >
                                        {time}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    Nenhum horário disponível para esta rota.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BusSchedulePage;