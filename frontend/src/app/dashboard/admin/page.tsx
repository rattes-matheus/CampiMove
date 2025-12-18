'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'


import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays } from "lucide-react";
import { Trash2, UserX, PlusCircle, ShieldX, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import axios from "axios";

type UserReport = {
    id: number;
    userid: number;
    driverName: string;
    report_text: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    active: boolean;
};

interface AppBusSchedule {
    id: number;
    route: string;  
    schedule: string; 
}

interface BackendScheduleResponse {
    id: number;
    origem: string;
    horario: string;
}

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const [schedules, setSchedules] = useState<AppBusSchedule[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [reports, setReports] = useState<UserReport[]>([]);
    const [notification, setNotification] = useState('');
    const [newRoute, setNewRoute] = useState('');
    const [newTime, setNewTime] = useState('');
    const [modified, setModified] = useState(0);
    const router = useRouter();
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeMessage, setNoticeMessage] = useState('');
    const [noticePriority, setNoticePriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');

    useEffect(() => {
        const fetchData = async () => {
            let token = null;
            if (typeof window !== 'undefined') token = localStorage.getItem('jwt_token');

            const res = await axios.get("http://localhost:8080/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userRole = res.data.role;

            if (userRole === "STUDENT" || userRole === "TEACHER") return router.push("/dashboard");
            if (userRole === "DRIVER") return router.push("/dashboard/motorist");

        };

        axios.get("http://localhost:8080/api/admin/reports")
            .then((res) => setReports(res.data))
            .catch((err) => console.log("Erro ao buscar reports:", err.message));

        axios.get("http://localhost:8080/api/admin/show-users")
            .then((res) => setUsers(res.data))
            .catch((err) => console.log("Erro ao buscar usuários:", err.message));

        fetchData();
    }, [modified, router]);

    const fetchSchedules = () => {
        fetch("http://localhost:8080/horarios-onibus")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("Dados recebidos do backend:", data);

                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : [];

                const formatted: AppBusSchedule[] = list.map((r: BackendScheduleResponse) => ({
                    id: r.id,
                    route: r.origem,
                    schedule: r.horario
                }));

                setSchedules(formatted);
            })
            .catch(err => {
                console.error("Erro ao carregar horários:", err);
                toast({
                    title: "Erro",
                    description: "Não foi possível carregar os horários do servidor.",
                    variant: "destructive"
                });
            });
    };

    useEffect(() => {
        fetchSchedules();
    }, []); 

    const handleAddSchedule = async () => {
        if (newRoute && newTime) {
            try {
                console.log("Enviando dados:", { origem: newRoute, horario: newTime });

                
                const response = await fetch("http://localhost:8080/horarios-onibus", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ origem: newRoute, horario: newTime }),
                });

                console.log("Status da resposta:", response.status);

                if (response.ok) {
                    const contentType = response.headers.get("content-type");

                    if (contentType && contentType.includes("application/json")) {
                        const saved: BackendScheduleResponse = await response.json();
                        if (saved && saved.id && saved.origem && saved.horario) {
                            setSchedules([...schedules, {
                                id: saved.id,
                                route: saved.origem,
                                schedule: saved.horario
                            }]);
                            toast({
                                title: "Sucesso",
                                description: "Novo horário salvo no banco."
                            });
                        } else {
                            fetchSchedules();
                            toast({
                                title: "Sucesso",
                                description: "Novo horário salvo no banco."
                            });
                        }
                    } else {
                        fetchSchedules();
                        toast({
                            title: "Sucesso",
                            description: "Novo horário salvo no banco."
                        });
                    }

                    setNewRoute("");
                    setNewTime("");
                } else {
                    const errorText = await response.text();
                    console.error("Erro do backend:", errorText);
                    toast({
                        title: "Erro",
                        description: errorText || "Falha ao salvar no banco.",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.error("Erro de conexão:", error);
                toast({
                    title: "Erro",
                    description: "Falha ao conectar ao servidor.",
                    variant: "destructive"
                });
            }
        } else {
            toast({
                title: "Erro",
                description: "Preencha a rota e o horário.",
                variant: "destructive"
            });
        }
    };

    const handleSendNotice = () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return router.push("/login");

        if (!noticeTitle.trim() || !noticeMessage.trim()) {
            return toast({
                title: "Erro",
                description: "Título e mensagem são obrigatórios.",
                variant: "destructive"
            });
        }

        axios.post(
            "http://localhost:8080/api/notices/send",
            {
                title: noticeTitle,
                message: noticeMessage,
                priority: noticePriority
            },
            {
                headers: {
                    Authorization: `Bearer ${ token }`
        }
}
    ).then(() => {
    toast({ title: "Sucesso", description: "Aviso enviado com sucesso." });
    setNoticeTitle('');
    setNoticeMessage('');
    setNoticePriority('MEDIUM');
}).catch(() => {
        toast({
            title: "Erro",
            description: "Falha ao enviar aviso.",
            variant: "destructive"
        });
    });
  };

