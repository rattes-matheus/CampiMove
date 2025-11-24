'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Car, Bike, PersonStanding, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Driver } from "@/lib/DriverData";

const transportIcons: { [key: string]: React.ReactNode } = {
    CARPOOL: <Car className="h-5 w-5" />,
    BIKE: <Bike className="h-5 w-5" />,
    SCOOTER: <PersonStanding className="h-5 w-5" />,
};

export default function FindARidePage() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [transportType, setTransportType] = useState('all');
    const [minRating, setMinRating] = useState(0);
    const [selectedMotorist, setSelectedMotorist] = useState<Driver | null>(null);
    const [reportReason, setReportReason] = useState('');
    const [alreadyReportedMap, setAlreadyReportedMap] = useState<Record<number, boolean>>({});
    const [meId, setMeId] = useState<number | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            let token = null;
            if (typeof window !== 'undefined') token = localStorage.getItem('jwt_token');

            try {
                const res = await axios.get("http://localhost:8080/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userRole = res.data.role;
                setMeId(res.data.id);

                if (userRole === "DRIVER") {
                    router.push("/dashboard/motorist");
                    return;
                }

                const driversResponse = await axios.get("http://localhost:8080/drivers");
                setDrivers(driversResponse.data);

            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, [router]);

    useEffect(() => {
        if (!meId || drivers.length === 0) return;

        const fetchReports = async () => {
            const map: Record<number, boolean> = {};

            for (const driver of drivers) {
                try {
                    const res = await axios.get(
                        `http://localhost:8080/api/send-report/check?reporterId=${meId}&userid=${driver.id}`
                    );
                    map[driver.id] = res.data;
                } catch {
                    map[driver.id] = false;
                }
            }

            setAlreadyReportedMap(map);
        };

        fetchReports();
    }, [meId, drivers]);

    const handleReportSubmit = async (e: React.FormEvent) => {
        if (selectedMotorist && reportReason.trim()) {
            e.preventDefault();

            axios.post("http://localhost:8080/api/send-report", {
                userid: selectedMotorist.id,
                reporter_id: meId,
                report_text: reportReason,
            }).then(() => {
                setAlreadyReportedMap(prev => ({
                    ...prev,
                    [selectedMotorist.id]: true
                }));

                toast({
                    title: "Denúncia registrada",
                    description: `Sua denúncia contra ${selectedMotorist?.motorist} foi recebida com sucesso. Obrigado por ajudar a manter o app seguro.`,
                });
                setReportReason("");
                setSelectedMotorist(null);
            }).catch((err: any) => {
                toast({ title: 'Erro', description: 'Erro ao denunciar motorista', variant: 'destructive' });
                console.log("Can't report driver: ", err.message);
            });
        }
    };

    const checkIfUserAlreadyReported = async (motorist: Driver) => {
        if (!meId) return;

        setSelectedMotorist(motorist);
        setReportReason("");

        try {
            const res = await axios.get(
                `http://localhost:8080/api/send-report/check?reporterId=${meId}&userid=${motorist.id}`
            );

            setAlreadyReportedMap(prev => ({
                ...prev,
                [motorist.id]: res.data
            }));

        } catch (err) {
            console.error("Erro ao checar denúncia:", err);
        }
    };



    const filteredTransport = drivers.filter((option) => {
        const typeMatch = transportType === 'all' || option.transportType.toUpperCase() === transportType.toUpperCase();
        const ratingMatch = option.rating >= minRating;
        return typeMatch && ratingMatch;
    });

    const getTransportName = (type: string) => {
        switch (type) {
            case 'CARPOOL': return 'Carro';
            case 'BIKE': return 'Motocicleta';
            case 'SCOOTER': return 'Patinete';
            default: return 'Desconhecido';
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold">Encontrar Carona</h1>
                    <p className="text-muted-foreground">Navegue pelas opções de transporte disponíveis e encontre a
                        combinação perfeita.</p>
                </header>

                <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedMotorist(null)}>
                    <div className="grid md:grid-cols-4 gap-8">
                        <aside className="md:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Filtros</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="transport-type" className="text-sm font-medium">Tipo de
                                            Transporte</label>
                                        <Select value={transportType} onValueChange={setTransportType}>
                                            <SelectTrigger id="transport-type">
                                                <SelectValue placeholder="Todos os tipos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos</SelectItem>
                                                <SelectItem value="CARPOOL">Carro</SelectItem>
                                                <SelectItem value="BIKE">Motocicleta</SelectItem>
                                                <SelectItem value="SCOOTER">Patinete</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Avaliação Mínima: {minRating.toFixed(1)}
                                            <Star className="inline-block h-4 w-4 mb-1" /></label>
                                        <Slider
                                            min={0}
                                            max={5}
                                            step={0.5}
                                            value={[minRating]}
                                            onValueChange={(value) => setMinRating(value[0])}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>

                        <section className="md:col-span-3">
                            <div className="grid gap-6">
                                {filteredTransport.length > 0 ? (
                                    filteredTransport.map((option) => (
                                        <Card key={option.id} className="transition-shadow hover:shadow-md">
                                            <CardContent className="p-4 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-14 w-14">
                                                        <AvatarImage src={"http://localhost:8080" + option.profilePictureURL} />
                                                        <AvatarFallback>{option.motorist.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{option.motorist}</h3>
                                                        <div
                                                            className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            {transportIcons[option.transportType]}
                                                            <span>{getTransportName(option.transportType) + " " + option.model}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <Star
                                                                className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                                            <span
                                                                className="font-bold">{option.rating.toFixed(1)}</span>
                                                        </div>
                                                        <Button size="sm" asChild>
                                                            <Link href={`/chat/${option.id}`}>Reservar Agora</Link>
                                                        </Button>
                                                    </div>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={alreadyReportedMap[option.id]}   // <-- aqui!
                                                            title={
                                                                alreadyReportedMap[option.id]
                                                                    ? "Você já denunciou este motorista"
                                                                    : "Denunciar motorista"
                                                            }
                                                            onClick={() => checkIfUserAlreadyReported(option)}
                                                        >
                                                            <ShieldAlert className="h-5 w-5 text-destructive" />
                                                        </Button>
                                                    </DialogTrigger>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <p className="text-muted-foreground">Nenhuma carona corresponde aos seus
                                                critérios. Tente ajustar os filtros.</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </section>
                    </div>
                    {selectedMotorist && (
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Denunciar {selectedMotorist.motorist}</DialogTitle>
                                <DialogDescription>
                                    Por favor, descreva o motivo da sua denúncia. Sua identidade será mantida em sigilo.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Label htmlFor="report-reason">Motivo</Label>
                                <Textarea
                                    id="report-reason"
                                    placeholder="Ex: Direção perigosa, comportamento inadequado..."
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    rows={4}
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button variant="destructive" onClick={handleReportSubmit}>Enviar Denúncia</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    )}
                </Dialog>
            </main>
            <Footer />
        </div>
    );
}