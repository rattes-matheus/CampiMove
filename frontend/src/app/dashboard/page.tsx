'use client';

import {useEffect, useState} from 'react';
import {DashboardHeader} from '@/components/dashboard/header';
import {Footer} from '@/components/landing/footer';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Bus, CalendarPlus, Clock, Star} from 'lucide-react';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {useToast} from '@/hooks/use-toast';
import BusSchedule from '@/lib/interfaces/BusSchedule';
import axios from 'axios';
import {useRouter} from 'next/navigation';


const initialRecentTravels = [
    {
        id: 'travel-1',
        destination: 'Campus II',
        driver: 'João da Silva',
        date: '2024-07-25',
        rated: false,
    },
    {
        id: 'travel-2',
        destination: 'Biblioteca Central',
        driver: 'Maria Souza',
        date: '2024-07-24',
        rated: true,
        rating: 5,
    },
    {
        id: 'travel-3',
        destination: 'Campus Principal',
        driver: 'Samuel Wilson',
        date: '2024-07-22',
        rated: false,
    },
];

type NextTravel = {
    motoristName: string;
    origin: string;
    destination: string;
    schedule: string;
};

type Travel = typeof initialRecentTravels[0];

export default function DashboardPage() {
    const [recentTravels, setRecentTravels] = useState(initialRecentTravels);
    const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);
    const [rating, setRating] = useState(0);
    const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
    const {toast} = useToast();
    const [schedules, setSchedules] = useState<BusSchedule[]>([]);
    const [currentMinutes, setCurrentMinutes] = useState<number>(0);
    const now = new Date();
    const router = useRouter();
    const [nextTravels, setNextTravels] = useState<NextTravel[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            let token = null;
            if (typeof window !== 'undefined') token = localStorage.getItem('jwt_token');
            if (!token) return router.push("/login");

            const res = await axios.get("http://localhost:8080/auth/me", {
                headers: {Authorization: `Bearer ${token}`}
            })
            const userRole = res.data.role;
            const userId: string = res.data.id;

            if (userRole === "DRIVER") return router.push("/dashboard/motorist");

            const travelsRes = await axios.get<NextTravel[]>("http://localhost:8080/api/travels/my-upcoming", {
                headers: {Authorization: `Bearer ${token}`},
                params: {
                    id: userId
                }
            });

            setNextTravels(travelsRes.data);
        }
        fetchData();
    }, [router]);

    const handleRateClick = (travel: Travel) => {
        setSelectedTravel(travel);
        setRating(0); // Resetar avaliação
        setIsRatingDialogOpen(true);
    };

    useEffect(() => {
        axios.get<BusSchedule[]>("http://localhost:8080/api/routes").then((res) => {
            setSchedules(res.data)
        }).catch((err: Error) => console.log("Can't GET the avaible intercampis : ", err.message));
        setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, [router]);

    const handleRatingSubmit = () => {
        if (selectedTravel && rating > 0) {
            console.log(`Enviando avaliação ${rating} para a viagem ${selectedTravel.id}`);
            setRecentTravels(travels =>
                travels.map(t =>
                    t.id === selectedTravel.id ? {...t, rated: true, rating: rating} : t
                )
            );
            toast({
                title: 'Obrigado pelo seu feedback!',
                description: `Você avaliou sua viagem com ${selectedTravel.driver} com ${rating} estrelas.`,
            });
            setIsRatingDialogOpen(false);
            setSelectedTravel(null);
        } else {
            toast({
                title: 'Avaliação inválida',
                description: 'Por favor, selecione uma avaliação de estrelas antes de enviar.',
                variant: 'destructive',
            });
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader/>
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">Próximo Intercampi</CardTitle>
                            <Bus className="h-6 w-6 text-primary"/>
                        </CardHeader>
                        <CardContent className='flex flex-col py-4'>
                            <div className="text-4xl font-bold">{
                                schedules && schedules.length > 0 ?
                                    schedules
                                        .map(s => {
                                            const [h, m, sec] = s.schedule.split(":").map(Number);
                                            let minutes = h * 60 + m;
                                            if (minutes < currentMinutes)
                                                minutes += 24 * 60;
                                            return {...s, diff: Math.abs(minutes - currentMinutes)};
                                        })
                                        .sort((a, b) => a.diff - b.diff)
                                        .at(0)?.schedule :
                                    "Sem Intercampi a caminho"
                            }</div>
                            <p className="py-4 text-sm text-muted-foreground">{schedules.length > 0 ? "Trajeto " + schedules.sort((a, b) => a.schedule.localeCompare(b.schedule)).at(0)?.route : ""}</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Próximas Viagens</CardTitle>
                            <CardDescription>Suas viagens agendadas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {nextTravels.length > 0 ? nextTravels.map((travel, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                                    <div>
                                        <p className="font-semibold">{travel.destination}</p>
                                        <p className="text-sm text-muted-foreground">com {travel.motoristName}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4" />
                                        {travel.schedule}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-muted-foreground p-4">Nenhuma viagem agendada.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">Reservar um Transporte</CardTitle>
                            <CalendarPlus className="h-6 w-6 text-primary"/>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">Precisa de uma carona? Encontre caronas,
                                bicicletas e mais.</p>
                            <Button className="w-full" asChild>
                                <Link href="/find-a-ride">
                                    Encontrar Carona
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
                        <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1 lg:row-start-2">
                            <CardHeader>
                                <CardTitle>Viagens Recentes</CardTitle>
                                <CardDescription>Veja e avalie suas viagens passadas.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentTravels.map((travel) => (
                                    <div key={travel.id}
                                         className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                                        <div>
                                            <p className="font-semibold">{travel.destination}</p>
                                            <p className="text-sm text-muted-foreground">com {travel.driver} em {travel.date}</p>
                                        </div>
                                        {travel.rated ? (
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                {[...Array(travel.rating || 0)].map((_, i) => (
                                                    <Star key={i} className="h-4 w-4 fill-current"/>
                                                ))}
                                            </div>
                                        ) : (
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm"
                                                        onClick={() => handleRateClick(travel)}>Avaliar Viagem</Button>
                                            </DialogTrigger>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        {selectedTravel && (
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Avalie sua viagem para {selectedTravel.destination}</DialogTitle>
                                    <DialogDescription>
                                        Como foi sua experiência com {selectedTravel.driver} em {selectedTravel.date}?
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-center items-center gap-2 py-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setRating(star)}>
                                            <Star
                                                className={`h-8 w-8 cursor-pointer transition-colors ${star <= rating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300 hover:text-yellow-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancelar</Button>
                                    </DialogClose>
                                    <Button onClick={handleRatingSubmit}>Enviar Avaliação</Button>
                                </DialogFooter>
                            </DialogContent>
                        )}
                    </Dialog>
                </div>
            </main>
            <Footer/>
        </div>
    );
}