const handleRemoveSchedule = async (id: number) => {
    try {
        
        const response = await fetch(`http://localhost:8080/horarios-onibus/${id}`, {

            method: "DELETE",
            headers: {
                "Accept": "application/json"
            },
        });

        if (response.ok) {
            setSchedules(schedules.filter(s => s.id !== id));
            toast({ title: "Sucesso", description: "Horário removido do banco." });
        } else {
            const errorText = await response.text();
            toast({
                title: "Erro",
                description: errorText || "Falha ao excluir no banco.",
                variant: "destructive"
            });
        }
    } catch (error) {
        console.error(error);
        toast({
            title: "Erro",
            description: "Falha ao conectar ao servidor.",
            variant: "destructive"
        });
    }
};

const handleDismissReport = (id: number) => {
    setReports(reports.filter(r => r.id !== id));
    toast({ title: 'Sucesso', description: 'Denúncia dispensada.' });
};

const handleSendNotification = () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return router.push("/login");

    if (notification.trim()) {
        toast({ title: 'Sucesso', description: 'Notificação enviada.' });
        setNotification('');
    } else {
        toast({ title: 'Erro', description: 'A notificação não pode estar vazia.', variant: 'destructive' });
    }
};

const handleBanUserFromReport = (reportId: number, userId: number) => {
    axios.post(`http://localhost:8080/api/admin/reports/actions/${userId}/${reportId}/disable-from-report`)
        .then(() => {
            toast({ title: "Sucesso", description: "Usuário banido." });
            setModified(modified + 1);
        }).catch(() => {
            toast({ title: 'Erro', description: 'Erro ao banir usuário.', variant: 'destructive' });
        });
};

const handleBanUser = (userId: number) => {
    axios.post(`http://localhost:8080/api/admin/reports/actions/${userId}/disable-user`)
        .then(() => {
            toast({ title: "Sucesso", description: "Usuário banido." });
            setModified(prev => prev + 1);
        }).catch(() => {
            toast({ title: 'Erro', description: 'Erro ao banir usuário.', variant: 'destructive' });
        });
};

const handleUnbanUser = (userId: number) => {
    axios.post(`http://localhost:8080/api/admin/reports/actions/${userId}/enable-user`)
        .then(() => {
            toast({ title: "Sucesso", description: "Usuário reativado." });
            setModified(prev => prev + 1);
        }).catch(() => {
            toast({ title: 'Erro', description: 'Erro ao reativar usuário.', variant: 'destructive' });
        });
};

return (
    <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
            <h1 className="text-3xl font-bold mb-8">Painel do Administrador</h1>

            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">

                {/* 1. HORÁRIOS (PRIORITÁRIO) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Gerenciar Horários do Intercampus</CardTitle>
                        <CardDescription>Adicione ou remova horários.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button><PlusCircle className="mr-2" /> Adicionar Horário</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Adicionar Novo Horário</DialogTitle>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            {/* O label "Rota" ainda faz sentido para o usuário (ex: C1, C2) */}
                                            <Label htmlFor="route" className="text-right">Rota</Label>
                                            <Input id="route" value={newRoute} onChange={(e) => setNewRoute(e.target.value)} className="col-span-3" />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="time" className="text-right">Horário</Label>
                                            <Input id="time" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="col-span-3" />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" onClick={handleAddSchedule}>Salvar</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rota</TableHead>
                                    <TableHead>Horário</TableHead>
                                    <TableHead className="text-right">Ação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schedules.map(schedule => (
                                    <TableRow key={schedule.id}>
                                        {/* 🔹 ATUALIZADO: 'schedule.route' e 'schedule.schedule' agora
                                            correspondem à interface AppBusSchedule */}
                                        <TableCell>{schedule.route}</TableCell>
                                        <TableCell>{schedule.schedule}</TableCell>
                                        <TableCell className="text-right">
                                            {/* 🔹 REMOVIDO: Botão de Editar foi removido
                                                pois não há endpoint no novo controller */}
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveSchedule(schedule.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </CardContent>
                </Card>

                {/* 2. NOVO CARD: Gerenciar REPORTS (Qualquer Motivo) */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileText className="mr-3 h-6 w-6 text-primary" />
                            Gerenciar Reports
                        </CardTitle>
                        <CardDescription>
                            Central de Reports de usuários (atrasos, problemas gerais, etc.).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                Acesse o workflow completo.
                            </p>
                            <Button onClick={() => router.push('/dashboard/admin/reports')}>
                                Ver Reports <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                {/* FIM NOVO CARD */}

                {/* NOTIFICAÇÕES */}
                <Card>
                    <CardHeader>
                        <CardTitle>Enviar Notificação</CardTitle>
                        <CardDescription>Mensagem global para todos os usuários.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Digite sua mensagem..."
                            value={notification}
                            onChange={(e) => setNotification(e.target.value)}
                            rows={5}
                        />
                        <Button className="w-full" onClick={handleSendNotification}>Enviar</Button>
                    </CardContent>
                </Card>

                {/* DENÚNCIAS */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Denúncias</CardTitle>
                        <CardDescription>Gerencie denúncias contra motoristas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-80 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Motorista</TableHead>
                                        <TableHead>Motivo</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.map(report => (
                                        <TableRow key={report.id}>
                                            <TableCell>{report.driverName}</TableCell>
                                            <TableCell>{report.report_text}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleDismissReport(report.id)}>
                                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Dispensar
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleBanUserFromReport(report.id, report.userid)}>
                                                    <UserX className="mr-2 h-4 w-4" /> Banir
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-3">
                        <CalendarDays className="text-orange-500" />

                        <div>
                            <CardTitle>
                                Enviar Aviso
                            </CardTitle>
                            <CardDescription>
                                Avisos institucionais para os usuários
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Título do aviso"
                            value={noticeTitle}
                            onChange={(e) => setNoticeTitle(e.target.value)}
                        />

                        <Textarea
                            placeholder="Mensagem do aviso"
                            value={noticeMessage}
                            onChange={(e) => setNoticeMessage(e.target.value)}
                            rows={4}
                        />

                        <div className="space-y-2">
                            <Label>Prioridade</Label>
                            <Select
                                value={noticePriority}
                                onValueChange={(value) =>
                                    setNoticePriority(value as 'LOW' | 'MEDIUM' | 'HIGH')
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="LOW">Baixa</SelectItem>
                                    <SelectItem value="MEDIUM">Média</SelectItem>
                                    <SelectItem value="HIGH">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full" onClick={handleSendNotice}>
                            Enviar Aviso
                        </Button>
                    </CardContent>
                </Card>

                {/* USUÁRIOS */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Gerenciar Usuários</CardTitle>
                        <CardDescription>Banir ou reativar usuários</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-80 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="text-right">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>

                                            <TableCell className="text-right">

                                                {user.role === "ADMIN" ? (
                                                    <Button variant="secondary" size="sm" disabled>
                                                        <ShieldX className="mr-2 h-4 w-4" /> Admin
                                                    </Button>
                                                ) : user.active ? (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleBanUser(user.id)}
                                                    >
                                                        <UserX className="mr-2 h-4 w-4" /> Banir
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => handleUnbanUser(user.id)}
                                                    >
                                                        Reativar
                                                    </Button>
                                                )}

                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </main>
        <Footer />
    </div>
);
}